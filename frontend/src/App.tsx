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
import { SocketFn } from "./common/enum/status-video";
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

function App() {
  const [user, setUser] = useState<UserModel>(new UserModel());
  const [openNotification, setOpenNotification] = useState<any>(false);
  const [numberMsg, setNumberMsg] = useState<any>(0);
  const [dataSocketMsg, setDataSocketMsg] = useState<SocketResponse>();
  const [signal, setSignal] = useState<any>(null);
  const [openVideo, setOpenVideo] = useState<any>(false);
  const [receiveVideo, setReceiveVideo] = useState<any>(false);
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

        // if (code === StatusVideo.CONNECT_VIDEO) {
        //   setDataGlobal({
        //     otherUserCall: otherUser,
        //     statusCall: 2,
        //   });

        //   setSignal(signal1);
        // }

        // if (code === StatusVideo.DECLINE_VIDEO) {
        //   setDataGlobal({
        //     otherUserCall: null,
        //     statusCall: 0,
        //   });

        //   setSignal(null);
        // }

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
          value={{ user, setUser, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream }}
        >
          <VideoContext.Provider value={{ openVideo, setOpenVideo, receiveVideo, setReceiveVideo }}>
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
