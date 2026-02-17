import {Injectable} from '@angular/core';
import {from, Observable} from 'rxjs';


@Injectable({providedIn: 'root'})
export class InuCopyServices {


  // =================================================================================================================
  // API
  // =================================================================================================================
  copy(content:string):Observable<any> {
    const result$ = from(navigator.clipboard.writeText(content));
    result$.subscribe();
    return result$;
  }
}
