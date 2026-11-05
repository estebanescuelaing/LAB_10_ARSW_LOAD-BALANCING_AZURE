
var bigInt = require("big-integer");

// Caché en memoria del proceso donde se ejecuta la función.
const memo = new Map([
    [0, bigInt.zero],
    [1, bigInt.one]
]);

// Fibonacci recursivo con memoization.
function fibonacci(n) {

    // Si el resultado ya existe, se reutiliza.
    if (memo.has(n)) {
        return memo.get(n);
    }

    // Si no existe, se calcula recursivamente.
    const result = fibonacci(n - 1).add(fibonacci(n - 2));

    // Se guarda el resultado para futuras llamadas.
    memo.set(n, result);

    return result;
}

module.exports = async function (context, req) {

    context.log("Fibonacci recursivo con memoization ejecutado.");

    const nth = req.body && req.body.nth;

    if (!Number.isSafeInteger(nth) || nth < 0) {
        context.res = {
            status: 400,
            body: "El parámetro nth debe ser un entero no negativo."
        };
        return;
    }

    try {
        const start = Date.now();

        const answer = fibonacci(nth);

        const elapsed = Date.now() - start;

        context.log(`nth: ${nth}`);
        context.log(`Tiempo de cálculo: ${elapsed} ms`);
        context.log(`Elementos almacenados en caché: ${memo.size}`);

        context.res = {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            },
            body: {
                nth: nth,
                result: answer.toString(),
                executionTimeMs: elapsed,
                cacheSize: memo.size
            }
        };

    } catch (error) {
        context.log.error(error);

        context.res = {
            status: 500,
            body: "Error al calcular Fibonacci: " + error.message
        };
    }
};
