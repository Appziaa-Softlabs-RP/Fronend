import React, { useEffect, useState } from "react";
import styles from "./ProductListCard.module.css";
import notAvail from "../../assets/images/image-not-available.jpg";
import { AppNotification } from "../../utils/helper";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import { redirect, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";

export const ProductListCard = ({ Product, index, hideQty }) => {
  const [prodAdded, setProdAdded] = useState(false);
  const [prodAddedQty, setProdAddedQty] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const appData = useApp();
  const navigate = useNavigate();

  let discountOff = "";
  if (Product?.mrp > Product?.selling_price) {
    discountOff =
      ((Product?.mrp - Product?.selling_price) * 100) / Product?.mrp;
    discountOff = Math.ceil(discountOff);
  }

  const showProductDetail = (slug) => {
    window.location.href = `/product/${slug}`;
  };

  const addToCart = (e, item) => {
    e.preventDefault();
    let cartInfo = appData?.appData?.cartData;
    let ProdId = item.product_id ? item.product_id : item?.id;
    let prodName = item?.name;
    let Mrp = item?.mrp;
    let sellingPrice = item?.selling_price;
    let stockQTY = item?.stock;
    let Quantity = 1;
    let noQty = item?.no_of_quantity_allowed;
    let dealType = item?.deal_type ? item?.deal_type : 0;
    let dealId = item?.deal_type_id;

    let cardObj = {
      company_id: parseInt(enviroment.COMPANY_ID),
      store_id: parseInt(enviroment.STORE_ID),
      product_id: ProdId,
      image: item?.image ? item.image : item?.image_url,
      product_name: prodName,
      no_of_quantity_allowed: noQty,
      is_hot_deals: dealType,
      stock: stockQTY,
      mrp: Mrp,
      selling_price: sellingPrice,
      quantity: 1,
      deal_type_id: dealId,
    };
    if (cartInfo === null) {
      cartInfo = [cardObj];
    } else {
      let cartID = cartInfo.findIndex((obj) => obj.product_id === ProdId);
      if (cartID === null || cartID === undefined || cartID === -1) {
        cartInfo.push(cardObj);
      }
    }
    appData.setAppData({
      ...appData.appData,
      cartData: cartInfo,
      cartCount: cartInfo?.length,
    });
    localStorage.setItem("cartData", JSON.stringify(cartInfo));
    AppNotification(
      "Success",
      "Product added into the cart successfully.",
      "success",
    );

    if (appData.appData?.user?.customer_id) {
      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userInfo.customer_id,
        product_id: ProdId,
        product_name: prodName,
        stock: stockQTY,
        mrp: Mrp,
        selling_price: sellingPrice,
        quantity: Quantity,
        no_of_quantity_allowed: noQty,
        is_hot_deals: dealType,
        deal_type_id: dealId,
      };
      ApiService.addToCart(payload)
        .then((res) => {
          if (res?.message === "Add successfully.") {
            appData.setAppData({ ...appData.appData, cartSaved: true });
            localStorage.setItem("cartSaved", true);
            let resCart = res.payload_addTocart;
            let resProdId = resCart.findIndex(
              (obj) => obj.product_id === ProdId,
            );
            let cartID = resCart[resProdId].cart_id;
            let cartProdID = cartInfo.findIndex(
              (obj) => obj.product_id === ProdId,
            );
            cartInfo[cartProdID].cart_id = cartID;

            appData.setAppData({
              ...appData.appData,
              cartData: cartInfo,
              cartCount: cartInfo?.length,
            });
            localStorage.setItem("cartData", JSON.stringify(cartInfo));
          }
        })
        .catch((err) => {
          return err;
        });
    }
    e.stopPropagation();
  };

  const updateProdQty = (e, prodID, allowQty, currQty, type, stock) => {
    e.preventDefault();
    let cartInfo = appData?.appData?.cartData;
    let cartProdID = cartInfo.findIndex((obj) => obj.product_id === prodID);
    if (type === "plus") {
      if (currQty === allowQty) {
        AppNotification(
          "Error",
          "You have reached the product quantity limit.",
          "danger",
        );
      } else {
        let newQty = currQty + 1;
        if (stock >= newQty) {
          cartInfo[cartProdID].quantity = newQty;
        } else {
          AppNotification(
            "Error",
            "You have reached the product quantity limit.",
            "danger",
          );
        }
      }
    } else {
      let newQty = currQty - 1;
      if (newQty === 0) {
        let cartID = appData.appData.cartID;
        if (
          appData.appData.cartSaved === true &&
          cartID !== null &&
          cartID != undefined
        ) {
          const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo.customer_id,
            cart_id: cartID,
            product_id: prodID,
          };
          ApiService.removeCart(payload)
            .then((res) => {
              AppNotification(
                "Success",
                "Product removed from cart successfully",
                "success",
              );
            })
            .catch((err) => {
              AppNotification(
                "Error",
                "Unable to remove the product from cart successfully",
                "danger",
              );
            });
        }
        let newCartInfo = cartInfo.filter((obj) => obj.product_id !== prodID);
        cartInfo = newCartInfo;
      } else {
        cartInfo[cartProdID].quantity = newQty;
      }
    }
    appData.setAppData({
      ...appData.appData,
      cartData: cartInfo,
      cartCount: cartInfo?.length,
    });
    localStorage.setItem("cartData", JSON.stringify(cartInfo));
    e.stopPropagation();
  };

  const checkProdAdded = () => {
    if (appData.appData.cartData?.length) {
      let productID = Product?.product_id ? Product.product_id : Product.id;
      let cartID = appData.appData.cartData.findIndex(
        (obj) => obj.product_id === productID,
      );
      if (cartID !== -1) {
        setProdAdded(true);
        setProdAddedQty(appData.appData.cartData[cartID].quantity);
      } else {
        setProdAdded(false);
        setProdAddedQty(0);
      }
    } else {
      setProdAdded(false);
      setProdAddedQty(0);
    }
  };

  useEffect(() => {
    checkProdAdded();
    setUserInfo(appData.appData.user);
  }, [appData.appData]);

  return (
    <React.Fragment>
      <div className="col-12 d-inline-flex flex-column px-3" key={index}>
        <div
          className={`${styles.productsGlance} col-12 d-inline-block position-relative`}
          onClick={() => showProductDetail(Product.name_url)}
        >
          <div className="col-12 p-0 d-inline-flex align-items-center">
            <div
              className={`${styles.offerImgContainer} flex-shrink-0 text-decoration-none position-relative d-inline-block`}
            >
              {Product?.image !== "" ? (
                <img
                  src={Product?.image}
                  alt={Product?.name}
                  className="object-fit-contain"
                />
              ) : (
                <img
                  src={notAvail}
                  alt={Product?.name}
                  className="object-fit-contain"
                />
              )}

              {Product?.stock === 0 && (
                <span
                  className={`${styles.soldOutText} position-absolute d-inline-flex align-items-center`}
                >
                  Sold Out
                </span>
              )}
            </div>
            <div className="col-8 float-left ps-3">
              <div className="col-12 d-inline-flex">
                <span className={`${styles.offerItemName}`}>
                  {Product.product_name}
                </span>
              </div>
              <div
                className={`d-inline-flex align-items-center col-12 mb-1 flex-wrap`}
              >
                {Product.selling_price === Product.mrp ? (
                  <span className={`${styles.offerPrice}`}>
                    <b>₹ {Product.mrp}</b>
                  </span>
                ) : (
                  <React.Fragment>
                    <span className={`${styles.offerPrice}`}>
                      <b>₹ {Product.selling_price}</b>{" "}
                      <del>₹ {Product.mrp}</del>
                    </span>
                    <span className={`${styles.offerPercentage} d-inline-flex`}>
                      {discountOff}% &nbsp;OFF
                    </span>
                    <span
                      className={`${styles.savePrice} col-12 d-inline-block p-0 float-left`}
                    >
                      Save ₹ {Product?.mrp - Product?.selling_price}
                    </span>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
          <div
            className={`${styles.itemQuantityBtnBox} position-absolute ${hideQty === true ? "d-none" : "d-inline-block"}`}
          >
            {Product.stock !== 0 && (
              <div className="col-12 p-0">
                {!prodAdded ? (
                  <div className={`${styles.itemPeice}`}>
                    <button
                      className="d-inline-flex flex-shrink-0"
                      onClick={(e) => addToCart(e, Product?.product_id)}
                    >
                      <span
                        className={`${styles.increaseBtn} d-inline-flex align-items-center justify-content-center`}
                      >
                        +
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className={`${styles.itemPeice} d-inline-flex`}>
                    <button className="d-inline-flex flex-shrink-0">
                      <span
                        onClick={(e) =>
                          updateProdQty(
                            e,
                            Product?.product_id
                              ? Product.product_id
                              : Product.id,
                            Product?.no_of_quantity_allowed,
                            prodAddedQty,
                            "minus",
                            Product?.stock,
                          )
                        }
                        className={`${styles.decreaseBtn} d-inline-flex align-items-center justify-content-center`}
                      >
                        -
                      </span>
                    </button>

                    <span className="d-inline-flex flex-shrink-0">
                      <input
                        type="text"
                        readOnly
                        value={prodAddedQty}
                        className={`${styles.countValue} d-inline-block`}
                      />
                    </span>

                    <button className="d-inline-flex flex-shrink-0">
                      <span
                        onClick={(e) =>
                          updateProdQty(
                            e,
                            Product?.product_id
                              ? Product.product_id
                              : Product.id,
                            Product?.no_of_quantity_allowed,
                            prodAddedQty,
                            "plus",
                            Product?.stock,
                          )
                        }
                        className={`${styles.increaseBtn} d-inline-flex align-items-center justify-content-center`}
                      >
                        +
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
