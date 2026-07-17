import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import { OverlayPanel } from './OverlayPanel';




export const CalibrationCanvas = ({
  screenshotUrl,
  screenshotSize,
  containerWidth,
  containerHeight,
  panelRects,
  activePanelId,
  onUpdateRect,
}) => {
  const [screenshotImg, setScreenshotImg] = useState(null);
  const stageRef = useRef(null);

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

  const handleStageClick = (e) => {
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
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#07080b]">
          <p className="text-gray-400 font-bold text-sm mb-1">No Screenshot Loaded</p>
          <p className="text-gray-600 text-xs max-w-[200px] leading-relaxed">
            Upload your screenshot in Step 2 to calibrate on top of it.
          </p>
        </div>
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
              rect={panelRects[activePanelId]}
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
