const {response} = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) =>{

    const usuarios = await Usuario.find({},'nombre apellido email role google');

    res.json({
        ok:true,
        usuarios,
    })
}

const crearUsuario = async(req, res = response) =>{

    const {email, password} = req.body;
    try{

        const existeEmail = await Usuario.findOne({email});

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg: 'El correo ya esta registrado'
            })
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //Generar Token
        const token = await generarJWT(usuario.id);

        //Guardar usuario
        await usuario.save();



        res.json({
            ok:true,
            usuario,
            token
        })

    }catch(error){
        console.error(error);
        res.status(500).json({
            ok:false,
            msg: 'Error Inesperado'
        })
    }

}
const actualizarUsuario = async (req, res = response) =>{
    //Valida Token y comprueba si el usuario existe
    const uid = req.params.id;
    

    try{

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(400).json({
                ok:false,
                msg: 'no existe un usuario por ese id'
            })
        }
        const {password,google,email, ...campos} = req.body;

        if(usuarioDB.email != email){
            const existeEmail = await Usuario.findOne({email});
            if(existeEmail){
                return res.status(400).json({
                    ok:false,
                    msg: 'Ya existe un usuario con ese email'
                })
            }
        }

        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new:true});


        res.json({
            ok:true,
            usuario:usuarioActualizado
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }

}

const borrarUsuario = async (req, res = response) =>{
    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg: 'no existe un usuario por ese id'
            })
        }

        await Usuario. findByIdAndDelete(uid);

        res.status(200).json({
            ok:true,
            msg: 'usuario Eliminado'
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Error inesperado'
        })
    }
}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario

}