import { Address } from "./address";

export type CustomerOrderStatus =  'pending' | 'done' | 'canceled';

export type CustomerOrderDeliveryStatus =  'pending' | 'shipped' | 'delivered'  | 'abort' | 'canceled';


export class Customer {
    id?: number;
    phone_number?: string;
    email?: string;
    invoice_address?: Address;
    delivery_address?: Address;
    customer_orders?: CustomerOrder[];
    customer_payment_methods?: CustomerPaymentMethod[];

    constructor(email?: string, phone_number?: string, id?: number, invoice_address?: Address, delivery_address?: Address){
        this.id = id;
        this.phone_number = phone_number;
        this.email = email;
        this.invoice_address = invoice_address;
        this.delivery_address = delivery_address;
    }
}

export interface CustomerOrder {
    id?: number;
    date?: Date;
    total_price?: number;
    status?: CustomerOrderStatus;
    Products?: CustomerOrderProduct[];
    customer_order_invoice?: CustomerOrderInvoice;
    customer_order_deliveries?: CustomerOrderDelivery[];
}

export interface CustomerOrderProduct {
    id: number;
    name?: string;
    number?: string;
    sale_price?: number;
    short_details?: string;
    product_picture_miniature?: string;
    product_has_customer_order?: ProductHasCustomerOrder;
}

export interface ProductHasCustomerOrder {
    product_variant_id?: number;
    product_size_id?: number;
    product_order_quantity?: number;
    product_order_comment?: string;
}

export interface CustomerOrderInvoice {
    id: number;
    number: string;
    due_date: Date;
    creation_date: Date;
    status: CustomerOrderStatus;
    payment?: CustomerPayment;
}

export interface CustomerOrderDelivery {
    id: number;
    number: string;
    due_date: Date;
    creation_date: Date;
    status: CustomerOrderDeliveryStatus;
    delivery_date: Date;
}

export interface CustomerPayment {
    id: number;
    date: Date;
    amount: number;
    method: CustomerPaymentMethod;
}

export interface CustomerPaymentMethod {
    id: number;
    name:string;
    description: string;
}