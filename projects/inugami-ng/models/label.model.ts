import {InjectionToken} from '@angular/core'
import {InuReferentialAPI} from './referential.model'
import {Observable} from 'rxjs'

export const INU_LABEL_SERVICE = new InjectionToken<IInuLabelService>('InuLabelService');

export interface IInuLabelService {
  initialize: () => Observable<any>;
  setDefaultLanguage: (language: string) => void;
  setUrl: (apiUrl: string) => void;
  findLabel: (key ?: string) => InuLabelAPI | undefined;
  getMessage: (key ?: string, defaultValue?: string) => string | undefined;
}

export interface InuLabelAPI {
  key: string;
  message: string;
  id?: string;
  language?: string;
  error?: boolean;
  type?: InuReferentialAPI;
}

export type InuLabelResponse = Record<string, InuLabelAPI[]>;
