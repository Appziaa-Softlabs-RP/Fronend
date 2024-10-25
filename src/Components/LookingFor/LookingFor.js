import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { useNavigate } from "react-router-dom";
import styles from "./LookingFor.module.css";

import { ArrowRight } from "react-bootstrap-icons";
import { useAppStore } from "../../store";
import { LookingForBannerLoader } from "../Loader/Loader";

export const LookingFor = () => {
  const categories = useAppStore((state) => state.categories);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const subCatProduts = (categorySlug, verticalSlug) => {
    navigate(`/store-product/${categorySlug}`);
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

  const getColors = (id, type) => {
    switch (id) {
      case 1:
        return type === 'text' ? "#912E0B" : "#F9D5B8";
      case 2:
        return type === 'text' ? "#CB0055" : "#FDA7CF";
      case 3:
        return type === 'text' ? "#970011" : "#FDB7A9";
      case 4:
        return type === 'text' ? "#4CAF50" : "#81C784";
      default:
        return type === 'text' ? "#2E7113" : "#B3E0F9";
    }
  }

  const hexToRgb = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };

  return (
    <React.Fragment>
      {loading ? (
        <LookingForBannerLoader />
      ) : (
        <div className={`${styles.shopAgeBox} px-3 col-12 d-inline-flex my-5`}>
          <div className={`container d-flex flex-column m-auto`}>
            <h2 style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
              alignItems: "end",
              gap: "20px",
            }}>
              <span className="textSpecial" style={{
                textDecoration: 'underline',
              }}>Mithaas</span>
              <img
                src="/images/chana-ram.png"
                alt="Chana Ram"
                style={{
                  maxWidth: "190px",
                }}
              />
            </h2>
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
                          color: getColors(idx + 1, 'text')
                        }}
                        onClick={() =>
                          subCatProduts(
                            item?.category?.name_url,
                            item?.verticalSlug
                          )
                        }
                      >
                        <div className={styles.backgroundGradientColor} style={{
                          background: `linear-gradient(to bottom, rgba(${hexToRgb(getColors(idx + 1, 'bg'))}, 0.1) 0%, rgba(${hexToRgb(getColors(idx + 1, 'bg'))}, 1) 100%)`
                        }} />
                        <img src={item?.category?.image}
                          alt={item?.category?.name}
                          className="object-fit-fill col-12 d-inline-block"
                          style={{
                            objectFit: "cover",
                            width: "100%",
                            margin: "0px",
                            transform: "translateY(-6%) scale(1.1)",
                          }}
                        />
                        <span>
                          {item?.category?.name}
                        </span>
                        <span className={styles.arrow} style={{
                          background: getColors(idx + 1, 'text'),
                          color: "white",
                          padding: "3px 10px",
                          borderRadius: "100px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center"
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
          </div>
        </div>
      )}
    </React.Fragment>
  );
};