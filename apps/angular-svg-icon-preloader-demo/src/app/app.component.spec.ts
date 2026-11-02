import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { beforeEach, describe, expect, it } from 'vitest';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	let app: AppComponent;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			providers: [provideAngularSvgIcon(), provideHttpClient()],
		}).compileComponents();

		const fixture = TestBed.createComponent(AppComponent);
		app = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the app', () => {
		expect(app).toBeTruthy();
	});
});
