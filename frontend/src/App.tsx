import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { UserContext } from "./context/user-context";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import HomeScreen from "./pages/home";
import RouteWithoutAccount from "./components/route-without-account";
import SignupScreen from "./pages/signup";
import SigninScreen from "./pages/signin";
import { getData } from "./api/user-api";
import RouteHaveAccount from "./components/route-have-account";
import ChatScreen from "./pages/chat";
import { connectSocket } from "./socket/socket";
import CallPopup from "./components/receive-video-popup";
import VideoCallPopup from "./components/video-call-popup";
import { Spin, notification } from "antd";
import { CommonContext } from "./context/common-context";
import ProfileScreen from "./pages/profile";
import { TOKEN_KEY } from "./common/const";
import { UserModel } from "./models/user-model";
import { StatusVideo } from "./common/enum/status-video";
import SearchUser from "./pages/search-user";

function App() {
  const [user, setUser] = useState<any>(new UserModel());
  const [dataGlobal, setDataGlobal] = useState<any>({
    otherUserCall: null,
    //0: chưa có ai gọi, 1: Đang gọi cho người khác chờ người khác nghe máy, 2: có người gọi chờ nghe máy, 3: Đang nghe máy
    statusCall: 0,
  });
  const [notificationApi, contextHolder] = notification.useNotification();
  const [signal, setSignal] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const myVideo = useRef<any>();
  const otherVideo = useRef<any>();
  const connectionRef = useRef<any>();

  useEffect(() => {
    connectSocket(user.username, (otherUser: any, code: string, signal1: any) => {
      if (code === StatusVideo.CONNECT_VIDEO) {
        setDataGlobal({
          otherUserCall: otherUser,
          statusCall: 2,
        });

        setSignal(signal1);
      }

      if (code === StatusVideo.DECLINE_VIDEO) {
        setDataGlobal({
          otherUserCall: null,
          statusCall: 0,
        });

        setSignal(null);
      }
    });

    getDataToken();
  }, [user.username]);

  useEffect(() => {
    if (dataGlobal.statusCall === 0 && stream != null) {
      const tracks = stream.getTracks();

      tracks.forEach((track: any) => {
        track.stop();
      });

      setStream(null);
    }
  }, [dataGlobal]);

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
    } catch (error: any) {
      if (error.response.data.status === 400) {
        localStorage.removeItem(TOKEN_KEY);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      {contextHolder}
      {loading ? (
        <div>
          <Spin />
        </div>
      ) : (
        <CommonContext.Provider value={{ notificationApi }}>
          <UserContext.Provider
            value={{ user, setUser, dataGlobal, setDataGlobal, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream }}
          >
            <div className="App">
              <div>
                {dataGlobal.statusCall === 2 && <CallPopup />}
                {(dataGlobal.statusCall === 3 || dataGlobal.statusCall === 1) && <VideoCallPopup />}
              </div>

              <Router>
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
                    path="/search-user"
                    element={
                      <RouteHaveAccount>
                        <SearchUser />
                      </RouteHaveAccount>
                    }
                  />
                </Routes>
              </Router>
            </div>
          </UserContext.Provider>
        </CommonContext.Provider>
      )}
    </div>
  );
}

export default App;
