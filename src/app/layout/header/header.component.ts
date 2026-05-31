import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WatchlistStore, AuthStore, AuthService } from '../../shared';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  private watchlistStore = inject(WatchlistStore);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private authService = inject(AuthService);

  isMobileMenuOpen = signal(false);
  showGenreMenu = signal(false);
  showProfileMenu = signal(false);
  isSearchOpen = signal(false);
  searchQuery = '';

  watchlistCount = this.watchlistStore.count;
  isAuthenticated = this.authStore.isAuthenticated;
  userName = computed(() => this.authStore.user() ? this.authStore.user()!.name : 'User');
  isPremium = this.authStore.isPremium;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  toggleSearchModal(): void {
    this.isSearchOpen.update(v => !v);
    if (this.isSearchOpen()) {
      this.searchQuery = '';
      // Focus input after modal opens
      setTimeout(() => {
        const input = document.querySelector('.search-modal__input') as HTMLInputElement;
        input?.focus();
      }, 100);
    }
  }

  closeSearchModal(): void {
    this.isSearchOpen.set(false);
  }

  performSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.closeSearchModal();
    }
  }

  signOut(): void {
    this.authService.logout();
    this.router.navigateByUrl('/home');
    this.showProfileMenu.set(false);
  }

  toggleProfileMenu(): void {
    this.showProfileMenu.update(v => !v);
  }

  upgrade(): void {
    const user = this.authStore.user();
    if (!user) { this.router.navigateByUrl('/signin'); return; }
    this.authService.upgradeToPremium(user.email).then(() => {
      alert('Upgraded to Premium (demo)');
    }).catch(err => alert(err.message || 'Upgrade failed'));
  }

  downgrade(): void {
    const user = this.authStore.user();
    if (!user) return;
    this.authService.downgradeFromPremium(user.email).then(() => {
      alert('Downgraded from Premium');
    }).catch(err => alert(err.message || 'Downgrade failed'));
  }
}
