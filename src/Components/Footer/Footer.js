import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Facebook, Instagram, Youtube, Linkedin } from 'react-bootstrap-icons';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className={styles.footer} style={{ backgroundColor: 'var(--PRIMARY_COLOR)', color: 'white', padding: '2rem 0' }}>
      <Container>
        <Row>
          <Col md={4}>
            <h5 className={`${styles.sectionTitle}`}>ABOUT THE SHOP</h5>
            <p className={styles.aboutText}>
              AshiElectronics is a premium brand associated with the re-commerce of branded Electronics and other household items which either have been directly procured from the OEM under excess inventory, transit damage, service return &  end of life categories or simply unboxed items returned by the customers on leading eCommerce portals. These items have never been owned by anyone, and are unused but may have their packaging boxes opened or minor scratches or dents. We have an extremely efficient procurement channel to source such items at large scale from OEMs and e-com portals, with nationwide distribution through company-owned outlets, franchises, business associates, and our online portal.
            </p>
            <div className={styles.socialIcons}>
              <Facebook className={styles.icon} />
              <Instagram className={styles.icon} />
              <Youtube className={styles.icon} />
              <Linkedin className={styles.icon} />
            </div>
          </Col>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>MAIN MENU</h5>
            <ul className={styles.menuList}>
              <li>TELEVISIONS</li>
              <li>REFRIGERATOR</li>
              <li>WASHING MACHINES</li>
              <li>AIR CARE</li>
              <li>HOME APPLIANCES</li>
              <li>LIFESTYLE</li>
              <li>MOBILES & LAPTOPS</li>
              <li>SOUND SYSTEMS</li>
            </ul>
          </Col>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>IMPORTANT LINKS</h5>
            <ul className={styles.menuList}>
              <li>
                <Link to="/about-us">ABOUT US</Link>
              </li>
              <li>
                <Link to="/contact-us">CONTACT US</Link>
              </li>
              <li>
                <Link to="/privacy-policy">PRIVACY POLICY</Link>
              </li>
              <li>
                <Link to="/return-policy">REFUND & RETURN POLICY</Link>
              </li>
              <li>
                <Link to="/shipping-information-policy">SHIPPING POLICY</Link>
              </li>
              <li>
                <Link to="/terms">TERMS OF SERVICE</Link>
              </li>
              <li>
                <Link to="/Cancellation-policy">Cancellation Policy</Link>
              </li>
              <li>
                <Link to="/faq">FAQ's</Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Row className={styles.bottomSection}>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>NEWSLETTER</h5>
            <p>Stay in touch with us, get product updates, offers, discounts directly to your inbox. Please provide your email address here (in a band). We'll never share your email address with a third party.</p>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Enter your email address" className={styles.emailInput} />
              </Form.Group>
              <Button variant="dark" type="submit" className={styles.subscribeButton}>
                SUBSCRIBE
              </Button>
            </Form>
          </Col>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>AshiElectronics</h5>
            <p>SHOP NO. -4, KAUSHIK COMPLEX, SECTOR-17,NEAR PNB BANK SUKHRALI, SUKHRALI, Gurgaon, Haryana, 122001</p>
          </Col>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>CUSTOMER CARE</h5>
            <p>
              <span>+91 9654502991</span><br />
              <span>+91 9811931938</span><br />
              <span>+91 9599727547</span><br />
              Wednesday to Monday 11:00 AM to 7:00 PM<br />Tuesday Closed</p>
          </Col>
        </Row>
        <Row className={styles.bottomSection}>
          <Col md={4}>
            <h5 className={styles.sectionTitle}>LET'S DO BUSINESS TOGETHER!</h5>
            <p>Be a part of AshiElectronics - Recommence Retail revolution and own a profitable online + offline business. Reach out to us at info@ashielectronics.com.in or Whatsapp 9654502991</p>
          </Col>
        </Row>
        <Row className={styles.copyrightSection}>
          <Col>
            <p className={styles.sectionTitle}>© AshiElectronics INDIA</p>
            <p>© 2022 AshiElectronics.in is a property of AshiElectronics. Developed & Marketed by RewardsPlus</p>
            <p>Powered by RewardsPlus</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}