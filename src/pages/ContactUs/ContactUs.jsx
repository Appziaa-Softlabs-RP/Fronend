import React, { useState } from 'react'
import { getContactUsAdminEmailTemplate, getContactUsUserEmailTemplate } from '../../assets/email-templates/contact-us'
import SupportImage from "../../assets/images/support.jpg"
import { Footer } from '../../Components/Footer/Footer'
import { Header } from '../../Components/Header/Header'
import { PageHeader } from '../../Components/PageHeader/PageHeader'
import { EmailIcon, LocationIcon, PhoneIcon, ServiceIcon } from '../../Components/siteIcons'
import { enviroment } from "../../enviroment"
import ApiService from '../../services/ApiService'
import { AppNotification } from '../../utils/helper'

export default function ContactUsPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSent, setIsSent] = useState(false)


    const handleSubmit = (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const payload = {
                'subjectUser': `Thank You for Contacting ${enviroment.BUSINESS_NAME}! 🎨`,
                'subjectAdmin': `New Contact Form Submission on ${enviroment.BUSINESS_NAME} Website`,
                'userEmail': email,
                'phone': phone,
                'adminEmail': enviroment.EMAIL_ADDRESS,
                'adminHtmlTemplate': getContactUsAdminEmailTemplate({ name, email, phone, message }),
                'userHtmlTemplate': getContactUsUserEmailTemplate({ name }),
            };
            ApiService.sendContactUsEmail(payload)
                .then((res) => {
                    if (res.message === "Otp send successfully.") {
                        AppNotification(
                            "Sucess",
                            "Mail Sent Successfully.",
                            "success"
                        );
                    }
                })
            AppNotification("Success", "Thank you for contacting us. We will get back to you soon.", "success");
            setIsSent(true)
            setName('')
            setEmail('')
            setPhone('')
            setMessage('')
                .catch((err) => {
                    setIsSent(false)
                    AppNotification("Error", "Failed to send mail", "danger");
                }).finally(() => {
                    setLoading(false)
                });
        } catch (err) {
            console.log(err)
        }
    };

    return (
        <div className="bg-white">
            <div className='hideInDesktop w-100'>
                <PageHeader title="Contact Us" hide={true} />
            </div>
            <div className='hideInMobile'>
                <Header />
            </div>
            <div className="mt-5 mx-2 mx-auto"
                style={{
                    maxWidth: '900px',
                }}
            >
                <div className="row rounded p-4">
                    <div className="col-md-6">
                        <h2 className="mb-4">Contact Us</h2>
                        <form onSubmit={handleSubmit} className="p-4">
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phone" className="form-label">Phone</label>
                                <input
                                    type="tel"
                                    className="form-control"
                                    id="phone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="message" className="form-label">Message</label>
                                <textarea
                                    className="form-control"
                                    id="message"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <button type="submit"
                                disabled={loading || isSent}
                                className="btn saveAddrsBtn primaryColor text-white">Submit</button>
                        </form>
                    </div>
                    <div className="col-md-6 d-flex align-items-center justify-content-center">
                        <img
                            src={SupportImage}
                            alt="Contact Us"
                            className="img-fluid rounded "
                            style={{
                                blendMode: 'multiply',
                            }}
                        />
                    </div>
                </div>

                <div className="mt-5 p-4 bg-light rounded">
                    <div className="row" style={{
                        display: "flex",
                        justifyContent: "center",
                        height: "100%",
                        width: "100%",
                    }}>
                        <div className="col-md-3 mb-3 mb-md-0 text-center"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gridTemplateRows: "50px 1fr",
                                justifyContent: "center",
                            }}
                        >
                            <div className="mx-auto" style={{
                                height: '40px',
                                width: '40px',
                            }}>
                                <LocationIcon className="m-2" />
                            </div>
                            <p style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}><strong>Address:</strong> <span>{enviroment.STORE_ADDRESS}</span></p>
                        </div>
                        <div className="col-md-3 mb-3 mb-md-0 text-center"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gridTemplateRows: "50px 1fr",
                                justifyContent: "center",
                            }}
                        >
                            <div className="mx-auto" style={{
                                height: '40px',
                                width: '40px',
                            }}>
                                <EmailIcon className="m-2" />
                            </div>
                            <p><strong>Email:</strong> <a href={`mailto:${enviroment.EMAIL_ADDRESS}`} style={{
                                textDecoration: 'none',
                                color: 'inherit'
                            }}>{enviroment.EMAIL_ADDRESS}</a>
                            </p>
                        </div>
                        {
                            enviroment.GST_NUMBER ?
                                <div className="col-md-3 mb-3 mb-md-0 text-center"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "1fr",
                                        gridTemplateRows: "50px 1fr",
                                        justifyContent: "center",
                                    }}
                                >
                                    <div className="mx-auto" style={{
                                        height: '40px',
                                        width: '40px',
                                    }}>
                                        <ServiceIcon className="m-2" />
                                    </div>
                                    <p><strong>GST Number:</strong> {enviroment.GST_NUMBER}</p>
                                </div>
                                : null}
                        <div className="col-md-3 mb-3 mb-md-0 text-center"
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr",
                                gridTemplateRows: "50px 1fr",
                                justifyContent: "center",
                            }}
                        >
                            <div className="mx-auto" style={{
                                height: '40px',
                                width: '40px',
                            }}>
                                <PhoneIcon className="m-2" />
                            </div>
                            <p style={{
                                display: 'flex',
                                flexDirection: 'column',
                            }}><strong>Phone Number:</strong> <a href={`tel:${enviroment.PHONE_NUMBER}`}
                                style={{
                                    textDecoration: 'none',
                                    color: 'inherit'
                                }}>{enviroment.PHONE_NUMBER}</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}