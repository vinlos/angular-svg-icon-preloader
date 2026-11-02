import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
	selector: 'angular-svg-icon-preloader-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	changeDetection: ChangeDetectionStrategy.Eager,
	imports: [SvgIconComponent],
})
export class AppComponent {
	title = 'angular-svg-icon-preloader-demo';
}
