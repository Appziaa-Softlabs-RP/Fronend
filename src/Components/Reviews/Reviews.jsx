import { useState } from "react";
import ReactOwlCarousel from "react-owl-carousel";
import { Link } from "react-router-dom";
import { reviews } from "../../constants/data";
import styles from "./Review.module.css";

export default function Reviews() {

    const settings = {
        items: 3, // Number of items to display on desktop by default
        margin: 10,
        dots: false,
        loop: false,
        nav: true,
        responsive: {
            0: {
                items: 1,
            },
            300: {
                items: 1.01,
            },
            380: {
                items: 1.08,
            },
            400: {
                items: 1.1,
            },
            460: {
                items: 1.1,
            },
            510: {
                items: 1.2,
            },
            550: {
                items: 1.3,
            },
            620: {
                items: 1.7
            },
            700: {
                items: 1,
            },
            800: {
                items: 1.3,
            },
            900: {
                items: 1.7,
            },
            1000: {
                items: 1.8,
            },
            1100: {
                items: 2.3,
            },
            1200: {
                items: 2.5,
            },
            1300: {
                items: 2.7,
            },
            1400: {
                items: 3,
            }
        },
    };

    const ShowReview = ({ review }) => {
        const [showMore, setShowMore] = useState(false);

        if (showMore) {
            return <div style={{
                maxHeight: "200px",
                overflow: "auto",
                paddingRight: "20px"
            }}>
                <p className="mb-0">{review}</p>
                <button onClick={() => setShowMore(false)} className="text-sm text-primary" style={{ background: "none", border: "none" }}>Show Less</button>
            </div>
        } else {
            return <>
                <p className="mb-0">{review.length > 200 ? review.slice(0, 200) + "..." : review}</p>
                {review.length > 200 &&
                    <button onClick={() => setShowMore(true)} className="text-sm text-primary" style={{
                        background: "none",
                        border: "none",
                        width: 'fit-content'
                    }}>Show More</button>}
            </>
        }
    }

    return <div style={{
        display: "flex",
        justifyContent: "center",
        width: "100%"
    }}>
        <div className={`${styles.sliderContainer}`}>

            <div className="col-md-3" style={{
                minWidth: "300px",
            }} >
                <img src="/review/Group.png" alt="rewview" style={{
                    width: "60px",
                    marginBottom: "-20px"
                }} />
                <div className="ms-4">
                    <p style={{
                        fontSize: "1.125rem"
                    }}><b>The {process.env.REACT_APP_BUSINESS_NAME} Testimonials</b></p>
                    <p className="text-sm mt-3" style={{
                        color: "#1a1a1a"
                    }}>We&apos;re overwhelmed with these messages. <br /> Now, it's your turn to share. Leave a review and tell others about your experience with {process.env.REACT_APP_BUSINESS_NAME}.</p>
                    <Link to="https://g.page/r/CV3yisfSqXwNEBM/review" rel="noopener noreferrer"
                        target="_blank">
                        <button className={`${styles.reviewBtn} text-white py-2 px-5 mt-3 mb-2`}>Write a Review</button>
                    </Link>
                </div>
            </div>

            <div className={`${styles.carousalBody}`} style={{
                position: "relative",
                overflow: "hidden",
            }}>
                <ReactOwlCarousel className={`${styles.brandSilder} brandSilder s-theme`}  {...settings}>
                    {reviews.map((review) => (
                        <div key={review.id} className={`${styles.sliderItem} p-3 rounded-md`} style={{
                            background: "#f4431b1b",
                            color: "#291845",
                            borderRadius: "5px"
                        }}>
                            <div className="d-flex justify-content-between" style={{ alignItems: "center" }}>
                                <div className="d-flex" style={{ alignItems: "center" }}>
                                    <img src={review.image} alt="rewview" style={{ width: "50px" }} />
                                    <div className="px-2">
                                        <p className="mb-0"><b>{review.name}</b></p>
                                        <p className="mb-0">{review.date}</p>
                                    </div>
                                </div>
                                <img src="/review/gimg.png" alt="rewview" style={{ maxWidth: "30px" }} />
                            </div>
                            <div className="d-flex my-2">
                                {Array(review.rating).fill(0).map((_, index) => (
                                    <p style={{
                                        margin: '2px'
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="orange" class="bi bi-star-fill" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                        </svg>
                                    </p>
                                ))}
                            </div>
                            <p className="text-sm" style={{ display: "flex", flexDirection: 'column' }}>
                                <ShowReview review={review?.review} />
                            </p>
                        </div>
                    ))}
                </ReactOwlCarousel>
            </div>
        </div>
    </div>
}