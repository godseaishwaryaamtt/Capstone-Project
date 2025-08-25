#!/usr/bin/env python3
"""
Convert PlantVillage datasets to YOLO format with proper error handling
"""

import os
import shutil
import random
from pathlib import Path
import cv2

# Disease class mapping
CLASS_MAPPING = {
    'Apple___Apple_scab': 0,
    'Apple___Black_rot': 1, 
    'Apple___Cedar_apple_rust': 2,
    'Apple___healthy': 3,
    'Corn_(maize)___Cercospora_leaf_spot': 4,
    'Corn_(maize)___Common_rust_': 5,
    'Corn_(maize)___Northern_Leaf_Blight': 6,
    'Corn_(maize)___healthy': 7,
    'Tomato___Bacterial_spot': 8,
    'Tomato___Early_blight': 9,
    'Tomato___Late_blight': 10,
    'Tomato___Leaf_Mold': 11,
    'Tomato___Septoria_leaf_spot': 12,
    'Tomato___Target_Spot': 13,
    'Tomato___healthy': 14
}

def create_yolo_directories():
    """Create YOLO directory structure"""
    dirs = [
        'data/yolo_data/images/train',
        'data/yolo_data/images/val',
        'data/yolo_data/labels/train',
        'data/yolo_data/labels/val'
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"✅ Created: {dir_path}")

def process_plantvillage():
    """Process PlantVillage dataset"""
    pv_path = Path('data/plantvillage_raw')
    processed_count = 0
    
    # Check if the path exists
    if not pv_path.exists():
        print(f"❌ Error: {pv_path} does not exist")
        return 0
    
    print(f"📁 Looking for disease classes in: {pv_path.absolute()}")
    
    # Find all directories in plantvillage_raw
    class_folders = [d for d in pv_path.iterdir() if d.is_dir()]
    print(f"📋 Found {len(class_folders)} directories")
    
    for class_folder in class_folders:
        class_name = class_folder.name
        
        # Skip non-disease directories
        if class_name in ['yolo_data', '__pycache__', '.git']:
            continue
            
        if class_name in CLASS_MAPPING:
            class_id = CLASS_MAPPING[class_name]
            print(f"Processing: {class_name} (class {class_id})")
            
            # Get all images
            image_extensions = ['*.jpg', '*.JPG', '*.jpeg', '*.JPEG', '*.png', '*.PNG']
            images = []
            for ext in image_extensions:
                images.extend(list(class_folder.glob(ext)))
            
            if not images:
                print(f"⚠️  No images found in {class_name}")
                continue
                
            print(f"   Found {len(images)} images")
            
            # Split train/val 80/20
            random.shuffle(images)
            split_idx = int(0.8 * len(images))
            train_images = images[:split_idx]
            val_images = images[split_idx:]
            
            # Process training images
            for img_path in train_images:
                if process_image(img_path, class_id, 'train'):
                    processed_count += 1
            
            # Process validation images  
            for img_path in val_images:
                if process_image(img_path, class_id, 'val'):
                    processed_count += 1
        else:
            print(f"⚠️  Skipping unknown class: {class_name}")
    
    return processed_count

def process_image(img_path, class_id, split):
    """Process individual image and create YOLO annotation"""
    try:
        # Read image to get dimensions
        img = cv2.imread(str(img_path))
        if img is None:
            print(f"❌ Failed to read image: {img_path}")
            return False
        
        h, w = img.shape[:2]
        
        # Create unique filename
        img_filename = f"{img_path.stem}_{class_id}_{split}.jpg"
        yolo_img_path = Path(f"data/yolo_data/images/{split}") / img_filename
        
        # Ensure destination directory exists
        yolo_img_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Copy image to YOLO directory
        shutil.copy2(img_path, yolo_img_path)
        
        # Create YOLO annotation (full image bounding box for classification)
        yolo_label_path = Path(f"data/yolo_data/labels/{split}") / f"{img_path.stem}_{class_id}_{split}.txt"
        
        # Ensure destination directory exists
        yolo_label_path.parent.mkdir(parents=True, exist_ok=True)
        
        # YOLO format: class_id center_x center_y width height (normalized)
        annotation = f"{class_id} 0.5 0.5 1.0 1.0\n"
        
        with open(yolo_label_path, 'w') as f:
            f.write(annotation)
            
        return True
        
    except Exception as e:
        print(f"❌ Error processing {img_path}: {e}")
        return False

def main():
    print("🔄 Converting datasets to YOLO format...")
    
    # Set random seed for reproducible splits
    random.seed(42)
    
    # Create YOLO directories first
    create_yolo_directories()
    
    # Process PlantVillage
    count = process_plantvillage()
    
    print(f"✅ Processed {count} images")
    
    if count > 0:
        print("✅ YOLO dataset ready for training!")
    else:
        print("❌ No images were processed. Check your directory structure.")

if __name__ == "__main__":
    main()
