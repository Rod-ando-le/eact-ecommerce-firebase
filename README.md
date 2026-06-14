# 🛍️ Nimbus — React E‑Commerce with Firebase

An advanced React e‑commerce app. **Firebase Authentication** handles users and
**Cloud Firestore** stores users, products and orders. React Query manages data
fetching and Redux Toolkit manages the shopping cart.

> This version replaces the FakeStore API with Firestore.

---

## ✨ Features

### Authentication (Firebase Auth)
- **Register** with email + password — also creates a matching `users` document.
- **Login** and **Logout**.
- Protected pages (profile, orders, product management) require a logged‑in user.

### User management (Firestore CRUD)
- **Create** — a user document is added on registration.
- **Read** — the profile page loads the user's data.
- **Update** — users can edit their name and address.
- **Delete** — users can delete their account and their Firestore data.

### Product management (Firestore CRUD)
- Products are read from the `products` collection (no more FakeStore API).
- Logged‑in users can **create, edit and delete** products from the *Manage* page.
- The home page lists all products and filters by category (categories are derived
  dynamically from the products).

### Orders
- Checkout **saves the order to Firestore** with all products and the buyer's id.
- **Order history** lists each order with its id, date and total.
- Clicking an order shows the full details (products + total).

---

## 🔥 Firebase setup (do this first)

The app needs **your own** Firebase project to run.

### 1. Create the project
1. Go to the Firebase console: https://console.firebase.google.com/
2. Click **Add project**, name it, and finish the wizard.

### 2. Register a web app
1. Click the **Web** icon (`</>`) to add a web app.
2. Give it a nickname and click **Register app**.
3. Firebase shows a `firebaseConfig` object — keep that screen open.

### 3. Paste your config
Open **firebase.js** and replace the placeholder values with yours:

    const firebaseConfig = {
      apiKey: '...',
      authDomain: '...',
      projectId: '...',
      storageBucket: '...',
      messagingSenderId: '...',
      appId: '...',
    }

### 4. Enable Authentication
1. Console: **Build -> Authentication -> Get started**.
2. **Sign-in method** tab -> enable **Email/Password**.

### 5. Enable Firestore
1. Console: **Build -> Firestore Database -> Create database**.
2. Start in **test mode** (fine for development) and pick a location.

---

## 🚀 Run locally

Requires Node.js 18+.

    npm install
    npm run dev

Open the URL Vite prints (usually http://localhost:5173).

First run is empty: **register an account**, log in, open **Manage** and add a few
products. They'll appear on the home page.

---

## 🗂️ Firestore data model

    users/{uid}    -> { uid, email, name, address, createdAt }
    products/{id}  -> { title, price, category, description, image }
    orders/{id}    -> { userId, userEmail, items: [...], total, createdAt }

---

## 📁 Files (all in the project root)

    firebase.js          Firebase init (paste your config here)
    AuthContext.jsx      auth state + register / login / logout / delete
    ProtectedRoute.jsx   guards logged-in-only routes
    userService.js       users CRUD (Firestore)
    productService.js    products CRUD (Firestore)
    orderService.js      orders create / read (Firestore)
    main.jsx             providers (Redux, React Query, Router, Auth)
    App.jsx              routes
    Navbar.jsx           header (auth-aware) + cart badge
    Home.jsx             product listing + category filter
    ProductCard.jsx      product card + image fallback
    CategoryFilter.jsx   category dropdown
    Cart.jsx             cart + checkout (creates an order)
    Login.jsx            login form
    Register.jsx         registration form
    Profile.jsx          profile read / update / delete
    ManageProducts.jsx   product create / update / delete
    Orders.jsx           order history
    OrderDetail.jsx      single order details
    store.js             Redux store + sessionStorage sync
    cartSlice.js         cart reducers / actions / selectors
    index.css            design system

---

## 📝 Notes

- The cart still lives in sessionStorage; orders are persisted in Firestore.
- Image placeholders appear only when an image URL fails to load.
- Deleting an account may ask you to log in again — Firebase requires a recent
  login for sensitive actions.
