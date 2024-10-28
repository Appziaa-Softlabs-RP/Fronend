import React, { useEffect, useRef, useState } from "react";
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
    const [ProductData, setProductData] = useState([]);
    const [ProductActualData, setProductActualData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [apiPayload, setApiPayload] = useState(null);
    const [isDescendingOrder, setIsDscendingOrder] = useState(false);
    const [isAscendingOrder, setIsAscendingOrder] = useState(false);
    const [isEndOfProducts, setIsEndOfProducts] = useState(false);
    const observerRef = useRef(); // Create a ref for the observer

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
                if (res.payload_getProductByCategory?.products.length === 0) {
                    return;
                }
                setProductData(res.payload_getProductByCategory?.products);
                setProductActualData(res.payload_getProductByCategory?.products);
            })
            .catch((err) => { })
            .finally(() => {
                setLoading(false);
            });
    };

    const LoadMoreProducts = () => {
        if(isEndOfProducts) return;
        if (!apiPayload) return; // Prevent API call if payload is not set
        setApiPayload((prev) => ({ ...prev, page: prev.page + 1 }));
        ApiService.CategoryByProd(apiPayload)
            .then((res) => {
                if (res.payload_getProductByCategory?.products.length === 0) {
                    setIsEndOfProducts(true);
                    return;
                }
                const newProd = res.payload_getProductByCategory?.products;
                setProductData((prevProductData) => {
                    const updatedProducts = [...prevProductData, ...newProd];
                    setProductActualData(updatedProducts);
                    return updatedProducts;
                });
                setLoading(false);
            })
            .catch((err) => {
                console.error(err); // log any errors for debugging
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        setLoading(true);
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            category_slug: category,
        };
        payload.page = 1;
        payload.result_per_page = 40;
        setApiPayload(payload);
        fetchProductsList(payload);
    }, [category, navigate]);

    useEffect(() => {
        // Intersection Observer setup
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                LoadMoreProducts();
            }
        }, {
            threshold: 0.4 // Trigger when 50% of the target is visible
        });

        if (observerRef.current) {
            observer.observe(observerRef.current); // Observe the target
        }

        // Cleanup observer on component unmount
        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [observerRef.current]); // Run effect when observerRef changes

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

            <div className={`mt-4 col-12 d-inline-flex flex-column`}>
                <div className="hero w-100">
                    {loading ? <ProductListLoader />
                        : (
                            <div
                                className={`d-inline-flex flex-column col-12 mb-3`}
                                id="scrollableDiv"
                            >
                                <div className={`d-inline-flex align-items-start col-12 gap-2`}>
                                    <div
                                        className={`${styles.productContainer} flex-shrink-1 d-inline-flex flex-wrap w-100`}>

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

                                        {ProductData?.length > 0 ? (
                                            <div
                                                className="d-inline-flex col-12 flex-wrap"
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
                                                {/* This div is the target for the observer */}
                                                <div ref={observerRef} style={{ height: '20px' }} />
                                            </div>
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