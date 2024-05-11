import { useContext, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { MdCallEnd } from "react-icons/md";
import { declineVideo } from "../../api/chat-api";
import { VideoContext } from "../../context/video-context";
import { StatusCall } from "../../common/enum/status-call";
import { emitDeclineCall, offCall } from "../../socket";

export default function CallPopup({ display }: any) {
  const { user } = useContext(UserContext);
  const { statusCall, setStatusCall, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, is2Person, setIs2Person, peer, setPeer } = useContext(VideoContext);

  function decline() {
    setStatusCall(StatusCall.REST);
    setPeer(null);
    setSignal(null);
    setIs2Person(null);
    setDataOtherUser(null);

    if (stream != null) {
      const tracks = stream.getTracks();
      tracks.forEach((track: any) => {
        track.stop();
      });
      setStream(null);
    }

    offCall(user.id, dataOtherUser.id, is2Person);
  }

  return (
    <div className="call-popup" style={{ display: display ? 'flex' : 'none' }}>
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
