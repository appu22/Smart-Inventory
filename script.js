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

    location.reload();
    // displayProducts(products);

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

const totalSalesElement =
    document.getElementById("totalSales");



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


    lowStockProductsElement.textContent = lowStockProducts.length;

    if (totalSalesElement) {

        const invoices = JSON.parse(localStorage.getItem("smartInventoryInvoices") || "[]");

        let totalSales = 0;

        invoices.forEach(function (invoice) {
            totalSales += invoice.grandTotal;
        });

        totalSalesElement.textContent =
            `₹${totalSales.toLocaleString("en-IN", {
                minimumFractionDigits: 2
            })}`;
    }


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
let currentInvoiceSaved = false;

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




const generateInvoice =
    document.getElementById("generateInvoice");

if (generateInvoice) {

    generateInvoice.addEventListener("click", function () {

        const customerName =
            document.getElementById("customerName").value.trim();

        const customerPhone =
            document.getElementById("customerPhone").value.trim();

        const customerEmail =
            document.getElementById("customerEmail").value.trim();

        const customerAddress =
            document.getElementById("customerAddress").value.trim();

        const invoicePreview =
            document.getElementById("invoicePreview");


        if (!customerName) {
            alert("Please enter customer name.");
            return;
        }


        if (invoiceItems.length === 0) {
            alert("Please add at least one product.");
            return;
        }


        let subtotal = 0;

        invoiceItems.forEach(function (item) {

            subtotal += item.price * item.quantity;

        });


        const tax = subtotal * 0.18;

        const grandTotal = subtotal + tax;


        const invoiceNumber =
            "INV-" + Date.now();

        const invoiceDate =
            new Date().toLocaleDateString("en-IN");


        let itemsHTML = "";


        invoiceItems.forEach(function (item) {

            const itemTotal =
                item.price * item.quantity;

            itemsHTML += `

                <tr>

                    <td>${item.productName}</td>

                    <td>
                        ₹${item.price.toLocaleString("en-IN")}
                    </td>

                    <td>${item.quantity}</td>

                    <td>
                        ₹${itemTotal.toLocaleString("en-IN")}
                    </td>

                </tr>

            `;

        });


        invoicePreview.innerHTML = `
            
            <div class="card shadow-sm">

                <div class="card-body p-5">

                    <div class="row mb-4">

                        <div class="col-md-6">

                            <h2 class="fw-bold">
                                INVOICE
                            </h2>

                            <p class="text-muted mb-0">
                                ${invoiceNumber}
                            </p>

                            <p class="text-muted">
                                Date: ${invoiceDate}
                            </p>

                        </div>


                        <div class="col-md-6 text-md-end">

                            <h4 class="fw-bold">
                                Smart Inventory
                            </h4>

                            <p class="text-muted">
                                Inventory & Invoice Management
                            </p>

                        </div>

                    </div>


                    <hr>


                    <div class="my-4">

                        <h6 class="fw-bold">
                            BILL TO
                        </h6>

                        <p class="mb-1">
                            ${customerName}
                        </p>

                        <p class="mb-1">
                            ${customerPhone}
                        </p>

                        <p class="mb-1">
                            ${customerEmail}
                        </p>

                        <p>
                            ${customerAddress}
                        </p>

                    </div>


                    <div class="table-responsive">

                        <table class="table">

                            <thead class="table-dark">

                                <tr>

                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>

                                </tr>

                            </thead>

                            <tbody>

                                ${itemsHTML}

                            </tbody>

                        </table>

                    </div>


                    <div class="row justify-content-end">

                        <div class="col-md-5">

                            <div class="d-flex justify-content-between">

                                <span>Subtotal</span>

                                <strong>
                                    ₹${subtotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}
                                </strong>

                            </div>


                            <div class="d-flex justify-content-between">

                                <span>GST (18%)</span>

                                <strong>
                                    ₹${tax.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}
                                </strong>

                            </div>


                            <hr>


                            <div class="d-flex justify-content-between">

                                <span class="fw-bold">
                                    Grand Total
                                </span>

                                <strong class="fs-5">
                                    ₹${grandTotal.toLocaleString("en-IN", {
            minimumFractionDigits: 2
        })}
                                </strong>

                            </div>

                        </div>

                    </div>


                    <div class="text-center mt-5">

                        <p class="text-muted mb-0">
                            Thank you for your business!
                        </p>

                    </div>

                </div>

            </div>

        `;

    });

}



function downloadInvoicePDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const customerName =
        document.getElementById("customerName").value.trim();

    const invoiceNumber =
        "INV-" + Date.now();

    const invoiceDate =
        new Date().toLocaleDateString("en-IN");

    let subtotal = 0;

    invoiceItems.forEach(function (item) {

        subtotal += item.price * item.quantity;

    });

    const tax = subtotal * 0.18;

    const grandTotal = subtotal + tax;


    doc.setFontSize(22);

    doc.text("SMART INVENTORY", 20, 25);

    doc.setFontSize(18);

    doc.text("INVOICE", 150, 25);


    doc.setFontSize(11);

    doc.text(`Invoice: ${invoiceNumber}`, 20, 40);

    doc.text(`Date: ${invoiceDate}`, 20, 48);

    doc.text(`Customer: ${customerName}`, 20, 60);


    let y = 80;

    doc.setFontSize(11);

    doc.text("Product", 20, y);

    doc.text("Qty", 110, y);

    doc.text("Price", 135, y);

    doc.text("Total", 170, y);


    y += 10;


    invoiceItems.forEach(function (item) {

        const itemTotal =
            item.price * item.quantity;

        doc.text(item.productName, 20, y);

        doc.text(String(item.quantity), 110, y);

        doc.text(
            `₹${item.price}`,
            135,
            y
        );

        doc.text(
            `₹${itemTotal}`,
            170,
            y
        );

        y += 10;

    });


    y += 10;

    doc.text(
        `Subtotal: ₹${subtotal.toFixed(2)}`,
        130,
        y
    );

    y += 10;

    doc.text(
        `GST (18%): ₹${tax.toFixed(2)}`,
        130,
        y
    );

    y += 12;

    doc.setFontSize(13);

    doc.text(
        `Grand Total: ₹${grandTotal.toFixed(2)}`,
        130,
        y
    );


    y += 25;

    doc.setFontSize(10);

    doc.text(
        "Thank you for your business!",
        20,
        y
    );


    // //24 step 
    // saveInvoice();
    // doc.save(`${invoiceNumber}.pdf`);
    // //23 step 
    // reduceInventoryStock();

    // step 30

    if (!currentInvoiceSaved) {
        saveInvoice();
        reduceInventoryStock();

        currentInvoiceSaved = true;
    }
    doc.save(`${invoiceNumber}.pdf`);



}




// Step 23️⃣: Update Stock After Invoice
function reduceInventoryStock() {

    const products = getProducts();

    invoiceItems.forEach(function (item) {

        const product = products.find(function (product) {

            return product.id === item.productId;

        });

        if (product) {

            product.quantity -= item.quantity;

            if (product.quantity < 0) {
                product.quantity = 0;
            }

        }

    });

    saveProducts(products);

}


//Step 24️⃣: Invoice History
function saveInvoice() {

    const invoices =
        JSON.parse(
            localStorage.getItem("smartInventoryInvoices") || "[]"
        );

    let subtotal = 0;

    invoiceItems.forEach(function (item) {

        subtotal += item.price * item.quantity;

    });

    const tax = subtotal * 0.18;

    const grandTotal = subtotal + tax;

    const invoice = {

        id: Date.now(),

        invoiceNumber: "INV-" + Date.now(),

        date: new Date().toISOString(),

        customerName:
            document.getElementById("customerName").value.trim(),

        customerPhone:
            document.getElementById("customerPhone").value.trim(),

        customerEmail:
            document.getElementById("customerEmail").value.trim(),

        customerAddress:
            document.getElementById("customerAddress").value.trim(),

        items: invoiceItems,

        subtotal: subtotal,

        tax: tax,

        grandTotal: grandTotal

    };

    invoices.push(invoice);

    localStorage.setItem(
        "smartInventoryInvoices",
        JSON.stringify(invoices)
    );

}




// Then add this to the bottom of script.js
// step 25

// const invoiceHistoryTable = document.getElementById("invoiceHistoryTable");

// if (invoiceHistoryTable) {

//     const invoices =
//         JSON.parse(
//             localStorage.getItem("smartInventoryInvoices") || "[]"
//         );

//     const noInvoicesMessage =
//         document.getElementById("noInvoicesMessage");


//     if (invoices.length === 0) {

//         noInvoicesMessage.style.display = "block";

//     } else {

//         noInvoicesMessage.style.display = "none";


//         invoices.reverse().forEach(function (invoice) {

//             const row =
//                 document.createElement("tr");


//             const date =
//                 new Date(invoice.date)
//                     .toLocaleDateString("en-IN");


//             row.innerHTML = `

//                 <td>
//                     <strong>
//                         ${invoice.invoiceNumber}
//                     </strong>
//                 </td>

//                 <td>
//                     ${date}
//                 </td>

//                 <td>
//                     ${invoice.customerName}
//                 </td>

//                 <td>
//                     ${invoice.items.length}
//                 </td>

//                 <td>
//                     ₹${invoice.grandTotal.toLocaleString("en-IN", {
//                         minimumFractionDigits: 2
//                     })}
//                 </td>

//                 <td>

//                 <button
//                     class="btn btn-sm btn-outline-primary"
//                     onclick="viewInvoice(${invoice.id})"
//                 >
//                     View
//                 </button>

//                 <button
//                     class="btn btn-sm btn-outline-danger"
//                     onclick="deleteInvoice(${invoice.id})"
//                 >
//                     Delete
//                 </button>

// </td>



//             `;


//             invoiceHistoryTable.appendChild(row);

//         });

//     }

// }

// step 27 Step 27️⃣: Improve Invoice History
const invoiceHistoryTable = document.getElementById("invoiceHistoryTable");

const invoiceSearch = document.getElementById("invoiceSearch");


if (invoiceHistoryTable) {

    function displayInvoiceHistory(invoices) {

        invoiceHistoryTable.innerHTML = "";

        const noInvoicesMessage =
            document.getElementById("noInvoicesMessage");


        if (invoices.length === 0) {

            noInvoicesMessage.style.display = "block";

            return;

        }


        noInvoicesMessage.style.display = "none";


        invoices.forEach(function (invoice) {

            const row =
                document.createElement("tr");


            const date =
                new Date(invoice.date)
                    .toLocaleDateString("en-IN");


            row.innerHTML = `

                <td>
                    <strong>
                        ${invoice.invoiceNumber}
                    </strong>
                </td>

                <td>
                    ${date}
                </td>

                <td>
                    ${invoice.customerName}
                </td>

                <td>
                    ${invoice.items.length}
                </td>

                <td>
                    ₹${invoice.grandTotal.toLocaleString("en-IN", {
                minimumFractionDigits: 2
            })}
                </td>

                <td>

                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="viewInvoice(${invoice.id})"
                    >
                        View
                    </button>

                    <button
                        class="btn btn-sm btn-outline-danger"
                        onclick="deleteInvoice(${invoice.id})"
                    >
                        Delete
                    </button>

                </td>

            `;


            invoiceHistoryTable.appendChild(row);

        });

    }


    const invoices =
        JSON.parse(
            localStorage.getItem("smartInventoryInvoices") || "[]"
        );


    displayInvoiceHistory([...invoices].reverse());


    if (invoiceSearch) {

        invoiceSearch.addEventListener("input", function () {

            const searchText =
                invoiceSearch.value.toLowerCase().trim();


            const filteredInvoices =
                invoices.filter(function (invoice) {

                    return (
                        invoice.invoiceNumber
                            .toLowerCase()
                            .includes(searchText) ||

                        invoice.customerName
                            .toLowerCase()
                            .includes(searchText)
                    );

                });


            displayInvoiceHistory(
                [...filteredInvoices].reverse()
            );

        });

    }

}


// Step 26️⃣: Add Invoice Actions
// function viewInvoice(invoiceId) {

//     const invoices =
//         JSON.parse(
//             localStorage.getItem("smartInventoryInvoices") || "[]"
//         );

//     const invoice = invoices.find(function (item) {

//         return item.id === invoiceId;

//     });

//     if (!invoice) {

//         alert("Invoice not found.");

//         return;

//     }

//     alert(
//         `Invoice: ${invoice.invoiceNumber}\n` +
//         `Customer: ${invoice.customerName}\n` +
//         `Total: ₹${invoice.grandTotal.toFixed(2)}`
//     );

// }


// Step 28️⃣: Proper Invoice Details Page
function viewInvoice(invoiceId) {

    window.location.href =
        `invoice-details.html?id=${invoiceId}`;

}



function deleteInvoice(invoiceId) {

    const confirmDelete =
        confirm("Are you sure you want to delete this invoice?");

    if (!confirmDelete) {
        return;
    }

    let invoices =
        JSON.parse(
            localStorage.getItem("smartInventoryInvoices") || "[]"
        );

    invoices = invoices.filter(function (invoice) {

        return invoice.id !== invoiceId;

    });

    localStorage.setItem(
        "smartInventoryInvoices",
        JSON.stringify(invoices)
    );

    location.reload();

}


// Step 28️⃣: Proper Invoice Details Page

const invoiceDetails =
    document.getElementById("invoiceDetails");

if (invoiceDetails) {

    const params =
        new URLSearchParams(window.location.search);

    const invoiceId =
        Number(params.get("id"));

    const invoices =
        JSON.parse(
            localStorage.getItem("smartInventoryInvoices") || "[]"
        );

    const invoice =
        invoices.find(function (item) {

            return item.id === invoiceId;

        });


    if (!invoice) {

        invoiceDetails.innerHTML = `

            <div class="alert alert-danger">
                Invoice not found.
            </div>

        `;

    } else {

        // 29 step 
        const downloadDetailsPDF =
            document.getElementById("downloadDetailsPDF");

        if (downloadDetailsPDF) {
            downloadDetailsPDF.style.display = "inline-block";

            downloadDetailsPDF.addEventListener(
                "click",
                downloadInvoiceDetailsPDF
            );
        }

        let itemsHTML = "";

        invoice.items.forEach(function (item) {

            const total =
                item.price * item.quantity;

            itemsHTML += `

                <tr>

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

                </tr>

            `;

        });


        const date =
            new Date(invoice.date)
                .toLocaleDateString("en-IN");


        invoiceDetails.innerHTML = `

            <div class="card shadow-sm">

                <div class="card-body p-5">

                    <div class="row mb-4">

                        <div class="col-md-6">

                            <h2 class="fw-bold">
                                INVOICE
                            </h2>

                            <p class="text-muted">
                                ${invoice.invoiceNumber}
                            </p>

                        </div>


                        <div class="col-md-6 text-md-end">

                            <h4 class="fw-bold">
                                Smart Inventory
                            </h4>

                            <p>
                                Date: ${date}
                            </p>

                        </div>

                    </div>


                    <hr>


                    <div class="mb-4">

                        <h6 class="fw-bold">
                            BILL TO
                        </h6>

                        <p class="mb-1">
                            ${invoice.customerName}
                        </p>

                        <p class="mb-1">
                            ${invoice.customerPhone || ""}
                        </p>

                        <p class="mb-1">
                            ${invoice.customerEmail || ""}
                        </p>

                        <p>
                            ${invoice.customerAddress || ""}
                        </p>

                    </div>


                    <div class="table-responsive">

                        <table class="table">

                            <thead class="table-dark">

                                <tr>

                                    <th>Product</th>
                                    <th>Price</th>
                                    <th>Qty</th>
                                    <th>Total</th>

                                </tr>

                            </thead>

                            <tbody>

                                ${itemsHTML}

                            </tbody>

                        </table>

                    </div>


                    <div class="row justify-content-end">

                        <div class="col-md-5">

                            <div class="d-flex justify-content-between">

                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹${invoice.subtotal.toFixed(2)}
                                </strong>

                            </div>


                            <div class="d-flex justify-content-between">

                                <span>
                                    GST (18%)
                                </span>

                                <strong>
                                    ₹${invoice.tax.toFixed(2)}
                                </strong>

                            </div>


                            <hr>


                            <div class="d-flex justify-content-between">

                                <span class="fw-bold">
                                    Grand Total
                                </span>

                                <strong class="fs-5">
                                    ₹${invoice.grandTotal.toFixed(2)}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        `;

    }

}


// Step 29.3: Add the PDF function
function downloadInvoiceDetailsPDF() {

    const params =
        new URLSearchParams(window.location.search);

    const invoiceId =
        Number(params.get("id"));

    const invoices =
        JSON.parse(
            localStorage.getItem("smartInventoryInvoices") || "[]"
        );

    const invoice =
        invoices.find(function (item) {
            return item.id === invoiceId;
        });

    if (!invoice) {
        alert("Invoice not found.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const date =
        new Date(invoice.date)
            .toLocaleDateString("en-IN");

    doc.setFontSize(22);
    doc.text("Smart Inventory", 20, 20);

    doc.setFontSize(18);
    doc.text("INVOICE", 150, 20);

    doc.setFontSize(11);

    doc.text(
        `Invoice: ${invoice.invoiceNumber}`,
        20,
        32
    );

    doc.text(
        `Date: ${date}`,
        20,
        40
    );

    doc.text(
        `Customer: ${invoice.customerName}`,
        20,
        55
    );

    if (invoice.customerPhone) {
        doc.text(
            `Phone: ${invoice.customerPhone}`,
            20,
            63
        );
    }

    let y = 80;

    doc.setFontSize(11);

    doc.text("Product", 20, y);
    doc.text("Qty", 110, y);
    doc.text("Price", 135, y);
    doc.text("Total", 170, y);

    y += 10;

    invoice.items.forEach(function (item) {

        const total =
            item.price * item.quantity;

        doc.text(
            item.productName,
            20,
            y
        );

        doc.text(
            String(item.quantity),
            110,
            y
        );

        doc.text(
            `₹${item.price.toFixed(2)}`,
            135,
            y
        );

        doc.text(
            `₹${total.toFixed(2)}`,
            170,
            y
        );

        y += 10;
    });

    y += 10;

    doc.text(
        `Subtotal: ₹${invoice.subtotal.toFixed(2)}`,
        130,
        y
    );

    y += 8;

    doc.text(
        `GST (18%): ₹${invoice.tax.toFixed(2)}`,
        130,
        y
    );

    y += 10;

    doc.setFontSize(13);

    doc.text(
        `Grand Total: ₹${invoice.grandTotal.toFixed(2)}`,
        130,
        y
    );

    y += 20;

    doc.setFontSize(10);

    doc.text(
        "Thank you for your business!",
        20,
        y
    );

    doc.save(
        `${invoice.invoiceNumber}.pdf`
    );
}

// Step 31: Make Dashboard "Recent Products" Dynamic
const recentProductsTableBody =
    document.getElementById("recentProductsTableBody");

if (recentProductsTableBody) {

    const products = getProducts();

    const recentProducts =
        [...products].reverse().slice(0, 5);

    recentProducts.forEach(function (product) {

        let status;

        if (product.quantity === 0) {
            status =
                `<span class="badge bg-danger">Out of Stock</span>`;
        } else if (product.quantity <= product.minimumStock) {
            status =
                `<span class="badge bg-warning text-dark">Low Stock</span>`;
        } else {
            status =
                `<span class="badge bg-success">In Stock</span>`;
        }

        const row =
            document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${product.productName}</strong>
                <br>
                <small class="text-muted">
                    ${product.brand || ""}
                </small>
            </td>

            <td>${product.sku}</td>

            <td>${product.category}</td>

            <td>${product.quantity}</td>

            <td>
                ₹${product.sellingPrice.toLocaleString("en-IN")}
            </td>

            <td>${status}</td>
        `;

        recentProductsTableBody.appendChild(row);
    });
}



// Step 34: Show Products in Inventory
const inventoryTableBody =
    document.getElementById("inventoryTableBody");

if (inventoryTableBody) {

    const products = getProducts();

    const emptyInventoryMessage =
        document.getElementById("emptyInventoryMessage");

    if (products.length === 0) {

        emptyInventoryMessage.style.display = "block";

    } else {

        emptyInventoryMessage.style.display = "none";

        products.forEach(function (product) {

            let status;

            if (product.quantity === 0) {

                status =
                    `<span class="badge bg-danger">Out of Stock</span>`;

            } else if (product.quantity <= product.minimumStock) {

                status =
                    `<span class="badge bg-warning text-dark">Low Stock</span>`;

            } else {

                status =
                    `<span class="badge bg-success">In Stock</span>`;
            }

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${product.productName}</strong>
                    <br>
                    <small class="text-muted">
                        ${product.brand || ""}
                    </small>
                </td>

                <td>${product.sku}</td>

                <td>${product.category}</td>

                <td>
                    <strong>${product.quantity}</strong>
                </td>

                <td>${product.minimumStock}</td>

                <td>${status}</td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="editProduct(${product.id})"
                    >
                        Update
                    </button>
                </td>
            `;

            inventoryTableBody.appendChild(row);
        });
    }
}



// Perfect. Step 35.1 done ✅

// Step 35.2: Make Inventory Search Work

const inventorySearch =
    document.getElementById("inventorySearch");

if (inventorySearch) {

    inventorySearch.addEventListener("input", function () {

        const searchText =
            inventorySearch.value.toLowerCase().trim();

        const products = getProducts();

        const filteredProducts =
            products.filter(function (product) {

                return (
                    product.productName
                        .toLowerCase()
                        .includes(searchText) ||

                    product.sku
                        .toLowerCase()
                        .includes(searchText) ||

                    product.category
                        .toLowerCase()
                        .includes(searchText)
                );
            });

        inventoryTableBody.innerHTML = "";

        filteredProducts.forEach(function (product) {

            let status;

            if (product.quantity === 0) {
                status =
                    `<span class="badge bg-danger">Out of Stock</span>`;

            } else if (product.quantity <= product.minimumStock) {
                status =
                    `<span class="badge bg-warning text-dark">Low Stock</span>`;

            } else {
                status =
                    `<span class="badge bg-success">In Stock</span>`;
            }

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${product.productName}</strong>
                    <br>
                    <small class="text-muted">
                        ${product.brand || ""}
                    </small>
                </td>

                <td>${product.sku}</td>

                <td>${product.category}</td>

                <td>
                    <strong>${product.quantity}</strong>
                </td>

                <td>${product.minimumStock}</td>

                <td>${status}</td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary"
                        onclick="editProduct(${product.id})"
                    >
                        Update
                    </button>
                </td>
            `;

            inventoryTableBody.appendChild(row);
        });
    });
}


// Step 36.2: Make the Inventory Cards Dynamic
const inventoryTotalProducts =
    document.getElementById("inventoryTotalProducts");

const inventoryLowStock =
    document.getElementById("inventoryLowStock");

const inventoryOutOfStock =
    document.getElementById("inventoryOutOfStock");

if (
    inventoryTotalProducts &&
    inventoryLowStock &&
    inventoryOutOfStock
) {

    const products = getProducts();

    const lowStockProducts =
        products.filter(function (product) {
            return (
                product.quantity > 0 &&
                product.quantity <= product.minimumStock
            );
        });

    const outOfStockProducts =
        products.filter(function (product) {
            return product.quantity === 0;
        });

    inventoryTotalProducts.textContent =
        products.length;

    inventoryLowStock.textContent =
        lowStockProducts.length;

    inventoryOutOfStock.textContent =
        outOfStockProducts.length;
}

// Step 37.3: Save Customers to localStorage

const customerForm = document.getElementById("customerForm");

if (customerForm) {

    customerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const customerName =
            document.getElementById("customerName")
                .value
                .trim();

        const customerPhone =
            document.getElementById("customerPhone")
                .value
                .trim();

        const customerEmail =
            document.getElementById("customerEmail")
                .value
                .trim();

        const customerAddress =
            document.getElementById("customerAddress")
                .value
                .trim();

        const params =
            new URLSearchParams(window.location.search);

        const customerId =
            Number(params.get("id"));

        const customers =
            JSON.parse(
                localStorage.getItem("smartInventoryCustomers") || "[]"
            );

        if (customerId) {
            // Step 37.11: Actually Update the Customer
            const customer =
                customers.find(function (item) {
                    return item.id === customerId;
                });

            if (!customer) {
                alert("Customer not found.");
                return;
            }

            customer.name = customerName;
            customer.phone = customerPhone;
            customer.email = customerEmail;
            customer.address = customerAddress;

        } else {

            const customer = {
                id: Date.now(),
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                address: customerAddress
            };

            customers.push(customer);
        }

        localStorage.setItem(
            "smartInventoryCustomers",
            JSON.stringify(customers)
        );

        alert("Customer saved successfully!");

        window.location.href = "customers.html";
    });
}

// Step 37.4: Display Saved Customers

const customersTableBody =
    document.getElementById("customersTableBody");

const emptyCustomersMessage =
    document.getElementById("emptyCustomersMessage");

if (customersTableBody) {

    const customers =
        JSON.parse(
            localStorage.getItem("smartInventoryCustomers") || "[]"
        );

    if (customers.length === 0) {

        emptyCustomersMessage.style.display = "block";

    } else {

        emptyCustomersMessage.style.display = "none";

        customers.forEach(function (customer) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${customer.name}</strong>
                </td>

                <td>
                    ${customer.phone || ""}
                </td>

                <td>
                    ${customer.email || ""}
                </td>

                <td>
                    ${customer.address || ""}
                </td>

                <td>
                    <button  class="btn btn-sm btn-outline-primary"  onclick="viewCustomer(${customer.id})">
                        View
                    </button>

                </td>
            `;

            customersTableBody.appendChild(row);
        });
    }
}

// Step 37.5: Customer Search

const customerSearch =
    document.getElementById("customerSearch");

if (customerSearch) {

    customerSearch.addEventListener("input", function () {

        const searchText =
            customerSearch.value.toLowerCase().trim();

        const customers =
            JSON.parse(
                localStorage.getItem("smartInventoryCustomers") || "[]"
            );

        const filteredCustomers =
            customers.filter(function (customer) {

                return (
                    customer.name
                        .toLowerCase()
                        .includes(searchText) ||

                    customer.phone
                        .toLowerCase()
                        .includes(searchText) ||

                    customer.email
                        .toLowerCase()
                        .includes(searchText)
                );
            });

        customersTableBody.innerHTML = "";

        filteredCustomers.forEach(function (customer) {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>
                    <strong>${customer.name}</strong>
                </td>

                <td>
                    ${customer.phone || ""}
                </td>

                <td>
                    ${customer.email || ""}
                </td>

                <td>
                    ${customer.address || ""}
                </td>

                <td>
                    <button
                        class="btn btn-sm btn-outline-primary"
                    >
                        View
                    </button>
                </td>
            `;

            customersTableBody.appendChild(row);
        });
    });
}

// Step 37.6 continued: Make View work
function viewCustomer(customerId) {

    window.location.href =
        `customer-details.html?id=${customerId}`;
}


// Step 37.7: Display Customer Details

const customerDetails =
    document.getElementById("customerDetails");

if (customerDetails) {

    const params =
        new URLSearchParams(window.location.search);

    const customerId =
        Number(params.get("id"));

    const customers =
        JSON.parse(
            localStorage.getItem("smartInventoryCustomers") || "[]"
        );

    const customer =
        customers.find(function (item) {
            return item.id === customerId;
        });

    if (!customer) {

        customerDetails.innerHTML = `
            <div class="alert alert-danger">
                Customer not found.
            </div>
        `;

    } else {

        const deleteCustomerButton = document.getElementById("deleteCustomerButton");

        if (deleteCustomerButton) {

            deleteCustomerButton.style.display = "inline-block";

            deleteCustomerButton.addEventListener(
                "click",
                function () {

                    const confirmDelete =
                        confirm(
                            `Delete customer "${customer.name}"?`
                        );

                    if (!confirmDelete) return;

                    let customers =
                        JSON.parse(
                            localStorage.getItem(
                                "smartInventoryCustomers"
                            ) || "[]"
                        );

                    customers =
                        customers.filter(function (item) {
                            return item.id !== customer.id;
                        });

                    localStorage.setItem(
                        "smartInventoryCustomers",
                        JSON.stringify(customers)
                    );

                    alert("Customer deleted successfully!");

                    window.location.href =
                        "customers.html";
                }
            );
        }
        const editCustomerButton =
            document.getElementById("editCustomerButton");

        if (editCustomerButton) {

            editCustomerButton.style.display = "inline-block";

            editCustomerButton.addEventListener(
                "click",
                function () {

                    window.location.href =
                        `customer-form.html?id=${customer.id}`;
                }
            );
        }


        customerDetails.innerHTML = `
            <div class="card shadow-sm">

                <div class="card-body p-4">

                    <h3 class="fw-bold mb-4">
                        Customer Details
                    </h3>

                    <div class="mb-3">
                        <h6 class="text-muted">
                            Name
                        </h6>

                        <p class="fs-5">
                            ${customer.name}
                        </p>
                    </div>

                    <div class="mb-3">
                        <h6 class="text-muted">
                            Phone
                        </h6>

                        <p>
                            ${customer.phone || "Not provided"}
                        </p>
                    </div>

                    <div class="mb-3">
                        <h6 class="text-muted">
                            Email
                        </h6>

                        <p>
                            ${customer.email || "Not provided"}
                        </p>
                    </div>

                    <div class="mb-3">
                        <h6 class="text-muted">
                            Address
                        </h6>

                        <p>
                            ${customer.address || "Not provided"}
                        </p>
                    </div>

                </div>

            </div>
        `;
    }
}

// Step 37.10: Load Existing Customer Data for Editing
const customerFormPage =
    document.getElementById("customerForm");

if (customerFormPage) {

    const params =
        new URLSearchParams(window.location.search);

    const customerId =
        Number(params.get("id"));

    if (customerId) {

        const customers =
            JSON.parse(
                localStorage.getItem(
                    "smartInventoryCustomers"
                ) || "[]"
            );

        const customer =
            customers.find(function (item) {
                return item.id === customerId;
            });

        if (customer) {

            document.getElementById("customerName").value =
                customer.name;

            document.getElementById("customerPhone").value =
                customer.phone || "";

            document.getElementById("customerEmail").value =
                customer.email || "";

            document.getElementById("customerAddress").value =
                customer.address || "";
        }
    }
}

// Step 37.12.2: Load Customers into the Dropdown
const invoiceCustomer =
    document.getElementById("invoiceCustomer");

if (invoiceCustomer) {

    const customers =
        JSON.parse(
            localStorage.getItem(
                "smartInventoryCustomers"
            ) || "[]"
        );

    customers.forEach(function (customer) {

        const option =
            document.createElement("option");

        option.value = customer.id;

        option.textContent =
            customer.name;

        invoiceCustomer.appendChild(option);
    });
}

// Step 37.12.3: Auto-Fill Customer Details
if (invoiceCustomer) {

    invoiceCustomer.addEventListener(
        "change",
        function () {

            const customerId =
                Number(invoiceCustomer.value);

            // if (!customerId) {
            //     return;
            // }

            // Step 37.12.4: Make Customer Selection Optional

            if (!customerId) {

                document.getElementById("customerName").value = "";
                document.getElementById("customerPhone").value = "";
                document.getElementById("customerEmail").value = "";
                document.getElementById("customerAddress").value = "";

                return;
            }


            const customers =
                JSON.parse(
                    localStorage.getItem(
                        "smartInventoryCustomers"
                    ) || "[]"
                );

            const customer =
                customers.find(function (item) {
                    return item.id === customerId;
                });

            if (!customer) {
                return;
            }

            document.getElementById("customerName").value =
                customer.name;

            document.getElementById("customerPhone").value =
                customer.phone || "";

            document.getElementById("customerEmail").value =
                customer.email || "";

            document.getElementById("customerAddress").value =
                customer.address || "";
        }
    );
}

