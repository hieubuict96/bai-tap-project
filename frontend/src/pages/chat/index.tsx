import styled from "styled-components";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import { getChat, sendMessage } from "../../api/user-api";
import { useLocation } from "react-router-dom";
import "./index.scss";
import { subscribeMsg } from "../../socket/socket";
import { UserContext } from "../../context/user-context";
import { openNotification } from "../../common/notification";
import { CommonContext } from "../../context/common-context";
import { NotificationType } from "../../common/enum/notification-type";

const HomeScreenWrapper = styled.div``;

const Body = styled.div``;

export default function ChatScreen() {
  const { search } = useLocation();
  const { notificationApi } = useContext(CommonContext);
  const queryParams = new URLSearchParams(search);
  const otherUser = queryParams.get("otherUser");
  const { user } = useContext(UserContext);
  const [lastMsg, setLastMsg] = useState<any>({});
  const [msgList, setMsgList] = useState<any[]>([]);
  const [textSend, setTextSend] = useState("");

  async function getChatMsg() {
    try {
      const response = await getChat(otherUser);
      setMsgList(response.data.msgList);
      subscribeMsg(
        user.username,
        otherUser,
        (data: any) => {
          setLastMsg({...data});
        }
      );
    } catch (error: any) {
      if (error.response.data.code === "otherUserNotFound") {
        openNotification(
          notificationApi,
          NotificationType.ERROR,
          "Không tìm thấy người nhận",
          "Không tìm thấy người nhận"
        );
      }
    }
  }

  function sendMsg() {
    const text = textSend.trim();

    if (!text) {
      return;
    }

    sendMessage(otherUser, text);
    const msgList1 = [...msgList];
    msgList1.push({ msg: text, isSend: true });
    setMsgList(msgList1);
    setTextSend("");
  }

  useEffect(() => {
    getChatMsg();
  }, []);

  useEffect(() => {
    const list = [...msgList];
    list.push(lastMsg);
    setMsgList(list);
  }, [lastMsg]);

  useEffect(() => {
    const element = document.querySelector(".messenger.msg-content");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }, [msgList]);

  return (
    <HomeScreenWrapper className="chat">
      <Header />
      <Body className="chat-body">
        <div className="container">
          <div className="card">
            <div className="name-other">
              <span>{otherUser}</span>
            </div>
            <div className="messenger msg-content">
              {msgList.map((e: any, k: number) => (
                <div key={k} className="msg">
                  {e.isSend ? (
                    <div className="msg-me">
                      <span>{e.msg}</span>
                    </div>
                  ) : (
                    <div className="msg-other">
                      <span>{e.msg}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="action-send">
              <input
                placeholder="Nhập tin nhắn"
                onChange={(e) => setTextSend(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                value={textSend}
              />
              <button onClick={sendMsg}>Gửi</button>
            </div>
          </div>
        </div>
      </Body>
      <Footer />
    </HomeScreenWrapper>
  );
}
