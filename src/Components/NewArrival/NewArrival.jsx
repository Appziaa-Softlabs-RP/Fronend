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
                <div className={`col-12 ${windowWidth === "desktop" && 'p-3 mt-2'} d-inline-flex`}>
                    <div className={`${windowWidth === "mobile" && 'p-0'} container`}>
                        <div className={`col-12 ${windowWidth === 'mobile' ? 'p-3' : 'mt-3'} d-inline-flex flex-column`}>
                            <h2 className={`${styles.brandInTitle} col-12 ${windowWidth === "desktop" ? 'mb-4 fs-2' : 'mb-3 fs-3'} mt-0 fs-2`}>{windowWidth === 'mobile' ? 'New Arrivals!' : '✨ New Arrivals! ✨'}</h2>
                            <ReactOwlCarousel className={`${styles.brandSilder} brandSilder col-12 owl-theme`}
                                margin={10}
                                dots={false}
                                items={responsiveItems}
                                loop={false}
                                nav={true}
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
                        </div>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}