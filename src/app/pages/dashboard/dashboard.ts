import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getMonth, getYear, format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/AuthService';

// ✅ Import environment
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  providers: [AuthService],
})
export class Dashboard implements OnInit {
  summary: any;
  loading: boolean = false;
  months: { name: string; value: number }[] = [];
  years: number[] = [];
  selectedMonth: number = getMonth(new Date()) + 1;
  selectedYear: number = getYear(new Date());

  // ✅ Use base URL from environment
  private readonly baseUrl = `${environment.apiBaseUrl}/summary`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.generateMonths();
    this.generateYears();
    this.loadDashboardData();
  }

  generateMonths() {
    this.months = Array.from({ length: 12 }, (_, i) => ({
      name: format(new Date(2000, i, 1), 'MMMM'),
      value: i + 1,
    }));
  }

  generateYears() {
    const currentYear = getYear(new Date());
    this.years = Array.from({ length: 6 }, (_, i) => currentYear - i);
  }

  loadDashboardData(): void {
    this.loading = true;
    const apiUrl = `${this.baseUrl}?month=${this.selectedMonth}&year=${this.selectedYear}`;
    this.http.get(apiUrl).subscribe({
      next: (response: any) => {
        this.summary = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onMonthYearChange(): void {
    this.loadDashboardData();
  }

  logout(): void {
    this.authService.logout();
  }
}
