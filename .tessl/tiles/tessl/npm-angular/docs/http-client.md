# HTTP Client

HTTP client for making API requests with interceptors, error handling, and type safety for backend communication from `@angular/common/http`.

## Capabilities

### HTTP Client Service

Core HTTP client service for making HTTP requests.

```typescript { .api }
/**
 * Performs HTTP requests using the browser's native fetch API or XMLHttpRequest
 */
class HttpClient {
  /**
   * Constructs a GET request that interprets the body as a JSON object
   * @param url - Request URL
   * @param options - HTTP options
   */
  get<T>(url: string, options?: HttpGetOptions): Observable<T>;
  get(url: string, options: HttpGetOptions & {responseType: 'text'}): Observable<string>;
  get(url: string, options: HttpGetOptions & {responseType: 'blob'}): Observable<Blob>;
  get(url: string, options: HttpGetOptions & {responseType: 'arraybuffer'}): Observable<ArrayBuffer>;

  /**
   * Constructs a POST request that interprets the body as a JSON object
   * @param url - Request URL
   * @param body - Request body
   * @param options - HTTP options
   */
  post<T>(url: string, body: any, options?: HttpPostOptions): Observable<T>;
  post(url: string, body: any, options: HttpPostOptions & {responseType: 'text'}): Observable<string>;
  post(url: string, body: any, options: HttpPostOptions & {responseType: 'blob'}): Observable<Blob>;
  post(url: string, body: any, options: HttpPostOptions & {responseType: 'arraybuffer'}): Observable<ArrayBuffer>;

  /**
   * Constructs a PUT request that interprets the body as a JSON object
   * @param url - Request URL
   * @param body - Request body
   * @param options - HTTP options
   */
  put<T>(url: string, body: any, options?: HttpPutOptions): Observable<T>;

  /**
   * Constructs a DELETE request that interprets the body as a JSON object
   * @param url - Request URL
   * @param options - HTTP options
   */
  delete<T>(url: string, options?: HttpDeleteOptions): Observable<T>;

  /**
   * Constructs a PATCH request that interprets the body as a JSON object
   * @param url - Request URL
   * @param body - Request body
   * @param options - HTTP options
   */
  patch<T>(url: string, body: any, options?: HttpPatchOptions): Observable<T>;

  /**
   * Constructs a HEAD request that interprets the body as a JSON object
   * @param url - Request URL
   * @param options - HTTP options
   */
  head<T>(url: string, options?: HttpHeadOptions): Observable<T>;

  /**
   * Constructs an OPTIONS request that interprets the body as a JSON object
   * @param url - Request URL
   * @param options - HTTP options
   */
  options<T>(url: string, options?: HttpOptionsOptions): Observable<T>;

  /**
   * Constructs a request with a specific method that interprets the body as a JSON object
   * @param method - HTTP method
   * @param url - Request URL
   * @param options - HTTP options including optional body
   */
  request<T>(method: string, url: string, options?: HttpRequestOptions): Observable<T>;
  request(method: string, url: string, options: HttpRequestOptions & {responseType: 'text'}): Observable<string>;
  request(method: string, url: string, options: HttpRequestOptions & {responseType: 'blob'}): Observable<Blob>;
  request(method: string, url: string, options: HttpRequestOptions & {responseType: 'arraybuffer'}): Observable<ArrayBuffer>;
}

// HTTP options interfaces
interface HttpGetOptions {
  headers?: HttpHeaders | {[header: string]: string | string[]};
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | {[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>};
  reportProgress?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
  transferCache?: {includeHeaders?: string[]} | boolean;
}

interface HttpPostOptions {
  headers?: HttpHeaders | {[header: string]: string | string[]};
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | {[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>};
  reportProgress?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

type HttpPutOptions = HttpPostOptions;
type HttpPatchOptions = HttpPostOptions;
type HttpDeleteOptions = HttpGetOptions;
type HttpHeadOptions = HttpGetOptions;
type HttpOptionsOptions = HttpGetOptions;

interface HttpRequestOptions extends HttpPostOptions {
  body?: any;
  method?: string;
  url?: string;
}
```

**Usage Examples:**

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  // GET request
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET with query parameters
  getUsersPaginated(page: number, size: number): Observable<User[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<User[]>(this.apiUrl, { params });
  }

  // GET with custom headers
  getUserWithAuth(id: number): Observable<User> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + this.getToken(),
      'Content-Type': 'application/json'
    });
    
    return this.http.get<User>(`${this.apiUrl}/${id}`, { headers });
  }

  // POST request
  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT request
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // DELETE request
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // GET full response
  getUserWithResponse(id: number): Observable<HttpResponse<User>> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, { observe: 'response' });
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}
```

### HTTP Configuration

Configuration and provider functions for HTTP client.

```typescript { .api }
/**
 * Configures the dependency injector for HttpClient with supporting services for XSRF
 * @param features - Optional HTTP features to enable
 */
function provideHttpClient(...features: HttpFeature[]): Provider[];

/**
 * Adds one or more functional-style HTTP interceptors
 * @param interceptorFns - Interceptor functions
 */
function withInterceptors(interceptorFns: HttpInterceptorFn[]): HttpFeature;

/**
 * Configures HttpClient to use the fetch API instead of XMLHttpRequest
 */
function withFetch(): HttpFeature;

/**
 * Enables JSONP support in HttpClient
 */
function withJsonpSupport(): HttpFeature;

/**
 * Disables XSRF protection
 */
function withNoXsrfProtection(): HttpFeature;

/**
 * Enables HTTP request caching
 */
function withRequestsMadeViaParent(): HttpFeature;

/**
 * Configures XSRF protection
 * @param options - XSRF configuration options
 */
function withXsrfConfiguration(options: {
  cookieName?: string;
  headerName?: string;
}): HttpFeature;

type HttpFeature = unknown;
type HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>;
type HttpHandlerFn = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;
```

### HTTP Headers

Utility class for working with HTTP headers.

```typescript { .api }
/**
 * Represents the header configuration options for an HTTP request
 */
class HttpHeaders {
  /**
   * Constructs a new HTTP header object
   * @param headers - Initial headers configuration
   */
  constructor(headers?: string | {[name: string]: string | string[]});

  /**
   * Checks for existence of a header by name
   * @param name - Header name
   */
  has(name: string): boolean;

  /**
   * Returns the first header value that matches a given name
   * @param name - Header name
   */
  get(name: string): string | null;

  /**
   * Returns all header values that match a given name
   * @param name - Header name
   */
  getAll(name: string): string[] | null;

  /**
   * Returns a list of header names
   */
  keys(): string[];

  /**
   * Returns a new HttpHeaders instance with an additional header
   * @param name - Header name
   * @param value - Header value(s)
   */
  append(name: string, value: string | string[]): HttpHeaders;

  /**
   * Returns a new HttpHeaders instance with a set header
   * @param name - Header name
   * @param value - Header value(s)
   */
  set(name: string, value: string | string[]): HttpHeaders;

  /**
   * Returns a new HttpHeaders instance with the specified header deleted
   * @param name - Header name
   * @param value - Optional specific value to delete
   */
  delete(name: string, value?: string | string[]): HttpHeaders;

  /**
   * Serializes headers to a string
   */
  toString(): string;

  /**
   * Executes a callback for each header
   * @param fn - Callback function
   */
  forEach(fn: (values: string[], name: string) => void): void;
}
```

### HTTP Parameters

Utility class for working with HTTP URL parameters.

```typescript { .api }
/**
 * HTTP request/response body used by HttpClient
 */
class HttpParams {
  /**
   * Constructs a new HTTP params object
   * @param options - Initial parameters configuration
   */
  constructor(options?: HttpParamsOptions);

  /**
   * Checks for existence of a parameter by name
   * @param param - Parameter name
   */
  has(param: string): boolean;

  /**
   * Retrieves the first value for a parameter
   * @param param - Parameter name
   */
  get(param: string): string | null;

  /**
   * Retrieves all values for a parameter
   * @param param - Parameter name
   */
  getAll(param: string): string[] | null;

  /**
   * Retrieves all parameter names
   */
  keys(): string[];

  /**
   * Constructs a new body with an additional parameter appended
   * @param param - Parameter name
   * @param value - Parameter value(s)
   */
  append(param: string, value: string | number | boolean): HttpParams;

  /**
   * Constructs a new body with an appended multi-value parameter
   * @param param - Parameter name
   * @param value - Parameter values
   */
  appendAll(params: {[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>}): HttpParams;

  /**
   * Constructs a new body with a new parameter value
   * @param param - Parameter name
   * @param value - Parameter value(s)
   */
  set(param: string, value: string | number | boolean): HttpParams;

  /**
   * Constructs a new body with either the given value for the given parameter removed, or all values removed
   * @param param - Parameter name
   * @param value - Optional specific value to remove
   */
  delete(param: string, value?: string | number | boolean): HttpParams;

  /**
   * Serializes parameters to an encoded string
   */
  toString(): string;
}

interface HttpParamsOptions {
  fromString?: string;
  fromObject?: {[param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>};
  encoder?: HttpParameterCodec;
}

interface HttpParameterCodec {
  encodeKey(key: string): string;
  encodeValue(value: string): string;
  decodeKey(key: string): string;
  decodeValue(value: string): string;
}
```

### HTTP Request and Response

Classes representing HTTP requests and responses.

```typescript { .api }
/**
 * Represents an HTTP request, including URL, method, headers, body, and other request configuration options
 */
class HttpRequest<T> {
  /**
   * Request body, or null if one isn't set
   */
  readonly body: T | null;

  /**
   * Request headers
   */
  readonly headers: HttpHeaders;

  /**
   * Whether this request should be made in a way that exposes progress events
   */
  readonly reportProgress: boolean;

  /**
   * Whether this request should be sent with outgoing credentials (cookies)
   */
  readonly withCredentials: boolean;

  /**
   * Request method (e.g., 'GET', 'POST', etc.)
   */
  readonly method: string;

  /**
   * Outgoing URL parameters
   */
  readonly params: HttpParams;

  /**
   * The expected response type of the server
   */
  readonly responseType: 'arraybuffer' | 'blob' | 'json' | 'text';

  /**
   * Request URL
   */
  readonly url: string;

  /**
   * Additional context for the request
   */
  readonly context: HttpContext;

  /**
   * Transform the free-form body into a serialized format suitable for transmission
   */
  serializeBody(): ArrayBuffer | Blob | FormData | string | null;

  /**
   * Examine the body and attempt to infer an appropriate MIME type for it
   */
  detectContentTypeHeader(): string | null;

  /**
   * Clone this request, setting new values for specific properties
   */
  clone(update?: HttpRequestCloneOptions<T>): HttpRequest<T>;
}

interface HttpRequestCloneOptions<T> {
  headers?: HttpHeaders;
  context?: HttpContext;
  reportProgress?: boolean;
  params?: HttpParams;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  body?: T | null;
  method?: string;
  url?: string;
  setHeaders?: {[name: string]: string | string[]};
  setParams?: {[param: string]: string};
}

/**
 * Full HTTP response, including typed response body, headers, status code, and more
 */
class HttpResponse<T> extends HttpResponseBase {
  /**
   * Response body, or null if one was not returned
   */
  readonly body: T | null;

  /**
   * Construct a new HttpResponse
   */
  constructor(init?: {
    body?: T | null;
    headers?: HttpHeaders;
    status?: number;
    statusText?: string;
    url?: string;
  });

  /**
   * Create a clone of this response, with optional new values
   */
  clone(): HttpResponse<T>;
  clone(update: {headers?: HttpHeaders; status?: number; statusText?: string; url?: string}): HttpResponse<T>;
  clone<V>(update: {body?: V | null; headers?: HttpHeaders; status?: number; statusText?: string; url?: string}): HttpResponse<V>;
}

/**
 * Base class for both HttpResponse and HttpHeaderResponse
 */
abstract class HttpResponseBase {
  /**
   * All response headers
   */
  readonly headers: HttpHeaders;

  /**
   * Response status code
   */
  readonly status: number;

  /**
   * Textual description of response status code
   */
  readonly statusText: string;

  /**
   * URL of the resource retrieved, or null if not available
   */
  readonly url: string | null;

  /**
   * Whether the status code falls in the 2xx range
   */
  readonly ok: boolean;

  /**
   * Type of the response
   */
  readonly type: HttpEventType.Response | HttpEventType.ResponseHeader;
}

/**
 * HTTP error response, containing information about what went wrong
 */
class HttpErrorResponse extends HttpResponseBase implements Error {
  readonly name = 'HttpErrorResponse';
  readonly message: string;
  readonly error: any | null;

  /**
   * Whether the error was caused by a client-side or network error
   */
  readonly ok = false;
}
```

### HTTP Interceptors

System for intercepting HTTP requests and responses.

```typescript { .api }
/**
 * Interface for HTTP interceptors
 */
interface HttpInterceptor {
  /**
   * Intercept an outgoing HttpRequest and optionally transform it or the response
   * @param req - Outgoing request
   * @param next - Next interceptor in the chain
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}

/**
 * Abstract class for HTTP handlers
 */
abstract class HttpHandler {
  abstract handle(req: HttpRequest<any>): Observable<HttpEvent<any>>;
}

/**
 * Functional-style HTTP interceptor
 */
type HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => Observable<HttpEvent<unknown>>;

/**
 * Function for handling HTTP requests in functional interceptors
 */
type HttpHandlerFn = (req: HttpRequest<unknown>) => Observable<HttpEvent<unknown>>;

/**
 * Union type for all HTTP events
 */
type HttpEvent<T> = HttpSentEvent | HttpHeaderResponse | HttpResponse<T> | HttpProgressEvent | HttpUserEvent<T>;

/**
 * Event fired when the request is sent
 */
interface HttpSentEvent {
  type: HttpEventType.Sent;
}

/**
 * Event fired when the response headers are received
 */
class HttpHeaderResponse extends HttpResponseBase {
  readonly type: HttpEventType.ResponseHeader;
}

/**
 * Event fired to indicate upload or download progress
 */
interface HttpProgressEvent {
  type: HttpEventType.DownloadProgress | HttpEventType.UploadProgress;
  loaded: number;
  total?: number;
}

/**
 * User-defined event
 */
interface HttpUserEvent<T> {
  type: HttpEventType.User;
}

enum HttpEventType {
  Sent,
  UploadProgress,
  ResponseHeader,
  DownloadProgress,
  Response,
  User
}
```

**Usage Examples:**

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request and add authorization header
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.getToken()}`
      }
    });

    return next.handle(authReq);
  }

  private getToken(): string {
    return localStorage.getItem('token') || '';
  }
}

// Functional interceptor
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }
  
  return next(req);
};
```

### HTTP Context

Context system for passing metadata through HTTP requests.

```typescript { .api }
/**
 * Context token that can be used to store arbitrary value and pass it to HTTP interceptors
 */
class HttpContext {
  /**
   * Store a value in the context
   * @param token - Context token
   * @param value - Value to store
   */
  set<T>(token: HttpContextToken<T>, value: T): HttpContext;

  /**
   * Retrieve a value from the context
   * @param token - Context token
   */
  get<T>(token: HttpContextToken<T>): T;

  /**
   * Delete a value from the context
   * @param token - Context token
   */
  delete<T>(token: HttpContextToken<T>): HttpContext;

  /**
   * Check if a token exists in the context
   * @param token - Context token
   */
  has<T>(token: HttpContextToken<T>): boolean;

  /**
   * Get all token keys
   */
  keys(): IterableIterator<HttpContextToken<unknown>>;
}

/**
 * Token representing a context value
 */
class HttpContextToken<T> {
  constructor(defaultValue: () => T);
  readonly defaultValue: () => T;
}
```

**Usage Examples:**

```typescript
import { HttpClient, HttpContext, HttpContextToken } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

// Create context tokens
const CACHE_ENABLED = new HttpContextToken<boolean>(() => false);
const RETRY_COUNT = new HttpContextToken<number>(() => 0);
const LOADING_INDICATOR = new HttpContextToken<boolean>(() => true);

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  // Using HTTP context to disable caching for specific requests
  getUserProfile(userId: string) {
    const context = new HttpContext()
      .set(CACHE_ENABLED, false)
      .set(LOADING_INDICATOR, true);

    return this.http.get<UserProfile>(`/api/users/${userId}`, {
      context
    });
  }

  // Using context for retry configuration
  uploadFile(file: File) {
    const context = new HttpContext()
      .set(RETRY_COUNT, 3)
      .set(LOADING_INDICATOR, false); // Don't show loading for uploads

    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<UploadResponse>('/api/upload', formData, {
      context,
      reportProgress: true
    });
  }

  // Check context in interceptor
  @Injectable()
  export class CacheInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const cacheEnabled = req.context.get(CACHE_ENABLED);
      
      if (cacheEnabled) {
        // Apply caching logic
        const cachedResponse = this.getCachedResponse(req);
        if (cachedResponse) {
          return of(cachedResponse);
        }
      }

      return next.handle(req);
    }
  }

  // Loading interceptor using context
  @Injectable()
  export class LoadingInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const showLoading = req.context.get(LOADING_INDICATOR);
      
      if (showLoading) {
        this.loadingService.show();
      }

      return next.handle(req).pipe(
        finalize(() => {
          if (showLoading) {
            this.loadingService.hide();
          }
        })
      );
    }
  }
}

// Advanced context usage with custom tokens
const REQUEST_TIMEOUT = new HttpContextToken<number>(() => 30000);
const SKIP_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);
const CUSTOM_HEADERS = new HttpContextToken<Record<string, string>>(() => ({}));

@Injectable({
  providedIn: 'root'
})
export class AdvancedApiService {
  private http = inject(HttpClient);

  // Method with custom timeout and error handling
  getLargeDataset() {
    const context = new HttpContext()
      .set(REQUEST_TIMEOUT, 60000) // 1 minute timeout
      .set(SKIP_ERROR_HANDLING, true) // Handle errors manually
      .set(CUSTOM_HEADERS, { 
        'X-API-Version': '2.0',
        'X-Client-Type': 'webapp' 
      });

    return this.http.get<LargeDataset>('/api/large-dataset', {
      context
    }).pipe(
      timeout(context.get(REQUEST_TIMEOUT)),
      catchError(error => {
        console.error('Dataset loading failed:', error);
        return throwError(() => error);
      })
    );
  }
}
```

## Types

```typescript { .api }
// HTTP modules
class HttpClientModule {}

// Response type
type HttpObserve = 'body' | 'events' | 'response';

// JSON replacer function
type HttpJsonReplacer = (key: string, value: any) => any;

// Transfer cache options
interface HttpTransferCacheOptions {
  includeHeaders?: string[];
}

// XSRF configuration
interface HttpXsrfConfiguration {
  cookieName?: string;
  headerName?: string;
}

// Event types
enum HttpEventType {
  Sent = 0,
  UploadProgress = 1,
  ResponseHeader = 2,
  DownloadProgress = 3,
  Response = 4,
  User = 5
}

// Status codes
enum HttpStatusCode {
  Continue = 200,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511
}
```