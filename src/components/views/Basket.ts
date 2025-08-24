import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasket {
    content: HTMLElement
    price: number;
}

export class Basket extends Component<IBasket> {
    protected contentElement: HTMLElement;
    protected basketButton: HTMLButtonElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.contentElement = ensureElement('.basket__list', this.container);
        this.basketButton = ensureElement('.basket__button', this.container) as HTMLButtonElement;
        this.priceElement = ensureElement('.basket__price', this.container);
    }

    set content(items: HTMLElement[]) {}

    set price(value: number) {}
}