# E-commerce Storefront

A responsive storefront interface built with HTML, CSS, and JavaScript.

## What problem did I work on?

I wanted to practice organizing a small online store into reusable page layouts: product discovery, a product detail page, editorial content, and a cart interface.

## What is included?

The repository contains home, shop, product, blog, about, contact, and cart pages, shared styles, image assets, and JavaScript for the mobile navigation, the product image switcher, and a cart saved in this browser.

## How can I check it?

Serve the repository with any static HTTP server:

```bash
python -m http.server 8080
```

Open http://localhost:8080. Check navigation between the seven pages, open and close the mobile menu at a narrow viewport, add a product from the shop and from the product page, then change its quantity or remove it on the cart page. Reload and confirm the cart is still there.

These are manual review steps, not an automated test report. There is no package installation or build step.

## Scope and learning

This is a frontend learning project. It does not implement a backend, checkout, payments, or real inventory. The cart is stored in this browser only. The checkout button explains that payment is not part of the demo.

The focus is semantic page structure, responsive CSS, consistent layout, and a small amount of DOM interaction.
