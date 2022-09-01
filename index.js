const NUMERO_A_MULTIPLICAR = parseInt(prompt('Ingrese un número entero para multiplicar'))
const LIMITE = parseInt(prompt('Ingrese un multiplicador que será el limite'))
let multiplicador = 1;

console.log('El número a multiplicar es:' + NUMERO_A_MULTIPLICAR + ' y su multiplicador limite es el: ' + LIMITE)

while(true){
    const RESULTADO = NUMERO_A_MULTIPLICAR * multiplicador
    console.log(RESULTADO)
    multiplicador++
    if(multiplicador > LIMITE){
        break;
    }
}
