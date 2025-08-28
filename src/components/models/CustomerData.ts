import { ICustomer } from "../../types";
import { IEvents } from "../base/events";

export class CustomerData {
    email: string;
    phone: string;
    payment: 'online' | 'cash' | '';
    address: string;

    constructor(protected events: IEvents) {

    }

    setData(data: ICustomer) {
        Object.assign(this as object, data)
        // this.email = data.email;
        // this.phone = data.phone;
        // this.payment = data.payment;
        // this.address = data.address;
    }

    getData(): ICustomer {
        return this;
    }

    validateData(data: ICustomer) {}
}