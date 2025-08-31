import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/models/BasketData';
import { CustomerData } from './components/models/CustomerData';
import { ItemsData } from './components/models/ItemsData';
import { Basket } from './components/views/Basket';
import { BasketItem, GalleryItem, ModalItem } from './components/views/Card';
import { ContactForm, OrderForm } from './components/views/Form';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import { Success } from './components/views/Success';
import './scss/styles.scss';
import { ICustomer } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const ItemsModel = new ItemsData(events);
const BasketModel = new BasketData(events);
const CustomerModel = new CustomerData(events);
const api = new AppApi(CDN_URL, API_URL);

const itemGalleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const itemPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const itemBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactFormTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

const page = new Gallery(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderFormTemplate), events);
const contactForm = new ContactForm(cloneTemplate(contactFormTemplate), events);

// Получение данных о товарах с сервера
api.getItemList()
    .then(data => {
        ItemsModel.setItems(data);
    })
    .catch(err => {
        console.error(err);
    });

// Отображение галереи товаров
events.on('items:changed', () => {
    const itemsHTMLArray = ItemsModel.getItems().map(item =>
        new GalleryItem(cloneTemplate(itemGalleryTemplate), events).render(item)
    )
    page.render({
        catalog: itemsHTMLArray
    })
    header.render({
        counter: BasketModel.getTotalItems()
    })
});

// Изменение корзины
events.on('basket:changed', () => {
    header.render({
        counter: BasketModel.getTotalItems()
    })
    const itemsHTMLArray = BasketModel.getItems().map((item, index) => {
        const itemNumber = index + 1;
        return new BasketItem(cloneTemplate(itemBasketTemplate), events).render(Object.assign({...item, itemNumber}))
    });
    basket.render({
        content: itemsHTMLArray,
        price: BasketModel.getTotalPrice()
    });
});

// Добавление и удаление товара из корзины
events.on('selectedItem:basketAction', ({id}: {id: string}) => {
    if (!BasketModel.isInBasket(id)) {
        const addedItem = ItemsModel.getItemById(id);
        BasketModel.addItem(addedItem);
    } else {
        BasketModel.deleteItem(id);
    };
});

//  Выбор карточки для отображения в модальном окне
events.on('card:open', ({id}: {id: string}) => {
    const selectedItem = ItemsModel.getItemById(id);
    ItemsModel.setItem(selectedItem);
});

// Карточка для отображения в модальном окне добавлена в модель
events.on('card:selected', () => {
    const selectedItem = ItemsModel.getItem();
    const itemHTML = new ModalItem(cloneTemplate(itemPreviewTemplate), events).render({
        ...selectedItem,
        buttonText: BasketModel.isInBasket(selectedItem.id) ? 'Удалить из корзины' : 'Купить'
    });
    modal.render({
        content: itemHTML
    })
});

//  Открытие модального окна с корзиной
events.on('basket:open', () => {
    const itemsHTMLArray = BasketModel.getItems().map((item, index) => {
        const itemNumber = index + 1;
        return new BasketItem(cloneTemplate(itemBasketTemplate), events).render(Object.assign({...item, itemNumber}))
    });
    basket.render({
        content: itemsHTMLArray,
        price: BasketModel.getTotalPrice()
    });
    modal.render({
        content: basket.render()
    })
});

//  Открытие модального окна с формой заказа
events.on('basket:submit', () => {
    const formHTML = orderForm.render({
        address: '',
        valid: false,
        errors: []
    });
    modal.render({
        content: formHTML
    })
});

// Изменилось одно из полей формы order
events.on(/^order\..*:changed/, (data: { field: keyof ICustomer, value: string }) => {
    CustomerModel.setField(data.field, data.value);
    const currentErrors = CustomerModel.validateData();
    const errorTypes = Object.keys(currentErrors);
    if (!errorTypes.includes('payment') && !errorTypes.includes('address')) {
        orderForm.render({valid: true, errors: []});
    } else {
        orderForm.render({valid: false, errors: [currentErrors.address, currentErrors.payment]});
    }
});

// Изменился способ оплаты
events.on('payment:changed', ({value}: {value: string}) => {
    const isCard = (value === 'card');
    const isCash = !(value === 'card');
    orderForm.changeButtonState(isCard, isCash);
});

// Подтверждение формы заказа
events.on('order:submit', () => {
    const formHTML = contactForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
    });
    modal.render({
        content: formHTML
    })
});

// Изменилось одно из полей формы contacts
events.on(/^contacts\..*:changed/, (data: { field: keyof ICustomer, value: string }) => {
    CustomerModel.setField(data.field, data.value);
    const currentErrors = CustomerModel.validateData();
    const errorTypes = Object.keys(currentErrors);
    if (!errorTypes.includes('email') && !errorTypes.includes('phone')) {
        contactForm.render({valid: true, errors: []});
    } else {
        contactForm.render({valid: false, errors: [currentErrors.email, currentErrors.phone]});
    }
});

// Подтверждение оплаты
events.on('contacts:submit', () => {
    const userData = CustomerModel.getUserData();
    api.placeOrder({
        ...userData,
        total: BasketModel.getTotalPrice(),
        items: BasketModel.getItems().map(item => item.id)
    })
    .then((result) => {
        const successHTML = new Success(cloneTemplate(successTemplate), {
            onClick: () => {modal.close()}
        }).render({
            total: result.total
        });
        modal.render({
            content: successHTML
        });
        BasketModel.clearBasket();
        CustomerModel.clearData();
        orderForm.changeButtonState(false, false);
    })
    .catch(err => {
        console.error(err);
    });
});

// Блокировка и разблокирвока прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});