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
    const imageNodeRef = useRef(null);        // unified ref for active KonvaImage node
    const [wallpaperImg, setWallpaperImg] = useState(null);
    const [screenshotImg, setScreenshotImg] = useState(null);

    // Always keep transformRef in sync so touch handlers never close over stale state
    const transformRef = useRef(transform);
    useEffect(() => { transformRef.current = transform; }, [transform]);

    // -- Blur caching -----------------------------------------------------------
    // Konva requires .cache() before any filter (including Blur) takes effect.
    useEffect(() => {
      const node = imageNodeRef.current;
      if (!node) return;
      if (filters.blur > 0) {
        node.cache({ pixelRatio: 0.15 });
      } else {
        node.clearCache();
      }
      node.getLayer()?.batchDraw();
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
      onTransformChange({ ...transformRef.current, x, y, scale });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [screenshotSize]);

    useImperativeHandle(ref, () => ({
      center: () => {
        if (!wallpaperImg) return;
        const t = transformRef.current;
        const x = (screenshotSize.width - wallpaperImg.width * t.scale) / 2;
        const y = (screenshotSize.height - wallpaperImg.height * t.scale) / 2;
        onTransformChange({ ...t, x, y });
      },
      reset: () => { if (wallpaperImg) autoFit(wallpaperImg); },
      exportImage: () => {
        const node = imageNodeRef.current;
        const stage = stageRef.current;
        if (!stage) return null;

        // Temporarily re-cache at high quality for high-res export if blur is active
        const hasBlur = filters.blur > 0;
        if (node && hasBlur) {
          node.cache({ pixelRatio: 1 / stageScale });
        }

        const dataUrl = stage.toDataURL({ pixelRatio: 1 / stageScale }) ?? null;

        // Restore low-quality preview cache
        if (node && hasBlur) {
          node.cache({ pixelRatio: 0.15 });
        }

        return dataUrl;
      },
      getStage: () => stageRef.current,
    }));

    // -- Wheel zoom -------------------------------------------------------------
    const handleWheel = (e) => {
      e.evt.preventDefault();
      if (!wallpaperImg) return;
      const pointer = stageRef.current.getPointerPosition();
      if (!pointer) return;
      const t = transformRef.current;
      const scaleBy = 1.07;
      const oldScale = t.scale;
      const newScale = e.evt.deltaY < 0
        ? Math.min(oldScale * scaleBy, 15)
        : Math.max(oldScale / scaleBy, 0.05);
      const nX = pointer.x / stageScale;
      const nY = pointer.y / stageScale;
      const dx = nX - t.x;
      const dy = nY - t.y;

      const nextTransform = {
        ...t,
        scale: newScale,
        x: nX - dx * (newScale / oldScale),
        y: nY - dy * (newScale / oldScale),
      };
      transformRef.current = nextTransform;

      const node = imageNodeRef.current;
      if (node) {
        node.x(nextTransform.x);
        node.y(nextTransform.y);
        node.scaleX(nextTransform.scale);
        node.scaleY(nextTransform.scale);
        node.getLayer()?.batchDraw();
      }

      if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        onTransformChange(transformRef.current);
      }, 100);
    };

    // -- Touch pinch-zoom + pan (all at Stage level) ----------------------------
    const lastDist = useRef(0);
    const lastCenter = useRef(null);
    const lastSingleTouch = useRef(null);
    const isSingleDragging = useRef(false);
    const wheelTimeout = useRef(null);

    useEffect(() => {
      return () => {
        if (wheelTimeout.current) clearTimeout(wheelTimeout.current);
      };
    }, []);

    const getTouchPoints = (evt) => {
      const rect = stageRef.current.container().getBoundingClientRect();
      return Array.from(evt.touches).map((t) => ({
        x: t.clientX - rect.left,
        y: t.clientY - rect.top,
      }));
    };

    const handleTouchStart = (e) => {
      if (!wallpaperImg) return;
      const pts = getTouchPoints(e.evt);
      if (pts.length >= 2) {
        isSingleDragging.current = false;
        lastSingleTouch.current = null;
        lastDist.current = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        lastCenter.current = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
      } else if (pts.length === 1) {
        isSingleDragging.current = true;
        lastSingleTouch.current = pts[0];
        lastDist.current = 0;
        lastCenter.current = null;
      }
    };

    const handleTouchMove = (e) => {
      if (!wallpaperImg) return;
      e.evt.preventDefault();
      const pts = getTouchPoints(e.evt);

      if (pts.length >= 2) {
        // Two-finger: pinch-zoom + simultaneous pan
        isSingleDragging.current = false;
        const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
        if (!lastDist.current || !lastCenter.current) {
          lastDist.current = dist;
          lastCenter.current = center;
          return;
        }
        const t = transformRef.current;
        const ratio = dist / lastDist.current;
        const oldScale = t.scale;
        const newScale = Math.max(0.05, Math.min(15, oldScale * ratio));
        const nX = center.x / stageScale;
        const nY = center.y / stageScale;
        const dx = nX - t.x;
        const dy = nY - t.y;
        // Pan delta from pinch-center movement
        const panDX = (center.x - lastCenter.current.x) / stageScale;
        const panDY = (center.y - lastCenter.current.y) / stageScale;
        
        const nextTransform = {
          ...t,
          scale: newScale,
          x: nX - dx * (newScale / oldScale) + panDX,
          y: nY - dy * (newScale / oldScale) + panDY,
        };
        transformRef.current = nextTransform;
        
        const node = imageNodeRef.current;
        if (node) {
          node.x(nextTransform.x);
          node.y(nextTransform.y);
          node.scaleX(nextTransform.scale);
          node.scaleY(nextTransform.scale);
          node.getLayer()?.batchDraw();
        }

        lastDist.current = dist;
        lastCenter.current = center;

      } else if (pts.length === 1 && isSingleDragging.current) {
        // Single-finger pan
        const prev = lastSingleTouch.current;
        if (!prev) { lastSingleTouch.current = pts[0]; return; }
        const t = transformRef.current;
        const nextTransform = {
          ...t,
          x: t.x + (pts[0].x - prev.x) / stageScale,
          y: t.y + (pts[0].y - prev.y) / stageScale,
        };
        transformRef.current = nextTransform;

        const node = imageNodeRef.current;
        if (node) {
          node.x(nextTransform.x);
          node.y(nextTransform.y);
          node.getLayer()?.batchDraw();
        }
        
        lastSingleTouch.current = pts[0];
      }
    };

    const handleTouchEnd = (e) => {
      const pts = getTouchPoints(e.evt);
      if (pts.length < 2) {
        lastDist.current = 0;
        lastCenter.current = null;
      }
      if (pts.length === 0) {
        isSingleDragging.current = false;
        lastSingleTouch.current = null;
        // Sync final transform back to React state when gesture is fully finished
        onTransformChange(transformRef.current);
      } else if (pts.length === 1) {
        // One finger lifted mid-pinch  -  switch back to single-touch pan
        isSingleDragging.current = true;
        lastSingleTouch.current = pts[0];
      }
    };

    // Ref callback that captures the Konva node AND re-applies cache immediately
    const setImageNodeRef = useCallback((node) => {
      imageNodeRef.current = node;
      if (node && filters.blur > 0) {
        node.cache({ pixelRatio: 0.15 });
        node.getLayer()?.batchDraw();
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wallpaperImg]);

    const OUTLINE_COLORS = {
      buttons: '#4F8CFF', brightness: '#FACC15', volume: '#34C97A', media: '#C084FC',
    };

    const sharedImageProps = wallpaperImg ? {
      image: wallpaperImg,
      x: transform.x,
      y: transform.y,
      width: wallpaperImg.width,
      height: wallpaperImg.height,
      scaleX: transform.scale,
      scaleY: transform.scale,
      rotation: transform.rotation,
      opacity: filters.opacity,
      draggable: false,   // pan handled at Stage level
      filters: filters.blur > 0 ? [Konva.Filters.Blur] : [],
      blurRadius: filters.blur,
    } : {};

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
          style={{ display: 'block', margin: 'auto', touchAction: 'none' }}
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
                  <KonvaImage ref={setImageNodeRef} {...sharedImageProps} />
                </Group>
              ) : (
                <KonvaImage ref={setImageNodeRef} {...sharedImageProps} />
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
