import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ISuccess {
    total: number;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected descriptionElement: HTMLElement;
    protected successCloseButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.successCloseButton = ensureElement('.order-success__close', this.container) as HTMLButtonElement;
        this.descriptionElement = ensureElement('.order-success__description', this.container);

        this.successCloseButton.addEventListener('click', actions.onClick);
    }

    set total(value: number) {
        this.setText(this.descriptionElement, `Списано ${value} синапсов`);
    }
}