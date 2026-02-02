import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SettingsPanelComponent } from './settings-panel.component';

describe('SettingsPanelComponent', () => {
  let component: SettingsPanelComponent;
  let fixture: ComponentFixture<SettingsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsPanelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // TS-014: IP address input field
  describe('IP input', () => {
    it('should have IP address input field', () => {
      const input = fixture.nativeElement.querySelector('[data-testid="ip-input"]');
      expect(input).toBeTruthy();
      expect(input.type).toBe('text');
    });

    it('should pre-fill with current IP if provided', fakeAsync(() => {
      // The effect copies currentIp to ipAddress
      fixture.componentRef.setInput('currentIp', '192.168.1.100');
      tick(); // Allow effect to run
      fixture.detectChanges();

      // Verify the component's ipAddress property was updated
      expect(component.ipAddress).toBe('192.168.1.100');
    }));
  });

  // TS-015: Save button emits IP
  describe('save functionality', () => {
    it('should emit saved event with IP when save clicked', () => {
      const savedSpy = jest.fn();
      component.saved.subscribe(savedSpy);

      const input = fixture.nativeElement.querySelector('[data-testid="ip-input"]');
      input.value = '192.168.1.200';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
      saveButton.click();

      expect(savedSpy).toHaveBeenCalledWith('192.168.1.200');
    });

    it('should not emit if IP is empty', () => {
      const savedSpy = jest.fn();
      component.saved.subscribe(savedSpy);

      const input = fixture.nativeElement.querySelector('[data-testid="ip-input"]');
      input.value = '';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
      saveButton.click();

      expect(savedSpy).not.toHaveBeenCalled();
    });
  });

  // TS-016: Close button
  describe('close functionality', () => {
    it('should emit close event when close button clicked', () => {
      const closeSpy = jest.fn();
      component.close.subscribe(closeSpy);

      const closeButton = fixture.nativeElement.querySelector('[data-testid="close-button"]');
      closeButton.click();

      expect(closeSpy).toHaveBeenCalled();
    });

    it('should emit close event when backdrop clicked', () => {
      const closeSpy = jest.fn();
      component.close.subscribe(closeSpy);

      const backdrop = fixture.nativeElement.querySelector('[data-testid="backdrop"]');
      backdrop.click();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  // TS-017: IP validation
  describe('IP validation', () => {
    it('should validate IP address format', () => {
      // Valid IP
      expect(component['isValidIp']('192.168.1.100')).toBe(true);
      expect(component['isValidIp']('10.0.0.1')).toBe(true);
      expect(component['isValidIp']('172.16.0.1')).toBe(true);

      // Invalid IP
      expect(component['isValidIp']('256.1.1.1')).toBe(false);
      expect(component['isValidIp']('192.168.1')).toBe(false);
      expect(component['isValidIp']('not-an-ip')).toBe(false);
      expect(component['isValidIp']('')).toBe(false);
    });

    it('should show error for invalid IP', () => {
      const input = fixture.nativeElement.querySelector('[data-testid="ip-input"]');
      input.value = 'invalid-ip';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const saveButton = fixture.nativeElement.querySelector('[data-testid="save-button"]');
      saveButton.click();
      fixture.detectChanges();

      const error = fixture.nativeElement.querySelector('[data-testid="ip-error"]');
      expect(error).toBeTruthy();
    });
  });
});
