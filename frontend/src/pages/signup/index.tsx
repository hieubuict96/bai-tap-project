import styled from "styled-components";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";
import Footer from "../../components/footer";
import { signup } from "../../api/user-api";
import { UserContext } from "../../context/user-context";
import { openNotification } from "../../common/notification";
import { NotificationType } from "../../common/enum/notification-type";
import { CommonContext } from "../../context/common-context";
import { TOKEN_KEY } from "../../common/const";
import { Button, Image } from "antd";

const SignupWrapper = styled.div``;

const SignupHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 5rem;
  background: white;
  z-index: 100;

  a {
    text-decoration: none;
  }
`;

const SignupHeaderContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;

  .div-home-link {
    display: flex;
    align-items: center;
    margin-left: 1.5rem;

    img {
      width: 3rem;
    }

    span {
      color: rgb(248, 74, 47);
      font-size: 1.5rem;
      font-weight: 500;
    }
  }

  .text-signup {
    margin-left: 1rem;
    font-size: 1.5rem;
  }

  .support-link {
    margin-left: auto;
    margin-right: 1.5rem;
    color: rgb(248, 74, 47);
  }
`;

const SignupBody = styled.div`
  margin-top: 5rem;
  background: rgb(248, 74, 47);
`;

const SignupBodyContainer = styled.div`
  width: 1200px;
  margin: 0 auto;
  background: rgb(248, 74, 47);
  display: flex;
`;

const Card = styled.div`
  width: 25rem;
  background: white;
  margin: 5rem auto;
  display: flex;
  border-radius: 3px;
`;

const CardStep_3 = styled.div`
  margin: 5%;
  width: 90%;
  display: flex;
  flex-direction: column;

  .icon {
    line-height: 0;
    position: absolute;
    right: 10px;
    &:hover {
      cursor: pointer;
    }
  }

  .title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 500;
  }

  .subtitle {
    margin-top: 0.5rem;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  input {
    border: 1px solid rgb(219, 219, 219);
    height: 2.5rem;
    padding-left: 0.5rem;
    margin-left: 1rem;
    flex-grow: 1;

    &:hover {
      border-color: blue;
    }

    &:focus {
      border-color: black;
    }
  }

  .first-name {
    display: flex;
    align-items: center;
    margin-top: 1rem;
  }

  .error-notify {
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    .icon-alert {
      line-height: 0;
      margin-right: 0.5rem;
    }

    span {
      font-size: 0.9rem;
      color: red;
    }
  }

  .last-name {
    display: flex;
    align-items: center;
  }

  .email {
    display: flex;
    align-items: center;
  }

  .password {
    display: flex;
    align-items: center;

    position: relative;
  }

  .repassword {
    display: flex;
    align-items: center;

    position: relative;
  }

  .phone-number {
    display: flex;
    align-items: center;

    .b {
      margin-left: auto;
    }
  }

  button {
    height: 2.5rem;
    background: rgb(243, 131, 108);
    color: white;
    font-weight: 600;
    margin-bottom: 1rem;
    margin-top: 1rem;

    &:hover {
      color: rgb(219, 219, 219);
    }
  }
`;

export default function SignupScreen() {
  const { notificationApi } = useContext(CommonContext);
  const { setUser } = useContext(UserContext);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errPhone, setErrPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [errFullName, setErrFullName] = useState("");
  const [email, setEmail] = useState("");
  const [errEmail, setErrEmail] = useState("");
  const [imgUrl, setImgUrl] = useState<any>();
  const [errImgUrl, setErrImgUrl] = useState('');
  const [imgPath, setImgPath] = useState<any>();
  const [password, setPassword] = useState("");
  const [errPassword, setErrPassword] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [repassword, setRepassword] = useState("");
  const [errRepassword, setErrRepassword] = useState("");
  const [isShowRepassword, setIsShowRepassword] = useState(false);

  async function handleSendInfo() {
    let existsError = false;
    if (!phoneNumber.trim()) {
      setErrPhone("empty");
      existsError = true;
    } else {
      setErrPhone("");
    }

    if (!password.trim()) {
      setErrPassword("empty");
      existsError = true;
    } else {
      setErrPassword("");
    }

    if (password !== repassword) {
      setErrRepassword("notMatch");
      existsError = true;
    } else {
      setErrRepassword("");
    }

    if (!fullName.trim()) {
      setErrFullName("empty");
      existsError = true;
    } else {
      setErrFullName("");
    }

    if (!email.trim()) {
      setErrEmail("empty");
      existsError = true;
    } else {
      setErrEmail("");
    }

    if (imgUrl == null) {
      setErrImgUrl("empty");
      existsError = true;
    } else {
      setErrImgUrl("");
    }

    if (existsError) {
      return;
    }

    try {
      const response = await signup(phoneNumber, password, fullName, email, imgUrl);

      openNotification(
        notificationApi,
        NotificationType.SUCCESS,
        "Đăng ký thành công",
        "Bạn đã đăng ký thành công"
      );

      localStorage.setItem(TOKEN_KEY, response.data.token);

      setTimeout(() => {
        setUser({
          id: response.data.user.id,
          phone: response.data.user.phone,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          imgUrl: response.data.user.imgUrl,
        });
      }, 1500);
    } catch (error: any) {
      if (error.response.data.codePhone === "phoneExists") {
        setErrPhone("exists");
      }

      if (error.response.data.codeEmail === "emailExists") {
        setErrEmail("exists");
      }
    }
  }

  useEffect(() => { }, []);

  return (
    <SignupWrapper className="signup">
      <SignupHeader>
        <SignupHeaderContainer className="signup-header-container">
          <Link to="/" className="div-home-link">
            <img src="/shopee.png" />
            <span style={{ marginLeft: '20px' }}>VIDEO CALL</span>
          </Link>
          <span className="text-signup">Đăng Ký</span>
          <Link className="support-link" to="/">
            Cần trợ giúp?
          </Link>
        </SignupHeaderContainer>
      </SignupHeader>
      <SignupBody className="signup-body">
        <SignupBodyContainer>
          <Card className="card">
            <CardStep_3>
              <span className="title">Đăng Ký</span>
              <span className="subtitle">Nhập thông tin đăng ký</span>
              <div className="last-name">
                <span>Số điện thoại *</span>
                <input
                  type="text"
                  name="phone"
                  onChange={(e) => {
                    setErrPhone("");
                    setPhoneNumber(e.target.value.trim());
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
              </div>
              <div className="error-notify">
                {errPhone === "empty" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Số điện thoại không được để trống</span>
                  </>
                )}
                {errPhone === "exists" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>
                      Số điện thoại đã được sử dụng, vui lòng đăng ký số khác!!!
                    </span>
                  </>
                )}
              </div>

              <div className="last-name">
                <span>Họ và tên *</span>
                <input
                  type="text"
                  name="fullName"
                  onChange={(e) => {
                    setErrFullName("");
                    setFullName(e.target.value.trim());
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
              </div>
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

              <div className="last-name">
                <span>Email *</span>
                <input
                  type="text"
                  name="phone"
                  onChange={(e) => {
                    setErrEmail("");
                    setEmail(e.target.value.trim());
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
              </div>
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

              <div className="last-name">
                <label htmlFor="img-url">Ảnh Đại Diện *</label>
                <Button type="primary" style={{ margin: '0 20px', padding: '0' }}>
                  <label htmlFor="img-url" style={{ padding: '4px 16px', display: 'block', height: '100%', lineHeight: '32px', cursor: 'pointer' }}>Up ảnh lên</label>
                </Button>
                <input
                  style={{ display: 'none' }}
                  id="img-url"
                  type="file"
                  name="imgUrl"
                  onChange={(e) => {
                    if (e.target.files) {
                      setErrImgUrl('');
                      setImgUrl(e.target?.files[0]);
                      let reader = new FileReader();
                      reader.readAsDataURL(e.target?.files[0]);

                      reader.onloadend = function() {
                        setImgPath(reader.result);
                      }
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
                <Image width={100} src={imgPath}></Image>
              </div>
              <div className="error-notify">
                {errImgUrl === "empty" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Ảnh đại diện không được để trống</span>
                  </>
                )}
              </div>

              <div className="password">
                <span>Mật khẩu*</span>
                <input
                  {...(isShowPassword
                    ? { type: "text" }
                    : { type: "password" })}
                  name="password"
                  onChange={(e) => {
                    setErrPassword("");
                    setPassword(e.target.value.trim());
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
                {isShowPassword ? (
                  <span
                    style={{ ...{ display: "none" } }}
                    className="icon"
                    onClick={() => setIsShowPassword(false)}
                  >
                    <AiOutlineEyeInvisible />
                  </span>
                ) : (
                  <span
                    style={{ ...{ display: "none" } }}
                    className="icon"
                    onClick={() => setIsShowPassword(true)}
                  >
                    <AiOutlineEye />
                  </span>
                )}
              </div>
              <div className="error-notify">
                {errPassword === "empty" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Mật khẩu không được để trống</span>
                  </>
                )}
              </div>
              <div className="repassword">
                <span>Nhập lại mật khẩu*</span>
                <input
                  {...(isShowRepassword
                    ? { type: "text" }
                    : { type: "password" })}
                  name="repassword"
                  onChange={(e) => {
                    setErrRepassword("");
                    setRepassword(e.target.value.trim());
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleSendInfo();
                    }
                  }}
                />
                {isShowRepassword ? (
                  <span
                    style={{ ...{ display: "none" } }}
                    className="icon"
                    onClick={() => setIsShowRepassword(false)}
                  >
                    <AiOutlineEyeInvisible />
                  </span>
                ) : (
                  <span
                    style={{ ...{ display: "none" } }}
                    className="icon"
                    onClick={() => setIsShowRepassword(true)}
                  >
                    <AiOutlineEye />
                  </span>
                )}
              </div>
              <div className="error-notify">
                {errRepassword === "notMatch" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span>Mật khẩu không khớp</span>
                  </>
                )}
              </div>
              <button onClick={handleSendInfo}>ĐĂNG KÝ</button>
            </CardStep_3>
          </Card>
        </SignupBodyContainer>
      </SignupBody>
      <Footer />
    </SignupWrapper>
  );
}
