import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { SkeletonLoaderComponent, RuntimePipe, RatingPipe, OmdbService, WatchlistStore } from '../../shared';
import { MovieDetails } from '../../shared/models';


@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, SkeletonLoaderComponent, RuntimePipe, RatingPipe],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private omdbService = inject(OmdbService);
  private watchlistStore = inject(WatchlistStore);
  private platformId = inject(PLATFORM_ID);

  loading = signal(true);
  movie = signal<MovieDetails | null>(null);
  error = signal<string | null>(null);

  ngOnInit(): void {
    // Check for resolved data first (from route resolver)
    const resolvedMovie = this.route.snapshot.data['movie'];

    if (resolvedMovie && resolvedMovie.Response === 'True') {
      this.movie.set(resolvedMovie);
      this.loading.set(false);
      this.hideInitialLoader();
      return;
    }

    // Fallback: fetch data if resolver didn't provide it
    this.route.paramMap.pipe(
      switchMap(params => {
        const imdbId = params.get('imdbId');
        if (!imdbId) {
          this.error.set('Invalid movie ID');
          this.loading.set(false);
          this.hideInitialLoader();
          return of(null);
        }
        return this.omdbService.getMovieById(imdbId);
      }),
      catchError(err => {
        this.error.set(err.message || 'Failed to load movie details');
        this.loading.set(false);
        this.hideInitialLoader();
        return of(null);
      })
    ).subscribe(movie => {
      if (movie && movie.Response === 'True') {
        this.movie.set(movie);
      } else if (movie) {
        this.error.set(movie.Error || 'Movie not found');
      }
      this.loading.set(false);
      this.hideInitialLoader();
    });
  }

  private hideInitialLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.querySelector('.app-loading') as HTMLElement;
      if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 300);
      }
    }
  }

  getGenres(): string[] {
    const genres = this.movie()?.Genre;
    if (!genres || genres === 'N/A') return [];
    return genres.split(',').map(g => g.trim());
  }

  isInWatchlist(): boolean {
    const movie = this.movie();
    return movie ? this.watchlistStore.isInWatchlist(movie.imdbID) : false;
  }

  toggleWatchlist(): void {
    const movie = this.movie();
    if (!movie) return;

    this.watchlistStore.toggleWatchlist({
      imdbID: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      rating: movie.imdbRating,
      genre: movie.Genre,
      runtime: movie.Runtime
    });
  }

  async shareMovie(): Promise<void> {
    const movie = this.movie();
    if (!movie) return;

    const shareData = {
      title: movie.Title,
      text: `Check out ${movie.Title} (${movie.Year}) on CineScope!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast notification here
        console.log('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/no-poster.svg';
  }
}
