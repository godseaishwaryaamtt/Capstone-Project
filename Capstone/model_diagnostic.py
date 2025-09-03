from ultralytics import YOLO
import cv2
import torch
import numpy as np

def complete_model_diagnosis():
    print("🔍 COMPLETE MODEL DIAGNOSIS")
    print("="*60)
    
    # 1. Check model file integrity
    model_path = 'training/results/gpu_optimized/weights/best.pt'
    
    try:
        model = YOLO(model_path)
        print("✅ Model loads successfully")
        print(f"📊 Model classes: {model.names}")
        print(f"🔢 Number of classes: {len(model.names)}")
        print(f"🎯 Model task: {model.task}")
    except Exception as e:
        print(f"❌ CRITICAL: Model won't load: {e}")
        return
    
    # 2. Test with EXTREMELY low confidence
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cap.release()
    
    if not ret:
        print("❌ Can't capture from webcam")
        return
    
    print(f"\n🖼️ Test image shape: {frame.shape}")
    
    # Test with progressively lower confidence
    found_anything = False
    
    for conf_threshold in [0.001, 0.01, 0.05, 0.1, 0.2, 0.3]:
        try:
            results = model(frame, conf=conf_threshold, verbose=False)
            
            if len(results) > 0 and hasattr(results[0], 'boxes') and len(results[0].boxes) > 0:
                boxes = results[0].boxes
                print(f"✅ Confidence {conf_threshold}: Found {len(boxes)} detections")
                found_anything = True
                
                for i, box in enumerate(boxes):
                    cls_id = int(box.cls[0])
                    confidence = float(box.conf[0])
                    class_name = model.names.get(cls_id, f"Unknown_{cls_id}")
                    print(f"   Detection {i+1}: Class {cls_id} ({class_name}) - {confidence:.4f}")
                    
                if conf_threshold <= 0.01:  # Only show details for very low confidence
                    break
            else:
                print(f"❌ Confidence {conf_threshold}: No detections")
                
        except Exception as e:
            print(f"❌ Error at confidence {conf_threshold}: {e}")
    
    if not found_anything:
        print("\n🚨 CRITICAL PROBLEM: Model detects NOTHING at any confidence level")
        print("Possible causes:")
        print("1. Model is not trained properly (fake 99.5% mAP)")
        print("2. Model file is corrupted")
        print("3. Wrong model architecture")
        print("4. Training data was empty/wrong")
        
        # Test with a known good model
        print("\n🔄 Testing with pretrained YOLOv8...")
        try:
            test_model = YOLO('yolov8n.pt')  # Download pretrained model
            results = test_model(frame, conf=0.3, verbose=False)
            
            if len(results) > 0 and len(results[0].boxes) > 0:
                print("✅ Pretrained model works - YOUR model is the problem")
            else:
                print("❌ Even pretrained model fails - setup issue")
                
        except Exception as e:
            print(f"❌ Can't test pretrained model: {e}")
    
    else:
        print(f"\n✅ Model CAN detect things - use confidence <= 0.01")
    
    print("="*60)

# Run diagnosis
complete_model_diagnosis()
