import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SearchCategoryFilter } from "../../Components/Filter/SearchCategoryFilter";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { ProductListLoader } from "../../Components/Loader/Loader";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import {
    BackArrowIcon,
    FilterIcon,
    OrderIcon,
    SortByIcon,
} from "../../Components/siteIcons";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./CategoryPage.module.css";
import AdaptiveLoader from "../../Components/AdaptiveLoader/AdaptiveLoader";

export const StoreProductCategory = () => {
    const locationState = useLocation();
    const { category } = useParams();
    const navigate = useNavigate();
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
    const [brands, setBrands] = useState([]);

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
        ApiService.CategoryByProd(data)
            .then((res) => {
                if (res.message === "Fetch successfully.") {
                    console.log(res.payload_CategoryByProduct);
                    setProductData(res.payload_CategoryByProduct?.products);
                    setProductActualData(res.payload_CategoryByProduct?.products)
                    setBrands(res.payload_CategoryByProduct?.brands);
                    setLoading(false);
                    setApiPayload((prev) => ({ ...prev, page: 2 }));
                }
            })
            .catch((err) => { });
    };

    const LoadMoreProducts = () => {
        let pageCount = apiPayload?.page;
        pageCount = pageCount + 1;
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
    };

    useEffect(() => {
        setLoading(true);
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            category_slug: category,
        };
        setFilterVert(category)
        // setFilterVert(locationState?.state?.verticalId);
        // setFilterCatg(locationState?.state?.categoryId);
        payload.page = 1;
        payload.result_per_page = 10;
        console.log(payload);
        console.log(locationState);
        setApiPayload(payload);
        fetchProductsList(payload);
    }, [category, navigate]);

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
                className={`mt-4 col-12 d-inline-flex flex-column`}>
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
                    {loading && <AdaptiveLoader />}
                    {loading === false && (
                        <div
                            className={`d-inline-flex  flex-column col-12 mb-3`}
                            id="scrollableDiv"
                        >
                            <div className={`d-inline-flex  align-items-start col-12 gap-2`}>
                                {filterVert !== null &&
                                    filterVert !== undefined && (
                                        <div
                                            className={`${styles.filterSticky} hideInMobile col-3 position-sticky flex-shrink-1 d-inline-flex`}
                                        >
                                            <SearchCategoryFilter
                                                categorySlug={category}
                                                filterVert={filterVert}
                                                filterCatg={filterCatg}
                                                setProductData={setProductData}
                                                setProductActualData={setProductActualData}
                                                brands={brands}
                                            />
                                        </div>
                                    )}
                                <div
                                    className={`${styles.productContainer
                                        } flex-shrink-1  w-100 d-inline-flex flex-wrap`}>

                                    <div
                                        className={`${styles.sortContainer} hideInMobile col-12 d-inline-flex align-items-end flex-column gap-2 p-3 px-4 mb-3`}
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

                                    <div
                                        className={`${styles.productBtnBox} hideInDesktop d-inline-flex align-items-stretch col-12 bottom-0 start-0`}
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
                                aria-label="Price: Low to High"
                                onClick={() => {
                                    priceDescending();
                                    setSortPopup(false);
                                }}
                                className={`${styles.actionSheetBtn} col-12 d-inline-flex align-items-center justify-content-center`}
                            >
                                Price: Low to High
                            </button>
                            <button
                                aria-label="Price: High to Low"
                                onClick={() => {
                                    priceAscending();
                                    setSortPopup(false);
                                }}
                                className={`${styles.actionSheetBtn} col-12 d-inline-flex align-items-center justify-content-center`}
                            >
                                Price: High to Low
                            </button>
                            <button
                                aria-label="Clear All"
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
                            aria-label="Cancel"
                            onClick={() => setSortPopup(false)}
                            className={`${styles.actionSheetCnclBtn} col-12 d-inline-flex align-items-center justify-content-center`}
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {filterVert !== null &&
                    filterVert !== undefined && (
                        <div
                            className={`${styles.filterPopup
                                } hideInDesktop top-0 start-0 h-100 col-12 position-fixed ${filterPopup === true ? "d-inline-flex" : "d-none"
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
                            <SearchCategoryFilter
                                categorySlug={category}
                                filterVert={filterVert}
                                filterCatg={filterCatg}
                                setProductData={setProductData}
                                setProductActualData={setProductActualData}
                                brands={brands}
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