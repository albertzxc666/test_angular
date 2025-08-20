export interface Product {
  id: string;
  title: string;        // название товара 
  price: number;
  description: string;
  category: string;     // категория товара
  image: string;
  rating?: {            
    rate: number;
    count: number;
  };
}