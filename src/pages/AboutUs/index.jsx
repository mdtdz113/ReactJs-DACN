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
            des: 'Ac eget cras augue nisi neque lacinia in aliquam. Odio pellentesque sed ultrices dolor amet nunc habitasse proin consec. tur feugiat egestas eget.'
        },
        {
            src: 'https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-copy-2-min.jpg',
            des: 'Arcu volutpat sollicitudin sapien sit justo tellus eu fames aenean. Faucibus at eu nulla adipiscing. Ipsum a morbi tortor ullamcorper sit semper.'
        },
        {
            src: 'https://xstore.b-cdn.net/elementor2/marseille04/wp-content/uploads/sites/2/2022/12/Image-copy-min.jpg',
            des: 'Nibh luctus eu dignissim sit. Lorem netus ultrices neque elementum. Et convallis consectetur lacus luctus iaculis quisque sed.'
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
                            Home &gt;{' '}
                            <span className={specialText}>About us</span>
                        </div>
                        <div
                            className={btnBack}
                            onClick={() => handleBackPreviousPage()}
                        >
                            {' '}
                            Return to previous page{' '}
                        </div>
                    </div>

                    <div className={BannerText}>
                        <div className={line} />
                        <div className={textContainer}>
                            <p className={subtitle}>WE TRY OUR BEST FOR YOU</p>
                            <h2 className={title}>
                                Welcome to the Marseille04 Shop
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
                            <p className={subtitle}>we are happy to help you</p>
                            <h2 className={title}>Have Any Questions?</h2>
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
