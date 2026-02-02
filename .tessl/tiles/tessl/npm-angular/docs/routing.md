# Routing and Navigation

Client-side routing system for single-page applications with route guards, lazy loading, and navigation management from `@angular/router`.

## Capabilities

### Router Configuration

Core routing configuration and provider functions.

```typescript { .api }
/**
 * Sets up providers necessary to enable Router functionality
 * @param routes - Array of route configurations
 * @param features - Optional router features
 */
function provideRouter(routes: Routes, ...features: RouterFeature[]): Provider[];

/**
 * Array of route configurations
 */
type Routes = Route[];

/**
 * Configuration for a single route
 */
interface Route {
  path?: string;
  pathMatch?: 'full' | 'prefix';
  matcher?: UrlMatcher;
  component?: Type<any>;
  loadComponent?: () => Type<any> | Observable<Type<any>> | Promise<Type<any>>;
  loadChildren?: () => Routes | Type<any> | Observable<Type<any> | Routes> | Promise<Type<any> | Routes>;
  redirectTo?: string;
  outlet?: string;
  canActivate?: any[];
  canActivateChild?: any[];
  canDeactivate?: any[];
  canLoad?: any[];
  canMatch?: any[];
  data?: Data;
  resolve?: ResolveData;
  children?: Routes;
  title?: string | ResolveFn<string>;
  providers?: Provider[];
}

type Data = {[key: string]: any};
type ResolveData = {[key: string]: ResolveFn<any>};
type ResolveFn<T> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => Observable<T> | Promise<T> | T;
```

**Usage Examples:**

```typescript
import { provideRouter, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { 
    path: 'users', 
    loadComponent: () => import('./users/users.component').then(c => c.UsersComponent),
    children: [
      { path: ':id', component: UserDetailComponent }
    ]
  },
  { 
    path: 'admin', 
    loadChildren: () => import('./admin/admin.routes').then(r => r.adminRoutes),
    canActivate: [AuthGuard]
  }
];

// In main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes)
  ]
});
```

### Router Service

Main router service for programmatic navigation.

```typescript { .api }
/**
 * Service for managing navigation between routes
 */
class Router {
  /**
   * Navigate based on the provided array of commands and a starting point
   * @param commands - Array of URL segments
   * @param extras - Navigation options
   */
  navigate(commands: any[], extras?: NavigationExtras): Promise<boolean>;

  /**
   * Navigate based on the provided URL
   * @param url - Target URL or UrlTree
   * @param extras - Navigation options
   */
  navigateByUrl(url: string | UrlTree, extras?: NavigationBehaviorOptions): Promise<boolean>;

  /**
   * Parse a URL and return a UrlTree
   * @param url - URL to parse
   */
  parseUrl(url: string): UrlTree;

  /**
   * Serialize a UrlTree into a URL string
   * @param tree - UrlTree to serialize
   */
  serializeUrl(tree: UrlTree): string;

  /**
   * Create a UrlTree from route commands
   * @param commands - Array of URL segments
   * @param navigationExtras - Navigation options
   */
  createUrlTree(commands: any[], navigationExtras?: UrlCreationOptions): UrlTree;

  /**
   * Current router state
   */
  readonly routerState: RouterState;

  /**
   * Current URL as a string
   */
  readonly url: string;

  /**
   * Observable of router events
   */
  readonly events: Observable<Event>;
}

interface NavigationExtras extends UrlCreationOptions, NavigationBehaviorOptions {}

interface UrlCreationOptions {
  relativeTo?: ActivatedRoute | null;
  queryParams?: Params | null;
  fragment?: string | null;
  queryParamsHandling?: QueryParamsHandling | null;
  preserveFragment?: boolean;
}

interface NavigationBehaviorOptions {
  skipLocationChange?: boolean;
  replaceUrl?: boolean;
  state?: {[k: string]: any};
}

type QueryParamsHandling = 'merge' | 'preserve' | '';
type Params = {[key: string]: any};
```

**Usage Examples:**

```typescript
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({...})
export class NavigationComponent {
  private router = inject(Router);

  goToUser(userId: number) {
    this.router.navigate(['/users', userId]);
  }

  goToUserWithQuery(userId: number) {
    this.router.navigate(['/users', userId], {
      queryParams: { tab: 'profile' },
      fragment: 'personal-info'
    });
  }

  goToUsersList() {
    this.router.navigateByUrl('/users');
  }
}
```

### Activated Route

Service providing information about the active route.

```typescript { .api }
/**
 * Contains information about a route associated with a component
 */
class ActivatedRoute {
  /**
   * Current route parameters as an Observable
   */
  readonly params: Observable<Params>;

  /**
   * Current route parameters as a snapshot
   */
  readonly snapshot: ActivatedRouteSnapshot;

  /**
   * Current query parameters as an Observable
   */
  readonly queryParams: Observable<Params>;

  /**
   * Current fragment as an Observable
   */
  readonly fragment: Observable<string | null>;

  /**
   * Static data for this route
   */
  readonly data: Observable<Data>;

  /**
   * The URL segments matched by this route
   */
  readonly url: Observable<UrlSegment[]>;

  /**
   * The component bound to this route
   */
  readonly component: Type<any> | string | null;

  /**
   * The router outlet name of the route
   */
  readonly outlet: string;

  /**
   * The configuration used to match this route
   */
  readonly routeConfig: Route | null;

  /**
   * The root of the router state
   */
  readonly root: ActivatedRoute;

  /**
   * The parent of this route in the router state tree
   */
  readonly parent: ActivatedRoute | null;

  /**
   * The first child of this route in the router state tree
   */
  readonly firstChild: ActivatedRoute | null;

  /**
   * The children of this route in the router state tree
   */
  readonly children: ActivatedRoute[];
}

/**
 * Contains information about a route at a particular moment in time
 */
class ActivatedRouteSnapshot {
  readonly url: UrlSegment[];
  readonly params: Params;
  readonly queryParams: Params;
  readonly fragment: string | null;
  readonly data: Data;
  readonly outlet: string;
  readonly component: Type<any> | string | null;
  readonly routeConfig: Route | null;
  readonly root: ActivatedRouteSnapshot;
  readonly parent: ActivatedRouteSnapshot | null;
  readonly firstChild: ActivatedRouteSnapshot | null;
  readonly children: ActivatedRouteSnapshot[];
}
```

**Usage Examples:**

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({...})
export class UserDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Get route parameter
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadUser(userId);
    });

    // Get query parameters
    this.route.queryParams.subscribe(queryParams => {
      const tab = queryParams['tab'] || 'overview';
      this.selectTab(tab);
    });

    // Get static data
    this.route.data.subscribe(data => {
      this.title = data['title'];
    });
  }
}
```

### Route Guards

Guard interfaces for controlling route access.

```typescript { .api }
/**
 * Interface for canActivate guard
 */
interface CanActivate {
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

/**
 * Interface for canActivateChild guard
 */
interface CanActivateChild {
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

/**
 * Interface for canDeactivate guard
 */
interface CanDeactivate<T> {
  canDeactivate(
    component: T,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

/**
 * Interface for canMatch guard
 */
interface CanMatch {
  canMatch(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

/**
 * Interface for resolve guard
 */
interface Resolve<T> {
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<T> | Promise<T> | T;
}
```

**Usage Examples:**

```typescript
import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean | UrlTree {
    if (this.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

  private isAuthenticated(): boolean {
    // Check authentication logic
    return !!localStorage.getItem('token');
  }
}
```

### Router Outlet

Directive for displaying routed components.

```typescript { .api }
/**
 * Acts as a placeholder in the template for routed components
 */
class RouterOutlet implements OnDestroy, OnInit {
  /**
   * Name of the outlet
   */
  name: string;

  /**
   * The activated route associated with the outlet
   */
  get activatedRoute(): ActivatedRoute | null;

  /**
   * The component currently displayed in the outlet
   */
  get component(): Object | null;

  /**
   * Whether the outlet is activated
   */
  get isActivated(): boolean;

  /**
   * Deactivates the outlet and clears the content
   */
  deactivate(): void;

  /**
   * Activates the outlet with a specific route and component
   */
  activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver | null): void;
}
```

### Router Events

Observable events emitted during navigation.

```typescript { .api }
/**
 * Base class for router events
 */
abstract class Event {
  constructor(id: number, url: string);
  id: number;
  url: string;
}

/**
 * Event fired when navigation starts
 */
class NavigationStart extends Event {
  navigationTrigger?: 'imperative' | 'popstate' | 'hashchange';
  restoredState?: {[k: string]: any} | null;
}

/**
 * Event fired when navigation ends successfully
 */
class NavigationEnd extends Event {}

/**
 * Event fired when navigation is cancelled
 */
class NavigationCancel extends Event {
  reason: string;
}

/**
 * Event fired when navigation fails
 */
class NavigationError extends Event {
  error: any;
}

/**
 * Event fired when routes are recognized
 */
class RoutesRecognized extends Event {
  urlAfterRedirects: string;
  state: RouterStateSnapshot;
}

/**
 * Event fired when route resolution starts
 */
class ResolveStart extends Event {
  urlAfterRedirects: string;
  state: RouterStateSnapshot;
}

/**
 * Event fired when route resolution ends
 */
class ResolveEnd extends Event {
  urlAfterRedirects: string;
  state: RouterStateSnapshot;
}
```

### Router Features

Additional router features that can be enabled.

```typescript { .api }
/**
 * Enables binding information from the Router state to component inputs
 */
function withComponentInputBinding(): RouterFeature;

/**
 * Enables customizable scrolling behavior for router navigations
 */
function withEnabledBlockingInitialNavigation(): RouterFeature;

/**
 * Provides the location strategy that uses the URL fragment instead of the history API
 */
function withHashLocation(): RouterFeature;

/**
 * Enables logging of all internal navigation events to the console
 */
function withDebugTracing(): RouterFeature;

/**
 * Disables initial navigation
 */
function withDisabledInitialNavigation(): RouterFeature;

/**
 * Enables the View Transitions API for route transitions
 */
function withViewTransitions(): RouterFeature;

type RouterFeature = unknown;
```

### URL Handling

URL tree and segment utilities.

```typescript { .api }
/**
 * Represents the parsed URL
 */
class UrlTree {
  readonly root: UrlSegmentGroup;
  readonly queryParams: Params;
  readonly fragment: string | null;

  toString(): string;
}

/**
 * Represents a group of URL segments
 */
class UrlSegmentGroup {
  segments: UrlSegment[];
  children: {[key: string]: UrlSegmentGroup};
  parent: UrlSegmentGroup | null;

  toString(): string;
}

/**
 * Represents a single URL segment
 */
class UrlSegment {
  path: string;
  parameters: {[name: string]: string};

  toString(): string;
}

/**
 * A function for matching a route
 */
type UrlMatcher = (segments: UrlSegment[], group: UrlSegmentGroup, route: Route) => UrlMatchResult | null;

interface UrlMatchResult {
  consumed: UrlSegment[];
  posParams?: {[name: string]: UrlSegment};
}
```

## Types

```typescript { .api }
// Router state
class RouterState extends Tree<ActivatedRoute> {
  snapshot: RouterStateSnapshot;
  toString(): string;
}

class RouterStateSnapshot extends Tree<ActivatedRouteSnapshot> {
  url: string;
  toString(): string;
}

// Base tree class
class Tree<T> {
  constructor(root: T);
  root: T;
}

// Navigation extras type
interface NavigationExtras extends UrlCreationOptions, NavigationBehaviorOptions {}

// Event types union
type RouterEvent = NavigationStart | RoutesRecognized | RouteConfigLoadStart | RouteConfigLoadEnd | 
                   NavigationEnd | NavigationCancel | NavigationError | ResolveStart | ResolveEnd;

// Constants
const ROUTER_CONFIGURATION: InjectionToken<ExtraOptions>;
const ROUTER_INITIALIZER: InjectionToken<(router: Router) => void>;
```