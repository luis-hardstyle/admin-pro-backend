const {response} = require('express');
const usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const login = async(req, res = response)=>{

    const {email, password } =  req.body;

    try{
        //Verificar Email
        const usuarioDB = await usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok:false,
                msg:'Campos Invalidos'
            })
        }

        //Verificar Contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg: 'Campos Invalidos'
            })
        }

        //Generar Token
        const token = await generarJWT(usuarioDB.id);


        res.status(200).json({
            ok:true,
            token
        })

    }catch(error){
        console.log(error)
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        })
    }

}

module.exports = {
    login,
}