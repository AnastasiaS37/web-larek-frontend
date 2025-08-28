import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IForm {
    valid: boolean;
    address: string;
    email: string;
    phone: string;
}

export class Form extends Component<Partial<IForm>> {
    protected buttonElement: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.buttonElement = ensureElement('button[type="submit"]', this.container) as HTMLButtonElement;
    }

    set valid(value: boolean) {}
}

export class OrderForm extends Form {
    protected cardButtonElement: HTMLButtonElement;
    protected cashButtonElement: HTMLButtonElement;
    protected adressInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.cardButtonElement = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
        this.cashButtonElement = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
        this.adressInput = ensureElement('.form__input', this.container) as HTMLInputElement;
    }

    set adress(value: string) {
        this.adressInput.value = value;
    }
}

export class ContactForm extends Form {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container, events);
        this.emailInput = ensureElement('input[name="email"]', this.container) as HTMLInputElement;
        this.phoneInput = ensureElement('input[name="phone"]', this.container) as HTMLInputElement;
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }
}