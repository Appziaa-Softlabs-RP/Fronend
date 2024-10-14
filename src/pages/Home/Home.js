import React, { useState } from "react";
import { Aside } from "../../Components/Aside/Aside";
import { BrandFocus } from "../../Components/BrandFocus/BrandFocus";
import { CategoryShop } from "../../Components/CategoryShop/CategoryShop";
import { DealShop } from "../../Components/DealShop/DealShop";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { HeroBanner } from "../../Components/HeroBanner/HeroBanner";
import { LimitedOffers } from "../../Components/LimitedOffers/LimitedOffers";
import { LookingFor } from "../../Components/LookingFor/LookingFor";
import { NewArrival } from "../../Components/NewArrival/NewArrival";
import { PromoBanner } from "../../Components/PromoBanner/PromoBanner";
import Reviews from "../../Components/Reviews/Reviews";
import { ShopAge } from "../../Components/ShopAge/ShopAge";
import { HomeCategories } from "../../Components/home-category-products/HomeCategoryProducts";
import { useApp } from "../../context/AppContextProvider";
import WhoAreWe from "../../Components/WhoAreWe/WhoAreWe";
import TopBrands from "../../assets/topBrands/TopBrands";
import OurProcess from "../../Components/OurProcess/OurProcess";
import { AllStores } from "../../Components/AllStores/AllStores";

export const Home = () => {
  const [asideOpen, setAsideOpen] = useState(false);
  const appData = useApp();
  const isMobile = appData.appData.windowWidth === "mobile";

  return (
    <React.Fragment>
      <div className="col-12 d-inline-flex flex-column">
        <Header asideOpen={asideOpen} setAsideOpen={setAsideOpen} />
        <Aside asideOpen={asideOpen} setAsideOpen={setAsideOpen} />
        {/* hero banner */}
        <HeroBanner />
        {/* what are you looking for ? */}
        {!isMobile && <LookingFor />}

        {isMobile && <CategoryShop />}

        <DealShop />

        <NewArrival />

        <HomeCategories />

        <ShopAge />

        <PromoBanner type="Offers" />

        <LimitedOffers />

        <BrandFocus />

        <Reviews />

        <WhoAreWe />

        <TopBrands />

        <OurProcess />

        <AllStores />

        <Footer />
      </div>
    </React.Fragment>
  );
};
