import { Component, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebcamComponent } from './components/webcam/webcam.component';
import { ColorDisplayComponent } from './components/color-display/color-display.component';
import { StatusIndicatorComponent } from './components/status-indicator/status-indicator.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { ColorService, RgbColor } from './services/color.service';
import { ShellyService, StatusResponse } from './services/shelly.service';
import { interval, Subscription } from 'rxjs';

/**
 * Root component for Shelly Color Picker demo
 *
 * Constitution III: Visual Clarity
 * - Two-column layout: webcam feed | color display
 * - Large elements visible from back of conference hall
 * - Dark background for accurate color perception
 *
 * Constitution IV: Intentional Design
 * - Clean, modern aesthetic
 * - No generic template styles
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    WebcamComponent,
    ColorDisplayComponent,
    StatusIndicatorComponent,
    SettingsPanelComponent,
  ],
  template: `
    <div class="min-h-screen bg-gray-900 text-white p-8">
      <!-- Main content: two-column layout -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        <!-- Left: Webcam Feed -->
        <div class="flex flex-col items-center">
          <app-webcam
            (colorDetected)="onColorDetected($event)"
            (webcamStatus)="onWebcamStatus($event)"
          />
        </div>

        <!-- Right: Color Display -->
        <div class="flex flex-col items-center">
          <app-color-display
            [color]="currentColor()"
            [isWaiting]="isWaiting()"
          />
        </div>
      </div>

      <!-- Status bar -->
      <div class="mt-8 max-w-7xl mx-auto">
        <app-status-indicator
          [webcamConnected]="webcamConnected()"
          [bulbConfigured]="bulbStatus()?.bulb_configured ?? false"
          [bulbReachable]="bulbStatus()?.bulb_reachable ?? false"
          [bulbIp]="bulbStatus()?.bulb_ip"
          (openSettings)="showSettings.set(true)"
        />
      </div>

      <!-- Settings panel (modal) -->
      @if (showSettings()) {
        <app-settings-panel
          [currentIp]="bulbStatus()?.bulb_ip"
          (close)="showSettings.set(false)"
          (saved)="onSettingsSaved($event)"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
})
export class AppComponent implements OnInit, OnDestroy {
  // Signals for reactive state
  currentColor = signal<RgbColor | null>(null);
  webcamConnected = signal(false);
  bulbStatus = signal<StatusResponse | null>(null);
  showSettings = signal(false);

  // Computed: waiting state (no color detected yet)
  isWaiting = computed(() => this.currentColor() === null);

  // Throttling: track last send time
  private lastSendTime = 0;
  private readonly THROTTLE_MS = 300; // FR-009: 2-3 updates/sec max

  // Last non-neutral color (for TS-018)
  private lastNonNeutralColor: RgbColor | null = null;

  // Status polling subscription
  private statusPollSub?: Subscription;

  constructor(
    private colorService: ColorService,
    private shellyService: ShellyService
  ) {
    // Effect: send color to bulb when it changes
    effect(() => {
      const color = this.currentColor();
      if (color) {
        this.sendColorToBulb(color);
      }
    });
  }

  ngOnInit(): void {
    // Initial status check
    this.checkStatus();

    // Poll status every 5 seconds
    this.statusPollSub = interval(5000).subscribe(() => {
      this.checkStatus();
    });
  }

  ngOnDestroy(): void {
    this.statusPollSub?.unsubscribe();
  }

  /**
   * Handle color detected from webcam
   * Implements throttling (FR-009) and neutral color handling (TS-018)
   */
  onColorDetected(color: RgbColor): void {
    // Check if neutral color
    if (this.colorService.isNeutralColor(color)) {
      // Use last non-neutral color if available
      if (this.lastNonNeutralColor) {
        this.currentColor.set(this.lastNonNeutralColor);
      }
      return;
    }

    // Store as last non-neutral
    this.lastNonNeutralColor = color;

    // Update display (always, for responsiveness)
    this.currentColor.set(color);
  }

  /**
   * Handle webcam status changes
   */
  onWebcamStatus(connected: boolean): void {
    this.webcamConnected.set(connected);
  }

  /**
   * Handle settings saved
   */
  onSettingsSaved(ip: string): void {
    this.shellyService.setSettings(ip).subscribe((response) => {
      if (response.success) {
        this.bulbStatus.set({
          bulb_configured: true,
          bulb_reachable: response.bulb_reachable,
          bulb_ip: response.bulb_ip,
        });
      }
      this.showSettings.set(false);
    });
  }

  /**
   * Send color to bulb with throttling
   */
  private sendColorToBulb(color: RgbColor): void {
    const now = Date.now();

    // Throttle: skip if too soon
    if (now - this.lastSendTime < this.THROTTLE_MS) {
      return;
    }

    this.lastSendTime = now;

    // Fire-and-forget to bulb
    this.shellyService.sendColor(color).subscribe((response) => {
      // Update bulb reachability from response
      const current = this.bulbStatus();
      if (current) {
        this.bulbStatus.set({
          ...current,
          bulb_reachable: response.bulb_reachable,
        });
      }
    });
  }

  /**
   * Check bulb status
   */
  private checkStatus(): void {
    this.shellyService.getStatus().subscribe((status) => {
      this.bulbStatus.set(status);
    });
  }
}
