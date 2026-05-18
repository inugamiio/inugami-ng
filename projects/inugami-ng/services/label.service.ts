import {computed, inject, Injectable, Provider, signal, Type} from '@angular/core'
import {IInuLabelService, INU_LABEL_SERVICE, InuLabelAPI, InuLabelResponse} from 'inugami-ng/models';
import {HttpClient} from '@angular/common/http'
import {InuCacheServices} from './cache.service'
import {Observable, of, tap, window} from 'rxjs'

export function provideInuLabelService(implementation: Type<IInuLabelService> = InuLabelService): Provider {
  return {
    provide : INU_LABEL_SERVICE,
    useClass: implementation
  };
}

const TTL: number = 60000 * 60;

@Injectable({providedIn: 'root'})
export class InuLabelService implements IInuLabelService {


  //====================================================================================================================
  // ATTRIBUTES
  //====================================================================================================================
  httpClient    = inject(HttpClient);
  cacheServices = inject(InuCacheServices);

  labels             = signal<Record<string, Record<string, InuLabelAPI>>>({});
  supportedLanguages = signal<string[]>([]);
  url                = signal<string>('api/label');
  language           = signal<string>('EN');
  lang               = computed<string>(() => {
    const lang = navigator.language.split('-')[0].toUpperCase();
    return this.supportedLanguages().includes(lang) ? lang : this.language();
  });


  //====================================================================================================================
  // CONSTRUCTOR
  //====================================================================================================================
  initialize(): Observable<any> {
    const data: InuLabelResponse | undefined | null = this.cacheServices.getTTL(`InuLabelService_${this.url()}`);
    if (data) {
      this.init(data);
      return of({});
    } else {
      return this.httpClient.get<InuLabelResponse>(this.url())
        .pipe(tap(res => {
          this.cacheServices.setTTL(`InuLabelService_${this.url()}`, res, TTL);
          this.init(res);
        }));
    }
  }


  private init(res: InuLabelResponse) {
    const labels: Record<string, Record<string, InuLabelAPI>> = {};
    Object.keys(res).forEach((lang: string) => {
      let values = labels[lang];
      if (!values) {
        values       = {};
        labels[lang] = values;
      }
      for (let item of res[lang]) {
        values[item.key] = item;
      }


    });

    this.labels.set(labels);
    this.supportedLanguages.set(Object.keys(res));
  }


  //====================================================================================================================
  // API
  //====================================================================================================================
  setDefaultLanguage(language: string): void {
    this.language.set(language);
  }
  setUrl(apiUrl:string){
    this.url.set(apiUrl);
  }
  findLabel(key: string | undefined): InuLabelAPI | undefined {
    const currentLabels = this.labels();
    const currentLang   = this.lang();

    let labelsForLang = currentLabels[currentLang];
    if (!labelsForLang && this.supportedLanguages().length > 0) {
      labelsForLang = currentLabels[this.supportedLanguages()[0]];
    }

    if (!key || !labelsForLang) return undefined;

    return labelsForLang[key];
  }

  getMessage(key?: string, defaultValue?: string): string | undefined {
    const label = this.findLabel(key);
    return label?.message ?? defaultValue;
  }

}
