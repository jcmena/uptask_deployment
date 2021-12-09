const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

// referencia al model donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new localStrategy(
        // Por default passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1
                     }
                });
                // El usuario existe, pero password incorrecto
                if(!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    })
                }
                // El email existe, y el password es correcto
                return done(null, usuario);
            } catch (error) {
                // Ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
); 

/* Necesario para que funcione passport */
// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
})

// Exportar
module.exports = passport;