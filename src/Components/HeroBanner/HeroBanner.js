import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import styles from "./HeroBanner.module.css";

import { useNavigate } from "react-router";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { useAppStore } from "../../store";
import { AppNotification } from "../../utils/helper";
import { HeroBannerLoader } from "../Loader/Loader";

export const HeroBanner = ({ allBanner }) => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const heroBanners = useAppStore((state) => state.heroBanners);
  const setHeroBanners = useAppStore((state) => state.setHeroBanners);
  const setPromoBanners = useAppStore((state) => state.setPromoBanners);
  const setOfferBanners = useAppStore((state) => state.setOfferBanners);

  const openBannerProd = (
    verticalId,
    subCatId,
    prodId,
    categoryId,
    siteLink
  ) => {
    let category = "Banner";
    if (siteLink !== null) {
      if (window !== undefined) window.open(siteLink, "_blank");
    } else if (prodId !== null) {
      const payload = {
        product_slug: prodId,
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
      };
      ApiService.productDetails(payload)
        .then((res) => {
          if (res.message === "Product Detail") {
            navigate(`/product?id=${prodId}`, {
              state: { product: res.payload },
            });
          } else {
            AppNotification(
              "Error",
              "Sorry, Product detail not found.",
              "danger"
            );
          }
        })
        .catch((err) => {
          AppNotification(
            "Error",
            "Sorry, Product detail not found.",
            "danger"
          );
        });
    } else if (subCatId !== null) {
      const payload = {
        store_id: parseInt(enviroment.STORE_ID),
        category_id: subCatId,
      };
      navigate(`/store-product/${category}`, { state: { payload: payload } });
    } else if (categoryId !== null) {
      const payload = {
        store_id: parseInt(enviroment.STORE_ID),
        category_id: categoryId,
      };
      navigate(`/store-product/${category}`, { state: { payload: payload } });
    } else if (verticalId !== null) {
      navigate(`/store/${category}`, { state: { cat: verticalId } });
    }
  };

  // load banners for first time
  useEffect(() => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
    };

    ApiService.banner(payload)
      .then((res) => {
        if (res.message === "Fetch successfully.") {
          // hero banner
          setHeroBanners(res?.payload_banner?.banner);
          // promo banner
          setPromoBanners(res?.payload_banner?.promobanner);
          // offers
          setOfferBanners(res?.payload_banner?.sectionbanner);

          setLoading(false);
        }
      })
      .catch((err) => { });
  }, []);


  return (
    <React.Fragment>
    {/* Mobile Structure */}
    <div
      className={`${styles.heroBannerContainer} hideInDesktop heroBannerMobile col-12 d-inline-flex mt-1`}
      style={{
        minHeight: "538px",
      }}
    >
      {loading ? (
        <HeroBannerLoader />
      ) : (
        <ReactOwlCarousel
          className={`${styles.bannerContainer} col-12 d-inline-block owl-theme h-100`}
          margin={5}
          loop={true}
          dots={true}
          autoPlay={true}
          items={1}
        >
          {heroBanners?.length > 0 &&
            heroBanners.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item?.mobile_image !== "" && (
                    <div
                      className={styles.item}
                      onClick={() =>
                        openBannerProd(
                          item?.vertical_id,
                          item?.subcategory_id,
                          item?.product_id,
                          item?.category_id,
                          item?.site_link
                        )
                      }
                    >
                      <img
                        src={item?.mobile_image}
                        alt={item?.name}
                        className="object-fit-cover col-12 d-inline-block"
                        style={{
                          borderRadius: "0px"
                        }}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
        </ReactOwlCarousel>
      )}
    </div>

    {/* Desktop Structure */}
    <div className={`hideInMobile`}>
      {loading ? (
        <HeroBannerLoader />
      ) : (
        <div className={`col-12 d-inline-flex`}>
          <ReactOwlCarousel
            className={`${styles.desktopBanner} heroBanner col-12 d-inline-block owl-theme`}
            margin={0}
            loop={true}
            dots={false}
            nav={true}
            stagePadding={0}
            items={1}
            autoplay={true}
          >
            {heroBanners.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item?.image !== "" && (
                    <div
                      className={styles.item}
                      style={{
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        openBannerProd(
                          item?.vertical_id,
                          item?.subcategory_id,
                          item?.product_id,
                          item?.category_id,
                          item?.site_link
                        )
                      }
                    >
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="object-fit-cover col-12 d-inline-block"
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </ReactOwlCarousel>
        </div>
      )}
    </div>
  </React.Fragment>
  );
};