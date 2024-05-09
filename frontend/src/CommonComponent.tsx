import { useContext } from "react";
import { VideoContext } from "./context/video-context";
import VideoCallPopup from "./components/video-call-popup";
import ReceiveVideoPopup from "./components/receive-video-popup";

export default function CommonComponent() {
  const { openVideo, setOpenVideo, receiveVideo, setReceiveVideo } = useContext(VideoContext);

  return (
    <div className="common">
      {openVideo && (<VideoCallPopup />)}
      {receiveVideo && (<ReceiveVideoPopup />)}
    </div>
  )
}
