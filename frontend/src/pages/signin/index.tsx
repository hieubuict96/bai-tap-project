import styled from "styled-components";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { FiAlertCircle } from "react-icons/fi";
import { useEffect } from "react";
import { signin } from "../../api/user-api";
import { UserContext } from "../../context/user-context";
import { NotificationType } from "../../common/enum/notification-type";
import { CommonContext } from "../../context/common-context";
import { TOKEN_KEY } from "../../common/const";
import { FaFacebook } from "react-icons/fa";
import { enterExe, showNotification } from "../../common/common-function";

const SigninWrapper = styled.div`
  .signin-header {
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
  }

  .signin-body {
    margin-top: 5rem;
    background: rgb(248, 74, 47);

    .signin-body-container {
      width: 1200px;
      margin: 0 auto;
      background: rgb(248, 74, 47);
      display: flex;
    }
  }
`;

const SigninHeaderContainer = styled.div`
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

  .text-signin {
    margin-left: 1rem;
    font-size: 1.5rem;
  }

  .support-link {
    margin-left: auto;
    margin-right: 1.5rem;
    color: rgb(248, 74, 47);
  }
`;

const Card = styled.div`
  width: 25rem;
  background: white;
  margin: 5rem auto;
  display: flex;
  border-radius: 3px;

  .card-container {
    margin: 5%;
    width: 90%;
    display: flex;
    flex-direction: column;
    position: relative;

    input {
      border: 1px solid rgb(219, 219, 219);
      height: 2.5rem;
      padding-left: 0.5rem;
      width: 100%;

      &:hover {
        border-color: blue;
      }

      &:focus {
        border-color: black;
      }
    }

    .title {
      font-size: 1.2rem;
      font-weight: 500;
      text-align: center;
    }

    .user {
      margin-top: 2rem;
    }

    .password {
      margin-top: 2rem;
      position: relative;
      display: flex;
      align-items: center;

      .icon {
        position: absolute;
        right: 1rem;
        line-height: 0;
        &:hover {
          cursor: pointer;
        }
      }
    }

    .error-notify {
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: red;

      .icon-alert {
        line-height: 0;
        margin-right: 0.5rem;
      }

      .text {
        text-align: center;
        font-size: 0.9rem;
      }
    }

    .button-next {
      button {
        width: 100%;
        height: 2.5rem;
        background: rgb(243, 131, 108);
        color: white;
        font-weight: 600;

        &:hover {
          color: rgb(219, 219, 219);
        }
      }
    }

    .or {
      display: flex;
      align-items: center;
      text-align: center;
      margin-top: 1rem;
      color: rgb(219, 219, 219);

      .left {
        margin-right: 1rem;
        margin-left: 1.5rem;
        width: 40%;
        border: 0.5px solid rgb(219, 219, 219);
      }

      .right {
        margin-right: 1.5rem;
        margin-left: 1rem;
        width: 40%;
        border: 0.5px solid rgb(219, 219, 219);
      }

      .text {
        width: 20%;
      }
    }

    .login-with {
      margin-top: 1rem;
      display: flex;
      justify-content: center;
    }

    .link-signup {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      margin-bottom: 1rem;

      a {
        color: rgb(238, 77, 45);
      }
    }
  }
`;

export default function SigninScreen() {
  const { setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);

  async function handleSignin() {
    try {
      const response = await signin(username.trim(), password.trim());
      showNotification(NotificationType.SUCCESS, 'Đăng nhập thành công', 'Bạn đã đăng nhập thành công', () => {});

      localStorage.setItem(TOKEN_KEY, response.data.token);

      setTimeout(() => {
        setUser({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          fullName: response.data.user.fullName,
          imgUrl: response.data.user.imgUrl,
        });
      }, 500);
    } catch (error: any) {
      if (error.response?.data.code === "signinFail") {
        setError(error.response?.data.code);
      }
    }
  }

  useEffect(() => { }, []);

  return (
    <SigninWrapper>
      <div className="signin-header">
        <SigninHeaderContainer className="signin-header-container">
          <Link to="/" className="div-home-link">
          <FaFacebook size={36} color="blue" />
            <span style={{ marginLeft: '20px' }}>FACEBOOK</span>
          </Link>
          <span className="text-signin">Đăng Nhập</span>
          <Link className="support-link" to="/">
            Cần trợ giúp?
          </Link>
        </SigninHeaderContainer>
      </div>
      <div className="signin-body">
        <div className="signin-body-container">
          <Card className="card">
            <div className="card-container">
              <div className="title">
                <span>Đăng Nhập</span>
              </div>
              <div className="user">
                <input
                  type="text"
                  name="user"
                  placeholder="Số điện thoại"
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    enterExe(e, handleSignin);
                  }}
                />
              </div>
              <div className="password">
                <input
                  {...(isShowPassword
                    ? { type: "text" }
                    : { type: "password" })}
                  name="password"
                  placeholder="Mật khẩu"
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (e.target.value) {
                      setIsPasswordEmpty(false);
                    } else {
                      setIsPasswordEmpty(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    enterExe(e, handleSignin);
                  }}
                />
                {isShowPassword ? (
                  <span
                    style={{ ...(isPasswordEmpty && { display: "none" }) }}
                    className="icon"
                    onClick={() => setIsShowPassword(false)}
                  >
                    <AiOutlineEyeInvisible />
                  </span>
                ) : (
                  <span
                    style={{ ...(isPasswordEmpty && { display: "none" }) }}
                    className="icon"
                    onClick={() => setIsShowPassword(true)}
                  >
                    <AiOutlineEye />
                  </span>
                )}
              </div>
              <div className="error-notify">
                {error === "signinFail" && (
                  <>
                    <span className="icon-alert">
                      <FiAlertCircle />
                    </span>
                    <span className="text">Đăng nhập thất bại, tên tài khoản hoặc mật khẩu không đúng</span>
                  </>
                )}
              </div>
              <div className="button-next">
                <button onClick={handleSignin}>ĐĂNG NHẬP</button>
              </div>
              <div className="or">
                <span className="left"></span>
                <span className="text">Hoặc</span>
                <span className="right"></span>
              </div>
              <div className="link-signup">
                <span className="a">Bạn mới biết đến FACEBOOK? &emsp;</span>
                <Link to="/signup">Đăng ký</Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </SigninWrapper>
  );
}
