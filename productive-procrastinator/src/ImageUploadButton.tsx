// ImageUploadButton.tsx
import React, { useState, useRef } from 'react';
import { Button, Modal, Box } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';

interface ImageUploadButtonProps {
  taskId: string;
  onImageUploaded: (image: string) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ taskId, onImageUploaded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context && videoRef.current) {
        context.drawImage(videoRef.current, 0, 0);
      }
      
      const base64Image = canvas.toDataURL('image/jpeg');
      onImageUploaded(base64Image);
      stopCamera();
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<PhotoCamera />}
        onClick={() => {
          setIsModalOpen(true);
          startCamera();
        }}
      >
        Capture
      </Button>

      <Modal
        open={isModalOpen}
        onClose={() => {
          stopCamera();
          setIsModalOpen(false);
        }}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center'
        }}>
          <video
            ref={videoRef}
            autoPlay
            style={{ maxWidth: '100%', borderRadius: 8 }}
          />
          <Button
            variant="contained"
            onClick={captureImage}
            disabled={!stream}
          >
            Take Photo
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ImageUploadButton;