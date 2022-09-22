const products = []
const aditionalDiscountByBrand = ['samsung', 'lg', 'sony', 'trotter', 'philips']
let form
let productSku
let productName
let productBrand
let productPrice
let productDiscount
let hasDiscount = false
let productsContainer

class Product {
    constructor (productSku, productName, productBrand, productPrice, discount, hasSpecialDiscount = false) {
        this.name = productName
        this.brand = productBrand
        this.sku = productSku
        this.price = productPrice
        this.discount = discount
        this.hasSpecialDiscount = hasSpecialDiscount
        this.finalPrice = productPrice
        this.date = new Date()    
    }

    calculateFinalPrice = () => {
        if(this.discount > 0){
            let discountPrice = (this.price * this.discount) / 100
            this.finalPrice = this.price - discountPrice
        }

        const DISCOUNT_CHECKER = aditionalDiscountByBrand.some(brand => brand === this.brand)
        if(DISCOUNT_CHECKER){
            this.hasSpecialDiscount = true
            let aditionalDiscount = (this.finalPrice * 5) / 100
            this.finalPrice = this.finalPrice - aditionalDiscount
        }
    }
}

function initElements() {
    console.log("Inicialianzado elementos")
    form = document.getElementById("product-from")
    productSku = document.getElementById("product-sku")
    productName = document.getElementById("product-name")
    productBrand = document.getElementById("product-brand")
    productPrice = document.getElementById("product-price")
    productDiscount = document.getElementById("product-discount")
    productsContainer = document.getElementById("products-container")
}

function initEvents() {
    form.onsubmit = (event) => dataValidate(event)
}

const dataValidate = event => {
    event.preventDefault()
    let formProductSku = productSku.value.toLowerCase()
    let formProductName = productName.value.toLowerCase()
    let formProductBrand = productBrand.value.toLowerCase()
    let formProductPrice = parseFloat(productPrice.value)
    let formProductDiscount = parseFloat(productDiscount.value)
    const productExist = products.some(product => product.sku === formProductSku)
    if (!productExist) {
        const newProduct = new Product(formProductSku, formProductName, formProductBrand, formProductPrice, formProductDiscount)
        newProduct.calculateFinalPrice()

        products.push(newProduct)
        form.reset()

        showProducts()
    } else {
        alert("El Sku del producto ya existe")
    }
  
}

const deleteProduct = productSku => {
    let elementToDelete = document.getElementById(`column-${productSku}`)
    let deleteProductFromArray = products.findIndex(product => product.sku === productSku)
    products.splice(deleteProductFromArray, 1)
    elementToDelete.remove()
}

const showProducts = () => {
    productsContainer.innerHTML = ""
    for (const product of products) {
        console.log("show product", product)
        let specialDiscount = 'No'
        let discount = '';
        if(product.hasSpecialDiscount){
            specialDiscount = 'Si'
        }
        if(product.discount > 0){
            discount = `<p class="card-text">Descuento: <b>${product.discount}</b></p>`
        }
        const column = document.createElement("div")
        column.className = "col-md-4 mt-3"
        column.id = `column-${product.sku}`
        column.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <p class="card-text">SKU: <b>${product.sku}</b></p>
                    <p class="card-text">Nombre: <b>${product.name}</b></p>
                    <p class="card-text">Marca: <b>${product.brand}</b></p>
                    <p class="card-text">Precio Base: <b>${product.price}</b></p>
                    ${discount}
                    <p class="card-text">¿Tiene descuento especial adicional del 5%?: <b>${specialDiscount}</b></p>
                    <p class="card-text">Precio Final: <b>${product.finalPrice}</b></p>
                </div>
                <div class="card-footer">
                    <button class="btn btn-danger" id="product-${product.sku}" >Eliminar</button>
                </div>
            </div>`

        productsContainer.append(column)
        const deleteButton = document.getElementById(`product-${product.sku}`)
        deleteButton.onclick = () => deleteProduct(product.sku)    
    }
}

const main = () => {
    initElements()
    initEvents()
}

main()
