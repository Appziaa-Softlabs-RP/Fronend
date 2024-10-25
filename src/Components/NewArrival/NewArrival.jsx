import React, { useEffect, useRef, useState } from "react";
import styles from './NewArrival.module.css';
import ReactOwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import { ProductCard } from "../ProductCard/ProductCard";

export const NewArrival = () => {
    const appData = useApp();
    const carouselRef = useRef(null);
    let windowWidth = appData.appData.windowWidth;
    const [productData, setProductData] = useState([]);

    useEffect(() => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID)
        }
        ApiService.newArrivals(payload).then((res) => {
            setProductData(res.payload_newarrivalRandom);
        }).catch((err) => {

        });
    }, []);

    const responsiveItems =
        window.innerWidth >= 1300
            ? 4
            : window.innerWidth >= 1100
                ? 4
                : window.innerWidth >= 1000
                    ? 3
                    : window.innerWidth >= 500
                        ? 2
                        : 1;


    return (
        <div className="position-relative">
            {productData?.length > 0 &&
                <div className={`col-12 ${styles.newArrivalContainer} ${windowWidth === "desktop" && 'p-3 mt-2'} py-5 d-inline-flex`} style={{
                    background: "#522627"
                }}>
                    <div className={`${windowWidth === "mobile" && 'p-0'} container`}>
                        <div className={`col-12 position-relative ${windowWidth === 'mobile' ? 'p-3' : 'mt-3'} d-inline-flex flex-column`}>
                            <h2 className={`${styles.title} textSpecial text-center mb-4`}>
                                <span className="text-white" style={{
                                    textDecoration: 'underline',
                                }}>Season's</span>{' '}
                                <span style={{ color: "#ffa500" }}>flavour</span>
                            </h2>
                            <div className="d-md-flex align-items-center">
                                <ReactOwlCarousel ref={carouselRef} className={`${styles.brandSilder} brandSilder col-12 my-4 owl-theme`}
                                    margin={10}
                                    dots={false}
                                    items={responsiveItems}
                                    loop={false}
                                    nav={false}
                                    stagePadding={`${windowWidth === 'mobile' ? 50 : 0}`}>
                                    {/* {productData?.map((item, index) => { */}
                                    {/* show in descending order according sort by stock */}
                                    {productData?.sort((a, b) => b.stock - a.stock).map((item, index) => {
                                        return (
                                            <div key={index} className={`${styles.brandItemCard} item flex-shrink-1 d-inline-block position-relative text-decoration-none col-12 overflow-hidden mouse-cursor`}>
                                                <ProductCard item={item} index={index} />
                                            </div>
                                        );
                                    })}
                                </ReactOwlCarousel>
                                {/* Custom Navigation Buttons */}
                                <div className={styles.customNav}>
                                    <button className={`${styles.navButton} ${styles.prev}`} onClick={() => carouselRef.current.prev()}>
                                        ‹
                                    </button>
                                    <button className={`${styles.navButton} ${styles.next}`} onClick={() => carouselRef.current.next()}>
                                        ›
                                    </button>
                                </div>
                            </div>
                            <Link to="/store-product/vertical/chaina-ram/category/sweets" className="mx-auto" style={{
                                width: "fit-content",
                            }}>
                                <button className={`btn ${styles.exploreBtn} px-5`}>
                                    EXPLORE MORE
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}