import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { useEffect, useState } from "react";
import ReactOwlCarousel from 'react-owl-carousel';
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from './NewArrival.module.css';

export const NewArrival = () => {
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;
    const [productData, setProductData] = useState([]);
    const isMobile = windowWidth === "mobile";

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
        <React.Fragment>
            {productData?.length > 0 &&
                <div className={`col-12 py-5 ${styles.container} ${windowWidth === "desktop" && 'p-3 mt-2'} d-inline-flex`}>
                    <div className={`container-fluid`}>
                        {/* <div className={`col-12 ${windowWidth === 'mobile' ? 'p-3' : 'mt-3'} position-relative d-inline-flex flex-column`}> */}
                        <div className={`col-12 d-inline-flex flex-column`} style={{
                            maxWidth: "100%",
                        }}>
                            <h2 className={`${styles.brandInTitle} text-white text-center pb-4 col-12 ${windowWidth === "desktop" ? 'mb-4 fs-2' : 'mb-3 fs-3'} mt-0 fs-2`}>'✨ New Arrivals! ✨'</h2>
                            <ReactOwlCarousel
                                className={`${styles.brandSilder} brandSilder col-12 owl-theme`}
                                margin={20}
                                dots={false}
                                items={isMobile ? 1 : 3}
                                loop={false}
                                nav={true}
                                stagePadding={isMobile ? 50 : 0}
                                responsive={{
                                    0: { items: 1.5 },
                                    768: { items: 2 },
                                    992: { items: 3 },
                                    1210: { items: 4 },
                                }}
                            >
                                {
                                    productData?.sort((a, b) => b.stock - a.stock).map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="item p-md-2"
                                                style={{
                                                    transition: "transform 0.3s",
                                                    cursor: "pointer",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "scale(1.05)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "scale(1)";
                                                }}
                                            >
                                                <ProductCard item={item} index={index} />
                                            </div>
                                        );
                                    })
                                }
                            </ReactOwlCarousel>
                        </div>
                    </div>
                </div>
            }
        </React.Fragment >
    )
}