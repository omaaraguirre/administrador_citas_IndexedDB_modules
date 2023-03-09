// Importa los objetos "datosCita" y "nuevaCita" del módulo "funciones.js"
import { datosCita, nuevaCita } from "./funciones.js";
// Importa los objetos "formulario" y "inputsFormulario" del módulo "selectores.js"
import { formulario, inputsFormulario } from "./selectores.js";

// Agrega un evento que se ejecuta cuando la ventana se carga
window.onload = () => {
    // Llama la función "eventos"
    eventos();
}

// Define la función "eventos" que agrega eventos a elementos del formulario
function eventos() {
    // Para cada elemento del formulario que tenga el atributo "input", agrega un evento que ejecuta la función "datosCita" cuando cambia el valor del input.
    inputsFormulario.forEach((input) => input.addEventListener("input", datosCita));
    // Agrega un evento que ejecuta la función "nuevaCita" cuando se envía el formulario
    formulario.addEventListener("submit", nuevaCita);
}
