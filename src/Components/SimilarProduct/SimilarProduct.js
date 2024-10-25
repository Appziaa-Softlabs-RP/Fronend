import React from "react";
import styles from "./SimilarProduct.module.css";
import { useApp } from "../../context/AppContextProvider";
import { ProductCard } from "../ProductCard/ProductCard";
import ReactOwlCarousel from "react-owl-carousel";

export const SimilarProduct = ({ product }) => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  return (
    <React.Fragment>
      <div
        className={`${styles.similarProductBox} col-12 d-inline-flex flex-column py-4`}
      >
        <div className={`${windowWidth === "mobile" && "p-0"} container`}>
          <h2
            className={`${
              styles.availSizeTitle
            } mt-0 col-12 d-inline-flex align-items-center justify-content-between pb-3 ${
              windowWidth === "mobile" && "px-4 m-0"
            }`}
          >
            You may like this
          </h2>
          <ReactOwlCarousel
            className={`${styles.allFeaturedProduct} ${
              windowWidth === "mobile" && "px-3"
            } brandSilder col-12 pb-4 owl-theme`}
            margin={10}
            dots={false}
            items={`${windowWidth === "mobile" ? 2 : 4}`}
            stagePadding={20}
            loop={false}
            nav={true}
          >
            {product?.map((item, index) => {
              return <ProductCard key={index} item={item} index={index} />;
            })}
          </ReactOwlCarousel>
        </div>
      </div>
    </React.Fragment>
  );
};
