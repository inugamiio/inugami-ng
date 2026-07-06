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
import {InuSelectItem, InuSelectItemExtractor, InuSelectItemMatcher, SearchResponse} from 'inugami-ng/models';
import {FormValueControl} from '@angular/forms/signals';
import {InuIcon} from 'inugami-icons'
import {InuLabel} from '../inu-label/inu-label'
import {InuStringUtils} from 'inugami-ng/utils'
import {InuTemplateRegistryService} from 'inugami-ng/directives'
import {NgClass, NgTemplateOutlet} from '@angular/common'
import {InuInputText} from 'inugami-ng/components/inu-input-text'

@Component({
             selector   : 'inu-select-list',
             standalone : true,
             providers  : [InuTemplateRegistryService],
             imports    : [
               InuIcon,
               InuLabel,
               NgTemplateOutlet,
               NgClass,
               InuInputText
             ],
             templateUrl: './inu-select-list.component.html',
             styleUrl   : './inu-select-list.component.scss',
           })
export class InuSelectList<T> implements FormValueControl<T[]>, AfterViewInit {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  // input
  readonly disabled                    = input(false);
  readonly label                       = input('');
  readonly labelKey                    = input('');
  readonly labelFilter                 = input('Filter');
  readonly labelFilterKey              = input('filter');
  readonly _required                   = input(false, {alias: 'required'});
  readonly multiSelect                 = input(true);
  readonly values                      = input<InuSelectItem<T>[]>([]);
  readonly matcher                     = input<InuSelectItemMatcher | undefined>(undefined);
  readonly extractor                   = input<InuSelectItemExtractor | undefined>(undefined);
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  itemTemplate                         = computed(() => this.registry.getTemplate('item'));
  changed                              = output<T[]>();
  onSelected                           = output<T>();
  onUnSelected                         = output<T>();

  // FormValueControl
  value: ModelSignal<T[]> = model(<T[]>[]);
  data                    = signal<InuSelectItem<T>[]>([]);
  selected                = signal<any>({});
  // internal
  filter                  = signal<string>('');
  styleClass              = signal<string>('');


  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.init();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.sendChanged());
  }

  private init() {
    this.initStyleClass();
    this.initData();
  }

  private initStyleClass() {
    this.styleClass.set([
                          'inu-select-list',
                          this._required() ? 'required' : '',
                          this.disabled() ? 'disabled' : ''
                        ].join(' '));
  }

  private initData() {
    const selectItemValues = this.values();
    if (selectItemValues) {
      selectItemValues.sort((ref, values) => {
        const refTitle   = InuStringUtils.normalize(ref.title).toUpperCase().trim();
        const valueTitle = InuStringUtils.normalize(values.title).toUpperCase().trim();
        return refTitle.localeCompare(valueTitle);
      })

      const currentValues = this.getCurrentValue();
      if (currentValues) {
        const selectedValues      = this.computeSelectedValues(selectItemValues, currentValues);
        const selectedBuffer: any = {};
        for (let selectedValue of selectedValues) {
          selectedBuffer[selectedValue.id] = selectedValue;
        }
        this.selected.set(selectedBuffer);
      }

      this.data.set(selectItemValues);
    }

  }

  private getCurrentValue(): T[] {
    const result = this.value();
    if (this.multiSelect() || result.length == 0) {
      return result;
    }
    return [result[0]];
  }

  private computeSelectedValues(selectItemValues: InuSelectItem<T>[], currentValues: T[]): InuSelectItem<T>[] {
    const result: InuSelectItem<T>[] = [];
    const multiSelect                = this.multiSelect();
    for (let selectItemValue of selectItemValues) {
      for (let value of currentValues) {
        if (this.match(value, selectItemValue)) {
          result.push(selectItemValue);
          if (!multiSelect) {
            return result;
          }
          break;
        }
      }
    }
    return result;
  }

  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  unselectAll() {
    this.selected.set({});
  }

  private sendChanged() {
    const newSelectedValues: T[] = [];
    const selected               = this.selected();
    const keys                   = Object.keys(selected);
    keys.sort();

    if (keys.length > 0) {
      for (let key of keys) {
        const selectedValue = this.getExtractor()(selected[key]);
        if (selectedValue) {
          newSelectedValues.push(selectedValue);
        }
      }
      this.value.set(newSelectedValues);
    }

    this.initStyleClass();

    this.changed.emit(newSelectedValues);
  }

  //==================================================================================================================
  // EVENT
  //==================================================================================================================
  protected onKeyDown(event: KeyboardEvent, item: InuSelectItem<T>) {
    if (this.disabled()) {
      return;
    }
    if (event.key === ' ' || event.key === 'Spacebar') {
      this.toggleSelect(item);
      event.preventDefault();
    }
  }


  private sendOnUnSelected() {

  }

  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  private match(valueItem: T, resultItem: InuSelectItem<T>) {
    const currentMatcher = this.matcher();
    if (currentMatcher) {
      return currentMatcher(resultItem, valueItem) != undefined;
    } else {
      return valueItem === resultItem.value;
    }
  }


  protected toggleSelect(selectItem: InuSelectItem<T>) {
    if (!this.multiSelect()) {
      this.unselectAll();
    }
    const selected = this.selected();
    if (selected[selectItem.id] == undefined) {
      selected[selectItem.id] = selectItem;
      this.onSelected.emit(selectItem.value);
      this.sendChanged();
    } else {
      delete selected[selectItem.id];
      this.onUnSelected.emit(selectItem.value);
      this.sendChanged();
    }
  }

  private getExtractor(): InuSelectItemExtractor {
    const result = this.extractor();
    return result ? result : (s: any) => s.value;
  }


  protected isSelected(selectItem: InuSelectItem<T>): boolean {
    const selected = this.selected();
    return selected[selectItem.id] != undefined;
  }


  protected onFilterChanged(event: string | number) {
    this.filter.set('' + event);
  }
}
