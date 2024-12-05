import React, { useState, useEffect } from "react";
import styles from "./Footer.module.css";
import { enviroment } from "../../enviroment";
import { Link } from "react-router-dom";
import {
  EmailIcon,
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  PhoneIcon,
  TwitterIcon,
  YoutubeIcon,
  TruckIcon,
  LiveTrackIcon,
  SpecialOfferIcon,
} from "../siteIcons";
import { useApp } from "../../context/AppContextProvider";

export const Footer = () => {
  const [currentYear, setCurrentYear] = useState("");
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    let year = new Date().getFullYear();
    setCurrentYear(year);
  }, []);
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <footer
          className={`${styles.siteFooter} d-inline-flex flex-column col-12`}
          data-section-id="footer"
          data-section-type="footer-section"
        >
          <div
            className={`${styles.footerBlock} col-12 p-0`}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div className={`${styles.footerBlock}`} data-type="menu">
              <div className={`${styles.footerTitle}`}>About Us</div>
              <ul className={`${styles.footerMenu} list-unstyled`}>
                <li>
                  <a
                    href="/about-us"
                    target="_blank"
                    rel="noopener"

                    className="text-decoration-none d-inline-flex"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <Link className="text-decoration-none d-inline-flex">
                    Our Team
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none d-inline-flex">
                    Press
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none d-inline-flex">
                    Our Stores
                  </Link>
                </li>
              </ul>
            </div>
            <div className={`${styles.footerBlock}`} data-type="menu">
              <div className={`${styles.footerTitle}`}>Get Help</div>
              <ul className={`${styles.footerMenu} list-unstyled`}>
                <li>
                  <a
                    href="/Cancellation-policy"
                    target="_blank"
                    rel="noopener"
                    className="text-decoration-none d-inline-flex"
                  >
                    Cancellation
                  </a>
                </li>
                <li>
                  <a
                    href="/payments"
                    target="_blank"
                    rel="noopener"
                    className="text-decoration-none d-inline-flex"
                  >
                    Payments
                  </a>
                </li>
                <li>
                  <Link to='/contact-us' className="text-decoration-none d-inline-flex">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className="text-decoration-none d-inline-flex">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.footerBlock} mt-4 col-12 p-0`}
            data-type="contact"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
            }}
          >
            <div className={`${styles.footerBlock}`} data-type="menu">
              <div className={`${styles.footerTitle}`}>Policies</div>
              <ul className={`${styles.footerMenu} list-unstyled`}>
                <li>
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener"
                    className="text-decoration-none d-inline-flex"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    rel="noopener noreferrer"
                    target="_blank"
                    className="text-decoration-none d-inline-flex"
                  >
                    Terms &amp; Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="/return-policy"
                    target="_blank"
                    rel="noopener"
                    className="text-decoration-none d-inline-flex"
                  >
                    Return Policies
                  </a>
                </li>
                <li>
                  <a
                    href="/sitemap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none d-inline-flex"
                  >
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
            <div
              className={`${styles.footerBlockMobile} col-12 p-0 d-inline-block`}
            >
              <div className={`${styles.footerTitle}`}>Get in touch</div>
              <ul
                className={`${styles.footerMenu} list-unstyled d-inline-flex flex-column`}
              >
                <li
                  className={`${styles.footerIconLink} d-inline-flex col-12 p-0 align-items-center`}
                >
                  <a
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    href={`tel:${enviroment.PHONE_NUMBER}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <PhoneIcon />
                    <span>{enviroment.PHONE_NUMBER}</span>
                  </a>
                </li>
                <li
                  className={`${styles.footerIconLink} d-inline-flex col-12 p-0 align-items-center`}
                >
                  <a
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    href={`mailto:${enviroment?.EMAIL_ADDRESS}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <EmailIcon />
                    <span>{enviroment?.EMAIL_ADDRESS}</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.footerBlock} mt-4 col-12 p-0 d-inline-flex flex-column`}
            data-type="contact"
          >
            <div
              className={`${styles.footerBlockMobile} col-12 p-0 d-inline-block`}
            >
              <div className={`${styles.footerTitle}`}>Follow us</div>
              <ul
                className={`${styles.footerMenu} gap-2 list-unstyled`}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <li
                  className={`${styles.footerIconLink} d-inline-flex p-0 align-items-center`}
                >
                  <a
                    href={enviroment.INSTAGRAM_LINK}
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${enviroment.BUSINESS_NAME} on Instagram`}
                  >
                    <InstagramIcon />
                    {/* <span>Instagram</span> */}
                  </a>
                </li>
                <li
                  className={`${styles.footerIconLink} d-inline-flex p-0 align-items-center`}
                >
                  <a
                    href={enviroment.FACEBOOK_LINK}
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${enviroment.BUSINESS_NAME} on Facebook`}
                  >
                    <FacebookIcon />
                    {/* <span className="icon__fallback-text">Facebook</span> */}
                  </a>
                </li>
                <li
                  className={`${styles.footerIconLink} d-inline-flex p-0 align-items-center`}
                >
                  <a
                    href={enviroment.TWITTER_LINK}
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${enviroment.BUSINESS_NAME}  on Twitter`}
                  >
                    <TwitterIcon />
                    {/* <span className="icon__fallback-text">Twitter</span> */}
                  </a>
                </li>
                <li
                  className={`${styles.footerIconLink} d-inline-flex p-0 align-items-center`}
                >
                  <a
                    href={enviroment.LINKEDIN_LINK}
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${enviroment.BUSINESS_NAME} on LinkedIn`}
                  >
                    <LinkedInIcon />
                    {/* <span className="icon__fallback-text">LinkedIn</span> */}
                  </a>
                </li>
                <li
                  className={`${styles.footerIconLink} d-inline-flex p-0 align-items-center`}
                >
                  <a
                    href={enviroment.YOUTUBE_LINK}
                    className="d-inline-flex align-items-center text-decoration-none gap-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`${enviroment.BUSINESS_NAME} on LinkedIn`}
                  >
                    <YoutubeIcon />
                    {/* <span className="icon__fallback-text">LinkedIn</span> */}
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div
            className={`${styles.footerSection} text-center col-12 d-inline-block`}
          >
            <div className="page-width text-center small--text-left">
              <div
                className={`${styles.footerBaseLinks} d-inline-flex justify-content-center`}
              >
                <span>
                  &copy; {currentYear} {enviroment.BUSINESS_NAME}
                </span>
              </div>
            </div>
          </div>
        </footer>
      ) : windowWidth === "desktop" ? (
        <React.Fragment>
          <footer
            className={`${styles.footerContainer} col-12 d-inline-flex py-5`}
          >
            <div className="container">
              <div className="col-md-12 p-0 d-inline-flex">
                <div className="col-4 px-3">
                  <div
                    className={`${styles.imgBoxImg} col-md-12 p-0 text-center d-inline-block mb-1`}
                  >
                    <TruckIcon />
                  </div>
                  <div
                    className={`${styles.imgBoxText} col-md-12 p-0 text-center d-inline-block`}
                  >
                    <h6
                      className={`${styles.imgBoxTitle} col-md-12 p-0 d-inline-block mb-2 text-center`}
                    >
                      Fast Delivery
                    </h6>
                    <p
                      className={`${styles.imgBoxDesc} col-md-12 p-0 d-inline-block mb-0 text-center`}
                    >
                      We ship your products through fastest means of
                      transportation.
                    </p>
                  </div>
                </div>
                <div className="col-4 px-3">
                  <div
                    className={`${styles.imgBoxImg} col-md-12 p-0 text-center d-inline-block mb-1`}
                  >
                    <LiveTrackIcon />
                  </div>
                  <div
                    className={`${styles.imgBoxText} col-md-12 p-0 text-center d-inline-block`}
                  >
                    <h6
                      className={`${styles.imgBoxTitle} col-md-12 p-0 d-inline-block mb-2 text-center`}
                    >
                      Live Track
                    </h6>
                    <p
                      className={`${styles.imgBoxDesc} col-md-12 p-0 d-inline-block mb-0 text-center`}
                    >
                      We keep you posted with every steps of your order.{" "}
                    </p>
                  </div>
                </div>
                <div className="col-4 px-3">
                  <div
                    className={`${styles.imgBoxImg} col-md-12 p-0 text-center d-inline-block mb-1`}
                  >
                    <SpecialOfferIcon />
                  </div>
                  <div
                    className={`${styles.imgBoxText} col-md-12 p-0 text-center d-inline-block`}
                  >
                    <h6
                      className={`${styles.imgBoxTitle} col-md-12 p-0 d-inline-block mb-2 text-center`}
                    >
                      Special Offers
                    </h6>
                    <p
                      className={`${styles.imgBoxDesc} col-md-12 p-0 d-inline-block mb-0 text-center`}
                    >
                      You are special to us. Visit us for wide range of offers
                      and discounts.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-12 d-inline-flex justify-content-between mt-5">
                <div
                  className={`${styles.footerTabCol} col-3 d-inline-flex flex-column px-3`}
                >
                  <h5>About Us</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        href="/about-us"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        About Us
                      </a>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="">
                        Our Team
                      </Link>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="">
                        Press
                      </Link>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="">
                        Our Stores
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className={`${styles.footerTabCol} col-3 d-inline-flex flex-column px-3`}
                >
                  <h5>Get Help</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/Cancellation-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Cancellation
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/payments"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Payments
                      </a>
                    </li>
                    <li>
                      <Link to='/contact-us' className="text-decoration-none d-inline-flex">
                        Contact Us
                      </Link>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
                <div
                  className={`${styles.footerTabCol} col-3 d-inline-flex flex-column px-3`}
                >
                  <h5>Policies</h5>
                  <ul className="list-unstyled">
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Privacy
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms & Conditions
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/return-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Return Policies
                      </a>
                    </li>
                    <li>
                      <a
                        className="text-decoration-none"
                        href="/sitemap"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Sitemap
                      </a>
                    </li>
                  </ul>
                </div>
                <div
                  className={`${styles.footerTabCol} col-3 d-inline-flex flex-column px-3`}
                >
                  <h5>Get social with us</h5>
                  <ul className="list-unstyled d-inline-flex align-items-center mb-3 gap-3">
                    <li className={`${styles.socialIcon} list-unstyled`}>
                      <a
                        href={enviroment.FACEBOOK_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <FacebookIcon />
                      </a>
                    </li>
                    <li className={`${styles.socialIcon} list-unstyled`}>
                      <a
                        href={enviroment.TWITTER_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <TwitterIcon />
                      </a>
                    </li>
                    <li className={`${styles.socialIcon} list-unstyled`}>
                      <a
                        href={enviroment.INSTAGRAM_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <InstagramIcon />
                      </a>
                    </li>
                    <li className={`${styles.socialIcon} list-unstyled`}>
                      <a
                        href={enviroment.LINKEDIN_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                        title={`${enviroment.BUSINESS_NAME} on LinkedIn`}
                      >
                        <LinkedInIcon />
                      </a>
                    </li>
                    <li className={`${styles.socialIcon} list-unstyled`}>
                      <a
                        href={enviroment.YOUTUBE_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <YoutubeIcon />
                      </a>
                    </li>
                  </ul>
                  <h5 className="mb-2">Contact Us</h5>
                  <div className="d-inline-flex align-items-center mb-3">
                    <a
                      href={`https://api.whatsapp.com/send?phone=${enviroment.PHONE_NUMBER}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-decoration-none d-inline-flex align-items-center ${styles.whatsAppLink}`}
                    >
                      <i className="fa fa-whatsapp"></i>&nbsp;
                      <span>{enviroment.PHONE_NUMBER}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
          <div className="col-md-12 d-inline-flex justify-content-center">
            <div className="container">
              <div className="col-md-12 d-inline-flex justify-content-between align-items-center">
                <div className={`col-12 d-inline-flex mt-3`}>
                  <div className={`${styles.copyright}`}>
                    <p>
                      © Copyright {new Date().getFullYear()}{" "}
                      {enviroment.BUSINESS_NAME}. All Rights Reserved
                      <br />
                      <small>
                        {" "}
                        Made with{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="red"
                          class="bi bi-heart-fill"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"
                          />
                        </svg>
                        <i className="fa fa-heart" aria-hidden="true"></i> by{" "}
                        <a
                          className={`${styles.copyrightReward} text-decoration-none`}
                          href="https://rewardsplus.in"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          RewardsPlus
                        </a>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : (
        ""
      )}
      {/* <Specials /> */}
    </React.Fragment>
  );
};
