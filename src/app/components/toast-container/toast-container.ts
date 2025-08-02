import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService } from '../../services/ToastService';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-5 right-5 z-50 space-y-2">
      <div
        *ngFor="let toast of toasts"
        class="bg-green-600 text-white px-4 py-2 rounded shadow-md animate-slide-in"
      >
        {{ toast }}
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes slide-in {
        from {
          opacity: 0;
          transform: translateX(100%);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
      .animate-slide-in {
        animation: slide-in 0.3s ease-out;
      }
    `,
  ],
})
export class ToastContainer implements OnDestroy {
  toasts: string[] = [];
  private sub: Subscription;

  constructor(private toastService: ToastService) {
    this.sub = this.toastService.toast$.subscribe((msg: string) => {
      console.log('ToastService: showing toast →', msg);
      this.toasts.push(msg);
      setTimeout(() => this.toasts.shift(), 3000);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
