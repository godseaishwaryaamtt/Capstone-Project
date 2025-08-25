#!/usr/bin/env python3
"""
AgroRakshak Dataset Setup Script
Downloads and prepares PlantVillage, Tomato-Village, and PlantDoc datasets
"""

import os
import zipfile
import requests
import shutil
from pathlib import Path
import subprocess

def create_directories():
    """Create required directory structure"""
    dirs = [
        'data/plantvillage_raw',
        'data/tomato_village_raw', 
        'data/plantdoc_raw',
        'data/yolo_data/images/train',
        'data/yolo_data/images/val',
        'data/yolo_data/labels/train',
        'data/yolo_data/labels/val',
        'training/configs',
        'training/results',
        'training/logs'
    ]
    
    for dir_path in dirs:
        os.makedirs(dir_path, exist_ok=True)
        print(f"✅ Created: {dir_path}")

def download_plantvillage():
    """Download PlantVillage dataset using Kaggle API"""
    try:
        print("📥 Downloading PlantVillage dataset...")
        subprocess.run([
            'kaggle', 'datasets', 'download', '-d', 
            'abdallahalidev/plantvillage-dataset',
            '--path', 'data/plantvillage_raw'
        ], check=True)
        
        # Extract if downloaded as zip
        zip_path = 'data/plantvillage_raw/plantvillage-dataset.zip'
        if os.path.exists(zip_path):
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                zip_ref.extractall('data/plantvillage_raw')
            os.remove(zip_path)
        
        print("✅ PlantVillage downloaded and extracted")
        return True
    except Exception as e:
        print(f"❌ PlantVillage download failed: {e}")
        return False

def download_plantdoc():
    """Download PlantDoc dataset"""
    try:
        print("📥 Downloading PlantDoc dataset...")
        # PlantDoc GitHub repository
        subprocess.run([
            'git', 'clone', 
            'https://github.com/pratikkayal/PlantDoc-Dataset.git',
            'data/plantdoc_raw/PlantDoc-Dataset'
        ], check=True)
        print("✅ PlantDoc downloaded")
        return True
    except Exception as e:
        print(f"❌ PlantDoc download failed: {e}")
        return False

def setup_data_yaml():
    """Create data.yaml for YOLOv8 training"""
    yaml_content = """
# AgroRakshak Plant Disease Detection Dataset
path: data/yolo_data
train: images/train
val: images/val

# Classes for plant disease detection
nc: 15  # number of classes
names: [
  'Apple___Apple_scab',
  'Apple___Black_rot', 
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Corn_(maize)___Cercospora_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Target_Spot',
  'Tomato___healthy'
]
"""
    
    with open('data/data.yaml', 'w') as f:
        f.write(yaml_content.strip())
    
    print("✅ Created data.yaml configuration")

if __name__ == "__main__":
    print("🚀 Setting up AgroRakshak datasets...")
    
    # Create directory structure
    create_directories()
    
    # Download datasets
    pv_success = download_plantvillage()
    pd_success = download_plantdoc()
    
    # Setup YOLO configuration
    setup_data_yaml()
    
    if pv_success and pd_success:
        print("\n✅ Dataset setup complete!")
        print("Next: Run python scripts/convert_to_yolo.py")
    else:
        print("\n⚠️  Some downloads failed. Check your internet connection and Kaggle API setup.")
