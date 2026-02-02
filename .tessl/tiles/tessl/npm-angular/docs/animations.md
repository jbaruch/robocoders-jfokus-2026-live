# Animations

Animation framework for creating smooth transitions, complex animations, and interactive effects from `@angular/animations`.

## Capabilities

### Animation DSL Functions

Core animation functions for defining animations declaratively.

```typescript { .api }
/**
 * Defines an animation trigger with states and transitions
 * @param name - Animation trigger name
 * @param definitions - Array of animation metadata
 */
function trigger(name: string, definitions: AnimationMetadata[]): AnimationTriggerMetadata;

/**
 * Defines an animation state with associated styles
 * @param name - State name
 * @param styles - Styles for this state
 * @param options - State options
 */
function state(name: string, styles: AnimationStyleMetadata, options?: {params?: {[name: string]: any}}): AnimationStateMetadata;

/**
 * Defines a transition between states
 * @param stateChangeExpr - State change expression (e.g., 'open => closed')
 * @param steps - Animation steps to execute
 * @param options - Transition options
 */
function transition(
  stateChangeExpr: string | ((fromState: string, toState: string, element?: any, params?: {[key: string]: any}) => boolean),
  steps: AnimationMetadata | AnimationMetadata[],
  options?: AnimationOptions | null
): AnimationTransitionMetadata;

/**
 * Defines keyframe-based animation styles
 * @param steps - Animation steps with styles and offsets
 */
function animate(timings: string | number, styles?: AnimationStyleMetadata | AnimationKeyframesSequenceMetadata): AnimationAnimateMetadata;

/**
 * Defines animation styles to be applied
 * @param tokens - Style properties as object or wildcard
 */
function style(tokens: '*' | {[key: string]: string | number} | Array<'*' | {[key: string]: string | number}>): AnimationStyleMetadata;

/**
 * Defines a sequence of animation steps to be run in parallel
 * @param steps - Animation steps to run in parallel
 * @param options - Group options including delay and timing
 */
function group(steps: AnimationMetadata[], options?: AnimationOptions | null): AnimationGroupMetadata;

/**
 * Defines a sequence of animation steps to be run one after another
 * @param steps - Animation steps to run in sequence
 * @param options - Sequence options
 */
function sequence(steps: AnimationMetadata[], options?: AnimationOptions | null): AnimationSequenceMetadata;

/**
 * Defines keyframes for an animation sequence
 * @param steps - Array of keyframe steps
 */
function keyframes(steps: AnimationStyleMetadata[]): AnimationKeyframesSequenceMetadata;

/**
 * Defines an animation that can be triggered by a query
 * @param selector - Element selector to animate
 * @param animation - Animation to apply to selected elements
 * @param options - Query options
 */
function query(
  selector: string,
  animation: AnimationMetadata | AnimationMetadata[],
  options?: AnimationQueryOptions | null
): AnimationQueryMetadata;

/**
 * Staggers the start times of animations for multiple elements
 * @param timings - Timing between each animation start
 * @param animation - Animation to apply to each element
 */
function stagger(
  timings: string | number,
  animation: AnimationMetadata | AnimationMetadata[]
): AnimationStaggerMetadata;

/**
 * Creates animation to be used elsewhere via animateChild
 * @param steps - Animation steps
 * @param options - Animation options
 */
function animateChild(options?: AnimationOptions | null): AnimationAnimateChildMetadata;

/**
 * Creates a reusable animation function
 * @param steps - Animation steps
 * @param options - Animation options
 */
function animation(
  steps: AnimationMetadata | AnimationMetadata[],
  options?: AnimationOptions | null
): AnimationReferenceMetadata;

/**
 * Uses a reusable animation created with animation()
 * @param animation - Animation reference
 * @param options - Use animation options
 */
function useAnimation(
  animation: AnimationReferenceMetadata,
  options?: AnimationOptions | null
): AnimationAnimateRefMetadata;

interface AnimationOptions {
  delay?: number | string;
  params?: {[name: string]: any};
}

interface AnimationQueryOptions extends AnimationOptions {
  optional?: boolean;
  limit?: number;
}
```

**Usage Examples:**

```typescript
import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-hero',
  template: `
    <div [@slideIn]="'in'" class="hero">
      <h1 [@fadeInOut]="isVisible ? 'in' : 'out'">{{ title }}</h1>
      <div class="buttons">
        <button *ngFor="let btn of buttons; let i = index" 
                [@listAnimation]="buttons.length"
                [style.animation-delay]="i * 100 + 'ms'">
          {{ btn }}
        </button>
      </div>
    </div>
  `,
  animations: [
    // Simple slide in animation
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('300ms ease-in', style({ transform: 'translateX(0%)' }))
      ])
    ]),

    // Fade in/out with states
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      state('out', style({ opacity: 0 })),
      transition('in => out', animate('200ms ease-out')),
      transition('out => in', animate('200ms ease-in'))
    ]),

    // Complex keyframe animation
    trigger('bounce', [
      transition(':enter', [
        animate('1s', keyframes([
          style({ transform: 'scale(0)', offset: 0 }),
          style({ transform: 'scale(1.3)', offset: 0.5 }),
          style({ transform: 'scale(1)', offset: 1.0 })
        ]))
      ])
    ]),

    // List animation with stagger
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-15px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class HeroComponent {
  title = 'Welcome';
  isVisible = true;
  buttons = ['Home', 'About', 'Contact'];
}
```

### Animation Builder Service

Service for programmatically creating animations.

```typescript { .api }
/**
 * Injectable service for creating animation sequences programmatically
 */
abstract class AnimationBuilder {
  /**
   * Builds an animation from metadata
   * @param animation - Animation metadata
   */
  abstract build(animation: AnimationMetadata | AnimationMetadata[]): AnimationFactory;
}

/**
 * Factory for creating animation players
 */
abstract class AnimationFactory {
  /**
   * Creates an animation player for the given element
   * @param element - Target element
   * @param options - Player options
   */
  abstract create(element: any, options?: AnimationOptions): AnimationPlayer;
}

/**
 * Controls animation playback
 */
abstract class AnimationPlayer {
  /**
   * Called when the animation is destroyed
   */
  abstract onDestroy(fn: () => void): void;

  /**
   * Called when the animation is finished
   */
  abstract onStart(fn: () => void): void;

  /**
   * Called when the animation is done
   */
  abstract onDone(fn: () => void): void;

  /**
   * Starts the animation
   */
  abstract play(): void;

  /**
   * Pauses the animation
   */
  abstract pause(): void;

  /**
   * Finishes the animation
   */
  abstract finish(): void;

  /**
   * Destroys the animation
   */
  abstract destroy(): void;

  /**
   * Resets the animation to its initial state
   */
  abstract reset(): void;

  /**
   * Sets the current position of the animation
   * @param position - Position in milliseconds
   */
  abstract setPosition(position: number): void;

  /**
   * Gets the current position of the animation
   */
  abstract getPosition(): number;

  /**
   * Parent player if this is a child player
   */
  parentPlayer: AnimationPlayer | null;

  /**
   * Total time for the animation
   */
  readonly totalTime: number;

  /**
   * Whether the animation has been destroyed
   */
  readonly destroyed: boolean;
}
```

**Usage Examples:**

```typescript
import { Component, ElementRef, inject } from '@angular/core';
import { AnimationBuilder, style, animate, AnimationPlayer } from '@angular/animations';

@Component({
  selector: 'app-programmatic-animation',
  template: `
    <div #animatedElement class="box">Animate Me!</div>
    <button (click)="slideIn()">Slide In</button>
    <button (click)="fadeOut()">Fade Out</button>
  `
})
export class ProgrammaticAnimationComponent {
  private builder = inject(AnimationBuilder);
  private el = inject(ElementRef);
  private player?: AnimationPlayer;

  slideIn() {
    const factory = this.builder.build([
      style({ transform: 'translateX(-100%)' }),
      animate('500ms ease-in', style({ transform: 'translateX(0)' }))
    ]);

    this.player = factory.create(this.el.nativeElement);
    this.player.play();
  }

  fadeOut() {
    const factory = this.builder.build([
      animate('300ms', style({ opacity: 0 }))
    ]);

    this.player = factory.create(this.el.nativeElement);
    this.player.onDone(() => {
      console.log('Animation completed!');
    });
    this.player.play();
  }
}
```

### Animation Events

Event objects emitted during animation lifecycle.

```typescript { .api }
/**
 * Event fired when an animation starts
 */
interface AnimationEvent {
  /**
   * The name of the state from which the animation is triggered  
   */
  fromState: string;

  /**
   * The name of the state in which the animation completes
   */
  toState: string;

  /**
   * The time it takes for the animation to complete, in milliseconds
   */
  totalTime: number;

  /**
   * The animation phase in which the callback was invoked
   */
  phaseName: 'start' | 'done';

  /**
   * The element that the animation is attached to
   */
  element: any;

  /**
   * The trigger name
   */
  triggerName: string;

  /**
   * Whether the animation was disabled
   */
  disabled: boolean;
}
```

**Usage Examples:**

```typescript
@Component({
  template: `
    <div [@slideToggle]="isOpen" 
         (@slideToggle.start)="onAnimationStart($event)"
         (@slideToggle.done)="onAnimationDone($event)">
      Content
    </div>
  `,
  animations: [
    trigger('slideToggle', [
      state('open', style({ height: '*' })),
      state('closed', style({ height: '0px' })),
      transition('open <=> closed', animate('300ms ease-in-out'))
    ])
  ]
})
export class AnimationEventsComponent {
  isOpen = false;

  onAnimationStart(event: AnimationEvent) {
    console.log('Animation started:', event.triggerName, event.fromState, '->', event.toState);
  }

  onAnimationDone(event: AnimationEvent) {
    console.log('Animation completed in', event.totalTime, 'ms');
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}
```

### Animation Metadata Interfaces

TypeScript interfaces for animation metadata objects.

```typescript { .api }
/**
 * Base interface for all animation metadata
 */
interface AnimationMetadata {
  type: AnimationMetadataType;
}

/**
 * Metadata for animation trigger
 */
interface AnimationTriggerMetadata extends AnimationMetadata {
  name: string;
  definitions: AnimationMetadata[];
}

/**
 * Metadata for animation state
 */
interface AnimationStateMetadata extends AnimationMetadata {
  name: string;
  styles: AnimationStyleMetadata;
  options?: {params?: {[name: string]: any}};
}

/**
 * Metadata for animation transition
 */
interface AnimationTransitionMetadata extends AnimationMetadata {
  expr: string | ((fromState: string, toState: string, element?: any, params?: {[key: string]: any}) => boolean);
  animation: AnimationMetadata | AnimationMetadata[];
  options?: AnimationOptions | null;
}

/**
 * Metadata for animation sequence
 */
interface AnimationSequenceMetadata extends AnimationMetadata {
  steps: AnimationMetadata[];
  options?: AnimationOptions | null;
}

/**
 * Metadata for animation group
 */
interface AnimationGroupMetadata extends AnimationMetadata {
  steps: AnimationMetadata[];
  options?: AnimationOptions | null;
}

/**
 * Metadata for animation animate
 */
interface AnimationAnimateMetadata extends AnimationMetadata {
  timings: string | number;
  styles?: AnimationStyleMetadata | AnimationKeyframesSequenceMetadata | null;
}

/**
 * Metadata for animation style
 */
interface AnimationStyleMetadata extends AnimationMetadata {
  styles: '*' | {[key: string]: string | number} | Array<'*' | {[key: string]: string | number}>;
  offset?: number | null;
}

/**
 * Metadata for animation keyframes
 */
interface AnimationKeyframesSequenceMetadata extends AnimationMetadata {
  steps: AnimationStyleMetadata[];
}

/**
 * Metadata for animation query
 */
interface AnimationQueryMetadata extends AnimationMetadata {
  selector: string;
  animation: AnimationMetadata | AnimationMetadata[];
  options?: AnimationQueryOptions | null;
}

/**
 * Metadata for animation stagger
 */
interface AnimationStaggerMetadata extends AnimationMetadata {
  timings: string | number;
  animation: AnimationMetadata | AnimationMetadata[];
}

/**
 * Metadata for animateChild
 */
interface AnimationAnimateChildMetadata extends AnimationMetadata {
  options?: AnimationOptions | null;
}

/**
 * Metadata for reusable animation
 */
interface AnimationReferenceMetadata extends AnimationMetadata {
  animation: AnimationMetadata | AnimationMetadata[];
  options?: AnimationOptions | null;
}

/**
 * Metadata for using reusable animation
 */
interface AnimationAnimateRefMetadata extends AnimationMetadata {
  animation: AnimationReferenceMetadata;
  options?: AnimationOptions | null;
}

enum AnimationMetadataType {
  State = 0,
  Transition = 1,
  Sequence = 2,
  Group = 3,
  Animate = 4,
  Keyframes = 5,
  Style = 6,
  Trigger = 7,
  Reference = 8,
  AnimateChild = 9,
  AnimateRef = 10,
  Query = 11,
  Stagger = 12
}
```

### Special Animation Values

Special values and wildcard states for animations.

```typescript { .api }
/**
 * Special animation state representing any state
 */
const AUTO_STYLE: '*';

/**
 * Special animation trigger for void state (element not in DOM)
 */
const VOID_STATE = 'void';

/**
 * Special animation trigger for any state
 */
const ANY_STATE = '*';

/**
 * Wildcard for matching any state transition
 */
const WILDCARD_STATE = '*';
```

### Animation Modules

Angular modules for animation functionality.

```typescript { .api }
/**
 * Exports BrowserAnimationsModule for browser-based animations using Web Animations API
 */
class BrowserAnimationsModule {
  /**
   * Configure animations module without animations (useful for testing)
   * @param config - Configuration options
   */
  static withConfig(config: BrowserAnimationsModuleConfig): ModuleWithProviders<BrowserAnimationsModule>;
}

interface BrowserAnimationsModuleConfig {
  /**
   * Whether to disable animations
   */
  disableAnimations?: boolean;
}

/**
 * Null animation module that disables animations
 */
class NoopAnimationsModule {}
```

### Animation Utils

Utility functions for working with animations.

```typescript { .api }
/**
 * Returns the element that an animation player is attached to
 * @param player - Animation player
 */
function getAnimationElement(player: AnimationPlayer): any;

/**
 * Returns all animation players for a given element  
 * @param element - Target element
 */
function getAnimationPlayers(element: any): AnimationPlayer[];

/**
 * Disables animations for the given element
 * @param element - Target element
 * @param disable - Whether to disable animations
 */
function setAnimationDisabled(element: any, disable: boolean): void;

/**
 * Validates animation style property
 * @param prop - Style property name
 * @param value - Style property value
 * @param element - Target element
 * @param errors - Array to collect errors
 */
function validateStyleProperty(prop: string, value: string | number, element?: any, errors?: string[]): boolean;
```

## Types

```typescript { .api }
// Animation player state
enum AnimationPlayState {
  Running = 'running',
  Paused = 'paused',
  Finished = 'finished'
}

// Animation fill mode
enum AnimationFillMode {
  None = 'none',
  Forward = 'forwards',
  Backward = 'backwards',
  Both = 'both'
}

// Animation timing function
type AnimationTimingFunction = 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' | string;

// Animation options
interface AnimationOptions {
  delay?: number | string;
  params?: {[name: string]: any};
}

// Animation query options
interface AnimationQueryOptions extends AnimationOptions {
  optional?: boolean;
  limit?: number;
}

// Module configuration
interface BrowserAnimationsModuleConfig {
  disableAnimations?: boolean;
}

// Special animation values
const AUTO_STYLE: '*';
const VOID_STATE: string;
const ANY_STATE: string;
const WILDCARD_STATE: string;

// Animation metadata type enum
enum AnimationMetadataType {
  State = 0,
  Transition = 1,
  Sequence = 2,
  Group = 3,
  Animate = 4,
  Keyframes = 5,
  Style = 6,
  Trigger = 7,
  Reference = 8,
  AnimateChild = 9,
  AnimateRef = 10,
  Query = 11,
  Stagger = 12
}
```