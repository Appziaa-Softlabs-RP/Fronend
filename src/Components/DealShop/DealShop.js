import React, { useEffect, useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { ProductCard } from "../ProductCard/ProductCard";
import styles from './DealShop.module.css';

export const DealShop = () => {
    const [dealsProd, setDealsProd] = useState(null);
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    useEffect(() => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID)
        }
        ApiService.DealsOfProduct(payload).then((res) => {
            if (res.message === "Fetch successfully.") {
                setDealsProd(res.payload_normalDeals.product);
            }
        }).catch((err) => {

        });
    }, []);
    return (
        <React.Fragment>
            {dealsProd?.length > 0 &&
                <div className="col-12 d-inline-flex flex-column justify-content-center">
                    <div className={`${windowWidth === "mobile" && 'p-3'} container d-flex flex-column`}>
                        <div className="col-12 d-inline-flex justify-content-center">
                            {windowWidth === 'desktop' ? (
                                <h5 className={`${styles.categoryHeaderTitle} col-12 d-inline-flex justify-content-center mt-4 mb-3`}>✨ Deals of the day ✨</h5>
                            ) : windowWidth === 'mobile' ? (
                                <h5 className={`${styles.exploreByCategoryHeader} mb-2 ps-3 d-inline-block col-12`}>Deals of the day</h5>
                            ) : ('')}
                        </div>
                        <ReactOwlCarousel className={`dealsShop col-12 d-inline-block owl-theme`} margin={10} loop={false} dots={false} items={`${windowWidth === 'desktop' ? 4 : windowWidth === 'mobile' ? 2 : ''}`} stagePadding={`${windowWidth === 'desktop' ? 0 : windowWidth === 'mobile' ? 20 : ''}`}>
                            {dealsProd?.map((item, indx) => {
                                return (
                                    <ProductCard item={item} index={indx} key={indx} />
                                )
                            })}
                        </ReactOwlCarousel>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}