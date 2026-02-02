# Common Utilities and Pipes

Shared utilities, directives, pipes, and common functionality used across Angular applications from `@angular/common`.

## Capabilities

### Common Directives

Built-in structural and attribute directives for template manipulation.

```typescript { .api }
/**
 * Conditionally includes a template based on the value of an expression
 */
class NgIf<T = unknown> {
  /**
   * The Boolean expression to evaluate as the condition for showing a template
   */
  ngIf: T;

  /**
   * Template to render when condition is truthy
   */
  ngIfThen?: TemplateRef<NgIfContext<T>> | null;

  /**
   * Template to render when condition is falsy
   */
  ngIfElse?: TemplateRef<NgIfContext<T>> | null;

  /**
   * Assert the correct type of the expression bound to the NgIf input within the template
   */
  static ngTemplateGuard_ngIf: 'binding';

  /**
   * Context for NgIf template
   */
  static ngTemplateContextGuard<T>(dir: NgIf<T>, ctx: any): ctx is NgIfContext<Exclude<T, false | 0 | '' | null | undefined>>;
}

interface NgIfContext<T = unknown> {
  $implicit: T;
  ngIf: T;
}

/**
 * Repeats a template for each item in a collection
 */
class NgFor<T, U extends NgIterable<T> = NgIterable<T>> {
  /**
   * The value of the iterable expression, which can be used as a template input variable
   */
  ngForOf: U & NgIterable<T> | undefined | null;

  /**
   * A reference to the template that is stamped out for each item in the iterable
   */
  ngForTemplate: TemplateRef<NgForOfContext<T, U>>;

  /**
   * Function for tracking items in the iterable
   */
  ngForTrackBy?: TrackByFunction<T>;

  /**
   * Assert the correct type of the expression bound to the NgFor input within the template
   */
  static ngTemplateGuard_ngForOf<T, U extends NgIterable<T>>(dir: NgFor<T, U>, ctx: any): ctx is NgFor<T, U>;

  /**
   * Context for NgFor template
   */
  static ngTemplateContextGuard<T, U extends NgIterable<T>>(dir: NgFor<T, U>, ctx: any): ctx is NgForOfContext<T, U>;
}

interface NgForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  $implicit: T;
  ngForOf: U;
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}

type NgIterable<T> = Array<T> | Iterable<T>;
type TrackByFunction<T> = (index: number, item: T) => any;

/**
 * Conditionally switches between different templates based on a matching expression
 */
class NgSwitch {
  /**
   * The switch expression whose value is compared to the values of the individual cases
   */
  ngSwitch: any;
}

/**
 * Provides a switch case that displays its content when its value matches the switch value
 */
class NgSwitchCase {
  /**
   * Stores the HTML template to be selected on match
   */
  ngSwitchCase: any;
}

/**
 * Provides a switch default case that displays its content when no matching cases are found
 */
class NgSwitchDefault {}

/**
 * Updates the CSS class attribute of an element
 */
class NgClass {
  /**
   * CSS classes to add or remove
   */
  ngClass: string | string[] | Set<string> | {[klass: string]: any} | null | undefined;
}

/**
 * Updates the style attribute of an element
 */
class NgStyle {
  /**
   * CSS styles to add or remove
   */
  ngStyle: {[klass: string]: any} | null | undefined;
}

/**
 * Adds and removes a set of CSS classes based on the evaluation of an expression
 */
class NgPlural {
  /**
   * Numeric expression whose value determines which plural case to display
   */
  ngPlural: number;
}

/**
 * Defines a template for a specific plural case
 */
class NgPluralCase {
  /**
   * The plural case value
   */
  ngPluralCase: string;
}
```

**Usage Examples:**

```typescript
// In templates:
// NgIf usage
// <div *ngIf="user; else noUser">Welcome {{ user.name }}!</div>
// <ng-template #noUser>Please log in</ng-template>

// NgFor usage
// <div *ngFor="let item of items; let i = index; trackBy: trackByFn">
//   {{ i }}: {{ item.name }}
// </div>

// NgSwitch usage
// <div [ngSwitch]="hero.emotion">
//   <div *ngSwitchCase="'happy'">😊</div>
//   <div *ngSwitchCase="'sad'">😢</div>
//   <div *ngSwitchDefault>😐</div>
// </div>

@Component({
  template: `
    <div [ngClass]="{ 'active': isActive, 'disabled': !isEnabled }">
      Dynamic classes
    </div>
    <div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">
      Dynamic styles
    </div>
  `
})
export class ExampleComponent {
  isActive = true;
  isEnabled = false;
  textColor = 'blue';
  fontSize = 16;
  
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
```

### Common Pipes

Built-in pipes for data transformation in templates.

```typescript { .api }
/**
 * Transforms an Observable or Promise to the latest value it has emitted
 */
class AsyncPipe implements PipeTransform, OnDestroy {
  /**
   * Transform an Observable or Promise to its latest emitted value
   * @param obj - Observable or Promise to transform
   */
  transform<T>(obj: Observable<T> | Subscribable<T> | Promise<T>): T | null;
  transform<T>(obj: null | undefined): null;
  transform<T>(obj: Observable<T> | Subscribable<T> | Promise<T> | null | undefined): T | null;
}

/**
 * Transforms text to uppercase
 */
class UpperCasePipe implements PipeTransform {
  /**
   * Transform string to uppercase
   * @param value - String to transform
   */
  transform(value: string): string;
  transform(value: null | undefined): null;
  transform(value: string | null | undefined): string | null;
}

/**
 * Transforms text to lowercase
 */
class LowerCasePipe implements PipeTransform {
  /**
   * Transform string to lowercase
   * @param value - String to transform
   */
  transform(value: string): string;
  transform(value: null | undefined): null;
  transform(value: string | null | undefined): string | null;
}

/**
 * Transforms text to title case
 */
class TitleCasePipe implements PipeTransform {
  /**
   * Transform string to title case
   * @param value - String to transform
   */
  transform(value: string): string;
  transform(value: null | undefined): null;
  transform(value: string | null | undefined): string | null;
}

/**
 * Formats a date value according to locale rules
 */
class DatePipe implements PipeTransform {
  /**
   * Transform a date to a formatted string
   * @param value - Date to format
   * @param format - Date format pattern
   * @param timezone - Timezone offset or name
   * @param locale - Locale code
   */
  transform(value: Date | string | number, format?: string, timezone?: string, locale?: string): string | null;
  transform(value: null | undefined, format?: string, timezone?: string, locale?: string): null;
  transform(value: Date | string | number | null | undefined, format?: string, timezone?: string, locale?: string): string | null;
}

/**
 * Transforms a number to a currency string
 */
class CurrencyPipe implements PipeTransform {
  /**
   * Transform a number to currency format
   * @param value - Number to format
   * @param currencyCode - Currency code (e.g., 'USD')
   * @param display - Display format ('code', 'symbol', 'symbol-narrow')
   * @param digitsInfo - Decimal representation options
   * @param locale - Locale code
   */
  transform(value: number, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null;
  transform(value: null | undefined, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): null;
  transform(value: number | null | undefined, currencyCode?: string, display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean, digitsInfo?: string, locale?: string): string | null;
}

/**
 * Transforms a number to a decimal string
 */
class DecimalPipe implements PipeTransform {
  /**
   * Transform a number to decimal format
   * @param value - Number to format
   * @param digitsInfo - Decimal representation options
   * @param locale - Locale code
   */
  transform(value: number, digitsInfo?: string, locale?: string): string | null;
  transform(value: null | undefined, digitsInfo?: string, locale?: string): null;
  transform(value: number | null | undefined, digitsInfo?: string, locale?: string): string | null;
}

/**
 * Transforms a number to a percentage string
 */
class PercentPipe implements PipeTransform {
  /**
   * Transform a number to percentage format
   * @param value - Number to format (0.5 becomes 50%)
   * @param digitsInfo - Decimal representation options
   * @param locale - Locale code
   */
  transform(value: number, digitsInfo?: string, locale?: string): string | null;
  transform(value: null | undefined, digitsInfo?: string, locale?: string): null;
  transform(value: number | null | undefined, digitsInfo?: string, locale?: string): string | null;
}

/**
 * Converts a value to a JSON string
 */
class JsonPipe implements PipeTransform {
  /**
   * Transform any value to JSON string
   * @param value - Value to convert to JSON
   */
  transform(value: any): string;
}

/**
 * Creates a new Array or String containing a subset of the elements
 */
class SlicePipe implements PipeTransform {
  /**
   * Slice an array or string
   * @param value - Array or string to slice
   * @param start - Start index
   * @param end - End index
   */
  transform<T>(value: ReadonlyArray<T>, start: number, end?: number): Array<T>;
  transform(value: null | undefined, start: number, end?: number): null;
  transform(value: string, start: number, end?: number): string;
  transform<T>(value: ReadonlyArray<T> | string | null | undefined, start: number, end?: number): Array<T> | string | null;
}

/**
 * Transforms an object into an array of key-value pairs
 */
class KeyValuePipe implements PipeTransform {
  /**
   * Transform an object to key-value pairs
   * @param input - Object or Map to transform
   * @param compareFn - Optional comparison function for sorting
   */
  transform<K, V>(input: null | undefined, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): null;
  transform<V>(input: {[key: string]: V} | Map<string, V>, compareFn?: (a: KeyValue<string, V>, b: KeyValue<string, V>) => number): Array<KeyValue<string, V>>;
  transform<V>(input: {[key: number]: V} | Map<number, V>, compareFn?: (a: KeyValue<number, V>, b: KeyValue<number, V>) => number): Array<KeyValue<number, V>>;
  transform<K, V>(input: Map<K, V>, compareFn?: (a: KeyValue<K, V>, b: KeyValue<K, V>) => number): Array<KeyValue<K, V>>;
}

interface KeyValue<K, V> {
  key: K;
  value: V;
}

/**
 * Generic interface for all pipes
 */
interface PipeTransform {
  transform(value: any, ...args: any[]): any;
}
```

**Usage Examples:**

```typescript
// In templates:
// {{ user$ | async }}
// {{ 'hello world' | titlecase }}
// {{ today | date:'medium' }}
// {{ price | currency:'USD':'symbol':'1.2-2' }}
// {{ 0.85 | percent }}
// {{ data | json }}
// {{ items | slice:1:5 }}
// {{ obj | keyvalue }}

@Component({
  template: `
    <div>{{ user$ | async | json }}</div>
    <div>{{ 'hello world' | uppercase }}</div>
    <div>{{ today | date:'short':'UTC':locale }}</div>
    <div>{{ price | currency:currencyCode }}</div>
    <div>{{ ratio | percent:'1.0-2' }}</div>
    <div *ngFor="let item of data | keyvalue">
      {{ item.key }}: {{ item.value }}
    </div>
  `
})
export class PipeExampleComponent {
  user$ = new BehaviorSubject({ name: 'John', email: 'john@example.com' });
  today = new Date();
  price = 42.50;
  ratio = 0.75;
  currencyCode = 'USD';
  locale = 'en-US';
  data = { a: 1, b: 2, c: 3 };
}
```

### Location Services

Services for working with browser location and URL.

```typescript { .api }
/**
 * Service for interacting with the browser's URL
 */
abstract class Location {
  /**
   * Normalizes the URL path for the current platform
   * @param path - URL path to normalize
   */
  static normalizeQueryParams(params: string): string;

  /**
   * Joins two parts of a URL with a slash if needed
   * @param start - Start of URL
   * @param end - End of URL
   */
  static joinWithSlash(start: string, end: string): string;

  /**
   * Removes a trailing slash from a URL string if present
   * @param url - URL to strip slash from
   */
  static stripTrailingSlash(url: string): string;

  /**
   * Returns the current path including hash fragment
   * @param includeHash - Whether to include hash fragment
   */
  abstract path(includeHash?: boolean): string;

  /**
   * Returns the current state object
   */
  abstract getState(): unknown;

  /**
   * Checks if the current path is equal to given path
   * @param path - Path to compare
   * @param query - Query string to compare
   */
  abstract isCurrentPathEqualTo(path: string, query?: string): boolean;

  /**
   * Changes the browser's URL to a normalized version of the given URL
   * @param url - URL to navigate to
   * @param state - State object to associate with the new URL
   */
  abstract go(url: string, state?: any): void;

  /**
   * Changes the browser's URL to a normalized version of the given URL and replaces the current entry
   * @param url - URL to replace current URL with
   * @param state - State object to associate with the new URL
   */
  abstract replaceState(url: string, state?: any): void;

  /**
   * Navigate forward in history
   */
  abstract forward(): void;

  /**
   * Navigate backward in history
   */
  abstract back(): void;

  /**
   * Navigate to a specific point in history
   * @param relativePosition - Relative position in history
   */
  abstract historyGo(relativePosition?: number): void;

  /**
   * Subscribe to URL changes
   * @param fn - Callback function for URL changes
   * @param err - Error callback
   */
  abstract onUrlChange(fn: (url: string, state: unknown) => void, err?: (err: any) => void): VoidFunction;

  /**
   * Subscribe to popstate events
   * @param fn - Callback function for popstate events
   */
  abstract onPopState(fn: LocationChangeListener): VoidFunction;

  /**
   * Get the base href for the application
   */
  abstract getBaseHref(): string;

  /**
   * Prepare external URL for navigation
   * @param url - External URL
   */
  abstract prepareExternalUrl(url: string): string;
}

/**
 * Location strategy that uses the HTML5 history API
 */
abstract class LocationStrategy {
  abstract path(includeHash?: boolean): string;
  abstract prepareExternalUrl(internal: string): string;
  abstract pushState(state: any, title: string, path: string, queryParams: string): void;
  abstract replaceState(state: any, title: string, path: string, queryParams: string): void;
  abstract forward(): void;
  abstract back(): void;
  abstract historyGo(relativePosition?: number): void;
  abstract onPopState(fn: LocationChangeListener): void;
  abstract getBaseHref(): string;
}

type LocationChangeListener = (event: LocationChangeEvent) => void;

interface LocationChangeEvent {
  type: string;
  state: any;
}

/**
 * Location strategy that uses the URL fragment (hash)
 */
class HashLocationStrategy extends LocationStrategy {}

/**
 * Location strategy that uses the HTML5 history API
 */
class PathLocationStrategy extends LocationStrategy {}
```

### Platform Detection

Utilities for detecting the current platform and environment.

```typescript { .api }
/**
 * Returns whether a platform id represents a browser platform
 * @param platformId - Platform identifier
 */
function isPlatformBrowser(platformId: Object): boolean;

/**
 * Returns whether a platform id represents a server platform
 * @param platformId - Platform identifier
 */
function isPlatformServer(platformId: Object): boolean;

/**
 * Returns whether a platform id represents a web worker platform
 * @param platformId - Platform identifier
 */
function isPlatformWorkerApp(platformId: Object): boolean;

/**
 * Returns whether a platform id represents a web worker UI platform
 * @param platformId - Platform identifier
 */
function isPlatformWorkerUi(platformId: Object): boolean;

// Platform tokens
const PLATFORM_BROWSER_ID: string;
const PLATFORM_SERVER_ID: string;
const PLATFORM_WORKER_APP_ID: string;
const PLATFORM_WORKER_UI_ID: string;
```

### Document and DOM

Services for working with the DOM document.

```typescript { .api }
/**
 * Token for injecting the document object
 */
const DOCUMENT: InjectionToken<Document>;

/**
 * Function to get the DOM document
 */
function getDOM(): DomAdapter;

/**
 * Sets the DOM adapter implementation
 * @param adapter - DOM adapter instance
 */
function setDOM(adapter: DomAdapter): void;

/**
 * Abstract DOM adapter interface
 */
abstract class DomAdapter {
  abstract getProperty(el: Element, name: string): any;
  abstract log(error: string): void;
  abstract logGroup(error: string): void;
  abstract logGroupEnd(): void;
}
```

### Locale and Internationalization

Functions for locale registration and formatting.

```typescript { .api }
/**
 * Registers locale data to be used by the Angular i18n system
 * @param data - Locale data
 * @param localeId - Locale identifier (optional if included in data)
 * @param extraData - Extra locale data (optional)
 */
function registerLocaleData(data: any, localeId?: string, extraData?: any): void;

/**
 * Formats a date according to locale rules
 * @param value - Date to format
 * @param locale - Locale code
 * @param format - Date format pattern
 * @param timezone - Timezone
 */
function formatDate(value: string | number | Date, format: string, locale: string, timezone?: string): string;

/**
 * Formats a number as currency according to locale rules
 * @param value - Number to format
 * @param locale - Locale code
 * @param currency - Currency code
 * @param currencyCode - Currency display format
 * @param digitsInfo - Decimal representation options
 */
function formatCurrency(value: number, locale: string, currency: string, currencyCode?: string, digitsInfo?: string): string;

/**
 * Formats a number as a percentage according to locale rules
 * @param value - Number to format
 * @param locale - Locale code
 * @param digitsInfo - Decimal representation options
 */
function formatPercent(value: number, locale: string, digitsInfo?: string): string;

/**
 * Formats a number according to locale rules
 * @param value - Number to format
 * @param locale - Locale code
 * @param digitsInfo - Decimal representation options
 */
function formatNumber(value: number, locale: string, digitsInfo?: string): string;

/**
 * Gets the locale currency code
 * @param locale - Locale code
 */
function getLocaleCurrencyCode(locale: string): string | null;

/**
 * Gets the locale currency name
 * @param locale - Locale code
 */
function getLocaleCurrencyName(locale: string): string | null;

/**
 * Gets the locale currency symbol
 * @param locale - Locale code
 */
function getLocaleCurrencySymbol(locale: string): string | null;

/**
 * Gets the locale date format
 * @param locale - Locale code
 * @param width - Format width
 */
function getLocaleDateFormat(locale: string, width: FormatWidth): string;

/**
 * Gets the locale time format
 * @param locale - Locale code
 * @param width - Format width
 */
function getLocaleTimeFormat(locale: string, width: FormatWidth): string;

/**
 * Gets the locale date-time format
 * @param locale - Locale code
 * @param width - Format width
 */
function getLocaleDateTimeFormat(locale: string, width: FormatWidth): string;

enum FormatWidth {
  Short = 0,
  Medium = 1,
  Long = 2,
  Full = 3
}
```

### Common Module

Angular module that exports common directives and pipes.

```typescript { .api }
/**
 * Exports all the basic Angular directives and pipes
 */
class CommonModule {}
```

## Types

```typescript { .api }
// Template context types
interface NgIfContext<T = unknown> {
  $implicit: T;
  ngIf: T;
}

interface NgForOfContext<T, U extends NgIterable<T> = NgIterable<T>> {
  $implicit: T;
  ngForOf: U;
  index: number;
  count: number;
  first: boolean;
  last: boolean;
  even: boolean;
  odd: boolean;
}

// Utility types
type NgIterable<T> = Array<T> | Iterable<T>;
type TrackByFunction<T> = (index: number, item: T) => any;

// Key-Value pipe types
interface KeyValue<K, V> {
  key: K;
  value: V;
}

// Location types
type LocationChangeListener = (event: LocationChangeEvent) => void;

interface LocationChangeEvent {
  type: string;
  state: any;
}

// Platform identifiers
const PLATFORM_BROWSER_ID: string;
const PLATFORM_SERVER_ID: string;
const PLATFORM_WORKER_APP_ID: string;
const PLATFORM_WORKER_UI_ID: string;

// Locale format enums
enum FormatWidth {
  Short = 0,
  Medium = 1,
  Long = 2,
  Full = 3
}

// WeekDay and TranslationWidth enums for i18n
enum WeekDay {
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6
}

enum TranslationWidth {
  Narrow = 0,
  Abbreviated = 1,
  Wide = 2,
  Short = 3
}
```