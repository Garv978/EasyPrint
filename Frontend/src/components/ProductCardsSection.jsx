import { ArrowRight, FileText, Image as ImageIcon } from "lucide-react";

export default function ProductCardsSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="relative bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <FileText size={18} className="text-emerald-700" />
          <h4 className="font-semibold text-gray-900">Blank A4 Sheet</h4>
        </div>
        <ul className="text-sm text-gray-500 space-y-1 mb-6">
          <li>• 80 GSM Paper</li>
          <li>• White Paper</li>
        </ul>
        <button className="inline-flex items-center gap-1 text-emerald-600 font-medium text-sm bg-emerald-50 px-4 py-2 rounded-full hover:bg-emerald-100 transition-colors">
          Get now <ArrowRight size={14} />
        </button>

        <div className="absolute bottom-3 right-3 w-16 h-16 flex items-center justify-center">
          <div className="w-12 h-16 bg-emerald-50 border border-emerald-200 rounded-sm rotate-6 absolute" />
          <div className="w-12 h-16 bg-white border border-emerald-200 rounded-sm flex items-center justify-center text-emerald-300 font-bold text-xs relative">
            A4
          </div>
        </div>
      </div>

      <div className="relative bg-emerald-50/40 rounded-2xl border border-emerald-100 shadow-sm p-6 overflow-hidden opacity-70">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={18} className="text-emerald-300" />
          <h4 className="font-semibold text-emerald-300">Photo</h4>
        </div>
        <ul className="text-sm text-emerald-300 space-y-1 mb-6">
          <li>• High Quality Print</li>
          <li>• Glossy Paper</li>
        </ul>
        <button
          disabled
          className="text-sm font-medium bg-emerald-100 text-emerald-300 px-4 py-2 rounded-full cursor-not-allowed"
        >
          Coming soon
        </button>

        <div className="absolute bottom-3 right-3 w-16 h-16 flex items-center justify-center">
          <div className="w-14 h-14 bg-white border border-emerald-200 rounded-md rotate-6 absolute" />
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-center text-emerald-200 relative">
            <ImageIcon size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
