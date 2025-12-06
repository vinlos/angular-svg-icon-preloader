import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { EMPTY, Subject } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';
import { AngularSvgIconPreloaderConfig } from '../angular-svg-icon-preloader-config.class';
import { IconConfig } from '../icon-config.interface';
import { CustomIconData, IconImageFile } from '../icon.interface';

@Injectable({
	providedIn: 'root',
})
export class AngularSvgIconPreloaderService {
	private readonly _http = inject(HttpClient);
	private readonly _iconRegistry = inject(SvgIconRegistryService);

	private readonly configUrl: string = './assets/icons.json';
	private iconsFileData: IconConfig = { customIcons: [], iconImageFiles: [] };
	public configSubject: Subject<IconConfig> = new Subject<IconConfig>();

	constructor() {
		const config = inject(AngularSvgIconPreloaderConfig, {
			optional: true,
		});

		if (config?.configUrl) {
			this.configUrl = config.configUrl;
		}
	}

	loadConfig() {
		return this._http.get<IconConfig>(this.configUrl).pipe(
			tap((configData) => {
				this.iconsFileData = configData;
				this.loadIcons();
			}),
			catchError((err) => {
				console.error(
					'An error occurred loading the icons:\n',
					err,
					'\nNo icons will be loaded.',
				);
				this.iconsFileData = {
					customIcons: [],
					iconImageFiles: [],
				};
				this.loadIcons();
				return EMPTY;
			}),
		);
	}

	loadIcons() {
		this.iconsFileData.iconImageFiles.forEach((i: IconImageFile) => {
			const iconObs = this._iconRegistry.loadSvg(i.iconPath, i.iconName);

			if (iconObs) {
				iconObs.pipe(take(1)).subscribe();
			}
		});
		this.iconsFileData.customIcons.forEach((i: CustomIconData) => {
			this._iconRegistry.addSvg(i.iconName, i.iconData);
		});
	}
}
