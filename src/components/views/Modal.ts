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
    }

    set content(item: HTMLElement) {}

}