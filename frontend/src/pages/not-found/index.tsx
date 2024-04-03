import Footer from '../../components/footer';
import Header from '../../components/header';
import './index.scss';

export default function NotFound() {
  return (
    <div className='not-found'>
      <Header />
      <div className='content'>
        <h2 className='color1'>Không tìm thấy trang</h2>
      </div>
      <Footer />
    </div>
  );
}
