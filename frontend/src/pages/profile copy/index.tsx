import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { CommonContext } from "../../context/common-context";
import { UserContext } from "../../context/user-context";

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const { notificationApi } = useContext(CommonContext);

  useEffect(() => {

  }, []);

  return (
    <div className="profile">
      <Header />
      <div className="content">

      </div>
      <Footer />
    </div>
  );
}
