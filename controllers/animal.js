'user strict'

// modelos
var userReq = require('../models/user');
var animalReq = require('../models/animal');
var path = require('path');
var fs = require('fs');



// acciones
function pruebas(req, res){
	res.status(200).send({
		message: 'Probando el controlador de animales y la accion pruebas',
		user: req.user
	});
}

function saveAnimal(req,res){
	res.status(200).send({
		message: 'Animal guardado',
	});
}

module.exports = {
	pruebas,
	saveAnimal
};