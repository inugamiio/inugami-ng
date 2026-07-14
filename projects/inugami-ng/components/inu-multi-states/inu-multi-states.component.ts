import {
  AfterViewInit,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  ModelSignal,
  output,
  signal
} from '@angular/core';
import {FormValueControl} from '@angular/forms/signals'
import {InuSelectItem, InuSelectItemMatcher} from 'inugami-ng/models'
import {NgClass, NgTemplateOutlet} from '@angular/common'
import {InuTemplateRegistryService} from 'inugami-ng/directives'


@Component({
             selector   : 'inu-multi-states',
             standalone : true,
             imports: [
               NgClass,
               NgTemplateOutlet
             ],
             providers  : [InuTemplateRegistryService],
             templateUrl: './inu-multi-states.component.html',
             styleUrl   : './inu-multi-states.component.scss',
           })
class InuMultiStates<T> implements FormValueControl<T[] | T | undefined>, AfterViewInit {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  // input
  readonly disabled  = input(false);
  readonly label     = input('');
  readonly labelKey  = input('');
  readonly _required = input(false, {alias: 'required'});
  readonly values    = input<InuSelectItem<T>[]>([]);
  readonly multi     = input(true);
  readonly matcher   = input<InuSelectItemMatcher | undefined>(undefined);

  // output
  changed                                 = output<T[]>();
  changedSelectItems                      = output<InuSelectItem<T>[]>();
  // FormValueControl
  value: ModelSignal<T[] | T | undefined> = model<T[] | T | undefined>(undefined);
  // inject
  registry: InuTemplateRegistryService    = inject(InuTemplateRegistryService);
  itemTemplate                            = computed(() => this.registry.getTemplate('item'));
  // internal
  data                                    = signal<InuSelectItem<T>[]>([]);
  _styleClass                             = computed<string>(() => [
    'inu-multi-states',
    this.value() ? 'selected' : '',
    this.disabled() ? 'disabled' : '',
    this._required() ? 'required' : ''
  ].join(' '));

  constructor() {
    effect(() => {
      this.refreshSelected(this.value());
    });
  }


  //====================================================================================================================
  // INIT
  //====================================================================================================================
  ngAfterViewInit(): void {
    this.initValues();
  }

  private initValues() {
    if (!this.values() || this.values().length == 0) {
      return;
    }
    const result: InuSelectItem<T>[] = [];
    for (let item of this.values()) {
      const clone = Object.assign({}, item);
      result.push(clone);
    }
    this.data.set(result);
    this.refreshSelected(this.value());
  }

  private refreshSelected(currentValues: any) {
    for (let itemData of this.data()) {
      itemData.selected = this.isSelected(itemData);
    }
  }

  isSelected(value: InuSelectItem<T>): boolean {
    const currentValue = this.value();
    if (currentValue == undefined) {
      return false;
    }
    const currentValues = Array.isArray(currentValue) ? currentValue : [currentValue];

    if (currentValues.length == 0) {
      return false;
    }
    const specificMatcher = this.matcher();
    const currentMatcher  = specificMatcher
      ? specificMatcher
      : (s: InuSelectItem<T>, v: any) => s.id === v;


    for (let currentValue of currentValues) {
      if (currentMatcher(value, currentValue)) {
        return true;
      }
    }
    return false;
  }

  //====================================================================================================================
  // ACTIONS
  //====================================================================================================================
  protected toggleSelection(selectItem: InuSelectItem<T>) {
    if (this.disabled() || selectItem.disabled) {
      return;
    }


    if (!this.multi()) {
      this.unSelectAll();
    }
    selectItem.selected = !selectItem.selected;
    this.sendChanged();
  }

  private unSelectAll() {
    this.data().forEach(s => s.selected = false);
  }

  //====================================================================================================================
  // EVENTS
  //====================================================================================================================
  private sendChanged() {
    if (this.multi()) {
      this.value.set(this.data().filter(s => s.selected).map(s => s.value));
    } else {
      const currentValues = this.data().filter(s => s.selected).map(s => s.value);
      if (currentValues.length > 0) {
        this.value.set(currentValues[0]);
      } else {
        this.value.set(undefined);
      }
    }

    this.changedSelectItems.emit(this.data().filter(s => s.selected));

    const newValue   = this.value();
    const event: T[] = [];
    if (newValue) {
      if (Array.isArray(newValue)) {
        event.push(...newValue);
      } else {
        event.push(newValue);
      }
    }
    this.changed.emit(event);
  }

  //====================================================================================================================
  // GETTERS
  //====================================================================================================================
  protected computeItemStyleClass(selectItem: InuSelectItem<T>): string {
    return [
      'inu-multi-states-item',
      selectItem.styleClass ?? '',
      selectItem.disabled ? 'disabled' : ''
    ].join(' ');
  }


}

export default InuMultiStates
