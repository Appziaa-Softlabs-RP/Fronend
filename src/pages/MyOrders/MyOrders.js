import React from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { MyOrdersBox } from "../../Components/MyOrdersBox/MyOrdersBox";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { MyAccountMenu } from "../MyAccount/MyAccount";

export const MyOrders = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;
  return (
    <React.Fragment>
      {windowWidth === "mobile" ? (
        <React.Fragment>
          <PageHeader title="My Orders" />
          <MyOrdersBox />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Header />
          <div className="col-12 d-inline-flex mt-4">
            <div className="container">
              <div className="d-flex gap-3 col-12 align-items-start">
                <MyAccountMenu />
                <div className="d-flex flex-grow-1">
                  <MyOrdersBox />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
