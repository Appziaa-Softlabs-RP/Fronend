import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { ProductListLoader } from "../../Components/Loader/Loader";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import {
  OrderIcon
} from "../../Components/siteIcons";
import ApiService from "../../services/ApiService";
import styles from "./CategoryPage.module.css";

export const CategoryPage = () => {
  const locationState = useLocation();
  const [ProductData, setProductData] = useState([]);
  const [ProductActualData, setProductActualData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortPopup, setSortPopup] = useState(false);
  const [filterPopup, setFilterPopup] = useState(false);
  const [filterVert, setFilterVert] = useState(null);
  const [filterCatg, setFilterCatg] = useState(null);
  const [apiPayload, setApiPayload] = useState(null);
  const [isDescendingOrder, setIsDscendingOrder] = useState(false);
  const [isAscendingOrder, setIsAscendingOrder] = useState(false);

  const resetSortFilter = () => {
    let originalProduct = [...ProductActualData];
    setProductData(originalProduct);
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

  const fetchProductsList = (data) => {
    if (locationState.state.category === "SHOP") {
      ApiService.ageGroupProduct(data)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            setProductData(res.payload_ageGroupByProduct);
            setProductActualData(res.payload_ageGroupByProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: 2 }));
          }
        })
        .catch((err) => { });
    } else if (locationState.state.category === "Brand") {
      ApiService.brandProduct(data)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            setProductData(res.payload_BrandByProduct);
            setProductActualData(res.payload_BrandByProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: 2 }));
          }
        })
        .catch((err) => { });
    } else {
      ApiService.CategoryByProd(data)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            setProductData(res.payload_CategoryByProduct);
            setProductActualData(res.payload_CategoryByProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: 2 }));
          }
        })
        .catch((err) => { });
    }
  };

  const LoadMoreProducts = () => {
    let pageCount = apiPayload?.page;
    pageCount = pageCount + 1;
    if (locationState.state.category === "SHOP") {
      ApiService.ageGroupProduct(apiPayload)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            let prevProdArr = [];
            prevProdArr = ProductData;
            let newProd = res.payload_ageGroupByProduct;
            for (let i = 0; i < newProd.length; i++) {
              prevProdArr.push(newProd[i]);
            }
            let newProduct = [...prevProdArr];
            setProductData(newProduct);
            setProductActualData(newProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: pageCount }));
          }
        })
        .catch((err) => { });
    } else if (locationState.state.category === "Brand") {
      ApiService.brandProduct(apiPayload)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            let prevProdArr = [];
            prevProdArr = ProductData;
            let newProd = res.payload_BrandByProduct;
            for (let i = 0; i < newProd.length; i++) {
              prevProdArr.push(newProd[i]);
            }
            let newProduct = [...prevProdArr];
            setProductData(newProduct);
            setProductActualData(newProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: pageCount }));
          }
        })
        .catch((err) => { });
    } else {
      ApiService.CategoryByProd(apiPayload)
        .then((res) => {
          if (res.message === "Fetch successfully.") {
            let prevProdArr = [];
            prevProdArr = ProductData;
            let newProd = res.payload_CategoryByProduct;
            for (let i = 0; i < newProd.length; i++) {
              prevProdArr.push(newProd[i]);
            }
            let newProduct = [...prevProdArr];
            setProductData(newProduct);
            setProductActualData(newProduct);
            setLoading(false);
            setApiPayload((prev) => ({ ...prev, page: pageCount }));
          }
        })
        .catch((err) => { });
    }
  };

  useEffect(() => {
    setLoading(true);
    const payload = locationState.state.payload;
    setFilterVert(locationState?.state?.verticalId);
    setFilterCatg(locationState?.state?.categoryId);
    payload.page = 1;
    payload.result_per_page = 10;
    console.log(payload);
    console.log(locationState);
    setApiPayload(payload);
    fetchProductsList(payload);
  }, [locationState]);

  return (
    <React.Fragment>
      {/* Mobile Structure */}
      <div className="hideInDesktop">
        <PageHeader title="Explore Category" />
      </div>

      {/* Desktop Structure */}
      <div className="hideInMobile">
        <Header />
      </div>

      <div
        className={`mt-4 col-12 d-inline-flex flex-column mt-4`}
      >
        <div className="hero">
          {locationState?.state?.banner !== "" &&
            locationState?.state?.banner !== null &&
            locationState?.state?.banner !== undefined && (
              <div
                className={`${styles.ageBannerRow} col-12 d-inline-flex mb-4`}
              >
                <img
                  src={locationState.state.banner[0]?.image}
                  alt="Banner"
                  className="col-12 d-inline-block"
                />
              </div>
            )}
          {loading && <ProductListLoader />}
          {loading === false && (
            <div
              className={`d-inline-flex flex-column col-12 mb-3`}
              id="scrollableDiv"
            >
              <div className={`d-inline-flex align-items-start col-12 gap-2`}>
                <div
                  className={`${styles.productContainer
                    } flex-shrink-1 d-inline-flex flex-wrap`}>
                  {ProductData?.length > 0 ? (
                    <InfiniteScroll
                      className="d-inline-flex col-12 flex-wrap"
                      dataLength={ProductData.length}
                      next={LoadMoreProducts}
                      hasMore={true}
                    >
                      {ProductData?.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            {item.name !== "" && (
                              <div
                                className={`${styles.productCardBox} px-2 flex-shrink-0 mb-3`}
                                key={index}
                                role="button"
                              >
                                <ProductCard item={item} index={index} />
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </InfiniteScroll>
                  ) : (
                    <React.Fragment>
                      <div
                        className={`${styles.emptyProduct} d-inline-flex align-items-center justify-content-center flex-column gap-4 p-4 col-12`}
                      >
                        <OrderIcon color="#888" />
                        <label
                          className={`${styles.emptyProductText} col-12 text-center`}
                        >
                          No Products Found
                        </label>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
