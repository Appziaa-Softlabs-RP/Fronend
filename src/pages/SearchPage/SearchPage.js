import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { ProductListLoader } from "../../Components/Loader/Loader";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./SearchPage.module.css";

export const SearchPage = () => {
  const locationState = useLocation();
  const { keyword } = useParams();
  const [ProductData, setProductData] = useState([]);
  const [ProductDataLen, setProductDataLen] = useState("");
  const [ProductActualData, setProductActualData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDescendingOrder, setIsDscendingOrder] = useState(false);
  const [isAscendingOrder, setIsAscendingOrder] = useState(false);
  const [filterVert, setFilterVert] = useState(null);
  const [filterCatg, setFilterCatg] = useState(null);
  const [sortPopup, setSortPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);

  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    if (keyword) {
      const payload = {
        store_id: parseInt(enviroment.STORE_ID),
        keyword: keyword,
      };
      setFilterVert(locationState?.state?.verticalId);
      setFilterCatg(locationState?.state?.categoryId);
      ApiService.storeSearch(payload)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            setProductData(res.payload_searchAI);
            setProductActualData(res.payload_searchAI);
            setProductDataLen(res.payload_searchAI.length);
          }
        })
        .catch((err) => {});
      setLoading(false);
    }
  }, [keyword]);

  const resetSortFilter = () => {
    let originalProduct = [...ProductActualData];
    setProductData(originalProduct);
    setProductActualData(originalProduct);
    setIsDscendingOrder(false);
    setIsAscendingOrder(false);
  };

  const priceAscending = () => {
    let originalProduct = [...ProductData];
    originalProduct.sort((p1, p2) =>
      parseInt(p1.mrp) < parseInt(p2.mrp)
        ? 1
        : parseInt(p1.mrp) > parseInt(p2.mrp)
        ? -1
        : 0
    );
    setProductData(originalProduct);
    setIsAscendingOrder(true);
    setIsDscendingOrder(false);
  };

  const priceDescending = () => {
    let originalProduct = [...ProductData];
    originalProduct.sort((p1, p2) =>
      parseInt(p1.mrp) > parseInt(p2.mrp)
        ? 1
        : parseInt(p1.mrp) < parseInt(p2.mrp)
        ? -1
        : 0
    );
    setProductData(originalProduct);
    setIsDscendingOrder(true);
    setIsAscendingOrder(false);
  };

  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Explore Category" />
      ) : windowWidth === "desktop" ? (
        <Header />
      ) : (
        ""
      )}

      <div
        className={`col-12 d-inline-flex ${
          windowWidth === "mobile" ? "mt-3" : "mt-5"
        }`}
      >
        <div className="container">
          <div className={`d-inline-flex flex-wrap col-12`}>
            {ProductDataLen > 0 && (
              <h4 className={`${styles.searchProdTitle} col-12 d-inline-flex`}>
                Showing {ProductDataLen} Results for {keyword}
              </h4>
            )}
            {loading && <ProductListLoader />}
            {loading === false && (
              <div
                className={`d-inline-flex flex-column col-12 mb-3`}
                id="scrollableDiv"
              >
                <div className={`d-inline-flex align-items-start col-12 gap-2`}>
                  <div
                    className={`${
                      windowWidth === "mobile"
                        ? "col-12 pt-2"
                        : filterVert !== null && filterVert !== undefined
                        ? "col-9"
                        : "col-12"
                    } ${
                      styles.productContainer
                    } flex-shrink-1 d-inline-flex flex-wrap`}
                  >
                    <div
                      className={`${styles.sortContainer} col-12 d-inline-flex align-items-end flex-column gap-2 p-3 px-4 mb-3`}
                    >
                      <span
                        onClick={() => resetSortFilter()}
                        role="button"
                        className={`${styles.clearAllBtn} d-inline-flex`}
                      >
                        Clear All
                      </span>
                      <div className="col-12 d-inline-flex justify-content-end align-items-center">
                        <span className={`${styles.sortBy} d-inline-flex me-2`}>
                          Sort By
                        </span>
                        <span
                          onClick={() => priceDescending()}
                          role="button"
                          className={`${styles.priceLow} ${
                            isDescendingOrder ? "fw-bold" : ""
                          } d-inline-flex px-1`}
                        >
                          Price: Low to High
                        </span>
                        <span
                          onClick={() => priceAscending()}
                          role="button"
                          className={`${styles.priceLow} d-inline-flex px-1 ${
                            isAscendingOrder ? "fw-bold" : ""
                          }`}
                        >
                          Price: High to Low
                        </span>
                      </div>
                    </div>
                    <div className={`d-inline-flex flex-wrap col-12 mb-3`}>
                      {ProductData?.length > 0 &&
                        ProductData?.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {item.name !== "" && (
                                <div
                                  className={`${
                                    windowWidth === "mobile" ? "col-6" : "col-3"
                                  } px-2 flex-shrink-0 mb-3`}
                                  key={index}
                                  role="button"
                                >
                                  <ProductCard item={item} index={index} />
                                </div>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
