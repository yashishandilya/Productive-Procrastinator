// import React, { useEffect, useState } from 'react';
// import AgoraRTC, { IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
// import { Button, Box, Modal, Grid } from "@mui/material";
// import { options } from './config';

// interface VideoCallProps {
//   setIsStreaming: (streaming: boolean) => void;
// }

// const VideoCall: React.FC<VideoCallProps> = ({ setIsStreaming }) => {
//   const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
//   const [client, setClient] = useState<any>(null);

//   useEffect(() => {
//     setRemoteUsers([]);
    
//     const agoraClient = AgoraRTC.createClient({
//       mode: "rtc",
//       codec: "vp8"
//     });
    
//     setClient(agoraClient);

//     agoraClient.on("user-published", async (user, mediaType) => {
//       await agoraClient.subscribe(user, mediaType);
//       if (mediaType === "video") {
//         // Check if user already exists before adding
//         setRemoteUsers(prev => {
//           const userExists = prev.some(u => u.uid === user.uid);
//           if (userExists) return prev;
//           return [...prev, user];
//         });
        
//         const remoteTrack = user.videoTrack;
//         if (remoteTrack) {
//           // Add a check to prevent duplicate video elements
//           const existingContainer = document.getElementById(`remote-user-${user.uid}`);
//           if (existingContainer && !existingContainer.hasChildNodes()) {
//             remoteTrack.play(`remote-user-${user.uid}`);
//           }
//         }
//       }
//       if (mediaType === "audio") {
//         user.audioTrack?.play();
//       }
//     });

//     agoraClient.on("user-left", (user) => {
//       console.log("User left:", user.uid);
//       // Clean up video tracks
//       if (user.videoTrack) {
//         user.videoTrack.stop();
//       }
//       if (user.audioTrack) {
//         user.audioTrack.stop();
//       }
//       setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
//     });

//     const init = async () => {
//       try {
//         await agoraClient.join(
//           options.appId,
//           options.channel,
//           options.token,
//           null
//         );

//         const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
//         const videoTrack = await AgoraRTC.createCameraVideoTrack();

//         const container = document.getElementById('local-player');
//         if (container) {
//           videoTrack.play('local-player');
//         }

//         await agoraClient.publish([audioTrack, videoTrack]);
//       } catch (error) {
//         console.error("Error initializing call:", error);
//         setIsStreaming(false);
//       }
//     };

//     init();

//     return () => {
//       setRemoteUsers([]);
//       if (client) {
//         client.removeAllListeners();
//         client.leave().then(() => {
//           console.log("Left channel successfully");
//         }).catch((err: any) => {
//           console.error("Error leaving channel:", err);
//         });
//       }
//     };
//   }, []);

//   const handleEndStream = async () => {
//     if (client) {
//       await client.leave();
//       setRemoteUsers([]);
//     }
//     setIsStreaming(false);
//   };

//   return (
//     <Modal
//       open={true}
//       onClose={handleEndStream}
//     >
//       <Box sx={{
//         position: 'absolute',
//         top: '50%',
//         left: '50%',
//         transform: 'translate(-50%, -50%)',
//         width: '80%',
//         maxWidth: '900px',
//         bgcolor: 'background.paper',
//         boxShadow: 24,
//         p: 3,
//         borderRadius: 2,
//       }}>
//         <Grid container spacing={2} sx={{ mb: 2 }}>
//           {/* Local Video */}
//           <Grid item xs={12} md={remoteUsers.length > 0 ? 6 : 12}>
//             <Box sx={{
//               position: 'relative',
//               width: '100%',
//               height: '300px',
//             }}>
//               <div
//                 id="local-player"
//                 style={{
//                   width: '100%',
//                   height: '100%',
//                   backgroundColor: '#000',
//                   borderRadius: '8px',
//                   overflow: 'hidden'
//                 }}
//               />
//               <div style={{ 
//                 textAlign: 'center', 
//                 marginTop: '8px',
//                 fontSize: '14px',
//                 color: '#666'
//               }}>
//                 You
//               </div>
//             </Box>
//           </Grid>

//           {/* Remote Videos */}
//           {remoteUsers.map(user => (
//             <Grid item xs={12} md={6} key={user.uid}>
//               <Box sx={{
//                 position: 'relative',
//                 width: '100%',
//                 height: '300px',
//               }}>
//                 <div
//                   id={`remote-user-${user.uid}`}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     backgroundColor: '#000',
//                     borderRadius: '8px',
//                     overflow: 'hidden'
//                   }}
//                 />
//                 <div style={{ 
//                   textAlign: 'center', 
//                   marginTop: '8px',
//                   fontSize: '14px',
//                   color: '#666'
//                 }}>
//                   Remote User {user.uid}
//                 </div>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>

//         <Box sx={{ 
//           display: 'flex', 
//           justifyContent: 'center',
//           mt: 2 
//         }}>
//           <Button 
//             variant="contained" 
//             color="error"
//             onClick={handleEndStream}
//             sx={{ 
//               px: 4,
//               py: 1,
//               fontSize: '16px',
//               minWidth: '200px'
//             }}
//           >
//             End Stream
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// };

// export default VideoCall;

import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC, { IAgoraRTCRemoteUser, ICameraVideoTrack, IMicrophoneAudioTrack, IRemoteVideoTrack, IRemoteAudioTrack } from 'agora-rtc-sdk-ng';
import { Button, Box, Modal, Grid } from "@mui/material";
import { options } from './config';

interface VideoCallProps {
  setIsStreaming: (streaming: boolean) => void;
}

interface LocalTracks {
  audioTrack: IMicrophoneAudioTrack | null;
  videoTrack: ICameraVideoTrack | null;
}

const VideoCall: React.FC<VideoCallProps> = ({ setIsStreaming }) => {
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [client, setClient] = useState<ReturnType<typeof AgoraRTC.createClient> | null>(null);
  const localTracksRef = useRef<LocalTracks>({ audioTrack: null, videoTrack: null });

  const initTracks = async () => {
    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    const videoTrack = await AgoraRTC.createCameraVideoTrack();
    localTracksRef.current = { audioTrack, videoTrack };
    return { audioTrack, videoTrack };
  };

  const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
    if (!client) return;

    await client.subscribe(user, mediaType);

    if (mediaType === 'video') {
      setRemoteUsers(prev => {
        if (prev.some(u => u.uid === user.uid)) return prev;
        return [...prev, user];
      });

      const videoTrack = user.videoTrack as IRemoteVideoTrack;
      if (videoTrack) {
        const container = document.getElementById(`remote-user-${user.uid}`);
        if (container && !container.hasChildNodes()) {
          videoTrack.play(`remote-user-${user.uid}`);
        }
      }
    }

    if (mediaType === 'audio') {
      const audioTrack = user.audioTrack as IRemoteAudioTrack;
      audioTrack?.play();
    }
  };

  const handleUserLeft = (user: IAgoraRTCRemoteUser) => {
    setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
  };

  const setupAgoraClient = () => {
    const agoraClient = AgoraRTC.createClient({
      mode: "rtc",
      codec: "vp8"
    });

    agoraClient.on("user-published", handleUserPublished);
    agoraClient.on("user-left", handleUserLeft);

    setClient(agoraClient);
    return agoraClient;
  };

  const cleanupTracks = () => {
    if (localTracksRef.current.audioTrack) {
      localTracksRef.current.audioTrack.stop();
      localTracksRef.current.audioTrack.close();
    }
    if (localTracksRef.current.videoTrack) {
      localTracksRef.current.videoTrack.stop();
      localTracksRef.current.videoTrack.close();
    }
    localTracksRef.current = { audioTrack: null, videoTrack: null };
  };

  useEffect(() => {
    const startCall = async () => {
      try {
        const agoraClient = setupAgoraClient();
        
        await agoraClient.join(
          options.appId,
          options.channel,
          options.token,
          null
        );

        const { audioTrack, videoTrack } = await initTracks();
        
        const container = document.getElementById('local-player');
        if (container) {
          videoTrack.play('local-player');
        }

        await agoraClient.publish([audioTrack, videoTrack]);
      } catch (error) {
        console.error("Error starting call:", error);
        setIsStreaming(false);
      }
    };

    startCall();

    return () => {
      cleanupTracks();
      if (client) {
        client.removeAllListeners();
        client.leave().then(() => {
          console.log("Left channel successfully");
        }).catch((err) => {
          console.error("Error leaving channel:", err);
        });
      }
    };
  }, []);

  const handleEndStream = async () => {
    cleanupTracks();
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