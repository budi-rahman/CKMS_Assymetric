require('dotenv').config();
const pkcs11js = require("pkcs11js");
const pkcs11Helper = require('../helpers/pkcs11');
const { Keypair } = require('../models');

class SymmmetricController {
    static async generateSymetricKey(req, res) {
        const { label } = req.body;

        if(!label) {
            return res.status(400).json({ error: 'Label is required!' });
        }

        pkcs11Helper.initialize();
        const pkcs11 = pkcs11Helper.getInstance();
        const slots = pkcs11.C_GetSlotList(true);
        const slot = slots[0];
        const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

        try {
            pkcs11.C_Login(session, pkcs11js.CKU_USER, process.env.PKCS11_USER_PIN);
            const keyTemplate = [
                {
                    type: pkcs11js.CKA_CLASS,
                    value: pkcs11js.CKO_SECRET_KEY
                },
                {
                    type: pkcs11js.CKA_KEY_TYPE,
                    value: pkcs11js.CKK_AES
                },
                {
                    type: pkcs11js.CKA_LABEL,
                    value: label
                },
                {
                    type: pkcs11js.CKA_TOKEN,
                    value: true
                },
                {
                    type: pkcs11js.CKA_ENCRYPT,
                    value: true
                },
                {
                    type: pkcs11js.CKA_DECRYPT,
                    value: true
                },
                {
                    type: pkcs11js.CKA_VALUE_LEN,
                    value: 32
                },
                {
                    type: pkcs11js.CKA_EXTRACTABLE,
                    value: false
                }
            ];

            const key = pkcs11.C_GenerateKey(
                session,
                { mechanism: pkcs11js.CKM_AES_KEY_GEN },
                keyTemplate
            );

            await Keypair.create({
                label: label,
                public: key.toString('hex'),
            })

            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.status(200).json({
                message: 'Symetric key generated successfully!',
                keyHandle: key.toString('hex')
        });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to open session!' });
        }
    }
}

module.exports = SymmmetricController;