import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { Link, useNavigate } from "react-router-dom";
import siteLogo from "../../assets/images/site_logo.svg";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import { CartAside } from "../CartAside/CartAside";
import { LoginPopup } from "../LoginPopup/LoginPopup";
import {
  AccountIcon,
  BackArrowIcon,
  CartIcon,
  CrossIcon,
  LocationIcon,
  LogoutIcon2,
  MailIcon,
  MenuIcons,
  OrderIcon,
  SearchIcon,
  SupportIcon,
  UserIcon
} from "../siteIcons";
import styles from "./Header.module.css";

import { useAppStore } from "../../store";
import { HeaderNavLoader } from "../Loader/Loader";

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
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [hoveredItem, setHoveredItem] = useState([]);
  const [hoveredPosition, setHoveredPosition] = useState({});

  const [catHoveredItem, setCatHoveredItem] = useState([]);
  const [catHoveredPosition, setCatHoveredPosition] = useState({});

  const navigate = useNavigate();

  const openAsideMenu = () => {
    if (asideOpen === true) {
      setAsideOpen(false);
    } else {
      setAsideOpen(true);
    }
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

  const openProductId = (prodId, name, id) => {
    setSearchProdList([]);
    setSearchProd(name);
    navigate(`/product/${prodId}`);
  };

  const handleKeyDown = (event) => {
    if (searchProd.length > 1 && event.code === "Enter") {
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

    if (catHoveredItem) {
      if (catHoveredItem?.category_id !== hoveredItem?.category_id) {
        setCatHoveredItem(null)
      }
    }

    setHoveredPosition({
      left: `${[pos.left]}px`,
    });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    setHoveredPosition({});
    setCatHoveredItem(null);
    setCatHoveredPosition({});
  };

  useEffect(() => {
    document.addEventListener("click", handleMouseLeave);
    return () => {
      document.removeEventListener("click", handleMouseLeave);
    };
  }, []);
  //   Televisions
  // Refrigerator
  // Washing Machines
  // Air Care
  // Home Appliances
  // Lifestyle
  // Mobiles & Laptops

  const getCatIcon = (catName) => {
    switch (catName) {
      case "Televisions":
        return "/images/tv.svg";
      case "Refrigerator":
        return "/images/fridge.svg";
      case "Washing Machines":
        return "/images/washing-machine.svg";
      case "Air Care":
        return "/images/air-conditioner.svg";
      case "Home Appliances":
        return "/images/old-television.svg";
      case "Lifestyle":
        return "/images/cycle.svg";
      case "Mobiles & Laptops":
        return "/images/laptop-webcam.svg";
      case "Sound systems":
        return "/images/speakers.svg";
      default:
        return "/images/tv.svg";
    }
  }

  return (
    <>
      {/* Mobile Structure */}
      <div
        className={`hideInDesktop bg-success`}
        style={{
          position: 'relative',
          minHeight: 'fit-content',
        }}
      >
        <div className={`${styles.siteHeader} col-12`}>
          <div className="d-inline-flex col-12">
            <div
              className={`${styles.menuIconBox} d-inline-flex align-items-center ms-3 justify-content-center`}
              onClick={openAsideMenu}
            >
              <MenuIcons color={'black'} />
            </div>
            <h1
              onClick={() => routeHome()}
              style={{ cursor: "pointer" }}
              itemtype="http://schema.org/Organization"
              className={`${styles.siteLogoBox} w-100 d-flex justify-content-center position-relative`}
            >
              <span class="visually-hidden">
                {enviroment.REACT_APP_BUSINESS_NAME}
              </span>
              <img
                src={siteLogo}
                alt={enviroment.REACT_APP_BUSINESS_NAME ?? 'Logo'}
                style={{
                  maxWidth: '220px',
                  maxHeight: '35px',
                }}
              />
            </h1>
            <div className="d-inline-flex align-items-stretch justify-content-end gap-2 me-4">
              <Link
                to="checkout"
                className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
              >
                <div className="position-relative d-inline-flex">
                  <CartIcon color="#000" />
                  {appData?.appData?.cartCount > 0 && (
                    <span
                      className={`${styles.cartCount} position-absolute d-inline-flex align-items-center`}
                    >
                      {appData?.appData?.cartCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
          <div
            className={`d-inline-flex align-items-center pt-3 w-100`}>
            <div className="position-relative" style={{
              width: "92%",
              margin: "auto",
            }}>
              <span
                className={`${styles.searchIcon} position-absolute p-1 top-0 bottom-0 m-auto start-0 ms-3 d-inline-flex align-items-center`}
              >
                <SearchIcon color="#000" />
              </span>
              <input
                type="text"
                className={`${styles.inputSearch} d-inline-flex ps-5 col-12 p-3 pe-3`}
                style={{
                  fontSize: '1rem',
                }}
                value={searchProd}
                onChange={(e) => searchShopProd(e, e.target.value)}
                placeholder={enviroment.SEARCH_PLACEHOLDER}
                onKeyDown={handleKeyDown}
              />
              {/* <span
                onClick={() => {
                  searchShopProd('', '')
                  setIsSearchOpen(false)
                }}
                style={{ cursor: "pointer" }}
                className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto end-0 me-4 p-1 d-inline-flex align-items-center`}
              >
                <CrossIcon color="#000" />
              </span> */}
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
                          openProductId(item.name_url, item.name, item.product_id)
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
      {/* Delivering India Section */}
      <div
        className={`${styles.topHeaderSale} hideInMobile col-12 owl-theme`}>
        <div
          className={`col-12 ${styles.dealsLinkWrapper} d-inline-flex align-items-center justify-content-center h-100`}
        >
          <span
            className={`d-inline-block text-decoration-none ${styles.dealsLink}`}
            title="Superdeals"
          >
            Shop Smart, Save Big! Explore Our Open-Box Collection Today!
          </span>
        </div>
      </div>

      {/* Desktop Structure */}
      <div className={`hideInMobile col-12 d-inline-flex flex-column`} style={{
        position: 'sticky',
        top: '0',
        zIndex: '999',
      }}>
        <div
          className={`${styles.headerRow} col-12 d-inline-flex w-100`}>
          <div className="h-100 container-fluid d-flex p-0" style={{
            position: 'relative',
            width: '100vw',

          }}>
            <div
              className={`p-0 m-0 h-100 col-12 d-flex gap-3`}
            >
              <div className="col-4">
                <h1
                  onClick={() => routeHome()}
                  itemtype="http://schema.org/Organization"
                  style={{
                    cursor: "pointer",
                    position: 'absolute',
                    left: '0',
                    top: '0',
                    right: '0',
                    padding: '0 2rem',
                    // overflow: 'hidden', // Prevent overflow
                    whiteSpace: 'nowrap', // Prevent text wrapping
                    textOverflow: 'ellipsis',
                    maxWidth: 'calc(100% - 4rem)',
                  }}
                  className={`${styles.siteLogoBox} m-0 d-inline-flex justify-content-start col-2 ms-5 ps-5  w-100`}
                >
                  <span className="visually-hidden">
                    {enviroment.REACT_APP_BUSINESS_NAME}
                  </span>
                  <img
                    src={siteLogo}
                    alt={enviroment.REACT_APP_BUSINESS_NAME ?? 'Logo'}
                    className="object-fit-contain mt-3"
                  />
                </h1>
              </div>
              <div className="w-full d-flex align-items-stretch w-100 justify-content-end gap-4 pe-5 me-5">
                <SearchElement
                  searchProd={searchProd}
                  searchShopProd={searchShopProd}
                  handleKeyDown={handleKeyDown}
                  setIsSearchOpen={setIsSearchOpen}
                  searchProdList={searchProdList}
                  openProductId={openProductId}
                />

                <div
                  className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  role="button"
                >
                  <div className={`p-2 btn ${styles.navItem}`}>
                    <SupportIcon color="#000" />
                    <span className={`${styles.supportHideOnMobile}`}>
                      Support
                    </span>
                  </div>
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
                    // onClick={() => openAccountDetail()}
                    onMouseEnter={() => openAccountDetail()}
                    onMouseLeave={() => openAccountDetail()}
                  >
                    <div className={`p-2 btn ${styles.navItem}`}>
                      <div className="d-inline-flex align-items-center gap-2">
                        <UserIcon color="#000" />
                      </div>
                      {userInfo?.name && userInfo?.name !== "" ? (
                        <span className={`d-inline-flex`}>
                          {userInfo.name}
                        </span>
                      ) : (
                        <span className={`d-inline-flex`}>
                          My Account
                        </span>
                      )}
                    </div>
                    {accountOptn === true && (
                      <div
                        className={`${styles.userAccountDrop} position-absolute col-12`}
                        onClick={(e) => e.preventDefault()}
                      >
                        <span
                          role="button"
                          className={`${styles.accountOption} ${styles.navItem} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-account")}
                        >
                          <AccountIcon />
                          My Account
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} ${styles.navItem} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-orders")}
                        >
                          <OrderIcon color={'black'} />
                          My Orders
                        </span>
                        <span
                          role="button"
                          className={`${styles.accountOption} ${styles.navItem} col-12 d-inline-flex align-items-center`}
                          onClick={() => navigate("/my-address")}
                        >
                          <LocationIcon />
                          My Address
                        </span>
                        <span
                          role="button"
                          onClick={() => userLoggedOut()}
                          className={`${styles.accountOption} ${styles.navItem} col-12 d-inline-flex align-items-center`}
                        >
                          <LogoutIcon2 />
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
                    <div className={`p-2 btn ${styles.navItem}`}>
                      <UserIcon color="#000" />
                      <span className={`${styles.supportHideOnMobile}`}>
                        Account
                      </span>
                    </div>
                  </div>
                )}
                <div
                  className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  role="button"
                  onClick={() => setCartPop(true)}
                >
                  <div className={`p-2 btn ${styles.navItem}`}>
                    <span className="position-relative d-inline-flex gap-2">
                      <CartIcon color="#000" />
                      <span className={`${styles.supportHideOnMobile}`}>
                        Cart
                      </span>
                      {appData?.appData?.cartCount > 0 && (
                        <span
                          className={`${styles.cartCount} position-absolute d-inline-flex align-items-center`}
                        >
                          {appData?.appData?.cartCount}
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`${styles.headerNavList} w-100 position-relative`}
        >
          <div style={{
            width: 'fit-content',
            margin: '0 auto',
          }}>
            {loading ? (
              <HeaderNavLoader />
            ) : (
              <div
                className={`${styles.headerMenuRow} col-12`}
              >
                {navItems.length > 0 &&
                  <div className={`${styles.headerMenuItems}`}>
                    {navItems?.map((item, index) => (
                      <div
                        id={`menu-${index}`}
                        className={`${styles.headerNavBox} position-relative d-inline-flex align-items-center`}
                        key={index}
                        role="button"
                        onMouseEnter={() => handleMouseEnter(item, index)}
                        onClick={() => handleMouseEnter(item, index)}
                      >
                        <a
                          href={`/store/${item.name_url}`}
                          className={`${styles.menuName}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minWidth: 'fit-content',
                            gap: '0.5rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '1rem',
                            textDecoration: 'none',
                          }}
                        >
                          <img src={getCatIcon(item.name)} alt={item.name} style={{
                            height: '2rem',
                            width: '2rem',
                          }} />
                          <span
                            className={`${styles.menuNameText}`}
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'inline-block',
                              verticalAlign: 'middle',
                              color: 'white',
                            }}
                          >
                            {item.name}
                          </span>
                        </a>
                      </div>
                    ))}
                    {hoveredItem?.catList?.length > 0 && (
                      <div
                        className={`${styles.SubMenuList} d-inline-flex flex-column gap-1`}
                        style={{
                          position: 'absolute',
                          left: hoveredPosition.left,
                          zIndex: 100,
                          maxWidth: '300px'
                        }}
                        onMouseEnter={() => {
                          setHoveredItem(hoveredItem)
                        }}
                        onClick={() => setHoveredItem(hoveredItem)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="position-relative">

                          {/* Category List */}
                          {hoveredItem?.catList?.map((subNme, subIdx) => (
                            <Link
                              to={`/store-product/${subNme?.name_url}`}
                              style={{ textDecoration: 'none' }}
                              key={subIdx}
                              onMouseEnter={() => {
                                setCatHoveredItem(subNme)
                              }}
                              className={`${styles.subMenuName}  col-12 justify-content-between align-items-center px-3 d-inline-flex py-2`}
                            >
                              {subNme.name}

                              <span style={{
                                height: '1rem',
                                width: '1rem',
                                transform: 'rotate(180deg)',
                                display: 'flex',
                                alignItems: 'center',
                              }}>
                                {
                                  subNme?.subcatList?.length > 0 && (
                                    <BackArrowIcon
                                      color="white"
                                      role="button"
                                      style={{
                                        display: 'inline-block',
                                        verticalAlign: 'middle',
                                      }}
                                    />
                                  )}
                              </span>
                            </Link>
                          ))}

                          {/* Category Child List */}
                          {
                            catHoveredItem?.subcatList?.length > 0 && (
                              <div
                                className={`${styles.SubMenuList} d-inline-flex flex-column gap-1`}
                                style={{
                                  position: 'absolute',
                                  top: '-12px',
                                  left: '103%',
                                }}
                              >
                                {catHoveredItem?.subcatList?.map((subCatNme, subIdx) => (
                                  <Link
                                    to={`/category/${catHoveredItem?.name_url}/sub-category/${subCatNme?.name_url}`}
                                    style={{ textDecoration: 'none' }}
                                    key={subIdx}
                                    className={`${styles.subMenuName} col-12 justify-content-between align-items-center px-3 d-inline-flex py-2`}
                                  >
                                    {subCatNme.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                }
              </div>
            )}
          </div>
          {
            isSearchOpen && (
              <div style={{
                position: 'relative',
              }}>
                <div
                  className={`d-inline-flex align-items-center`}
                  style={{
                    position: 'absolute',
                    zIndex: 90,
                    top: '0',
                  }}

                >
                  <span
                    className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto start-0 ms-3 d-inline-flex align-items-center`}
                  >
                    <SearchIcon color="#000" />
                  </span>
                  <input
                    type="text"
                    className={`${styles.inputSearch} d-inline-flex ps-5 col-12 pe-3`}
                    value={searchProd}
                    onChange={(e) => searchShopProd(e, e.target.value)}
                    placeholder={enviroment.SEARCH_PLACEHOLDER}
                    onKeyDown={handleKeyDown}
                  />
                  <span
                    onClick={() => {
                      searchShopProd('', '')
                      setIsSearchOpen(false)
                    }}
                    style={{ cursor: "pointer" }}
                    className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto end-0 me-4 d-inline-flex align-items-center`}
                  >
                    <CrossIcon color="#000" />
                  </span>
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
                              openProductId(item.name_url, item.name, item.product_id)
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
            )}
        </div>
        {loginPop === true && <LoginPopup setLoginPop={setLoginPop} />}
        {cartPop === true && <CartAside setCartPop={setCartPop} />}
      </div >
    </>
  );
};
const SearchElement = ({
  searchProd,
  searchShopProd,
  handleKeyDown,
  setIsSearchOpen,
  searchProdList,
  openProductId
}) => {
  return (
    <div
      className={`d-inline-flex col-5 position-relative align-items-center`}
    >
      <InputGroup>
        <Form.Control
          type="search"
          value={searchProd}
          onChange={(e) => searchShopProd(e, e.target.value)}
          placeholder="Search products..."
          onKeyDown={handleKeyDown}
          onFocus={() => setIsSearchOpen(false)}
          onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
          className={styles.searchInput}
        />
        <Button variant="outline-secondary" className={`${styles.searchButton} bg-danger text-white`}>
          <Search />
        </Button>
      </InputGroup>
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
  );
};

