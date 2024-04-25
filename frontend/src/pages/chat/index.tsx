import styled from "styled-components";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import { getChat, getListChatAPI, sendMessage } from "../../api/chat-api";
import { Link, useLocation } from "react-router-dom";
import "./index.scss";
import { subscribeMsg } from "../../socket";
import { UserContext } from "../../context/user-context";
import { NotificationType } from "../../common/enum/notification-type";
import { enterExe, showNotification } from "../../common/common-function";
import { Image, Input, Modal } from "antd";
import { DOMAIN_IMG } from "../../common/const";
import { IoSearchOutline } from "react-icons/io5";

const HomeScreenWrapper = styled.div``;

const Body = styled.div``;

export default function ChatScreen() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const otherUser = queryParams.get("otherUser");
  const [dataOtherUser, setDataOtherUser] = useState<any>({});
  const is2Person = queryParams.get("is2Person") == 'true';
  const { user } = useContext(UserContext);
  const [lastMsg, setLastMsg] = useState<any>({});
  const [msgList, setMsgList] = useState<any[]>([]);
  const [chatList, setChatList] = useState<any[]>([]);
  const [textSend, setTextSend] = useState("");
  const [keyword, setKeyword] = useState<any>();
  const [openModal, setOpenModal] = useState<any>(false);

  async function getChatMsg() {
    try {
      const response = await getChat(otherUser, is2Person);
      setMsgList(response.data.msgList);
      setDataOtherUser(response.data.otherUser);
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

  function search() {

  }

  function createChat() {

  }

  useEffect(() => {
    getListChat();
  }, []);

  useEffect(() => {
    getChatMsg();
  }, [location]);

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
            <div className="actions">
              <div className="search-div">
                <span className="search-icon">
                  <IoSearchOutline color="rgb(101, 103, 107)" />
                </span>
                <Input type="text" value={keyword}
                  placeholder="Search Messenger"
                  onChange={(e) => { setKeyword(e.target.value) }}
                  onKeyDown={(e) => {
                    enterExe(e, search);
                  }} />
              </div>

              <div className="create-group-chat">
                <svg onClick={() => setOpenModal(true)} viewBox="0 0 12 13" width="20" height="20" fill="currentColor" style={{ color: 'rgb(5, 5, 5)' }}>
                  <g fill-rule="evenodd" transform="translate(-450 -1073)">
                    <g>
                      <path d="M105.506 926.862a.644.644 0 0 1-.644.644h-6.724a.644.644 0 0 1-.644-.644v-6.724c0-.356.288-.644.644-.644h2.85c.065 0 .13-.027.176-.074l.994-.993a.25.25 0 0 0-.177-.427h-3.843A2.138 2.138 0 0 0 96 920.138v6.724c0 1.18.957 2.138 2.138 2.138h6.724a2.138 2.138 0 0 0 2.138-2.138v-3.843a.25.25 0 0 0-.427-.177l-1.067 1.067v2.953zm1.024-9.142a.748.748 0 0 0-1.06 0l-.589.588a.25.25 0 0 0 0 .354l1.457 1.457a.25.25 0 0 0 .354 0l.588-.589a.75.75 0 0 0 0-1.06l-.75-.75z" transform="translate(354.5 156)"></path>
                      <path d="M99.22 923.97a.75.75 0 0 0-.22.53v.75c0 .414.336.75.75.75h.75a.75.75 0 0 0 .53-.22l4.248-4.247a.25.25 0 0 0 0-.354l-1.457-1.457a.25.25 0 0 0-.354 0l-4.247 4.248z" transform="translate(354.5 156)"></path>
                    </g>
                  </g>
                </svg>
              </div>
            </div>

            <div className="list-chat">
              {chatList.map((e, k) => (
                <Link to={{ pathname: '', search: `?otherUser=${e.id}&is2Person=${e.is2Person == 1}` }} key={k} className={`e ${e.otherUser == otherUser ? 'focus1' : undefined}`}>
                  <div className="img-url">
                    <Image style={{ borderRadius: '5px' }} width={60} height={60} src={DOMAIN_IMG + e.imgUrl} />
                  </div>
                  <div className="chat-content">
                    <div className="name text-primary">
                      {e.is2Person == 1 ? e.fullName : e.name}
                    </div>
                    <div className="msg text-second">
                      {e.msg}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="name-other">
              <Link to={{ pathname: '/user', search: `?id=${dataOtherUser?.id}` }}>
                <img src={DOMAIN_IMG + dataOtherUser?.imgUrl} />
              </Link>
              <span className="text-primary">{dataOtherUser?.fullName}</span>
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



      <Modal title="TẠO NHÓM CHAT" className="create-chat" centered open={openModal} onOk={createChat} onCancel={() => setOpenModal(false)}>

      </Modal>
      <Footer />
    </HomeScreenWrapper>
  );
}
