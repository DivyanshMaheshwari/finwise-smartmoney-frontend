import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../services/ToastService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
})
export class Register {
  registerForm: FormGroup;
  showPassword = false;
  loading = false;

  private readonly registerUrl = `${environment.authBaseUrl}/register`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toast: ToastService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;

      const form = this.registerForm.value;
      const userData = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
      };

      this.http
        .post(this.registerUrl, userData, { responseType: 'text' })
        .subscribe({
          next: (response) => {
            this.toast.show('✅ Account created successfully!');
            this.router.navigate(['/login']);
            this.loading = false; // also stop loading on success
          },
          error: (error) => {
            // Handle plain string error from backend
            const errorMessage =
              typeof error?.error === 'string' && error.error.trim() !== ''
                ? error.error
                : 'Something went wrong. Please try again.';

            this.toast.show(`❌ Registration failed: ${errorMessage}`);
            this.loading = false; // stop spinner on error
          },
        });
    }
  }
}
