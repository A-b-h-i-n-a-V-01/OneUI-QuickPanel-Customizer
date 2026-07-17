import React, { useRef, useEffect } from 'react';
import { Rect, Transformer } from 'react-konva';
import Konva from 'konva';

export interface ShapeConfig {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  cornerRadius: number;
  opacity: number;
  visible: boolean;
  fillColor: string;
  strokeColor: string;
}

interface OverlayShapeProps {
  shapeProps: ShapeConfig;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: ShapeConfig) => void;
}

export const OverlayShape: React.FC<OverlayShapeProps> = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      // Attach transformer to shape
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, shapeProps]);

  if (!shapeProps.visible) return null;

  return (
    <>
      <Rect
        ref={shapeRef}
        {...shapeProps}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (node) {
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);

            onChange({
              ...shapeProps,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
              rotation: node.rotation(),
            });
          }
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true} // Rotatable option supported!
          anchorStroke="#4F8CFF"
          anchorFill="#4F8CFF"
          anchorSize={8}
          borderStroke="#4F8CFF"
          borderStrokeWidth={1.5}
          enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left']}
        />
      )}
    </>
  );
};
