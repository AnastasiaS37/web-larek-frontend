import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class BasketData {
    protected ItemsArray: IItem[];
    
    constructor(protected events: IEvents) {
    
    }

    getItems(): IItem[] {}

    addItem(item: IItem) {}

    deleteItem(id: number) {}

    getTotalPrice(): number {}

    getTotalItems(): number {}
    
    isInBasket(id: number): boolean {}
}