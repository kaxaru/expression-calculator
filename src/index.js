function eval() {
    // Do not use eval!!!
    return;
}

let count = (string) => {
    const addOperator = (expr) => expr.split('+').map(el => substractOperator(el)).reduce((acc, item) => (+acc) + (+item))
    const substractOperator = (expr) => expr.split('—').map(el => multiplyOperator(el)).reduce((acc, item) => +(acc) - item)
    const multiplyOperator = (expr) =>  expr.split('*').map(el => divideOperator(el)).reduce((acc, item) => acc * item)
    const divideOperator = (expr) =>  expr.split('/').reduce((acc, item) => acc / item)
    string = addOperator(string)
    if (!isFinite(string) || isNaN(string)) {
        throw new Error('TypeError: Division by zero.');
    }
    return string
}

let expressionCalculator = (expr, isTrim = false, brackets = []) => {
    expr = (isTrim) ? expr : expr.split(' ').join('')
    expr = (isTrim) ? expr : expr.split('-').join('—') // it's need to change because i want split negative number and operator minus
    brackets = !!brackets.length ? brackets : [...expr].map((el,idx) => {
        return el == '(' || el == ')' ? {[el]: idx} : null
    }).filter(el => el !== null)

    if (!brackets.length) {
        return count(expr)
    } else {
        if (!(brackets.length % 2) && (brackets.filter(el => Object.keys(el) == "(").length == brackets.filter(el => Object.keys(el) == ")").length)) {
            for(let i = 0; i < brackets.length; i++) {
                if (Object.keys(brackets[i]) == ')' && Object.keys(brackets[i - 1]) == '(') {
                    let total = expressionCalculator(expr.slice(brackets[i-1]['('] + 1, brackets[i][')']), true)
                    expr = expr.slice(0, brackets[i-1]['(']) + total + expr.slice(brackets[i][')'] + 1)
                    let startIndexOffset = brackets[i-1]['(']
                    let bracketsLength = brackets[i][')'] - brackets[i - 1]['('] - total.toString().length + 1
                    brackets.map(el => {
                        el["("] === undefined 
                        ? el[")"] >= startIndexOffset ? el[")"] = el[")"] - bracketsLength : el[")"]
                        : el["("] >= startIndexOffset ? el["("] = el["("] - bracketsLength : el["("]
                    })
                    let before = brackets.slice(0, i - 1)
                    let after = brackets.slice(i + 1)
                    brackets = [...before, ...after]
                    i--
                }
            }
        expr = expressionCalculator(expr, true, brackets)
        } else {
            throw new Error("ExpressionError: Brackets must be paired");
        }
    }

    return expr
}


module.exports = {
    expressionCalculator
}