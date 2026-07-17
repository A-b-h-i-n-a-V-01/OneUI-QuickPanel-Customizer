import { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Group } from 'react-konva';
import Konva from 'konva';

export const WallpaperCanvas = forwardRef(
  (
    {
      wallpaperUrl,
      screenshotUrl,
      screenshotSize,
      screenshotOpacity,
      transform,
      filters,
      panelRects,
      enabledPanels,
      showPanelOutlines = false,
      containerWidth,
      containerHeight,
      onTransformChange,
      previewMode = false,
    },
    ref
  ) => {
    const stageRef = useRef(null);
    const imageRef1 = useRef(null);
    const imageRef2 = useRef(null);
    const [wallpaperImg, setWallpaperImg] = useState(null);
    const [screenshotImg, setScreenshotImg] = useState(null);

    // Apply caching for Konva filters (required for Blur)
    useEffect(() => {
      const imgNode = imageRef1.current || imageRef2.current;
      if (imgNode) {
        if (filters.blur > 0) {
          // Cache the node to apply Konva filters
          imgNode.cache();
        } else {
          imgNode.clearCache();
        }
        imgNode.getLayer()?.batchDraw();
      }
    }, [filters.blur, wallpaperImg]);

    const stageScale = Math.min(
      containerWidth / screenshotSize.width,
      containerHeight / screenshotSize.height
    );
    const stageW = screenshotSize.width * stageScale;
    const stageH = screenshotSize.height * stageScale;

    // Load wallpaper
    useEffect(() => {
      if (!wallpaperUrl) { setWallpaperImg(null); return; }
      const img = new window.Image();
      img.src = wallpaperUrl;
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        setWallpaperImg(img);
        // Auto-fit on first load
        autoFit(img);
      };
      return () => { img.onload = null; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallpaperUrl]);

    // Load screenshot overlay
    useEffect(() => {
      if (!screenshotUrl) { setScreenshotImg(null); return; }
      const img = new window.Image();
      img.src = screenshotUrl;
      img.crossOrigin = 'Anonymous';
      img.onload = () => setScreenshotImg(img);
      return () => { img.onload = null; };
    }, [screenshotUrl]);

    const autoFit = useCallback((img) => {
      const scaleX = screenshotSize.width / img.width;
      const scaleY = screenshotSize.height / img.height;
      const scale = Math.max(scaleX, scaleY);
      const x = (screenshotSize.width - img.width * scale) / 2;
      const y = (screenshotSize.height - img.height * scale) / 2;
      onTransformChange({ ...transform, x, y, scale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenshotSize]);

    useImperativeHandle(ref, () => ({
      center: () => {
        if (!wallpaperImg) return;
        const x = (screenshotSize.width - wallpaperImg.width * transform.scale) / 2;
        const y = (screenshotSize.height - wallpaperImg.height * transform.scale) / 2;
        onTransformChange({ ...transform, x, y });
      },
      reset: () => {
        if (wallpaperImg) autoFit(wallpaperImg);
      },
      exportImage: () => stageRef.current?.toDataURL({ pixelRatio: 1 / stageScale }) ?? null,
      getStage: () => stageRef.current,
    }));

    // ── Wheel zoom ─────────────────────────────────────────────────────────────
    const handleWheel = (e) => {
      e.evt.preventDefault();
      if (!wallpaperImg) return;
      const pointer = stageRef.current.getPointerPosition();
      if (!pointer) return;

      const scaleBy = 1.07;
      const oldScale = transform.scale;
      const newScale = e.evt.deltaY < 0
        ? Math.min(oldScale * scaleBy, 15)
        : Math.max(oldScale / scaleBy, 0.05);

      const nX = pointer.x / stageScale;
      const nY = pointer.y / stageScale;
      const dx = nX - transform.x;
      const dy = nY - transform.y;
      const ratio = newScale / oldScale;

      onTransformChange({
        ...transform,
        scale: newScale,
        x: nX - dx * ratio,
        y: nY - dy * ratio,
      });
    };

    // ── Touch pinch ────────────────────────────────────────────────────────────
    const lastDist = useRef(0);
    const lastCenter = useRef(null);

    const handleTouchStart = (e) => {
      if (!wallpaperImg) return;
      const t1 = e.evt.touches[0];
      const t2 = e.evt.touches[1];
      if (t1 && t2) {
        const rect = stageRef.current.container().getBoundingClientRect();
        const p1 = { x: t1.clientX - rect.left, y: t1.clientY - rect.top };
        const p2 = { x: t2.clientX - rect.left, y: t2.clientY - rect.top };
        lastDist.current = Math.hypot(p2.x - p1.x, p2.y - p1.y);
        lastCenter.current = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      }
    };

    const handleTouchMove = (e) => {
      if (!wallpaperImg) return;
      const t1 = e.evt.touches[0];
      const t2 = e.evt.touches[1];
      if (!(t1 && t2)) return;
      e.evt.preventDefault();

      const rect = stageRef.current.container().getBoundingClientRect();
      const p1 = { x: t1.clientX - rect.left, y: t1.clientY - rect.top };
      const p2 = { x: t2.clientX - rect.left, y: t2.clientY - rect.top };
      const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const center = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      if (!lastDist.current) { lastDist.current = dist; lastCenter.current = center; return; }

      const ratio = dist / lastDist.current;
      const oldScale = transform.scale;
      const newScale = Math.max(0.05, Math.min(15, oldScale * ratio));
      const nX = center.x / stageScale;
      const nY = center.y / stageScale;
      const dx = nX - transform.x;
      const dy = nY - transform.y;

      onTransformChange({
        ...transform,
        scale: newScale,
        x: nX - dx * (newScale / oldScale),
        y: nY - dy * (newScale / oldScale),
      });

      lastDist.current = dist;
      lastCenter.current = center;
    };

    const handleTouchEnd = () => {
      lastDist.current = 0;
      lastCenter.current = null;
    };

    // Panel outline colors for display
    const OUTLINE_COLORS = {
      buttons: '#4F8CFF', brightness: '#FACC15', volume: '#34C97A', media: '#C084FC',
    };

    return (
      <div
        className="relative overflow-hidden bg-[#07080b] select-none"
        style={{ width: containerWidth, height: containerHeight }}
      >
        {!wallpaperImg && !screenshotImg && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-sm">
            No image loaded
          </div>
        )}

        <Stage
          ref={stageRef}
          width={stageW}
          height={stageH}
          scaleX={stageScale}
          scaleY={stageScale}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ display: 'block', margin: 'auto' }}
        >
          {/* Wallpaper layer */}
          <Layer>
            {wallpaperImg && (
              previewMode ? (
                <Group
                  clipFunc={(ctx) => {
                    enabledPanels.forEach((panelId) => {
                      const rect = panelRects[panelId];
                      if (!rect) return;
                      ctx.roundRect
                        ? ctx.roundRect(rect.x, rect.y, rect.width, rect.height, rect.cornerRadius)
                        : ctx.rect(rect.x, rect.y, rect.width, rect.height);
                    });
                  }}
                >
                  <KonvaImage
                    ref={imageRef1}
                    image={wallpaperImg}
                    x={transform.x}
                    y={transform.y}
                    width={wallpaperImg.width}
                    height={wallpaperImg.height}
                    scaleX={transform.scale}
                    scaleY={transform.scale}
                    rotation={transform.rotation}
                    opacity={filters.opacity}
                    draggable
                    onDragEnd={(e) =>
                      onTransformChange({ ...transform, x: e.target.x(), y: e.target.y() })
                    }
                    filters={filters.blur > 0 ? [Konva.Filters.Blur] : []}
                    blurRadius={filters.blur}
                  />
                </Group>
              ) : (
                <KonvaImage
                  ref={imageRef2}
                  image={wallpaperImg}
                  x={transform.x}
                  y={transform.y}
                  width={wallpaperImg.width}
                  height={wallpaperImg.height}
                  scaleX={transform.scale}
                  scaleY={transform.scale}
                  rotation={transform.rotation}
                  opacity={filters.opacity}
                  draggable
                  onDragEnd={(e) =>
                    onTransformChange({ ...transform, x: e.target.x(), y: e.target.y() })
                  }
                  filters={filters.blur > 0 ? [Konva.Filters.Blur] : []}
                  blurRadius={filters.blur}
                />
              )
            )}
          </Layer>

          {/* Screenshot overlay layer */}
          {screenshotImg && !previewMode && (
            <Layer>
              <KonvaImage
                image={screenshotImg}
                x={0}
                y={0}
                width={screenshotSize.width}
                height={screenshotSize.height}
                opacity={screenshotOpacity}
                listening={false}
              />
            </Layer>
          )}

          {/* Panel outline indicators */}
          {showPanelOutlines && (
            <Layer>
              {enabledPanels.map((panelId) => {
                const rect = panelRects[panelId];
                if (!rect) return null;
                return (
                  <Rect
                    key={rect.id}
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    cornerRadius={rect.cornerRadius}
                    stroke={OUTLINE_COLORS[rect.id] ?? '#fff'}
                    strokeWidth={1.5 / stageScale}
                    fill="transparent"
                    listening={false}
                    dash={[6 / stageScale, 3 / stageScale]}
                  />
                );
              })}
            </Layer>
          )}
        </Stage>
      </div>
    );
  }
);

WallpaperCanvas.displayName = 'WallpaperCanvas';
