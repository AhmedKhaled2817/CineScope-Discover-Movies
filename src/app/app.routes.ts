import { Routes } from '@angular/router';
import { movieResolver } from './shared/resolvers';
import { AuthGuard } from './shared';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        title: 'CineScope - Discover Movies'
    },
    {
        path: 'movie/:imdbId',
        loadComponent: () => import('./pages/movie-details/movie-details.component').then(m => m.MovieDetailsComponent),
        title: 'Movie Details - CineScope',
        resolve: { movie: movieResolver }
    },
    {
        path: 'search',
        loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent),
        title: 'Search Movies - CineScope'
    },
    {
        path: 'watchlist',
        loadComponent: () => import('./pages/watchlist/watchlist.component').then(m => m.WatchlistComponent),
        title: 'My Watchlist - CineScope',
        canActivate: [AuthGuard]
    },
    {
        path: 'signin',
        loadComponent: () => import('./pages/signin/signin.component').then(m => m.SigninComponent),
        title: 'Sign In - CineScope'
    },
    {
        path: 'signup',
        loadComponent: () => import('./pages/signup/signup.component').then(m => m.SignupComponent),
        title: 'Sign Up - CineScope'
    },
    {
        path: 'genre/:genreName',
        loadComponent: () => import('./pages/genre/genre.component').then(m => m.GenreComponent),
        title: 'Browse Genre - CineScope'
    },
    {
        path: 'premium',
        loadComponent: () => import('./pages/premium/premium.component').then(m => m.PremiumComponent),
        title: 'Premium - CineScope',
        canActivate: [AuthGuard]
    },
    {
        path: '**',
        redirectTo: 'home'
    }
];
