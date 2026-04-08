const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    const db = "mongodb+srv://adhammarwa:reem182001@cluster0.n8lnfxx.mongodb.net/?appName=Cluster0";

    // ✅ تحقق إن المتغير موجود
    if (!db) {
      console.error('❌ DB_URI is not defined in environment variables');
      return; // ما نعملش exit عشان السيرفر ميقعش
    }

    // ✅ تحقق إن صيغة الرابط صح
    if (!db.startsWith('mongodb://') && !db.startsWith('mongodb+srv://')) {
      console.error('❌ Invalid MongoDB connection string format');
      return;
    }

    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(db);

    console.log(`✅ Database Connected: ${conn.connection.host}`);

  } catch (err) {
    console.error('❌ Database Error:', err.message);
    // في الدبلويمنت الأفضل منقفلش السيرفر
  }
};

module.exports = dbConnection;
