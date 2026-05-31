import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonLoaderComponent {
  type = input<'card' | 'text' | 'detail' | 'circle'>('text');
  width = input<string>('100%');
  height = input<string>('');
}
