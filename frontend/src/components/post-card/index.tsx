import { Link } from "react-router-dom";
import { DOMAIN_IMG, IMG_NULL } from "../../common/const";
import { Button } from "antd";
import './index.scss';
import { formatDateUtil, formatTimeUtil } from "../../common/common-function";

export default function PostCard(props: any) {
  return (
    <Link className="post-card color2" to={{ pathname: '/post', search: `?id=${props.id}` }}>
      <div className="info">
        <div className="avatar">
          <img style={{ marginLeft: '10px', borderRadius: '5px' }} width={40} src={props.imgUrl ? DOMAIN_IMG + props.imgUrl : IMG_NULL} />
        </div>
        <div className="name color2">
          <Link to={{ pathname: '/user', search: `?id=${props.uId}` }} className="full-name">{props.fullName}</Link>
          <div className="time">{`${formatDateUtil(props.createdTime)} ${formatTimeUtil(props.createdTime)}`}</div>
        </div>
      </div>
      <div className="post-content color3">{props.content}</div>

      <div className="imgs">
        {props.imgs.map((e: any, k: any) => (
          <Link key={k} to={DOMAIN_IMG + e}>
            <img src={e ? DOMAIN_IMG + e : IMG_NULL} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary">Bình luận</Button>
      </div>
    </Link>
  );
}
