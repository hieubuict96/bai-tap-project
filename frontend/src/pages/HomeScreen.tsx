import styled from "styled-components";
import Header from "../components/header";
import Footer from "../components/footer";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/user-context";
import Peer from "simple-peer";
import { callVideo, videoAccepted } from "../socket/socket";

const HomeScreenWrapper = styled.div``;

const Body = styled.div`
  min-width: 1200px;
  margin-top: 8rem;
  background: rgb(240, 240, 240);
  display: flex;
  flex-direction: column;

  .container {
    width: 1200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin: 2rem auto 2rem auto;
    padding-left: 2rem;
    padding-right: 2rem;

    .search-user {
      height: 30px;
      display: flex;
      justify-content: center;

      input {
        padding-left: 10px;
      }

      button {
        background-color: rgb(255, 100, 47);
        color: white;
        font-weight: 700;
        margin-left: 12px;
        width: 80px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;

export default function HomeScreen() {
  const { user, setDataGlobal, myVideo, otherVideo, connectionRef, setStream } =
    useContext(UserContext);
  const [otherUser, setOtherUser] = useState("");
  const navigate = useNavigate();

  async function call() {
    setDataGlobal({
      otherUserCall: otherUser,
      statusCall: 1,
    });

    const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setStream(currentStream);
    //cái này để hiển thị video của bản thân
    myVideo.current.srcObject = currentStream;

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream,
    });

    peer.on("signal", (signal) => {
      callVideo(user.phone, otherUser, signal);
    });

    peer.on("stream", (stream) => {
      otherVideo.current.srcObject = stream;
    });

    videoAccepted(user.phone, otherUser, (signal: any) => {
      peer.signal(signal);
    });

    connectionRef.current = peer;
  }

  function message() {
    if (!/^ *$/.test(otherUser)) {
      navigate(`/message/chat?otherUser=${otherUser}`);
    }
  }

  return (
    <HomeScreenWrapper className="home">
      <Header />
      <Body className="home-body">
        <div className="container">
          <div className="search-user">
            <input
              type="text"
              placeholder="Nhập số cần gọi"
              onChange={(e) => setOtherUser(e.target.value)}
            />
            <button onClick={call}>Gọi</button>
            <button onClick={message}>Nhắn tin</button>
          </div>
        </div>
      </Body>
      <Footer />
    </HomeScreenWrapper>
  );
}
