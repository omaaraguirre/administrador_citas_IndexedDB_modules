class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }

    editarCita(cita) {
        const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
        this.citas = this.citas.map(cita => {
            if (cita.id === id) {
                Object.keys(cita).forEach(key => {
                    cita[key] = eval(key);
                });
            }
            return cita;
        });
    }

    eliminarCita(id) {
        this.citas = this.citas.filter(cita => cita.id !== id);
    }
}

// export default Citas;