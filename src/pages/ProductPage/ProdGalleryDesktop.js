import { useState } from 'react';
import { createPortal } from 'react-dom';
import { ThreeDots } from "react-loader-spinner";
import ReactOwlCarousel from "react-owl-carousel";
import { enviroment } from "../../enviroment";
import { ShareIcon } from '../../Components/siteIcons';
import { CloseButton } from 'react-bootstrap';

export default function ProductGalleryDesktop({
    styles,
    ProductData,
    setProdSharePop,
    prodMainImg,
    productLoading,
    getProductImageOfColorId,
    setNoImage,
    activeImg,
    setMainImage
}) {
    const [fullScreenImage, setFullScreenImage] = useState(null);
    const [fullScreenIndex, setFullScreenIndex] = useState(0);

    const openFullScreen = (imageSrc, index) => {
        setFullScreenImage(imageSrc);
        setFullScreenIndex(index);
    };

    const closeFullScreen = () => {
        setFullScreenImage(null);
    };

    const navigateFullScreen = (direction) => {
        const images = [ProductData?.image || getProductImageOfColorId(ProductData?.color_id),
        ...(ProductData?.gallery_images?.map(item => enviroment.API_IMAGE_GALLERY_URL + item) || [])];
        let newIndex = fullScreenIndex + direction;
        if (newIndex < 0) newIndex = images.length - 1;
        if (newIndex >= images.length) newIndex = 0;
        setFullScreenImage(images[newIndex]);
        setFullScreenIndex(newIndex);
    };

    return <>
        <div
            className={`${styles.productContainer} d-inline-flex flex-column gap-3 col-12 pb-3`}
        >
            <div
                className={`${styles.productMainImage} col-12 d-inline-block position-relative bg-white rounded`}
                onClick={() => openFullScreen(prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg, -1)}
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
                    onClick={(e) => {
                        e.stopPropagation();
                        setProdSharePop(true);
                    }}
                >
                    <ShareIcon color="#000" />
                </span>
                {!productLoading ? (
                    <img
                        src={prodMainImg === "" ? getProductImageOfColorId(ProductData?.color_id) : prodMainImg}
                        onError={(e) => setNoImage(e)}
                        alt={ProductData?.name}
                        style={{
                            opacity: (ProductData?.stock === 0 || ProductData?.stock < 0) ? "0.5" : "1",
                        }}
                        className="object-fit-contain m-auto bottom-0 end-0 h-100 top-0 start-0 col-12 d-inline-block position-absolute"
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
                    onClick={() => {
                        setMainImage(ProductData?.image, -1);
                        openFullScreen(ProductData?.image || getProductImageOfColorId(ProductData?.color_id), -1);
                    }}
                >
                    <img
                        alt={ProductData?.name}
                        src={(!ProductData?.image || ProductData?.image === "") ? getProductImageOfColorId(ProductData?.color_id) : ProductData?.image}
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
                    const imageSrc = enviroment.API_IMAGE_GALLERY_URL + item;
                    return (
                        <div
                            className={`${styles.galleryBox} ${activeImg === index ? styles.activeGallery : ""
                                } col-12 d-inline-flex p-0 rounded align-items-center justify-content-center`}
                            onClick={() => {
                                setMainImage(imageSrc, index);
                                openFullScreen(imageSrc, index);
                            }}
                            key={index}
                        >
                            <img
                                src={imageSrc}
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
        {fullScreenImage && createPortal(
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 2147483647,
                }}
            >
                <div style={{
                    display: 'flex',
                    width: '90%',
                    height: '90%',
                    backgroundColor: 'white',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                }}>
                    <div style={{
                        width: '70%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                    }}>
                        <img
                            src={fullScreenImage}
                            alt={ProductData?.name}
                            style={{
                                maxWidth: '100%',
                                maxHeight: '100%',
                                objectFit: 'contain',
                            }}
                        />
                        <button
                            style={{
                                position: 'absolute',
                                left: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateFullScreen(-1);
                            }}
                        >
                            &#8249;
                        </button>
                        <button
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'rgba(255, 255, 255, 0.7)',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                fontSize: '20px',
                                cursor: 'pointer',
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                navigateFullScreen(1);
                            }}
                        >
                            &#8250;
                        </button>
                    </div>
                    <div style={{
                        width: '30%',
                        height: '100%',
                        padding: '20px',
                        borderLeft: '1px solid #e0e0e0',
                        display: 'flex',
                        flexDirection: 'column',
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            marginBottom: '20px',
                        }}>
                            {ProductData?.name}
                        </h2>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            overflowY: 'auto',
                        }}>
                            {[ProductData?.image || getProductImageOfColorId(ProductData?.color_id),
                            ...(ProductData?.gallery_images?.map(item => enviroment.API_IMAGE_GALLERY_URL + item) || [])]
                                .map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${ProductData?.name} - ${index}`}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            border: fullScreenIndex === index ? '2px solid #007bff' : '1px solid #e0e0e0',
                                        }}
                                        onClick={() => openFullScreen(img, index)}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
                <button
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: '#333',
                        fontSize: '24px',
                        cursor: 'pointer',
                    }}
                    onClick={closeFullScreen}
                >
                    <CloseButton />
                </button>
            </div>,
            document.body
        )}
    </>
}

