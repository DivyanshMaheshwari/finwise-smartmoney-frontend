import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/ToastService';
import { ConfirmationModal } from '../components/confirmation-modal/confirmation-modal';

// ✅ Import environment
import { environment } from '../../environments/environment';

interface ExpensePayload {
  amount: number | null;
  date: string;
  category: string;
  type: string;
  paymentMode: string;
  isRecurring: boolean;
  note: string;
  frequency?: string;
  endDate?: string;
  recurringDay?: number;
}

interface ExpenseResponse {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: string;
  paymentMode: string;
  note: string;
  isRecurring: boolean;
}

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './expense-form.html',
})
export class ExpenseForm implements OnInit {
  expense: ExpensePayload = {
    amount: null,
    date: '',
    category: '',
    type: '',
    paymentMode: '',
    isRecurring: false,
    note: '',
    frequency: undefined,
    endDate: undefined,
    recurringDay: undefined,
  };

  expenseList: ExpenseResponse[] = [];
  loading = false;
  expenseListLoading = false;

  categoryList = ['Rent', 'Subscription', 'Utilities', 'Travel', 'Other'];
  selectedCategory = '';
  customCategory = '';
  showCustomCategory = false;

  customPaymentMode = '';
  selectedPaymentMode = '';

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();

  showConfirmModal = false;
  pendingDeleteId: string | null = null;
  deletingIds: Set<string> = new Set();

  // ✅ Define backend base URL
  private readonly baseUrl = `${environment.apiBaseUrl}/expense`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() {
    this.fetchExpenses(this.selectedMonth, this.selectedYear);
  }

  onRecurringToggle() {
    if (this.expense.isRecurring) {
      this.expense.frequency = 'MONTHLY';
    } else {
      this.expense.frequency = undefined;
      this.expense.endDate = undefined;
      this.expense.recurringDay = undefined;
    }
  }

  onCategoryChange(value: string) {
    this.showCustomCategory = value === 'Other';
    this.expense.category = value;
  }

  onPaymentModeChange() {
    if (this.selectedPaymentMode !== 'Other') {
      this.expense.paymentMode = this.selectedPaymentMode;
      this.customPaymentMode = '';
    } else {
      this.expense.paymentMode = '';
    }
  }

  updateCustomPaymentMode() {
    this.expense.paymentMode = this.customPaymentMode;
  }

  submitExpense() {
    if (this.expense.category === 'Other') {
      if (!this.customCategory.trim()) {
        alert('Please specify a custom category.');
        return;
      }
      this.expense.category = this.customCategory.trim();
    }

    if (this.selectedPaymentMode === 'Other') {
      if (!this.customPaymentMode.trim()) {
        alert('Please specify a custom payment mode.');
        return;
      }
      this.expense.paymentMode = this.customPaymentMode.trim();
    }

    if (!this.expense.isRecurring) {
      this.expense.frequency = undefined;
      this.expense.endDate = undefined;
      this.expense.recurringDay = undefined;
    }

    this.loading = true;
    this.http
      .post(`${this.baseUrl}`, this.expense, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Expense added successfully!');
          this.resetForm();
          this.fetchExpenses(this.selectedMonth, this.selectedYear);
        },
        error: (err) => {
          console.error('Error response:', err);
          alert('Failed to add expense');
        },
        complete: () => (this.loading = false),
      });
  }

  fetchExpenses(month: number, year: number) {
    this.expenseListLoading = true;
    setTimeout(() => {
      this.http
        .get<ExpenseResponse[]>(`${this.baseUrl}?month=${month}&year=${year}`)
        .subscribe({
          next: (res) => {
            this.expenseList = res;
            this.expenseListLoading = false;
          },
          error: (err) => {
            console.error('Failed to fetch expense list', err);
            this.expenseListLoading = false;
          },
        });
    }, 100);
  }

  resetForm() {
    this.expense = {
      amount: null,
      date: '',
      category: '',
      type: '',
      paymentMode: '',
      isRecurring: false,
      note: '',
      frequency: undefined,
      endDate: undefined,
      recurringDay: undefined,
    };
    this.selectedPaymentMode = '';
    this.customPaymentMode = '';
    this.selectedCategory = '';
    this.customCategory = '';
    this.showCustomCategory = false;
  }

  onMonthYearChange(selection: { month: number; year: number }) {
    this.selectedMonth = selection.month;
    this.selectedYear = selection.year;
    this.fetchExpenses(this.selectedMonth, this.selectedYear);
  }

  confirmDelete(id: string) {
    this.pendingDeleteId = id;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.pendingDeleteId = null;
  }

  get isDeleting(): boolean {
    return this.pendingDeleteId !== null && this.deletingIds.has(this.pendingDeleteId);
  }

  deleteExpense(id: string) {
    this.deletingIds.add(id);

    this.http
      .delete(`${this.baseUrl}/remove/${id}`, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Expense deleted successfully');
          this.fetchExpenses(this.selectedMonth, this.selectedYear);
        },
        error: (err) => {
          console.error('Failed to delete expense', err);
          alert('Failed to delete expense');
        },
        complete: () => {
          this.deletingIds.delete(id);
          this.showConfirmModal = false;
          this.pendingDeleteId = null;
        },
      });
  }
}
