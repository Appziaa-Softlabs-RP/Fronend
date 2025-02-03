import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { DeleteIcon } from "../siteIcons";
import { LoginPopup } from "../LoginPopup/LoginPopup";
import styles from './CartSummery.module.css';

export const CartSummery = ({ cartData, setOrderStatus, setShopCartId }) => {
    const appData = useApp();
    const navigate = useNavigate();
    const [loginPop, setLoginPop] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [cartSummryData, setCartSummyData] = useState(cartData);

    const showProductDetail = (slug) => {
        window.location.href = `/product/${slug}`;
    }

    const updateProdQty = (e, prodID, allowQty, currQty, type, stock) => {
        e.preventDefault();
        let cartInfo = appData?.appData?.cartData;
        let cartProdID = cartInfo.findIndex((obj) => obj.product_id === prodID);
        if (type === 'plus') {
            if (currQty === allowQty) {
                AppNotification('Error', 'You have reached the product quantity limit.', 'danger');
            } else {
                let newQty = currQty + 1;
                if (stock >= newQty) {
                    cartInfo[cartProdID].quantity = newQty;
                } else {
                    AppNotification('Error', 'You have reached the product quantity limit.', 'danger');
                }
            }
        } else {
            let newQty = currQty - 1;
            if (newQty === 0) {
                let cartID = appData.appData.cartID;
                if (appData.appData.cartSaved === true && cartID !== null && cartID != undefined) {
                    const payload = {
                        store_id: parseInt(enviroment.STORE_ID),
                        customer_id: userInfo.customer_id,
                        cart_id: cartID,
                        product_id: prodID
                    }
                    ApiService.removeCart(payload).then((res) => {
                        AppNotification('Success', 'Product removed from cart successfully', 'success');
                    }).catch((err) => {
                        AppNotification('Error', 'Unable to remove the product from cart successfully', 'danger');
                    });
                }
                let newCartInfo = cartInfo.filter((obj) => obj.product_id !== prodID);
                cartInfo = newCartInfo;
            } else {
                cartInfo[cartProdID].quantity = newQty;
            }
        }
        appData.setAppData({ ...appData.appData, cartData: cartInfo, cartCount: cartInfo?.length });
        localStorage.setItem('cartData', JSON.stringify(cartInfo));
        e.stopPropagation();
    }

    const removeThisProd = (id) => {
        let cartInfo = appData?.appData?.cartData;
        if (appData.appData.cartSaved === true) {
            let cartID = appData.appData.cartID;
            if (appData.appData.cartSaved === true && cartID !== null && cartID != undefined) {
                const payload = {
                    store_id: parseInt(enviroment.STORE_ID),
                    customer_id: userInfo.customer_id,
                    cart_id: cartID,
                    product_id: id
                }
                ApiService.removeCart(payload).then((res) => {
                    AppNotification('Success', 'Product removed from cart successfully', 'success');
                }).catch((err) => {
                    AppNotification('Error', 'Unable to remove the product from cart successfully', 'danger');
                });
            }
        }
        let newCartInfo = cartInfo.filter((obj) => obj.product_id !== id);
        cartInfo = newCartInfo;
        appData.setAppData({ ...appData.appData, cartData: cartInfo, cartCount: cartInfo?.length });
        localStorage.setItem('cartData', JSON.stringify(cartInfo));
    }

    const placeOrder = () => {
        let cartType = appData.appData.cartSaved;
        if (cartType !== false || userInfo?.customer_id !== undefined && userInfo?.customer_id !== null) {
            const payload = {
                company_id: parseInt(enviroment.COMPANY_ID),
                store_id: parseInt(enviroment.STORE_ID),
                customer_id: userInfo?.customer_id,
                cartJson: JSON.stringify(appData?.appData?.cartData)
            }
            ApiService.addMultipleCart(payload).then((res) => {
                if (res.message === "Add successfully.") {
                    setOrderStatus('Place Order');
                    appData.setAppData({ ...appData.appData, cartSaved: true, cartData: res.payload_cartList_items, cartCount: res.payload_cartList_items?.length, cartID: res.payload_cartList_id });
                    localStorage.setItem('cartID', res.payload_cartList_id);
                    localStorage.setItem('cartSaved', true);
                    localStorage.setItem('cartData', JSON.stringify(res.payload_cartList_items));
                    setShopCartId(res.payload_cartList_id);
                } else {
                    AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
                }
            }).catch((err) => {
                AppNotification('Error', 'We are facing issue on shopping cart. Please try later.', 'error');
            });
        } else {
            setLoginPop(true);
        }
    }

    useEffect(() => {
        setCartSummyData(appData?.appData?.cartData);
        setUserInfo(appData.appData.user);
    }, [appData?.appData]);

    return (
        <React.Fragment>
            <div className={`${styles.cartSummryBox} col-12 d-inline-flex flex-column`}>
                <h1 className={`${styles.cartTitle} col-12 p-3 d-inline-flex`}>My Cart ({appData?.appData?.cartCount})</h1>
                <div className="col-12 d-inline-flex flex-column">
                    <div className="col-12 d-inline-flex align-items-center p-2">
                        <label className={`${styles.detailTitle} d-inline-flex col-3`}>Item Descriptions</label>
                        <label className={`${styles.detailTitle} d-inline-flex col-2`}>Unit Price</label>
                        <label className={`${styles.detailTitle} d-inline-flex col-2`}>Quantity</label>
                        <label className={`${styles.detailTitle} d-inline-flex col-2`}>SubTotal</label>
                        <label className={`${styles.detailTitle} d-inline-flex col-2`}>Savings</label>
                        <label className={`${styles.detailTitle} d-inline-flex col-1`}></label>
                    </div>
                    {cartSummryData?.length > 0 && cartSummryData?.map((item, idx) => {
                        return (
                            <div className={`${styles.cartDataBox} col-12 d-inline-flex align-items-center p-2`} key={idx}>
                                <div className="d-inline-flex align-items-center col-3 gap-1" onClick={() => showProductDetail(item.name_url)}>
                                    <span className={`${styles.itemImage} d-inline-flex flex-shrink-0`}>
                                        <img src={item?.image} alt={item?.product_name} />
                                    </span>
                                    <span className={`${styles.productName}`}>{item?.product_name}</span>
                                </div>
                                <div className="col-2 d-inline-flex flex-column">
                                    <span className={`${styles.productPrice} d-inline-flex`}>₹{item.selling_price}</span>
                                    {item.selling_price !== item.mrp &&
                                        <del className={`${styles.productMrpPrice} d-inline-flex`}>₹{item?.mrp}</del>
                                    }
                                </div>
                                <div className="col-2 d-inline-flex align-items-center">
                                    <span role="button" onClick={(e) => updateProdQty(e, item.product_id, item.no_of_quantity_allowed, item.quantity, 'minus', item?.stock)} className={`${styles.decrease_btn} ${styles.minusIcon} d-inline-flex align-items-center justify-content-center`}>-</span>
                                    <span className="d-inline-flex flex-shrink-0">
                                        <input type="text" readOnly value={item.quantity} className={`${styles.countValue} d-inline-block text-center`} />
                                    </span>
                                    <span role="button" onClick={(e) => updateProdQty(e, item.product_id, item.no_of_quantity_allowed, item.quantity, 'plus', item?.stock)} className={`${styles.increase_btn} ${styles.plusIcon} d-inline-flex align-items-center justify-content-center`}>+</span>
                                </div>
                                <div className="col-2 d-inline-flex flex-column">
                                    <span className={`${styles.productPrice} d-inline-flex`}>₹{parseFloat(item.selling_price * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="col-2 d-inline-flex flex-column">
                                    <span className={`${styles.savingPrice} d-inline-flex`}>₹{parseFloat((item.mrp - item.selling_price) * item.quantity).toFixed(2)}</span>
                                </div>
                                <div className="col-1 d-inline-flex flex-column">
                                    <span className={`${styles.removeProd} d-inline-flex`} role="button" onClick={() => removeThisProd(item.product_id)}>
                                        <DeleteIcon color="#FF0000" />
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    {cartSummryData?.length === 0 &&
                        <div className={`${styles.emtpyCartText} col-12 d-inline-flex align-items-center justify-content-center p-5`}>
                            No Product Added into the Cart
                        </div>
                    }
                    {cartSummryData?.length > 0 &&
                        <div className={`${styles.placeOrderBtnBox} col-12 p-3 d-inline-flex align-items-center justify-content-end gap-3`}>
                            <Link to="/" role="button" className={`${styles.continueShop} d-inline-flex align-items-center px-3 text-uppercase text-decoration-none`}>Continue Shopping</Link>
                            <span role="button" className={`${styles.placeOrderBtn} d-inline-flex align-items-center px-3 text-uppercase`} onClick={() => placeOrder()}>Place Order</span>
                        </div>
                    }
                </div>
            </div>
            {loginPop === true &&
                <LoginPopup setLoginPop={setLoginPop} />
            }
        </React.Fragment>
    );
}