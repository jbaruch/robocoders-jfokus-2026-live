import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { RgbColor } from './color.service';

/**
 * Response from POST /api/color
 */
export interface ColorResponse {
  success: boolean;
  bulb_reachable: boolean;
  error?: string;
}

/**
 * Response from GET /api/status
 */
export interface StatusResponse {
  bulb_configured: boolean;
  bulb_reachable: boolean;
  bulb_ip?: string;
}

/**
 * Response from POST /api/settings
 */
export interface SettingsResponse {
  success: boolean;
  bulb_ip?: string;
  bulb_reachable: boolean;
  device_type?: string;
  error?: string;
}

/**
 * Service for communicating with the backend API
 */
@Injectable({
  providedIn: 'root',
})
export class ShellyService {
  private readonly apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  /**
   * Send color to the Shelly bulb via backend
   * Fire-and-forget with response for status updates
   */
  sendColor(color: RgbColor): Observable<ColorResponse> {
    return this.http
      .post<ColorResponse>(`${this.apiUrl}/color`, {
        red: color.red,
        green: color.green,
        blue: color.blue,
      })
      .pipe(
        catchError((error) => {
          console.error('Failed to send color:', error);
          return of({
            success: false,
            bulb_reachable: false,
            error: 'Network error',
          });
        })
      );
  }

  /**
   * Get current system status
   */
  getStatus(): Observable<StatusResponse> {
    return this.http.get<StatusResponse>(`${this.apiUrl}/status`).pipe(
      catchError((error) => {
        console.error('Failed to get status:', error);
        return of({
          bulb_configured: false,
          bulb_reachable: false,
        });
      })
    );
  }

  /**
   * Configure Shelly bulb IP address
   */
  setSettings(bulbIp: string): Observable<SettingsResponse> {
    return this.http
      .post<SettingsResponse>(`${this.apiUrl}/settings`, {
        bulb_ip: bulbIp,
      })
      .pipe(
        catchError((error) => {
          console.error('Failed to set settings:', error);
          return of({
            success: false,
            bulb_reachable: false,
            error: 'Network error',
          });
        })
      );
  }

  /**
   * Get current settings
   */
  getSettings(): Observable<SettingsResponse> {
    return this.http.get<SettingsResponse>(`${this.apiUrl}/settings`).pipe(
      catchError((error) => {
        console.error('Failed to get settings:', error);
        return of({
          success: false,
          bulb_reachable: false,
          error: 'Network error',
        });
      })
    );
  }
}
