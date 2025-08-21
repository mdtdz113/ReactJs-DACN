import { addProductToCart } from '@/apis/cartService';
export const handleAddProductToCartCommon = (
    userId,
    setIsOpen,
    setType,
    toast,
    sizeChoose,
    productId,
    quantity,
    setIsLoading,
    hangleGetListProductCart
) => {
    if (!userId) {
        setIsOpen(true);
        setType('login');
        toast.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');

        return;
    }

    if (!sizeChoose) {
        toast.warning('Vui lòng chọn kích thước!');
        return;
    }

    const data = {
        userId,
        productId,
        quantity,
        size: sizeChoose
    };

    setIsLoading(true);
    addProductToCart(data)
        .then((res) => {
            setIsOpen(true);
            setType('cart');
            setIsLoading(false);
            hangleGetListProductCart(userId, 'cart');
        })
        .catch((err) => {
            toast.error('Thêm sản phẩm vào giỏ hàng thất bại!');
            setIsLoading(false);
        });
};

export const handleTotalPrice = (listProduct) => {
    return listProduct.reduce((acc, item) => {
        return acc + item.total;
    }, 0);
};
