import {Component, inject, signal} from '@angular/core';
import {InuErrorService} from 'inugami-ng/services';
import {ProblemDTO} from 'inugami-ng/models';
import {throwError} from 'rxjs'
import {HttpErrorResponse} from '@angular/common/http'
import {InuButton} from 'inugami-ng/components/inu-button'
import {InuCite} from 'inugami-ng/components/inu-cite'
import {InuCode} from 'inugami-ng/components/inu-code'


@Component({
             templateUrl: './inu-error-service.view.html',
             styleUrls  : ['./inu-error-service.view.scss'],
             imports: [
               InuButton,
               InuCite,
               InuCite,
               InuCode
             ]
           })
export class InuErrorServiceView {
  inuErrorService = inject(InuErrorService);


  callFunctionalError() {
    this.inuErrorService.forkJoin([this.processFunctionalError()])
      .subscribe({
                   next: res => console.log('response', res)
                 });
  }


  processFunctionalError() {
    const body: ProblemDTO = {
      status          : 400,
      type            : 'https://inugami.io/errors/validation',
      localizedMessage: 'error.user.invalid_fields',
      parameters      : [{errorCode: 'ERR-USER-1_0', errorType: 'functional'}],
      details         : {application: 'InuDemo', version: '1.0.0'}
    };
    return throwError(() => new HttpErrorResponse({
                                                    error     : body,
                                                    status    : 400,
                                                    statusText: 'Bad Request',
                                                    url       : '/api/mock/functional'
                                                  }));
  }


}
