import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AngularSvgIconPreloaderConfig } from '../angular-svg-icon-preloader-config.class';
import { AngularSvgIconPreloaderService } from './angular-svg-icon-preloader.service';

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
	let httpClientSpy: HttpClient;
	let svgIconRegistryServiceSpy: SvgIconRegistryService;
	let mockConfig: AngularSvgIconPreloaderConfig;

	beforeEach(() => {
		mockConfig = new AngularSvgIconPreloaderConfig();

		TestBed.configureTestingModule({
			providers: [
				AngularSvgIconPreloaderService,
				{
					provide: HttpClient,
					useValue: {
						get: vi.fn().mockName('HttpClient.get'),
					},
				},
				{
					provide: AngularSvgIconPreloaderConfig,
					useValue: mockConfig,
				},
				{
					provide: SvgIconRegistryService,
					useValue: {
						loadSvg: vi
							.fn()
							.mockReturnValue(of(undefined))
							.mockName('SvgIconRegistryService.loadSvg'),
						addSvg: vi
							.fn()
							.mockName('SvgIconRegistryService.addSvg'),
					},
				},
			],
		});

		service = TestBed.inject(AngularSvgIconPreloaderService);
		httpClientSpy = TestBed.inject(HttpClient);
		svgIconRegistryServiceSpy = TestBed.inject(SvgIconRegistryService);
	});

	it('should call the load icons method', async () => {
		vi.spyOn(httpClientSpy, 'get').mockReturnValue(of(DEMO_ICONS_JSON));

		service.loadConfig().subscribe(() => {
			expect(svgIconRegistryServiceSpy.loadSvg).toHaveBeenCalledTimes(1);
			expect(svgIconRegistryServiceSpy.addSvg).toHaveBeenCalledTimes(1);
		});
	});

	it('should handle an error when loading the JSON file', () => {
		vi.spyOn(httpClientSpy, 'get').mockReturnValue(
			throwError(() => new Error('JSON File Loading Error')),
		);

		service.loadConfig().subscribe({
			next: () => {
				expect.fail('expected an error, not success');
			},
			error: () => {
				expect.fail('expected error to be caught and handled');
			},
		});

		expect(svgIconRegistryServiceSpy.loadSvg).toHaveBeenCalledTimes(0);
		expect(svgIconRegistryServiceSpy.addSvg).toHaveBeenCalledTimes(0);
	});
});
