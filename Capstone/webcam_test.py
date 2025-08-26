#!/usr/bin/env python3
"""
AgroRakshak Real-Time Webcam Plant Disease Detection
Enhanced version with clean disease name display
Test your 99.5% mAP50 model using laptop webcam
"""

from ultralytics import YOLO
import cv2
import numpy as np
import time

# Enhanced disease class names with clean formatting
CLASS_NAMES = {
    0: 'Apple___Apple_scab',
    1: 'Apple___Black_rot', 
    2: 'Apple___Cedar_apple_rust',
    3: 'Apple___healthy',
    4: 'Corn_(maize)___Common_rust_',
    5: 'Corn_(maize)___Northern_Leaf_Blight',
    6: 'Corn_(maize)___healthy',
    7: 'Tomato___Bacterial_spot',
    8: 'Tomato___Early_blight'
}

# Color scheme for different disease types
COLORS = {
    'healthy': (0, 255, 0),      # Green for healthy
    'disease': (0, 0, 255),      # Red for diseases
    'apple': (255, 0, 0),        # Blue for apple
    'corn': (0, 255, 255),       # Yellow for corn
    'tomato': (255, 0, 255)      # Magenta for tomato
}

def format_disease_name(raw_name):
    """Convert raw dataset names to readable disease names"""
    # Remove underscores and clean formatting
    clean_name = raw_name.replace('___', ' - ').replace('_', ' ')
    clean_name = clean_name.replace('(maize)', '').strip()
    
    # Handle specific formatting cases
    if 'Apple - Apple scab' in clean_name:
        return 'Apple Scab'
    elif 'Apple - Black rot' in clean_name:
        return 'Apple Black Rot'
    elif 'Apple - Cedar apple rust' in clean_name:
        return 'Apple Cedar Rust'
    elif 'Apple - healthy' in clean_name:
        return 'Healthy Apple'
    elif 'Corn - Common rust' in clean_name:
        return 'Corn Common Rust'
    elif 'Corn - Northern Leaf Blight' in clean_name:
        return 'Corn Northern Leaf Blight'
    elif 'Corn - healthy' in clean_name:
        return 'Healthy Corn'
    elif 'Tomato - Bacterial spot' in clean_name:
        return 'Tomato Bacterial Spot'
    elif 'Tomato - Early blight' in clean_name:
        return 'Tomato Early Blight'
    else:
        return clean_name.title()

def get_disease_info(class_name):
    """Get detailed disease information"""
    disease_info = {
        'Apple Scab': {
            'severity': 'High',
            'description': 'Fungal disease causing dark spots on leaves',
            'action': 'Apply fungicide treatment'
        },
        'Apple Black Rot': {
            'severity': 'High', 
            'description': 'Serious fungal disease affecting fruit and leaves',
            'action': 'Remove infected parts, apply copper spray'
        },
        'Apple Cedar Rust': {
            'severity': 'Medium',
            'description': 'Fungal disease causing orange spots',
            'action': 'Improve air circulation, fungicide if severe'
        },
        'Corn Common Rust': {
            'severity': 'Medium',
            'description': 'Fungal disease with rust-colored pustules',
            'action': 'Monitor and apply fungicide if spreading'
        },
        'Corn Northern Leaf Blight': {
            'severity': 'High',
            'description': 'Destructive fungal disease with large lesions',
            'action': 'Remove affected leaves, apply fungicide'
        },
        'Tomato Bacterial Spot': {
            'severity': 'High',
            'description': 'Bacterial infection causing leaf spots',
            'action': 'Remove infected plants, apply copper treatment'
        },
        'Tomato Early Blight': {
            'severity': 'Medium',
            'description': 'Fungal disease with dark concentric spots',
            'action': 'Improve air flow, apply preventive fungicide'
        }
    }
    return disease_info.get(class_name, {'severity': 'Unknown', 'description': 'Disease detected', 'action': 'Consult agricultural expert'})

def get_disease_color(class_name):
    """Get color based on disease type"""
    if 'healthy' in class_name.lower():
        return COLORS['healthy']
    elif 'Apple' in class_name:
        return COLORS['apple']
    elif 'Corn' in class_name:
        return COLORS['corn'] 
    elif 'Tomato' in class_name:
        return COLORS['tomato']
    else:
        return COLORS['disease']

def draw_predictions(frame, results, fps):
    """Draw predictions with detailed disease information"""
    height, width = frame.shape[:2]
    
    # Draw title and model info
    cv2.putText(frame, "AgroRakshak Plant Disease Detection", 
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
    cv2.putText(frame, f"Model Accuracy: 99.5% mAP50 | FPS: {fps:.1f}", 
                (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    
    # Draw predictions
    if len(results) > 0 and len(results[0].boxes) > 0:
        boxes = results[0].boxes
        
        for i in range(len(boxes)):
            # Get prediction data
            cls_id = int(boxes.cls[i])
            confidence = float(boxes.conf[i])
            x1, y1, x2, y2 = map(int, boxes.xyxy[i])
            
            # Get clean disease name and info
            raw_name = CLASS_NAMES.get(cls_id, f'Class_{cls_id}')
            disease_name = format_disease_name(raw_name)
            disease_info = get_disease_info(disease_name)
            color = get_disease_color(raw_name)
            
            # Draw bounding box with thicker line for better visibility
            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 3)
            
            # Prepare enhanced labels
            main_label = f"🔍 {disease_name}"
            conf_label = f"Confidence: {confidence:.1%}"
            severity_label = f"Severity: {disease_info['severity']}"
            
            # Calculate label background size
            labels = [main_label, conf_label, severity_label]
            max_width = 0
            total_height = 10
            
            for label in labels:
                (w, h), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                max_width = max(max_width, w)
                total_height += h + 5
            
            # Draw label background with semi-transparency effect
            overlay = frame.copy()
            cv2.rectangle(overlay, (x1, y1 - total_height), 
                         (x1 + max_width + 20, y1), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.7, frame, 0.3, 0, frame)
            
            # Draw text labels with better formatting
            y_offset = y1 - total_height + 25
            
            # Main disease name (larger, bold)
            cv2.putText(frame, main_label, (x1 + 10, y_offset), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            y_offset += 25
            
            # Confidence score
            cv2.putText(frame, conf_label, (x1 + 10, y_offset), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
            y_offset += 20
            
            # Severity level with color coding
            severity_color = (0, 0, 255) if disease_info['severity'] == 'High' else (0, 165, 255) if disease_info['severity'] == 'Medium' else (0, 255, 0)
            cv2.putText(frame, severity_label, (x1 + 10, y_offset), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, severity_color, 1)
            
            # Add action recommendation below the box
            if 'healthy' not in disease_name.lower():
                action_text = f"💡 {disease_info['action']}"
                cv2.putText(frame, action_text, (x1, y2 + 25), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Display detection summary in corner
        detection_count = len(boxes)
        healthy_count = sum(1 for i in range(len(boxes)) if 'healthy' in format_disease_name(CLASS_NAMES.get(int(boxes.cls[i]), '')).lower())
        disease_count = detection_count - healthy_count
        
        summary_text = f"Detections: {detection_count} | Healthy: {healthy_count} | Diseases: {disease_count}"
        cv2.putText(frame, summary_text, (10, height - 90), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 1)
    
    else:
        # Enhanced no detection message
        cv2.putText(frame, "🔍 Point camera at plant leaves for disease detection", 
                   (10, height - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
        cv2.putText(frame, "📍 Ensure good lighting and focus on leaf details", 
                   (10, height - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 1)
    
    return frame

def main():
    """Main webcam testing function"""
    print("🍃 Starting AgroRakshak Webcam Plant Disease Detection...")
    print("📊 Model: 99.5% mAP50 accuracy")
    print("🎥 Loading webcam and model...")
    
    # Load your trained model
    try:
        model = YOLO('training/results/gpu_optimized/weights/best.pt')
        print("✅ Model loaded successfully")
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        print("Make sure the model path is correct")
        return
    
    # Initialize webcam
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Error: Could not open webcam")
        return
    
    # Set webcam properties
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    cap.set(cv2.CAP_PROP_FPS, 30)
    
    print("✅ Webcam initialized")
    print("\n🎮 Controls:")
    print("   'q' - Quit")
    print("   's' - Save current frame")
    print("   'r' - Reset/refresh")
    print("\n📍 Instructions:")
    print("   1. Point camera at plant leaves")
    print("   2. Get close enough to see leaf details")
    print("   3. Ensure good lighting")
    print("   4. Hold steady for best results")
    print("\n🚀 Starting real-time detection...")
    
    # FPS calculation
    fps_counter = 0
    fps_timer = time.time()
    fps = 0
    
    try:
        while True:
            ret, frame = cap.read()
            if not ret:
                print("❌ Error reading from webcam")
                break
            
            # Flip frame horizontally for mirror effect
            frame = cv2.flip(frame, 1)
            
            # Run inference
            start_time = time.time()
            results = model(frame, conf=0.3, iou=0.5, verbose=False)  # Lower confidence for demo
            inference_time = (time.time() - start_time) * 1000
            
            # Calculate FPS
            fps_counter += 1
            if time.time() - fps_timer >= 1.0:
                fps = fps_counter
                fps_counter = 0
                fps_timer = time.time()
            
            # Draw predictions on frame
            frame = draw_predictions(frame, results, fps)
            
            # Add performance info
            cv2.putText(frame, f"Inference: {inference_time:.1f}ms", 
                       (10, frame.shape[0] - 60), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
            
            # Display frame
            cv2.imshow('AgroRakshak - Plant Disease Detection', frame)
            
            # Handle key presses
            key = cv2.waitKey(1) & 0xFF
            if key == ord('q'):
                print("👋 Exiting webcam test...")
                break
            elif key == ord('s'):
                # Save current frame
                timestamp = time.strftime("%Y%m%d_%H%M%S")
                filename = f"agrorakshak_detection_{timestamp}.jpg"
                cv2.imwrite(filename, frame)
                print(f"💾 Saved frame: {filename}")
            elif key == ord('r'):
                print("🔄 Refreshing...")
            
    except KeyboardInterrupt:
        print("\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"❌ Error during detection: {e}")
    finally:
        # Cleanup
        cap.release()
        cv2.destroyAllWindows()
        print("✅ Webcam test completed")

if __name__ == "__main__":
    main()
