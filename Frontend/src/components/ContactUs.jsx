import { useState } from "react";
import { submitFeedback } from "../services/FeedbackServices";

const ContactUs = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");

    try {
      await submitFeedback(form);

      setStatus("✅ Feedback submitted successfully!");

      setForm({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (err) {
      console.error("FEEDBACK SUBMISSION ERROR:", err);
      setStatus("❌ Failed to submit feedback.");
    }
  };

  return (
    <section
      id="contact-us"
      className="bg-linear-to-b from-white to-blue-50 py-20"
    >
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Side - Heading */}
        <div className="text-center md:text-left">
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            Contact Us
          </span>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            We&apos;d Love to Hear From You
          </h2>

          <p className="mt-4 text-slate-600 text-lg max-w-md">
            Have a question, suggestion, or need assistance? Fill out the form
            and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 w-full max-w-md mx-auto md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Full Name
              </label>

              <input
                id="firstName"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your name"
                autoComplete="name"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                rows={4}
                required
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition duration-300 shadow-md hover:shadow-lg"
            >
              Submit
            </button>

            {status && (
              <p
                className="text-center text-sm text-slate-600"
                role="status"
                aria-live="polite"
              >
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
