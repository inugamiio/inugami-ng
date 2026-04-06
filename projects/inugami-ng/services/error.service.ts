import {inject, Injectable} from '@angular/core'
import {catchError, forkJoin, Observable, of} from 'rxjs'
import {InuLabelService} from './label.service'
import {ProblemDTO, ProblemParameterDTO} from 'inugami-ng/models'
import {HttpErrorResponse} from '@angular/common/http'
import {InuToastServices} from 'inugami-ng/components/inu-toast'

@Injectable({providedIn: 'root'})
export class InuErrorService {

  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  inuLabelService  = inject(InuLabelService);
  inuToastServices = inject(InuToastServices);

  //====================================================================================================================
  // API
  //====================================================================================================================
  public forkJoin(observables: Observable<any>[]): Observable<any[] | ProblemDTO[]> {
    const tasks: Observable<any>[] = [];

    for (let observable of observables) {
      tasks.push(observable.pipe(catchError(e => of(this.handlerError(e)))));
    }
    return forkJoin(tasks);
  }


  //====================================================================================================================
  // INTERNAL
  //====================================================================================================================
  public handlerError(error: any): ProblemDTO {
    let problem: ProblemDTO | undefined = undefined;

    if (this.isProblemDTO(error)) {
      problem = error as ProblemDTO;
    } else if (this.isHttpError(error)) {
      problem = this.extractProblemFormHttpCall(error as HttpErrorResponse);
    } else {
      problem = this.buildDefaultProblem();
    }

    console.log('handlerError',problem)

    if(problem.details){
      if(problem.details.errorCode){
        this.showMessageErrorCode(problem.details.errorCode, problem);
      }
      if(problem.details.fields){
        for(let field of problem.details.fields){
         if(!field.errorCode
            || field.errorCode== problem.details.errorCode){
           continue;
         }
          this.showMessageErrorCode(field.errorCode, problem);
        }
      }
    }


    for (let param of (problem.parameters ?? [this.buildDefaultErrorParameter()])) {
      this.showMessage(param, problem);
    }

    return problem;
  }


  public isProblemDTO(obj: any): obj is ProblemDTO {
    return obj && obj.status !== undefined && obj.parameters !== undefined;
  }

  public isHttpError(error: any): boolean {
    return !!(error && typeof error === 'object' && 'status' in error);
  }

  public extractProblemFormHttpCall(httpError: HttpErrorResponse): ProblemDTO {
    if (this.isProblemDTO(httpError.error)) {
      return httpError.error;
    }

    return {
      status      : httpError.status,
      reasonPhrase: httpError.statusText,
      detail      : httpError.message,
      parameters  : [this.buildDefaultErrorParameter()],
      timestamp   : new Date() as any
    };
  }

  private buildDefaultProblem(): ProblemDTO {
    return {
      status    : 500,
      parameters: [this.buildDefaultErrorParameter()],
      timestamp : new Date() as any
    };
  }

  private buildDefaultErrorParameter() {
    return {
      errorCode: 'err-undefine',
      errorType: 'technical'
    }
  }

  public showMessage(param: ProblemParameterDTO, problem: ProblemDTO) {
    const errorType = param.errorType ?? this.resolveErrorLevel(problem.status);

    const errorCodeMessage      = this.inuLabelService.getMessage(param.errorCode);
    const errorCodeTitleMessage = this.inuLabelService.getMessage(`${param.errorCode}_title`);
    const genericTitle          = this.inuLabelService.getMessage(param.errorType);
    this.inuToastServices.addMessage({
                                       level  : this.resolveLevel(errorType),
                                       title  : errorCodeTitleMessage ?? genericTitle ?? 'Undefined error occurs',
                                       message: errorCodeMessage ?? 'some error occurs'
                                     });
  }

  private resolveErrorLevel(status?: number) {
    if (!status || status == 0) {
      return 'technical';
    }
    return status < 500 ? 'functional' : 'technical';
  }

  private resolveLevel(errorType: string) {
    return 'functional' == errorType.toLowerCase() ? 'warn' : 'error';
  }

  private showMessageErrorCode(errorCode: string, problem: ProblemDTO) {
    const errorType = this.resolveErrorLevel(problem.status);

    const errorCodeMessage      = this.inuLabelService.getMessage(errorCode);
    const errorCodeTitleMessage = this.inuLabelService.getMessage(`${errorCode}_title`);
    const genericTitle          = this.inuLabelService.getMessage(errorType);
    this.inuToastServices.addMessage({
                                       level  : this.resolveLevel(errorType),
                                       title  : errorCodeTitleMessage ?? genericTitle ?? 'Undefined error occurs',
                                       message: errorCodeMessage ?? 'some error occurs'
                                     });
  }
}
