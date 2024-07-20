import React, { useEffect, useState } from "react";
import styles from "./ProductPage.module.css";
import ReactOwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { FeaturedProducts } from "../../Components/FeaturedProducts/FeaturedProducts";
import { SimilarProduct } from "../../Components/SimilarProduct/SimilarProduct";
import { useApp } from "../../context/AppContextProvider";
import { Header } from "../../Components/Header/Header";
import { Footer } from "../../Components/Footer/Footer";
import {
  CrossIcon,
  FacebookIcon,
  LocationIcon,
  ShareIcon,
  TwitterIcon,
  WhatsAppIcon,
  PinterestIcon,
  CopyIcon,
} from "../../Components/siteIcons";
import { AppNotification } from "../../utils/helper";
import { enviroment } from "../../enviroment";
import axios from "axios";
import delivery from "../../assets/images/free-delivery.png";
import orignal from "../../assets/images/original.png";
import replacement from "../../assets/images/7-days-money-back-guarantee-icon.png";
import ApiService from "../../services/ApiService";
import { Helmet } from "react-helmet";
import { ThreeDots } from "react-loader-spinner";

export const ProductPage = () => {
  const appData = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug } = useParams();
  const locationState = useLocation();
  const [ProductData, setProductData] = useState(locationState?.state?.product);
  const [prodMainImg, setProdMainImg] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryDetail, setDeliveryDetail] = useState({});
  const [activeImg, setActiveImg] = useState("");
  const [prodDiscount, setProdDiscount] = useState(0);
  const [descActive, setDescActive] = useState("Description");
  const [prodDesc, setProdDesc] = useState({
    __html: ProductData?.description,
  });
  const [prodAdded, setProdAdded] = useState(false);
  const [prodAddedQty, setProdAddedQty] = useState(0);
  const [prodSharePop, setProdSharePop] = useState(false);
  const [otherInfo, setOtherInfo] = useState(false);
  const [featuresInfo, setFeaturesInfo] = useState(false);
  const [shareProdName, setShareProdName] = useState(
    encodeURIComponent(ProductData?.name)
  );
  const [isAboutProductDesc, setIsAboutProductDesc] = useState(true);
  const [isOtherProductDesc, setIsOtherProductDesc] = useState(false);
  const userInfo = appData?.appData?.user;
  let windowWidth = appData.appData.windowWidth;
  const pageCurrentURL = encodeURIComponent(window.location.href);

  const setMainImage = (image, count) => {
    setActiveImg(count);
    setProdMainImg(image);
  };

  const openProductColpse = () => {};

  const addToCart = (e, item) => {
    e.preventDefault();
    let cartInfo = appData?.appData?.cartData;
    let ProdId = item.product_id ? item.product_id : item?.id;
    let prodName = item?.name;
    let Mrp = item?.mrp;
    let sellingPrice = item?.selling_price;
    let stockQTY = item?.stock;
    let Quantity = 1;
    let noQty = item?.no_of_quantity_allowed;
    let dealType = item?.deal_type ? item?.deal_type : 0;
    let dealId = item?.deal_type_id;

    let cardObj = {
      company_id: parseInt(enviroment.COMPANY_ID),
      store_id: parseInt(enviroment.STORE_ID),
      product_id: ProdId,
      image: item?.image ? item.image : item?.image_url,
      product_name: prodName,
      no_of_quantity_allowed: noQty,
      is_hot_deals: dealType,
      stock: stockQTY,
      mrp: Mrp,
      selling_price: sellingPrice,
      quantity: 1,
      deal_type_id: dealId,
    };
    if (cartInfo === null) {
      cartInfo = [cardObj];
    } else {
      let cartID = cartInfo?.findIndex((obj) => obj.product_id === ProdId);
      if (cartID === null || cartID === undefined || cartID === -1) {
        cartInfo.push(cardObj);
      }
    }
    appData.setAppData({
      ...appData.appData,
      cartData: cartInfo,
      cartCount: cartInfo?.length,
    });
    localStorage.setItem("cartData", JSON.stringify(cartInfo));
    AppNotification(
      "Success",
      "Product added into the cart successfully.",
      "success"
    );

    if (appData.appData?.user?.customer_id) {
      let cartDataJson = [
        {
          product_id: ProdId,
          product_name: prodName,
          stock: stockQTY,
          mrp: Mrp,
          selling_price: sellingPrice,
          quantity: Quantity,
          no_of_quantity_allowed: noQty,
          is_hot_deals: dealType,
          deal_type_id: dealId,
          company_id: parseInt(enviroment.COMPANY_ID),
          store_id: parseInt(enviroment.STORE_ID),
        },
      ];

      const payload = {
        company_id: parseInt(enviroment.COMPANY_ID),
        store_id: parseInt(enviroment.STORE_ID),
        customer_id: userInfo.customer_id,
        cartJson: JSON.stringify(cartDataJson),
      };
      ApiService.addMultipleCart(payload)
        .then((res) => {
          if (res?.message === "Add successfully.") {
            let resCart = res.payload_cartList_items;
            appData.setAppData({
              ...appData.appData,
              cartSaved: true,
              cartData: resCart,
              cartCount: resCart?.length,
              cartID: res.payload_cartList_id,
            });
            localStorage.setItem("cartSaved", true);
            localStorage.setItem("cartID", res.payload_cartList_id);
            localStorage.setItem("cartData", JSON.stringify(resCart));
          }
        })
        .catch((err) => {
          return err;
        });
    }
    e.stopPropagation();
  };

  const updateProdQty = (e, prodID, allowQty, currQty, type, stock) => {
    e.preventDefault();
    let cartInfo = appData?.appData?.cartData;
    let cartProdID = cartInfo.findIndex((obj) => obj.product_id === prodID);
    if (type === "plus") {
      if (currQty === allowQty) {
        AppNotification(
          "Error",
          "You have reached the product quantity limit.",
          "danger"
        );
      } else {
        let newQty = currQty + 1;
        if (stock >= newQty) {
          cartInfo[cartProdID].quantity = newQty;
        } else {
          AppNotification(
            "Error",
            "You have reached the product quantity limit.",
            "danger"
          );
        }
      }
    } else {
      let newQty = currQty - 1;
      if (newQty === 0) {
        let cartID = appData.appData.cartID;
        if (
          appData.appData.cartSaved === true &&
          cartID !== null &&
          cartID != undefined
        ) {
          const payload = {
            store_id: parseInt(enviroment.STORE_ID),
            customer_id: userInfo.customer_id,
            cart_id: cartID,
            product_id: prodID,
          };
          ApiService.removeCart(payload)
            .then((res) => {
              AppNotification(
                "Success",
                "Product removed from cart successfully",
                "success"
              );
            })
            .catch((err) => {
              AppNotification(
                "Error",
                "Unable to remove the product from cart successfully",
                "danger"
              );
            });
        }
        let newCartInfo = cartInfo.filter((obj) => obj.product_id !== prodID);
        cartInfo = newCartInfo;
      } else {
        cartInfo[cartProdID].quantity = newQty;
      }
    }
    appData.setAppData({
      ...appData.appData,
      cartData: cartInfo,
      cartCount: cartInfo?.length,
    });
    localStorage.setItem("cartData", JSON.stringify(cartInfo));
    e.stopPropagation();
  };

  const checkProdAdded = () => {
    if (appData.appData.cartData?.length && ProductData !== undefined) {
      let productID = ProductData?.product_id
        ? ProductData.product_id
        : ProductData?.id
        ? ProductData?.id
        : "";
      if (productID !== "") {
        let cartID = appData.appData.cartData.findIndex(
          (obj) => obj.product_id === productID
        );
        if (cartID !== -1) {
          setProdAdded(true);
          setProdAddedQty(appData.appData.cartData[cartID].quantity);
        } else {
          setProdAdded(false);
          setProdAddedQty(0);
        }
      }
    } else {
      setProdAdded(false);
      setProdAddedQty(0);
    }
  };

  const getDeliveyPincode = (val) => {
    setPincode(val);
    if (val.length < 6) {
      setDeliveryDetail({});
    }
  };

  const getDeliveyInfo = (val) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const weekNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var day = new Date();

    if (val.length > 5) {
      axios
        .post(`${enviroment.DELIVERY_URL}/pincode-status`, {
          store_email: "knickk8@gmail.com",
          pincode: val,
        })
        .then(function (res) {
          if (res.data.message === "Delivery found") {
            AppNotification("Success", "Product Delivery Found", "success");
            if (res?.data?.data?.max_days && res?.data?.data?.min_days) {
              var fromDay = new Date(day);
              fromDay.setDate(day.getDate() + res.data.data.min_days);
              let fromMonth = weekNames[fromDay.getDay()];
              let fromWeek = monthNames[fromDay.getMonth()];
              let fromDate = fromDay.getDate();
              fromDay = fromMonth + ", " + fromDate + " " + fromWeek;
              var nextDay = new Date(day);
              nextDay.setDate(day.getDate() + res.data.data.max_days);
              let nextMonth = weekNames[nextDay.getDay()];
              let nextWeek = monthNames[nextDay.getMonth()];
              let nextDate = nextDay.getDate();
              nextDay = nextMonth + ", " + nextDate + " " + nextWeek;
              setDeliveryDetail({ minDays: fromDay, maxDays: nextDay });
            } else if (res?.data?.data?.max_days) {
              var nextDay = new Date(day);
              nextDay.setDate(day.getDate() + res.data.data.max_days);
              let nextMonth = weekNames[nextDay.getDay()];
              let nextWeek = monthNames[nextDay.getMonth()];
              let nextDate = nextDay.getDate();
              nextDay = nextMonth + ", " + nextDate + " " + nextWeek;
              setDeliveryDetail({ maxDays: nextDay });
            } else if (res?.data?.data?.min_days) {
              var fromDay = new Date(day);
              fromDay.setDate(day.getDate() + res.data.data.min_days);
              let fromMonth = weekNames[fromDay.getDay()];
              let fromWeek = monthNames[fromDay.getMonth()];
              let fromDate = fromDay.getDate();
              fromDay = fromMonth + ", " + fromDate + " " + fromWeek;
              setDeliveryDetail({ minDays: fromDay });
            } else {
              setDeliveryDetail({});
            }
          }
        })
        .catch(function (error) {
          setDeliveryDetail({});
        });
    } else {
      setDeliveryDetail({});
    }
  };

  const showCheckoutPage = () => {
    navigate("/checkout");
  };

  const copylinkUrl = () => {
    var copyText = document.getElementById("myUrlInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    AppNotification("Copied", "URL Copied to clipboard.", "success");
  };

  useEffect(() => {
    checkProdAdded();
  }, [appData.appData]);

  useEffect(() => {
    let prodId = searchParams.get("id");
    const payload = {
      product_slug: slug,
      company_id: parseInt(enviroment.COMPANY_ID),
      store_id: parseInt(enviroment.STORE_ID),
    };

    // Fetch product details based on the slug
    ApiService.productDetails(payload)
      .then((res) => {
        if (res.message === "Product Detail") {
          setProductData(res.payload);

          // Scroll to top after setting product data
          window.scrollTo(0, 0);

          setProdMainImg(res.payload.image);

          let discountOff = "",
            ProductMrp = parseFloat(res.payload.mrp),
            ProdutSellPrice = parseFloat(res.payload.selling_price);

          if (ProductMrp > ProdutSellPrice) {
            discountOff =
              ((res.payload.mrp - res.payload.selling_price) * 100) /
              res.payload.mrp;
            discountOff = Math.ceil(discountOff);
            setProdDiscount(discountOff);
          }

          if (
            res.payload.specifications !== null &&
            res.payload.specifications !== undefined
          ) {
            Object.values(res.payload.specifications).forEach((item) => {
              if (item !== "" && item !== null && item !== undefined) {
                setOtherInfo(true);
              }
            });
          }

          if (
            res.payload.other_information !== null &&
            res.payload.other_information !== undefined
          ) {
            Object.values(res.payload.other_information).forEach((item) => {
              if (item !== "" && item !== null && item !== undefined) {
                setFeaturesInfo(true);
              }
            });
          }
        } else {
          AppNotification(
            "Error",
            "Sorry, Product detail not found.",
            "danger"
          );
        }
      })
      .catch((err) => {
        AppNotification("Error", "Sorry, Product detail not found.", "danger");
      });
  }, [slug, navigate, searchParams]);

  useEffect(() => {
    if (ProductData !== undefined) {
      setShareProdName(encodeURIComponent(ProductData?.name));
      setProdAddedQty(ProductData.no_of_quantity_allowed);
      setProdMainImg(ProductData?.image);
      let discountOff = "",
        ProductMrp = parseFloat(ProductData?.mrp),
        ProdutSellPrice = parseFloat(ProductData?.selling_price);

      if (ProductMrp > ProdutSellPrice) {
        discountOff =
          ((ProductData?.mrp - ProductData?.selling_price) * 100) /
          ProductData?.mrp;
        discountOff = Math.ceil(discountOff);
        setProdDiscount(discountOff);
      }
      setProdDesc({ __html: ProductData?.description });

      if (
        ProductData?.specifications !== null ||
        ProductData?.specifications !== undefined
      ) {
        Object.values(ProductData?.specifications).map((item) => {
          if (item !== "" && item !== null && item !== undefined) {
            setOtherInfo(true);
          }
        });
      }

      if (
        ProductData?.other_information !== null ||
        ProductData?.other_information !== undefined
      ) {
        Object.values(ProductData?.other_information).map((item) => {
          if (item !== "" && item !== null && item !== undefined) {
            setFeaturesInfo(true);
          }
        });
      }
      checkProdAdded();
    }
  }, [ProductData]);

  function removeHtmlAndTruncate(text, maxLength = 200) {
    // Remove HTML tags using DOM parsing (safer than regex)
    const tempElement = document.createElement("div");
    tempElement.innerHTML = text;
    const cleanText = tempElement.textContent || tempElement.innerText; // Handle browser compatibility

    // Truncate the text if it exceeds the limit
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  }

  return (
    <React.Fragment>
      {ProductData && (
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            {
              ProductData?.name.length > 70
                ? ProductData?.name.substring(0, 70) + "..."
                : ProductData?.name
            }{" "}
            Online - {ProductData?.store_name}
          </title>
          <meta
            name="description"
            content={removeHtmlAndTruncate(ProductData?.description).trim()}
          />
          {/* Product OG */}
          <meta property="og:title" content={ProductData?.name} />
          <meta
            property="og:description"
            content={
              // only 100 chars
              ProductData?.description.length > 320
                ? ProductData?.description
                    .replace(/<[^>]*>?/gm, "")
                    .replace(/\s+/g, " ")
                    .trim()
                    .substring(0, 320) + "..."
                : ProductData?.description
                    .replace(/<[^>]*>?/gm, "")
                    .replace(/\s+/g, " ")
                    .trim()
            }
          />
          <meta property="og:image" content={ProductData?.image} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="product" />
        </Helmet>
      )}
      {windowWidth === "mobile" ? (
        <React.Fragment>
          <PageHeader title={ProductData?.name} />
          <div className="col-12 d-inline-block position-relative">
            {ProductData?.stock === 0 || ProductData?.stock < 0 ? (
              <div
                className={`${styles.productSoldOutBox} position-absolute col-12 p-0 h-100`}
              >
                <span
                  className={`${styles.soldOutText} text-center text-uppercase position-absolute d-block`}
                >
                  Sold Out
                </span>
              </div>
            ) : (
              ""
            )}
            <ReactOwlCarousel
              className={`${styles.bannerContainer} col-12 owl-theme`}
              margin={0}
              loop={false}
              dots={true}
              items={1}
            >
              <div
                className={`col-12 d-inline-block bg-white d-flex align-items-center justify-content-center w-full`}
              >
                {prodMainImg ? (
                  <img
                    src={ProductData?.image}
                    alt={ProductData?.name}
                    className="col-12 d-inline-block"
                    style={{
                      maxHeight: "500px",
                      width: "auto",
                    }}
                  />
                ) : (
                  <div
                    className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                    style={{
                      height: "500px",
                    }}
                  >
                    <ThreeDots
                      visible={true}
                      height="80"
                      width="80"
                      color="#CF102E"
                      radius="9"
                      ariaLabel="three-dots-loading"
                      wrapperStyle={{}}
                      wrapperClass=""
                    />
                  </div>
                )}
              </div>
              {ProductData?.gallery_images?.map((item, index) => {
                return (
                  <div
                    className={`col-12 d-inline-block bg-white d-flex align-items-center justify-content-center w-full`}
                    key={index}
                  >
                    {prodMainImg ? (
                      <img
                        src={enviroment.API_IMAGE_GALLERY_URL + item}
                        alt={ProductData?.name}
                        className="col-12 d-inline-block"
                        style={{
                          maxHeight: "500px",
                          width: "auto",
                        }}
                      />
                    ) : (
                      <div
                        className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                        style={{
                          height: "500px",
                        }}
                      >
                        <ThreeDots
                          visible={true}
                          height="80"
                          width="80"
                          color="#CF102E"
                          radius="9"
                          ariaLabel="three-dots-loading"
                          wrapperStyle={{}}
                          wrapperClass=""
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </ReactOwlCarousel>
            {!ProductData?.gallery_images.length ? (
              prodMainImg ? (
                <div
                  className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                >
                  <img
                    src={prodMainImg}
                    alt={ProductData?.name}
                    className="col-12 d-inline-block"
                    style={{
                      maxHeight: "500px",
                      width: "auto",
                    }}
                  />
                </div>
              ) : (
                <div
                  className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                  style={{
                    height: "500px",
                  }}
                >
                  <ThreeDots
                    visible={true}
                    height="80"
                    width="80"
                    color="#CF102E"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              )
            ) : null}
          </div>

          <div
            className={`${styles.productAllDetail} col-12 d-inline-block p-4`}
          >
            <h2 className={`${styles.productDetailName} col-12 mb-1`}>
              {ProductData?.name}
            </h2>
            <span className="ml-3 mb-2">
              Item Code: {ProductData?.barcode}{" "}
            </span>
            <div
              className={`d-inline-flex align-items-center col-12 mb-0 position-relative`}
            >
              {ProductData?.selling_price === ProductData?.mrp ? (
                <span className={`${styles.offerPrice}`}>
                  <b>₹{ProductData?.mrp}</b>
                </span>
              ) : (
                <React.Fragment>
                  <span className={`${styles.offerPrice}`}>
                    <b>₹{ProductData?.selling_price}</b>{" "}
                    <del>₹{ProductData?.mrp}</del>
                  </span>
                  {prodDiscount !== "" && (
                    <span className={`${styles.offerPercentage} d-inline-flex`}>
                      {prodDiscount}% &nbsp;OFF
                    </span>
                  )}
                </React.Fragment>
              )}
            </div>
            <span className={`${styles.inclusivTax} col-12 d-inline-block`}>
              (Inclusive of all taxes)
            </span>
          </div>

          {ProductData?.bank_offer !== null &&
            ProductData?.bank_offer?.length > 0 &&
            ProductData?.bank_offer !== undefined && (
              <div
                className={`${styles.productDesciptionBox} mt-2 col-12 d-inline-flex flex-column gap-2 p-4`}
              >
                <h2
                  className={`${styles.availSizeTitle} d-inline-flex mt-0 mb-1`}
                >
                  Offers
                </h2>
                {ProductData?.bank_offer.length > 0 &&
                  ProductData?.bank_offer?.map((item, index) => {
                    return (
                      <span
                        key={index}
                        className={`${styles.bankOfferText} col-12 d-inline-flex align-items-center gap-3`}
                      >
                        <img src={item.logo} alt={item.description} />
                        {item.description}
                      </span>
                    );
                  })}
              </div>
            )}

          <div
            className={`${styles.productDesciptionBox} col-12 d-inline-block mb-3 p-4`}
          >
            <h2
              className={`${styles.availSizeTitle} mb-3 col-12 d-inline-block p-0`}
            >
              Product Details
            </h2>
            <div
              className={`${styles.productCollapseBox} mb-4 active col-12 d-inline-block p-0`}
              onClick={openProductColpse(this)}
            >
              <div
                className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                style={{
                  height: "fit-content",
                }}
              >
                <button
                  aria-label="About product"
                  style={{
                    borderRadius: "4px",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                >
                  <span>About product</span>&nbsp;
                </button>
                <button
                  aria-label="About product"
                  style={{
                    borderRadius: "4px",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                  }}
                  onClick={() => setIsAboutProductDesc(!isAboutProductDesc)}
                >
                  +
                </button>
              </div>
              <div
                className={`${styles.productDetailText} col-12 p-0 ${
                  !isAboutProductDesc && "visually-hidden"
                }`}
              >
                {ProductData?.description?.replace(/(<([^>]+)>)/gi, " ")}
              </div>
            </div>

            {otherInfo === true && (
              <div
                className={`${styles.productCollapseBox} col-12 d-inline-block p-0`}
                onClick={openProductColpse(this)}
              >
                <div
                  className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                  style={{
                    height: "fit-content",
                  }}
                >
                  <button
                    aria-label="Other Info"
                    style={{
                      borderRadius: "4px",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                  >
                    <span>Other Info</span>&nbsp;
                  </button>
                  <button
                    aria-label="Other Info"
                    style={{
                      borderRadius: "4px",
                      border: "none",
                      outline: "none",
                      boxShadow: "none",
                    }}
                    onClick={() => setIsOtherProductDesc(!isOtherProductDesc)}
                  >
                    +
                  </button>
                </div>
                {isOtherProductDesc && (
                  <div
                    className={`${styles.productDetailText} d-inline-flex flex-column gap-3 col-12`}
                  >
                    {ProductData?.specifications?.type && (
                      <p className="col-12 d-inline-flex gap-2  m-0">
                        <strong>Type: </strong>
                        {ProductData?.specifications?.type}
                      </p>
                    )}

                    {ProductData?.specifications?.model_name && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Model Name: </strong>
                        {ProductData?.specifications?.model_name}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.shelf_life && (
                      <p className="col-12 d-none gap-2 m-0">
                        <strong>Shelf Life: </strong>
                        {ProductData?.specifications?.shelf_life}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.shelf_life_month_years && (
                      <p className="col-12 d-none gap-2 m-0">
                        <strong>Shelf Life Month Years: </strong>
                        {
                          ProductData?.specifications?.shelf_life_month_years
                        }{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.container_type && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Container Type: </strong>
                        {ProductData?.specifications?.container_type}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.organic && (
                      <p className="col-12 d-none gap-2 m-0">
                        <strong>Organic: </strong>
                        {ProductData?.specifications?.organic}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.polished && (
                      <p className="col-12 d-none gap-2 m-0">
                        <strong>Polished: </strong>
                        {ProductData?.specifications?.polished}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.package_dimension_length && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Dimension: </strong>
                        {"L " +
                          ProductData?.specifications
                            ?.package_dimension_length +
                          " x B " +
                          ProductData?.specifications?.package_dimension_width +
                          " x H " +
                          ProductData?.specifications
                            ?.package_dimension_height}{" "}
                        cm{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.manufactured_by && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Manufactured By: </strong>
                        {ProductData?.specifications?.manufactured_by}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.packed_by && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Packed By: </strong>
                        {ProductData?.specifications?.packed_by}{" "}
                      </p>
                    )}

                    {ProductData?.specifications?.exp_date && (
                      <p className="col-12 d-inline-flex gap-2 m-0">
                        <strong>Exp Date: </strong>
                        {ProductData?.specifications?.exp_date}{" "}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className={`col-12 d-inline-block mb-5`}>
            <FeaturedProducts product={ProductData?.featured} />
            <SimilarProduct product={ProductData?.similar} />
          </div>
          <div
            className={`${styles.productBtnBox} d-inline-flex align-items-stretch col-12 position-fixed bottom-0 start-0`}
          >
            <span
              className={`${styles.goCartBtn} position-relative col-6 d-inline-flex align-items-center justify-content-center`}
              onClick={() => showCheckoutPage()}
            >
              Go to Cart
            </span>

            {!prodAdded ? (
              ProductData?.stock <= 0 ? (
                <span
                  className={`${styles.AddCartBtn} position-relative col-6 d-inline-flex align-items-center justify-content-center`}
                >
                  Out of Stock
                </span>
              ) : (
                <span
                  className={`${styles.AddCartBtn} ${
                    ProductData?.stock === 0 || ProductData?.stock < 0
                      ? styles.disableCartBtn
                      : ""
                  } position-relative col-6 d-inline-flex align-items-center justify-content-center`}
                  onClick={(e) => addToCart(e, ProductData)}
                >
                  Add to Cart
                </span>
              )
            ) : (
              <div
                className={`${styles.addedQuantityBtnBox} d-inline-flex align-items-center position-relative col-6 justify-content-evenly`}
              >
                <span
                  role="button"
                  onClick={(e) =>
                    updateProdQty(
                      e,
                      ProductData?.product_id
                        ? ProductData.product_id
                        : ProductData.id,
                      ProductData?.no_of_quantity_allowed,
                      prodAddedQty,
                      "minus",
                      ProductData?.stock
                    )
                  }
                  className={`${styles.decrease_btn} ${styles.minusIcon} d-inline-flex align-items-center justify-content-center`}
                >
                  -
                </span>
                <span className="d-inline-flex flex-shrink-0">
                  <input
                    type="text"
                    readOnly
                    value={prodAddedQty}
                    className={`${styles.countValue} d-inline-block text-center`}
                  />
                </span>
                <span
                  role="button"
                  onClick={(e) =>
                    updateProdQty(
                      e,
                      ProductData?.product_id
                        ? ProductData.product_id
                        : ProductData.id,
                      ProductData?.no_of_quantity_allowed,
                      prodAddedQty,
                      "plus",
                      ProductData?.stock
                    )
                  }
                  className={`${styles.increase_btn} ${styles.plusIcon} d-inline-flex align-items-center justify-content-center`}
                >
                  +
                </span>
              </div>
            )}
          </div>
        </React.Fragment>
      ) : windowWidth === "desktop" ? (
        <React.Fragment>
          <Header />
          <div className="col-12 d-inline-flex">
            <div className="container">
              <div
                className={`col-12 d-inline-flex align-items-start position-relative gap-4 mb-4`}
              >
                <div
                  className={`d-inline-flex flex-column gap-3 col-6 flex-shrink-1 position-sticky top-0 mt-5`}
                >
                  <div
                    className={`${styles.productContainer} d-inline-flex flex-column gap-3 col-12 pb-3`}
                  >
                    <div
                      className={`${styles.productMainImage} col-12 d-inline-block position-relative`}
                    >
                      <span
                        className={`${styles.shareIcon} d-inline-flex align-items-center justify-content-center position-absolute top-0 end-0 p-3`}
                        role="button"
                        onClick={() => setProdSharePop(true)}
                      >
                        <ShareIcon color="#CF112D" />
                      </span>
                      {prodMainImg ? (
                        <img
                          src={prodMainImg}
                          alt={ProductData?.name}
                          className="object-fit-contain m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block position-absolute"
                        />
                      ) : (
                        <div className="m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block d-flex align-items-center justify-content-center position-absolute">
                          <ThreeDots
                            visible={true}
                            height="80"
                            width="80"
                            color="#CF102E"
                            radius="9"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                          />
                        </div>
                      )}
                    </div>
                    <ReactOwlCarousel
                      key={activeImg}
                      className={`${styles.productGalleryRow} col-12 owl-theme galleryBox px-3`}
                      margin={10}
                      loop={false}
                      dots={false}
                      items={6}
                    >
                      <div
                        className={`${styles.galleryBox} ${
                          activeImg === -1 ? styles.activeGallery : ""
                        } col-12 d-inline-flex align-items-center justify-content-center`}
                        onClick={() => setMainImage(ProductData?.image, -1)}
                      >
                        <img
                          src={ProductData?.image}
                          alt={ProductData?.name}
                          className=""
                          style={{
                            height: "80px",
                            maxHeight: "80px",
                            maxWidth: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </div>

                      {ProductData?.gallery_images?.map((item, index) => {
                        return (
                          <div
                            className={`${styles.galleryBox} ${
                              activeImg === index ? styles.activeGallery : ""
                            } col-12 d-inline-flex align-items-center justify-content-center`}
                            onClick={() =>
                              setMainImage(
                                enviroment.API_IMAGE_GALLERY_URL + item,
                                index
                              )
                            }
                            key={index}
                          >
                            <img
                              src={enviroment.API_IMAGE_GALLERY_URL + item}
                              alt={ProductData?.name}
                              className=""
                              style={{
                                height: "80px",
                                maxHeight: "80px",
                                maxWidth: "100%",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        );
                      })}
                    </ReactOwlCarousel>
                  </div>
                  <div className={`col-12 d-inline-flex flex-column my-3`}>
                    <div
                      className={`${styles.productDescHeader} col-12 d-inline-flex align-items-center justify-content-between`}
                    >
                      {ProductData?.description !== "" &&
                        ProductData?.description !== null &&
                        ProductData?.description !== "Not available" && (
                          <h3
                            className={`${
                              descActive === "Description" && styles.tabActive
                            } ${
                              styles.productDescTitle
                            } col-4 d-inline-flex justify-content-center m-0`}
                            onClick={() => setDescActive("Description")}
                            role="button"
                          >
                            Product Description
                          </h3>
                        )}
                      {otherInfo === true && (
                        <h3
                          className={`${
                            descActive === "Specifications" && styles.tabActive
                          } ${
                            styles.productDescTitle
                          } col-4 justify-content-center d-inline-flex m-0`}
                          onClick={() => setDescActive("Specifications")}
                          role="button"
                        >
                          Specifications
                        </h3>
                      )}
                      {featuresInfo === true && (
                        <h3
                          className={`${
                            descActive === "Features" && styles.tabActive
                          } ${
                            styles.productDescTitle
                          } col-4 d-inline-flex justify-content-center m-0`}
                          onClick={() => setDescActive("Features")}
                          role="button"
                        >
                          Other Information
                        </h3>
                      )}
                    </div>
                    {descActive === "Description" && (
                      <div
                        className={`${styles.prodDescAnswer} d-inline-flex flex-column col-12`}
                        dangerouslySetInnerHTML={prodDesc}
                      ></div>
                    )}
                    {descActive === "Specifications" && (
                      <div
                        className={`${styles.productDetailText} d-inline-flex flex-column gap-3 col-12 p-3`}
                      >
                        {ProductData?.specifications?.type && (
                          <p className="col-12 d-inline-flex m-0">
                            <strong>Type: </strong>
                            {ProductData?.specifications?.type}
                          </p>
                        )}

                        {ProductData?.specifications?.model_name && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Model Name: </strong>
                            {ProductData?.specifications?.model_name}{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.shelf_life && (
                          <p className="col-12 d-none gap-2 m-0">
                            <strong>Shelf Life: </strong>
                            {ProductData?.specifications?.shelf_life}{" "}
                          </p>
                        )}

                        {ProductData?.specifications
                          ?.shelf_life_month_years && (
                          <p className="col-12 d-none gap-2 m-0">
                            <strong>Shelf Life Month Years: </strong>
                            {
                              ProductData?.specifications
                                ?.shelf_life_month_years
                            }{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.container_type && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Container Type: </strong>
                            {ProductData?.specifications?.container_type}{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.organic && (
                          <p className="col-12 d-none gap-2 m-0">
                            <strong>Organic: </strong>
                            {ProductData?.specifications?.organic}{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.polished && (
                          <p className="col-12 d-none gap-2 m-0">
                            <strong>Polished: </strong>
                            {ProductData?.specifications?.polished}{" "}
                          </p>
                        )}

                        {ProductData?.specifications
                          ?.package_dimension_length && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Dimension: </strong>
                            {"L " +
                              ProductData?.specifications
                                ?.package_dimension_length +
                              " x B " +
                              ProductData?.specifications
                                ?.package_dimension_width +
                              " x H " +
                              ProductData?.specifications
                                ?.package_dimension_height}{" "}
                            cm{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.manufactured_by && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Manufactured By: </strong>
                            {ProductData?.specifications?.manufactured_by}{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.packed_by && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Packed By: </strong>
                            {ProductData?.specifications?.packed_by}{" "}
                          </p>
                        )}

                        {ProductData?.specifications?.exp_date && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Exp Date: </strong>
                            {ProductData?.specifications?.exp_date}{" "}
                          </p>
                        )}
                      </div>
                    )}

                    {descActive === "Features" && (
                      <div
                        className={`${styles.productDetailText} d-inline-flex flex-column gap-3 col-12 p-3`}
                      >
                        {ProductData?.other_information?.country_origin && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Country Of Origin: </strong>
                            {ProductData?.other_information?.country_origin}
                            <br />
                          </p>
                        )}

                        {ProductData?.other_information?.manufactured_by && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Manufactured By: </strong>
                            {
                              ProductData?.other_information?.manufactured_by
                            }{" "}
                            <br />
                          </p>
                        )}

                        {ProductData?.other_information?.marketed_by && (
                          <p className="col-12 d-inline-flex gap-2 m-0">
                            <strong>Marketed By: </strong>
                            {ProductData?.other_information?.marketed_by} <br />
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.productDetailBox} d-inline-flex flex-column gap-3 col-6 flex-shrink-1 align-items-start justify-content-start px-4 pt-5`}
                >
                  {ProductData?.brand_name !== null && (
                    <h6 className={`${styles.brandName} d-inline-flex m-0`}>
                      {ProductData?.brand_name}
                    </h6>
                  )}
                  <h2
                    className={`${styles.productDetailName} col-12 mb-1 mt-0`}
                  >
                    {ProductData?.name}
                  </h2>
                  <div
                    className={`${styles.productSubLine} d-inline-flex align-items-center gap-2 col-12 mb-0 position-relative`}
                  >
                    {ProductData?.age_type ? ProductData?.age_type : ""}
                    {ProductData?.age_type !== null &&
                      ProductData?.gender_name !== null && (
                        <span className={`${styles.spaceLine} d-inline-flex`}>
                          |
                        </span>
                      )}
                    {ProductData?.gender_name ? ProductData?.gender_name : ""}
                    {ProductData?.category_name !== null &&
                      ProductData?.gender_name !== null && (
                        <span className={`${styles.spaceLine} d-inline-flex`}>
                          |
                        </span>
                      )}
                    {ProductData?.category_name
                      ? ProductData?.category_name
                      : ""}
                  </div>
                  <span className="ml-3 mb-0">
                    Item Code: {ProductData?.barcode}{" "}
                  </span>
                  <div
                    className={`d-inline-flex align-items-start flex-column gap-2 col-12 mb-4 position-relative`}
                  >
                    <h2 className={`${styles.specialTitle} d-inline-flex m-0`}>
                      Special Price
                    </h2>
                    {ProductData?.selling_price === ProductData?.mrp ? (
                      <span className={`${styles.offerPrice}`}>
                        <b>₹{ProductData?.mrp}</b>
                      </span>
                    ) : (
                      <div className="col-12 d-inline-flex align-items-center gap-3">
                        <span
                          className={`${styles.offerPrice} d-inline-flex align-items-center gap-2`}
                        >
                          <b>₹{ProductData?.selling_price}</b>
                          <del>₹{ProductData?.mrp}</del>
                        </span>
                        {prodDiscount !== "" && (
                          <span
                            className={`${styles.offerPercentage} d-inline-flex`}
                          >
                            {prodDiscount}% &nbsp;OFF
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  {!prodAdded ? (
                    ProductData?.stock <= 0 ? (
                      <span
                        role="button"
                        className={`${styles.continueShop} col-5 d-inline-flex align-items-center justify-content-center text-uppercase`}
                      >
                        Out of stock
                      </span>
                    ) : (
                      <span
                        role="button"
                        className={`${styles.continueShop} ${
                          ProductData?.stock === 0 || ProductData?.stock < 0
                            ? styles.disableCartBtn
                            : ""
                        } col-5 d-inline-flex align-items-center justify-content-center text-uppercase`}
                        onClick={(e) => addToCart(e, ProductData)}
                      >
                        Add to cart
                      </span>
                    )
                  ) : (
                    <div
                      className={`${styles.itemQuantityBtnBox} d-inline-flex align-items-center position-relative`}
                    >
                      <span
                        role="button"
                        onClick={(e) =>
                          updateProdQty(
                            e,
                            ProductData?.product_id
                              ? ProductData.product_id
                              : ProductData.id,
                            ProductData?.no_of_quantity_allowed,
                            prodAddedQty,
                            "minus",
                            ProductData?.stock
                          )
                        }
                        className={`${styles.decrease_btn} ${styles.minusIcon} d-inline-flex align-items-center justify-content-center`}
                      >
                        -
                      </span>
                      <span className="d-inline-flex flex-shrink-0">
                        <input
                          type="text"
                          readOnly
                          value={prodAddedQty}
                          className={`${styles.countValue} d-inline-block text-center`}
                        />
                      </span>
                      <span
                        role="button"
                        onClick={(e) =>
                          updateProdQty(
                            e,
                            ProductData?.product_id
                              ? ProductData.product_id
                              : ProductData.id,
                            ProductData?.no_of_quantity_allowed,
                            prodAddedQty,
                            "plus",
                            ProductData?.stock
                          )
                        }
                        className={`${styles.increase_btn} ${styles.plusIcon} d-inline-flex align-items-center justify-content-center`}
                      >
                        +
                      </span>
                    </div>
                  )}

                  {ProductData?.bank_offer !== null &&
                    ProductData?.bank_offer?.length > 0 &&
                    ProductData?.bank_offer !== undefined && (
                      <div
                        className={`${styles.bankOffer} mt-2 col-12 d-inline-flex flex-column gap-2`}
                      >
                        <h2
                          className={`${styles.bankOfferTitle} d-inline-flex mt-0 mb-1`}
                        >
                          Offers
                        </h2>
                        {ProductData?.bank_offer.length > 0 &&
                          ProductData?.bank_offer?.map((item, index) => {
                            return (
                              <span
                                key={index}
                                className={`${styles.bankOfferText} col-12 d-inline-flex align-items-center gap-3`}
                              >
                                <img src={item.logo} alt={item.description} />
                                {item.description}
                              </span>
                            );
                          })}
                      </div>
                    )}

                  <div
                    className={`${styles.qualityAssured} col-12 d-inline-flex aliign-items-stretch gap-4 mt-4 p-4`}
                  >
                    <div
                      className={`${styles.assuredBox} col-4 flex-shrink-1 d-inline-flex flex-column align-items-center gap-2`}
                    >
                      <img
                        src={delivery}
                        alt="delivery"
                        className="object-fit-contain"
                      />
                      <h6
                        className={`${styles.assuredTitle} col-12 d-inline-flex justify-content-center mb-0`}
                      >
                        Free Home Delivery
                      </h6>
                      <p
                        className={`${styles.assuredDesc} m-0 col-12 d-inline-flex justify-content-center text-center`}
                      >
                        More than 19,000 pincodes, seamlessly connected.
                      </p>
                    </div>
                    <div
                      className={`${styles.assuredBox} col-4 flex-shrink-1 d-inline-flex flex-column align-items-center gap-2`}
                    >
                      <img
                        src={orignal}
                        alt="orignal"
                        className="object-fit-contain"
                      />
                      <h6
                        className={`${styles.assuredTitle} col-12 d-inline-flex justify-content-center mb-0`}
                      >
                        100% Original
                      </h6>
                      <p
                        className={`${styles.assuredDesc} m-0 col-12 d-inline-flex justify-content-center text-center`}
                      >
                        Backed by manufacturer warranty.
                      </p>
                    </div>
                    <div
                      className={`${styles.assuredBox} col-4 flex-shrink-1 d-inline-flex flex-column align-items-center gap-2`}
                    >
                      <img
                        src={replacement}
                        alt="replacement"
                        className="object-fit-contain"
                      />
                      <h6
                        className={`${styles.assuredTitle} col-12 d-inline-flex justify-content-center mb-0`}
                      >
                        7 Days Replacement
                      </h6>
                      <p
                        className={`${styles.assuredDesc} m-0 col-12 d-inline-flex justify-content-center text-center`}
                      >
                        Shop risk-free with our 7-day return policy.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 d-inline-block mt-3 mb-3">
                    <h3
                      className={`${styles.deliveryHeading} col-12 d-inline-block mt-0 mb-4`}
                    >
                      Delivery &amp; Services
                    </h3>
                    <div className={`col-12 d-inline-block`}>
                      <div
                        className={`${styles.deliveryInputBox} d-inline-flex align-items-center col-12 position-relative mb-1`}
                      >
                        <LocationIcon color={enviroment.PRIMARY_COLOR} />
                        <input
                          type="number"
                          className={`${styles.deliveryInput} col-12 d-inline-block position-relative`}
                          maxLength="6"
                          minLength="6"
                          placeholder="Enter Delivery Pincode"
                          onChange={(e) => getDeliveyPincode(e.target.value)}
                          value={pincode || ""}
                        />
                        <button
                          aria-label="Check Delivery"
                          onClick={() => getDeliveyInfo(pincode)}
                          type="button"
                          className={`${styles.deliveryBtn} position-absolute d-inline-flex h-100 align-items-center justify-content-center`}
                        >
                          Check
                        </button>
                      </div>
                      <span
                        className={`${styles.checkZiperror} col-12 d-inline-block`}
                      ></span>
                      {Object.keys(deliveryDetail)?.length > 0 && (
                        <div
                          className={`${styles.checkDeliveryResponse} d-inline-flex flex-column col-12 mt-3 p-3`}
                        >
                          {deliveryDetail.maxDays !== "" ||
                          deliveryDetail.minDays !== "" ? (
                            <p
                              className={`${styles.checkDeliveryDateOuter} col-12 mb-1 d-inline-block`}
                            >
                              <span
                                className={`${styles.checkDeliveryLabel} d-inline-flex`}
                              >
                                Expected Delivery Date - &nbsp;
                              </span>
                              {deliveryDetail.minDays !== "" ? (
                                <span>
                                  <strong
                                    className={`${styles.checkDeliveryDate} d-inline-flex`}
                                  >
                                    {deliveryDetail.minDays}
                                  </strong>
                                </span>
                              ) : null}
                              {deliveryDetail.maxDays !== "" &&
                                deliveryDetail.min_days !== "" && (
                                  <span>&nbsp;-&nbsp;</span>
                                )}
                              {deliveryDetail.maxDays !== "" ? (
                                <span>
                                  <strong
                                    className={`${styles.checkDeliveryDate} d-inline-flex`}
                                  >
                                    {deliveryDetail.maxDays}
                                  </strong>
                                </span>
                              ) : null}
                            </p>
                          ) : (
                            ""
                          )}

                          <p
                            className={`${styles.checkDeliveryDateOuter} col-12 mb-1 d-inline-block`}
                          >
                            <span>Available for Pickup at: </span>
                            <strong
                              id="deliveryLoc"
                              className={`${styles.checkDeliveryLabel} d-inline-flex`}
                            >
                              {enviroment.STORE_ADDRESS}
                            </strong>
                          </p>
                          <p
                            className={`${styles.checkDeliveryDateOuter} col-12 mb-1 d-inline-block`}
                          >
                            <span>Store Contact: </span>
                            <span
                              className={`${styles.checkDeliveryLabel} d-inline-flex`}
                            >
                              <Link
                                className={`${styles.checkDeliveryDateOuter} text-decoration-none d-inline-flex`}
                                to={`tel:${enviroment.PHONE_NUMBER}`}
                                id="storeTel"
                              >
                                {enviroment.PHONE_NUMBER}
                              </Link>
                            </span>
                          </p>
                          <p
                            className={`${styles.checkDeliveryDateOuter} col-12 mb-1 d-inline-block`}
                          >
                            <span>Locate Store: </span>
                            <span
                              className={`${styles.checkDeliveryLabel} d-inline-flex`}
                            >
                              <Link
                                to="https://maps.app.goo.gl/gyhzfKFKBJZJkPfa6"
                                target="_blank"
                                className={`${styles.checkDeliveryDateOuter} text-decoration-none d-inline-flex`}
                              >
                                Google Map
                              </Link>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-12 d-inline-block mb-5`}>
            <FeaturedProducts product={ProductData?.featured} />
            <SimilarProduct product={ProductData?.similar} />
          </div>
          <Footer />
        </React.Fragment>
      ) : (
        <React.Fragment></React.Fragment>
      )}
      <div
        className={`${
          styles.productShare
        } position-fixed top-0 bottom-0 start-0 end-0 align-items-center justify-content-center ${
          prodSharePop === true ? "d-inline-flex" : "d-none"
        }`}
      >
        <div
          className={`${styles.productShareContainer} col-4 d-inline-flex flex-column position-relative p-3`}
        >
          <div className="col-12 d-inline-flex align-items-center justify-content-between px-2 mb-4">
            <h4 className={`${styles.shareProdTitle} d-inline-flex`}>
              Share this product
            </h4>
            <span
              role="button"
              onClick={() => setProdSharePop(false)}
              className={`${styles.closeIcon} d-inline-flex align-items-center justify-content-center`}
            >
              <CrossIcon color="#000" />
            </span>
          </div>
          <div className="col-12 mb-5 d-inline-flex justify-content-center align-items-center">
            <div
              className={`${styles.prodCustomUrl} col-10 position-relative d-inline-flex align-items-center`}
            >
              <span
                className={`${styles.customUrl} col-12 d-inline-block p-2 `}
              >
                {window.location.href}
              </span>
              <span
                className={`${styles.copyLink} position-absolute d-inline-flex align-items-center justify-content-center`}
                onClick={() => copylinkUrl()}
              >
                <CopyIcon color="#000" />
              </span>
              <input
                type="text"
                readOnly={true}
                value={window.location.href}
                className="d-none"
                id="myUrlInput"
              />
            </div>
          </div>

          <div
            className={`${styles.socialShare} col-12 d-inline-flex justify-content-evenly align-items-center mb-5`}
          >
            <Link
              to={`https://facebook.com/sharer/sharer.php?u=${pageCurrentURL}`}
              target="_blank"
              id="ShareFacebook"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <FacebookIcon color="#3b5998" />
            </Link>
            <Link
              to={`https://pinterest.com/pin/create/bookmarklet/?&url=${pageCurrentURL}&description=${shareProdName}`}
              target="_blank"
              id="SharePinterest"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <PinterestIcon color="#ce2029" />
            </Link>
            <Link
              to={`https://twitter.com/share?url=${pageCurrentURL}&text=${shareProdName}`}
              target="_blank"
              id="ShareTwitter"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <TwitterIcon color="#00b0ed" />
            </Link>
            <Link
              to={`https://web.whatsapp.com://send?text=${pageCurrentURL}${shareProdName}`}
              target="_blank"
              id="ShareWhatsapp"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <WhatsAppIcon color="#4ced69" />
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
