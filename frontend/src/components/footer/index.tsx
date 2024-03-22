import styled from "styled-components";
import './index.scss';

const FooterWrapper = styled.div`
  background: white;
`;

const FooterContainer = styled.div`
  width: 1200px;
  display: flex;
  background: white;
  padding-top: 1.5rem;
  margin-left: auto;
  margin-right: auto;
  font-weight: 500;
  color: #747487;

  div {
    width: 200px;
    height: 200px;
    text-align: center;
  }
`;

export default function Footer() {
  return (
    <FooterWrapper className="footer">
      <FooterContainer className="footer-container">
        <div>CHĂM SÓC KHÁCH HÀNG</div>
        <div>VỀ VIDEO CALL</div>
        <div>THANH TOÁN</div>
        <div>THEO DÕI CHÚNG TÔI TRÊN</div>
        <div>ĐƠN VỊ VẬN CHUYỂN</div>
        <div>TẢI VIDEO CALL</div>
      </FooterContainer>
    </FooterWrapper>
  );
}
