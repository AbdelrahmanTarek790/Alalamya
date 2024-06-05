const express = require('express');
const {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  deleteUserValidator,
  changeUserPasswordValidator,
  updateLoggedUserValidator,
} = require('../utils/validators/userValidator');

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  
} = require('../services/userService');

const authService = require('../services/authService');

const router = express.Router();



// Admin
router.use(authService.protect,authService.allowedTo('admin', 'manager'));

router
  .route('/')
  .get(getUsers)
  .post(createUserValidator, createUser);
router
  .route('/:id')
  .get(getUserValidator, getUser)
  .put( updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

module.exports = router;
