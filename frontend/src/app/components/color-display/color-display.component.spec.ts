import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorDisplayComponent } from './color-display.component';
import { RgbColor } from '../../services/color.service';

describe('ColorDisplayComponent', () => {
  let component: ColorDisplayComponent;
  let fixture: ComponentFixture<ColorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorDisplayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorDisplayComponent);
    component = fixture.componentInstance;
  });

  // TS-004: Large visible color swatch
  describe('color swatch display', () => {
    it('should render color swatch with minimum size', () => {
      fixture.componentRef.setInput('color', { red: 255, green: 128, blue: 0 });
      fixture.detectChanges();

      const swatch = fixture.nativeElement.querySelector('[data-testid="color-swatch"]');
      expect(swatch).toBeTruthy();

      const styles = getComputedStyle(swatch);
      // Minimum 300x300px for visibility from back rows
      expect(parseInt(styles.minWidth)).toBeGreaterThanOrEqual(300);
      expect(parseInt(styles.minHeight)).toBeGreaterThanOrEqual(300);
    });

    it('should apply correct background color', () => {
      const color: RgbColor = { red: 255, green: 128, blue: 0 };
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const swatch = fixture.nativeElement.querySelector('[data-testid="color-swatch"]');
      expect(swatch.style.backgroundColor).toBe('rgb(255, 128, 0)');
    });
  });

  // TS-005: RGB values displayed in readable font
  describe('RGB value display', () => {
    it('should display RGB values', () => {
      const color: RgbColor = { red: 255, green: 128, blue: 0 };
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const rgbDisplay = fixture.nativeElement.querySelector('[data-testid="rgb-values"]');
      expect(rgbDisplay.textContent).toContain('255');
      expect(rgbDisplay.textContent).toContain('128');
      expect(rgbDisplay.textContent).toContain('0');
    });

    it('should display hex value', () => {
      const color: RgbColor = { red: 255, green: 128, blue: 0 };
      fixture.componentRef.setInput('color', color);
      fixture.detectChanges();

      const hexDisplay = fixture.nativeElement.querySelector('[data-testid="hex-value"]');
      expect(hexDisplay.textContent).toContain('#FF8000');
    });
  });

  // TS-006: Waiting state when no color detected
  describe('waiting state', () => {
    it('should show waiting indicator when isWaiting is true', () => {
      fixture.componentRef.setInput('color', null);
      fixture.componentRef.setInput('isWaiting', true);
      fixture.detectChanges();

      const waitingIndicator = fixture.nativeElement.querySelector('[data-testid="waiting-indicator"]');
      expect(waitingIndicator).toBeTruthy();
    });

    it('should hide waiting indicator when color is detected', () => {
      fixture.componentRef.setInput('color', { red: 255, green: 0, blue: 0 });
      fixture.componentRef.setInput('isWaiting', false);
      fixture.detectChanges();

      const waitingIndicator = fixture.nativeElement.querySelector('[data-testid="waiting-indicator"]');
      expect(waitingIndicator).toBeFalsy();
    });
  });
});
