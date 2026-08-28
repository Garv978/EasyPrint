import { useCallback, useEffect, useState } from "react";
import PricingModel from "../components/PricingModel";
import CustomerCard from "../components/CustomerCard";
import {
  getPricing,
  getMyJobs,
  updatePricing,
} from "../services/OwnerServices";

import socket from "../socket";

export default function ShopOwnerDashboard({ onLogout, owner }) {
  const [customers, setCustomers] = useState([]);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pricing
  const [draftBw, setDraftBw] = useState(2);
  const [draftColor, setDraftColor] = useState(6);

  const [priceBw, setPriceBw] = useState(2);
  const [priceColor, setPriceColor] = useState(6);

  const [justSaved, setJustSaved] = useState(false);

  const isDirty = draftBw !== priceBw || draftColor !== priceColor;

  const ownerId = owner?._id;

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getMyJobs();

      console.log("GET MY JOBS RESPONSE:", response.data);

      const jobs = response.data?.jobs ?? [];

      console.log("JOBS:", jobs);

      const customerMap = {};

      jobs.forEach((job) => {
        const user = job.userId;
        const userId = user?._id;

        if (!userId) {
          console.error("❌ JOB HAS NO USER:", job);
          return;
        }

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
            chargedPages: document.chargedPages ?? 0,
            price: document.price ?? 0,

            color: job.printOptions?.color === "Color" ? "color" : "bw",

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
      console.error("STATUS:", error.response?.status);
      console.error("SERVER ERROR:", error.response?.data);

      if (error.response?.status === 401) {
        // Tell the main auth system that the session is invalid.
        window.dispatchEvent(new Event("authChange"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPricing = useCallback(async () => {
    try {
      const response = await getPricing();

      const BWRate = response.data?.pricing?.BWRate;
      const ColoredRate = response.data?.pricing?.ColoredRate;

      if (BWRate !== undefined) {
        setPriceBw(BWRate);
        setDraftBw(BWRate);
      }

      if (ColoredRate !== undefined) {
        setPriceColor(ColoredRate);
        setDraftColor(ColoredRate);
      }
    } catch (error) {
      console.error("GET PRICING ERROR:", error);
      console.error("SERVER ERROR:", error.response?.data);
    }
  }, []);

  // Load dashboard only after owner is available
  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    const loadDashboard = async () => {
      await fetchJobs();
      await fetchPricing();
    };

    loadDashboard();
  }, [ownerId, fetchJobs, fetchPricing]);

  // Join the shop's Socket.IO room
  useEffect(() => {
    if (!ownerId) return;

    const handleNewJob = () => {
      fetchJobs();
    };

    socket.on("new-job", handleNewJob);

    socket.emit("join-shop", ownerId);

    return () => {
      socket.off("new-job", handleNewJob);
    };
  }, [ownerId, fetchJobs]);

  const handleSave = async () => {
    try {
      await updatePricing(draftBw, draftColor);

      setPriceBw(draftBw);
      setPriceColor(draftColor);

      setJustSaved(true);

      setTimeout(() => {
        setJustSaved(false);
      }, 2000);
    } catch (error) {
      console.error("UPDATE PRICING ERROR:", error);
      console.error("SERVER ERROR:", error.response?.data);
    }
  };

  const toggleExpand = (customerId) => {
    setExpandedCustomer(expandedCustomer === customerId ? null : customerId);
  };

  const deleteCustomer = (customerId) => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerId),
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
              const isOpen = expandedCustomer === customer.id;

              return (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
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
