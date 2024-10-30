import React from "react";
import { Route, Routes } from "react-router-dom";
import Sitemap from "../Components/Sitemap/SitemapNew";
import { AboutUs } from "../pages/AboutUs/AboutUs";
import { AddAddress } from "../pages/AddAddress/AddAddress";
import { Cancellation } from "../pages/Cancellation/Cancellation";
import { AgeCategoryPage } from "../pages/CategoryPage/ageCategoryPage";
import { BrandCategoryPage } from "../pages/CategoryPage/brandCategoryPage";
import { ShopVerticalPage } from "../pages/CategoryPage/shopVerticalPage";
import { StoreProductCategory } from "../pages/CategoryPage/StoreProduct";
import { Faq } from "../pages/Faq/Faq";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { MyAccount } from "../pages/MyAccount/MyAccount";
import { MyAddress } from "../pages/MyAddress/MyAddress";
import { MyOrders } from "../pages/MyOrders/MyOrders";
import { Offers } from "../pages/Offers/Offers";
import { OrderDetails } from "../pages/OrderDetails/OrderDetails";
import { Payments } from "../pages/Payments/Payments";
import { Press } from "../pages/Press/Press";
import { Privacy } from "../pages/Privacy/Privacy";
import { ProductPage } from "../pages/ProductPage/ProductPage";
import { Register } from "../pages/Register/Register";
import { Return } from "../pages/Return/Return";
import { SearchPage } from "../pages/SearchPage/SearchPage";
import { ShopOffers } from "../pages/ShopOffers/ShopOffers";
import { ShoppingCart } from "../pages/ShoppingCart/ShoppingCart";
import { SubCategoryPage } from "../pages/SubCategoryPage/SubCategoryPage";
import { Terms } from "../pages/Terms/Terms";
import { VerifyOtp } from "../pages/VerifyOtp/VerifyOtp";
import { ProtectedRoutes } from "./ProtectedRoutes";
import ContactUsPage from "../pages/ContactUs/ContactUs";

export const PublicRoutes = () => {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify" element={<VerifyOtp />} />
      <Route path="/product/:slug" element={<ProductPage />} />
      <Route path="/shop-offers" element={<ShopOffers />} />
      <Route path="/store/:verticalSlug" element={<SubCategoryPage />} />
      <Route path="/store-product/:category" element={<StoreProductCategory />} />
      <Route
        path="/store-product/vertical/:verticalSlug/category/:categorySlug"
        element={<ShopVerticalPage />}
      />
      <Route
        path="/store-product/brand/:brandId"
        element={<BrandCategoryPage />}
      />

      <Route path="/store/age/:ageId" element={<AgeCategoryPage />} />
      <Route path="/search-product/:keyword" element={<SearchPage />} />
      <Route path="/offers" element={<Offers />} />
      <Route path="/checkout" element={<ShoppingCart />} />
      <Route
        path="/my-account"
        element={<ProtectedRoutes element={<MyAccount />} />}
      />
      <Route
        path="/my-orders"
        element={<ProtectedRoutes element={<MyOrders />} />}
      />
      <Route
        path="/order-details"
        element={<ProtectedRoutes element={<OrderDetails />} />}
      />
      <Route
        path="/my-address"
        element={<ProtectedRoutes element={<MyAddress />} />}
      />
      <Route
        path="/add-new-address"
        element={<ProtectedRoutes element={<AddAddress />} />}
      />

      <Route path="/contact-us" element={<ContactUsPage />} />

      <Route path="/privacy-policy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/return-policy" element={<Return />} />
      <Route path="/payments" element={<Payments />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/faq" element={<Faq />} />
      <Route path="/Cancellation-policy" element={<Cancellation />} />
      <Route path="/press" element={<Press />} />
      <Route path="/sitemap" element={<Sitemap />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
};
