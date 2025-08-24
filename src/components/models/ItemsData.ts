import { IItem } from "../../types";
import { IEvents } from "../base/events";

export class ItemsData {
    protected ItemsArray: IItem[];
    protected SelectedCard: IItem;

    constructor(protected events: IEvents) {

    }

    setItems(items: IItem[]) {}

    getItems(): IItem[] {}

    setItem(item: IItem) {}

    getItem(): IItem {}
}