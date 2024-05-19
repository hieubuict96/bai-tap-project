import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user-context";
import './index.scss';
import { getNotificationsApi, markReadNotificationApi } from "../../api/notification-api";
import { Image } from "antd";
import { PiDotOutlineFill } from "react-icons/pi";
import { DOMAIN_IMG, IMG_NULL } from "../../common/const";

export default function Notification(props: any) {
  const { user, setUser } = useContext(UserContext);
  const navigate: any = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);

  async function getNotifications() {
    const response = await getNotificationsApi();
    setNotifications(response.data);
  }

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <div className="notification-popup" onClick={(e) => e.stopPropagation()}>
      <div className="title color1">THÔNG BÁO</div>
      <div className="list-notification">
        {notifications.length == 0 && (<div style={{ width: '440px', padding: '4px', display: 'flex', justifyContent: 'center' }}>
          <span style={{ color: 'black' }}>Không có thông báo nào</span>
        </div>)}
        {notifications.map((e, k) => (
          <div className="notification" key={k} style={{ backgroundColor: 'white' }} onClick={() => markReadNotificationApi(e.id)}>
            {e.notificationType == 0 && (
              <Link to={{ pathname: '/post', search: `?id=${e.linkId}&refId=${e.refId}` }}>
                <Image style={{ borderRadius: '5px' }} width={60} height={60} src={e.imgUrl ? DOMAIN_IMG + e.imgUrl : IMG_NULL} />
                <div className="noti-content">{e.content}</div>
                <div className="open-icon"><PiDotOutlineFill size={60} style={{ visibility: e.open == 0 ? 'visible' : 'hidden' }} color="rgb(8, 102, 255)" /></div>
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
