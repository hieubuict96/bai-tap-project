import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { Routes, Route, useNavigate } from "react-router-dom";
import HomeScreen from "./pages/home";
import RouteWithoutAccount from "./components/route-without-account";
import SignupScreen from "./pages/signup";
import SigninScreen from "./pages/signin";
import { getData } from "./api/user-api";
import RouteHaveAccount from "./components/route-have-account";
import ChatScreen from "./pages/chat";
import { connectSocket } from "./socket";
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

function App() {
  const [user, setUser] = useState<UserModel>(new UserModel());
  const [openNotification, setOpenNotification] = useState<any>(false);
  const [numberMsg, setNumberMsg] = useState<any>(0);
  const [dataSocketMsg, setDataSocketMsg] = useState<SocketResponse>();
  const [signal, setSignal] = useState<any>(null);
  const [is2Person, setIs2Person] = useState<any>(null);
  const [dataOtherUser, setDataOtherUser] = useState<any>({
    id: null,
    username: null,
    imgUrl: null,
    fullName: null
  });
  const [statusCall, setStatusCall] = useState<number>(StatusCall.REST);
  const [stream, setStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const myVideo = useRef<any>();
  const otherVideo = useRef<any>();
  const connectionRef = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    getDataToken();
  }, [user.username]);

  // useEffect(() => {
  //   if (dataGlobal.statusCall === 0 && stream != null) {
  //     const tracks = stream.getTracks();

  //     tracks.forEach((track: any) => {
  //       track.stop();
  //     });

  //     setStream(null);
  //   }
  // }, [dataGlobal]);

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
        if (data.fn == SocketFn.MSG) {
          setDataSocketMsg(data);
        }

        if (data.fn == SocketFn.VIDEO_CALL as number && data.action == SocketAction.SEND as number) {
          setStatusCall(StatusCall.VIDEO_CALL_RECEIVE);
          setSignal(data.data.signal);
          setDataOtherUser(data.data.userFrom);
          setIs2Person(data.data.is2Person);
        }

        if (data.fn == SocketFn.VIDEO_CALL as number && data.action == SocketAction.ACCEPT_CALL as number) {
          setStatusCall(StatusCall.IN_VIDEO_CALL);
          setSignal(data.data.signal);
          setDataOtherUser(data.data.userFrom);
          setIs2Person(data.data.is2Person);
        }

        // if (type == ResponseSocketType.COMMENT) {
        //   showNotification(NotificationType.INFO, 'Thông báo bình luận', data.dataNoti.content, () => {
        //     markReadNotificationApi(data.dataNoti.id);
        //     navigate({
        //       pathname: "/post",
        //       search: createSearchParams({
        //         id: data.dataNoti.postId,
        //         refId: data.dataNoti.ref_id
        //       }).toString()
        //     });
        //   });
        // }
      });
    } catch (error: any) {
      if (error.response.data.status === 400) {
        localStorage.removeItem(TOKEN_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CommonContext.Provider value={{ openNotification, setOpenNotification }}>
      <MessageContext.Provider value={{ numberMsg, setNumberMsg, dataSocketMsg, setDataSocketMsg }}>
        <UserContext.Provider
          value={{ user, setUser }}
        >
          <VideoContext.Provider value={{ statusCall, setStatusCall, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream, dataOtherUser, setDataOtherUser, is2Person, setIs2Person }}>
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
