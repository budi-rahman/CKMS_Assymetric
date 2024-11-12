require('dotenv').config();
const pkcs11js = require('pkcs11js');
const pkcs11Helper = require('../helpers/pkcs11');

class DecryptSymetricCtrl {
    static decryptSymetric(req, res) {
       const { encryptedData, label } = req.body;

       if(!encryptedData || !label) {
            return res.status(400).json({ 
                error: 'Encrypted data and label are required!' 
            });
       }

       pkcs11Helper.initialize();
       const pkcs11 = pkcs11Helper.getInstance();
       const slots = pkcs11.C_GetSlotList(true);

       if (slots.length === 0) {
            return res.status(500).json({ error: 'No slots found!' });
       };

       const slot = slots[0];
       const session = pkcs11.C_OpenSession(
            slot, 
            pkcs11js.CKF_RW_SESSION | 
            pkcs11js.CKF_SERIAL_SESSION
        );

        try {
            console.log('Checking Session State ...');
            pkcs11.C_Login(
                session, 
                pkcs11js.CKU_USER, 
                process.env.PKCS11_USER_PIN
            );

            console.log('Session State Checked ...');
            pkcs11.C_FindObjectsInit(session, [
                {
                    type: pkcs11js.CKA_LABEL,
                    value: label
                },
                {
                    type: pkcs11js.CKA_CLASS,
                    value: pkcs11js.CKO_SECRET_KEY
                }
            ]);

            const secretKeyHandle = pkcs11.C_FindObjects(session, 1)[0];
            pkcs11.C_FindObjectsFinal(session);

            if(!secretKeyHandle) {
                return res.status(404).json({ error: 'Key not found!' });
            }

            console.log('Key Found ...');
            const encryptedBuffer = Buffer.from(encryptedData, 'hex');
            const iv = Buffer.alloc(16);
            pkcs11.C_DecryptInit(session, {
                mechanism: pkcs11js.CKM_AES_CBC_PAD,
                parameter: iv
            }, secretKeyHandle);

            const decryptedBuffer = pkcs11.C_Decrypt(session, encryptedBuffer, Buffer.alloc(encryptedBuffer.length + 16));
            const decryptedString = decryptedBuffer.toString('utf8');

            const decrypted = JSON.parse(decryptedString);

            console.log('Logging out ...');
            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.status(200).json({ decryptedData: decrypted });
        } catch (error) {
            console.error('Error decrypting data:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = DecryptSymetricCtrl;
