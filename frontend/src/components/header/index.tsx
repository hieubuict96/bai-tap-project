import styled from "styled-components";
import { Link, createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { BsFacebook, BsInstagram, BsCart } from "react-icons/bs";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user-context";
import { unsubscribe } from "../../socket";
import { DOMAIN_IMG, IMG_NULL, TOKEN_KEY } from "../../common/const";
import { UserModel } from "../../models/user-model";
import { Image } from "antd";
import { FaFacebook } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import './index.scss';
import Notification from "../notifcation-popup";
import { CommonContext } from "../../context/common-context";
import { enterExe } from "../../common/common-function";
import { IoSearchOutline } from "react-icons/io5";
import { MessageContext } from "../../context/message-context";

const HeaderWrapper = styled.div`
  height: 8rem;
  background: rgb(248, 74, 47);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;

  .text-white {
    color: white;
  }

  .icon {
    line-height: 0;
  }

  .text-hover {
    &:hover {
      color: rgb(180, 230, 230);
    }
  }
`;

const HeaderContainer = styled.div`
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  display: flex;
  flex-direction: column;

  & a {
    text-decoration: none;
  }
`;

const Line1 = styled.div`
  margin-top: 0.5rem;
  height: 3rem;

  .a {
    display: flex;
  }

  .line-1-left {
    margin-left: 1.5rem;
    display: flex;
    align-items: center;

    a {
      margin-left: 1.5rem;
    }
  }

  .line-1-right {
    margin-left: auto;
    display: flex;
    align-items: center;

    a {
      margin-right: 1.5rem;
    }

    .abc {
      margin-right: 1.5rem;
      position: relative;

      &:hover {
        .signout-div {
          visibility: visible;
        }
      }

      .signout-div {
        visibility: hidden;
        width: 9rem;
        position: absolute;
        left: -1rem;
        top: 1.5rem;
        font-size: 0.8rem;
        display: flex;
        flex-direction: column;

        * {
          height: 3rem;
          width: 100%;
          text-align: center;
          line-height: 3rem;
          margin-right: 0;
          background: white;

          &:hover {
            cursor: pointer;
            background: rgb(240, 240, 240);
          }
        }

        a {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 0px;
          border-bottom-right-radius: 0px;
        }

        button {
          border-top-left-radius: 0px;
          border-top-right-radius: 0px;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }

    .account-link {
      display: flex;
      align-items: center;
      line-height: 0;
      margin-right: 0;

      img {
        width: 1.2rem;
        height: 1.2rem;
        object-fit: cover;
        border-radius: 50%;
        margin-right: 0.5rem;
      }

      &:hover {
        span {
          color: rgb(219, 219, 219);
        }
      }
    }

    span {
      color: white;
      text-align: center;
    }
  }
`;

const Line2 = styled.div`
  height: 4.5rem;
  display: flex;
  align-items: center;

  .div-home-link {
    display: flex;
    align-items: center;
    margin-left: 1.5rem;

    img {
      width: 4rem;
    }

    span {
      font-size: 2rem;
      font-weight: 500;
    }

    &:hover {
      span {
        color: rgb(180, 230, 230);
      }
    }
  }

  .div-search {
    flex-grow: 5;
    display: flex;

    input {
      border: 0.1px solid transparent;
      height: 3rem;
      padding-left: 1rem;
      flex-grow: 1;

      &:hover {
        border-color: blue;
      }

      &:focus {
        border-color: black;
      }
    }

    button {
      color: rgb(248, 74, 47);
      padding: 0 1rem;
      margin-left: 1rem;
      background: white;
      &:hover {
        background: rgb(180, 230, 230);
      }
    }
  }

  .space {
    height: 100%;
    flex-grow: 1;
    max-width: 4rem;
  }
`;

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const { openNotification, setOpenNotification } = useContext(CommonContext);
  const { numberMsg, setNumberMsg } = useContext(MessageContext);
  const navigate: any = useNavigate();
  let location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [keyword, setKeyword] = useState<any>(location.pathname == '/search' ? queryParams.get('keyword') : '');

  function search() {
    if (!keyword) {
      return;
    }
    navigate({
      pathname: "/search",
      search: createSearchParams({
        keyword: keyword.trim()
      }).toString()
    });
  }

  function handleOpenNotification(e: any) {
    e.stopPropagation();
    setOpenNotification(!openNotification);
  }

  const signout = () => {
    unsubscribe(user.username);
    setUser(new UserModel());

    localStorage.removeItem(TOKEN_KEY);
  };

  return (
    <HeaderWrapper className="header">
      <HeaderContainer>
        <Line1 className="line-1">
          <div className="a">
            <div className="line-1-left">
              <span className="text-white">Kết Nối</span>
              <a
                className="text-white icon text-hover"
                href="https://www.facebook.com/ShopeeVN"
              >
                <BsFacebook size={20} />
              </a>
              <a
                className="text-white icon text-hover"
                href="https://www.instagram.com/shopee_vn/"
              >
                <BsInstagram size={20} />
              </a>
            </div>
            <div className="line-1-right">
              <div className="notification">
                <IoIosNotifications size={24} onClick={handleOpenNotification} />
                {openNotification && (
                  <Notification />
                )}
              </div>
              <Link className="text-white text-hover" to="/">
                Hỗ trợ
              </Link>
              {user.id ? (
                <div className="abc" style={{ zIndex: 1000 }}>
                  <div style={{ display: 'flex' }}>
                    <Link to="/profile" className="account-link">
                      <span>{user.fullName}</span>
                    </Link>
                    <Image style={{ borderRadius: '5px' }} width={40} src={user.imgUrl ? DOMAIN_IMG + user.imgUrl : IMG_NULL} />
                  </div>
                  <div className="signout-div">
                    <Link to="/profile">THÔNG TIN TÀI KHOẢN</Link>
                    <button onClick={signout}>ĐĂNG XUẤT</button>
                  </div>
                </div>
              ) : (
                <>
                  <Link className="text-white text-hover" to="/signin">
                    Đăng nhập
                  </Link>
                  <Link className="text-white text-hover" to="/signup">
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </div>
        </Line1>
        <Line2 className="line-2">
          <Link to="/" className="div-home-link">
            <FaFacebook size={36} color="white" />
            <span className="text-white" style={{ marginLeft: '20px' }}>FACEBOOK</span>
          </Link>

          <div className="search">
            <span className="search-icon">
              <IoSearchOutline color="rgb(101, 103, 107)" />
            </span>
            <input type="text" value={keyword}
              placeholder="Search Facebook"
              onChange={(e) => { setKeyword(e.target.value) }}
              onKeyDown={(e) => {
                enterExe(e, search);
              }} />
          </div>

          <div className="message">
            <Link to="/message" className="message-icon" style={{ position: 'relative' }}>
              <RiMessengerLine size={40} color="white" />
              <span style={{ position: 'absolute', top: '-5px', right: '-5px', color: 'white', fontWeight: 500, background: '#731414', width: '21px', borderRadius: '50%', textAlign: 'center' }}>{numberMsg > 0 && numberMsg}</span>
            </Link>
          </div>
        </Line2>
      </HeaderContainer>
    </HeaderWrapper>
  );
}
