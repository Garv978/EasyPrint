import Hero from "../components/hero";
import FeatureSection from "../components/FeatureSection";
import HowItWorks from "../components/HowItWorks";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

export default function LandingPage({loggedIn, onLogout}) {
    return (
        <>
            <Hero loggedIn={loggedIn} onLogout={onLogout}></Hero>
            <HowItWorks></HowItWorks>
            <FeatureSection></FeatureSection>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </>
    )
}