# Ecommerce API - Node.js & TypeScript

This is an **Ecommerce API** built with **Node.js** and **TypeScript** with express.js back end framework. The project provides a RESTful API to manage an ecommerce platform, including user authentication, product management, orders, and more.

## Installation

```bash
 npm install
 npm run build
 npm run dev
```

## Features

- **User Authentication**: Register, login, and authenticate users.
- **Product Management**: Create, read, update, and delete products.
- **Order Management**: Create and manage customer orders.
- **Category Management**: Categorize products for easier searching.
- **Cart Management**: Manage user shopping carts.
- **Typescript**: Fully typed backend API.
- **express request custom declaration** :Declared objects and add them to request object like (user , filterObj, ....)
- **Mongoose**: MongoDB for data storage with Mongoose ODM. also implementing interfaces for all schemas in DB
- **DTOS** : Adding dto for almost API created (request body ,params,query)
- **send mails to users** : like sending verification codes and so on ...
- **security best practice** : avoiding NoSQL injection Using mongo sanitizer , avoiding parameter pollution using **hpp** module , avoiding Dos attacks using **express-rate-limiter** , avoiding XSS using **XSS** module

## Technologies Used

- **Node.js**: Runtime environment.
- **Express.js**: Web framework for Node.js.
- **TypeScript**: Typed superset of JavaScript.
- **MongoDB**: NoSQL database.
- **Mongoose**: MongoDB object modeling for Node.js.
- **JWT**: JSON Web Token for authentication.
- **bcrypt**: Password hashing.
- **payTabs payment gateway integration**: simple reliable payment gateway integration that supports payment in egypt -**express-validator** : Adding a validation layer before go to data base which it save data base queries

## some API Endpoints

- POST /api/v1/auth/register - Register a new user.
- POST /api/v1/auth/login - Login user and return token.
- GET /api/v1/products - Get all products.
- POST /api/v1/products - Create a new product.
- GET /api/v1/products/:id - Get a single product.
- PUT /api/v1/products/:id - Update a product.
- DELETE /api/v1/products/:id - Delete a product.
- GET /api/v1/orders - Get all orders.
- POST /api/v1/orders - Create a new order.
- GET /api/v1/orders/:id - Get a single order.
- PUT /api/v1/orders/:id - Update an order.
- DELETE /api/v1/orders/:id - Delete an order.
- GET /api/v1/categories - Get all categories.
- POST /api/v1/categories - Create a new category.
- GET /api/v1/categories/:id - Get a single category.
- PUT /api/v1/categories/:id - Update a category.
- DELETE /api/v1/categories/:id - Delete a category.
- GET /api/v1/cart - Get user cart.
- POST /api/v1/cart - Add items to cart.
- PUT /api/v1/cart - Update cart items.
- DELETE /api/v1/cart/:id - Remove item from cart.

## payTabs integration

- **implementation**: initiating payment method and setting **paytabs_p2** package.
- **implementing payTabs types**: because **@types/paytabs_p2** is not supported so i create types for payTabs.
- **implementing webhook** : deploying website to get the request payload and signature sent by payTabs server (server to server call)
- **validating payTabs callback signature** : because web hook is a public API we need to validate the signature sent by payTabs server so we can make this API secure. we validating the signature using **hmac** encryption
