import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { DeleteIcon } from "../siteIcons";
import styles from './CartAside.module.css';

export const CartAside = ({ setCartPop }) => {
    const [cartData, setCartData] = useState([]);
    const [checkoutTotal, setCheckoutTotal] = useState(0);
    const appData = useApp();
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();

    const closeDrawer = () => {
        setCartPop(false);
    }

    const showProductDetail = (slug) => {
        window.location.href = (`/product/${slug}`);
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

    const setCartTotal = (cartData) => {
        let allTotal = 0;
        if (cartData?.length) {
            cartData?.map((item) => {
                let qtyTotal = item?.quantity * item?.selling_price;
                allTotal = allTotal + qtyTotal;
            });
            setCheckoutTotal(allTotal);
        }
    }

    const showCheckoutPage = () => {
        navigate('/checkout');
        closeDrawer();
    }

    useEffect(() => {
        setCartData(appData?.appData?.cartData);
        setCartTotal(appData?.appData?.cartData);
    }, []);

    useEffect(() => {
        setCartData(appData?.appData?.cartData);
        setCartTotal(appData?.appData?.cartData);
        setUserInfo(appData.appData.user);
    }, [appData?.appData]);

    return (
        <React.Fragment>
            <div className={`${styles.cartDrawer} start-0 top-0 position-fixed h-100 col-12 d-inline-block overflow-hidden`}>
                <div className={`${styles.cartDrawerOverlay} start-0 top-0 position-fixed h-100 col-12 d-inline-block`}></div>
                <div className={`${styles.drawerInner} position-absolute h-100 d-inline-flex flex-column`}>
                    <div className={`${styles.drawerHeader} col-12 d-inline-flex justify-content-center position-relative p-0`}>
                        <h2 className={`${styles.drawerHeading} m-0 d-inline-block pt-3 pb-3`}>SHOPPING BAG</h2>
                        <span className={`${styles.drawerClose} position-absolute h-100 d-inline-flex align-items-center p-2 ml-2`} type="button" onClick={() => closeDrawer()}>
                            <svg viewBox="0 0 512 512" height="15"><path d="M25 512a25 25 0 0 1-17.68-42.68l462-462a25 25 0 0 1 35.36 35.36l-462 462A24.93 24.93 0 0 1 25 512z" fill="#000000"></path><path d="M487 512a24.93 24.93 0 0 1-17.68-7.32l-462-462A25 25 0 0 1 42.68 7.32l462 462A25 25 0 0 1 487 512z" fill="#000000"></path></svg>
                        </span>
                    </div>
                    {cartData.length > 0 &&
                        <React.Fragment>
                            <div className={`${styles.drawerContents} col-12 pt-2 pb-4 d-inline-flex flex-column`}>
                                {cartData.map((item, indx) => {
                                    return (
                                        <div className={`${styles.drawerCartItemsWrapper} mb-2 col-12 position-relative d-inline-flex`} key={indx}>
                                            <span className={`${styles.cartItemLink} position-absolute d-inline-block`} onClick={() => showProductDetail(item.name_url)}>
                                                <img src={item?.image} alt={item?.product_name} className="col-12 d-inline-block object-fit-contain" />
                                            </span>
                                            <div className={`${styles.productCartDetails} col-12 d-inline-block`}>
                                                <div onClick={() => showProductDetail(item.product_id)} className={`${styles.cartItemPrice} col-12 p-0 d-inline-flex align-items-start justify-content-between gap-4`}>
                                                    <div className={`flex-grow-1 flex-column d-inline-flex`}>
                                                        <span className={`${styles.cartItemName} d-inline-block col-12 p-0 text-decoration-none`}>{item?.product_name}</span>
                                                        <span className={`${styles.productOption} d-inline-block`}> Qty({item?.quantity})</span>
                                                    </div>
                                                    <span className={`${styles.priceEnd} d-inline-block`}>₹{item?.selling_price}</span>
                                                </div>
                                                <div className={`col-12 p-0 d-inline-flex align-items-center justify-content-between position-relative mt-2`}>
                                                    <div className={`d-inline-flex align-items-center`}>
                                                        <span className={`${styles.quantityButton} flex-shrink-0 d-inline-flex align-items-center justify-content-center`} name="minus" role="button" onClick={(e) => updateProdQty(e, item.product_id, item?.no_of_quantity_allowed, item?.quantity, 'minus', item?.stock)}>
                                                            <svg className="icon iconMinus" fill="none" viewBox="0 0 10 2">
                                                                <path d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor"></path>
                                                            </svg>
                                                        </span>
                                                        <input className={`${styles.quantityInput} flex-shrink-0 d-inline-block text-center`} type="number" value={item.quantity || ''} minLength="1" maxLength="5" />
                                                        <span className={`${styles.quantityButton} flex-shrink-0 d-inline-flex align-items-center justify-content-center`} name="plus" role="button" onClick={(e) => updateProdQty(e, item.product_id, item?.no_of_quantity_allowed, item?.quantity, 'plus', item?.stock)}>
                                                            <svg className="icon iconPlus" fill="none" viewBox="0 0 10 10">
                                                                <path d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor"></path>
                                                            </svg>
                                                        </span>
                                                    </div>
                                                    <span onClick={() => removeThisProd(item.product_id)} role="button" className={`${styles.removeButton}  position-absolute d-inline-flex align-items-center justify-content-center`}>
                                                        <DeleteIcon color="#FF0000" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className={`${styles.drawerFooter} p-3 col-12 d-inline-block`}>
                                <div className={`${styles.totals} col-12 d-inline-flex align-items-center justify-content-between p-0`}>
                                    <h2 className={`${styles.totalsSubtotal} m-0 d-inline-block`}>Subtotal</h2>
                                    <p className={`${styles.totalsSubtotalValue} m-0 d-inline-block`}>₹{checkoutTotal}</p>
                                </div>
                                <small className={`${styles.taxNote} col-12 p-0 mt-2 mb-2 d-inline-block`}>Tax included and shipping calculated at checkout
                                </small>
                                <div className={`${styles.cartCtas} col-12 p-0 d-inline-block`}>
                                    <button className={`${styles.cartCheckoutButton} col-12 p-0 d-inline-flex align-items-center justify-content-center`} onClick={() => showCheckoutPage()}>CHECKOUT</button>
                                </div>
                            </div>
                        </React.Fragment>
                    }

                    {cartData.length === 0 &&
                        <div className={`${styles.drawerContents} ${styles.emptyDrawerContents} position-absolute col-12 pt-2 pb-4 d-inline-flex flex-column align-items-center justify-content-center`}>
                            <div className={`${styles.cartDrawerEmptyContent} d-inline-flex flex-wrap justify-content-center align-content-center`}>
                                <h4 className={`${styles.cartEmptyText} text-center col-12 p-0 mb-4`}>Your cart is empty</h4>
                                <span role="button" onClick={() => closeDrawer()} className={`${styles.continueShop} d-inline-flex align-items-center justify-content-center`}>Continue shopping</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}