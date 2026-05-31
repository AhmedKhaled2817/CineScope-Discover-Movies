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
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  passwordVisible = false;
  confirmPasswordVisible = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, Validators.requiredTrue]
  }, { validators: this.passwordMatchValidator });

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility(): void {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return this.form.markAllAsTouched();

    const { name, email, password } = this.form.value as {
      name: string; email: string; password: string;
    };

    try {
      await this.auth.register(name.trim(), email.trim(), password);
      this.router.navigateByUrl('/watchlist');
    } catch (err: any) {
      alert(err?.message || 'Sign up failed');
    }
  }

  private passwordMatchValidator(control: import('@angular/forms').AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }
}
