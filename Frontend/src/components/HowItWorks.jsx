const steps = [
  {
    number: "01",
    title: "Scan Shop QR or Enter Shop Code",
    description:
      "Scan the QR code displayed at your print shop or enter the unique Shop Code to securely connect your order.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4h5v5H4zM15 4h5v5h-5zM4 15h5v5H4zM16 15h4M18 13v8M13 18h1"
        />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Upload Your Documents",
    description:
      "Upload PDFs, Word documents, presentations, or images securely. Your files remain private and accessible only to the selected print shop.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 16V8m0 0l-3 3m3-3l3 3m7 5H5a2 2 0 01-2-2v-1a2 2 0 012-2h2m10 0h2a2 2 0 012 2v1a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Choose Print Preferences",
    description:
      "Select color, paper size, copies, page range, double-sided printing, binding, and other print options.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6M9 16h6M9 8h6M6 4h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
        />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Collect Your Print",
    description:
      "The print shop receives your order instantly. Visit the shop, make payment if required, and collect your documents.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 17l4 4 8-8M5 5h10v5H5zM5 10h14v7H5z"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative bg-white py-16 px-6 overflow-hidden"
    >
      {/* Background Blur */}
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100 blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1 text-sm font-semibold text-indigo-600">
            Simple Process
          </span>

          <h2 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Print in
            <span className="text-indigo-600"> Four Easy Steps</span>
          </h2>

          <p className="mt-4 text-base md:text-lg leading-7 text-gray-600">
            Upload your documents online, customize your print settings, and
            collect them when they're ready.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] border-t border-dashed border-indigo-200" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-3xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-indigo-200 hover:shadow-xl"
            >
              {/* Step Number */}
              <span className="absolute right-5 top-4 text-5xl font-black text-gray-100 transition group-hover:text-indigo-100">
                {step.number}
              </span>

              {/* Icon */}
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 text-indigo-600 transition-all duration-300 group-hover:from-indigo-600 group-hover:to-blue-600 group-hover:text-white">
                {step.icon}
              </div>

              {/* Title */}
              <h3 className="mt-5 text-lg font-bold tracking-tight text-gray-900">
                {step.title}
              </h3>

              {/* Description */}
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
