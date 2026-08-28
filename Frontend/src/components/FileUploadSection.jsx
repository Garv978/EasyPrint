import { Upload } from "lucide-react";

export default function FileUploadSection({
  files,
  uploadedFiles,
  isUploading,
  onFileChange,
  onRemoveFile,
  onUpload,
}) {
  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-8">
      <h2 className="text-xl font-semibold text-gray-900">Ready to Print?</h2>
      <p className="text-gray-400 mt-1 mb-6">
        Print PDFs, images, certificates, resumes, assignments, and
        more.
      </p>

      <input
        type="file"
        id="file-upload"
        className="hidden"
        multiple
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onFileChange}
      />

      <label
        htmlFor="file-upload"
        className="w-full border-2 border-dashed border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors rounded-xl py-5 flex items-center justify-center gap-2 text-emerald-600 font-semibold cursor-pointer"
      >
        <Upload size={18} />
        Upload File
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-600">Selected Files:</p>

          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 text-sm text-gray-700"
            >
              <div className="flex flex-col truncate">
                <span className="truncate max-w-62.5">{file.name}</span>
                <span className="text-gray-400 text-xs">
                  {(file.size / 1024).toFixed(2)} KB
                </span>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                disabled={isUploading}
                className="ml-3 text-red-500 hover:text-red-700 font-semibold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-sm font-semibold text-emerald-600">
            Uploaded Successfully:
          </p>

          {uploadedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm"
            >
              <span className="truncate max-w-62.5 text-gray-700">
                {file.name || file}
              </span>
              <span className="text-emerald-600 font-semibold">✓ Uploaded</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onUpload}
        disabled={isUploading}
        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 transition-colors rounded-xl py-3 text-white font-semibold"
      >
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      <p className="text-center text-gray-400 text-sm mt-4">
        Supported Formats: PDF, JPG, PNG
      </p>
    </div>
  );
}
