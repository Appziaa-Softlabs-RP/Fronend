import React from "react";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { SubCategory } from "../../Components/SubCategory/SubCategory";
import { useLocation } from "react-router-dom";
import { Header } from "../../Components/Header/Header";
import { Footer } from "../../Components/Footer/Footer";
import { useApp } from "../../context/AppContextProvider";

export const SubCategoryPage = () => {
  const locationState = useLocation();
  const categoryID = locationState?.state?.cat;
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;

  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <React.Fragment>
          <PageHeader title="Explore Categroy" />
          <SubCategory categoryID={categoryID} />
          <Footer />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Header />
          <SubCategory categoryID={categoryID} />
          <Footer />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}