import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  input,
  model,
  ModelSignal,
  output,
  signal,
  viewChildren
} from '@angular/core';
import {InuSelectItem, InuSelectItemMatcher} from 'inugami-ng/models';
import {FormValueControl} from '@angular/forms/signals';
import {InuIcon} from 'inugami-icons';
import {InuLabel} from 'inugami-ng/components/inu-label';
import {InuToolTips} from 'inugami-ng/components/inu-tool-tips'

@Component({
             selector   : 'inu-radio-group',
             standalone : true,
             providers  : [],
             imports    : [InuIcon, InuLabel, InuToolTips],
             templateUrl: './inu-radio-group.component.html',
             styleUrl   : './inu-radio-group.component.scss',
           })
export class InuRadioGroup<T> implements FormValueControl<T | undefined>, AfterViewInit {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly disabled           = input(false);
  readonly label              = input('');
  readonly labelKey           = input('');
  readonly _required          = input(false, {alias: 'required'});
  readonly values             = input<InuSelectItem<T>[]>([]);
  readonly vertical           = input(false);
  readonly matcher            = input<InuSelectItemMatcher | undefined>(undefined);
  readonly radioItemsElements = viewChildren<ElementRef<HTMLElement>>('radioItems');

  changed = output<T | undefined>();

  // FormValueControl
  value: ModelSignal<T | undefined> = model<T | undefined>(undefined);
  _values                           = signal<InuSelectItem<T>[]>([]);
  // internal
  styleClass                        = signal<string>('');


  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    effect(() => {
      this.initStyleClass();
    });
  }

  ngAfterViewInit(): void {
    this.initSelectItems();
  }

  private initSelectItems() {
    const values = this.values();
    if (!values) {
      return;
    }

    const result: InuSelectItem<T>[] = [];
    for (let item of values) {
      const newItem    = Object.assign({}, item);
      newItem.selected = false;
      result.push(newItem);
    }
    const currentValue = this.getValue();
    if (!currentValue) {
      return;
    }


    for (let resultItem of result) {
      if (this.match(currentValue, resultItem)) {
        resultItem.selected = true;
        break;
      }
    }

    this._values.set(result);
    this.sendChanged();
  }

  private initStyleClass() {
    const result: string[] = ['inu-radio-group'];
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
      let found    = false;

      if (values) {
        for (let value of values) {
          found = value.selected != undefined && value.selected;
          if (found) {
            break;
          }
        }
      }
      if (!found) {
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

    for (let item of this._values()) {
      item.selected = false;
    }
    value.selected = true;
    this.sendChanged();
  }


  private sendChanged() {
    let newSelectedValues: T | undefined = undefined;
    const currentValues                  = this._values();
    if (currentValues) {
      for (let selectItem of currentValues) {
        if (selectItem.selected) {
          newSelectedValues = selectItem.value;
          break;
        }
      }
      this.value.set(newSelectedValues);
    }

    this.initStyleClass();
    this.changed.emit(newSelectedValues);
  }


  private match(valueItem: T, resultItem: InuSelectItem<T>) {
    const currentMatcher = this.matcher();
    if (currentMatcher) {
      return currentMatcher(resultItem, valueItem) != undefined;
    } else {
      return valueItem === resultItem.value;
    }
  }

  //==================================================================================================================
  // EVENTS
  //==================================================================================================================
  onKeyDown(event: KeyboardEvent, item: InuSelectItem<T>, index: number) {
    const values = this._values();
    if (!values || values.length <= 1) return;

    let nextIndex = index;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        nextIndex = (index + 1) % values.length;
        event.preventDefault();
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        nextIndex = (index - 1 + values.length) % values.length;
        event.preventDefault();
        break;
      case ' ':
        this.toggle(item);
        event.preventDefault();
        return;
      default:
        return;
    }

    const nextItem = values[nextIndex];
    this.toggle(nextItem);


    setTimeout(() => {
      const listItems = this.radioItemsElements();
      if (listItems) {
        listItems[nextIndex].nativeElement?.focus();
      }
    });
  }

  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  protected getItemClass(selectItem: InuSelectItem<T>): string {
    return [selectItem.styleClass!,
            selectItem.selected != undefined && selectItem.selected ? 'selected' : '']
      .join(' ');
  }

  private getValue(): T | undefined {
    let currentValue          = this.value();
    let result: T | undefined = undefined;
    if (Array.isArray(currentValue)) {
      if (currentValue.length > 0) {
        result = currentValue[0];
      } else {
        result = undefined;
      }
    } else {
      result = currentValue;
    }
    return result;
  }


}
