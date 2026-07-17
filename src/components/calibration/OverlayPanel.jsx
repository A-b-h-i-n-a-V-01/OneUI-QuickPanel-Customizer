import React, { useRef, useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';





/** Color palette for each panel type */
const PANEL_COLORS = {
  buttons:    { fill: 'rgba(79,140,255,0.18)',  stroke: '#4F8CFF' },
  brightness: { fill: 'rgba(250,204,21,0.18)',  stroke: '#FACC15' },
  volume:     { fill: 'rgba(52,201,122,0.18)',  stroke: '#34C97A' },
  media:      { fill: 'rgba(192,132,252,0.18)', stroke: '#C084FC' },
};

export const OverlayPanel = ({
  rect,
  isSelected,
  onSelect,
  onChange,
  stageScale,
}) => {
  const shapeRef = useRef(null);
  const trRef = useRef(null);
  const colors = PANEL_COLORS[rect.id] ?? PANEL_COLORS.buttons;

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Rect
        ref={shapeRef}
        x={rect.x}
        y={rect.y}
        width={rect.width}
        height={rect.height}
        cornerRadius={rect.cornerRadius}
        fill="transparent"
        stroke={colors.stroke}
        strokeWidth={1.5 / stageScale}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        shadowColor={colors.stroke}
        shadowBlur={4 / stageScale}
        shadowOpacity={0.4}
        onDragEnd={(e) => {
          onChange({
            ...rect,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;

          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          onChange({
            ...rect,
            x: node.x(),
            y: node.y(),
            width: Math.max(40, node.width() * scaleX),
            height: Math.max(20, node.height() * scaleY),
            cornerRadius: rect.cornerRadius,
          });
        }}
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          rotateEnabled={false}
          keepRatio={false}
          anchorStroke={colors.stroke}
          anchorFill="transparent"
          anchorSize={4 / stageScale}
          anchorCornerRadius={2}
          borderStroke={colors.stroke}
          borderStrokeWidth={0.8 / stageScale}
          borderDash={[2 / stageScale, 2 / stageScale]}
          enabledAnchors={[
            'top-left', 'top-right', 'bottom-right', 'bottom-left'
          ]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 40 || newBox.height < 20) return oldBox;
            return newBox;
          }}
        />
      )}
    </>
  );
};
