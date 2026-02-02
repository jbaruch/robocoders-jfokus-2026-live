import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ColorService, RgbColor } from '../../services/color.service';

/**
 * Webcam component for capturing video and extracting colors
 *
 * Constitution III: Visual Clarity
 * - Large preview visible from back of conference hall
 * - Clear visual indicator of capture region
 *
 * FR-001: Webcam capture with center-point detection
 * FR-002: Continuous color updates at 5fps
 */
@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative">
      <!-- Video preview -->
      <video
        #videoElement
        autoplay
        playsinline
        muted
        class="w-full max-w-xl rounded-lg shadow-2xl"
        [class.hidden]="!isActive()"
      ></video>

      <!-- Capture region overlay -->
      @if (isActive()) {
        <div
          class="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            class="w-1/2 h-1/2 border-4 border-white/50 rounded-lg"
            style="box-shadow: 0 0 0 9999px rgba(0,0,0,0.3)"
          ></div>
        </div>
      }

      <!-- Loading state -->
      @if (!isActive() && !hasError()) {
        <div
          class="w-full max-w-xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
        >
          <div class="text-center">
            <div
              class="animate-spin w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
            ></div>
            <p class="text-gray-400 text-lg">Starting camera...</p>
          </div>
        </div>
      }

      <!-- Error state -->
      @if (hasError()) {
        <div
          class="w-full max-w-xl aspect-video bg-gray-800 rounded-lg flex items-center justify-center"
        >
          <div class="text-center p-8">
            <div class="text-red-400 text-6xl mb-4">⚠</div>
            <p class="text-red-400 text-xl font-semibold mb-2">
              Camera Not Available
            </p>
            <p class="text-gray-500">
              Please allow camera access and refresh the page
            </p>
          </div>
        </div>
      }

      <!-- Hidden canvas for frame extraction -->
      <canvas #canvasElement class="hidden"></canvas>
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
export class WebcamComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasRef!: ElementRef<HTMLCanvasElement>;

  @Output() colorDetected = new EventEmitter<RgbColor>();
  @Output() webcamStatus = new EventEmitter<boolean>();

  // Internal state
  isActive = signal(false);
  hasError = signal(false);

  private stream: MediaStream | null = null;
  private captureInterval: ReturnType<typeof setInterval> | null = null;
  private readonly CAPTURE_INTERVAL_MS = 200; // 5fps

  constructor(private colorService: ColorService) {}

  async ngOnInit(): Promise<void> {
    await this.startCamera();
  }

  ngOnDestroy(): void {
    this.stopCapture();
    this.stopCamera();
  }

  /**
   * Start camera and begin capture loop
   */
  private async startCamera(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      // Wait for view to initialize
      setTimeout(() => {
        if (this.videoRef?.nativeElement) {
          const video = this.videoRef.nativeElement;
          video.srcObject = this.stream;

          video.onloadedmetadata = () => {
            this.isActive.set(true);
            this.webcamStatus.emit(true);
            this.startCapture();
          };
        }
      }, 0);
    } catch (error) {
      console.error('Failed to start camera:', error);
      this.hasError.set(true);
      this.webcamStatus.emit(false);
    }
  }

  /**
   * Stop camera and release resources
   */
  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
  }

  /**
   * Start the continuous capture loop
   */
  private startCapture(): void {
    this.captureInterval = setInterval(() => {
      this.captureFrame();
    }, this.CAPTURE_INTERVAL_MS);
  }

  /**
   * Stop the capture loop
   */
  private stopCapture(): void {
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }
  }

  /**
   * Capture a single frame and extract color
   */
  private captureFrame(): void {
    const video = this.videoRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;

    if (!video || !canvas || video.videoWidth === 0) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0);

    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Extract color
    this.extractColor(imageData);
  }

  /**
   * Extract dominant color from image data
   */
  private extractColor(imageData: ImageData): void {
    const color = this.colorService.extractDominantColor(imageData);
    this.colorDetected.emit(color);
  }
}
