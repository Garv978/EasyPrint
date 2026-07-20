const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>

              <div>
                <h2 className="text-white text-2xl font-bold">
                  EasyPrint
                </h2>
                <p className="text-sm text-slate-400">
                  Print Smarter, Not Harder.
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-md text-slate-400 leading-7">
              Upload documents from anywhere, choose your nearest print
              shop, customize print settings, and collect your prints
              hassle-free. No WhatsApp. No email. Just fast printing.
            </p>

            <div className="flex gap-4 mt-6">
              {[
                "facebook",
                "twitter",
                "instagram",
                "linkedin",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-900 hover:bg-blue-600 transition flex items-center justify-center"
                >
                  <i className={`ri-${item}-fill text-lg`}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              Product
            </h3>

            <ul className="space-y-3">
              {[
                "How It Works",
                "Features",
                "Pricing",
                "FAQs",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              Company
            </h3>

            <ul className="space-y-3">
              {[
                "About Us",
                "Contact",
                "Privacy Policy",
                "Terms of Service",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-slate-400">

              <div className="flex gap-3">
                <div className="mt-1">
                  📍
                </div>
                <p>
                  NIT Jalandhar,
                  <br />
                  Punjab, India
                </p>
              </div>

              <div className="flex gap-3">
                <div>✉️</div>
                <p>support@easyprint.com</p>
              </div>

              <div className="flex gap-3">
                <div>📞</div>
                <p>+91 98765 43210</p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-800"></div>

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-slate-500 text-center md:text-left">
          © {new Date().getFullYear()} EasyPrint. All rights reserved.
        </p>

        <div className="flex gap-6 text-sm">
          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            Privacy
          </a>

          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            Terms
          </a>

          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            Cookies
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;