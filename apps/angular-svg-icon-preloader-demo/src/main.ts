import { enableProdMode, importProvidersFrom } from '@angular/core';

import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

import {
	provideHttpClient,
	withInterceptorsFromDi,
	withXhr,
} from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { AngularSvgIconPreloaderModule } from 'angular-svg-icon-preloader';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		provideAngularSvgIcon(),
		importProvidersFrom(
			BrowserModule,
			AngularSvgIconPreloaderModule.forRoot({
				configUrl: './assets/json/icons.json',
			}),
		),
		provideHttpClient(withXhr(), withInterceptorsFromDi()),
	],
}).catch((err) => console.error(err));
