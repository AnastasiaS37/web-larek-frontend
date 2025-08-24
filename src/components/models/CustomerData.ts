import { ICustomer } from "../../types";
import { IEvents } from "../base/events";

export class CustomerData {
    email: string;
    phone: string;
    payment: 'online' | 'cash' | '';
    address: string;

    constructor(protected events: IEvents) {

    }

    setData(data: ICustomer) {}

    getData(): ICustomer {}

    validateData(data: ICustomer) {}
}