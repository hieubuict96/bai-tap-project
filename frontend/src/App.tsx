import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { Routes, Route, useNavigate, createSearchParams } from "react-router-dom";
import HomeScreen from "./pages/home";
import RouteWithoutAccount from "./components/route-without-account";
import SignupScreen from "./pages/signup";
import SigninScreen from "./pages/signin";
import { getData } from "./api/user-api";
import RouteHaveAccount from "./components/route-have-account";
import ChatScreen from "./pages/chat";
import { connectSocket, emitBusyCall } from "./socket";
import { Spin } from "antd";
import ProfileScreen from "./pages/profile";
import { TOKEN_KEY } from "./common/const";
import { UserModel } from "./models/user-model";
import Search from "./pages/search";
import User from "./pages/user";
import NotFound from "./pages/not-found";
import Post from "./pages/post";
import { CommonContext } from "./context/common-context";
import { UserContext } from "./context/user-context";
import { SocketResponse } from "./models/socket-response";
import { MessageContext } from "./context/message-context";
import { VideoContext } from "./context/video-context";
import CommonComponent from "./CommonComponent";
import { SocketFn } from "./common/enum/socket-fn";
import { StatusCall } from "./common/enum/status-call";
import { SocketAction } from "./common/enum/socket-action";
import { DataOtherUser } from "./models/data-other-user";
import { showNotification } from "./common/common-function";
import { NotificationType } from "./common/enum/notification-type";
import { markReadNotificationApi } from "./api/notification-api";
import { DataCallGroup } from "./models/data-call-group";

function App() {
  const [user, setUser] = useState<UserModel>(new UserModel());
  const [openNotification, setOpenNotification] = useState<any>(false);
  const [numberMsg, setNumberMsg] = useState<any>(0);
  const [dataSocketMsg, setDataSocketMsg] = useState<SocketResponse>();
  const [dataSocket, setDataSocket] = useState<SocketResponse>();
  const [is2Person, setIs2Person] = useState<any>(null);
  const [dataOtherUser, setDataOtherUser] = useState<DataOtherUser | null>(null);
  const [dataOtherGroup, setDataOtherGroup] = useState<DataCallGroup | null>(null);
  const [statusCall, setStatusCall] = useState<number>(StatusCall.REST);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Những cái liên quan đến call
  const [peer, setPeer] = useState<any>();
  const [signal, setSignal] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);
  const myVideo = useRef<any>();
  const otherVideo = useRef<any>();
  const otherVideosRef = useRef<any>();
  const connectionRef = useRef<any>();

  const [peers, setPeers] = useState<any[]>([]);

  const getDataToken = async () => {
    try {
      const response = await getData();

      setUser({
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        fullName: response.data.user.fullName,
        imgUrl: response.data.user.imgUrl,
      });

      connectSocket(response.data.user.id, (data: SocketResponse) => {
        setDataSocket(data);
      });
    } catch (error: any) {
      if (error.response?.status === 400) {
        localStorage.removeItem(TOKEN_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDataToken();
  }, []);

  //handle data from socket
  useEffect(() => {
    if (dataSocket) {
      if (dataSocket.fn == SocketFn.VIDEO_CALL) {
        if (dataSocket.data.is2Person) {
          if (dataSocket.action == SocketAction.NOT_RESPOND) {
            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng không phản hồi');
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
            return;
          }

          if (dataSocket.action == SocketAction.NOT_ONLINE) {
            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng không online');
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
            return;
          }

          if (dataSocket.action == SocketAction.SEND) {
            if (statusCall != StatusCall.REST) {
              return emitBusyCall(user.id, dataSocket.data.userFrom.id, dataSocket.data.is2Person);
            }

            setStatusCall(StatusCall.VIDEO_CALL_RECEIVE);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            return;
          }

          if (dataSocket.action == SocketAction.ACCEPT_CALL) {
            setStatusCall(StatusCall.IN_VIDEO_CALL);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            peer.signal(dataSocket.data.signal);
            return;
          }

          if (dataSocket.action == SocketAction.DECLINE_CALL) {
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

            return;
          }

          if (dataSocket.action == SocketAction.BUSY_CALL) {
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

            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng đang trong cuộc gọi khác');
            return;
          }

          if (dataSocket.action == SocketAction.OFF_CALL) {
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
            return;
          }
        } else {

        }
      }

      if (dataSocket.fn == SocketFn.CALL) {
        if (dataSocket.data.is2Person) {
          if (dataSocket.action == SocketAction.NOT_RESPOND) {
            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng không phản hồi');
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
            return;
          }

          if (dataSocket.action == SocketAction.NOT_ONLINE) {
            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng không online');
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
            return;
          }

          if (dataSocket.action == SocketAction.SEND) {
            if (statusCall != StatusCall.REST) {
              return emitBusyCall(user.id, dataSocket.data.userFrom.id, dataSocket.data.is2Person);
            }

            setStatusCall(StatusCall.CALL_RECEIVE);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            return;
          }

          if (dataSocket.action == SocketAction.ACCEPT_CALL) {
            setStatusCall(StatusCall.IN_CALL);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            peer.signal(dataSocket.data.signal);
            return;
          }

          if (dataSocket.action == SocketAction.DECLINE_CALL) {
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

            return;
          }

          if (dataSocket.action == SocketAction.BUSY_CALL) {
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

            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng đang trong cuộc gọi khác');
            return;
          }

          if (dataSocket.action == SocketAction.OFF_CALL) {
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
            return;
          }
        } else {
          if (dataSocket.action == SocketAction.NOT_ONLINE) {
            showNotification(NotificationType.INFO, 'Thông báo', 'Các người dùng không online');
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
            return;
          }

          if (dataSocket.action == SocketAction.SEND) {
            if (statusCall != StatusCall.REST) {
              return emitBusyCall(user.id, dataSocket.data.userFrom.id, dataSocket.data.is2Person);
            }

            setStatusCall(StatusCall.CALL_RECEIVE);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            return;
          }

          if (dataSocket.action == SocketAction.ACCEPT_CALL) {
            setStatusCall(StatusCall.IN_CALL);
            setSignal(dataSocket.data.signal);
            setDataOtherUser(dataSocket.data.userFrom);
            setIs2Person(dataSocket.data.is2Person);
            peer.signal(dataSocket.data.signal);
            return;
          }

          if (dataSocket.action == SocketAction.DECLINE_CALL) {
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

            return;
          }

          if (dataSocket.action == SocketAction.BUSY_CALL) {
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

            showNotification(NotificationType.INFO, 'Thông báo', 'Người dùng đang trong cuộc gọi khác');
            return;
          }

          if (dataSocket.action == SocketAction.OFF_CALL) {
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
            return;
          }
        }
      }

      if (dataSocket.fn == SocketFn.MSG) {
        setDataSocketMsg(dataSocket);
        return;
      }

      if (dataSocket.fn == SocketFn.NOTIFICATION) {
        showNotification(NotificationType.INFO, 'Thông báo bình luận', dataSocket.data.dataNoti.content, () => {
          markReadNotificationApi(dataSocket.data.dataNoti.id);
          navigate({
            pathname: "/post",
            search: createSearchParams({
              id: dataSocket.data.dataNoti.postId,
              refId: dataSocket.data.dataNoti.ref_id
            }).toString()
          });
        });
      }
    }
  }, [dataSocket]);

  return (
    <CommonContext.Provider value={{ openNotification, setOpenNotification }}>
      <MessageContext.Provider value={{ numberMsg, setNumberMsg, dataSocketMsg, setDataSocketMsg }}>
        <UserContext.Provider value={{ user, setUser }}>
          <VideoContext.Provider value={{ statusCall, setStatusCall, myVideo, otherVideo, otherVideosRef, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, dataOtherGroup, setDataOtherGroup, is2Person, setIs2Person, peer, setPeer, peers, setPeers }}>
            <div className="main">
              {loading ? (
                <div>
                  <Spin />
                </div>
              ) : (
                <>
                  <CommonComponent />
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <RouteHaveAccount>
                          <HomeScreen />
                        </RouteHaveAccount>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <RouteWithoutAccount>
                          <SignupScreen />
                        </RouteWithoutAccount>
                      }
                    />
                    <Route
                      path="/signin"
                      element={
                        <RouteWithoutAccount>
                          <SigninScreen />
                        </RouteWithoutAccount>
                      }
                    />
                    <Route
                      path="/message"
                      element={
                        <RouteHaveAccount>
                          <ChatScreen />
                        </RouteHaveAccount>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <RouteHaveAccount>
                          <ProfileScreen />
                        </RouteHaveAccount>
                      }
                    />
                    <Route
                      path="/search"
                      element={
                        <RouteHaveAccount>
                          <Search />
                        </RouteHaveAccount>
                      }
                    />
                    <Route
                      path="/user"
                      element={
                        <RouteHaveAccount>
                          <User />
                        </RouteHaveAccount>
                      }
                    />
                    <Route
                      path="/post"
                      element={
                        <Post />
                      }
                    />
                    <Route
                      path="*"
                      element={
                        <NotFound />
                      }
                    />
                  </Routes>
                </>
              )}
            </div>
          </VideoContext.Provider>
        </UserContext.Provider>
      </MessageContext.Provider>
    </CommonContext.Provider>
  );
}

export default App;
