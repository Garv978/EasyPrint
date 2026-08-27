import OwnerHeroSection from "../components/ownerHeroSection";
const OwnerPage = ({ owner , onLogout }) => {
  return (
    <>
      <OwnerHeroSection owner={owner} onLogout={onLogout} />
    </>
  );
};
export default OwnerPage;
