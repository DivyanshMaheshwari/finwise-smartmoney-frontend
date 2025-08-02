import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div class="bg-gray-900 border border-white/10 p-6 rounded-xl shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-semibold text-white mb-4">{{ title }}</h3>
        <p class="text-gray-300 mb-6">{{ message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
            (click)="cancel.emit()"
          >
            {{ cancelText }}
          </button>
          <button
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
            [disabled]="loading"
            (click)="confirm.emit()"
          >
            {{ loading ? 'Deleting...' : confirmText }}
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmationModal {
  @Input() show: boolean = false;
  @Input() title = '';
  @Input() message = '';
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'No';
  @Input() loading = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
