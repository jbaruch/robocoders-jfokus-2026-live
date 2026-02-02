import {
  Component,
  EventEmitter,
  Output,
  effect,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/**
 * Settings panel for configuring Shelly bulb IP
 *
 * Constitution IV: Intentional Design
 * - Clean modal design
 * - Clear input validation feedback
 *
 * FR-006: Shelly bulb configuration
 */
@Component({
  selector: 'app-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Backdrop -->
    <div
      data-testid="backdrop"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      (click)="close.emit()"
    >
      <!-- Panel -->
      <div
        class="bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">Shelly Bulb Settings</h2>
          <button
            data-testid="close-button"
            (click)="close.emit()"
            class="text-gray-400 hover:text-white transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- IP Input -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">
              Shelly Bulb IP Address
            </label>
            <input
              data-testid="ip-input"
              type="text"
              [(ngModel)]="ipAddress"
              placeholder="192.168.1.100"
              class="w-full px-4 py-3 bg-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              (keyup.enter)="onSave()"
            />
          </div>

          <!-- Error message -->
          @if (showError()) {
            <p data-testid="ip-error" class="text-red-400 text-sm">
              Please enter a valid IP address (e.g., 192.168.1.100)
            </p>
          }

          <!-- Help text -->
          <p class="text-gray-500 text-sm">
            Enter the local IP address of your Shelly Duo RGBW bulb.
            You can find this in the Shelly app or your router's device list.
          </p>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 mt-8">
          <button
            (click)="close.emit()"
            class="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            data-testid="save-button"
            (click)="onSave()"
            class="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SettingsPanelComponent {
  // Input for current IP
  currentIp = input<string | undefined>(undefined);

  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<string>();

  // Form state
  ipAddress = '';
  showError = signal(false);

  constructor() {
    // Initialize from current IP when it changes
    effect(() => {
      const ip = this.currentIp();
      if (ip) {
        this.ipAddress = ip;
      }
    });
  }

  /**
   * Handle save button click
   */
  onSave(): void {
    const ip = this.ipAddress.trim();

    if (!ip || !this.isValidIp(ip)) {
      this.showError.set(true);
      return;
    }

    this.showError.set(false);
    this.saved.emit(ip);
  }

  /**
   * Validate IP address format
   */
  private isValidIp(ip: string): boolean {
    const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!pattern.test(ip)) {
      return false;
    }

    const parts = ip.split('.').map(Number);
    return parts.every((part) => part >= 0 && part <= 255);
  }
}
