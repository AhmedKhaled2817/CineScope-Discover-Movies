import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HeaderComponent, FooterComponent } from '../../layout';
import { AuthService } from '../../shared';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SigninComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  passwordVisible = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const { email, password } = this.form.value as { email: string; password: string };

    try {
      await this.auth.login(email.trim(), password);
      this.router.navigateByUrl('/watchlist');
    } catch (err: any) {
      alert(err?.message || 'Sign in failed');
    }
  }
}
