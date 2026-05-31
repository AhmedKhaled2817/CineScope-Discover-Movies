import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class App implements OnInit, OnDestroy {
  private router = inject(Router);
  private routerSubscription?: Subscription;
  isNavigating = signal(false);

  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart && this.router.navigated) {
        this.isNavigating.set(true);
      }

      if (event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError) {
        setTimeout(() => this.isNavigating.set(false), 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
