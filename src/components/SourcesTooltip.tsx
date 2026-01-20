import React, { useState } from "react";

interface SourcesTooltipProps {
  groundingMetadata?: any;
}

export const SourcesTooltip: React.FC<SourcesTooltipProps> = ({ groundingMetadata }) => {
  const [showModal, setShowModal] = useState(false);

  if (!groundingMetadata || !groundingMetadata.groundingChunks) {
    return null;
  }

  const chunks = groundingMetadata.groundingChunks || [];

  return (
    <>
      <button
        className="inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-indigo-500 rounded-full hover:bg-indigo-600 transition cursor-help"
        onClick={() => setShowModal(true)}
        title="Ver fuentes consultadas"
      >
        i
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-xl font-bold text-gray-900">Fuentes Consultadas</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {chunks.map((chunk: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4 py-3 bg-gray-50 rounded">
                  {chunk.retrievedContext?.title && (
                    <div className="font-semibold text-indigo-700 text-sm mb-2">
                      📄 {chunk.retrievedContext.title}
                    </div>
                  )}
                  {chunk.retrievedContext?.text && (
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {chunk.retrievedContext.text.substring(0, 300)}
                      {chunk.retrievedContext.text.length > 300 ? "..." : ""}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-6 border-t border-gray-200 bg-white flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
