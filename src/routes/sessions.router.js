const { Router } = require('express');
const userModel = require('../dao/models/user.model');

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await userModel.findOne({ email });

        if (exists) {
            return res.status(400).send({ status: 'error', message: 'El usuario ya existe' });
        }

        const user = {
            first_name,
            last_name,
            email,
            age,
            password
        };

        let result = await userModel.create(user);
        res.send({ status: 'success', message: 'Usuario registrado' });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al registrar' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = {
                name: 'Admin Coder',
                email: email,
                role: 'admin'
            };
            return res.send({ status: 'success', payload: req.session.user, message: 'Inicio de sesión exitoso como Admin' });
        }

        const user = await userModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'Credenciales incorrectas' });
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age,
            role: user.role
        };

        res.send({ status: 'success', payload: req.session.user });
    } catch (error) {
        res.status(500).send({ status: 'error', message: 'Error al iniciar sesión' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).send({ status: 'error', error: 'No pudo cerrar sesion' });
        res.redirect('/login');
    })
});

module.exports = router;