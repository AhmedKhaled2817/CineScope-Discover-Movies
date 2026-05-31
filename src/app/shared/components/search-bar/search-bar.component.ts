import { Component, ChangeDetectionStrategy, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

const RECENT_SEARCHES_KEY = 'cinescope_recent_searches';
const MAX_RECENT_SEARCHES = 5;


@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchBarComponent {
  private router = inject(Router);
  private searchSubject = new Subject<string>();

  searchQuery = '';
  isFocused = signal(false);
  showRecentSearches = signal(false);
  recentSearches = signal<string[]>(this.loadRecentSearches());
  placeholder = signal('Search movies...');

  searchChanged = output<string>();
  searchSubmitted = output<string>();

  constructor() {
    // Setup debounce for real-time search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchChanged.emit(query);
    });
  }

  onInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

  onFocus(): void {
    this.isFocused.set(true);
    this.showRecentSearches.set(true);
  }

  onBlur(): void {
    this.isFocused.set(false);
    // Delay hiding to allow click on dropdown items
    setTimeout(() => {
      this.showRecentSearches.set(false);
    }, 200);
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.addToRecentSearches(this.searchQuery.trim());
      this.searchSubmitted.emit(this.searchQuery.trim());
      this.showRecentSearches.set(false);
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery.trim() }
      });
    }
  }

  onClear(): void {
    this.searchQuery = '';
    this.searchChanged.emit('');
  }

  selectRecentSearch(search: string): void {
    this.searchQuery = search;
    this.onSearch();
  }

  clearRecentSearches(): void {
    this.recentSearches.set([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  }

  private addToRecentSearches(query: string): void {
    const searches = this.recentSearches();
    const filtered = searches.filter(s => s.toLowerCase() !== query.toLowerCase());
    const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    this.recentSearches.set(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }

  private loadRecentSearches(): string[] {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
}
