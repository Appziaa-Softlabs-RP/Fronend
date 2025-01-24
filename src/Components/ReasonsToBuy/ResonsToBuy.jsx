import siteLogo from "../../assets/images/site_logo.svg";

export default function ReasonsToBuy() {
    return (
        <div style={{ backgroundColor: "var(--PRIMARY_COLOR)", padding: "40px 20px" }}>
            <div className="container">
                <div className="text-center mb-5">
                    <h2
                        style={{
                            color: "white",
                            fontSize: "2.5rem",
                            marginBottom: "10px",
                        }}
                    >
                        4 Reasons to buy from
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <span style={{ color: "white", fontSize: "2rem" }}>★</span>
                        <img
                            src={siteLogo}
                            alt="Montbold Logo"
                            style={{ height: "80px" }}
                        />
                        <span style={{ color: "white", fontSize: "2rem" }}>★</span>
                    </div>
                </div>

                <div className="row g-4 d-flex justify-content-center">
                    {/* Trusted Products Card */}
                    <div className="col-md-5">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "15px",
                                padding: "30px",
                                height: "100%",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src="/images/trust.svg"
                                alt="Trusted Products"
                                style={{ height: "150px", marginBottom: "20px" }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.75rem",
                                    marginBottom: "15px",
                                    color: "#333",
                                }}
                            >
                                Trusted Products
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    margin: 0,
                                }}
                            >
                                Original products, just the box is open
                            </p>
                        </div>
                    </div>

                    {/* Best Pricing Card */}
                    <div className="col-md-5">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "15px",
                                padding: "30px",
                                height: "100%",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src="/images/discount.svg"
                                alt="Best Pricing"
                                style={{ height: "150px", marginBottom: "20px" }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.75rem",
                                    marginBottom: "15px",
                                    color: "#333",
                                }}
                            >
                                Best Pricing
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    margin: 0,
                                }}
                            >
                                Price lower than the online
                            </p>
                        </div>
                    </div>


                    {/* Secure Shopping Card */}
                    <div className="col-md-5">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "15px",
                                padding: "30px",
                                height: "100%",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src="/images/secure.svg"
                                alt="Secure Shopping"
                                style={{ height: "150px", marginBottom: "20px" }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.75rem",
                                    marginBottom: "15px",
                                    color: "#333",
                                }}
                            >
                                Secure Shopping
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    margin: 0,
                                }}
                            >
                                1 year warranty on large appliances
                            </p>
                        </div>
                    </div>

                    {/* Fast Delivery Card */}
                    <div className="col-md-5">
                        <div
                            style={{
                                backgroundColor: "white",
                                borderRadius: "15px",
                                padding: "30px",
                                height: "100%",
                                textAlign: "center",
                            }}
                        >
                            <img
                                src="/images/delivery-fast.svg"
                                alt="Fast Delivery"
                                style={{ height: "150px", marginBottom: "20px" }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.75rem",
                                    marginBottom: "15px",
                                    color: "#333",
                                }}
                            >
                                Fast Delivery
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    margin: 0,
                                }}
                            >
                                Delivering anywhere in India
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

