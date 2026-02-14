import { useState, useRef, useEffect, useMemo, useCallback, lazy, Suspense, memo, startTransition } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingCart, Eye, Minus, Plus, X } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { LazyImage } from './LazyImage';
import { rafThrottle, passiveEventOptions } from '../../lib/performance-utils';

// Lazy load модальных окон (загружаются только при открытии) - ОТНОСИТЕЛЬНЫЕ ПУТИ!
const LuxuryBoxModal = lazy(() => import('./LuxuryBoxModal').then(m => ({ default: m.LuxuryBoxModal })));
const ProductDetailModal = lazy(() => import('./ProductDetailModal').then(m => ({ default: m.ProductDetailModal })));

// Import Figma Assets
import img1oz from "figma:asset/ef5c3ea15fc3d72273a691745590032f4afab28f.png";
import img10g from "figma:asset/f66b862579bedd31c1f469afe60f1e7e0ce8cf87.png";
import img20g from "figma:asset/c86edd56cdc34fc58c274ba7e61be1dc2146b9d8.png";
import img50g from "figma:asset/0d2249736366849213141cfe202d90c6155547e7.png";
import img100g from "figma:asset/4a850d6167e274864c4c363482cf8d6b17409a38.png";
import img500g from "figma:asset/a0c280378f01f520908c824b65ab1259f197d84b.png";
import imgCoin1oz from "figma:asset/7ca464da299fafc5c938ba20deac680637c93430.png";
import imgCoin50g from "figma:asset/eda980be5cb99bc7881ea43285f23646d0a28cf2.png";
import imgCoin100oz from "figma:asset/5f4d23884539253196750c05c640c45c620390f1.png";
import imgCoin200g from "figma:asset/b392ab685d6897eb2a8f60f8b8752794be9c7c13.png";

// NEW: Import updated product images
// 50g Coin (просто монета)
import imgCoin50gSimple from "figma:asset/df3745e5420eb74db724fe94bb23620dbe9dcd33.png";
// 100g Coins
import imgCoin100gBlackPack from "figma:asset/58e21385c4e36f5a5aa32f89a2321364ce592884.png";
import imgCoin100gWhitePack from "figma:asset/9ff9f9e4a501ebd4959e7b711b78ee7dd02b51c1.png";
import imgCoin100gEagle from "figma:asset/8d65726cb4737be67b1de0a169699051d6a9af15.png";
import imgCoin100gBalance from "figma:asset/9f0737dc3218badcf58729a84289e3c95083f4cf.png";
// 200g Coins
import imgCoin200gBlackPack from "figma:asset/bb10d86c9912a70a0b8574b41693028c2fd31780.png";
import imgCoin200gWhitePack from "figma:asset/5880ea07fca0392653c2b4bc4a7ec0b399d17890.png";
import imgCoin200gBalance from "figma:asset/916661dd3ed67ba7e635ea77b211953efb4cea3e.png";
import imgCoin200gEagle from "figma:asset/167080ae135508bae7c24123ae79ce7fc5d0c370.png";
// Cast Gold Bars (1 Kilo & 500g)
import img1KiloCast from "figma:asset/d4a7fbc3f0ac74da20a2146b47bd8bc839e981d8.png";
import img500gCast from "figma:asset/6755b80c161a9e58cfcb5c7708fe919ecfc73171.png";

// 1oz Gold Bar - Multiple images
import img1ozCard1 from "figma:asset/9b9b2fcb7af20dc3e989cec2cee664b1edff20c7.png";
import img1ozCard2 from "figma:asset/1d83d033af5ff5ff2bb3d893bad333708dbe9be5.png";
import img1ozCard3 from "figma:asset/2a30a23cf57f6ecc38d05af3dbf2dd7d1d0bcc42.png";

// 10g Gold Bar - Multiple images
import img10gCard1 from "figma:asset/8478f2e7e30ed9046cf69c8da850bae9c1489791.png";
import img10gCard2 from "figma:asset/e01e564c5ec2c827fc12297e5df1b037aacfc332.png";
import img10gCard3 from "figma:asset/ad7e251e52cd14455b1f06fee69d9464da27fc22.png";

// 20g Gold Bar - Multiple images
import img20gCard1 from "figma:asset/64b8328520b06791e112346bd6d01901fe844f62.png";
import img20gCard2 from "figma:asset/ca8bcbb735ccbea631c52fd106b510626a719f2d.png";
import img20gCard3 from "figma:asset/deff1fb8ef6c8ca743a43023bd185b84d388deed.png";

// 50g Gold Bar - Multiple images
import img50gCard1 from "figma:asset/e0952b79683a8828c97f6b92ceef025decb8842b.png";
import img50gCard2 from "figma:asset/418e81b6a483eabe50f5974bb1edbf2065c60f8d.png";
import img50gCard3 from "figma:asset/9264c5ea2fd577c8b83f1379e91fec9680c6547e.png";

// 100g Gold Bar - Multiple images
import img100gCard1 from "figma:asset/5201b8930e20015ca47fd26559999627737dcf29.png";
import img100gCard2 from "figma:asset/743e9f5cec853fe0a3c37b37db4e17c368d30806.png";
import img100gCard3 from "figma:asset/7dbdcc5bb5a741420480facc174fb8223e1730ec.png";

// 250g Gold Bar - Single image
import img250gCard from "figma:asset/ef1bff7e5206c374a8927e590cf2ae092c7b323a.png";

// 1oz Gold Coin - Multiple images (4 images)
import imgCoin1oz1 from "figma:asset/3ae74f723c572f0d090d8fecbcb26c441eb75fa8.png";
import imgCoin1oz2 from "figma:asset/5b2b162794b6848ad59d1380d94641f3a02c6cbc.png";
import imgCoin1oz3 from "figma:asset/1c2a69d4bcc623f5cab04f662732dcb8ffa0a691.png";
import imgCoin1oz4 from "figma:asset/3c46c8be1c88a91250e68082f376b59e942ee76a.png";

// 50g Gold Coin - Multiple images (4 images)
import imgCoin50g1 from "figma:asset/77ab9fe8a8f02de02bbf9a31c7b5b29dcaa635fe.png";
import imgCoin50g2 from "figma:asset/563f7d8e3f114d67d9a507384dc67250c36eef43.png";
import imgCoin50g3 from "figma:asset/390c156059215b27c59772c1b1a2d8c6705c9459.png";
import imgCoin50g4 from "figma:asset/ac181f8a049c03b1fc4737bb1a2fdbb5fa20ceb0.png";

// 100g Gold Coin - Multiple images (4 images)
import imgCoin100g1 from "figma:asset/673a1db0cc4a8da433721bd1b60526d86b96f97c.png";
import imgCoin100g2 from "figma:asset/c0d4095ea302c977f45196436d0f16c47b050a15.png";
import imgCoin100g3 from "figma:asset/8f7558c077e31a900319483a193a43c0db33dbd0.png";
import imgCoin100g4 from "figma:asset/869e5ae491abf4b52ebf16cf5b15919de193a81f.png";

// 200g Gold Coin - Multiple images (4 images)
import imgCoin200g1 from "figma:asset/68ef767d329ae2b2b588f3abea9f0730afc73271.png";
import imgCoin200g2 from "figma:asset/32bbef082550960e18f3085e45f3ac66f7a9c560.png";
import imgCoin200g3 from "figma:asset/6065b217f83b84d25a67fb263255682894d254f7.png";
import imgCoin200g4 from "figma:asset/e9f148f08c2503727cc8c5e7b636047add943ea4.png";

// Silver Bars - ✅ ОБНОВЛЕННЫЕ КАРТИНКИ
import imgSilver500gbig from "figma:asset/6a86446f98c0d25849c0824244447642cee4810b.png";
import imgSilver1Kgbig from "figma:asset/c21add1c812eed2cb966b6717e7c69d8537cedbd.png";  // 1kg - Правильное изображение
import imgSilver125Kgbig from "figma:asset/81aece5f7a62ab565472eca665190190e73640f2.png"; // 12.5kg - NEW

type FilterCategory = 'ALL' | 'GOLD BARS' | 'SILVER BARS' | 'GOLDEN COINS';

interface Product {
  id: string;
  name: string;
  description: string;
  category: FilterCategory;
  metal: string;
  weight: string;
  purity: string;
  price: number;
  image: string;
  inStock: boolean;
  // Extended details for ProductDetailModal
  denomination?: string;
  design?: string;
  appearance?: string;
  designTheme?: string;
  certificate?: string;
  securityFeatures?: string;
  // Multiple images support
  images?: string[];
}

const products: Product[] = [
  // GOLD BARS
  {
    id: '1',
    name: 'The Eagle of Trust',
    description: '10 GRAM MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '10g',
    purity: '999.9',
    price: 1600.00,
    image: img10gCard1,
    inStock: true,
    denomination: '10 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [img10gCard1, img10gCard2, img10gCard3]
  },
  {
    id: '2',
    name: 'The Eagle of Trust',
    description: '20 GRAM MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '20g',
    purity: '999.9',
    price: 3200.00,
    image: img20gCard1,
    inStock: true,
    denomination: '20 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [img20gCard1, img20gCard2, img20gCard3]
  },
  {
    id: '3',
    name: 'The Eagle of Trust',
    description: '50 GRAM MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '50g',
    purity: '999.9',
    price: 8000.00,
    image: img50gCard2, // Изменена обложка с Card1 на Card2
    inStock: true,
    denomination: '50 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [img50gCard1, img50gCard2, img50gCard3]
  },
  {
    id: '4',
    name: 'The Eagle of Trust',
    description: '100 GRAM MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '100g',
    purity: '999.9',
    price: 16000.00,
    image: img100gCard1,
    inStock: true,
    denomination: '100 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [img100gCard1, img100gCard2, img100gCard3]
  },
  {
    id: '5',
    name: 'The Eagle of Trust',
    description: '250 GRAM MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '250g',
    purity: '999.9',
    price: 40000.00,
    image: img250gCard,
    inStock: true,
    denomination: '250 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark'
  },
  {
    id: '6',
    name: 'The Eagle of Trust',
    description: '500 GRAM CAST GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '500g',
    purity: '999.9',
    price: 80000.00,
    image: img500gCast,
    inStock: true,
    denomination: '500 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Cast Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark'
  },
  {
    id: '7',
    name: 'The Eagle of Trust',
    description: '1 KILO CAST GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '1kg',
    purity: '999.9',
    price: 160000.00,
    image: img1KiloCast,
    inStock: true,
    denomination: '1 Kilo',
    design: 'The Eagle Of Trust',
    appearance: 'Cast Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark'
  },
  {
    id: '8',
    name: 'The Eagle of Trust',
    description: '1 OUNCE MINTED GOLD BAR',
    category: 'GOLD BARS',
    metal: 'Gold',
    weight: '1oz',
    purity: '999.9',
    price: 4976.48,
    image: img1ozCard1,
    inStock: true,
    denomination: '1 Ounce',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [img1ozCard1, img1ozCard2, img1ozCard3]
  },
  
  // GOLD COINS
  {
    id: '9',
    name: 'The Eagle of Trust',
    description: '1 OUNCE MINTED GOLD COIN',
    category: 'GOLDEN COINS',
    metal: 'Gold',
    weight: '31.103g',
    purity: '999.9',
    price: 4976.48,
    image: imgCoin1oz1,
    inStock: true,
    denomination: '1 Ounce',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Coins',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgCoin1oz1, imgCoin1oz2, imgCoin1oz3, imgCoin1oz4]
  },
  {
    id: '10',
    name: 'The Eagle of Trust',
    description: '50 GRAM MINTED GOLD COIN',
    category: 'GOLDEN COINS',
    metal: 'Gold',
    weight: '50g',
    purity: '999.9',
    price: 8000.00,
    image: imgCoin50g1,
    inStock: true,
    denomination: '50 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Coins',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgCoin50g1, imgCoin50g2, imgCoin50g3, imgCoin50g4]
  },
  {
    id: '11',
    name: 'The Eagle of Trust',
    description: '100 GRAM MINTED GOLD COIN',
    category: 'GOLDEN COINS',
    metal: 'Gold',
    weight: '100g',
    purity: '999.9',
    price: 16000.00,
    image: imgCoin100g1,
    inStock: true,
    denomination: '100 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Coins',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgCoin100g1, imgCoin100g2, imgCoin100g3, imgCoin100g4]
  },
  {
    id: '12',
    name: 'The Eagle of Trust',
    description: '200 GRAM MINTED GOLD COIN',
    category: 'GOLDEN COINS',
    metal: 'Gold',
    weight: '200g',
    purity: '999.9',
    price: 32000.00,
    image: imgCoin200g1,
    inStock: true,
    denomination: '200 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Minted Coins',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgCoin200g1, imgCoin200g2, imgCoin200g3, imgCoin200g4]
  },

  // SILVER BARS
  {
    id: '13',
    name: 'The Eagle of Trust',
    description: '500 GRAM CAST SILVER BAR',
    category: 'SILVER BARS',
    metal: 'Silver',
    weight: '500g',
    purity: '999.9',
    price: 1250.00, // ✅ 500g = 1,250 AED
    image: imgSilver500gbig,
    inStock: true,
    denomination: '500 Gram',
    design: 'The Eagle Of Trust',
    appearance: 'Cast Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark'
  },
  {
    id: '14',
    name: 'The Eagle of Trust',
    description: '1 KILO CAST SILVER BAR',
    category: 'SILVER BARS',
    metal: 'Silver',
    weight: '1kg',
    purity: '999.9',
    price: 2500.00, // ✅ 1kg = 2,500 AED
    image: imgSilver500gbig, // ✅ Используем ту же картинку что и 500g для карточки
    inStock: true,
    denomination: '1 Kilo',
    design: 'The Eagle Of Trust',
    appearance: 'Cast Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgSilver1Kgbig] // ✅ Но в модальном окне показываем свою фотку
  },
  {
    id: '15',
    name: 'The Eagle of Trust',
    description: '12.5 KILO SILVER BAR',
    category: 'SILVER BARS',
    metal: 'Silver',
    weight: '12.5kg',
    purity: '999.9',
    price: 31250.00, // ✅ 12.5kg = 31,250 AED (12.5 × 2500)
    image: imgSilver500gbig, // ✅ Используем ту же картинку что и 500g для карточки
    inStock: true,
    denomination: '12.5 Kilo',
    design: 'The Eagle Of Trust',
    appearance: 'Cast Bars',
    designTheme: 'The Eagle of Trust',
    certificate: 'Individually Numbered Authenticity Card',
    securityFeatures: 'Micro-engraved geometry pattern, serial number, and Goldiama hallmark',
    images: [imgSilver125Kgbig] // ✅ Но в модальном окне показываем свою фотку
  }
];

export function ProductSection() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('ALL');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  // 🚀 PERFORMANCE: Progressive rendering для предотвращения Long Tasks
  const [visibleCount, setVisibleCount] = useState(4); // Показываем первые 4 сразу (уменьшено с 6)
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Swipe direction detection with delay
  const [swipeDirection, setSwipeDirection] = useState<'horizontal' | 'vertical' | null>(null);
  const swipeStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const SWIPE_DETECTION_THRESHOLD = 15; // pixels to move before detecting direction
  const SWIPE_DETECTION_DELAY = 100; // ms to wait before committing to direction

  // Scroll state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const { addItem, items, updateQuantity, removeItem } = useCart();
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const { formatPrice } = useCurrency();
  
  // Luxury Box Modal State
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState<Product | null>(null);

  // Product Detail Modal State
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filters: FilterCategory[] = ['ALL', 'GOLD BARS', 'SILVER BARS', 'GOLDEN COINS'];

  // useMemo: Cache filtered products (только пересчитывается при изменении activeFilter)
  const filteredProducts = useMemo(() => {
    return activeFilter === 'ALL' 
      ? products 
      : products.filter(p => p.category === activeFilter);
  }, [activeFilter]);

  // 🚀 PERFORMANCE: Progressive loading - показываем остальные карточки постепенно
  useEffect(() => {
    if (visibleCount >= filteredProducts.length) return;
    
    // Используем requestIdleCallback для загрузки в idle time
    const loadMore = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          setVisibleCount(prev => Math.min(prev + 3, filteredProducts.length));
        }, { timeout: 1000 });
      } else {
        setTimeout(() => {
          setVisibleCount(prev => Math.min(prev + 3, filteredProducts.length));
        }, 16); // ~1 frame
      }
    };

    loadMore();
  }, [visibleCount, filteredProducts.length]);

  // Reset visible count when filter changes
  useEffect(() => {
    setVisibleCount(4); // Сброс до 4 карточек при смене фильтра
  }, [activeFilter]);

  // useCallback: Get quantity of product in cart
  const getCartQuantity = useCallback((productId: string) => {
    const cartItem = items.find(item => item.id === productId);
    return cartItem ? cartItem.quantity : 0;
  }, [items]);

  // useCallback: Handle explore (стабильная функция)
  const handleExplore = useCallback((product: Product) => {
    // Open product detail modal
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  }, []);

  // useCallback: Handle buy (стабильная функция)
  const handleBuy = useCallback((product: Product) => {
    // Open luxury box modal instead of immediately adding
    setPendingProduct(product);
    setIsBoxModalOpen(true);
  }, []);

  const handleBoxConfirm = (material: any, metalFinish: 'gold' | 'silver') => {
    if (!pendingProduct) return;
    
    // Add the main product
    addItem({
      id: pendingProduct.id,
      name: pendingProduct.name,
      price: pendingProduct.price,
      weight: pendingProduct.weight,
      metal: pendingProduct.metal,
      purity: pendingProduct.purity,
      image: pendingProduct.image,
    });
    
    // If user selected a box material, add it as a free item
    if (material) {
      // Determine if product is a coin (round box) or bar (rectangular box)
      const isCoin = pendingProduct.category === 'GOLDEN COINS' || pendingProduct.category === 'SILVER COINS';
      
      // Get the correct image based on product type and metal finish
      let boxImage: string;
      if (isCoin) {
        // Use round box image for coins
        boxImage = material.imageRound;
      } else {
        // Use rectangular box image for bars (gold or silver hardware)
        boxImage = metalFinish === 'gold' ? material.imageGold : material.imageSilver;
      }
      
      addItem({
        id: `box-${pendingProduct.id}`,
        name: `Luxury ${material.name} Box`,
        price: 0, // FREE
        weight: 'N/A',
        metal: isCoin ? 'Gold hardware' : `${metalFinish === 'gold' ? 'Gold' : 'Silver'} hardware`,
        purity: material.description,
        image: boxImage,
        isBox: true,
      });
    }
    
    setJustAdded(pendingProduct.id);
    setTimeout(() => setJustAdded(null), 2000);
    setPendingProduct(null);
  };

  const handleIncrement = (productId: string) => {
    const cartItem = items.find(item => item.id === productId);
    if (cartItem) {
      const product = products.find(p => p.id === productId);
      if (product) {
        addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          weight: product.weight,
          metal: product.metal,
          purity: product.purity,
          image: product.image,
        });
      }
    }
  };

  const handleDecrement = (productId: string) => {
    const cartItem = items.find(item => item.id === productId);
    if (cartItem) {
      if (cartItem.quantity > 1) {
        updateQuantity(productId, cartItem.quantity - 1);
      } else {
        removeItem(productId);
      }
    }
  };

  // Scroll function for navigation buttons
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 450; // Scroll by ~1 card width
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const targetScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // Check scroll position to show/hide navigation buttons
  useEffect(() => {
    const checkScrollPosition = rafThrottle(() => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    });

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      checkScrollPosition();
      currentRef.addEventListener('scroll', checkScrollPosition, passiveEventOptions as any);
      
      return () => {
        currentRef.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, [filteredProducts]);

  useEffect(() => {
    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      const handleTouchStart = (e: TouchEvent) => {
        swipeStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
        setSwipeDirection(null);
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (!swipeStartRef.current) return;

        const deltaX = Math.abs(e.touches[0].clientX - swipeStartRef.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - swipeStartRef.current.y);
        
        // Determine scroll direction with threshold
        const SWIPE_THRESHOLD = 15; // pixels to determine intent
        
        if (deltaX > SWIPE_THRESHOLD || deltaY > SWIPE_THRESHOLD) {
          if (!swipeDirection) {
            // Lock direction based on which delta is larger
            if (deltaY > deltaX * 1.5) {
              // Vertical scroll intent - allow page scroll
              setSwipeDirection('vertical');
              return;
            } else if (deltaX > deltaY) {
              // Horizontal scroll intent - prevent page scroll
              setSwipeDirection('horizontal');
              e.preventDefault();
            }
          } else if (swipeDirection) {
            // Already determined vertical scroll
            return;
          }
        }
      };

      const handleTouchEnd = () => {
        swipeStartRef.current = null;
      };
      
      // Smart horizontal scroll - allow vertical scroll when at edges
      const handleWheel = (e: WheelEvent) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          const scrollLeft = currentRef.scrollLeft;
          const maxScroll = currentRef.scrollWidth - currentRef.clientWidth;
          
          // Check if we're scrolling right and already at the right edge
          const atRightEdge = e.deltaY > 0 && scrollLeft >= maxScroll - 5;
          // Check if we're scrolling left and already at the left edge
          const atLeftEdge = e.deltaY < 0 && scrollLeft <= 5;
          
          // Only prevent default (hijack scroll) if we're NOT at an edge
          if (!atRightEdge && !atLeftEdge) {
            e.preventDefault();
            currentRef.scrollLeft += e.deltaY * 1.5;
          }
          // If at edge, let the page scroll vertically naturally
        }
      };
      
      currentRef.addEventListener('wheel', handleWheel, { passive: false });
      currentRef.addEventListener('touchstart', handleTouchStart, { passive: false });
      currentRef.addEventListener('touchmove', handleTouchMove, { passive: false });
      currentRef.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        currentRef.removeEventListener('wheel', handleWheel);
        currentRef.removeEventListener('touchstart', handleTouchStart);
        currentRef.removeEventListener('touchmove', handleTouchMove);
        currentRef.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [filteredProducts]);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full bg-white pt-4 sm:pt-8 md:pt-12 lg:pt-16 pb-12 sm:pb-48 md:pb-64 lg:pb-80 overflow-hidden"
    >
      <div className="w-full">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8 md:mb-12 lg:mb-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24 relative">
          
          {/* Grid Layout for Aligned Heading and Description */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10 items-center">
            {/* Left: Heading */}
            <h2 
              className="text-[clamp(1.5rem,4vw,3rem)] leading-[1.15] tracking-[-0.02em] font-light text-[#1A1A1A]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              THE COLLECTION THAT<br />DEFINES OWNERSHIP.
            </h2>

            {/* Right: Description */}
            <div className="text-left lg:text-right">
              <p className="text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] font-light text-[#1A1A1A]/60 uppercase tracking-[0.08em] leading-[1.6]" style={{ fontFamily: "'Inter', sans-serif" }}>
                Investment grade bullion<br />for the modern era
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-[11px] sm:text-[12px] md:text-[13px] tracking-[0.02em] uppercase font-light
                  transition-all duration-300 font-['Inter']
                  ${activeFilter === filter 
                    ? 'bg-[#1A1A1A] text-white' 
                    : 'bg-transparent text-[#1A1A1A] border border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40'
                  }
                `}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Products Horizontal Scroll */}
        <div className="relative group">
          {/* Scroll Buttons */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          )}
          
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/95 backdrop-blur-sm shadow-lg rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          )}

          {/* Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-10 overflow-x-auto pb-4 px-2"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {filteredProducts.slice(0, visibleCount).map((product) => {
              const cartQuantity = getCartQuantity(product.id);
              
              return (
              <div
                key={product.id}
                className="flex-shrink-0 w-[340px] flex flex-col items-center group/card"
              >
                {/* Product Card - Figma Layout Exact Match */}
                <div className="bg-[#fafaf8] content-stretch flex flex-col items-start relative rounded-[24px] w-full mb-3 transition-shadow duration-300 group-hover/card:shadow-lg overflow-visible">
                  {/* Shine Effect on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-20 overflow-hidden rounded-[24px]">
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      style={{
                        transform: 'translateX(-100%)',
                        animation: 'shine 1.5s ease-in-out infinite'
                      }}
                    />
                  </div>
                  
                  {/* Picture - Image Container with padding */}
                  <div className="content-stretch flex items-center justify-center p-[10px] relative w-full h-[370px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <LazyImage
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain pointer-events-none"
                        style={{
                          // Scale down coins (1oz, 50g, 100g) by 20%
                          transform: ['9', '10', '11'].includes(product.id) ? 'scale(0.8)' : undefined,
                          // ✅ ЖЕСТКОЕ ОГРАНИЧЕНИЕ для серебряных слитков 1kg и 12.5kg - уменьшено до 60%
                          maxWidth: ['14', '15'].includes(product.id) ? '60%' : undefined,
                          maxHeight: ['14', '15'].includes(product.id) ? '60%' : undefined,
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Container1 - Product Info */}
                  <div className="content-stretch flex flex-col gap-[8px] items-center justify-center pb-[24px] relative shrink-0 w-full">
                    {/* Container2 - Title & Description */}
                    <div className="relative shrink-0">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative">
                        {/* Heading */}
                        <div className="relative shrink-0 w-full">
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="content-stretch flex items-center justify-center px-[3px] relative w-full">
                              <p className="font-['Cormorant_Garamond',serif] leading-[25px] not-italic relative shrink-0 text-[#101828] text-[20px] text-center tracking-[-0.5px]">
                                {product.name}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Paragraph */}
                        <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                          <p className="font-['Inter'] font-normal leading-[13.5px] not-italic relative shrink-0 text-[#6a7282] text-[9px] text-center tracking-[0.45px] uppercase">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Container3 - Specifications + Price */}
                    <div className="relative shrink-0">
                      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative">
                        {/* Container4 - Purity */}
                        <div className="relative shrink-0">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative">
                            <div className="flex-[1_0_0] min-h-px min-w-px relative">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
                                <p className="font-['Inter'] font-normal leading-[15px] not-italic relative shrink-0 text-[#99a1af] text-[10px] text-center tracking-[0.5px] uppercase">
                                  Purity
                                </p>
                              </div>
                            </div>
                            <div className="relative shrink-0">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
                                <p className="font-['Inter'] font-semibold leading-[15px] not-italic relative shrink-0 text-[#101828] text-[10px] text-center">
                                  {product.purity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Container5 - Divider */}
                        <div className="bg-[#d1d5dc] h-[20px] relative shrink-0 w-px">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid size-full" />
                        </div>
                        
                        {/* Container6 - Weight */}
                        <div className="relative shrink-0">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative">
                            <div className="flex-[1_0_0] min-h-px min-w-px relative">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
                                <p className="font-['Inter'] font-normal leading-[15px] not-italic relative shrink-0 text-[#99a1af] text-[10px] text-center tracking-[0.5px] uppercase">
                                  Weight
                                </p>
                              </div>
                            </div>
                            <div className="relative shrink-0">
                              <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative">
                                <p className="font-['Inter'] font-semibold leading-[15px] not-italic relative shrink-0 text-[#101828] text-[10px] text-center">
                                  {product.weight}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Container7 - Divider */}
                        <div className="bg-[#d1d5dc] h-[20px] relative shrink-0 w-px">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid size-full" />
                        </div>
                        
                        {/* Text4 - Price */}
                        <div className="flex-[1_0_0] min-h-px min-w-px relative">
                          <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center relative w-full">
                            <p className="font-['Inter'] font-bold leading-[27px] not-italic relative shrink-0 text-[#101828] text-[18px] text-center lining-nums">
                              {formatPrice(product.price)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text5 - Stock Badge */}
                  {product.inStock && (
                    <div className="absolute bg-[rgba(184,160,126,0.1)] content-stretch flex items-start left-[16px] px-[12px] py-[4px] rounded-[16777200px] top-[21px] z-10">
                      <p className="font-['Inter'] font-bold leading-[13.5px] not-italic relative shrink-0 text-[#b8a07e] text-[9px] tracking-[0.45px] uppercase">
                        In Stock
                      </p>
                    </div>
                  )}

                  {/* Cart Indicator - Simple Dot */}
                  {cartQuantity > 0 && (
                    <div className="absolute top-[21px] right-[16px] z-10">
                      <div className="w-3 h-3 rounded-full bg-black shadow-lg" />
                    </div>
                  )}
                </div>

                {/* Action Buttons - OUTSIDE Card */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 w-full pb-2 sm:pb-3">
                  {/* Explore Button - Secondary */}
                  <button
                    onClick={() => handleExplore(product)}
                    className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full text-[10px] sm:text-xs font-['Inter'] font-medium uppercase tracking-[0.15em] transition-all duration-300 bg-transparent border border-[#1A1A1A]/20 text-[#1A1A1A] hover:border-[#1A1A1A]/40 hover:bg-[#1A1A1A]/5"
                  >
                    <Eye className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                    <span className="hidden sm:inline">Explore</span>
                  </button>
                  
                  {/* Add to Cart Button or Quantity Control */}
                  {cartQuantity === 0 ? (
                    /* Add to Cart Button - Primary */
                    <button
                      onClick={() => handleBuy(product)}
                      className={`
                        inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 rounded-full
                        text-[10px] sm:text-xs font-['Inter'] font-medium uppercase tracking-[0.15em]
                        transition-all duration-300 cursor-pointer
                        ${justAdded === product.id
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-black text-white border-black hover:bg-gray-800'
                        }
                        ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                      disabled={!product.inStock}
                    >
                      <ShoppingCart className="w-3 sm:w-3.5 md:w-4 h-3 sm:h-3.5 md:h-4" />
                      <span>{justAdded === product.id ? 'Added' : 'Add'}</span>
                    </button>
                  ) : (
                    /* Quantity Control */
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full bg-black text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDecrement(product.id);
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-colors cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>
                      
                      <span className="text-xs sm:text-sm font-bold font-['Inter'] min-w-[20px] sm:min-w-[24px] text-center">
                        {cartQuantity}
                      </span>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleIncrement(product.id);
                        }}
                        className="hover:bg-white/20 rounded-full p-0.5 sm:p-1 transition-colors cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>

                      <div className="w-px h-3 sm:h-4 bg-white/30 mx-0.5 sm:mx-1" />
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(product.id);
                        }}
                        className="hover:bg-red-500/20 rounded-full p-0.5 sm:p-1 transition-colors cursor-pointer"
                        aria-label="Remove from cart"
                      >
                        <X className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
            })}
          </div>
        </div>

      </div>
      
      {/* Luxury Box Modal */}
      <Suspense fallback={null}>
        <LuxuryBoxModal
          isOpen={isBoxModalOpen}
          onClose={() => {
            setIsBoxModalOpen(false);
            setPendingProduct(null);
          }}
          onConfirm={handleBoxConfirm}
          productName={pendingProduct?.name || ''}
          productMetal={pendingProduct?.metal || 'Gold'}
          productCategory={pendingProduct?.category}
        />
      </Suspense>

      {/* Product Detail Modal */}
      <Suspense fallback={null}>
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleBuy}
          product={selectedProduct}
        />
      </Suspense>
    </section>
  );
}