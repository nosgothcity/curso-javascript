const PRIMER_NUMERO = parseInt(prompt('Ingrese un número entero'))
const SEGUNDO_NUMERO = parseInt(prompt('Ingrese otro número entero'))

const checkOperationType = () => {
    let flag = true;
    let operacion = ''
    while(flag){
        const TIPO_OPERACION = prompt('Ingrese tipo de operación que desea realizar con los números ingresados (+, -, *, /)').trim()
        if(TIPO_OPERACION === '+' || TIPO_OPERACION === '-' || TIPO_OPERACION === '*' || TIPO_OPERACION === '/'){
            operacion = TIPO_OPERACION
            flag = false
        } else {
            alert('Ingrese una operación válida a realizar (+, -, *, /).')
        }
    }
    return operacion
};

const resolveOperation = (PRIMER_NUMERO, SEGUNDO_NUMERO, OPERACION) => {
    let resultado = 0
    switch (OPERACION) {
        case '+':
            resultado = PRIMER_NUMERO + SEGUNDO_NUMERO
            break;
        case '-':
            resultado = PRIMER_NUMERO - SEGUNDO_NUMERO
            break;
        case '*':
            resultado = PRIMER_NUMERO * SEGUNDO_NUMERO
            break;
        case '/':
            resultado = PRIMER_NUMERO / SEGUNDO_NUMERO
            break;
        default:
            break;
    }

    return resultado;
};

const OPERACION = checkOperationType()
const RESULTADO_OPERACION = resolveOperation(PRIMER_NUMERO, SEGUNDO_NUMERO, OPERACION)

alert('El resultado de ' + PRIMER_NUMERO + OPERACION + SEGUNDO_NUMERO + ' es: ' + RESULTADO_OPERACION)
