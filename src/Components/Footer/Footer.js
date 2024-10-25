import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Link } from "react-router-dom";
import siteLogo from "../../assets/images/site_logo.png";
import { enviroment } from "../../enviroment";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  YoutubeIcon
} from "../siteIcons";
import Specials from "../Specials/Specials";
import styles from "./Footer.module.css";

export const Footer = () => {

  return (
    <div>
      <footer className={`${styles.footer}`}>
        <Container fluid className={`${styles.container}`}>
          <Row>
          <Col xs={10} className='mx-auto'>
          <Row className="gy-4 d-flex flex-wrap justify-content-between">
            <Col lg={4} md={6} className="mb-4 mb-md-0">
              <div className={styles.logoWrapper}>
                <img
                  src={siteLogo}
                  alt="Kandavika"
                  width={100}
                  height={100}
                  className={styles.logo}
                />
              </div>
              <p className={styles.description} style={{
                maxWidth: '400px'
              }}>
                Welcome to Kandavika, the proud official franchisee partner of the legendary Chaina Ram Sindhi Halwai, a name synonymous with authentic Indian sweets for over a century. Known for its timeless recipes and commitment to quality, Chaina Ram Sindhi Halwai has delighted generations with its signature sweets, prepared using the finest ingredients and the purest Desi Ghee.
              </p>
            </Col>
            <Col lg={2} md={6} className="mb-4 mb-md-0">
              <h5 className={styles.heading}>About</h5>
              <ul className={styles.list}>
                <li><Link to="/about-us" className={styles.link}>About Us</Link></li>
                <li><a href="/#our-stores" className={styles.link}>Our Stores</a></li>
              </ul>
            </Col>
            <Col lg={2} md={6} className="mb-4 mb-md-0">
              <h5 className={styles.heading}>Get Help</h5>
              <ul className={styles.list}>
              <li><Link to="/contact-us" className={styles.link}>Contact Us</Link></li>
                <li><Link to="/Cancellation-policy" className={styles.link}>Cancellation</Link></li>
                <li><Link to="/payments" className={styles.link}>Payments</Link></li>
                <li><Link to="/FAQ" className={styles.link}>FAQ</Link></li>
              </ul>
            </Col>
            <Col lg={2} md={6} className="mb-4 mb-md-0">
              <h5 className={styles.heading}>Policies</h5>
              <ul className={styles.list}>
                <li><Link to="/privacy-policy" className={styles.link}>Privacy</Link></li>
                <li><Link to="/terms" className={styles.link}>Terms & Conditions</Link></li>
                <li><Link to="/return-policy" className={styles.link}>Return Policies</Link></li>
                <li><Link to="/sitemap" className={styles.link}>Sitemap</Link></li>
              </ul>
            </Col>
          </Row>
          <hr className={styles.divider} />
          <div className='d-flex items-center gap-3 justify-content-center align-items-center my-4'>
            <h5 style={{
              margin: '0px',
              fontSize: '0.8rem',
            }}>Follow us on</h5>
            <div className={styles.socialIcons}>
              {
                enviroment.FACEBOOK_LINK &&
                <a href={enviroment.FACEBOOK_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialLink} style={{ minWidth: '20px', minHeight: '20px' }}>
                  <FacebookIcon color={'#fff'} />
                </a>
              }
              {/* {
                enviroment.TWITTER_LINKs !== "" &&
                <a href={enviroment.TWITTER_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialLink} style={{ minWidth: '20px', minHeight: '20px' }}>
                  <TwitterIcon color={'#fff'} />
                </a>
              } */}
              {
                enviroment.INSTAGRAM_LINK !== "" &&
                <a href={enviroment.INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialLink} style={{ minWidth: '20px', minHeight: '20px' }}>
                  <InstagramIcon color={'#fff'} />
                </a>
              }
              {
                enviroment.LINKEDIN_LINK !== "" &&
                <a href={enviroment.LINKEDIN_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialLink} style={{ minWidth: '20px', minHeight: '20px' }}>
                  <LinkedInIcon color={'#fff'} />
                </a>
              }
              {
                enviroment.YOUTUBE_LINK !== "" &&
                <a href={enviroment.YOUTUBE_LINK} target="_blank" rel="noopener noreferrer" className={styles.socialLink} style={{ minWidth: '20px', minHeight: '20px' }}>
                  <YoutubeIcon color={'#fff'} />
                </a>
              }
            </div>
          </div>
          <div className={`${styles.copyright}`}>
            <p>
              © Copyright Anand Kand Pure Naturals Pvt Ltd. All Rights Reserved
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
          </Col>
          </Row>
        </Container>
      </footer>
      <Specials />
    </div>
  )
}