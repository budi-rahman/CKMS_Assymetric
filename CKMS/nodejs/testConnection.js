const { Sequelize } = require('sequelize');

// Baca konfigurasi dari config.json
const sequelize = new Sequelize('keypairdb', 'admin_hsm', 'admin@123', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

const testConnection = async () => {
  try {
    // Coba koneksi ke database
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    // Tutup koneksi
    await sequelize.close();
  }
};

testConnection();
