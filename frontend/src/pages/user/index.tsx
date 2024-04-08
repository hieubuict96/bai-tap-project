import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { CommonContext } from "../../context/common-context";
import { Link, useLocation } from "react-router-dom";
import { getUserProfile } from "../../api/user-api";
import { Button, Card, Image } from "antd";
import { DOMAIN_IMG } from "../../common/const";
import { RiMessengerLine } from "react-icons/ri";
import Meta from "antd/es/card/Meta";
import { formatDateUtil } from "../../common/common-function";
import { FaFacebookMessenger } from "react-icons/fa";

export default function User() {
  const { user, setUser } = useContext(UserContext);
  const { notificationApi } = useContext(CommonContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [id, setId] = useState(queryParams.get('id'));
  const [userProfile, setUserProfile] = useState<any>();

  async function getUser1() {
    const response = await getUserProfile(id);
    setUserProfile(response.data);
  }

  useEffect(() => {
    getUser1();
  }, []);

  return (
    <div className="user">
      <Header />
      <div className="content">
        <div className="user-info">
          <div className="img">
            <Image style={{ marginLeft: '10px', borderRadius: '5px' }} width={100} src={DOMAIN_IMG + userProfile?.user.img_url} />
          </div>

          <div className="info">
            <div className="name color2">{userProfile?.user.full_name}</div>
            <div className="username color2">{userProfile?.user.username}</div>
            <div className="email color2">{userProfile?.user.email}</div>
          </div>
          <div className="action">
            <Link to={{ pathname: '/message', search: `?otherUser=${userProfile?.user.id}` }} className="message">
              <FaFacebookMessenger size={30} color="white" />
              <span>Message</span>
            </Link>
          </div>
        </div>
        <div className="list-post">
          {userProfile?.posts.map((e: any) => (
            <Link key={e.id} className="post color2" to={{ pathname: '/post', search: `?id=${e.id}` }}>
              <div className="title">{userProfile?.user.full_name}</div>
              <div className="time">{formatDateUtil(e.created_time)}</div>
              <div className="content">{e.content}</div>
              <div className="imgs">
                {e.imgs.map((e: any) => (
                  <Link to={DOMAIN_IMG + e.img_url}>
                    <img src={DOMAIN_IMG + e.img_url} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
                  </Link>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
