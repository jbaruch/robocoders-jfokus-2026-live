import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService, RgbColor } from '../../services/color.service';

/**
 * Color display component showing the detected color
 *
 * Constitution III: Visual Clarity
 * - Large color swatch (minimum 300x300px)
 * - Large, readable RGB values
 * - Dark background for accurate color perception
 *
 * FR-003: Real-time color display
 */
@Component({
  selector: 'app-color-display',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center gap-6">
      <!-- Color swatch -->
      <div
        data-testid="color-swatch"
        class="rounded-2xl shadow-2xl transition-colors duration-150"
        [style.backgroundColor]="backgroundColor()"
        [style.minWidth.px]="300"
        [style.minHeight.px]="300"
        [style.width.px]="400"
        [style.height.px]="400"
      >
        @if (isWaiting()) {
          <div
            data-testid="waiting-indicator"
            class="w-full h-full flex items-center justify-center"
          >
            <div class="text-center">
              <div
                class="animate-pulse w-16 h-16 bg-gray-600 rounded-full mx-auto mb-4"
              ></div>
              <p class="text-gray-400 text-xl">Detecting color...</p>
            </div>
          </div>
        }
      </div>

      <!-- Color values -->
      @if (!isWaiting() && color()) {
        <div class="text-center space-y-2">
          <!-- Hex value -->
          <div
            data-testid="hex-value"
            class="text-4xl font-mono font-bold tracking-wider"
          >
            {{ hexValue() }}
          </div>

          <!-- RGB values -->
          <div
            data-testid="rgb-values"
            class="text-xl font-mono text-gray-400 flex gap-4 justify-center"
          >
            <span class="text-red-400">R: {{ color()?.red }}</span>
            <span class="text-green-400">G: {{ color()?.green }}</span>
            <span class="text-blue-400">B: {{ color()?.blue }}</span>
          </div>
        </div>
      }
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
export class ColorDisplayComponent {
  // Input signals
  color = input<RgbColor | null>(null);
  isWaiting = input(false);

  constructor(private colorService: ColorService) {}

  // Computed values
  backgroundColor = computed(() => {
    const c = this.color();
    if (!c) return '#1f2937'; // gray-800
    return `rgb(${c.red}, ${c.green}, ${c.blue})`;
  });

  hexValue = computed(() => {
    const c = this.color();
    if (!c) return '';
    return this.colorService.toHex(c);
  });
}
