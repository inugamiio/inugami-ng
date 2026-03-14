import {ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import {provideRouter, withInMemoryScrolling} from '@angular/router';

import {routes} from './app.routes';
import {NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule} from 'ngx-google-analytics';
import {INUGAMI_DEFAULT_ICONS, InugamiIconsUtils} from 'inugami-icons';
import { isDevMode } from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {SVG_ASSETS} from 'inugami-ng/services';
import {INUGAMI_SVG_ASSETS_DEFAULT} from 'inugami-svg-assets';
const GOOGLE_ANALYICS = 'G-1683HZCMDJ';

InugamiIconsUtils.register(INUGAMI_DEFAULT_ICONS);
SVG_ASSETS.register(INUGAMI_SVG_ASSETS_DEFAULT)

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: isDevMode() ? '/' : '/showcase/'
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        anchorScrolling: 'enabled',
        scrollPositionRestoration: 'enabled'
      })
    ),
    importProvidersFrom(
      NgxGoogleAnalyticsModule.forRoot(GOOGLE_ANALYICS),
      NgxGoogleAnalyticsRouterModule
    )
  ]
};
