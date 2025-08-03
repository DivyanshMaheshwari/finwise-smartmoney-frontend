import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/ToastService';
import { ConfirmationModal } from '../components/confirmation-modal/confirmation-modal';
import { environment } from '../../environments/environment';

interface IncomePayload {
  amount: number | null;
  date: string;
  category: string;
  source: string;
  isRecurring: boolean;
  note: string;
  frequency?: string;
  endDate?: string;
  recurringDay?: number;
}

interface IncomeResponse {
  id: string;
  amount: number;
  date: string;
  category: string;
  source: string;
  note: string;
  isRecurring: boolean;
}

@Component({
  selector: 'app-income-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './income-form.html',
})
export class IncomeForm implements OnInit {
  income: IncomePayload = {
    amount: null,
    date: '',
    category: '',
    source: '',
    isRecurring: false,
    note: '',
  };

  incomeList: IncomeResponse[] = [];
  loading = false;
  incomeListLoading = false;
  deletingIds: Set<string> = new Set();

  showConfirmModal = false;
  pendingDeleteId: string | null = null;

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  // ✅ Step 2: Use baseUrl for all HTTP requests
  private readonly baseUrl = `${environment.apiBaseUrl}/income`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() {
    this.fetchIncome(this.selectedMonth, this.selectedYear);
  }

  onRecurringToggle() {
    if (this.income.isRecurring) {
      this.income.frequency = 'MONTHLY';
    } else {
      this.income.frequency = undefined;
      this.income.endDate = undefined;
      this.income.recurringDay = undefined;
    }
  }

  submitIncome() {
    const payload = { ...this.income };

    if (!payload.isRecurring) {
      delete payload.frequency;
      delete payload.endDate;
      delete payload.recurringDay;
    }

    this.loading = true;
    this.http
      .post(`${this.baseUrl}`, payload, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Income added successfully!');
          this.resetForm();
          this.fetchIncome(this.selectedMonth, this.selectedYear);
        },
        error: (err) => {
          console.error('Error response:', err);
          this.toast.show('Failed to add income');
        },
        complete: () => (this.loading = false),
      });
  }

  fetchIncome(month: number, year: number) {
    this.incomeListLoading = true;

    this.http
      .get<IncomeResponse[]>(`${this.baseUrl}?month=${month}&year=${year}`)
      .subscribe({
        next: (res) => {
          this.incomeList = res;
        },
        error: (err) => {
          console.error('Failed to fetch income list', err);
        },
        complete: () => {
          this.incomeListLoading = false;
        },
      });
  }

  resetForm() {
    this.income = {
      amount: null,
      date: '',
      category: '',
      source: '',
      isRecurring: false,
      note: '',
    };
  }

  onMonthYearChange(selection: { month: number; year: number }) {
    this.selectedMonth = selection.month;
    this.selectedYear = selection.year;
    this.fetchIncome(this.selectedMonth, this.selectedYear);
  }

  confirmDelete(id: string) {
    this.pendingDeleteId = id;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
    this.showConfirmModal = false;
  }

  deleteIncome(id: string) {
    this.deletingIds.add(id);

    this.http
      .delete(`${this.baseUrl}/remove/${id}`, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Income deleted successfully');
          this.fetchIncome(this.selectedMonth, this.selectedYear);
        },
        error: (err) => {
          console.error('Failed to delete income', err);
          this.toast.show('Failed to delete income');
        },
        complete: () => {
          this.deletingIds.delete(id);
          this.showConfirmModal = false;
          this.pendingDeleteId = null;
        },
      });
  }

  get isDeleting(): boolean {
    return this.pendingDeleteId !== null && this.deletingIds.has(this.pendingDeleteId);
  }
}
