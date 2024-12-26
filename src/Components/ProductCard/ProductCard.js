import React from "react";
import { Link } from "react-router-dom";
import noImage from "../../assets/images/image-not-available.jpg";
import { enviroment } from "../../enviroment";
import styles from "./ProductCard.module.css";

export const ProductCard = ({ item, index }) => {

  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
  };

  return (
    <React.Fragment>
      <div
        className={`${styles.singleFeaturedProduct} flex-shrink-0 d-inline-block position-relative overflow-hidden col-12 h-100`}
        role="button"
        style={{
          maxWidth: "400px",
        }}
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

        {
          item?.product_id ? (
            <Link
              to={`/product/${item?.name_url}/${item?.product_id}`}
              style={{
                textDecoration: "none",
              }}
              className={`${styles.featuredImageBox} position-relative col-12 mt-1 float-left mb-1 d-flex justify-content-center align-items-center w-full`}
            >
              {item.stock === 0 || item.stock < 0 ? (
                <span className={`${styles.soldOutText} position-absolute d-block`}>
                  Sold Out
                </span>
              ) : (
                ""
              )}
              <div
                className={`d-flex align-items-center w-100 ${styles.productImgContainer}`}
              >
                <img
                  onError={(e) => setNoImage(e)}
                  style={{
                    opacity: item.stock <= 0 ? "0.5" : "1",
                    height: "100%",
                    width: "100%",
                    objectFit: "contain",
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
          )
            : (
              <div
                style={{
                  textDecoration: "none",
                }}
                className={`${styles.featuredImageBox} position-relative col-12 mt-1 float-left mb-1 d-flex justify-content-center align-items-center w-full`}
              >
                {item.stock === 0 || item.stock < 0 ? (
                  <span className={`${styles.soldOutText} position-absolute d-block`}>
                    Sold Out
                  </span>
                ) : (
                  ""
                )}
                <div
                  className={`d-flex align-items-center w-100 ${styles.productImgContainer}`}
                >
                  <img
                    onError={(e) => setNoImage(e)}
                    style={{
                      opacity: item.stock <= 0 ? "0.5" : "1",
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
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
              </div>
            )}
        <div className="mt-4">
          {item.product_id ? (
            <Link
              to={`/product/${item?.name_url}/${item.product_id}`}
              style={{
                margin: "5px 0px",
                textDecoration: "none",
                minHeight: "25px",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                fontSize: "14px",
                fontWeight: "400",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: "15px",
              }}
              className={`${styles.offerItemName} col-12 p-0`}
            >
              {item.name}
            </Link>
          ) : (
            <div
              style={{
                margin: "5px 0px",
                minHeight: "25px",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
                fontSize: "14px",
                fontWeight: "400",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "normal",
                lineHeight: "15px",
              }}
              className={`${styles.offerItemName} col-12 p-0`}
            >
              {item.name}
            </div>
          )}
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
                margin: "10px 0px",
                fontWeight: "400",
                fontSize: "14px",
              }}
              className="col-12 p-0 d-inline-flex align-items-center gap-2 flex-wrap"
            >
              <span className={`${styles.offerPrice} d-inline-flex text-danger`}>
                ₹{Math.round(item.selling_price)}
              </span>
              <del className={`${styles.offerDiscountPrice} d-inline-flex`}>
                ₹{Math.round(item.mrp)}
              </del>
              {/* percentage off value */}
              <span className={`${styles.offerDiscountPrice} text-danger`}>
                {Math.ceil(
                  ((item?.mrp - item?.selling_price) * 100) / item?.mrp
                )}
                % OFF
              </span>
            </div>
          ) : (
            <div
              style={{
                margin: "5px 0px",
              }}
              className="col-12 float-left p-0 d-inline-block"
            >
              <span
                className={`${styles.offerPrice} col-12 p-0 d-inline-block text-danger float-left`}
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
    </React.Fragment>
  );
};