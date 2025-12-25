import { Building2 } from "lucide-react";

const Companies = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-3xl p-10 max-w-xl w-full text-center border border-gray-100 animate-fade-in">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
          <Building2 className="w-10 h-10 text-[#7315c7]" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Companies
          <span className="text-[#7315c7]"> Directory</span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mb-6">
          Explore top companies hiring right now.
        </p>

        {/* Coming Soon Badge */}
        <div className="inline-block px-6 py-3 bg-purple-50 text-[#7315c7] font-semibold rounded-xl border border-purple-200">
          🚧 Coming Soon
        </div>

        {/* Extra info */}
        <p className="text-sm text-gray-500 mt-6">
          We’re building a curated list of companies so you can discover
          opportunities faster.
        </p>
      </div>
    </div>
  );
};

export default Companies;
