import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles
import React, { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import ApiService from "../../services/ApiService";

export default function ShowReviews({ product_id, total_rating = null }) {
    const [userReviews, setUserReviews] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const getReviews = useCallback(() => {
        const payload = {
            product_id: product_id,
            limit: 1000
        };
        ApiService.getReviews(payload)
            .then((res) => setUserReviews(res?.data || []))
            .catch((err) => console.error(err));
    }, [product_id]);


    useEffect(() => {
        getReviews();
    }, [getReviews]);

    // Open/close modal
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    if (!total_rating) {
        return null;
    }

    return (
        <div className="">
            <div className='d-flex flex-row align-items-center'>
                <div className="d-flex justify-content-center align-items-center gap-1">
                    {Array.from({ length: total_rating }).map((star) => (
                        <svg
                            key={star}
                            style={{
                                cursor: "pointer",
                                fill: "#ffc107",
                            }}
                            width="15"
                            height="15"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                        </svg>
                    ))}
                    <span>{total_rating}</span>
                </div>

                <div className="text-center">
                    <button className='btn btn-link btn-sm text-dark' onClick={handleShow}>
                        {userReviews.length} Reviews
                    </button>
                </div>
            </div>
            {/* Reviews Modal */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Customer Reviews</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {userReviews.length ? (
                        userReviews.map((review) => (
                            <div key={review.id} className="card mb-2">
                                <div className="card-body">
                                    <div style={{ fontWeight: "bold" }}>Rating: {review.rating}/5</div>
                                    <p>{review.review}</p>
                                    <small className="text-muted">
                                        {new Date(review.created_at).toLocaleDateString()}
                                    </small>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-muted">No reviews yet.</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}