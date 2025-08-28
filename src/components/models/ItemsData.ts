import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class ItemsData {
    protected ItemsArray: IItem[] = [];
    protected SelectedCard: IItem;

    constructor(protected events: IEvents) {}

    setItems(items: IItem[]) {
        this.ItemsArray = items;
        this.events.emit('items:changed');
    }

    getItems(): IItem[] {
        return this.ItemsArray;
    }

    setItem(item: IItem) {
        this.SelectedCard = item;
        this.events.emit(`card:selected`);
    }

    getItem(): IItem {
        return this.SelectedCard;
    }

    getItemById(id: string): IItem {
        return this.ItemsArray.find(item => item.id === id);
    }
}