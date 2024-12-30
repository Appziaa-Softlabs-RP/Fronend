import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import AdaptiveLoader from "../../Components/AdaptiveLoader/AdaptiveLoader";
import { SearchFilter } from "../../Components/Filter/SearchFilter";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import {
  BackArrowIcon,
  FilterIcon,
  SortByIcon,
} from "../../Components/siteIcons";
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
      setLoading(true);
      ApiService.storeSearch(payload)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            setProductData(res.payload_searchAI);
            setProductActualData(res.payload_searchAI);
            setProductDataLen(res.payload_searchAI.length);
          }
        })
        .catch((err) => { })
        .finally(() => setLoading(false));
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
        className={`col-12 d-inline-flex ${windowWidth === "mobile" ? "mt-3" : "mt-5"
          }`}
      >
        <div className="container">
          <div className={`d-inline-flex flex-wrap col-12`}>
            {loading && <AdaptiveLoader />}
            {loading === false && (
              <div
                className={`d-inline-flex flex-column col-12 mb-3`}
                id="scrollableDiv"
              >
                <div className={`d-inline-flex align-items-start col-12 gap-2`}>
                  {windowWidth === "desktop" && (
                    <div
                      className={`${styles.filterSticky} col-3 position-sticky flex-shrink-1 d-inline-flex`}
                    >
                      <SearchFilter
                        filterVert={filterVert}
                        filterCatg={filterCatg}
                        setProductData={setProductData}
                        setProductActualData={setProductActualData}
                        setProductDataLen={setProductDataLen}
                        keyword={keyword}
                      />
                    </div>
                  )}
                  <div
                    className={`${windowWidth === "mobile"
                      ? "col-12 pt-2"
                      : filterVert !== null && filterVert !== undefined
                        ? "col-9"
                        : "col-12"
                      } ${styles.productContainer
                      } flex-shrink-1 d-inline-flex flex-wrap`}
                  >
                    {ProductDataLen > 0 && (
                      <h4 className={`${styles.searchProdTitle} col-12 fs-5`}>
                        <span>Showing {ProductDataLen} Results for "{keyword}"</span>
                      </h4>
                    )}
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
                          className={`${styles.priceLow} ${isDescendingOrder ? "fw-bold" : ""
                            } d-inline-flex px-1`}
                        >
                          Price: Low to High
                        </span>
                        <span
                          onClick={() => priceAscending()}
                          role="button"
                          className={`${styles.priceLow} d-inline-flex px-1 ${isAscendingOrder ? "fw-bold" : ""
                            }`}
                        >
                          Price: High to Low
                        </span>
                      </div>
                    </div>

                    {windowWidth === "mobile" && (
                      <div
                        className={`${styles.productBtnBox} d-inline-flex align-items-stretch col-12 bottom-0 start-0`}
                      >
                        <span
                          className={`${styles.goCartBtn} position-relative col-6 d-inline-flex align-items-center justify-content-center gap-2`}
                          onClick={() => setSortPopup(true)}
                        >
                          {" "}
                          <SortByIcon />
                          Sort By
                        </span>
                        <span
                          className={`${styles.AddCartBtn} position-relative col-6 d-inline-flex align-items-center justify-content-center gap-2`}
                          onClick={() => setFilterPopup(true)}
                        >
                          <FilterIcon /> Filters
                        </span>
                      </div>
                    )}

                    <div className={`d-inline-flex flex-wrap col-12 mb-3`}>
                      {ProductData?.length > 0 &&
                        ProductData?.map((item, index) => {
                          return (
                            <React.Fragment key={index}>
                              {item.name !== "" && (
                                <div
                                  className={`${windowWidth === "mobile" ? "col-6" : "col-3"
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

        {sortPopup === true && (
          <div
            className={`${styles.actionSheet} position-fixed d-inline-flex flex-column justify-content-end gap-2 col-12 p-2 h-100 bottom-0 start-0`}
          >
            <div
              className={`${styles.actionSheetBox} d-inline-flex flex-column col-12 overflow-hidden`}
            >
              <div
                className={`${styles.actionSheetTitle} col-12 d-inline-flex align-items-center justify-content-center`}
              >
                Sort By
              </div>
              <button
                onClick={() => {
                  priceDescending();
                  setSortPopup(false);
                }}
                className={`${styles.actionSheetBtn} col-12 d-inline-flex align-items-center justify-content-center`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => {
                  priceAscending();
                  setSortPopup(false);
                }}
                className={`${styles.actionSheetBtn} col-12 d-inline-flex align-items-center justify-content-center`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => {
                  resetSortFilter();
                  setSortPopup(false);
                }}
                className={`${styles.actionSheetBtn} col-12 d-inline-flex align-items-center justify-content-center`}
              >
                Clear All
              </button>
            </div>
            <button
              onClick={() => setSortPopup(false)}
              className={`${styles.actionSheetCnclBtn} col-12 d-inline-flex align-items-center justify-content-center`}
            >
              Cancel
            </button>
          </div>
        )}

        {windowWidth === "mobile" && (
          <div
            className={`${styles.filterPopup
              } top-0 start-0 h-100 col-12 position-fixed ${filterPopup === true ? "d-inline-flex" : "d-none"
              } flex-column overflow-y-auto`}
          >
            <div
              className={`${styles.PageHeader} position-sticky top-0 start-0 col-12 d-inline-flex gap-2`}
            >
              <div
                className={`${styles.backBox} d-inline-flex align-items-center justify-content-center flex-shrink-0`}
                onClick={() => setFilterPopup(false)}
              >
                <BackArrowIcon color="#FFF" />
              </div>
              <div className="d-inline-flex align-items-center mw-100 flex-shrink-1 col-6 me-auto">
                <label
                  className={`${styles.currentName} text-truncate col-12 d-inline-block`}
                >
                  Filter
                </label>
              </div>
            </div>
            <SearchFilter
              filterVert={filterVert}
              filterCatg={filterCatg}
              setProductData={setProductData}
              setProductActualData={setProductActualData}
            />
            <div
              className={`${styles.productBtnBox} d-inline-flex align-items-stretch col-12 position-sticky bottom-0 start-0`}
            >
              <span
                className={`${styles.saveFilterBtn} position-relative col-12 d-inline-flex align-items-center justify-content-center gap-2`}
                onClick={() => setFilterPopup(false)}
              >
                Apply Filter
              </span>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </React.Fragment>
  );
};
