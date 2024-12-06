import { useState } from 'react';
import { Button } from '@mui/material';
import VideoCall from './VideoCall';

const VideoStream = () => {
  const [isStreaming, setIsStreaming] = useState(false);

  return (
    <div>
      {isStreaming ? (
        <VideoCall setIsStreaming={setIsStreaming} />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            console.log("Starting stream...");
            setIsStreaming(true);
          }}
        >
          Start Stream
        </Button>
      )}
    </div>
  );
};

export default VideoStream;