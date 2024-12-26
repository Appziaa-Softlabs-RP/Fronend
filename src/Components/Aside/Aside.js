import React, { useState } from "react";
import { ChevronRight } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import styles from "./Aside.module.css";
import { useAppStore } from "../../store";

export const Aside = ({ asideOpen, setAsideOpen }) => {
  const navigate = useNavigate();
  const appData = useApp();
  const userInfo = appData?.appData?.user;
  const [activeIndex, setActiveIndex] = useState(null)
  const navItems = useAppStore((state) => state.navItems);

  const handleClick = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const openLoginPage = () => {
    navigate("/login");
  };

  const openAccountPage = () => {
    navigate("/my-account");
  };

  return (
    <React.Fragment>
      <div
        className={`${styles.gradientMenuDrawer} ${asideOpen === true && styles.openDrawer
          } position-fixed h-100 col-12 top-0 start-0`}
      >
        <div
          className={`${styles.menuDrawerInnerContainer} position-absolute h-100 d-inline-flex flex-column`}
        >
          <div
            className={`${styles.menuDrawerNavigationContainer} position-relative d-inline-block col-12 p-0`}
          >
            {userInfo && userInfo?.customer_id ? (
              <div
                className={`${styles.loginSignup} col-12 gap-2 d-inline-flex align-items-center`}
                onClick={() => openAccountPage()}
              >
                <svg
                  className={`${styles.iconAccount} flex-shrink-0 d-inline-flex`}
                  fill="none"
                  viewBox="0 0 18 19"
                >
                  <path
                    d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z"
                    fill="currentColor"
                  ></path>
                </svg>
                <div
                  className={`${styles.loginUserDetail} flex-grow-1 d-inline-flex flex-column`}
                >
                  {userInfo?.name && (
                    <span
                      className={`${styles.loggedName} text-left col-12 d-inline-block`}
                    >
                      {userInfo?.name}
                    </span>
                  )}
                  <span
                    className={`${styles.loggedPhone} text-left col-12 d-inline-block`}
                  >
                    +91- {userInfo?.contact}
                  </span>
                </div>
              </div>
            ) : (
              <div
                className={`${styles.loginSignup} d-inline-flex gap-2 col-12 align-items-center text-decoration-none`}
                role="button"
                onClick={() => openLoginPage()}
              >
                <svg
                  className={`${styles.iconAccount} flex-shrink-0 d-inline-flex`}
                  fill="none"
                  viewBox="0 0 18 19"
                >
                  <path
                    d="M6 4.5a3 3 0 116 0 3 3 0 01-6 0zm3-4a4 4 0 100 8 4 4 0 000-8zm5.58 12.15c1.12.82 1.83 2.24 1.91 4.85H1.51c.08-2.6.79-4.03 1.9-4.85C4.66 11.75 6.5 11.5 9 11.5s4.35.26 5.58 1.15zM9 10.5c-2.5 0-4.65.24-6.17 1.35C1.27 12.98.5 14.93.5 18v.5h17V18c0-3.07-.77-5.02-2.33-6.15-1.52-1.1-3.67-1.35-6.17-1.35z"
                    fill="currentColor"
                  ></path>
                </svg>
                <span
                  className={`${styles.loginText} text-left col-12 d-inline-block`}
                >
                  Login / Signup
                </span>
              </div>
            )}
            <span
              className={`${styles.rightDrwaerClose} position-absolute d-inline-flex align-items-center justify-content-center`}
              onClick={() => setAsideOpen(false)}
            >
              <svg className="icon icon-close" viewBox="0 0 18 17">
                <path
                  d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                  fill="currentColor"
                ></path>
              </svg>
            </span>
            <nav
              className={`${styles.menuDrawerNavigation} col-12 d-inline-flex`}
            >
              <ul className={`${styles.menuDrawerMenu} list-unstyled col-12`}>
                {/* <li>
                  <Link
                    className={`${styles.menuDrawerMenuItem} text-decoration-none d-inline-flex align-items-center`}
                    aria-current="page"
                  >
                    <svg viewBox="0 0 100 100">
                      <path d="m83.5 100h-67c-9 0-16.5-7.6-16.5-16.7v-36.5c0-4.6 2-9.1 5.5-12.2l33.5-30.4c6.5-5.6 15.5-5.6 22 0l33.5 30.4c3.5 3 5.5 7.6 5.5 12.2v36.5c-.5 9.6-7.5 16.7-16.5 16.7zm-33.5-89.7c-1.5 0-3 .5-4.5 1.5l-33.5 30.4c-1.5 1-2 3-2 5.1v36.5c0 3.5 3 6.6 6.5 6.6h66.5c3.5 0 6.5-3 6.5-6.6v-36.5c0-2-1-3.5-2-5.1l-33.5-30.4c-1-1-2.5-1.5-4-1.5z"></path>
                    </svg>
                    <span className="menu-text">Home</span>
                  </Link> */}
                {/* </li> */}
                <li className="ps-4">
                  <ul className="list-unstyled m-0 p-0">
                    {navItems?.map((item, index) => (
                      <li key={index} className="mb-2">
                        <div
                          className="d-flex flex-column"
                        >
                          <span
                            className="d-flex align-items-center btn justify-content-between gap-2 mb-2"
                            onClick={() => handleClick(index)}
                            style={{
                              color: activeIndex === index ? '#1F3461' : '#333',
                              fontWeight: activeIndex === index ? 'bold' : 'normal',
                              fontSize: '16px',
                              textDecoration: 'none',
                              cursor: 'pointer',
                            }}
                          >
                            {item.name}
                            {/* if items are there show arrow down icon */}
                            {
                              item.catList?.length > 0 && (
                                <span
                                  style={{
                                    rotate: activeIndex === index ? '90deg' : '0deg',
                                    color: activeIndex === index ? '#1F3461' : '#333',
                                  }}
                                >
                                  <ChevronRight />
                                </span>
                              )
                            }
                          </span>
                          {item.catList?.length > 0 && activeIndex === index && (
                            <div
                              className="d-flex flex-column gap-1 ms-4"
                            >
                              {item?.catList?.map((subNme, subIdx) => (
                                <Link
                                  to={`/store-product/${subNme?.name_url}`}
                                  key={subIdx}
                                  className="d-flex align-items-center py-1"
                                  style={{
                                    textDecoration: 'none',
                                    color: '#333',
                                    fontSize: '14px',
                                    transition: 'color 0.3s',
                                  }}
                                  onMouseEnter={(e) => e.target.style.color = '#007bff'}
                                  onMouseLeave={(e) => e.target.style.color = '#333'}
                                >
                                  <span className="text-black" style={{
                                    fontSize: '14px',
                                  }}>{subNme.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                </li>
              </ul>
            </nav>
          </div>
          <div
            className={`${styles.menuDrawerUtilityLinks} bottom-0 start-0 mt-auto col-12 d-inline-block position-absolute`}
          >
            <h6 className={`${styles.listSocialTitle} mt-2 mb-2 d-block`}>
              Contact Us
            </h6>
            <ul className={`${styles.footerMenu} list-unstyled`}>
              <li
                className={`${styles.footerIconLink} d-inline-flex col-12 p-0 align-items-center`}
              >
                <Link
                  className="d-inline-flex align-items-center text-decoration-none"
                  href={`tel:${enviroment.PHONE_NUMBER}`}
                >
                  <span className="icon-and-text">
                    <svg className="icon icon-phone" viewBox="0 0 64 64">
                      <defs></defs>
                      <path
                        className="cls-1"
                        d="M16.57 5l12.32 12.33L21.26 25c2.53 8.5 8.32 15 18.78 18.78l7.63-7.63L60 48.43 49.43 59C25.4 54.11 11.05 39.5 6 15.57z"
                      ></path>
                    </svg>
                    <span>{enviroment.PHONE_NUMBER}</span>
                  </span>
                </Link>
              </li>
              <li
                className={`${styles.footerIconLink} d-inline-flex col-12 p-0 align-items-center`}
              >
                <Link
                  className="d-inline-flex align-items-center text-decoration-none"
                  href={`mailto:${process.env.REACT_APP_EMAIL_ADDRESS}`}
                >
                  <span className="icon-and-text">
                    <svg viewBox="0 0 512 512">
                      <g>
                        <path
                          d="M467 76H45C20.137 76 0 96.262 0 121v270c0 24.885 20.285 45 45 45h422c24.655 0 45-20.03 45-45V121c0-24.694-20.057-45-45-45zm-6.302 30L287.82 277.967c-8.5 8.5-19.8 13.18-31.82 13.18s-23.32-4.681-31.848-13.208L51.302 106h409.396zM30 384.894V127.125L159.638 256.08 30 384.894zM51.321 406l129.587-128.763 22.059 21.943c14.166 14.166 33 21.967 53.033 21.967s38.867-7.801 53.005-21.939l22.087-21.971L460.679 406H51.321zM482 384.894 352.362 256.08 482 127.125v257.769z"
                          fill="#000000"
                          data-original="#000000"
                        ></path>
                      </g>
                    </svg>
                    <span>{process.env.REACT_APP_EMAIL_ADDRESS}</span>
                  </span>
                </Link>
              </li>
            </ul>
            <h6 className={`${styles.listSocialTitle} mt-3 mb-2 d-block`}>
              Be social with us
            </h6>
            <ul
              className={`${styles.listSocial} col-12 p-0 d-inline-flex flex-wrap list-unstyled`}
            >
              <li
                className={`${styles.listSocialLink} d-inline-flex align-items-center`}
              >
                <Link
                  href={process.env.REACT_APP_FACEBOOK_LINK}
                  className="d-inline-flex text-decoration-none list-social__link link"
                >
                  <svg className="icon icon-facebook" viewBox="0 0 18 18">
                    <path
                      fill="currentColor"
                      d="M16.42.61c.27 0 .5.1.69.28.19.2.28.42.28.7v15.44c0 .27-.1.5-.28.69a.94.94 0 01-.7.28h-4.39v-6.7h2.25l.31-2.65h-2.56v-1.7c0-.4.1-.72.28-.93.18-.2.5-.32 1-.32h1.37V3.35c-.6-.06-1.27-.1-2.01-.1-1.01 0-1.83.3-2.45.9-.62.6-.93 1.44-.93 2.53v1.97H7.04v2.65h2.24V18H.98c-.28 0-.5-.1-.7-.28a.94.94 0 01-.28-.7V1.59c0-.27.1-.5.28-.69a.94.94 0 01.7-.28h15.44z"
                    ></path>
                  </svg>
                </Link>
              </li>
              <li
                className={`${styles.listSocialLink} d-inline-flex align-items-center`}
              >
                <Link
                  href={process.env.REACT_APP_INSTAGRAM_LINK}
                  className="d-inline-flex text-decoration-none list-social__link link"
                >
                  <svg className="icon icon-instagram" viewBox="0 0 18 18">
                    <path
                      fill="currentColor"
                      d="M8.77 1.58c2.34 0 2.62.01 3.54.05.86.04 1.32.18 1.63.3.41.17.7.35 1.01.66.3.3.5.6.65 1 .12.32.27.78.3 1.64.05.92.06 1.2.06 3.54s-.01 2.62-.05 3.54a4.79 4.79 0 01-.3 1.63c-.17.41-.35.7-.66 1.01-.3.3-.6.5-1.01.66-.31.12-.77.26-1.63.3-.92.04-1.2.05-3.54.05s-2.62 0-3.55-.05a4.79 4.79 0 01-1.62-.3c-.42-.16-.7-.35-1.01-.66-.31-.3-.5-.6-.66-1a4.87 4.87 0 01-.3-1.64c-.04-.92-.05-1.2-.05-3.54s0-2.62.05-3.54c.04-.86.18-1.32.3-1.63.16-.41.35-.7.66-1.01.3-.3.6-.5 1-.65.32-.12.78-.27 1.63-.3.93-.05 1.2-.06 3.55-.06zm0-1.58C6.39 0 6.09.01 5.15.05c-.93.04-1.57.2-2.13.4-.57.23-1.06.54-1.55 1.02C1 1.96.7 2.45.46 3.02c-.22.56-.37 1.2-.4 2.13C0 6.1 0 6.4 0 8.77s.01 2.68.05 3.61c.04.94.2 1.57.4 2.13.23.58.54 1.07 1.02 1.56.49.48.98.78 1.55 1.01.56.22 1.2.37 2.13.4.94.05 1.24.06 3.62.06 2.39 0 2.68-.01 3.62-.05.93-.04 1.57-.2 2.13-.41a4.27 4.27 0 001.55-1.01c.49-.49.79-.98 1.01-1.56.22-.55.37-1.19.41-2.13.04-.93.05-1.23.05-3.61 0-2.39 0-2.68-.05-3.62a6.47 6.47 0 00-.4-2.13 4.27 4.27 0 00-1.02-1.55A4.35 4.35 0 0014.52.46a6.43 6.43 0 00-2.13-.41A69 69 0 008.77 0z"
                    ></path>
                    <path
                      fill="currentColor"
                      d="M8.8 4a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.43a2.92 2.92 0 110-5.85 2.92 2.92 0 010 5.85zM13.43 5a1.05 1.05 0 100-2.1 1.05 1.05 0 000 2.1z"
                    ></path>
                  </svg>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};