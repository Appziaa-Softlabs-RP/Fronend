import React, { useEffect } from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";
import { enviroment } from "../../enviroment";

export const Privacy = () => {
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    return (
        <React.Fragment>
            {windowWidth === "mobile" ? (
                <PageHeader title="Privacy" hide={true} />
            ) : (
                <Header />
            )}
            <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
                <div className="container">
                    <h1>TaraToy Privacy Policy</h1>
                    <p className="c13">
                        <span className="c6">Effective Date:</span>
                        <span className="c2">&nbsp;2024-02-29</span>
                    </p>
                    <p className="c0">
                        <span className="c1">Introduction</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            This Privacy Policy describes how TaraToy (&quot;we,&quot;
                            &quot;us,&quot; or &quot;our&quot;) collects, uses, and discloses
                            your personal information when you visit our website at taratoy.in
                            (the &quot;Site&quot;) or make purchases at our physical store
                            located at {enviroment.STORE_ADDRESS} . (the &quot;Store&quot;).
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Information We Collect</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We collect the following types of information:
                        </span>
                    </p>
                    <ul className="c4 lst-kix_ynkx6yj7mq8n-0 start">
                        <li className="c3 li-bullet-0">
                            <span className="c6">Personal Information:</span>
                            <span className="c2">
                                &nbsp;This includes information that can be used to identify
                                you, such as your name, email address, phone number, billing and
                                shipping address, and payment information.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c6">Device Information:</span>
                            <span className="c2">
                                &nbsp;This includes information about your device, such as your
                                browser type, IP address, operating system, and referring
                                website/URL.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c6">Usage Information:</span>
                            <span className="c2">
                                &nbsp;This includes information about your activity on the Site,
                                such as the pages you visit, the products you view, and the
                                searches you perform.
                            </span>
                        </li>
                    </ul>
                    <p className="c0">
                        <span className="c1">How We Collect Information</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We collect information in the following ways:
                        </span>
                    </p>
                    <ul className="c4 lst-kix_fjsz1fan1zx-0 start">
                        <li className="c3 li-bullet-0">
                            <span className="c6">
                                When you create an account or make a purchase:
                            </span>
                            <span className="c2">
                                &nbsp;We collect your personal information when you create an
                                account on the Site or make a purchase in the Store or online.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c6">When you browse the Site:</span>
                            <span className="c2">
                                &nbsp;We collect device information and usage information
                                automatically when you browse the Site.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c6">From third-party sources:</span>
                            <span className="c2">
                                &nbsp;We may collect information about you from third-party
                                sources, such as social media platforms, when you allow them to
                                share your information with us.
                            </span>
                        </li>
                    </ul>
                    <p className="c0">
                        <span className="c1">How We Use Your Information</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We use your information for the following purposes:
                        </span>
                    </p>
                    <ul className="c4 lst-kix_k4f8ptfm5jg6-0 start">
                        <li className="c3 li-bullet-0">
                            <span className="c2">
                                To fulfill your orders and provide customer service.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c2">To manage your account on the Site.</span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c2">
                                To send you marketing and promotional communications (with your
                                consent).
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c2">
                                To personalize your experience on the Site.
                            </span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c2">To improve the Site and our services.</span>
                        </li>
                        <li className="c3 li-bullet-0">
                            <span className="c2">
                                To prevent fraud and maintain the security of the Site.
                            </span>
                        </li>
                    </ul>
                    <p className="c0">
                        <span className="c1">Sharing Your Information</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We may share your information with third-party service providers
                            who help us operate the Site and provide our services. These
                            service providers are contractually obligated to keep your
                            information confidential and to use it only for the purposes for
                            which it is disclosed to them.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We may also disclose your information if we are required to do so
                            by law or if we believe that such disclosure is necessary to
                            protect the rights, property, or safety of ourselves or others.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Your Choices</span>
                    </p>
                    <p className="c0">
                        <span className="c9">
                            You can choose not to receive marketing and promotional
                            communications from us by following the unsubscribe instructions
                            in any email we send you. You can also access, update, or delete
                            your personal information by contacting us at{" "}
                        </span>
                        <span className="c1">{enviroment.EMAIL_ADDRESS}</span>
                    </p>
                    <p className="c0">
                        <span className="c1">Data Retention</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We will retain your information for as long as necessary to
                            fulfill the purposes for which it was collected, unless a longer
                            retention period is required or permitted by law.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Security</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We take reasonable steps to protect your information from
                            unauthorized access, disclosure, alteration, or destruction.
                            However, no website or internet transmission is completely secure,
                            and we cannot guarantee the security of your information.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Children&#39;s Privacy</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            Our Site is not directed to children under the age of 13. We do
                            not knowingly collect personal information from children under 13.
                            If you are a parent or guardian and you believe that your child
                            has provided us with personal information, please contact us at
                            [email protected] so we can delete the information.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Changes to this Privacy Policy</span>
                    </p>
                    <p className="c0">
                        <span className="c2">
                            We may update this Privacy Policy from time to time. We will
                            notify you of any changes by posting the new Privacy Policy on the
                            Site. You are advised to review this Privacy Policy periodically
                            for any changes.
                        </span>
                    </p>
                    <p className="c0">
                        <span className="c1">Contact Us</span>
                    </p>
                    <p className="c0">
                        <span className="c9">
                            If you have any questions about this Privacy Policy, please
                            contact us at{" "}
                        </span>
                        <span className="c15 c16">
                            <a className="c7" href={`mailto:${enviroment.EMAIL_ADDRESS}`}>
                            {enviroment.EMAIL_ADDRESS}
                            </a>
                        </span>
                        <span className="c6">&nbsp;</span>
                        <span className="c9">or by phone at </span>
                        <span className="c1">+91-99997 56468.</span>
                    </p>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
};
