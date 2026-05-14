import {Component, computed, inject, input} from '@angular/core';
import {INU_LABEL_SERVICE} from 'inugami-ng/models'

@Component({
             selector   : 'inu-label',
             standalone : true,
             imports    : [],
             templateUrl: './inu-label.html'
           })
export class InuLabel {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  key          = input<string | undefined | null>('');
  defaultValue = input<string | undefined | null>('');
  //
  labelService = inject(INU_LABEL_SERVICE);
  //
  _message     = computed<string | undefined>(() => {
    const label = this.labelService.getMessage(this.key() ?? undefined, this.defaultValue() ?? undefined);
    return label ?? undefined;
  })

}
