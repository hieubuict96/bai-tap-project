import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:8000"); // Thay đổi URL socket server tùy theo cấu hình của bạn

const VideoCallGroup = () => {
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<any[]>([]); // Mảng lưu trữ các đối tượng Peer

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
    //   setMyStream(stream);
    //   addVideoStream(myVideoRef.current, stream, true);
    //   socket.emit("joinRoom");



    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);

  const addVideoStream = (video: HTMLVideoElement | null, stream: MediaStream, isLocal: boolean) => {
    if (video) {
      video.srcObject = stream;
      video.autoplay = true;
      video.muted = false;
    }
  };

  const connectToNewUser = (userId: string, stream: MediaStream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("newUser", { userId, signal });
    });

    peer.on("stream", (stream) => {
      addVideoStream(createRemoteVideoElement(userId), stream, false);
    });

    socket.on("signal", (data) => {
      if (data.userId === userId) {
        peer.signal(data.signal);
      }
    });

    setPeers((prevPeers) => [...prevPeers, peer]);
  };

  const createRemoteVideoElement = (userId: string) => {
    const video = document.createElement("video");
    video.id = userId;
    video.className = "remote-video";
    video.autoplay = true;
    video.controls = false;

    if (remoteVideosRef.current) {
      remoteVideosRef.current.appendChild(video);
    }

    return video;
  };

  const removePeer = (userId: string) => {
    const peer = peers.find((p) => p.remoteId === userId);
    if (peer) {
      peer.destroy();
      setPeers((prevPeers) => prevPeers.filter((p) => p.remoteId !== userId));
    }
    const videoElement = document.getElementById(userId);
    if (videoElement && videoElement.parentNode) {
      videoElement.parentNode.removeChild(videoElement);
    }
  };

  return (
    <div>
      <div>
        <video ref={myVideoRef} />
      </div>
      <div ref={remoteVideosRef}></div>
    </div>
  );
};

export default VideoCallGroup;