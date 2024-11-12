const pkcs11js = require("pkcs11js");
const pkcs11Helper = require('../helpers/pkcs11');
const { UserData } = require('../models');

class EncryptControllerAlt {
    static async encryptDataAlt(req, res) {
        const { data, label } = req.body;

        if (!data || !label) {
            return res.status(400).json({ error: 'Data and label are required!' });
        }


        pkcs11Helper.initialize();
        const pkcs11 = pkcs11Helper.getInstance();
        const slots = pkcs11.C_GetSlotList(true);
        const slot = slots[0];
        const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

        try {
            pkcs11.C_Login(session, pkcs11js.CKU_USER, '11223344');

            pkcs11.C_FindObjectsInit(session, [
                { 
                    type: pkcs11js.CKA_LABEL, 
                    value: label 
                },
                { 
                    type: pkcs11js.CKA_CLASS, 
                    value: pkcs11js.CKO_PUBLIC_KEY 
                }
            ]);

            const publicKeyHandle = pkcs11.C_FindObjects(session, 1)[0];
            pkcs11.C_FindObjectsFinal(session);

            if (!publicKeyHandle) {
                throw new Error('Public key not found');
            }

            const plainText = Buffer.from(JSON.stringify(data));
            pkcs11.C_EncryptInit(
                session, { 
                    mechanism: pkcs11js.CKM_RSA_PKCS 
                }, 
                publicKeyHandle
            );
            const encryptedData = pkcs11.C_Encrypt(
                session, 
                plainText, 
                Buffer.alloc(256)
            ).toString('hex');

            console.log(encryptedData);
            UserData.create({
                email: encryptedData,

            })

            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.json({ encryptedData: encryptedData.toString('hex') });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = EncryptControllerAlt;