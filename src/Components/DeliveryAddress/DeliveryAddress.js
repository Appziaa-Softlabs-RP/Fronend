import React, { useEffect, useState, useCallback  } from 'react';
import styles from './DeliveryAddress.module.css';
import { DeleteIcon, EditIcon, LocationIcon } from '../siteIcons';
import { enviroment } from '../../enviroment';
import { useApp } from '../../context/AppContextProvider';
import ApiService from '../../services/ApiService';
import { useNavigate } from 'react-router-dom';
import { AppNotification } from '../../utils/helper';
import { AddAddressPopup } from '../AddAddressPopup/AddAddressPopup';
import useRazorpay from "react-razorpay";


const AddressDelivery = ({ allAddress, setCheckoutType, checkoutType, setAddressId, setAddressSaved, setSelectAddrDetail }) => {
    const navigate = useNavigate();
    const [selectAddress, setSelectAddress] = useState({});
    const [openAdressPop, setOpenAdressPop] = useState(false);
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    const editAddress = (id) => {
        navigate('/add-new-address', { state: { addressEdit: true, addressId: id, routePopup: true } });
    }

    const chooseSelectAddr = () => {
        if (Object.keys(selectAddress).length === 0) {
            AppNotification('Error', 'Please choose an address to proceed', 'danger');
        } else {
            setCheckoutType('Payment');
        }
    }

    const seletThisAddress = (e, item, addrId) => {
        setSelectAddress(item);
        setSelectAddrDetail(item);
        setAddressId(addrId);
    }

    const addNewAddress = () => {
        setOpenAdressPop(true);
    }

    return (
        <div className={`${styles.deliveryBox} col-12 d-inline-flex flex-column mb-2`}>
            <div className={`${styles.cartTitle} col-12 d-inline-flex align-items-center justify-content-between`}>
                <h2 className={`${styles.myCartTitle} d-inline-flex align-items-center gap-2`}>
                    <LocationIcon color="#000" />
                    Select Delivery Address
                </h2>
                {checkoutType === 'Payment' &&
                    <span role="button" className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`} onClick={() => setCheckoutType('Address')}>Change</span>
                }
            </div>
            {checkoutType === 'Address' &&
                <div className='col-12 d-inline-flex flex-column'>
                    <div className='col-12 d-inline-flex justify-content-end p-3'>
                        <span onClick={() => addNewAddress()} role="button" className={`${styles.addAddressBtn} d-inline-flex align-items-center px-4`}>Add New Address</span>
                    </div>
                    {allAddress?.length > 0 &&
                        <React.Fragment>
                            <div className="col-12 d-inline-flex flex-wrap p-3">
                                {allAddress?.map((item, idx) => {
                                    return (
                                        <div className={`${windowWidth === 'mobile' ? 'col-12' : 'col-6'} p-3`} key={idx}>
                                            <div className={`${styles.addedAdres} col-12 p-3 ps-5 rounded d-inline-flex flex-column position-relative`} role="button" onClick={(e) => seletThisAddress(e, item, item.address_id)}>
                                                <input className={`${styles.deliveryRadio} position-absolute d-inline-block`} id={`delivery${idx}`} type="radio" name="delivery" />
                                                <label className={`col-10 d-inline-flex flex-column`} htmlFor={`delivery${idx}`} role="button">
                                                    <h6 className={`${styles.addressName} col-12 d-inline-flex align-items-center flex-wrap gap-2 mb-1`}>{item.name}<span className={`${styles.addressTag} d-inline-flex align-items-center px-1`}>{item.address_type}</span></h6>
                                                    <label className={`${styles.addressdetail} col-12 d-inline-flex mb-0`}>{item?.contact}</label>
                                                    <label className={`${styles.addressdetail} col-12 d-inline-flex mb-0`}>{item.house_no}, {item?.street}, {item?.city}, {item?.state} - {item.pincode}</label>
                                                </label>
                                                <div className="position-absolute p-3 top-0 end-0 d-inline-flex justify-content-end gap-3">
                                                    <span role="button" className={`${styles.deleteBtn} d-inline-flex align-items-center px-2`}><DeleteIcon /></span>
                                                    <span role="button" onClick={() => editAddress(item.address_id)} className={`${styles.editBtn} d-inline-flex align-items-center px-2`}><EditIcon color="#FF0000" /></span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className={`${styles.placeOrderBtnBox} col-12 p-3 d-inline-flex align-items-center justify-content-end`}>
                                <span role="button" className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`} onClick={() => chooseSelectAddr()}>Proceed</span>
                            </div>
                        </React.Fragment>
                    }
                </div>
            }
            {checkoutType === 'Payment' &&
                <div className={`col-12 d-inline-flex flex-column ${windowWidth === 'mobile' ? 'p-2' : 'p-4'}`}>
                    <div className={`col-12 p-3 rounded d-inline-flex flex-column position-relative`} role="button">
                        <label className={`col-10 d-inline-flex flex-column`} role="button">
                            <label className={`${styles.addressdetail} col-12 d-inline-flex align-items-center flex-wrap mb-1`}><span className={`${windowWidth === 'mobile' ? 'col-3' : 'col-1'}`}>Name:&nbsp;</span><b>{selectAddress.name}</b></label>
                            <label className={`${styles.addressdetail} col-12 d-inline-flex mb-1`}><span className={`${windowWidth === 'mobile' ? 'col-3' : 'col-1'}`}>Mobile:&nbsp;</span><b>{selectAddress?.contact}</b></label>
                            <label className={`${styles.addressdetail} col-12 d-inline-flex mb-1`}><span className={`${windowWidth === 'mobile' ? 'col-3' : 'col-1'}`}>Address:&nbsp;</span><b>{selectAddress.house_no}, {selectAddress?.street}, {selectAddress?.city}, {selectAddress?.state} - {selectAddress.pincode}</b></label>
                        </label>
                    </div>
                </div>
            }
            {openAdressPop === true &&
                <AddAddressPopup setOpenAdressPop={setOpenAdressPop} setAddressSaved={setAddressSaved} />
            }
        </div>
    )
}

const PaymentMode = ({ checkoutType, userInfo, addressId, shopcartID, cartPriceTotal, selectAddrDetail }) => {
    const [paymentType, setPaymentType] = useState(null);
    const navigate = useNavigate();
    const appData = useApp();
    const [Razorpay, isLoaded] = useRazorpay();

    const selectPaymentMode = (type) => {
        setPaymentType(type);
    }

    const createOrderId = (payload) => {
        ApiService.onlinePaymentProcess(payload).then((res) => {
            if (res.message === 'Online payment process successfully.') {
                handlePayment(res.payload_onlinePaymentProcess.order_id);
            } else {
                AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
            }
        }).catch((err) => {
            AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
        });
    }

    const handlePayment = useCallback((orderId) => {
        //const order = createOrder(params);
        
        let finalAmount = cartPriceTotal.subTotal + cartPriceTotal.delivery;
        const options = {
            key: 'rzp_live_JaHAb0V5w6ZxfC',
            amount: finalAmount,
            currency: "INR",
            name: enviroment.BUSINESS_NAME,
            description: "Order Purchase",
            image: "https://ashielectronics.com/favicon.ico",
            order_id: orderId,
            handler: (res) => {
                onlinePaymentSuccess(orderId,res.razorpay_payment_id, res.razorpay_order_id);
            },
            prefill: {
                name: selectAddrDetail?.name,
                email: selectAddrDetail?.email,
                contact: selectAddrDetail?.contact,
            },
            notes: {
                address: enviroment.STORE_ADDRESS,
            },
            theme: {
                color: enviroment.PRIMARY_COLOR,
            },
        };
    
        const rzpay = new Razorpay(options);
        rzpay.open();
    }, [Razorpay]);

    const onlinePaymentSuccess = (orderId, transID) => {
        const payload = {
            company_id: parseInt(enviroment.COMPANY_ID),
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo.customer_id,
            order_id:orderId,
            transection_id:transID,
            cart_id: shopcartID
        }
        ApiService.onlinePaymentSuccess(payload).then((res) => {
            if (res.message == 'Online payment successfully.') {
                AppNotification('Success', 'Your order has been placed successfully', 'success');
                let emptyCartData = [];
                appData.setAppData({ ...appData.appData, cartData: emptyCartData, cartCount: 0 });
                localStorage.setItem('cartData', JSON.stringify(emptyCartData));
                navigate('/my-orders');
            } else {
                AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
            }
        }).catch((err) => {
            AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
        });
    }

    const proceedPayment = () => {
        if (paymentType === '' || paymentType === null || paymentType === undefined) {
            AppNotification('Error', "Please select payment type", 'danger');
        } else {
            let finalAmount = cartPriceTotal.subTotal + cartPriceTotal.delivery;
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userInfo.customer_id,
                address_id: addressId,
                total_paid_amount: finalAmount,
                total_saving: cartPriceTotal.saving,
                deliveryCharge: cartPriceTotal.delivery,
                paymentmode: paymentType,
                cart_id: shopcartID,
                slot_id: 1,
                couponValue: 0,
                couponcode: '',
                slot_date: new Date(),
            }
            if(paymentType === 'cash'){
                ApiService.cashOnDelivery(payload).then((res) => {
                    if (res.message === 'Cash on delivery successfully.') {
                        AppNotification('Success', 'Your order has been placed successfully', 'success');
                        let emptyCartData = [];
                        appData.setAppData({ ...appData.appData, cartData: emptyCartData, cartCount: 0 });
                        localStorage.setItem('cartData', JSON.stringify(emptyCartData));
                        navigate('/my-orders');
                    } else {
                        AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
                    }
                }).catch((err) => {
                    AppNotification('Error', 'We are un-able to place your order. Please try later.', 'danger');
                });
            }else {
                createOrderId(payload);
            }
        }
    }

    return (
        <div className={`${styles.deliveryBox} col-12 d-inline-flex flex-column`}>
            <h2 className={`${styles.cartTitle} col-12 p-3 d-inline-flex align-items-center gap-2 mb-0`}>
                ₹  Select Payment Mode
            </h2>
            {checkoutType === 'Payment' &&
                <div className='col-12 d-inline-flex flex-column'>
                    <div className='col-12 d-inline-flex flex-column gap-3 px-5 py-4'>
                        <div className='col-12 d-inline-flex'>
                            <label className={`${styles.paymentRadio} d-inline-flex align-items-center gap-2 position-relative px-3`} htmlFor="cash" role="button" onClick={() => selectPaymentMode('cash')}>
                                <input className={`${styles.deliveryRadio} position-absolute d-inline-block`} type="radio" id="cash" name="paymentmode" />
                                <span className={`${styles.radioText} d-inline-flex`}>Cash on Delivery</span>
                            </label>
                        </div>
                        <div className='col-12 d-inline-flex'>
                            <label className={`${styles.paymentRadio} d-inline-flex align-items-center gap-2 position-relative px-3`} htmlFor="online" role="button" onClick={() => selectPaymentMode('online')}>
                                <input className={`${styles.deliveryRadio} position-absolute d-inline-block`} type="radio" id="online" name="paymentmode" />
                                <span className={`${styles.radioText} d-inline-flex`}>Online Payment Options</span>
                            </label>
                        </div>
                    </div>
                    <div className={`${styles.payBtnBox} col-12 d-inline-flex p-3 justify-content-end`}>
                        <span onClick={() => proceedPayment()} role="button" className={`${styles.payOrderBtn} d-inline-flex align-items-center px-3`}> PLACE ORDER (₹{cartPriceTotal.subTotal + cartPriceTotal.delivery})</span>
                    </div>
                </div>
            }
        </div>
    )
}

export const DeliveryAddress = ({ cartPriceTotal, shopcartID, setOrderStatus }) => {
    const appData = useApp();
    const [allAddress, setAllAddress] = useState([]);
    const [addressSaved, setAddressSaved] = useState(false);
    const [checkoutType, setCheckoutType] = useState('Address');
    const userInfo = appData.appData.user;
    const [addressId, setAddressId] = useState('');
    const [selectAddrDetail, setSelectAddrDetail] = useState({});

    const getAllAdress = () => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo?.customer_id
        }
        ApiService.addressList(payload).then((res) => {
            if (res.message === "Address list successfully") {
                setAllAddress(res?.payload_addressList);
                setAddressSaved(false);
            }
        }).catch((err) => {

        });
    }

    const changeProducts = () => {
        setOrderStatus('Cart');
    }

    useEffect(() => {
        getAllAdress();
    }, []);

    useEffect(() => {
        if (addressSaved === true) {
            getAllAdress();
        }
    }, [addressSaved]);

    return (
        <React.Fragment>
            <div className={`${styles.cartSummryBox} col-12 d-inline-flex align-items-center justify-content-between mb-2`}>
                <h1 className={`${styles.myCartTitle} d-inline-flex`}>My Cart ({appData?.appData?.cartCount})</h1>
                <span role="button" className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`} onClick={() => changeProducts()}>Change</span>
            </div>
            <AddressDelivery allAddress={allAddress} setCheckoutType={setCheckoutType} checkoutType={checkoutType} setAddressId={setAddressId} setAddressSaved={setAddressSaved} setSelectAddrDetail={setSelectAddrDetail} />
            <PaymentMode checkoutType={checkoutType} userInfo={userInfo} addressId={addressId} shopcartID={shopcartID} cartPriceTotal={cartPriceTotal} selectAddrDetail={selectAddrDetail} />
        </React.Fragment>
    );
}