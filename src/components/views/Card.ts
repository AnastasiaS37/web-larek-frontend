import { IItem } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IComponent extends IItem {
    buttonText: string;
    itemNumber: number;
}

export class Card extends Component<Partial<IComponent>> {
    protected itemTitle: HTMLElement;
    protected itemPrice: HTMLElement;
    protected itemId: string;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.itemTitle = ensureElement('.card__title', this.container);
        this.itemPrice = ensureElement('.card__price', this.container);
    }

    set title(value: string) {
        this.setText(this.itemTitle, value);
    }

    set price(value: number | null) {
        if (value === null) {
            this.setText(this.itemPrice, 'Бесценно');
        } else {
            this.setText(this.itemPrice, `${value} синапсов`);
        }
    }

    set id(value: string) {
        this.itemId = value;
    }

}

export class GalleryItem extends Card {
    protected itemImage: HTMLImageElement;
    protected itemCategory: HTMLElement;
    protected itemButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.itemCategory = ensureElement('.card__category', this.container);

        this.container.addEventListener('click', () => this.events.emit('card:open', {id: this.itemId}));
    }

    set image(value: string) {
        this.setImage(this.itemImage, value, this.title);
    }

    set category(value: string) {
        this.setText(this.itemCategory, value);
    }

}

export class ModalItem extends GalleryItem {
    protected itemDescription: HTMLElement;
    protected itemButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemDescription = ensureElement('.card__text', this.container);
        this.itemButton = ensureElement('.card__button', this.container) as HTMLButtonElement;

        this.itemButton.addEventListener('click', () => this.events.emit('selectedItem:basketAction', {id: this.itemId}));
    }

    set description(value: string) {
        this.setText(this.itemDescription, value);
    }

    set buttonText(value: string) {
        if (this.itemButton.disabled) return;
        this.setText(this.itemButton, value);
    }

    set price(value: number | null) {
        super.price = value;
        if (value === null) {
            this.setDisabled(this.itemButton, true);
            this.setText(this.itemButton, 'Недоступно');
        } else {
            this.setDisabled(this.itemButton, false);
        }
    }
}

export class BasketItem extends Card {
    protected itemButton: HTMLButtonElement;
    protected itemIndex: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemButton = ensureElement('.card__button', this.container) as HTMLButtonElement;
        this.itemIndex = ensureElement('.basket__item-index', this.container);

        this.itemButton.addEventListener('click', () => this.events.emit('selectedItem:basketAction', {id: this.itemId}));
    }

    set itemNumber(value: number) {
        this.setText(this.itemIndex, value);
    }

}