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
      <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
        <div className="container">
          <div class="hero">
            <div class="container text-center">
              <h1 style={{
                fontSize: "2.5rem"
              }}>Welcome to Kandavika</h1>
              <p class="lead" style={{
                color: "#8b4513"
              }}>Official Franchisee Partner of Chaina Ram Sindhi Halwai</p>
            </div>
          </div>

          <div class="container">
            <div class="content">
              <p>Welcome to Kandavika, the proud official franchisee partner of the legendary Chaina Ram Sindhi Halwai, a name synonymous with authentic Indian sweets for over a century. Known for its timeless recipes and commitment to quality, Chaina Ram Sindhi Halwai has delighted generations with its signature sweets, prepared using the finest ingredients and the purest Desi Ghee. At Kandavika, we carry forward this rich tradition with a dedication to offering you the same unmatched taste and freshness that has made Chaina Ram a household name.</p>

              <p>Our outlets, located in the heart of South Delhi—Greater Kailash 2 (GK 2) and East of Kailash—bring you a wide range of delectable sweets and snacks. From the ever-popular Sevpak and Karachi Halwa to festive favorites like Ghevar and timeless classics such as Gulab Jamun, every product is handcrafted to perfection, ensuring that each bite delivers an authentic, heartwarming experience.</p>

              <p>We believe that sweets are more than just food—they are a part of every celebration, memory, and special moment. That's why we ensure that all our sweets and namkeens are made with love and care, staying true to traditional methods while maintaining the highest standards of hygiene and quality.</p>

              <p>Beyond our physical outlets, we also offer the convenience of online ordering through our portal, making it easier than ever to enjoy our delicacies from the comfort of your home. Whether you are hosting a special occasion, gifting loved ones, or simply indulging in a sweet treat, Kandavika is here to make every moment special.</p>

              <p>Join us in celebrating the timeless art of Indian sweets, and discover why Chaina Ram Sindhi Halwai continues to be a favorite across generations.</p>
            </div>
          </div>

          <div class="container text-center">
            <p>&copy; {(new Date()).getFullYear()} Kandavika. All rights reserved.</p>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
