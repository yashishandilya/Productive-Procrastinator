import React, { useEffect, useState } from 'react';
import AgoraRTC, { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { Button, Box, Modal, Grid } from "@mui/material";
import { options } from './config';

interface VideoCallProps {
  setIsStreaming: (streaming: boolean) => void;
}

const VideoCall: React.FC<VideoCallProps> = ({ setIsStreaming }) => {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    setRemoteUsers([]);
    
    const agoraClient = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8"
    });
    
    setClient(agoraClient);

    agoraClient.on("user-published", async (user, mediaType) => {
      await agoraClient.subscribe(user, mediaType);
      if (mediaType === "video") {
        setRemoteUsers(prev => {
          if (prev.find(u => u.uid === user.uid)) return prev;
          return [...prev, user];
        });
        const remoteTrack = user.videoTrack;
        if (remoteTrack) {
          setTimeout(() => {
            remoteTrack.play(`remote-user-${user.uid}`);
          }, 100);
        }
      }
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    agoraClient.on("user-left", (user) => {
      console.log("User left:", user.uid);
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
    });

    const init = async () => {
      try {
        await agoraClient.join(
          options.appId,
          options.channel,
          options.token,
          null
        );

        const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const videoTrack = await AgoraRTC.createCameraVideoTrack();

        const container = document.getElementById('local-player');
        if (container) {
          videoTrack.play('local-player');
        }

        await agoraClient.publish([audioTrack, videoTrack]);
      } catch (error) {
        console.error("Error initializing call:", error);
        setIsStreaming(false);
      }
    };

    init();

    return () => {
      setRemoteUsers([]);
      if (client) {
        client.removeAllListeners();
        client.leave().then(() => {
          console.log("Left channel successfully");
        }).catch((err: any) => {
          console.error("Error leaving channel:", err);
        });
      }
    };
  }, []);

  const handleEndStream = async () => {
    if (client) {
      await client.leave();
      setRemoteUsers([]);
    }
    setIsStreaming(false);
  };

  return (
    <Modal
      open={true}
      onClose={handleEndStream}
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '900px',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
      }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Local Video */}
          <Grid item xs={12} md={remoteUsers.length > 0 ? 6 : 12}>
            <Box sx={{
              position: 'relative',
              width: '100%',
              height: '300px',
            }}>
              <div
                id="local-player"
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#000',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
              <div style={{ 
                textAlign: 'center', 
                marginTop: '8px',
                fontSize: '14px',
                color: '#666'
              }}>
                You
              </div>
            </Box>
          </Grid>

          {/* Remote Videos */}
          {remoteUsers.map(user => (
            <Grid item xs={12} md={6} key={user.uid}>
              <Box sx={{
                position: 'relative',
                width: '100%',
                height: '300px',
              }}>
                <div
                  id={`remote-user-${user.uid}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: '#000',
                    borderRadius: '8px',
                    overflow: 'hidden'
                  }}
                />
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '8px',
                  fontSize: '14px',
                  color: '#666'
                }}>
                  Remote User {user.uid}
                </div>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          mt: 2 
        }}>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleEndStream}
            sx={{ 
              px: 4,
              py: 1,
              fontSize: '16px',
              minWidth: '200px'
            }}
          >
            End Stream
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default VideoCall;