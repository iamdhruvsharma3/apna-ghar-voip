import React, { useState, useRef } from 'react';
import Peer from 'simple-peer';
import './VoIP.css'

function VoIP() {
    const [isCalling, setIsCalling] = useState(false);
    const [isVideoCall, setIsVideoCall] = useState(true);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerRef = useRef(null);
    const [errorMessage, setErrorMessage] = useState('');
  
    const startCall = async () => {
      try {
        setErrorMessage('');
        const constraints = { video: isVideoCall, audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
        localVideoRef.current.srcObject = stream;
  
        const peer = new Peer({ initiator: true, stream, trickle: false });
  
        peer.on('signal', (data) => {
          // Send the signaling data to the other peer
        });
  
        peer.on('stream', (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
  
        peerRef.current = peer;
        setIsCalling(true);
      } catch (error) {
        setErrorMessage('Error accessing media devices. Please grant permission.');
        console.error('Error accessing media devices:', error);
      }
    };
  
    const hangUpCall = () => {
      if (peerRef.current) {
        peerRef.current.destroy();
        if (localVideoRef.current && localVideoRef.current.srcObject) {
          localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        if (remoteVideoRef.current && remoteVideoRef.current.srcObject) {
          remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
        setIsCalling(false);
      }
    };
    
  
    const toggleVideo = () => {
      setIsVideoCall((prevIsVideoCall) => {
        const newIsVideoCall = !prevIsVideoCall;
    
        if (peerRef.current) {
          const constraints = { video: newIsVideoCall, audio: true };
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
              localVideoRef.current.srcObject = stream;
              peerRef.current.replaceStream(stream);
            })
            .catch((error) => {
              console.error('Error accessing media devices:', error);
            });
        }
    
        return newIsVideoCall;
      });
    };
    
    return (
      <div className="container">
        <h1>apna ghar Virtual Tour</h1>
        <div className="video-container">
          <video ref={localVideoRef} autoPlay muted className="local-video"></video>
          <video ref={remoteVideoRef} autoPlay className="remote-video"></video>
        </div>
        <div className="controls">
          <button className="start-call" onClick={startCall} disabled={isCalling}>Start Call</button>
          <button className="hang-up" onClick={hangUpCall} disabled={!isCalling}>Hang Up</button>
          <button className="toggle-video" onClick={toggleVideo}>Toggle Video/Audio</button>
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    );
}

export default VoIP