import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import siteLogo from "../../assets/images/site_logo.png";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { CartAside } from "../CartAside/CartAside";
import { LoginPopup } from "../LoginPopup/LoginPopup";
import {
  BackArrowIcon,
  CartIcon,
  MailIcon,
  MenuIcons,
  SearchIcon,
  SupportIcon,
  UserIcon
} from "../siteIcons";
import styles from "./Header.module.css";

import { useAppStore } from "../../store";

export const Header = ({ setAsideOpen, asideOpen }) => {
  const appData = useApp();
  const [loading, setLoading] = useState(true);
  const navItems = useAppStore((state) => state.navItems);
  const setNavItems = useAppStore((state) => state.setNavItems);
  const setCategories = useAppStore((state) => state.setCategories);
  const [searchProd, setSearchProd] = useState("");
  const [searchProdList, setSearchProdList] = useState([]);
  const [loginPop, setLoginPop] = useState(false);
  const [accountOptn, setAccountOptn] = useState(false);
  const [cartPop, setCartPop] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  const [isSearch, setIsSearch] = useState(false);

  const [hoveredItem, setHoveredItem] = useState([]);
  const [hoveredPosition, setHoveredPosition] = useState({});

  const navigate = useNavigate();

  const openAsideMenu = () => {
    if (asideOpen === true) {
      setAsideOpen(false);
    } else {
      setAsideOpen(true);
    }
  };

  const openCart = () => {
    navigate("/checkout");
  };

  const routeHome = () => {
    navigate("/");
  };

  const openAccountDetail = () => {
    if (accountOptn === true) {
      setAccountOptn(false);
    } else {
      setAccountOptn(true);
    }
  };

  const userLoggedOut = () => {
    let emptyCartData = [];
    appData.setAppData({
      ...appData.appData,
      user: "",
      loggedIn: false,
      cartSaved: false,
      cartData: emptyCartData,
      cartCount: 0,
    });
    localStorage.setItem("cartData", JSON.stringify(emptyCartData));
    localStorage.removeItem("user");
    localStorage.removeItem("cartSaved");
    localStorage.removeItem("loggedIn");
    AppNotification(
      "Logged Out",
      "You have been successfully logged out.",
      "success"
    );
    navigate("/");
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
          .catch((err) => { });
      }, 500);
    }
  };

  const openProductId = (prodId, name) => {
    setSearchProdList([]);
    setSearchProd(name);
    navigate(`/product/${prodId}`);
  };

  const handleKeyDown = (event) => {
    if (searchProd.length > 2 && event.code === "Enter") {
      let category = searchProd?.replaceAll("[^A-Za-z0-9]", "-");
      setSearchProdList([]);
      navigate(`/search-product/${category}`);
    }
  };

  useEffect(() => {
    if (searchProd === "") {
      setSearchProdList([]);
    }
  }, [searchProd]);

  useEffect(() => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
    };
    ApiService.AllCategory(payload)
      .then((res) => {
        let allCatList = [];
        let allSubCategory = res?.payload_verticalWithCatList?.vertical;
        allSubCategory.map((item) => {
          if (item?.catList?.length > 0) {
            item.catList.map((catItem) => {
              let catObj = {
                verticalSlug: item.name_url,
                category: catItem,
              };
              allCatList.push(catObj);
            });
          }
        });
        setNavItems(allSubCategory);
        setCategories(allCatList);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setUserInfo(appData.appData.user);
  }, [appData?.appData]);

  const handleMouseEnter = (item, index) => {
    // if index is smae then set hoveredItem to null
    if (hoveredItem === item) {
      return handleMouseLeave();
    }
    const element = document.getElementById(`menu-${index}`);
    setHoveredItem(item);
    let pos = element.getBoundingClientRect();

    setHoveredPosition({
      left: `${[pos.left]}px`,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoveredPosition({});
  };

  // if click outside of headerNavBox or SubMenuList then call handleMouseLeave
  useEffect(() => {
    document.addEventListener("click", handleMouseLeave);
    // if click inside of headerNavBox or SubMenuList then don't do any thing
    // if click outside of headerNavBox or SubMenuList or leavethen call handleMouseLeave
    return () => {
      document.removeEventListener("click", handleMouseLeave);
    };
  }, []);

  return (
    <React.Fragment>
      {/* Desktop Structure */}
      <div className={`col-12 d-inline-flex flex-column px-5 `} style={{
        position: 'relative',
      }}>
        <div
          className={`${styles.headerRow} m-0 col-12 p-0 row d-inline-flex align-items-center`}
        >
          <div className="container-fluid p-0 w-100 mx-auto col-11 d-flex align-items-stretch">
            <div
              className={`row col-12 d-flex w-100 m-0 align-items-stretch gap-3`}
              style={{
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0px",
              }}
            >

              <div className="col-4 d-flex align-items-center">
                <span
                  className={`${styles.menuIconBox} d-md-none d-inline-flex align-items-center justify-content-center`}
                  onClick={openAsideMenu}
                >
                  <MenuIcons color={enviroment.SECONDARY_COLOR} />
                </span>
                <h1
                  onClick={() => routeHome()}
                  itemtype="http://schema.org/Organization"
                  style={{ cursor: "pointer" }}
                  className={`d-flex align-items-center justify-content-center`}
                >
                  <span className="visually-hidden">
                    {enviroment.REACT_APP_BUSINESS_NAME}
                  </span>
                  <img
                    src={siteLogo}
                    alt={enviroment.REACT_APP_BUSINESS_NAME ?? "Logo"}
                    className="object-fit-contain mt-4"
                    style={{
                      maxWidth: "80px",
                      marginTop: "10px",
                    }}
                  />
                </h1>
                <div className="d-flex d-none d-md-flex position-relative align-items-center ps-5 h-100">
                  {navItems.length > 0 &&
                    navItems.map((item, index) => (
                      <div
                        className={`${styles.headerNavBox} w-fit position-relative d-flex align-items-center m-0 h-100 px-3`}
                        key={index}
                      >
                        <span
                          className={`${styles.menuName} d-flex align-items-center gap-2`}
                        >
                          {item.name}
                        </span>
                        {item.catList?.length > 0 && (
                          <div
                            className={`${styles.SubMenuList} d-flex flex-column gap-1 position-absolute`}
                          >
                            {item.catList.map((subNme, subIdx) => (
                              <Link
                                to={`/store-product/${subNme?.name_url}`}
                                key={subIdx}
                                className={`${styles.subMenuName} col-12 d-flex align-items-center px-3 py-2`}
                                style={{
                                  textDecoration: "none",
                                }}
                              >
                                <p style={{
                                  margin: '0',
                                  padding: '0',
                                  fontSize: '16px'
                                }}>{subNme.name}</p>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="col-7 d-flex flex-row justify-content-end gap-4">
                {/* Search box */}
                <div
                  className={`${styles.supportDrop} d-flex hideInMobile align-items-center gap-1 position-relative justify-content-end ps-5`}
                  style={{
                    width: '100%',
                    maxWidth: '350px',
                  }}
                  role="button"
                  onClick={() => {
                    setIsSearch(!isSearch);
                    setSearchProd("");
                  }}
                >
                  <div className="d-flex w-100 align-items-center gap-2">
                    <div
                      className={`d-inline-flex col-6 align-items-center`}
                      style={{
                        width: '100%',
                        zIndex: '25',
                      }}
                    >
                      <span
                        className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto d-inline-flex align-items-center`}
                        style={{
                          left: '60px',
                        }}
                      >
                        <SearchIcon color="#000" />
                      </span>
                      <input
                        type="search"
                        className={`${styles.inputSearch} d-inline-flex ps-5 col-12 pe-3`}
                        value={searchProd}
                        onChange={(e) => searchShopProd(e, e.target.value)}
                        placeholder={enviroment.SEARCH_PLACEHOLDER}
                        onKeyDown={handleKeyDown}
                      />
                      {searchProdList?.length > 0 && (
                        <div
                          className={`${styles.showSearchList} position-absolute d-inline-flex flex-column start-0 col-12 overflow-y-auto`}
                        >
                          {searchProdList.map((item, idx) => {
                            return (
                              <span
                                className={`${styles.searchRow} p-3 text-truncate col-12`}
                                role="button"
                                key={idx}
                                onClick={() =>
                                  openProductId(item.name_url, item.name)
                                }
                              >
                                {item.name}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`${styles.supportDrop} d-flex flex-column align-items-center gap-1 position-relative justify-content-center`}
                  role="button"
                >
                  <SupportIcon color="#000" />
                  <span className="visually-hidden">Support</span>
                  <div
                    className={`${styles.supportDropDown} position-absolute`}
                  >
                    <div
                      className={`${styles.timingPhoneBox} d-flex col-12 align-items-center gap-3`}
                    >
                      <SupportIcon color="#000" />
                      <div className="d-flex flex-column">
                        <label
                          className={`${styles.supportTimings} col-12 p-0 text-center`}
                        >
                          7 days, 9AM to 9PM
                        </label>
                        <Link
                          to={`tel:${enviroment.PHONE_NUMBER}`}
                          style={{
                            textDecoration: "none",
                          }}
                          className={`${styles.supportPhoneNumber} col-12 p-0 text-center`}
                        >
                          {enviroment.PHONE_NUMBER}
                        </Link>
                      </div>
                    </div>
                    <div
                      className={`${styles.mailtoBox} d-flex align-items-center gap-3 col-12`}
                    >
                      <MailIcon color="#000" />
                      <Link
                        to={`mailto:${enviroment.EMAIL_ADDRESS}`}
                        className={`${styles.mailtoEmail} text-decoration-none`}
                      >
                        {enviroment.EMAIL_ADDRESS}
                      </Link>
                    </div>
                    <div
                      className={`${styles.orderTrackLinks} d-none justify-content-between align-items-center col-12 p-0`}
                    >
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-flex`}
                      >
                        Chat With Us
                      </Link>
                      <span className={`${styles.dotSymbol} d-flex`}>&bull;</span>
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-flex`}
                      >
                        FAQ's
                      </Link>
                      <span className={`${styles.dotSymbol} d-flex`}>&bull;</span>
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-flex`}
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </div>

                {userInfo && userInfo?.customer_id ? (
                  <div
                    className={`${styles.supportDrop} d-flex flex-column align-items-center gap-1 position-relative justify-content-center`}
                    role="button"
                    onClick={() => openAccountDetail()}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <UserIcon color="#000" />
                      <span className="visually-hidden">Account</span>
                    </div>
                    {userInfo?.name !== "" && (
                      <span className={`${styles.userName} d-flex`}>
                        {userInfo.name}
                      </span>
                    )}
                    {accountOptn === true && (
                      <div
                        className={`${styles.userAccountDrop} position-absolute col-12`}
                        onClick={(e) => e.preventDefault()}
                      >
                        <span
                          role="button"
                          className={`${styles.accountOption} col-12 d-flex align-items-center`}
                          onClick={() => navigate("/my-account")}
                        >
                          My Account
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} col-12 d-flex align-items-center`}
                          onClick={() => navigate("/my-orders")}
                        >
                          My Orders
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} col-12 d-flex align-items-center`}
                          onClick={() => navigate("/my-address")}
                        >
                          My Address
                        </span>
                        <span
                          role="button"
                          onClick={() => userLoggedOut()}
                          className={`${styles.accountOption} col-12 d-flex align-items-center`}
                        >
                          Logged Out
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`${styles.supportDrop} hideInMobile d-flex align-items-center gap-2 position-relative`}
                    onClick={() => setLoginPop(true)}
                    role="button"
                  >
                    <UserIcon color="#000" />
                    <span className="visually-hidden">Account</span>
                  </div>
                )}
                <div
                  className={`${styles.supportDrop} d-flex align-items-center gap-2 position-relative`}
                  role="button"
                  onClick={() => setCartPop(true)}
                >
                  <span className="position-relative d-flex">
                    <CartIcon color="#000" />
                    {appData?.appData?.cartCount > 0 && (
                      <span
                        className={`${styles.cartCount} position-absolute d-flex align-items-center`}
                      >
                        {appData?.appData?.cartCount}
                      </span>
                    )}
                  </span>
                  <span className="visually-hidden">Cart</span>
                </div>
              </div>
            </div>
          </div>
          {/* Search box */}
          <div
            className={`${styles.supportDrop} p-0 d-flex align-items-center gap-1 position-relative hideInDesktop`}
            style={{
              width: '100%',
              margin: "auto",
              maxWidth: '500px',
            }}
            role="button"
            onClick={() => {
              setIsSearch(!isSearch);
              setSearchProd("");
            }}
          >
            <div className="d-flex w-100 align-items-center gap-2">
              <div
                className={`d-inline-flex col-6 align-items-center`}
                style={{
                  width: '100%',
                  zIndex: '25',
                }}
              >
                <span
                  className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto d-inline-flex align-items-center`}
                  style={{
                    left: '5px',
                    padding: '2px'
                  }}
                >
                  <SearchIcon color="#000" />
                </span>
                <input
                  type="search"
                  className={`${styles.inputSearch} d-inline-flex ps-4 col-12 pe-3`}
                  style={{
                    fontSize: '12px',
                  }}
                  value={searchProd}
                  onChange={(e) => searchShopProd(e, e.target.value)}
                  placeholder={enviroment.SEARCH_PLACEHOLDER}
                  onKeyDown={handleKeyDown}
                />
                {searchProdList?.length > 0 && (
                  <div
                    className={`${styles.showSearchList} position-absolute d-inline-flex flex-column start-0 col-12 overflow-y-auto`}
                  >
                    {searchProdList.map((item, idx) => {
                      return (
                        <span
                          className={`${styles.searchRow} p-3 text-truncate col-12`}
                          role="button"
                          key={idx}
                          onClick={() =>
                            openProductId(item.name_url, item.name)
                          }
                        >
                          {item.name}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {loginPop === true && <LoginPopup setLoginPop={setLoginPop} />}
        {cartPop === true && <CartAside setCartPop={setCartPop} />}
      </div>
    </React.Fragment>
  );
};