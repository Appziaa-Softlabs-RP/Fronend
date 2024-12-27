import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import React, { useEffect, useState } from "react";
import ReactOwlCarousel from 'react-owl-carousel';
import { Link } from 'react-router-dom';
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { ProductCard } from "../ProductCard/ProductCard";
import { PromoBanner } from '../PromoBanner/PromoBanner';
import { Button } from 'react-bootstrap';

export const HomeCategories = () => {
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;
    const [categoriesData, setCategoriesData] = useState([]);
    const isMobile = windowWidth === "mobile";

    useEffect(() => {
        const payload = {
            company_id: parseInt(enviroment.COMPANY_ID),
            store_id: parseInt(enviroment.STORE_ID)
        }
        ApiService.homeCategories(payload).then((res) => {
            setCategoriesData(res.payload);
        }).catch((err) => {

        });
    }, []);
    return (
        categoriesData?.length > 0 &&
        categoriesData.map((category, index) => (
            <>
                {index === 1 &&
                    <>
                        <PromoBanner type="Promo Banner" />
                    </>}

                <div className='border-section'>
                    <div className={`col-12 d-inline-flex`}>
                        <div className={`container-md-fluid container`}>
                            <div className={`col-12 ${windowWidth === 'mobile' ? 'px-3' : 'm-0'} d-inline-flex flex-column`}>
                                <div className="titlesWrapper">
                                    <p
                                        className={`subTitleLarge col-12`}
                                    >
                                        {category?.cname}
                                    </p>
                                </div>
                                <ReactOwlCarousel
                                    className="owl-theme"
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
                                    {category?.products.map((item, index) => (
                                        <div
                                            key={index}
                                            className="item"
                                            style={{
                                                padding: "15px",
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
                                    ))}
                                </ReactOwlCarousel>
                                <Link to={`/store-product/${category?.cname_url}`} className='w-fit mx-auto'>
                                    <Button className='titleMainSmall btn-special p-3'>
                                        View All products
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ))

    )
}
