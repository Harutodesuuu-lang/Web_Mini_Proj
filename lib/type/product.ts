export type ProductResponse = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: Category;
  images: string[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
};
