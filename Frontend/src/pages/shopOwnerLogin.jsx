import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { googleOwnerAuth } from "../services/OwnerServices";

const ShopOwnerLogin = () => {
  const [step, setStep] = useState(1);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  // Form state instead of refs
  const [formData, setFormData] = useState({
    shopName: "",
    phoneNo: "",
    BWRate: "",
    ColoredRate: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // STEP 1
  // -----------------------------
  const handleContinue = () => {
    const { shopName, phoneNo, BWRate, ColoredRate } = formData;

    if (!shopName.trim() || !phoneNo.trim() || !BWRate || !ColoredRate) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!/^[0-9]{10}$/.test(phoneNo.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (Number(BWRate) < 0 || Number(ColoredRate) < 0) {
      toast.error("Rates cannot be negative");
      return;
    }

    setStep(2);
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/");
  };

  // -----------------------------
  // GOOGLE LOGIN
  // -----------------------------
  const handleLogin = async (credentialResponse, mode = "login") => {
    try {
      toast.loading("Signing you in...", {
        id: "login",
      });

      const { shopName, phoneNo, BWRate, ColoredRate } = formData;

      const shopDetails = {
        shopName: shopName.trim(),
        phoneNo: phoneNo.trim(),
        BWRate: Number(BWRate),
        ColoredRate: Number(ColoredRate),
      };

      await googleOwnerAuth(credentialResponse.credential, shopDetails, mode);

      window.dispatchEvent(new Event("authChange"));

      toast.success("Login successful 🎉", {
        id: "login",
      });

      setIsOpen(false);
      navigate("/");
    } catch (err) {
      console.error(err);

      if (err.response?.data?.requiresShopDetails) {
        setStep(1);
        toast.dismiss("login");
        toast.error(
          "Owner not registered. Fill your shop details to register.",
        );
        return;
      }

      if (err.response?.data?.alreadyRegistered) {
        toast.error(
          "This email is already registered. Please sign in instead.",
          {
            id: "login",
          },
        );
        setStep(1);
        return;
      }

      toast.error(err.response?.data?.message || "Login failed ❌", {
        id: "login",
      });
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6 backdrop-blur-md">
      {/* MODAL */}
      <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Top gradient line */}
        <div className="h-1.5 w-full shrink-0 bg-linear-to-r from-cyan-500 via-sky-500 to-blue-600" />

        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-5 top-5 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xl font-medium text-slate-500 shadow-sm transition-all duration-200 hover:bg-red-50 hover:text-red-500 hover:shadow-md active:scale-95"
        >
          ×
        </button>

        {/* SCROLLABLE CONTENT */}
        <div className="overflow-y-auto">
          <div className="px-6 py-7 sm:px-9 sm:py-8">
            {/* HEADER */}
            <div className="mb-7 pr-12">
              <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.25em] text-blue-600">
                EasyPrint
              </p>

              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Shop Owner Login
              </h1>

              <p className="mt-1.5 text-sm text-slate-500">
                {step === 1
                  ? "Set up your shop details to get started."
                  : "Connect your Google account to finish setup."}
              </p>
            </div>

            {/* STEP INDICATOR */}
            <div className="mb-7 flex items-center">
              {/* Step 1 */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= 1
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step === 2 ? "✓" : "1"}
              </div>

              {/* Line */}
              <div className="mx-3 h-1 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full bg-blue-600 transition-all duration-500 ${
                    step === 2 ? "w-full" : "w-0"
                  }`}
                />
              </div>

              {/* Step 2 */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step === 2
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                2
              </div>
            </div>

            {/* ================================= */}
            {/* STEP 1 */}
            {/* ================================= */}

            {step === 1 && (
              <div className="space-y-5">
                {/* Shop Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Shop Name
                  </label>

                  <input
                    name="shopName"
                    type="text"
                    value={formData.shopName}
                    onChange={handleInputChange}
                    placeholder="Enter your shop name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3.5 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone Number
                  </label>

                  <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <div className="flex items-center border-r border-slate-200 px-4 text-sm font-semibold text-slate-500">
                      +91
                    </div>

                    <input
                      name="phoneNo"
                      type="tel"
                      maxLength={10}
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit number"
                      className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Rates */}
                <div className="grid grid-cols-2 gap-4">
                  {/* B&W */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      B&W Rate
                    </label>

                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <span className="flex items-center border-r border-slate-200 px-3 text-sm font-semibold text-slate-500">
                        ₹
                      </span>

                      <input
                        name="BWRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.BWRate}
                        onChange={handleInputChange}
                        placeholder="2"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Color */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Color Rate
                    </label>

                    <div className="flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 transition-all focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                      <span className="flex items-center border-r border-slate-200 px-3 text-sm font-semibold text-slate-500">
                        ₹
                      </span>

                      <input
                        name="ColoredRate"
                        type="number"
                        min="0"
                        step="0.01"
                        value={formData.ColoredRate}
                        onChange={handleInputChange}
                        placeholder="5"
                        className="w-full bg-transparent px-3 py-3.5 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Continue */}
                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-2 flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-blue-600 to-sky-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-sky-600 hover:shadow-xl active:translate-y-0"
                >
                  Continue
                  <span className="ml-2 text-lg">→</span>
                </button>

                <div className="mt-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-slate-200" />
                  <span className="text-xs text-slate-400">
                    Already registered?
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>

                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={(credentialResponse) =>
                      handleLogin(credentialResponse, "login")
                    }
                    onError={() => toast.error("Google login failed ❌")}
                    theme="outline"
                    size="large"
                    text="signin_with"
                    shape="pill"
                  />
                </div>

                <p className="text-center text-xs text-slate-400">
                  Your shop details will be securely saved with your account.
                </p>
              </div>
            )}

            {/* ================================= */}
            {/* STEP 2 */}
            {/* ================================= */}

            {step === 2 && (
              <div>
                {/* GOOGLE LOGIN CARD */}
                <div className="rounded-3xl border border-slate-200 bg-linear-to-b from-slate-50 to-white p-6">
                  {/* Google Icon */}
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-slate-100">
                    <svg width="27" height="27" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M21.35 12.27c0-.72-.06-1.41-.18-2.07H12v3.91h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.23z"
                      />

                      <path
                        fill="#34A853"
                        d="M12 21.72c2.64 0 4.86-.87 6.48-2.36l-3.14-2.45c-.87.58-1.98.92-3.34.92-2.56 0-4.73-1.73-5.51-4.05H3.25v2.53A9.79 9.79 0 0 0 12 21.72z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M6.49 13.78A5.89 5.89 0 0 1 6.18 12c0-.62.11-1.22.31-1.78V7.69H3.25A9.79 9.79 0 0 0 2.22 12c0 1.58.38 3.07 1.03 4.31l3.24-2.53z"
                      />

                      <path
                        fill="#EA4335"
                        d="M12 6.17c1.44 0 2.73.5 3.75 1.49l2.81-2.81C16.86 3.25 14.64 2.28 12 2.28a9.79 9.79 0 0 0-8.75 5.41l3.24 2.53C7.27 7.9 9.44 6.17 12 6.17z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-center text-xl font-bold text-slate-900">
                    Continue with Google
                  </h2>

                  <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-6 text-slate-500">
                    Use your Google account to securely create your EasyPrint
                    shop owner account.
                  </p>

                  {/* Google Button */}
                  <div className="mt-6 flex justify-center">
                    <GoogleLogin
                      onSuccess={(credentialResponse) =>
                        handleLogin(credentialResponse, "register")
                      }
                      onError={() => toast.error("Google login failed ❌")}
                      theme="outline"
                      size="large"
                      text="continue_with"
                      shape="pill"
                    />
                  </div>
                </div>

                {/* SHOP SUMMARY */}
                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Shop Details
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Information you entered
                      </p>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-600 shadow-sm">
                      ✓
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Shop */}
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-400">Shop</p>

                      <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                        {formData.shopName || "-"}
                      </p>
                    </div>

                    {/* Phone */}
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-400">Phone</p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        +91 {formData.phoneNo || "-"}
                      </p>
                    </div>

                    {/* B&W */}
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-400">B&W / page</p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        ₹{formData.BWRate || "0"}
                      </p>
                    </div>

                    {/* Color */}
                    <div className="rounded-xl bg-white p-3">
                      <p className="text-xs text-slate-400">Color / page</p>

                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        ₹{formData.ColoredRate || "0"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* BACK BUTTON */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="mt-5 flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                >
                  ← Back to shop details
                </button>

                {/* Terms */}
                <p className="mt-5 text-center text-xs leading-5 text-slate-400">
                  By continuing, you agree to the EasyPrint Terms &amp; Privacy
                  Policy.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerLogin;
