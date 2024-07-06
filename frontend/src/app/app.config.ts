import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { httpInterceptor } from './core/interceptors/http.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([httpInterceptor])),
    importProvidersFrom(BrowserAnimationsModule)
  ]
};
