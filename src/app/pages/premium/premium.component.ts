import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent, FooterComponent } from '../../layout';
import { AuthStore, AuthService } from '../../shared';

@Component({
  selector: 'app-premium',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './premium.component.html',
  styleUrls: ['./premium.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PremiumComponent {
  private auth = inject(AuthStore);
  private authService = inject(AuthService);

  isPremium = this.auth.isPremium;

  upgrade(): void {
    const user = this.auth.user();
    if (!user) return alert('Please sign in first');
    this.authService.upgradeToPremium(user.email).then(() => alert('Upgraded to Premium (demo)'));
  }
}
