import React from "react";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { MyOrdersBox } from "../../Components/MyOrdersBox/MyOrdersBox";
import { Header } from "../../Components/Header/Header";
import { useApp } from "../../context/AppContextProvider";
import { MyAccountMenu } from "../MyAccount/MyAccount";
import { Footer } from "../../Components/Footer/Footer";

export const MyOrders = () => {
  const appData = useApp();
  let windowWidth = appData.appData.windowWidth;
  return (
    <React.Fragment>
      <div className="hideInDesktop">
        <PageHeader title="My Orders" />
        <MyOrdersBox />
      </div>

      <div className="hideInMobile">
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
      </div>
    </React.Fragment>
  )
}