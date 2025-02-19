import React, { useEffect, useState, useRef } from "react";
import ReactReactOwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import styles from "./SubCategory.module.css";
import ApiService from "../../services/ApiService";
import { enviroment } from "../../enviroment";
import { ProductCard } from "../ProductCard/ProductCard";
import { useApp } from "../../context/AppContextProvider";
import InfiniteScroll from "react-infinite-scroll-component";

let currentCat = "";
export const SubCategory = ({ categoryID }) => {
  const slideRef = useRef([]);
  const [shopCategory, setShopCategory] = useState([]);
  const [subShopCategory, setSubShopCategory] = useState([]);
  const [categoryProd, setShopCategoryProd] = useState([]);
  const [subCatActive, setSubCatActive] = useState("");
  const [activeApi, setActiveApi] = useState(null);
  const [catActive, setCatActive] = useState("");
  const [apiPayload, setApiPayload] = useState(null);
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  const getSubCategory = (id) => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
      category_id: id,
    };
    currentCat = id;
    setCatActive(id);
    setSubCatActive("");
    setActiveApi("subChild");
    ApiService.StoreSubChildCategory(payload)
      .then((res) => {
        setSubShopCategory(res?.payload_categoryBySubCategory);
      })
      .catch((err) => {});
    ApiService.CategoryByProd(payload)
      .then((res) => {
        setShopCategoryProd(res?.payload_CategoryByProduct);
      })
      .catch((err) => {});
  };

  const getSubCategoryProd = (subId) => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
      subcategory_id: subId,
      page: 1,
      result_per_page: 10,
    };
    setSubCatActive(subId);
    setApiPayload(payload);
    setActiveApi("categorySub");
    ApiService.CategoryBySubProd(payload)
      .then((res) => {
        setShopCategoryProd(res.payload_SubCategoryByProduct);
      })
      .catch((err) => {});
  };

  const getCategoryProd = (currentCat) => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
      vertical_id: currentCat,
      page: 1,
      result_per_page: 10,
    };
    setSubCatActive("");
    setApiPayload(payload);
    setActiveApi("categoryProd");
    ApiService.CategoryByProd(payload)
      .then((res) => {
        setShopCategoryProd(res.payload_CategoryByProduct);
      })
      .catch((err) => {});
  };

  const fetchProducts = () => {
    const catpayload = {
      store_id: parseInt(enviroment.STORE_ID),
      vertical_id: categoryID,
    };
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
      vertical_id: categoryID,
      page: 1,
      result_per_page: 10,
    };
    setCatActive("");
    setActiveApi("storeSub");
    ApiService.StoreSubCategory(catpayload)
      .then((res) => {
        setShopCategory(res.payload_verticalByCategory);
      })
      .catch((err) => {});

    setApiPayload(payload);
    ApiService.StoreCategoryProd(payload)
      .then((res) => {
        setShopCategoryProd(res.payload_VerticalByProduct);
      })
      .catch((err) => {});
  };

  const LoadMoreProducts = () => {
    let pageCount = apiPayload?.page;
    pageCount = pageCount + 1;

    if (activeApi === "storeSub" || activeApi === "categoryProd") {
      ApiService.StoreCategoryProd(apiPayload)
        .then((res) => {
          let prevProdArr = [];
          prevProdArr = categoryProd;
          let newProd = res.payload_VerticalByProduct;
          for (let i = 0; i < newProd.length; i++) {
            prevProdArr.push(newProd[i]);
          }
          let newProduct = [...prevProdArr];
          setShopCategoryProd(newProduct);
        })
        .catch((err) => {});
    } else if (activeApi === "categorySub") {
      ApiService.CategoryBySubProd(apiPayload)
        .then((res) => {
          let prevProdArr = [];
          prevProdArr = categoryProd;
          let newProd = res.payload_SubCategoryByProduct;
          for (let i = 0; i < newProd.length; i++) {
            prevProdArr.push(newProd[i]);
          }
          let newProduct = [...prevProdArr];
          setShopCategoryProd(newProduct);
        })
        .catch((err) => {});
    } else if (activeApi === "subChild") {
      ApiService.CategoryByProd(apiPayload)
        .then((res) => {
          let prevProdArr = [];
          prevProdArr = categoryProd;
          let newProd = res.payload_SubCategoryByProduct;
          for (let i = 0; i < newProd.length; i++) {
            prevProdArr.push(newProd[i]);
          }
          let newProduct = [...prevProdArr];
          setShopCategoryProd(newProduct);
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    shopCategory?.map((item, index) => {
      if (index === 0) {
        const payload = {
          store_id: parseInt(enviroment.STORE_ID),
          category_id: item?.category_id,
        };
        ApiService.StoreSubChildCategory(payload)
          .then((res) => {
            setSubShopCategory(res?.payload_categoryBySubCategory);
          })
          .catch((err) => {});
      }
    });
  }, [shopCategory]);
  return (
    <React.Fragment>
      {shopCategory?.length && windowWidth === "mobile" ? (
        <React.Fragment>
          <div
            className={`${styles.lookingContainer} ps-3 py-3 col-12 d-inline-flex align-items-stretch gap-3`}
          >
            <ReactReactOwlCarousel
              className={`col-12 d-inline-block owl-theme`}
              margin={20}
              loop={false}
              dots={false}
              stagePadding={20}
              items={4}
            >
              <div
                className={`${
                  catActive === "" && styles.active
                } d-inline-flex flex-column flex-shrink-0 col-12 gap-1`}
                onClick={() => fetchProducts()}
              >
                <div
                  className={`${styles.imgBox} d-inline-flex align-items-center justify-content-center col-12 overflow-hidden position-relative`}
                >
                  <img
                    src="/all-icon.png"
                    alt={"all"}
                    className="object-fit-cover h-100 col-12 d-inline-block start-0 top-0 position-absolute"
                  />
                </div>
                <p
                  className={`${styles.categoryProdName} col-12 text-center m-0`}
                >
                  All
                </p>
              </div>
              {shopCategory?.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      catActive === item?.category_id && styles.active
                    } d-inline-flex flex-column flex-shrink-0 col-12 gap-1`}
                    onClick={() => getSubCategory(item?.category_id)}
                    ref={(element) => (slideRef.current[index] = element)}
                  >
                    <div
                      className={`${styles.imgBox} d-inline-flex align-items-center justify-content-center col-12 overflow-hidden position-relative`}
                    >
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="object-fit-cover h-100 col-12 d-inline-block start-0 top-0 position-absolute"
                      />
                    </div>
                    <p
                      className={`${styles.categoryProdName} col-12 text-center m-0`}
                    >
                      {item?.name}
                    </p>
                  </div>
                );
              })}
            </ReactReactOwlCarousel>
          </div>

          {catActive != "" && (
            <div
              className={`p-3 col-12 d-inline-flex align-items-stretch gap-3 overflow-x-auto`}
            >
              <span
                onClick={() => getCategoryProd(currentCat)}
                className={`d-inline-flex align-items-center flex-shrink-0 text-nowrap ${
                  styles.productsItemsName
                } ${subCatActive === "" && styles.active}`}
              >
                All
              </span>
              {subShopCategory?.map((item, index) => {
                return (
                  <span
                    key={index}
                    onClick={() => getSubCategoryProd(item?.subcategory_id)}
                    className={`d-inline-flex align-items-center flex-shrink-0 text-nowrap ${
                      styles.productsItemsName
                    } ${
                      item?.subcategory_id === subCatActive && styles.active
                    }`}
                  >
                    {item?.name}
                  </span>
                );
              })}
            </div>
          )}
        </React.Fragment>
      ) : null}

      <div
        className={`col-12 d-inline-flex ${
          windowWidth === "desktop" && "mt-5"
        }`}
      >
        <div className={`${windowWidth === "mobile" && "p-0"} container`}>
          <InfiniteScroll
            className="col-12 d-inline-flex flex-wrap"
            dataLength={categoryProd.length}
            next={LoadMoreProducts}
            hasMore={true}
          >
            {categoryProd.map((item, index) => {
              return (
                <React.Fragment key={index}>
                  {item.name !== "" && (
                    <div
                      className={`${
                        windowWidth === "mobile" ? "col-6" : "col-3"
                      } px-2 flex-shrink-0 mb-2`}
                      key={index}
                    >
                      <ProductCard item={item} index={index} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </InfiniteScroll>
        </div>
      </div>
    </React.Fragment>
  );
};