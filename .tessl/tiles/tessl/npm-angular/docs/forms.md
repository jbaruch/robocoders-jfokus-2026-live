# Reactive Forms

Form handling system with validation, reactive updates, and type safety for building complex forms and user input handling from `@angular/forms`.

## Capabilities

### Form Builder

Service for creating form controls, groups, and arrays programmatically.

```typescript { .api }
/**
 * Creates form control, group, and array instances from configuration
 */
class FormBuilder {
  /**
   * Creates a FormGroup with controls and validators
   * @param controls - Configuration object for controls
   * @param options - Group-level options and validators
   */
  group(controls: {[key: string]: any}, options?: AbstractControlOptions | {[key: string]: any}): FormGroup;

  /**
   * Creates a FormControl with initial value and validators
   * @param formState - Initial value or FormControlState
   * @param validatorOrOpts - Validators or control options
   * @param asyncValidator - Async validators
   */
  control(
    formState: any, 
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormControl;

  /**
   * Creates a FormArray with controls and validators
   * @param controls - Array of AbstractControl instances
   * @param validatorOrOpts - Validators or control options
   * @param asyncValidator - Async validators
   */
  array(
    controls: AbstractControl[], 
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ): FormArray;
}

interface AbstractControlOptions {
  validators?: ValidatorFn | ValidatorFn[] | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}
```

**Usage Examples:**

```typescript
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-form',
  template: `
    <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
      <input formControlName="name" placeholder="Name">
      <input formControlName="email" placeholder="Email">
      
      <div formArrayName="addresses">
        <div *ngFor="let address of addresses.controls; let i = index" [formGroupName]="i">
          <input formControlName="street" placeholder="Street">
          <input formControlName="city" placeholder="City">
        </div>
      </div>
      
      <button type="button" (click)="addAddress()">Add Address</button>
      <button type="submit" [disabled]="userForm.invalid">Submit</button>
    </form>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);

  userForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    addresses: this.fb.array([])
  });

  get addresses() {
    return this.userForm.get('addresses') as FormArray;
  }

  addAddress() {
    const addressGroup = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.addresses.push(addressGroup);
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
```

### Form Controls

Core form control classes for managing form state and validation.

```typescript { .api }
/**
 * Base class for form controls
 */
abstract class AbstractControl {
  /**
   * Current value of the control
   */
  readonly value: any;

  /**
   * Validation status of the control
   */
  readonly status: FormControlStatus;

  /**
   * Whether the control is valid
   */
  readonly valid: boolean;

  /**
   * Whether the control is invalid
   */
  readonly invalid: boolean;

  /**
   * Whether the control is pending async validation
   */
  readonly pending: boolean;

  /**
   * Whether the control is disabled
   */
  readonly disabled: boolean;

  /**
   * Whether the control is enabled
   */
  readonly enabled: boolean;

  /**
   * Validation errors, if any
   */
  readonly errors: ValidationErrors | null;

  /**
   * Whether the control has been touched
   */
  readonly touched: boolean;

  /**
   * Whether the control is untouched
   */
  readonly untouched: boolean;

  /**
   * Whether the control's value has changed
   */
  readonly dirty: boolean;

  /**
   * Whether the control's value has not changed
   */
  readonly pristine: boolean;

  /**
   * Sets the value of the control
   * @param value - New value
   * @param options - Update options
   */
  setValue(value: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Patches the value of the control
   * @param value - Value to patch
   * @param options - Update options
   */
  patchValue(value: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Resets the control
   * @param value - Optional reset value
   * @param options - Reset options
   */
  reset(value?: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Disables the control
   * @param options - Disable options
   */
  disable(options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Enables the control
   * @param options - Enable options
   */
  enable(options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Marks the control as touched
   * @param options - Touch options
   */
  markAsTouched(options?: {onlySelf?: boolean}): void;

  /**
   * Marks the control as dirty
   * @param options - Dirty options
   */
  markAsDirty(options?: {onlySelf?: boolean}): void;

  /**
   * Updates the control's validity
   * @param options - Update options
   */
  updateValueAndValidity(options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Sets validation errors
   * @param errors - Validation errors
   * @param options - Error options
   */
  setErrors(errors: ValidationErrors | null, options?: {emitEvent?: boolean}): void;

  /**
   * Gets a child control
   * @param path - Path to the control
   */
  get(path: Array<string | number> | string): AbstractControl | null;

  /**
   * Checks if control has a specific error
   * @param errorCode - Error code to check
   * @param path - Optional path to nested control
   */
  hasError(errorCode: string, path?: Array<string | number> | string): boolean;

  /**
   * Gets a specific error
   * @param errorCode - Error code to get
   * @param path - Optional path to nested control
   */
  getError(errorCode: string, path?: Array<string | number> | string): any;
}

/**
 * Tracks the value and validation status of an individual form control
 */
class FormControl extends AbstractControl {
  /**
   * Creates a new FormControl instance
   * @param formState - Initial value or FormControlState
   * @param validatorOrOpts - Validators or control options
   * @param asyncValidator - Async validators
   */
  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  );

  /**
   * Register a change listener
   * @param fn - Change listener function
   */
  registerOnChange(fn: Function): void;

  /**
   * Register a disabled change listener
   * @param fn - Disabled change listener function
   */
  registerOnDisabledChange(fn: (isDisabled: boolean) => void): void;
}

/**
 * Tracks the value and validity state of a group of FormControl instances
 */
class FormGroup extends AbstractControl {
  /**
   * Collection of child controls
   */
  controls: {[key: string]: AbstractControl};

  /**
   * Creates a new FormGroup instance
   * @param controls - Collection of child controls
   * @param validatorOrOpts - Validators or group options
   * @param asyncValidator - Async validators
   */
  constructor(
    controls: {[key: string]: AbstractControl},
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  );

  /**
   * Add a control to this group
   * @param name - Control name
   * @param control - Control instance
   * @param options - Add options
   */
  addControl(name: string, control: AbstractControl, options?: {emitEvent?: boolean}): void;

  /**
   * Remove a control from this group
   * @param name - Control name
   * @param options - Remove options
   */
  removeControl(name: string, options?: {emitEvent?: boolean}): void;

  /**
   * Replace an existing control
   * @param name - Control name
   * @param control - New control instance
   * @param options - Set options
   */
  setControl(name: string, control: AbstractControl, options?: {emitEvent?: boolean}): void;

  /**
   * Check whether there is an enabled control with the given name
   * @param controlName - Control name
   */
  contains(controlName: string): boolean;

  /**
   * Sets the value of the FormGroup
   * @param value - New value object
   * @param options - Set options
   */
  setValue(value: {[key: string]: any}, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Patches the value of the FormGroup
   * @param value - Value object to patch
   * @param options - Patch options
   */
  patchValue(value: {[key: string]: any}, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
  }): void;

  /**
   * Gets the raw value of the FormGroup including disabled controls
   */
  getRawValue(): any;
}

/**
 * Tracks the value and validity state of an array of FormControl instances
 */
class FormArray extends AbstractControl {
  /**
   * Array of child controls
   */
  controls: AbstractControl[];

  /**
   * Length of the control array
   */
  readonly length: number;

  /**
   * Creates a new FormArray instance
   * @param controls - Array of child controls
   * @param validatorOrOpts - Validators or array options
   * @param asyncValidator - Async validators
   */
  constructor(
    controls: AbstractControl[],
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  );

  /**
   * Get the AbstractControl at the given index
   * @param index - Control index
   */
  at(index: number): AbstractControl;

  /**
   * Insert a new AbstractControl at the end of the array
   * @param control - Control to add
   * @param options - Add options
   */
  push(control: AbstractControl, options?: {emitEvent?: boolean}): void;

  /**
   * Insert a new AbstractControl at the given index
   * @param index - Index to insert at
   * @param control - Control to insert
   * @param options - Insert options
   */
  insert(index: number, control: AbstractControl, options?: {emitEvent?: boolean}): void;

  /**
   * Remove the control at the given index
   * @param index - Index to remove
   * @param options - Remove options
   */
  removeAt(index: number, options?: {emitEvent?: boolean}): void;

  /**
   * Replace an existing control
   * @param index - Index of control to replace
   * @param control - New control instance
   * @param options - Set options
   */
  setControl(index: number, control: AbstractControl, options?: {emitEvent?: boolean}): void;

  /**
   * Remove all controls in the FormArray
   * @param options - Clear options
   */
  clear(options?: {emitEvent?: boolean}): void;

  /**
   * Gets the raw value of the FormArray including disabled controls
   */
  getRawValue(): any[];
}

type FormControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';
type ValidationErrors = {[key: string]: any};
```

### Built-in Validators

Predefined validation functions for common validation scenarios.

```typescript { .api }
/**
 * Provides a set of built-in validators
 */
class Validators {
  /**
   * Validator that requires the control have a non-empty value
   */
  static required(control: AbstractControl): ValidationErrors | null;

  /**
   * Validator that requires the control's value be true
   */
  static requiredTrue(control: AbstractControl): ValidationErrors | null;

  /**
   * Validator that requires the length of the control's value to be greater than or equal to the provided minimum length
   */
  static minLength(minLength: number): ValidatorFn;

  /**
   * Validator that requires the length of the control's value to be less than or equal to the provided maximum length
   */
  static maxLength(maxLength: number): ValidatorFn;

  /**
   * Validator that requires the control's value to match a regex pattern
   */
  static pattern(pattern: string | RegExp): ValidatorFn;

  /**
   * Validator that performs no operation
   */
  static nullValidator(control: AbstractControl): ValidationErrors | null;

  /**
   * Validator that requires the control's value to be a valid email address
   */
  static email(control: AbstractControl): ValidationErrors | null;

  /**
   * Validator that requires the control's value to be greater than or equal to the provided number
   */
  static min(min: number): ValidatorFn;

  /**
   * Validator that requires the control's value to be less than or equal to the provided number
   */
  static max(max: number): ValidatorFn;

  /**
   * Compose multiple validators into a single function
   */
  static compose(validators: (ValidatorFn | null)[] | null): ValidatorFn | null;

  /**
   * Compose multiple async validators into a single function
   */
  static composeAsync(validators: (AsyncValidatorFn | null)[]): AsyncValidatorFn | null;
}

/**
 * Function that receives a control and returns either null when it's valid, or validation errors
 */
type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;

/**
 * Function that receives a control and returns a Promise or observable of validation errors or null
 */
type AsyncValidatorFn = (control: AbstractControl) => Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;
```

**Usage Examples:**

```typescript
import { FormControl, Validators } from '@angular/forms';

// Basic validators
const nameControl = new FormControl('', [
  Validators.required,
  Validators.minLength(2),
  Validators.maxLength(50)
]);

const emailControl = new FormControl('', [
  Validators.required,
  Validators.email
]);

const ageControl = new FormControl(0, [
  Validators.required,
  Validators.min(18),
  Validators.max(120)
]);

const passwordControl = new FormControl('', [
  Validators.required,
  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
]);

// Custom validator function
function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}
```

### Form Directives

Directives for binding forms to templates.

```typescript { .api }
/**
 * Creates a top-level FormGroup instance and binds it to a form
 */
class FormGroupDirective {
  /**
   * The FormGroup instance
   */
  form: FormGroup;

  /**
   * Event emitted when the form submission has been triggered
   */
  ngSubmit: EventEmitter<any>;

  /**
   * Whether the form submission has been triggered
   */
  submitted: boolean;

  /**
   * Resets the form to its initial state
   */
  resetForm(value?: any): void;
}

/**
 * Syncs a FormControl in an existing FormGroup to a form control element by name
 */
class FormControlName {
  /**
   * Name of the FormControl bound to the directive
   */
  name: string | number | null;

  /**
   * Whether the control is disabled
   */
  isDisabled: boolean;

  /**
   * The FormControl bound to this directive
   */
  control: FormControl;
}

/**
 * Syncs a standalone FormControl instance to a form control element
 */
class FormControlDirective {
  /**
   * The FormControl bound to this directive
   */
  form: FormControl;

  /**
   * Whether the control is disabled
   */
  isDisabled: boolean;
}

/**
 * Creates and binds a FormGroup instance to a DOM element
 */
class FormArrayName {
  /**
   * Name of the FormArray bound to the directive
   */
  name: string | number | null;

  /**
   * The FormArray bound to this directive
   */
  control: FormArray;
}
```

### Control Value Accessor

Interface for custom form controls.

```typescript { .api }
/**
 * Defines an interface that acts as a bridge between the Angular forms API and a native element in the DOM
 */
interface ControlValueAccessor {
  /**
   * Writes a new value to the element
   * @param value - New value
   */
  writeValue(value: any): void;

  /**
   * Registers a callback function that is called when the control's value changes in the UI
   * @param fn - Callback function
   */
  registerOnChange(fn: (value: any) => void): void;

  /**
   * Registers a callback function that is called by the forms API on initialization to update the form model on blur
   * @param fn - Callback function
   */
  registerOnTouched(fn: () => void): void;

  /**
   * Function that is called by the forms API when the control status changes to or from 'DISABLED'
   * @param isDisabled - Whether the control is disabled
   */
  setDisabledState?(isDisabled: boolean): void;
}
```

### Form Modules

Angular modules for form functionality.

```typescript { .api }
/**
 * Exports the required providers and directives for template-driven forms
 */
class FormsModule {}

/**
 * Exports the required infrastructure and directives for reactive forms
 */
class ReactiveFormsModule {}
```

## Types

```typescript { .api }
// Form state interfaces
interface FormControlState<T> {
  value: T;
  disabled: boolean;
}

// Form options
interface AbstractControlOptions {
  validators?: ValidatorFn | ValidatorFn[] | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
  updateOn?: 'change' | 'blur' | 'submit';
}

// Validation types
type ValidationErrors = {[key: string]: any};
type ValidatorFn = (control: AbstractControl) => ValidationErrors | null;
type AsyncValidatorFn = (control: AbstractControl) => Promise<ValidationErrors | null> | Observable<ValidationErrors | null>;

// Form control status
type FormControlStatus = 'VALID' | 'INVALID' | 'PENDING' | 'DISABLED';

// Form hooks
type FormHooks = 'change' | 'blur' | 'submit';

// Type-safe form types (Angular 14+)
type FormControlOptions = {
  nonNullable?: boolean;
  validators?: ValidatorFn | ValidatorFn[];
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[];
  updateOn?: FormHooks;
};
```