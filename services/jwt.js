'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretPass = 'clave_secreta_de_usuario';

exports.createToken = function(user){
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		role: user.role,
		image: user.image,
		iat: moment().unix(), // Unix coge el formato de la hora actual
		exp: moment().add(30, 'days').unix
	};

	return jwt.encode(payload, secretPass);
};
