import { Supplier } from './supplier'
import { Discount } from './discount';

// Product Colors
export type ProductColor = 'white' | 'black' | 'red' | 'green' | 'purple' | 'yellow' | 'blue' | 'gray' | 'orange' | 'pink';

// Product Size
//export type ProductSize = 'M' | 'L' | 'XL';

// Product Tag
export type ProductTags = 'adidas' | 'nike' | 'puma' | 'lifestyle' | 'caprese';

// Product
export interface Product {
  id?: number;
  number?: string;
  name?: string;
  price?: number;
  salePrice?: number;
  new?: boolean;
  sale?: boolean;
  shortDetails?: string;
  description?: string;
  type?: ProductType;
  supplier?: Supplier;
  sizes?: [];
  group?: ProductGroup;
  category?: ProductCategory;
  collection?: ProductCollection;
  stock?: number;
  colors?: ProductColor[];
  tags?: ProductTags[];
  pictures?: string[];
  variants?: ProductVariant[];
  discounts?: Discount[];
}

// Product Category
export interface ProductCategory {
  id: number;
  name: string;
  description?: string;
  side_picture?: string;
  mega_picture?: string;
  sub_banner_picture?: string;
  theme?: string;
}

// Product Collection
export interface ProductCollection {
  id: number;
  name: string;
  description?: string;
}

// Product Group
export interface ProductGroup {
  id: number;
  name: string;
  description?: string;
  sale_priority?: number;
}

// Product Size
export interface ProductSize {
  id: number;
  type?: string;
  value_int?: string;
  value_eu?: string;
  value_us?: string;
  value_uk?: string;
  value_fr?: string;
  value_it?: string;
  details?: string;
}

// Product Type
export interface ProductType {
  id: number;
  number: string;
  name?: string;
  description?: string;
}

// Product Variant
export interface ProductVariant {
  id: number;
  name?: string;
  color?: string;
  image?: string[];
}

// Color Filter
export interface ColorFilter {
  color?: ProductColor;
}

// Tag Filter
export interface TagFilter {
  tag?: ProductTags
}