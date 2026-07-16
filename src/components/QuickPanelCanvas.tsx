import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';

interface QuickPanelCanvasProps {
  screenshotUrl: string | null;
  wallpaperUrl: string | null;
  screenshotOpacity: number; // 0 to 1
  onWallpaperTransform?: (pos: { x: number; y: number }, scale: number) => void;
  containerWidth: number;
  containerHeight: number;
}

export interface QuickPanelCanvasRef {
  reset: () => void;
  center: () => void;
  exportImage: () => string | null;
}

export const QuickPanelCanvas = forwardRef<QuickPanelCanvasRef, QuickPanelCanvasProps>(
  ({ screenshotUrl, wallpaperUrl, screenshotOpacity, onWallpaperTransform, containerWidth, containerHeight }, ref) => {
    const stageRef = useRef<any>(null);
    const [screenshotImg, setScreenshotImg] = useState<HTMLImageElement | null>(null);
    const [wallpaperImg, setWallpaperImg] = useState<HTMLImageElement | null>(null);

    // Wallpaper transform states
    const [wallpaperPos, setWallpaperPos] = useState({ x: 0, y: 0 });
    const [wallpaperScale, setWallpaperScale] = useState(1);

    // Native screenshot dimensions
    const [screenshotDim, setScreenshotDim] = useState({ width: 1080, height: 2400 });

    // Load Screenshot
    useEffect(() => {
      if (screenshotUrl) {
        const img = new Image();
        img.src = screenshotUrl;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          setScreenshotImg(img);
          setScreenshotDim({ width: img.width, height: img.height });
        };
      } else {
        setScreenshotImg(null);
      }
    }, [screenshotUrl]);

    // Load Wallpaper
    useEffect(() => {
      if (wallpaperUrl) {
        const img = new Image();
        img.src = wallpaperUrl;
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          setWallpaperImg(img);
        };
      } else {
        setWallpaperImg(null);
      }
    }, [wallpaperUrl]);

    // Auto-fit wallpaper on load
    useEffect(() => {
      if (screenshotImg && wallpaperImg) {
        resetWallpaper();
      }
    }, [screenshotImg, wallpaperImg]);

    const resetWallpaper = () => {
      if (!screenshotImg || !wallpaperImg) return;
      const screenW = screenshotDim.width;
      const screenH = screenshotDim.height;
      const wallW = wallpaperImg.width;
      const wallH = wallpaperImg.height;

      const scaleX = screenW / wallW;
      const scaleY = screenH / wallH;
      const scale = Math.max(scaleX, scaleY); // Cover mode

      const x = (screenW - wallW * scale) / 2;
      const y = (screenH - wallH * scale) / 2;

      setWallpaperScale(scale);
      setWallpaperPos({ x, y });

      if (onWallpaperTransform) {
        onWallpaperTransform({ x, y }, scale);
      }
    };

    const centerWallpaper = () => {
      if (!screenshotImg || !wallpaperImg) return;
      const screenW = screenshotDim.width;
      const screenH = screenshotDim.height;
      const wallW = wallpaperImg.width;

      const x = (screenW - wallW * wallpaperScale) / 2;
      const y = (screenH - wallpaperImg.height * wallpaperScale) / 2;

      setWallpaperPos({ x, y });

      if (onWallpaperTransform) {
        onWallpaperTransform({ x, y }, wallpaperScale);
      }
    };

    // Expose control methods to parent component
    useImperativeHandle(ref, () => ({
      reset: resetWallpaper,
      center: centerWallpaper,
      exportImage: () => {
        if (!stageRef.current) return null;
        // Clean up focus/transformer nodes if any, then export
        // For now, export the current stage at native screenshot resolution
        try {
          return stageRef.current.toDataURL({
            pixelRatio: 1 / stageScale, // Invert stage scale to export at native resolution!
            mimeType: 'image/png',
            quality: 1
          });
        } catch (err) {
          console.error("Export failed, attempting standard fallback:", err);
          return stageRef.current.toDataURL();
        }
      }
    }));

    // Calculate Stage Scale to fit in device container
    const stageScale = Math.min(
      containerWidth / screenshotDim.width,
      containerHeight / screenshotDim.height
    );

    const stageWidth = screenshotDim.width * stageScale;
    const stageHeight = screenshotDim.height * stageScale;

    // Mouse wheel zoom centered on cursor
    const handleWheel = (e: any) => {
      if (!wallpaperImg) return;
      e.evt.preventDefault();

      const stage = stageRef.current;
      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.08;
      const oldScale = wallpaperScale;
      
      // Calculate new scale
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      const boundedScale = Math.max(0.1, Math.min(15, newScale));

      // Calculate new position to keep zoom centered on cursor
      // Convert pointer to native canvas coordinates
      const nativePointerX = pointer.x / stageScale;
      const nativePointerY = pointer.y / stageScale;

      const dx = nativePointerX - wallpaperPos.x;
      const dy = nativePointerY - wallpaperPos.y;

      const newX = nativePointerX - dx * (boundedScale / oldScale);
      const newY = nativePointerY - dy * (boundedScale / oldScale);

      setWallpaperScale(boundedScale);
      setWallpaperPos({ x: newX, y: newY });

      if (onWallpaperTransform) {
        onWallpaperTransform({ x: newX, y: newY }, boundedScale);
      }
    };

    // Touch gesture pinch-to-zoom variables
    const lastDist = useRef<number>(0);
    const lastCenter = useRef<{ x: number; y: number } | null>(null);

    const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    };

    const getCenter = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
      return {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
    };

    const handleTouchMove = (e: any) => {
      if (!wallpaperImg) return;
      const touch1 = e.evt.touches[0];
      const touch2 = e.evt.touches[1];

      if (touch1 && touch2) {
        e.evt.preventDefault();
        const stage = stageRef.current;
        const rect = stage.container().getBoundingClientRect();

        const p1 = {
          x: touch1.clientX - rect.left,
          y: touch1.clientY - rect.top,
        };
        const p2 = {
          x: touch2.clientX - rect.left,
          y: touch2.clientY - rect.top,
        };

        const dist = getDistance(p1, p2);
        const center = getCenter(p1, p2);

        if (!lastDist.current) {
          lastDist.current = dist;
          lastCenter.current = center;
          return;
        }

        const scaleBy = dist / lastDist.current;
        const oldScale = wallpaperScale;
        const newScale = oldScale * scaleBy;
        const boundedScale = Math.max(0.1, Math.min(15, newScale));

        // Center relative to native coordinates
        const nativeCenterX = center.x / stageScale;
        const nativeCenterY = center.y / stageScale;

        const dx = nativeCenterX - wallpaperPos.x;
        const dy = nativeCenterY - wallpaperPos.y;

        const newX = nativeCenterX - dx * (boundedScale / oldScale);
        const newY = nativeCenterY - dy * (boundedScale / oldScale);

        setWallpaperScale(boundedScale);
        setWallpaperPos({ x: newX, y: newY });

        if (onWallpaperTransform) {
          onWallpaperTransform({ x: newX, y: newY }, boundedScale);
        }

        lastDist.current = dist;
        lastCenter.current = center;
      }
    };

    const handleTouchEnd = () => {
      lastDist.current = 0;
      lastCenter.current = null;
    };

    const handleDoubleClick = () => {
      if (wallpaperImg) {
        resetWallpaper();
      }
    };

    return (
      <div 
        className="relative overflow-hidden flex items-center justify-center bg-[#07080a] select-none"
        style={{ width: containerWidth, height: containerHeight }}
      >
        {!screenshotImg && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-text-secondary select-none">
            <span className="text-4xl mb-3 text-primary animate-pulse">📱</span>
            <p className="text-sm font-medium text-white">Preview Screen</p>
            <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Upload a Samsung Quick Panel screenshot to begin customizing.</p>
          </div>
        )}

        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          scaleX={stageScale}
          scaleY={stageScale}
          onWheel={handleWheel}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDblClick={handleDoubleClick}
          className="shadow-inner"
        >
          <Layer>
            {/* 1. Wallpaper Image (Behind) */}
            {wallpaperImg && (
              <KonvaImage
                image={wallpaperImg}
                x={wallpaperPos.x}
                y={wallpaperPos.y}
                scaleX={wallpaperScale}
                scaleY={wallpaperScale}
                draggable
                onDragEnd={(e) => {
                  const newPos = { x: e.target.x(), y: e.target.y() };
                  setWallpaperPos(newPos);
                  if (onWallpaperTransform) {
                    onWallpaperTransform(newPos, wallpaperScale);
                  }
                }}
              />
            )}

            {/* 2. Screenshot Image (On Top) */}
            {screenshotImg && (
              <KonvaImage
                image={screenshotImg}
                x={0}
                y={0}
                width={screenshotDim.width}
                height={screenshotDim.height}
                opacity={screenshotOpacity}
                listening={false} // Click-through enabled
              />
            )}
          </Layer>
        </Stage>
      </div>
    );
  }
);

QuickPanelCanvas.displayName = 'QuickPanelCanvas';
