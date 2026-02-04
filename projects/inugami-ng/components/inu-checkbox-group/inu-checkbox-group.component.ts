import {Component, effect, Input, input, model, ModelSignal, OnInit, signal} from '@angular/core';
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
  readonly _required = input(false, {alias: 'required'});
  readonly values = input<InuSelectItem<T>[]>([]);
  readonly vertical = input(false);


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
    });
  }

  ngOnInit(): void {
    this.initSelectItems();
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

    if (this._required()) {
      const values = this._values();
      let found = false;

      if (values) {
        for (let value of values) {
          found = value.selected != undefined && value.selected;
          if (found) {
            break;
          }
        }
      }
      if(!found){
        result.push('notValid');
      }
    }

    this.styleClass.set(result.join(' '));
  }


  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  protected toggle(value: InuSelectItem<T>) {
    if (this.disabled()) {
      return;
    }
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

    this.initStyleClass();
  }


  protected getItemClass(selectItem: InuSelectItem<T>): string {
    return selectItem.styleClass!;
  }


  private match(valueItem: T, resultItem: InuSelectItem<T>) {
    return valueItem === resultItem.value;
  }
}
