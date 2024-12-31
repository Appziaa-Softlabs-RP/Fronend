import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import styles from "./LookingFor.module.css";

import { useAppStore } from "../../store";
import { LookingForBannerLoader } from "../Loader/Loader";

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

  const responsiveItems =
    window.innerWidth >= 1300
      ? 6
      : window.innerWidth >= 1200
        ? 5
        : window.innerWidth >= 992
          ? 4
          : window.innerWidth >= 768
            ? 3
            : 2.5;


  return (
    <React.Fragment>
      {loading ? (
        <LookingForBannerLoader />
      ) : (
        <div className={`${styles.shopAgeBox} px-3 col-12 d-inline-flex mb-3`}>
          <div
            className={`${windowWidth === "mobile" && "p-0"
              } container d-flex flex-column m-auto`}
          >
            <div className="titlesWrapper">
              <h5
                className={`titleMainSmall col-12`}
              >
                EXPLORE
              </h5>
              <p
                className={`subTitleLarge col-12`}
              >
                Ashi Electronics STORE
              </p>
            </div>
            <div className="col-12 d-inline-flex">
              <ReactOwlCarousel
                className={`carousel-looking-for col-12 brandSilder owl-theme`}
                margin={10}
                loop={false}
                dots={false}
                items={responsiveItems}
                nav={true}
              >
                {categories?.map((item, idx) => {
                  return (
                    <div
                      className={`${styles.thumbItem} col-12 d-inline-flex flex-column pt-3 gap-2 mouse-cursor`}
                      key={idx}
                      onClick={() =>
                        subCatProduts(
                          item?.category?.name_url,
                          item?.verticalSlug
                        )
                      }
                    >
                      <div className={`${styles.lookingForContainer}`}>
                        <img
                          src={item?.category?.image}
                          alt={item?.category?.name}
                          className="object-fit-fill col-12 d-inline-block"
                        />
                      </div>
                      <p
                        className={`${styles.thumbName} text-truncate col-12 text-center mb-0`}
                      >
                        {item?.category?.name}
                      </p>
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