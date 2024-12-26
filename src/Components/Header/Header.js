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
  CrossIcon,
  MailIcon,
  MenuIcons,
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
    navigate(`/product/${prodId}/id=${id}`);
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
        className={`hideInDesktop`}
        style={{
          position: 'relative',
        }}
      >
        <div className={`${styles.siteHeader} col-12 d-inline-flex`}>
          <div
            className={`${styles.menuIconBox} d-inline-flex align-items-center justify-content-center`}
            onClick={openAsideMenu}
          >
            <MenuIcons color={'white'} />
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
                maxWidth: '200px',
                maxHeight: '30px',
              }}
              className="mt-3"
            />
          </h1>
          <div className="d-inline-flex align-items-stretch justify-content-end gap-2 me-3">
            <div
              className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
              type="button"
              onClick={
                () => setIsSearchOpen(!isSearchOpen)
              }
            >
              <SearchIcon color={'white'} />
            </div>
            <div
              className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
              role="button"
              onClick={() => setCartPop(true)}
            >
              <div className="position-relative d-inline-flex">
                <CartIcon color="#FFF" />
                {appData?.appData?.cartCount > 0 && (
                  <span
                    className={`${styles.cartCount} position-absolute d-inline-flex align-items-center`}
                  >
                    {appData?.appData?.cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          {
            isSearchOpen && (
              <div
                className={`d-inline-flex align-items-center`}
                style={{
                  position: 'absolute',
                  left: '0px',
                  zIndex: 90,
                  top: '80px',
                }}

              >
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
                <span
                  onClick={() => {
                    searchShopProd('', '')
                    setIsSearchOpen(false)
                  }}
                  style={{ cursor: "pointer" }}
                  className={`${styles.searchIcon} position-absolute top-0 bottom-0 m-auto end-0 me-4 p-1 d-inline-flex align-items-center`}
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
            )}
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
            Delivering Across India
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
          className={`${styles.headerRow} col-12 d-inline-flex align-items-center`}>
          <div className="container h-100 d-flex align-items-stretch p-0">
            <div
              className={`p-0 m-0 positoin-relative h-100 col-12 d-inline-flex flex-wrap align-items-stretch gap-3`}
            >
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
                }}
                className={`${styles.siteLogoBox} m-0 d-inline-flex justify-content-start col-2 w-100`}
              >
                <span class="visually-hidden">
                  {enviroment.REACT_APP_BUSINESS_NAME}
                </span>
                <img
                  src={siteLogo}
                  alt={enviroment.REACT_APP_BUSINESS_NAME ?? 'Logo'}
                  className="object-fit-contain mt-3"
                />
              </h1>
              <div className="d-inline-flex align-items-stretch w-100 justify-content-end gap-4">
                <button
                  className={`${styles.supportDrop} btn d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  type="button"
                  onClick={
                    () => setIsSearchOpen(!isSearchOpen)
                  }
                >
                  <SearchIcon color={'white'} />
                </button>
                <div
                  className={`${styles.supportDrop} d-inline-flex d-inline-flex align-items-center gap-2 position-relative`}
                  role="button"
                >
                  <SupportIcon color="#FFF" />
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
            margin: '0 auto'
          }}>
            {loading ? (
              <HeaderNavLoader />
            ) : (
              <div
                className={`${styles.headerMenuRow}  col-12`}
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
                        <div
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
                            }}
                          >
                            {item.name}
                          </span>
                          {/* {
                            item?.catList?.length > 0 && (
                              <BackArrowIcon
                                color="#000"
                                role="button"
                                style={{
                                  display: 'inline-block',
                                  verticalAlign: 'middle',
                                }}
                              />
                            )} */}
                        </div>
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
      </div>
    </>
  );
};