// index para redireccionar las rutas

const { Router } = require('express');
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// importar el controlador
const proyectosControllers = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    // Ruta para el home
    router.get('/', 
        authController.usuarioAutenticado,
        proyectosControllers.proyectoHome
    );
    router.get('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        proyectosControllers.formularioProyectos
    );
    router.post('/nuevo-proyecto', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.nuevoProyecto
    );

    // listar proyecto
    router.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosControllers.proyectoPorUrl
    );
    
    // Actualizar el Proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuarioAutenticado,
        proyectosControllers.formularioEditar
    );
    router.post('/nuevo-proyecto/:id', 
        authController.usuarioAutenticado,
        body('nombre').not().isEmpty().trim().escape(),
        proyectosControllers.actualizarProyecto
    );

    // Elimina proyecto
    router.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectosControllers.eliminarProyecto
    );
    // Tareas
    router.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea
    );
    // Actualizar Tarea
    router.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea
    );
    // Eliminar Tarea
    router.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea
    );
    // Crear nueva Cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);
    // Iniciar sesion
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    // Cerrar sesion
    router.get('/cerrar-sesion', authController.cerrarSesion);
    // Reestablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizaPassword);


    return router;
}