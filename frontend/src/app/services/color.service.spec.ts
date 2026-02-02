import { ColorService, RgbColor } from './color.service';

describe('ColorService', () => {
  let service: ColorService;

  beforeEach(() => {
    service = new ColorService();
  });

  // TS-003: Dominant color extraction from multi-color frame
  describe('extractDominantColor', () => {
    it('should extract dominant color from ImageData with mostly red pixels in center', () => {
      // Create mock ImageData where center is mostly red
      const width = 100;
      const height = 100;
      const data = new Uint8ClampedArray(width * height * 4);

      // Fill entire image with blue first
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 255; // B
        data[i + 3] = 255; // A
      }

      // Fill center region (25-75 in both dimensions) with red
      // This ensures the sampled area is predominantly red
      for (let y = 25; y < 75; y++) {
        for (let x = 25; x < 75; x++) {
          const i = (y * width + x) * 4;
          data[i] = 255;     // R
          data[i + 1] = 0;   // G
          data[i + 2] = 0;   // B
        }
      }

      const imageData = { data, width, height } as ImageData;
      const result = service.extractDominantColor(imageData);

      // Center is red, so dominant should be more red than blue
      expect(result.red).toBeGreaterThan(result.blue);
    });

    it('should return average RGB for uniform color', () => {
      const width = 4;
      const height = 4;
      const data = new Uint8ClampedArray(width * height * 4);

      // All pixels are orange (255, 128, 0)
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255;     // R
        data[i + 1] = 128; // G
        data[i + 2] = 0;   // B
        data[i + 3] = 255; // A
      }

      const imageData = { data, width, height } as ImageData;
      const result = service.extractDominantColor(imageData);

      expect(result.red).toBe(255);
      expect(result.green).toBe(128);
      expect(result.blue).toBe(0);
    });

    it('should sample from center region only', () => {
      // This test verifies the service uses center-weighted sampling
      // Implementation detail: service should focus on center 50% of frame
      const width = 100;
      const height = 100;
      const data = new Uint8ClampedArray(width * height * 4);

      // Fill entire frame with blue
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;       // R
        data[i + 1] = 0;   // G
        data[i + 2] = 255; // B
        data[i + 3] = 255; // A
      }

      // Fill center region (25-75 in both dimensions) with red
      for (let y = 25; y < 75; y++) {
        for (let x = 25; x < 75; x++) {
          const i = (y * width + x) * 4;
          data[i] = 255;     // R
          data[i + 1] = 0;   // G
          data[i + 2] = 0;   // B
        }
      }

      const imageData = { data, width, height } as ImageData;
      const result = service.extractDominantColor(imageData);

      // Center is red, so dominant should be more red than blue
      expect(result.red).toBeGreaterThan(result.blue);
    });
  });

  // TS-018: Neutral colors handling
  describe('isNeutralColor', () => {
    it('should detect gray as neutral', () => {
      const gray: RgbColor = { red: 128, green: 128, blue: 128 };
      expect(service.isNeutralColor(gray)).toBe(true);
    });

    it('should detect near-white as neutral', () => {
      const white: RgbColor = { red: 250, green: 250, blue: 250 };
      expect(service.isNeutralColor(white)).toBe(true);
    });

    it('should detect near-black as neutral', () => {
      const black: RgbColor = { red: 10, green: 10, blue: 10 };
      expect(service.isNeutralColor(black)).toBe(true);
    });

    it('should NOT detect saturated colors as neutral', () => {
      const red: RgbColor = { red: 255, green: 0, blue: 0 };
      const blue: RgbColor = { red: 0, green: 0, blue: 255 };
      const green: RgbColor = { red: 0, green: 255, blue: 0 };

      expect(service.isNeutralColor(red)).toBe(false);
      expect(service.isNeutralColor(blue)).toBe(false);
      expect(service.isNeutralColor(green)).toBe(false);
    });
  });

  describe('toHex', () => {
    it('should convert RGB to hex string', () => {
      const color: RgbColor = { red: 255, green: 136, blue: 0 };
      expect(service.toHex(color)).toBe('#FF8800');
    });

    it('should pad single digit values', () => {
      const color: RgbColor = { red: 0, green: 0, blue: 15 };
      expect(service.toHex(color)).toBe('#00000F');
    });
  });

  describe('toRgbString', () => {
    it('should format as RGB string', () => {
      const color: RgbColor = { red: 255, green: 136, blue: 0 };
      expect(service.toRgbString(color)).toBe('RGB(255, 136, 0)');
    });
  });
});
