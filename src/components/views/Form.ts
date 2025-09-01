import { IForm, ICustomer } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

export class Form<T> extends Component<IForm> {
    protected buttonElement: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
        super(container);
        this.buttonElement = ensureElement('button[type="submit"]', this.container) as HTMLButtonElement;
        this.errorElement = ensureElement('.form__errors', this.container) as HTMLSpanElement;

        this.container.addEventListener('input', (evt: Event) => {
            const target = evt.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        this.buttonElement.addEventListener('click', (evt: Event) => {
            evt.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:changed`, {
            field,
            value
        });
    }

    set valid(value: boolean) {
        this.buttonElement.disabled = !value;
    }

    set errors(value: string[]) {
        this.setText(this.errorElement, value.filter(i => !!i).join('; '));
    }

    render(state: Partial<T> & Partial<IForm>) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}

export class OrderForm extends Form<Partial<ICustomer>> {
    protected cardButtonElement: HTMLButtonElement;
    protected cashButtonElement: HTMLButtonElement;
    protected adressInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
        super(container, events);
        this.cardButtonElement = ensureElement('button[name="card"]', this.container) as HTMLButtonElement;
        this.cashButtonElement = ensureElement('button[name="cash"]', this.container) as HTMLButtonElement;
        this.adressInput = ensureElement('.form__input', this.container) as HTMLInputElement;

        this.cardButtonElement.addEventListener('click', (evt: Event) => {
            const target = evt.target as HTMLButtonElement;
            this.onInputChange('payment' as keyof ICustomer, target.name);
        });

        this.cashButtonElement.addEventListener('click', (evt: Event) => {
            const target = evt.target as HTMLButtonElement;
            this.onInputChange('payment' as keyof ICustomer, target.name);
        });

    }

    changeButtonState(isCard: boolean, isCash: boolean) {
        this.toggleClass(this.cardButtonElement, 'button_alt-active', isCard);
        this.toggleClass(this.cashButtonElement, 'button_alt-active', isCash);
    }

    set address(value: string) {
        this.adressInput.value = value;
    }
}

export class ContactForm extends Form<Partial<ICustomer>> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(protected container: HTMLFormElement, protected events: EventEmitter) {
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