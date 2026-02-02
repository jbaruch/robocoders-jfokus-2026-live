import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ShellyService } from './shelly.service';
import { RgbColor } from './color.service';

describe('ShellyService', () => {
  let service: ShellyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ShellyService],
    });
    service = TestBed.inject(ShellyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // TS-010: POST /api/color accepts valid RGB values
  describe('sendColor', () => {
    it('should send POST request with valid RGB values', () => {
      const color: RgbColor = { red: 255, green: 128, blue: 0 };

      service.sendColor(color).subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.bulb_reachable).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/color');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ red: 255, green: 128, blue: 0 });

      req.flush({ success: true, bulb_reachable: true });
    });

    it('should handle bulb offline response', () => {
      const color: RgbColor = { red: 255, green: 0, blue: 0 };

      service.sendColor(color).subscribe((response) => {
        expect(response.success).toBe(false);
        expect(response.bulb_reachable).toBe(false);
        expect(response.error).toBe('Bulb unreachable');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/color');
      req.flush({ success: false, bulb_reachable: false, error: 'Bulb unreachable' });
    });
  });

  // TS-012: GET /api/status returns connection health
  describe('getStatus', () => {
    it('should return status when bulb is configured', () => {
      service.getStatus().subscribe((response) => {
        expect(response.bulb_configured).toBe(true);
        expect(response.bulb_reachable).toBe(true);
        expect(response.bulb_ip).toBe('192.168.1.100');
      });

      const req = httpMock.expectOne('http://localhost:3000/api/status');
      expect(req.request.method).toBe('GET');

      req.flush({
        bulb_configured: true,
        bulb_reachable: true,
        bulb_ip: '192.168.1.100',
      });
    });

    it('should return unconfigured status', () => {
      service.getStatus().subscribe((response) => {
        expect(response.bulb_configured).toBe(false);
        expect(response.bulb_reachable).toBe(false);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/status');
      req.flush({
        bulb_configured: false,
        bulb_reachable: false,
      });
    });
  });

  // TS-013: POST /api/settings configures bulb IP
  describe('setSettings', () => {
    it('should send POST request with bulb IP', () => {
      service.setSettings('192.168.1.100').subscribe((response) => {
        expect(response.success).toBe(true);
        expect(response.bulb_ip).toBe('192.168.1.100');
        expect(response.bulb_reachable).toBe(true);
      });

      const req = httpMock.expectOne('http://localhost:3000/api/settings');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ bulb_ip: '192.168.1.100' });

      req.flush({
        success: true,
        bulb_ip: '192.168.1.100',
        bulb_reachable: true,
        device_type: 'SHRGBW2',
      });
    });
  });
});
