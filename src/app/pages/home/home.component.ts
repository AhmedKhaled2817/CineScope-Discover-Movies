import { Component, ChangeDetectionStrategy, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieCarouselComponent, OmdbService } from '../../shared';
import { MovieSearchResult } from '../../shared/models';

interface CategoryData {
  title: string;
  keyword: string;
  movies: MovieSearchResult[];
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, MovieCarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  private omdbService = inject(OmdbService);
  private platformId = inject(PLATFORM_ID);

  loading = signal(true);
  featuredMovie = signal<MovieSearchResult | null>(null);
  categories = signal<CategoryData[]>([
    { title: 'Action Movies', keyword: 'action', movies: [] },
    { title: 'Comedy Movies', keyword: 'comedy', movies: [] },
    { title: 'Drama Movies', keyword: 'drama', movies: [] },
    { title: 'Thriller Movies', keyword: 'thriller', movies: [] }
  ]);

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    const categoryKeywords = ['action', 'comedy', 'drama', 'thriller'];

    const requests = categoryKeywords.map(keyword =>
      this.omdbService.getMoviesByCategory(keyword)
    );

    forkJoin(requests).subscribe({
      next: (results) => {
        const updatedCategories = this.categories().map((cat, index) => ({
          ...cat,
          movies: results[index] || []
        }));

        this.categories.set(updatedCategories);

        // Set featured movie from first category
        if (results[0] && results[0].length > 0) {
          // Pick a random movie from action for featured
          const randomIndex = Math.floor(Math.random() * Math.min(5, results[0].length));
          this.featuredMovie.set(results[0][randomIndex]);
        }

        this.loading.set(false);
        this.hideInitialLoader();
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading.set(false);
      }
    });
  }

  private hideInitialLoader(): void {
    if (isPlatformBrowser(this.platformId)) {
      const loader = document.querySelector('.app-loading') as HTMLElement;
      if (loader) {
        loader.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => loader.remove(), 300);
      }
    }
  }
}
