import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { ProductListLoader } from "../../Components/Loader/Loader";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import {
    OrderIcon
} from "../../Components/siteIcons";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./CategoryPage.module.css";

export const StoreProductCategory = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiPayload, setApiPayload] = useState(null);
    const [isDescendingOrder, setIsDescendingOrder] = useState(false);
    const [isAscendingOrder, setIsAscendingOrder] = useState(false);
    const [isEndOfProducts, setIsEndOfProducts] = useState(false);
    const observerRef = useRef(null);
    const loadingRef = useRef(false);

    const resetSortFilter = useCallback(() => {
        setProductData(prevData => [...prevData]);
        setIsDescendingOrder(false);
        setIsAscendingOrder(false);
    }, []);

    const priceAscending = useCallback(() => {
        setProductData(prevData =>
            [...prevData].sort((p1, p2) => parseInt(p2.mrp) - parseInt(p1.mrp))
        );
        setIsAscendingOrder(true);
        setIsDescendingOrder(false);
    }, []);

    const priceDescending = useCallback(() => {
        setProductData(prevData =>
            [...prevData].sort((p1, p2) => parseInt(p1.mrp) - parseInt(p2.mrp))
        );
        setIsDescendingOrder(true);
        setIsAscendingOrder(false);
    }, []);

    const fetchProductsList = useCallback((payload, isInitial=false) => {
        console.log(payload)
        ApiService.CategoryByProd(payload)
            .then((res) => {
                if (res.payload_getProductByCategory?.products.length === 0) {
                    setIsEndOfProducts(true);
                    return;
                }
                setProductData(prevData => [...prevData, ...res.payload_getProductByCategory?.products]);
                setApiPayload(prevPayload => ({
                    ...prevPayload,
                    page: isInitial ? 1 : prevPayload.page + 1
                }));
            })
            .catch((err) => console.error(err))
            .finally(() => {
                setLoading(false);
                loadingRef.current = false;
            });
    }, []);

    const loadMoreProducts = useCallback(() => {
        if (isEndOfProducts || loadingRef.current || !apiPayload) return;
        loadingRef.current = true;
        fetchProductsList(apiPayload);
    }, [apiPayload, isEndOfProducts, fetchProductsList]);

    useEffect(() => {
        setLoading(true);
        setProductData([]);
        setIsEndOfProducts(false);
        const initialPayload = {
            store_id: parseInt(enviroment.STORE_ID),
            category_slug: category,
            page: 1,
            result_per_page: 40
        };
        setApiPayload(initialPayload);
        fetchProductsList(initialPayload, true);
    }, [category, fetchProductsList]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingRef.current) {
                    loadMoreProducts();
                }
            },
            { threshold: 0.1 }
        );

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [loadMoreProducts]);

    return (
        <React.Fragment>
            <div className="hideInDesktop">
                <PageHeader title="Explore Category" />
            </div>

            <div className="hideInMobile">
                <Header />
            </div>

            <div className={`mt-4 col-12 d-inline-flex flex-column`}>
                <div className="hero w-100">
                    {loading && productData.length === 0 ? (
                        <ProductListLoader />
                    ) : (
                        <div className={`d-inline-flex flex-column col-12 mb-3`} id="scrollableDiv">
                            <div className={`d-inline-flex align-items-start col-12 gap-2`}>
                                <div className={`${styles.productContainer} flex-shrink-1 d-inline-flex flex-wrap w-100`}>
                                    <div className={`${styles.sortContainer} hideInMobile col-12 d-inline-flex align-items-end flex-column gap-2 p-3 px-4 mb-3`}>
                                        <span onClick={resetSortFilter} role="button" className={`${styles.clearAllBtn} d-inline-flex`}>
                                            Clear All
                                        </span>
                                        <div className="col-12 d-inline-flex justify-content-end align-items-center">
                                            <span className={`${styles.sortBy} d-inline-flex me-2`}>Sort By</span>
                                            <span
                                                onClick={priceDescending}
                                                role="button"
                                                className={`${styles.priceLow} ${isDescendingOrder ? "fw-bold" : ""} d-inline-flex px-1`}
                                            >
                                                Price: Low to High
                                            </span>
                                            <span
                                                onClick={priceAscending}
                                                role="button"
                                                className={`${styles.priceLow} d-inline-flex px-1 ${isAscendingOrder ? "fw-bold" : ""}`}
                                            >
                                                Price: High to Low
                                            </span>
                                        </div>
                                    </div>

                                    {productData.length > 0 ? (
                                        <div className="d-inline-flex col-12 flex-wrap">
                                            {productData.map((item, index) => (
                                                item.name !== "" && (
                                                    <div className={`${styles.productCardBox} px-2 flex-shrink-0 mb-3`} key={index} role="button">
                                                        <ProductCard item={item} index={index} />
                                                    </div>
                                                )
                                            ))}
                                            {!isEndOfProducts && <div ref={observerRef} style={{ height: '100px', minWidth: "200px", width: '100%' }} />}
                                        </div>
                                    ) : (
                                        <div className={`${styles.emptyProduct} d-inline-flex align-items-center justify-content-center flex-column gap-4 p-4 col-12`}>
                                            <OrderIcon color="#888" />
                                            <label className={`${styles.emptyProductText} col-12 text-center`}>
                                                No Products Found
                                            </label>
                                        </div>
                                    )}
                                    {loading && productData.length > 0 && (
                                        <div className="col-12 text-center py-3">
                                            <ProductListLoader />
                                        </div>
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
}