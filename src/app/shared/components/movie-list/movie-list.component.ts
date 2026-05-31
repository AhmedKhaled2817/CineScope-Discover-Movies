import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { MovieSearchResult } from '../../models';


@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonLoaderComponent],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieListComponent {
  movies = input<MovieSearchResult[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No movies found');
  showWatchlistButton = input<boolean>(true);

  // Number of skeleton cards to show while loading
  skeletonCount = Array.from({ length: 10 }, (_, i) => i + 1);
}
