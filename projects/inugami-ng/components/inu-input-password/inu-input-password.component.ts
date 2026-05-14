import {
  Component,
  computed,
  ElementRef, inject,
  input,
  InputSignal,
  model,
  ModelSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import {FormField, FormValueControl} from '@angular/forms/signals';
import {UuidUtils} from 'inugami-ng/utils';
import {debounceTime, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {InuIcon} from 'inugami-icons';

@Component({
             selector   : 'inu-input-password',
             standalone : true,
             providers  : [],
             imports    : [
               InuIcon
             ],
             templateUrl: './inu-input-password.component.html',
             styleUrl   : './inu-input-password.component.scss',
           })
export class InuInputPassword implements FormValueControl<string>{


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly disabled  = input(false);
  readonly label     = input('');
  readonly icon      = input('');
  readonly name      = input('');
  readonly debounce  = input<number>(0);
  readonly _required = input(false, {alias: 'required'});


  // FormValueControl
  _formField                          = inject(FormField, {optional: true});
  value: ModelSignal<string> = model<string>('');
  valid                               = computed(() => {
    const state = this._formField?.state()
    if (!state) return true;
    const isInvalid      = state.invalid();
    const hasBeenTouched = state.touched();
    return !(isInvalid && hasBeenTouched);
  });
  // internal
  changed                             = output<string | number>();
  debouncer                           = new Subject<string | number>();

  id          = computed<string>(() => UuidUtils.buildUid());
  input       = viewChild<ElementRef<HTMLInputElement>>('input');
  focus       = signal<boolean>(false);
  styleClass  = input<string>('');
  _styleClass = computed<string>(() => {
    return [
      'inu-input',
      'inu-input-password',
      this.disabled() ? 'disabled' : '',
      !this.valid() ? 'invalid' : '',
      this.focus() ? 'focus' : '',
      this.styleClass()!
    ].join(' ');
  })

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    this.debouncer.pipe(
      debounceTime(this.debounce()),
      takeUntilDestroyed()
    ).subscribe(val => {
      this.value.set(val as string);
      this.changed.emit(val);
    });
  }

  protected onChanged(event: KeyboardEvent) {
    const input = this.input()?.nativeElement;
    if (!input) {
      return;
    }
    let value: string = input.value;
    this.debouncer.next(value)
  }

  protected onFocus() {
    this.focus.set(true);
  }

  protected onFocusOut() {
    this.focus.set(false);
    this._formField?.state()?.markAsTouched();
  }
}
