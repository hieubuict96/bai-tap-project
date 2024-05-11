import { useContext, useRef, useState } from "react";
import "./index.scss";
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdCallEnd } from "react-icons/md";
import { UserContext } from "../../context/user-context";
import { declineVideo } from "../../api/chat-api";
import Peer from "simple-peer";
import { emitAcceptCall, emitDeclineCall } from "../../socket";
import { VideoContext } from "../../context/video-context";
import { StatusCall } from "../../common/enum/status-call";
import { getImgUrl } from "../../common/common-function";
import { IoCall } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";

export default function ReceiveCallPopup({display}: any) {
  const {
    user
  } = useContext(UserContext);
  const { statusCall, setStatusCall, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, is2Person, setIs2Person, peer, setPeer } = useContext(VideoContext);
  const audioRef = useRef<any>(null);
  const [time, setTime] = useState(1);

  async function accept() {
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
        video: true,
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
    emitDeclineCall(user.id, dataOtherUser.id, is2Person);
  }

  const handleAudioEnded = () => {
    if (time + 1 <= 9) {
      setTime(time + 1);
      audioRef.current.play();
    } else {
      decline();
    }
  };

  return (
    <div className="call-popup" style={{ visibility: display ? 'visible' : 'hidden' }}>
      {statusCall == StatusCall.CALL_RECEIVE || statusCall == StatusCall.VIDEO_CALL_RECEIVE && (
        <div style={{ display: 'none' }}>
          <audio controls autoPlay ref={audioRef} onEnded={handleAudioEnded}>
            <source src="/static/messenger-call.mp3" type="audio/ogg" />
          </audio>
        </div>
      )}

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
