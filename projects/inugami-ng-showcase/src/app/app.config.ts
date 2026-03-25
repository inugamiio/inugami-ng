import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideBrowserGlobalErrorListeners,
  signal
} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule} from 'ngx-google-analytics';
import {INUGAMI_DEFAULT_ICONS, InugamiIconsUtils} from 'inugami-icons';
import {APP_BASE_HREF} from '@angular/common';
import {provideCacheTracking, SVG_ASSETS} from 'inugami-ng/services';
import {INUGAMI_SVG_ASSETS_DEFAULT} from 'inugami-svg-assets';
import {UuidUtils} from 'inugami-ng/utils'

const GOOGLE_ANALYICS = 'G-1683HZCMDJ';

InugamiIconsUtils.register(INUGAMI_DEFAULT_ICONS);
SVG_ASSETS.register(INUGAMI_SVG_ASSETS_DEFAULT)

const APPLICATION = signal<string>('inugami-ng');
const ENV         = signal<string>('PRD');
const SESSION_UID = signal<string>(UuidUtils.buildUid());
const VERSION     = signal<string>('0.0.18');

export const appConfig: ApplicationConfig = {
  providers: [
    provideCacheTracking({
                           env        : ENV,
                           sessionUid : SESSION_UID,
                           application: APPLICATION,
                           version    : VERSION
                         }),
    {
      provide : APP_BASE_HREF,
      useValue: isDevMode() ? '/' : '/showcase/'
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
                              anchorScrolling          : 'enabled',
                              scrollPositionRestoration: 'enabled'
                            })
    ),

    importProvidersFrom(
      NgxGoogleAnalyticsModule.forRoot(GOOGLE_ANALYICS),
      NgxGoogleAnalyticsRouterModule
    )
  ]
};
