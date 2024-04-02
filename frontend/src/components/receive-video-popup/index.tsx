import { useContext, useRef, useState } from "react";
import "./index.scss";
import { BiSolidPhoneCall } from "react-icons/bi";
import { MdCallEnd } from "react-icons/md";
import { UserContext } from "../../context/user-context";
import { declineVideo } from "../../api/chat-api";
import Peer from "simple-peer";
import { emitAcceptVideo } from "../../socket/socket";

export default function CallPopup() {
  const {
    user,
    dataGlobal,
    setDataGlobal,
    myVideo,
    otherVideo,
    connectionRef,
    signal,
    setSignal,
    setStream,
  } = useContext(UserContext);
  const audioRef = useRef<any>(null);
  const [time, setTime] = useState(1);

  async function accept() {
    setDataGlobal({
      ...dataGlobal,
      statusCall: 3,
    });

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
      emitAcceptVideo(user.username, dataGlobal.otherUserCall, signal);
    });

    peer.on("stream", (currentStream) => {
      otherVideo.current.srcObject = currentStream;
    });

    peer.signal(signal);
    connectionRef.current = peer;
  }

  function decline() {
    setDataGlobal({
      otherUserCall: null,
      statusCall: 0,
    });

    setSignal(null);
    declineVideo(dataGlobal.otherUserCall);
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
    <div className="call-popup">
      {dataGlobal.statusCall == 2 && (
        <div style={{ display: 'none' }}>
          <audio controls autoPlay ref={audioRef} onEnded={handleAudioEnded}>
            <source src="/messenger-call.mp3" type="audio/ogg" />
          </audio>
        </div>
      )}

      <div>
        <div className="title">{dataGlobal.otherUserCall}</div>
        <div>Đang gọi cho bạn</div>
        <div className="row-action">
          <div onClick={accept}>
            <BiSolidPhoneCall size={24} color="white" />
          </div>
          <div className="decline" onClick={decline}>
            <MdCallEnd size={24} color="white" />
          </div>
        </div>
      </div>
    </div>
  );
}
