import { ICustomer } from "../../types";
import { IEvents } from "../base/events";

type TPayment = 'online' | 'cash' | '';

export class CustomerData {
    email: string;
    phone: string;
    payment: TPayment;
    address: string;
    formErrors: Partial<Record<keyof ICustomer, string>> = {};

    constructor(protected events: IEvents) {}

    setField(field: keyof ICustomer, value: string) {
        if (field === 'payment') {
            this[field] = value as TPayment;
            this.events.emit('payment:changed', {value: value});
        } else {
            this[field] = value;
        }
    }

    getUserData(): ICustomer {
        const data = {
            email: this.email,
            phone: this.phone,
            payment: this.payment,
            address: this.address,
        }
        return data;
    }

    validateData() {
        const errors: typeof this.formErrors = {};
        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
        }
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
        }
        this.formErrors = errors;
        return this.formErrors;
    }

    clearData() {
        const data = this.getUserData();
        (Object.keys(data) as (keyof ICustomer)[]).forEach((key) => {
            this.setField(key, '');
        });
    }
}