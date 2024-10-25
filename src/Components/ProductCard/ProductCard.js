import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import noImage from "../../assets/images/image-not-available.jpg";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import styles from "./ProductCard.module.css";

export const ProductCard = ({ item, index }) => {
  const [prodAdded, setProdAdded] = useState(false);
  const [prodAddedQty, setProdAddedQty] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const appData = useApp();

  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
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
    let dealType = item?.is_deal ? item?.is_deal : 0;
    let dealId = item?.deal_type_id;
    let dealPrice = item?.deals_price;
    let nameUrl = item?.name_url;

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
      deal_price: dealPrice,
      name_url: nameUrl,
    };

    if (cartInfo === null) {
      cartInfo = [cardObj];
    } else {
      let cartID = cartInfo?.findIndex((obj) => obj.product_id === ProdId);
      if (cartID === null || cartID === undefined || cartID === -1) {
        cartInfo.push(cardObj);
      }
    }

    // validating if the item has is_hot_deals=1, if the same item exists and the no. of items in cart are greater than item?.no_of_quantity_allowed then send error limit exceeds
    if (dealType === 1) {
      let cartDealItems = cartInfo.filter((obj) => obj.is_hot_deals === 1);
      let cartDealItemsQty = cartDealItems.reduce(
        (a, b) => a + (b["quantity"] || 0),
        0
      );
      if (cartDealItemsQty > noQty) {
        AppNotification(
          "Error",
          "You have reached the product quantity limit.",
          "danger"
        );
        return false;
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
      "success"
    );

    let cartDataJson = [
      {
        product_id: ProdId,
        product_name: prodName,
        stock: stockQTY,
        mrp: Mrp,
        selling_price: sellingPrice,
        quantity: Quantity,
        no_of_quantity_allowed: noQty,
        is_hot_deals: dealType,
        deal_type_id: dealId,
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        deal_price: dealPrice,
        name_url: nameUrl,
      },
    ];

    if (appData.appData?.user?.customer_id) {
      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userInfo.customer_id,
        cartJson: JSON.stringify(cartDataJson),
      };
      ApiService.addMultipleCart(payload)
        .then((res) => {
          if (res?.message === "Add successfully.") {
            let resCart = res.payload_cartList_items;
            appData.setAppData({
              ...appData.appData,
              cartSaved: true,
              cartData: resCart,
              cartCount: resCart?.length,
              cartID: res.payload_cartList_id,
            });
            localStorage.setItem("cartSaved", true);
            localStorage.setItem("cartID", res.payload_cartList_id);
            localStorage.setItem("cartData", JSON.stringify(resCart));
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
          "danger"
        );
      } else {
        let newQty = currQty + 1;
        if (stock >= newQty) {
          cartInfo[cartProdID].quantity = newQty;
        } else {
          AppNotification(
            "Error",
            "You have reached the product quantity limit.",
            "danger"
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
                "success"
              );
            })
            .catch((err) => {
              AppNotification(
                "Error",
                "Unable to remove the product from cart successfully",
                "danger"
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
      let productID = item?.product_id ? item.product_id : item.id;
      let cartID = appData.appData.cartData.findIndex(
        (obj) => obj.product_id === productID
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
      <div
        className={`${styles.singleFeaturedProduct} flex-shrink-0 d-inline-block position-relative overflow-hidden col-12 h-100`}
        role="button"
        key={index}
      >
        {item?.is_deal
          ? parseFloat(item.mrp) > parseFloat(item.deals_price) && (
              <span
                className={`${styles.featureOffBox} position-absolute d-inline-flex align-items-center`}
              >
                {Math.ceil(((item?.mrp - item?.deals_price) * 100) / item?.mrp)}
                % OFF
              </span>
            )
          : parseFloat(item.mrp) > parseFloat(item.selling_price) && (
              <span
                className={`${styles.featureOffBox} position-absolute d-inline-flex align-items-center`}
                style={{
                  borderRadius: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  padding: "7px",
                  width: "40px",
                  height: "40px",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span style={{
                  margin: "1px"
                }}>
                  {Math.ceil(
                    ((item?.mrp - item?.selling_price) * 100) / item?.mrp
                  )}
                  %
                </span>{" "}
                <span style={{
                  margin: "1px"
                }}>OFF</span>
              </span>
            )}

        <Link
          to={`/product/${item?.name_url}`}
          style={{
            textDecoration: "none",
          }}
          className={`${styles.featuredImageBox} p-0 position-relative col-12 mt-1 float-left mb-1 d-flex justify-content-center align-items-center w-full`}
        >
          {item.stock === 0 || item.stock < 0 ? (
            <span className={`${styles.soldOutText} position-absolute d-block`}>
              Sold Out
            </span>
          ) : (
            ""
          )}
          <div
            className={`d-flex align-items-center w-100 justify-content-center ${styles.productImgContainer}`}
          >
            <img
              onError={(e) => setNoImage(e)}
              style={{
                opacity: item.stock <= 0 ? "0.5" : "1",
                height: "100%",
                width: "100%",
                borderRadius: '12px',
                objectFit: "cover",
              }}
              src={
                item?.image
                  ? item.image?.replace(
                      "https://rewardsplus.in/uploads/app/public/cogendermpany",
                      "https://merchant.rewardsplus.in/uploads/app/public/company"
                    )
                  : item?.image_url ?? noImage
              }
              alt="--"
              className={`${styles.productImg}`}
            />
          </div>
          {item?.gallery_images?.length ? (
            <React.Fragment>
              {item?.gallery_images?.map((imagesrc, index) => {
                return (
                  <img
                    src={enviroment.API_IMAGE_GALLERY_URL + imagesrc}
                    alt="offer"
                    className={`${styles.galleryImage} position-absolute h-100 col-12 p-0`}
                    key={index}
                  />
                );
              })}
            </React.Fragment>
          ) : (
            ""
          )}
        </Link>
        <div>
          <Link
            to={`/product/${item?.name_url}`}
            style={{
              margin: "15px 0px",
              textDecoration: "none",
              minHeight: "30px",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              lineHeight: "15px",
            }}
            className={`${styles.offerItemName} col-12 fw-bold p-0 mb-1`}
          >
            {item.name}
          </Link>
          {item?.is_deal === 1 && item.deals_price != 0 ? (
            <div className="col-12 p-0 d-inline-flex align-items-center gap-2 flex-wrap">
              <span className={`${styles.offerPrice} d-inline-flex`}>
                <b>₹{Math.round(item.deals_price)}</b>
              </span>
              <del className={`${styles.offerDiscountPrice} d-inline-flex`}>
                ₹{Math.round(item.mrp)}
              </del>
            </div>
          ) : item.mrp > item.selling_price ? (
            <div
              style={{
                margin: "10px 0px",
              }}
              className="col-12 p-0 d-inline-flex align-items-center gap-2 flex-wrap"
            >
              <span className={`${styles.offerPrice} d-inline-flex`}>
                <b>₹{Math.round(item.selling_price)}</b>
              </span>
              <del className={`${styles.offerDiscountPrice} d-inline-flex`}>
                ₹{Math.round(item.mrp)}
              </del>
            </div>
          ) : (
            <div
              style={{
                margin: "5px 0px",
              }}
              className="col-12 float-left p-0 d-inline-block"
            >
              <span
                className={`${styles.offerPrice} col-12 p-0 d-inline-block float-left`}
              >
                <b>₹{Math.round(item.mrp)}</b>
              </span>
            </div>
          )}
          {item.stock > 0 && (
            <React.Fragment>
              {!prodAdded ? (
                <span
                  role="button"
                  className={`${styles.addCartBtn} d-inline-flex align-items-center justify-content-center position-absolute text-uppercase`}
                  onClick={(e) => addToCart(e, item)}
                >
                  Add to cart
                </span>
              ) : (
                <div
                  className={`${styles.itemQuantityBtnBox} position-absolute`}
                >
                  <span
                    role="button"
                    onClick={(e) =>
                      updateProdQty(
                        e,
                        item?.product_id ? item.product_id : item.id,
                        item?.no_of_quantity_allowed,
                        prodAddedQty,
                        "minus",
                        item?.stock
                      )
                    }
                    className={`${styles.decrease_btn} ${styles.minusIcon} d-inline-flex align-items-center justify-content-center`}
                  >
                    -
                  </span>
                  <span className="d-inline-flex flex-shrink-0">
                    <input
                      type="text"
                      readOnly
                      value={prodAddedQty}
                      className={`${styles.countValue} d-inline-block text-center`}
                    />
                  </span>
                  <span
                    role="button"
                    onClick={(e) =>
                      updateProdQty(
                        e,
                        item?.product_id ? item.product_id : item.id,
                        item?.no_of_quantity_allowed,
                        prodAddedQty,
                        "plus",
                        item?.stock
                      )
                    }
                    className={`${styles.increase_btn} ${styles.plusIcon} d-inline-flex align-items-center justify-content-center`}
                  >
                    +
                  </span>
                </div>
              )}
            </React.Fragment>
          )}
          {item.stock <= 0 && (
            <button
              type="button"
              className={`${styles.addCartBtn} d-inline-flex align-items-center justify-content-center position-absolute text-uppercase`}
              style={{
                cursor: "not-allowed",
                opacity: "0.5",
              }}
            >
              Sold out!
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
