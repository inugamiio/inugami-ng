import {computed, inject, Injectable, signal} from "@angular/core";
import {Observable} from "rxjs";
import {CacheServiceTracking} from './cache.service.tracking'
import {UuidUtils} from './uuid.utils'
import {ObservableSubscriber} from './observable.utils'
import {InuStringUtils} from './string.utils'

export const TTL_UNLIMITED = -1
export const TTL_MIN       = 60000;
export const TTL_MIN_5     = 5 * 60000;
export const TTL_MIN_10    = 10 * 60000;
export const TTL_MIN_30    = 30 * 60000;
export const TTL_HOUR      = 60 * 60000;
export const TTL_HALF_DAY  = 12 * 60 * 60000;
export const TTL_DAY       = 24 * 60 * 60000;

const PENDING_REQUESTS: Map<string, ObservableSubscriber<any>> = new Map();


interface TtlValue {
  key: string,
  value: any,
  ttl: number
}


@Injectable({providedIn: 'root'})
export class InuCacheServices {

  //==================================================================================================================
  // API
  //==================================================================================================================
  private cacheServiceTracking = inject(CacheServiceTracking, {optional: true});
  private localStorage         = computed<Storage>(() => window.localStorage);
  private sessionStorage       = computed<Storage>(() => window.sessionStorage);

  private tracking = signal<CacheServiceTracking>(this.cacheServiceTracking ?? new CacheServiceTracking(
    {
      sessionUid : signal<string>(UuidUtils.buildUid()),
      env        : signal<string>('dev'),
      application: signal<string>('inugami'),
      version    : signal<string>('0.0.0')
    }
  ))


  //==================================================================================================================
  // API
  //==================================================================================================================
  public get<T>(key: string): T | undefined {
    const realKey = this.buildKey(key);
    return this.getFromSessionStorage(realKey);
  }

  public getTTL<T>(key: string): T | undefined {
    const realKey = this.buildKeyTTL(key);
    return this.getFromLocalStorage(realKey);
  }

  public set(key: string, value: any): void {
    const realKey = this.buildKey(key);
    this.setInSessionStorage(realKey, value)

    const pending = PENDING_REQUESTS.get(realKey);
    pending?.subscriber()?.next(value);
    PENDING_REQUESTS.delete(realKey);
  }

  public setTTL(key: string, value: any, ttl: number): void {
    const realKey  = this.buildKeyTTL(key);
    const valueTTL = ttl == TTL_UNLIMITED ? TTL_UNLIMITED : new Date().getTime() + ttl;
    this.setInLocalStorage(realKey, value, valueTTL);

    const pending = PENDING_REQUESTS.get(realKey);
    pending?.subscriber()?.next(value);
    PENDING_REQUESTS.delete(realKey);
  }

  public getPending(key: string): Observable<any> | undefined {
    const realKey = this.buildKey(key);
    return this.processGetPending(realKey)
  }

  public getPendingTTL(key: string): Observable<any> | undefined {
    const realKey = this.buildKeyTTL(key);
    return this.processGetPending(realKey)
  }

  public setPending(key: string, obs: Observable<any>): void {
    const realKey = this.buildKey(key);
    this.processSetPending(key, obs)
  }

  public setPendingTTL(key: string, obs: Observable<any>): void {
    const realKey = this.buildKey(key);
    this.processSetPending(key, obs)
  }

  public clearKey(key : string) {
    this.localStorage().removeItem(this.buildKey(key));
  }
  public clearKeyTTL(key : string) {
    this.sessionStorage().removeItem(this.buildKeyTTL(key));
  }

  public clear() {
    this.localStorage().clear();
    this.sessionStorage().clear();
  }

  //==================================================================================================================
  // INTERNAL
  //==================================================================================================================
  private processGetPending(realKey: string) {
    let result: ObservableSubscriber<any> | undefined = PENDING_REQUESTS.get(realKey);
    return !result ? undefined : result?.observable();
  }

  private processSetPending(realKey: string, obs: Observable<any>) {
    const subscriber = new ObservableSubscriber<any>();
    PENDING_REQUESTS.set(realKey, subscriber);

    obs.subscribe({
                    next: res => subscriber.subscriber()?.next(res)
                  });
  }

  //====================================================================================================================
  // READ from storage
  //====================================================================================================================
  private getFromSessionStorage<T>(realKey: string): T | undefined {
    return this.extractStoredValue(this.sessionStorage().getItem(realKey), realKey);
  }

  private getFromLocalStorage<T>(realKey: string): T | undefined {
    return this.extractStoredValue(this.localStorage().getItem(realKey), realKey);
  }


  private extractStoredValue(rawValue: string | null, realKey: string) {
    if (!rawValue) {
      return undefined;
    }
    let valueWrapper: TtlValue | undefined = undefined;
    try {
      valueWrapper = JSON.parse(rawValue);
    } catch (e) {
    }
    if (!valueWrapper) {
      return undefined;
    }

    if (valueWrapper.ttl == TTL_UNLIMITED) {
      return valueWrapper.value;
    }

    const now = new Date().getTime();
    if (now > valueWrapper.ttl) {
      this.sessionStorage().removeItem(realKey)
      return undefined;
    } else {
      return valueWrapper.value;
    }
  }

  //====================================================================================================================
  // WRITE in storage
  //====================================================================================================================
  private setInSessionStorage(realKey: string, value: any) {
    this.writeInStorage(realKey, value, TTL_UNLIMITED, this.sessionStorage());
  }

  private setInLocalStorage(realKey: string, value: any, ttl: number) {
    this.writeInStorage(realKey, value, ttl, this.sessionStorage());
  }

  private writeInStorage(realKey: string, value: any, ttl: number, storage: Storage) {
    const wrapper: TtlValue = {
      key  : realKey,
      ttl  : ttl,
      value: value
    };
    storage.setItem(realKey, JSON.stringify(wrapper));
  }

  private buildKey(key: string) {
    const tracking = this.tracking();
    return InuStringUtils.normalize(`${tracking.env()}_${tracking.application()}_${tracking.version()}_${tracking.sessionUid()}_${key}`)
  }

  private buildKeyTTL(key: string) {
    const tracking = this.tracking();
    return InuStringUtils.normalize(`${tracking.env()}_${tracking.application()}_${tracking.version()}_${key}`);
  }
}
