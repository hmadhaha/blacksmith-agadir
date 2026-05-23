export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  sort_order: number;
  created_at: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category_id: string;
  featured: boolean;
  popular: boolean;
  ingredients: string;
  created_at: string;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  type: "image" | "video";
  category: string;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  text: string;
  source: "google" | "tripadvisor" | "direct";
  date: string;
}
