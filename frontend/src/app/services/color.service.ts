import { Injectable } from '@angular/core';

/**
 * RGB color representation
 */
export interface RgbColor {
  red: number;
  green: number;
  blue: number;
}

/**
 * Service for color extraction and manipulation
 * Implements center-weighted dominant color extraction
 */
@Injectable({
  providedIn: 'root',
})
export class ColorService {
  /**
   * Threshold for detecting neutral colors (grayscale, black, white)
   * Colors with saturation below this are considered neutral
   */
  private readonly NEUTRAL_THRESHOLD = 30;

  /**
   * Extract the dominant color from ImageData
   * Uses center-weighted average sampling for demo accuracy
   *
   * Algorithm:
   * 1. Sample from center 50% of the frame
   * 2. Skip every Nth pixel for performance
   * 3. Compute average RGB
   */
  extractDominantColor(imageData: ImageData): RgbColor {
    const { data, width, height } = imageData;

    // Define center region (50% of frame)
    const startX = Math.floor(width * 0.25);
    const endX = Math.floor(width * 0.75);
    const startY = Math.floor(height * 0.25);
    const endY = Math.floor(height * 0.75);

    let totalR = 0;
    let totalG = 0;
    let totalB = 0;
    let count = 0;

    // Sample every 4th pixel for performance
    const step = 4;

    for (let y = startY; y < endY; y += step) {
      for (let x = startX; x < endX; x += step) {
        const i = (y * width + x) * 4;
        totalR += data[i];
        totalG += data[i + 1];
        totalB += data[i + 2];
        count++;
      }
    }

    if (count === 0) {
      return { red: 0, green: 0, blue: 0 };
    }

    return {
      red: Math.round(totalR / count),
      green: Math.round(totalG / count),
      blue: Math.round(totalB / count),
    };
  }

  /**
   * Check if a color is neutral (grayscale, near-black, near-white)
   * Used to implement TS-018: maintain last color for neutral scenes
   */
  isNeutralColor(color: RgbColor): boolean {
    const { red, green, blue } = color;

    // Calculate saturation approximation
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;

    // Low delta = low saturation = neutral
    return delta < this.NEUTRAL_THRESHOLD;
  }

  /**
   * Convert RGB color to hex string (e.g., "#FF8800")
   */
  toHex(color: RgbColor): string {
    const r = color.red.toString(16).padStart(2, '0').toUpperCase();
    const g = color.green.toString(16).padStart(2, '0').toUpperCase();
    const b = color.blue.toString(16).padStart(2, '0').toUpperCase();
    return `#${r}${g}${b}`;
  }

  /**
   * Convert RGB color to display string (e.g., "RGB(255, 136, 0)")
   */
  toRgbString(color: RgbColor): string {
    return `RGB(${color.red}, ${color.green}, ${color.blue})`;
  }
}
