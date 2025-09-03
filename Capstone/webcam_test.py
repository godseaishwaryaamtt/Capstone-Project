#!/usr/bin/env python3
"""
AgroRakshak - Tomato Early Blight Specialist
Optimized specifically for detecting tomato early blight
"""

from ultralytics import YOLO
import cv2
import numpy as np
import time

class EarlyBlightDetector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)
        
    def enhance_for_early_blight(self, frame):
        """Enhanced preprocessing specifically for early blight lesions"""
        
        # 1. Convert to Lab color space for better lesion contrast
        lab = cv2.cvtColor(frame, cv2.COLOR_BGR2LAB)
        l, a, b = cv2.split(lab)
        
        # 2. Enhance L channel for better spot visibility
        clahe = cv2.createCLAHE(clipLimit=3.0, tileGridSize=(8,8))
        l = clahe.apply(l)
        
        enhanced_lab = cv2.merge([l, a, b])
        enhanced = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2BGR)
        
        # 3. Sharpen to enhance small lesion edges
        kernel = np.array([[-1,-1,-1,-1,-1],
                          [-1, 2, 2, 2,-1],
                          [-1, 2, 8, 2,-1], 
                          [-1, 2, 2, 2,-1],
                          [-1,-1,-1,-1,-1]]) / 8.0
        sharpened = cv2.filter2D(enhanced, -1, kernel)
        
        # 4. Enhance brown/dark spots typical of early blight
        hsv = cv2.cvtColor(sharpened, cv2.COLOR_BGR2HSV)
        h, s, v = cv2.split(hsv)
        
        # Boost saturation for better disease spot visibility
        s = cv2.add(s, 25)
        s = np.clip(s, 0, 255)
        
        result = cv2.merge([h, s, v])
        result = cv2.cvtColor(result, cv2.COLOR_HSV2BGR)
        
        return result
    
    def detect_with_multi_scale(self, frame):
        """Multi-scale detection for small early blight lesions"""
        detections = []
        
        # Test multiple confidence thresholds for early blight sensitivity
        confidence_levels = [0.1, 0.15, 0.2, 0.25]
        
        for conf in confidence_levels:
            try:
                results = self.model(frame, conf=conf, iou=0.3, verbose=False)
                
                if len(results) > 0 and len(results.boxes) > 0:
                    for box in results.boxes:
                        cls_id = int(box.cls)
                        confidence = float(box.conf)
                        
                        # Focus specifically on tomato early blight (class 8)
                        if cls_id == 8:  # Tomato Early Blight
                            detections.append({
                                'class_id': cls_id,
                                'confidence': confidence,
                                'bbox': box.xyxy.tolist(),
                                'detection_level': conf
                            })
                            
                            print(f"🔍 Early Blight detected at confidence {conf}: {confidence:.3f}")
                            
            except Exception as e:
                continue
        
        # Return highest confidence detection
        if detections:
            return max(detections, key=lambda x: x['confidence'])
        return None

def draw_early_blight_results(frame, detection):
    """Specialized display for early blight detection"""
    height, width = frame.shape[:2]
    
    # Title
    cv2.putText(frame, "AgroRakshak - Early Blight Specialist", 
                (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
    
    if detection:
        confidence = detection['confidence']
        x1, y1, x2, y2 = map(int, detection['bbox'])
        detection_level = detection['detection_level']
        
        # High visibility red for early blight
        color = (0, 0, 255)
        
        # Draw detection box
        cv2.rectangle(frame, (x1, y1), (x2, y2), color, 4)
        
        # Early blight specific information
        disease_text = "🦠 TOMATO EARLY BLIGHT DETECTED"
        conf_text = f"📊 Confidence: {confidence:.1%}"
        level_text = f"🎯 Detection Level: {detection_level}"
        
        # Symptoms information
        symptoms_text = "📋 Symptoms: Dark concentric rings on leaves"
        action_text = "💡 Action: Apply fungicide, improve air flow"
        
        texts = [disease_text, conf_text, level_text, symptoms_text, action_text]
        
        # Background box
        max_width = max(cv2.getTextSize(text, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2) for text in texts)
        cv2.rectangle(frame, (x1, y1 - 160), (x1 + max_width + 20, y1), (0, 0, 0), -1)
        
        # Draw texts
        y_pos = y1 - 140
        for text in texts:
            cv2.putText(frame, text, (x1 + 10, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            y_pos += 25
        
        # Urgency warning
        cv2.putText(frame, "⚠️  HIGH PRIORITY: Immediate treatment required", 
                   (10, height - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2)
    
    else:
        # Scanning message
        cv2.putText(frame, "🔍 Scanning for Early Blight...", 
                   (10, height - 80), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
        cv2.putText(frame, "📱 Focus camera on tomato leaf spots", 
                   (10, height - 40), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
    
    return frame

def main():
    print("🍅 AgroRakshak Early Blight Specialist")
    print("🎯 Optimized for detecting Tomato Early Blight")
    print("="*50)
    
    # Initialize detector
    try:
        detector = EarlyBlightDetector('training/results/gpu_optimized/weights/best.pt')
        print("✅ Early Blight specialist model loaded")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("❌ Could not open webcam")
        return
    
    # Optimize webcam settings for disease detection
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_BRIGHTNESS, 0.6)
    cap.set(cv2.CAP_PROP_CONTRAST, 0.7)
    
    print("🎥 Camera ready for Early Blight detection")
    print("💡 TIPS for better detection:")
    print("   • Get close to tomato leaves with spots")
    print("   • Ensure good, even lighting")
    print("   • Look for dark, concentric ring patterns")
    print("   • Hold camera steady")
    print("="*50)
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            
            frame = cv2.flip(frame, 1)
            
            # Enhanced preprocessing for early blight
            enhanced_frame = detector.enhance_for_early_blight(frame)
            
            # Multi-scale detection
            detection = detector.detect_with_multi_scale(enhanced_frame)
            
            # Display results
            display_frame = draw_early_blight_results(frame, detection)
            
            # Show frame
            cv2.imshow('Early Blight Specialist - AgroRakshak', display_frame)
            
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                break
            elif key == ord('s') and detection:
                # Save detection
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"early_blight_detection_{timestamp}.jpg"
                cv2.imwrite(filename, display_frame)
                print(f"💾 Early Blight detection saved: {filename}")
    
    except KeyboardInterrupt:
        print("\n🛑 Early Blight detection stopped")
    finally:
        cap.release()
        cv2.destroyAllWindows()
        print("✅ Early Blight specialist shutdown")

if __name__ == "__main__":
    main()
