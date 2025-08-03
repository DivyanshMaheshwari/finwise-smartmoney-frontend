import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../services/ToastService';
import { ConfirmationModal } from '../components/confirmation-modal/confirmation-modal';

interface SavingPayload {
  amount: number | null;
  date: string;
  category: string;
  note: string;
  isRecurring: boolean;
  frequency?: string;
  endDate?: string;
  recurringDay?: number;
}

interface SavingResponse {
  id: string;
  amount: number;
  date: string;
  category: string;
  note: string;
  isRecurring: boolean;
  frequency?: string;
  recurringDay?: number;
  endDate?: string;
}

@Component({
  selector: 'app-saving-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModal],
  templateUrl: './saving-form.html',
})
export class SavingForm implements OnInit {
  saving: SavingPayload = {
    amount: null,
    date: '',
    category: '',
    note: '',
    isRecurring: false,
    frequency: undefined,
    endDate: undefined,
    recurringDay: undefined,
  };

  savingList: SavingResponse[] = [];
  loading = false;
  savingListLoading = false;
  deletingIds: Set<string> = new Set();

  showCustomCategory = false;
  customCategory = ''; // <-- Add this
  showConfirmModal = false;
  pendingDeleteId: string | null = null;

  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  activeTab: 'add' | 'use' | 'total' = 'add';

  category: string[] = [
    'FD',
    'RD',
    'Emergency Fund',
    'SIP',
    'Stocks',
    'Crypto',
    'Gold',
    'Gold',
    'Silver',
    'Other',
  ];

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit() {
    this.fetchSavings();
  }

  onRecurringToggle() {
    if (this.saving.isRecurring) {
      this.saving.frequency = 'MONTHLY';
    } else {
      this.saving.frequency = undefined;
      this.saving.endDate = undefined;
      this.saving.recurringDay = undefined;
    }
  }

  submitSaving() {
    const payload = { ...this.saving };

    if (!payload.isRecurring) {
      delete payload.frequency;
      delete payload.endDate;
      delete payload.recurringDay;
    }

    if (this.showCustomCategory) {
      payload.category = this.saving.category;
    }

    this.loading = true;
    this.http
      .post('http://localhost:8080/FinWise/savings', payload, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Saving added successfully!');
          this.resetForm();
          this.fetchSavings();
        },
        error: (err) => {
          console.error('Error saving record:', err);
          alert('Failed to add saving record');
        },
        complete: () => (this.loading = false),
      });
  }

  fetchSavings() {
    this.savingListLoading = true;
    const { selectedMonth, selectedYear } = this;
    this.http
      .get<SavingResponse[]>(
        `http://localhost:8080/FinWise/savings?month=${selectedMonth}&year=${selectedYear}`
      )
      .subscribe({
        next: (res) => {
          this.savingList = res;
        },
        error: (err) => {
          console.error('Failed to fetch savings list', err);
        },
        complete: () => (this.savingListLoading = false),
      });
  }

  resetForm() {
    this.saving = {
      amount: null,
      date: '',
      category: '',
      note: '',
      isRecurring: false,
      frequency: undefined,
      endDate: undefined,
      recurringDay: undefined,
    };
    this.showCustomCategory = false;
  }

  onMonthYearChange(selection: { month: number; year: number }) {
    this.selectedMonth = selection.month;
    this.selectedYear = selection.year;
    this.fetchSavings();
  }

  onCategoryChange(value: string) {
    this.showCustomCategory = value === 'Other';
    if (this.showCustomCategory) {
      this.saving.category = ''; // Don't keep "Other" in the model
    }
  }

  confirmDelete(id: string) {
    this.pendingDeleteId = id;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
    this.showConfirmModal = false;
  }

  deleteSaving(id: string) {
    this.deletingIds.add(id);
    this.http
      .delete(`http://localhost:8080/FinWise/savings/remove/${id}`, {
        responseType: 'text',
      })
      .subscribe({
        next: () => {
          this.toast.show('Saving deleted successfully');
          this.fetchSavings();
        },
        error: (err) => {
          console.error('Failed to delete saving', err);
          this.toast.show('Failed to delete saving');
        },
        complete: () => {
          this.deletingIds.delete(id);
          this.showConfirmModal = false;
          this.pendingDeleteId = null;
        },
      });
  }

  get isDeleting(): boolean {
    return (
      this.pendingDeleteId !== null &&
      this.deletingIds.has(this.pendingDeleteId)
    );
  }
}
