import MyHeader from '@components/Header/Header';
import Contents from '@/pages/Cart/components/contents/Contents';
import MyFooter from '@components/Footer/Footer';
import Steps from '@/pages/Cart/components/steps/Steps';
import styles from './styles.module.scss';
import MainLayout from '@components/Layout/Layout';
import { useContext, useState } from 'react';
import { StepperContext } from '@/context/SteperProvider';
import { StepperProvider } from '@/context/SteperProvider';
import ContentStep from '@/pages/Cart/components/ContentStep';


function Cart() {

    const { container } = styles;


    

    
    return (
        <StepperProvider>
            <MyHeader />

            <div className={container}>
                <Steps />
                <MainLayout>
                    <ContentStep/>
                </MainLayout>
            </div>

            <MyFooter />
        </StepperProvider>
    );
}

export default Cart;
