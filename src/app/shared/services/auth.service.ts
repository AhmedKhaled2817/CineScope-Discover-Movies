import { Injectable, inject } from '@angular/core';
import { AuthStore, UserProfile } from '../state';

const USERS_KEY = 'cinescope_users';

interface StoredUser {
    name: string;
    email: string;
    password: string; // stored in plaintext for demo only
    isPremium?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private authStore = inject(AuthStore);

    register(name: string, email: string, password: string): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
            const users = this.loadUsers();
            if (users.find(u => u.email === email)) {
                return reject(new Error('Email already registered'));
            }

            users.push({ name, email, password, isPremium: false });
            this.saveUsers(users);

            const profile: UserProfile = { name, email, isPremium: false };
            this.authStore.setUser(profile);
            resolve(profile);
        });
    }

    login(email: string, password: string): Promise<UserProfile> {
        return new Promise((resolve, reject) => {
            const users = this.loadUsers();
            const found = users.find(u => u.email === email && u.password === password);
            if (!found) return reject(new Error('Invalid credentials'));

            const profile: UserProfile = { name: found.name, email: found.email, isPremium: !!found.isPremium };
            this.authStore.setUser(profile);
            resolve(profile);
        });
    }

    logout(): void {
        this.authStore.clear();
    }

    upgradeToPremium(email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const users = this.loadUsers();
            const found = users.find(u => u.email === email);
            if (!found) return reject(new Error('User not found'));
            found.isPremium = true;
            this.saveUsers(users);
            const current = this.authStore.user();
            if (current && current.email === email) {
                this.authStore.setUser({ ...current, isPremium: true });
            }
            resolve();
        });
    }

    downgradeFromPremium(email: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const users = this.loadUsers();
            const found = users.find(u => u.email === email);
            if (!found) return reject(new Error('User not found'));
            found.isPremium = false;
            this.saveUsers(users);
            const current = this.authStore.user();
            if (current && current.email === email) {
                this.authStore.setUser({ ...current, isPremium: false });
            }
            resolve();
        });
    }

    private loadUsers(): StoredUser[] {
        try {
            const s = localStorage.getItem(USERS_KEY);
            return s ? JSON.parse(s) : [];
        } catch {
            return [];
        }
    }

    private saveUsers(users: StoredUser[]): void {
        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch {
            // ignore
        }
    }
}
