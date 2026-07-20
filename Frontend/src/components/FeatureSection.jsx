const FeatureSection = () => {
  const features = [
    {
      title: "Secure Document Sharing",
      description:
        "Upload your documents securely and share them only with the selected print shop. Your files remain private and organized.",
      image:
        "https://assets.prebuiltui.com/images/components/feature-sections/features-social-image.png",
      alt: "Secure Document Sharing",
      badge: "Secure",
      badgeColor: "bg-green-100 text-green-700",
      imageClass: "max-w-52",
    },
    {
      title: "QR Code & Print Preferences",
      description:
        "Scan a shop's QR Code or enter its Shop Code to send documents instantly. Customize paper size, color, copies, binding, and more.",
      image:
        "https://assets.prebuiltui.com/images/components/feature-sections/features-dash-img.png",
      alt: "QR Code & Print Preferences",
      badge: "Smart",
      badgeColor: "bg-blue-100 text-blue-700",
      imageClass: "max-w-52",
    },
    {
      title: "Fast Order Management",
      description:
        "Upload PDFs, Word, Excel, PowerPoint, and images. Every order includes print instructions for a quick and hassle-free experience.",
      image:
        "https://assets.prebuiltui.com/images/components/feature-sections/features-graphs-image.png",
      alt: "Order Management",
      badge: "Fast",
      badgeColor: "bg-orange-100 text-orange-700",
      imageClass: "max-w-48",
    },
  ];

  return (
    <>
      <style>
        {`
          @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap");

          *{
            font-family: "Poppins", sans-serif;
          }
        `}
      </style>

      <section id="features" className="bg-white py-16 px-5">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <button className="bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium px-5 py-2 rounded-full">
            ✨ Features
          </button>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4">
            Everything you need for seamless printing
          </h2>

          <p className="text-gray-600 text-base max-w-xl mt-3">
            Upload documents, customize print settings, and send them directly
            to your preferred print shop in just a few clicks.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div
                  className={`w-fit px-3 py-1 rounded-full text-xs font-medium ${feature.badgeColor}`}
                >
                  {feature.badge}
                </div>

                <div className="flex justify-center items-center py-5">
                  <img
                    src={feature.image}
                    alt={feature.alt}
                    className={`w-full object-contain ${feature.imageClass}`}
                  />
                </div>

                <h3 className="text-lg font-semibold text-gray-900 text-left">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-600 mt-2 leading-6 text-left">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default FeatureSection;
