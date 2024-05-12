import { useContext, useEffect, useRef, useState } from "react";
import "./index.scss";
import { MdCallEnd } from "react-icons/md";
import { UserContext } from "../../context/user-context";
import Peer from "simple-peer";
import { emitAcceptCall, emitDeclineCall, notRespond } from "../../socket";
import { VideoContext } from "../../context/video-context";
import { StatusCall } from "../../common/enum/status-call";
import { getImgUrl } from "../../common/common-function";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { AUDIO_BELL, DOMAIN_BACKEND, TIMES_FOR_WAITING_CALL } from "../../common/const";

export default function ReceiveCallPopup({display}: any) {
  const {
    user
  } = useContext(UserContext);
  const { statusCall, setStatusCall, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, dataOtherGroup, setDataOtherGroup, is2Person, setIs2Person, peer, setPeer } = useContext(VideoContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [time, setTime] = useState(1);

  async function accept() {
    audioRef.current?.pause();

    if (statusCall == StatusCall.VIDEO_CALL_RECEIVE) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      setStatusCall(StatusCall.IN_VIDEO_CALL);
  
      myVideo.current.srcObject = stream;
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
  
      peer.on("signal", (signal) => {
        emitAcceptCall(user.id, dataOtherUser.id, is2Person, signal);
      });
  
      peer.on("stream", (currentStream) => {
        otherVideo.current.srcObject = currentStream;
      });
  
      peer.signal(signal);
      connectionRef.current = peer;
    } else {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
      setStream(stream);
  
      myVideo.current.srcObject = stream;
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });
  
      peer.on("signal", (signal) => {
        emitAcceptCall(user.id, dataOtherUser.id, is2Person, signal);
      });
  
      peer.on("stream", (currentStream) => {
        otherVideo.current.srcObject = currentStream;
      });
  
      peer.signal(signal);
      connectionRef.current = peer;
    }
  }

  function decline() {
    setStatusCall(StatusCall.REST);
    setSignal(null);
    setDataOtherUser(null);
    setIs2Person(null);
    audioRef.current?.pause();
    emitDeclineCall(user.id, dataOtherUser.id, is2Person);
  }

  function handleNotRespond() {
    setTime(1);
    setStatusCall(StatusCall.REST);
    setSignal(null);
    setDataOtherUser(null);
    setIs2Person(null);
    notRespond(user.id, dataOtherUser.id, is2Person);
  }

  const handleAudioEnded = () => {
    if (time + 1 <= TIMES_FOR_WAITING_CALL) {
      setTime(time + 1);
      audioRef.current?.play();
    } else {
      handleNotRespond();
    }
  };

  useEffect(() => {
    if (statusCall == StatusCall.CALL_RECEIVE || statusCall == StatusCall.VIDEO_CALL_RECEIVE) {
      audioRef.current?.play();
    }
  }, [statusCall]);

  return (
    <div className="receive-call-popup" style={{ display: display ? 'flex' : 'none' }}>
      <div style={{ display: 'none' }}>
        <audio controls ref={audioRef} onEnded={handleAudioEnded}>
          <source src={AUDIO_BELL} type="audio/ogg" />
        </audio>
      </div>

      <div>
        <div className="title">
          <img src={getImgUrl(dataOtherUser ? dataOtherUser.imgUrl : null)} />
          <span>{dataOtherUser?.fullName}</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: '10px' }}>Đang gọi cho bạn</div>
        <div className="row-action">
          <div onClick={accept}>
            {statusCall == StatusCall.CALL_RECEIVE && (<IoCall size={24} color="white" />)}
            {statusCall == StatusCall.VIDEO_CALL_RECEIVE && (<FaVideo size={24} color="white" />)}
          </div>
          <div className="decline" onClick={decline}>
            <MdCallEnd size={24} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}
