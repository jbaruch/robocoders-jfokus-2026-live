import { Component, EventEmitter, Output, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Status indicator component showing connection states
 *
 * Constitution III: Visual Clarity
 * - Clear color-coded status indicators
 * - Large enough to see from back rows
 *
 * FR-005: Connection status display
 */
@Component({
  selector: 'app-status-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex flex-wrap items-center justify-center gap-6 p-4 bg-gray-800 rounded-xl"
    >
      <!-- Webcam status -->
      <div
        data-testid="webcam-status"
        class="flex items-center gap-3 px-4 py-2 bg-gray-700 rounded-lg"
      >
        <div
          class="w-4 h-4 rounded-full"
          [class.bg-green-500]="webcamConnected()"
          [class.bg-red-500]="!webcamConnected()"
        ></div>
        <span class="text-lg font-medium">
          {{ webcamConnected() ? 'Camera Active' : 'Camera Offline' }}
        </span>
      </div>

      <!-- Bulb status -->
      <div
        data-testid="bulb-status"
        class="flex items-center gap-3 px-4 py-2 bg-gray-700 rounded-lg"
      >
        <div
          class="w-4 h-4 rounded-full"
          [class.bg-green-500]="bulbConfigured() && bulbReachable()"
          [class.bg-yellow-500]="bulbConfigured() && !bulbReachable()"
          [class.bg-red-500]="!bulbConfigured()"
        ></div>
        <span class="text-lg font-medium">
          {{ bulbStatusText() }}
        </span>
      </div>

      <!-- Bulb IP display -->
      @if (bulbConfigured() && bulbIp()) {
        <div
          data-testid="bulb-ip"
          class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg"
        >
          <span class="text-gray-400">IP:</span>
          <span class="font-mono">{{ bulbIp() }}</span>
        </div>
      }

      <!-- Settings button -->
      <button
        data-testid="settings-button"
        (click)="openSettings.emit()"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="font-medium">Settings</span>
      </button>
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
export class StatusIndicatorComponent {
  // Input signals
  webcamConnected = input(false);
  bulbConfigured = input(false);
  bulbReachable = input(false);
  bulbIp = input<string | undefined>(undefined);

  @Output() openSettings = new EventEmitter<void>();

  // Computed text for bulb status
  bulbStatusText = computed(() => {
    if (!this.bulbConfigured()) {
      return 'Bulb Not Configured';
    }
    if (!this.bulbReachable()) {
      return 'Bulb Unreachable';
    }
    return 'Bulb Connected';
  });
}
