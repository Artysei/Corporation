import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { App } from './app/app';
import routes from './app/app.routes';
import { apiInterceptor } from './app/core/api.interceptor';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiInterceptor])),
    importProvidersFrom(NgbModule)
  ]
}).catch(err => console.error(err));
