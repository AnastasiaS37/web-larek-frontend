import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IBasket {
    content: HTMLElement[];
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

        this.basketButton.addEventListener('click', () => this.events.emit('basket:submit'));
    }

    set content(items: HTMLElement[]) {
        if (items.length) {
            this.contentElement.replaceChildren(...items);
            this.setDisabled(this.basketButton, false);
        } else {
            this.contentElement.replaceChildren(createElement<HTMLParagraphElement>('p', {textContent: 'Корзина пуста'}));
			this.setDisabled(this.basketButton, true);
        }
    }

    set price(value: number) {
        this.setText(this.priceElement, `${value} синапсов`);
    }
}