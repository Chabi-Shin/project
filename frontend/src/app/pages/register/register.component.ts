import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class RegisterComponent {
  registerForm: FormGroup;
  registerError: string | null = null;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.onRegister(this.registerForm.value).subscribe({
        next: () => {
          this.registerError = null;
          this.router.navigate(['']);  // Navigate to login page after successful registration
        },
        error: (err) => {
          console.error('Registration error:', err);
          this.registerError = 'Failed to register user';
        },
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}

