import styled from "styled-components";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import { getChat, getListChatAPI, sendMessage } from "../../api/chat-api";
import { useLocation } from "react-router-dom";
import "./index.scss";
import { subscribeMsg } from "../../socket";
import { UserContext } from "../../context/user-context";
import { NotificationType } from "../../common/enum/notification-type";
import { enterExe, showNotification } from "../../common/common-function";
import { Image } from "antd";
import { DOMAIN_IMG } from "../../common/const";

const HomeScreenWrapper = styled.div``;

const Body = styled.div``;

export default function ChatScreen() {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const otherUser = queryParams.get("otherUser");
  const is2Person = queryParams.get("is2Person") == 'true';
  const { user } = useContext(UserContext);
  const [lastMsg, setLastMsg] = useState<any>({});
  const [msgList, setMsgList] = useState<any[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);
  const [textSend, setTextSend] = useState("");

  async function getChatMsg() {
    try {
      const response = await getChat(otherUser, is2Person);
      setMsgList(response.data.msgList);
      subscribeMsg(
        user.username,
        otherUser,
        (data: any) => {
          setLastMsg({ ...data });
        }
      );
    } catch (error: any) {
      if (error.response.data.code === "otherUserNotFound") {
        showNotification(NotificationType.ERROR, 'Không tìm thấy người nhận', 'Không tìm thấy người nhận', () => { });
      }
    }
  }

  async function getListChat() {
    try {
      const response = await getListChatAPI();
      setChatList(response.data.msgList);
    } catch (error: any) {
      if (error.response.data.code === "otherUserNotFound") {
        showNotification(NotificationType.ERROR, 'Không tìm thấy người nhận', 'Không tìm thấy người nhận', () => { });
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
    getListChat();
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
          <div className="sidebar-chat">
            {chatList.map((e, k) => (
              <div key={k} className="e">
                <div className="img-url">
                  <Image style={{ borderRadius: '5px' }} width={60} height={60} src={DOMAIN_IMG + e.imgUrl} />
                </div>
                <div className="chat-content">
                  <div className="name">
                    {e.is2Person == 1 ? e.fullName : e.name}
                  </div>
                  <div className="msg">
                    {e.msg}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                onKeyDown={(e) => enterExe(e, sendMsg)}
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
