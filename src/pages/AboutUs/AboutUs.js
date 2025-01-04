import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";

export const AboutUs = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <PageHeader title="About Us" hide={true} />
      ) : (
        <Header />
      )}
      <h1 className="titleMainSmall fw-bold mt-5">About us</h1>
      <div className="min-vh-100 col-12 d-inline-flex flex-column pt-2" style={{
        letterSpacing: "1px",
        fontSize: "14px",
      }}>
        <div className="container">

          <p className="c6">
            <span className="c1">
              About ByeByeMRPS &ndash; Your Ultimate Destination for Quality
              Re-Commerce!
            </span>
          </p>
          <p className="c6">
            Welcome to ByeByeMRPS!
            <br />
            At ByeByeMRPS, we pride ourselves on being a premium brand
            dedicated to re-commerce. We specialize in the resale of branded
            electronics and household items, offering our customers quality
            products at exceptional value.
            <br />
            <br />
            Our inventory consists of items sourced directly from original
            equipment manufacturers (OEMs) under various categories, including
            excess inventory, transit damage, service returns, and end-of-life
            items. Additionally, we procure unboxed items returned by customers
            from leading eCommerce portals. These products have never been owned
            by anyone else, ensuring they are pristine and unused.
            <br />
            <br />
            While some of our items may have packaging boxes opened or exhibit
            minor scratches or dents, we guarantee their quality and
            functionality.
            <br />
            <br />
            What sets us apart is our efficient procurement channel, allowing us
            to source these items at scale from OEMs and eCommerce platforms
            nationwide. This enables us to offer a wide selection of products
            through our company-owned outlets, franchises, business associates,
            and our online portal.
            <br />
            <br />
            Whether you're looking for the latest gadgets or essential household
            items, ByeByeMRPS is your trusted destination for premium
            re-commerce products. Join us in embracing sustainable consumption
            while enjoying top-notch products at unbeatable prices.
            <br />
            <br />
            Discover the difference with ByeByeMRPS today!
          </p>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
