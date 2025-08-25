# Capstone/training/resume_gpu_training.py

from ultralytics import YOLO
import torch
import os

if __name__ == '__main__':
    print("CUDA Available:", torch.cuda.is_available())
    print("PyTorch Version:", torch.__version__)
    print("GPU Name:", torch.cuda.get_device_name(0))

    dataset_path = r'A:\Capstone Project github\Capstone-Project\Capstone\data\data.yaml'
    
    model = YOLO('yolov8n.pt')
    print("Starting optimized GPU training...")

    # Optimized settings for RTX 3050 Ti
    results = model.train(
        data=dataset_path,
        epochs=100,
        device='cuda',
        batch=-1,             # Auto-detect optimal batch size
        imgsz=640,
        amp=True,             # Mixed precision
        workers=1,            # Low workers to avoid CPU bottleneck
        mosaic=0.0,           # Disable CPU-intensive mosaic
        cache='ram',          # Cache dataset in RAM if possible
        patience=50,          # Early stopping
        resume=False,
        project='results',
        name='gpu_optimized'
    )
