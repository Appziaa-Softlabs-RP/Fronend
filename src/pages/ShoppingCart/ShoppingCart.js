import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartSummery } from "../../Components/CartSummery/CartSummery";
import { DeliveryAddress } from "../../Components/DeliveryAddress/DeliveryAddress";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { LoginPopup } from "../../Components/LoginPopup/LoginPopup";
import { OrderSummery } from "../../Components/OrderSummery/OrderSummery";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductListCard } from "../../Components/ProductListCard/ProductListCard";
import { BuildingIcon, TimeIcon } from "../../Components/siteIcons";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import styles from "./ShoppingCart.module.css";

export const ShoppingCart = () => {
  const appData = useApp();
  const windowWidth = appData.appData.windowWidth;
  const [cartData, setCartData] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [loginPop, setLoginPop] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  const [cartPriceTotal, setCartPriceTotal] = useState({
    price: 0,
    discount: 0,
    subTotal: 0,
    delivery: 0,
    saving: 0,
    deliveryUpTo: 0,
  });
  const [orderStatus, setOrderStatus] = useState("Cart");
  const [shopcartID, setShopCartId] = useState("");
  const [applicableOffers, setApplicableOffers] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);
  const [selectedOfferProductId, setSelectedOfferProductId] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);
  const navigate = useNavigate();

  const setCartTotal = (cartData) => {
    let allTotal = 0,
      allSaving = 0,
      allPrice = 0;

    cartData.forEach((item) => {
      const itemPrice = item.is_hot_deals
        ? item.deal_price
        : item.selling_price !== item.mrp
          ? item.selling_price
          : item.mrp;

      const qtyTotal = item.quantity * itemPrice;
      allTotal += qtyTotal;
      const saveTotal = (item.mrp - itemPrice) * item.quantity;
      allSaving += saveTotal;
    });

    allPrice = allTotal + allSaving;

    setCartPriceTotal((prevCartPriceTotal) => ({
      ...prevCartPriceTotal,
      saving: allSaving,
      subTotal: allTotal,
      prevTotal: allTotal,
      price: allPrice,
    }));

    if (userInfo.customer_id) {
      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userInfo.customer_id,
        sub_total: allTotal,
      };
      ApiService.getDeliveryCost(payload)
        .then((res) => {
          if (res.message === "Delivery Details.") {
            const deliveryCost = res.payload_deliveryCharge.delivery_charge;
            const deliveryUpToCost = res.payload_deliveryCharge.delivery_upto;
            setCartPriceTotal((prevCartPriceTotal) => ({
              ...prevCartPriceTotal,
              delivery: deliveryCost,
              deliveryUpTo: deliveryUpToCost,
            }));
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const fetchTokenAmount = useCallback(() => {
    const validationPayload = {
      company_id: parseInt(enviroment.COMPANY_ID),
      amount: cartPriceTotal.subTotal,
    };

    ApiService.validateCompanyTokenAmount(validationPayload)
      .then((res) => {
        setTokenAmount(res?.token_amount || 0);
      })
      .catch((err) => {
        console.error("Error fetching token amount:", err);
        setTokenAmount(0);
      });
  }, [cartPriceTotal.subTotal]);

  useEffect(() => {
    if (cartPriceTotal.subTotal > 0) {
      fetchTokenAmount();
    }
  }, [cartPriceTotal.subTotal, fetchTokenAmount]);

  const placeOrder = () => {
    let cartType = appData.appData.cartSaved;
    if (
      cartType !== false ||
      (userInfo?.customer_id !== undefined && userInfo?.customer_id !== null)
    ) {
      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userInfo?.customer_id,
        cartJson: JSON.stringify(appData?.appData?.cartData),
      };
      ApiService.addMultipleCart(payload)
        .then((res) => {
          if (res.message === "Add successfully.") {
            setOrderStatus("Place Order");
            appData.setAppData({
              ...appData.appData,
              cartSaved: true,
              cartData: res.payload_cartList_items,
              cartCount: res.payload_cartList_items?.length,
              cartID: res.payload_cartList_id,
            });
            localStorage.setItem("cartSaved", true);
            localStorage.setItem("cartID", res.payload_cartList_id);
            localStorage.setItem(
              "cartData",
              JSON.stringify(res.payload_cartList_items)
            );
            setShopCartId(res.payload_cartList_id);
          } else {
            AppNotification(
              "Error",
              res.message || "We are facing issue on shopping cart. Please try later.",
              "danger"
            );
          }
        })
        .catch((err) => {
          AppNotification(
            "Error",
            err.message || "We are facing issue on shopping cart. Please try later.",
            "danger"
          );
        });
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    setCartData(appData?.appData?.cartData);
  }, []);

  useEffect(() => {
    const getValidOffers = () => {
      const payload = {
        store_id: parseInt(enviroment.STORE_ID),
        cart_amount: cartPriceTotal?.subTotal,
      };
      ApiService.applicableOffers(payload)
        .then((res) => {
          // if (res.status == 200) {
          setApplicableOffers(res.offer);
          // }
        })
        .catch((err) => {
          AppNotification(
            "Error",
            "We are facing issue on shopping cart. Please try later.",
            "danger"
          );
        });
    };
    getValidOffers();
  }, [appData?.appData, cartPriceTotal, navigate]);

  useEffect(() => {
    setCartTotal(appData?.appData?.cartData);
    setCartData(appData?.appData?.cartData);
    setUserInfo(appData.appData.user);
  }, [appData, setCartPriceTotal, userInfo]);

  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <React.Fragment>
          <PageHeader title="Personal Cart" hide={true} />
          {
            cartPriceTotal.subTotal > 0 &&
            <h1 className={`${styles.cartTitle} col-12 px-3 mt-3 d-inline-flex`}>
              My Cart ({appData?.appData?.cartCount})
            </h1>
          }
          {orderStatus === "Cart" ? (
            <React.Fragment>
              {cartData?.length ? (
                <React.Fragment>
                  <div className="d-inline-flex col-12 flex-column py-3">
                    {cartData?.map((item, index) => {
                      return (
                        <ProductListCard
                          offers={applicableOffers}
                          setSelectedOfferProductId={setSelectedOfferProductId}
                          selectedOfferId={selectedOfferId}
                          setSelectedOfferId={setSelectedOfferId}
                          setOrderStatus={setOrderStatus}
                          Product={item}
                          key={index}
                          index={index}
                        />
                      );
                    })}
                  </div>
                  <div
                    className={`${styles.checkoutBox} col-12 justify-content-between p-3 d-inline-flex align-items-center`}
                  >
                    <div
                      className={`col-5 d-inline-flex flex-column align-items-start gap-2`}
                    >
                      <span
                        className={`${styles.totalAmtLabel} d-inline-flex col-12 p-0`}
                      >
                        Total ₹{cartPriceTotal.subTotal}
                      </span>
                      <span
                        className={`${styles.totalAmtLabel} d-inline-flex col-12 p-0`}
                      >
                        Saved ₹{cartPriceTotal.saving}
                      </span>
                    </div>
                    <button
                      aria-label="Place Order"
                      className={`${styles.checkoutBtn} d-inline-flex align-items-center justify-content-center col-6 text-uppercase`}
                      onClick={() => placeOrder()}
                    >
                      Place Order
                    </button>
                  </div>
                </React.Fragment>
              ) : (
                <div
                  className={`${styles.emptyProduct} d-inline-flex align-items-center justify-content-center flex-column gap-4 col-12 p-4`}
                >
                  {cartPriceTotal?.subTotal >= 0 && (
                    <div
                      className={`${styles.emtpyCartText} col-12 d-inline-flex align-items-center justify-content-center p-5`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#000",
                          textAlign: "center",
                        }}
                      >
                        Your cart is empty
                      </p>
                      <Link to="/">
                        <button className={`${styles.shoppingBtn}`}>Continue Shopping</button>
                      </Link>
                      <p style={{
                        fontSize: "0.8rem",
                        marginTop: "20px",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                      }}>
                        <span style={{
                          fontSize: "1rem",
                        }}>Have an account?</span>
                        <span style={{
                          display: "flex",
                          flexDirection: "row",
                        }}>
                          <span
                            className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                            role="button"
                          >
                            <Link to='/login' className={`${styles.supportText} d-inline-flex m-1`} style={{
                              color: "black",
                              textDecoration: "underline",
                            }}>
                              Log in
                            </Link>
                          </span>{" "}
                          <span className="my-1">
                            to checkout faster
                          </span>
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="d-inline-flex col-12 flex-column py-3">
                {cartData.length &&
                  cartData.map((item, index) => {
                    return (
                      <ProductListCard
                        Product={item}
                        key={index}
                        index={index}
                        hideQty={true}
                      />
                    );
                  })}
              </div>
              <DeliveryAddress
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                selectedOfferProductId={selectedOfferProductId}
                selectedOfferId={selectedOfferId}
                cartPriceTotal={cartPriceTotal}
                setCartPriceTotal={setCartPriceTotal}
                shopcartID={shopcartID}
                setOrderStatus={setOrderStatus}
                tokenAmount={tokenAmount}
              />
              {
                cartPriceTotal.subTotal > 0 &&
                <OrderSummery cartPriceTotal={cartPriceTotal} tokenAmount={tokenAmount} paymentType={paymentType} />
              }
              <div className={`${styles.cancelPolicyBox} col-12 mt-3 p-3`}>
                <h5
                  className={`${styles.policyHeader} col-12 d-inline-flex mb-3`}
                >
                  Cancelation Policy
                </h5>
                <div className="col-12 d-inline-flex flex-column mt-2 gap-3">
                  <div
                    className={`${styles.cancelPolicydesc} col-12 d-inline-flex align-items-start p-0 gap-2`}
                  >
                    <TimeIcon color="#007BFF" />
                    <p className="d-inline-block mb-0">
                      Orders cannot be canceled and are non refundable once out
                      for delivery.
                    </p>
                  </div>
                  <div
                    className={`${styles.cancelPolicydesc} col-12 d-inline-flex align-items-start p-0 gap-2`}
                  >
                    <BuildingIcon color="#007BFF" />
                    <p className="d-inline-block mb-0">
                      In case of unavailability of products or service related
                      issues, a full refund will be provided.
                    </p>
                  </div>
                </div>
              </div>
              {loginPop === true && <LoginPopup setLoginPop={setLoginPop} />}

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
                  {orderStatus === "Cart" ? (
                    <>
                      <CartSummery
                        setSelectedOfferProductId={setSelectedOfferProductId}
                        selectedOfferId={selectedOfferId}
                        setSelectedOfferId={setSelectedOfferId}
                        setOrderStatus={setOrderStatus}
                        cartData={cartData}
                        offers={applicableOffers}
                        setShopCartId={setShopCartId}
                        setCartPriceTotal={setCartPriceTotal}
                      />
                    </>
                  ) : orderStatus === "Place Order" ? (
                    <DeliveryAddress
                      paymentType={paymentType}
                      setPaymentType={setPaymentType}
                      selectedOfferProductId={selectedOfferProductId}
                      selectedOfferId={selectedOfferId}
                      cartPriceTotal={cartPriceTotal}
                      setCartPriceTotal={setCartPriceTotal}
                      shopcartID={shopcartID}
                      setOrderStatus={setOrderStatus}
                      tokenAmount={tokenAmount}
                    />
                  ) : null}
                </div>
                <div className="col-3 flex-shrink-0">
                  {
                    cartPriceTotal.subTotal > 0 &&
                    <OrderSummery cartPriceTotal={cartPriceTotal} tokenAmount={tokenAmount} paymentType={paymentType} />
                  }
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};