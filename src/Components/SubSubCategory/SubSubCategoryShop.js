import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import noImage from "../../assets/images/image-not-available.jpg";
import { enviroment } from "../../enviroment";
import ApiService from "../../services/ApiService";
import styles from "./SubSubCategoryShop.module.css";
import { ProductCard } from "../ProductCard/ProductCard";
import { Header } from "../Header/Header";
import { PageHeader } from "../PageHeader/PageHeader";
import { Footer } from "../Footer/Footer";
import InfiniteScroll from "react-infinite-scroll-component";
import AdaptiveLoader from "../AdaptiveLoader/AdaptiveLoader";

export const SubSubCategoryShop = () => {
  const { subCategorySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [apiPayload, setApiPayload] = useState(null);
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const payload = {
      store_id: parseInt(enviroment.STORE_ID),
      subCategorySlug: subCategorySlug
    };
    setApiPayload(payload);
    setLoading(true);
    ApiService.CategoryBySubProdBySlug(payload)
      .then((res) => {
        setData(res?.payload_SubCategoryByProductBySlug);
        setApiPayload((prev) => ({ ...prev, page: 2 }));

      })
      .catch((err) => { })
      .finally(() => {
        setLoading(false);
      });
  }, [navigate, subCategorySlug]);


  const LoadMoreProducts = () => {
    let pageCount = apiPayload?.page;
    pageCount = pageCount + 1;
    ApiService.CategoryBySubProdBySlug(apiPayload)
      .then((res) => {
        if (res.message === "Fetch successfully.") {
          let prevProdArr = [];
          prevProdArr = data.products;
          let newProd = res.payload_SubCategoryByProductBySlug?.products;
          for (let i = 0; i < newProd.length; i++) {
            prevProdArr.push(newProd[i]);
          }
          let newProduct = [...prevProdArr];
          setData((prev) => {
            return {
              ...prev,
              products: newProduct
            }
          });
          setLoading(false);
          setApiPayload((prev) => ({ ...prev, page: pageCount }));
        }
      })
      .catch((err) => { });
  };


  return (
    <div className="bg-white h-100">
      <div className="hideInDesktop">
        <PageHeader title="Explore Categories" />
      </div>

      {/* Desktop Structure */}
      <div className="hideInMobile">
        <Header />
      </div>
      <div className="container mx-auto p-0 p-md-2">
        <div
          className={`${styles.dataBox} col-12 d-inline-flex flex-column py-2`}
        >
          <div className="titlesWrapper">
            <h5
              className={`subTitleLarge col-12`}
            >
              {data?.subCategory?.name}
            </h5>
          </div>
          <div
            className={`${styles.lookingContainer} col-12 px-2 d-inline-flex flex-wrap align-items-stretch p-0 row-gap-3`}
          >
            {
              loading ?
                <AdaptiveLoader />
                :
                data?.products?.length > 0 ? (
                  <InfiniteScroll
                    className="d-inline-flex col-12 flex-wrap"
                    dataLength={data?.products.length}
                    next={LoadMoreProducts}
                    hasMore={true}
                  >
                    {data?.products?.map((item, index) => {
                      return (
                        <React.Fragment key={index}>
                          {item.name !== "" && (
                            <div
                              className={`${styles.productCardBox} px-2 flex-shrink-0 mb-3 col-10 col-sm-6 col-md-4 col-lg-3 mx-auto`}
                              key={index}
                              role="button"
                            >
                              <ProductCard item={item} index={index} />
                            </div>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </InfiniteScroll>
                ) : (
                  <div className="col-12 d-inline-flex flex-column align-items-center justify-content-center">
                    <h5 className="col-12 fs-3 text-center text-secondary py-5 my-5" style={{
                      minHeight: "50vh"
                    }}>No products found</h5>
                  </div>
                )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};