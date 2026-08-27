import React, { useEffect, useState } from "react";
import PricingModel from "../components/PricingModel";
import CustomerCard from "../components/CustomerCard";
import { getMyJobs } from "../services/OwnerServices";

export default function ShopOwnerDashboard({ onLogout }) {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pricing
  const [draftBw, setDraftBw] = useState(2);
  const [draftColor, setDraftColor] = useState(8);

  const [priceBw, setPriceBw] = useState(2);
  const [priceColor, setPriceColor] = useState(8);

  const [justSaved, setJustSaved] = useState(false);

  const isDirty =
    draftBw !== priceBw ||
    draftColor !== priceColor;

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await getMyJobs();
      const jobs = response.data?.jobs ?? [];

      const customerMap = {};

      jobs.forEach((job) => {
        const user = job.userId;

        const userId = user?._id;

        if (!userId) return;

        if (!customerMap[userId]) {
          customerMap[userId] = {
            id: userId,
            name: user.name || "Unknown Customer",
            documents: [],
          };
        }

        (job.documents ?? []).forEach((document) => {
          customerMap[userId].documents.push({
            id: `${job._id}-${document._id}`,
            fileName: document.fileName,
            pages: document.pages ?? 0,

            color:
              job.printOptions?.color === "Color"
                ? "color"
                : "bw",

            copies: job.printOptions?.copies ?? 1,

            layout:
              job.printOptions?.layout === "Landscape"
                ? "landscape"
                : "portrait",

            range:
              job.printOptions?.pageSelection === "Custom"
                ? job.printOptions?.customPages
                : "All",

            status: job.status,
            totalPrice: job.totalPrice,
            fileUrl: document.fileUrl,
          });
        });
      });

      setCustomers(Object.values(customerMap));
    } catch (error) {
      console.error("GET JOBS ERROR:", error);
      console.error("SERVER ERROR:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  
  const handleSave = () => {
    setPriceBw(draftBw);
    setPriceColor(draftColor);

    setJustSaved(true);

    setTimeout(() => {
      setJustSaved(false);
    }, 2000);
  };

  const docPrice = (doc) => {
    const rate =
      doc.color === "color"
        ? priceColor
        : priceBw;

    return (
      doc.pages *
      doc.copies *
      rate
    );
  };

  const toggleExpand = (customerId) => {
    setExpandedCustomer(
      expandedCustomer === customerId
        ? null
        : customerId
    );
  };

  const deleteCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter(
        (customer) => customer.id !== customerId
      )
    );

    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/50 p-6">
      <div className="max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Print Orders Dashboard
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              All documents submitted by your customers.
            </p>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="shrink-0 rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Pricing */}
        <PricingModel
          draftBw={draftBw}
          setDraftBw={setDraftBw}
          draftColor={draftColor}
          setDraftColor={setDraftColor}
          priceBw={priceBw}
          priceColor={priceColor}
          justSaved={justSaved}
          onSave={handleSave}
          isDirty={isDirty}
        />

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-10 text-center text-gray-400">
            Loading orders...
          </div>
        )}

        {/* Customers */}
        {!loading && (
          <div className="space-y-3">

            {customers.length === 0 && (
              <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-10 text-center text-gray-400 text-sm">
                No orders yet.
              </div>
            )}

            {customers.map((customer) => {
              const isOpen =
                expandedCustomer === customer.id;

              return (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  docPrice={docPrice}
                  isOpen={isOpen}
                  toggleExpand={toggleExpand}
                  deleteCustomer={deleteCustomer}
                />
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}