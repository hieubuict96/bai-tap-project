import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { CommonContext } from "../../context/common-context";
import { UserContext } from "../../context/user-context";
import { Button, Image, Input, Modal } from "antd";
import { DOMAIN_IMG } from "../../common/const";
import { openNotification } from "../../common/notification";
import { NotificationType } from "../../common/enum/notification-type";
import { update } from "../../api/user-api";
import { FiAlertCircle } from "react-icons/fi";

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const [newName, setNewName] = useState(user.fullName);
  const [errFullName, setErrFullName] = useState("");
  const [imgUrl, setImgUrl] = useState<any>();
  const [imgPath, setImgPath] = useState<any>();
  const [newEmail, setNewEmail] = useState(user.email);
  const [errEmail, setErrEmail] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const { notificationApi } = useContext(CommonContext);

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
      const response = await update(user.id, newName, newEmail, imgUrl);

      openNotification(
        notificationApi,
        NotificationType.SUCCESS,
        "Cập nhật thành công",
        "Bạn đã cập nhật thành công"
      );

      setUser({
        id: response.data.user.id,
        phone: response.data.user.phone,
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
      if (error.response.data.codeEmail === "emailExists") {
        setErrEmail("exists");
      }
    }
  }

  function handleCancel() {
    setIsUpdate(false);
  }

  useEffect(() => {

  }, []);

  return (
    <div className="profile">
      <Header />
      <div className="content">
        <div className="container">
          <div className="img-name flex">
            <div className="img">
              <Image height={100} width={100} style={{ borderRadius: '20px' }} src={DOMAIN_IMG + user.imgUrl} />
            </div>
            <div className="full-name">
              <span>{user.fullName}</span>
            </div>
          </div>

          <div className="email-phone">
            <div className="email flex">
              <span>Email</span>
              <span>{user.email}</span>
            </div>
            <div className="phone flex">
              <span>Số điện thoại</span>
              <span>{user.phone}</span>
            </div>
          </div>

          <div className="change">
            <Button type="primary" onClick={() => setIsUpdate(true)}>Chỉnh sửa</Button>
          </div>
        </div>
      </div>
      <Footer />

      <Modal title="CẬP NHẬT THÔNG TIN" className="modal-profile" centered open={isUpdate} onOk={handleOk} onCancel={handleCancel}>
        <div className="img-name">
          <div className="img" style={{ display: 'flex', alignItems: 'center' }}>
            <Image height={100} width={100} style={{ borderRadius: '20px' }} src={imgPath ? DOMAIN_IMG + imgPath : DOMAIN_IMG + user.imgUrl} />
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
                setNewName(e.target.value.trim());
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

        <div className="email-phone">
          <div className="email flex" style={{ display: 'flex', padding: '8px' }}>
            <span style={{ width: '30%', lineHeight: '32px' }}>Email</span>
            <span style={{ paddingLeft: '12px', flexGrow: 1 }}>
              <Input value={newEmail} onChange={(e) => {
                setErrEmail("");
                setNewEmail(e.target.value.trim());
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
          <div className="phone flex" style={{ display: 'flex', padding: '8px' }}>
            <span style={{ width: '30%', lineHeight: '32px' }}>Số điện thoại</span>
            <span style={{ paddingLeft: '12px', flexGrow: 1 }}>{user.phone}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}
