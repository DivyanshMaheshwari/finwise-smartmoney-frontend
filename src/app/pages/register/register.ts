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
import { environment } from '../../environments/environment';

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
  private readonly registerUrl = `${environment.authBaseUrl}/register`;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
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
      const userData = this.registerForm.value;
      this.http
        .post(this.registerUrl, userData, {
          responseType: 'text',
        })
        .subscribe({
          next: (response) => {
            alert(response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            alert('Registration failed: ' + (error?.error || 'Unknown error'));
          },
        });
    }
  }
}
