// Declaración de la clase DB
class DB {
    // Constructor de la clase
    constructor() {
        // Se inicializa el objeto DB con la promesa que se crea en el método crearDB()
        this.DB = this.crearDB();
    }
    // Método que retorna una promesa para crear la base de datos
    crearDB() {
        // Se retorna una nueva promesa
        return new Promise((resolve, reject) => {
            // Se abre la base de datos "citas" con la versión 1
            const crearDB = window.indexedDB.open("citas", 1);
            // Si hay un error, se rechaza la promesa con el mensaje "Hubo un error"
            crearDB.onerror = () => reject("Hubo un error al crear la cita");
            // Si la base de datos se abre con éxito, se resuelve la promesa con el objeto de base de datos
            crearDB.onsuccess = () => {
                resolve(crearDB.result);
            };
            // Si se debe crear una nueva versión de la base de datos, se ejecuta este método
            crearDB.onupgradeneeded = (e) => {
                // Se obtiene el objeto de base de datos a partir del evento
                const db = e.target.result;
                // Se crea un almacén de objetos "citas" con la clave "id" y autoincremento
                const objectStore = db.createObjectStore("citas", {
                    keyPath: "id",
                    autoIncrement: true,
                });
                // Se crean índices para cada campo que se quiere indexar en el almacén de objetos
                objectStore.createIndex("mascota", "mascota", { unique: false });
                objectStore.createIndex("propietario", "propietario", { unique: false });
                objectStore.createIndex("telefono", "telefono", { unique: false });
                objectStore.createIndex("fecha", "fecha", { unique: false });
                objectStore.createIndex("hora", "hora", { unique: false });
                objectStore.createIndex("sintomas", "sintomas", { unique: false });
                objectStore.createIndex("id", "id", { unique: true });
                // Se imprime en consola un mensaje para confirmar que la base de datos ha sido creada
                console.log("Base de datos creada y lista");
            };
        });
    }
    // Método que retorna una promesa para insertar un objeto en el almacén de objetos "citas"
    async transIDB(obj, trans) {
        // Se espera a que se resuelva la promesa creada en el constructor para obtener la base de datos
        const db = await this.DB;
        // Se crea una transacción de lectura y escritura en el almacén de objetos "citas"
        const transaction = db.transaction(["citas"], "readwrite");
        // Se obtiene el almacén de objetos
        const objectStore = transaction.objectStore("citas");
        // Se agrega/actualiza/elimina el objeto del almacén de objetos
        switch (trans) {
            case "insert":
                objectStore.add(obj);
                break;
            case "update":
                objectStore.put(obj);
                break;
            case "delete":
                objectStore.delete(obj.id);
                break;
        }
        // Se retorna una nueva promesa que se resuelve cuando la transacción se completa satisfactoriamente
        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            // Si ocurre un error durante la transacción, se rechaza la promesa con el mensaje "Hubo un error"
            transaction.onerror = () => reject("Hubo un error al realizar la transacción");
        });
    }

    async obtenerCitas() {
        // Se espera a que se resuelva la promesa "DB" y se asigna el resultado a la variable "db".
        const db = await this.DB;
        // Se abre una transacción "citas" en la base de datos y se obtiene el objeto "objectStore" para la transacción.
        const objectStore = db.transaction("citas").objectStore("citas");
        // Se inicializa un arreglo vacío para almacenar las citas.
        let citas = [];
        // Se retorna una nueva promesa que envuelve la lógica de la obtención de las citas.
        return new Promise((resolve, reject) => {
            // Se establece el manejador de errores para el cursor.
            objectStore.openCursor().onerror = (e) => reject(e);
            // Se establece el manejador de éxito para el cursor.
            objectStore.openCursor().onsuccess = (e) => {
                // Se obtiene el cursor del resultado del evento.
                const cursor = e.target.result;
                // Si el cursor existe.
                if (cursor) {
                    // Se agrega el valor del cursor al arreglo de citas usando spread operator.
                    citas = [...citas, cursor.value];
                    // Se llama a la función continue() del cursor para continuar con el siguiente registro.
                    cursor.continue();
                } else {
                    // Si el cursor no existe, significa que se han procesado todas las citas, por lo que se resuelve la promesa con el arreglo de citas.
                    resolve(citas);
                }
            };
        });
    }
}
// Exporta la clase DB como un módulo para que pueda ser importada y usada en otros archivos del proyecto.
export default DB;