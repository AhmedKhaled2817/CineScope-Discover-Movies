import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MovieSearchResult } from '../../models';
import { LazyImageDirective } from '../../directives';
import { RatingPipe } from '../../pipes';
import { WatchlistStore } from '../../state';


@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterLink, LazyImageDirective, RatingPipe],
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCardComponent {
  private watchlistStore = inject(WatchlistStore);

  movie = input.required<MovieSearchResult>();
  showRating = input<boolean>(false);
  showWatchlistButton = input<boolean>(true);
  rating = input<string>('');

  watchlistToggled = output<MovieSearchResult>();

  isInWatchlist(): boolean {
    return this.watchlistStore.isInWatchlist(this.movie().imdbID);
  }

  onWatchlistClick(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const movie = this.movie();
    this.watchlistStore.toggleWatchlist({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster
    });

    this.watchlistToggled.emit(movie);
  }
}
