import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { CommonContext } from "../../context/common-context";
import { UserContext } from "../../context/user-context";
import { useLocation } from "react-router-dom";
import { searchUser } from "../../api/user-api";

export default function SearchUser() {
  const { user, setUser } = useContext(UserContext);
  const { notificationApi } = useContext(CommonContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  useEffect(() => {
    search1();
  }, []);

  async function search1() {
    const response = await searchUser(queryParams.get("keyword"));
  }

  return (
    <div className="search-user">
      <Header />
      <div className="content">

      </div>
      <Footer />
    </div>
  );
}
