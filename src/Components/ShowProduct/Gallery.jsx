import { useCallback, useRef, useState } from "react";
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
    getProductImageOfColorId,
    setProdMainImg,
    setProdSharePop
}) {
    const [activeImg, setActiveImg] = useState("");
    const source = useRef(null);
    const target = useRef(null);
    const cursor = useRef(null);

    useMouseOverZoom(source, target, cursor);

    const setMainImage = useCallback((image, count) => {
        setActiveImg(count);
        setProdMainImg(image);
    }, [setProdMainImg]);

    if (sm) {
        return <div className="col-12 d-inline-block position-relative">
            {ProductData?.stock <= 0 && (
                <div className={`${styles.productSoldOutBox} position-absolute col-12 p-0 h-100`}>
                    <span className={`${styles.soldOutText} text-center text-uppercase position-absolute d-block`}>
                        Sold Out
                    </span>
                </div>
            )}
            <ReactOwlCarousel
                className={`${styles.bannerContainer} col-12 owl-theme`}
                margin={0}
                loop={false}
                dots={true}
                items={1}
            >
                <div className="col-12 d-inline-block bg-white d-flex align-items-center justify-content-center w-full">
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
                        <div className="col-12 d-inline-block d-flex align-items-center justify-content-center w-full" style={{ height: "500px" }}>
                            <ThreeDots visible={true} height="80" width="80" color="#000" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                        </div>
                    )}
                </div>
                {ProductData?.gallery_images?.map((item, index) => (
                    <div key={index} className="col-12 d-inline-block bg-white d-flex align-items-center justify-content-center w-full">
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
                            <div className="col-12 d-inline-block d-flex align-items-center justify-content-center w-full" style={{ height: "500px" }}>
                                <ThreeDots visible={true} height="80" width="80" color="#000" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                            </div>
                        )}
                    </div>
                ))}
            </ReactOwlCarousel>
            {productLoading && !ProductData?.gallery_images.length && (
                !productLoading ? (
                    <div className="col-12 d-inline-block d-flex align-items-center justify-content-center w-full">
                        <img
                            src={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
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
                    <div className="col-12 d-inline-block d-flex align-items-center justify-content-center w-full" style={{ height: "100px" }}>
                        <ThreeDots visible={true} height="80" width="80" color="#000" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
                    </div>
                )
            )}
        </div>
    }

    return <div className={`${styles.productContainer} d-inline-flex flex-column gap-3 col-12 pb-3`}>
        <div
            ref={cursor}
            style={{
                border: '2px solid #007bff76',
                position: 'absolute',
                pointerEvents: 'none',
                background: 'rgba(0, 123, 255, 0.1)',
                zIndex: 100,
                borderRadius: '50%',
            }}
        >
            <span className="position-absolute top-50 start-50 translate-middle text-primary fw-bold">+</span>
        </div>
        <canvas
            ref={target}
            style={{
                position: 'absolute',
                pointerEvents: 'none',
                top: '0',
                left: '103.5%',
                width: '48.5vw',
                height: '65vh',
                zIndex: 999,
                border: "1px solid #e0e0e0",
                borderRadius: "4px",
            }}
        />
        <div
            className={`${styles.productMainImage} col-12 d-inline-block position-relative bg-white rounded overflow-hidden`}
            style={{
                cursor: "crosshair",
            }}
        >
            {ProductData?.stock <= 0 && (
                <div className={`${styles.productSoldOutBox} position-absolute col-12 p-0 h-100 top-0`}>
                    <span className={`${styles.soldOutText} text-center text-uppercase position-absolute d-block`}>
                        Sold Out
                    </span>
                </div>
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
                    src={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
                    onError={(e) => setNoImage(e)}
                    alt={ProductData?.name}
                    style={{
                        opacity: (ProductData?.stock <= 0) ? "0.5" : "1",
                    }}
                    className="object-fit-contain m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block position-absolute"
                />
            ) : (
                <div className="m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block d-flex align-items-center justify-content-center position-absolute">
                    <ThreeDots visible={true} height="80" width="80" color="#000" radius="9" ariaLabel="three-dots-loading" wrapperStyle={{}} wrapperClass="" />
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
            responsive={{
                0: { items: 3 },
                576: { items: 4 },
                768: { items: 5 },
                992: { items: 6 },
            }}
        >
            <div
                className={`${styles.galleryBox} ${activeImg === -1 ? styles.activeGallery : ""} col-12 d-inline-flex p-0 rounded align-items-center justify-content-center`}
                onClick={() => setMainImage(ProductData?.image, -1)}
            >
                <img
                    alt={ProductData?.name}
                    src={(ProductData?.image || ProductData?.image === "") ? getProductImageOfColorId(ProductData?.color_id) : ProductData?.image}
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

            {ProductData?.gallery_images?.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.galleryBox} ${activeImg === index ? styles.activeGallery : ""} col-12 d-inline-flex p-0 rounded align-items-center justify-content-center`}
                    onClick={() => setMainImage(enviroment.API_IMAGE_GALLERY_URL + item, index)}
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
            ))}
        </ReactOwlCarousel>
    </div>
}

