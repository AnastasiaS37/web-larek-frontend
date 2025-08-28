import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";

interface IModal {
    content: HTMLElement
}

export class Modal extends Component<IModal> {
    protected contentElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);
        this.contentElement = ensureElement('.modal__content', this.container);
        this.closeButton = ensureElement('.modal__close', this.container) as HTMLButtonElement;

        this.closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this.contentElement.addEventListener('click', (event) => event.stopPropagation());
    }

    set content(item: HTMLElement) {
        this.contentElement.replaceChildren(item);
    }

    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }

    render(data: IModal): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}