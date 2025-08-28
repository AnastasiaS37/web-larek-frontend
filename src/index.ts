import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/models/BasketData';
import { CustomerData } from './components/models/CustomerData';
import { ItemsData } from './components/models/ItemsData';
import { Basket } from './components/views/Basket';
import { BasketItem, GalleryItem, ModalItem } from './components/views/Card';
import { OrderForm } from './components/views/Form';
import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { Modal } from './components/views/Modal';
import './scss/styles.scss';
import { IItem } from './types';
import { API_URL, CDN_URL, items, user } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const ItemsModel = new ItemsData(events);
const BasketModel = new BasketData(events);
// const UserModel = new CustomerData(events);

const api = new AppApi(CDN_URL, API_URL);
const itemGalleryTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const itemPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const itemBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderFormTemplate = document.querySelector('#order') as HTMLTemplateElement;

const page = new Gallery(document.querySelector('.page__wrapper') as HTMLElement, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);
const header = new Header(document.querySelector('.header') as HTMLElement, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

// Получение данных о товарах с сервера
api.getItemList()
    .then(data => {
        ItemsModel.setItems(data);
        // console.log(ItemsModel);
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

//  Открытие модального окна с карточкой товара
events.on('card:open', ({id}: {id: string}) => {
    const selectedItem = ItemsModel.getItemById(id);
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
    const formHTML = new OrderForm(cloneTemplate(orderFormTemplate), events).render();
    modal.render({
        content: formHTML
    })
});




// Блокировка и разблокирвока прокрутки страницы при открытии модального окна
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});


//// Проверка работы модели данных

// ItemsModel.setItems(items);
// console.log(ItemsModel);
// console.log('Hi', ItemsModel.getItems());
// const TestCard = {
//     "id": "54df7dcb-1213-4b3c-ab61-92ed5f845535",
//     "description": "Измените локацию для поиска работы.",
//     "image": "/Polygon.svg",
//     "title": "Портативный телепорт",
//     "category": "другое",
//     "price": 100000
// }
// const TestCard2 = {
//     "id": "c101ab44-ed99-4a54-990d-47aa2bb4e7d9",
//     "description": "Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.",
//     "image": "/Shell.svg",
//     "title": "HEX-леденец",
//     "category": "другое",
//     "price": 1450
// }
// ItemsModel.setItem(TestCard);
// console.log(ItemsModel.getItem());

// UserModel.setData(user);
// console.log(UserModel);

// BasketModel.addItem(TestCard);
// BasketModel.addItem(TestCard2);
// console.log(BasketModel.getItems())
// // BasketModel.deleteItem(TestCard.id);
// console.log(BasketModel.getTotalPrice());
// console.log(BasketModel.getTotalItems());
// console.log(BasketModel.isInBasket(TestCard2.id));