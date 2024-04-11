import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user-context";
import './index.scss';
import { getNotificationsApi } from "../../api/notification-api";

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
    <div className="notification-popup">
      <div className="title color1">THÔNG BÁO</div>
      <div className="list-notification">
        {notifications.map(e => (
          <div className="notification" style={{ backgroundColor: e.open == 1 ? 'white' : 'green' }}>
            {e.notificationType == 0 && (
              <Link to={{ pathname: '/post', search: `?id=${e.linkId}` }}>
                sang bai viet
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
