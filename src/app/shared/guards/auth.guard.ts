import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../state';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    private auth = inject(AuthStore);
    private router = inject(Router);

    canActivate(): boolean | UrlTree {
        if (this.auth.isAuthenticated()) return true;
        return this.router.parseUrl('/signin');
    }
}
