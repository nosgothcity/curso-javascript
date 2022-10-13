const products = []
const apiProducts = []
let userData
const aditionalDiscountByBrand = ['samsung', 'lg', 'sony', 'trotter', 'philips']
let form
let login

let loginUser
let listProducts
let showUser

let productSku
let productName
let productBrand
let productPrice
let productDiscount
let showErrorSku
let hasDiscount = false
let productsContainer

let modalAddProduct
let btnShowAddProduct
let btnCloseAddProduct
let modal

const trashIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
</svg>`

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

const initElements = () => {
    console.log("Inicialianzado elementos")
    loginUser = document.getElementById("init-user")
    listProducts = document.getElementById("show-products")
    showUser = document.getElementById("show-user")
    form = document.getElementById("product-from")
    login = document.getElementById("login-form")
    showErrorSku = document.getElementById("error-message-sku")
    user = document.getElementById("user")
    productSku = document.getElementById("product-sku")
    productName = document.getElementById("product-name")
    productBrand = document.getElementById("product-brand")
    productPrice = document.getElementById("product-price")
    productDiscount = document.getElementById("product-discount")
    productsContainer = document.getElementById("products-container")
    btnShowAddProduct = document.getElementById("btn-modal-add-product")
    btnCloseAddProduct = document.getElementsByClassName("btn-close-modal-add-product")
    modalAddProduct = document.getElementById("modal-add-product")
    modal = new bootstrap.Modal(modalAddProduct)
}

const initEvents = () => {
    form.onsubmit = (event) => dataValidate(event)
    login.onsubmit = (event) => userLogin(event)
    btnShowAddProduct.onclick = showModalAddProduct
    for (const boton of btnCloseAddProduct) {
        boton.onclick = closeModalAddProduct
    }
}

const dataValidate = event => {
    event.preventDefault()
    showErrorSku.hidden = true
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
        storageProductsByUser()
        showProducts()
        Swal.fire(
            'Producto Agregado',
            '',
            'success'
        ).then((result) => {
            closeModalAddProduct()
        })
    } else {
        showErrorSku.hidden = false
    }
  
}

const deleteProduct = productSku => {
    Swal.fire({
        icon: "question",
        title: "¿Esta seguro que quiere eliminar el producto?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            let elementToDelete = document.getElementById(`tr-${productSku}`)
            let deleteProductFromArray = products.findIndex(product => product.sku === productSku)
            products.splice(deleteProductFromArray, 1)
            storageProductsByUser()
            elementToDelete.remove()        
        }
    })    
}

const showProducts = () => {
    productsContainer.innerHTML = ""
    for (const product of products) {
        console.log("show product", product)
        let specialDiscount = 'No'
        if(product.hasSpecialDiscount){
            specialDiscount = 'Si'
        }

        const column = document.createElement("tr")
        column.id = `tr-${product.sku}`
        column.innerHTML = `
            <td>${product.sku}</td>
            <td>${product.name}</td>
            <td>${product.brand}</td>
            <td>${product.price}</td>
            <td>${product.discount}%</td>
            <td>${specialDiscount}</td>
            <td>${product.finalPrice}</td>
            <td><button class="btn btn-danger" id="product-${product.sku}" >${trashIcon}</button></td>
        `

        productsContainer.append(column)
        const deleteButton = document.getElementById(`product-${product.sku}`)
        deleteButton.onclick = () => deleteProduct(product.sku)    
    }
}

const userLogin = async event => {
    console.log('realizando login....')
    event.preventDefault()
    userData = user.value
    sessionStorage.setItem("user", userData)

    let savedUser = localStorage.getItem(`products-${userData}`)
    if(savedUser){
        products.push(...(JSON.parse(savedUser)))
        console.log("EXISTEN PRODUCTOS DEL USUARIO", products)
    } else {
        console.log("NUEVO USUARIO: AGREGANDO PRODUCTOS EN ARCHIVO JSON POR MEDIO DE FETCH")
        await getProductsWithApi()
        localStorage.setItem(`products-${userData}`, products)
    }

    showProducts()
    loginUser.hidden = true
    listProducts.hidden = false
    showUser.hidden = false
    showUser.innerHTML += ` ${userData}`
    console.log("USUARIO GUARDADO:",sessionStorage.getItem("user"))
}

const getProductsWithApi = async () => {
    try{
        const response = await fetch("https://63475439db76843976a9fc24.mockapi.io/api/v1/products/productos/")
        const data = await response.json()
        console.log('PRODUCTS FROM API', data)
        products.push(... data)
    } catch (error) {
        console.log(error)
    }
}

const newProductWithApi = async () => {
    let productoRandom = {
        sku: "1234qwer121312",
        name: "galaxy font4",
        brand: "samsung",
        price: 123123,
        discount: 10,
        hasSpecialDiscount: true,
        finalPrice: 105270,
        date: "2022-10-12T23:58:24.076Z",
    }

    try{
        const response = await fetch("https://63475439db76843976a9fc24.mockapi.io/api/v1/products/productos/", {
            method: 'POST',
            body: JSON.stringify(productoRandom),
        })
    } catch (error) {
        console.log(error)  
    }
}

const deleteProductWithApi = async product => {
    try{
        const response = await fetch("https://63475439db76843976a9fc24.mockapi.io/api/v1/products/productos/", {
            method: 'DELETE',
        })
    } catch (error) {
        console.log(error)  
    }
}

const storageProductsByUser = () => {
    let productsToJSON = JSON.stringify(products)
    console.log("products:", productsToJSON)
    localStorage.setItem(`products-${userData}`, productsToJSON)
}

const showModalAddProduct = () => {
    if (userData) {
        modal.show()
    }
}

const closeModalAddProduct = () => {
    modal.hide()
}

const main = () => {
    initElements()
    initEvents()
}

main()
