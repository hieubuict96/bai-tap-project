import { useContext, useEffect, useState } from 'react';
import Footer from '../../components/footer';
import Header from '../../components/header';
import './index.scss';
import { Link, useLocation } from 'react-router-dom';
import { addCommentApi, getPost } from '../../api/post-api';
import { Image } from 'antd';
import { DOMAIN_IMG, IMG_NULL } from '../../common/const';
import { enterExe, formatDateUtil, formatTimeUtil, showNotification } from '../../common/common-function';
import { Input } from 'antd';
import { CiLocationArrow1 } from "react-icons/ci";
import { NotificationType } from '../../common/enum/notification-type';

export default function Post() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [data, setData] = useState<any>();
  const [comment, setComment] = useState<any>('');
  const [id, setId] = useState<any>(queryParams.get("id"));
  const [refId, setRefId] = useState<any>(queryParams.get("refId"));

  async function post() {
    const response = await getPost(id);
    setData(response.data);
    setTimeout(() => {
      const e = document.getElementById('refId');
      if (e) {
        e.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, 500);
  }

  async function addComment() {
    if (comment.trim()) {
      const response = await addCommentApi({
        id: data.post.pId,
        comment: comment.trim()
      });
      showNotification(NotificationType.SUCCESS, 'Thông báo', 'Thêm bình luận thành công', () => { });

      setComment('');
      post();
    }
  }

  useEffect(() => {
    post();
  }, []);

  useEffect(() => {
    setId(queryParams.get("id"));
    setRefId(queryParams.get("refId"));
    post();
  }, [location]);

  return (
    <div className='post-screen'>
      <Header />
      <div style={{ height: '24px' }}></div>
      <div className='content'>
        <div className="info">
          <div className="avatar">
            <Image style={{ marginLeft: '10px', borderRadius: '5px' }} width={40} src={data?.post.imgUrl ? DOMAIN_IMG + data.post.imgUrl : IMG_NULL} />
          </div>
          <div className="name color2">
            <Link to={{ pathname: '/user', search: `?id=${data?.post.id}` }} className="full-name">{data?.post.fullName}</Link>
            <div className="time">{`${formatDateUtil(data?.post.pCreatedTime)} ${formatTimeUtil(data?.post.pCreatedTime)}`}</div>
          </div>
        </div>
        <div className="post-content color3">
          {data?.post.content}
        </div>
        <div className="imgs">
          {data?.post.imgs.map((e: any, k: any) => (
            <Link to={DOMAIN_IMG + e} key={k}>
              <img src={e ? DOMAIN_IMG + e : IMG_NULL} style={{ borderRadius: '5px', width: '300px', height: '300px' }} />
            </Link>
          ))}
        </div>
        <hr />
        <div className="comments">
          <div className="title color2">Danh sách bình luận</div>
          {data?.comments.map((e: any, k: any) => (
            <div className="comment" id={e.cId == refId ? 'refId' : undefined} key={k}>
              <div className="info">
                <div className="avatar">
                  <Image style={{ marginLeft: '10px', borderRadius: '5px' }} width={40} src={e.img_url ? DOMAIN_IMG + e.img_url : IMG_NULL} />
                </div>
                <div className="name color2">
                  <Link to={{ pathname: '/user', search: `?id=${e.userId}` }} className="full-name">{e.full_name}</Link>
                  <div className="time">{`${formatDateUtil(e.created_time)} ${formatTimeUtil(e.created_time)}`}</div>
                </div>
              </div>
              <div className="content" style={{ width: 'unset', marginTop: '6px' }}>{e.cContent}</div>
            </div>
          ))}
        </div>
        <div className="input-comment">
          <Input value={comment} placeholder="Thêm bình luận" onChange={(e) => setComment(e.target.value)} onKeyDown={(e) => enterExe(e, addComment)} />
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
