import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { LazySpline } from '@/app/components/LazySpline';

interface Box3DPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMaterialId?: string | null;
}

export function Box3DPreviewModal({ isOpen, onClose }: Box3DPreviewModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-[900px] w-full shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] pointer-events-auto overflow-hidden flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <div>
                  <h2 className="font-['Cormorant_Garamond'] text-2xl text-gray-900 font-light">
                    3D Preview
                  </h2>
                  <p className="font-['Inter'] text-sm text-gray-500 mt-1">
                    Drag to rotate • Scroll to zoom
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 3D Viewer Container */}
              <div className="flex-1 bg-gradient-to-br from-gray-50 to-white relative min-h-[500px]">
                <LazySpline
                  scene="https://prod.spline.design/yT0oCr3pevScJCWl/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}