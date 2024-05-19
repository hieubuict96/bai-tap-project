import Header from "../../components/header";
import Footer from "../../components/footer";
import { useContext, useEffect, useState } from "react";
import "./index.scss";
import { UserContext } from "../../context/user-context";
import { Link, useLocation } from "react-router-dom";
import { searchUser } from "../../api/user-api";
import { Card } from "antd";
import Meta from "antd/es/card/Meta";
import { DOMAIN_IMG, IMG_NULL } from "../../common/const";

export default function Search() {
  const { user, setUser } = useContext(UserContext);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [res, setRes] = useState<any[]>([]);

  useEffect(() => {
    search1();
  }, []);

  async function search1() {
    const response = await searchUser(queryParams.get("keyword"));
    setRes(response.data);
  }

  useEffect(() => {
    search1();
  }, [location]);

  return (
    <div className="search-user">
      <Header />
      <div className="content">
        <h3 style={{ paddingTop: '30px' }}>DANH SÁCH KẾT QUẢ PHÙ HỢP</h3>
        <div className="result">
          {res.map((e: any) => (
            <Link to={{ pathname: '/user', search: `?id=${e.id}` }}>
              <Card
                hoverable
                style={{ width: '100%', display: 'flex' }}
                cover={<img alt="example" src={e.img_url ? DOMAIN_IMG + e.img_url : IMG_NULL} />}
              >
                <Meta title={e.full_name} description={e.username} />
              </Card>
            </Link>
          ))}
          {res.length == 0 && (
            <div style={{ textAlign: 'center', fontWeight: 500 }}>Không có thông tin</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
