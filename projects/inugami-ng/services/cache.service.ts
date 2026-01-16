import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
const CACHE :any = {};
const PENDING_REQUESTS: Map<string, Observable<any>> = new Map();

@Injectable({ providedIn: 'root' })
export class CacheServices {

    //==================================================================================================================
    // API
    //==================================================================================================================
  public get<T>(key: string): T | undefined {
    return CACHE[key];
  }

  public set(key: string, object: any): void {
    CACHE[key] = object;
    PENDING_REQUESTS.delete(key);
  }


  public getPending(key: string): Observable<any> | undefined {
    return PENDING_REQUESTS.get(key);
  }

  public setPending(key: string, obs: Observable<any>): void {
    PENDING_REQUESTS.set(key, obs);
  }


}
