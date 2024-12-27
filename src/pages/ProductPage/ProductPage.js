import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import Skeleton from "react-loading-skeleton";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import noImage from "../../assets/images/image-not-available.jpg";
import AddReview from "../../Components/AddReview/AddReview";
import ShowReviews from "../../Components/AddReview/ShowReview";
import { FeaturedProducts } from "../../Components/FeaturedProducts/FeaturedProducts";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import AddProductQuantity from "../../Components/shared/AddProductQuantity";
import { SimilarProduct } from "../../Components/SimilarProduct/SimilarProduct";
import {
  CopyIcon,
  CrossIcon,
  FacebookIcon,
  LocationIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsAppIcon
} from "../../Components/siteIcons";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import ProductGalleryDesktop from "./ProdGalleryDesktop";
import ProdGalleryMobile from "./ProdGalleryMobile";
import styles from "./ProductPage.module.css";
import { Card, Col, ListGroup, Row } from "react-bootstrap";

export const ProductPage = () => {
  const appData = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { slug, prodId } = useParams();
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
  const [isSpecilization, setIsSpecilization] = useState(false);
  const userInfo = appData?.appData?.user;
  const pageCurrentURL = encodeURIComponent(window.location.href);
  const [productVariants, setProductVariants] = useState([]);
  const [productVariantsLoading, setProductVariantsLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);

  const [deliveryShowed, setDeliveryShowed] = useState(false);

  const setMainImage = (image, count) => {
    setActiveImg(count);
    setProdMainImg(image);
  };

  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
  };

  const openProductColpse = () => { };

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

  const getProductImageOfColorId = (colorId) => {
    return productVariants.filter((item) => ((item.color_id === colorId) && item?.image !== ''))[0]?.image
  }

  const formatDeliveryDate = (date) => {
    const options = {
      weekday: 'long', // Full day name (e.g., "Tuesday")
      day: 'numeric',  // Numeric day (e.g., "3")
      month: 'short',  // Short month (e.g., "Oct")
    };

    const formattedDate = new Date(date).toLocaleDateString('en-GB', options);

    // Insert a comma after the day
    const [weekday, day, month] = formattedDate.split(' ');
    return `${weekday}, ${day} ${month}`;
  };


  const getDeliveyPincode = async (val) => {
    setPincode(val);
    if (val.length === 6) {
      const payload = {
        pincode: val,
        store_email: "ashiretailggn@gmail.com"
      };
      try {
        const response = await fetch(`https://company.aspl.tech/api/pincode-status`,
          {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
              "Content-Type": "application/json",
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          });

        const data = await response.json();
        if (data?.data === null) {
          AppNotification("Error", "Please enter valid pincode.", "danger");
          return;
        }
        setDeliveryDetail(data?.data);
        setDeliveryShowed(true);
      } catch (error) {
        AppNotification("Error", "Please enter valid pincode.", "danger");
      }
    } else {
      AppNotification("Error", "Please enter valid pincode.", "danger");
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
    const payload = {
      product_slug: slug,
      product_id: prodId,
      company_id: parseInt(enviroment.COMPANY_ID),
      store_id: parseInt(enviroment.STORE_ID),
    };

    // Fetch product details based on the slug
    setProductLoading(true);
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

          // Fetching Similar Products
          const similarProdPayload = {
            product_id: res.payload.product_id,
            store_id: parseInt(enviroment.STORE_ID),
          };

          setProductVariantsLoading(true);
          ApiService.productVariantInfo(similarProdPayload)
            .then((res) => {
              if (res.message === "Product Variant") {
                setProductVariants(res?.payload);
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              setProductVariantsLoading(false);
            });

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
      })
      .finally(() => {
        setProductLoading(false);
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

  const isSpecializationDetail = !(
    ProductData?.specifications?.type == "" &&
    ProductData?.specifications?.model_name == "" &&
    ProductData?.specifications?.shelf_life == null &&
    ProductData?.specifications?.container_type == "" &&
    ProductData?.specifications?.shelf_life_month_years == null &&
    ProductData?.specifications?.organic == null &&
    ProductData?.specifications?.polished == null &&
    ProductData?.specifications?.package_dimension_length == null &&
    ProductData?.specifications?.manufactured_by == undefined &&
    ProductData?.specifications?.packed_by == undefined &&
    ProductData?.specifications?.exp_date == null
  );

  const isOtherDetail = !(
    ProductData?.other_information?.country_origin == "" &&
    ProductData?.other_information?.manufactured_by == "" &&
    ProductData?.other_information?.marketed_by == ""
  );

  return (
    <React.Fragment>
      {ProductData && (
        <Helmet>
          <meta charSet="utf-8" />
          <title>
            {ProductData?.name.length > 70
              ? ProductData?.name.substring(0, 70) + "..."
              : ProductData?.name}{" "}
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
          <meta property="og:image:secure_url" content={ProductData?.image} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="product" />
        </Helmet>
      )}

      <div className="hideInDesktop" style={{
        maxWidth: "100vw",
        // overflowX: "hidden",
      }}>
        <PageHeader title={ProductData?.name} />
        <ProdGalleryMobile
          ProductData={ProductData}
          styles={styles}
          productLoading={productLoading}
          setNoImage={setNoImage}
          prodMainImg={prodMainImg}
          getProductImageOfColorId={getProductImageOfColorId}
        />
        <div
          className={`${styles.productAllDetail} m-0 col-12 d-flex flex-column gap-3 p-4`}
        >
          <h2 className={`${styles.productDetailName} col-12 mb-1 text-start m-0`}
            style={{
              fontSize: "1.5rem",
              lineHeight: "1.2",
            }}
          >
            {
              productLoading ?
                <Skeleton width={200} height={20} />
                :
                ProductData?.name
            }
          </h2>

          <div
            className={``}
          >
            {
              productLoading ?
                <Skeleton width={100} height={25} />
                :
                <ShowReviews
                  product_id={ProductData?.product_id}
                  total_rating={ProductData?.total_rating}
                />
            }
          </div>
          <div
            className={`d-inline-flex align-items-start flex-column gap-2 col-12 position-relative`}
          >
            {
              productLoading ?
                <Skeleton width={100} height={20} />
                :
                <span>
                  {
                    ProductData?.stock > 0 ? (
                      <span
                        className="rounded"
                        style={{
                          padding: "5px 10px",
                          background: "hsla(0, 0%, 87%, 1)",
                          color: "#4CAF50",
                          fontWeight: "bold",
                        }}
                      >
                        In stock
                      </span>
                    ) : (
                      <span
                        className="rounded"
                        style={{
                          padding: "5px 10px",
                          background: "hsla(0, 0%, 87%, 1)",
                          color: "red",
                          fontWeight: "bold",
                        }}>
                        Out of stock
                      </span>
                    )
                  }
                </span>
            }
          </div>

          <div className="">
            {/* <span className="mb-2">Item Code: {ProductData?.article_name} </span> */}
            {
              productLoading ?
                <Skeleton width={200} height={20} /> :
                <div
                  className={`d-inline-flex align-items-center col-12 mb-0 position-relative`}
                >
                  {ProductData?.selling_price === ProductData?.mrp ? (
                    <span style={{
                      fontSize: "26px",
                    }} className={`${styles.offerPrice}`}>
                      <b>₹{ProductData?.mrp}</b>
                    </span>
                  ) : (
                    <React.Fragment>
                      <span style={{
                        fontSize: "26px",
                        color: '#f94c43'
                      }} className={`${styles.offerPrice}`}>
                        <b>₹{ProductData?.selling_price}</b>{" "}
                      </span>
                      {prodDiscount !== "" && (
                        <span
                          className={`${styles.offerPercentage} d-inline-flex ms-2`}
                        >
                          ({prodDiscount}% &nbsp;OFF)
                        </span>
                      )}
                    </React.Fragment>
                  )}
                </div>
            }
            <span className={`${styles.inclusivTax} col-12 d-inline-block`} style={{
              fontSize: "16px",
              fontWeight: "500",
            }}>
              {
                ProductData?.selling_price !== ProductData?.mrp ?
                  <span style={{ marginRight: '5px' }}>MRP: <del>₹{ProductData?.mrp}</del></span>
                  : null
              }
              <span>(Inclusive of all taxes)</span>
            </span>
          </div>
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
                      <img src={item.logo} alt={item.description}
                        onError={(e) => setNoImage(e)}
                      />
                      {item.description}
                    </span>
                  );
                })}
            </div>
          )}

        <div className="col-12 d-inline-block p-2 bg-white w-100 d-flex justify-content-center">
          <img src={'/images/quality-insurance.webp'} alt={ProductData?.name} />
        </div>

        <div className="col-12 d-inline-block p-4 bg-white">
          <h3
            className={`${styles.deliveryHeading} col-12 d-inline-block mt-0 mb-4`}
          >
            Delivery &amp; Services
          </h3>
          <div className={`col-12 d-inline-block`}>
            <div
              className={`${styles.deliveryInputBox} d-inline-flex align-items-center col-12 position-relative mb-1`}
            >
              <p style={{
                width: '30px',
                height: '30px',
              }}>
                <LocationIcon color={'gray'} />
              </p>
              <input
                type="number"
                className={`${styles.deliveryInput} w-100 d-inline-block position-relative`}
                maxLength="6"
                minLength="6"
                placeholder="Enter Delivery Pincode"
                disabled={deliveryShowed}
                onChange={(e) => {
                  if (e.target.value.length > 6) {
                    AppNotification("Error", "Please enter a valid pincode.", "danger");
                    return;
                  }
                  setPincode(e.target.value)
                }}
                value={pincode || ""}
              />
              {
                deliveryShowed ?
                  <button
                    aria-label="Check Delivery"
                    onClick={() => {
                      setDeliveryShowed(false);
                      setPincode("");
                      setDeliveryDetail({});
                    }}
                    type="button"
                    className={`${styles.deliveryBtn} d-inline-flex align-items-center justify-content-center border-success text-success`}
                  >
                    Change
                  </button>
                  :
                  <button
                    aria-label="Check Delivery"
                    onClick={() => getDeliveyPincode(pincode)}
                    type="button"
                    className={`${styles.deliveryBtn} d-inline-flex align-items-center justify-content-center`}
                  >
                    Check
                  </button>
              }
            </div>
            <span
              className={`${styles.checkZiperror} col-12 d-inline-block`}
            ></span>
            {Object.keys(deliveryDetail)?.length > 0 && (
              <div
                className={`${styles.checkDeliveryResponse} d-inline-flex flex-column col-12 gap-2 mt-3 p-3`}
              >
                {deliveryDetail.max_days !== "" ||
                  deliveryDetail.min_days !== "" ? (
                  <p
                    className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '180px 1fr',
                    }}
                  >
                    <span
                      className={`${styles.checkDeliveryLabel} d-inline-flex`}
                    >
                      Expected Delivery Date:
                    </span>
                    <span>
                      {deliveryDetail.min_days !== "" ? (
                        <span>
                          <strong
                            className={`${styles.checkDeliveryDate} d-inline-flex`}
                          >
                            {
                              formatDeliveryDate(new Date().setDate(new Date().getDate() + deliveryDetail.min_days))
                            }
                          </strong>
                        </span>
                      ) : null}
                      {deliveryDetail.max_days !== "" &&
                        deliveryDetail.min_days !== "" && (
                          <span>&nbsp;-&nbsp;</span>
                        )}
                      {deliveryDetail.max_days !== "" ? (
                        <span>
                          <strong
                            className={`${styles.checkDeliveryDate} d-inline-flex`}
                          >
                            {
                              formatDeliveryDate(new Date().setDate(new Date().getDate() + deliveryDetail.max_days))
                            }
                          </strong>
                        </span>
                      ) : null}
                    </span>
                  </p>
                ) : (
                  ""
                )}

                <p
                  className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                  }}
                >
                  <span>Available for Pickup at: </span>
                  <strong
                    id="deliveryLoc"
                    className={`${styles.checkDeliveryLabel} d-inline-flex`}
                  >
                    Shop No - 01, Old Delhi Road Opposite Hudda Office Gurugram Haryana - 122015
                  </strong>
                </p>
                <p
                  className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                  }}
                >
                  <span>Store Contact: </span>
                  <span
                    className={`${styles.checkDeliveryLabel} d-inline-flex`}
                  >
                    <Link
                      className={`${styles.checkDeliveryDateOuter} d-inline-flex fw-bold text-black`}
                      to={`tel:${enviroment.PHONE_NUMBER}`}
                      id="storeTel"
                    >
                      {enviroment.PHONE_NUMBER}
                    </Link>
                  </span>
                </p>
                <p
                  className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr',
                  }}
                >
                  <span>Locate Store: </span>
                  <span
                    className={`${styles.checkDeliveryLabel} d-inline-flex`}
                  >
                    <a
                      href="https://g.co/kgs/t5Z1TUd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.checkDeliveryDateOuter} d-inline-flex fw-bold text-black`}
                    >
                      Google Map
                    </a>
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>

        {isSpecializationDetail &&
          isOtherDetail &&
          ProductData?.description !== "Not available" && (
            <div
              className={`${styles.productDesciptionBox} col-12 d-inline-block p-2 py-4`}
            >
              <h2
                className={`${styles.availSizeTitle} mb-3 col-12 d-inline-block p-0`}
              >
                Product Details
              </h2>
              {ProductData?.description !== "Not available" && (
                <div
                  className={`${styles.productCollapseBox} active col-12 d-inline-block p-0`}
                  onClick={openProductColpse(this)}
                >
                  <div
                    className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                    style={{
                      height: "fit-content",
                      background: "rgb(233, 232, 232)",
                    }}
                  >
                    <button
                      aria-label="About product"
                      style={{
                        borderRadius: "4px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "none",
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
                        background: "none",
                      }}
                      onClick={() =>
                        setIsAboutProductDesc(!isAboutProductDesc)
                      }
                    >
                      {isAboutProductDesc ? "-" : "+"}
                    </button>
                  </div>
                  <div
                    className={`${styles.productDetailText} col-12 p-0 ${!isAboutProductDesc && "visually-hidden"
                      }`}
                  >
                    <div
                      dangerouslySetInnerHTML={{
                        __html: ProductData?.description,
                      }}
                    ></div>
                  </div>
                </div>
              )}
              {otherInfo === true && isOtherDetail && (
                <div
                  className={`${styles.productCollapseBox} col-12 d-inline-block p-0`}
                  onClick={openProductColpse(this)}
                >
                  <div
                    className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                    style={{
                      height: "fit-content",
                      background: "rgb(233, 232, 232)",
                    }}
                  >
                    <button
                      aria-label="specifications"
                      style={{
                        borderRadius: "4px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "none",
                      }}
                    >
                      <span>Specifications</span>&nbsp;
                    </button>
                    <button
                      aria-label="specifications"
                      style={{
                        borderRadius: "4px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "none",
                      }}
                      onClick={() => setIsSpecilization(!isSpecilization)}
                    >
                      {isSpecilization ? "-" : "+"}
                    </button>
                  </div>
                  {isSpecilization && (
                    <div
                      className={`${styles.productDetailText} d-inline-flex flex-column gap-3 col-12`}
                    >
                      {ProductData?.specifications?.type && (
                        <p className="col-12 d-inline-flex gap-2  m-0">
                          <strong>Type:</strong>{" "}
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
                </div>
              )}
              {isOtherDetail && (
                <div
                  className={`${styles.productCollapseBox} py-4 active col-12 d-inline-block p-0`}
                  onClick={openProductColpse(this)}
                >
                  <div
                    className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                    style={{
                      height: "fit-content",
                      background: "rgb(233, 232, 232)",
                    }}
                  >
                    <button
                      aria-label="About product"
                      style={{
                        borderRadius: "4px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "none",
                      }}
                    >
                      <span>Other Info</span>&nbsp;
                    </button>
                    <button
                      aria-label="About product"
                      style={{
                        borderRadius: "4px",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                        background: "none",
                      }}
                      onClick={() =>
                        setIsOtherProductDesc(!isOtherProductDesc)
                      }
                    >
                      {isOtherProductDesc ? "-" : "+"}
                    </button>
                  </div>
                  <div
                    className={`${styles.productDetailText} col-12 p-0 ${!isOtherProductDesc && "visually-hidden"
                      }`}
                  >
                    <div
                      className={`${styles.productDetailText} d-inline-flex flex-column gap-3 col-12`}
                    >
                      {ProductData?.barcode && (
                        <p className="col-12 d-inline-flex gap-2 m-0">
                          <strong>Bar Code: </strong>
                          {ProductData?.barcode}
                          <br />
                        </p>
                      )}
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
                  </div>
                </div>
              )}
            </div>
          )}
        <div className={`col-12 d-inline-block pb-5`}>
          <FeaturedProducts product={ProductData?.featured} />
          <SimilarProduct product={ProductData?.similar} />
        </div>
        <div
          className={`${styles.productBtnBox} w-100 p-2 bg-white d-inline-flex align-items-stretch col-12 position-fixed bottom-0 start-0`}
        >
          {!prodAdded ? (
            ProductData?.stock <= 0 ? (
              <button
                style={{
                  border: "none",
                  background: "black",
                  cursor: "not-allowed",
                  // opacity: "0.5",
                }}
                disabled={true}
                className={`${styles.AddCartBtn} position-relative w-100 d-inline-flex align-items-center justify-content-center`}
              >
                Out of Stock
              </button>
            ) : (
              <button
                disabled={productLoading || ProductData?.stock === 0 || ProductData?.stock < 0}
                className={`${styles.continueShop} ${ProductData?.stock === 0 || ProductData?.stock < 0
                  ? styles.disableCartBtn
                  : ""
                  } position-relative w-100 d-inline-flex align-items-center justify-content-center`}
                onClick={(e) => addToCart(e, ProductData)}
              >
                Add to Cart
              </button>
            )
          ) : (
            <AddProductQuantity
              prodAddedQty={prodAddedQty}
              ProductData={ProductData}
              updateProdQty={updateProdQty}
            />
          )}
        </div>
      </div>

      <div className="hideInMobile" style={{
        maxWidth: "100vw",
        background: "white",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
      }}>
        <Header />
        <div className="col-12 d-inline-flex" style={{
          maxWidth: "1200px",
          margin: "auto",
        }}>
          <div className="container-fluid">
            <div className="col-12 d-flex position-relative gap-2 h-100 mb-4">
              <div
                className={`shadow-sm col-4 position-relative mt-5`}
              >
                <ProductGalleryDesktop
                  styles={styles}
                  ProductData={ProductData}
                  setProdSharePop={setProdSharePop}
                  prodMainImg={prodMainImg}
                  productLoading={productLoading}
                  getProductImageOfColorId={getProductImageOfColorId}
                  setNoImage={setNoImage}
                  activeImg={activeImg}
                  setMainImage={setMainImage}
                />
              </div>
              <div
                className={`shadow-sm d-inline-flex flex-column gap-2 col-5 flex-shrink-1 align-items-start justify-content-start px-2 pt-5`}
              >
                <div
                  className={`${styles.productSubLine} d-inline-flex align-items-center gap-2 col-12 mb-0 position-relative`}
                >
                  {
                    productLoading ?
                      <Skeleton width={100} height={20} />
                      :
                      <div className="d-inline-flex align-items-center gap-2 fs-6 fw-light mb-3">
                        {ProductData?.category_name ? (
                          <span className={`${styles.categoryName} titleMainSmall d-inline-flex m-0`}>
                            {ProductData?.category_name}
                          </span>
                        ) : null}
                      </div>
                  }
                </div>
                <h2
                  className={`${styles.productDetailName} col-12 mb-1`}
                >
                  {
                    productLoading ?
                      <Skeleton width={200} height={30} />
                      :
                      ProductData?.name
                  }
                </h2>
                <div
                  className={``}
                >
                  {
                    productLoading ?
                      <Skeleton width={100} height={25} />
                      :
                      <ShowReviews
                        product_id={ProductData?.product_id}
                        total_rating={ProductData?.total_rating}
                      />
                  }
                </div>
                {
                  productLoading ?
                    <Skeleton width={100} height={20} />
                    :
                    <span>
                      {
                        ProductData?.stock > 0 ? (
                          <span
                            className="rounded"
                            style={{
                              padding: "5px 10px",
                              background: "hsla(0, 0%, 87%, 1)",
                              color: "#4CAF50",
                              fontWeight: "bold",
                            }}
                          >
                            In stock
                          </span>
                        ) : (
                          <span
                            className="rounded"
                            style={{
                              padding: "5px 10px",
                              background: "hsla(0, 0%, 87%, 1)",
                              color: "red",
                              fontWeight: "bold",
                            }}>
                            Out of stock
                          </span>
                        )
                      }
                    </span>
                }
                <ProdPrice
                  productLoading={productLoading}
                  ProductData={ProductData}
                  prodDiscount={prodDiscount}
                />
                {ProductData?.description &&
                  ProductData?.description !== "Not available" &&
                  (
                    <div
                      className={`col-4 p-3 m-0 text-center ${descActive === "Description" ? styles.tabActive : ""
                        } ${styles.productDescTitle}`}
                      onClick={() => {
                        if (descActive === "Description") {
                          setDescActive("")
                          return;
                        }
                        setDescActive("Description")
                      }}
                      role="button"
                    >
                      <h4>Product Description</h4>
                      <span>
                        {descActive === "Description" ? "-" : "+"}
                      </span>
                    </div>
                  )}
                {descActive === "Description" &&
                  ProductData?.description !== "Not available" && (
                    <div
                      className={`d-flex flex-column col-12 p-1`}
                      dangerouslySetInnerHTML={prodDesc}
                    ></div>
                  )}
                <div className="col-12 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between flex-column gap-2">
                    {(ProductData?.specifications && ProductData?.specifications != '') && (
                      <div
                        className={`col-4 p-3 m-0 text-center ${descActive === "Specifications" ? styles.tabActive : ""
                          } ${styles.productDescTitle}`}
                        onClick={() => {
                          if (descActive === "Specifications") {
                            setDescActive("")
                            return;
                          }
                          setDescActive("Specifications")
                        }}
                        role="button"
                      >
                        <h4>Specifications</h4>
                        <span>+</span>
                      </div>
                    )}
                    {descActive === "Specifications" && (
                      <div className="d-flex flex-column gap-3 col-12 p-3">
                        {ProductData?.specifications?.type && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Type:</strong> {ProductData?.specifications?.type}
                          </p>
                        )}
                        {ProductData?.specifications?.model_name && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Model Name:</strong> {ProductData?.specifications?.model_name}
                          </p>
                        )}
                        {ProductData?.specifications?.container_type && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Container Type:</strong> {ProductData?.specifications?.container_type}
                          </p>
                        )}
                        {ProductData?.specifications?.package_dimension_length && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Dimension:</strong>{" "}
                            {"L " +
                              ProductData?.specifications?.package_dimension_length +
                              " x B " +
                              ProductData?.specifications?.package_dimension_width +
                              " x H " +
                              ProductData?.specifications?.package_dimension_height}{" "}
                            cm
                          </p>
                        )}
                        {ProductData?.specifications?.manufactured_by && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Manufactured By:</strong> {ProductData?.specifications?.manufactured_by}
                          </p>
                        )}
                        {ProductData?.specifications?.packed_by && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Packed By:</strong> {ProductData?.specifications?.packed_by}
                          </p>
                        )}
                        {ProductData?.specifications?.exp_date && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Exp Date:</strong> {ProductData?.specifications?.exp_date}
                          </p>
                        )}
                      </div>
                    )}
                    {featuresInfo && (
                      <div
                        className={`col-4 p-3 m-0 text-center  text-center ${descActive === "Features" ? styles.tabActive : ""
                          } ${styles.productDescTitle}`}
                        onClick={() => {
                          if (descActive === "Features") {
                            setDescActive("")
                            return;
                          }
                          setDescActive("Features")
                        }}
                        role="button"
                      >
                        <h4>Other Information</h4>
                        <span>+</span>
                      </div>
                    )}
                    {descActive === "Features" && (
                      <div className="d-flex flex-column gap-3 col-12 p-3">
                        {ProductData?.barcode && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Barcode:</strong> {ProductData?.barcode}
                          </p>
                        )}
                        {ProductData?.other_information?.country_origin && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Country Of Origin:</strong> {ProductData?.other_information?.country_origin}
                          </p>
                        )}
                        {ProductData?.other_information?.manufactured_by && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Manufactured By:</strong> {ProductData?.other_information?.manufactured_by}
                          </p>
                        )}
                        {ProductData?.other_information?.marketed_by && (
                          <p className="col-12 d-flex gap-2 m-0">
                            <strong>Marketed By:</strong> {ProductData?.other_information?.marketed_by}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <AddReview
                  product_id={ProductData?.product_id}
                  total_rating={ProductData?.total_rating}
                />
              </div>
              <div
                className={`col-3 px-1 pt-2 shadow-sm`}
              >
                <div
                  className={`d-inline-flex flex-column gap-2 flex-shrink-1 align-items-start justify-content-start pt-5`}
                  style={{
                    position: "sticky",
                    top: "140px",
                    height: 'fit-content'
                  }}
                >
                  <ProdPrice
                    productLoading={productLoading}
                    ProductData={ProductData}
                    prodDiscount={prodDiscount}
                  />
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    width: '100%',
                    margin: '0 0 10px 0',
                    gap: '10px',
                  }}>
                    {!prodAdded ? (
                      ProductData?.stock <= 0 ? (
                        <button
                          style={{
                            border: "none",
                            background: "black",
                            cursor: "not-allowed",
                            opacity: "0.5",
                          }}
                          disabled={true}
                          type="button"
                          className={`${styles.continueShop} col-12 d-inline-flex align-items-center justify-content-center text-uppercase`}
                        >
                          Out of stock
                        </button>
                      ) : (
                        <button
                          disabled={productLoading || ProductData?.stock === 0 || ProductData?.stock < 0}
                          className={`${styles.continueShop} ${ProductData?.stock === 0 || ProductData?.stock < 0
                            ? styles.disableCartBtn
                            : ""
                            } col-12 d-inline-flex align-items-center justify-content-center`}
                          onClick={(e) => addToCart(e, ProductData)}
                        >
                          Add to Cart
                        </button>
                      )
                    ) : (
                      <AddProductQuantity
                        prodAddedQty={prodAddedQty}
                        ProductData={ProductData}
                        updateProdQty={updateProdQty}
                      />
                    )}
                  </div>
                  <BankOffers
                    offers={ProductData?.bank_offer}
                    setNoImage={setNoImage}
                  />

                  <ProdFeatures />

                  <DeliveryService
                    deliveryDetail={deliveryDetail}
                    deliveryShowed={deliveryShowed}
                    setPincode={setPincode}
                    pincode={pincode}
                    setDeliveryShowed={setDeliveryShowed}
                    getDeliveyPincode={getDeliveyPincode}
                    setDeliveryDetail={setDeliveryDetail}
                    formatDeliveryDate={formatDeliveryDate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`col-12 d-inline-block pb-5`}>
          <FeaturedProducts product={ProductData?.featured} />
          <SimilarProduct product={ProductData?.similar} />
        </div>
        <Footer />
      </div>


      <div
        className={`${styles.productShare
          } position-fixed top-0 bottom-0 start-0 end-0 align-items-center justify-content-center ${prodSharePop === true ? "d-inline-flex" : "d-none"
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
            <a
              href={`https://facebook.com/sharer/sharer.php?u=${pageCurrentURL}`}
              target="_blank"
              rel="noopener noreferrer"
              id="ShareFacebook"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <FacebookIcon color="#3b5998" />
            </a>
            <a
              href={`https://pinterest.com/pin/create/bookmarklet/?&url=${pageCurrentURL}&description=${shareProdName}`}
              target="_blank"
              rel="noopener noreferrer"
              id="SharePinterest"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <PinterestIcon color="#ce2029" />
            </a>
            <a
              href={`https://twitter.com/share?url=${pageCurrentURL}&text=${shareProdName}`}
              target="_blank"
              rel="noopener noreferrer"
              id="ShareTwitter"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <TwitterIcon color="#00b0ed" />
            </a>
            <a
              href={`https://web.whatsapp.com://send?text=${pageCurrentURL}${shareProdName}`}
              target="_blank"
              rel="noopener noreferrer"
              id="ShareWhatsapp"
              className={`${styles.shareicon} col-3 text-center d-inline-block`}
            >
              <WhatsAppIcon color="#4ced69" />
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const ProdPrice = ({
  productLoading,
  ProductData,
  prodDiscount
}) => {

  const sellingPrice = parseFloat(ProductData?.selling_price);
  const mrp = parseFloat(ProductData?.mrp);

  return <>
    <div
      className={`d-inline-flex align-items-start gap-2 col-12 position-relative`}
    >
      {sellingPrice === mrp ? (
        <span className={`${styles.offerPrice}`}>
          {
            productLoading ?
              <Skeleton width={100} height={20} />
              : <span
                className="fw-bold"
              >₹{ProductData?.mrp}</span>
          }
        </span>
      ) : (
        <div className="col-12 d-inline-flex align-items-center gap-4">
          {
            productLoading ?
              <Skeleton width={'300px'} height={24} />
              :
              <div
                className={`${styles.offerPrice} d-flex fw-bold align-items-cente my-3 flex-column`}
              >
                <span style={{
                  fontSize: '26px',
                  margin: '0',
                }}>₹{sellingPrice}</span>
                <p
                  className={`${styles.offerPrice} d-flex align-items-center gap-2`}
                >
                  <p className="text-secondary"
                    style={{
                      fontSize: '16px',
                      display: 'flex',
                      gap: '5px',
                      margin: '0',
                    }}><span style={{
                      fontWeight: 'bold'
                    }}>MRP</span><del>₹{mrp}</del>
                  </p>
                  {prodDiscount !== "" && (
                    <span
                      className={`${styles.offerPercentage} fw-bold text-success d-inline-flex`}
                      style={{
                        fontSize: '16px',
                      }}
                    >
                      ({prodDiscount}% &nbsp;OFF)
                    </span>
                  )}
                </p>
              </div>
          }
        </div>
      )}
    </div>
  </>
}

const BankOffers = ({ offers, setNoImage }) => {
  if (!offers || offers.length === 0) {
    return null;
  }

  return (
    <Card className="mt-3 w-100">
      <Card.Header as="h5" className="text-success fw-bold" style={{
        fontSize: '16px',
        backgroundColor: '#e8f5e9'
      }}>Offers and Coupons</Card.Header>
      <ListGroup variant="flush">
        {offers.map((offer, index) => (
          <ListGroup.Item key={index} className="d-flex align-items-center border-0 bg-transparent">
            <img
              src={offer.logo}
              alt=""
              onError={setNoImage}
              className="me-3"
              style={{ width: '40px', height: '40px', objectFit: 'contain' }}
            />
            <span style={{
              fontSize: '14px'
            }}>{offer.description}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

const ProdFeatures = () => {
  const features = [
    { img: "/icons/quality.svg", text: '100% Original' },
    { img: "/icons/certified.svg", text: 'QC Passed' },
    { img: "/icons/warranty.svg", text: '1 Year Warranty' },
    { img: "/icons/delivery.svg", text: 'Home Delivery' },
  ];
  return (
    <Card className="mt-3 w-100">
      <Card.Header as="h5" className="text-success fw-bold" style={{
        fontSize: '16px',
        backgroundColor: '#e8f5e9'
      }}>Ashi Promise</Card.Header>
      <Row className="g-2">
        {features.map((feature, index) => (
          <Col key={index} xs={6} md={3}>
            <Card className="h-100 border-0">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-2">
                <img src={feature.img} alt="" style={{ width: '30px', height: '30px' }} />
                <Card.Text className="text-center mb-0 small text-success" style={{ fontSize: '12px' }}>{feature.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

const DeliveryService = ({
  deliveryDetail,
  deliveryShowed,
  setPincode,
  pincode,
  setDeliveryShowed,
  getDeliveyPincode,
  setDeliveryDetail,
  formatDeliveryDate
}) => {

  return (
    <Card className="mt-3 w-100">
      <Card.Header as="h5" className="text-success fw-bold" style={{
        fontSize: '16px',
      backgroundColor: '#e8f5e9'
      }}>Delivery &amp; Services</Card.Header>
      <Row className="g-2 p-2">
        <div className={`col-12 d-inline-block`}>
          <div
            className={`${styles.deliveryInputBox} d-inline-flex align-items-center col-12 position-relative mb-1`}
          >
            <p style={{
              width: '30px',
              height: '30px',
            }}>
              <LocationIcon color={'gray'} />
            </p>
            <input
              type="number"
              className={`${styles.deliveryInput} w-100 d-inline-block position-relative`}
              style={{
                fontSize: '13px',
              }}
              maxLength="6"
              minLength="6"
              placeholder="Enter Delivery Pincode"
              disabled={deliveryShowed}
              onChange={(e) => {
                if (e.target.value.length > 6) {
                  AppNotification("Error", "Please enter a valid pincode.", "danger");
                  return;
                }
                setPincode(e.target.value)
              }}
              value={pincode || ""}
            />
            {
              deliveryShowed ?
                <button
                  aria-label="Check Delivery"
                  onClick={() => {
                    setDeliveryShowed(false);
                    setPincode("");
                    setDeliveryDetail({});
                  }}
                  type="button"
                  className={`${styles.deliveryBtn} d-inline-flex align-items-center justify-content-center border-success text-success`}
                >
                  Change
                </button>
                :
                <button
                  aria-label="Check Delivery"
                  onClick={() => getDeliveyPincode(pincode)}
                  type="button"
                  className={`${styles.deliveryBtn} d-inline-flex align-items-center justify-content-center`}
                >
                  Check
                </button>
            }
          </div>
          <span
            className={`${styles.checkZiperror} col-12 d-inline-block`}
          ></span>
          {Object.keys(deliveryDetail)?.length > 0 && (
            <div
              className={`${styles.checkDeliveryResponse} d-inline-flex flex-column col-12 gap-2 mt-3 p-3`}
            >
              {deliveryDetail.max_days !== "" ||
                deliveryDetail.min_days !== "" ? (
                <p
                  className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                  style={{
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <span
                    className={`${styles.checkDeliveryLabel} d-inline-flex`}
                  >
                    Expected Delivery Date:
                  </span>
                  <span>
                    {deliveryDetail.min_days !== "" ? (
                      <span>
                        <strong
                          className={`${styles.checkDeliveryDate} d-inline-flex`}
                        >
                          {
                            formatDeliveryDate(new Date().setDate(new Date().getDate() + deliveryDetail.min_days))
                          }
                        </strong>
                      </span>
                    ) : null}
                    {deliveryDetail.max_days !== "" &&
                      deliveryDetail.min_days !== "" && (
                        <span>&nbsp;-&nbsp;</span>
                      )}
                    {deliveryDetail.max_days !== "" ? (
                      <span>
                        <strong
                          className={`${styles.checkDeliveryDate} d-inline-flex`}
                        >
                          {
                            formatDeliveryDate(new Date().setDate(new Date().getDate() + deliveryDetail.max_days))
                          }
                        </strong>
                      </span>
                    ) : null}
                  </span>
                </p>
              ) : (
                ""
              )}

              <p
                className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <span>Available for Pickup at: </span>
                <strong
                  id="deliveryLoc"
                  className={`${styles.checkDeliveryLabel} d-inline-flex`}
                >
                  Shop No - 01, Old Delhi Road Opposite Hudda Office Gurugram Haryana - 122015
                </strong>
              </p>
              <p
                className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <span>Store Contact: </span>
                <span
                  className={`${styles.checkDeliveryLabel} d-inline-flex`}
                >
                  <Link
                    className={`${styles.checkDeliveryDateOuter} d-inline-flex fw-bold text-black`}
                    to={`tel:${enviroment.PHONE_NUMBER}`}
                    id="storeTel"
                  >
                    {enviroment.PHONE_NUMBER}
                  </Link>
                </span>
              </p>
              <p
                className={`${styles.checkDeliveryDateOuter} col-12 mb-1`}
                style={{
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <span>Locate Store: </span>
                <span
                  className={`${styles.checkDeliveryLabel} d-inline-flex`}
                >
                  <a
                    href="https://g.co/kgs/o2Frgzd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.checkDeliveryDateOuter} d-inline-flex fw-bold text-black`}
                  >
                    Google Map
                  </a>
                </span>
              </p>
            </div>
          )}
        </div>
      </Row>
    </Card>
  );
};


