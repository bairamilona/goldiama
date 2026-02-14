import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import svgPaths from "../../imports/svg-ov0ah2120q";

// Rectangular Boxes (for bars/slitki)
import MetalBox from "../../imports/Metal";
import WoodBox from "../../imports/Wood";
import LightwoodBox from "../../imports/Lightwood";
import DarkwoodBox from "../../imports/Darkwood";
import RedwoodBox from "../../imports/Redwood";
import WalnutBox from "../../imports/Walnut";
import MetalBoxSilver from "../../imports/MetalSilver";
import WoodBoxSilver from "../../imports/WoodSilver";
import LightwoodBoxSilver from "../../imports/LightwoodSilver";
import DarkwoodBoxSilver from "../../imports/DarkwoodSilver";
import RedwoodBoxSilver from "../../imports/RedwoodSilver";
import WalnutBoxSilver from "../../imports/WalnutSilver";

// Round Boxes (for coins/moneti)
import MetalRound from "../../imports/MetalRound";
import WoodRound from "../../imports/WoodRound";
import LightwoodRound from "../../imports/LightwoodRound";
import DarkwoodRound from "../../imports/DarkwoodRound";
import RedwoodRound from "../../imports/RedwoodRound";
import WalnutRound from "../../imports/WalnutRound";

// Import box images for cart display - Rectangular
import imgMetalGold from "figma:asset/b0b81f34fd0b1d68d6bb80ce57a4e7ca99be93f1.png";
import imgMetalSilver from "figma:asset/f5fbea64990b20b054b68bb1ab3d5e2ba9f5ca8d.png";
import imgWoodGold from "figma:asset/d28bb47e03b05d67aa42e1e87c5d3ff66e8c2dc8.png";
import imgWoodSilver from "figma:asset/1fde46a7d98f15f16ef5a33ae02b4d54b34ec0f7.png";
import imgLightwoodGold from "figma:asset/e1562a10b1e5f851cb1a38e38f6e1e8e1e0ec26f.png";
import imgLightwoodSilver from "figma:asset/69c6ffe59b7b2dd2e1d1c5f1de03a9fd9fbc9d94.png";
import imgDarkwoodGold from "figma:asset/39e1fdd0f5de1bf49e48a434a3ca1e18cd94acb9.png";
import imgDarkwoodSilver from "figma:asset/c20e9b5bba5b7c26dfbac6b21a7f6c38b5568c1e.png";
import imgRedwoodGold from "figma:asset/0fe6085ae8fbaf7e5b8a0ebded66f8e4dcacc81a.png";
import imgRedwoodSilver from "figma:asset/ea79734acde3a5d4cc8b79c1e0e1e85d41edaef8.png";
import imgWalnutGold from "figma:asset/4f0e5e48d20d6fd775775ca623c7edbc9fcfe33d.png";
import imgWalnutSilver from "figma:asset/02fb0f2b3a7a5d92ae8b6c4fedb8cc8a53e7c2b7.png";

// Import box images for cart display - Round
import imgMetalRound from "figma:asset/c58cac8e8971aaef00ceb5cf022b53f3e82e37ce.png";
import imgWoodRound from "figma:asset/7e0b0352659114219ba53b533b186ea86f064151.png";
import imgLightwoodRound from "figma:asset/25ccf45ad47fe60b270761ab7955bf214ffe69e2.png";
import imgDarkwoodRound from "figma:asset/03e7df801bc91ebbe397c257ea00281ee5a118db.png";
import imgRedwoodRound from "figma:asset/c964109eaddd47c0d7c29eb890c4d61448225d19.png";
import imgWalnutRound from "figma:asset/4e2b9e9a728eac9094a9084000333147dd2e694a.png";

interface LuxuryBoxMaterial {
  id: string;
  name: string;
  description: string;
  color: string;
  // Rectangular boxes (for bars)
  component: React.ComponentType;
  componentSilver: React.ComponentType;
  imageGold: string;
  imageSilver: string;
  // Round boxes (for coins)
  componentRound: React.ComponentType;
  imageRound: string;
}

interface LuxuryBoxModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (material: LuxuryBoxMaterial | null, metalFinish: 'gold' | 'silver') => void;
  productName: string;
  productMetal: string; // NEW: Auto-detect hardware from product metal
  productCategory?: string; // NEW: Detect if coin or bar
}

const LUXURY_MATERIALS: LuxuryBoxMaterial[] = [
  {
    id: 'metal',
    name: 'Navy Blue',
    description: 'Premium lacquered finish',
    color: '#3B4B6B',
    component: MetalBox,
    componentSilver: MetalBoxSilver,
    imageGold: imgMetalGold,
    imageSilver: imgMetalSilver,
    componentRound: MetalRound,
    imageRound: imgMetalRound
  },
  {
    id: 'walnut',
    name: 'Walnut Wood',
    description: 'Premium dark walnut',
    color: '#5D4E42',
    component: WalnutBox,
    componentSilver: WalnutBoxSilver,
    imageGold: imgWalnutGold,
    imageSilver: imgWalnutSilver,
    componentRound: WalnutRound,
    imageRound: imgWalnutRound
  },
  {
    id: 'wood',
    name: 'Classic Wood',
    description: 'Rich brown finish',
    color: '#6B4423',
    component: WoodBox,
    componentSilver: WoodBoxSilver,
    imageGold: imgWoodGold,
    imageSilver: imgWoodSilver,
    componentRound: WoodRound,
    imageRound: imgWoodRound
  },
  {
    id: 'lightwood',
    name: 'Light Oak',
    description: 'Natural oak finish',
    color: '#C4A676',
    component: LightwoodBox,
    componentSilver: LightwoodBoxSilver,
    imageGold: imgLightwoodGold,
    imageSilver: imgLightwoodSilver,
    componentRound: LightwoodRound,
    imageRound: imgLightwoodRound
  },
  {
    id: 'darkwood',
    name: 'Ebony Black',
    description: 'Black wood finish',
    color: '#1A1A1A',
    component: DarkwoodBox,
    componentSilver: DarkwoodBoxSilver,
    imageGold: imgDarkwoodGold,
    imageSilver: imgDarkwoodSilver,
    componentRound: DarkwoodRound,
    imageRound: imgDarkwoodRound
  },
  {
    id: 'redwood',
    name: 'Mahogany Red',
    description: 'Burgundy wood finish',
    color: '#6D2C2C',
    component: RedwoodBox,
    componentSilver: RedwoodBoxSilver,
    imageGold: imgRedwoodGold,
    imageSilver: imgRedwoodSilver,
    componentRound: RedwoodRound,
    imageRound: imgRedwoodRound
  }
];

export function LuxuryBoxModal({ isOpen, onClose, onConfirm, productName, productMetal, productCategory }: LuxuryBoxModalProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<LuxuryBoxMaterial | null>(
    LUXURY_MATERIALS.find(m => m.id === 'wood') || null
  );
  
  // Auto-detect hardware finish based on product metal (Gold or Silver)
  const metalFinish: 'gold' | 'silver' = productMetal.toLowerCase().includes('silver') ? 'silver' : 'gold';
  
  // Detect if product is a coin (round box) or bar (rectangular box)
  const isCoin = productCategory === 'GOLDEN COINS' || productCategory === 'SILVER COINS';

  const handleMaterialChange = (material: LuxuryBoxMaterial) => {
    setSelectedMaterial(material);
  };

  const handleConfirm = () => {
    onConfirm(selectedMaterial, metalFinish);
    onClose();
  };

  const handleDecline = () => {
    onConfirm(null, metalFinish);
    onClose();
  };

  // Get the correct component based on product type and metal finish
  const BoxComponent = selectedMaterial 
    ? (isCoin 
        ? selectedMaterial.componentRound // Round box for coins
        : (metalFinish === 'gold' ? selectedMaterial.component : selectedMaterial.componentSilver) // Rectangular box for bars
      )
    : null;

  return createPortal(
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999999]"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 pt-24 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-[520px] w-full shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] pointer-events-auto overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Header - More Compact */}
              <div className="flex items-start justify-between px-5 py-4 shrink-0">
                <div className="flex-1">
                  <h2 className="font-['Cormorant_Garamond'] text-[22px] leading-[28px] text-[#101828] font-light tracking-[0.65px] mb-1">
                    Complimentary Luxury Box
                  </h2>
                  <p className="font-['Inter'] text-[12px] leading-[16px] text-[#6a7282] font-normal">
                    Enhance your {productName} with premium packaging
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-[#99A1AF] hover:text-[#101828] transition-colors cursor-pointer ml-4 shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className="overflow-y-auto px-5 flex-1">
                
                {/* Box Image Preview - More Compact */}
                <motion.div 
                  className="w-full h-[280px] rounded-xl flex items-center justify-center mb-3 relative overflow-hidden bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]"
                  key={`${selectedMaterial?.id}-${metalFinish}` || 'default'}
                >
                  <div className="absolute inset-0 border border-[#e5e7eb] rounded-xl pointer-events-none z-20" />
                  
                  {/* Box Image */}
                  <AnimatePresence mode="wait">
                    {selectedMaterial ? (
                      <motion.div
                        key={`${selectedMaterial.id}-${metalFinish}`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center p-6"
                      >
                        {BoxComponent && <BoxComponent />}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center relative z-10"
                      >
                        <motion.div 
                          className="relative w-8 h-8 mx-auto mb-2"
                          animate={{
                            scale: [1, 1.05, 1],
                            rotate: [0, 2, -2, 0]
                          }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                          <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                            <g>
                              <path d={svgPaths.p366200} stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                              <path d="M20 36.6667V20" stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                              <path d={svgPaths.p1f459d40} stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                              <path d="M12.5 7.11667L27.5 15.7" stroke="#D1D5DC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.33333" />
                            </g>
                          </svg>
                        </motion.div>
                        <p className="font-['Inter'] text-[11px] leading-[14px] text-[#99a1af] font-normal">
                          Select a material to preview
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Free Badge - More Compact */}
                <div className="flex items-center justify-center mb-3">
                  <div className="bg-[#f4f5f7] border border-[#f4f5f7] rounded-full px-3 py-1 h-[26px] flex items-center gap-1.5">
                    <div className="w-3 h-3 relative shrink-0">
                      <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
                        <g>
                          <path d={svgPaths.p3de7e600} stroke="#BCC2CB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                        </g>
                      </svg>
                    </div>
                    <span className="font-['Inter'] text-[10px] leading-[14px] text-[#101828] font-semibold tracking-[0.3px]">
                      FREE WITH YOUR PURCHASE
                    </span>
                  </div>
                </div>

                {/* Box Material Selection - More Compact */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 shrink-0">
                    <p className="font-['Inter'] text-[10px] leading-[14px] text-[#101828] font-medium tracking-[0.6px] uppercase">
                      Box<br />Material
                    </p>
                  </div>
                  <div className="flex gap-2.5">
                    {LUXURY_MATERIALS.map((material) => (
                      <button
                        key={material.id}
                        onClick={() => handleMaterialChange(material)}
                        className="relative cursor-pointer shrink-0"
                        title={material.name}
                      >
                        <div
                          className={`
                            w-9 h-9 rounded-full transition-all duration-300
                            ${selectedMaterial?.id === material.id
                              ? 'ring-[2.5px] ring-[#D4AF37] ring-offset-2'
                              : 'ring-0 hover:ring-2 hover:ring-gray-300'
                            }
                          `}
                          style={{ backgroundColor: material.color }}
                        />
                        {selectedMaterial?.id === material.id && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                              <div className="w-3 h-3">
                                <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.2 13.2">
                                  <g>
                                    <path d={svgPaths.p30044ee0} stroke="#D4AF37" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.1" />
                                  </g>
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions - More Compact */}
              <div className="flex items-center justify-end gap-3 px-5 py-4 shrink-0">
                <button
                  onClick={handleDecline}
                  className="px-5 py-2 h-[34px] rounded-full border border-[rgba(26,26,26,0.2)] font-['Inter'] text-[11px] leading-[14px] text-[#1a1a1a] font-medium tracking-[1.65px] uppercase cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  No thanks
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!selectedMaterial}
                  className={`
                    px-5 py-2 h-[34px] rounded-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)]
                    font-['Inter'] text-[11px] leading-[14px] text-white font-medium tracking-[1.65px] uppercase
                    flex items-center gap-1.5 transition-all duration-300
                    ${selectedMaterial
                      ? 'bg-black cursor-pointer hover:bg-gray-800'
                      : 'bg-gray-300 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="w-[14px] h-[13px]">
                    <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.36 14.667">
                      <g clipPath="url(#clip0_cart)">
                        <path d={svgPaths.pa05e2c0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p191aa600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                        <path d={svgPaths.p5a16300} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                      </g>
                      <defs>
                        <clipPath id="clip0_cart">
                          <rect fill="white" height="14.667" width="15.36" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <span>Add to cart</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}