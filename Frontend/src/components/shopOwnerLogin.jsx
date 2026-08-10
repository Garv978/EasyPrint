import { useRef, useState } from "react";
const ShopOwnerLogin = () => {
  const [step, setStep] = useState(1);

  const shopNameRef = useRef();
  const phoneNoRef = useRef();
  const BWRateRef = useRef();
  const ColoredRateRef = useRef();

  const handleContinue = async () => {
    const shopName = shopNameRef.current.value;
    const phoneNo = phoneNoRef.current.value;
    const BWRate = BWRateRef.current.value;
    const ColoredRate = ColoredRateRef.current.value;

    if (!shopName || !phoneNo || !BWRate || !ColoredRate) {
      alert("Please fill all the fields");
      return;
    }
    setStep(2);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-blue-100 px-4 py-8">
      <div className="relative max-w-md w-full bg-white/95 backdrop-blur-xl border border-blue-200 shadow-2xl rounded-3xl overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600" />
        <div className="relative px-10 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-blue-600">
                EasyPrint
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Shop Owner Login
              </h1>
            </div>
            <div className="text-right text-sm text-slate-500">
              Step {step} of 2
            </div>
          </div>

          {step === 1 && (
            <>
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700">
                  Shop Name
                </label>
                <input
                  ref={shopNameRef}
                  type="text"
                  placeholder="Enter shop name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <label className="block text-sm font-medium text-slate-700">
                  Phone Number
                </label>
                <input
                  ref={phoneNoRef}
                  type="text"
                  placeholder="Enter phone number"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <label className="block text-sm font-medium text-slate-700">
                  Black & White Rate
                </label>
                <input
                  ref={BWRateRef}
                  type="number"
                  placeholder="Enter B&W rate"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />

                <label className="block text-sm font-medium text-slate-700">
                  Colored Rate
                </label>
                <input
                  ref={ColoredRateRef}
                  type="number"
                  placeholder="Enter colored rate"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <button
                onClick={handleContinue}
                className="mt-8 w-full rounded-2xl bg-blue-600 px-5 py-3 text-white text-base font-semibold shadow-lg shadow-blue-200 transition hover:bg-blue-700"
              >
                Continue
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    Almost there
                  </p>
                  <h2 className="text-2xl font-semibold text-slate-900">
                    Create Owner Account
                  </h2>
                </div>

                <div className="rounded-3xl border border-blue-100 bg-sky-50 p-5 text-slate-700 shadow-sm">
                  <p className="text-sm">
                    Connect your account to start managing orders, rates, and
                    shop settings.
                  </p>
                </div>

                <button className="w-full rounded-2xl bg-white border border-blue-300 px-5 py-3 text-blue-700 font-semibold shadow-sm transition hover:bg-blue-50">
                  Continue with Google
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ShopOwnerLogin;
