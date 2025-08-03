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

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
})
export class Login {
  loginForm: FormGroup;
  loading: boolean = false;

  private readonly authUrl = `${environment.authBaseUrl}/login`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      emailOrUserId: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials = this.loginForm.value;

      this.http
        .post<{
          token: string;
          userId: string;
          firstName: string;
          lastName: string;
        }>(this.authUrl, credentials)
        .subscribe({
          next: (response) => {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('firstName', response.firstName);
            localStorage.setItem('lastName', response.lastName);
            this.loading = false;
            this.router.navigate(['/dashboard']);
          },
          error: (err) => {
            const message = err?.error?.message || 'Invalid credentials';
            alert('Login failed: ' + message);
            this.loading = false;
          },
        });
    } else {
      alert('Please fill in all fields.');
    }
  }
}
