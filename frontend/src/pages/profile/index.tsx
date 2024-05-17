import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { Button, Image, Input, Modal } from "antd";
import { DOMAIN_IMG, IMG_NULL } from "../../common/const";
import { NotificationType } from "../../common/enum/notification-type";
import { getUserProfile, update } from "../../api/user-api";
import { FiAlertCircle } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { formatDateUtil, showNotification } from "../../common/common-function";

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const [newName, setNewName] = useState(user.fullName);
  const [errFullName, setErrFullName] = useState("");
  const [imgUrl, setImgUrl] = useState<any>();
  const [imgPath, setImgPath] = useState<any>();
  const [newEmail, setNewEmail] = useState(user.email);
  const [errEmail, setErrEmail] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [userProfile, setUserProfile] = useState<any>();

  async function handleOk() {
    let existsError = false;

    if (!newName.trim()) {
      setErrFullName("empty");
      existsError = true;
    } else {
      setErrFullName("");
    }

    if (!newEmail.trim()) {
      setErrEmail("empty");
      existsError = true;
    } else {
      setErrEmail("");
    }

    if (existsError) {
      return;
    }

    try {
      const response = await update(user.id, newName.trim(), newEmail.trim(), imgUrl);
      showNotification(NotificationType.SUCCESS, 'Cập nhật thành công', 'Bạn đã cập nhật thành công', () => {});

      setUser({
        id: response.data.user.id,
        username: response.data.user.username,
        email: response.data.user.email,
        fullName: response.data.user.fullName,
        imgUrl: response.data.user.imgUrl,
      });

      setNewName(response.data.user.fullName);
      setNewEmail(response.data.user.email);
      setImgPath(response.data.user.imgUrl);

      setTimeout(() => {
        setIsUpdate(false);
      }, 1000);
    } catch (error: any) {
      if (error.response?.data.codeEmail === "emailExists") {
        setErrEmail("exists");
      }
    }
  }

  function handleCancel() {
    setIsUpdate(false);
  }

  async function getUser1() {
    const response = await getUserProfile(user.id);
    setUserProfile(response.data);
  }

  useEffect(() => {
    getUser1();
  }, []);

  return (
    <div className="profile">
      <Header />
      <div className="content">
        <div className="container">
          <div className="img-name flex">
            <div className="img">
              <Image height={100} width={100} style={{ borderRadius: '20px' }} src={user.imgUrl ? DOMAIN_IMG + user.imgUrl : IMG_NULL} />
            </div>
            <div className="full-name">
              <span>{user.fullName}</span>
            </div>
          </div>

          <div className="email-username">
            <div className="email flex">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <div className="username flex">
              <span>Số điện thoại</span>
              <span>{user.username}</span>
            </div>
          </div>

          <div className="change">
            <Button type="primary" onClick={() => setIsUpdate(true)}>Chỉnh sửa</Button>
          </div>

          <div className="list-post">
            {userProfile?.posts.map((e: any) => (
              <Link key={e.id} className="post color2" to={{ pathname: '/post', search: `?id=${e.id}` }}>
                <div className="title">{userProfile?.user.full_name}</div>
                <div className="time">{formatDateUtil(e.created_time)}</div>
                <div className="content color2" style={{ justifyContent: 'start', fontWeight: '450' }}>{e.content}</div>
                <div className="imgs" style={{ marginTop: '12px' }}>
                  {e.imgs.map((e: any) => (
                    <Link to={DOMAIN_IMG + e.img_url}>
                      <img src={e.img_url ? DOMAIN_IMG + e.img_url : IMG_NULL} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
                    </Link>
                  ))}
                </div>
                <div className="comment" style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="link">Bình luận</Button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />

      {isUpdate && (
        <Modal title="CẬP NHẬT THÔNG TIN" className="modal-profile" centered open={true} onOk={handleOk} onCancel={handleCancel}>
          <div className="img-name">
            <div className="img" style={{ display: 'flex', alignItems: 'center' }}>
              <Image height={100} width={100} style={{ borderRadius: '20px' }} src={imgPath ? imgPath : (user.imgUrl ? DOMAIN_IMG + user.imgUrl : IMG_NULL)} />
              <Input type="file" id='new-avatar' style={{ display: 'none' }} onChange={(e) => {
                if (e.target.files) {
                  setImgUrl(e.target?.files[0]);
                  let reader = new FileReader();
                  reader.readAsDataURL(e.target?.files[0]);

                  reader.onloadend = function () {
                    setImgPath(reader.result);
                  }
                }
              }} />
              <label htmlFor="new-avatar" style={{
                color: '#fff',
                'backgroundColor': '#1677ff',
                'boxShadow': '0 2px 0 rgba(5, 145, 255, 0.1)',
                height: '32px',
                lineHeight: '24px',
                marginLeft: '58px',
                borderRadius: '6px',
                borderWidth: '1px',
                padding: '4px 15px'
              }}>Thay đổi ảnh</label>
            </div>
            <div className="full-name" style={{ display: 'flex', padding: '8px' }}>
              <span style={{ width: '30%', lineHeight: '32px' }}>Họ tên</span>
              <span style={{ paddingLeft: '12px', flexGrow: 1 }}>
                <Input value={newName} onChange={(e) => {
                  setErrFullName("");
                  setNewName(e.target.value);
                }} />
              </span>

              <div className="error-notify">
                {errFullName === "empty" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Họ và tên không được để trống</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="email-username">
            <div className="email flex" style={{ display: 'flex', padding: '8px' }}>
              <span style={{ width: '30%', lineHeight: '32px' }}>Email</span>
              <span style={{ paddingLeft: '12px', flexGrow: 1 }}>
                <Input value={newEmail} onChange={(e) => {
                  setErrEmail("");
                  setNewEmail(e.target.value);
                }} />
              </span>

              <div className="error-notify">
                {errEmail === "empty" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Email không được để trống</span>
                  </>
                )}
                {errEmail === "exists" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>
                      Email đã được sử dụng, vui lòng đăng ký email khác!!!
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="username flex" style={{ display: 'flex', padding: '8px' }}>
              <span style={{ width: '30%', lineHeight: '32px' }}>Số điện thoại</span>
              <span style={{ paddingLeft: '12px', flexGrow: 1 }}>{user.username}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
