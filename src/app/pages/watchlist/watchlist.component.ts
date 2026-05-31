import { Component, ChangeDetectionStrategy, inject, computed, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent, FooterComponent } from '../../layout';
import { MovieListComponent, WatchlistStore } from '../../shared';
import { MovieSearchResult } from '../../shared/models';


@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent, MovieListComponent],
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WatchlistComponent implements OnInit {
  private watchlistStore = inject(WatchlistStore);
  private platformId = inject(PLATFORM_ID);

  watchlistCount = this.watchlistStore.count;

  // Convert watchlist to SearchResult format for MovieList
  watchlistAsSearchResults = computed<MovieSearchResult[]>(() => {
    return this.watchlistStore.watchlist().map(item => ({
      Title: item.title,
      Year: item.year,
      imdbID: item.imdbID,
      Type: 'movie',
      Poster: item.poster
    }));
  });

  ngOnInit(): void {
    // Hide initial loader immediately since watchlist data comes from local storage
    this.hideInitialLoader();
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

  clearAll(): void {
    if (confirm('Are you sure you want to clear your watchlist?')) {
      this.watchlistStore.clearWatchlist();
    }
  }
}

