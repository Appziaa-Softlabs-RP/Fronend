import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import styles from "./PromoBanner.module.css";

import { useNavigate } from "react-router-dom";
import { useAppStore } from "../../store";
import { PromoBannerLoader } from "../Loader/Loader";

export const PromoBanner = ({ type }) => {
  const [loading, setLoading] = useState(true);
  const promoBanners = useAppStore((state) => state.promoBanners);
  const offerBanners = useAppStore((state) => state.offerBanners);
  const [allBanner, setAllBanner] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (type === "Promo Banner") {
      setAllBanner(promoBanners);
      setLoading(false);
    } else if (type === "Offers") {
      setAllBanner(offerBanners);
      setLoading(false);
    }
  }, [promoBanners, offerBanners]);

  const redirectToLink = (item) => {
    if (item?.site_link) {
      if (window !== undefined) window.open(item?.site_link, "_blank");
    } else if (item?.category_id && item?.vertical_id) {
      navigate(
        `/store-product/vertical/${item?.vertical_name_url}/category/${item?.category_name_url}`
      );
    } else if (item?.product_id) {
      navigate(`/product/${item?.product_name_url}`);
    }
  };

  return (
    <React.Fragment>
      {/* Mobile Structure */}
      <div className={'hideInDesktop'}>
        {allBanner?.length > 0 && (
          <div className={`col-12 d-inline-flex flex-column px-3 pb-3`}>
            <div
              className={`${type === "Promo Banner"
                ? styles.categoryBox
                : type === "Offers"
                  ? styles.offersBox
                  : ""
                } col-12 d-inline-flex flex-column`}
            >
              {type === "Promo Banner" && (
                <h2
                  className={`${styles.exploreByCategoryHeader} col-12 d-inline-flex mt-0 mb-3 fs-3`}
                >
                  Promo for you
                </h2>
              )}
              <ReactOwlCarousel
                className={`${styles.bannerContainer} col-12 d-inline-block owl-theme`}
                margin={10}
                loop={false}
                dots={true}
                items={1}
                stagePadding={15}
              >
                {allBanner?.map((item, index) => {
                  return (
                    <div
                      className={styles.banner}
                      onClick={() => redirectToLink(item)}
                      key={index}
                    >
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="object-fit-cover col-12 d-inline-block"
                        style={{
                          width: "100%",
                        }}
                      />
                    </div>
                  );
                })}
              </ReactOwlCarousel>
            </div>
          </div>
        )}
      </div>
      {/* Desktop Structure */}
      <div className={'hideInMobile'}>
        {loading ? (
          <PromoBannerLoader />
        ) : (
          <div>
            {allBanner?.length > 0 && (
              <div className={`col-12 d-inline-flex flex-column mt-3`}>
                <div className="container">
                  <div className={`col-12 d-inline-flex flex-column py-3`}>
                    {type === "Promo Banner" && (
                      <h2
                        className={`${styles.categoryHeaderTitle} col-12 d-inline-flex justify-content-center mt-0 mb-3 fs-2 `}
                      >
                        ✨ Promos for you ✨
                      </h2>
                    )}
                    <ReactOwlCarousel
                      className={`${styles.bannerContainer} brandSilder col-12 d-inline-block owl-theme`}
                      margin={10}
                      nav={true}
                      loop={true}
                      dots={false}
                      items={`${type === "Promo Banner"
                        ? 3
                        : type === "Offers"
                          ? 1
                          : ""
                        }`}
                      stagePadding={0}
                    >
                      {allBanner.map((item, index) => {
                        return (
                          <div
                            onClick={() => redirectToLink(item)}
                            key={index}
                            style={{
                              cursor: "pointer",
                            }}
                          >
                            <img
                              src={item?.image}
                              alt={item?.name}
                              className="object-fit-cover col-12 d-inline-block"
                            />
                          </div>
                        );
                      })}
                    </ReactOwlCarousel>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

    </React.Fragment>
  );
};