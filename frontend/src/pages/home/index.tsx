import styled from "styled-components";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/user-context";
import { Button, Image, Input, Modal } from "antd";
import './index.scss';
import { DOMAIN_IMG } from "../../common/const";
import { MdInsertPhoto } from "react-icons/md";

const HomeScreenWrapper = styled.div``;

const Body = styled.div`
  min-width: 1200px;
  margin-top: 8rem;
  background: rgb(240, 240, 240);
  display: flex;
  flex-direction: column;

  .container {
    width: 1200px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    margin: 2rem auto 2rem auto;
    padding-left: 2rem;
    padding-right: 2rem;

    .search-user {
      height: 30px;
      display: flex;
      justify-content: center;

      input {
        padding-left: 10px;
      }

      button {
        background-color: rgb(255, 100, 47);
        color: white;
        font-weight: 700;
        margin-left: 12px;
        width: 80px;

        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`;

export default function HomeScreen() {
  const { user } =
    useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [files, setFiles] = useState<any[]>();
  const navigate = useNavigate();

  async function handleOk() {

  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <HomeScreenWrapper className="home">
      <Header />
      <Body className="home-body">
        <div className="container">
          <div className="input-share">
            <div className="input">
              <div className="avatar">
                <Link to={`/profile`}>
                  <Image src={DOMAIN_IMG + user.imgUrl} />
                </Link>
              </div>
              <div className="share">
                <Input placeholder="Bạn đang nghĩ gì?" onClick={() => setOpen(true)} />
              </div>
            </div>
            <div className="action">
              <div className="upload-photos">
                <MdInsertPhoto size={30} color="green" onClick={() => setOpen(true)} />
              </div>
            </div>
          </div>
        </div>
      </Body>
      <Footer />

      <Modal title="BAN ĐANG NGHĨ GÌ?" className="modal-mind" centered open={open} onOk={handleOk} onCancel={handleCancel}>
        <div className="line1">
          <div className="avatar">
            <Link to={`/profile`}>
              <Image src={DOMAIN_IMG + user.imgUrl} />
            </Link>
          </div>

          <div className="name">{user.fullName}</div>
        </div>
        <div className="input">
          <textarea value={status} placeholder="Bạn đang nghĩ gì?" onChange={(e) => setStatus(e.target.value)} />
        </div>
        <div className="photos">
          <Input id="mind-input" multiple={true} type="file" onChange={(e) => {
            const files = [];
            if (e.target.files?.length) {
              for (let i = 0; i < e.target.files?.length; i++) {
                files.push(e.target.files[i]);
              }
            }

            setFiles(files);
          }} />

          <label htmlFor="mind-input">Tải lên ảnh</label>
          <div className="img-list">
            {files?.map((e, k) => {
              const img = URL.createObjectURL(e);
              return <Image key={k} src={img} />
            })}
          </div>
        </div>
      </Modal>
    </HomeScreenWrapper>
  );
}
