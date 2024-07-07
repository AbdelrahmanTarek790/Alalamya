const express = require('express');

const { 
    createReturnedCheck,
    getAllReturnedChecks,}= require('../services/ReturnCheckService');

const authService = require('../services/authService');


const router = express.Router();

router
  .route('/')
  .post(createReturnedCheck) // إنشاء شيك مرتجع جديد باستخدام اسم العميل
  .get(getAllReturnedChecks); // الحصول على جميع الشيكات المرتجعة

module.exports = router;
