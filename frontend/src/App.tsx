import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { UserContext } from "./context/user-context";
import { Routes, BrowserRouter as Router, Route } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen";
import RouteWithoutAcc from "./components/RouteWithoutAcc";
import SignupScreen from "./pages/SignupScreen";
import SigninScreen from "./pages/SigninScreen";
import { getData } from "./api/user-api";
import RouteHaveAcc from "./components/RouteHaveAcc";
import MessageScreen from "./pages/message-screen";
import { connectSocket } from "./socket/socket";
import CallPopup from "./components/receive-video-popup";
import VideoCallPopup from "./components/video-call-popup";
import { notification } from "antd";
import { CommonContext } from "./context/common-context";
import ProfileScreen from "./pages/profile";
import { TOKEN_KEY } from "./common/const";
import { UserModel } from "./models/user-model";
import { StatusVideo } from "./common/enum/status-video";

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
    connectSocket(user.phone, (otherUser: any, code: string, signal1: any) => {
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
  }, [user.phone]);

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
        phone: response.data.user.phone,
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
        <div></div>
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
                      <RouteHaveAcc>
                        <HomeScreen />
                      </RouteHaveAcc>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <RouteWithoutAcc>
                        <SignupScreen />
                      </RouteWithoutAcc>
                    }
                  />
                  <Route
                    path="/signin"
                    element={
                      <RouteWithoutAcc>
                        <SigninScreen />
                      </RouteWithoutAcc>
                    }
                  />
                  <Route
                    path="/message"
                    element={
                      <RouteHaveAcc>
                        <MessageScreen />
                      </RouteHaveAcc>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <RouteHaveAcc>
                        <ProfileScreen />
                      </RouteHaveAcc>
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
