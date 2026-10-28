# 📚 ShopVilla — Complete Master Tech Stack & Engineering Architecture Study Guide

> **An exhaustive, beginner-friendly deep-dive into every technology, library, architectural pattern, and security mechanism used in the ShopVilla production codebase.**
> 
> *Written specifically for final-year engineering students, junior full-stack developers, and interview candidates preparing for MERN, System Design, and Backend Engineering interviews.*

---

## 📑 Table of Contents

1. [Frontend Technologies](#1-frontend-technologies)
   - [React (React 18)](#react-react-18)
   - [Vite](#vite)
   - [React Router (v6)](#react-router-v6)
   - [Context API](#context-api)
   - [Axios](#axios)
   - [Axios Interceptors](#axios-interceptors)
   - [Bootstrap 5](#bootstrap-5)
   - [Bootstrap Icons](#bootstrap-icons)
   - [Protected Routes](#protected-routes)
   - [localStorage](#localstorage)
2. [Backend Technologies](#2-backend-technologies)
   - [Node.js](#nodejs)
   - [Express.js](#expressjs)
   - [Middleware Pattern](#middleware-pattern)
   - [Controllers, Routes, and Services Architecture](#controllers-routes-and-services-architecture)
   - [REST API Architecture](#rest-api-architecture)
   - [Async / Await and catchAsync Wrapper](#async--await-and-catchasync-wrapper)
   - [Centralized Error Handling (AppError & Global Error Handler)](#centralized-error-handling-apperror--global-error-handler)
   - [dotenv (Environment Management)](#dotenv-environment-management)
   - [Morgan (HTTP Request Logger)](#morgan-http-request-logger)
3. [Database & ODM](#3-database--odm)
   - [MongoDB](#mongodb)
   - [Mongoose ODM](#mongoose-odm)
   - [Schemas and Models](#schemas-and-models)
   - [Single-Field and Compound Indexes](#single-field-and-compound-indexes)
   - [Full-Text Search Index](#full-text-search-index)
   - [Aggregation Pipeline ($lookup, $count, $group)](#aggregation-pipeline-lookup-count-group)
   - [Atomic Updates ($inc and Query Predicates)](#atomic-updates-inc-and-query-predicates)
   - [TTL Indexes (Time-To-Live)](#ttl-indexes-time-to-live)
   - [Soft Delete Pattern](#soft-delete-pattern)
   - [Snapshot Pattern (Order Immutability)](#snapshot-pattern-order-immutability)
4. [Authentication & Security](#4-authentication--security)
   - [JSON Web Token (JWT)](#json-web-token-jwt)
   - [bcryptjs & Salt Rounds](#bcryptjs--salt-rounds)
   - [Role-Based Access Control (RBAC)](#role-based-access-control-rbac)
   - [One-Time Password (OTP) Verification](#one-time-password-otp-verification)
   - [Rate Limiting (express-rate-limit)](#rate-limiting-express-rate-limit)
   - [Helmet (Security HTTP Headers)](#helmet-security-http-headers)
   - [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
   - [express-mongo-sanitize (NoSQL Injection Defense)](#express-mongo-sanitize-nosql-injection-defense)
   - [express-validator (Input Validation & Normalization)](#express-validator-input-validation--normalization)
   - [Insecure Direct Object References (IDOR Defense)](#insecure-direct-object-references-idor-defense)
   - [Account Enumeration Defense](#account-enumeration-defense)
   - [Cross-Site Scripting (XSS Defense)](#cross-site-scripting-xss-defense)
   - [Cross-Site Request Forgery (CSRF Defense)](#cross-site-request-forgery-csrf-defense)
   - [HMAC-SHA256 Cryptographic Signatures](#hmac-sha256-cryptographic-signatures)
5. [Payment Processing & Gateways](#5-payment-processing--gateways)
   - [Razorpay Orders API](#razorpay-orders-api)
   - [Payment Signature Verification](#payment-signature-verification)
   - [Razorpay Webhooks](#razorpay-webhooks)
   - [Webhook Idempotency (processedWebhookEventIds)](#webhook-idempotency-processedwebhookeventids)
   - [Raw Body Capture (express.raw)](#raw-body-capture-expressraw)
   - [Automated Payment Reconciliation](#automated-payment-reconciliation)
   - [Automated Payment Expiry (30-Minute Window)](#automated-payment-expiry-30-minute-window)
   - [Automated Refund Processing (refund.processed)](#automated-refund-processing-refundprocessed)
   - [Cash on Delivery (COD Workflow)](#cash-on-delivery-cod-workflow)
6. [Architectural Concepts & Design Patterns](#6-architectural-concepts--design-patterns)
   - [State Machine Pattern (Fulfillment Lifecycle)](#state-machine-pattern-fulfillment-lifecycle)
   - [Race Conditions & Concurrency Control](#race-conditions--concurrency-control)
   - [Compensating Rollback Pattern](#compensating-rollback-pattern)
   - [Database Pagination Pattern](#database-pagination-pattern)
   - [N+1 Query Problem & Elimination](#n1-query-problem--elimination)
   - [Separation of Concerns (Layered Monolith)](#separation-of-concerns-layered-monolith)
   - [Fail-Fast Startup Validation](#fail-fast-startup-validation)
7. [Email Communication](#7-email-communication)
   - [Nodemailer](#nodemailer)
   - [SMTP (Simple Mail Transfer Protocol)](#smtp-simple-mail-transfer-protocol)
   - [Gmail App Passwords](#gmail-app-passwords)
8. [Background Scheduling](#8-background-scheduling)
   - [node-cron](#node-cron)
9. [Automated Testing Suite](#9-automated-testing-suite)
   - [Jest Testing Framework](#jest-testing-framework)
   - [Supertest HTTP Assertion Library](#supertest-http-assertion-library)
   - [mongodb-memory-server](#mongodb-memory-server)
   - [Unit vs Integration Tests](#unit-vs-integration-tests)
   - [Mocking & Spying (jest.spyOn)](#mocking--spying-jestspyon)
10. [DevOps, Containerization & Deployment](#10-devops-containerization--deployment)
    - [Docker](#docker)
    - [Multi-Stage Docker Builds](#multi-stage-docker-builds)
    - [Docker Compose](#docker-compose)
    - [Nginx Web Server & Reverse Proxy](#nginx-web-server--reverse-proxy)
    - [MongoDB Atlas](#mongodb-atlas)
    - [Render (Backend API Hosting)](#render-backend-api-hosting)
    - [Vercel (Frontend SPA Hosting)](#vercel-frontend-spa-hosting)
    - [Vercel SPA Rewrites (vercel.json)](#vercel-spa-rewrites-verceljson)
    - [Health Check Endpoints (/api/health)](#health-check-endpoints-apihealth)
    - [Continuous Integration (CI) Principles](#continuous-integration-ci-principles)
11. [Developer Productivity Tools](#11-developer-productivity-tools)
    - [Git](#git)
    - [GitHub](#github)
    - [Postman](#postman)
    - [ngrok](#ngrok)
    - [Visual Studio Code](#visual-studio-code)
12. [End-to-End Request Flow Walkthroughs](#12-end-to-end-request-flow-walkthroughs)
    - [(a) User Login Flow](#a-user-login-flow)
    - [(b) Online Order Creation & Razorpay Payment](#b-online-order-creation--razorpay-payment)
    - [(c) Webhook Arriving After User Closes Browser Tab](#c-webhook-arriving-after-user-closes-browser-tab)
    - [(d) Cancelling a Paid Order](#d-cancelling-a-paid-order)
13. [Glossary of Acronyms](#13-glossary-of-acronyms)
14. [Master Revision Cheat Sheet](#14-master-revision-cheat-sheet)
15. [Top 30 Interview Questions & Answers](#15-top-30-interview-questions--answers)

---

## 1. Frontend Technologies

### React (React 18)
- **Category:** Frontend
- **What it is:** React is an open-source JavaScript library developed by Meta for building dynamic, interactive user interfaces using reusable building blocks called components. Instead of rewriting HTML directly, React keeps an in-memory representation called the Virtual DOM and updates only the specific elements that change.
- **Why we used it in ShopVilla:** In ShopVilla, pages such as the live product catalog, interactive cart, multi-step checkout, and admin analytics dashboards require instantaneous UI updates without full page reloads. React 18 allows state-driven UI rendering with seamless reconciliation.
- **Where in our code:** [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx) and [`client/src/App.jsx`](file:///d:/SHOPVILLA/client/src/App.jsx).
- **Example:**
```jsx
// client/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
  - Line 1-3: Imports the core React library and ReactDOM client renderer.
  - Line 5: `createRoot` connects React 18's concurrent rendering engine to the `<div id="root">` DOM node in `index.html`.
  - Line 6-8: Wraps the top-level `<App />` component in `<React.StrictMode>` to detect side-effects and deprecated APIs during development.
- **Alternatives:** Angular (more opinionated, larger bundle size) or Vue.js (clean and approachable, but React has a wider industry ecosystem and larger job market).
- **Interview question:** What is the Virtual DOM in React, and how does React 18 improve rendering performance?
  - *Answer:* The Virtual DOM is a lightweight JavaScript representation of the actual DOM. React compares differences (diffing) and batches updates to minimize costly direct DOM manipulations. React 18 introduced concurrent rendering, automatic state batching, and transitions for fluid user experiences.

---

### Vite
- **Category:** Frontend / Build Tool
- **What it is:** Vite is a next-generation frontend build tool and development server created by Evan You. It leverages native ES modules (ESM) in modern browsers during local development to serve source code instantly without bundling everything upfront.
- **Why we used it in ShopVilla:** Traditional bundlers like Webpack become slow as the project grows. Vite provides sub-second Hot Module Replacement (HMR) and bundles production code using Rollup in under 2 seconds, drastically accelerating our development and build pipeline.
- **Where in our code:** [`client/vite.config.js`](file:///d:/SHOPVILLA/client/vite.config.js) and [`client/package.json`](file:///d:/SHOPVILLA/client/package.json).
- **Example:**
```javascript
// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```
  - Line 5: Registers the official `@vitejs/plugin-react` plugin for JSX transformation.
  - Line 7: Sets the local development server port to `5173`.
  - Line 8-13: Sets up an automated local reverse proxy so client calls to `/api` route directly to the backend Express server on port `5000`, preventing CORS friction during local development.
- **Alternatives:** Webpack (slower cold start and rebundling) or Create React App (deprecated by the React team).
- **Interview question:** Why is Vite significantly faster during development than Webpack?
  - *Answer:* Webpack bundles the entire codebase before starting the dev server. Vite uses native browser ES Modules (ESM) to serve source files on-demand and pre-bundles node_modules with esbuild (written in Go), resulting in near-instant server boot.

---

### React Router (v6)
- **Category:** Frontend / Routing
- **What it is:** React Router is the standard declarative routing library for React applications. It maps browser URL paths to specific React component trees without causing full browser reloads, enabling a Single Page Application (SPA).
- **Why we used it in ShopVilla:** Enables seamless client-side navigation between Home, Catalog, Product Details, Cart, Checkout, Order Tracking, and Admin Portals while synchronizing URL query parameters for sorting, filtering, and pagination.
- **Where in our code:** [`client/src/App.jsx`](file:///d:/SHOPVILLA/client/src/App.jsx).
- **Example:**
```jsx
// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
```
  - Line 8: `<Router>` uses the browser History API to manage navigation.
  - Line 9: `<Routes>` looks through its child routes and renders the best matching component.
  - Line 10-17: Maps paths (`/`, `/products`, `/checkout`) to components. `<ProtectedRoute>` wraps `<CheckoutPage />` to block unauthenticated visitors.
- **Alternatives:** TanStack Router (strong type safety, newer) or Next.js App Router (requires a full framework).
- **Interview question:** What is the difference between client-side routing and server-side routing?
  - *Answer:* Server-side routing causes the browser to request a completely new HTML page from the server on every link click. Client-side routing intercepts URL changes via the browser History API, keeping the existing HTML shell and dynamically replacing only the inner component tree without refreshing the page.

---

### Context API
- **Category:** Frontend / State Management
- **What it is:** React's built-in state management feature that lets you pass global data through the component tree without manually passing props down through every level (preventing "prop drilling").
- **Why we used it in ShopVilla:** We have three dedicated global contexts: `AuthContext` (current logged-in user, JWT session, address book), `CartContext` (cart items, subtotal, quantity count, live sync), and `ToastContext` (global notification popups).
- **Where in our code:** [`client/src/context/AuthContext.jsx`](file:///d:/SHOPVILLA/client/src/context/AuthContext.jsx) and [`client/src/context/CartContext.jsx`](file:///d:/SHOPVILLA/client/src/context/CartContext.jsx).
- **Example:**
```jsx
// client/src/context/CartContext.jsx
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, setItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
```
  - Line 3: Creates the `CartContext` instance.
  - Line 5-13: The `CartProvider` wraps the application tree, computing `itemCount` and exposing state and helper functions.
  - Line 15: Exports a custom `useCart` hook so any component (Navbar, ProductCard, Checkout) can consume cart data with one line.
- **Alternatives:** Redux Toolkit (adds boilerplate for small-to-medium apps) or Zustand (minimalist external library). Context API requires no external packages.
- **Interview question:** When should you use React Context API versus external state libraries like Redux?
  - *Answer:* Context API is ideal for low-to-medium frequency global updates such as user authentication, language/theme, and shopping cart data. Redux or Zustand is preferred when state updates happen at high frequency across deeply nested trees where granular selector optimizations are needed to prevent unnecessary re-renders.

---

### Axios
- **Category:** Frontend / HTTP Client
- **What it is:** A promise-based HTTP client library for the browser and Node.js. It automatically transforms JSON request and response payloads, supports request cancellation, and provides rich interceptor hooks.
- **Why we used it in ShopVilla:** Compared to native browser `fetch()`, Axios automatically serializes JSON, automatically throws errors on HTTP 4xx/5xx status codes, and supports centralized interceptors to inject authorization tokens and handle session expiration.
- **Where in our code:** [`client/src/api/axios.js`](file:///d:/SHOPVILLA/client/src/api/axios.js).
- **Example:**
```javascript
// client/src/api/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
```
  - Line 3: Creates a configured Axios client instance with standard base headers.
  - Line 4: Uses `import.meta.env.VITE_API_URL` for deployment flexibility, falling back to local proxy `/api/v1`.
- **Alternatives:** Native browser `fetch()` (requires manual `res.json()` and manual error checking for `res.ok`).
- **Interview question:** Why is Axios often preferred over the native browser `fetch` API?
  - *Answer:* Axios automatically parses JSON responses, rejects promises on HTTP error status codes (400, 401, 500) unlike `fetch` which only rejects on network failures, and provides interceptors for clean cross-cutting concerns like token injection.

---

### Axios Interceptors
- **Category:** Frontend / Network Architecture
- **What it is:** Middleware functions in Axios that intercept and modify HTTP requests before they are dispatched to the server, and responses before they are returned to the calling component.
- **Why we used it in ShopVilla:** We use request interceptors to automatically attach the `Authorization: Bearer <token>` header from localStorage, and response interceptors to catch HTTP 401 Unauthorized responses, clear the user's credentials, and redirect to the login page.
- **Where in our code:** [`client/src/api/axios.js:interceptors`](file:///d:/SHOPVILLA/client/src/api/axios.js#L13-L43).
- **Example:**
```javascript
// client/src/api/axios.js
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('shopvilla_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('shopvilla_token');
      localStorage.removeItem('shopvilla_user');
      window.location.href = '/login?expired=true';
    }
    return Promise.reject(error);
  }
);
```
  - Line 2-7: Checks if a token exists in localStorage; if found, attaches it to the HTTP `Authorization` header.
  - Line 9-17: Catches 401 Unauthorized errors from the backend, clears expired session tokens, and redirects the browser to `/login`.
- **Alternatives:** Manually passing authorization headers in every individual API call (tedious, error-prone, violates DRY).
- **Interview question:** How do Axios interceptors enhance security and user experience in single-page applications?
  - *Answer:* Interceptors centralize authentication token injection so developers cannot forget to attach credentials on protected endpoints. They also centralize error handling, enabling automatic token refresh or immediate logout on token expiration.

---

### Bootstrap 5
- **Category:** Frontend / CSS Framework
- **What it is:** A responsive CSS framework featuring a 12-column grid system, pre-built utility classes (spacing, flexbox, typography, colors), and accessible UI components (buttons, badges, cards, modals, dropdowns).
- **Why we used it in ShopVilla:** Gives us rapid, responsive styling across mobile, tablet, and desktop viewports with zero custom CSS bloat. Custom brand variables override default styles to establish ShopVilla's warm modern orange identity (`#ea580c`).
- **Where in our code:** [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx) and [`client/src/index.css`](file:///d:/SHOPVILLA/client/src/index.css).
- **Example:**
```jsx
// client/src/components/ProductCard.jsx
<div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden product-card">
  <img src={product.images[0]} className="card-img-top" alt={product.name} />
  <div className="card-body p-3 d-flex flex-column">
    <h6 className="card-title fw-bold text-truncate">{product.name}</h6>
    <div className="mt-auto d-flex justify-content-between align-items-center">
      <span className="fs-5 fw-bold text-primary">₹{product.price}</span>
      <button className="btn btn-primary btn-sm rounded-pill px-3">Add</button>
    </div>
  </div>
</div>
```
  - Utility classes like `h-100`, `shadow-sm`, `rounded-4`, `d-flex`, `flex-column`, `mt-auto` build modern card designs without writing hundreds of CSS rules.
- **Alternatives:** Tailwind CSS (utility-first, requires build-time scanning) or Material UI (React component library, heavier footprint).
- **Interview question:** What is the mobile-first grid system in Bootstrap 5?
  - *Answer:* Bootstrap's 12-column grid system is mobile-first: layout rules apply by default to mobile devices, and media query breakpoints (`sm`, `md`, `lg`, `xl`, `xxl`) expand column behavior for progressively larger screens using `min-width`.

---

### Bootstrap Icons
- **Category:** Frontend / Icon Library
- **What it is:** An official, high-quality open-source SVG icon library designed by the Bootstrap team with over 1,800 icons.
- **Why we used it in ShopVilla:** Provides crisp vector icons for e-commerce workflows: shopping carts (`bi-cart3`), order status badges (`bi-truck`, `bi-check-circle`), security shields (`bi-shield-check`), and stars (`bi-star-fill`).
- **Where in our code:** Imported in [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx) and used across all page components.
- **Example:**
```jsx
// client/src/pages/HomePage.jsx
<i className="bi bi-shield-check fs-2 text-success mb-2 d-block"></i>
<h6 className="fw-bold mb-1">Secure</h6>
<p className="text-muted small mb-0">UPI, Cards & 256-bit SSL</p>
```
  - `bi bi-shield-check` inserts the vector check-shield icon. Font sizing classes like `fs-2` scale the icon proportionally.
- **Alternatives:** FontAwesome (heavier footprint, paid tiers) or Lucide Icons (clean React SVG components).
- **Interview question:** What is the advantage of using icon fonts or SVG icons over PNG/JPEG icons?
  - *Answer:* Vector SVG/font icons scale losslessly to any resolution (Retina displays), can be styled with standard CSS (`color`, `font-size`, `hover`), and have much smaller file sizes than bitmap images.

---

### Protected Routes
- **Category:** Frontend / Navigation Security
- **What it is:** A component wrapper that checks whether the user is authenticated (and optionally possesses required roles) before rendering a child page; unauthenticated users are redirected to `/login`.
- **Why we used it in ShopVilla:** Prevents unauthenticated guests from accessing sensitive checkout, order history, profile, and administrative dashboard screens.
- **Where in our code:** [`client/src/components/ProtectedRoute.jsx`](file:///d:/SHOPVILLA/client/src/components/ProtectedRoute.jsx).
- **Example:**
```jsx
// client/src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
```
  - Line 8: While checking the token, shows a loading indicator.
  - Line 9: If no valid token exists, redirects to `/login`.
  - Line 10: If route requires admin rights and user role is not `admin`, redirects to home `/`.
  - Line 12: If all checks pass, renders the protected child component.
- **Alternatives:** Manual conditional rendering inside every individual page component (violates DRY and easily leads to security oversights).
- **Interview question:** Is frontend route protection alone sufficient to secure a web application?
  - *Answer:* No. Frontend route protection is purely for user experience (preventing blank screens or confusion). Any user can tamper with client code or inspect network requests. True security must be enforced on the backend API server on every endpoint using middleware.

---

### localStorage
- **Category:** Frontend / Web Storage API
- **What it is:** A browser Web Storage API that allows JavaScript web applications to store key-value data persistently with no expiration date across browser restarts.
- **Why we used it in ShopVilla:** Stores the authenticated customer's JWT token (`shopvilla_token`) and serialized profile snapshot (`shopvilla_user`) so the user stays logged in across tab reloads and browser restarts.
- **Where in our code:** [`client/src/context/AuthContext.jsx`](file:///d:/SHOPVILLA/client/src/context/AuthContext.jsx) and [`client/src/api/axios.js`](file:///d:/SHOPVILLA/client/src/api/axios.js).
- **Example:**
```javascript
// client/src/context/AuthContext.jsx
const login = async (email, password) => {
  const res = await api.post('/auth/login', { email, password });
  localStorage.setItem('shopvilla_token', res.data.token);
  localStorage.setItem('shopvilla_user', JSON.stringify(res.data.user));
  setUser(res.data.user);
};
```
  - Line 3: Persists the token string in the browser's storage sandbox.
  - Line 4: Serializes and stores the user profile JSON.
- **Alternatives:** `sessionStorage` (cleared as soon as tab closes) or `IndexedDB` (more complex, designed for large binary blobs/offline databases).
- **Interview question:** What is the primary security vulnerability associated with storing JWTs in localStorage?
  - *Answer:* `localStorage` is accessible by any JavaScript running in the same origin. If the web app has an XSS (Cross-Site Scripting) vulnerability or loads a malicious third-party script, attackers can steal the token.

---

## 2. Backend Technologies

### Node.js
- **Category:** Backend / Runtime
- **What it is:** An open-source, cross-platform JavaScript runtime environment built on Google Chrome's V8 engine that allows developers to run JavaScript on the server outside a browser.
- **Why we used it in ShopVilla:** Enables single-language (full-stack JavaScript) development across client and server. Node's non-blocking, event-driven I/O model allows ShopVilla to handle thousands of concurrent requests (browsing, cart updates, payment webhooks) with low memory overhead.
- **Where in our code:** [`server/server.js`](file:///d:/SHOPVILLA/server/server.js).
- **Example:**
```javascript
// server/server.js
const server = app.listen(PORT, () => {
  console.log(`ShopVilla API Server running on port ${PORT}`);
});
```
- **Alternatives:** Python (Django/FastAPI), Java (Spring Boot), or Go. Node.js was selected for full-stack JavaScript synergy and fast JSON processing.
- **Interview question:** How does Node.js handle concurrency despite being single-threaded?
  - *Answer:* Node.js uses an Event Loop and the Libuv C library. Long-running I/O operations (file reads, database queries, network calls) are offloaded to OS kernel threads or Libuv's thread pool. When the operation completes, its callback or promise resolution is placed on the event queue, keeping the main thread non-blocking.

---

### Express.js
- **Category:** Backend / Web Framework
- **What it is:** A minimalist, fast, and unopinionated web application framework for Node.js that provides routing, middleware support, and HTTP utility methods.
- **Why we used it in ShopVilla:** Forms the backbone of our REST API, organizing routing for auth, products, orders, reviews, addresses, and admin portals with clean middleware pipelining.
- **Where in our code:** [`server/app.js`](file:///d:/SHOPVILLA/server/app.js).
- **Example:**
```javascript
// server/app.js
const express = require('express');
const app = express();

app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/products', productRoutes);
```
- **Alternatives:** Fastify (faster JSON serialization) or NestJS (opinionated, TypeScript enterprise architecture).
- **Interview question:** What are the core components of an Express.js application?
  - *Answer:* The request object (`req`), response object (`res`), routing handlers, and the middleware pipeline (`next()`) that processes requests sequentially.

---

### Middleware Pattern
- **Category:** Backend / Architecture
- **What it is:** Functions that have access to the request object (`req`), response object (`res`), and the `next` function in the application's request-response cycle. They can execute code, modify `req` and `res`, or terminate the cycle.
- **Why we used it in ShopVilla:** Used for authentication verification, role authorization, rate limiting, request body sanitization, security header injection, and centralized error handling.
- **Where in our code:** [`server/middleware/authMiddleware.js`](file:///d:/SHOPVILLA/server/middleware/authMiddleware.js) and [`server/middleware/roleMiddleware.js`](file:///d:/SHOPVILLA/server/middleware/roleMiddleware.js).
- **Example:**
```javascript
// server/middleware/roleMiddleware.js
const AppError = require('../utils/appError');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = { restrictTo };
```
  - Line 3: Higher-order function taking authorized roles (e.g. `'admin'`).
  - Line 5-8: Checks if the authenticated user's role is permitted. If not, calls `next(new AppError(..., 403))` to jump straight to the global error handler. If permitted, calls `next()` to pass control to the controller.
- **Alternatives:** Manually writing authorization checks inside every controller method (violates DRY).
- **Interview question:** What happens if an Express middleware neither calls `next()` nor sends a response via `res`?
  - *Answer:* The request hangs indefinitely until the client or gateway times out, consuming server resources.

---

### Controllers, Routes, and Services Architecture
- **Category:** Backend / Architecture
- **What it is:** A layered architectural pattern (MVC/Layered Monolith) separating HTTP endpoint declarations (Routes), HTTP request/response orchestration (Controllers), and core business logic/external integrations (Services).
- **Why we used it in ShopVilla:** Keeps files small, maintainable, and testable. Routes only declare URL paths and middleware chains; controllers parse parameters and formulate JSON; services handle database mutations, payment gateways, and emails.
- **Where in our code:**
  - Routes: [`server/routes/orderRoutes.js`](file:///d:/SHOPVILLA/server/routes/orderRoutes.js)
  - Controllers: [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js)
  - Services: [`server/services/orderService.js`](file:///d:/SHOPVILLA/server/services/orderService.js)
- **Example:**
```javascript
// Route: declares endpoint & middleware
router.post('/create', paymentLimiter, validateOrderCreation, orderController.createOrder);

// Controller: validates, calls service, returns HTTP response
const createOrder = catchAsync(async (req, res, next) => {
  // ... builds order snapshot, calls deductInventoryStock, returns 201 ...
});

// Service: business logic reused across controllers and background jobs
const cancelOrderService = async (order, updatedBy, reason) => {
  // ... idempotent stock restoration & refund logic ...
};
```
- **Alternatives:** Fat controllers (placing all business logic, database queries, and gateway calls inside route handlers, which leads to spaghetti code).
- **Interview question:** Why should business logic be placed in service layers rather than directly inside Express controllers?
  - *Answer:* Placing business logic in services allows it to be reused across multiple entry points (controllers, background cron jobs, CLI scripts, test suites) without coupling it to Express HTTP `req` and `res` objects.

---

### REST API Architecture
- **Category:** Backend / API Design
- **What it is:** Representational State Transfer (REST) is an architectural style for designing networked applications using standard HTTP verbs (GET, POST, PUT, PATCH, DELETE) and stateless client-server communication over standard URLs.
- **Why we used it in ShopVilla:** Provides a predictable, standard interface for the React frontend, admin dashboards, test suites, and mobile clients to query and mutate e-commerce resources.
- **Where in our code:** All routes in [`server/routes/`](file:///d:/SHOPVILLA/server/routes/).
- **Example:**
  - `GET /api/v1/products` &rarr; Fetch product list
  - `POST /api/v1/orders/create` &rarr; Create order resource
  - `PATCH /api/v1/admin/orders/:id/status` &rarr; Partially update order state
  - `DELETE /api/v1/products/:id` &rarr; Remove product resource
- **Alternatives:** GraphQL (allows custom client query fields, but adds caching and schema complexity) or gRPC (binary, for microservices).
- **Interview question:** What is the difference between HTTP PUT and PATCH methods?
  - *Answer:* `PUT` is intended to completely replace an entire resource with the submitted payload. `PATCH` applies partial modifications to an existing resource, changing only the fields provided.

---

### Async / Await and catchAsync Wrapper
- **Category:** Backend / Control Flow
- **What it is:** Syntactic sugar built on top of JavaScript Promises, making asynchronous code look and read like synchronous code. `catchAsync` is a higher-order wrapper that catches promise rejections and passes them to Express's `next(err)`.
- **Why we used it in ShopVilla:** Eliminates messy, nested `try/catch` blocks across every asynchronous database and gateway controller method.
- **Where in our code:** [`server/utils/catchAsync.js`](file:///d:/SHOPVILLA/server/utils/catchAsync.js).
- **Example:**
```javascript
// server/utils/catchAsync.js
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
```
  - Line 2-4: Wraps an asynchronous controller function `fn`. If any promise inside throws or rejects, `.catch(next)` automatically sends the error to our centralized error middleware.
- **Alternatives:** Wrapping every route controller in explicit `try { ... } catch (err) { next(err); }` blocks (boilerplate repetition).
- **Interview question:** How does the `catchAsync` utility simplify error handling in asynchronous Express routes?
  - *Answer:* Express 4 does not automatically catch unhandled rejections in asynchronous middleware. Without `catchAsync`, an unhandled error inside an `async` function causes the request to hang. `catchAsync` automatically captures errors and forwards them to `next(err)`.

---

### Centralized Error Handling (AppError & Global Error Handler)
- **Category:** Backend / Error Architecture
- **What it is:** An architectural pattern where errors are instantiated using custom error classes (`AppError`) with status codes, and caught by a single global error middleware that formats responses based on the environment (development vs. production).
- **Why we used it in ShopVilla:** Prevents leaking sensitive database stack traces and credentials to production users while providing detailed debugging traces in local development.
- **Where in our code:** [`server/utils/appError.js`](file:///d:/SHOPVILLA/server/utils/appError.js) and [`server/middleware/errorHandler.js`](file:///d:/SHOPVILLA/server/middleware/errorHandler.js).
- **Example:**
```javascript
// server/utils/appError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Marks trusted operational error vs unknown bug
    Error.captureStackTrace(this, this.constructor);
  }
}
```
  - Line 6: `isOperational: true` flags this error as an anticipated validation or business rule failure (safe to send message to client) rather than an unexpected system crash.
- **Alternatives:** Ad-hoc `res.status(500).json({ error })` scattered randomly across controllers (inconsistent API responses and risk of leaking internal details).
- **Interview question:** What is the difference between an operational error and a programmer/system error?
  - *Answer:* Operational errors are predictable runtime problems (invalid user input, insufficient stock, not logged in, resource not found) that can be handled gracefully with clear client messages. Programmer errors are bugs in code (syntax errors, null pointer references, connection failures) that should hide stack traces from users and trigger logging/alerts.

---

### dotenv (Environment Management)
- **Category:** Backend / Configuration
- **What it is:** A zero-dependency module that loads environment variables from a `.env` file into `process.env`.
- **Why we used it in ShopVilla:** Separates sensitive configuration (database URIs, JWT secrets, Razorpay API keys, email credentials) from source code, complying with the Twelve-Factor App methodology.
- **Where in our code:** [`server/server.js`](file:///d:/SHOPVILLA/server/server.js) and [`server/app.js`](file:///d:/SHOPVILLA/server/app.js).
- **Example:**
```javascript
// server/server.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const PORT = process.env.PORT || 5000;
```
- **Alternatives:** Passing environment variables directly via shell scripts or Docker run flags. `dotenv` makes local development simple.
- **Interview question:** Why should `.env` files never be committed to Git repositories?
  - *Answer:* Committing `.env` exposes database passwords, payment gateway secrets, and cryptographic keys to everyone with repo access and creates severe security breach risks.

---

### Morgan (HTTP Request Logger)
- **Category:** Backend / Observability
- **What it is:** HTTP request logger middleware for Node.js that logs request methods, paths, status codes, response times, and content lengths to the terminal.
- **Why we used it in ShopVilla:** Gives immediate visibility during development and production debugging of incoming HTTP traffic and latency. Disabled automatically in test mode (`NODE_ENV === 'test'`) to keep test output clean.
- **Where in our code:** [`server/app.js`](file:///d:/SHOPVILLA/server/app.js#L52-L55).
- **Example:**
```javascript
// server/app.js
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
```
  - Logs output in concise colored format: `GET /api/v1/products 200 12.435 ms - 1042`.
- **Alternatives:** Winston or Pino (for enterprise JSON structured log shipping).
- **Interview question:** What is the purpose of HTTP logging middleware in production systems?
  - *Answer:* It provides an audit trail of incoming requests, measures endpoint latency, identifies traffic spikes, and helps debug 4xx/5xx status code surges.

---

## 3. Database & ODM

### MongoDB
- **Category:** Database
- **What it is:** A document-oriented NoSQL database that stores data in flexible, JSON-like BSON (Binary JSON) documents rather than rigid relational tables with foreign keys.
- **Why we used it in ShopVilla:** E-commerce products have polymorphic attributes, orders require frozen snapshots of items and shipping addresses, and status history is naturally modeled as an embedded array of subdocuments.
- **Where in our code:** Local instance at `mongodb://127.0.0.1:27017/shopvilla` and MongoDB Atlas cloud clusters.
- **Example:** A single MongoDB Order document embeds customer snapshots, line items, and audit history:
```json
{
  "_id": "67be01...",
  "user": "67be00...",
  "items": [
    { "name": "Mechanical Keyboard", "price": 999, "quantity": 1 }
  ],
  "paymentStatus": "PAID",
  "orderStatus": "CONFIRMED"
}
```
- **Alternatives:** PostgreSQL or MySQL (relational SQL databases requiring joins across multiple tables).
- **Interview question:** When is a document database like MongoDB preferable over a relational database like PostgreSQL for e-commerce?
  - *Answer:* MongoDB excels when data structures evolve rapidly, when documents naturally embed related data (like immutable order snapshots or status timelines) avoiding complex multi-table joins, and when horizontal scale-out is required.

---

### Mongoose ODM
- **Category:** Database / Object Document Mapper
- **What it is:** An Object Data Modeling (ODM) library for MongoDB and Node.js. It provides schema validation, type casting, pre/post middleware hooks, and query building.
- **Why we used it in ShopVilla:** Enforces strict data models, password hashing hooks (`pre('save')`), virtual fields, and validation rules (e.g. valid phone numbers and stock non-negativity).
- **Where in our code:** [`server/config/db.js`](file:///d:/SHOPVILLA/server/config/db.js) and [`server/models/`](file:///d:/SHOPVILLA/server/models/).
- **Example:**
```javascript
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
```
- **Alternatives:** Native MongoDB Node.js Driver (no built-in schema validation or lifecycle hooks) or Prisma.
- **Interview question:** What value does Mongoose provide over using the raw MongoDB Node.js driver?
  - *Answer:* Mongoose provides a structured schema layer, built-in validation rules, lifecycle hooks (pre/post save), population of document references, and virtual properties over MongoDB's schemaless engine.

---

### Schemas and Models
- **Category:** Database / Modeling
- **What it is:** In Mongoose, a **Schema** defines the structure, data types, default values, and validators of a document. A **Model** is a compiled constructor compiled from the schema that provides the interface to query and update the database collection.
- **Why we used it in ShopVilla:** We have schemas and models for `User`, `Product`, `Order`, `Cart`, `Review`, and `Otp`.
- **Where in our code:** [`server/models/Order.js`](file:///d:/SHOPVILLA/server/models/Order.js).
- **Example:**
```javascript
// server/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PAID', 'FAILED', 'COD_PENDING', 'REFUND_INITIATED', 'REFUNDED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
```
- **Interview question:** What is the difference between a Mongoose Schema and a Mongoose Model?
  - *Answer:* A Schema is a blueprint that defines document fields, types, and validation rules. A Model is a compiled JavaScript class that acts as the direct interface to the database for creating, reading, updating, and deleting documents in a collection.

---

### Single-Field and Compound Indexes
- **Category:** Database / Performance
- **What it is:** Data structures (B-trees) that store a small portion of the collection's data in an ordered traversal format, allowing MongoDB to find documents in milliseconds without performing an expensive Collection Scan (`COLLSCAN`).
- **Why we used it in ShopVilla:**
  - Single-field indexes: `User.email` (unique), `Order.user`, `Product.category`.
  - Compound indexes: `Order(paymentStatus, createdAt)` for background cron reconciliation, and `Review(product, user)` with `{ unique: true }` to prevent duplicate reviews.
- **Where in our code:** [`server/models/Order.js#L125`](file:///d:/SHOPVILLA/server/models/Order.js#L125) and [`server/models/Review.js#L33`](file:///d:/SHOPVILLA/server/models/Review.js#L33).
- **Example:**
```javascript
// server/models/Order.js
// Compound index for background payment reconciliation and expiry cron query
orderSchema.index({ paymentStatus: 1, createdAt: 1 });

// server/models/Review.js
// Prevents duplicate reviews from the same user on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
```
- **Alternatives:** Unindexed collections (every query scans millions of documents on disk, causing high CPU and slow response times).
- **Interview question:** Why is the field order critical when creating a compound index in MongoDB?
  - *Answer:* Compound indexes follow the Equality, Sort, Range (ESR) rule and leftmost prefix matching. Queries that filter by the first indexed field can use the index, but queries filtering only by the second field cannot utilize the index efficiently.

---

### Full-Text Search Index
- **Category:** Database / Search
- **What it is:** A specialized MongoDB index that stems words, removes stop words (like "the", "and"), and builds an inverted index over text fields for fast keyword search.
- **Why we used it in ShopVilla:** Allows customers to type queries like "mechanical", "keyboard", or "wireless" and matches across both product names and descriptions efficiently.
- **Where in our code:** [`server/models/Product.js#L69`](file:///d:/SHOPVILLA/server/models/Product.js#L69).
- **Example:**
```javascript
// server/models/Product.js
// Compound full-text search index on product title and description
productSchema.index({ name: 'text', description: 'text' });
```
- **Alternatives:** Regex searches like `{ name: { $regex: '...', $options: 'i' } }` (cannot use normal B-tree indexes for wildcard prefixes, leading to slow table scans).
- **Interview question:** How does a MongoDB `$text` index differ from a regular regex search?
  - *Answer:* Regex searches perform string character matching and often result in full collection scans if leading wildcards are present. Full-text indexes tokenize words, apply linguistic stemming, and search an inverted index, providing dramatically faster searches and relevance score ranking.

---

### Aggregation Pipeline ($lookup, $count, $group)
- **Category:** Database / Analytics
- **What it is:** A multi-stage framework for data processing where documents pass through a sequential pipeline of stages (filtering, projecting, grouping, joining) to return calculated results.
- **Why we used it in ShopVilla:**
  - In Admin Analytics: calculates total revenue, order counts, and category distributions in single database passes.
  - In Customer Directory: uses `$lookup` with a sub-pipeline and `$count` to calculate total orders per user without loading documents into memory.
- **Where in our code:** [`server/controllers/adminController.js:getCustomers`](file:///d:/SHOPVILLA/server/controllers/adminController.js#L225-L255).
- **Example:**
```javascript
// server/controllers/adminController.js
const customers = await User.aggregate([
  { $match: { role: 'user' } },
  { $sort: { createdAt: -1 } },
  { $skip: skip },
  { $limit: limit },
  {
    $lookup: {
      from: 'orders',
      let: { userId: '$_id' },
      pipeline: [
        { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
        { $count: 'total' },
      ],
      as: 'orderCountData',
    },
  },
  {
    $project: {
      name: 1,
      email: 1,
      orderCount: { $ifNull: [{ $arrayElemAt: ['$orderCountData.total', 0] }, 0] },
    },
  },
]);
```
- **Interview question:** What is the performance benefit of using a sub-pipeline with `$count` inside a `$lookup` stage?
  - *Answer:* A standard `$lookup` copies all matching order documents into an array in memory. Using a sub-pipeline with `$count` computes the numerical total directly inside MongoDB's storage engine and returns a single number, saving massive RAM and network bandwidth.

---

### Atomic Updates ($inc and Query Predicates)
- **Category:** Database / Concurrency
- **What it is:** A database operation that completes in a single step at the storage engine level. Other operations cannot observe it half-completed.
- **Why we used it in ShopVilla:** In e-commerce checkout, if two users buy the last item at the exact same millisecond, a standard read-then-write approach causes overselling. We use `$inc` with a query condition (`stock: { $gte: quantity }`) to deduct inventory atomically.
- **Where in our code:** [`server/controllers/orderController.js:deductInventoryStock`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L17-L21) and [`server/services/orderService.js:restoreInventoryStock`](file:///d:/SHOPVILLA/server/services/orderService.js#L6-L16).
- **Example:**
```javascript
// Atomically deduct inventory with stock condition check
const updatedProduct = await Product.findOneAndUpdate(
  { _id: item.product, stock: { $gte: item.quantity } },
  { $inc: { stock: -item.quantity } },
  { new: true }
);

if (!updatedProduct) {
  throw new Error(`Insufficient stock available for ${item.name}`);
}
```
- **Interview question:** How does `findOneAndUpdate` with `$inc` prevent race conditions during flash sales?
  - *Answer:* MongoDB applies document-level write locks. The query condition `stock: { $gte: quantity }` and update `$inc: { stock: -quantity }` are evaluated as an atomic unit. If available stock is less than required, the query matches 0 documents and fails safely without deducting.

---

### TTL Indexes (Time-To-Live)
- **Category:** Database / Background Cleanup
- **What it is:** A specialized single-field index that MongoDB uses to automatically delete documents after a specified number of seconds or at a specific expiration timestamp.
- **Why we used it in ShopVilla:** In our OTP collection (`Otp`), authentication codes must automatically expire after 5 minutes. The MongoDB background thread automatically purges expired OTP documents from disk without requiring a cron job.
- **Where in our code:** [`server/models/Otp.js#L41`](file:///d:/SHOPVILLA/server/models/Otp.js#L41).
- **Example:**
```javascript
// server/models/Otp.js
// Document automatically expires and self-deletes when expiresAt timestamp is reached
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```
- **Alternatives:** Writing an explicit hourly cron script to find and delete expired records (`Otp.deleteMany({ expiresAt: { $lt: new Date() } })`).
- **Interview question:** How does MongoDB implement TTL (Time-To-Live) indexes under the hood?
  - *Answer:* A background thread in `mongod` runs once every 60 seconds, reads the TTL index, compares the indexed date field against the current server time, and removes expired documents.

---

### Soft Delete Pattern
- **Category:** Database / Pattern
- **What it is:** Instead of permanently deleting a record from the database with `DELETE` or `findByIdAndDelete`, an `isActive: false` or `isDeleted: true` flag is set on the document.
- **Why we used it in ShopVilla:** When a user or admin deactivates an account, hard-deleting the user document breaks historical orders because `order.user` references that `ObjectId`. Soft deletion preserves relational integrity and accounting histories while blocking future logins.
- **Where in our code:** [`server/models/User.js#L94`](file:///d:/SHOPVILLA/server/models/User.js#L94) and [`server/controllers/authController.js:deactivateMyAccount`](file:///d:/SHOPVILLA/server/controllers/authController.js#L267-L278).
- **Example:**
```javascript
// server/controllers/authController.js
const deactivateMyAccount = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });

  res.status(200).json({
    success: true,
    message: 'Account successfully deactivated. All previous order records remain preserved.',
  });
});
```
- **Interview question:** Why is soft delete preferred over hard delete in financial and e-commerce databases?
  - *Answer:* Hard deletion destroys audit trails, breaks foreign key references in past transaction histories, and violates legal/tax data retention requirements. Soft delete maintains referential integrity while archiving the record.

---

### Snapshot Pattern (Order Immutability)
- **Category:** Database / Pattern
- **What it is:** Copying and freezing an exact copy of related data (such as product name, unit price, and recipient shipping address) directly inside an order document at the exact second the purchase occurs.
- **Why we used it in ShopVilla:** If an administrator later changes a product's price from ₹999 to ₹1,499, or if a user updates their saved address, historical orders must NOT reflect the new price or address.
- **Where in our code:** [`server/models/Order.js#L29-L38`](file:///d:/SHOPVILLA/server/models/Order.js#L29-L38) and [`server/controllers/orderController.js:createOrder`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L82-L95).
- **Example:**
```javascript
// server/controllers/orderController.js
// Build immutable snapshot of line items using database prices at checkout time
const orderItems = cart.items.map((item) => ({
  product: item.product._id,
  name: item.product.name,
  price: item.product.price, // Trust ONLY database price at this exact second
  quantity: item.quantity,
  image: item.product.images[0] || '',
}));
```
- **Interview question:** Why should an Order document never merely reference the Product collection for prices?
  - *Answer:* Product prices change over time. If orders only store product ObjectIds and populate prices dynamically, every past invoice and revenue report would change whenever a store manager updates a product's price.

---

## 4. Authentication & Security

### JSON Web Tokens (JWT)
- **Category:** Auth / Security
- **What it is:** JSON Web Token (JWT) is a compact, URL-safe, digitally signed open standard (RFC 7519) used to securely transmit claims (such as a user ID and role) between a client and a server. Because the server signs the token using a secret key, the server can verify the identity of the sender without storing any session data in a database.
- **Why we used it in ShopVilla:** In ShopVilla, we use stateless authentication. The client stores the signed JWT token in `localStorage` and includes it in the HTTP `Authorization: Bearer <token>` header for every protected request. This allows our backend API on Render or Docker to authenticate requests instantly with zero database session lookups.
- **Where in our code:** [`server/controllers/authController.js:signToken`](file:///d:/SHOPVILLA/server/controllers/authController.js#L12-L17) and [`server/middleware/authMiddleware.js:protect`](file:///d:/SHOPVILLA/server/middleware/authMiddleware.js#L7-L50).
- **Example:**
```javascript
// server/controllers/authController.js
// Sign a compact JWT with the user's MongoDB ObjectId and a 7-day expiration
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
```
  - Line 2: Defines the helper function `signToken` taking the user's unique `id`.
  - Line 3: Calls `jwt.sign`, packaging the `{ id }` payload and signing it with the secret key `process.env.JWT_SECRET`.
  - Line 4: Sets a 7-day expiration time so compromised tokens expire automatically if abandoned.
- **Alternatives:** Stateful sessions stored in Redis or MongoDB (requires a database lookup on every single incoming HTTP request, introducing latency and storage overhead).
- **Interview question:** What is the main security risk of storing JWTs in localStorage versus httpOnly cookies?
  - *Answer:* Storing JWTs in `localStorage` makes them vulnerable to Cross-Site Scripting (XSS) attacks because JavaScript can read the storage. Storing them in `httpOnly` cookies prevents XSS extraction, but exposes the API to Cross-Site Request Forgery (CSRF) unless strict SameSite flags or anti-CSRF tokens are enforced.

---

### bcryptjs
- **Category:** Auth / Security
- **What it is:** `bcryptjs` is an optimized JavaScript implementation of the Blowfish-based `bcrypt` cryptographic one-way password hashing algorithm. It automatically incorporates random salts and configurable computational cost factors (work factors) to protect passwords against rainbow tables and brute-force cracking.
- **Why we used it in ShopVilla:** User passwords must never be stored in plain text. If our database is ever leaked or dumped, attackers cannot reverse the bcrypt hashes to reveal the plaintext passwords. We also use bcrypt to hash one-time passwords (OTPs) before saving them to the `Otp` collection.
- **Where in our code:** [`server/models/User.js#L54-L62`](file:///d:/SHOPVILLA/server/models/User.js#L54-L62) and [`server/services/otpService.js:generateAndSaveOtp`](file:///d:/SHOPVILLA/server/services/otpService.js#L23-L25).
- **Example:**
```javascript
// server/models/User.js
// Hash password automatically before saving user document if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```
  - Line 2: Registers a Mongoose pre-save hook that intercepts user document saves.
  - Line 3: Checks `this.isModified('password')` so existing hashes are not re-hashed when updating other profile fields.
  - Line 4: Generates a cryptographically strong 10-round random salt.
  - Line 5: Computes the irreversible bcrypt hash and overwrites the plain password before writing to MongoDB.
- **Alternatives:** Argon2 (modern winner of Password Hashing Competition, but bcrypt remains the battle-tested industry standard with broad hosting support) or PBKDF2.
- **Interview question:** Can a bcrypt hash be decrypted back to the original password?
  - *Answer:* No. Bcrypt is a one-way mathematical function, not an encryption cipher. To verify a password, the system hashes the newly entered candidate password with the original salt and compares the two resulting hashes using `bcrypt.compare()`.

---

### Salt Rounds (Work Factor)
- **Category:** Auth / Security
- **What it is:** Salt rounds (or cost factor) determine how many iterations of the Blowfish key expansion algorithm are performed when hashing a password. Each increment doubles the computational time required to calculate a hash (2^rounds iterations).
- **Why we used it in ShopVilla:** We configure 10 salt rounds (`bcrypt.genSalt(10)`). Ten rounds calculate in approximately 60-100ms on modern CPUs—fast enough that users experience zero login delay, but slow enough that an attacker testing billions of guessed passwords per second with specialized hardware will take decades to crack a single password.
- **Where in our code:** [`server/models/User.js#L56`](file:///d:/SHOPVILLA/server/models/User.js#L56) and [`server/services/otpService.js#L23`](file:///d:/SHOPVILLA/server/services/otpService.js#L23).
- **Example:**
```javascript
// server/services/otpService.js
// Generate a 10-round salt for hashing the ephemeral 6-digit OTP
const salt = await bcrypt.genSalt(10);
const hashedOtp = await bcrypt.hash(plainOtp, salt);
```
  - Line 2: Requests a 10-round salt from `bcrypt`.
  - Line 3: Combines the random 6-digit OTP with the salt and computes the final hash string.
- **Alternatives:** Lower salt rounds like 4-6 (too fast and vulnerable to modern GPU clusters) or higher rounds like 14-16 (takes over 1 second per hash, which would cause server thread starvation under heavy traffic).
- **Interview question:** What happens to your server if you set bcrypt salt rounds to 16?
  - *Answer:* Because Node.js handles CPU-intensive cryptographic operations via the Libuv worker pool, setting 16 rounds would cause each hash to take over 1-2 seconds of 100% CPU time. Under concurrent login traffic, the worker pool and CPU would become saturated, blocking the event loop and causing severe server latency.

---

### Role-Based Access Control (RBAC)
- **Category:** Auth / Security
- **What it is:** RBAC is an authorization pattern where system permissions are tied to specific user roles (e.g. `customer` vs `admin`) rather than assigned individually to each user.
- **Why we used it in ShopVilla:** Customers should only view products, manage their cart, and review their own orders. Only authorized store managers with the `admin` role should access revenue charts, update shipping statuses, adjust product inventory, or deactivate customer accounts.
- **Where in our code:** [`server/middleware/roleMiddleware.js:restrictTo`](file:///d:/SHOPVILLA/server/middleware/roleMiddleware.js#L3-L17) and routes like [`server/routes/adminRoutes.js#L18`](file:///d:/SHOPVILLA/server/routes/adminRoutes.js#L18).
- **Example:**
```javascript
// server/middleware/roleMiddleware.js
// Higher-order middleware factory that checks if req.user has the permitted role
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('Access forbidden: You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
```
  - Line 2: Declares `restrictTo` accepting an arbitrary list of authorized roles using rest parameters `...roles`.
  - Line 3: Returns an Express middleware function.
  - Line 4: Verifies that `req.user` was attached by the `protect` middleware and that `roles.includes(req.user.role)`.
  - Line 5-7: Rejects unauthorized callers immediately with an HTTP 403 Forbidden status code.
- **Alternatives:** Attribute-Based Access Control (ABAC) (more complex, checking environment, IP, and dynamic resource attributes; unnecessary for an e-commerce platform with customer and admin personas).
- **Interview question:** What is the difference between 401 Unauthorized and 403 Forbidden?
  - *Answer:* 401 Unauthorized means authentication is missing or invalid (the server does not know who you are; please log in). 403 Forbidden means authentication succeeded (the server knows who you are), but your role lacks the required privilege to perform the requested action.

---

### One-Time Passwords (OTP)
- **Category:** Auth / Security
- **What it is:** An OTP is a dynamic, single-use 6-digit numeric token generated for a specific purpose (such as email verification, cash-on-delivery confirmation, or password resets) that expires within a short window (5 minutes).
- **Why we used it in ShopVilla:** To prevent spam bot account registrations, fake customer emails, and fraud on Cash on Delivery orders, ShopVilla requires customers to verify ownership of their email inbox via a 6-digit code before their account is marked `isVerified = true` and before orders can be placed.
- **Where in our code:** [`server/services/otpService.js:generateAndSaveOtp`](file:///d:/SHOPVILLA/server/services/otpService.js#L7-L44) and [`server/models/Otp.js`](file:///d:/SHOPVILLA/server/models/Otp.js).
- **Example:**
```javascript
// server/services/otpService.js
// Generate cryptographically random 6-digit OTP and store hashed version
const plainOtp = Math.floor(100000 + Math.random() * 900000).toString();
const salt = await bcrypt.genSalt(10);
const hashedOtp = await bcrypt.hash(plainOtp, salt);
const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5-minute validity
```
  - Line 2: Produces an integer between 100000 and 999999 as a 6-character string.
  - Line 3-4: Hashes the OTP using bcrypt so database admins or read-replica breaches cannot see the plaintext code.
  - Line 5: Calculates a timestamp exactly 5 minutes in the future for automatic expiration.
- **Alternatives:** Magic link via email (convenient, but OTPs work consistently across mobile browsers, native apps, and desktop without redirect friction).
- **Interview question:** How do you protect an OTP verification endpoint against brute-force attacks?
  - *Answer:* In ShopVilla, we apply three protective layers: (1) we track an `attempts` counter on the OTP document and invalidate the code if 3 failed guesses occur; (2) we enforce a 60-second cooldown between resend requests; and (3) we wrap the verification endpoint in an IP rate limiter.

---

### Rate Limiting (express-rate-limit)
- **Category:** Security
- **What it is:** Rate limiting is an infrastructure defense mechanism that tracks and restricts the number of requests an individual client IP address can make to the server within a specified time window.
- **Why we used it in ShopVilla:** Without rate limiting, malicious attackers can execute distributed denial-of-service (DDoS) attacks, brute-force user passwords, spam thousands of email OTP dispatches to deplete email quotas, or flood payment checkout endpoints.
- **Where in our code:** [`server/middleware/rateLimiter.js`](file:///d:/SHOPVILLA/server/middleware/rateLimiter.js) and [`server/app.js#L68`](file:///d:/SHOPVILLA/server/app.js#L68).
- **Example:**
```javascript
// server/middleware/rateLimiter.js
// Strict limiter for authentication & OTP verification: 30 attempts per 15 minutes
const baseAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes',
  },
});
```
  - Line 3: Configures a 15-minute sliding window (15 * 60 * 1000 ms).
  - Line 4: Sets a maximum ceiling of 30 allowed requests per IP address per window.
  - Line 5-6: Emits standardized `RateLimit-*` headers indicating remaining quotas.
  - Line 7-10: Returns an HTTP 429 Too Many Requests response with a helpful error payload if exceeded.
- **Alternatives:** Redis-backed rate limiting with `rate-limiter-flexible` (better for multi-server clusters, but in-memory `express-rate-limit` is simple, zero-latency, and requires no external dependency for single-instance deployments).
- **Interview question:** How do you allow automated test suites to run quickly without tripping rate limiters?
  - *Answer:* In ShopVilla, we wrap our rate limiters with a dynamic check: `(req, res, next) => (process.env.NODE_ENV === 'test' ? next() : baseAuthLimiter(req, res, next))`. In test mode, requests bypass the counter directly.

---

### Helmet (HTTP Security Headers)
- **Category:** Security
- **What it is:** Helmet is an Express middleware package that automatically sets secure HTTP response headers (such as `Content-Security-Policy`, `X-DNS-Prefetch-Control`, `X-Frame-Options`, `Strict-Transport-Security`, and `X-Content-Type-Options`).
- **Why we used it in ShopVilla:** Browsers respect response headers to block dangerous behaviors like embedding ShopVilla in malicious iframe clickjacking attacks, MIME-type sniffing, or insecure protocol downgrades.
- **Where in our code:** [`server/app.js#L26`](file:///d:/SHOPVILLA/server/app.js#L26).
- **Example:**
```javascript
// server/app.js
// Apply 15+ secure HTTP response headers globally across all routes
app.use(helmet());
```
  - Line 2: Calling `helmet()` registers a suite of 15 smaller security middlewares in one simple line, shielding the Express application from standard automated penetration scans.
- **Alternatives:** Manually writing custom `res.setHeader()` calls for every individual security header in Express (tedious, error-prone, and difficult to keep updated with new browser security specifications).
- **Interview question:** What attack does the `X-Frame-Options: SAMEORIGIN` header prevent?
  - *Answer:* Clickjacking. It stops malicious third-party websites from rendering your site inside an invisible `<iframe>` overlay, which could trick logged-in users into unknowingly clicking buttons like "Confirm Payment" or "Delete Account".

---

### Cross-Origin Resource Sharing (CORS)
- **Category:** Security
- **What it is:** CORS is a browser security mechanism that restricts web applications running at one origin (e.g. `http://localhost:5173` or `https://shopvilla.vercel.app`) from making AJAX/Fetch requests to an API hosted on a different origin (e.g. `http://localhost:5000` or `https://shopvilla-api.onrender.com`).
- **Why we used it in ShopVilla:** Because our Vite frontend and Express backend run on separate domains and ports, the browser blocks all requests by default. We configure CORS in Express to whitelist only our trusted frontend URLs and allow essential headers like `Authorization` and `Content-Type`.
- **Where in our code:** [`server/app.js#L28-L46`](file:///d:/SHOPVILLA/server/app.js#L28-L46).
- **Example:**
```javascript
// server/app.js
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Allow server-to-server or tools like Postman
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(new Error('Blocked by CORS policy'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```
  - Line 2-5: Compiles a whitelist of allowed origins including local development and the production `CLIENT_URL` from environment variables.
  - Line 8-15: Dynamically checks incoming `origin` against the whitelist.
  - Line 16: Enables `credentials: true` so authorized cross-origin requests can exchange session headers.
  - Line 18: Explicitly permits the `Authorization` header required for JWT Bearer tokens.
- **Alternatives:** Setting `cors({ origin: '*' })` (unsafe in production because any malicious website can make authenticated requests to your API).
- **Interview question:** What is a CORS preflight request?
  - *Answer:* When a browser makes a "non-simple" cross-origin HTTP request (such as a request with JSON content or custom headers like `Authorization`), it first sends an automatic HTTP `OPTIONS` request to ask the server which origins, methods, and headers are permitted before sending the actual request.

---

### express-mongo-sanitize (NoSQL Injection Defense)
- **Category:** Security
- **What it is:** `express-mongo-sanitize` is a middleware that recursively inspects incoming request payloads (`req.body`, `req.query`, `req.params`) and strips out or sanitizes any keys that begin with a dollar sign (`$`) or contain dots (`.`).
- **Why we used it in ShopVilla:** In MongoDB, query operators like `$gt`, `$ne`, or `$regex` allow powerful query logic. If an attacker submits `{ "email": { "$ne": null }, "password": { "$ne": null } }` in a login form, an unsanitized MongoDB query would match the very first user in the database and bypass authentication. `express-mongo-sanitize` completely neutralizes this threat.
- **Where in our code:** [`server/app.js#L65`](file:///d:/SHOPVILLA/server/app.js#L65).
- **Example:**
```javascript
// server/app.js
// Recursively remove dollar signs ($) and dots (.) from user inputs
app.use(mongoSanitize());
```
  - Line 2: Intercepts all incoming JSON payloads and removes any MongoDB query operator keys before they reach controller queries.
- **Alternatives:** Manually checking `typeof req.body.email === 'string'` on every single endpoint (tedious and easily forgotten by developers).
- **Interview question:** What is NoSQL injection, and how does `mongoSanitize` stop it?
  - *Answer:* NoSQL injection occurs when untrusted JSON input containing MongoDB operators (like `$gt` or `$ne`) is passed directly to database queries, altering the developer's intended logic. `mongoSanitize` stops this by stripping all `$` prefixes from input keys before queries execute.

---

### express-validator (Input Validation & Sanitization)
- **Category:** Security / Backend
- **What it is:** `express-validator` is a server-side data validation and sanitization library built on top of `validator.js`. It provides declarative validation chains to verify data types, string lengths, email formats, and required fields.
- **Why we used it in ShopVilla:** To ensure that malformed or malicious data never reaches controllers or MongoDB models. We validate registration fields, product schemas, review ratings (1 to 5), and address fields before executing business logic.
- **Where in our code:** [`server/middleware/validators.js`](file:///d:/SHOPVILLA/server/middleware/validators.js).
- **Example:**
```javascript
// server/middleware/validators.js
// Registration input validation chain
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors,
];
```
  - Line 3: Ensures the `name` field is not empty and trims surrounding whitespace.
  - Line 4: Verifies valid email syntax and normalizes casing to prevent duplicate accounts.
  - Line 5-7: Enforces a minimum 6-character password constraint.
  - Line 8: Calls `handleValidationErrors`, which aggregates any failures and returns an HTTP 400 response with detailed field-specific errors.
- **Alternatives:** Joi or Zod (excellent schema validation libraries; `express-validator` is preferred in Express for its middleware-chain design).
- **Interview question:** Why must validation occur on the server even if client-side validation is already implemented?
  - *Answer:* Client-side validation can be bypassed easily by disabling JavaScript, editing browser code, or making direct HTTP requests via Postman or `curl`. Server-side validation is the only true barrier protecting the database.

---

### Insecure Direct Object References (IDOR) Defense
- **Category:** Security / Pattern
- **What it is:** IDOR is an access control vulnerability that occurs when an application exposes a reference to an internal database object (such as an order ID or address ID in a URL like `/api/v1/orders/:id`) without verifying that the authenticated user actually owns that object.
- **Why we used it in ShopVilla:** Without an ownership check, User A could alter the URL ID to inspect User B's private shipping address, ordered items, phone number, or cancel User B's order. ShopVilla strictly verifies user ownership or admin privilege on every order and address endpoint.
- **Where in our code:** [`server/controllers/orderController.js:getOrderById`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L200-L208) and [`cancelOrder`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L215-L225).
- **Example:**
```javascript
// server/controllers/orderController.js
// Verify that the logged-in user owns this order, or is an administrator
if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
  return next(new AppError('Not authorized to view this order', 403));
}
```
  - Line 2: Converts MongoDB ObjectIds to strings and checks whether the order's owner matches `req.user._id`. Also checks if `req.user.role !== 'admin'`.
  - Line 3: Immediately rejects unauthorized viewers with an HTTP 403 Forbidden status code.
- **Alternatives:** Using non-sequential UUIDs (UUIDs obscure predictable sequences like 1, 2, 3, but true security still requires server-side ownership checks).
- **Interview question:** Can using UUIDs instead of auto-incrementing IDs completely solve IDOR?
  - *Answer:* No. While UUIDs make IDs unguessable, if an attacker obtains a target UUID (through browser history, shared links, or referral logs), an application without server-side ownership checks will still serve the unauthorized data.

---

### Account Enumeration Defense
- **Category:** Security / Pattern
- **What it is:** Account enumeration is a technique where attackers submit different email addresses to registration or forgot-password endpoints and observe variations in error messages (e.g. "Email already exists" vs "User not found") to build a list of valid user accounts.
- **Why we used it in ShopVilla:** To protect user privacy, our registration and forgot-password endpoints return identical, generic success responses regardless of whether the email address was already registered or not.
- **Where in our code:** [`server/controllers/authController.js:register`](file:///d:/SHOPVILLA/server/controllers/authController.js#L20-L55) and [`forgotPassword`](file:///d:/SHOPVILLA/server/controllers/authController.js#L130-L160).
- **Example:**
```javascript
// server/controllers/authController.js
// Return uniform response whether account exists or is newly created
if (existingUser) {
  // Silent return without revealing account existence
  return res.status(200).json({
    success: true,
    message: "If this email can be registered, we've sent an OTP to verify your account.",
  });
}
```
  - Line 2: Detects that the submitted email is already registered in MongoDB.
  - Line 4-7: Returns HTTP 200 with the exact same reassuring confirmation message as a brand-new registration, giving zero clues to malicious reconnaissance bots.
- **Alternatives:** Explicit errors like "Email already registered" (helpful for legitimate users, but leaks user database membership to attackers).
- **Interview question:** What is account enumeration, and why is it dangerous?
  - *Answer:* It allows attackers to confirm whether a specific person (e.g. CEO, employee, or celebrity) has an account on a platform. Attackers can then target those verified emails with credential stuffing, password spray, or spear-phishing attacks.

---

### Cross-Site Scripting (XSS) Prevention
- **Category:** Security
- **What it is:** XSS is a vulnerability where malicious executable JavaScript code is injected into a website and executed within the victim's browser, potentially stealing auth tokens, session data, or DOM content.
- **Why we used it in ShopVilla:** E-commerce stores accept lots of user content: product reviews, comments, and shipping addresses. We use React's built-in JSX escaping (which safely encodes strings before rendering) and Helmet's HTTP security headers to ensure user-submitted HTML tags are never executed as scripts.
- **Where in our code:** React JSX rendering in all frontend components (e.g. [`client/src/pages/ProductDetailPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/ProductDetailPage.jsx)) and [`server/app.js#L26`](file:///d:/SHOPVILLA/server/app.js#L26).
- **Example:**
```jsx
// client/src/pages/ProductDetailPage.jsx
// React automatically escapes string values rendered inside JSX curly braces
<p className="card-text text-secondary mb-0">{review.comment}</p>
```
  - Line 2: If `review.comment` contains `<script>alert('hack')</script>`, React automatically converts `<` and `>` into safe HTML entities (`&lt;` and `&gt;`), rendering plain text rather than executing code.
- **Alternatives:** Sanitizing HTML strings with `DOMPurify` before inserting them with `dangerouslySetInnerHTML` (only required when intentionally allowing rich-text formatting).
- **Interview question:** Does React completely protect an application from XSS?
  - *Answer:* React protects against most standard XSS by escaping values in JSX. However, vulnerabilities can still occur if developers use `dangerouslySetInnerHTML`, bind user input directly to `href` attributes (e.g. `href="javascript:..."`), or directly manipulate the DOM using `document.getElementById().innerHTML`.

---

### Cross-Site Request Forgery (CSRF) Prevention
- **Category:** Security
- **What it is:** CSRF is an exploit where a malicious third-party site tricks a victim's browser into submitting unauthorized requests to a web application where the victim is currently authenticated (because browsers automatically attach cookies to cross-site requests).
- **Why we used it in ShopVilla:** We prevent CSRF attacks by avoiding automatic ambient credentials. Instead of storing tokens in cookies that are sent automatically by the browser, ShopVilla requires the frontend to manually attach the token inside an `Authorization: Bearer <token>` header for every request.
- **Where in our code:** [`client/src/api/axios.js#L11-L19`](file:///d:/SHOPVILLA/client/src/api/axios.js#L11-L19) and [`server/middleware/authMiddleware.js#L11-L22`](file:///d:/SHOPVILLA/server/middleware/authMiddleware.js#L11-L22).
- **Example:**
```javascript
// client/src/api/axios.js
// Manually inject Authorization header for authenticated requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('shopvilla_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```
  - Line 3-8: The browser will NOT attach `localStorage` tokens automatically during cross-site form submissions or image tag requests. Only JavaScript originating from our own frontend origin can read and attach the header.
- **Alternatives:** Anti-CSRF Synchronizer Tokens (CSRF tokens embedded in hidden form inputs or custom headers) or `SameSite=Strict` cookies.
- **Interview question:** Why are APIs that use `Authorization: Bearer` headers inherently immune to CSRF?
  - *Answer:* Because browsers only auto-send ambient credentials like cookies and HTTP Basic auth headers during cross-site requests. A third-party site cannot force a victim's browser to attach custom headers like `Authorization` without triggering a CORS preflight that gets blocked by the server.

---

### HMAC-SHA256 Cryptographic Signatures
- **Category:** Security / Payments
- **What it is:** Hash-based Message Authentication Code (HMAC) is a cryptographic construction that uses a secret cryptographic key combined with the SHA-256 hash function to verify both data integrity and the authenticity of a message.
- **Why we used it in ShopVilla:** When Razorpay notifies our server of a payment success (either via the frontend return or an asynchronous webhook), an attacker could spoof the HTTP request to mark their order as paid for free. We use HMAC-SHA256 to verify that the signature could only have been generated by Razorpay using our shared secret key.
- **Where in our code:** [`server/controllers/orderController.js:verifyRazorpayPayment`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L125-L140) and [`server/services/razorpayService.js:verifyPaymentSignature`](file:///d:/SHOPVILLA/server/services/razorpayService.js#L35-L48).
- **Example:**
```javascript
// server/services/razorpayService.js
// Compute HMAC-SHA256 hash of orderId + "|" + paymentId using RAZORPAY_KEY_SECRET
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  return generatedSignature === signature;
};
```
  - Line 3-6: Creates an HMAC instance using Node's native `crypto` module, hashes the concatenated string with our secret key, and outputs a hex digest.
  - Line 8: Compares our generated signature with the signature returned from the gateway. If they match, the payment is guaranteed authentic.
- **Alternatives:** Asymmetric public/private key pairs like RSA or ECDSA (heavier computation; HMAC is the industry standard for payment webhooks).
- **Interview question:** Why is simple MD5 or SHA-256 hashing insufficient for verifying webhooks?
  - *Answer:* A simple hash only guarantees data integrity (that data wasn't accidentally corrupted). Anyone can compute a SHA-256 hash. HMAC requires a secret shared key, which guarantees both data integrity AND authenticity (proving the message originated from the authorized payment gateway).

---

## 5. Payment Processing & Gateways

### Razorpay Orders API
- **Category:** Payments
- **What it is:** The server-side API provided by Razorpay to create an official payment order on the gateway before presenting the payment checkout modal to the customer.
- **Why we used it in ShopVilla:** Creating an order on Razorpay binds the exact payable amount and currency directly on Razorpay's servers. This prevents client-side tampering (e.g. an attacker modifying a JavaScript variable in the browser to pay ₹1 instead of ₹1,999).
- **Where in our code:** [`server/services/razorpayService.js:createOrder`](file:///d:/SHOPVILLA/server/services/razorpayService.js#L14-L28).
- **Example:**
```javascript
// server/services/razorpayService.js
// Create an authoritative Razorpay order with amount in smallest currency sub-unit (paise)
const createOrder = async (amountInRupees, receiptId) => {
  const options = {
    amount: Math.round(amountInRupees * 100), // Convert ₹ to paise (₹500 = 50000 paise)
    currency: 'INR',
    receipt: receiptId.toString(),
  };

  return await razorpayInstance.orders.create(options);
};
```
  - Line 4: Converts Indian Rupees into paise (the smallest currency unit required by financial payment gateways to eliminate floating point rounding errors).
  - Line 5: Enforces INR as the official currency code.
  - Line 6: Binds our internal MongoDB order ObjectId as the external `receipt` identifier.
  - Line 9: Dispatches the order creation request to Razorpay via their official SDK.
- **Alternatives:** Stripe PaymentIntents (global standard, but Razorpay is the leading gateway in India supporting UPI, RuPay, and domestic net banking).
- **Interview question:** Why do payment gateways require amounts to be passed in integers (paise or cents) rather than floats?
  - *Answer:* Binary floating-point representation in computers causes precision errors (e.g. `0.1 + 0.2 === 0.30000000000000004`). Converting amounts to the smallest currency unit (paise/cents) allows integer arithmetic, eliminating rounding discrepancies in financial transactions.

---

### Payment Signature Verification
- **Category:** Payments / Security
- **What it is:** The mathematical verification of the cryptographic token returned by the payment gateway's checkout modal upon successful completion of a transaction.
- **Why we used it in ShopVilla:** When the customer completes payment in the Razorpay popup, the browser sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to our backend. We verify this signature on the server before updating the order status to `PAID` and `CONFIRMED`.
- **Where in our code:** [`server/controllers/orderController.js:verifyRazorpayPayment`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L125-L160).
- **Example:**
```javascript
// server/controllers/orderController.js
// Verify signature authenticity before confirming order
const isValid = razorpayService.verifyPaymentSignature(
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature
);

if (!isValid) {
  return next(new AppError('Invalid payment signature. Verification failed.', 400));
}

order.paymentStatus = 'PAID';
order.orderStatus = 'CONFIRMED';
order.razorpayPaymentId = razorpay_payment_id;
await order.save();
```
  - Line 2-6: Calls the HMAC verification service.
  - Line 8-10: If the signature is fraudulent or mismatched, rejects the request immediately.
  - Line 12-15: Advances the order state machine to `PAID` and saves the payment ID for future reconciliation or refunds.
- **Alternatives:** Directly querying the gateway API for every payment verification (slower and introduces an extra network round-trip compared to instant local cryptographic verification).
- **Interview question:** What would happen if an e-commerce platform updated orders to PAID without signature verification?
  - *Answer:* Any malicious user could intercept the HTTP network request and send random strings for payment IDs. The server would mark orders as paid without any actual money being transferred, allowing free purchases.

---

### Webhooks (Asynchronous Gateway Events)
- **Category:** Payments / Backend
- **What it is:** A webhook is an automated HTTP POST request sent directly from an external service (Razorpay) to our backend server URL when an important event occurs (such as `payment.captured`, `payment.failed`, or `refund.processed`).
- **Why we used it in ShopVilla:** If a customer pays successfully on their phone but their battery dies, their network drops, or they close the browser tab before the frontend can send the verification request, our server would never know the order was paid. Razorpay's webhook delivers the payment confirmation asynchronously to our server in the background.
- **Where in our code:** [`server/app.js#L50-L60`](file:///d:/SHOPVILLA/server/app.js#L50-L60) and [`server/controllers/orderController.js:handleRazorpayWebhook`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L165-L230).
- **Example:**
```javascript
// server/controllers/orderController.js
// Process asynchronous webhook event delivered directly by Razorpay servers
const handleRazorpayWebhook = catchAsync(async (req, res, next) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'];

  // Verify webhook signature using the preserved raw request body buffer
  const isSignatureValid = razorpayService.verifyWebhookSignature(req.rawBody, signature, webhookSecret);
  if (!isSignatureValid) {
    return res.status(400).json({ status: 'error', message: 'Invalid webhook signature' });
  }

  const { event, payload } = req.body;
  // Handle event: payment.captured, payment.failed, refund.processed...
  res.status(200).json({ status: 'ok' });
});
```
  - Line 4-5: Extracts the webhook secret and gateway signature from the `x-razorpay-signature` header.
  - Line 8: Validates the cryptographic signature against the raw unparsed request body.
  - Line 14: Responds with HTTP 200 to acknowledge receipt so the gateway does not retry delivery.
- **Alternatives:** Polling the payment gateway API every second from the client (wastes server resources, drains mobile battery, and fails if the user closes the page).
- **Interview question:** Why is it critical to respond with an HTTP 200 OK status immediately upon receiving a payment webhook?
  - *Answer:* Payment gateways follow retry policies. If your webhook handler times out or returns a non-2xx status code, the gateway assumes delivery failed and will repeatedly resend the same webhook event at exponential backoff intervals.

---

### Webhook Idempotency (Event Deduplication)
- **Category:** Payments / Reliability
- **What it is:** Idempotency is an architectural property ensuring that performing an operation multiple times produces the exact same outcome as performing it once, preventing accidental duplicate actions.
- **Why we used it in ShopVilla:** Payment gateways frequently retry webhooks when network hiccups occur. If Razorpay sends the same `payment.captured` webhook 3 times, ShopVilla must NOT confirm the order 3 times or dispatch 3 duplicate confirmation emails. We store processed event IDs in MongoDB to deduplicate incoming events.
- **Where in our code:** [`server/models/Order.js#L54`](file:///d:/SHOPVILLA/server/models/Order.js#L54) and [`server/controllers/orderController.js#L180-L192`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L180-L192).
- **Example:**
```javascript
// server/controllers/orderController.js
// Idempotency check: ignore duplicate webhook events
if (order.paymentStatus === 'PAID' || order.processedWebhookEventIds.includes(eventId)) {
  return res.status(200).json({ status: 'ok', message: 'Event already processed' });
}

order.paymentStatus = 'PAID';
order.orderStatus = 'CONFIRMED';
order.processedWebhookEventIds.push(eventId); // Persist event ID to MongoDB
await order.save();
```
  - Line 2: Checks if the order is already marked `PAID` or if `order.processedWebhookEventIds` already includes the unique `eventId`.
  - Line 3: If previously processed, acknowledges the gateway with HTTP 200 without executing side effects.
  - Line 8: Appends `eventId` into the persistent array before saving, guaranteeing idempotency survives server restarts.
- **Alternatives:** Keeping processed event IDs in an in-memory Set (fails completely when the server restarts or scales to multiple instances).
- **Interview question:** What is an idempotent API, and why is it essential in payment processing?
  - *Answer:* An API is idempotent if identical requests result in the same state without unintended side effects. In payments, network retries are common. Without idempotency, duplicate webhook delivery could result in duplicate fulfillment, multiple refunds, or repeated inventory adjustments.

---

### Raw Request Body Capture
- **Category:** Payments / Security
- **What it is:** Preserving the exact, unmodified byte buffer of an incoming HTTP POST request body before any JSON parser modifies formatting, key ordering, or whitespace.
- **Why we used it in ShopVilla:** Cryptographic HMAC signature verification for webhooks calculates a hash over the exact bytes sent by the payment gateway. If `express.json()` parses the payload first, whitespace and key ordering can change, causing signature validation to fail. We mount a dedicated `express.raw` route before `express.json`.
- **Where in our code:** [`server/app.js#L50-L63`](file:///d:/SHOPVILLA/server/app.js#L50-L63).
- **Example:**
```javascript
// server/app.js
// Dedicated Raw Body Webhook Route (registered strictly BEFORE express.json)
app.post(
  '/api/v1/orders/webhook',
  express.raw({ type: 'application/json' }),
  (req, res, next) => {
    // Preserve binary raw buffer for HMAC verification and parse payload
    req.rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || '');
    try {
      req.body = req.rawBody.length > 0 ? JSON.parse(req.rawBody.toString('utf8')) : {};
    } catch (e) {
      req.body = {};
    }
    next();
  },
  orderController.handleRazorpayWebhook
);
```
  - Line 4: Binds the raw body parser exclusively to the `/api/v1/orders/webhook` path.
  - Line 7: Stores the exact byte buffer on `req.rawBody`.
  - Line 9: Parses the buffer into JSON on `req.body` so controllers can still read fields normally.
- **Alternatives:** Using `JSON.stringify(req.body)` for verification (fails frequently because string serialization changes whitespace, indentation, and key order from the gateway's original payload).
- **Interview question:** Why does webhook signature verification fail if you pass `JSON.stringify(req.body)` instead of the raw body?
  - *Answer:* Cryptographic hashes like HMAC are avalanche-sensitive: a single altered space, newline, or swapped JSON key changes the entire resulting hash. `JSON.stringify()` rarely matches the gateway's exact original byte sequence.

---

### Automated Payment Reconciliation
- **Category:** Payments / Reliability
- **What it is:** A scheduled background job that audits and cross-references pending orders in our database against the live payment records on the payment gateway's servers.
- **Why we used it in ShopVilla:** In real-world e-commerce, edge cases happen: webhooks fail due to network outages, and users close their checkout window midway through payment. Our reconciliation service regularly queries Razorpay for any unconfirmed orders and reconciles their statuses.
- **Where in our code:** [`server/services/reconciliationService.js:reconcilePendingOrders`](file:///d:/SHOPVILLA/server/services/reconciliationService.js#L8-L75).
- **Example:**
```javascript
// server/services/reconciliationService.js
// Query live payment state from Razorpay before making any order decisions
let paymentState = { isPaid: false, isFailed: false };
if (order.razorpayOrderId) {
  paymentState = await razorpayService.fetchPaymentState(order.razorpayOrderId);
}

// If Razorpay captured payment exists, mark PAID and CONFIRMED (never cancel!)
if (paymentState.isPaid) {
  order.paymentStatus = 'PAID';
  order.orderStatus = 'CONFIRMED';
  await order.save();
  await sendOrderConfirmationEmail(order, order.user.email);
}
```
  - Line 4: Directly queries Razorpay API to inspect the payment status of the order.
  - Line 8: If the customer actually paid, recovers the order to `PAID` and `CONFIRMED`, ensuring customers never lose money without getting their items.
- **Alternatives:** Manual reconciliation by customer support agents checking spreadsheets and gateway dashboards (slow, expensive, and frustrating for customers).
- **Interview question:** What is the purpose of payment reconciliation in an e-commerce system?
  - *Answer:* It acts as a safety net that resolves discrepancies between the local database and the payment gateway. If frontend verification fails and webhooks are lost to network issues, reconciliation finds captured payments and confirms the orders automatically.

---

### 30-Minute Payment Expiry Job
- **Category:** Payments / Reliability
- **What it is:** A scheduled background task that automatically expires pending orders that have remained uncompleted for more than 30 minutes, releasing held inventory stock back to the public catalog.
- **Why we used it in ShopVilla:** When an online order is initiated, ShopVilla atomically deducts inventory stock to reserve items for the customer. If the customer walks away or abandons payment, that inventory remains locked. After verifying with Razorpay that no payment was captured, the 30-minute expiry job cancels the order and restores the stock.
- **Where in our code:** [`server/services/reconciliationService.js#L42-L51`](file:///d:/SHOPVILLA/server/services/reconciliationService.js#L42-L51).
- **Example:**
```javascript
// server/services/reconciliationService.js
// Only cancel when Razorpay confirms no captured payment AND order is older than 30 minutes
if (order.createdAt < thirtyMinutesAgo) {
  await cancelOrderService(
    order,
    null,
    'Payment expired: order auto-cancelled after 30 minutes of inactivity. Stock restored.'
  );
}
```
  - Line 2: Checks if the pending order's timestamp is older than 30 minutes ago.
  - Line 3-7: Invokes `cancelOrderService`, which sets `orderStatus = 'CANCELLED'` and restores inventory stock.
- **Alternatives:** Requiring store managers to manually click "Cancel Unpaid Orders" every day (leaves stock locked for hours and leads to lost sales).
- **Interview question:** Why must an expiry job verify with the payment gateway before cancelling an unpaid order?
  - *Answer:* Because the customer might have successfully paid at minute 29 while a webhook was delayed. Cancelling the order without checking the gateway would result in taking the customer's money while cancelling their order and releasing their items to someone else.

---

### Automated Refund Processing
- **Category:** Payments
- **What it is:** Programmatically instructing the payment gateway via API to return funds to a customer's original payment method (bank account, card, or UPI) when an order is cancelled.
- **Why we used it in ShopVilla:** When a customer or admin cancels an online order that has already been paid (`paymentStatus === 'PAID'`), ShopVilla automatically triggers a Razorpay refund and updates the order status to `REFUND_INITIATED`.
- **Where in our code:** [`server/services/orderService.js:cancelOrderService`](file:///d:/SHOPVILLA/server/services/orderService.js#L23-L33) and [`server/services/razorpayService.js:initiateRefund`](file:///d:/SHOPVILLA/server/services/razorpayService.js#L50-L65).
- **Example:**
```javascript
// server/services/orderService.js
// Handle refund initiation for captured online orders
if (order.paymentStatus === 'PAID') {
  order.paymentStatus = 'REFUND_INITIATED';
  if (order.razorpayPaymentId) {
    try {
      await razorpayService.initiateRefund(order.razorpayPaymentId, order.totalAmount, { reason });
    } catch (err) {
      console.warn(`[Refund Initiation Warning] Order ${order._id}:`, err.message);
    }
  }
}
```
  - Line 2-3: Checks if the order was paid and transitions `paymentStatus` to `REFUND_INITIATED`.
  - Line 5-7: Calls Razorpay's refund API with the transaction ID and total amount.
- **Alternatives:** Manual refunds initiated by human agents through the Razorpay web dashboard (slow, prone to human error, and creates customer service backlogs).
- **Interview question:** What is the difference between `REFUND_INITIATED` and `REFUNDED` in ShopVilla?
  - *Answer:* `REFUND_INITIATED` means our server successfully requested the gateway to process the refund. `REFUNDED` means Razorpay later sent an asynchronous `refund.processed` webhook confirming that the banking partner successfully settled the funds back into the customer's account.

---

### Cash on Delivery (COD) Workflow
- **Category:** Payments
- **What it is:** A payment method where the customer pays cash or UPI directly to the courier delivery executive at their doorstep when the physical package arrives.
- **Why we used it in ShopVilla:** COD is the most popular payment method in Indian e-commerce for customers without credit cards or those who prefer inspecting packages before paying.
- **Where in our code:** [`server/controllers/orderController.js:createOrder`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L75-L100) and [`server/controllers/adminController.js:updateOrderStatus`](file:///d:/SHOPVILLA/server/controllers/adminController.js#L140-L155).
- **Example:**
```javascript
// server/controllers/adminController.js
// When delivery executive delivers COD package, transition paymentStatus to PAID
if (newStatus === 'DELIVERED' && order.paymentMethod === 'COD' && order.paymentStatus === 'COD_PENDING') {
  order.paymentStatus = 'PAID';
}
```
  - Line 2: Detects that the order was delivered and used Cash on Delivery.
  - Line 3: Updates `paymentStatus` from `COD_PENDING` to `PAID`, reflecting that cash was collected at the customer's door.
- **Alternatives:** Requiring 100% online prepayment (severely reduces checkout conversion in markets where COD is standard).
- **Interview question:** How does ShopVilla prevent fraud on Cash on Delivery orders?
  - *Answer:* ShopVilla blocks unverified users from placing COD orders by checking `req.user.isVerified`. Users must verify their email with an OTP before any COD order can be placed.

---

## 6. Concepts & Architectural Patterns

### Finite State Machine (Order Lifecycle)
- **Category:** Pattern / Backend
- **What it is:** A behavioral design pattern where an entity (an Order) can only exist in one of a finite number of predetermined states at any given time, and transitions between states must follow strict validation rules.
- **Why we used it in ShopVilla:** An order cannot jump directly from `PENDING` to `DELIVERED` without being shipped, and an order that is already `DELIVERED` cannot be changed to `PROCESSING` or `CANCELLED`. We enforce a strict state machine to maintain business integrity.
- **Where in our code:** [`server/controllers/adminController.js:VALID_ORDER_TRANSITIONS`](file:///d:/SHOPVILLA/server/controllers/adminController.js#L110-L125).
- **Example:**
```javascript
// server/controllers/adminController.js
// Strict order status transition matrix
const VALID_ORDER_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'], // Admins can recall shipped orders
  DELIVERED: [], // Final terminal state
  CANCELLED: [], // Final terminal state
};
```
  - Line 3-8: Defines the permitted next states for each current status. `DELIVERED` and `CANCELLED` have empty arrays because they are immutable terminal states.
- **Alternatives:** Unrestricted status updates allowing admins to select any status from a dropdown (causes data corruption and confusing customer notifications).
- **Interview question:** What is a terminal state in an order lifecycle state machine?
  - *Answer:* A terminal state is a final state (like `DELIVERED` or `CANCELLED`) from which no further transitions are allowed. Once an order reaches a terminal state, its lifecycle is closed.

---

### Race Conditions & Concurrency Control
- **Category:** Pattern / Database
- **What it is:** A race condition occurs when multiple concurrent operations attempt to read and modify the same shared resource (e.g. inventory stock) simultaneously, leading to invalid state (such as overselling a product).
- **Why we used it in ShopVilla:** If a popular product has only 1 unit remaining in stock and two users click "Place Order" at the exact same millisecond, both requests might read `stock: 1` and approve the sale, leaving inventory at -1. ShopVilla prevents this using atomic conditional database operations.
- **Where in our code:** [`server/controllers/orderController.js:deductInventoryStock`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L18-L28).
- **Example:**
```javascript
// server/controllers/orderController.js
// Atomic conditional deduction prevents two users from purchasing the same last unit
const updatedProduct = await Product.findOneAndUpdate(
  { _id: item.product, stock: { $gte: item.quantity } },
  { $inc: { stock: -item.quantity } },
  { new: true }
);

if (!updatedProduct) {
  throw new Error(`Insufficient stock available for ${item.name}`);
}
```
  - Line 3: The query condition `{ stock: { $gte: item.quantity } }` ensures MongoDB only performs the update if enough stock exists at the exact microsecond of execution.
  - Line 4: `$inc` decrements the stock atomically inside MongoDB's document-level lock.
  - Line 8-10: If another user grabbed the last unit a millisecond earlier, `updatedProduct` returns `null` and the second order is rejected cleanly.
- **Alternatives:** Distributed locks with Redis (Redlock) or database transactions (heavier performance cost; atomic conditional updates are fast and native to MongoDB).
- **Interview question:** How does MongoDB's document-level locking prevent race conditions during updates?
  - *Answer:* MongoDB applies write locks at the individual document level (WiredTiger engine). When an atomic operation like `findOneAndUpdate` executes on a document, other write operations on that specific document are queued, ensuring sequential execution without corrupted interleaved writes.

---

### Compensating Rollback (Two-Phase Commit Alternative)
- **Category:** Pattern / Architecture
- **What it is:** A compensating transaction pattern where an application manually executes reverse operations (like restoring deducted inventory) if a subsequent step in a multi-step workflow fails.
- **Why we used it in ShopVilla:** When placing an order, ShopVilla must: (1) reserve stock, (2) create an order record, and (3) communicate with the external Razorpay API. If Razorpay is down, we must immediately roll back the deducted inventory so the stock count is accurate.
- **Where in our code:** [`server/controllers/orderController.js:deductInventoryStock`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L29-L36) and [`createOrder`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L112-L120).
- **Example:**
```javascript
// server/controllers/orderController.js
// If Razorpay order creation fails, roll back deducted inventory
try {
  razorpayOrder = await razorpayService.createOrder(totalAmount, order._id);
} catch (err) {
  // Compensating rollback: restore deducted stock back to catalog
  await restoreInventoryStock(orderItems);
  order.paymentStatus = 'FAILED';
  order.orderStatus = 'CANCELLED';
  await order.save();
  return next(new AppError('Payment gateway unavailable. Order cancelled and stock restored.', 502));
}
```
  - Line 5-6: If Razorpay throws a network or credential error, the `catch` block restores the reserved stock immediately.
  - Line 7-8: Marks the local order as cancelled so no orphaned pending records remain.
- **Alternatives:** Two-Phase Commit (2PC) or distributed transactions (not supported across independent external third-party payment gateway APIs).
- **Interview question:** What is a compensating transaction in distributed systems?
  - *Answer:* In distributed architectures where traditional ACID transactions across third-party services are impossible, a compensating transaction is an explicit business operation designed to reverse the effects of a previously completed step if a later step fails.

---

### Pagination (Cursor / Offset)
- **Category:** Pattern / Backend
- **What it is:** Dividing a large collection of database records into smaller, manageable chunks or pages (e.g. 10 or 20 items per request) rather than returning thousands of records all at once.
- **Why we used it in ShopVilla:** As ShopVilla grows to have thousands of products and orders, returning all records in a single API call would crash browser memory and overwhelm the server. We use offset-based pagination with `page` and `limit` query parameters.
- **Where in our code:** [`server/utils/apiFeatures.js:paginate`](file:///d:/SHOPVILLA/server/utils/apiFeatures.js#L34-L44) and [`server/controllers/orderController.js:getMyOrders`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L185-L198).
- **Example:**
```javascript
// server/controllers/orderController.js
// Calculate skip offset for paginated order queries
const page = Math.max(1, parseInt(req.query.page, 10) || 1);
const limit = Math.max(1, parseInt(req.query.limit, 10) || 20);
const skip = (page - 1) * limit;

const totalOrders = await Order.countDocuments({ user: req.user._id });
const orders = await Order.find({ user: req.user._id })
  .sort('-createdAt')
  .skip(skip)
  .limit(limit);
```
  - Line 3-5: Parses page number and limit, calculating the number of records to `skip` ((page - 1) * limit).
  - Line 7: Counts the total matching documents to calculate `totalPages`.
  - Line 8-11: Executes the query with `.skip(skip).limit(limit)`.
- **Alternatives:** Cursor-based pagination (e.g. `where _id < lastSeenId`, ideal for infinite scroll feeds; offset pagination is preferred when users need direct numbered page navigation like "Page 1, 2, 3").
- **Interview question:** What is the performance pitfall of offset pagination (`.skip()`) on large datasets?
  - *Answer:* As the offset increases (e.g. `.skip(100000)`), MongoDB must still scan and discard the first 100,000 documents before returning the 20 requested records, degrading query performance on deep pages.

---

### N+1 Query Problem & Elimination
- **Category:** Pattern / Database
- **What it is:** An architectural performance bug where an application executes 1 initial query to fetch a list of parent records, followed by N additional queries inside a loop to fetch related child data for each individual record.
- **Why we used it in ShopVilla:** In our admin customer analytics endpoint, querying 100 customers and then running a separate `Order.countDocuments({ user: customer._id })` inside a JavaScript `forEach` loop would execute 1 + 100 = 101 database queries. We eliminated this in ShopVilla using a single aggregation pipeline with a sub-pipeline `$lookup` and `$count`.
- **Where in our code:** [`server/controllers/adminController.js:getCustomers`](file:///d:/SHOPVILLA/server/controllers/adminController.js#L185-L215).
- **Example:**
```javascript
// server/controllers/adminController.js
// Efficient single-query sub-pipeline lookup: counts orders per customer in the database
{
  $lookup: {
    from: 'orders',
    let: { userId: '$_id' },
    pipeline: [
      { $match: { $expr: { $eq: ['$user', '$$userId'] } } },
      { $count: 'count' },
    ],
    as: 'orderCountData',
  },
}
```
  - Line 4: Passes the customer's `_id` into the sub-pipeline variable `$$userId`.
  - Line 6-7: Filters orders matching the user ID and immediately runs `$count` on the database server.
  - Line 9: Returns a single lightweight integer rather than loading all historical order documents into RAM.
- **Alternatives:** Dataloader pattern (commonly used in GraphQL servers to batch and cache child lookups).
- **Interview question:** How do you detect and fix an N+1 query problem in Node.js?
  - *Answer:* You detect it by inspecting query logs (like Mongoose debug logs) and seeing repeated identical queries firing in rapid succession. You fix it by replacing loops with database-level joins (`$lookup` in MongoDB, `JOIN` in SQL) or batch queries using the `$in` operator.

---

### Separation of Concerns (SoC)
- **Category:** Pattern / Architecture
- **What it is:** A software design principle that divides an application into distinct sections, each addressing a single, specific aspect of the system's functionality (e.g. routing, business logic, database access, and utility helpers).
- **Why we used it in ShopVilla:** We strictly separate our backend into:
  - **Routes:** Map HTTP paths and methods to middleware.
  - **Middleware:** Handle authentication, validation, sanitization, and rate limiting.
  - **Controllers:** Parse request parameters and send HTTP responses.
  - **Services:** Execute reusable business logic (e.g. order cancellation, Razorpay integration, email dispatches).
  - **Models:** Define database schemas, indexes, and validation rules.
- **Where in our code:** [`server/routes/orderRoutes.js`](file:///d:/SHOPVILLA/server/routes/orderRoutes.js), [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js), and [`server/services/orderService.js`](file:///d:/SHOPVILLA/server/services/orderService.js).
- **Example:**
```javascript
// server/routes/orderRoutes.js
// Route layer only defines endpoints and attaches middleware
router.route('/:id/cancel').patch(protect, cancelOrder);
```
  - Line 2: The route file does not contain SQL queries or business logic. It simply declares that a PATCH to `/:id/cancel` requires the `protect` authentication middleware and forwards execution to the `cancelOrder` controller.
- **Alternatives:** Monolithic route files where routes, database queries, and payment processing are all written inside a single 2,000-line file (nightmare to test, debug, and maintain).
- **Interview question:** What are the benefits of separating business logic into service files rather than writing it directly inside controllers?
  - *Answer:* Reusability and testability. In ShopVilla, the order cancellation logic lives in `orderService.js`. This allows the exact same cancellation function to be called by the customer `cancelOrder` controller, the admin `updateOrderStatus` controller, and the automated reconciliation background cron job, eliminating duplicated code.

---

### Fail-Fast Startup Validation
- **Category:** Pattern / DevOps
- **What it is:** An operational pattern where an application validates that all required configurations and environment variables exist before starting, and intentionally terminates immediately with a clear error message if any are missing.
- **Why we used it in ShopVilla:** If a server boots up without `JWT_SECRET` or `MONGO_URI`, it might run for hours until a user tries to log in, only to crash with an obscure runtime error. ShopVilla's startup validation halts the boot process instantly if critical variables are missing.
- **Where in our code:** [`server/server.js:validateStartupEnv`](file:///d:/SHOPVILLA/server/server.js#L6-L45).
- **Example:**
```javascript
// server/server.js
// Fail-fast startup validation for mandatory environment variables
const validateStartupEnv = () => {
  const coreVars = ['PORT', 'MONGO_URI', 'JWT_SECRET'];
  const missingCore = coreVars.filter((varName) => !process.env[varName]);

  if (missingCore.length > 0) {
    console.error(`\n[FATAL CONFIG ERROR]: Missing required environment variable(s): ${missingCore.join(', ')}`);
    console.error('Please ensure these variables are defined in server/.env before starting the server.\n');
    process.exit(1); // Halt server boot immediately
  }
};
```
  - Line 4: Identifies mandatory core configuration variables.
  - Line 5: Checks `process.env` for missing keys.
  - Line 7-11: Logs an explicit, readable diagnostic message and calls `process.exit(1)` to prevent booting into a broken state.
- **Alternatives:** Allowing the server to boot and throwing `TypeError: Cannot read properties of undefined` at runtime during active user requests.
- **Interview question:** Why is the "fail-fast" principle considered a best practice in cloud deployments?
  - *Answer:* In containerized environments like Docker or Kubernetes, failing fast prevents broken containers from entering the healthy load balancer pool. Container orchestration can detect the immediate exit, report a clear crash error, and prevent traffic from being routed to an unconfigured instance.

---

## 7. Email Communication

### Nodemailer
- **Category:** Email / Backend
- **What it is:** Nodemailer is the leading Node.js module that allows applications to compose and send emails easily and securely from a server using SMTP or transport plugins.
- **Why we used it in ShopVilla:** E-commerce stores must communicate critical account and order updates to customers. In ShopVilla, Nodemailer dispatches 6-digit registration OTP verification emails, order placement receipts, and cancellation notices.
- **Where in our code:** [`server/config/nodemailer.js`](file:///d:/SHOPVILLA/server/config/nodemailer.js) and [`server/services/emailService.js`](file:///d:/SHOPVILLA/server/services/emailService.js).
- **Example:**
```javascript
// server/config/nodemailer.js
// Configure SMTP transport when credentials exist, or fallback to dev console mock
let transporter;
if (hasCredentials) {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}
```
  - Line 4: Calls `nodemailer.createTransport` specifying SMTP parameters.
  - Line 5-6: Sets host to `smtp.gmail.com` and port `587` with STARTTLS.
  - Line 7-10: Injects the sender email address and 16-character Google App Password from environment variables.
- **Alternatives:** SendGrid, Mailgun, or AWS SES SDKs (powerful third-party cloud APIs, but Nodemailer gives direct SMTP flexibility without locking into a single vendor).
- **Interview question:** What is the purpose of providing a mock transporter fallback in development?
  - *Answer:* It allows developers to test registration, checkout, and password reset flows locally without setting up live SMTP credentials or spamming real inboxes, printing simulated email bodies directly into the terminal console instead.

---

### SMTP (Simple Mail Transfer Protocol)
- **Category:** Email / Networking
- **What it is:** SMTP is the universal standard internet protocol used for transmitting electronic mail messages between mail servers across IP networks.
- **Why we used it in ShopVilla:** Rather than managing an on-premise email relay server, ShopVilla connects over SMTP (port 587 with STARTTLS encryption) to Google's reliable mail servers to deliver customer notifications.
- **Where in our code:** [`server/config/nodemailer.js#L11-L18`](file:///d:/SHOPVILLA/server/config/nodemailer.js#L11-L18).
- **Example:**
```javascript
// server/services/emailService.js
// Dispatch transactional email through SMTP transport
const sendEmail = async ({ to, subject, html, text }) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'ShopVilla Support <no-reply@shopvilla.com>',
    to,
    subject,
    text: text || html.replace(/<[^>]*>?/gm, ''), // Plain text fallback
    html,
  };

  return await transporter.sendMail(mailOptions);
};
```
  - Line 4: Sets a branded `from` address header.
  - Line 5-6: Sets the recipient and subject.
  - Line 7: Provides a clean plain-text fallback for legacy email clients.
  - Line 11: Sends the SMTP packet across the network.
- **Alternatives:** HTTP REST APIs from email service providers (e.g. SendGrid REST API).
- **Interview question:** Why is port 587 preferred over port 25 or 465 for SMTP in modern web apps?
  - *Answer:* Port 25 is blocked by almost all residential ISPs and cloud providers (AWS, Azure, DigitalOcean) to prevent spam bots. Port 587 is the standard submission port that starts in plain text and immediately upgrades to TLS encryption via the STARTTLS command.

---

### Gmail App Passwords
- **Category:** Email / Security
- **What it is:** A 16-digit passcode generated in Google Account security settings that allows third-party applications (like Nodemailer) to authenticate with Gmail when 2-Factor Authentication (2FA) is enabled, without using the user's primary Google account password.
- **Why we used it in ShopVilla:** Google blocks "less secure apps" from using regular account passwords. By generating a dedicated App Password (`EMAIL_PASS`), ShopVilla can securely send OTPs and receipts while the master Google account remains protected by 2FA.
- **Where in our code:** [`server/config/nodemailer.js#L16`](file:///d:/SHOPVILLA/server/config/nodemailer.js#L16) and [`server/.env`](file:///d:/SHOPVILLA/server/.env).
- **Example:**
```env
# server/.env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=paramveer.rana05@gmail.com
EMAIL_PASS=dlhy savj wdaf nghu
```
  - Line 4: The 16-character App Password (spaces can be kept or removed). If revoked in Google Settings, it immediately terminates email sending permissions without affecting account login.
- **Alternatives:** OAuth2 token exchange with Google Cloud Console (more complex setup requiring refresh token renewal; App Passwords provide a lightweight solution for transactional dispatches).
- **Interview question:** Why should you never use your primary personal Gmail password in an application's `.env` file?
  - *Answer:* If your repository or server environment variables are accidentally exposed or leaked, an attacker would gain full control over your entire Google Account (Gmail, Drive, Photos, Docs). App Passwords are scoped exclusively to SMTP email dispatch and can be revoked instantly.

---

## 8. Background Scheduling

### node-cron
- **Category:** Background Jobs / Reliability
- **What it is:** `node-cron` is a pure JavaScript task scheduler for Node.js based on the standard GNU crontab syntax. It allows developers to schedule tasks (cron jobs) to execute periodically at fixed dates, times, or intervals.
- **Why we used it in ShopVilla:** E-commerce systems require automated background maintenance. In ShopVilla, `node-cron` runs every 10 minutes to: (1) query Razorpay for pending payments, and (2) auto-expire abandoned orders older than 30 minutes to restore held inventory stock.
- **Where in our code:** [`server/services/reconciliationService.js:initReconciliationCron`](file:///d:/SHOPVILLA/server/services/reconciliationService.js#L78-L92) and started in [`server/server.js#L54`](file:///d:/SHOPVILLA/server/server.js#L54).
- **Example:**
```javascript
// server/services/reconciliationService.js
// Initialize background cron job running every 10 minutes: */10 * * * *
const initReconciliationCron = () => {
  if (process.env.NODE_ENV === 'test') return null; // Disable during automated tests

  const task = cron.schedule('*/10 * * * *', async () => {
    console.log('[Cron] Running 10-minute payment reconciliation and expiry check...');
    await reconcilePendingOrders();
  });

  return task;
};
```
  - Line 3: Skips cron initialization during unit and integration test runs to prevent background noise and race conditions.
  - Line 5: Schedules the job using the cron pattern `*/10 * * * *` (minute, hour, day-of-month, month, day-of-week).
  - Line 7: Calls `reconcilePendingOrders()`, which checks payment status and releases expired inventory.
- **Alternatives:** BullMQ / Agenda with Redis (superior for multi-server worker queues, but `node-cron` is lightweight, zero-dependency, and built directly into the server process).
- **Interview question:** What is the limitation of running cron jobs inside a free-tier cloud host like Render?
  - *Answer:* Free-tier hosting platforms often put inactive containers to "sleep" after 15 minutes of zero incoming HTTP traffic. When the container sleeps, the Node.js event loop halts, and scheduled `node-cron` tasks will not fire until a new HTTP request wakes the server. Production cron jobs require an always-on server or an external trigger (like cron-job.org or AWS CloudWatch Events).

---

## 9. Automated Testing Suite

### Jest
- **Category:** Testing
- **What it is:** Jest is a delightful JavaScript testing framework maintained by Meta with a focus on simplicity. It provides a test runner, assertion library (`expect`), mock support (`jest.fn()`, `jest.spyOn()`), and code coverage reporting out of the box.
- **Why we used it in ShopVilla:** We use Jest to automate the verification of our backend API. Our 71 automated tests verify password hashing, JWT signing, cart operations, atomic stock management, order state machine transitions, and admin authorization.
- **Where in our code:** [`server/package.json#L7`](file:///d:/SHOPVILLA/server/package.json#L7) and [`server/tests/api.test.js`](file:///d:/SHOPVILLA/server/tests/api.test.js).
- **Example:**
```javascript
// server/tests/api.test.js
// Verify password hashing and match validation with Jest assertions
describe('Password Hashing & Security (bcrypt)', () => {
  it('should hash passwords with salt rounds and not store plaintext', async () => {
    const plainPassword = 'SuperSecretPassword@123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    expect(hashedPassword).not.toBe(plainPassword);
    expect(hashedPassword).toMatch(/^\$2[aby]\$\d{2}\$/);

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    expect(isMatch).toBe(true);
  });
});
```
  - Line 3: `describe` groups related tests into a test suite block.
  - Line 4: `it` defines an individual test specification.
  - Line 9-13: `expect()` assertions verify that the hash does not equal plain text, conforms to the standard bcrypt regex pattern, and verifies correctly.
- **Alternatives:** Mocha + Chai (traditional Node.js combo, but requires assembling separate assertion and mocking libraries) or Vitest (modern alternative, especially in Vite projects).
- **Interview question:** What does the `--runInBand` flag do when running Jest tests?
  - *Answer:* By default, Jest runs test files in parallel across multiple worker threads. `--runInBand` forces Jest to run all tests sequentially in a single process, which is essential when testing database flows (like MongoDB) to prevent parallel tests from dropping or mutating shared test collections simultaneously.

---

### Supertest
- **Category:** Testing
- **What it is:** Supertest is a high-level Node.js library for testing HTTP servers. Built on top of SuperAgent, it allows developers to make synthetic HTTP requests directly to an Express `app` instance without binding to a live public network port.
- **Why we used it in ShopVilla:** Supertest allows us to write integration tests for all REST endpoints (e.g. `POST /api/v1/auth/login`, `GET /api/v1/orders`), inspecting status codes, response headers, and JSON bodies directly.
- **Where in our code:** [`server/tests/api.test.js#L5`](file:///d:/SHOPVILLA/server/tests/api.test.js#L5) and [`server/tests/integration.test.js#L5`](file:///d:/SHOPVILLA/server/tests/integration.test.js#L5).
- **Example:**
```javascript
// server/tests/api.test.js
// Send synthetic GET request to health endpoint using Supertest
const response = await request(app)
  .get('/api/health')
  .expect(200);

expect(response.body.status).toBe('success');
expect(response.body.message).toContain('healthy');
```
  - Line 3: Wraps the Express `app` in `request()`.
  - Line 4: Emulates an HTTP GET request to `/api/health`.
  - Line 5: Asserts an HTTP 200 OK response status code.
  - Line 7-8: Verifies expected JSON body properties.
- **Alternatives:** Axois or Fetch hitting a running localhost server (requires starting and tearing down a live server on an ephemeral port before tests run).
- **Interview question:** Does Supertest require the Express server to call `app.listen()` before running tests?
  - *Answer:* No. Supertest accepts the raw Express `app` object and manages internal ephemeral server binding automatically, which prevents "port in use" conflicts during CI/CD test runs.

---

### mongodb-memory-server
- **Category:** Testing / Database
- **What it is:** A testing utility that spins up a real, temporary MongoDB instance programmatically in memory (RAM).
- **Why we used it in ShopVilla:** Running integration tests against a live production or development MongoDB database can accidentally corrupt, overwrite, or delete real customer data. `mongodb-memory-server` spins up a pristine in-memory database in milliseconds for test suites and destroys it completely when tests finish.
- **Where in our code:** [`server/tests/integration.test.js#L17-L23`](file:///d:/SHOPVILLA/server/tests/integration.test.js#L17-L23).
- **Example:**
```javascript
// server/tests/integration.test.js
// Start in-memory MongoDB instance before running test suite
beforeAll(async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Teardown and wipe in-memory database after tests complete
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});
```
  - Line 4-6: Creates an ephemeral MongoDB binary in RAM and connects Mongoose to its generated URI.
  - Line 11-14: Drops the temporary database and stops the memory server, freeing all resources.
- **Alternatives:** Mocking Mongoose methods with Jest (`jest.spyOn(User, 'find').mockResolvedValue(...)`) (faster, but does not test real database queries, compound indexes, or aggregation pipelines).
- **Interview question:** Why is an in-memory database superior to mocking Mongoose queries for integration tests?
  - *Answer:* Mocks only test your assumptions about how the database behaves. An in-memory database runs real MongoDB binaries, testing real schema validations, unique constraints, atomic operators (`$inc`), and aggregation pipelines (`$lookup`) exactly as they will run in production.

---

### Unit vs. Integration Testing
- **Category:** Testing / Concepts
- **What it is:**
  - **Unit Testing:** Testing an isolated function, method, or component in complete isolation from external dependencies (e.g. testing `verifyPaymentSignature` or password hashing).
  - **Integration Testing:** Testing how multiple modules, middlewares, controllers, and the database collaborate across a complete end-to-end workflow (e.g. Register -> OTP -> Login -> Add to Cart -> Place COD Order -> Admin Deliver).
- **Why we used it in ShopVilla:** In ShopVilla, [`server/tests/api.test.js`](file:///d:/SHOPVILLA/server/tests/api.test.js) verifies individual units (like validators and state transitions), while [`server/tests/integration.test.js`](file:///d:/SHOPVILLA/server/tests/integration.test.js) verifies full user journeys across database transactions.
- **Where in our code:** [`server/tests/api.test.js`](file:///d:/SHOPVILLA/server/tests/api.test.js) (Unit & Route checks) and [`server/tests/integration.test.js`](file:///d:/SHOPVILLA/server/tests/integration.test.js) (Multi-step flows).
- **Example:**
```javascript
// server/tests/integration.test.js
// Integration test: Add to cart -> Place COD order -> Admin deliver -> Verify stock
const orderRes = await request(app)
  .post('/api/v1/orders')
  .set('Authorization', `Bearer ${customerToken}`)
  .send({ shippingAddress: testAddress, paymentMethod: 'COD' })
  .expect(201);

const deliverRes = await request(app)
  .patch(`/api/v1/admin/orders/${orderRes.body.order._id}/status`)
  .set('Authorization', `Bearer ${adminToken}`)
  .send({ status: 'DELIVERED' })
  .expect(200);

expect(deliverRes.body.order.orderStatus).toBe('DELIVERED');
expect(deliverRes.body.order.paymentStatus).toBe('PAID');
```
  - Line 3-7: Tests order placement through customer HTTP request.
  - Line 9-13: Tests admin status progression through admin HTTP request.
  - Line 15-16: Asserts that COD transitioned to `PAID` upon delivery.
- **Alternatives:** Manual testing via Postman or browser clicking (slow, subjective, and cannot be run automatically in continuous integration pipelines).
- **Interview question:** What is the testing pyramid?
  - *Answer:* The testing pyramid is a software engineering concept suggesting that projects should have a large base of fast, cheap Unit Tests, a moderate layer of Integration Tests verifying service boundaries, and a small peak of End-to-End (E2E) UI tests.

---

### Mocking & Spying
- **Category:** Testing
- **What it is:**
  - **Mocking:** Replacing a real dependency (such as an external payment gateway API or email server) with a dummy object that returns predefined simulated values.
  - **Spying:** Wrapping an existing function with a surveillance hook to observe how many times it was called and what arguments were passed to it.
- **Why we used it in ShopVilla:** During automated tests, we cannot charge real credit cards on Razorpay or send hundreds of real emails via Gmail. We mock external services to test edge cases (e.g. gateway timeouts or payment failures) reliably and instantly.
- **Where in our code:** [`server/tests/integration.test.js#L140-L155`](file:///d:/SHOPVILLA/server/tests/integration.test.js#L140-L155).
- **Example:**
```javascript
// server/tests/integration.test.js
// Mock Razorpay payment state check during automated reconciliation test
const razorpayService = require('../services/razorpayService');
const spy = jest.spyOn(razorpayService, 'fetchPaymentState').mockResolvedValue({
  isPaid: true,
  isFailed: false,
  paymentId: 'pay_mock_test_12345',
});
```
  - Line 3: Uses `jest.spyOn` to intercept calls to `fetchPaymentState`.
  - Line 4-7: Forces the method to resolve with `{ isPaid: true }`, allowing us to verify that our reconciliation job marks the order `PAID` without hitting the internet.
- **Alternatives:** Calling live sandbox APIs over the internet (makes test suites slow, brittle to network drops, and dependent on third-party uptime).
- **Interview question:** What is the difference between `jest.fn()` and `jest.spyOn()`?
  - *Answer:* `jest.fn()` creates a brand-new standalone mock function with no initial implementation. `jest.spyOn()` wraps an existing object method, allowing you to monitor its calls while either preserving its original behavior or temporarily overriding it using `.mockImplementation()`.

---

## 10. DevOps, Containerization & Deployment

### Docker
- **Category:** DevOps
- **What it is:** Docker is an open-source containerization platform that packages an application and all its dependencies (Node.js runtime, system libraries, configuration) into a portable, isolated executable unit called a container.
- **Why we used it in ShopVilla:** "It works on my machine" is a common developer headache. Docker guarantees that ShopVilla runs identically across Windows, macOS, Linux, and cloud servers without installing Node or MongoDB manually on the host machine.
- **Where in our code:** [`server/Dockerfile`](file:///d:/SHOPVILLA/server/Dockerfile) and [`client/Dockerfile`](file:///d:/SHOPVILLA/client/Dockerfile).
- **Example:**
```dockerfile
# server/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000
CMD ["node", "server.js"]
```
  - Line 2: Uses lightweight Alpine Linux with Node 20 preinstalled.
  - Line 3: Creates `/app` working directory.
  - Line 4-5: Copies package files and installs only production dependencies.
  - Line 6: Copies application source code.
  - Line 10: Specifies the startup command `node server.js`.
- **Alternatives:** Virtual Machines (heavy, boot slowly, and require full guest operating systems; Docker containers share the host OS kernel and boot in seconds).
- **Interview question:** What is the difference between a Docker Image and a Docker Container?
  - *Answer:* A Docker Image is an immutable, read-only blueprint or template containing the application code, libraries, and instructions. A Docker Container is a live, running instance of an image with a writable filesystem layer.

---

### Multi-Stage Docker Builds
- **Category:** DevOps
- **What it is:** A Dockerfile optimization technique where multiple `FROM` instructions are used in a single file to separate the build environment (which requires compilers, large SDKs, and devDependencies) from the final runtime image.
- **Why we used it in ShopVilla:** Building a React Vite app requires Node.js, npm, and build tools, but serving the resulting static HTML/JS/CSS only requires a lightweight web server like Nginx. Multi-stage builds reduce our frontend container size from ~800MB to just ~25MB!
- **Where in our code:** [`client/Dockerfile`](file:///d:/SHOPVILLA/client/Dockerfile).
- **Example:**
```dockerfile
# client/Dockerfile
# Stage 1: Build Vite Production Assets
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve via Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
  - Line 3: Stage 1 uses Node to compile the React code into optimized static bundles in `/app/dist`.
  - Line 11: Stage 2 starts from clean `nginx:alpine` (discarding all of Node and `node_modules`).
  - Line 12: Copies only the compiled `/app/dist` files from the `builder` stage into Nginx's web root.
- **Alternatives:** Single-stage builds leaving the entire Node.js runtime and source code inside the production container (bloats image size and creates unnecessary security attack surfaces).
- **Interview question:** Why are multi-stage Docker builds beneficial for security?
  - *Answer:* By discarding development build tools, compilers, package managers, and raw source code from the final runtime image, multi-stage builds drastically minimize the attack surface and reduce potential vulnerabilities identified in container security scans.

---

### Docker Compose
- **Category:** DevOps
- **What it is:** Docker Compose is a tool for defining and running multi-container Docker applications using a single YAML configuration file (`docker-compose.yml`).
- **Why we used it in ShopVilla:** ShopVilla consists of 3 distinct services: MongoDB database, Express API server, and React Nginx frontend. Docker Compose orchestrates all 3 services, sets up internal networking, and configures persistent storage volumes with a single command: `docker-compose up`.
- **Where in our code:** [`docker-compose.yml`](file:///d:/SHOPVILLA/docker-compose.yml).
- **Example:**
```yaml
# docker-compose.yml
version: '3.8'
services:
  mongo:
    image: mongo:7-jammy
    ports: ['27017:27017']
    volumes: [shopvilla_mongo_data:/data/db]

  server:
    build: ./server
    depends_on: [mongo]
    ports: ['5000:5000']

  client:
    build: ./client
    depends_on: [server]
    ports: ['3000:80']
```
  - Line 4-7: Boots MongoDB 7 and mounts a persistent local volume so data survives container restarts.
  - Line 9-12: Builds the backend, connects it to MongoDB via the service name `mongo`, and exposes port 5000.
  - Line 14-17: Builds the frontend container and maps host port 3000 to container port 80.
- **Alternatives:** Manually writing long `docker run` commands with custom network flags for each individual service (tedious, fragile, and error-prone).
- **Interview question:** How do containers in the same Docker Compose file communicate with each other?
  - *Answer:* Docker Compose creates a private user-defined bridge network. Each service is assigned a DNS hostname matching its service name in `docker-compose.yml` (e.g. `server` can connect to MongoDB directly using `mongodb://mongo:27017`).

---

### Nginx Reverse Proxy
- **Category:** DevOps / Networking
- **What it is:** Nginx is a high-performance HTTP web server and reverse proxy that handles incoming client requests, serves static assets with extreme efficiency, and proxies API calls to backend servers.
- **Why we used it in ShopVilla:** In our production client Docker container, Nginx serves the compiled React single-page application and handles SPA client-side routing fallback (`try_files $uri $uri/ /index.html;`), as well as proxying `/api/` traffic to the backend server.
- **Where in our code:** [`client/nginx.conf`](file:///d:/SHOPVILLA/client/nginx.conf).
- **Example:**
```nginx
# client/nginx.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://server:5000/api/;
        proxy_set_header Host $host;
    }
}
```
  - Line 6-10: Serves static React files. If a requested path (like `/orders/123`) does not exist on disk, `try_files` rewrites the request to `/index.html` so React Router can render the route.
  - Line 12-15: Transparently proxies `/api/` requests to the backend container.
- **Alternatives:** Apache HTTP Server or serving static files directly using Node's `express.static` (Nginx uses an asynchronous event-driven architecture that handles 10x more concurrent connections with less memory than Node).
- **Interview question:** Why is `try_files $uri $uri/ /index.html;` required when hosting a React SPA on Nginx?
  - *Answer:* In a Single Page Application, page routing is handled client-side by JavaScript. If a user directly visits or refreshes `/orders`, Nginx looks for a physical directory named `/orders` on the server and returns 404 Not Found. `try_files` tells Nginx to fall back to `index.html`, allowing React Router to boot and load the correct view.

---

### MongoDB Atlas
- **Category:** DevOps / Database
- **What it is:** MongoDB Atlas is a fully managed cloud database service developed by MongoDB that handles provisioning, automated backups, patching, scaling, and high-availability replica sets.
- **Why we used it in ShopVilla:** For production cloud deployment (on Render or AWS), hosting MongoDB on Atlas eliminates database administration overhead, provides encrypted connections via `mongodb+srv://`, and includes web-based monitoring dashboards.
- **Where in our code:** Configured via `MONGO_URI` in [`server/.env.example`](file:///d:/SHOPVILLA/server/.env.example) and connected in [`server/config/db.js`](file:///d:/SHOPVILLA/server/config/db.js).
- **Example:**
```env
# server/.env (Production Atlas connection string pattern)
MONGO_URI=mongodb+srv://shopvilla_admin:<password>@cluster0.abcde.mongodb.net/shopvilla?retryWrites=true&w=majority
```
  - Line 2: The `mongodb+srv` protocol connects to a fault-tolerant multi-node replica set with automated failover and retryable writes enabled.
- **Alternatives:** Self-hosting MongoDB on an AWS EC2 instance (requires manual Linux OS patching, disk volume management, backup cron jobs, and replica set configuration).
- **Interview question:** What is the benefit of the `retryWrites=true` parameter in a MongoDB connection string?
  - *Answer:* It instructs the MongoDB driver to automatically retry write operations once if a transient network error or primary replica node election occurs, preventing intermittent network blips from throwing unhandled errors to users.

---

### Render (Backend API Hosting)
- **Category:** DevOps / Cloud
- **What it is:** Render is a modern cloud Application Platform-as-a-Service (PaaS) that automates building and deploying web services directly from GitHub repositories with managed SSL certificates and continuous deployment.
- **Why we used it in ShopVilla:** Render provides an ideal hosting environment for our Node.js Express backend, offering native Node.js and Docker runtimes, automatic HTTPS, environment variable management, and automated Git-push deployments.
- **Where in our code:** Documented in deployment runbooks and deployment guides in [`README.md`](file:///d:/SHOPVILLA/README.md).
- **Example:**
```markdown
# Render Deployment Settings for ShopVilla Server:
- Environment: Node
- Build Command: npm install
- Start Command: node server.js
- Health Check Path: /api/health
- Auto-Deploy: Yes (on push to main branch)
```
  - Connects directly to GitHub repo, auto-detects commits, installs dependencies, and deploys with zero downtime.
- **Alternatives:** AWS Elastic Beanstalk, Heroku, DigitalOcean App Platform, or Azure App Service.
- **Interview question:** How does Render know whether a deployed backend instance is healthy before routing live traffic?
  - *Answer:* Render queries the configured Health Check Path (`/api/health`). If the endpoint returns HTTP 200 within the timeout window, Render smoothly switches traffic to the new deployment. If it fails or returns 500, Render rolls back to the previous deployment.

---

### Vercel (Frontend SPA Hosting)
- **Category:** DevOps / Cloud
- **What it is:** Vercel is a global cloud platform specialized for static frontend sites and modern frameworks, deploying assets across a lightning-fast global Edge Content Delivery Network (CDN).
- **Why we used it in ShopVilla:** Our React Vite frontend is completely static after running `npm run build`. Deploying to Vercel provides instant global CDN caching, sub-second page loads worldwide, and automatic SSL certificates.
- **Where in our code:** Configured with [`client/vercel.json`](file:///d:/SHOPVILLA/client/vercel.json).
- **Example:**
```markdown
# Vercel Deployment Settings for ShopVilla Client:
- Framework Preset: Vite
- Root Directory: client
- Build Command: npm run build
- Output Directory: dist
- Environment Variables: VITE_API_URL=https://shopvilla-server.onrender.com/api/v1
```
  - Builds the production bundle and deploys assets across Vercel's global edge network.
- **Alternatives:** Netlify, AWS S3 + CloudFront, or GitHub Pages.
- **Interview question:** Why is hosting a React frontend on a CDN like Vercel faster than serving it from a traditional Node.js server?
  - *Answer:* A traditional server resides in a single geographic datacenter (e.g. US-East). A CDN caches static assets across hundreds of edge locations globally, so a user in Tokyo or Mumbai downloads HTML/JS/CSS from a server physically located in their city rather than waiting for transatlantic round-trips.

---

### Vercel SPA Rewrites (vercel.json)
- **Category:** DevOps / Frontend
- **What it is:** A configuration file for Vercel that directs incoming HTTP requests. For SPAs, it defines rewrite rules so all deep URL routes point to `index.html`.
- **Why we used it in ShopVilla:** When a user bookmarks `https://shopvilla.vercel.app/products` and refreshes the page, Vercel looks for a static file named `products.html`. Without rewrites, it returns a 404 Error. `vercel.json` ensures all requests are served `index.html` so React Router can render the route.
- **Where in our code:** [`client/vercel.json`](file:///d:/SHOPVILLA/client/vercel.json).
- **Example:**
```json
// client/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
  - Line 4: The regular expression `/(.*)` matches any incoming URL path.
  - Line 5: Rewrites the destination internally to `/index.html` while preserving the URL in the user's browser address bar.
- **Alternatives:** Configuring a `_redirects` file (syntax used by Netlify).
- **Interview question:** What is the difference between a URL redirect and a URL rewrite?
  - *Answer:* A redirect sends an HTTP 301/302 response instructing the browser to change its address bar to a new URL and issue a new request. A rewrite serves the content of a different destination file internally on the server without changing the browser's address bar.

---

### Health Check Endpoints (/api/health)
- **Category:** DevOps / Reliability
- **What it is:** A lightweight, unauthenticated HTTP GET endpoint that returns an HTTP 200 OK status to indicate that the application process is running, responsive, and ready to accept traffic.
- **Why we used it in ShopVilla:** Load balancers, cloud hosting monitors (Render/AWS), and container orchestration platforms query `/api/health` every few seconds. If the server hangs or crashes, the health check fails, prompting the cloud platform to restart the container automatically.
- **Where in our code:** [`server/app.js#L70-L76`](file:///d:/SHOPVILLA/server/app.js#L70-L76).
- **Example:**
```javascript
// server/app.js
// Health Check Endpoint for cloud monitors and container probes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'ShopVilla API is healthy and operational',
    timestamp: new Date().toISOString(),
  });
});
```
  - Line 2: Defines lightweight GET route on `/api/health`.
  - Line 3-7: Responds immediately with status 200, confirmation message, and current server ISO timestamp.
- **Alternatives:** Pinging the root route `/` (often loads complex homepages or database queries, creating unnecessary server load for simple uptime checks).
- **Interview question:** What is the difference between a Liveness Probe and a Readiness Probe?
  - *Answer:* A Liveness Probe checks if the application container is alive; if it fails, the orchestrator kills and restarts the container. A Readiness Probe checks if the application is ready to accept user traffic (e.g. database connection established); if it fails, traffic is temporarily diverted until the app is ready.

---

### Continuous Integration (CI) Principles
- **Category:** DevOps
- **What it is:** A software engineering practice where developers regularly merge code changes into a central repository, triggering automated builds, linter checks, and test suites to detect bugs early.
- **Why we used it in ShopVilla:** Before merging pull requests or deploying to production, automated CI commands run our 71 backend integration tests (`npm test`) and frontend production build checks (`npm run build`) to ensure zero regressions occur.
- **Where in our code:** Configured via test scripts in [`server/package.json`](file:///d:/SHOPVILLA/server/package.json) and [`client/package.json`](file:///d:/SHOPVILLA/client/package.json).
- **Example:**
```bash
# Standard ShopVilla CI verification pipeline commands
npm --prefix server test        # Runs 71 Jest integration and unit tests
npm --prefix client run build   # Validates Vite production bundle compilation
```
  - Ensures backend logic passes all security/payment tests and frontend code has zero TypeScript/JSX syntax errors before code touches production.
- **Alternatives:** Manual testing before deployments (leads to human oversights, broken production builds, and delayed release cycles).
- **Interview question:** What is the difference between Continuous Integration (CI) and Continuous Deployment (CD)?
  - *Answer:* Continuous Integration (CI) focuses on automatically testing and validating code every time a developer pushes changes. Continuous Deployment (CD) automatically releases validated code changes directly to staging or production environments without manual intervention.

---

## 11. Developer Productivity Tools

### Git
- **Category:** Tools
- **What it is:** Git is a free and open-source distributed version control system designed to handle everything from small to very large projects with speed and efficiency.
- **Why we used it in ShopVilla:** Git tracks every file modification, allows branching for new features (e.g. payment reconciliation or admin analytics), and lets developers revert accidental bugs safely.
- **Where in our code:** Throughout the project repository; configured via [`.gitignore`](file:///d:/SHOPVILLA/.gitignore) files.
- **Example:**
```gitignore
# server/.gitignore
node_modules
.env
logs
```
  - Tells Git to ignore heavy dependency folders and sensitive secret files like `.env`, preventing accidental credential leaks to public repositories.
- **Alternatives:** Subversion (SVN) or Mercurial (older centralized systems; Git is the undisputed global industry standard).
- **Interview question:** What is the difference between `git merge` and `git rebase`?
  - *Answer:* `git merge` combines two branches by creating a new "merge commit" that preserves the complete historical timeline of both branches. `git rebase` rewrites commit history by moving your feature branch's commits to the tip of the target branch, creating a clean, linear commit history.

---

### GitHub
- **Category:** Tools / DevOps
- **What it is:** A cloud-based platform for hosting Git repositories, providing collaboration tools like pull requests, code reviews, issue tracking, and GitHub Actions automation.
- **Why we used it in ShopVilla:** GitHub stores the authoritative source code for ShopVilla, enables team code reviews, and triggers automated continuous deployments to Render and Vercel whenever commits are pushed to the `main` branch.
- **Where in our code:** Project Git remote origin and version tracking.
- **Example:**
```bash
# Push validated changes to GitHub master branch
git add .
git commit -m "feat: implement idempotent webhook handler and payment reconciliation"
git push origin main
```
  - Pushes code to GitHub, which automatically signals Vercel and Render to build and deploy.
- **Alternatives:** GitLab, Bitbucket, or self-hosted Gitea.
- **Interview question:** What is a GitHub Pull Request (PR)?
  - *Answer:* A Pull Request is a formal request by a developer to merge a feature branch into the main codebase. It provides a dedicated web UI where team members can review code changes, leave comments, view automated test results, and approve merges.

---

### Postman
- **Category:** Tools / Testing
- **What it is:** An API platform for building, testing, and documenting APIs, providing an intuitive graphical interface for sending HTTP requests and inspecting responses.
- **Why we used it in ShopVilla:** During backend development, before frontend UI screens were finished, we used Postman to test auth login, OTP dispatches, cart updates, and Razorpay webhook simulations with custom headers.
- **Where in our code:** Used to test and verify all endpoints in [`server/routes/`](file:///d:/SHOPVILLA/server/routes/).
- **Example:**
```json
// Postman Environment Variable Configuration
{
  "key": "token",
  "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "secret"
}
```
  - Postman automatically extracts the JWT token from the login response and saves it as an environment variable to authenticate subsequent requests automatically.
- **Alternatives:** Insomnia, Hoppscotch, or VS Code REST Client extension.
- **Interview question:** How do you automate token injection in Postman across a collection?
  - *Answer:* In the Collection's "Tests" script tab, you write JavaScript to extract the token: `pm.environment.set("jwt_token", pm.response.json().token);`. Then, on the Collection's "Authorization" tab, set type to `Bearer Token` with value `{{jwt_token}}` so all nested requests inherit it automatically.

---

### ngrok
- **Category:** Tools / Networking
- **What it is:** A cross-platform tunneling tool that creates a secure, publicly accessible HTTPS tunnel to a local web server running on your computer (e.g. `http://localhost:5000`).
- **Why we used it in ShopVilla:** Razorpay's webhook servers run in the cloud and cannot send HTTP POST requests to `http://localhost:5000` because private IPs are unreachable over the public internet. ngrok provides a public URL (e.g. `https://abc-123.ngrok-free.app`) that forwards live Razorpay webhook events directly to your local development machine.
- **Where in our code:** Used during local testing of [`server/controllers/orderController.js:handleRazorpayWebhook`](file:///d:/SHOPVILLA/server/controllers/orderController.js#L165).
- **Example:**
```bash
# Start an ngrok tunnel forwarding public HTTPS traffic to local port 5000
ngrok http 5000
```
  - Output displays: `Forwarding: https://shopvilla-dev.ngrok-free.app -> http://localhost:5000`. This public URL is pasted into the Razorpay Developer Dashboard under Webhooks (`/api/v1/orders/webhook`).
- **Alternatives:** Cloudflare Tunnels or Localtunnel.
- **Interview question:** Why is ngrok necessary when developing payment gateway webhooks locally?
  - *Answer:* Payment gateways like Razorpay or Stripe reside on the public internet. When a payment event occurs, their servers must dispatch an HTTP POST request to your webhook endpoint. Since local machines use private network addresses (like `127.0.0.1` or `192.168.x.x`), ngrok creates a public relay tunnel that bridges the cloud gateway to your local Express server.

---

### Visual Studio Code
- **Category:** Tools
- **What it is:** A lightweight, extensible open-source code editor developed by Microsoft, supporting syntax highlighting, debugging, Git integration, and an enormous ecosystem of developer extensions.
- **Why we used it in ShopVilla:** VS Code was the primary Integrated Development Environment (IDE) used to build ShopVilla, providing fast file searching, integrated terminal PowerShell execution, ESLint warnings, and direct Git commit staging.
- **Where in our code:** Workspace root directory [`d:\SHOPVILLA`](file:///d:/SHOPVILLA).
- **Example:**
```json
// Recommended VS Code Settings (.vscode/settings.json)
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.trimTrailingWhitespace": true
}
```
  - Automatically formats JavaScript and JSX files on every save, ensuring consistent team code style across the project.
- **Alternatives:** WebStorm, Sublime Text, or Cursor.
- **Interview question:** What is the difference between an IDE and a Code Editor?
  - *Answer:* A traditional code editor (like Notepad or Sublime) focuses primarily on editing text. An Integrated Development Environment (IDE, like WebStorm or VS Code with plugins) provides a complete development suite including a code editor, compiler/transpiler, terminal, linter, source control integration, and interactive graphical debuggers in a single application.

---

## 12. End-to-End Request Flow Walkthroughs

### (a) User Login Flow

```
+--------------------------------------------------------------------------------------------------+
|                                     USER LOGIN WORKFLOW                                          |
|                                                                                                  |
| [Browser: LoginPage.jsx]                                                                         |
|       |                                                                                          |
|       | 1. User submits email & password                                                         |
|       v                                                                                          |
| [Axios API Client]                                                                               |
|       |                                                                                          |
|       | 2. POST /api/v1/auth/login { email, password }                                           |
|       v                                                                                          |
| [Express Server: Middleware Pipeline]                                                           |
|       | 3. apiLimiter & authLimiter (Verifies IP has not exceeded 30 attempts / 15m)              |
|       | 4. validateLogin (Checks valid email syntax and non-empty password)                       |
|       | 5. mongoSanitize (Strips any malicious '$' or '.' NoSQL injection characters)             |
|       v                                                                                          |
| [Controller: authController.js -> login]                                                         |
|       | 6. User.findOne({ email }).select('+password')                                           |
|       | 7. If user not found -> returns 401 "Invalid email or password"                          |
|       | 8. bcrypt.compare(candidatePassword, user.password)                                      |
|       |    -> If false -> returns 401 "Invalid email or password"                                |
|       | 9. Check user.isActive !== false (Blocks deactivated accounts with 403)                  |
|       | 10. Check user.isVerified === true (If false, issues new OTP and returns 403)            |
|       | 11. signToken(user._id) -> generates signed JWT with 7-day expiry                        |
|       v                                                                                          |
| [HTTP 200 Response Payload]                                                                      |
|       | 12. { success: true, token: "ey...", user: { name, email, role } }                       |
|       v                                                                                          |
| [Browser: AuthContext.jsx & LocalStorage]                                                        |
|       | 13. localStorage.setItem('shopvilla_token', token)                                       |
|       | 14. localStorage.setItem('shopvilla_user', JSON.stringify(user))                         |
|       | 15. Updates React state -> ProtectedRoute unblocks -> redirects to /orders               |
+--------------------------------------------------------------------------------------------------+
```

1. **User Interaction:** The customer types their email and password into [`client/src/pages/LoginPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/LoginPage.jsx) and clicks "Sign In".
2. **Client Dispatch:** Axios dispatches an HTTP POST request to `/api/v1/auth/login` with `{ email, password }` in the JSON request body.
3. **Rate Limiting:** `authLimiter` intercepts the request. If the user's IP address has made more than 30 attempts within the last 15 minutes, the server immediately returns HTTP 429 Too Many Requests.
4. **Input Validation:** `express-validator` verifies that `email` is well-formed and `password` is non-empty.
5. **NoSQL Sanitization:** `mongoSanitize()` strips any dangerous `$` or `.` characters to neutralize NoSQL injection attacks.
6. **User Lookup:** `authController.login` queries MongoDB via `User.findOne({ email }).select('+password')` to explicitly pull the hidden password hash.
7. **Timing-Safe Password Check:** `user.matchPassword(password)` calls `bcrypt.compare()`. If incorrect, an identical generic error message ("Invalid email or password") is returned to prevent account enumeration.
8. **Account Gating:** The controller checks `user.isActive`. If an admin deactivated the account, access is rejected with HTTP 403. Next, it checks `user.isVerified`. If the email is unverified, an OTP is dispatched and an HTTP 403 is returned prompting verification.
9. **Token Generation:** `signToken(user._id)` packages the user's ID into a JWT and signs it using `process.env.JWT_SECRET` with a 7-day expiration time.
10. **Response & Storage:** The server returns HTTP 200 with `{ success: true, token, user }`. [`client/src/context/AuthContext.jsx`](file:///d:/SHOPVILLA/client/src/context/AuthContext.jsx) writes the token and user profile into `localStorage` and updates React state.
11. **Navigation:** React Router's `<ProtectedRoute>` detects that `isAuthenticated` is now `true` and transitions the view to the catalog or customer dashboard.

---

### (b) Online Order Creation & Razorpay Payment

```
+--------------------------------------------------------------------------------------------------+
|                             ONLINE ORDER & RAZORPAY PAYMENT FLOW                                 |
|                                                                                                  |
| [Browser: CheckoutPage.jsx]                                                                      |
|       | 1. User selects shipping address & paymentMethod: 'ONLINE'                               |
|       | 2. Axios POST /api/v1/orders with Authorization: Bearer <token>                          |
|       v                                                                                          |
| [Backend: orderController.js -> createOrder]                                                     |
|       | 3. authMiddleware verifies JWT and checks req.user.isVerified === true                   |
|       | 4. Fetch Cart and populate product prices from MongoDB                                   |
|       | 5. Recalculate line item totals + shipping fee strictly on server                        |
|       | 6. deductInventoryStock() atomically decrements stock with {$gte: quantity}             |
|       | 7. Create local Order in MongoDB (paymentStatus: 'PENDING', orderStatus: 'PENDING')       |
|       | 8. Call Razorpay API: razorpay.orders.create({ amount: total * 100, currency: 'INR' })   |
|       | 9. If Razorpay fails -> compensating rollback restores deducted inventory stock          |
|       | 10. Store razorpayOrderId on order document; clear customer cart                         |
|       v                                                                                          |
| [Browser: Razorpay Checkout Modal]                                                               |
|       | 11. Frontend receives order and opens native Razorpay checkout modal                     |
|       | 12. Customer completes UPI / NetBanking / Card payment                                  |
|       | 13. Razorpay modal returns: order_id, payment_id, and razorpay_signature                 |
|       v                                                                                          |
| [Backend: orderController.js -> verifyRazorpayPayment]                                           |
|       | 14. Axios POST /api/v1/orders/verify-payment with signature details                      |
|       | 15. crypto.createHmac('sha256', SECRET).update(order_id + '|' + payment_id).digest('hex') |
|       | 16. If signatures match:                                                                 |
|       |     - order.paymentStatus = 'PAID'                                                       |
|       |     - order.orderStatus = 'CONFIRMED'                                                    |
|       |     - order.razorpayPaymentId = payment_id                                               |
|       | 17. Nodemailer sends order confirmation email to customer                                |
|       v                                                                                          |
| [Browser: OrderSuccessPage.jsx]                                                                  |
|       | 18. Frontend navigates to /order-success/:id with green confirmation badge               |
+--------------------------------------------------------------------------------------------------+
```

1. **Checkout Initiation:** The user confirms their shipping address and clicks "Pay with Razorpay" on [`client/src/pages/CheckoutPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/CheckoutPage.jsx).
2. **Server-Side Price Calculation:** The backend ignores any prices sent in the request body. It fetches the user's cart from MongoDB, populates live product prices directly from the `Product` collection, and calculates: `totalAmount = itemsTotal + (itemsTotal >= 500 ? 0 : 50)`.
3. **Atomic Stock Reservation:** The server calls `deductInventoryStock()`. Using MongoDB's atomic operator `{ stock: { $gte: quantity } }`, each item's stock is decremented. If any item is out of stock, an error is thrown and any previously deducted items are rolled back.
4. **Order Document Initialization:** An `Order` record is saved in MongoDB with `paymentStatus = 'PENDING'` and `orderStatus = 'PENDING'`.
5. **Gateway Order Creation:** `razorpayService.createOrder()` calls Razorpay's API to register the authoritative order with the amount in paise (`totalAmount * 100`).
6. **Compensating Rollback Guard:** If the network request to Razorpay fails, a catch block immediately triggers `restoreInventoryStock()` to restore the customer's items to the public catalog before returning an HTTP 502 error.
7. **Modal Launch:** If Razorpay succeeds, the cart is cleared and the `razorpayOrderId` is returned to the client. The client launches the official Razorpay JavaScript checkout popup.
8. **Client Payment Execution:** The customer authorizes payment via UPI, Credit Card, or Net Banking inside Razorpay's encrypted modal.
9. **Frontend Signature Return:** Upon success, Razorpay's modal provides three tokens: `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
10. **Backend Verification:** The client sends these tokens to `/api/v1/orders/verify-payment`. The server reconstructs the expected HMAC-SHA256 signature using its private `RAZORPAY_KEY_SECRET`.
11. **Order Confirmation:** When the signature matches, the server updates `paymentStatus = 'PAID'` and `orderStatus = 'CONFIRMED'`, records the payment ID, dispatches a confirmation email via Nodemailer, and returns HTTP 200.
12. **Success Screen:** The client navigates to [`client/src/pages/OrderSuccessPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/OrderSuccessPage.jsx), displaying the invoice and delivery details.

---

### (c) Webhook Arriving After User Closes Browser Tab

```
+--------------------------------------------------------------------------------------------------+
|                             ASYNCHRONOUS WEBHOOK LIFECYCLE                                       |
|                                                                                                  |
| [Customer Browser]                                                                               |
|       | 1. Customer approves UPI payment on bank mobile app                                      |
|       | 2. Customer battery dies / tab closes / network drops BEFORE frontend verify-payment     |
|       v                                                                                          |
| [Razorpay Cloud Servers]                                                                         |
|       | 3. Razorpay detects payment capture on the banking rail                                  |
|       | 4. Razorpay sends HTTP POST to: https://shopvilla-api.onrender.com/api/v1/orders/webhook |
|       |    Headers: x-razorpay-signature, Payload: { event: 'payment.captured', ... }           |
|       v                                                                                          |
| [Express Server: Dedicated Webhook Route]                                                        |
|       | 5. app.post('/api/v1/orders/webhook', express.raw({ type: 'application/json' }))        |
|       |    Preserves unparsed byte buffer on req.rawBody BEFORE express.json() runs              |
|       v                                                                                          |
| [Controller: orderController.js -> handleRazorpayWebhook]                                        |
|       | 6. Computes HMAC-SHA256 on req.rawBody using process.env.RAZORPAY_WEBHOOK_SECRET          |
|       | 7. Verifies signature against req.headers['x-razorpay-signature']                        |
|       |    -> If invalid -> returns HTTP 400 Bad Request                                         |
|       | 8. Parses event: 'payment.captured', extracts payment.order_id and eventId               |
|       | 9. Locates Order in MongoDB via { razorpayOrderId: payment.order_id }                    |
|       | 10. IDEMPOTENCY CHECK:                                                                   |
|       |     If order.paymentStatus === 'PAID' OR order.processedWebhookEventIds.includes(eventId)|
|       |     -> Returns HTTP 200 { status: 'ok', message: 'Already processed' } immediately       |
|       | 11. State update:                                                                        |
|       |     - order.paymentStatus = 'PAID'                                                       |
|       |     - order.orderStatus = 'CONFIRMED'                                                    |
|       |     - order.razorpayPaymentId = payment.id                                               |
|       |     - order.processedWebhookEventIds.push(eventId)                                       |
|       | 12. order.save() persists state safely to MongoDB                                        |
|       | 13. sendOrderConfirmationEmail() dispatches order receipt to customer's email            |
|       v                                                                                          |
| [HTTP 200 OK Response]                                                                           |
|       | 14. Server returns HTTP 200 { status: 'ok' } to acknowledge delivery to Razorpay          |
|       +------------------------------------------------------------------------------------------+
```

1. **The Edge Case:** The customer authorizes payment on their banking app, but before their browser can execute step 10 of the checkout flow, their phone dies, their Wi-Fi disconnects, or they accidentally swipe away the browser tab. The client-side verification never runs.
2. **Server-to-Server Delivery:** Razorpay's cloud detects that the bank transferred the funds and immediately initiates a server-to-server webhook POST to `/api/v1/orders/webhook`.
3. **Raw Body Interception:** Express's dedicated raw webhook route catches the request. Because it is mounted before `express.json()`, `req.rawBody` preserves the exact original byte stream.
4. **Signature Verification:** `handleRazorpayWebhook` calculates `crypto.createHmac('sha256', WEBHOOK_SECRET).update(req.rawBody).digest('hex')` and confirms it matches `x-razorpay-signature`.
5. **Database Match:** The controller searches MongoDB for the order where `razorpayOrderId === payload.payment.entity.order_id`.
6. **Persistent Idempotency Verification:** The controller checks if the order is already marked `PAID` or if `order.processedWebhookEventIds` already contains `req.body.event_id`. If so, it returns HTTP 200 immediately, preventing duplicate confirmations.
7. **State Advancement:** The order is marked `paymentStatus = 'PAID'` and `orderStatus = 'CONFIRMED'`. The `eventId` is appended to `order.processedWebhookEventIds` and saved to MongoDB.
8. **Customer Notification:** The server triggers `sendOrderConfirmationEmail()`, ensuring the customer receives their order confirmation in their inbox despite having closed their browser.
9. **Gateway Acknowledgment:** The server sends HTTP 200 `{ status: 'ok' }`. Razorpay records successful delivery and closes the webhook event.

---

### (d) Cancelling a Paid Order

```
+--------------------------------------------------------------------------------------------------+
|                                ORDER CANCELLATION & REFUND FLOW                                  |
|                                                                                                  |
| [User Browser: OrderDetailPage.jsx] OR [Admin: AdminOrdersPage.jsx]                              |
|       | 1. User/Admin clicks "Cancel Order" with reason: "Customer requested cancellation"       |
|       | 2. Axios PATCH /api/v1/orders/:id/cancel with Authorization: Bearer <token>              |
|       v                                                                                          |
| [Backend: orderController.js -> cancelOrder]                                                     |
|       | 3. authMiddleware.protect verifies token and active status                               |
|       | 4. IDOR OWNERSHIP CHECK:                                                                 |
|       |    Verifies order.user._id === req.user._id OR req.user.role === 'admin'                 |
|       | 5. STATE MACHINE CHECK:                                                                  |
|       |    Regular user can only cancel from: ['PENDING', 'CONFIRMED']                           |
|       |    Admin can also cancel from: ['SHIPPED']                                               |
|       |    Orders in 'DELIVERED' or 'CANCELLED' cannot be cancelled                              |
|       v                                                                                          |
| [Shared Service: orderService.js -> cancelOrderService]                                          |
|       | 6. IDEMPOTENCY GUARD: If order.orderStatus === 'CANCELLED', returns early               |
|       | 7. REFUND INITIATION:                                                                    |
|       |    If order.paymentStatus === 'PAID':                                                    |
|       |    - Sets order.paymentStatus = 'REFUND_INITIATED'                                       |
|       |    - Calls razorpay.payments.refund(order.razorpayPaymentId, { amount: order.totalAmount }) |
|       |    If order was COD or PENDING:                                                          |
|       |    - Sets order.paymentStatus = 'FAILED'                                                 |
|       | 8. INVENTORY RESTORATION:                                                                |
|       |    Loop over order.items -> Product.findByIdAndUpdate(item.product, {$inc: {stock: qty}})|
|       |    (Restores inventory exactly once)                                                     |
|       | 9. STATUS HISTORY UPDATE:                                                                |
|       |    order.orderStatus = 'CANCELLED'                                                       |
|       |    Appends audit entry: { status: 'CANCELLED', updatedBy, note: reason }                 |
|       | 10. order.save() commits changes to MongoDB                                              |
|       | 11. sendOrderStatusUpdateEmail() sends cancellation notice to customer                   |
|       v                                                                                          |
| [Asynchronous Refund Webhook (Later)]                                                            |
|       | 12. Razorpay processes bank refund and sends webhook: 'refund.processed'                 |
|       | 13. Webhook handler transitions order.paymentStatus from 'REFUND_INITIATED' to 'REFUNDED'|
+--------------------------------------------------------------------------------------------------+
```

1. **Trigger:** A customer clicks "Cancel Order" on [`client/src/pages/OrderDetailPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/OrderDetailPage.jsx), or an administrator selects "Cancel Order" in [`client/src/pages/admin/AdminOrdersPage.jsx`](file:///d:/SHOPVILLA/client/src/pages/admin/AdminOrdersPage.jsx).
2. **Endpoint Call:** The client dispatches a PATCH request to `/api/v1/orders/:id/cancel`.
3. **IDOR & Role Verification:** The server ensures the caller is either the owner of the order (`order.user.toString() === req.user._id.toString()`) or has the `admin` role. Unauthorized callers receive HTTP 403 Forbidden.
4. **State Machine Validation:** The server validates whether the order status permits cancellation. Regular users can cancel orders in `PENDING` or `CONFIRMED` status. Administrators can also cancel orders in `SHIPPED` status. If the order is `DELIVERED` or already `CANCELLED`, the request is rejected with HTTP 400.
5. **Idempotent Shared Service:** Execution enters `cancelOrderService()` in [`server/services/orderService.js`](file:///d:/SHOPVILLA/server/services/orderService.js). If the order is already cancelled, it exits immediately without double-restoring stock.
6. **Automated Refund Trigger:** If the order was paid online (`paymentStatus === 'PAID'`), the service transitions status to `REFUND_INITIATED` and calls `razorpayService.initiateRefund()` with the captured `razorpayPaymentId`.
7. **Atomic Inventory Restoration:** The service loops through all line items and executes `Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })`. This restores the exact reserved quantities back to the public catalog.
8. **Audit Trail Recording:** An audit entry containing the timestamp, responsible user ID, and cancellation reason is pushed to `order.statusHistory`.
9. **Customer Email:** Nodemailer dispatches an automated cancellation notice explaining that the order has been cancelled and the refund initiated.
10. **Webhook Finalization:** Several hours or days later, when the banking partner settles the money back into the customer's account, Razorpay delivers a `refund.processed` webhook. ShopVilla catches this event and updates `paymentStatus = 'REFUNDED'`.

---

## 13. Glossary of Acronyms

| Acronym | Full Form | One-Line Meaning in ShopVilla |
| :--- | :--- | :--- |
| **ACID** | Atomicity, Consistency, Isolation, Durability | Database transaction properties ensuring database modifications are reliable and protected against corruption. |
| **API** | Application Programming Interface | A standardized set of rules and HTTP endpoints allowing the React frontend to communicate with the Express backend. |
| **CDN** | Content Delivery Network | A geographically distributed network of proxy servers (like Vercel) that caches static frontend files near users for fast downloads. |
| **CI** | Continuous Integration | The software practice of automatically building and testing code on every Git push to catch defects early. |
| **CD** | Continuous Deployment | The automated pipeline that releases tested and validated code directly into production hosting (Render / Vercel). |
| **COD** | Cash On Delivery | An e-commerce payment method where the customer pays cash or UPI directly to the courier executive upon parcel delivery. |
| **CORS** | Cross-Origin Resource Sharing | A browser security mechanism that restricts web applications from making HTTP requests to a domain different from their own. |
| **CRUD** | Create, Read, Update, Delete | The four fundamental persistent storage operations performed on database records (Products, Users, Orders). |
| **CSRF** | Cross-Site Request Forgery | A web security vulnerability where an unauthorized website tricks a user's browser into executing unwanted actions on another site. |
| **CSS** | Cascading Style Sheets | The stylesheet language used to format, layout, and style HTML elements in web browsers. |
| **DOM** | Document Object Model | The hierarchical in-memory tree representation of HTML elements rendered by the web browser. |
| **DTO** | Data Transfer Object | An object that carries structured data between processes or client-server requests without containing business logic. |
| **HMAC** | Hash-based Message Authentication Code | A cryptographic algorithm using a secret key and a hash function (SHA-256) to verify data integrity and authenticity. |
| **HMR** | Hot Module Replacement | A Vite development feature that updates running JavaScript modules in the browser instantly without requiring a full page refresh. |
| **HTML** | HyperText Markup Language | The standard markup language used to structure web pages and applications. |
| **HTTP** | HyperText Transfer Protocol | The foundation protocol used by the World Wide Web for transferring messages, files, and data between clients and servers. |
| **HTTPS** | HyperText Transfer Protocol Secure | An encrypted version of HTTP that uses SSL/TLS to protect transmitted data against eavesdropping and tampering. |
| **IDOR** | Insecure Direct Object References | A security vulnerability where an application exposes internal object IDs without verifying if the user has authorization to access them. |
| **JSON** | JavaScript Object Notation | A lightweight, human-readable text format for storing and exchanging structured data between clients and servers. |
| **JWT** | JSON Web Token | A compact, digitally signed open standard (RFC 7519) used to securely transmit authenticated user claims without server session state. |
| **MERN** | MongoDB, Express.js, React, Node.js | The full-stack technology stack used to develop the ShopVilla e-commerce web platform. |
| **NoSQL** | Not Only SQL | Non-relational, document-oriented databases (like MongoDB) that store data in flexible, schema-free JSON-like BSON documents. |
| **ODM** | Object Data Modeling | A library (like Mongoose) that maps application JavaScript objects to underlying document collections in a NoSQL database. |
| **ORM** | Object-Relational Mapping | A library (like Prisma or Hibernate) that maps application objects to relational SQL database tables. |
| **OTP** | One-Time Password | A temporary 6-digit numeric passcode valid for a single transaction or session within a short time window (5 minutes). |
| **PaaS** | Platform as a Service | A cloud hosting model (like Render) where the cloud vendor manages servers, networking, and OS runtimes, allowing developers to focus on application code. |
| **RBAC** | Role-Based Access Control | A security access management system where permissions are assigned based on defined roles (e.g. `customer` vs `admin`). |
| **REST** | Representational State Transfer | An architectural software style for networked applications using standard HTTP methods (GET, POST, PUT, PATCH, DELETE). |
| **SDK** | Software Development Kit | A collection of pre-written libraries, tools, and documentation provided by a vendor (like Razorpay) to integrate their services easily. |
| **SMTP** | Simple Mail Transfer Protocol | The universal internet communications protocol used by mail servers and Nodemailer to transmit emails across networks. |
| **SoC** | Separation of Concerns | A design principle of dividing software into distinct modules, where each module addresses a single responsibility. |
| **SPA** | Single Page Application | A web application (built with React) that loads a single HTML page and dynamically updates content without full page reloads. |
| **SSL** | Secure Sockets Layer | A deprecated cryptographic protocol superseded by TLS used for establishing encrypted links between web servers and browsers. |
| **TLS** | Transport Layer Security | The modern cryptographic protocol providing end-to-end communication security and privacy over the internet (used in HTTPS and SMTP). |
| **TTL** | Time To Live | A mechanism or index (like MongoDB TTL index) that automatically deletes documents from a collection after a specified duration. |
| **UI** | User Interface | The visual and interactive front-of-house elements (buttons, forms, typography) that users interact with on a screen. |
| **URI** | Uniform Resource Identifier | A compact sequence of characters that identifies an abstract or physical resource (e.g. `mongodb+srv://...`). |
| **URL** | Uniform Resource Locator | A specific type of URI that specifies the network location of a web resource and the protocol used to access it (e.g. `https://shopvilla.com/products`). |
| **UUID** | Universally Unique Identifier | A 128-bit label used to identify information in computer systems with virtually zero probability of collision. |
| **UX** | User Experience | The overall experience, ease of use, and emotional satisfaction a customer has while interacting with a product or platform. |
| **VEP** | Variant Effect Predictor | A bioinformatics computational tool used to determine the functional consequences of genomic variants (referenced in scientific skills). |
| **VM** | Virtual Machine | A software emulation of a complete physical computer system running its own guest operating system on top of a hypervisor. |
| **XSS** | Cross-Site Scripting | A client-side security vulnerability where an attacker injects malicious JavaScript into web pages viewed by other users. |

---

## 14. Master Revision Cheat Sheet

| Technology / Tool / Concept | Category | One-Line Summary | Where Used in ShopVilla |
| :--- | :--- | :--- | :--- |
| **React 18** | Frontend | Component-based UI library using Virtual DOM for fast rendering | [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx), [`client/src/App.jsx`](file:///d:/SHOPVILLA/client/src/App.jsx) |
| **Vite** | Frontend | Blazing fast ESM frontend build tool with instant HMR | [`client/vite.config.js`](file:///d:/SHOPVILLA/client/vite.config.js), [`client/package.json`](file:///d:/SHOPVILLA/client/package.json) |
| **React Router v6** | Frontend | Declarative client-side routing library for React Single Page Apps | [`client/src/App.jsx`](file:///d:/SHOPVILLA/client/src/App.jsx) |
| **Context API** | Frontend | Built-in React state management for global shared data | [`client/src/context/AuthContext.jsx`](file:///d:/SHOPVILLA/client/src/context/AuthContext.jsx), [`CartContext.jsx`](file:///d:/SHOPVILLA/client/src/context/CartContext.jsx), [`ToastContext.jsx`](file:///d:/SHOPVILLA/client/src/context/ToastContext.jsx) |
| **Axios** | Frontend | Promise-based HTTP client for browser and Node.js requests | [`client/src/api/axios.js`](file:///d:/SHOPVILLA/client/src/api/axios.js) |
| **Axios Interceptors** | Frontend | Global request/response hooks to inject auth tokens and handle 401s | [`client/src/api/axios.js#L11-L36`](file:///d:/SHOPVILLA/client/src/api/axios.js#L11-L36) |
| **Bootstrap 5** | Frontend | Responsive CSS framework providing grid systems and utility classes | [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx), all pages in [`client/src/pages/`](file:///d:/SHOPVILLA/client/src/pages/) |
| **Bootstrap Icons** | Frontend | Clean SVG icon library matching Bootstrap's design language | [`client/src/main.jsx`](file:///d:/SHOPVILLA/client/src/main.jsx), [`Navbar.jsx`](file:///d:/SHOPVILLA/client/src/components/Navbar.jsx) |
| **Protected Routes** | Frontend | Route wrapper components that redirect unauthenticated users to `/login` | [`client/src/components/ProtectedRoute.jsx`](file:///d:/SHOPVILLA/client/src/components/ProtectedRoute.jsx), [`AdminRoute.jsx`](file:///d:/SHOPVILLA/client/src/components/AdminRoute.jsx) |
| **localStorage** | Frontend | Persistent key-value browser storage surviving page refreshes | Auth token storage in [`client/src/context/AuthContext.jsx`](file:///d:/SHOPVILLA/client/src/context/AuthContext.jsx) |
| **Node.js** | Backend | Asynchronous event-driven JavaScript server runtime | Entire backend execution in [`server/`](file:///d:/SHOPVILLA/server/) |
| **Express.js** | Backend | Minimalist, unopinionated web framework for Node.js REST APIs | App setup in [`server/app.js`](file:///d:/SHOPVILLA/server/app.js) and [`server/server.js`](file:///d:/SHOPVILLA/server/server.js) |
| **Middleware Pattern** | Backend | Functions with access to `(req, res, next)` executing in a pipeline | [`server/middleware/`](file:///d:/SHOPVILLA/server/middleware/) |
| **MVC / Service Architecture**| Backend | Architectural separation of routes, controllers, services, and models | [`server/routes/`](file:///d:/SHOPVILLA/server/routes/), [`controllers/`](file:///d:/SHOPVILLA/server/controllers/), [`services/`](file:///d:/SHOPVILLA/server/services/) |
| **REST API Architecture** | Backend | Stateless architectural standard mapping HTTP verbs to CRUD actions | All endpoints mounted in [`server/app.js`](file:///d:/SHOPVILLA/server/app.js) |
| **Async/Await & catchAsync** | Backend | Clean asynchronous promise handling eliminating callback hell | [`server/utils/catchAsync.js`](file:///d:/SHOPVILLA/server/utils/catchAsync.js) |
| **Centralized Error Handler** | Backend | Single middleware catching all errors, hiding stack traces in production | [`server/middleware/errorHandler.js`](file:///d:/SHOPVILLA/server/middleware/errorHandler.js) |
| **dotenv** | Backend | Loads environment variables from `.env` file into `process.env` | [`server/server.js#L3`](file:///d:/SHOPVILLA/server/server.js#L3), [`server/app.js#L3`](file:///d:/SHOPVILLA/server/app.js#L3) |
| **morgan** | Backend | HTTP request logger middleware for debugging server requests | Mounted in non-test mode in [`server/app.js#L44`](file:///d:/SHOPVILLA/server/app.js#L44) |
| **MongoDB** | Database | Scalable, document-oriented NoSQL database storing JSON-like BSON | Connected in [`server/config/db.js`](file:///d:/SHOPVILLA/server/config/db.js) |
| **Mongoose ODM** | Database | Schema-based modeling library providing validation and query hooks | All models in [`server/models/`](file:///d:/SHOPVILLA/server/models/) |
| **Schemas & Models** | Database | Rigid data definitions enforcing data types, defaults, and validations | [`server/models/User.js`](file:///d:/SHOPVILLA/server/models/User.js), [`Product.js`](file:///d:/SHOPVILLA/server/models/Product.js), [`Order.js`](file:///d:/SHOPVILLA/server/models/Order.js) |
| **Database Indexes** | Database | B-tree index structures accelerating query search speeds | Single & compound indexes in [`Order.js`](file:///d:/SHOPVILLA/server/models/Order.js), [`Review.js`](file:///d:/SHOPVILLA/server/models/Review.js) |
| **Full-Text Index** | Database | Text search index allowing multi-word and partial phrase searches | Configured on name and description in [`Product.js#L54`](file:///d:/SHOPVILLA/server/models/Product.js#L54) |
| **Aggregation Pipeline** | Database | Multi-stage document transformation pipeline (`$lookup`, `$count`) | Analytics queries in [`server/controllers/adminController.js`](file:///d:/SHOPVILLA/server/controllers/adminController.js) |
| **Atomic Updates ($inc, $gte)** | Database | Conditional atomic database writes preventing concurrency race conditions | Stock deductions in [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **TTL Indexes** | Database | Special single-field indexes that automatically delete expired documents | 5-minute OTP expiration in [`server/models/Otp.js#L26`](file:///d:/SHOPVILLA/server/models/Otp.js#L26) |
| **Soft Delete Pattern** | Database | Setting `isActive: false` rather than deleting rows to preserve history | User deactivation in [`server/controllers/adminController.js`](file:///d:/SHOPVILLA/server/controllers/adminController.js) |
| **Snapshot Pattern** | Database | Freezing price and address copies directly in orders at purchase time | Order schema items in [`server/models/Order.js#L29-L38`](file:///d:/SHOPVILLA/server/models/Order.js#L29-L38) |
| **JSON Web Tokens (JWT)** | Auth / Security | Signed, stateless tokens transmitting user ID and role claims securely | Token generation in [`authController.js`](file:///d:/SHOPVILLA/server/controllers/authController.js), verified in [`authMiddleware.js`](file:///d:/SHOPVILLA/server/middleware/authMiddleware.js) |
| **bcryptjs** | Auth / Security | Cryptographic one-way password hashing algorithm with salt | Pre-save hook in [`User.js#L54`](file:///d:/SHOPVILLA/server/models/User.js#L54), OTP hashing in [`otpService.js`](file:///d:/SHOPVILLA/server/services/otpService.js) |
| **Salt Rounds (Cost Factor)** | Auth / Security | 10 rounds of Blowfish key expansion balancing CPU cost and security | [`server/models/User.js#L56`](file:///d:/SHOPVILLA/server/models/User.js#L56), [`server/services/otpService.js#L23`](file:///d:/SHOPVILLA/server/services/otpService.js#L23) |
| **Role-Based Access Control** | Auth / Security | Restricts route execution to specific roles (`customer` vs `admin`) | Middleware in [`server/middleware/roleMiddleware.js:restrictTo`](file:///d:/SHOPVILLA/server/middleware/roleMiddleware.js) |
| **One-Time Passwords (OTP)** | Auth / Security | 6-digit codes sent via email to verify accounts and checkout authenticity | Handled in [`server/services/otpService.js`](file:///d:/SHOPVILLA/server/services/otpService.js) |
| **Rate Limiting** | Security | Restricts requests per IP to protect against brute-force and DDoS | Configured in [`server/middleware/rateLimiter.js`](file:///d:/SHOPVILLA/server/middleware/rateLimiter.js) |
| **Helmet** | Security | Injects 15+ HTTP security headers to protect against clickjacking & XSS | Registered in [`server/app.js#L26`](file:///d:/SHOPVILLA/server/app.js#L26) |
| **CORS** | Security | Restricts browser cross-origin requests to trusted frontend domains | Configured in [`server/app.js#L28-L46`](file:///d:/SHOPVILLA/server/app.js#L28-L46) |
| **express-mongo-sanitize** | Security | Strips dangerous `$` and `.` characters to neutralize NoSQL injection | Mounted globally in [`server/app.js#L65`](file:///d:/SHOPVILLA/server/app.js#L65) |
| **express-validator** | Security | Declarative validation chains validating inputs before controller execution | Defined in [`server/middleware/validators.js`](file:///d:/SHOPVILLA/server/middleware/validators.js) |
| **IDOR Defense** | Security | Verifies that authenticated user owns the accessed order or resource | Ownership checks in [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **Account Enumeration Defense** | Security | Returns identical generic responses whether an email exists or not | Registration & forgot password in [`server/controllers/authController.js`](file:///d:/SHOPVILLA/server/controllers/authController.js) |
| **XSS Prevention** | Security | Prevents malicious script execution via React auto-escaping & Helmet | React JSX rendering and Helmet headers |
| **CSRF Prevention** | Security | Eliminates ambient cookie vulnerabilities using `Authorization: Bearer` | Axios request interceptor and auth middleware |
| **HMAC-SHA256 Signatures** | Security / Payments | Verifies Razorpay payment returns and webhook integrity using shared secret | Verified in [`server/services/razorpayService.js`](file:///d:/SHOPVILLA/server/services/razorpayService.js) |
| **Razorpay Orders API** | Payments | Creates authoritative gateway orders with amounts bound in paise | Created in [`server/services/razorpayService.js:createOrder`](file:///d:/SHOPVILLA/server/services/razorpayService.js) |
| **Payment Signature Verification** | Payments | Confirms payment legitimacy before advancing order to `PAID` | [`server/controllers/orderController.js:verifyRazorpayPayment`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **Webhooks** | Payments | Asynchronous HTTP POST notifications sent from Razorpay to our server | Dedicated route in [`server/app.js#L50-L60`](file:///d:/SHOPVILLA/server/app.js#L50-L60) |
| **Webhook Idempotency** | Payments | Deduplicates webhook events by storing processed event IDs in MongoDB | [`server/controllers/orderController.js:handleRazorpayWebhook`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **Raw Request Body Capture** | Payments / Security | Preserves unparsed byte buffer for exact HMAC signature calculations | Mounted via `express.raw()` in [`server/app.js#L52`](file:///d:/SHOPVILLA/server/app.js#L52) |
| **Payment Reconciliation** | Payments / Reliability | Scheduled job querying Razorpay to reconcile unconfirmed pending orders | Handled in [`server/services/reconciliationService.js`](file:///d:/SHOPVILLA/server/services/reconciliationService.js) |
| **30-Minute Expiry Job** | Payments / Reliability | Auto-cancels abandoned orders older than 30m and restores inventory | Scheduled in [`server/services/reconciliationService.js`](file:///d:/SHOPVILLA/server/services/reconciliationService.js) |
| **Automated Refunds** | Payments | Triggers programmatic refunds via Razorpay API when paid orders cancel | [`server/services/orderService.js:cancelOrderService`](file:///d:/SHOPVILLA/server/services/orderService.js) |
| **Cash on Delivery (COD)** | Payments | Workflow allowing cash payment upon physical parcel delivery | [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js), [`adminController.js`](file:///d:/SHOPVILLA/server/controllers/adminController.js) |
| **Finite State Machine** | Pattern | Enforces strict, legal order status progression (`VALID_ORDER_TRANSITIONS`) | Defined in [`server/controllers/adminController.js`](file:///d:/SHOPVILLA/server/controllers/adminController.js) |
| **Race Condition Defense** | Pattern | Conditional updates ensuring items are never sold when stock is zero | Stock deduction in [`server/controllers/orderController.js`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **Compensating Rollback** | Pattern | Explicitly restores inventory stock if Razorpay order creation fails | Try/catch in [`server/controllers/orderController.js:createOrder`](file:///d:/SHOPVILLA/server/controllers/orderController.js) |
| **Pagination** | Pattern | Returns data in manageable chunks via `page` and `limit` parameters | Implemented in [`server/utils/apiFeatures.js`](file:///d:/SHOPVILLA/server/utils/apiFeatures.js) |
| **N+1 Query Elimination** | Pattern | Uses single aggregation pipelines instead of queries inside loops | Implemented in [`server/controllers/adminController.js:getCustomers`](file:///d:/SHOPVILLA/server/controllers/adminController.js) |
| **Separation of Concerns** | Pattern | Separates routing, request parsing, business logic, and schemas | Modular directory structure (`routes/`, `controllers/`, `services/`, `models/`) |
| **Fail-Fast Startup Check** | DevOps / Pattern | Terminates server boot immediately if required env variables are missing | Startup check in [`server/server.js:validateStartupEnv`](file:///d:/SHOPVILLA/server/server.js) |
| **Nodemailer** | Email | Node.js email module sending transactional receipts and verification OTPs | Configured in [`server/config/nodemailer.js`](file:///d:/SHOPVILLA/server/config/nodemailer.js) |
| **SMTP** | Email | Standard protocol used to transmit emails across networks via port 587 | Configured in [`server/config/nodemailer.js`](file:///d:/SHOPVILLA/server/config/nodemailer.js) |
| **Gmail App Passwords** | Email | 16-character passcodes allowing secure SMTP sending with 2FA enabled | Set in `EMAIL_PASS` in [`server/.env`](file:///d:/SHOPVILLA/server/.env) |
| **node-cron** | Background Jobs | Pure JS cron task runner executing 10-minute reconciliation jobs | Initialized in [`server/services/reconciliationService.js`](file:///d:/SHOPVILLA/server/services/reconciliationService.js) |
| **Jest** | Testing | Test framework running assertions and test suites | Configured in [`server/package.json`](file:///d:/SHOPVILLA/server/package.json), runs all tests |
| **Supertest** | Testing | Makes synthetic HTTP requests directly to Express `app` without live ports | Used across [`server/tests/api.test.js`](file:///d:/SHOPVILLA/server/tests/api.test.js), [`integration.test.js`](file:///d:/SHOPVILLA/server/tests/integration.test.js) |
| **mongodb-memory-server** | Testing | Spins up temporary real MongoDB instance in RAM for isolated tests | Connected in `beforeAll()` in [`server/tests/integration.test.js`](file:///d:/SHOPVILLA/server/tests/integration.test.js) |
| **Docker** | DevOps | Packages application and dependencies into isolated portable containers | [`server/Dockerfile`](file:///d:/SHOPVILLA/server/Dockerfile), [`client/Dockerfile`](file:///d:/SHOPVILLA/client/Dockerfile) |
| **Multi-Stage Builds** | DevOps | Separates Node build environment from lightweight Nginx runtime image | Used in [`client/Dockerfile`](file:///d:/SHOPVILLA/client/Dockerfile) |
| **Docker Compose** | DevOps | Orchestrates multi-container MongoDB, Server, and Client application | Defined in [`docker-compose.yml`](file:///d:/SHOPVILLA/docker-compose.yml) |
| **Nginx** | DevOps | Fast reverse proxy serving static React SPA and proxying `/api/` | Configured in [`client/nginx.conf`](file:///d:/SHOPVILLA/client/nginx.conf) |
| **MongoDB Atlas** | DevOps | Fully managed cloud MongoDB hosting with automated backups and replica sets | Configured via `MONGO_URI` in [`server/.env`](file:///d:/SHOPVILLA/server/.env) |
| **Render** | DevOps | Cloud PaaS hosting the Node.js Express backend API with auto-deploys | Configured for server hosting |
| **Vercel** | DevOps | Global Edge CDN hosting the React Vite frontend SPA | Configured with [`client/vercel.json`](file:///d:/SHOPVILLA/client/vercel.json) |
| **vercel.json Rewrites** | DevOps | Directs all incoming URLs to `/index.html` to support client-side routing | Configured in [`client/vercel.json`](file:///d:/SHOPVILLA/client/vercel.json) |
| **Health Check Endpoint** | DevOps | Lightweight `/api/health` route returning HTTP 200 for cloud monitor probes | Mounted in [`server/app.js#L70`](file:///d:/SHOPVILLA/server/app.js#L70) |
| **Git & GitHub** | Tools | Distributed version control and cloud repository hosting for code collaboration | Project root Git tracking |
| **Postman** | Tools | API platform used to test endpoints, headers, and simulate webhooks | Used for testing backend endpoints |
| **ngrok** | Tools | Public HTTPS tunneling tool allowing Razorpay cloud webhooks to hit localhost | Used during local webhook testing |
| **VS Code** | Tools | Microsoft code editor used for full-stack engineering and debugging | Project workspace |

---

## 15. Top 30 Interview Questions & Answers

### 1. How does ShopVilla ensure that an order amount cannot be tampered with by a malicious user in the browser?
**Answer:** The server never trusts any price or total sent in the request body. When `createOrder` is called, the backend queries the user's cart from MongoDB, populates the authoritative prices directly from the `Product` collection, recalculates the subtotal, computes the shipping fee rule (`itemsTotal >= 500 ? 0 : 50`), and sends that authoritative total to Razorpay via `orders.create()`.

### 2. What is the difference between storing JWTs in `localStorage` versus `httpOnly` cookies? Why did ShopVilla standardize on `Authorization: Bearer`?
**Answer:** `localStorage` is vulnerable to Cross-Site Scripting (XSS) because JavaScript can access it, but it is completely immune to Cross-Site Request Forgery (CSRF). `httpOnly` cookies protect against XSS token extraction, but expose the API to CSRF attacks during cross-site requests. ShopVilla standardizes on the `Authorization: Bearer` header because our frontend (Vercel) and backend (Render) reside on different domains, making third-party cross-origin cookie management complex and brittle across modern privacy-focused browsers.

### 3. How does ShopVilla prevent race conditions when two customers try to purchase the very last available unit of a product at the exact same millisecond?
**Answer:** Rather than reading the stock in one query and updating it in another, ShopVilla uses MongoDB's atomic operator: `Product.findOneAndUpdate({ _id: id, stock: { $gte: quantity } }, { $inc: { stock: -quantity } })`. MongoDB's document-level lock guarantees that only one concurrent operation can fulfill the condition `stock >= quantity`. The second operation receives `null` and is cleanly rejected with an out-of-stock error.

### 4. What happens if a customer completes payment on Razorpay, but closes their browser tab before the frontend can send the verification request?
**Answer:** The order is confirmed asynchronously via Razorpay's webhook. Razorpay's servers send an HTTP POST request to `/api/v1/orders/webhook`. Our server verifies the HMAC signature using `req.rawBody` and `RAZORPAY_WEBHOOK_SECRET`, finds the matching order by `razorpayOrderId`, updates `paymentStatus` to `PAID`, marks `orderStatus` as `CONFIRMED`, and dispatches an order confirmation email via Nodemailer.

### 5. Why is `express.raw()` required for the webhook route, and why must it be registered before `express.json()`?
**Answer:** Cryptographic HMAC signature verification checks the exact raw bytes transmitted across the wire. If `express.json()` processes the request first, whitespace, indentation, or JSON key ordering can change, causing signature validation to fail. Mounting `express.raw({ type: 'application/json' })` on `/api/v1/orders/webhook` before `express.json()` preserves the exact binary buffer on `req.rawBody`.

### 6. How does ShopVilla achieve idempotency when handling payment webhooks?
**Answer:** Every Razorpay webhook includes a unique `event_id` in its payload. When processing an event, ShopVilla inspects the order document in MongoDB: if `order.paymentStatus === 'PAID'` or `order.processedWebhookEventIds.includes(eventId)`, the handler returns HTTP 200 `{ status: 'ok' }` immediately without executing side effects. If new, `eventId` is pushed to `order.processedWebhookEventIds` and saved in MongoDB.

### 7. What is the purpose of the 10-minute payment reconciliation background cron job?
**Answer:** It acts as a safety net for edge cases where both frontend verification and webhooks fail (e.g. cloud network drops). It queries pending orders older than 15 minutes, checks their live payment state via the Razorpay API, and confirms captured orders. If an order is older than 30 minutes with no successful payment, it auto-cancels the order and restores the held inventory.

### 8. Why must the reconciliation job check the payment status with Razorpay before cancelling an expired order?
**Answer:** A customer might have paid successfully at minute 29 while a webhook was delayed. Cancelling the order without querying Razorpay would take the customer's money while cancelling their order and releasing their items to other customers.

### 9. How does ShopVilla prevent double-restoration of inventory stock when an order is cancelled?
**Answer:** All cancellations are routed through a single shared service function: `cancelOrderService` in [`server/services/orderService.js`](file:///d:/SHOPVILLA/server/services/orderService.js). The function checks `if (order.orderStatus === 'CANCELLED') return order;`. Because the status check and status update happen together, duplicate cancel calls exit immediately without re-invoking `restoreInventoryStock()`.

### 10. What is an IDOR vulnerability, and how does ShopVilla protect against it?
**Answer:** Insecure Direct Object Reference (IDOR) allows an attacker to access another user's private data by altering an ID in an endpoint URL (e.g. `/api/v1/orders/60d...`). ShopVilla prevents this on every order endpoint by verifying: `if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));`.

### 11. How does ShopVilla defend against Account Enumeration attacks during registration and password resets?
**Answer:** If a user submits an email that is already registered, the server does not return "Email already exists". Instead, it returns an identical generic HTTP 200 response: `"If this email can be registered, we've sent an OTP to verify your account."` This prevents automated bots from testing email lists to see who has an account.

### 12. How does ShopVilla protect against NoSQL Injection attacks?
**Answer:** By mounting `express-mongo-sanitize` as global middleware in `app.js`. It recursively inspects all incoming request bodies, queries, and params, stripping any keys containing dollar signs (`$`) or dots (`.`) so attackers cannot inject MongoDB query operators like `{ "$ne": null }`.

### 13. What is the difference between 401 Unauthorized and 403 Forbidden in ShopVilla?
**Answer:** HTTP 401 means authentication is missing, invalid, or expired (the client must log in). HTTP 403 means the user is authenticated, but does not have permission to perform the action (e.g. a customer trying to access an admin analytics route, or an unverified user trying to place an order).

### 14. How does ShopVilla enforce Role-Based Access Control (RBAC)?
**Answer:** Using the `restrictTo('admin')` middleware factory. It verifies that `req.user.role` matches the permitted roles. If a regular customer attempts to hit `/api/v1/admin/orders`, the middleware immediately returns an HTTP 403 Forbidden error before the controller executes.

### 15. What are bcrypt salt rounds, and why did ShopVilla choose 10 rounds?
**Answer:** Salt rounds determine the computational work factor (2^rounds iterations of key expansion) required to hash a password. 10 rounds take approximately 60-100ms on modern CPUs—fast enough that users experience zero login delay, but slow enough that brute-forcing billions of combinations on GPUs is computationally infeasible.

### 16. How does ShopVilla protect OTP endpoints from brute-force guessing?
**Answer:** (1) The `Otp` document tracks an `attempts` counter and deletes the record if 3 failed guesses occur; (2) it enforces a 60-second cooldown between resend requests; (3) the endpoint is rate-limited by IP to 30 requests per 15 minutes; and (4) the OTP is stored as a bcrypt hash in MongoDB, not plain text.

### 17. Why does ShopVilla use MongoDB TTL indexes on the `Otp` collection?
**Answer:** A Time-To-Live (TTL) index automatically deletes documents after a designated expiration timestamp (`expiresAt`). This offloads expired token cleanup to MongoDB's internal background thread, preventing expired OTP records from accumulating in the database.

### 18. What is the Snapshot Pattern, and why is it critical in the `Order` model?
**Answer:** The Snapshot Pattern copies and freezes data (such as product name, unit price, and recipient address) directly into the order document at the moment of checkout. If an administrator later updates a product's price from ₹999 to ₹1,499, historical order invoices must not change.

### 19. What is the N+1 query problem, and how was it eliminated in ShopVilla's `getCustomers` endpoint?
**Answer:** The N+1 problem occurs when fetching N parent records, then running N separate queries in a loop to fetch related child records. In `getCustomers`, querying 100 customers and counting each customer's orders in a loop would execute 101 queries. ShopVilla replaced this with a single MongoDB aggregation pipeline using a sub-pipeline `$lookup` with `$count`, computing all customer order counts in a single database operation.

### 20. What is a Finite State Machine, and how is it implemented for ShopVilla orders?
**Answer:** A state machine enforces that an entity can only transition between valid, predefined states. ShopVilla implements `VALID_ORDER_TRANSITIONS`: `PENDING` -> `CONFIRMED` -> `PROCESSING` -> `SHIPPED` -> `DELIVERED`. An order cannot jump directly to `DELIVERED`, and terminal states (`DELIVERED`, `CANCELLED`) cannot be transitioned to any other state.

### 21. What is a Compensating Transaction, and where is it used in ShopVilla?
**Answer:** In multi-step workflows across external services where distributed ACID transactions are unavailable, a compensating transaction reverses a previously completed action if a later action fails. In `createOrder`, if Razorpay's API call fails after inventory stock was deducted, the `catch` block invokes `restoreInventoryStock()` to return the items to the catalog.

### 22. What is the purpose of the `catchAsync` utility function?
**Answer:** In Express 4, asynchronous errors in controllers must be manually passed to `next(err)` to reach the centralized error middleware. `catchAsync` wraps async controllers in a higher-order function: `(req, res, next) => fn(req, res, next).catch(next)`, eliminating repetitive `try/catch` boilerplate across all controllers.

### 23. How does ShopVilla's centralized error handler hide stack traces in production?
**Answer:** In [`server/middleware/errorHandler.js`](file:///d:/SHOPVILLA/server/middleware/errorHandler.js), the handler inspects `process.env.NODE_ENV`. In `development`, it returns the full error object, error code, and `error.stack`. In `production`, it returns only friendly error messages, logging the stack trace internally on the server to prevent exposing system paths to attackers.

### 24. What does the "fail-fast" startup validation do in `server.js`?
**Answer:** Before binding the port or connecting to MongoDB, `validateStartupEnv()` checks that mandatory environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) are defined. If missing, it prints a clear diagnostic error and calls `process.exit(1)`. In production, it also verifies Razorpay and email credentials to prevent booting into a broken state.

### 25. Why are Multi-Stage Docker Builds used for the React frontend?
**Answer:** Building a React Vite app requires Node.js, npm, and build packages (~800MB), but serving the compiled static assets only requires a web server like Nginx (~25MB). Multi-stage builds use Node in Stage 1 to build the `/dist` directory, then copy only the `/dist` files into a clean Nginx Alpine image in Stage 2, shrinking the final image by over 95%.

### 26. Why is `try_files $uri $uri/ /index.html;` required in `nginx.conf` and `client/vercel.json`?
**Answer:** In a React Single Page Application (SPA), routing is handled on the client side by React Router. When a user navigates directly to `https://shopvilla.com/orders/123`, the web server looks for a physical directory named `/orders/123` on disk and returns 404. The rewrite rule instructs the server to serve `/index.html` instead, allowing React Router to boot and render the correct view.

### 27. What is the difference between Unit and Integration testing in ShopVilla?
**Answer:** Unit tests verify an individual function in complete isolation (e.g. testing `verifyPaymentSignature` or password hashing). Integration tests test complete multi-step journeys interacting with a real or in-memory MongoDB database (e.g. Register -> OTP verify -> Login -> Add to Cart -> Place COD Order -> Admin Deliver).

### 28. Why does ShopVilla use `mongodb-memory-server` instead of mocking Mongoose queries in integration tests?
**Answer:** Mocking only verifies your assumptions about database responses. `mongodb-memory-server` spins up a real MongoDB instance in RAM, testing real schema validations, unique constraints, compound indexes, atomic `$inc` operations, and aggregation pipelines exactly as they behave in production.

### 29. How does Axios automatically handle expired JWT sessions in ShopVilla?
**Answer:** In [`client/src/api/axios.js`](file:///d:/SHOPVILLA/client/src/api/axios.js), a response interceptor inspects every incoming error. If `error.response.status === 401` on a protected route, the interceptor removes `shopvilla_token` and `shopvilla_user` from `localStorage` and automatically redirects the browser to `/login?expired=true`.

### 30. How does ShopVilla ensure soft-deleted or deactivated accounts cannot access the platform even if they hold a valid unexpired JWT?
**Answer:** While JWTs are stateless, the `protect` middleware in [`server/middleware/authMiddleware.js`](file:///d:/SHOPVILLA/server/middleware/authMiddleware.js) fetches the current user record from MongoDB using the decoded token ID. It explicitly verifies: `if (currentUser.isActive === false) return next(new AppError('Your account has been deactivated', 403));`. This revokes access immediately when an administrator deactivates an account, without waiting 7 days for the token to expire.

---
