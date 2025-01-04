import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";

export const Terms = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="Terms & Conditions" hide={true} />
      ) : (
        <Header />
      )}
      <h1 className="titleMainSmall fw-bold mt-5">Terms & Conditions</h1>
      <div className="min-vh-100 col-12 d-inline-flex flex-column pt-2" style={{
        letterSpacing: "1px",
        fontSize: "14px",
      }}>
        <div className="container">
          <p className="c6">
            <span className="c4">
              Explore our comprehensive Terms & Conditions document tailored for
              ByeByeMRPS owned and operated by Kamal Enterprises, covering essential aspects for our online re-commerce
              platform operating in India.
            </span>
          </p>
          <p className="c6">
            <span className="c1">byebyemrps.com owned and operated by Kamal Enterprises Terms &amp; Conditions</span>
          </p>
          <p className="c6">
            <span className="c2">Effective Date:</span>
            <span className="c4">&nbsp;February 29, 2024</span>
          </p>
          <p className="c6">
            <span className="c2">
              Welcome to byebyemrps.com owned and operated by Kamal Enterprises (&quot;the Site&quot;). These Terms
              &amp; Conditions (&quot;Terms&quot;) govern your use of the Site
              and the purchase of products from ByeByeMRPS owned and operated by Kamal Enterprises.
            </span>
            <span className="c8">&nbsp;</span>
            <span className="c1">
              Please read these Terms carefully before using the Site.
            </span>
          </p>
          <p className="c6">
            <span className="c1">
              By accessing or using the Site, you agree to be bound by these
              Terms. If you do not agree to these Terms, please do not use the
              Site.
            </span>
          </p>
          <p className="c6">
            <span className="c1">1. Account Creation and Use</span>
          </p>
          <ul className="c10 lst-kix_41vytponpesc-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                To purchase products on the Site, you will need to create an
                account. You must provide accurate and complete information
                during account creation.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You are responsible for keeping your account information
                confidential and secure.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You are responsible for all activities that occur under your
                account.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">2. Orders and Payments</span>
          </p>
          <ul className="c10 lst-kix_x9trviihoyda-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                All prices displayed on the Site are in Indian Rupees (INR).
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We accept various payment methods, including credit cards, debit
                cards, net banking, and other online payment options.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Orders are subject to our acceptance and product availability.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We reserve the right to refuse or cancel any order for any
                reason.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">3. Shipping and Delivery</span>
          </p>
          <ul className="c10 lst-kix_hys2k6nfua2y-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                Shipping costs and delivery times will vary based on your
                location and the products ordered.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                Orders gets delivered within 0 to 7 days.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We provide estimated shipping and delivery times, but delays may
                occur.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                We are not responsible for delays caused by shipping carriers or
                circumstances beyond our control.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">4. Returns and Refunds</span>
          </p>
          <ul className="c10 lst-kix_vlvevcfz125y-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                Please refer to our Return Policy for details on returns and
                refunds.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">5. Intellectual Property</span>
          </p>
          <ul className="c10 lst-kix_ui22japon8s6-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                All content on the Site, including text, graphics, logos,
                images, and software is the property of ByeByeMRPS owned and operated by Kamal Enterprises or its
                licensors and is protected by copyright and trademark laws.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You may not use any content from the Site without our express
                written permission.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">6. User Conduct</span>
          </p>
          <ul className="c10 lst-kix_t7wxppec3y21-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                You may not use the Site for any unlawful purpose.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You may not post or transmit any content that is harmful,
                threatening, abusive, hateful, or defamatory.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">
                You may not infringe on the privacy or intellectual property
                rights of others.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">7. Disclaimer of Warranties</span>
          </p>
          <ul className="c10 lst-kix_9wcnank9vdef-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                THE SITE AND ALL PRODUCTS ARE PROVIDED &quot;AS IS&quot; WITHOUT
                WARRANTY OF ANY KIND. WE DISCLAIM ALL WARRANTIES, EXPRESS OR
                IMPLIED, INCLUDING WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
                A PARTICULAR PURPOSE.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">8. Limitation of Liability</span>
          </p>
          <ul className="c10 lst-kix_p13n24n4ehlw-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                WE WILL NOT BE LIABLE FOR ANY DAMAGES ARISING FROM YOUR USE OF
                THE SITE, INCLUDING DIRECT, INDIRECT, INCIDENTAL, OR
                CONSEQUENTIAL DAMAGES.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">9. Indemnification</span>
          </p>
          <ul className="c10 lst-kix_28a2ovzdh5yk-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                You agree to indemnify and hold ByeByeMRPS owned and operated by Kamal Enterprises harmless from any
                claims or damages that arise from your use of the Site or your
                violation of these Terms.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">10. Changes to Terms &amp; Conditions</span>
          </p>
          <ul className="c10 lst-kix_3hwx62c9dori-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                We may update these Terms at any time. We will post the updated
                Terms on the Site. Your continued use of the Site after any
                changes are made constitutes your acceptance of the updated
                Terms.
              </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">11. Governing Law</span>
          </p>
          <ul className="c10 lst-kix_5fuohnhegco1-0 start">
            <li className="c0 li-bullet-0">
              <span className="c4">
                These Terms will be governed by and construed in accordance with
                the laws of India.
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c4">We follow the Delhi High Court</span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">12. Contact Us</span>
          </p>
          <p className="c6">
            <span className="c4">
              For any questions or concerns, please contact us:
            </span>
          </p>
          <ul className="c10 lst-kix_pcvdgx2icjy4-0 start">
            <li className="c0 li-bullet-0">
              <span className="c2">Email:</span>
              <span className="c15">
                <a className="c17" href={`mailto:${enviroment.EMAIL_ADDRESS}`}>
                  {enviroment.EMAIL_ADDRESS}
                </a>
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Phone:</span>
              <span className="c4">
                &nbsp;
                {enviroment.PHONE_NUMBER}
              </span>
            </li>
            <li className="c0 li-bullet-0">
              <span className="c2">Address:</span>
              <span className="c8">&nbsp;</span>
              <span className="c14">{enviroment.STORE_ADDRESS}, </span>
            </li>
          </ul>
          <p className="c6">
            <span className="c1">
              By using the byebyemrps.com owned and operated by Kamal Enterprises website, you acknowledge and agree
              to these Terms &amp; Conditions.
            </span>
          </p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
