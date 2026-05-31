import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../state';

@Injectable({ providedIn: 'root' })
export class PremiumGuard implements CanActivate {
    private auth = inject(AuthStore);
    private router = inject(Router);

    canActivate(): boolean | UrlTree {
        if (this.auth.isPremium()) return true;
        // if authenticated but not premium, redirect to upgrade page or signin
        if (this.auth.isAuthenticated()) return this.router.parseUrl('/premium');
        return this.router.parseUrl('/signin');
    }
}
