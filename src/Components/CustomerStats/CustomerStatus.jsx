import { Package, Users } from "lucide-react"

export default function CustomerStats() {
    return (
        <div
            style={{
                padding: "60px 20px",
                backgroundColor: "white",
            }}
        >
            <div className="container">
                <div className="text-center mb-4">
                    <h2
                        style={{
                            fontSize: "2.5rem",
                            marginBottom: "20px",
                            color: "#1a1a1a",
                            fontWeight: "bolder"
                        }}
                    >
                        Over <span style={{ color: "var(--PRIMARY_COLOR)" }}>15,375+</span> happy customers
                    </h2>
                    <p
                        style={{
                            fontSize: "1.25rem",
                            color: "#666",
                            maxWidth: "900px",
                            margin: "0 auto",
                        }}
                    >
                        Join thousands of satisfied customers who trust Uttaranchal Trading for open box and, neverused items.
                    </p>
                </div>

                <div className="row g-4 justify-content-center">
                    {/* Products Delivered Stats */}
                    <div className="col-md-6">
                        <div
                            style={{
                                textAlign: "center",
                                padding: "10px",
                            }}
                        >
                            <Package
                                size={48}
                                style={{
                                    color: "var(--PRIMARY_COLOR)",
                                    marginBottom: "20px",
                                }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.5rem",
                                    marginBottom: "15px",
                                    fontWeight: "bolder"
                                }}
                            >
                                <span style={{ color: "var(--PRIMARY_COLOR)" }}>3 lakh+</span> products delivered
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    fontSize: "1.1rem",
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                }}
                            >
                                We've shipped over 3 lakh products with care and precision to happy customers across India.
                            </p>
                        </div>
                    </div>

                    {/* Loyal Customers Stats */}
                    <div className="col-md-6">
                        <div
                            style={{
                                textAlign: "center",
                                padding: "10px",
                            }}
                        >
                            <Users
                                size={48}
                                style={{
                                    color: "var(--PRIMARY_COLOR)",
                                    marginBottom: "20px",
                                }}
                            />
                            <h3
                                style={{
                                    fontSize: "1.5rem",
                                    marginBottom: "15px",
                                    fontWeight: "bolder"
                                }}
                            >
                                <span style={{ color: "var(--PRIMARY_COLOR)" }}>15K+</span> loyal customers
                            </h3>
                            <p
                                style={{
                                    color: "#666",
                                    fontSize: "1.1rem",
                                    maxWidth: "700px",
                                    margin: "0 auto",
                                }}
                            >
                                Our community of over 15 thousand loyal customers inspires us to keep innovating and delivering excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

