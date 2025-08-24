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
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.closeButton = ensureElement<HTMLElement>('.order-success__close', this.container) as HTMLButtonElement;
        this.descriptionElement = ensureElement('.order-success__description', this.container);

        if (actions?.onClick) {
            this.closeButton.addEventListener('click', actions.onClick);
        }
    }
}