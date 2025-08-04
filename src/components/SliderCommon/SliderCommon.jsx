import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { IoIosArrowBack } from 'react-icons/io';
import { IoIosArrowForward } from 'react-icons/io';
import './styles.css';
import ProductItem from '@components/ProductItem/ProductItem';

function SliderCommon({ data, isProductItem = false, showItem = 1 }) {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: showItem,
        slidesToScroll: 1,
        nextArrow: <IoIosArrowForward />,
        prevArrow: <IoIosArrowBack />
    };

    return (
        <Slider {...settings}>
            {data.map((item, index) => {
                const src = item?.images ? item?.images[0] : item.image;

                return (
                    <>
                        {isProductItem ? (
                            <ProductItem
                                src={src}
                                name={item.name}
                                price={item.price}
                                prevSrc={src}
                                details={item}
                                isHomePage={false}
                                slideItem
                            />
                        ) : (
                            <img src={item} alt='test' key={index} />
                        )}
                    </>
                );
            })}
        </Slider>
    );
}

export default SliderCommon;
