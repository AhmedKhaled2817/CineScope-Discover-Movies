import { Component, ChangeDetectionStrategy, inject, signal, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, takeUntil, forkJoin } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieListComponent, OmdbService } from '../../shared';
import { MovieSearchResult, MovieSearchResponse } from '../../shared/models';


@Component({
  selector: 'app-genre',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, MovieListComponent],
  templateUrl: './genre.component.html',
  styleUrls: ['./genre.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenreComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private omdbService = inject(OmdbService);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  loading = signal(true);
  loadingMore = signal(false);
  movies = signal<MovieSearchResult[]>([]);
  genreName = signal('');
  currentPage = signal(1);
  totalResults = signal(0);
  hasMore = signal(false);

  ngOnInit(): void {
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const genre = params.get('genreName');
      if (genre) {
        this.genreName.set(genre);
        this.currentPage.set(1);
        this.movies.set([]);
        this.loadMovies(genre, 1, false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMore(): void {
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);
    this.loadMovies(this.genreName(), nextPage, true);
  }

  private loadMovies(genre: string, page: number, append: boolean): void {
    if (append) {
      this.loadingMore.set(true);
    } else {
      this.loading.set(true);
    }

    // For initial load (page 1), use getMoviesByCategory which already fetches 12
    if (page === 1 && !append) {
      this.omdbService.getMoviesByCategory(genre, 12).subscribe({
        next: (movies) => {
          this.movies.set(movies);
          this.totalResults.set(100); // Approximate, API doesn't give exact for category
          this.hasMore.set(movies.length >= 12);
          this.loading.set(false);
          this.hideInitialLoader();
        },
        error: (error) => {
          console.error('Error loading genre:', error);
          this.loading.set(false);
          this.hideInitialLoader();
        }
      });
    } else {
      // For "Load More", fetch 2 pages to get ~12 more movies
      const page1 = (page - 1) * 2 + 1; // Convert logical page to API pages
      const page2 = page1 + 1;

      forkJoin([
        this.omdbService.searchMovies(genre, page1),
        this.omdbService.searchMovies(genre, page2)
      ]).subscribe({
        next: ([res1, res2]) => {
          const newMovies1 = res1.Response === 'True' ? res1.Search : [];
          const newMovies2 = res2.Response === 'True' ? res2.Search : [];
          const combined = [...newMovies1, ...newMovies2].slice(0, 12);

          const allMovies = [...this.movies(), ...combined];
          this.movies.set(allMovies);
          this.totalResults.set(res1.Response === 'True' ? parseInt(res1.totalResults) : 0);
          this.hasMore.set(combined.length >= 12);
          this.loadingMore.set(false);
        },
        error: (error) => {
          console.error('Error loading genre:', error);
          this.loadingMore.set(false);
        }
      });
    }
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
}
