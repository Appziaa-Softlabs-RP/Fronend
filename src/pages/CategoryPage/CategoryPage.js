import React, { useEffect, useState } from "react";
import styles from './CategoryPage.module.css';
import { useLocation } from "react-router-dom";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { ProductCard } from "../../Components/ProductCard/ProductCard";
import { useApp } from "../../context/AppContextProvider";
import ApiService from "../../services/ApiService";
import { ProductListLoader } from "../../Components/Loader/Loader";
import { Filter } from "../../Components/Filter/Filter";

export const CategoryPage = () => {
    const locationState = useLocation();
    const [ProductData, seProductData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterVert, setFilterVert] = useState(null);
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    useEffect(() => {
        const payload = locationState.state.payload;
        setFilterVert(locationState.state.verticalId);
        if (locationState.state.category === 'SHOP') {
            ApiService.ageGroupProduct(payload).then((res) => {
                if (res.message === "Fetch successfully.") {
                seProductData(res.payload_ageGroupByProduct);
                setLoading(false);
                }
            }).catch((err) => {

            });
        } else if (locationState.state.category === 'Brand') {
            ApiService.brandProduct(payload).then((res) => {
                if (res.message === "Fetch successfully.") {
                seProductData(res.payload_BrandByProduct);
                setLoading(false);
                }
            }).catch((err) => {

            });
        } else {
            ApiService.CategoryByProd(payload).then((res) => {
                if (res.message === "Fetch successfully.") {
                seProductData(res.payload_CategoryByProduct);
                setLoading(false);
                }
            }).catch((err) => {

            });
        }
    }, [locationState]);

    return (
        <React.Fragment>
            {windowWidth === "mobile"
                ? <PageHeader title="Explore Category" />
                : windowWidth === "desktop"
                ? <Header />
                : ''
            }

            <div className="col-12 d-inline-flex mt-5">
                <div className="container">
                    {locationState?.state?.banner !== '' && locationState?.state?.banner !== null && locationState?.state?.banner !== undefined &&
                        <div className={`${styles.ageBannerRow} col-12 d-inline-flex mb-4`}>
                        <img src={locationState.state.banner[0].image} alt="Banner" className="col-12 d-inline-block" />
                        </div>
                    }
                    {loading && <ProductListLoader />}
                    <div className={`d-inline-flex align-items-start col-12 mb-3 gap-2`}>
                        {console.log(filterVert)}
                        {windowWidth === "desktop" && filterVert !== null &&  filterVert !== undefined &&
                            <div className={`${styles.filterSticky} col-3 position-sticky flex-shrink-1 d-inline-flex`}>
                                <Filter filterVert={filterVert} seProductData={seProductData} />
                            </div>
                        }
                        <div className={`${windowWidth === "mobile" ? 'col-12' : filterVert !== null && filterVert !== undefined ? 'col-9' : 'col-12'} flex-shrink-1 d-inline-flex flex-wrap`}>
                            {ProductData?.length > 0 && ProductData?.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        {item.name !== '' &&
                                            <div className={`${windowWidth === "mobile" ? 'col-6' : filterVert !== null && filterVert !== undefined ? 'col-4' : 'col-3'} px-2 flex-shrink-0 mb-3`} key={index} role="button">
                                            <ProductCard item={item} index={index} />
                                            </div>
                                        }
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}