import React, { useEffect, useState } from "react";
import styles from "./CategoryShop.module.css";
import ApiService from "../../services/ApiService";
import { enviroment } from "../../enviroment";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";

export const CategoryShop = () => {
    const [shopCategory, setShopCategory] = useState([]);
    const navigate = useNavigate();
    const appData = useApp();

    let windowWidth = appData.appData.windowWidth;

    const getCategoryProd = (name, name_url) => {
        navigate(`/store/${name_url}`);
    };

    useEffect(() => {
        const payload = {
            store_id: parseInt(enviroment.STORE_ID),
        };
        ApiService.StoreCategory(payload)
            .then((res) => {
                setShopCategory(res?.payload_verticalList?.vertical);
            })
            .catch((err) => { });
    }, []);
    return (
        <React.Fragment>
            {shopCategory.length > 0 && (
                <div className="col-12 d-inline-flex flex-column p-3">
                    <div
                        className={`${styles.categoryBox} col-12 d-inline-flex flex-column py-2`}
                    >
                        {windowWidth === "desktop" && (
                            <h2
                                className={`${styles.categoryHeaderTitle} col-12 d-inline-flex justify-content-center mt-4 mb-3 fs-2 `}
                            >
                                Shop By Category
                            </h2>
                        )}
                        {windowWidth === "mobile" && (
                            <h2
                                className={`${styles.exploreByCategoryHeader} mb-2 ps-3 d-inline-block col-12 text-black fs-3 py-2`}
                            >
                                Shop By Category
                            </h2>
                        )}
                        <div
                            className={`${styles.lookingContainer} col-12 px-2 d-inline-flex flex-wrap align-items-stretch p-0 row-gap-3`}
                        >
                            {shopCategory.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`${styles.categoryblock} d-inline-flex flex-column gap-2`}
                                        onClick={() => getCategoryProd(item?.name, item?.name_url)}
                                    >
                                        <div
                                            className={`${styles.imgBox} d-inline-flex align-items-center justify-content-center overflow-hidden`}
                                        >
                                            <img
                                                src={item.image}
                                                alt={item?.name}
                                                className="object-fit-cover h-100 col-12 d-inline-block start-0 top-0"
                                            />
                                        </div>
                                        <p
                                            className={`${styles.categoryProdName} col-12 text-center m-0 fs-6`}
                                        >
                                            {item?.name}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </React.Fragment>
    );
};