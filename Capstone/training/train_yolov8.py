#!/usr/bin/env python3
"""
AgroRakshak YOLOv8-small Training Script
Optimized for plant disease detection with tomato-focused dataset
"""

from ultralytics import YOLO
import torch
import os
from datetime import datetime

def setup_training():
    """Setup training environment"""
    # Check GPU availability
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    print(f"🔥 Using device: {device}")
    
    if device == 'cuda':
        print(f"   GPU: {torch.cuda.get_device_name(0)}")
        print(f"   Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
    
    return device

def train_model():
    """Train YOLOv8-small model for plant disease detection"""
    
    # Initialize YOLOv8-small model
    model = YOLO('yolov8s.pt')  # Load pretrained weights
    
    # Training parameters optimized for plant disease detection
    results = model.train(
        data='data/tomato.yaml',           # Dataset configuration
        epochs=100,                      # Training epochs
        imgsz=416,                       # Image size (good balance for diseases)
        batch=16,                        # Batch size (adjust based on GPU memory)
        lr0=0.01,                        # Initial learning rate
        weight_decay=0.0005,             # Weight decay for regularization
        warmup_epochs=3,                 # Warmup epochs
        warmup_momentum=0.8,             # Warmup momentum
        box=7.5,                         # Box loss gain
        cls=0.5,                         # Classification loss gain
        dfl=1.5,                         # DFL loss gain
        patience=20,                     # Early stopping patience
        save=True,                       # Save checkpoints
        save_period=10,                  # Save every 10 epochs
        workers=8,                       # Number of dataloader workers
        project='training/results',      # Project directory
        name='plant_disease_v1',         # Experiment name
        exist_ok=True,                   # Overwrite existing
        pretrained=True,                 # Use pretrained weights
        optimizer='AdamW',               # Optimizer
        verbose=True,                    # Verbose output
        seed=42,                         # Random seed
        deterministic=True,              # Deterministic training
        single_cls=False,                # Multi-class detection
        cos_lr=True,                     # Cosine learning rate
        close_mosaic=10,                 # Close mosaic augmentation
        resume=False,                    # Resume training
        amp=True,                        # Automatic Mixed Precision
        fraction=1.0,                    # Dataset fraction to use
        profile=False,                   # Profile training
        # Data augmentation
        hsv_h=0.015,                     # HSV-Hue augmentation
        hsv_s=0.7,                       # HSV-Saturation
        hsv_v=0.4,                       # HSV-Value
        degrees=10.0,                    # Rotation degrees
        translate=0.1,                   # Translation
        scale=0.9,                       # Scale
        shear=0.0,                       # Shear
        perspective=0.0,                 # Perspective
        flipud=0.0,                      # Vertical flip
        fliplr=0.5,                      # Horizontal flip
        mosaic=1.0,                      # Mosaic augmentation
        mixup=0.15,                      # MixUp augmentation
        copy_paste=0.3                   # Copy-paste augmentation
    )
    
    return results

def export_model():
    """Export trained model for deployment"""
    try:
        # Load best model
        model = YOLO('training/results/plant_disease_v1/weights/best.pt')
        
        # Export to ONNX for Raspberry Pi deployment
        model.export(
            format='onnx',
            imgsz=416,
            optimize=True,
            half=False,  # Keep FP32 for better compatibility
            int8=False,
            dynamic=False,
            simplify=True,
            opset=11
        )
        
        print("✅ Model exported to ONNX format for Raspberry Pi deployment")
        
        # Export to TensorRT for NVIDIA Jetson (if available)
        try:
            model.export(format='engine', imgsz=416, half=True)
            print("✅ Model exported to TensorRT format")
        except:
            print("⚠️  TensorRT export skipped (NVIDIA dependencies not available)")
            
    except Exception as e:
        print(f"❌ Export failed: {e}")

def main():
    print("🚀 Starting AgroRakshak YOLOv8 Training...")
    print(f"🍅 Optimized for tomato disease detection")
    print(f"🎯 Target: 90-95% mAP50 accuracy for October 1st deadline")
    
    # Setup
    device = setup_training()
    
    # Train model
    print("\n📈 Training YOLOv8-small for plant disease detection...")
    results = train_model()
    
    print(f"\n✅ Training completed!")
    print(f"📊 Best mAP50: {results.results_dict.get('metrics/mAP50(B)', 'N/A')}")
    print(f"📁 Results saved in: training/results/plant_disease_v1/")
    
    # Export for deployment
    print("\n📦 Exporting model for deployment...")
    export_model()
    
    print("\n🎯 Training pipeline complete!")
    print("Next: Test inference and prepare for Raspberry Pi deployment")

if __name__ == "__main__":
    main()
