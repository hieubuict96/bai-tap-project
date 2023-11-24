import { useContext, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { MdCallEnd } from "react-icons/md";
import { declineVideo } from "../../api/user-api";

export default function VideoCallPopup() {
  const { dataGlobal, setDataGlobal, myVideo, otherVideo, setSignal } = useContext(UserContext);

  function decline() {
    setDataGlobal({
      otherUserCall: null,
      statusCall: 0,
    });
    
    setSignal(null);
    declineVideo(dataGlobal.otherUserCall);
  }

  return (
    <div className="video-call-popup">
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
