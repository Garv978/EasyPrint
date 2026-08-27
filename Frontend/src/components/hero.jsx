import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "../assets/img1.png";
import logo from "../assets/logo.png";
import QRScanner from "./QRscanner";
import GoogleAuth from "../pages/userLogin";
import API from "../api";
import toast from "react-hot-toast";

function Hero({ loggedIn, onLogout }) {
  const [shopCode, setshopCode] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const menuRef = useRef(null);
  const isProcessingQR = useRef(false);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeNavbar = () => {
    setIsMenuOpen(false);
  };

  const handleCode = async (shopCode) => {
    try {
      const response = await API.get("/checkShop", {
        params: {
          shopCode: shopCode,
        },
      });

      if (!response.data.success) {
        toast.error("No shop found");
        return;
      }

      navigate(`/user/${shopCode}`);
    } catch (error) {
      toast.error("Something went very wrong");
    }
  };

  // Apply classes based on menu state
  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        menuRef.current.classList.remove("max-md:-left-full");
        menuRef.current.classList.add("max-md:left-0");
      } else {
        menuRef.current.classList.remove("max-md:left-0");
        menuRef.current.classList.add("max-md:-left-full");
      }
    }
  }, [isMenuOpen]);

  return (
    <>
      <style>
        {`
                    @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

                    * {
                        font-family: 'Poppins', sans-serif;
                    }
                `}
      </style>
      <section className="relative flex flex-col items-center text-slate-800 md:px-16 lg:px-24 xl:px-32 text-sm pb-16 bg-[url(https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/dot-pattern-redical.svg)] bg-center bg-cover">
        <nav className="flex items-center justify-between p-4 border-b border-white/25 w-full">
          <div className="flex items-center gap-3">
            <img
              className="h-20 w-auto rounded-lg"
              src={logo}
              alt="EasyPrint logo"
            />
            <h1 className="text-blue-700 font-bold text-3xl">EasyPrint</h1>
          </div>
          <ul
            ref={menuRef}
            className="max-md:absolute max-md:h-full max-md:z-50 max-md:w-full max-md:top-0 max-md:-left-full transition-all duration-300 max-md:backdrop-blur max-md:bg-white/70 max-md:text-base flex flex-col md:flex-row items-center justify-center gap-8 font-medium"
          >
            <li onClick={closeNavbar} className="hover:text-slate-500">
              <a href="#how-it-works">How it works</a>
            </li>
            <li onClick={closeNavbar} className="hover:text-slate-500">
              <a href="#features">Features</a>
            </li>
            <li onClick={closeNavbar} className="hover:text-slate-500">
              <a href="#">Pricing</a>
            </li>
            <li onClick={closeNavbar} className="hover:text-slate-500">
              <a href="#contact-us">Contact Us</a>
            </li>

            {loggedIn ? (
              <li className="md:hidden">
                <button
                  onClick={() => {
                    closeNavbar();
                    onLogout();
                  }}
                  className="w-full rounded-md bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="md:hidden w-full">
                  <button
                    onClick={() => {
                      closeNavbar();
                      navigate("/user/auth/google");
                    }}
                    className="w-full rounded-md bg-indigo-600 px-6 py-3 text-white transition hover:bg-indigo-700"
                  >
                    Login as User
                  </button>
                </li>
                <li className="md:hidden w-full">
                  <button
                    onClick={() => {
                      closeNavbar();
                      navigate("/owner/auth/google");
                    }}
                    className="w-full rounded-md border border-indigo-600 px-6 py-3 text-indigo-700 transition hover:bg-indigo-50"
                  >
                    Login as Owner
                  </button>
                </li>
              </>
            )}

            <button
              onClick={closeNavbar}
              className="md:hidden bg-gray-800 hover:bg-black text-white p-2 rounded-md aspect-square font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </ul>

          <button onClick={toggleMenu} className="md:hidden">
            <svg
              className="size-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* <button className="max-md:hidden px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-full">
            Login
          </button> */}

          {loggedIn ? (
            <button
              onClick={onLogout}
              className="max-md:hidden px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-full"
            >
              Logout
            </button>
          ) : (
            <div className="relative group max-md:hidden">
              <button className="px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-700 transition rounded-full">
                Login
              </button>

              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <button
                  onClick={() => navigate("/user/auth/google")}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 rounded-lg"
                >
                  Login as User
                </button>

                <button
                  onClick={() => navigate("/owner/auth/google")}
                  className="w-full px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 rounded-lg"
                >
                  Login as Owner
                </button>
              </div>
            </div>
          )}
        </nav>

        <div className="flex md:ml-14 flex-col lg:flex-row items-center justify-between gap-20 w-full mt-24">
          <div className="max-md:px-4 lg:w-1/2">
            <h1 className="text-5xl md:text-[54px] md:leading-[4.7rem] font-semibold max-w-lg bg-linear-to-r from-black to-slate-600 bg-clip-text text-transparent">
              Print Documents the Smarter Way
            </h1>
            <p className="text-sm/7 max-w-md mt-3 text-slate-500">
              No WhatsApp. No emails. No hassle. Just upload your files, choose
              your print preferences, and we'll take care of the rest.
            </p>
            <div className="flex items-center text-sm border border-slate-300 rounded-md h-13.5 max-w-md focus-within:border-indigo-600 mt-6">
              <input
                type="email"
                placeholder="Enter the code"
                className="rounded-md h-full px-4 w-full outline-none"
                onChange={(e) => setshopCode(e.target.value)}
              />
              <button
                onClick={() => handleCode(shopCode)}
                className="px-8 h-11.5 mr-1 flex items-center justify-center text-white rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
              >
                Start
              </button>
            </div>
            <button
              onClick={() => setIsScannerOpen(true)}
              className="px-8 h-11.5 mr-1 mt-6 w-full max-w-md flex items-center justify-center text-white rounded-md bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Scan QR
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-0 z-[-1] rounded-lg bg-linear-to-r from-[#661FFF] via-[#FF1994] to-[#2D73FF] blur-2xl opacity-50"></div>
            <img
              className="max-w-md w-full max-h-140 rounded-[40px] max-md:px-3 md:mr-10"
              src={heroImg}
              alt="Print preview"
            />
            <QRScanner
              isOpen={isScannerOpen}
              onClose={() => setIsScannerOpen(false)}
              onScanSuccess={async (shopCode) => {
                if (isProcessingQR.current) return;

                isProcessingQR.current = true;

                setIsScannerOpen(false);

                await handleCode(shopCode);

                isProcessingQR.current = false;
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
