# Angular

Angular is a comprehensive web application framework that provides a complete development platform for building scalable, maintainable web applications. It features component-based architecture with dependency injection, reactive forms, powerful routing system, HTTP client with interceptors, animations, testing utilities, and CLI tools for development workflow.

## Package Information

- **Package Name**: @angular/core (and related packages)
- **Package Type**: npm
- **Language**: TypeScript
- **Installation**: `npm install @angular/core @angular/common @angular/router @angular/forms`

## Core Imports

```typescript
import { Component, Injectable, NgModule, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
```

## Basic Usage

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      <input formControlName="email" placeholder="Email">
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `
})
export class UserComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  
  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit() {
    if (this.userForm.valid) {
      this.http.post('/api/users', this.userForm.value)
        .subscribe(response => console.log('User saved:', response));
    }
  }
}
```

## Architecture

Angular is built around several key architectural concepts:

- **Components**: Building blocks that control a patch of screen called a view
- **Services**: Reusable business logic shared across components via dependency injection
- **Modules**: Containers that group related components, directives, pipes, and services
- **Templates**: HTML enhanced with Angular markup that defines component views
- **Dependency Injection**: Design pattern for supplying dependencies to classes
- **Change Detection**: Mechanism that synchronizes the application state with the UI
- **Observables**: Reactive programming pattern for handling asynchronous data streams

## Capabilities

### Core Components and Framework

Core framework functionality including components, dependency injection, change detection, lifecycle hooks, and signals-based reactivity.

```typescript { .api }
// Component decoration and lifecycle
function Component(options: ComponentOptions): ClassDecorator;
function Injectable(options?: InjectableOptions): ClassDecorator;
function NgModule(options: NgModuleOptions): ClassDecorator;

// Dependency injection
function inject<T>(token: Type<T> | InjectionToken<T>): T;

// Signals and reactivity
function signal<T>(initialValue: T): WritableSignal<T>;
function computed<T>(computation: () => T): Signal<T>;
function effect(effectFn: () => void): EffectRef;

// Component creation and lifecycle
interface OnInit {
  ngOnInit(): void;
}
interface OnDestroy {
  ngOnDestroy(): void;
}
```

[Core Components](./core-components.md)

### Routing and Navigation

Client-side routing system for single-page applications with route guards, lazy loading, and navigation management.

```typescript { .api }
function provideRouter(routes: Routes, ...features: RouterFeature[]): Provider[];

class Router {
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;
  navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): Promise<boolean>;
}

interface Route {
  path?: string;
  component?: Type<any>;
  loadComponent?: () => Type<any> | Observable<Type<any>> | Promise<Type<any>>;
  children?: Routes;
  canActivate?: any[];
}
```

[Routing](./routing.md)

### Reactive Forms

Form handling system with validation, reactive updates, and type safety for building complex forms and user input handling.

```typescript { .api }
class FormBuilder {
  group(controls: {[key: string]: any}, options?: AbstractControlOptions): FormGroup;
  control(formState: any, validatorOrOpts?: ValidatorFn | AbstractControlOptions): FormControl;
  array(controls: AbstractControl[], validatorOrOpts?: ValidatorFn | AbstractControlOptions): FormArray;
}

class FormGroup extends AbstractControl {
  get(path: Array<string | number> | string): AbstractControl | null;
  addControl(name: string, control: AbstractControl): void;
  removeControl(name: string): void;
}

class Validators {
  static required(control: AbstractControl): ValidationErrors | null;
  static email(control: AbstractControl): ValidationErrors | null;
  static min(min: number): ValidatorFn;
  static max(max: number): ValidatorFn;
}
```

[Forms](./forms.md)

### HTTP Client

HTTP client for making API requests with interceptors, error handling, and type safety for backend communication.

```typescript { .api }
function provideHttpClient(...features: HttpFeature[]): Provider[];

class HttpClient {
  get<T>(url: string, options?: HttpOptions): Observable<T>;
  post<T>(url: string, body: any, options?: HttpOptions): Observable<T>;
  put<T>(url: string, body: any, options?: HttpOptions): Observable<T>;
  delete<T>(url: string, options?: HttpOptions): Observable<T>;
}

interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
```

[HTTP Client](./http-client.md)

### Common Utilities and Pipes

Shared utilities, directives, pipes, and common functionality used across Angular applications.

```typescript { .api }
// Common directives
class NgIf {
  ngIf: any;
  ngIfThen?: TemplateRef<NgIfContext<T>>;
  ngIfElse?: TemplateRef<NgIfContext<T>>;
}

class NgFor {
  ngForOf: NgIterable<T>;
  ngForTemplate: TemplateRef<NgForOfContext<T>>;
  ngForTrackBy?: TrackByFunction<T>;
}

// Common pipes
class DatePipe implements PipeTransform {
  transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null;
}

class AsyncPipe implements PipeTransform {
  transform<T>(obj: Observable<T> | Promise<T>): T | null;
}
```

[Common Utilities](./common-utilities.md)

### Animations

Animation framework for creating smooth transitions, complex animations, and interactive effects.

```typescript { .api }
function trigger(name: string, definitions: AnimationMetadata[]): AnimationTriggerMetadata;
function state(name: string, styles: AnimationStyleMetadata): AnimationStateMetadata;
function transition(stateChangeExpr: string, steps: AnimationMetadata[]): AnimationTransitionMetadata;
function animate(timings: string | number, styles?: AnimationStyleMetadata): AnimationAnimateMetadata;

class AnimationBuilder {
  build(animation: AnimationMetadata | AnimationMetadata[]): AnimationFactory;
}
```

[Animations](./animations.md)

### Testing Utilities

Comprehensive testing utilities for unit testing, integration testing, and end-to-end testing of Angular applications.

```typescript { .api }
class TestBed {
  static configureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic;
  static createComponent<T>(component: Type<T>): ComponentFixture<T>;
  static inject<T>(token: Type<T> | InjectionToken<T>): T;
}

interface ComponentFixture<T> {
  componentInstance: T;
  debugElement: DebugElement;
  detectChanges(): void;
  whenStable(): Promise<any>;
}

function fakeAsync(fn: Function): (...args: any[]) => any;
function tick(millis?: number): void;
```

[Testing](./testing.md)

## Types

```typescript { .api }
// Core interfaces
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
}

interface InjectableOptions {
  providedIn?: Type<any> | 'root' | 'platform' | 'any' | null;
}

interface NgModuleOptions {
  declarations?: Array<Type<any> | any[]>;
  imports?: Array<Type<any> | ModuleWithProviders<{}> | any[]>;
  providers?: Provider[];
  bootstrap?: Array<Type<any> | any[]>;
  exports?: Array<Type<any> | any[]>;
}

// Signal types
interface Signal<T> {
  (): T;
}

interface WritableSignal<T> extends Signal<T> {
  set(value: T): void;
  update(updateFn: (value: T) => T): void;
}

// Type aliases for common patterns
type Provider = TypeProvider | ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;
type Routes = Route[];
type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;
type TrackByFunction<T> = (index: number, item: T) => any;

// Enums
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