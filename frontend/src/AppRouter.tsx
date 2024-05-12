import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import VideoCallGroup from "./pages/VideoCallGroup";

function AppRouter() {

  return (
    <Router>
      <App />
      {/* <VideoCallGroup /> */}
    </Router>
  );
}

export default AppRouter;
