export interface ProductVariant {
  model: string;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  thickness_cm: number;
  weight_kg: number;
  price: number;
}

export interface SiteProduct {
  id: string;
  name: string;
  slug: string;
  variants: ProductVariant[];
}

export interface Finish {
  name: string;
  hex: string;
}

export interface ProductPhoto {
  name: string;
  finish: string;
  image: string;
  familySlug: string;
}

export const brand = {
  logo: "/images/logo.png",
  adminLogo: "/images/logo-admin.png",
  heroVideo: "/videos/hero.mp4",
  collectionVideo: "/videos/collection.mp4",
  name: "Jardinière Béton",
  tagline: "Indoor & Outdoor · Fabriqué au Maroc",
  subtitle: "Béton allégé",
  city: "Maroc",
  email: "contact@jardinierebeton.ma",
  whatsapp: "+212600000000",
  whatsappMessage:
    "Bonjour, je souhaite des informations sur vos jardinières en béton.",
  delivery: "Livraison partout au Maroc",
};

export const navLinks = [
  { href: "/produits", label: "Produits" },
  { href: "/#usages", label: "Usages" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/#contact", label: "Contact" },
];

export const productPhotos: ProductPhoto[] = [
  {
    name: "Jardinière Rectangle",
    finish: "Gris Ciment",
    image: "/images/products/rectangle-gris-ciment.jpg",
    familySlug: "jardiniere-rectangle",
  },
  {
    name: "Jardinière Rectangle",
    finish: "Terracotta",
    image: "/images/products/rectangle-terracotta.jpg",
    familySlug: "jardiniere-rectangle",
  },
  {
    name: "Jardinière Rectangle",
    finish: "Sable",
    image: "/images/products/rectangle-sable.jpg",
    familySlug: "jardiniere-rectangle",
  },
  {
    name: "Jardinière Rectangle",
    finish: "Anthracite",
    image: "/images/products/rectangle-anthracite.jpg",
    familySlug: "jardiniere-rectangle",
  },
  {
    name: "Jardinière Rectangle",
    finish: "Ocre",
    image: "/images/products/rectangle-ocre.jpg",
    familySlug: "jardiniere-rectangle",
  },
  {
    name: "Jardinière Carrée",
    finish: "Gris Ciment",
    image: "/images/products/carree-gris-ciment.jpg",
    familySlug: "jardiniere-carree",
  },
];

export const values = [
  {
    title: "Robuste",
    description:
      "Plus de résistance, moins de poids — une structure fiable au quotidien.",
  },
  {
    title: "Béton allégé",
    description:
      "Facile à déplacer et à installer, sans compromis sur la solidité.",
  },
  {
    title: "Résistant",
    description:
      "Conçu pour affronter le soleil, la pluie et les variations de température.",
  },
  {
    title: "Fabriqué au Maroc",
    description:
      "Un savoir-faire local, avec des matériaux sélectionnés pour durer.",
  },
];

export const finishes: Finish[] = [
  { name: "Gris Ciment", hex: "#B8B2A7" },
  { name: "Anthracite", hex: "#2A2A2A" },
  { name: "Terracotta", hex: "#A85A3E" },
  { name: "Sable", hex: "#C8B89A" },
  { name: "Ocre", hex: "#C4A35A" },
  { name: "Bleu Atlas", hex: "#4A6FA5" },
];

export const usages = [
  {
    title: "Terrasse & jardin",
    description:
      "Structurez votre extérieur avec des bordures végétales, des massifs ou des séparations élégantes.",
    suggest: "→ Rectangle Standard · Carrée L",
  },
  {
    title: "Villa & riad",
    description:
      "Cours intérieures, entrées et abords de piscine. Finitions qui s'intègrent aux ambiances marocaines.",
    suggest: "→ Rectangle basse L · Carrée M",
  },
  {
    title: "Hôtel & restaurant",
    description:
      "Terrasses, halls et espaces d'accueil. Formats longs pour un rendu professionnel et durable.",
    suggest: "→ Jardinière Écran · Standard L",
  },
  {
    title: "Bureau & commerce",
    description:
      "Halls, showrooms et boutiques. Léger à déplacer, adapté à l'intérieur comme à l'extérieur.",
    suggest: "→ Carrée M · Rectangle Standard S",
  },
];

export const contactSubjects = [
  "Demande de devis",
  "Jardinière rectangle",
  "Jardinière carrée",
  "Question livraison",
  "Autre",
];

export const products: SiteProduct[] = [
  {
    id: "1",
    name: "Jardinière Rectangle",
    slug: "jardiniere-rectangle",
    variants: [
      {
        model: "Jardinière basse M",
        length_cm: 80,
        width_cm: 30,
        height_cm: 40,
        thickness_cm: 3,
        weight_kg: 46.2,
        price: 1386,
      },
      {
        model: "Jardinière basse L",
        length_cm: 120,
        width_cm: 30,
        height_cm: 40,
        thickness_cm: 3,
        weight_kg: 65,
        price: 1950,
      },
      {
        model: "Jardinière Standard S",
        length_cm: 80,
        width_cm: 35,
        height_cm: 60,
        thickness_cm: 3,
        weight_kg: 69,
        price: 2070,
      },
      {
        model: "Jardinière Standard M",
        length_cm: 100,
        width_cm: 35,
        height_cm: 60,
        thickness_cm: 3,
        weight_kg: 83,
        price: 2490,
      },
      {
        model: "Jardinière Standard L",
        length_cm: 120,
        width_cm: 35,
        height_cm: 60,
        thickness_cm: 3,
        weight_kg: 96,
        price: 2880,
      },
      {
        model: "Jardinière Ecran",
        length_cm: 120,
        width_cm: 40,
        height_cm: 80,
        thickness_cm: 3,
        weight_kg: 129,
        price: 3870,
      },
    ],
  },
  {
    id: "2",
    name: "Jardinière Carrée",
    slug: "jardiniere-carree",
    variants: [
      {
        model: "Jardinière carré M",
        length_cm: 60,
        width_cm: 60,
        height_cm: 40,
        thickness_cm: 3,
        weight_kg: 55,
        price: 1650,
      },
      {
        model: "Jardinière carré L",
        length_cm: 80,
        width_cm: 80,
        height_cm: 40,
        thickness_cm: 3,
        weight_kg: 81,
        price: 2430,
      },
    ],
  },
];
