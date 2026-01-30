import {
  Component,
  effect,
  inject,
  input,
  signal, WritableSignal
} from '@angular/core';
import {CacheServices} from "inugami-ng/services";
import {map, Observable, shareReplay, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {OpenApi, OpenApiFilter} from './open-api.model';
import {InuOpenApiServices} from './inu-open-api.service';
import {InuOpenApiEndpoint} from './components/inu-open-api-endpoint/inu-open-api-endpoint';
import {form} from '@angular/forms/signals';
import {InuOpenApiFilter} from './components/inu-open-api-filter/inu-open-api-filter';



const CACHE_PREFIX = 'inu-open-api_';

@Component({
  selector: 'inu-open-api',
  standalone: true,
  imports: [
    InuOpenApiEndpoint,
    InuOpenApiFilter
  ],
  templateUrl: './inu-open-api.html',
  styleUrl: './inu-open-api.scss',
})
export class InuOpenApi {

  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  url = input<string | undefined | null>(undefined);
  data  = input<OpenApi | undefined | null>(undefined);
  private readonly http = inject(HttpClient);
  private readonly cache = inject(CacheServices);
  private readonly inuOpenApiService =inject(InuOpenApiServices);

  _value : WritableSignal<OpenApi|null> = signal<OpenApi|null>(null);

  //==================================================================================================================
  // INITIALIZE
  //==================================================================================================================
  constructor() {
    effect(() => this.init());
  }

  init(): void {
    const data = this.data();
    const url = this.url();
    if(data){
      this.initOpenApi(data)
    }
    else if (url) {
      this.loadFormUrl(url);
    }
  }

  loadFormUrl(url: string) {
    const data:OpenApi|undefined = this.loadFormCache(url);
    if (data) {

      return;
    }
    const cacheKey = CACHE_PREFIX+url;
    const pending:Observable<OpenApi> | undefined = this.cache.getPending(cacheKey);
    if (pending) {
      pending.subscribe(res => this.initOpenApi(res));
      return;
    }

    const request = this.http.get<any>(url)
      .pipe(map(res => this.inuOpenApiService.convertToOpenApi(res)),
        tap(data => this.cache.set(cacheKey, data)),
        shareReplay(1)
      );
    this.cache.setPending(cacheKey, request);
    request.subscribe({
      next : value => this.initOpenApi(value)
    });

  }






  //==================================================================================================================
  // PARSE
  //==================================================================================================================
  initOpenApi(openApi: OpenApi){
      this._value.set(openApi);
  }

  //==================================================================================================================
  // TOOLS
  //==================================================================================================================
  loadFormCache(url: string): OpenApi| undefined {
    const cacheKey = CACHE_PREFIX+url;
    const result: OpenApi | undefined = this.cache.get(cacheKey);
    return result;
  }

  setToCache(url: string, value: any): void {
    const cacheKey = CACHE_PREFIX+url;
    if (value) {
      this.cache.set(cacheKey, value);
    }
  }

}
