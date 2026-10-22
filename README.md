# Smart Inventory & Invoice Generator

A web-based inventory and invoice management application designed for small businesses to manage products, track stock levels, maintain customer records, generate invoices, and analyze customer spending.

## Tech Stack

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- LocalStorage
- jsPDF

## Features

### Product Management
- Add and manage products.
- Track product quantities, prices, categories, and SKUs.
- Search products.
- Identify low-stock and out-of-stock products.

### Inventory Management
- View current stock levels.
- Set minimum stock alerts.
- Update product quantities.
- Automatically reduce inventory after invoice generation.

### Invoice Management
- Create invoices for customers.
- Generate professional PDF invoices.
- Calculate subtotal, GST, and grand total.
- View invoice history and individual invoice details.
- Search and delete invoices.

### Customer Management
- Add, edit, view, and delete customer records.
- Store customer names, phone numbers, email addresses, and addresses.
- View customer-specific invoice history.
- Track total invoices and total spending per customer.

### Customer Analytics
- View total customers, revenue, invoice count, and average invoice value.
- Rank customers by total spending.
- Identify the top customer.
- Search customers by name.
- Filter customers by spending thresholds.

### Dashboard and Navigation
- View key business statistics.
- Navigate between products, inventory, invoices, customers, and analytics.
- Use a consistent sidebar navigation layout.

## Data Storage

The current version uses browser LocalStorage to store product, customer, and invoice records.

**Note:** Data is stored locally in the browser. Clearing browser storage or switching browsers/devices may cause records to become unavailable. A backend database and backup system would be needed for production use.

## Project Status

The project is being developed incrementally, with features tested locally as they are implemented.

## Future Improvements

- Backend database integration.
- User authentication and role-based access.
- Cloud backup and multi-device access.
- Improved reporting and data export.
- Automated inventory and sales reports.

## License

For educational and development purposes.
