# Project Structure:
- src/ — source files of the project
- src/components/ — JS components
- src/components/base/ — base code

Important files:
- src/pages/index.html — main page
- src/types/index.ts — types file
- src/index.ts — application entry point
- src/scss/styles.scss — root styles file
- src/utils/constants.ts — constants file
- src/utils/utils.ts — utilities file

## Data Types Used in the Application
`IItem` interface for product accounting:
interface IItem {
    id: string;
    title: string;
    image: string;
    price: number | null;
    category: string;
    description: string;
}

`ICustomer` interface for storing user data:
interface ICustomer {
    email: string;
    phone: string;
    payment: 'online' | 'cash' | '';
    address: string;
}

## Application Architecture

The project uses the MVP (Model-View-Presenter) pattern with the following layers:
1. Data Layer — responsible for storing and managing data
2. View Layer — responsible for rendering data in the UI
3. Presenter — connects the data and the view

### Base Classes

#### EventEmitter
Provides event handling. Allows emitting events and subscribing to them. This class is used in application layers to generate events and in the presenter to handle them.
Main methods:
- `on` - sets an event handler
- `off` - removes an event handler
- `emit` - emits an event
- `trigger` - returns a function that triggers the required event when called

#### Api
Implements the base logic for sending requests. The constructor receives the base server URL and an optional object with request headers.
Main methods:
- `get` - performs a GET request and returns a promise with the server response
- `post` - takes a data object and sends it to the server. By default, performs a POST request, but the method can be overridden by passing a third parameter

### Data Layer

#### ItemsData
The ItemsData class is responsible for storing the array of all products (catalog) and the product card selected by the user for viewing. Fields:
- protected field `ItemsArray` - stores an array of objects of type `IItem`
- protected field `SelectedCard` - stores an object of type `IItem` (the selected card) <br>
The class constructor accepts an instance of the event broker. <br>
Methods:
- `setItems`, which takes an array of objects of type `IItem` as a parameter — allows saving the array of products
- `getItems`, which returns an array of objects of type `IItem` — allows retrieving the array of products
- `setItem`, which takes an object of type `IItem` as a parameter — allows saving the product card selected by the user
- `getItem`, which returns an object of type `IItem` — allows retrieving the selected product card
- `getItemById`, which takes a product id (string) as a parameter and returns an object of type `IItem` — allows retrieving a product card by its id

#### BasketData
The Basket class is responsible for storing the array of products in the cart. Fields:
- protected field `ItemsArray` - stores an array of objects of type `IItem` <br>
The class constructor accepts an instance of the event broker. <br>
Methods:
- `getItems`, which returns an array of objects of type `IItem` — allows retrieving products in the cart
- `addItem`, which takes an object of type `IItem` — allows adding a product to the cart
- `deleteItem`, which takes a product id — allows removing a product from the cart
- `getTotalPrice`, which returns a number — allows retrieving the total price of products
- `getTotalItems`, which returns a number — allows retrieving the number of products in the cart
- `isInBasket`, which takes a product id and returns a boolean — allows checking if a product is in the cart
- `clearBasket` - clears the cart

#### CustomerData
The CustomerData class is responsible for storing customer data. Fields:
- `email` - stores a value of type string
- `phone` - stores a value of type string
- `ayment` - has type `TPayment` and can take one of three values: 'online', 'cash', or '' (empty string)
- `address` - stores a value of type string
- `formErrors` - is an object of type `Partial<Record<keyof ICustomer, string>>`, stores validation errors <br>
The class constructor accepts an instance of the event broker. <br>
Methods:
- `setField`, which takes one of the keys of `ICustomer` and a string value — allows saving customer data
- `getUserData`, which returns an object of type `ICustomer` — allows retrieving customer data
- `validateData` - returns a `formErrors` object containing validation errors
- `clearData` - clears the stored customer data

### View Layer
All view classes are responsible for rendering the passed data inside a container (DOM element).

#### Base Class Component
The `Component` class is the base for all view classes. It takes a generic type representing the data passed into the render method for displaying in the component. The constructor accepts a markup element that acts as the root container of the component. It contains a render method that saves the received data into component fields via setters and returns the updated container.

#### Header
The `Header` class is responsible for rendering the site header. It sets the cart counter value and attaches a listener to the cart icon.
Fields:
- counterElement: HTMLElement - counter element
- basketButton: HTMLButtonElement - cart element <br>
Method:
- set counter(value: number) - sets the counter value

#### Gallery
The `Gallery` class is responsible for rendering the list of product cards (catalog).
Field:
- catalogElement: HTMLElement - catalog element <br>
Methods:
- set catalog(items: HTMLElement[]) — inserts card elements into the container
- set locked(value: boolean) - locks/unlocks page scrolling when a modal window is open

#### Modal
The `Modal` class is responsible for rendering a modal window, the content of which may vary depending on the selected template. It attaches listeners to the close button and overlay clicks.
Fields:
- contentElement: HTMLElement - modal window element
- closeButton: HTMLButtonElement - modal window close button
Methods:
- set content(item: HTMLElement) - inserts content into the container
- open() - opens the modal window and emits a corresponding event
- close() - closes the modal window and emits a corresponding event
- render() - extends render method of base class by adding the modal window opening

#### Success
The `Success` class is responsible for displaying the successful purchase window. It attaches a listener to the continue button.
Fields:
- descriptionElement: HTMLElement
- closeButton: HTMLButtonElement
Method:
- set total(value: number) - sets the message with purchase total price

#### Basket
The `Basket` class is responsible for displaying the cart with selected products. It allows displaying a list of product cards and the total cost of the products in the cart.
Fields:
- contentElement: HTMLElement
- basketButton: HTMLButtonElement
- priceElement: HTMLElement
Methods:
- set content(items: HTMLElement[]) - sets into the container the array of HTML elements (product cards) passed as a parameter, or (in the case of an empty array) displays a message about the absence of products in the cart
- set price(value: number) - sets the total price value of the cart

#### Card
The `Card` class is a base class for `GalleryItem`, `ModalItem` and `BasketItem`, which are responsible for displaying a product card in different variants.
Fields:
- itemTitle: HTMLElement
- itemPrice: HTMLElement
- itemId: string
Methods:
- set title(value: string) - sets the card title (product name)
- set price(value: number | null) - sets the product price; can take a number or null for a free product
- set id(value: string) - sets the product id in order to pass it when generating events in child classes

#### GalleryItem
The `GalleryItem` class inherits from `Card` and is responsible for displaying a product card in the product catalog. It sets a listener for clicking on the card.
Fields:
- itemImage: HTMLImageElement
- itemCategory: HTMLElement
Methods:
- set image(value: string) - sets the product image
- set category(value: string) - sets the product category

#### ModalItem
The `ModalItem` class inherits from `GalleryItem` and is responsible for displaying a product card in a modal window. It sets a listener for clicking the add-to-cart button.
Fields:
- itemDescription: HTMLElement
- itemButton: HTMLButtonElement
Methods:
- set description(value: string) - sets the product description
- set buttonText(value: string) - sets the button text for adding/removing a product from the cart depending on its presence there
- set price(value: number | null) - extends the parent price method, making the add-to-cart button unavailable for a null-price product

#### BasketItem
The `BasketItem` class inherits from `Card` and is responsible for displaying a product card in the cart. It sets a listener on the remove button.
Fields:
- itemButton: HTMLButtonElement
- itemIndex: HTMLElement
Method:
- set itemNumber(value: number) - sets the sequential number of the product in the cart

#### Form
The `Form` class is a base class for `OrderForm` and `ContactForm`, which are responsible for displaying purchase forms. It sets an input event listener on form fields and a click listener on form submission.
Fields:
- buttonElement: HTMLButtonElement
- errorElement: HTMLElement
Methods:
- onInputChange(field: keyof T, value: string) - generates events with different names and parameters depending on the passed arguments
- set valid(value: boolean) - changes the button state depending on form validation
- set errors(value: string[]) - displays error text when the form is filled incorrectly
- render(state: Partial<T> & Partial<IForm>) - extends the base class render method by adding the display of error messages

#### OrderForm
The `OrderForm` class inherits from `Form` and is responsible for displaying the order form. It sets listeners on the buttons for selecting the payment type.
Fields:
- cardButtonElement: HTMLButtonElement
- cashButtonElement: HTMLButtonElement
- adressInput: HTMLInputElement
Methods:
- changeButtonState(isCard: boolean, isCash: boolean) - visualises the selected payment type
- set address(value: string) - sets the delivery address

#### ContactForm
The `ContactForm` class inherits from `Form` and is responsible for displaying the contact form.
Fields:
- emailInput: HTMLInputElement
- phoneInput: HTMLInputElement
Methods:
- set email(value: string) - sets the user email
- set phone(value: string) - sets the user phone number

### Communication Layer

#### AppApi
The `AppApi` class inherits from the base `Api` class and is responsible for working with the server.

### Component Interaction
The presenter code, describing the connection between data and presentation, is located in the main application script `index.ts`. Interaction is carried out through events generated using the event broker and handlers of these events.

An event-driven approach is used in the work. The list of events that can be generated in the system:

*Data Change Events (generated by data model classes)*
- `items:changed` - adding a list of products to the data model
- `card:selected` - changing the card opened in the modal window
- `basket:changed` - changing the state of the cart
- `payment:changed` - changing the payment method

*User Interaction Events (generated by view classes*
- `card:open` - selecting a card to display in a modal window
- `selectedItem:basketAction` - changing the state of a product in the cart
- `basket:open` - opening the cart modal window
- `basket:submit` - selecting checkout of the products in the cart
- `order.*.changed` - changing one of the fields of the order form
- `order:submit` - confirming the order form
- `contacts.*.changed` - changing one of the fields of the contacts form
- `contacts:submit` - confirming the contacts form (payment confirmation)
- `modal:open` - opening a modal window
- `modal:close` - closing a modal window

Interaction Example:
1. The user clicks on removing a product from the cart in the cart modal window. The `BasketItem` class reacts to the user action and generates the `selectedItem:basketAction` event.
2. The presenter processes the event and calls the `deleteItem` method of the `BasketData` class.
3. The model changes the data in the `ItemsArray` field of the `BasketData` class and generates the `basket:changed` event.
4. The presenter processes the event and calls the renders of the `Header` and the `Basket` classes, passing data from the model to them.
5. The `Header` and `Basket` classes are re-rendered, displaying the updated data.
