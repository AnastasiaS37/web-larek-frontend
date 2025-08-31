import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class BasketData {
    protected ItemsArray: IItem[] = [];
    
    constructor(protected events: IEvents) {}

    getItems(): IItem[] {
        return this.ItemsArray;
    }

    addItem(item: IItem) {
        this.ItemsArray.push(item);
        this.events.emit('basket:changed');
    }

    deleteItem(id: string) {
        this.ItemsArray = this.ItemsArray.filter(item => item.id !== id);
        this.events.emit('basket:changed');
    }

    getTotalPrice(): number {
        return this.ItemsArray.reduce((sum, item) => sum + item.price, 0);
    }

    getTotalItems(): number {
        return this.ItemsArray.length;
    }
    
    isInBasket(id: string): boolean {
        return this.ItemsArray.some(item => item.id === id);
    }

    clearBasket() {
        this.ItemsArray.forEach(item => {
            this.deleteItem(item.id);
        });
    }

}