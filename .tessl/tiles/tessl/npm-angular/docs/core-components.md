# Core Components and Framework

Core framework functionality including components, dependency injection, change detection, lifecycle hooks, and signals-based reactivity from `@angular/core`.

## Capabilities

### Component System

Angular's component-based architecture with decorators and lifecycle hooks.

```typescript { .api }
/**
 * Marks a class as an Angular component and provides metadata
 * @param options - Component configuration options
 */
function Component(options: ComponentOptions): ClassDecorator;

interface ComponentOptions {
  selector?: string;
  template?: string;
  templateUrl?: string;
  styleUrls?: string[];
  styles?: string[];
  providers?: Provider[];
  viewProviders?: Provider[];
  changeDetection?: ChangeDetectionStrategy;
  encapsulation?: ViewEncapsulation;
  host?: {[key: string]: string};
  inputs?: string[];
  outputs?: string[];
  queries?: {[key: string]: any};
  exportAs?: string;
  standalone?: boolean;
  imports?: (Type<any> | ReadonlyArray<any>)[];
}
```

**Usage Examples:**

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="user-card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
      <button (click)="onEdit()">Edit</button>
    </div>
  `,
  styles: [`
    .user-card {
      border: 1px solid #ccc;
      padding: 16px;
      margin: 8px;
    }
  `]
})
export class UserCardComponent {
  @Input() user!: { name: string; email: string };
  @Output() edit = new EventEmitter<void>();

  onEdit() {
    this.edit.emit();
  }
}
```

### Dependency Injection

Angular's dependency injection system for managing service dependencies.

```typescript { .api }
/**
 * Marks a class as available to be provided and injected as a dependency
 * @param options - Injectable configuration options
 */
function Injectable(options?: InjectableOptions): ClassDecorator;

interface InjectableOptions {
  providedIn?: Type<any> | 'root' | 'platform' | 'any' | null;
}

/**
 * Retrieves an instance of a service or token from the dependency injection system
 * @param token - The service token or class to inject
 * @param flags - Optional injection flags
 */
function inject<T>(token: Type<T> | InjectionToken<T>, flags?: InjectFlags): T;

/**
 * Retrieves an instance of a service or token from the dependency injection system
 * @param token - The service token or class to inject
 * @param defaultValue - Default value to return if token is not found
 * @param flags - Optional injection flags
 */
function inject<T>(token: Type<T> | InjectionToken<T>, defaultValue?: T, flags?: InjectFlags): T;

enum InjectFlags {
  Default = 0,
  Host = 1,
  Self = 2,
  SkipSelf = 4,
  Optional = 8
}
```

**Usage Examples:**

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<User[]>('/api/users');
  }
}

// Using in component
@Component({...})
export class UserListComponent {
  private userService = inject(UserService);
  
  users$ = this.userService.getUsers();
}
```

### Signals and Reactivity

Angular's signals-based reactivity system for fine-grained reactive updates.

```typescript { .api }
/**
 * Creates a writable signal with an initial value
 * @param initialValue - The initial value for the signal
 */
function signal<T>(initialValue: T): WritableSignal<T>;

/**
 * Creates a read-only signal that derives its value from other signals
 * @param computation - Function that computes the derived value
 */
function computed<T>(computation: () => T): Signal<T>;

/**
 * Creates an effect that runs when signals it reads change
 * @param effectFn - Function to run when dependencies change
 */
function effect(effectFn: () => void): EffectRef;

interface Signal<T> {
  (): T;
}

interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
  update(updateFn: (value: T) => T): void;
  asReadonly(): Signal<T>;
}

interface EffectRef {
  destroy(): void;
}
```

**Usage Examples:**

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()">+</button>
      <button (click)="decrement()">-</button>
    </div>
  `
})
export class CounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  constructor() {
    // Effect runs when count changes
    effect(() => {
      console.log('Count changed to:', this.count());
    });
  }

  increment() {
    this.count.update(n => n + 1);
  }

  decrement() {
    this.count.set(this.count() - 1);
  }
}
```

### Lifecycle Hooks

Component and directive lifecycle hook interfaces.

```typescript { .api }
/**
 * Called once after the first ngOnChanges
 */
interface OnInit {
  ngOnInit(): void;
}

/**
 * Called when any data-bound property of a directive changes
 */
interface OnChanges {
  ngOnChanges(changes: SimpleChanges): void;
}

/**
 * Called during every change detection run
 */
interface DoCheck {
  ngDoCheck(): void;
}

/**
 * Called once after the component is destroyed
 */
interface OnDestroy {
  ngOnDestroy(): void;
}

/**
 * Called after Angular projects external content into the component's view
 */
interface AfterContentInit {
  ngAfterContentInit(): void;
}

/**
 * Called after the component's view has been initialized
 */
interface AfterViewInit {
  ngAfterViewInit(): void;
}

interface SimpleChanges {
  [propName: string]: SimpleChange;
}

interface SimpleChange {
  previousValue: any;
  currentValue: any;
  firstChange: boolean;
}
```

### Directives

Angular directive system for extending HTML elements with custom behavior.

```typescript { .api }
/**
 * Marks a class as an Angular directive
 * @param options - Directive configuration options
 */
function Directive(options?: DirectiveOptions): ClassDecorator;

interface DirectiveOptions {
  selector?: string;
  inputs?: string[];
  outputs?: string[];
  providers?: Provider[];
  exportAs?: string;
  queries?: {[key: string]: any};
  host?: {[key: string]: string};
  standalone?: boolean;
}
```

### Pipes

Angular pipe system for transforming data in templates.

```typescript { .api }
/**
 * Marks a class as a pipe and supplies configuration metadata
 * @param options - Pipe configuration options
 */
function Pipe(options: PipeOptions): ClassDecorator;

interface PipeOptions {
  name: string;
  pure?: boolean;
  standalone?: boolean;
}

interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
```

### NgModule System

Angular's module system for organizing application code.

```typescript { .api }
/**
 * Marks a class as an NgModule and supplies configuration metadata
 * @param options - Module configuration options
 */
function NgModule(options?: NgModuleOptions): ClassDecorator;

interface NgModuleOptions {
  declarations?: Array<Type<any> | any[]>;
  imports?: Array<Type<any> | ModuleWithProviders<{}> | any[]>;
  providers?: Provider[];
  bootstrap?: Array<Type<any> | any[]>;
  exports?: Array<Type<any> | any[]>;
  entryComponents?: Array<Type<any> | any[]>;
  schemas?: Array<SchemaMetadata | any[]>;
  id?: string;
}

interface ModuleWithProviders<T> {
  ngModule: Type<T>;
  providers?: Provider[];
}

// Schema metadata for NgModule schemas
interface SchemaMetadata {
  name: string;
}

const CUSTOM_ELEMENTS_SCHEMA: SchemaMetadata;
const NO_ERRORS_SCHEMA: SchemaMetadata;
```

### Application Bootstrap

Functions for bootstrapping Angular applications.

```typescript { .api }
/**
 * Bootstraps an Angular application using standalone components
 * @param component - The root component class
 * @param options - Bootstrap configuration options
 */
function bootstrapApplication(
  component: Type<any>, 
  options?: ApplicationConfig
): Promise<ApplicationRef>;

interface ApplicationConfig {
  providers?: Provider[];
}

/**
 * Creates a platform factory for a custom platform
 * @param parentPlatformFactory - Parent platform factory
 * @param name - Platform name
 * @param providers - Platform providers
 */
function createPlatformFactory(
  parentPlatformFactory: PlatformFactory | null,
  name: string,
  providers?: StaticProvider[]
): PlatformFactory;
```

### Change Detection

Angular's change detection system and related utilities.

```typescript { .api }
/**
 * Base class for Angular's change detection tree
 */
abstract class ChangeDetectorRef {
  abstract markForCheck(): void;
  abstract detach(): void;
  abstract detectChanges(): void;
  abstract checkNoChanges(): void;
  abstract reattach(): void;
}

enum ChangeDetectionStrategy {
  OnPush = 0,
  Default = 1
}

enum ViewEncapsulation {
  Emulated = 0,
  None = 2,
  ShadowDom = 3
}
```

### Template References and Queries

System for querying and referencing elements in component templates.

```typescript { .api }
/**
 * References a template reference variable as a read-only value
 */
class ElementRef<T = any> {
  nativeElement: T;
}

/**
 * Represents a container where one or more views can be attached
 */
abstract class ViewContainerRef {
  abstract get element(): ElementRef;
  abstract get length(): number;
  abstract createComponent<C>(componentFactory: ComponentFactory<C>): ComponentRef<C>;
  abstract insert(viewRef: ViewRef, index?: number): ViewRef;
  abstract remove(index?: number): void;
  abstract clear(): void;
}

/**
 * Configures a view query
 * @param selector - The directive type or the name of a template reference variable
 * @param options - Query configuration options
 */
function ViewChild(selector: Type<any> | Function | string, options?: {
  read?: any;
  static?: boolean;
}): PropertyDecorator;

/**
 * Configures a content query
 * @param selector - The directive type or the name of a template reference variable
 * @param options - Query configuration options
 */
function ContentChild(selector: Type<any> | Function | string, options?: {
  read?: any;
  static?: boolean;
}): PropertyDecorator;
```

### Error Handling

Angular's error handling system.

```typescript { .api }
/**
 * Provides an abstract interface for error handling
 */
abstract class ErrorHandler {
  abstract handleError(error: any): void;
}

/**
 * Custom error for Angular applications
 */
class NgZoneError extends Error {
  error: any;
}
```

### Platform Browser Services

Browser-specific services for DOM manipulation, sanitization, and document interaction.

```typescript { .api }
/**
 * Service for sanitizing untrusted values to prevent XSS attacks
 */
abstract class DomSanitizer {
  abstract sanitize(context: SecurityContext, value: SafeValue | string | null): string | null;
  abstract bypassSecurityTrustHtml(value: string): SafeHtml;
  abstract bypassSecurityTrustStyle(value: string): SafeStyle;
  abstract bypassSecurityTrustScript(value: string): SafeScript;
  abstract bypassSecurityTrustUrl(value: string): SafeUrl;
  abstract bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl;
}

/**
 * Service for getting and setting the title of a current HTML document
 */
class Title {
  getTitle(): string;
  setTitle(newTitle: string): void;
}

/**
 * Service for managing HTML meta tags
 */
class Meta {
  addTag(tag: MetaDefinition, forceCreation?: boolean): HTMLMetaElement | null;
  addTags(tags: MetaDefinition[], forceCreation?: boolean): HTMLMetaElement[];
  getTag(attrSelector: string): HTMLMetaElement | null;
  getTags(attrSelector: string): HTMLMetaElement[];
  updateTag(tag: MetaDefinition, selector?: string): HTMLMetaElement | null;
  removeTag(attrSelector: string): void;
  removeTagElement(meta: HTMLMetaElement): void;
}

interface MetaDefinition {
  charset?: string;
  content?: string;
  httpEquiv?: string;
  id?: string;
  itemprop?: string;
  name?: string;
  property?: string;
  scheme?: string;
  url?: string;
  [prop: string]: string | undefined;
}

// Security context and safe value types
enum SecurityContext {
  NONE = 0,
  HTML = 1,
  STYLE = 2,
  SCRIPT = 3,
  URL = 4,
  RESOURCE_URL = 5
}

interface SafeValue {}

interface SafeHtml extends SafeValue {}
interface SafeStyle extends SafeValue {}
interface SafeScript extends SafeValue {}
interface SafeUrl extends SafeValue {}
interface SafeResourceUrl extends SafeValue {}
```

**Usage Examples:**

```typescript
import { Component, inject } from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-document-manager',
  template: `
    <div>
      <h1>Document Manager</h1>
      <button (click)="updateTitle()">Update Title</button>
      <button (click)="addMetaTag()">Add Meta Tag</button>
      <div [innerHTML]="safeHtml"></div>
    </div>
  `
})
export class DocumentManagerComponent {
  private titleService = inject(Title);
  private metaService = inject(Meta);
  private sanitizer = inject(DomSanitizer);

  safeHtml = this.sanitizer.bypassSecurityTrustHtml('<p>Safe HTML content</p>');

  updateTitle() {
    this.titleService.setTitle('New Page Title');
  }

  addMetaTag() {
    this.metaService.addTag({
      name: 'description',
      content: 'Page description for SEO'
    });
  }
}
```

## Types

```typescript { .api }
// Provider types
type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;

interface TypeProvider extends Type<any> {}

interface ValueProvider {
  provide: any;
  useValue: any;
  multi?: boolean;
}

interface ClassProvider {
  provide: any;
  useClass: Type<any>;
  multi?: boolean;
}

interface ExistingProvider {
  provide: any;
  useExisting: any;
  multi?: boolean;
}

interface FactoryProvider {
  provide: any;
  useFactory: Function;
  deps?: any[];
  multi?: boolean;
}

// Injection token
class InjectionToken<T> {
  constructor(desc: string, options?: {
    providedIn?: Type<any> | 'root' | 'platform' | 'any' | null;
    factory?: () => T;
  });
}

// Application reference
abstract class ApplicationRef {
  abstract bootstrap<C>(componentOrFactory: Type<C>): ComponentRef<C>;
  abstract tick(): void;
  abstract attachView(viewRef: ViewRef): void;
  abstract detachView(viewRef: ViewRef): void;
  abstract destroy(): void;
  abstract get isStable(): boolean;
}
```