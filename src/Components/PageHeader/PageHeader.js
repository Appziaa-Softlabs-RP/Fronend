import React, { useEffect, useState } from "react";
import { BackArrowIcon, CartIcon, CrossIcon, SearchIcon } from "../siteIcons";
import styles from "./PageHeader.module.css";
import { useNavigate } from "react-router-dom";
import { enviroment } from "../../enviroment";
import { AppNotification } from "../../utils/helper";
import ApiService from "../../services/ApiService";
import { useApp } from "../../context/AppContextProvider";

export const PageHeader = ({ title, hide }) => {
  const navigate = useNavigate();
  const [searchPop, setSeacrhPop] = useState(false);
  const [searchProd, setSearchProd] = useState("");
  const [searchProdList, setSearchProdList] = useState([]);
  const appData = useApp();

  const openCart = () => {
    navigate("/checkout");
  };

  let prodTime = "";
  const searchShopProd = (event, val) => {
    setSearchProd(val);
    clearTimeout(prodTime);
    if (val.length > 2) {
      prodTime = setTimeout(function () {
        const payload = {
          store_id: parseInt(enviroment.STORE_ID),
          keyword: val,
        };
        ApiService.storeSearch(payload)
          .then((res) => {
            if (res.message === "Fetch successfully.") {
              setSearchProdList(res.payload_searchAI);
            }
          })
          .catch((err) => {});
      }, 500);
    }
  };

  const openProductId = (prodId, name) => {
    setSearchProdList([]);
    setSearchProd(name);
    const payload = {
      product_id: prodId,
      company_id: parseInt(enviroment.COMPANY_ID),
      store_id: parseInt(enviroment.STORE_ID),
    };
    ApiService.productDetails(payload)
      .then((res) => {
        if (res.message === "Product Detail") {
          navigate(`/product?id=${prodId}`, {
            state: { product: res.payload },
          });
        } else {
          AppNotification(
            "Error",
            "Sorry, Product detail not found.",
            "danger"
          );
        }
      })
      .catch((err) => {
        AppNotification("Error", "Sorry, Product detail not found.", "danger");
      });
  };

  const handleKeyDown = (event) => {
    if (searchProd.length > 2 && event.code === "Enter") {
      let category = searchProd?.replaceAll("[^A-Za-z0-9]", "-");
      setSearchProdList([]);
      navigate(`/search-product/${category}`, {
        state: { keyword: searchProd },
      });
    }
  };

  const openSearchClick = () => {
    setSeacrhPop((x) => !x);
  };

  const closeSearchBox = () => {
    setSeacrhPop(false);
  };

  const searchTexts = [
    'Laptop Bags',
    'Sling Bags',
    'Handbags',
    'Tote',
    'Wallets',
    'Purse'
  ];

    const [placeholderText, setPlaceholderText] = useState('');
    const [currentItem, setCurrentItem] = useState(0);
    const [currentChar, setCurrentChar] = useState(0);

    useEffect(() => {
      if (currentItem < searchTexts.length) {
        if (currentChar < searchTexts[currentItem].length) {
          const timeoutId = setTimeout(() => {
            setPlaceholderText((prev) => prev + searchTexts[currentItem][currentChar]);
            setCurrentChar((prev) => prev + 1);
          }, 100); // Adjust the typing speed here
          return () => clearTimeout(timeoutId);
        } else {
          const timeoutId = setTimeout(() => {
            setPlaceholderText('');
            setCurrentChar(0);
            setCurrentItem((prev) => (prev + 1) % searchTexts.length); // Loop through items
          }, 1000); // Adjust the delay between items here
          return () => clearTimeout(timeoutId);
        }
      }
    }, [currentChar, currentItem]);

  return (
    <React.Fragment>
      <div
        className={`${styles.PageHeader} col-12 d-inline-flex gap-2 position-relative px-3`}
      >
        <div
          className={`${styles.backBox} d-inline-flex align-items-center justify-content-center flex-shrink-0`}
          onClick={() => navigate(-1)}
        >
          <BackArrowIcon color="#FFF" />
        </div>
        <div className="d-inline-flex align-items-center mw-100 flex-shrink-1 col-6 me-auto">
          <label
            className={`${styles.currentName} text-truncate col-12 d-inline-block`}
          >
            {title}
          </label>
        </div>
        <div
          className={`${
            hide === true ? "d-none" : "d-inline-flex"
          } align-items-center`}
        >
          <div
            className={`${styles.backBox} d-inline-flex align-items-center justify-content-center flex-shrink-0`}
            onClick={() => openSearchClick()}
          >
            <SearchIcon color="#FFF" />
          </div>
          <div
            className={`${styles.backBox} d-inline-flex align-items-center justify-content-center flex-shrink-0`}
            onClick={() => openCart()}
          >
            <CartIcon color="#FFF" />
            <span
              className={`${styles.cartQtyCount} d-inline-flex align-items-center justify-content-center text-center position-absolute align-top me-3`}
            >
              {appData?.appData?.cartCount}
            </span>
          </div>
        </div>
        <div
          className={`${
            styles.searchPopup
          } col-12 position-absolute align-items-center start-0 p-3 top-0 ${
            searchPop === true ? "d-inline-flex gap-1" : "d-none"
          }`}
        >
          <div className="col-12 d-inline-flex align-items-center position-relative">
            <input
              type="text"
              placeholder={'Search For '+placeholderText}
              className={`${styles.searchProdInput} col-12 flex-shrink-1 d-inline-block`}
              value={searchProd}
              onChange={(e) => searchShopProd(e, e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <span
              className={`${styles.closePopupBox} flex-shrink-0 d-inline-flex align-items-center justify-content-center top-0 end-0 position-absolute`}
              onClick={() => closeSearchBox()}
            >
              <CrossIcon color="#000" />
            </span>
          </div>
          {searchProdList?.length > 0 && (
            <div
              className={`${styles.showSearchList} ${styles.showSearchListMobile} position-absolute d-inline-flex flex-column start-0 col-11 end-0 m-auto overflow-y-auto`}
            >
              {searchProdList.map((item, idx) => {
                return (
                  <span
                    className={`${styles.searchRow} p-3 d-inline-block text-truncate col-12`}
                    role="button"
                    key={idx}
                    onClick={() => openProductId(item.id, item.name)}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );
};
