import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import womenNoImage from "../../assets/images/female-no-image.png";
import noImage from "../../assets/images/image-not-available.jpg";
import kidsNoImage from "../../assets/images/kids-no-image.png";
import menNoImage from "../../assets/images/men-no-image.png";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import styles from "./ProductCard.module.css";

export const ProductCard = ({ item, index }) => {
  const [prodAdded, setProdAdded] = useState(false);
  const [prodAddedQty, setProdAddedQty] = useState(0);
  const [userInfo, setUserInfo] = useState({});
  const appData = useApp();

  const getNoImage = ({
    verticalType = null,
    gender = null
  }) => {
    if (verticalType) {
      if (verticalType === "Men") {
        return menNoImage;
      } else if (verticalType === "Women") {
        return womenNoImage;
      } else if (verticalType === "Kids") {
        return kidsNoImage;
      } else {
        return menNoImage;
      }
    } else {
      switch (gender) {
        case "Boys":
          return menNoImage;
        case "Girls":
          return womenNoImage;
        default:
          return menNoImage;
      }
    }
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

  const getGenderName = (gender) => {
    switch (gender) {
      case "Boys":
        return "Men";
      case "Girls":
        return "Women";
      default:
        return gender;
    }
  }

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
          className={`${styles.featuredImageBox} position-relative col-12 float-left mb-1 d-flex justify-content-center align-items-center w-full`}
        >
          {item.stock === 0 || item.stock < 0 ? (
            <span className={`${styles.soldOutText} position-absolute d-block`}>
              Sold Out
            </span>
          ) : (
            ""
          )}
          <div
            className={`d-flex w-100 align-items-center ${styles.productImgContainer}`}
          >
            <img
              style={{
                opacity: item.stock <= 0 ? "0.5" : "1",
                height: "100%",
                width: "100%",
                margin: "0px",
                objectFit: "cover",
              }}
              src={
                item?.image
                  ? item.image?.replace(
                    "https://rewardsplus.in/uploads/app/public/cogendermpany",
                    "https://merchant.rewardsplus.in/uploads/app/public/company"
                  )
                  : item?.image_url ?? getNoImage({
                    verticalType: item?.vertical_name,
                    gender: item?.gender_name
                  })
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
        <div className="m-3" style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <div style={{
            fontSize: "14px",
            fontWeight: "500",
          }} >
            {getGenderName(item?.gender_name)}
          </div>
          <div>
            <Link
              to={`/product/${item?.name_url}`}
              style={{
                textDecoration: "none",
                minHeight: "25px",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                fontSize: "16px",
                fontWeight: "600",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: "15px",
              }}
              className={`${styles.offerItemName} col-12 p-0`}
            >
              <span className={styles.itemName} style={{
                color: "#000",
                fontWeight: "700",
              }}>
                {item.name}
              </span>
            </Link>
            {item?.is_deal === 1 && item.deals_price !== 0 ? (
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
                  fontWeight: "400",
                }}
                className="col-12 p-0 d-inline-flex align-items-center gap-2 flex-wrap"
              >
                <span className={`${styles.offerPrice} d-inline-flex`}>
                  ₹{Math.round(item.selling_price)}
                </span>
                <del className={`${styles.offerDiscountPrice} d-inline-flex`}>
                  ₹{Math.round(item.mrp)}
                </del>
              </div>
            ) : (
              <div
                className="col-12 float-left p-0 d-inline-block"
              >
                <span
                  className={`${styles.offerPrice} col-12 p-0 d-inline-block float-left`}
                  style={{
                    fontWeight: "400",
                  }}
                >
                  ₹{Math.round(item.mrp)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
