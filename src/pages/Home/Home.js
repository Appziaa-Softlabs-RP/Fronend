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
import { PromoBanner } from "../../Components/PromoBanner/PromoBanner";
import { ShopAge } from "../../Components/ShopAge/ShopAge";

export const Home = () => {
  const [asideOpen, setAsideOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

  return (
    <React.Fragment>
      <div className="col-12 d-inline-flex flex-column">
        <Header asideOpen={asideOpen} setAsideOpen={setAsideOpen} setFetchedNavItems={setNavItems} />
        <Aside asideOpen={asideOpen} setAsideOpen={setAsideOpen} navItems={navItems} setNavItems={setNavItems} />
        {/* hero banner */}
        <HeroBanner />

        {/* Mobile Structure */}
        <div className={`hideInDesktop`}>
          <CategoryShop />
        </div>
        {/* Desktop Structure */}
        <div className={`hideInMobile`}>
          <LookingFor />
        </div>


        <DealShop />

        <PromoBanner type="Promo Banner" />

        <ShopAge />

        <PromoBanner type="Offers" />

        <LimitedOffers />

        <BrandFocus />

        <Footer />
      </div>
    </React.Fragment>
  )
}