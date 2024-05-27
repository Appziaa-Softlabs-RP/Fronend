import React, { useEffect, useState } from "react";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./Filter.module.css";

export const SearchFilter = ({
    filterVert,
    setProductData,
    filterCatg,
    setProductActualData,
    setFilterPopup,
}) => {
    const [allBrands, setAllBrands] = useState("");
    const [allBrandLen, setAllBrandLen] = useState({
        length: 0,
        allBrands: [],
        gender: [],
        age: [],
    });

    const [searchBrand, setSearchBrand] = useState("");
    const [allfilterVal, setFilterVal] = useState({
        priceMin: "",
        priceMax: "",
        brandId: [],
        genderId: "",
        ageGroup: "",
    });

    const filterBrand = (id) => {
        setFilterVal((prevState) => {
            const brandVals = prevState.brandId ?? [];
            if (brandVals.includes(id)) {
                return {
                    ...prevState,
                    brandId: brandVals.filter((item) => item !== id),
                };
            } else {
                return {
                    ...prevState,
                    brandId: [...brandVals, id],
                };
            }
        });
    };

    const filterPrice = (min, max) => {
        setFilterVal({ ...allfilterVal, priceMax: max, priceMin: min });
        fetchFilterProd();
    };

    const filterAge = (id) => {
        setFilterVal({ ...allfilterVal, ageGroup: id });
        fetchFilterProd();
    };

    const filterGender = (id) => {
        setFilterVal({ ...allfilterVal, genderId: id });
        fetchFilterProd();
    };

    const getAgeBrandOption = (brands) => {
        const payload = {
            store_id: enviroment.STORE_ID,
            vertical_id: filterVert,
        };
        ApiService.storeFilterOption(payload)
            .then((res) => {
                let genderFilter = res?.payload_filterOption?.gender,
                    ageFilter = res?.payload_filterOption?.age_group;
                setAllBrandLen((allBrandLen) => ({
                    ...allBrandLen,
                    gender: genderFilter,
                    age: ageFilter,
                    allBrands: brands,
                    length: brands?.length,
                }));
            })
            .catch((err) => { });
    };

    useEffect(() => {
        const payload = {
            store_id: enviroment.STORE_ID,
            category_id: filterCatg,
        };
        ApiService.storeFilterBrand(payload)
            .then((res) => {
                let allBrand = res.payload_categoryByBrand;
                if (allBrand.length) {
                    allBrand.sort(function (a, b) {
                        if (a.name.toLowerCase() < b.name.toLowerCase()) {
                            return -1;
                        }
                        if (a.name.toLowerCase() > b.name.toLowerCase()) {
                            return 1;
                        }
                        return 0;
                    });
                    setAllBrands(allBrand);
                    getAgeBrandOption(allBrand);
                }
            })
            .catch((err) => {
                getAgeBrandOption();
            });
    }, [filterCatg]);

    const fetchFilterProd = () => {
        const payload = {
            store_id: enviroment.STORE_ID,
            vertical_id: filterVert,
            from_price: allfilterVal.priceMin,
            to_price: allfilterVal.priceMax,
            brand_id: allfilterVal.brandId ? allfilterVal.brandId : null,
            gender: allfilterVal.genderId ? [allfilterVal.genderId] : null,
            age: allfilterVal.ageGroup,
            page: 1,
            result_per_page: 1000,
        };

        // ApiService.storeFilterNew(payload)
        //     .then((res) => {
        //         if (res.message === "Fetch successfully.") {
        //             setProductData(res.payload_FilterByProductNew);
        //             setProductActualData(res.payload_FilterByProductNew);
        //         }
        //     })
        //     .catch((err) => { });
    };

    //update when filter value change
    useEffect(() => {
        fetchFilterProd();
    }, [allfilterVal]);

    return (
        <React.Fragment>
            <div className="col-12 d-inline-flex flex-column gap-3">
                <div
                    className={`${styles.filterBox} d-inline-flex flex-column col-12 p-3`}
                >
                    <h5 className={`${styles.filterTitle} col-12 d-inline-flex mb-4`}>
                        Brand
                    </h5>
                    <ul
                        className={`${styles.brandScroll} col-12 d-inline-flex list-unstyled flex-column gap-3 overflow-y-auto`}
                    >
                        <li
                            className={`${styles.filterSearch} col-12 position-sticky top-0 start-0 d-inline-flex align-items-center`}
                        >
                            <input
                                type="search"
                                placeholder="Search Brand"
                                // value={searchBrand}
                                className={`${styles.filterSearchInput} col-12 d-inline-flex p-3`}
                            // onChange={(e) => searchBrandName(e.target.value)}
                            />
                        </li>
                        {allBrands.length > 0 &&
                            allBrands?.map((item, index) => {
                                return (
                                    <li
                                        className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                                        key={index}
                                    >
                                        <label
                                            className="d-inline-flex align-items-center gap-2 text-capitalize"
                                            htmlFor={`brand-checkbox-${index}`}
                                        >
                                            <input
                                                id={`brand-checkbox-${index}`}
                                                onClick={(e) => filterBrand(item?.brand_id)}
                                                type="checkbox"
                                                className={`${styles.address_option}`}
                                                value={item.brand_id}
                                                name="brand"
                                            />
                                            <div
                                                className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                            ></div>
                                            {item.name}
                                        </label>
                                    </li>
                                );
                            })}
                    </ul>
                </div>

                <div
                    className={`${styles.filterBox} d-inline-flex flex-column col-12 p-3`}
                >
                    <h5 className={`${styles.filterTitle} col-12 d-inline-flex mb-4`}>
                        Age
                    </h5>
                    <ul
                        className={`${styles.brandScroll} col-12 d-inline-flex list-unstyled flex-column gap-3 overflow-y-auto`}
                    >
                        {allBrandLen.age.length > 0 &&
                            allBrandLen.age?.map((item, index) => {
                                return (
                                    <li
                                        className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                                        key={index}
                                    >
                                        <label
                                            className="d-inline-flex align-items-center gap-2 text-capitalize"
                                            onClick={() => filterAge(item.age_group_id)}
                                        >
                                            <input
                                                type="radio"
                                                className={`${styles.address_option}`}
                                                value={item.age_group_id}
                                                name="age"
                                            />
                                            <div
                                                className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                            ></div>
                                            {item.name}
                                        </label>
                                    </li>
                                );
                            })}
                    </ul>
                </div>

                <div
                    className={`${styles.filterBox} d-inline-flex flex-column col-12 p-3`}
                >
                    <h5 className={`${styles.filterTitle} col-12 d-inline-flex mb-4`}>
                        Gender
                    </h5>
                    <ul
                        className={`${styles.brandScroll} col-12 d-inline-flex list-unstyled flex-column gap-3 overflow-y-auto`}
                    >
                        {allBrandLen?.gender?.length > 0 &&
                            allBrandLen.gender?.map((item, index) => {
                                return (
                                    <li
                                        className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                                        key={index}
                                    >
                                        <label
                                            className="d-inline-flex align-items-center gap-2 text-capitalize"
                                            onClick={() => filterGender(item.gender_id)}
                                        >
                                            <input
                                                type="radio"
                                                className={`${styles.address_option}`}
                                                value={item.gender_id}
                                                name="gender"
                                            />
                                            <div
                                                className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                            ></div>
                                            {item.gender_name}
                                        </label>
                                    </li>
                                );
                            })}
                    </ul>
                </div>
                <div
                    className={`${styles.filterBox} d-inline-flex flex-column col-12 p-3`}
                >
                    <h5 className={`${styles.filterTitle} col-12 d-inline-flex mb-4`}>
                        Price
                    </h5>
                    <ul className="col-12 d-inline-flex list-unstyled flex-column gap-3">
                        <li
                            className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                        >
                            <label
                                className="d-inline-flex align-items-center gap-2"
                                onClick={() => filterPrice(1, 100)}
                            >
                                <input
                                    type="radio"
                                    className={`${styles.address_option}`}
                                    value="1,100"
                                    name="price"
                                />
                                <div
                                    className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                ></div>
                                Under ₹100
                            </label>
                        </li>
                        <li
                            className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                        >
                            <label
                                className="d-inline-flex align-items-center gap-2"
                                onClick={() => filterPrice(100, 500)}
                            >
                                <input
                                    type="radio"
                                    className={`${styles.address_option}`}
                                    value="101,500"
                                    name="price"
                                />
                                <div
                                    className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                ></div>
                                ₹101 - ₹500
                            </label>
                        </li>
                        <li
                            className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                        >
                            <label
                                className="d-inline-flex align-items-center gap-2"
                                onClick={() => filterPrice(501, 1000)}
                            >
                                <input
                                    type="radio"
                                    className={`${styles.address_option}`}
                                    value="501,1000"
                                    name="price"
                                />
                                <div
                                    className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                ></div>
                                ₹501 - ₹1000
                            </label>
                        </li>
                        <li
                            className={`${styles.filterRow} col-12 d-inline-flex align-items-center`}
                        >
                            <label
                                className="d-inline-flex align-items-center gap-2"
                                onClick={() => filterPrice(1001, 10000)}
                            >
                                <input
                                    type="radio"
                                    className={`${styles.address_option}`}
                                    value="1001,10000"
                                    name="price"
                                />
                                <div
                                    className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                                ></div>
                                ₹1001 and Above
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};