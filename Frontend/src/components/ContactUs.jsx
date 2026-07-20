import { submitFeedback } from "../services/FeedbackServices";
import { useState } from "react";

const ContactUs = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      console.error(err);
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
            We'd Love to Hear From You
          </h2>

          <p className="mt-4 text-slate-600 text-lg max-w-md">
            Have a question, suggestion, or need assistance? Fill out the form
            and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 md:p-8 w-full max-w-md mx-auto md:mx-0">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Message
              </label>
              <textarea
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message here..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none resize-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition"
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 transition duration-300 shadow-md hover:shadow-lg"
            >
              Submit
            </button>

            {status && (
              <p className="text-center text-sm text-slate-600">
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