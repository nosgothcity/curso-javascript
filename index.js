function Product (productName, productBrand, productSku, productPrice, hasDiscount, productDiscount, finalPrice = 0) {
    this.name = productName
    this.brand = productBrand
    this.sku = productSku
    this.price = productPrice
    this.hasDiscount = hasDiscount
    this.discount = productDiscount
    this.finalPrice = finalPrice
}

const aditionalDiscountByBrand = ['samsung', 'lg', 'sony', 'trotter', 'philips']

const requestData = request => {
    let flag = true
    let dataRequest = ''

    while(flag){
        dataRequest = prompt(request.message).trim()

        if((request.type === 'productPrice' || request.type === 'productDiscount') && dataRequest !== "" && !isNaN(dataRequest)){
            dataRequest = parseInt(dataRequest)
            flag = false
        } else if((request.type === 'productName' || request.type === 'productBrand' || request.type === 'productSku') && dataRequest !== "") {
            dataRequest = dataRequest.toLowerCase()
            flag = false
        } else {
            alert('Ingrese un dato valido')
        }
    }

    return dataRequest
}

const calculateFinalPrice = objectProduct => {
    let finalPrice = objectProduct.price
    if(objectProduct.hasDiscount){
        let discountPrice = (objectProduct.price * objectProduct.discount) / 100
        finalPrice = objectProduct.price - discountPrice
    }

    //Verificando si tiene un descuento adicional dependiendo de la marca de un 10% adicional e el precio final...
    const DISCOUNT_CHECKER = aditionalDiscountByBrand.filter(brand => brand === objectProduct.brand)
    if(DISCOUNT_CHECKER.length > 0){
        console.log("El Producto tiene un 10% de descuento ADICIONAL por la marca.")
        // Se simplifica la obtencion del 10% de descuento para el precio final del producto dividiendo por 10...
        let aditionalDiscount = finalPrice / 10
        finalPrice = finalPrice - aditionalDiscount
    }

    return finalPrice;

}

const main = () => {
    alert("Ingrese los datos de un producto: Nombre, Marca, Id/SKU, Precio y Descuento.\nLas siguientes marcas tienen un descuento adicional del 10% para sus productos: Samsung, LG, Sony, Trotter y Philips.")
    let productName = prompt('Ingrese el nombre del producto...').trim().toLowerCase()
    let productBrand = prompt('Ingrese la marca del producto').trim().toLowerCase()
    let productSku = prompt('Ingrese el Id/SKU del producto').trim().toLowerCase()
    let productPrice = parseInt(prompt('Ingrese el precio base del producto'))
    let productDiscount = parseInt(prompt('El producto tendrá descuento?. Si lo tendrá, ingrese el % de descuento (número entre 0 a 90)'))
    let hasDiscount = false

    if(productName === ''){
        productName = requestData({type: "productName", message:"Ingrese el nombre del producto..."})
    } else if (productBrand === '') {
        productBrand = requestData({type: "productBrand", message:"Ingrese la marca del producto..."})
    } else if (productSku === '') {
        productSku = requestData({type: "productSku", message:"Ingrese el Id/SKU del producto..."})
    } else if (productPrice === '' || isNaN(productPrice)) {
        productPrice = requestData({type: "productPrice", message:"Ingrese el precio base del producto..."})
    } else if (productDiscount === '' || productDiscount === NaN || productDiscount < 0 || productDiscount > 90) {
        productDiscount = requestData({type: "productDiscount", message:"El producto tendrá descuento?. Si lo tendrá, ingrese el % de descuento (número entre 0 a 90)..."})
    }
    
    if(productDiscount > 0 && productDiscount <= 90){
        hasDiscount = true
    }

    const objectProduct = new Product(productName, productBrand, productSku, productPrice, hasDiscount, productDiscount)
    objectProduct.finalPrice = calculateFinalPrice(objectProduct);

    return objectProduct
}

const RESULT = main()

console.log(RESULT)
console.log("El producto " + RESULT.name + " con marca " + RESULT.brand + " tiene el precio final de: " + RESULT.finalPrice)
