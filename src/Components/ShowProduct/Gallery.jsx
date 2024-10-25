import { useRef, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactOwlCarousel from "react-owl-carousel";
import { enviroment } from "../../enviroment";
import { useMouseOverZoom } from "../../hooks/mousehoverzoom";
import { ShareIcon } from "../siteIcons";

export default function ProductGallery({
    sm = true,
    ProductData,
    styles,
    productLoading,
    setNoImage,
    prodMainImg,
    setProdMainImg,
    setProdSharePop
}) {

    const [activeImg, setActiveImg] = useState("");
    const source = useRef(null);
    const target = useRef(null);
    const cursor = useRef(null);

    useMouseOverZoom(source, target, cursor);

    const setMainImage = (image, count) => {
        setActiveImg(count);
        setProdMainImg(image);
    };


    if (sm) {
        return <div className="col-12 d-inline-block position-relative">
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
                    {!productLoading ? (
                        <img
                            src={ProductData?.image}
                            alt={ProductData?.name}
                            onError={(e) => setNoImage(e)}
                            className="col-12 d-inline-block"
                            style={{
                                minHeight: "300px",
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
                                color="#000"
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
                            {!productLoading ? (
                                <img
                                    src={enviroment.API_IMAGE_GALLERY_URL + item}
                                    onError={(e) => setNoImage(e)}
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
                                        color="#000"
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
            {productLoading && !ProductData?.gallery_images.length ? (
                !productLoading ? (
                    <div
                        className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                    >
                        <img
                            src={prodMainImg}
                            alt={ProductData?.name}
                            onError={(e) => setNoImage(e)}
                            className="col-12 d-inline-block"
                            style={{
                                maxHeight: "100px",
                                width: "auto",
                            }}
                        />
                    </div>
                ) : (
                    <div
                        className={`col-12 d-inline-block d-flex align-items-center justify-content-center w-full`}
                        style={{
                            height: "100px",
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
                )
            ) : null}
        </div>
    }

    return <div
        className={`${styles.productContainer} d-inline-flex flex-column gap-3 col-12 pb-3`}>
        <div
            ref={cursor}
            style={{
                border: '1px solid skyblue',
                position: 'absolute',
                pointerEvents: 'none',
                background: 'rgba(0, 0, 0, 0.1)',
                zIndex: 100,
            }}
        ></div>
        <canvas
            ref={target}
            style={{
                // display: 'none',
                position: 'absolute',
                pointerEvents: 'none',
                bottom: '100%',
                top: '0',
                left: '100%',
                borderTopRightRadius: '0%',
                width: '30rem',
                height: '30rem',
                zIndex: 999,
                background: "transparent",
            }}
        ></canvas>
        <div
            className={`${styles.productMainImage} col-12 d-inline-block position-relative bg-white rounded`}
            style={{
                cursor: "grab",
            }}
        >
            {ProductData?.stock === 0 || ProductData?.stock < 0 ? (
                <div
                    className={`${styles.productSoldOutBox} position-absolute col-12 p-0 h-100 top-0`}
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
            <span
                className={`${styles.shareIcon} d-inline-flex align-items-center justify-content-center position-absolute top-0 end-0 p-3`}
                role="button"
                onClick={() => setProdSharePop(true)}
            >
                <ShareIcon color="#000" />
            </span>
            {!productLoading ? (
                <img
                    ref={source}
                    src={prodMainImg}
                    onError={(e) => setNoImage(e)}
                    alt={ProductData?.name}
                    style={{
                        opacity: (ProductData?.stock === 0 || ProductData?.stock < 0) ? "0.5" : "1",
                    }}
                    className="object-fit-cover m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block position-absolute"
                />
            ) : (
                <div className="m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block d-flex align-items-center justify-content-center position-absolute">
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
        <ReactOwlCarousel
            key={activeImg}
            className={`${styles.productGalleryRow} col-12 owl-theme galleryBox px-3`}
            margin={10}
            loop={false}
            dots={false}
            items={6}
        >
            <div
                className={`${styles.galleryBox} ${activeImg === -1 ? styles.activeGallery : ""
                    } col-12 d-inline-flex p-0 rounded align-items-center justify-content-center`}
                onClick={() => setMainImage(ProductData?.image, -1)}
            >
                <img
                    alt={ProductData?.name}
                    src={ProductData?.image}
                    onError={(e) => setNoImage(e)}
                    className="bg-white rounded"
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
                        className={`${styles.galleryBox} ${activeImg === index ? styles.activeGallery : ""
                            } col-12 d-inline-flex p-0 rounded align-items-center justify-content-center`}
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
                            onError={(e) => setNoImage(e)}
                            className="bg-white m-0 rounded"
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
}