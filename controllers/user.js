'user strict'

// modulos
var bCrypt = require('bcrypt-nodejs');

// modelos
var userReq = require('../models/user');
var path = require('path');

// service jwt
var jwt = require('../services/jwt');

var fs = require('fs');


// acciones
function pruebas(req, res){
	res.status(200).send({
		message: 'Probando el controlador de usuarios y la accion pruebas',
		user: req.user
	});
}


function saveUser(req, res){
	// Crear el objeto del usuario
	var user = new userReq();

	// Recoger parámetros petición
	var params = req.body;

	
	if(params.password !="" && params.name !="" && params.surname !="" && params.email !=""){
		// Asignar valores al objeto de usuario
		user.name = params.name;
		user.surname = params.surname;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;

		userReq.findOne({email: user.email.toLowerCase()}, (err, issetUser) => {
			if(err){
				res.status(500).send({
						message: 'Error al comprobar el usuario'
					});
			} else{
				if(!issetUser){
									// Cifrar la contraseña
						bCrypt.hash(params.password, null, null, function(err, hash){
							user.password = hash;

						// Guardar usuario en DB
							user.save((err, userStored) => { 
								if(err){
									res.status(500).send({
										message: 'Error al guardar el usuario'
									});
								}else{
									if(!userStored){
										 res.status(404).send({
										message: 'No se ha registrado el usuario'
										});
									}else{
										 res.status(200).send({
										user:userStored
										});
									}
								}
							});
						});

				} else {
					res.status(400).send({
						message: 'El usuario ya existe'
					});
				}
			}
		});

		
	}else {
		res.status(400).send({
			message: 'Introduce los datos correctamente para poder registrar el usuario'
		});
	}
}


function login(req, res){
	var params = req.body;

	var email = params.email;

	console.log(params);
	var password = params.password;

	userReq.findOne({email: email}, (err, user) => {

			if(err){
				res.status(500).send({
						message: 'Error al comprobar el usuario'
					});
			}else{
				if(user){
					bCrypt.compare(password, user.password, (err, check) => {
						if(check){
							console.log(check)
							// Comprobar y generar el token
							if(params.gettoken){
								// devolver el token de jwt
								res.status(200).send({
									token: jwt.createToken(user)
								});
							}else{
								res.status(200).send({user});
							}
						}else{
							res.status(404).send({
								message: "Contraseña incorrecta"
							});
						}
					});

				}else{
				 res.status(404).send({
					message: 'Usuario no ha podido loguearse'
				});
			}
		}
	});
}

function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	if(userId != req.user.sub){
		return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
	}

	userReq.findByIdAndUpdate(userId, update, {new:true},(er, userUpdate) =>{
		if(er){
			return res.status(500).send({message: 'Error al actualizar el usuario'});
		}else{
			if(!userUpdate){
				return res.status(404).send({message: 'No tienes permiso para actualizar el usuario'});
			}else{
				return res.status(200).send({user: userUpdate});
			}
		}
	});

}

function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido...';

	if(req.files){
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var nombre = path.basename(file_path);

		console.log(nombre);


		if( file_path.includes('.png') || file_path.includes('.jpg') || file_path.includes('.jpeg') || file_path.includes('.gif') /*file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'*/){

			if(userId != req.user.sub){
				return res.status(500).send({message: 'No tienes permiso para actualizar el usuario'});
			}

			userReq.findByIdAndUpdate(userId, {image: nombre}, {new:true},(er, userUpdate) =>{


				if(er){
					return res.status(500).send({message: 'Error al actualizar el usuario'});
				}else{
					if(!userUpdate){
						return res.status(404).send({message: 'No tienes permiso para actualizar el usuario'});
					}else{
						return res.status(200).send({user: userUpdate, image: nombre});
					}
				}
			});

		}else{
			fs.unlink(file_path, (err) => {
				if(err){
					return res.status(400).send({message: 'Extensión no valida y fichero no borrado'});
				} else {
					res.status(404).send({message: 'Extensión no es válida'});

				}
			})
				}

		
	} else {
		res.status(404).send({
			message: 'No se han subido archivos'
		});
	}
}


function getImageFile(req, res){
	var imagefile = req.params.imagefile;
	var path_file = './uploads/users/'+imagefile;
	console.log(path_file);
	fs.exists(path_file, function(exists){
		if(exists){
			res.sendFile(path.resolve(path_file));
		}else{
			res.status(404).send({message: 'La imagen no existe'});
		}
	})

}

function getKeepers(req, res){
	userReq.find({role:'ROLE_ADMIN'}).exec((err, users) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		} else {
			res.status(200).send({users});
		}
	})
}


module.exports = {
	pruebas,
	saveUser,
	login,
	updateUser,
	uploadImage,
	getImageFile,
	getKeepers
};