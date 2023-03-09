import DB from './clases/DB.js';
import UI from './clases/UI.js';
import { formulario } from './selectores.js';

const db = new DB();
const ui = new UI();
ui.imprimirCitas();

// Define un objeto llamado citaObj con seis propiedades vacías: mascota, propietario, telefono, fecha, hora y sintomas
const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
};

// Declra una función llamada datosCita que recibe un evento como parámetro
export function datosCita(e) {
    // Agrega una propiedad al objeto citaObj con el nombre del elemento que desencadenó el evento y su valor
    citaObj[e.target.name] = e.target.value;
}

// Define una función asíncrona llamada nuevaCita que recibe un evento como parámetro
export async function nuevaCita(e) {
    // Previene el comportamiento por defecto del formulario al ser enviado
    e.preventDefault();
    // Destructura los valores del objeto citaObj
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = citaObj;
    // Verifica si alguno de los campos está vacío
    if (mascota === "" || propietario === "" || telefono === "" || fecha === "" || hora === "" || sintomas === "") {
        // Si es así, imprime una alerta en la interfaz y devuelve
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    // Si el objeto tiene un valor para la propiedad "id"
    if (id) {
        // Actualiza la cita en la base de datos con el objeto citaObj
        await db.transIDB(citaObj, "update")
            .then(() => ui.imprimirAlerta("Cita actualizada", "success"))
            .catch(() => ui.imprimirAlerta("Error al actualizar la cita", "error"));
        // Cambia el texto del botón de envío del formulario a "Crear cita"
        formulario.querySelector("button[type=submit]").textContent = "Crear cita";
    } else {
        // Si el objeto no tiene un valor para la propiedad "id", le asigna el valor de la marca de tiempo actual
        citaObj.id = Date.now();
        // Agrega la cita a la base de datos con el objeto citaObj
        await db.transIDB(citaObj, "insert")
            .then(() => ui.imprimirAlerta("Cita agregada", "success"))
            .catch(() => ui.imprimirAlerta("Error al agregar la cita", "error"));
    }

    // Reinicia el formulario
    formulario.reset();
    // Reinicia el objeto citaObj
    reiniciarObjeto();
    // Imprime todas las citas en la interfaz
    ui.imprimirCitas();
}

export function reiniciarObjeto() {
    // Establece todos los atributos de un objeto citaObj a valores predeterminados, para reiniciarlo o limpiarlo
    citaObj.id = null;
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

// Define una función llamada cargarEdicion que toma un objeto cita como argumento.
export function cargarEdicion(cita) {
    // Itera sobre todas las claves y valores del objeto cita usando Object.entries.
    for (let [key, value] of Object.entries(cita)) {
        // Asigna el valor correspondiente a la clave de citaObj.
        citaObj[key] = value;
        // Si la clave es "id", salta el resto del bucle y pasa a la siguiente iteración.
        if (key === "id")
            continue;
        // Encuentra el elemento HTML correspondiente al nombre de la clave y establece su valor como el valor del objeto cita.
        document.querySelector(`#${key}`).value = value;
    }
    // Encuentra el botón Enviar formulario y cambia su texto a "Guardar cambios".
    formulario.querySelector("button[type=submit]").textContent = "Guardar cambios";
}

// Define una función asíncrona llamada eliminarCita que acepta un objeto cita como parámetro
export async function eliminarCita(cita) {
    // Extrae la propiedad mascota del objeto cita y asigna la variable
    const { mascota } = cita;
    // Muestra una confirmación al usuario para verificar si quiere eliminar la cita
    const confirmacion = await ui.imprimirConfirmación(`Está seguro de eliminar la cita para ${mascota}?`);
    // Si el usuario confirma que quiere eliminar la cita, se ejecuta el siguiente bloque de código
    if (confirmacion) {
        // Se llama a la función transIDB del objeto db para eliminar la cita de la base de datos
        await db.transIDB(cita, "delete")
            // Si se elimina correctamente, se muestra un mensaje de alerta con un estilo de "éxito"
            .then(() => ui.imprimirAlerta("Cita eliminada", "success"))
            // Si hay un error al eliminar la cita, se muestra un mensaje de alerta con un estilo de "error"
            .catch(() => ui.imprimirAlerta("Error al eliminar la cita", "error"));
        // Se llama a la función imprimirCitas del objeto ui para actualizar la lista de citas en la interfaz de usuario
        ui.imprimirCitas();
    }
}