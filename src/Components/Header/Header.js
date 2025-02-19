import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
import {
  MenuIcons,
  CartIcon,
  SupportIcon,
  MailIcon,
  UserIcon,
  SearchIcon,
  BackArrowIcon,
} from "../siteIcons";
import siteLogo from "../../assets/images/site_logo.png";
import { enviroment } from "../../enviroment";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { Link } from "react-router-dom";
import { LoginPopup } from "../LoginPopup/LoginPopup";
import ReactOwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import ApiService from "../../services/ApiService";
import { CartAside } from "../CartAside/CartAside";
import { AppNotification } from "../../utils/helper";

import { useAppStore } from "../../store";
import { HeaderNavLoader } from "../Loader/Loader";

export const Header = ({ setAsideOpen, asideOpen, setFetchedNavItems }) => {
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
        setFetchedNavItems(allSubCategory);
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
      {/* Mobile Structure */}
      <div
        className={`${styles.siteHeader} hideInDesktop col-12 d-inline-flex flex-column gap-3`}
      >
        <div className={`col-12 d-inline-flex align-items-center`}>
          <span
            className={`${styles.menuIconBox} d-inline-flex align-items-center justify-content-center`}
            onClick={openAsideMenu}
          >
            <MenuIcons color={enviroment.SECONDARY_COLOR} />
          </span>
          <h1
            onClick={() => routeHome()}
            style={{ cursor: "pointer" }}
            itemtype="http://schema.org/Organization"
            className={`${styles.siteLogoBox} d-inline-flex align-items-center justify-content-center m-auto`}
          >
            <span class="visually-hidden">
              {enviroment.REACT_APP_BUSINESS_NAME}
            </span>
            <img
              src={siteLogo}
              alt={enviroment.REACT_APP_BUSINESS_NAME ?? 'Logo'}
              className="object-fit-contain"
            />
          </h1>
          <span
            className={`${styles.cartIconBox} d-inline-flex align-items-center justify-content-center position-relative`}
            onClick={() => openCart()}
          >
            <span
              className={`${styles.cartCountMobile} position-absolute d-inline-flex align-items-center`}
            >
              {appData?.appData?.cartCount}
            </span>
            <CartIcon color={enviroment.SECONDARY_COLOR} />
          </span>
        </div>
        <div className="col-12 d-inline-flex position-relative px-3">
          <input
            type="search"
            placeholder={enviroment.SEARCH_PLACEHOLDER}
            className={`${styles.searchProdInput} col-12 d-inline-block`}
            value={searchProd}
            onChange={(e) => searchShopProd(e, e.target.value)}
            onKeyDown={handleKeyDown}
          />
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
                    onClick={() => openProductId(item.name_url, item.name)}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Desktop Structure */}
      <div className={`hideInMobile col-12 d-inline-flex flex-column`} style={{
        position: 'relative'
      }}>
        <ReactOwlCarousel
          className={`${styles.topHeaderSale} col-12 owl-theme`}
          margin={0}
          items={1}
          loop={true}
          dots={false}
          animateOut="slideOutUp"
          animateIn="slideInUp"
          autoPlay={true}
        >
          <div
            className={`col-12 d-inline-flex align-items-center justify-content-center`}
          >
            <span
              className={`d-inline-block text-decoration-none ${styles.dealsLink}`}
              title="Superdeals"
            >
              Shipping Across India.
            </span>
          </div>
          <div
            className={`col-12 d-inline-flex align-items-center justify-content-center`}
          >
            <span
              className={`d-inline-block text-decoration-none ${styles.dealsLink}`}
              title="Superdeals"
            >
              Shipping Across India.
            </span>
          </div>
        </ReactOwlCarousel>
        <div
          className={`${styles.headerRow} col-12 d-inline-flex align-items-center`}
        >
          <div className="container h-100 d-flex align-items-stretch">
            <div
              className={`${styles.headerInnerRow} col-12 d-inline-flex align-items-stretch gap-3`}
            >
              <h1
                onClick={() => routeHome()}
                itemtype="http://schema.org/Organization"
                style={{ cursor: "pointer" }}
                className={`${styles.siteLogoBox} d-inline-flex align-items-center justify-content-center col-2`}
              >
                <span class="visually-hidden">
                  {enviroment.REACT_APP_BUSINESS_NAME}
                </span>
                <img
                  src={siteLogo}
                  alt={enviroment.REACT_APP_BUSINESS_NAME ?? 'Logo'}
                  className="object-fit-contain"
                />
              </h1>
              <div
                className={`d-inline-flex col-6 position-relative align-items-center`}
              >
                <span
                  className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto start-0 ms-3 d-inline-flex align-items-center`}
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
              <div className="d-inline-flex align-items-stretch justify-content-end gap-5">
                <div
                  className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  role="button"
                >
                  <SupportIcon color="#FFF" />
                  <span className={`${styles.supportText} ${styles.supportHideOnMobile}`}>
                    Support
                  </span>
                  <div
                    className={`${styles.supportDropDown} position-absolute d-inline-block`}
                  >
                    <div
                      className={`${styles.timingPhoneBox} d-inline-flex col-12 align-items-center gap-3`}
                    >
                      <SupportIcon color="#000" />
                      <div className="d-inline-flex flex-column">
                        <label
                          className={`${styles.supportTimings} d-inline-block col-12 p-0 text-center`}
                        >
                          7 days, 9AM to 9PM
                        </label>
                        <Link
                          to={`tel:${enviroment.PHONE_NUMBER}`}
                          style={{
                            textDecoration: "none",
                          }}
                          className={`${styles.supportPhoneNumber} text-decoration-none d-inline-block col-12 p-0 text-center`}
                        >
                          {enviroment.PHONE_NUMBER}
                        </Link>
                      </div>
                    </div>
                    <div
                      className={`${styles.mailtoBox} text-decoration-none d-inline-flex align-items-center gap-3 col-12`}
                    >
                      <MailIcon color="#000" />
                      <Link
                        to={`mailto:${enviroment.EMAIL_ADDRESS}`}
                        className={`${styles.mailtoEmail} d-inline-block text-decoration-none`}
                      >
                        {enviroment.EMAIL_ADDRESS}
                      </Link>
                    </div>
                    <div
                      className={`${styles.orderTrackLinks} d-none justify-content-between align-items-center col-12 p-0`}
                    >
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-inline-flex`}
                      >
                        Chat With Us
                      </Link>
                      <span className={`${styles.dotSymbol} d-inline-flex`}>
                        &bull;
                      </span>
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-inline-flex`}
                      >
                        FAQ&apos;s
                      </Link>
                      <span className={`${styles.dotSymbol} d-inline-flex`}>
                        &bull;
                      </span>
                      <Link
                        className={`${styles.supportLinks} text-decoration-none d-inline-flex`}
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </div>
                {userInfo && userInfo?.customer_id ? (
                  <div
                    className={`${styles.supportDrop} d-inline-flex flex-column align-items-center gap-1 position-relative justify-content-center`}
                    role="button"
                    onClick={() => openAccountDetail()}
                  >
                    <div className="d-inline-flex align-items-center gap-2">
                      <UserIcon color="#FFF" />
                      <span className={`${styles.supportText} ${styles.supportHideOnMobile}`}>
                        Account
                      </span>
                    </div>
                    {userInfo?.name !== "" && (
                      <span className={`${styles.userName} d-inline-flex`}>
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
                          className={`${styles.accountOption} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-account")}
                        >
                          My Account
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-orders")}
                        >
                          My Orders
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-address")}
                        >
                          My Address
                        </span>
                        <span
                          role="button"
                          onClick={() => userLoggedOut()}
                          className={`${styles.accountOption} col-12 d-inline-flex align-items-center`}
                        >
                          Log Out
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                    onClick={() => setLoginPop(true)}
                    role="button"
                  >
                    <UserIcon color="#FFF" />
                    <span className={`${styles.supportText} ${styles.supportHideOnMobile}`}>
                      Account
                    </span>
                  </div>
                )}
                <div
                  className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  role="button"
                  onClick={() => setCartPop(true)}
                >
                  <span className="position-relative d-inline-flex">
                    <CartIcon color="#FFF" />
                    {appData?.appData?.cartCount > 0 && (
                      <span
                        className={`${styles.cartCount} position-absolute d-inline-flex align-items-center`}
                      >
                        {appData?.appData?.cartCount}
                      </span>
                    )}
                  </span>
                  <span className={`${styles.supportText} ${styles.supportHideOnMobile}`}>
                    Cart
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.headerNavList} col-12 d-inline-flex align-items-center position-relative`}
        >
          <div style={{
            width: 'fit-content',
            margin: '0 auto'
          }}>
            {loading ? (
              <HeaderNavLoader />
            ) : (
              <div
                className={`${styles.headerMenuRow} d-inline-flex align-items-stretch col-12`}
                style={{
                  maxWidth: '100dvw',
                  overflowX: "auto"
                }}
              >
                {navItems.length > 0 &&
                  navItems.map((item, index) => (
                    <div
                      id={`menu-${index}`}
                      className={`${styles.headerNavBox} position-relative d-inline-flex align-items-center px-4`}
                      key={index}
                      role="button"
                      onMouseEnter={() => handleMouseEnter(item, index)}
                      onClick={() => handleMouseEnter(item, index)}
                    >
                      <div
                        className={`${styles.menuName}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          minWidth: '220px',
                          maxWidth: '150px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <a
                          href={`/store/${item?.name_url}`}
                          className={`${styles.menuNameText}`}
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            verticalAlign: 'middle',
                            color: 'black',
                            textDecoration: "none"
                          }}
                        >
                          {item.name}
                        </a>
                        <BackArrowIcon
                          color="#000"
                          role="button"
                          style={{
                            display: 'inline-block',
                            verticalAlign: 'middle',
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        {hoveredItem?.catList?.length > 0 && (
          <div
            className={`${styles.SubMenuList} d-inline-flex flex-column gap-1`}
            style={{
              position: 'absolute',
              top: '150px',
              left: hoveredPosition.left,
              zIndex: 999,
            }}
            onMouseEnter={() => setHoveredItem(hoveredItem)}
            onClick={() => setHoveredItem(hoveredItem)}
            onMouseLeave={handleMouseLeave}
          >
            {hoveredItem.catList.map((subNme, subIdx) => (
              <Link
                to={`/store-product/${subNme?.name_url}`}
                style={{ textDecoration: 'none' }}
                key={subIdx}
                className={`${styles.subMenuName} col-12 align-items-center px-3 d-inline-flex py-2`}
              >
                {subNme.name}
              </Link>
            ))}
          </div>
        )}
        {loginPop === true && <LoginPopup setLoginPop={setLoginPop} />}
        {cartPop === true && <CartAside setCartPop={setCartPop} />}
      </div>
    </React.Fragment>
  );
};