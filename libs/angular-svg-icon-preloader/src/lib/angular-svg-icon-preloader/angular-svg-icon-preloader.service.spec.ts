import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AngularSvgIconPreloaderService } from './angular-svg-icon-preloader.service';
import { HttpClient } from '@angular/common/http';
import { AngularSvgIconPreloaderConfig } from '../angular-svg-icon-preloader-config.class';
import { SvgIconRegistryService } from 'angular-svg-icon';

const DEMO_ICONS_JSON = {
	iconImageFiles: [
		{
			iconName: 'badge-check',
			iconPath: '/assets/icons/badge-check.svg',
		},
	],
	customIcons: [
		{
			iconName: 'academic-cap',
			iconData:
				'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"> <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" /> </svg>',
		},
	],
};

describe('AngularSvgIconPreloaderService', () => {
	let service: AngularSvgIconPreloaderService;
	let httpClientSpy: jasmine.SpyObj<HttpClient>;
	let svgIconRegistryServiceSpy: jasmine.SpyObj<SvgIconRegistryService>;
	let mockConfig: AngularSvgIconPreloaderConfig;

	beforeEach(() => {
		httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
		svgIconRegistryServiceSpy = jasmine.createSpyObj(
			'SvgIconRegistryService',
			['loadSvg', 'addSvg'],
		);
		mockConfig = new AngularSvgIconPreloaderConfig();

		TestBed.configureTestingModule({
			providers: [
				AngularSvgIconPreloaderService,
				{ provide: HttpClient, useValue: httpClientSpy },
				{
					provide: AngularSvgIconPreloaderConfig,
					useValue: mockConfig,
				},
				{
					provide: SvgIconRegistryService,
					useValue: svgIconRegistryServiceSpy,
				},
			],
		});

		service = TestBed.inject(AngularSvgIconPreloaderService);
		svgIconRegistryServiceSpy.loadSvg.and.returnValue(of(undefined));
	});

	it('should call the load icons method', (done) => {
		httpClientSpy.get.and.returnValue(of(DEMO_ICONS_JSON));

		service.loadConfig().subscribe(() => {
			expect(svgIconRegistryServiceSpy.loadSvg).toHaveBeenCalledTimes(1);
			expect(svgIconRegistryServiceSpy.addSvg).toHaveBeenCalledTimes(1);
			done();
		});
	});

	it('should handle an error when loading the JSON file', fakeAsync(() => {
		httpClientSpy.get.and.returnValue(
			throwError(() => new Error('JSON File Loading Error')),
		);

		service.loadConfig().subscribe({
			next: () => {
				fail('expected an error, not success');
			},
			error: () => {
				fail('expected error to be caught and handled');
			},
		});

		tick(1000);

		expect(svgIconRegistryServiceSpy.loadSvg).toHaveBeenCalledTimes(0);
		expect(svgIconRegistryServiceSpy.addSvg).toHaveBeenCalledTimes(0);
	}));
});
