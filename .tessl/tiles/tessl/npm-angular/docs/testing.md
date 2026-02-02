# Testing Utilities

Comprehensive testing utilities for unit testing, integration testing, and end-to-end testing of Angular applications from various `@angular/*/testing` packages.

## Capabilities

### TestBed - Core Testing Utility

Main testing utility for configuring and creating test modules and components.

```typescript { .api }
/**
 * Configures and initializes environment for unit testing
 */
class TestBed {
  /**
   * Initialize the environment for testing with a compiler factory, platform factory, and default testing module
   * @param initTestEnvironment - Environment initialization function
   */
  static initTestEnvironment(
    ngModule: Type<any> | Type<any>[],
    platform: PlatformRef,
    options?: TestEnvironmentOptions
  ): TestBed;

  /**
   * Reset the providers for the test injector
   */
  static resetTestEnvironment(): void;

  /**
   * Allows overriding default providers defined in test_injector.js
   * @param tokens - Providers to override
   */
  static resetTestingModule(): TestBedStatic;

  /**
   * Configures the testing module with providers, declarations, imports, etc.
   * @param moduleDef - Module configuration
   */
  static configureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic;

  /**
   * Compile components with a templateUrl for the test's NgModule
   */
  static compileComponents(): Promise<any>;

  /**
   * Create a component fixture for the given component type
   * @param component - Component class
   */
  static createComponent<T>(component: Type<T>): ComponentFixture<T>;

  /**
   * Allows overriding default providers of a component
   * @param component - Component to override
   * @param providers - New providers
   */
  static overrideComponent<T>(component: Type<T>, override: MetadataOverride<Component>): TestBedStatic;

  /**
   * Allows overriding default providers of a directive
   * @param directive - Directive to override  
   * @param providers - New providers
   */
  static overrideDirective<T>(directive: Type<T>, override: MetadataOverride<Directive>): TestBedStatic;

  /**
   * Allows overriding default providers of a pipe
   * @param pipe - Pipe to override
   * @param providers - New providers
   */
  static overridePipe<T>(pipe: Type<T>, override: MetadataOverride<Pipe>): TestBedStatic;

  /**
   * Overrides the template of a component
   * @param component - Component to override
   * @param template - New template
   */
  static overrideTemplate<T>(component: Type<T>, template: string): TestBedStatic;

  /**
   * Overrides the providers for the given token  
   * @param token - Token to override
   * @param provider - New provider
   */
  static overrideProvider(token: any, provider: {useFactory?: Function; useValue?: any; deps?: any[]}): TestBedStatic;

  /**
   * Gets an instance of a service from the test injector
   * @param token - Service token or class
   * @param notFoundValue - Value to return if not found
   * @param flags - Optional injection flags
   */
  static inject<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T;
  static inject<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue: null, flags?: InjectFlags): T | null;

  /**
   * Executes function and flushes pending async tasks
   * @param fn - Function to execute
   */
  static runInInjectionContext<T>(fn: () => T): T;

  /**
   * Get a service from the test injector
   * @param token - Service token
   * @param notFoundValue - Default value if not found
   */
  get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): any;

  /**
   * Execute function in the test injector context  
   * @param fn - Function to execute
   */
  execute(tokens: any[], fn: Function, context?: any): any;

  /**
   * The test module's injector
   */
  readonly injector: Injector;
}

interface TestBedStatic {
  new (...args: any[]): TestBed;
  prototype: TestBed;
}

interface TestModuleMetadata {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
  teardown?: ModuleTeardownOptions;
}

interface MetadataOverride<T> {
  set?: Partial<T>;
  add?: Partial<T>;  
  remove?: Partial<T>;
}

interface TestEnvironmentOptions {
  teardown?: ModuleTeardownOptions;
}

interface ModuleTeardownOptions {
  destroyAfterEach: boolean;
  rethrowErrors?: boolean;
}
```

**Usage Examples:**

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, Injectable } from '@angular/core';

@Injectable()
class MockUserService {
  getUser() {
    return { id: 1, name: 'Test User' };
  }
}

@Component({
  selector: 'app-user',
  template: '<div>{{ user?.name }}</div>'
})
class UserComponent {
  user = this.userService.getUser();
  
  constructor(private userService: MockUserService) {}
}

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: MockUserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [MockUserService]
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(MockUserService);
  });

  it('should display user name', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test User');
  });

  it('should inject service', () => {
    expect(userService).toBeTruthy();
    expect(userService.getUser().name).toBe('Test User');
  });
});
```

### Component Fixture

Wrapper around a component and its DOM element for testing.

```typescript { .api }
/**
 * Wrapper around a component and its DOM element
 */
class ComponentFixture<T> {
  /**
   * The component instance
   */
  componentInstance: T;

  /**
   * The DebugElement associated with the root element of this component
   */
  debugElement: DebugElement;

  /**
   * The native DOM element at the root of the component
   */
  nativeElement: any;

  /**
   * The ElementRef for the element at the root of the component
   */
  elementRef: ElementRef;

  /**
   * The ChangeDetectorRef for the component
   */
  changeDetectorRef: ChangeDetectorRef;

  /**
   * Trigger a change detection cycle for the component
   */
  detectChanges(checkNoChanges?: boolean): void;

  /**
   * Do a change detection run to make sure there were no changes
   */
  checkNoChanges(): void;

  /**
   * Set whether or not the fixture should automatically detect changes
   * @param autoDetect - Whether to auto-detect changes
   */
  autoDetectChanges(autoDetect?: boolean): void;

  /**
   * Return whether the fixture is currently stable or has async tasks that have not been completed yet
   */
  isStable(): boolean;

  /**
   * Get a promise that resolves when the fixture is stable
   */
  whenStable(): Promise<any>;

  /**
   * Get a promise that resolves when some conditions are met
   * @param predicate - Condition to wait for
   * @param timeout - Timeout in milliseconds
   */
  whenRenderingDone(): Promise<any>;

  /**
   * Destroy the component
   */
  destroy(): void;
}
```

### Debug Element

Wrapper around native DOM elements for testing.

```typescript { .api }
/**
 * Debug element wrapper around native DOM elements for testing
 */
abstract class DebugElement {
  /**
   * The underlying DOM element
   */
  nativeElement: any;

  /**
   * The component instance if this element is a component
   */
  componentInstance: any;

  /**
   * Element context including injector
   */
  context: any;

  /**
   * Child debug elements
   */
  children: DebugElement[];

  /**
   * The parent debug element
   */
  parent: DebugElement | null;

  /**
   * Element name
   */
  name: string;

  /**
   * The injector for this element
   */
  injector: Injector;

  /**
   * Map of providers available at this element
   */
  providerTokens: any[];

  /**
   * Native DOM attributes
   */
  attributes: {[key: string]: string | null};

  /**
   * CSS classes applied to the element
   */
  classes: {[key: string]: boolean};

  /**
   * Inline styles applied to the element
   */
  styles: {[key: string]: string | null};

  /**
   * Map of properties applied to the element
   */
  properties: {[key: string]: any};

  /**
   * Event listeners registered on the element
   */
  listeners: EventListener[];

  /**
   * References to template local variables
   */
  references: {[key: string]: any};

  /**
   * Find the first descendant matching the predicate
   * @param predicate - Predicate function or By selector
   */
  query(predicate: Predicate<DebugElement>): DebugElement | null;

  /**
   * Find all descendants matching the predicate
   * @param predicate - Predicate function or By selector
   */
  queryAll(predicate: Predicate<DebugElement>): DebugElement[];

  /**
   * Find all descendant native elements matching the predicate
   * @param predicate - Predicate function or By selector
   */
  queryAllNodes(predicate: Predicate<DebugNode>): DebugNode[];

  /**
   * Trigger an event on this element
   * @param eventName - Event name
   * @param eventObj - Event object
   */
  triggerEventHandler(eventName: string, eventObj?: any): void;
}

/**
 * Base class for debug nodes
 */
abstract class DebugNode {
  nativeNode: any;
  parent: DebugElement | null;
  injector: Injector;
  componentInstance: any;
  context: any;
  listeners: EventListener[];
  references: {[key: string]: any};
  providerTokens: any[];
}

type Predicate<T> = (value: T) => boolean;

interface EventListener {
  name: string;
  callback: Function;
}
```

### By Selectors

Static helper methods for creating predicates to find elements.

```typescript { .api }
/**
 * Predicates for selecting DebugElements
 */
class By {
  /**
   * Match elements by CSS selector
   * @param selector - CSS selector
   */
  static css(selector: string): Predicate<DebugElement>;

  /**
   * Match elements by directive type  
   * @param type - Directive class
   */
  static directive(type: Type<any>): Predicate<DebugElement>;

  /**
   * Match all elements
   */
  static all(): Predicate<DebugElement>;
}
```

**Usage Examples:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('Component with DebugElement', () => {
  let fixture: ComponentFixture<MyComponent>;
  let component: MyComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
  });

  it('should find elements by CSS selector', () => {
    const buttonEl = fixture.debugElement.query(By.css('button'));
    expect(buttonEl).toBeTruthy();
    
    const allDivs = fixture.debugElement.queryAll(By.css('div'));
    expect(allDivs.length).toBe(2);
  });

  it('should find elements by directive', () => {
    const directiveEl = fixture.debugElement.query(By.directive(MyDirective));
    expect(directiveEl).toBeTruthy();
  });

  it('should trigger events', () => {
    spyOn(component, 'onClick');
    const button = fixture.debugElement.query(By.css('button'));
    
    button.triggerEventHandler('click', null);
    
    expect(component.onClick).toHaveBeenCalled();
  });
});
```

### Async Testing Utilities

Utilities for testing asynchronous operations.

```typescript { .api }
/**
 * Wraps a function in an asynchronous test zone
 * @param fn - Function to wrap in async zone
 */
function fakeAsync<T>(fn: (...args: any[]) => T): (...args: any[]) => T;

/**
 * Simulates the asynchronous passage of time for timers in the fakeAsync zone
 * @param millis - Milliseconds to advance
 */
function tick(millis?: number): void;

/**
 * Flush any pending microtasks
 */
function flushMicrotasks(): void;

/**
 * Discard all remaining periodic tasks
 */
function discardPeriodicTasks(): void;

/**
 * Flush any pending timers and microtasks
 * @param maxTurns - Maximum number of turns to flush
 */
function flush(maxTurns?: number): number;

/**
 * Get the number of pending periodic tasks
 */
function getPeriodicTasksCount(): number;

/**
 * Get the number of pending non-periodic tasks
 */
function getPendingTasksCount(): number;

/**
 * Wraps a function to be executed in the Angular zone
 * @param fn - Function to wrap
 */
function waitForAsync(fn: Function): (done: any) => any;
```

**Usage Examples:**

```typescript
import { fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';

describe('Async Testing', () => {
  it('should test setTimeout with fakeAsync', fakeAsync(() => {
    let called = false;
    setTimeout(() => { called = true; }, 1000);
    
    expect(called).toBeFalsy();
    tick(1000);
    expect(called).toBeTruthy();
  }));

  it('should test promises', fakeAsync(() => {
    let resolved = false;
    Promise.resolve().then(() => resolved = true);
    
    expect(resolved).toBeFalsy();
    tick();
    expect(resolved).toBeTruthy();
  }));

  it('should test intervals', fakeAsync(() => {
    let counter = 0;
    const intervalId = setInterval(() => counter++, 100);
    
    tick(500);
    expect(counter).toBe(5);
    
    clearInterval(intervalId);
    discardPeriodicTasks();
  }));
});
```

### HTTP Testing

Testing utilities for HTTP client operations.

```typescript { .api }
/**
 * Controller for testing HTTP requests
 */
abstract class HttpTestingController {
  /**
   * Search for requests that match the given parameter, without any expectations about the number of matches
   * @param match - Request matcher
   */
  abstract match(match: string | RequestMatch | ((req: HttpRequest<any>) => boolean)): TestRequest[];

  /**
   * Expect that a single request has been made which matches the given URL, and return its mock
   * @param url - Expected URL
   * @param method - Expected HTTP method
   */
  abstract expectOne(url: string, description?: string): TestRequest;
  abstract expectOne(params: RequestMatch, description?: string): TestRequest;
  abstract expectOne(matchFn: ((req: HttpRequest<any>) => boolean), description?: string): TestRequest;

  /**
   * Expect that no requests have been made which match the given URL
   * @param url - URL that should not have been requested
   * @param method - HTTP method that should not have been used
   */
  abstract expectNone(url: string, description?: string): void;
  abstract expectNone(params: RequestMatch, description?: string): void;
  abstract expectNone(matchFn: ((req: HttpRequest<any>) => boolean), description?: string): void;

  /**
   * Verify that no unmatched requests are outstanding
   */
  abstract verify(opts?: {ignoreCancelled?: boolean}): void;
}

/**
 * Mock HTTP request for testing
 */
abstract class TestRequest {
  /**
   * The request that was captured
   */
  abstract readonly request: HttpRequest<any>;

  /**
   * Whether the request was cancelled after it was sent
   */
  abstract readonly cancelled: boolean;

  /**
   * Resolve the request by returning a body plus additional HTTP information (such as response headers)
   */
  abstract flush(body: ArrayBuffer | Blob | boolean | string | number | Object | (boolean | string | number | Object)[] | null, opts?: {
    headers?: HttpHeaders | {[name: string]: string | string[]};
    status?: number;
    statusText?: string;
  }): void;

  /**
   * Resolve the request with an error
   */
  abstract error(error: ErrorEvent, opts?: {
    headers?: HttpHeaders | {[name: string]: string | string[]};  
    status?: number;
    statusText?: string;
  }): void;

  /**
   * Deliver an arbitrary HttpEvent (such as a progress event) on the response stream
   */
  abstract event(event: HttpEvent<any>): void;
}

interface RequestMatch {
  method?: string;
  url?: string;
}

/**
 * HTTP testing module
 */
class HttpClientTestingModule {}
```

**Usage Examples:**

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('HTTP Testing', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should test HTTP GET', () => {
    const testData = { id: 1, name: 'Test' };

    httpClient.get<any>('/api/test').subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('/api/test');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });

  it('should test HTTP POST', () => {
    const postData = { name: 'New Item' };
    const responseData = { id: 2, name: 'New Item' };

    httpClient.post<any>('/api/items', postData).subscribe(data => {
      expect(data).toEqual(responseData);
    });

    const req = httpTestingController.expectOne('/api/items');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(postData);
    req.flush(responseData);
  });

  it('should test HTTP error', () => {
    httpClient.get<any>('/api/error').subscribe(
      () => fail('should have failed with 404 error'),
      (error) => {
        expect(error.status).toEqual(404);
      }
    );

    const req = httpTestingController.expectOne('/api/error');
    req.flush('404 error', { status: 404, statusText: 'Not Found' });
  });
});
```

### Router Testing

Testing utilities for router functionality.

```typescript { .api }
/**
 * Testing module for router functionality
 */
class RouterTestingModule {
  /**
   * Configure RouterTestingModule with routes
   * @param routes - Array of route configurations
   * @param config - Optional extra configuration
   */
  static withRoutes(routes: Routes, config?: ExtraOptions): ModuleWithProviders<RouterTestingModule>;
}

/**
 * Router for testing that doesn't interact with the browser
 */
class SpyLocation implements Location {
  urlChanges: string[];
  
  path(includeHash?: boolean): string;
  isCurrentPathEqualTo(path: string, query?: string): boolean;
  simulateUrlPop(pathname: string): void;
  simulateHashChange(pathname: string): void;
  prepareExternalUrl(url: string): string;
  go(path: string, query?: string, state?: any): void;
  replaceState(path: string, query?: string, state?: any): void;
  forward(): void;
  back(): void;
  historyGo(relativePosition?: number): void;
  onUrlChange(fn: (url: string, state: unknown) => void): VoidFunction;
  onPopState(fn: LocationChangeListener): VoidFunction;
  getBaseHref(): string;
}
```

### Advanced Testing Patterns

Modern testing utilities and patterns for latest Angular features including signals, standalone components, and new DI patterns.

```typescript { .api }
/**
 * Modern inject function for use in test contexts
 * @param token - Service token or class to inject
 * @param options - Optional injection options
 */
function inject<T>(token: Type<T> | InjectionToken<T>, options?: InjectOptions): T;

interface InjectOptions {
  optional?: boolean;
  host?: boolean;
  skipSelf?: boolean;
  self?: boolean;
}

/**
 * Utility for testing components with signals
 */
function createSignalBasedComponent<T>(component: Type<T>, options?: {
  detectChanges?: boolean;
  inputs?: Partial<T>;
}): ComponentFixture<T>;

/**
 * Test runner utility for running functions in injection context
 * @param fn - Function to run with injection context
 * @param injector - Optional injector to use
 */
function runInInjectionContext<T>(fn: () => T, injector?: Injector): T;
```

**Usage Examples:**

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, signal, computed, inject } from '@angular/core';
import { runInInjectionContext } from '@angular/core/testing';

// Testing signals in components
@Component({
  selector: 'app-signal-counter',
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ doubleCount() }}</p>
      <button (click)="increment()" data-testid="increment">+</button>
    </div>
  `,
  standalone: true
})
class SignalCounterComponent {
  count = signal(0);
  doubleCount = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}

describe('SignalCounterComponent', () => {
  let component: SignalCounterComponent;
  let fixture: ComponentFixture<SignalCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignalCounterComponent] // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(SignalCounterComponent);
    component = fixture.componentInstance;
  });

  it('should update signals correctly', () => {
    // Initial state
    expect(component.count()).toBe(0);
    expect(component.doubleCount()).toBe(0);

    // Update signal
    component.increment();
    fixture.detectChanges();

    expect(component.count()).toBe(1);
    expect(component.doubleCount()).toBe(2);
  });

  it('should reflect signal changes in template', () => {
    component.increment();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Count: 1');
    expect(compiled.textContent).toContain('Double: 2');
  });
});

// Testing services with modern inject() function
@Injectable({
  providedIn: 'root'
})
class ModernUserService {
  private http = inject(HttpClient);
  
  getUsers() {
    return this.http.get<User[]>('/api/users');
  }
}

describe('ModernUserService', () => {
  let service: ModernUserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    // Using modern inject function in tests
    service = TestBed.inject(ModernUserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should fetch users using inject()', () => {
    const mockUsers = [{ id: 1, name: 'Test User' }];

    service.getUsers().subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    req.flush(mockUsers);
  });
});

// Testing with runInInjectionContext
describe('Injection Context Testing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'TEST_VALUE', useValue: 'test-data' }
      ]
    });
  });

  it('should run function in injection context', () => {
    const result = TestBed.runInInjectionContext(() => {
      const testValue = inject('TEST_VALUE');
      return `Result: ${testValue}`;
    });

    expect(result).toBe('Result: test-data');
  });
});

// Testing standalone components with dependencies
@Component({
  selector: 'app-standalone-with-deps',
  template: '<div>{{ data }}</div>',
  standalone: true
})
class StandaloneComponentWithDeps {
  private service = inject(ModernUserService);
  data = 'Loaded';
}

describe('Standalone Component with Dependencies', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandaloneComponentWithDeps, HttpClientTestingModule]
    }).compileComponents();
  });

  it('should create standalone component with injected dependencies', () => {
    const fixture = TestBed.createComponent(StandaloneComponentWithDeps);
    const component = fixture.componentInstance;
    
    expect(component).toBeTruthy();
    expect(component.data).toBe('Loaded');
  });
});
```

## Types

```typescript { .api }
// Test bed interfaces
interface TestBedStatic {
  new (...args: any[]): TestBed;
  prototype: TestBed;
  
  initTestEnvironment(ngModule: Type<any> | Type<any>[], platform: PlatformRef, options?: TestEnvironmentOptions): TestBed;
  resetTestEnvironment(): void;
  resetTestingModule(): TestBedStatic;
  configureTestingModule(moduleDef: TestModuleMetadata): TestBedStatic;
  compileComponents(): Promise<any>;
  createComponent<T>(component: Type<T>): ComponentFixture<T>;
  overrideComponent<T>(component: Type<T>, override: MetadataOverride<Component>): TestBedStatic;
  overrideDirective<T>(directive: Type<T>, override: MetadataOverride<Directive>): TestBedStatic;
  overridePipe<T>(pipe: Type<T>, override: MetadataOverride<Pipe>): TestBedStatic;
  overrideTemplate<T>(component: Type<T>, template: string): TestBedStatic;
  overrideProvider(token: any, provider: {useFactory?: Function; useValue?: any; deps?: any[]}): TestBedStatic;
  inject<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T;
  runInInjectionContext<T>(fn: () => T): T;
}

// Testing module metadata
interface TestModuleMetadata {
  providers?: any[];
  declarations?: any[];
  imports?: any[];
  schemas?: Array<SchemaMetadata | any[]>;
  teardown?: ModuleTeardownOptions;
}

// Metadata override
interface MetadataOverride<T> {
  set?: Partial<T>;
  add?: Partial<T>;
  remove?: Partial<T>;
}

// Test environment options
interface TestEnvironmentOptions {
  teardown?: ModuleTeardownOptions;
}

// Module teardown options
interface ModuleTeardownOptions {
  destroyAfterEach: boolean;
  rethrowErrors?: boolean;
}

// HTTP testing types
interface RequestMatch {
  method?: string;
  url?: string;
}

// Debug element predicate
type Predicate<T> = (value: T) => boolean;

// Event listener interface
interface EventListener {
  name: string;
  callback: Function;
}

// Component fixture auto detect
const ComponentFixtureAutoDetect: InjectionToken<boolean>;
const ComponentFixtureNoNgZone: InjectionToken<boolean>;

// Testing tokens
const TEARDOWN_TESTING_MODULE_ON_DESTROY_DEFAULT: boolean;
```