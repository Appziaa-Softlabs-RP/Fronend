import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { ThreeDots } from "react-loader-spinner";
import Skeleton from "react-loading-skeleton";
import ReactOwlCarousel from "react-owl-carousel";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import noImage from "../../assets/images/image-not-available.jpg";
import AddReview from "../../Components/AddReview/AddReview";
import ShowReviews from "../../Components/AddReview/ShowReviews";
import { Aside } from "../../Components/Aside/Aside";
import { FeaturedProducts } from "../../Components/FeaturedProducts/FeaturedProducts";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import AddProductQuantity from "../../Components/shared/AddProductQuantity";
import ProductGallery from "../../Components/ShowProduct/Gallery";
import { SimilarProduct } from "../../Components/SimilarProduct/SimilarProduct";
import {
  CopyIcon,
  CrossIcon,
  FacebookIcon,
  LocationIcon,
  PinterestIcon,
  ShareIcon,
  TwitterIcon,
  WhatsAppIcon,
} from "../../Components/siteIcons";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import { AppNotification } from "../../utils/helper";
import styles from "./ProductPage.module.css";

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
  const [asideOpen, setAsideOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);

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
        store_email: "info@neverowned.in"
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
    let prodId = searchParams.get("id");
    const payload = {
      product_slug: slug,
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
        overflowX: "hidden",
      }}>

        <div className="">
          <Header asideOpen={asideOpen} setAsideOpen={setAsideOpen} setFetchedNavItems={setNavItems} />
          <Aside asideOpen={asideOpen} setAsideOpen={setAsideOpen} navItems={navItems} setNavItems={setNavItems} />
        </div>

        <ProductGallery
          ProductData={ProductData}
          styles={styles}
          productLoading={productLoading}
          setNoImage={setNoImage}
          prodMainImg={prodMainImg}
          getProductImageOfColorId={getProductImageOfColorId}
          setProdMainImg={setProdMainImg}
          setProdSharePop={setProdSharePop}
        />

        <div
          className={`${styles.productAllDetail} col-12 d-flex flex-column gap-3 p-4`}
        >
          <h2 className={`${styles.productDetailName} col-12 mb-1 text-start m-0`}
            style={{
              fontSize: "1.5rem",
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
          {/* Color and size */}
          <div className="row my-3 d-flex flex-column gap-3">
            {/* Colors Section */}
            <div className="col-md-12">
              <h2 className={`${styles.specialTitle} d-inline-flex m-0 mb-2`}>More Colors</h2>
              {
                productVariantsLoading ?
                  <ColorSkeleton />
                  :
                  <div className="d-flex gap-2">
                    {productVariants
                      .filter((variant, index, self) =>
                        index === self.findIndex((v) => v.color_code === variant.color_code)
                      )
                      .map((variant) => (
                        <div key={variant.color_code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column", marginRight: '10px' }}>
                          <Link
                            to={`/product/${variant.name_url}`}
                            className={`color-option`}
                            style={{
                              backgroundColor: variant.color_code,
                              minWidth: '60px',
                              width: '60px',
                              minHeight: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              border: (ProductData?.color_id === variant?.color_id) && '2px solid red'
                            }}
                          >
                            {
                              getProductImageOfColorId(variant?.color_id) &&
                              <img src={getProductImageOfColorId(variant?.color_id)} alt={variant.color_name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'fill',
                                  borderRadius: '50%',
                                }}
                              />
                            }
                          </Link>
                          <span style={{
                            fontSize: '12px',
                          }}>{variant.color_name}</span>
                        </div>
                      ))}
                  </div>
              }
            </div>

            {/* Sizes Section */}
            <div className="col-md-12">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  maxWidth: '300px',
                }}
              >
                <h2 className={`${styles.specialTitle} d-inline-flex m-0`}>
                  Select Size (EUR Size)
                </h2>
                <SizeGuideModal
                  prodDiscount={prodDiscount}
                  productLoading={productLoading}
                  productData={ProductData}
                  prodMainImg={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
                  sizeGuide={ProductData?.size_guide}
                  ProductData={ProductData}
                  addToCart={addToCart}
                  prodAdded={prodAdded}
                  prodAddedQty={prodAddedQty}
                  updateProdQty={updateProdQty}
                />
              </div>
              {
                productVariantsLoading ?
                  <SizeSkeleton />
                  :
                  <div className="d-flex">
                    {productVariants
                      .filter((variant) => variant.color_id === ProductData?.color_id)
                      .map((variant) => (
                        <Link
                          key={variant.size}
                          to={`/product/${variant.name_url}`}
                          className="btn"
                          style={{
                            marginRight: '5px',
                            textAlign: 'center',
                            padding: '4px',
                            fontSize: '12px',
                            height: '30px',
                            width: '30px',
                            border: (ProductData?.size === variant?.size) ? '2px solid red' : '1px solid #000',
                            borderRadius: '50%',
                          }}
                        >
                          {variant.size}
                        </Link>
                      ))}
                  </div>
              }
            </div>
            <AddReview
              product_id={ProductData?.product_id}
              total_rating={ProductData?.total_rating}
            />
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

        {isSpecializationDetail &&
          isOtherDetail &&
          ProductData?.description !== "Not available" && (
            <div
              className={`${styles.productDesciptionBox} col-12 d-inline-block mb-3 p-4`}
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
                      background: "rgba(207, 16, 46, 0.12)",
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
                      background: "rgba(207, 16, 46, 0.12)",
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
                  className={`${styles.productCollapseBox} mb-4 mt-3 active col-12 d-inline-block p-0`}
                  onClick={openProductColpse(this)}
                >
                  <div
                    className={`${styles.productTabBox} col-12 d-inline-flex align-items-center justify-content-between`}
                    style={{
                      height: "fit-content",
                      background: "rgba(207, 16, 46, 0.12)",
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
        <div className={`col-12 d-inline-block mb-5`}>
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
        overflowX: "hidden",
      }}>
        <Header />
        <div className="col-12 d-inline-flex" style={{
          background: "#EEEEEE"
        }}>
          <div className="container-fluid">
            <div
              className={`col-12 d-inline-flex align-items-start position-relative gap-4 mb-4`}
            >
              <div
                className={`d-inline-flex flex-column gap-3 col-6 flex-shrink-1 position-sticky top-0 mt-5`}
              >
                <ProductGallery
                  sm={false}
                  ProductData={ProductData}
                  styles={styles}
                  productLoading={productLoading}
                  setNoImage={setNoImage}
                  prodMainImg={prodMainImg}
                  getProductImageOfColorId={getProductImageOfColorId}
                  setProdMainImg={setProdMainImg}
                  setProdSharePop={setProdSharePop}
                />

                <div className="col-12 d-flex flex-column m-3">
                  <div className="d-flex align-items-center justify-content-between flex-column gap-2">
                    {ProductData?.description &&
                      ProductData?.description !== "Not available" &&
                      (
                        <div
                          className={`col-4 text-center ${descActive === "Description" ? styles.tabActive : ""
                            } ${styles.productDescTitle}`}
                          onClick={() => setDescActive("Description")}
                          role="button"
                        >
                          <h4>Product Description</h4>
                          <span>+</span>
                        </div>
                      )}
                    {descActive === "Description" &&
                      ProductData?.description !== "Not available" && (
                        <div
                          className={`d-flex flex-column col-12`}
                          dangerouslySetInnerHTML={prodDesc}
                        ></div>
                      )}
                    {otherInfo && (
                      <div
                        className={`col-4 text-center ${descActive === "Specifications" ? styles.tabActive : ""
                          } ${styles.productDescTitle}`}
                        onClick={() => setDescActive("Specifications")}
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
                        className={`col-4 text-center ${descActive === "Features" ? styles.tabActive : ""
                          } ${styles.productDescTitle}`}
                        onClick={() => setDescActive("Features")}
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
              </div>
              <div
                className={`${styles.productDetailBox} d-inline-flex flex-column gap-2 col-6 flex-shrink-1 align-items-start justify-content-start px-4 pt-5`}
              >
                {/* {ProductData?.brand_name !== null && (
                  <h6 className={`${styles.brandName} d-inline-flex m-0`}>
                    {ProductData?.brand_name}
                  </h6>
                )} */}
                <div
                  className={`${styles.productSubLine} d-inline-flex align-items-center gap-2 mb-0`}
                >
                  {
                    productLoading ?
                      <Skeleton width={100} height={20} />
                      :
                      <div className="d-inline-flex align-items-center gap-2">
                        {ProductData?.category_name ? (
                          <span className={`m-0`}>
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
                {/* <span className="ml-3 mb-0">
                  Item Code: {ProductData?.article_name}
                </span> */}
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
                  className={`d-inline-flex align-items-start flex-column gap-2 w-full`}
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
                  {ProductData?.selling_price === ProductData?.mrp ? (
                    <span className={`${styles.offerPrice}`}>
                      {
                        productLoading ?
                          <Skeleton width={100} height={20} />
                          : <b>₹{ProductData?.mrp}</b>
                      }
                    </span>
                  ) : (
                    <div className="col-12 d-inline-flex align-items-center gap-3">
                      {
                        productLoading ?
                          <Skeleton width={'300px'} height={24} />
                          :
                          <div
                            className={`${styles.offerPrice} d-flex align-items-center gap-2`}
                          >
                            <b style={{
                              fontSize: '26px',
                              margin: '0',
                            }}>₹{ProductData?.selling_price}</b>
                            <p className="text-secondary"
                              style={{
                                fontSize: '20px',
                                display: 'flex',
                                gap: '5px',
                                margin: '0',
                              }}><span style={{
                                fontWeight: 'bold'
                              }}>MRP</span><del>₹{ProductData?.mrp}</del>
                            </p>
                            {prodDiscount !== "" && (
                              <span
                                className={`${styles.offerPercentage} d-inline-flex`}
                              >
                                ({prodDiscount}% &nbsp;OFF)
                              </span>
                            )}
                          </div>
                      }
                    </div>
                  )}
                </div>
                {/* Color and size */}
                <div className="row my-3 d-flex flex-column gap-3">
                  {/* Colors Section */}
                  <div className="col-md-12">
                    <h2 className={`${styles.specialTitle} d-inline-flex m-0 mb-2`}>More Colors</h2>
                    {
                      productVariantsLoading ?
                        <ColorSkeleton />
                        :
                        <div className="d-flex gap-2">
                          {productVariants
                            .filter((variant, index, self) => {
                              return index === self.findIndex((v) => v.color_code === variant.color_code)
                            })
                            .map((variant) => (
                              <div key={variant.color_code} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: "column", marginRight: '10px' }}>
                                <Link
                                  to={`/product/${variant.name_url}`}
                                  className={`color-option`}
                                  style={{
                                    backgroundColor: variant.color_code,
                                    minWidth: '60px',
                                    width: '60px',
                                    minHeight: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    border: (ProductData?.color_id === variant?.color_id) && '2px solid red'
                                  }}
                                >
                                  {
                                    getProductImageOfColorId(variant?.color_id) &&
                                    <img src={getProductImageOfColorId(variant?.color_id)} alt={variant.color_name}
                                      style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'fill',
                                        borderRadius: '50%',
                                      }}
                                    />
                                  }
                                </Link>
                                <span style={{
                                  fontSize: '12px',
                                }}>{variant.color_name}</span>
                              </div>
                            ))}
                        </div>
                    }
                  </div>

                  {/* Sizes Section */}
                  <div className="col-md-12">
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        maxWidth: '300px',
                      }}
                    >
                      <h2 className={`${styles.specialTitle} d-inline-flex m-0`}>
                        Select Size (EUR Size)
                      </h2>
                      <SizeGuideModal
                        prodDiscount={prodDiscount}
                        productData={ProductData}
                        productLoading={productLoading}
                        prodMainImg={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
                        sizeGuide={ProductData?.size_guide}
                        ProductData={ProductData}
                        addToCart={addToCart}
                        prodAdded={prodAdded}
                        prodAddedQty={prodAddedQty}
                        updateProdQty={updateProdQty}
                      />
                    </div>
                    {
                      productVariantsLoading ?
                        <SizeSkeleton />
                        :
                        <div className="d-flex">
                          {productVariants
                            .filter((variant) => variant.color_id === ProductData?.color_id)
                            .map((variant) => (
                              <Link
                                key={variant.size}
                                to={`/product/${variant.name_url}`}
                                className="btn"
                                style={{
                                  marginRight: '5px',
                                  textAlign: 'center',
                                  padding: '4px',
                                  fontSize: '12px',
                                  height: '30px',
                                  width: '30px',
                                  border: (ProductData?.size === variant?.size) ? '2px solid red' : '1px solid #000',
                                  borderRadius: '50%',
                                }}
                              >
                                {variant.size}
                              </Link>
                            ))}
                        </div>
                    }
                  </div>
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  width: '100%',
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
                        className={`${styles.continueShop} col-5 d-inline-flex align-items-center justify-content-center text-uppercase`}
                      >
                        Out of stock
                      </button>
                    ) : (
                      <button
                        disabled={productLoading || ProductData?.stock === 0 || ProductData?.stock < 0}
                        className={`${styles.continueShop} ${ProductData?.stock === 0 || ProductData?.stock < 0
                          ? styles.disableCartBtn
                          : ""
                          } col-5 d-inline-flex align-items-center justify-content-center`}
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
                  <Link to="/checkout">
                    <span
                      className={`${styles.wishlist}  col-5 d-inline-flex align-items-center justify-content-center`}
                    >
                      Wishlist
                    </span>
                  </Link>
                </div>
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
                              <img src={item.logo} alt={item.description}
                                onError={(e) => setNoImage(e)}
                              />
                              {item.description}
                            </span>
                          );
                        })}
                    </div>
                  )}

                <div className="col-12 d-inline-block mt-3 mb-3" style={{
                  position: "relative",
                  zIndex: "0"
                }}>
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

                <AddReview
                  product_id={ProductData?.product_id}
                  total_rating={ProductData?.total_rating}
                />

              </div>
            </div>
          </div>
        </div>
        <div className={`col-12 d-inline-block mb-5`}>
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

const SizeGuideModal = ({
  prodDiscount,
  productData,
  productLoading,
  prodMainImg,
  prodAdded,
  ProductData,
  addToCart,
  prodAddedQty,
  updateProdQty,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const [isSizeInCm, setSizeInCm] = useState(true);

  const setNoImage = (e) => {
    if (e.target) {
      e.target.src = noImage;
    }
  };
  const sizeData = [
    { uk: 5, us: 6, euro: 39, cm: 23.4, inches: 9.21 },
    { uk: 6, us: 7, euro: 40, cm: 24.4, inches: 9.61 },
    { uk: 7, us: 8, euro: 41, cm: 25.4, inches: 10.00 },
    { uk: 8, us: 9, euro: 42, cm: 26.4, inches: 10.40 },
    { uk: 9, us: 10, euro: 43, cm: 27.4, inches: 10.80 },
    { uk: 10, us: 11, euro: 44, cm: 28.4, inches: 11.20 },
    { uk: 11, us: 12, euro: 45, cm: 29.4, inches: 11.57 },
  ];

  return <>
    <button className="btn fw-bold text-danger"
      onClick={() => setModalShow(true)}
    >
      See Guide &gt;
    </button>
    <div
      show={modalShow}
      onHide={() => setModalShow(false)}
      size="lg"
      className="position-absolute"
      style={{
        top: '0px',
        maxHeight: '100vh',
        overflowY: 'scroll',
        right: '0px',
        background: 'white',
        height: 'fit-content',
        zIndex: '10',
        padding: '20px 10px',
        animation: 'slide 0.5s',
        transition: 'transform 0.5s',
        transform: modalShow ? 'translateX(0px)' : 'translateX(1000px)',
        display: modalShow ? 'flex' : 'none',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* HideBtn */}
      <div className="closeBtn">
        <button className="btn p-0"
          onClick={() => setModalShow(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-x" viewBox="0 0 16 16">
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
          </svg>
        </button>
      </div>

      {/* ProductInfo */}
      <div className="productInfo" style={{
        display: 'flex',
        gap: '20px',
      }}>
        <div>
          {!productLoading ? (
            <img
              src={prodMainImg}
              onError={(e) => setNoImage(e)}
              alt={ProductData?.name}
              className="d-inline-block"
              style={{
                height: "100px",
                width: "100px",
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
                color="#000"
                radius="9"
                ariaLabel="three-dots-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          fontSize: '16px',
        }}>
          <p className="m-0">{ProductData?.category_name
            ? ProductData?.category_name
            : ""}</p>
          <p style={{
            fontWeight: 'bold',
            margin: '0px',
          }}>{productData?.name}</p>
          <div
            className={`d-inline-flex align-items-start flex-column gap-2 col-12 position-relative`}
          >
            {ProductData?.selling_price === ProductData?.mrp ? (
              <span className={`${styles.offerPrice}`} style={{
                fontSize: '16px',
              }}>
                <b>₹{ProductData?.mrp}</b>
              </span>
            ) : (
              <div className="col-12 d-inline-flex align-items-center gap-3 fw-bold">
                <span
                  className={`${styles.offerPrice} d-inline-flex align-items-center gap-2 fw-bold`}
                  style={{
                    fontSize: '16px',
                  }}
                >
                  <b>₹{ProductData?.selling_price}</b>
                  <del>₹{ProductData?.mrp}</del>
                </span>
                {prodDiscount !== "" && (
                  <span
                    className={`${styles.offerPercentage} d-inline-flex fw-bold`}
                    style={{
                      fontSize: '16px',
                    }}
                  >
                    {prodDiscount}% &nbsp;OFF
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breakline */}
      <div className="breakline" style={{
        minHeight: '1px',
        height: '1px',
        width: '100%',
        borderBottom: '2px dashed gray',
      }}>
      </div>

      {/* SizeTypeHeading */}
      <div className="sizeTypeAndHeading" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      }}>
        <h2 className="text-danger text-start m-0" style={{
          fontSize: '1rem'
        }}>Size Chart</h2>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '10px',
            background: '#D9D9D9',
            padding: '5px',
            borderRadius: '5px',
          }}
        >
          <button
            onClick={() => setSizeInCm(true)}
            className="btn"
            style={{
              fontSize: '12px',
              padding: '5px',
              background: isSizeInCm ? 'red' : '#D9D9D9',
              color: isSizeInCm ? 'white' : 'black',
              fontWeight: 'bold',
            }}
          >cm</button>
          <button
            className="btn"
            onClick={() => setSizeInCm(false)}
            style={{
              fontSize: '12px',
              padding: '5px',
              background: !isSizeInCm ? 'red' : '#D9D9D9',
              color: !isSizeInCm ? 'white' : 'black',
              fontWeight: 'bold',
            }}
          >inch</button>
        </div>
      </div>

      {/* SizeTable */}
      <div className="d-flex flex-column gap-4">
        <div className="row position-relative">
          <div className="col-xl-6 h-100">
            <div style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
            }}>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>UK</th>
                  <th>US</th>
                  <th>EURO</th>
                  {
                    isSizeInCm ?
                      <th>To Fit Foot Length (cm)</th>
                      :
                      <th>To Fit Foot Length (in)</th>
                  }
                </tr>
              </thead>
              <tbody>
                {sizeData.map((size, index) => (
                  <tr key={index}>
                    <td>{size.uk}</td>
                    <td>{size.us}</td>
                    <td>{size.euro}</td>
                    <td>
                      {
                        isSizeInCm ?
                          <td>{size.cm}</td>
                          :
                          <td>{size.inches}</td>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-xl-6" style={{
            minHeight: '100%',
            height: '100%',
          }}>
            <img src="/images/footlen.svg" alt="footlen" style={{
              height: '100%',
              width: 'auto'
            }} />
          </div>
        </div>
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
              className={`${styles.continueShop} col-5 w-100 d-inline-flex align-items-center justify-content-center text-uppercase`}
            >
              Out of stock
            </button>
          ) : (
            <button
              disabled={productLoading || ProductData?.stock === 0 || ProductData?.stock < 0}
              className={`${styles.continueShop} ${ProductData?.stock === 0 || ProductData?.stock < 0
                ? styles.disableCartBtn
                : ""
                } col-5 d-inline-flex align-items-center w-100 justify-content-center text-uppercase`}
              onClick={(e) => addToCart(e, ProductData)}
            >
              Add to cart
            </button>
          )
        ) : (
          <AddProductQuantity
            prodAdded={prodAdded}
            prodAddedQty={prodAddedQty}
            updateProdQty={updateProdQty}
          />
        )}
      </div>
    </div>
  </>
}

const SizeSkeleton = () => {
  return (
    <div className="d-flex">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="skeleton-text"
          style={{
            backgroundColor: '#e0e0e0',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            marginRight: '10px'
          }}
        ></div>
      ))}
    </div>
  );
};

const ColorSkeleton = () => {
  return (
    <div className="d-flex gap-3">
      {[...Array(4)].map((_, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', gap: '5px', justifyContent: 'center' }}>
          <div
            className="skeleton-circle"
            style={{
              backgroundColor: '#e0e0e0',
              minWidth: '60px',
              width: '60px',
              minHeight: '60px',
              margin: '0 auto',
              height: '60px',
              borderRadius: '50%',
            }}
          ></div>
          <div
            className="skeleton-text"
            style={{
              backgroundColor: '#e0e0e0',
              width: '40px',
              height: '16px',
              borderRadius: '4px'
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};