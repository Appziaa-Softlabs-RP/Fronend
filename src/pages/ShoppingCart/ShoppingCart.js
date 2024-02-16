import React, { useEffect, useState } from "react";
import styles from './ShoppingCart.module.css';
import { CartSummery } from "../../Components/CartSummery/CartSummery";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { OrderSummery } from "../../Components/OrderSummery/OrderSummery";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { DeliveryAddress } from "../../Components/DeliveryAddress/DeliveryAddress";
import ApiService from "../../services/ApiService";
import { enviroment } from "../../enviroment";
import { ProductListCard } from "../../Components/ProductListCard/ProductListCard";
import { AppNotification } from "../../utils/helper";
import { useNavigate } from "react-router-dom";

export const ShoppingCart = () => {
    const appData = useApp();
    const windowWidth = appData.appData.windowWidth;
    const [cartData, setCartData] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const [checkoutSaving, setCheckoutSaving] = useState(0);
    const [deliveryCost, setDelivryCost] = useState(0);
    const [orderStatus, setOrderStatus] = useState('Cart');
    const [shopcartID, setShopCartId] = useState('');
    const navigate = useNavigate();

    const setCartTotal = (cartData) => {
        let allTotal = 0;
        let allSaving = 0;
        if (cartData?.length) {
            cartData?.map((item) => {
                let qtyTotal = item?.quantity * item?.selling_price;
                allTotal = allTotal + qtyTotal;
                let saveTotal = item?.mrp - item?.selling_price;
                allSaving = allSaving + saveTotal;
            });
            setCheckoutTotal(allTotal);
            setCheckoutSaving(allSaving);

            if(userInfo?.customer_id !== undefined && userInfo?.customer_id !== null){
                const payload = {
                    company_id: parseInt(enviroment.COMPANY_ID),
                    store_id: parseInt(enviroment.STORE_ID),
                    customer_id: userInfo?.customer_id,
                    sub_total: allTotal
                }
                ApiService.getDeliveryCost(payload).then((res) => {
                    if (res.message === "Delivery Details.") {
                        setDelivryCost(res?.payload_deliveryCharge?.delivery_charge);
                    }
                }).catch((err) => {
        
                });
            }
        }
    }

    const placeOrder = () => {
        let cartType = appData.appData.cartSaved;
        if(cartType !== false || userInfo?.customer_id !== undefined && userInfo?.customer_id !== null){
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userInfo?.customer_id,
                cartJson: JSON.stringify(appData?.appData?.cartData)
            }
            ApiService.addMultipleCart(payload).then((res) => {
                if(res.message === "Add successfully."){
                    setOrderStatus('Place Order');
                    appData.setAppData({ ...appData.appData, cartSaved: true, cartData: res.payload_cartList, cartCount: res.payload_cartList?.length  });
                    localStorage.setItem('cartSaved', true);
                    localStorage.setItem('cartData', JSON.stringify(res.payload_cartList));
                    setShopCartId(res.payload_cartList[0].cart_id);
                }else{
                    AppNotification('Error', 'We are facing issue on shopping cart. Please try later.','error');
                }
            }).catch((err) => {
                AppNotification('Error', 'We are facing issue on shopping cart. Please try later.','error');
            });
        }else{
            navigate('/login');  
        }
    }

    useEffect(() => {
        setCartData(appData?.appData?.cartData);
        setCartTotal(appData?.appData?.cartData);
    }, []);

    useEffect(() => {
        setCartTotal(appData?.appData?.cartData);
        setUserInfo(appData.appData.user);
    }, [appData?.appData]);
    return (
        <React.Fragment>
            {windowWidth === "mobile" ? (
                <React.Fragment>
                    <PageHeader title="Personal Cart" hide={true} />
                    <h1 className={`${styles.cartTitle} col-12 px-3 mt-3 d-inline-flex`}>My Cart ({appData?.appData?.cartCount})</h1>
                    {orderStatus === 'Cart' ? (
                        <React.Fragment>
                            <div className="d-inline-flex col-12 flex-column py-3">
                                {cartData.length && cartData.map((item, index) => {
                                    return (
                                        <ProductListCard Product={item} key={index} index={index} />
                                    )
                                })}
                            </div>
                            <div className={`${styles.checkoutBox} col-12 justify-content-between p-3 d-inline-flex align-items-center`}>
                                <div className={`col-5 d-inline-flex flex-column align-items-start gap-2`}>
                                    <span className={`${styles.totalAmtLabel} d-inline-flex col-12 p-0`}>Total ₹{checkoutTotal}</span>
                                    <span className={`${styles.totalAmtLabel} d-inline-flex col-12 p-0`}>Saved ₹{checkoutSaving}</span>
                                </div>
                                <button className={`${styles.checkoutBtn} d-inline-flex align-items-center justify-content-center col-6 text-uppercase`} onClick={() => placeOrder()}>Place Order</button>
                            </div>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <div className="d-inline-flex col-12 flex-column py-3">
                                {cartData.length && cartData.map((item, index) => {
                                    return (
                                        <ProductListCard Product={item} key={index} index={index} hideQty={true} />
                                    )
                                })}
                            </div>
                            <DeliveryAddress checkoutTotal={checkoutTotal} checkoutSaving={checkoutSaving} deliveryCost={deliveryCost} shopcartID={shopcartID} />
                            <OrderSummery checkoutTotal={checkoutTotal} checkoutSaving={checkoutSaving} deliveryCost={deliveryCost} />
                        </React.Fragment>
                    )}
                    <Footer />
                </React.Fragment>
            ) : (
                <React.Fragment>
                    <Header />
                    <div className="col-12 d-inline-flex my-5">
                        <div className="container d-inline-flex">
                            <div className="col-12 d-inline-flex gap-5 align-items-start">
                                <div className="col-9 flex-shrink-1">
                                    {orderStatus === 'Cart' ? (
                                        <CartSummery setOrderStatus={setOrderStatus} cartData={cartData} setShopCartId={setShopCartId} />
                                    ) : orderStatus === 'Place Order' ? (
                                        <DeliveryAddress checkoutTotal={checkoutTotal} checkoutSaving={checkoutSaving} deliveryCost={deliveryCost} shopcartID={shopcartID} />
                                    ) : null}
                                </div>
                                <div className="col-3 flex-shrink-0">
                                    <OrderSummery checkoutTotal={checkoutTotal} checkoutSaving={checkoutSaving} deliveryCost={deliveryCost} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </React.Fragment>
            )}
        </React.Fragment>
    )
}