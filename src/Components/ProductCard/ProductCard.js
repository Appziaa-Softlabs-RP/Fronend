
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import noImage from "../../assets/images/image-not-available.jpg";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import styles from "./ProductCard.module.css";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const ProductCard = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const swiperRef = useRef(null);

  const mrp = parseFloat(item?.mrp);
  const selling_price = parseFloat(item?.selling_price);

  const [prodAdded, setProdAdded] = useState(false);
  const [prodAddedQty, setProdAddedQty] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const navigate = useNavigate();
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

  const getInitialSlide = () => {
    if (!isHovered) return 0;
    // If there's a second image (either gallery or main), show it on hover
    return (item?.gallery_images?.length > 0 || item?.image) ? 1 : 0;
  };

  const CardContent = () => (
    <>
      <div
        className={`${styles.featuredImageBox}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.stock === 0 || item.stock < 0 ? (
          <span className={`${styles.soldOutText} position-absolute`}>
            Sold Out
          </span>
        ) : null}
        <Swiper
          ref={swiperRef}
          modules={[Pagination, Navigation, Autoplay]}
          pagination={{
            clickable: true,
            el: '.swiper-pagination'
          }}
          navigation={false}
          autoplay={isHovered ? { delay: 2000, disableOnInteraction: false } : false}
          loop={true}
          initialSlide={getInitialSlide()}
          allowTouchMove={true}
          className={styles.swiper}
        >
          {isHovered && (item?.gallery_images?.length > 1 || (item?.gallery_images?.length > 0 && item?.image)) && (
            <>
              <div className={`swiper-pagination ${styles.customPagination}`}></div>
            </>
          )}
          <SwiperSlide>
            <img
              onError={setNoImage}
              src={
                item?.image
                  ? item.image?.replace(
                    "https://rewardsplus.in/uploads/app/public/cogendermpany",
                    "https://merchant.rewardsplus.in/uploads/app/public/company"
                  )
                  : item?.image_url ?? noImage
              }
              alt={item.name}
              className={styles.productImg}
            />
          </SwiperSlide>
          {item?.gallery_images?.map((imageSrc, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={enviroment.API_IMAGE_GALLERY_URL + imageSrc}
                alt={`gallery`}
                className={styles.productImg}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.productInfo}>
        <h5 className={styles.offerItemName}>{item.name}</h5>
        <div className={styles.priceContainer}>
          {item?.is_deal === 1 && item.deals_price !== 0 ? (
            <>
              <span className={styles.offerPrice}>₹{Math.round(item.deals_price)}</span>
              <del className={styles.offerDiscountPrice}>₹{Math.round(mrp)}</del>
            </>
          ) : mrp > item.selling_price ? (
            <>
              <span className={styles.offerPrice}>₹{Math.round(item.selling_price)}</span>
              <del className={styles.offerDiscountPrice}>₹{Math.round(mrp)}</del>
            </>
          ) : (
            <span className={styles.offerPrice}>₹{Math.round(mrp)}</span>
          )}
        </div>
      </div>
      {parseFloat(mrp) > parseFloat(item.selling_price) && (
        <div className={`${styles.featureOffBox} position-absolute`}>
          <span>{Math.ceil(((item?.mrp - selling_price) * 100) / item?.mrp)}%</span>
          <span>OFF</span>
        </div>
      )}
      {item.stock > 0 && (
        <div className="m-2">
          {!prodAdded ? (
            <span
              role="button"
              className={`${styles.addCartBtn} text-white btnCustom w-100 d-inline-flex align-items-center justify-content-center text-uppercase`}
              onClick={(e) => addToCart(e, item)}
            >
              Add to cart
            </span>
          ) : (
            <div
              className={`${styles.itemQuantityBtnBox}`}
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
                className={`${styles.decrease_btn} btnCustom2 ${styles.minusIcon} d-inline-flex align-items-center justify-content-center`}
                style={{
                  padding: "0px",
                }}
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
                className={`${styles.increase_btn} btnCustom2 ${styles.plusIcon} d-inline-flex align-items-center justify-content-center`}
                style={{
                  padding: "0px",
                }}
              >
                +
              </span>
            </div>
          )}
        </div>
      )}
      {item.stock <= 0 && (
        <div className="m-2">
          <button
            disabled
            type="button"
            className={`${styles.addCartBtn} btnCustom w-100 d-inline-flex align-items-center justify-content-center text-uppercase`}
            style={{
              cursor: "not-allowed",
              opacity: "0.5",
            }}
          >
            Sold out!
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className={`${styles.singleFeaturedProduct} flex-shrink-0 d-inline-block position-relative overflow-hidden col-12 h-100`} key={index}>
      <Link
        to={`/product/${item?.name_url}`}
        className={styles.productLink}
      >
        <CardContent />
      </Link>
    </div>
  );
};
