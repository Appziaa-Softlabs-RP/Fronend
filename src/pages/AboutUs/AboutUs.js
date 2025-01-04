import React from "react";
import { Footer } from "../../Components/Footer/Footer";
import { Header } from "../../Components/Header/Header";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { useApp } from "../../context/AppContextProvider";

export const AboutUs = () => {
    const appData = useApp();
    let windowWidth = appData.appData.windowWidth;
    return (
        <React.Fragment>
            {windowWidth === "mobile" ? (
                <PageHeader title="About Us" hide={true} />
            ) : ( 
                <Header />
            )}
            <div className="min-vh-100 col-12 d-inline-flex flex-column my-5">
                <div className="container">
                    <h1>About Us</h1>
                    <p className="c6"><span className="c1">About DailyEssentials &ndash; Your Premium Toy Destination</span></p><p className="c6"><span className="c4">DailyEssentials is where the joy of childhood comes alive. We&#39;re a premium toy store dedicated to bringing the world&#39;s best playthings to your doorstep. Whether you&#39;re searching for a classic wooden puzzle, the latest tech-powered robot, or a beloved character from your favorite story, you&#39;ll find it at DailyEssentials.</span></p><p className="c6"><span className="c1">The DailyEssentials Difference</span></p><ul className="c10 lst-kix_ck63bwdhsg7q-0 start"><li className="c0 li-bullet-0"><span className="c2">Curated Collection:</span><span className="c4">&nbsp;We carefully handpick toys from around the world and India, ensuring a mix of both internationally renowned brands and exceptional local craftsmanship.</span></li><li className="c0 li-bullet-0"><span className="c2">Premium Experience:</span><span className="c4">&nbsp;From the moment you explore our website to the day your little one unwraps their new treasure, we strive to provide a delightful and seamless shopping experience.</span></li><li className="c0 li-bullet-0"><span className="c2">Passion for Play:</span><span className="c4">&nbsp;Our founder, Varun Behl, is a toy enthusiast at heart. His dynamic vision drives DailyEssentials&#39;s mission to make us the preferred destination for all things toys in India.</span></li></ul><p className="c6"><span className="c1">Discover the Wonders of Play</span></p><p className="c6"><span className="c4">Come explore the endless possibilities of imagination and creativity at DailyEssentials.</span></p><p className="c6"><span className="c1">Let us help you find the perfect toy that will spark joy and wonder in your child&#39;s life!</span></p>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    )
}