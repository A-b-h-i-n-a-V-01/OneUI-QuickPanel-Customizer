import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { OverlayPanel } from './OverlayPanel';
import { type PanelType, type PanelRect } from '../../types';

interface CalibrationCanvasProps {
  screenshotUrl: string;
  screenshotSize: { width: number; height: number };
  containerWidth: number;
  containerHeight: number;
  panelRects: Partial<Record<PanelType, PanelRect>>;
  activePanelId: PanelType | null;
  onUpdateRect: (id: PanelType, rect: PanelRect) => void;
}

export const CalibrationCanvas: React.FC<CalibrationCanvasProps> = ({
  screenshotUrl,
  screenshotSize,
  containerWidth,
  containerHeight,
  panelRects,
  activePanelId,
  onUpdateRect,
}) => {
  const [screenshotImg, setScreenshotImg] = useState<HTMLImageElement | null>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (!screenshotUrl) return;
    const img = new window.Image();
    img.src = screenshotUrl;
    img.crossOrigin = 'Anonymous';
    img.onload = () => setScreenshotImg(img);
    return () => { img.onload = null; };
  }, [screenshotUrl]);

  // Scale stage to fit container while preserving aspect ratio
  const stageScale = Math.min(
    containerWidth / screenshotSize.width,
    containerHeight / screenshotSize.height
  );
  const stageWidth  = screenshotSize.width  * stageScale;
  const stageHeight = screenshotSize.height * stageScale;

  const handleStageClick = (e: any) => {
    // Deselect when clicking empty area
    if (e.target === e.target.getStage()) {
      // no-op; keep current panel selected during calibration
    }
  };

  return (
    <div
      className="relative bg-[#07080b] flex items-center justify-center overflow-hidden rounded-2xl"
      style={{ width: containerWidth, height: containerHeight }}
    >
      {!screenshotImg && (
        <p className="text-gray-600 text-sm">Loading screenshot…</p>
      )}

      <Stage
        ref={stageRef}
        width={stageWidth}
        height={stageHeight}
        scaleX={stageScale}
        scaleY={stageScale}
        onClick={handleStageClick}
      >
        {/* Screenshot layer */}
        <Layer>
          {screenshotImg && (
            <KonvaImage
              image={screenshotImg}
              x={0}
              y={0}
              width={screenshotSize.width}
              height={screenshotSize.height}
              opacity={0.7}
            />
          )}
        </Layer>

        {/* Overlay shapes layer */}
        <Layer>
          {activePanelId && panelRects[activePanelId] && (
            <OverlayPanel
              rect={panelRects[activePanelId]!}
              isSelected={true}
              onSelect={() => {}}
              onChange={(updated) => onUpdateRect(activePanelId, updated)}
              stageScale={stageScale}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};
