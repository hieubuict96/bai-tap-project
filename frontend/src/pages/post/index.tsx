import { useContext, useEffect, useState } from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import './index.scss';
import { UserContext } from '../../context/user-context';
import { CommonContext } from '../../context/common-context';
import { Link, useLocation } from 'react-router-dom';
import { addCommentApi, getPost } from '../../api/post-api';
import { Image } from 'antd';
import { DOMAIN_IMG } from '../../common/const';
import { formatDateUtil } from '../../common/common-function';
import { Input } from 'antd';
import { CiLocationArrow1 } from "react-icons/ci";
import { openNotification } from '../../common/notification';
import { NotificationType } from '../../common/enum/notification-type';

export default function Post() {
  const { user, setUser } = useContext(UserContext);
  const { notificationApi } = useContext(CommonContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [data, setData] = useState<any>();
  const [comment, setComment] = useState<any>('');

  async function post() {
    const response = await getPost(queryParams.get("id"));
    setData(response.data);
  }

  async function addComment() {
    if (comment.trim()) {
      const response = await addCommentApi({
        id: data.post.pId,
        comment: comment.trim()
      });

      openNotification(
        notificationApi,
        NotificationType.SUCCESS,
        "Thông báo",
        "Thêm bình luận thành công"
      );

      setComment('');
      post();
    }
  }

  useEffect(() => {
    post();
  }, []);

  return (
    <div className='post-screen'>
      <Header />
      <div style={{ height: '24px' }}></div>
      <div className='content'>
        <div className="info">
          <div className="avatar">
            <Image style={{ marginLeft: '10px', borderRadius: '5px' }} width={40} src={DOMAIN_IMG + data?.post.imgUrl} />
          </div>
          <div className="name color2">
            <Link to={{ pathname: '/user', search: `?id=${data?.post.id}` }} className="full-name">{data?.post.fullName}</Link>
            <div className="time">{formatDateUtil(data?.post.pCreatedTime)}</div>
          </div>
        </div>
        <div className="post-content color3">
          {data?.post.content}
        </div>
        <div className="imgs">
          {data?.post.imgs.map((e: any, k: any) => (
            <Link to={DOMAIN_IMG + e} key={k}>
              <img src={DOMAIN_IMG + e} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
            </Link>
          ))}
        </div>
        <hr />
        <div className="comments">
          <div className="title color2">Danh sách bình luận</div>
          {data?.comments.map((e: any, k: any) => (
            <div className="comment" key={k}>
              <div className="info">
                <div className="avatar">
                  <Image style={{ marginLeft: '10px', borderRadius: '5px' }} width={40} src={DOMAIN_IMG + e.img_url} />
                </div>
                <div className="name color2">
                  <Link to={{ pathname: '/user', search: `?id=${e.userId}` }} className="full-name">{e.full_name}</Link>
                  <div className="time">{formatDateUtil(e.created_time)}</div>
                </div>
              </div>
              <div className="content" style={{ width: 'unset', marginTop: '6px' }}>{e.cContent}</div>
            </div>
          ))}
        </div>
        <div className="input-comment">
          <Input value={comment} placeholder="Thêm bình luận" onChange={(e) => setComment(e.target.value)} />
          <button onClick={addComment}>
            <CiLocationArrow1 size={20} />
          </button>
        </div>
      </div>
      <div style={{ height: '24px' }}></div>
      <Footer />
    </div>
  );
}
