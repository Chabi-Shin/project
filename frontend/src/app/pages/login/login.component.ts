import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.onLogin(this.loginForm.value).subscribe({
        next: () => {
          // Optionally handle success actions
          this.loginError = null;
        },
        error: (err) => {
          console.error('Login error:', err);
          // Show user-friendly error message
          this.loginError = 'Invalid email or password';
          this.setFormErrors();
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  private setFormErrors() {
    this.loginForm.get('email')?.setErrors({ incorrect: true });
    this.loginForm.get('password')?.setErrors({ incorrect: true });
  }
}
