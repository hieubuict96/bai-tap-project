import styled from "styled-components";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import { BsFacebook, BsInstagram, BsCart } from "react-icons/bs";
import { useContext, useState } from "react";
import { UserContext } from "../../context/user-context";
import { unsubscribe } from "../../socket/socket";
import { DOMAIN_IMG, TOKEN_KEY } from "../../common/const";
import { UserModel } from "../../models/user-model";
import { Button, Image } from "antd";
import { BiMessageRoundedCheck } from "react-icons/bi";
import { FaFacebook } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";
import './index.scss';
import { formatDateUtil } from "../../common/common-function";

export default function PostCard(props: any) {
  const { user, setUser } = useContext(UserContext);
  const navigate: any = useNavigate();

  return (
    <Link className="post-card color2" to={{ pathname: '/post', search: `?id=${props.id}` }}>
      <div className="title">{props.fullName}</div>
      <div className="time">{formatDateUtil(props.createdTime)}</div>
      <div className="content">{props.content}</div>
      <div className="imgs">
        {props.imgs.map((e: any, k: any) => (
          <Link key={k} to={DOMAIN_IMG + e}>
            <img src={DOMAIN_IMG + e} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary">Bình luận</Button>
      </div>
    </Link>
  );
}
