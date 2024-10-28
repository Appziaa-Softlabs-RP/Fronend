import fetch from "./ApiInterceptor";

const ApiService = {};

const cache = {};

// Only works until the page is refreshed
const cacheFetch = async (url, options, cacheKey, ttl = 500000) => {
  const currentTime = new Date().getTime();

    if (cache[cacheKey] && cache[cacheKey].expiry > currentTime) {
    return JSON.parse(cache[cacheKey].response);
  }

  try {
    // Make the fetch request if not in cache or cache expired
    const data = await fetch({
      url: url,
      method: options.method,
      data: options.body,
    });

    // Store the response in the cache with an expiry time
    cache[cacheKey] = {
      response: JSON.stringify(data),
      expiry: currentTime + ttl,
    };

    return data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
};

ApiService.banner = function (data) {
  const cacheKey = "/store/banner" + JSON.stringify(data);
  return cacheFetch(
    "/store/banner",
    {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.PromoBanner = function (data) {
  const cacheKey = "/store/promobanner" + JSON.stringify(data);
  return cacheFetch(
    "/store/promobanner",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.signIn = function (data) {
  return fetch({
    url: "user/signin",
    method: "post",
    data: data,
  });
};

ApiService.signupOTP = function (data) {
  return fetch({
    url: "user/sendOtpReg",
    method: "post",
    data: data,
  });
};

ApiService.sendOTP = function (data) {
  return fetch({
    url: "user/sendotp",
    method: "post",
    data: data,
  });
};

ApiService.getPaymentFees = function (data) {
  return fetch({
    url: "payments/get-company-payment-fees",
    method: "post",
    data: data,
  });
};

ApiService.sendContactUsEmail = function (data) {
  return fetch({
    url: "/send-mail",
    method: "post",
    data: data,
  });
};

ApiService.getRazorpayPublicKey = function (data) {
  return fetch({
    url: "payments/get-public-active-keys-for-company-id",
    method: "post",
    data: data,
  });
};

ApiService.VerifyOTP = function (data) {
  return fetch({
    url: "user/verifyotp",
    method: "post",
    data: data,
  });
};

ApiService.VerifyOTPReg = function (data) {
  return fetch({
    url: "user/verifyOtpReg",
    method: "post",
    data: data,
  });
};

ApiService.submitReview = function (data) {
  return fetch({
    url: "/store/reviews/add",
    method: "post",
    data: data,
  });
};

ApiService.getReviews = function (data) {
  const cacheKey = "/store/reviews" + JSON.stringify(data);
  return cacheFetch(
    "/store/reviews",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.AllCategory = function (data) {
  const cacheKey = "/store/verticalWithCatList" + JSON.stringify(data);
  return cacheFetch(
    "/store/verticalWithCatList",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.NewCategory = function (data) {
  const cacheKey = "/store/verticaldesign" + JSON.stringify(data);
  return cacheFetch(
    "/store/verticaldesign",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.StoreCategory = function (data) {
  const cacheKey = "/store/verticalList" + JSON.stringify(data);
  return cacheFetch(
    "/store/verticalList",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.StoreSubCategory = function (data) {
  const cacheKey = "/store/verticalByCategory" + JSON.stringify(data);
  return cacheFetch(
    "/store/verticalByCategory",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.StoreSubChildCategory = function (data) {
  const cacheKey = "/store/categoryBySubCategory" + JSON.stringify(data);
  return cacheFetch(
    "/store/categoryBySubCategory",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.StoreCategoryProd = function (data) {
  const cacheKey = "/store/VerticalByProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/VerticalByProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.CategoryByProd = function (data) {
  const cacheKey = "/store/category-by-product" + JSON.stringify(data);
  return cacheFetch(
    "/store/category-by-product",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.CategoryBySubProd = function (data) {
  const cacheKey = "/store/SubCategoryByProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/SubCategoryByProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.DealsOfProduct = function (data) {
  const cacheKey = "/store/normalDeals" + JSON.stringify(data);
  return cacheFetch(
    "/store/normalDeals",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.getAllStores = function (data) {
  const cacheKey = "/store/get-all-stores" + JSON.stringify(data);
  return cacheFetch(
    "/store/get-all-stores",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.HotDealsProduct = function (data) {
  const cacheKey = "/store/hotDeals" + JSON.stringify(data);
  return cacheFetch(
    "/store/hotDeals",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.addToCart = function (data) {
  return fetch({
    url: "store/addTocart",
    method: "post",
    data: data,
  });
};

ApiService.getCartList = function (data) {
  return fetch({
    url: "store/cartList",
    method: "post",
    data: data,
  });
};

ApiService.updateCart = function (data) {
  return fetch({
    url: "store/updateTocart",
    method: "post",
    data: data,
  });
};

ApiService.offers = function (data) {
  const cacheKey = "/store/offers" + JSON.stringify(data);
  return cacheFetch(
    "/store/offers",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.applicableOffers = function (data) {
  const cacheKey = "/store/applicable-offer" + JSON.stringify(data);
  return cacheFetch(
    "/store/applicable-offer",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.addMultipleCart = function (data) {
  return fetch({
    url: "store/addTocartMultiple",
    method: "post",
    data: data,
  });
};

ApiService.updateMultipleCart = function (data) {
  return fetch({
    url: "store/updateTocartMultiple",
    method: "post",
    data: data,
  });
};

ApiService.similarProd = function (data) {
  const cacheKey = "/store/cartSimilarProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/cartSimilarProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.showCart = function (data) {
  return fetch({
    url: "store/cartList",
    method: "post",
    data: data,
  });
};

ApiService.updateCart = function (data) {
  return fetch({
    url: "store/updateTocart",
    method: "post",
    data: data,
  });
};

ApiService.removeCart = function (data) {
  return fetch({
    url: "store/removeTocart",
    method: "post",
    data: data,
  });
};

ApiService.productDetails = function (data) {
  const cacheKey = "/store/productDetail" + JSON.stringify(data);
  return cacheFetch(
    "/store/productDetail",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.orderList = function (data) {
  return fetch({
    url: "store/orderList",
    method: "post",
    data: data,
  });
};

ApiService.getOrderDetail = function (data) {
  return fetch({
    url: "store/orderDetails",
    method: "post",
    data: data,
  });
};

ApiService.orderCancel = function (data) {
  return fetch({
    url: "store/orderCancelled",
    method: "post",
    data: data,
  });
};

ApiService.orderReschdule = function (data) {
  return fetch({
    url: "store/orderReschedule",
    method: "post",
    data: data,
  });
};

ApiService.orderItemCancel = function (data) {
  return fetch({
    url: "store/orderItemCancel",
    method: "post",
    data: data,
  });
};

ApiService.addressList = function (data) {
  return fetch({
    url: "store/addressList",
    method: "post",
    data: data,
  });
};

ApiService.addNewAddress = function (data) {
  return fetch({
    url: "store/addToaddress",
    method: "post",
    data: data,
  });
};

ApiService.updateAddress = function (data) {
  return fetch({
    url: "store/updateToaddress",
    method: "post",
    data: data,
  });
};

ApiService.removeAddress = function (data) {
  return fetch({
    url: "store/removeToaddress",
    method: "post",
    data: data,
  });
};

ApiService.getAddressDetail = function (data) {
  return fetch({
    url: "store/addressDetail",
    method: "post",
    data: data,
  });
};

ApiService.ageGroupBox = function (data) {
  const cacheKey = "/store/ageGroupList" + JSON.stringify(data);
  return cacheFetch(
    "/store/ageGroupList",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.ageGroupProduct = function (data) {
  const cacheKey = "/store/ageGroupByProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/ageGroupByProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.brandInFocus = function (data) {
  const cacheKey = "/store/brandOffer" + JSON.stringify(data);
  return cacheFetch(
    "/store/brandOffer",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.newArrivals = function (data) {
  const cacheKey = "/store/newarrivalRandom" + JSON.stringify(data);
  return cacheFetch(
    "/store/newarrivalRandom",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.brandProduct = function (data) {
  const cacheKey = "/store/BrandByProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/BrandByProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.getDeliveryCost = function (data) {
  return fetch({
    url: "store/deliveryCharge",
    method: "post",
    data: data,
  });
};

ApiService.cashOnDelivery = function (data) {
  return fetch({
    url: "store/cashOnDelivery",
    method: "post",
    data: data,
  });
};

ApiService.onlinePaymentProcess = function (data) {
  return fetch({
    url: "store/onlinePaymentProcess",
    method: "post",
    data: data,
  });
};

ApiService.onlinePaymentSuccess = function (data) {
  return fetch({
    url: "store/onlinePaymentSuccess",
    method: "post",
    data: data,
  });
};

ApiService.storeSearch = function (data) {
  const cacheKey = "/store/searchAI" + JSON.stringify(data);
  return cacheFetch(
    "/store/searchAI",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilter = function (data) {
  const cacheKey = "/store/FilterByProduct" + JSON.stringify(data);
  return cacheFetch(
    "/store/FilterByProduct",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterNew = function (data) {
  const cacheKey = "/store/FilterByProductNew" + JSON.stringify(data);
  return cacheFetch(
    "/store/FilterByProductNew",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterAge = function (data) {
  const cacheKey = "/store/FilterByProductAge" + JSON.stringify(data);
  return cacheFetch(
    "/store/FilterByProductAge",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterCategory = function (data) {
  const cacheKey = "/store/FilterByProductCategory" + JSON.stringify(data);
  return cacheFetch(
    "/store/FilterByProductCategory",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterByBrand = function (data) {
  const cacheKey = "/store/FilterByProducBrand" + JSON.stringify(data);
  return cacheFetch(
    "/store/FilterByProducBrand",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterBrand = function (data) {
  const cacheKey = "/store/categoryByBrand" + JSON.stringify(data);
  return cacheFetch(
    "/store/categoryByBrand",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.storeFilterOption = function (data) {
  const cacheKey = "/store/filterOption" + JSON.stringify(data);
  return cacheFetch(
    "/store/filterOption",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};
ApiService.storeFilterOptionVerticalSlug = function (data) {
  const cacheKey = "/store/filterOptionVerticalSlug" + JSON.stringify(data);
  return cacheFetch(
    "/store/filterOptionVerticalSlug",
    {
      method: "post",
      body: data,
      headers: { "Content-Type": "application/json" },
    },
    cacheKey
  );
};

ApiService.orderItemCancel = function (data) {
  return fetch({
    url: "store/orderItemCancel",
    method: "post",
    data: data,
  });
};

export default ApiService;
