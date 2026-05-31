import { Component, ChangeDetectionStrategy, input, ElementRef, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MovieCardComponent } from '../movie-card/movie-card.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { MovieSearchResult } from '../../models';


@Component({
  selector: 'app-movie-carousel',
  standalone: true,
  imports: [CommonModule, MovieCardComponent, SkeletonLoaderComponent],
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovieCarouselComponent {
  title = input.required<string>();
  movies = input<MovieSearchResult[]>([]);
  loading = input<boolean>(false);

  carouselTrack = viewChild<ElementRef<HTMLDivElement>>('carouselTrack');

  skeletonCount = Array.from({ length: 8 }, (_, i) => i + 1);

  scroll(direction: 'left' | 'right'): void {
    const track = this.carouselTrack()?.nativeElement;
    if (!track) return;

    const scrollAmount = track.clientWidth * 0.8;
    const newPosition = direction === 'left'
      ? track.scrollLeft - scrollAmount
      : track.scrollLeft + scrollAmount;

    track.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  }
}
