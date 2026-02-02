import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { WebcamComponent } from './webcam.component';
import { ColorService } from '../../services/color.service';

describe('WebcamComponent', () => {
  let component: WebcamComponent;
  let fixture: ComponentFixture<WebcamComponent>;
  let colorService: ColorService;

  // Mock MediaStream
  const mockMediaStream = {
    getTracks: () => [{ stop: jest.fn() }],
  } as unknown as MediaStream;

  beforeEach(async () => {
    // Mock getUserMedia
    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        getUserMedia: jest.fn().mockResolvedValue(mockMediaStream),
      },
      writable: true,
    });

    await TestBed.configureTestingModule({
      imports: [WebcamComponent],
      providers: [ColorService],
    }).compileComponents();

    fixture = TestBed.createComponent(WebcamComponent);
    component = fixture.componentInstance;
    colorService = TestBed.inject(ColorService);
  });

  // TS-001: Auto-start camera on load
  describe('camera initialization', () => {
    it('should request camera access on init', async () => {
      await component.ngOnInit();

      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalledWith({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
    });

    it('should emit webcamStatus false on camera error', async () => {
      (navigator.mediaDevices.getUserMedia as jest.Mock).mockRejectedValue(
        new Error('Permission denied')
      );

      const statusSpy = jest.fn();
      component.webcamStatus.subscribe(statusSpy);

      await component.ngOnInit();

      expect(statusSpy).toHaveBeenCalledWith(false);
    });
  });

  // TS-002: Frame capture at 5fps
  describe('frame capture', () => {
    it('should capture frames at configured interval', fakeAsync(() => {
      const colorSpy = jest.fn();
      component.colorDetected.subscribe(colorSpy);

      // Start capture with mocked canvas
      component['startCapture']();

      // Advance time by capture interval
      tick(200); // 5fps = 200ms

      // Clean up interval
      component['stopCapture']();
    }));
  });

  // TS-003: Dominant color extraction delegated to ColorService
  describe('color extraction', () => {
    it('should use ColorService for extraction', () => {
      const extractSpy = jest.spyOn(colorService, 'extractDominantColor');
      // Create mock ImageData manually (not available in jsdom)
      const mockImageData = {
        data: new Uint8ClampedArray(10 * 10 * 4),
        width: 10,
        height: 10,
      } as ImageData;

      component['extractColor'](mockImageData);

      expect(extractSpy).toHaveBeenCalledWith(mockImageData);
    });
  });

  // Cleanup
  describe('cleanup', () => {
    it('should stop all tracks on destroy', async () => {
      const stopSpy = jest.fn();
      const mockStream = {
        getTracks: () => [{ stop: stopSpy }],
      } as unknown as MediaStream;

      (navigator.mediaDevices.getUserMedia as jest.Mock).mockResolvedValue(mockStream);
      await component.ngOnInit();

      component.ngOnDestroy();

      expect(stopSpy).toHaveBeenCalled();
    });
  });
});
