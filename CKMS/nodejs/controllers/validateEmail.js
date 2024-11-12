// const pkcs11js = require("pkcs11js");
// const pkcs11Helper = require('../helpers/pkcs11');
// const { UserData } = require('../models');

// class ValidateEmailController {
//     static async validateEmail(req, res) {
//         const { email, label } = req.body;

//         if(!email || !label) {
//             return res.status(400).json({
//                 error: 'Email is required!'
//             });
//         }

//         pkcs11Helper.initialize();
//         const pkcs11 = pkcs11Helper.getInstance();
//         const slots = pkcs11.C_GetSlotList(true);
//         const slot = slots[0];
//         const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

//         try {
//             pkcs11.C_Login(session, pkcs11js.CKU_USER, '11223344');
//             pkcs11.C_FindObjectsInit(session, [
//                 { type: pkcs11js.CKA_LABEL, value: label},
//                 { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_PRIVATE_KEY}
//             ]);

//             const privateKeyHandle = pkcs11.C_FindObjects(session, 1)[0];
//             pkcs11.C_FindObjectsFinal(session);

//             if(!privateKeyHandle) {
//                 throw new Error('Private key not found!');
//             }

//             for (const user of users){
//                 const encryptBuffer = Buffer.from(user.email,)
//             }
//         } catch (error) {
//             return res.status(500).json({
//                 error: error.message
//             });
//         }
//     }

// }

// module.exports = ValidateEmailController;
