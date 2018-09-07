'use strict'

var express = require('express');
var animalController = require('../controllers/animal');

var api = express.Router();

// Cargar el middleware
var md_auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/animals'});

api.get('/pruebas-animales', md_auth.ensureAuth, userController.pruebas);
api.get('/save-animal', md_auth.ensureAuth, userController.saveAnimal);

module.exports = api;