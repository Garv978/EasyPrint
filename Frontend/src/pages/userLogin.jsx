import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../api";

function GoogleAuth() {
  const navigate = useNavigate();

  const handleLogin = async (credentialResponse) => {
    try {
      console.log("requested reached")
      toast.loading("Signing you in...", { id: "login" });
      await API.post("/user/auth/google", {
        token: credentialResponse.credential,
      });
      console.log("requested not found reached")
      window.dispatchEvent(new Event("authChange"));

      toast.success("Login successful 🎉", { id: "login" });
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌", {
        id: "login",
      });
    }
  };

  return (
    <>
      {/* BACKDROP BLUR */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"></div>

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-700 rounded-2xl shadow-2xl p-12 text-center relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/")}
            className="absolute top-4 right-4 !text-white hover:text-green-400 text-xl transition-colors"
          >
            ✕
          </button>

          {/* Title */}
          <h1 className="text-4xl font-bold text-green-500 mb-3">
            Welcome Back
          </h1>

          <p className="text-gray-300 mb-10">
            Sign in to continue your test journey
          </p>

          {/* Google Login */}
          <div className="flex justify-center my-8">
            <GoogleLogin
              onSuccess={handleLogin}
              onError={() =>
                toast.error("Google login failed", { id: "login" })
              }
            />
          </div>

          <p className="text-xs text-gray-400 mt-10">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </>
  );
}

export default GoogleAuth;
