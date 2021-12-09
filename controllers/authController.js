const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Funcion para revisar si el usuario esta logueado o no 
exports.usuarioAutenticado = (req, res, next) => {
    // Si el usuario esta autenticado, ok
    if(req.isAuthenticated()){
        return next();
    }
    // Si no esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Funcion para cerrar sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion')
    })
}

// Funcion para generar token si el usuario es valido
exports.enviarToken = async (req, res) => {
    // Verifica que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'Cuenta no Existe');
        res.redirect('/reestablecer');
    } else {
        //Usuario Existe
        usuario.token = crypto.randomBytes(20).toString('hex');
        usuario.expiracion = Date.now() + 3600000;
        // Guardarlos en la base de datos
        await usuario.save();
        // Genera ulr reset
        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

        // Envia el correo con el token
        await enviarEmail.enviar({
            usuario,
            subject: 'Password Reset',
            resetUrl,
            archivo: 'reestablecer-password'
        });
        
        // Terminar accion
        req.flash('correcto', 'Se envio un enlace a tu correo para reiniciar tu cotraseña');
        res.redirect('/');
    } 
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    // Si no encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    } else {
        // Formulario para generar el nuevo password
        res.render('resetPassword', {
            nombrePagina: 'Reestablecer Contraseña'
        })
    }
}

// Valida el token y expiracion para cambiar password
exports.actualizaPassword = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });
    if(!usuario) {
        req.flash('error', 'Token no Valido');
        res.redirect('/reestablecer');
    }

    // Hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    // Guardamos el nuevo password
    await usuario.save();
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
    
}