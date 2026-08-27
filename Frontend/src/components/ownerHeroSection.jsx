import { useNavigate } from "react-router-dom";

function OwnerHero({ owner, onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 lg:px-20 py-4 bg-white border-b border-slate-200">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            EP
          </div>

          <div>
            <h1 className="font-bold text-xl text-indigo-700">
              EasyPrint
            </h1>

            <p className="text-xs text-slate-400">
              {owner.name}
            </p>
          </div>
        </div>

        {/* NAVIGATION */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          {/* <button
            onClick={() => navigate("/owner/dashboard")}
            className="hover:text-indigo-600 transition"
          >
            Dashboard
          </button> */}

          {/* <button
            onClick={() => navigate("/owner/orders")}
            className="hover:text-indigo-600 transition"
          >
            Orders
          </button> */}

          {/* <button
            onClick={() => navigate("/owner/qr")}
            className="hover:text-indigo-600 transition"
          >
            QR Code
          </button> */}

          {/* <button
            onClick={() => navigate("/owner/profile")}
            className="hover:text-indigo-600 transition"
          >
            Shop Profile
          </button> */}

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => navigate("/owner/dashboard")}
            className="hidden md:block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition"
          >
            Dashboard
          </button>

          <button
            onClick={onLogout}
            className="hidden md:block px-5 py-2 border border-slate-300 hover:bg-slate-100 rounded-full transition"
          >
            Logout
          </button>

        </div>

      </nav>


      {/* HERO */}
      <section className="relative overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.12),_transparent_40%)]" />

        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[650px] py-20">

            {/* LEFT */}
            <div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-6">

                <span className="h-2 w-2 rounded-full bg-green-500" />

                Shop is active

              </div>


              <h1 className="text-5xl md:text-6xl font-bold leading-tight tracking-tight">

                Manage Your
                <span className="text-indigo-600">
                  {" "}Print Shop
                </span>
                {" "}Smarter

              </h1>


              <p className="mt-6 text-lg leading-8 text-slate-500 max-w-xl">

                Receive print orders digitally, manage customer requests,
                track your orders, and get everything ready for printing
                from one simple dashboard.

              </p>


              {/* BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-8">

                <button
                  onClick={() => navigate("/owner/dashboard")}
                  className="px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition active:scale-95"
                >
                  Open Dashboard
                </button>


                <button
                  onClick={() => navigate("/owner/qr")}
                  className="px-7 py-3.5 bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 rounded-xl font-medium transition active:scale-95"
                >
                  View Shop QR
                </button>

              </div>


              {/* SHOP INFO */}
              <div className="flex flex-wrap gap-8 mt-12">

                <div>
                  <p className="text-sm text-slate-400">
                    Shop Code
                  </p>

                  <p className="mt-1 font-bold tracking-widest text-lg">
                    {owner?.shopCode || "--------"}
                  </p>
                </div>


                <div className="h-10 w-px bg-slate-200 hidden sm:block" />


                <div>
                  <p className="text-sm text-slate-400">
                    Shop Status
                  </p>

                  <p className="mt-1 font-semibold text-green-600">
                    ● Open
                  </p>
                </div>

              </div>

            </div>


            {/* RIGHT */}
            <div className="relative">

              {/* Glow */}
              <div className="absolute -inset-10 bg-indigo-400/20 blur-3xl rounded-full" />


              {/* Dashboard Preview */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 p-6">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-sm text-slate-400">
                      Overview
                    </p>

                    <h2 className="text-2xl font-bold">
                      Today's Activity
                    </h2>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    📊
                  </div>

                </div>


                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">

                  <div className="p-5 rounded-2xl bg-indigo-50">
                    <p className="text-sm text-slate-500">
                      Today's Orders
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      24
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      +12% from yesterday
                    </p>
                  </div>


                  <div className="p-5 rounded-2xl bg-orange-50">
                    <p className="text-sm text-slate-500">
                      Pending
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      7
                    </p>

                    <p className="text-xs text-orange-600 mt-1">
                      Needs attention
                    </p>
                  </div>


                  <div className="p-5 rounded-2xl bg-green-50">
                    <p className="text-sm text-slate-500">
                      Completed
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      17
                    </p>

                    <p className="text-xs text-green-600 mt-1">
                      Orders completed
                    </p>
                  </div>


                  <div className="p-5 rounded-2xl bg-purple-50">
                    <p className="text-sm text-slate-500">
                      Earnings
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      ₹1,840
                    </p>

                    <p className="text-xs text-purple-600 mt-1">
                      Today's revenue
                    </p>
                  </div>

                </div>


                {/* Recent order */}
                <div className="mt-6">

                  <div className="flex justify-between items-center mb-3">

                    <h3 className="font-semibold">
                      Recent Orders
                    </h3>

                    <button
                      onClick={() => navigate("/owner/orders")}
                      className="text-sm text-indigo-600"
                    >
                      View all
                    </button>

                  </div>


                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100">

                    <div>
                      <p className="font-medium">
                        Order #EP1024
                      </p>

                      <p className="text-xs text-slate-400">
                        12 pages • Black & White
                      </p>
                    </div>

                    <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs">
                      Pending
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default OwnerHero;