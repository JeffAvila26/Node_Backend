'use strict'

var express = require('express');
var userController = require('../controllers/user');

var api = express.Router();

// Cargar el middleware
var md_auth = require('../middlewares/authenticated');

var multiPart = require('connect-multiparty');
var md_upload = multiPart({uploadDir: './uploads/users'});

api.get('/pruebas-del-controlador', md_auth.ensureAuth, userController.pruebas);
api.post('/register',userController.saveUser);
api.post('/login',userController.login);
api.put('/update-user/:id',md_auth.ensureAuth,userController.updateUser);
api.post('/upload-image-user/:id',[md_auth.ensureAuth, md_upload],userController.uploadImage);
api.get('/get-image-file/:imagefile',userController.getImageFile);
api.get('/keepers',userController.getKeepers);

module.exports = api;