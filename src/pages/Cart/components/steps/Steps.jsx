import Stepper from '@/pages/Cart/components/steps/Stepper';
import styles from '../../styles.module.scss';
import { useContext } from 'react';
import { StepperContext } from '@/context/SteperProvider';

function Steps() {
    const { containerSteps, steps, line, textNoti } = styles;

    const { currentStep } = useContext(StepperContext);

    const dataSteps = [
        { number: 1, content: 'GIỎ HÀNG' },
        { number: 2, content: 'THANH TOÁN' },
        { number: 3, content: 'HOÀN TẤT ĐƠN HÀNG' }
    ];

    return (
        <div className={containerSteps}>
            <div className={steps}>
                {dataSteps.map((item, index) => {
                    return (
                        <>
                            <Stepper
                                number={item.number}
                                content={item.content}
                                key={index}
                                isDisabled={index >= currentStep}
                            />
                            {index !== dataSteps.length - 1 && (
                                <div className={line}></div>
                            )}
                        </>
                    );
                })}
            </div>
            <div className={textNoti}>
                Bạn sắp hết thời gian! Hãy thanh toán ngay để không bị mất đơn
                hàng!
            </div>
        </div>
    );
}

export default Steps;
