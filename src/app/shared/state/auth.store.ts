import { Injectable, signal, computed, effect } from '@angular/core';

export interface UserProfile {
    name: string;
    email: string;
    isPremium?: boolean;
}

const AUTH_KEY = 'cinescope_auth_user';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private _user = signal<UserProfile | null>(this.loadFromStorage());
    readonly user = this._user.asReadonly();
    readonly isAuthenticated = computed(() => !!this._user());
    readonly isPremium = computed(() => !!this._user() && !!this._user()!.isPremium);

    constructor() {
        effect(() => this.saveToStorage(this._user()));
    }

    setUser(user: UserProfile | null): void {
        this._user.set(user);
    }

    clear(): void {
        this._user.set(null);
    }

    private loadFromStorage(): UserProfile | null {
        try {
            const stored = localStorage.getItem(AUTH_KEY);
            return stored ? JSON.parse(stored) : null;
        } catch {
            return null;
        }
    }

    private saveToStorage(user: UserProfile | null): void {
        try {
            if (user) {
                localStorage.setItem(AUTH_KEY, JSON.stringify(user));
            } else {
                localStorage.removeItem(AUTH_KEY);
            }
        } catch {
            // ignore
        }
    }
}
