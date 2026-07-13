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
  signal, TemplateRef
} from '@angular/core';
import {
  InuSelectItem,
  InuSelectItemExtractor, InuSelectItemInitializer,
  InuSelectItemMatcher,
  InuSelectListSearchRequest,
  SearchProvider, SearchRequest, SearchResponse
} from 'inugami-ng/models';
import {FormField, FormValueControl} from '@angular/forms/signals';
import {InuIcon} from 'inugami-icons';
import {InuStringUtils} from 'inugami-ng/utils';
import {InuTemplateRegistryService} from 'inugami-ng/directives';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {InuInputText} from 'inugami-ng/components/inu-input-text';
import {InuLabel} from 'inugami-ng/components/inu-label';
import {InuLoading, LoadingType} from 'inugami-ng/components/inu-loading';
import {InuPaginator} from 'inugami-ng/components/inu-paginator';


@Component({
             selector   : 'inu-select-list',
             standalone : true,
             providers  : [InuTemplateRegistryService],
             imports    : [
               InuIcon,
               InuLabel,
               NgTemplateOutlet,
               NgClass,
               InuInputText,
               InuLoading,
               InuPaginator
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
  readonly displayFilter               = input(true);
  readonly debounce                    = input<number>(0);
  readonly label                       = input('');
  readonly labelKey                    = input('');
  readonly labelFilter                 = input('Filter');
  readonly labelFilterKey              = input('filter');
  readonly _required                   = input(false, {alias: 'required'});
  readonly multiSelect                 = input(true);
  readonly values                      = input<InuSelectItem<T>[]>([]);
  readonly matcher                     = input<InuSelectItemMatcher | undefined>(undefined);
  readonly extractor                   = input<InuSelectItemExtractor | undefined>(undefined);
  readonly initializer                 = input<InuSelectItemInitializer<T> | undefined>(undefined);
  readonly lazy                        = input<SearchProvider<InuSelectListSearchRequest, T> | undefined>(undefined);
  readonly loadingType                 = input<LoadingType>('default');
  readonly pageSize                    = input<number>(10);
  //
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  //
  itemTemplate                         = signal<TemplateRef<any> | undefined>(undefined);
  //
  changed                              = output<T[]>();
  changedSelectItems                   = output<InuSelectItem<T>[]>();
  onSelected                           = output<T>();
  onUnSelected                         = output<T>();
  onValidityChanged                    = output<boolean>();

  // FormValueControl

  value: ModelSignal<T[]> = model(<T[]>[]);
  data                    = signal<InuSelectItem<T>[]>([]);
  selected                = signal<any>({});
  _formField              = inject(FormField, {optional: true});
  valid                   = computed(() => {
    const state = this._formField?.state();
    if (!state) return true;

    const isInvalid      = state.invalid();
    const hasBeenTouched = state.touched();
    const currentValue   = this.value();

    const isEmptyArray = Array.isArray(currentValue) && currentValue.length === 0;
    const isRequired   = this._required();

    if (isEmptyArray && isRequired && hasBeenTouched) {
      return false;
    }

    return !(isInvalid && hasBeenTouched);
  });
  // internal
  filter                  = signal<string>('');
  loading                 = signal<boolean>(false);
  nbSelected              = signal<number>(0);
  styleClass              = computed<string>(() => [
    'inu-select-list',
    !this.valid() ? 'invalid' : '',
    this._required() ? 'required' : '',
    this.disabled() ? 'disabled' : '']
    .join(' ')
  );
  page                    = signal<number>(0);
  _pageSize               = signal<number>(10);
  previousValidity        = signal<boolean | undefined>(undefined);
  request                 = computed<InuSelectListSearchRequest>(() => <InuSelectListSearchRequest>{
    page     : this.page(),
    pageSize : this._pageSize(),
    sortOrder: 'ASC',
    value    : this.filter() == '' ? undefined : this.filter()
  });
  searchResponse          = signal<SearchResponse<any> | undefined>(undefined);

  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    effect(() => {
      this._pageSize.set(this.pageSize());
      this.initData();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.sendChanged());

    if (!this.itemTemplate()) {
      this.itemTemplate.set(this.registry.getTemplate('item'));
    }


    this.preloadSelectedValueForLazy();
    this.loadLazy();
  }

  private initData() {
    if (this.lazy()) {
      return;
    }
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


  private preloadSelectedValueForLazy() {
    if (!this.lazy()) {
      return;
    }
    const currentValues = this.getCurrentValue();
    if (currentValues) {
      const initializer = this.getInitializer()

      for (let value of currentValues) {
        this.selected.update(current => {
          const selectItem = initializer(value);
          const next       = {...current};
          if (next[selectItem.id] === undefined) {
            next[selectItem.id] = selectItem;
            this.onSelected.emit(selectItem.value);
          }
          return next;
        });
      }
      this.nbSelected.set(currentValues.length);
    }
  }


  private loadLazy() {
    const lazyHandler = this.lazy();
    if (!lazyHandler) {
      return;
    }


    this.loading.set(true);
    lazyHandler(this.request()).subscribe(
      {
        next: res => {
          this.searchResponse.set(res);
          this.data.set(res.data as InuSelectItem<T>[]);
        }
      }
    ).add(() => setTimeout(() => this.loading.set(false)));
  }

  //==================================================================================================================
  // ACTIONS
  //==================================================================================================================
  unselectAll() {
    this._formField?.state()?.markAsTouched();
    this.selected.set({});
    this.nbSelected.set(0);
  }

  doUnselectAll() {
    this.unselectAll();
    this.sendChanged();
  }

  doSelectAll() {
    const data = this.data();
    this._formField?.state()?.markAsTouched();
    if (data) {
      const selected = this.selected();
      for (let item of data) {
        selected[item.id] = item;
      }
      this.sendChanged();
    }
  }

  protected toggleSelect(selectItem: InuSelectItem<T>) {
    if (this.disabled()) {
      return;
    }
    this._formField?.state()?.markAsTouched();
    if (!this.multiSelect()) {
      this.unselectAll();
    }

    this.selected.update(current => {
      const next = {...current};
      if (next[selectItem.id] === undefined) {
        next[selectItem.id] = selectItem;
        this.onSelected.emit(selectItem.value);
      } else {
        delete next[selectItem.id];
        this.onUnSelected.emit(selectItem.value);
      }
      return next;
    });

    this.sendChanged();
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


  private sendChanged() {
    const selectItems: InuSelectItem<T>[] = [];
    const newSelectedValues: T[]          = [];
    const selected                        = this.selected();
    const keys                            = Object.keys(selected);
    keys.sort();

    if (keys.length > 0) {
      for (let key of keys) {
        selectItems.push(selected[key]);
        const selectedValue = this.getExtractor()(selected[key]);
        if (selectedValue) {
          newSelectedValues.push(selectedValue);
        }
      }

    }
    this.value.set(newSelectedValues);
    this.nbSelected.set(keys.length);
    this.changed.emit(newSelectedValues);
    this.changedSelectItems.emit(selectItems);
  }

  protected onPaginatorChanged(event: SearchRequest) {
    this.page.set(event.page ?? 0);
    this._pageSize.set(event.pageSize ?? 10);
    this.loadLazy();
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


  //==================================================================================================================
  // GETTERS
  //==================================================================================================================
  private getExtractor(): InuSelectItemExtractor {
    const result = this.extractor();
    return result ? result : (s: any) => s.value;
  }

  protected isSelected(selectItem: InuSelectItem<T>): boolean {
    const selected = this.selected();
    return selected[selectItem.id] != undefined;
  }

  protected onFilterChanged(event: string | number) {
    this.filter.set(InuStringUtils.normalize('' + event));
    this.loadLazy();
  }

  protected isDisplayed(selectItem: InuSelectItem<T>): boolean {
    const displayFilter = this.displayFilter();
    if (!displayFilter) {
      return true;
    }
    if (this.loading()) {
      return true;
    }
    const filter = this.filter();
    if (!filter || filter.length == 0) {
      return true;
    }
    const title = InuStringUtils.normalize(selectItem.title);
    const id    = InuStringUtils.normalize(selectItem.id);

    return title.includes(filter) || id.includes(filter);
  }

  private getCurrentValue(): T[] {
    const result = this.value();
    if (this.multiSelect() || result.length == 0) {
      return result;
    }
    return [result[0]];
  }

  private getInitializer(): InuSelectItemInitializer<T> {
    let result = this.initializer();

    if (!result) {
      result = (v: T) => <InuSelectItem<T>>{id: v, title: v, value: v};
    }
    return result;
  }

}
