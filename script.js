// ========================================
// SMART INVENTORY
// Product Storage
// ========================================

// Storage key
const PRODUCT_STORAGE_KEY = "smartInventoryProducts";

// ========================================
// GET PRODUCTS FROM LOCAL STORAGE
// ========================================

function getProducts() {

    const products =
        localStorage.getItem(PRODUCT_STORAGE_KEY);

    if (!products) {
        return [];
    }

    return JSON.parse(products);

}

// ========================================
// SAVE PRODUCTS TO LOCAL STORAGE
// ========================================

function saveProducts(products) {

    localStorage.setItem(
        PRODUCT_STORAGE_KEY,
        JSON.stringify(products)
    );

}

// ========================================
// PRODUCT FORM
// ========================================

const productForm =
    document.getElementById("productForm");

if (productForm) {

    productForm.addEventListener("submit", function (event) {

        // Prevent page refresh
        event.preventDefault();


        // Get existing products

        const products = getProducts();


        // Get form values

        const productName =
            document.getElementById("productName").value.trim();

        const sku =
            document.getElementById("sku").value.trim();

        const category =
            document.getElementById("category").value;

        const brand =
            document.getElementById("brand").value.trim();

        const purchasePrice =
            Number(
                document.getElementById("purchasePrice").value
            );

        const sellingPrice =
            Number(
                document.getElementById("sellingPrice").value
            );

        const quantity =
            Number(
                document.getElementById("quantity").value
            );

        const minimumStock =
            Number(
                document.getElementById("minimumStock").value
            );

        const description =
            document.getElementById("description").value.trim();


        // ========================================
        // CREATE PRODUCT
        // ========================================

        const product = {

            id: Date.now(),

            productName: productName,

            sku: sku,

            category: category,

            brand: brand,

            purchasePrice: purchasePrice,

            sellingPrice: sellingPrice,

            quantity: quantity,

            minimumStock: minimumStock,

            description: description

        };


        // Add product to array

        products.push(product);


        // Save updated products

        saveProducts(products);


        // Show confirmation

        alert("Product saved successfully!");


        // Clear form

        productForm.reset();


        // Check saved data

        console.log("Saved Products:", getProducts());

    });

}


// ========================================
// PRODUCT LIST
// ========================================

// Get product table

const productsTableBody = document.getElementById("productsTableBody");

// Get empty message

const emptyProductsMessage = document.getElementById("emptyProductsMessage");

// ========================================
// DISPLAY PRODUCTS
// ========================================

function displayProducts(products) {


    // Stop if product table doesn't exist

    if (!productsTableBody) {
        return;
    }


    // Clear existing rows

    productsTableBody.innerHTML = "";


    // Check whether products exist

    if (products.length === 0) {

        emptyProductsMessage.style.display = "block";

        return;

    }


    // Hide empty message

    emptyProductsMessage.style.display = "none";


    // Create table row for every product

    products.forEach(function (product) {

        // Determine stock status

        let status;

        if (product.quantity === 0) {

            status = `<span class="badge bg-danger"> Out of Stock </span>`;

        } else if (product.quantity <= product.minimumStock) {

            status = ` <span class="badge bg-warning text-dark">    Low Stock       </span>        `;

        } else {

            status = `
            <span class="badge bg-success">
                In Stock
            </span>
        `;

        }


        // Create table row

        const row = document.createElement("tr");


        row.innerHTML = `

        <td>
            <strong>${product.productName}</strong>

            <br>

            <small class="text-muted">
                ${product.brand || ""}
            </small>
        </td>


        <td>
            ${product.sku}
        </td>


        <td>
            ${product.category}
        </td>


        <td>
            ${product.quantity}
        </td>


        <td>
            ₹${product.sellingPrice.toLocaleString("en-IN")}
        </td>


        <td>
            ${status}
        </td>


        <td>

            <button
                class="btn btn-sm btn-outline-primary"
                onclick="editProduct(${product.id})"
            >
                Edit
            </button>


            <button
                class="btn btn-sm btn-outline-danger"
                onclick="deleteProduct(${product.id})"
            >
                Delete
            </button>

        </td>

    `;


        // Add row to table

        productsTableBody.appendChild(row);

    });

}

// ========================================
// LOAD PRODUCTS
// ========================================

if (productsTableBody) {

    const products = getProducts();

    displayProducts(products);

}

// ========================================
// DELETE PRODUCT
// ========================================

function deleteProduct(productId) {

    // Ask for confirmation

    if (!confirm("Are you sure you want to delete this product?")) return;

    let products = getProducts();

    products = products.filter(product => product.id !== productId);

    saveProducts(products);

    displayProducts(products);



    // Refresh product table

    displayProducts(products);


    // Confirmation

    alert("Product deleted successfully!");

}

function editProduct(productId) {

    const products = getProducts();

    const product = products.find(
        product => product.id === productId
    );

    if (!product) {
        alert("Product not found.");
        return;
    }

    const newQuantity = prompt(
        "Enter new quantity:",
        product.quantity
    );

    if (newQuantity === null) {
        return;
    }

    const quantity = Number(newQuantity);

    if (isNaN(quantity) || quantity < 0) {
        alert("Please enter a valid quantity.");
        return;
    }

    product.quantity = quantity;

    saveProducts(products);

    displayProducts(products);

    alert("Product updated successfully!");
}


// search 

const searchProduct = document.getElementById("searchProduct");

if (searchProduct) {

    searchProduct.addEventListener("input", function () {

        const searchText = searchProduct.value
            .toLowerCase()
            .trim();

        const products = getProducts();

        const filteredProducts = products.filter(function (product) {

            return (
                product.productName.toLowerCase().includes(searchText) ||
                product.sku.toLowerCase().includes(searchText) ||
                product.category.toLowerCase().includes(searchText)
            );

        });

        displayProducts(filteredProducts);

    });

}



// ========================================
// DASHBOARD STATISTICS
// ========================================

const totalProductsElement =
    document.getElementById("totalProducts");

const productsInStockElement =
    document.getElementById("productsInStock");

const lowStockProductsElement =
    document.getElementById("lowStockProducts");


if (
    totalProductsElement &&
    productsInStockElement &&
    lowStockProductsElement
) {

    const products = getProducts();


    // Total number of products

    totalProductsElement.textContent =
        products.length;


    // Products currently in stock

    const productsInStock = products.filter(function (product) {

        return product.quantity > 0;

    });


    productsInStockElement.textContent =
        productsInStock.length;


    // Low-stock products

    const lowStockProducts = products.filter(function (product) {

        return (
            product.quantity > 0 &&
            product.quantity <= product.minimumStock
        );

    });


    lowStockProductsElement.textContent =
        lowStockProducts.length;

}

// ========================================
// LOW STOCK ALERT
// ========================================

const lowStockAlert =
    document.getElementById("lowStockAlert");


if (lowStockAlert) {

    const products = getProducts();


    const lowStockProducts =
        products.filter(function (product) {

            return (
                product.quantity > 0 &&
                product.quantity <= product.minimumStock
            );

        });


    if (lowStockProducts.length > 0) {

        lowStockAlert.innerHTML = `

            <div class="alert alert-warning d-flex align-items-center shadow-sm">

                <div>

                    <strong>
                        ⚠ Low Stock Alert
                    </strong>

                    <br>

                    ${lowStockProducts.length}
                    product(s) are running low on stock.

                </div>

            </div>

        `;

    } else {

        lowStockAlert.innerHTML = `

            <div class="alert alert-success shadow-sm">

                <strong>
                    ✓ Inventory Status
                </strong>

                <br>

                All products have sufficient stock.

            </div>

        `;

    }

}


const invoiceProduct =
    document.getElementById("invoiceProduct");

if (invoiceProduct) {

    const products = getProducts();

    products.forEach(function (product) {

        const option = document.createElement("option");

        option.value = product.id;

        option.textContent =
            `${product.productName} - ₹${product.sellingPrice.toLocaleString("en-IN")}`;

        invoiceProduct.appendChild(option);

    });

}




let invoiceItems = [];

const addInvoiceProduct =
    document.getElementById("addInvoiceProduct");

if (addInvoiceProduct) {

    addInvoiceProduct.addEventListener("click", function () {

        const productId =
            Number(
                document.getElementById("invoiceProduct").value
            );

        const quantity =
            Number(
                document.getElementById("invoiceQuantity").value
            );

        if (!productId) {
            alert("Please select a product.");
            return;
        }

        if (!quantity || quantity < 1) {
            alert("Please enter a valid quantity.");
            return;
        }

        const products = getProducts();

        const product = products.find(function (item) {

            return item.id === productId;

        });

        if (!product) {
            alert("Product not found.");
            return;
        }

        if (quantity > product.quantity) {

            alert(
                `Only ${product.quantity} item(s) available in stock.`
            );

            return;
        }

        const existingItem = invoiceItems.find(function (item) {

            return item.productId === productId;

        });

        if (existingItem) {

            if (
                existingItem.quantity + quantity >
                product.quantity
            ) {

                alert(
                    `Only ${product.quantity} item(s) available in stock.`
                );

                return;
            }

            existingItem.quantity += quantity;

        } else {

            invoiceItems.push({

                productId: product.id,

                productName: product.productName,

                price: product.sellingPrice,

                quantity: quantity

            });

        }

        displayInvoiceItems();

    });

}


function displayInvoiceItems() {

    const invoiceItemsContainer =
        document.getElementById("invoiceItems");

    if (!invoiceItemsContainer) {
        return;
    }

    invoiceItemsContainer.innerHTML = "";

    invoiceItems.forEach(function (item, index) {

        const total =
            item.price * item.quantity;

        const row =
            document.createElement("tr");

        row.innerHTML = `

            <td>
                ${item.productName}
            </td>

            <td>
                ₹${item.price.toLocaleString("en-IN")}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ₹${total.toLocaleString("en-IN")}
            </td>

            <td>

                <button
                    class="btn btn-sm btn-outline-danger"
                    onclick="removeInvoiceItem(${index})"
                >
                    Remove
                </button>

            </td>

        `;

        invoiceItemsContainer.appendChild(row);
        calculateInvoiceTotal();


    });

}
function removeInvoiceItem(index) {

    invoiceItems.splice(index, 1);

    displayInvoiceItems();

}






function calculateInvoiceTotal() {

    const subtotalElement =
        document.getElementById("invoiceSubtotal");

    const taxElement =
        document.getElementById("invoiceTax");

    const totalElement =
        document.getElementById("invoiceTotal");

    if (
        !subtotalElement ||
        !taxElement ||
        !totalElement
    ) {
        return;
    }

    let subtotal = 0;

    invoiceItems.forEach(function (item) {

        subtotal +=
            item.price * item.quantity;

    });

    const tax =
        subtotal * 0.18;

    const grandTotal =
        subtotal + tax;


    subtotalElement.textContent =
        `₹${subtotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

    taxElement.textContent =
        `₹${tax.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

    totalElement.textContent =
        `₹${grandTotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}`;

}


