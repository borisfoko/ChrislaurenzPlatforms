import { Address } from "./address";

export type SupplierInvoiceStatus =  'pending' | 'processed' | 'done' | 'canceled';

export interface Supplier {
    id: number;
    number: string;
    name: string;
    contractStartDate: Date;
    email?: string;
    phoneNumber?: string;
    telNumber?: string;
    address?: Address;
}

export interface SupplierDelivery {
    id: number;
    number: string;
    date?: Date;
    noa?: number;
    pice?: number;
    weight?: number;
    supplier: Supplier;
}

export interface SupplierInvoice {
    id: number;
    number: string;
    price: number;
    paidPrice: number;
    date?: Date;
    dueDate?: Date;
    deliveryStatus?: SupplierInvoiceStatus;
    supplier: Supplier;
}