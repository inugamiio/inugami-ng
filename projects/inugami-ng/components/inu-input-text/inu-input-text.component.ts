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
import {UuidUtils} from 'inugami-ng/services';
import {debounceTime, Subject} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {InuIcon} from 'inugami-icons';

@Component({
  selector: 'inu-input-text',
  standalone: true,
  providers: [],
  imports: [
    InuIcon

  ],
  templateUrl: './inu-input-text.component.html',
  styleUrl: './inu-input-text.component.scss',
})
export class InuInputText implements FormValueControl<string | number>,FormValueControl<string | number> {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly disabled = input(false);
  readonly label = input('');
  readonly icon = input('');
  readonly name = input('');
  readonly type: InputSignal<string | 'text' | 'number' | 'email' | 'password'> = input('text');
  readonly _required = input(false, {alias: 'required'});


  // FormValueControl
  formField = inject(FormField, { optional: true });
  value: ModelSignal<string | number> = model<string | number>('');
  valid = computed(() => {
    const state = this.formField?.state()
    if (!state) return true;
    const isInvalid = state.invalid();
    const hasBeenTouched = state.touched();
    return !(isInvalid && hasBeenTouched);
  });
  // internal
  changed = output<string | number>();
  debouncer = new Subject<string | number>();

  id = computed<string>(() => UuidUtils.buildUid());
  input = viewChild<ElementRef<HTMLInputElement>>('input');
  focus=signal<boolean>(false);
  styleClass = input<string>('');
  _styleClass = computed<string>(() => {
    return [
      'inu-input',
      'inu-input-text',
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
      debounceTime(50),
      takeUntilDestroyed()
    ).subscribe(val => {
      this.value.set(val);
      this.changed.emit(val);
    });
  }

  protected onChanged(event: KeyboardEvent) {
    const input = this.input()?.nativeElement;
    if (!input) {
      return;
    }
    let value: number | string = input.value;
    if ('number' === this.type()) {
      try {
        value = Number(value);
      } catch (e) {
      }
    }

    this.debouncer.next(value)
  }

  protected onFocus() {
    this.focus.set(true);
  }

  protected onFocusOut() {
    this.focus.set(false);
  }
}
