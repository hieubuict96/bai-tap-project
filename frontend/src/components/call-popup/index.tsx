import { useContext } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { MdCallEnd } from "react-icons/md";
import { VideoContext } from "../../context/video-context";
import { StatusCall } from "../../common/enum/status-call";
import { emitDeclineCall, offCall, offCallGroup } from "../../socket";

export default function CallPopup({ display }: any) {
  const { user } = useContext(UserContext);
  const { statusCall, setStatusCall, myVideo, otherVideo, otherVideosRef, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, is2Person, setIs2Person, peer, setPeer, dataGroup, setDataGroup, allActiveUsersId, setAllActiveUsersId, activeUsers, setActiveUsers } = useContext(VideoContext);

  function decline() {
    setStatusCall(StatusCall.REST);
    setIs2Person(null);

    if (is2Person) {
      setPeer(null);
      setSignal(null);
      setDataOtherUser(null);

      if (stream != null) {
        const tracks = stream.getTracks();
        tracks.forEach((track: any) => {
          track.stop();
        });
        setStream(null);
      }

      offCall(user.id, dataOtherUser.id, is2Person);
    } else {
      setDataGroup(null);
      setActiveUsers({});
      setAllActiveUsersId([]);
      if (otherVideosRef.current.children.length <= 1) {
        offCallGroup(user.id, allActiveUsersId.filter((e: any) => e != user.id), is2Person);
      }

      if (stream != null) {
        const tracks = stream.getTracks();
        tracks.forEach((track: any) => {
          track.stop();
        });
        setStream(null);
      }
    }
  }

  return (
    <div className="call-popup" style={{ display: display ? 'flex' : 'none' }}>
      <div className="popup">
        {is2Person ? (
          <div className="video">
            <div className="video-me size-video">
              <video playsInline muted ref={myVideo} autoPlay />
            </div>
            <div className="video-other size-video">
              <video playsInline ref={otherVideo} autoPlay />
            </div>
          </div>
        ) : (
          <div className="video video-group" ref={otherVideosRef}>
            <video playsInline muted ref={myVideo} autoPlay />
          </div>
        )}
        <div className="decline" onClick={decline}>
          <MdCallEnd size={24} color="white" />
        </div>
      </div>
    </div>
  );
}
