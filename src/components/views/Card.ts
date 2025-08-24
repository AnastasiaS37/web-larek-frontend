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

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.itemTitle = ensureElement('.card__title', this.container);
        this.itemPrice = ensureElement('.card__price', this.container);
    }

    set title(value: string) {}

    set price(value: number | null) {}

}

export class GalleryItem extends Card {
    protected itemImage: HTMLImageElement;
    protected itemCategory: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemImage = ensureElement('.card__image', this.container) as HTMLImageElement;
        this.itemCategory = ensureElement('.card__category', this.container);
    }

    set image(value: string) {}

    set category(value: string) {}
}

export class ModalItem extends GalleryItem {
    protected itemDescription: HTMLElement;
    protected itemButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemDescription = ensureElement('.card__text', this.container);
        this.itemButton = ensureElement('.card__button', this.container) as HTMLButtonElement;
    }

    set description(value: string) {}

    set buttonText(value: string) {} // !!
}

export class BasketItem extends Card {
    protected itemButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.itemButton = ensureElement('.card__button', this.container) as HTMLButtonElement;
    }

    set itemNumber(value: number) {}

}