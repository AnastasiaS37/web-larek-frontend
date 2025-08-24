import { Api } from './base/api';
import { IItem, IItemList, IOrder, IOrderResult} from "../types";

export class AppApi extends Api {

    constructor(baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
    }

    getItem(): Promise<IItem> {}

    getItemList(): Promise<IItemList[]> {}

    placeOrder(order: IOrder): Promise<IOrderResult> {}

}