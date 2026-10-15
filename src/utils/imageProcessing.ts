/**
 * Client-Side Canvas Image Processing Engine for Historical Document Enhancement
 * Implements Grayscale, Contrast Stretching, Otsu Global Binarization,
 * and Sauvola Local Adaptive Thresholding (Standard for historical faded manuscripts).
 */

export interface ImageProcessingOptions {
  brightness: number; // -100 to 100
  contrast: number;   // -100 to 100
  grayscale: boolean;
  denoising: boolean;
  thresholdMode: 'none' | 'otsu' | 'sauvola' | 'adaptive';
  thresholdValue: number; // 0 to 255
  invert: boolean;
}

export function applyImageEnhancements(
  sourceCanvas: HTMLCanvasElement,
  options: ImageProcessingOptions
): HTMLCanvasElement {
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;

  const outputCanvas = document.createElement('canvas');
  outputCanvas.width = width;
  outputCanvas.height = height;
  const ctx = outputCanvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // 1. Brightness & Contrast adjustment
  // Contrast factor: F = (259 * (contrast + 255)) / (255 * (259 - contrast))
  const cFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));
  const bAdd = options.brightness;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    r = Math.min(255, Math.max(0, r + bAdd));
    g = Math.min(255, Math.max(0, g + bAdd));
    b = Math.min(255, Math.max(0, b + bAdd));

    // Contrast
    r = Math.min(255, Math.max(0, cFactor * (r - 128) + 128));
    g = Math.min(255, Math.max(0, cFactor * (g - 128) + 128));
    b = Math.min(255, Math.max(0, cFactor * (b - 128) + 128));

    // Grayscale (Rec. 601 luma)
    if (options.grayscale || options.thresholdMode !== 'none') {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
  }

  // 2. Denoising: 3x3 simple box blur if enabled
  if (options.denoising) {
    const copy = new Uint8ClampedArray(data);
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let sum = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const idx = ((y + dy) * width + (x + dx)) * 4;
            sum += copy[idx];
          }
        }
        const avg = sum / 9;
        const currentIdx = (y * width + x) * 4;
        data[currentIdx] = avg;
        data[currentIdx + 1] = avg;
        data[currentIdx + 2] = avg;
      }
    }
  }

  // 3. Binarization Modes
  if (options.thresholdMode === 'otsu') {
    // Otsu's thresholding
    const threshold = computeOtsuThreshold(data);
    for (let i = 0; i < data.length; i += 4) {
      const val = data[i] < threshold ? 0 : 255;
      data[i] = val;
      data[i + 1] = val;
      data[i + 2] = val;
    }
  } else if (options.thresholdMode === 'sauvola' || options.thresholdMode === 'adaptive') {
    // Sauvola local binarization with window size 15, k = 0.2, R = 128
    applySauvolaThreshold(data, width, height, 15, 0.2, 128);
  }

  // 4. Invert if requested
  if (options.invert) {
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i];
      data[i + 1] = 255 - data[i + 1];
      data[i + 2] = 255 - data[i + 2];
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return outputCanvas;
}

// Compute Otsu threshold from grayscale image data
function computeOtsuThreshold(data: Uint8ClampedArray): number {
  const histogram = new Array(256).fill(0);
  const totalPixels = data.length / 4;

  for (let i = 0; i < data.length; i += 4) {
    histogram[Math.floor(data[i])]++;
  }

  let sum = 0;
  for (let i = 0; i < 256; i++) {
    sum += i * histogram[i];
  }

  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let varMax = 0;
  let threshold = 128;

  for (let t = 0; t < 256; t++) {
    wB += histogram[t];
    if (wB === 0) continue;
    wF = totalPixels - wB;
    if (wF === 0) break;

    sumB += t * histogram[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;

    const varBetween = wB * wF * (mB - mF) * (mB - mF);
    if (varBetween > varMax) {
      varMax = varBetween;
      threshold = t;
    }
  }

  return threshold;
}

// Sauvola local thresholding: T(x,y) = m(x,y) * [1 + k * (s(x,y) / R - 1)]
function applySauvolaThreshold(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  windowSize: number,
  k: number,
  R: number
) {
  const half = Math.floor(windowSize / 2);
  const gray = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    gray[i] = data[i * 4];
  }

  // Precompute integral image and integral image squared for O(1) local mean & variance
  const integral = new Float64Array((width + 1) * (height + 1));
  const integralSq = new Float64Array((width + 1) * (height + 1));

  for (let y = 0; y < height; y++) {
    let rowSum = 0;
    let rowSqSum = 0;
    for (let x = 0; x < width; x++) {
      const val = gray[y * width + x];
      rowSum += val;
      rowSqSum += val * val;

      const idx = (y + 1) * (width + 1) + (x + 1);
      const prevYIdx = y * (width + 1) + (x + 1);
      integral[idx] = integral[prevYIdx] + rowSum;
      integralSq[idx] = integralSq[prevYIdx] + rowSqSum;
    }
  }

  // Apply Sauvola formula to each pixel
  for (let y = 0; y < height; y++) {
    const y0 = Math.max(0, y - half);
    const y1 = Math.min(height, y + half + 1);
    for (let x = 0; x < width; x++) {
      const x0 = Math.max(0, x - half);
      const x1 = Math.min(width, x + half + 1);
      const count = (y1 - y0) * (x1 - x0);

      // Sum using 2D prefix sums
      const sum =
        integral[y1 * (width + 1) + x1] -
        integral[y0 * (width + 1) + x1] -
        integral[y1 * (width + 1) + x0] +
        integral[y0 * (width + 1) + x0];

      const sumSq =
        integralSq[y1 * (width + 1) + x1] -
        integralSq[y0 * (width + 1) + x1] -
        integralSq[y1 * (width + 1) + x0] +
        integralSq[y0 * (width + 1) + x0];

      const mean = sum / count;
      const variance = Math.max(0, sumSq / count - mean * mean);
      const stdDev = Math.sqrt(variance);

      // Sauvola threshold
      const thresh = mean * (1 + k * (stdDev / R - 1));

      const pixelIdx = (y * width + x) * 4;
      const binarized = gray[y * width + x] < thresh ? 0 : 255;
      data[pixelIdx] = binarized;
      data[pixelIdx + 1] = binarized;
      data[pixelIdx + 2] = binarized;
    }
  }
}
