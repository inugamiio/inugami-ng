import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {App} from './app/app';
const baseHref = document.getElementsByTagName('base')[0]?.href || '/';

async function prepareApp() {
  const { worker } = await import('./mock/browser');
  return worker.start({
                        serviceWorker     : {
                          url: `${baseHref}mockServiceWorker.js`,
                          options: {
                            scope: '/'
                          }
                        },
                        onUnhandledRequest: 'bypass'
                      });
}

prepareApp().then(()=>{
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
})
