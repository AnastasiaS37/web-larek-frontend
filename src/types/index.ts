export interface IItem {
    id: string;
    title: string;
    image: string;
    price: number | null;
    category: string;
    description: string;
}

export interface IForm {
    valid: boolean;
    errors: string[];
}

export interface ICustomer {
    email: string;
    phone: string;
    payment: "online" | "cash" | "";
    address: string;
}

export interface IOrder extends ICustomer {
    total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
    total: number;
}