import styles from './styles.module.scss';

import MyHeader from '@components/Header/Header';
import MainLayout from '@components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import Logo from '@/pages/AboutUs/commponets/Logo';
import MyFooter from '@components/Footer/Footer';
import Accordion from '@/pages/AboutUs/commponets/Accordion';

function AboutUs() {
    const {
        container,
        functionbox,
        btnBack,
        specialText,
        BannerText,
        line,
        textContainer,
        subtitle,
        title,
        contentImage,
        contentImageText
    } = styles;
    const navigate = useNavigate();

    const handleBackPreviousPage = () => {
        navigate(-1);
    };

    const textImage = [
        {
            src: 'https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-min.jpg',
            des: 'Tại Marseille04, chúng tôi tin rằng mỗi bộ trang phục không chỉ đơn thuần là quần áo, mà còn là cách để thể hiện cá tính và phong cách riêng của bạn. Với niềm đam mê thời trang và sự tỉ mỉ trong từng chi tiết, chúng tôi luôn nỗ lực mang đến cho khách hàng những sản phẩm chất lượng, hiện đại và phù hợp với xu hướng mới nhất.'
        },
        {
            src: 'https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-copy-2-min.jpg',
            des: 'Chúng tôi lựa chọn nguyên liệu một cách kỹ lưỡng, từ chất liệu vải mềm mại, thoáng mát cho đến những đường kim mũi chỉ chắc chắn, đảm bảo sự thoải mái và bền bỉ trong quá trình sử dụng. Mỗi sản phẩm đều được đội ngũ thiết kế và sản xuất kiểm tra nghiêm ngặt, nhằm mang đến cho khách hàng sự an tâm tuyệt đối khi mua sắm.'
        },
        {
            src: 'https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-copy-min.jpg',
            des: 'Không chỉ dừng lại ở sản phẩm, Marseille04 còn mong muốn mang đến trải nghiệm mua sắm tốt nhất. Từ việc đặt hàng trực tuyến dễ dàng, thanh toán an toàn, cho đến chính sách đổi trả linh hoạt và dịch vụ hỗ trợ 24/7 – tất cả đều được xây dựng để đồng hành cùng khách hàng trên hành trình lựa chọn thời trang.'
        }
    ];
    return (
        <div>
            <MyHeader />

            <MainLayout>
                <div className={container}>
                    <div className={functionbox}>
                        <div>
                            {' '}
                            Trang chủ &gt;{' '}
                            <span className={specialText}>Giới thiệu</span>
                        </div>
                        <div
                            className={btnBack}
                            onClick={() => handleBackPreviousPage()}
                        >
                            {' '}
                            Quay lại trang trước{' '}
                        </div>
                    </div>

                    <div className={BannerText}>
                        <div className={line} />
                        <div className={textContainer}>
                            <p className={subtitle}>
                                CHÚNG TÔI LUÔN NỖ LỰC VÌ BẠN
                            </p>
                            <h2 className={title}>
                                Chào mừng bạn đến với cửa hàng Marseille04
                            </h2>
                        </div>
                        <div className={line} />
                    </div>

                    <div className={contentImage}>
                        {textImage.map((item, index) => {
                            return (
                                <div className={contentImageText}>
                                    <img
                                        src={item.src}
                                        alt=''
                                        key={index}
                                        style={{ width: '390px' }}
                                    />
                                    <p>{item.des}</p>
                                </div>
                            );
                        })}
                    </div>

                    <Logo />
                    <div className={BannerText}>
                        <div className={line} />
                        <div className={textContainer}>
                            <p className={subtitle}>
                                Luôn sẵn sàng giải đáp thắc mắc của bạn
                            </p>
                            <h2 className={title}>Bạn có câu hỏi nào không?</h2>
                        </div>
                        <div className={line} />
                    </div>
                    <Accordion />
                </div>
            </MainLayout>
            <MyFooter />
        </div>
    );
}

export default AboutUs;
