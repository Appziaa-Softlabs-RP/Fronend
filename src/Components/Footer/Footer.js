import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { enviroment } from '../../enviroment';
import { useAppStore } from '../../store';
import styles from './Footer.module.css';

export const Footer = () => {

  const navItems = useAppStore((state) => state.navItems);

  return (
    <footer className={styles.footer}>
      <Container>
        <Row className={styles.mainContent}>
          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>About the Shop</h3>
            <p className={styles.aboutText}>
              Uttaranchal Trading specializes in selling open-box home and electronic appliances, offering high-quality products at deeply discounted prices. The brand ensures that all items are thoroughly tested and certified for functionality and reliability, providing customers with excellent value for money. With a focus on affordability and sustainability, Uttaranchal Trading caters to smart shoppers looking for premium appliances at unbeatable deals.
            </p>
            <div className={styles.socialIcons}>
              {
                enviroment.FACEBOOK_LINK &&
                <a href={enviroment.FACEBOOK_LINK} className={styles.socialLink}><Facebook /></a>
              }
              {
                enviroment.TWITTER_LINK &&
                <a href={enviroment.TWITTER_LINK} className={styles.socialLink}><Twitter /></a>
              }
              {
                enviroment.INSTAGRAM_LINK &&
                <a href={enviroment.INSTAGRAM_LINK} className={styles.socialLink}><Instagram /></a>
              }
              {
                enviroment.YOUTUBE_LINK &&
                <a href={enviroment.YOUTUBE_LINK} className={styles.socialLink}><Youtube /></a>
              }
              {
                enviroment.LINKEDIN_LINK &&
                <a href={enviroment.LINKEDIN_LINK} className={styles.socialLink}><Linkedin /></a>
              }
            </div>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Main Menu</h3>
            {/* {JSON.stringify(navItems)} */}
            <ul className={styles.footerLinks}>
              {navItems?.map((item, index) => (
                <li
                  key={index}
                ><Link to="/">
                    {item?.name}
                  </Link></li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Important Links</h3>
            <ul className={styles.footerLinks}>
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/return-policy">Refund & Return Policy</Link></li>
              <li><Link to="/shipping-information-policy">Shipping Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cancellation-policy">Cancellation Policy</Link></li>
              <li><Link to="/faq">FAQ's</Link></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className={styles.footerColumn}>
            <h3 className={styles.columnTitle}>Newsletter</h3>
            <p className={styles.newsletterText}>
              Stay updated with our latest offers and product news. Subscribe to our newsletter.
            </p>
            <Form className={styles.newsletterForm}>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                className={styles.emailInput}
              />
              <Button className={styles.subscribeButton}>
                Subscribe
              </Button>
            </Form>

            <div className={styles.contactInfo}>
              {/* <h3 className={styles.columnTitle}>Contact Us</h3> */}
              {/* <a href={`tel:${enviroment.PHONE_NUMBER}`} style={{ textDecoration: 'none' }}>
                <p>+91 {enviroment.PHONE_NUMBER}</p>
              </a>
              <a href={`tel:8950093336`} style={{ textDecoration: 'none' }}>
                <p>+91 8950093336</p>
              </a> */}
              <p>Monday to Sunday: 10:00 AM - 8:00 PM</p>
            </div>
          </Col>
        </Row>

        <div className={styles.copyrightSection}>
          <p>© {(new Date()).getFullYear()} Uttaranchal Trading India</p>
          <p>uttaranchaltrading.com is a property of Uttaranchal Trading. Developed & Marketed by <a href='https://rewardsplus.in' className='text-white' rel={'noreferrer'} target='_blank'>RewardsPlus</a></p>
        </div>
      </Container>
    </footer>
  );
}
