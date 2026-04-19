import {Component, computed, input, output, signal} from '@angular/core';
import {form, FormField, MaybeFieldTree} from '@angular/forms/signals';
import {OpenApi, OpenApiFilter} from '../../open-api.model';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {InuCheckboxGroup} from 'inugami-ng/components/inu-checkbox-group';
import {InuSelectItem} from 'inugami-ng/models';
import {InuInputText} from 'inugami-ng/components/inu-input-text'

@Component({
             selector   : 'inu-open-api-filter',
             standalone : true,
             providers  : [],
             imports    : [
               FormField,
               InuCheckboxGroup,
               InuInputText
             ],
             templateUrl: './inu-open-api-filter.html',
             styleUrl   : './inu-open-api-filter.scss',
           })
export class InuOpenApiFilter {


  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  openApi = input<OpenApi | undefined | null>();

  filterChanged                             = output<OpenApiFilter>();
  formModel                                 = signal<OpenApiFilter>({
                                                                      uri  : '',
                                                                      verbs: []
                                                                    });
  formFilter: MaybeFieldTree<OpenApiFilter> = form(this.formModel);


  verbs = computed<InuSelectItem<string>[]>(() => {
    const paths                           = this.openApi()?.paths ?? [];
    const result: InuSelectItem<string>[] = [];
    const currentVerbs: string[]          = [];

    for (let path of paths) {
      if (!path.verb) {
        continue;
      }
      const verb = path.verb.trim().toUpperCase();
      if (!currentVerbs.includes(verb)) {
        currentVerbs.push(verb);
      }
    }
    currentVerbs.sort();
    for (let verb of currentVerbs) {
      result.push({id: verb, value: verb, title: verb, styleClass: `verb-${verb.toUpperCase()}`, selected: true});
    }
    return result;
  });
  //==================================================================================================================
  // INIT
  //==================================================================================================================

  constructor() {
    toObservable(this.formModel)
      .pipe(
        debounceTime(1),
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
