export type ProductStatus = "Published" | "Draft";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  tags: string[];
  images: string[];
  specifications: {
    material: string;
    finish: string;
    dimensions: string;
    weight: string;
    color: string;
    applications: string[];
  };
  finishes: string[];
  amazonUrl: string;
  flipkartUrl: string;
  featured: boolean;
  bulkAvailable: boolean;
  status: ProductStatus;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export type InquiryStatus =
  | "New"
  | "Contacted"
  | "In Progress"
  | "Quoted"
  | "Completed"
  | "Cancelled";

export interface BulkOrder {
  id: string;
  customerName: string;
  company: string;
  phone: string;
  email: string;
  city: string;
  product: string;
  quantity: string;
  projectType: string;
  message: string;
  date: string;
  status: InquiryStatus;
  notes: string[];
}

export type MessageStatus = "Unread" | "Read" | "Replied";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
}

const img = (keywords: string, seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80&${encodeURIComponent(
    keywords
  )}`;

// Curated real Unsplash photo references (metal / copper / architectural textures & interiors)
const PHOTO = {
  copperSheet: "photo-1587582140833-cb54e5c7f8e6",
  copperTexture: "photo-1622467827417-bec7da96f1ba",
  hammeredMetal: "photo-1620641622295-5a1c8d3c0a5d",
  interiorWarm: "photo-1600585154340-be6161a56a0c",
  kitchenBacksplash: "photo-1556911220-bff31c812dba",
  loftInterior: "photo-1502672260266-1c1ef2d93688",
  bathroomTile: "photo-1552321554-5fefe8c9ef14",
  darkInterior: "photo-1600607687920-4e2a09cf159d",
  wallPanel: "photo-1615873968403-89e068629265",
  architecture: "photo-1487958449943-2429e8be8625",
  facade: "photo-1481253127861-534498168948",
  hero: "photo-1600566753086-00f18fb6b3ea",
};

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Copper Tiles",
    slug: "copper-tiles",
    description: "Classic and hammered copper tiles for walls, backsplashes and feature panels.",
    image: img("copper,tile", PHOTO.copperTexture),
    productCount: 3,
  },
  {
    id: "cat-2",
    name: "Copper Wall Panels",
    slug: "copper-wall-panels",
    description: "Large-format panels engineered for commercial and residential feature walls.",
    image: img("copper,panel,wall", PHOTO.wallPanel),
    productCount: 2,
  },
  {
    id: "cat-3",
    name: "Decorative Copper",
    slug: "decorative-copper",
    description: "Mosaic and ornamental copper surfaces for statement interiors.",
    image: img("copper,mosaic", PHOTO.kitchenBacksplash),
    productCount: 1,
  },
  {
    id: "cat-4",
    name: "Textured Copper",
    slug: "textured-copper",
    description: "Hand-finished, richly textured copper for tactile architectural surfaces.",
    image: img("copper,texture,metal", PHOTO.hammeredMetal),
    productCount: 1,
  },
  {
    id: "cat-5",
    name: "Antique Copper",
    slug: "antique-copper",
    description: "Aged and patinated copper finishes for heritage and character-led projects.",
    image: img("antique,copper", PHOTO.darkInterior),
    productCount: 1,
  },
  {
    id: "cat-6",
    name: "Architectural Surfaces",
    slug: "architectural-surfaces",
    description: "Facade-grade copper cladding and surfaces for commercial architecture.",
    image: img("copper,facade,architecture", PHOTO.facade),
    productCount: 1,
  },
];

export const products: Product[] = [
  {
    id: "p-1",
    slug: "classic-copper-tile",
    name: "Classic Copper Tile",
    category: "Copper Tiles",
    shortDescription: "A refined, smooth-finish copper tile for timeless interiors.",
    fullDescription:
      "The Classic Copper Tile brings a warm, understated shine to any wall. Precision-pressed from solid copper sheet and finished by hand, it is equally at home behind a kitchen range or across an entire feature wall. Its smooth surface reflects light softly, deepening in tone over years of use.",
    tags: ["Bestseller", "Smooth Finish"],
    images: [
      img("copper,tile,smooth", PHOTO.copperSheet),
      img("copper,tile,closeup", PHOTO.copperTexture),
      img("copper,kitchen", PHOTO.kitchenBacksplash),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Polished Smooth",
      dimensions: "150mm x 150mm x 1.2mm",
      weight: "0.24 kg / tile",
      color: "Natural Copper",
      applications: ["Kitchen Backsplash", "Feature Walls", "Bar Interiors"],
    },
    finishes: ["Polished", "Satin", "Matte"],
    amazonUrl: "https://www.amazon.in/s?k=classic+copper+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=classic+copper+tile",
    featured: true,
    bulkAvailable: true,
    status: "Published",
    views: 2140,
  },
  {
    id: "p-2",
    slug: "hammered-copper-panel",
    name: "Hammered Copper Panel",
    category: "Copper Wall Panels",
    shortDescription: "Hand-hammered texture that catches light from every angle.",
    fullDescription:
      "Each Hammered Copper Panel is worked by hand into an irregular, faceted texture that plays with light throughout the day. Built for large-format installations, it is a favourite among architects looking to add depth and craft to lobbies, restaurants and boutique retail spaces.",
    tags: ["Handcrafted", "Large Format"],
    images: [
      img("hammered,copper", PHOTO.hammeredMetal),
      img("copper,wall,panel", PHOTO.wallPanel),
      img("loft,copper,interior", PHOTO.loftInterior),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Hand-Hammered",
      dimensions: "600mm x 300mm x 1.5mm",
      weight: "1.1 kg / panel",
      color: "Warm Copper",
      applications: ["Lobbies", "Feature Walls", "Retail Interiors"],
    },
    finishes: ["Hammered Natural", "Hammered Dark"],
    amazonUrl: "https://www.amazon.in/s?k=hammered+copper+panel",
    flipkartUrl: "https://www.flipkart.com/search?q=hammered+copper+panel",
    featured: true,
    bulkAvailable: true,
    status: "Published",
    views: 1560,
  },
  {
    id: "p-3",
    slug: "antique-copper-tile",
    name: "Antique Copper Tile",
    category: "Antique Copper",
    shortDescription: "Deep, patinated tones for character-rich, heritage-style spaces.",
    fullDescription:
      "The Antique Copper Tile is chemically aged to develop a rich, variegated patina reminiscent of centuries-old copperwork. No two tiles are identical, making every installation genuinely one-of-a-kind. A favourite for heritage restorations and characterful residential interiors.",
    tags: ["Aged Finish", "One-of-a-kind"],
    images: [
      img("antique,copper,tile", PHOTO.darkInterior),
      img("aged,copper", PHOTO.copperTexture),
      img("heritage,interior", PHOTO.interiorWarm),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Antique Patina",
      dimensions: "150mm x 150mm x 1.2mm",
      weight: "0.24 kg / tile",
      color: "Aged Bronze-Copper",
      applications: ["Heritage Interiors", "Feature Walls", "Fireplaces"],
    },
    finishes: ["Light Patina", "Deep Patina"],
    amazonUrl: "https://www.amazon.in/s?k=antique+copper+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=antique+copper+tile",
    featured: true,
    bulkAvailable: true,
    status: "Published",
    views: 980,
  },
  {
    id: "p-4",
    slug: "brushed-copper-tile",
    name: "Brushed Copper Tile",
    category: "Copper Tiles",
    shortDescription: "A soft, linear brushed texture with a contemporary matte glow.",
    fullDescription:
      "Brushed in a single direction for a fine linear texture, this tile offers a quieter, more contemporary read on copper — ideal for minimalist kitchens, bathrooms and commercial counters that want warmth without shine.",
    tags: ["Matte", "Contemporary"],
    images: [
      img("brushed,copper", PHOTO.copperSheet),
      img("bathroom,copper,tile", PHOTO.bathroomTile),
      img("modern,kitchen,metal", PHOTO.loftInterior),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Brushed Matte",
      dimensions: "150mm x 150mm x 1.2mm",
      weight: "0.24 kg / tile",
      color: "Soft Copper",
      applications: ["Bathrooms", "Commercial Counters", "Feature Walls"],
    },
    finishes: ["Brushed Matte", "Brushed Satin"],
    amazonUrl: "https://www.amazon.in/s?k=brushed+copper+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=brushed+copper+tile",
    featured: true,
    bulkAvailable: true,
    status: "Published",
    views: 760,
  },
  {
    id: "p-5",
    slug: "rose-copper-tile",
    name: "Rose Copper Tile",
    category: "Copper Tiles",
    shortDescription: "A pink-toned copper alloy tile with a luminous, jewel-like finish.",
    fullDescription:
      "Blended with a touch of rose-gold alloy, this tile carries a softer, pinker warmth than pure copper — well suited to boutique interiors, powder rooms and hospitality spaces looking for a distinctive, jewel-toned accent.",
    tags: ["Alloy Finish", "Statement Piece"],
    images: [
      img("rose,gold,tile", PHOTO.kitchenBacksplash),
      img("pink,metal,texture", PHOTO.copperTexture),
      img("boutique,interior", PHOTO.interiorWarm),
    ],
    specifications: {
      material: "Copper-Rose Gold Alloy",
      finish: "Polished",
      dimensions: "150mm x 150mm x 1.2mm",
      weight: "0.23 kg / tile",
      color: "Rose Copper",
      applications: ["Powder Rooms", "Hospitality Interiors", "Feature Walls"],
    },
    finishes: ["Polished", "Satin"],
    amazonUrl: "https://www.amazon.in/s?k=rose+copper+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=rose+copper+tile",
    featured: false,
    bulkAvailable: true,
    status: "Published",
    views: 540,
  },
  {
    id: "p-6",
    slug: "copper-mosaic",
    name: "Copper Mosaic",
    category: "Decorative Copper",
    shortDescription: "Small-format mosaic tiles arranged for intricate decorative detail.",
    fullDescription:
      "Composed of small hexagonal and square copper pieces mounted on a flexible mesh backing, the Copper Mosaic is designed for curved surfaces, borders and decorative insets where a larger tile can't reach.",
    tags: ["Mosaic", "Decorative"],
    images: [
      img("copper,mosaic,tile", PHOTO.hammeredMetal),
      img("mosaic,pattern,metal", PHOTO.wallPanel),
      img("decorative,interior", PHOTO.darkInterior),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Polished Mosaic",
      dimensions: "300mm x 300mm sheet",
      weight: "0.6 kg / sheet",
      color: "Natural Copper",
      applications: ["Decorative Borders", "Bar Fronts", "Accent Walls"],
    },
    finishes: ["Polished", "Antique"],
    amazonUrl: "https://www.amazon.in/s?k=copper+mosaic+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=copper+mosaic+tile",
    featured: false,
    bulkAvailable: true,
    status: "Published",
    views: 410,
  },
  {
    id: "p-7",
    slug: "textured-copper-panel",
    name: "Textured Copper Panel",
    category: "Textured Copper",
    shortDescription: "A deeply grooved panel that adds dramatic depth to large walls.",
    fullDescription:
      "Engineered with a repeating ridged texture, the Textured Copper Panel is built for scale — designed to be viewed across a room, where its grooves catch shadow and light to create a constantly shifting surface.",
    tags: ["Deep Texture", "Commercial Grade"],
    images: [
      img("textured,metal,panel", PHOTO.wallPanel),
      img("copper,ridges", PHOTO.hammeredMetal),
      img("commercial,interior,metal", PHOTO.loftInterior),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Ridged Texture",
      dimensions: "600mm x 300mm x 1.8mm",
      weight: "1.3 kg / panel",
      color: "Natural Copper",
      applications: ["Commercial Lobbies", "Auditoriums", "Feature Walls"],
    },
    finishes: ["Natural", "Dark Oxide"],
    amazonUrl: "https://www.amazon.in/s?k=textured+copper+panel",
    flipkartUrl: "https://www.flipkart.com/search?q=textured+copper+panel",
    featured: false,
    bulkAvailable: true,
    status: "Published",
    views: 305,
  },
  {
    id: "p-8",
    slug: "premium-copper-wall-tile",
    name: "Premium Copper Wall Tile",
    category: "Architectural Surfaces",
    shortDescription: "Facade-grade copper tile engineered for exterior architectural use.",
    fullDescription:
      "Built to a heavier gauge and weatherproofed for exterior exposure, the Premium Copper Wall Tile is our flagship architectural product — specified by studios for facades, canopies and outdoor feature walls that need to perform as well as they look.",
    tags: ["Facade Grade", "Weatherproof"],
    images: [
      img("copper,facade", PHOTO.facade),
      img("architecture,metal,building", PHOTO.architecture),
      img("copper,exterior,wall", PHOTO.copperSheet),
    ],
    specifications: {
      material: "99.9% Pure Copper",
      finish: "Weatherproof Coated",
      dimensions: "300mm x 300mm x 2mm",
      weight: "0.9 kg / tile",
      color: "Natural Copper (weathers to verdigris)",
      applications: ["Facades", "Canopies", "Outdoor Feature Walls"],
    },
    finishes: ["Natural", "Pre-Weathered"],
    amazonUrl: "https://www.amazon.in/s?k=premium+copper+wall+tile",
    flipkartUrl: "https://www.flipkart.com/search?q=premium+copper+wall+tile",
    featured: false,
    bulkAvailable: true,
    status: "Draft",
    views: 128,
  },
];

export const bulkOrders: BulkOrder[] = [
  {
    id: "bo-1",
    customerName: "Aarav Mehta",
    company: "Studio Mehta Architects",
    phone: "+91 98200 11223",
    email: "aarav@studiomehta.com",
    city: "Mumbai",
    product: "Hammered Copper Panel",
    quantity: "480 panels",
    projectType: "Commercial Lobby",
    message: "Need panels for a 5-star hotel lobby, timeline is 6 weeks. Please share lead times and sample panel first.",
    date: "2026-09-10",
    status: "New",
    notes: [],
  },
  {
    id: "bo-2",
    customerName: "Priya Nair",
    company: "Nair Interiors",
    phone: "+91 90210 44556",
    email: "priya@nairinteriors.in",
    city: "Bengaluru",
    product: "Classic Copper Tile",
    quantity: "1200 tiles",
    projectType: "Residential — Villa",
    message: "Client wants full kitchen and bar backsplash in polished finish.",
    date: "2026-09-08",
    status: "Contacted",
    notes: ["Called client, sending quote by Friday."],
  },
  {
    id: "bo-3",
    customerName: "Rohan Kapoor",
    company: "Kapoor Builders",
    phone: "+91 89990 77812",
    email: "rohan@kapoorbuilders.com",
    city: "Delhi",
    product: "Premium Copper Wall Tile",
    quantity: "3500 sq ft",
    projectType: "Commercial Facade",
    message: "Facade cladding for a new office building, need weatherproof rating documentation.",
    date: "2026-09-05",
    status: "In Progress",
    notes: ["Sent technical datasheet.", "Site visit scheduled for next week."],
  },
  {
    id: "bo-4",
    customerName: "Fatima Sheikh",
    company: "The Bombay Canteen Group",
    phone: "+91 91234 56780",
    email: "fatima@bombaycanteengroup.com",
    city: "Mumbai",
    product: "Antique Copper Tile",
    quantity: "600 tiles",
    projectType: "Restaurant Interior",
    message: "Looking for a heritage look for our new outlet, deep patina preferred.",
    date: "2026-09-01",
    status: "Quoted",
    notes: ["Quote sent: ₹4,80,000 incl. shipping."],
  },
  {
    id: "bo-5",
    customerName: "Vikram Desai",
    company: "Desai & Sons Contractors",
    phone: "+91 88005 22110",
    email: "vikram@desaicontractors.in",
    city: "Ahmedabad",
    product: "Textured Copper Panel",
    quantity: "220 panels",
    projectType: "Corporate Office",
    message: "Boardroom feature wall, need samples couriered.",
    date: "2026-08-24",
    status: "Completed",
    notes: ["Order fulfilled and dispatched.", "Customer confirmed delivery."],
  },
  {
    id: "bo-6",
    customerName: "Ishaan Roy",
    company: "Roy Design Studio",
    phone: "+91 99887 65432",
    email: "ishaan@roydesignstudio.com",
    city: "Kolkata",
    product: "Copper Mosaic",
    quantity: "80 sheets",
    projectType: "Boutique Retail",
    message: "Store front accent wall — budget is tight, please advise best pricing.",
    date: "2026-08-19",
    status: "Cancelled",
    notes: ["Client postponed project to next quarter."],
  },
];

export const contactMessages: ContactMessage[] = [
  {
    id: "cm-1",
    name: "Neha Joshi",
    email: "neha.joshi@gmail.com",
    phone: "+91 97654 32109",
    subject: "Sample request",
    message: "Could you send physical samples of the Rose Copper Tile before I place an order?",
    date: "2026-09-12",
    status: "Unread",
  },
  {
    id: "cm-2",
    name: "Karan Malhotra",
    email: "karan.m@outlook.com",
    phone: "+91 90000 12121",
    subject: "Lead time question",
    message: "What's the current lead time for Hammered Copper Panels in the Dark finish?",
    date: "2026-09-11",
    status: "Read",
  },
  {
    id: "cm-3",
    name: "Sana Iqbal",
    email: "sana.iqbal@designhaus.in",
    phone: "+91 91111 34343",
    subject: "Trade / dealer enquiry",
    message: "We run a design studio in Pune and would like to discuss a dealer partnership.",
    date: "2026-09-09",
    status: "Replied",
  },
  {
    id: "cm-4",
    name: "Manav Sethi",
    email: "manav.sethi@yahoo.com",
    phone: "+91 93333 56789",
    subject: "General question",
    message: "Does copper tiling need any special maintenance in humid coastal climates?",
    date: "2026-09-07",
    status: "Unread",
  },
];

export const dashboardStats = {
  totalProducts: products.length,
  featuredProducts: products.filter((p) => p.featured).length,
  bulkInquiries: bulkOrders.length,
  contactMessages: contactMessages.length,
};

export const productViewsChart = [
  { month: "Apr", views: 1240 },
  { month: "May", views: 1890 },
  { month: "Jun", views: 2100 },
  { month: "Jul", views: 2460 },
  { month: "Aug", views: 3020 },
  { month: "Sep", views: 3540 },
];

export const bulkInquiriesChart = [
  { month: "Apr", inquiries: 4 },
  { month: "May", inquiries: 7 },
  { month: "Jun", inquiries: 5 },
  { month: "Jul", inquiries: 9 },
  { month: "Aug", inquiries: 12 },
  { month: "Sep", inquiries: 6 },
];

export const marketplaceClicksChart = [
  { name: "Amazon", clicks: 1840 },
  { name: "Flipkart", clicks: 1320 },
];

export const companySettings = {
  name: "COPPERA",
  logoInitial: "C",
  phone: "+91 98765 43210",
  email: "hello@coppera.in",
  address: "Plot 14, Industrial Estate, Lower Parel, Mumbai, Maharashtra 400013",
  instagram: "https://instagram.com/coppera",
  facebook: "https://facebook.com/coppera",
  linkedin: "https://linkedin.com/company/coppera",
  amazonStoreUrl: "https://www.amazon.in/s?k=coppera",
  flipkartStoreUrl: "https://www.flipkart.com/search?q=coppera",
  whatsapp: "https://wa.me/919876543210",
};
