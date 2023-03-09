import DB from "./DB.js"
import { contenedorCitas } from "../selectores.js";
import { cargarEdicion, eliminarCita } from "../funciones.js";

class UI {
    // Define una función llamada imprimirAlerta que acepta tres parámetros: mensaje, tipo y timer. Si no se proporciona un valor para timer, se utilizará un valor predeterminado de 2000 (2 segundos).
    imprimirAlerta(mensaje, tipo, timer = 2000) {
        // Muestra un mensaje emergente con el texto del mensaje y el icono especificado por el parámetro tipo
        Swal.fire({
            text: mensaje, // Configura el texto que se mostrará en la alerta con el mensaje especificado como parámetro
            icon: tipo, // Configura el tipo de icono que se mostrará en la alerta con el tipo especificado como parámetro
            timer: timer // Configura el temporizador que se utilizará para cerrar la alerta después de un tiempo determinado
        })
    }

    // Define una función llamada imprimirConfirmación que recibe un mensaje como parámetro
    imprimirConfirmación(mensaje) {
        // Llama al método fire de la biblioteca SweetAlert2 para mostrar un diálogo de confirmación
        return Swal.fire({
            text: mensaje, // Establece el texto del mensaje del diálogo
            icon: 'question', // Establece el icono del diálogo a una pregunta
            confirmButtonText: 'Sí, eliminar', // Establece el texto del botón de confirmación
            confirmButtonColor: '#ff7e77', // Establece el color del botón de confirmación
            showCancelButton: true, // Muestra el botón de cancelación
            cancelButtonText: 'No', // Establece el texto del botón de cancelación
            cancelButtonColor: '#61b964', // Establece el color del botón de cancelación
        }).then(result => {
            // Retorna un valor booleano dependiendo de si el usuario confirmó o no la acción en el diálogo de confirmación
            return result.isConfirmed
        })
    }

    async imprimirCitas() {
        // Se remueven todos los hijos del elemento con el id 'contenedorCitas'
        while (contenedorCitas.firstChild)
            contenedorCitas.removeChild(contenedorCitas.firstChild);

        // Se crea una instancia de la clase DB
        const db = new DB();

        // Se obtienen las citas utilizando el método 'obtenerCitas' de la clase DB. Se utiliza la palabra clave 'await'
        // para esperar a que se resuelva la promesa y se asigna el resultado a la variable 'citas'
        const citas = await db.obtenerCitas();

        // Si la longitud del arreglo 'citas' es cero, significa que no hay citas en la base de datos
        if (citas.length === 0) {
            // Se crea un elemento 'p' y se le agrega la clase 'text-center'
            const p = document.createElement("p");
            p.classList.add("text-center");
            // Se establece el texto del elemento 'p'
            p.textContent = "No hay citas, comienza creando una";
            // Se agrega el elemento 'p' como hijo del elemento con el id 'contenedorCitas'
            contenedorCitas.appendChild(p);
            // Se retorna, finalizando la función
            return;
        }

        // Se itera sobre cada cita en el arreglo de citas
        citas.forEach(cita => {

            // Se desestructura la cita para obtener sus propiedades
            const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

            // Se crea un nuevo elemento 'div' para cada cita
            const div = document.createElement("div");
            // Se le agrega las clases 'cita' y 'p-3' al elemento 'div'
            div.classList.add("cita", "p-3");
            // Se le asigna el valor de 'id' al atributo 'data-id' del elemento 'div'
            div.dataset.id = id;

            // Se itera sobre cada propiedad de la cita
            Object.keys(cita).forEach(key => {
                // Si la propiedad es 'id', se ignora y se continua con la siguiente propiedad
                if (key === "id")
                    return;
                // Si la propiedad es 'mascota', se crea un elemento 'h2' con el nombre de la mascota
                if (key === "mascota") {
                    const h2 = document.createElement("h2");
                    h2.classList.add("card-title", "font-weight-bold");
                    h2.textContent = mascota;
                    div.appendChild(h2);
                    return
                }
                // Si la propiedad no es 'id' ni 'mascota', se crea un elemento 'p' con el nombre de la propiedad y su valor
                const p = document.createElement("p");
                // Se utiliza 'eval(key)' para obtener el valor de la propiedad dinámicamente
                p.innerHTML = `<span class="font-weight-bold">${key.charAt(0).toUpperCase() + key.slice(1)}:</span> ${eval(key)}`;
                div.appendChild(p);
            });

            // Se crea un botón para editar la cita
            const btnEditar = document.createElement("button");
            // Se agregan las clases CSS del botón
            btnEditar.classList.add("btn", "btn-info", "mr-2", "btn-sm");
            // Se establece el HTML del botón con un icono SVG y la palabra "Editar"
            btnEditar.innerHTML = `Editar 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>
            `;
            // Se establece el evento 'onclick' del botón para que llame a la función 'cargarEdicion' con la cita correspondiente
            btnEditar.onclick = () => cargarEdicion(cita);
            // Se agrega el botón al elemento 'div'
            div.appendChild(btnEditar);

            // Se crea un botón para eliminar la cita
            const btnEliminar = document.createElement("button");
            // Se agregan las clases CSS del botón
            btnEliminar.classList.add("btn", "btn-danger", "mr-2", "btn-sm");
            // Se establece el HTML del botón con un icono SVG y la palabra "Eliminar"
            btnEliminar.innerHTML = `Eliminar 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            `;
            // Se establece el evento 'onclick' del botón para que llame a la función 'eliminarCita' con la cita correspondiente
            btnEliminar.onclick = () => eliminarCita(cita);
            // Se agrega el botón al elemento 'div'
            div.appendChild(btnEliminar);
            //  Se agrega el div con todo el contenio generado al contenedor en la vista
            contenedorCitas.appendChild(div);
        });
    }
}
// Exporta la clase UI como un módulo para que pueda ser importada y usada en otros archivos del proyecto.
export default UI;