import {Component, effect, input, InputSignal, model, ModelSignal, signal} from '@angular/core';
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
export class InuCheckboxGroup<T> implements FormValueControl<T[]> {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly values = input<InuSelectItem<T>[]>([]);
  readonly disabled = input(false);
  readonly required = input(false);
  readonly vertical = input(false);
  // FormValueControl
  value: ModelSignal<T[]> = model(<T[]>[]);
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


  private initStyleClass() {
    const result: string[] = ['inu-checkbox-group'];
    if (this.vertical()) {
      result.push('vertical');
    }
    if (this.required()) {
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

    const currentValues = this.values();
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
}
