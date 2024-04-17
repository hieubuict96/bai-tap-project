import { useEffect, useRef, useState } from "react";
import "./App.scss";
import { Routes, BrowserRouter as Router, Route, useNavigate, createSearchParams } from "react-router-dom";
import HomeScreen from "./pages/home";
import RouteWithoutAccount from "./components/route-without-account";
import SignupScreen from "./pages/signup";
import SigninScreen from "./pages/signin";
import { getData } from "./api/user-api";
import RouteHaveAccount from "./components/route-have-account";
import ChatScreen from "./pages/chat";
import { connectSocket } from "./socket/socket";
import { Spin, notification } from "antd";
import ProfileScreen from "./pages/profile";
import { TOKEN_KEY } from "./common/const";
import { UserModel } from "./models/user-model";
import { StatusVideo } from "./common/enum/status-video";
import Search from "./pages/search";
import User from "./pages/user";
import NotFound from "./pages/not-found";
import Post from "./pages/post";
import { ResponseSocketType } from "./common/enum/response-socket-type";
import { NotificationType } from "./common/enum/notification-type";
import { CommonContext } from "./context/common-context";
import { UserContext } from "./context/user-context";
import { showNotification } from "./common/common-function";

function App() {
  const [user, setUser] = useState<any>(new UserModel());
  const [dataGlobal, setDataGlobal] = useState<any>({
    otherUserCall: null,
    //0: chưa có ai gọi, 1: Đang gọi cho người khác chờ người khác nghe máy, 2: có người gọi chờ nghe máy, 3: Đang nghe máy
    statusCall: 0,
  });
  const [openNotification, setOpenNotification] = useState<any>(false);
  const [signal, setSignal] = useState<any>(null);
  const [stream, setStream] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const myVideo = useRef<any>();
  const otherVideo = useRef<any>();
  const connectionRef = useRef<any>();
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket(user.username, (otherUser: any, code: string, signal1: any, type: any, data: any) => {
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

      if (type == ResponseSocketType.COMMENT) {
        showNotification(NotificationType.INFO, 'Thông báo bình luận', data.dataNoti.content, () => {
          navigate({
            pathname: "/post",
            search: createSearchParams({
              id: data.dataNoti.postId,
              refId: data.dataNoti.ref_id
            }).toString()
          });
        });
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
    <CommonContext.Provider value={{ openNotification, setOpenNotification }}>
      <UserContext.Provider
        value={{ user, setUser, dataGlobal, setDataGlobal, myVideo, otherVideo, connectionRef, signal, setSignal, stream, setStream }}
      >
        <div className="main">
          {loading ? (
            <div>
              <Spin />
            </div>
          ) : (
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
          )}
        </div>
      </UserContext.Provider>
    </CommonContext.Provider>
  );
}

export default App;
