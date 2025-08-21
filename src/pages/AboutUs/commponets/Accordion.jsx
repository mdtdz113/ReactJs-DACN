import { useState } from 'react';
import styles from '../styles.module.scss';
import cls from 'classnames';
const data = [
    {
        title: 'Sản phẩm có đảm bảo chất lượng không?',
        content:
            'Tất cả sản phẩm của chúng tôi đều được kiểm tra kỹ lưỡng trước khi đến tay khách hàng. Chúng tôi cam kết về chất lượng, độ bền và sự thoải mái khi sử dụng.'
    },
    {
        title: 'Tôi có thể đổi trả sản phẩm trong bao lâu?',
        content:
            'Bạn có thể đổi hoặc trả sản phẩm trong vòng 14 ngày kể từ khi nhận hàng. Điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng và giữ nguyên bao bì ban đầu.'
    },
    {
        title: 'Có hỗ trợ giao hàng tận nơi không?',
        content:
            'Chúng tôi hỗ trợ giao hàng tận nơi trên toàn quốc. Bạn có thể yên tâm đặt hàng và nhận sản phẩm ngay tại nhà.'
    },
    {
        title: 'Phương thức thanh toán gồm những gì?',
        content:
            'Khách hàng có thể lựa chọn nhiều hình thức thanh toán khác nhau như: thẻ tín dụng, chuyển khoản ngân hàng, ví điện tử hoặc thanh toán khi nhận hàng (COD).'
    },
    {
        title: 'Sản phẩm có bảo hành không?',
        content:
            'Một số dòng sản phẩm sẽ được áp dụng chính sách bảo hành. Chi tiết bảo hành sẽ được ghi rõ trong phần mô tả sản phẩm hoặc phiếu bảo hành kèm theo.'
    },
    {
        title: 'Tôi có thể liên hệ hỗ trợ bằng cách nào?',
        content:
            'Bạn có thể liên hệ với chúng tôi qua hotline, email hoặc chat trực tiếp trên website. Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn 24/7.'
    }
];
function Accordion() {
    const [openIndex, setOpenIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);

    const handleItemClick = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };
    const {
        accordion,
        accordionItem,
        accordionHeader,
        accordionHeaderHover,
        accordionIcon,
        accordionIconRotate,
        accordionContent,
        accordionContentOpen,
        TextAccordion
    } = styles;
    return (
        <div className={accordion}>
            {data.map((item, index) => (
                <div
                    key={index}
                    className={accordionItem}
                    onClick={() => handleItemClick(index)}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                >
                    <div
                        className={cls(accordionHeader, {
                            [accordionHeaderHover]: hoverIndex === index
                        })}
                    >
                        <div className={TextAccordion}>{item.title}</div>
                        <div
                            className={cls(accordionIcon, {
                                [accordionIconRotate]: openIndex === index
                            })}
                        >
                            +
                        </div>
                    </div>
                    <div
                        className={cls(accordionContent, {
                            [accordionContentOpen]: openIndex === index
                        })}
                    >
                        {item.content}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Accordion;
