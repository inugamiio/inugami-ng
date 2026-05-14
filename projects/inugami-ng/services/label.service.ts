import {computed, inject, Injectable, Provider, signal, Type} from '@angular/core'
import {IInuLabelService, INU_LABEL_SERVICE, InuLabelAPI, InuLabelResponse} from 'inugami-ng/models';
import {HttpClient} from '@angular/common/http'
import {InuCacheServices} from './cache.service'

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
  lang               = computed<string>(() => {
    const lang = window.navigator.language.split('-')[0].toUpperCase();
    return this.supportedLanguages().includes(lang) ? lang : 'EN';
  });

  //====================================================================================================================
  // CONSTRUCTOR
  //====================================================================================================================
  constructor() {
    const data: InuLabelResponse | undefined | null = this.cacheServices.getTTL('InuLabelService');
    if (data) {
      this.init(data)
    } else {
      this.httpClient.get<InuLabelResponse>('api/label')
        .subscribe({
                     next: res => {
                       this.cacheServices.setTTL('InuLabelService', res, TTL);
                       this.init(res);
                     }
                   });
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
  getMessage(key?: string, defaultValue?: string): string | undefined {
    const currentLabels = this.labels();
    const currentLang   = this.lang();

    let labelsForLang = currentLabels[currentLang];
    if (!labelsForLang && this.supportedLanguages().length > 0) {
      labelsForLang = currentLabels[this.supportedLanguages()[0]];
    }

    if (!key || !labelsForLang) return defaultValue;

    const label = labelsForLang[key];
    return label?.message ?? defaultValue;
  }


}
