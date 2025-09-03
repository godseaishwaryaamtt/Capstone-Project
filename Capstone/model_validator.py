#!/usr/bin/env python3
"""
AgroRakshak Model Verification Script
Test your trained YOLOv8 model on dataset images to verify training accuracy
"""

from ultralytics import YOLO
import cv2
import os
import glob
from pathlib import Path
import json
from collections import defaultdict, Counter
import numpy as np

class ModelValidator:
    def __init__(self, model_path):
        self.model = YOLO(model_path)
        self.class_names = {
            0: 'Apple___Apple_scab',
            1: 'Apple___Black_rot', 
            2: 'Apple___Cedar_apple_rust',
            3: 'Apple___healthy',
            4: 'Corn_(maize)___Cercospora_leaf_spot',
            5: 'Corn_(maize)___Common_rust_',
            6: 'Corn_(maize)___Northern_Leaf_Blight',
            7: 'Corn_(maize)___healthy',
            8: 'Tomato___Bacterial_spot',
            9: 'Tomato___Early_blight',
            10: 'Tomato___Late_blight',
            11: 'Tomato___Leaf_Mold',
            12: 'Tomato___Septoria_leaf_spot',
            13: 'Tomato___Target_Spot',
            14: 'Tomato___healthy'
        }
        
        # Statistics tracking
        self.detection_stats = defaultdict(list)
        self.class_predictions = Counter()
        self.confidence_scores = defaultdict(list)
        
    def test_single_image(self, image_path, show_result=True, conf_threshold=0.25):
        """Test model on a single image"""
        print(f"\n🔍 Testing: {Path(image_path).name}")
        
        # Load image
        image = cv2.imread(image_path)
        if image is None:
            print(f"❌ Could not load image: {image_path}")
            return None
        
        # Run detection
        results = self.model(image, conf=conf_threshold, verbose=False)
        
        detections = []
        if len(results) > 0 and len(results[0].boxes) > 0:
            for box in results[0].boxes:
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0])
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                
                detection = {
                    'class_id': cls_id,
                    'class_name': self.class_names.get(cls_id, f'Unknown_{cls_id}'),
                    'confidence': confidence,
                    'bbox': (x1, y1, x2, y2)
                }
                detections.append(detection)
                
                # Update statistics
                self.class_predictions[cls_id] += 1
                self.confidence_scores[cls_id].append(confidence)
                
                print(f"   ✅ Detected: {detection['class_name']} ({confidence:.1%})")
        
        if not detections:
            print("   ❌ No detections found")
        
        # Show visual result
        if show_result and detections:
            self.display_result(image, detections, Path(image_path).name)
        
        return detections
    
    def display_result(self, image, detections, title):
        """Display image with detection results"""
        display_image = image.copy()
        
        for detection in detections:
            x1, y1, x2, y2 = detection['bbox']
            confidence = detection['confidence']
            class_name = detection['class_name']
            
            # Color coding
            if 'healthy' in class_name.lower():
                color = (0, 255, 0)  # Green
            elif 'Early_blight' in class_name:
                color = (0, 165, 255)  # Orange (to check bias)
            else:
                color = (0, 0, 255)  # Red
            
            # Draw bounding box
            cv2.rectangle(display_image, (x1, y1), (x2, y2), color, 2)
            
            # Draw label
            label = f"{class_name.split('___')[-1]}: {confidence:.1%}"
            cv2.putText(display_image, label, (x1, y1-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Resize for display
        height, width = display_image.shape[:2]
        if width > 800:
            scale = 800 / width
            new_width = int(width * scale)
            new_height = int(height * scale)
            display_image = cv2.resize(display_image, (new_width, new_height))
        
        cv2.imshow(f'Model Test - {title}', display_image)
        print(f"   Press any key to continue...")
        cv2.waitKey(0)
        cv2.destroyAllWindows()
    
    def test_dataset_folder(self, dataset_path, conf_threshold=0.25, max_images=50):
        """Test model on a folder of dataset images"""
        print(f"🔍 Testing model on dataset: {dataset_path}")
        print(f"📊 Confidence threshold: {conf_threshold}")
        print("="*60)
        
        # Find all image files
        image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.JPG', '*.JPEG', '*.PNG']
        image_files = []
        
        for ext in image_extensions:
            image_files.extend(glob.glob(os.path.join(dataset_path, ext)))
            image_files.extend(glob.glob(os.path.join(dataset_path, '**', ext), recursive=True))
        
        if not image_files:
            print(f"❌ No images found in {dataset_path}")
            return
        
        print(f"📁 Found {len(image_files)} images")
        
        # Limit number of images for testing
        if len(image_files) > max_images:
            image_files = image_files[:max_images]
            print(f"🔢 Testing first {max_images} images")
        
        # Test each image
        total_detections = 0
        images_with_detections = 0
        
        for i, image_path in enumerate(image_files, 1):
            detections = self.test_single_image(image_path, show_result=False, conf_threshold=conf_threshold)
            
            if detections:
                total_detections += len(detections)
                images_with_detections += 1
            
            # Progress indicator
            if i % 10 == 0:
                print(f"📈 Progress: {i}/{len(image_files)} images processed")
        
        # Generate report
        self.generate_report(len(image_files), images_with_detections, total_detections)
    
    def generate_report(self, total_images, images_with_detections, total_detections):
        """Generate comprehensive testing report"""
        print("\n" + "="*80)
        print("📊 MODEL VALIDATION REPORT")
        print("="*80)
        
        # Basic statistics
        detection_rate = (images_with_detections / total_images) * 100
        avg_detections = total_detections / images_with_detections if images_with_detections > 0 else 0
        
        print(f"📁 Total images tested: {total_images}")
        print(f"✅ Images with detections: {images_with_detections}")
        print(f"📊 Detection rate: {detection_rate:.1f}%")
        print(f"🎯 Total detections: {total_detections}")
        print(f"📈 Average detections per positive image: {avg_detections:.1f}")
        
        # Class distribution analysis
        print(f"\n🏷️ CLASS PREDICTION DISTRIBUTION:")
        print("-" * 50)
        
        total_predictions = sum(self.class_predictions.values())
        for cls_id, count in sorted(self.class_predictions.items()):
            class_name = self.class_names.get(cls_id, f'Unknown_{cls_id}')
            percentage = (count / total_predictions) * 100 if total_predictions > 0 else 0
            print(f"   {cls_id:2d}: {class_name:35s} - {count:3d} ({percentage:5.1f}%)")
        
        # Early Blight bias check
        early_blight_count = self.class_predictions.get(9, 0)
        if early_blight_count > total_predictions * 0.5:
            print(f"\n⚠️ WARNING: Early Blight bias detected!")
            print(f"   Early Blight represents {(early_blight_count/total_predictions)*100:.1f}% of all detections")
            print(f"   This suggests model training imbalance")
        
        # Confidence score analysis
        print(f"\n📊 CONFIDENCE SCORE ANALYSIS:")
        print("-" * 50)
        
        for cls_id, scores in self.confidence_scores.items():
            if scores:
                class_name = self.class_names.get(cls_id, f'Unknown_{cls_id}')
                avg_conf = np.mean(scores)
                min_conf = min(scores)
                max_conf = max(scores)
                print(f"   {class_name:35s}: Avg={avg_conf:.2f}, Min={min_conf:.2f}, Max={max_conf:.2f}")
        
        # Model health assessment
        print(f"\n🏥 MODEL HEALTH ASSESSMENT:")
        print("-" * 50)
        
        if detection_rate < 30:
            print("❌ LOW DETECTION RATE: Model may not be trained properly")
        elif detection_rate > 90:
            print("⚠️  HIGH DETECTION RATE: Check for false positives")
        else:
            print("✅ NORMAL DETECTION RATE: Model appears functional")
        
        unique_classes = len(self.class_predictions)
        if unique_classes < 5:
            print(f"⚠️  LIMITED CLASS DIVERSITY: Only {unique_classes} classes detected")
        else:
            print(f"✅ GOOD CLASS DIVERSITY: {unique_classes} classes detected")
        
        print("="*80)

def main():
    """Main function with user interface"""
    print("🍃 AgroRakshak Model Validation Tool")
    print("Verify your trained YOLOv8 model accuracy")
    print("="*50)
    
    # Model path
    model_path = 'training/results/gpu_optimized/weights/best.pt'
    
    if not os.path.exists(model_path):
        print(f"❌ Model not found at: {model_path}")
        model_path = input("Enter correct model path: ").strip()
        if not os.path.exists(model_path):
            print("❌ Model still not found. Exiting.")
            return
    
    # Initialize validator
    validator = ModelValidator(model_path)
    
    print(f"✅ Model loaded successfully")
    print(f"🎯 Model classes: {len(validator.class_names)}")
    
    # Choose testing mode
    print(f"\n📋 Select testing mode:")
    print("   1 - Test single image")
    print("   2 - Test dataset folder (batch)")
    print("   3 - Test validation dataset folder")
    
    choice = input("Enter choice (1-3): ").strip()
    
    if choice == '1':
        # Single image testing
        image_path = input("Enter image path: ").strip().strip('"')
        if os.path.exists(image_path):
            conf = float(input("Enter confidence threshold (0.1-0.9, default 0.25): ") or "0.25")
            validator.test_single_image(image_path, show_result=True, conf_threshold=conf)
        else:
            print(f"❌ Image not found: {image_path}")
    
    elif choice == '2':
        # Dataset folder testing
        dataset_path = input("Enter dataset folder path: ").strip().strip('"')
        if os.path.exists(dataset_path):
            conf = float(input("Enter confidence threshold (0.1-0.9, default 0.25): ") or "0.25")
            max_imgs = int(input("Max images to test (default 50): ") or "50")
            validator.test_dataset_folder(dataset_path, conf_threshold=conf, max_images=max_imgs)
        else:
            print(f"❌ Dataset folder not found: {dataset_path}")
    
    elif choice == '3':
        # Validation dataset
        val_paths = [
            'training/data/yolo_data/images/val',
            'data/val/images',
            'dataset/val/images',
            'val/images'
        ]
        
        val_path = None
        for path in val_paths:
            if os.path.exists(path):
                val_path = path
                break
        
        if val_path:
            print(f"✅ Found validation dataset: {val_path}")
            conf = float(input("Enter confidence threshold (0.1-0.9, default 0.25): ") or "0.25")
            validator.test_dataset_folder(val_path, conf_threshold=conf, max_images=100)
        else:
            print("❌ Validation dataset not found. Please specify path manually.")
            dataset_path = input("Enter validation dataset path: ").strip().strip('"')
            if os.path.exists(dataset_path):
                conf = float(input("Enter confidence threshold (0.1-0.9, default 0.25): ") or "0.25")
                validator.test_dataset_folder(dataset_path, conf_threshold=conf, max_images=100)

if __name__ == "__main__":
    main()
