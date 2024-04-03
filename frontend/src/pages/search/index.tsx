import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { CommonContext } from "../../context/common-context";
import { UserContext } from "../../context/user-context";
import { Link, useLocation } from "react-router-dom";
import { searchUser } from "../../api/user-api";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { DOMAIN_IMG } from "../../common/const";

export default function Search() {
  const { user, setUser } = useContext(UserContext);
  const { notificationApi } = useContext(CommonContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const [res, setRes] = useState<any[]>([]);

  useEffect(() => {
    search1();
  }, []);

  async function search1() {
    const response = await searchUser(queryParams.get("keyword"));
    setRes(response.data);
  }

  return (
    <div className="search-user">
      <Header />
      <div className="content">
        <h3>DANH SÁCH KẾT QUẢ PHÙ HỢP</h3>
        <div className="result">
          {res.map((e: any) => (
            <Link to={{ pathname: '/user', search: `?id=${e.id}` }}>
              <Card
                hoverable
                style={{ width: '100%', display: 'flex' }}
                cover={<img alt="example" src={DOMAIN_IMG + e.img_url} />}
              >
                <Meta title={e.full_name} description={e.username} />
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
