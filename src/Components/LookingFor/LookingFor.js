import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import styles from "./LookingFor.module.css";

import { useAppStore } from "../../store";
import { LookingForBannerLoader } from "../Loader/Loader";
import { ArrowRight } from "react-bootstrap-icons";

export const LookingFor = () => {
  const categories = useAppStore((state) => state.categories);
  const [loading, setLoading] = useState(true);
  const appData = useApp();
  const navigate = useNavigate();
  let windowWidth = appData.appData.windowWidth;

  const subCatProduts = (categorySlug, verticalSlug) => {
    navigate(`/store-product/vertical/${verticalSlug}/category/${categorySlug}`);
  };

  useEffect(() => {
    if (categories.length > 0) {
      setLoading(false);
    }
  }, [categories]);

  // Adjusting responsive settings for the carousel
  const responsiveSettings = {
    0: {
      items: 1.5, // Mobile devices
    },
    500: {
      items: 2, // Mobile devices
    },
    768: {
      items: 3, // Tablets
    },
    992: {
      items: 4, // Small laptops
    }
  };

  const getColors = (item) => {
    return item?.category?.color_code ?? "#e75050";
  }

  const hexToRgb = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  return (
    <React.Fragment>
      <div className={`${styles.shopAgeBox} px-3 col-12 d-inline-flex mb-3`}>
        <div
          className={`${windowWidth === "mobile" && "p-0"
            } container d-flex flex-column m-auto`}
        >
          <h2
            className={`${styles.categoryHeaderTitle} col-12 d-inline-flex justify-content-center mt-4 mb-3 fs-2`}
          >
            ✨ Shop by Category ✨
          </h2>
          {loading ? (
            <LookingForBannerLoader />
          ) : (
            <div className="col-12 row d-inline-flex" style={{
              maxWidth: '1200px',
              margin: 'auto',
            }}>
              <ReactOwlCarousel
                className={`carousel-looking-for col-12 brandSilder owl-theme`}
                margin={10}
                loop={false}
                dots={false}
                responsive={responsiveSettings}
                style={{
                  display: 'flex',
                  justifyContent: 'center'
                }}
                nav={true}
              >
                {categories?.map((item, idx) => {
                  return (
                    <div key={idx} className="my-4">
                      <div className={styles.cardContainer}
                        style={{
                          color: "black"
                        }}
                        onClick={() =>
                          subCatProduts(
                            item?.category?.name_url,
                            item?.verticalSlug
                          )
                        }
                      >
                        <div className={`${styles.backgroundGradientColor}`} style={{
                          background: `linear-gradient(to bottom, rgba(${hexToRgb(getColors(item))}, 0.1) 0%, rgba(${hexToRgb(getColors(item))}, 1) 100%)`
                        }} />
                        <img src={item?.category?.image}
                          alt={item?.category?.name}
                          className="object-fit-fill col-12 d-inline-block"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            margin: "0px",
                            transform: "translateY(-6%) scale(1.5)",
                          }}
                        />
                        <span className="fs-5 mt-2">
                          {item?.category?.name}
                        </span>
                        <span className={styles.arrow} style={{
                          background: getColors(item),
                          color: "black",
                          boxShadow: "0px 0px 2px 0px rgba(255, 255, 255, 0.25)",
                          padding: "2px 10px",
                          borderRadius: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: "10px",
                        }}>
                          <ArrowRight style={{
                            margin: "0px"
                          }} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </ReactOwlCarousel>
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
