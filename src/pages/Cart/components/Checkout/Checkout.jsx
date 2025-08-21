import InputCustom from '@components/ImputCommon2/Input'; // Fix typo if needed: InputCommon2
import { useForm } from 'react-hook-form';

import styles from './styles.module.scss';
import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RightBody from '@/pages/Cart/components/Checkout/RightBody';
import { creactOrder } from '@/apis/orderService';
import { SideBarContext } from '@/context/SideBarProvider';
import { StepperContext } from '@/context/SteperProvider';

const CN_BASE = 'https://countriesnow.space/api/v0.1';

function Checkout() {
    const { container, leftbody, rightbody, row, row2colum } = styles;
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors }
    } = useForm();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const formRef = useRef();
    const navigate = useNavigate();

    const dataOption = [
        { value: '1', label: 'option1' },
        { value: '2', label: 'option2' },
        { value: '3', label: 'option3' },
        { value: '4', label: 'option4' },
        { value: '5', label: 'option5' }
    ];

    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [states, setStates] = useState([]);
    const navigete = useNavigate();
    const { setCurrentStep } = useContext(StepperContext);

    // Watch values - use these in useEffect dependencies
    const watchedCountry = watch('country');
    const watchedCity = watch('cities');

    const handleExternalSubmit = () => {
        formRef.current.requestSubmit();
    };

    const onSubmit = async (data) => {
        try {
            const res = await creactOrder(data);
            setCurrentStep(3);

            navigete(
                `/cart/?id=${res.data.data._id}&totalAmount=${res.data.data.totalAmount}`
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch countries on mount
    useEffect(() => {
        axios
            .get(`${CN_BASE}/countries/iso`)
            .then((res) => {
                setCountries(
                    res.data.data.map((c) => ({
                        value: c.name,
                        label: c.name
                    }))
                );
            })
            .catch((error) =>
                console.error('Error fetching countries:', error)
            );
    }, []);
    const handleCreateOrderCOD = async () => {
        const data = getValues(); // Lấy dữ liệu form
        try {
            const res = await creactOrder(data); // API tạo đơn
            setCurrentStep(3);
            navigate(`/order-success?id=${res.data.data._id}`); // sang trang xác nhận đơn COD
        } catch (error) {
            console.log(error);
        }
    };
    // Fetch cities when country changes
    useEffect(() => {
        if (!watchedCountry) {
            setCities([]);
            setStates([]);
            return;
        }

        // console.log('Selected country:', watchedCountry);

        if (watchedCountry === 'Vietnam') {
            // Check if data already exists in localStorage
            const storedCities = localStorage.getItem('listCities');

            if (storedCities) {
                const data = JSON.parse(storedCities);
                setCities(
                    data.map((item) => ({
                        label: item.name,
                        value: item.codename
                    }))
                );
            } else {
                // Fetch Vietnam cities from API
                axios
                    .get('https://provinces.open-api.vn/api/?depth=2')
                    .then((res) => {
                        // console.log('Vietnam API response:', res.data);
                        localStorage.setItem(
                            'listCities',
                            JSON.stringify(res.data)
                        );

                        setCities(
                            res.data.map((item) => ({
                                label: item.name,
                                value: item.codename
                            }))
                        );
                    })
                    .catch((error) => {
                        console.error('Error fetching Vietnam cities:', error);
                        setCities([]);
                    });
            }
        } else {
            // For other countries, use the original API
            axios
                .post(`${CN_BASE}/countries/cities`, {
                    country: watchedCountry
                })
                .then((res) => {
                    if (res.data.data) {
                        setCities(
                            res.data.data.map((city) => ({
                                value: city,
                                label: city
                            }))
                        );
                    }
                })
                .catch((error) => {
                    console.error('Error fetching cities:', error);
                    setCities([]);
                });
        }
    }, [watchedCountry]);

    // Fetch states/districts when city changes
    useEffect(() => {
        if (!watchedCity) {
            setStates([]);
            return;
        }

        // console.log('Selected city:', watchedCity);

        if (watchedCountry === 'Vietnam') {
            const storedCities = localStorage.getItem('listCities');
            if (storedCities) {
                const data = JSON.parse(storedCities);
                const selectedCity = data.find(
                    (item) => item.codename === watchedCity
                );

                if (selectedCity && selectedCity.districts) {
                    const statesCustom = selectedCity.districts.map((item) => ({
                        label: item.name,
                        value: item.codename
                    }));
                    setStates(statesCustom);
                } else {
                    setStates([]);
                }
            }
        } else {
            // For other countries, use the original API or default options
            setStates(dataOption);
        }
    }, [watchedCity, watchedCountry]);

    // Debug logs
    // console.log('Countries:', countries);
    // console.log('Cities:', cities);
    // console.log('States:', states);
    // console.log('Watched country:', watchedCountry);
    // console.log('Watched city:', watchedCity);

    return (
        <div className={container}>
            <div className={leftbody}>
                <p>
                    Have a coupon? <span>Click here to enter</span>
                </p>

                <p>BILLING DETAILS</p>

                <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                    <div className={row2colum}>
                        <InputCustom
                            lable={'Tên'}
                            type={'text'}
                            isRequired
                            register={register('firstName', {
                                required: 'First name is required'
                            })}
                            isError={errors.firstName}
                        />
                        <InputCustom
                            lable={'Họ'}
                            type={'text'}
                            isRequired
                            register={register('lastName', {
                                required: 'Last name is required'
                            })}
                            isError={errors.lastName}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Tên công ty'}
                            type={'text'}
                            register={register('companyName')}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Quốc gia / Khu vực'}
                            dataOption={countries}
                            isRequired
                            register={register('country', {
                                required: 'Country is required'
                            })}
                            isError={errors.country}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Địa chỉ'}
                            type={'text'}
                            isRequired
                            register={register('street', {
                                required: 'Street address is required'
                            })}
                            isError={errors.streetAddress}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            isShowLabel={false}
                            lable={'Căn hộ, suite, v.v. (tùy chọn)'}
                            type={'text'}
                            register={register('apartment')}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Tỉnh/Thành phố'}
                            dataOption={cities}
                            isRequired
                            register={register('cities', {
                                required: 'City is required'
                            })}
                            isError={errors.cities}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Quận/ Huyện'}
                            dataOption={states}
                            isRequired
                            register={register('state', {
                                required: 'State is required'
                            })}
                            isError={errors.state}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Số điện thoại'}
                            type={'tel'}
                            isRequired
                            register={register('phone', {
                                required: 'Phone is required'
                            })}
                            isError={errors.phone}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Mã code'}
                            type={'text'}
                            isRequired
                            register={register('zipCode', {
                                required: 'Zip code is required'
                            })}
                            isError={errors.zipCode}
                        />
                    </div>

                    <div className={row}>
                        <InputCustom
                            lable={'Địa chỉ Email'}
                            type={'email'}
                            isRequired
                            register={register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            })}
                            isError={errors.email}
                        />
                    </div>

                    {/* <button type='submit'>Submit</button> */}
                </form>
            </div>
            <RightBody
                handleExternalSubmit={handleExternalSubmit}
                onSubmit={onSubmit}
                getValues={getValues}
                handleCreateOrderCOD={handleCreateOrderCOD}
            />
        </div>
    );
}

export default Checkout;
