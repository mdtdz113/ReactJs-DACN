import { useContext, useState } from 'react';
import styles from './styles.module.scss';
import { SideBarContext } from '@/context/SideBarProvider';
import SliderCommon from '@components/SliderCommon/SliderCommon';
import SelectBox from '@/pages/components/SelectBox';
import MyButton from '@components/Button/Button';
import { FaCartPlus } from 'react-icons/fa';
import { FaRegHeart } from 'react-icons/fa';
import { TfiReload } from 'react-icons/tfi';
import cls from 'classnames';
import { addProductToCart } from '@/apis/cartService';

function DetailProducts() {
    const {
        container,
        titleName,
        titlePrice,
        boxSize,
        sizeDetail,
        boxBtn,
        boxOr,
        line,
        Or,
        textIcon,
        textIconSmall,
        textdes,
        isActivate,
        textClear
    } = styles;
    const {
        detailsProduct,
        userId,
        setType,
        hangleGetListProductCart,
        isLoading,
        setIsLoading,
        setIsOpen
    } = useContext(SideBarContext);
    const [sizeChoose, setSizeChoose] = useState('');
    const [quantity, setQuantity] = useState(1);

    const showOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
        { label: '6', value: '6' },
        { label: '7', value: '7' }
    ];
    const handleChooseSize = (value) => {
        setSizeChoose(value);
    };

    const handleClearSize = () => {
        setSizeChoose('');
    };
    const handleGetQuantity = (value) => {
        setQuantity(value);
    };
    const handleAddToCart = () => {
        const data = {
            userId: userId,
            productId: detailsProduct._id,
            quantity,
            size: sizeChoose,
            isMultiple: true
        };
        setIsOpen(false);
        setIsLoading(true);
        addProductToCart(data)
            .then((res) => {
                setIsOpen(true);
                setType('cart');
                hangleGetListProductCart(userId, 'cart');
            })
            .catch((err) => {
                setIsLoading(false);
                console.error('Error adding product to cart:', err);
            });
    };

    return (
        <div className={container}>
            <SliderCommon data={detailsProduct.images} />
            <div className={titleName}>{detailsProduct.name}</div>
            <div className={titlePrice}>${detailsProduct.price}</div>
            <p>{detailsProduct.description}</p>
            <span>Size {sizeChoose}</span>
            <div className={boxSize}>
                {detailsProduct.size.map((size, index) => {
                    return (
                        <div
                            onClick={() => handleChooseSize(size.name)}
                            className={cls(sizeDetail, {
                                [isActivate]: size.name === sizeChoose
                            })}
                            key={index}
                        >
                            {size.name}
                        </div>
                    );
                })}
            </div>
            {sizeChoose && (
                <div className={textClear} onClick={() => handleClearSize()}>
                    clear
                </div>
            )}
            <div className={boxBtn}>
                <SelectBox
                    options={showOptions}
                    type='show'
                    defaultValue={quantity}
                    getValue={handleGetQuantity}
                />
                <MyButton
                    onClick={handleAddToCart}
                    content={
                        <div>
                            {' '}
                            <FaCartPlus /> ADD TO CART
                        </div>
                    }
                />
            </div>

            <div className={boxOr}>
                <div className={line}></div>
                <div className={Or}>OR</div>
                <div className={line}></div>
            </div>
            <div>
                <MyButton
                    content={
                        <div>
                            {' '}
                            <FaCartPlus /> {'  '}BUY NOW
                        </div>
                    }
                />
            </div>
            <div className={textIcon}>
                <TfiReload />
                <div className={textIconSmall}>Add to compare</div>
            </div>
            <div className={textIcon}>
                <FaRegHeart />
                <div className={textIconSmall}>Add to whislist</div>
            </div>
            <div className={textIcon}>
                <div style={{ fontSize: '16px' }}>SKU:</div>
                <div className={textdes}> 34567</div>
            </div>
            <div className={textIcon}>
                <div style={{ fontSize: '16px' }}>Category:</div>
                <div className={textdes}> Men</div>
            </div>
            <div className={textIcon}>
                <div style={{ fontSize: '16px' }}>Estimated delivery:</div>
                <div className={textdes}> 3 - 7 days</div>
            </div>
        </div>
    );
}

export default DetailProducts;
