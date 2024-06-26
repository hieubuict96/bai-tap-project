import { useContext } from "react";
import { VideoContext } from "./context/video-context";
import CallPopup from "./components/call-popup";
import ReceiveCallPopup from "./components/receive-call-popup";
import { StatusCall } from "./common/enum/status-call";

export default function CommonComponent() {
  const { statusCall, setStatusCall, myVideo, otherVideo, otherVideosRef, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, is2Person, setIs2Person, peer, setPeer, dataGroup, setDataGroup, allActiveUsersId, setAllActiveUsersId, activeUsers, setActiveUsers } = useContext(VideoContext);

  return (
    <div className="common">
      <CallPopup display={statusCall == StatusCall.CALL || statusCall == StatusCall.VIDEO_CALL || statusCall == StatusCall.IN_CALL|| statusCall == StatusCall.IN_VIDEO_CALL} />
      <ReceiveCallPopup display={statusCall == StatusCall.CALL_RECEIVE || statusCall == StatusCall.VIDEO_CALL_RECEIVE} />
    </div>
  )
}
