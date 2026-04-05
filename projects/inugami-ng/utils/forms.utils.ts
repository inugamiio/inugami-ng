import {Signal} from '@angular/core'
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop'
import {debounceTime, distinctUntilChanged, Observable} from 'rxjs'
import {FieldTree} from '@angular/forms/signals'

export interface ValidityChanges {
  valid: boolean;
  invalidFields: InvalidField[];
}

export interface InvalidField {
  field: string;
  dirty: boolean;
  disabled: boolean;
  touched: boolean;
  errors: any[];
}

export class InuFormsUtils {

  public static onChanged<T>(model: Signal<T>, debounce?: number): Observable<T> {
    return toObservable(model)
      .pipe(
        debounceTime(debounce ?? 50),
        distinctUntilChanged(),
        takeUntilDestroyed()
      );
  }

  public static isValid<T>(form: FieldTree<T>): ValidityChanges {
    let valid: boolean                  = true;
    const invalidFields: InvalidField[] = [];

    const keys = Object.keys(form);
    for (let key of keys) {
      const field = (form as any)[key]();
      if (!field.validationState.valid()) {
        valid = false;
        invalidFields.push({
                             field   : key,
                             dirty   : field.nodeState.dirty(),
                             disabled: field.nodeState.disabled(),
                             touched : field.nodeState.touched(),
                             errors  : field.validationState.errors()
                           });
      }

    }
    return {
      valid        : valid,
      invalidFields: invalidFields
    };
  }
}
