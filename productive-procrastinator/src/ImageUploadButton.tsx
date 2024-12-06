import React, { useState, useRef } from 'react';
import { Button, Modal, Box, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, storeImageData } from './firebase';

interface ImageUploadButtonProps {
  taskId: string;
  onImageUploaded: (imageUrl: string) => void;
}

const ImageUploadButton: React.FC<ImageUploadButtonProps> = ({ taskId, onImageUploaded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
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

  const uploadToStorage = async (blob: Blob): Promise<string> => {
    const fileName = `task_${taskId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `taskImages/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const captureImage = async () => {
    if (!videoRef.current) {
      console.error('No video reference available');
      return;
    }
  
    try {
      console.log('Starting image capture process...');
      setIsUploading(true);
  
      // Create canvas and set dimensions
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Failed to get canvas context');
      }
  
      // Draw video frame to canvas
      console.log('Drawing video to canvas...');
      context.drawImage(videoRef.current, 0, 0);
      
      // Convert canvas to blob
      console.log('Converting to blob...');
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/jpeg',
          0.8
        );
      });
  
      // Upload to Storage
      console.log('Starting upload to storage...');
      const fileName = `task_${taskId}_${Date.now()}.jpg`;
      const storageRef = ref(storage, `taskImages/${fileName}`);
      
      const uploadTask = uploadBytesResumable(storageRef, blob);
  
      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              console.log('Upload complete, got URL:', url);
              resolve(url);
            } catch (error) {
              console.error('Error getting download URL:', error);
              reject(error);
            }
          }
        );
      });
  
      // Store URL in Firestore
      console.log('Storing URL in Firestore...');
      const { error: firestoreError } = await storeImageData(taskId, downloadURL);
      if (firestoreError) {
        throw firestoreError;
      }
  
      // Call the callback with the URL
      console.log('Calling onImageUploaded callback...');
      onImageUploaded(downloadURL);
  
      console.log('Image capture and upload process complete');
  
    } catch (error) {
      console.error('Error in image capture process:', error);
      // You might want to show this error to the user
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      stopCamera();
      setIsModalOpen(false);
      setUploadProgress(0);
    }
  };
  // const captureImage = async () => {
  //   if (!videoRef.current) return;

  //   try {
  //     setIsUploading(true);
  //     const canvas = document.createElement('canvas');
  //     canvas.width = videoRef.current.videoWidth;
  //     canvas.height = videoRef.current.videoHeight;
  //     const context = canvas.getContext('2d');
      
  //     if (context && videoRef.current) {
  //       context.drawImage(videoRef.current, 0, 0);
        
  //       // Convert canvas to blob
  //       const blob = await new Promise<Blob>((resolve) => 
  //         canvas.toBlob(blob => resolve(blob!), 'image/jpeg', 0.8)
  //       );

  //       // Upload to Storage
  //       const downloadURL = await uploadToStorage(blob);

  //       // Store URL in Firestore
  //       const { error } = await storeImageData(taskId, downloadURL);
  //       if (error) throw error;

  //       // Call the callback with the URL
  //       onImageUploaded(downloadURL);
  //     }
  //   } catch (error) {
  //     console.error('Error processing image:', error);
  //   } finally {
  //     setIsUploading(false);
  //     stopCamera();
  //     setIsModalOpen(false);
  //     setUploadProgress(0);
  //   }
  // };


  const testUpload = async (blob: Blob) => {
    try {
      console.log('Testing upload...');
      // const url = await testStorageUpload(blob);
      // console.log('Test successful:', url);
    } catch (error) {
      console.error('Test failed:', error);
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
          {isUploading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <CircularProgress variant="determinate" value={uploadProgress} />
              <div>{Math.round(uploadProgress)}%</div>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={captureImage}
              disabled={!stream || isUploading}
            >
              Take Photo
            </Button>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default ImageUploadButton;