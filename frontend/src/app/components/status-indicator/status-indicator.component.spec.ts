import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusIndicatorComponent } from './status-indicator.component';

describe('StatusIndicatorComponent', () => {
  let component: StatusIndicatorComponent;
  let fixture: ComponentFixture<StatusIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusIndicatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusIndicatorComponent);
    component = fixture.componentInstance;
  });

  // TS-007: Status indicators for webcam and bulb
  describe('webcam status indicator', () => {
    it('should show green indicator when webcam connected', () => {
      fixture.componentRef.setInput('webcamConnected', true);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('[data-testid="webcam-status"]');
      expect(indicator.classList.contains('bg-green-500') || indicator.querySelector('.bg-green-500')).toBeTruthy();
    });

    it('should show red indicator when webcam disconnected', () => {
      fixture.componentRef.setInput('webcamConnected', false);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('[data-testid="webcam-status"]');
      expect(indicator.classList.contains('bg-red-500') || indicator.querySelector('.bg-red-500')).toBeTruthy();
    });
  });

  describe('bulb status indicator', () => {
    it('should show green indicator when bulb configured and reachable', () => {
      fixture.componentRef.setInput('bulbConfigured', true);
      fixture.componentRef.setInput('bulbReachable', true);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('[data-testid="bulb-status"]');
      expect(indicator.classList.contains('bg-green-500') || indicator.querySelector('.bg-green-500')).toBeTruthy();
    });

    it('should show yellow indicator when bulb configured but unreachable', () => {
      fixture.componentRef.setInput('bulbConfigured', true);
      fixture.componentRef.setInput('bulbReachable', false);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('[data-testid="bulb-status"]');
      expect(indicator.classList.contains('bg-yellow-500') || indicator.querySelector('.bg-yellow-500')).toBeTruthy();
    });

    it('should show red indicator when bulb not configured', () => {
      fixture.componentRef.setInput('bulbConfigured', false);
      fixture.componentRef.setInput('bulbReachable', false);
      fixture.detectChanges();

      const indicator = fixture.nativeElement.querySelector('[data-testid="bulb-status"]');
      expect(indicator.classList.contains('bg-red-500') || indicator.querySelector('.bg-red-500')).toBeTruthy();
    });
  });

  // TS-008: Settings button opens configuration
  describe('settings button', () => {
    it('should emit openSettings when settings button clicked', () => {
      const emitSpy = jest.fn();
      component.openSettings.subscribe(emitSpy);
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector('[data-testid="settings-button"]');
      button.click();

      expect(emitSpy).toHaveBeenCalled();
    });
  });

  // TS-009: Display bulb IP when configured
  describe('bulb IP display', () => {
    it('should display bulb IP when provided', () => {
      fixture.componentRef.setInput('bulbConfigured', true);
      fixture.componentRef.setInput('bulbIp', '192.168.1.100');
      fixture.detectChanges();

      const ipDisplay = fixture.nativeElement.querySelector('[data-testid="bulb-ip"]');
      expect(ipDisplay.textContent).toContain('192.168.1.100');
    });

    it('should not display IP when not configured', () => {
      fixture.componentRef.setInput('bulbConfigured', false);
      fixture.detectChanges();

      const ipDisplay = fixture.nativeElement.querySelector('[data-testid="bulb-ip"]');
      expect(ipDisplay).toBeFalsy();
    });
  });
});
