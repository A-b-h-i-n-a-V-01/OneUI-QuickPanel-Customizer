import cv2
import numpy as np
import sys
import os
import argparse

def detect_quick_panel(image_path, output_path=None):
    if not os.path.exists(image_path):
        print(f"Error: Image path '{image_path}' does not exist.")
        return False

    img = cv2.imread(image_path)
    output = img.copy()
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    img_h, img_w = gray.shape
    img_area = img_h * img_w
    
    print(f"Loaded image: {img_w}x{img_h} pixels")

    # 1. Size-invariant preprocessing
    blur_size = int(img_w * 0.02) | 1
    blurred = cv2.GaussianBlur(gray, (blur_size, blur_size), 0)

    block_size = int(img_w * 0.05) | 1
    thresh = cv2.adaptiveThreshold(
        blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, block_size, 3
    )

    kernel_size = int(img_w * 0.02) | 1
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (kernel_size, kernel_size))
    closed = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

    # Find contours
    contours, _ = cv2.findContours(closed, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # --- APPROACH 1: Direct Outer Card Contour ---
    best_contour = None
    best_box = None
    max_score = 0

    for c in contours:
        x, y, w, h = cv2.boundingRect(c)
        aspect_ratio = float(w) / h
        width_ratio = w / img_w
        height_ratio = h / img_h
        
        # Look for a wide centered card
        if 0.70 <= width_ratio <= 0.98 and 0.12 <= height_ratio <= 0.55:
            if 0.8 <= aspect_ratio <= 2.2:
                center_dist = abs((x + w/2) - img_w/2)
                score = w * h - (center_dist * 2)
                if score > max_score:
                    max_score = score
                    best_contour = c
                    best_box = (x, y, w, h)

    # --- APPROACH 2 (Fallback): Icon Grid Clustering ---
    if best_contour is None:
        print("Approach 1 (Card border detection) failed. Running Approach 2 (Icon clustering fallback)...")
        icon_boxes = []
        
        for c in contours:
            x, y, w, h = cv2.boundingRect(c)
            aspect_ratio = float(w) / h
            extent = cv2.contourArea(c) / (w * h) if w * h > 0 else 0
            
            # Samsung Quick settings circular/square toggles are:
            # - Nearly square (aspect ratio close to 1.0)
            # - Size relative to image width: typically 5% to 18% of screen width
            width_ratio = w / img_w
            if 0.8 <= aspect_ratio <= 1.25 and 0.05 <= width_ratio <= 0.18:
                # Circle/Square shape density bounds
                if 0.5 <= extent <= 0.95:
                    icon_boxes.append((x, y, w, h))
        
        print(f"Found {len(icon_boxes)} toggle icon candidates.")
        
        if len(icon_boxes) >= 4:
            # Enclose the main group of toggles
            xs = [box[0] for box in icon_boxes]
            ys = [box[1] for box in icon_boxes]
            ws = [box[2] for box in icon_boxes]
            hs = [box[3] for box in icon_boxes]
            
            min_x, max_x = min(xs), max(xs) + max(ws)
            min_y, max_y = min(ys), max(ys) + max(hs)
            
            # Calculate average toggle size to determine padding
            avg_w = np.mean(ws)
            avg_h = np.mean(hs)
            
            pad_x = int(avg_w * 0.4)
            pad_y = int(avg_h * 0.4)
            
            # Form bounding box with safety margins (clipped to image border)
            card_x = max(int(img_w * 0.04), min_x - pad_x)
            card_y = max(int(img_h * 0.02), min_y - pad_y)
            card_w = min(int(img_w * 0.92), max_x - card_x + pad_x)
            card_h = min(int(img_h * 0.96), max_y - card_y + pad_y)
            
            best_box = (card_x, card_y, card_w, card_h)
            
            # Create a pseudo-contour for drawing approximation
            rect_contour = np.array([
                [[card_x, card_y]],
                [[card_x + card_w, card_y]],
                [[card_x + card_w, card_y + card_h]],
                [[card_x, card_y + card_h]]
            ], dtype=np.int32)
            best_contour = rect_contour

    # 5. Output results
    if best_contour is not None and best_box is not None:
        x, y, w, h = best_box
        print(f"SUCCESS: Detected Quick Panel area at: X={x}, Y={y}, Width={w}, Height={h}")

        # Draw bounding box (Red)
        cv2.rectangle(output, (x, y), (x + w, y + h), (0, 0, 255), 3)

        # Polygon approximation (Green)
        perimeter = cv2.arcLength(best_contour, True)
        approx = cv2.approxPolyDP(best_contour, 0.02 * perimeter, True)
        cv2.drawContours(output, [approx], -1, (0, 255, 0), 2)
        
        cv2.putText(output, "Quick Panel Area", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)

        if output_path is None:
            dir_name, file_name = os.path.split(image_path)
            output_path = os.path.join(dir_name, "detected_" + file_name)

        cv2.imwrite(output_path, output)
        print(f"Saved result image to: {output_path}")
        return True
    else:
        print("Error: Could not detect the Quick Panel area.")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Detect Samsung Quick Panel card.")
    parser.add_argument("image_path", help="Path to the screenshot image")
    parser.add_argument("--output", "-o", default=None, help="Path to save result")
    
    args = parser.parse_args()
    detect_quick_panel(args.image_path, args.output)
