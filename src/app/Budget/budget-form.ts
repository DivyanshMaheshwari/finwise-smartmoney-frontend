import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastService } from '../services/ToastService';
import { ConfirmationModal } from '../components/confirmation-modal/confirmation-modal';
import { environment } from '../../environments/environment';

interface BudgetPlan {
  incomeId: string;
  salaryDate: string;
  salaryAmount: number;
  calculatedNeeds: number;
  calculatedWants: number;
  calculatedInvestments: number;
}

@Component({
  selector: 'app-budget-plan',
  standalone: true,
  imports: [CommonModule, ConfirmationModal],
  templateUrl: './budget-form.html',
})
export class BudgetForm implements OnInit {
  budgets: BudgetPlan[] = [];
  loading = false;
  generating = false;

  private readonly baseUrl = `${environment.apiBaseUrl}/budget`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  ngOnInit(): void {
    this.fetchBudgets();
  }

  fetchBudgets() {
    this.loading = true;
    this.http.get<BudgetPlan[]>(`${this.baseUrl}/all`).subscribe({
      next: (res) => {
        this.budgets = res;
      },
      error: () => {
        this.toast.show('❌ Failed to load budgets');
      },
      complete: () => (this.loading = false),
    });
  }

  generateBudget() {
    this.generating = true;
    this.http.post(`${this.baseUrl}/generate/latest-salary`, {}, { responseType: 'text' }).subscribe({
      next: (msg) => {
        if (msg.includes('already exists')) {
          this.toast.show('⚠️ Budget already exists for the latest salary.');
        } else {
          this.toast.show('✅ Budget generated successfully!');
          this.fetchBudgets();
        }
      },
      error: () => {
        this.toast.show('❌ Failed to generate budget');
      },
      complete: () => (this.generating = false),
    });
  }

  deletingIds: Set<string> = new Set();
  showConfirmModal = false;
  pendingDeleteId: string | null = null;

  confirmDelete(id: string) {
    this.pendingDeleteId = id;
    this.showConfirmModal = true;
  }

  cancelDelete() {
    this.pendingDeleteId = null;
    this.showConfirmModal = false;
  }

  deleteBudget(id: string) {
    this.deletingIds.add(id);
    this.http
      .delete(`${this.baseUrl}/remove/${id}`, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.toast.show('Budget deleted successfully');
          this.fetchBudgets();
        },
        error: () => {
          this.toast.show('Failed to delete budget');
        },
        complete: () => {
          this.deletingIds.delete(id);
          this.showConfirmModal = false;
          this.pendingDeleteId = null;
        },
      });
  }
}
