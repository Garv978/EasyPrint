import Hero from "../components/hero";
import FeatureSection from "../components/FeatureSection";
import HowItWorks from "../components/HowItWorks";
import ContactUs from "../components/ContactUs";
import Footer from "../components/Footer";

export default function LandingPage() {
    return (
        <>
            <Hero></Hero>
            <HowItWorks></HowItWorks>
            <FeatureSection></FeatureSection>
            <ContactUs></ContactUs>
            <Footer></Footer>
        </>
    )
}