import React, { useEffect, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./Filter.module.css";

export const SearchFilter = ({
  filterVert,
  setProductData,
  filterCatg,
  setProductActualData,
  setFilterPopup,
  setProductDataLen,
  keyword = null
}) => {
  const [allBrands, setAllBrands] = useState("");
  const [allBrandLen, setAllBrandLen] = useState({
    length: 0,
    allBrands: [],
    gender: [],
    age: [],
  });

  const [allfilterVal, setFilterVal] = useState({
    priceMin: "",
    priceMax: "",
    brandsName: [],
    genderName: "",
    ageGroup: "",
  });

  const filterBrand = (id) => {
    setFilterVal((prevState) => {
      const brandVals = prevState.brandsName ?? [];
      if (brandVals.includes(id)) {
        return {
          ...prevState,
          brandsName: brandVals.filter((item) => item !== id),
        };
      } else {
        return {
          ...prevState,
          brandsName: [...brandVals, id],
        };
      }
    });
  };

  const filterPrice = (min, max) => {
    setFilterVal({ ...allfilterVal, priceMax: max, priceMin: min });
    fetchFilterProd();
  };

  const resetFilterPrice = () => {
    setFilterVal({ ...allfilterVal, priceMax: "", priceMin: "" });
    fetchFilterProd();
  };

  const filterAge = (id) => {
    setFilterVal({ ...allfilterVal, ageGroup: id });
    fetchFilterProd();
  };

  const resetFilterAge = () => {
    setFilterVal({ ...allfilterVal, ageGroup: "" });
    fetchFilterProd();
  };

  const filterGender = (id) => {
    setFilterVal({ ...allfilterVal, genderName: id });
    fetchFilterProd();
  };

  const resetFilterGender = () => {
    setFilterVal({ ...allfilterVal, genderName: "" });
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
        setAllBrands(res?.payload_filterOption?.brand);
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
      keyword: keyword,
      gender: (allfilterVal?.genderName && allfilterVal?.genderName) != '' ? allfilterVal?.genderName : null,
      price_to: allfilterVal.priceMax ? allfilterVal.priceMax : null,
      price_from: allfilterVal.priceMin ? allfilterVal.priceMin : null,
      age: allfilterVal.ageGroup ? allfilterVal.ageGroup : null,
      brand: allfilterVal.brandsName ? allfilterVal.brandsName : null,
      // brand_id: allfilterVal.brandsName ? allfilterVal.brandsName : null,
      page: 1,
      result_per_page: 1000,
    };

    ApiService.storeSearch(payload)
      .then((res) => {
        if (res.message === "Fetch successfully.") {
          setProductData(res.payload_searchAI);
          setProductActualData(res.payload_searchAI);
          setProductDataLen(res.payload_searchAI.length);
        }
      })
      .catch((err) => { });
  };

  //update when filter value change
  useEffect(() => {
    fetchFilterProd();
  }, [allfilterVal]);

  return (
    <div className="h-100">
      <div className={`${styles.filterContainer} col-12 d-inline-flex flex-column gap-1`} style={{
        top: "140px"
      }}>
        <div className="ps-3 pt-3" style={{
          borderBottom: "1px solid #e5e5e5",
        }}>
          <h2 className={styles.filterTitle} >Filters</h2>
          <div className={styles.filterTagContainer}>
            {
              allfilterVal?.brandsName?.length > 0 &&
              // show selected brands as tags
              allfilterVal?.brandsName?.map((brandName, index) => {
                // const brand = allBrands.find((brand) => brand.brand_id === item);
                return (
                  <p className={styles.filterTag}>
                    {brandName}
                    <span
                      role="button"
                      key={index}
                      onClick={() => filterBrand(brandName)}
                    >
                      X
                    </span>
                  </p>
                );
              })
            }
          </div>
          <div className={styles.filterTagContainer}>
            {allfilterVal?.priceMin && allfilterVal?.priceMax && (
              <p className={styles.filterTag}>
                Price: ₹{allfilterVal?.priceMin} - ₹{allfilterVal?.priceMax}
                <span role="button" onClick={resetFilterPrice}>
                  X
                </span>
              </p>
            )}
          </div>
        </div>
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
              <p className={styles.filterSearchIcon}>
                <Search />
              </p>
              <input
                type="search"
                placeholder="Search Brand"
                className={`${styles.filterSearchInput} col-12 d-inline-flex p-3`}
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
                        onClick={(e) => filterBrand(item?.brand_name)}
                        type="checkbox"
                        checked={allfilterVal?.brandsName?.includes(item?.brand_name)}
                        className={`${styles.address_option}`}
                        value={item.brand_id}
                        name="brand"
                      />
                      <div
                        className={`${styles.customRadio} d-inline-flex flex-shrink-0 me-1 position-relative`}
                      ></div>
                      {item.brand_name}
                    </label>
                  </li>
                );
              })}
          </ul>
        </div>

        <div
          className={`${styles.filterBox} d-inline-flex flex-column col-12 p-3`}
        >
          <div className="mb-4 d-flex align-items-center justify-content-between">
            <h5 className={`${styles.filterTitle}`}>Price</h5>
            <div
              style={{
                display: "flex",
                padding: "10px",
                justifyContent: "end",
              }}
            >
              <button
                onClick={resetFilterPrice}
                style={{
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  width: "fit-content",
                }}
              >
                Clear
              </button>
            </div>
          </div>
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
                  checked={
                    allfilterVal.priceMin === 1 && allfilterVal.priceMax === 100
                  }
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
                  checked={
                    allfilterVal.priceMin === 100 &&
                    allfilterVal.priceMax === 500
                  }
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
                  checked={
                    allfilterVal.priceMin === 501 &&
                    allfilterVal.priceMax === 1000
                  }
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
                  checked={
                    allfilterVal.priceMin === 1001 &&
                    allfilterVal.priceMax === 10000
                  }
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
    </div>
  );
};