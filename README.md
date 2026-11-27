# ShopZone E-Commerce Website

A responsive React + Vite + Material UI shopping website. It fetches up to 100 products from DummyJSON.

## Features
- Home, About Us, Login and Registration pages
- Sticky responsive navigation bar
- DummyJSON products API integration (`https://dummyjson.com/products?limit=100`)
- Product images, descriptions, category, brand, rating, price and stock
- Search by product title, brand, description or category
- Category filter and sorting by price/rating
- Product details dialog
- Add-to-cart counter stored in localStorage
- Registration and login demo using localStorage
- About page category descriptions generated from API categories

## Requirements
- Node.js 18 or newer
- VS Code (recommended)
- Internet connection (for API data, product images and Google Fonts)

## Installation and run
1. Extract `ShopZone_Ecommerce.zip`.
2. Open the extracted `ShopZone_Ecommerce` folder in VS Code.
3. Open Terminal > New Terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the local address printed in the terminal, usually `http://localhost:5173`.

## Build
```bash
npm run build
npm run preview
```

## API
The app requests:
`https://dummyjson.com/products?limit=100`

DummyJSON is a sample API. The login and registration pages in this project are frontend demonstrations using browser localStorage. They are not secure production authentication and do not save users to a real server/database. The cart counter is also a simple demo counter, not a checkout/payment system.
