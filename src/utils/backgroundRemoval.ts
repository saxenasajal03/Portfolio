/**
 * Client-side background removal utility for portrait images on studio neutral backgrounds.
 * Uses edge-seeded flood-fill segmentation, chromatic distance and smoothstep alpha feathering.
 */

export interface ProcessedImageResult {
  canvas: HTMLCanvasElement;
  dataUrl: string;
  width: number;
  height: number;
}

export async function removeStudioBackground(
  imageSrc: string,
  options: {
    tolerance?: number; // Distance threshold for studio backdrop
    feather?: number; // Edge feathering width in pixels
  } = {}
): Promise<ProcessedImageResult> {
  const { tolerance = 38, feather = 2 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    if (typeof window !== 'undefined' && imageSrc.startsWith('http') && !imageSrc.startsWith(window.location.origin)) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      try {
        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          throw new Error('Canvas 2D context not available');
        }

        ctx.drawImage(img, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;

        // Sample background reference colors from top and upper side corners
        const sampleCoords = [
          [2, 2],
          [Math.floor(width / 2), 2],
          [width - 3, 2],
          [2, Math.floor(height * 0.2)],
          [width - 3, Math.floor(height * 0.2)],
          [2, Math.floor(height * 0.4)],
          [width - 3, Math.floor(height * 0.4)],
        ];

        let refR = 0;
        let refG = 0;
        let refB = 0;
        for (const [sx, sy] of sampleCoords) {
          const idx = (sy * width + sx) * 4;
          refR += data[idx];
          refG += data[idx + 1];
          refB += data[idx + 2];
        }
        refR /= sampleCoords.length;
        refG /= sampleCoords.length;
        refB /= sampleCoords.length;

        // Flood fill from borders to identify outer backdrop region
        const isBackdrop = new Uint8Array(width * height);
        const visited = new Uint8Array(width * height);
        const queue: number[] = [];

        function isBgColor(r: number, g: number, b: number): boolean {
          // Color distance in RGB
          const dr = r - refR;
          const dg = g - refG;
          const db = b - refB;
          const dist = Math.sqrt(dr * dr + dg * dg + db * db);

          // Studio grey check: background has low chromatic saturation (r, g, b are close)
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;

          // If saturation is noticeably warm or high, it's skin or clothes
          if (saturation > 0.18) return false;

          return dist <= tolerance;
        }

        // Seed outer edges
        for (let x = 0; x < width; x++) {
          queue.push(x, 0);
          queue.push(x, height - 1);
        }
        for (let y = 0; y < height; y++) {
          queue.push(0, y);
          queue.push(width - 1, y);
        }

        let head = 0;
        while (head < queue.length) {
          const x = queue[head++];
          const y = queue[head++];
          const pIdx = y * width + x;

          if (visited[pIdx]) continue;
          visited[pIdx] = 1;

          const idx = pIdx * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          if (isBgColor(r, g, b)) {
            isBackdrop[pIdx] = 1;

            // Check 4-connected neighbors
            if (x > 0 && !visited[pIdx - 1]) queue.push(x - 1, y);
            if (x < width - 1 && !visited[pIdx + 1]) queue.push(x + 1, y);
            if (y > 0 && !visited[pIdx - width]) queue.push(x, y - 1);
            if (y < height - 1 && !visited[pIdx + width]) queue.push(x, y + 1);
          }
        }

        // Compute alpha mask with feathering
        // Distance transform or blur on backdrop boundary
        const alphaMask = new Uint8Array(width * height);
        for (let i = 0; i < width * height; i++) {
          alphaMask[i] = isBackdrop[i] ? 0 : 255;
        }

        // Feather edges
        if (feather > 0) {
          const tempMask = new Uint8Array(alphaMask);
          for (let y = 1; y < height - 1; y++) {
            for (let x = 1; x < width - 1; x++) {
              const pIdx = y * width + x;
              if (tempMask[pIdx] > 0) {
                // If any neighbor is background, calculate soft transition
                let zeroNeighbors = 0;
                for (let dy = -feather; dy <= feather; dy++) {
                  for (let dx = -feather; dx <= feather; dx++) {
                    const nx = x + dx;
                    const ny = y + dy;
                    if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
                      if (tempMask[ny * width + nx] === 0) zeroNeighbors++;
                    }
                  }
                }
                if (zeroNeighbors > 0) {
                  const total = (feather * 2 + 1) * (feather * 2 + 1);
                  const factor = 1 - zeroNeighbors / total;
                  alphaMask[pIdx] = Math.floor(factor * 255);
                }
              }
            }
          }
        }

        // Apply alpha mask to image data
        for (let i = 0; i < width * height; i++) {
          data[i * 4 + 3] = alphaMask[i];
        }

        ctx.putImageData(imageData, 0, 0);

        const dataUrl = canvas.toDataURL('image/png');
        resolve({
          canvas,
          dataUrl,
          width,
          height,
        });
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (e) => {
      reject(new Error('Failed to load image for background removal: ' + e));
    };

    img.src = imageSrc;
  });
}
