import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHighlightJsConfig } from 'ngx-highlight-js';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { INUGAMI_DEFAULT_ICONS, InugamiIconsUtils } from 'inugami-icons';

const GOOGLE_ANALYICS = 'G-1683HZCMDJ';

InugamiIconsUtils.register(INUGAMI_DEFAULT_ICONS);

export const appConfig: ApplicationConfig = {
  providers: [
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
