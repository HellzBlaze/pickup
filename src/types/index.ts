
export interface CustomizationOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

export interface Customization {
  id: string;
  name: string; // e.g., "Size", "Toppings"
  type: 'single' | 'multiple'; // single choice (radio) or multiple choice (checkbox)
  options: CustomizationOption[];
  defaultOption?: string; // id of default option for single type
}

export interface MenuItemType {
  id: string;
  name:string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  customizations?: Customization[];
  dataAiHint?: string;
}

export interface CategoryType {
  id: string;
  name: string;
  items: MenuItemType[];
}

export interface CartItemType extends MenuItemType {
  quantity: number;
  selectedCustomizations?: {
    [customizationId: string]: CustomizationOption | CustomizationOption[]; // single or multiple
  };
  finalPrice: number; // Price after customizations and quantity
}

export interface OrderHistoryItem {
  dishName: string;
  quantity: number;
  date: string; // ISO date string
}

export interface DeliveryInfo {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  deliveryInstructions?: string;
}

export type OrderStatus = 'Waiting' | 'Preparing' | 'Prepared' | 'Served' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid (Cash)' | 'Refunded' | 'Paid (Online)';

export interface Order {
  id: string;
  customerName: string;
  total: number;
  items: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  date: string; // ISO date string
}

export interface HistoricalDayOrders {
  date: string; // YYYY-MM-DD format for the day of archival
  orders: Order[];
}
