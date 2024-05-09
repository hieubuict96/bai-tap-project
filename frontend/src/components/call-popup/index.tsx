import { useContext, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { MdCallEnd } from "react-icons/md";
import { declineVideo } from "../../api/chat-api";
import { VideoContext } from "../../context/video-context";

export default function CallPopup({ display }: any) {
  const { statusCall, setStatusCall, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser } = useContext(VideoContext);

  function decline() {
    setSignal(null);
  }

  return (
    <div className="video-call-popup" style={{ visibility: display ? 'visible' : 'hidden' }}>
      <div className="popup">
        <div className="video">
          <div className="video-me size-video">
            <video playsInline muted ref={myVideo} autoPlay />
          </div>
          <div className="video-other size-video">
            <video playsInline ref={otherVideo} autoPlay />
          </div>
        </div>
        <div className="decline" onClick={decline}>
          <MdCallEnd size={24} color="white" />
        </div>
      </div>
    </div>
  );
}
