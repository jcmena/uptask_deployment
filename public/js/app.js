import proyectos from './modulos/proyectos';
import tareas from './modulos/tereas';
import avance, { actualizarAvance } from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
})
