import {
  booleanAttribute,
  Component,
  effect, Input,
  input,
  InputSignal,
  model,
  ModelSignal,
  OnInit,
  signal
} from '@angular/core';
import {InuSelectItem} from 'inugami-ng/models';
import {FormValueControl} from '@angular/forms/signals';
import {InuIcon} from 'inugami-icons';

@Component({
  selector: 'inu-checkbox-group',
  standalone: true,
  providers: [],
  imports: [InuIcon],
  templateUrl: './inu-checkbox-group.component.html',
  styleUrl: './inu-checkbox-group.component.scss',
})
export class InuCheckboxGroup<T> implements FormValueControl<T[]>, OnInit {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly disabled = input(false);
  readonly label = input('');
  readonly _required = input(false, { alias: 'required'});
  readonly values = input<InuSelectItem<T>[]>([]);
  readonly vertical = input(false);
  @Input() set requiredOld(v: boolean) {
    console.log('RECU VIA DECORATEUR :', v);
  }

  // FormValueControl
  value: ModelSignal<T[]> = model(<T[]>[]);
  _values = signal<InuSelectItem<T>[]>([]);
  // internal

  styleClass = signal<string>('');


  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    effect(() => {
      this.initStyleClass();
      const required = this._required();
      console.log('required',required)
    });
  }

  ngOnInit(): void {

    this.initSelectItems();
    setTimeout(() => {
      console.log('Required après timeout:', this._required());
    }, 100);

  }

  private initSelectItems() {

    const values = this.values();
    if (!values) {
      return;
    }

    const result: InuSelectItem<T>[] = [];
    for (let item of values) {
      result.push(Object.assign({}, item));
    }
    const currentValue = this.value();
    if (!currentValue) {
      return;
    }

    for (let valueItem of currentValue) {
      for (let resultItem of result) {
        if (this.match(valueItem, resultItem)) {
          resultItem.selected = true;
          break;
        }
      }
    }
    this._values.set(result);
  }

  private initStyleClass() {
    const result: string[] = ['inu-checkbox-group'];
    if (this.vertical()) {
      result.push('vertical');
    }
    if (this._required()) {
      result.push('required');
    }
    if (this.disabled()) {
      result.push('disabled');
    }

    this.styleClass.set(result.join(' '));
  }


//==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  protected toggle(value: InuSelectItem<T>) {
    if (value.selected == undefined) {
      value.selected = true
    } else {
      value.selected = !value.selected;
    }

    const currentValues = this._values();
    if (currentValues) {
      const newSelectedValues: T[] = [];

      for (let selectItem of currentValues) {
        if (selectItem.selected) {
          newSelectedValues.push(selectItem.value);
        }
      }
      this.value.set(newSelectedValues);
    }
  }


  protected getItemClass(selectItem: InuSelectItem<T>): string {
    return selectItem.styleClass!;
  }


  private match(valueItem: T, resultItem: InuSelectItem<T>) {
    return valueItem === resultItem.value;
  }
}
