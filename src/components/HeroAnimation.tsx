import React, { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 80;
const IMAGES_BASE_PATH = '/ball_animation/ag0hjkkb31rmt0cw4dhtfpgwg0_result__';
const PAD_LENGTH = 3;

interface HeroAnimationProps {
  className?: string;
}

const HeroAnimation: React.FC<HeroAnimationProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const requestRef = useRef<number>();

  // Preload images
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const onImageLoad = () => {
      loadedCount++;
      if (loadedCount === FRAME_COUNT) {
        setImagesLoaded(true);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const frameIndex = i.toString().padStart(PAD_LENGTH, '0');
      img.src = `${IMAGES_BASE_PATH}${frameIndex}.jpg`;
      img.onload = onImageLoad;
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      images.forEach((img) => {
        img.onload = null;
      });
    };
  }, []);

  // Canvas Rendering & Scroll Logic
  useEffect(() => {
    if (!imagesLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const render = () => {
      // 1. Calculate Scroll Progress
      // Fix: Map progress to the Hero Section height (approx 1100vh of scrollable distance), 
      // not the entire page. This ensures the animation finishes exactly when the user
      // scrolls past the Hero section.
      
      // Match the CSS heights: 800vh (mobile) -> 7 viewports interaction, 1200vh (desktop) -> 11 viewports
      const isMobile = window.innerWidth < 768;
      const scrollFactor = isMobile ? 7 : 11;
      const scrollDistance = window.innerHeight * scrollFactor;
      
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, scrollY / scrollDistance));
      
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.floor(progress * FRAME_COUNT)
      );

      const img = imagesRef.current[frameIndex];
      if (!img) return;

      // 2. High DPI Scaling
      const dpr = window.devicePixelRatio || 1;
      
      // We need to ensure the canvas internal resolution matches the display size * dpr.
      // However, resizing the canvas clears it, so we should only resize if dimensions change.
      // For now, let's assume the canvas is sized via CSS to 100% width/height of viewport.
      // But we need to update the `width` and `height` attributes to match.
      
      const rect = canvas.getBoundingClientRect();
      const targetWidth = rect.width * dpr;
      const targetHeight = rect.height * dpr;

      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        context.scale(dpr, dpr);
      } else {
        // Reset transform to identity before rendering to handle simple clearing? 
        // Actually, if we scaled context previously, we might need to be careful.
        // Easiest is to just clear and draw.
        // If we set canvas.width assigned above, it resets context.
        // If we didn't resize, the context scale is probably lost? 
        // No, context state is preserved unless canvas is resized.
        // But to be safe and responsive:
        // Let's just create a draw function that assumes correct setup.
      }

      // Re-assert scale in case it was lost or not set if resize didn't happen this frame
      // Actually, setting canvas.width resets the context. So we only scale when we resize.
      // But if we DONT resize, we assume the previous scale is still valid?
      // Yes. However, `canvas.width` check handles the resize.
      // Let's just always clearRect logic based on virtual dimensions.
      
      // Wait, if we don't resize, we don't reset scale. Good.
      
      // 3. Draw Image (Object Fit: COVER)
      // Destination dimensions (CSS pixels)
      const canvasWidth = rect.width;
      const canvasHeight = rect.height;

      // Image dimensions
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;

      // Calculate scale to COVER the canvas
      const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
      
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      
      // Center the image
      const offsetX = (canvasWidth - drawWidth) / 2;
      const offsetY = (canvasHeight - drawHeight) / 2;
      
      // Clear Main Canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [imagesLoaded]);

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none -z-10 bg-black ${className}`}>
      {/* Canvas Layer - Increased Brightness and reduced blur as requested */}
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-contain filter brightness-[1.1] opacity-100"
      />
      
      {/* Overlay Layer for Text Readability - Reduced intensity for brighter ball */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
      
      {/* Vignette - Softer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)]"></div>
    </div>
  );
};

export default HeroAnimation;
