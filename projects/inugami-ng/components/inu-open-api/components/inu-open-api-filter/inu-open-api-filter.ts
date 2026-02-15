import {Component, computed, output, signal} from '@angular/core';
import {form, FormField, MaybeFieldTree} from '@angular/forms/signals';
import {OpenApiFilter} from '../../open-api.model';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {InuCheckboxGroup} from 'inugami-ng/components/inu-checkbox-group';
import {InuSelectItem} from 'inugami-ng/models';

@Component({
  selector: 'inu-open-api-filter',
  standalone: true,
  providers: [],
  imports: [
    FormField,
    InuCheckboxGroup
  ],
  templateUrl: './inu-open-api-filter.html',
  styleUrl: './inu-open-api-filter.scss',
})
export class InuOpenApiFilter {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  filterChanged = output<OpenApiFilter>();
  formModel = signal<OpenApiFilter>({
    uri: '',
    verb: []
  });
  formFilter: MaybeFieldTree<OpenApiFilter> = form(this.formModel);

  verbs = computed<InuSelectItem<string>[]>(() => [
    {value: 'GET', title: 'GET', styleClass: 'verb-get', selected:true},
    {value: 'POST', title: 'POST', styleClass: 'verb-post', selected:true},
    {value: 'PUT', title: 'PUT', styleClass: 'verb-put', selected:true}
  ]);

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    toObservable(this.formModel)
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        takeUntilDestroyed()
      )
      .subscribe(value => {
        this.onValueChanged(value)
      });
  }


  private onValueChanged(value: OpenApiFilter) {
    this.filterChanged.emit(value);
  }
}
