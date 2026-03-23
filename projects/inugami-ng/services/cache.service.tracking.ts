import {EnvironmentProviders, Injectable, makeEnvironmentProviders, signal, WritableSignal} from '@angular/core'
import {UuidUtils} from 'inugami-ng/services'

export interface CacheServiceTrackingOptions {
  env: WritableSignal<string>,
  sessionUid: WritableSignal<string>,
  application: WritableSignal<string>,
  version: WritableSignal<string>
}

export function provideCacheTracking(options: CacheServiceTrackingOptions): EnvironmentProviders {
  return makeEnvironmentProviders([
                                    {
                                      provide : CacheServiceTracking,
                                      useValue: new CacheServiceTracking(options)
                                    }
                                  ]);
}


export class CacheServiceTracking {
  env         = signal<string>('dev');
  sessionUid  = signal<string>(UuidUtils.buildUid());
  application = signal<string>('');
  version     = signal<string>('');


  constructor(options: CacheServiceTrackingOptions) {
    this.env         = options.env;
    this.sessionUid  = options.sessionUid;
    this.application = options.application;
    this.version     = options.version;
  }

}
