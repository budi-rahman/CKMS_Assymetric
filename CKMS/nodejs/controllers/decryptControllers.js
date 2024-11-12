// const pkcs11Helper = require('../helpers/pkcs11');
// const { KeyStorage } = require('../models');
// const pkcs11js = require('pkcs11js');

// class DecryptionController{
//     static async decryptData(req, res){
//         try{
//             const { encryptedData, label } = req.body;

//             if(!encryptedData || !label){
//                 return res.status(400).json({
//                     error: 'Encrypted data and label are required!'
//                 });
//             }

//             const keypair = await KeyStorage.findOne({
//                 where: { label }
//             });

//             if(!keypair) {
//                 return res.status(404).json({
//                     error: 'Keypair not found!'
//                 });
//             }

//             pkcs11Helper.initialize();
//             const pkcs11 = pkcs11Helper.getInstance();
//             const slots = pkcs11.C_GetSlotList(true);
//             const slot = slots[0];
//             const session = pkcs11.C_OpenSession(
//                 slot,
//                 pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION
//             );
            
//             try{
//                 pkcs11.C_Login(
//                     session, 
//                     pkcs11js.CKU_USER, 
//                     '11223344'
//                 );
//                 console.log(session)

//                 pkcs11.C_FindObjectsInit(session, [
//                     { type: pkcs11js.CKA_LABEL, value: label }, // Label dari keypair yang disimpan
//                     { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY } // Tipe objek kunci privat
//                 ]);
                
//                 let privateKeyHandles = /*Buffer.from(keypair.privatekey, 'hex'); pkcs11.C_FindObjects(session, 1);
//                 console.log("this is private key: ", privateKeyHandles)
                
//                 pkcs11.C_FindObjectsFinal(session);

//                 if(!privateKeyHandles || privateKeyHandles.length === 0){
//                     throw new Error('Private key not found');
//                 }

//                 const privateKeyHandle = privateKeyHandles[0];

//                 pkcs11.C_DecryptInit(
//                     session, 
//                     {
//                         mechanism: pkcs11js.CKM_RSA_PKCS
//                     }, 
                    
//                     privateKeyHandle
//                 );
//                 //console.log(privateKeyHandle)
//                 const encryptedBuffer = Buffer.from(encryptedData, 'hex');
//                 const decryptedBuffer = pkcs11.C_Decrypt(session, encryptedBuffer, Buffer.alloc(256))
//                 const decryptedString = decryptedBuffer.toString('utf8');

//             return res.status(200).json({
//                 message: "Data decrypted successfully",
//                 decryptedString: decryptedString
//             });
//             } catch(err){
//                 throw err;
//             } finally {
//                 pkcs11.C_Logout(session);
//                 pkcs11.C_CloseSession(session);
//             }
//         } catch(err){
//             return res.status(500).json({
//                 err: err.message
//             })

//         }
//     }
// }

// module.exports = DecryptionController 

