import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  ModelSignal,
  output,
  signal,
  viewChild
} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';
import {FormValueControl} from '@angular/forms/signals'
import {InuLabel} from '../inu-label/inu-label'
import {InuIcon} from 'inugami-icons'
import {
  InuSelectItem,
  InuSelectItemExtractor,
  InuSelectItemInitializer,
  InuSelectItemMatcher,
  InuSelectListSearchRequest,
  SearchProvider
} from 'inugami-ng/models'
import {LoadingType} from '../inu-loading/inu-loading.component'
import {InuSelectList} from '../inu-select-list/inu-select-list.component'
import {InuTemplateRegistryService} from 'inugami-ng/directives'


@Component({
             selector   : 'inu-dropdown',
             standalone : true,
             imports    : [
               InuLabel,
               InuIcon,
               InuSelectList,
               NgClass,
               NgTemplateOutlet
             ],
             templateUrl: './inu-dropdown.component.html',
             styleUrl   : './inu-dropdown.component.scss',
           })
export class InuDropdown<T> implements FormValueControl<T[]>, AfterViewInit {
  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  // input
  readonly _required      = input(false, {alias: 'required'});
  readonly disabled       = input(false);
  readonly displayFilter  = input(true);
  readonly labelFilter    = input('Filter');
  readonly labelFilterKey = input('filter');
  readonly debounce       = input<number>(0);
  readonly label          = input('');
  readonly labelKey       = input('');
  readonly multiSelect    = input(true);
  readonly values         = input<InuSelectItem<T>[]>([]);
  readonly matcher        = input<InuSelectItemMatcher | undefined>(undefined);
  readonly extractor      = input<InuSelectItemExtractor | undefined>(undefined);
  readonly initializer    = input<InuSelectItemInitializer<T> | undefined>(undefined);
  readonly lazy           = input<SearchProvider<InuSelectListSearchRequest, T> | undefined>(undefined);
  readonly loadingType    = input<LoadingType>('default');
  readonly pageSize       = input<number>(10);

  // output
  changed                              = output<T[]>();
  onSelected                           = output<T>();
  onUnSelected                         = output<T>();
  // inject
  elementRef                           = inject(ElementRef);
  registry: InuTemplateRegistryService = inject(InuTemplateRegistryService);
  itemTemplate                         = computed(() => this.registry.getTemplate('item'));
  selectedValueTemplate                = computed(() => this.registry.getTemplate('selectedValue'));
  selectListComponent                  = viewChild<InuSelectList<T>>('selectList');
  // FormValueControl
  value: ModelSignal<T[]>              = model(<T[]>[]);
  // internal
  data                                 = signal<InuSelectItem<T>[]>([]);
  display                              = signal<boolean>(false);
  _styleClass                          = computed<string>(() => [
    'inu-dropdown',
    this.disabled() ? 'disabled' : '',
    this._required() ? 'required' : ''
  ].join(' '));
  width                                = signal<string>('0px');

  constructor() {
    effect(() => {
      this.resize()
    });
  }


  //====================================================================================================================
  // INIT
  //====================================================================================================================
  ngAfterViewInit(): void {
    const itemTemplate = this.itemTemplate();
    const selectList   = this.selectListComponent();
    this.resize();
    if (itemTemplate && selectList) {
      selectList.itemTemplate.set(this.itemTemplate());

    }
  }

  private resize() {
    const current = this.elementRef.nativeElement;
    if (current) {
      const rect = current.getBoundingClientRect();
      this.width.set(`${rect.width}px`);
    }
  }

  //====================================================================================================================
  // INIT
  //====================================================================================================================
  toggleDisplay() {
    this.display.set(!this.display());
  }

  //====================================================================================================================
  // EVENTS
  //====================================================================================================================
  protected onChanged(event: T[]) {
    this.value.set(event);
    this.changed.emit(event);
  }

  protected onKeyDown(event: KeyboardEvent) {
    if (!this.display() && event.key === ' ' || event.key === 'Spacebar' || event.key === 'ArrowDown') {
      this.display.set(true);
      event.preventDefault();

    }
    if (this.display() && event.key === 'Escape') {
      this.display.set(false);
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent) {
    if (!this.display()) {
      return;
    }
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.display.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape() {
    if (!this.display()) {
      return;
    }
    this.display.set(false);
  }

  protected onChangedSelectItems(event: InuSelectItem<T>[]) {
    this.data.set(event);
  }
}
