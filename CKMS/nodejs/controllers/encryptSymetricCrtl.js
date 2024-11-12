require('dotenv').config();
const pkcs11js = require('pkcs11js');
const pkcs11Helper = require('../helpers/pkcs11');
const { UserData } = require('../models');

class EncryptSymetricCtrl {
    static async encryptSymetric(req, res) {
        const { data, label } = req.body;

        if(!data || !label) {
            return res.status(400).json({ error: 'Data and label are required!' });
        }

        pkcs11Helper.initialize();
        const pkcs11 = pkcs11Helper.getInstance();
        const slots = pkcs11.C_GetSlotList(true);

        if(slots.length === 0) {
            return res.status(500).json({ error: 'No slots found!' });
        }

        const slot = slots[0];
        const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

        try {
            console.log('Checking Session State ...');
            const sessionInfo = pkcs11.C_GetSessionInfo(session);

            if(sessionInfo.state !== pkcs11js.CKS_RW_USER_FUNCTIONS) {
                console.log('Logging in...');
                pkcs11.C_Login(session, pkcs11js.CKU_USER, process.env.PKCS11_USER_PIN);
            }

            console.log('Finding secret key...');
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
                throw new Error('Key not found!');
            }

            const plainText = Buffer.from(JSON.stringify(data));

            pkcs11.C_EncryptInit(
                session, {
                    mechanism: pkcs11js.CKM_AES_CBC_PAD,
                    parameter: Buffer.alloc(16)
                }, 
                secretKeyHandle
            );

            const encryptedData = pkcs11.C_Encrypt(
                session, 
                plainText,
                Buffer.alloc(plainText.length + 16)
            ).toString('hex');

            console.log(encryptedData);
            await UserData.create({
                email: encryptedData,
                keypairLabel: label
            });

            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.status(200).json({ 
                message: 'Data encrypted successfully!',
                encryptedData: encryptedData
            });

        } catch (error) {
            return res.status(500).json({ error: 'Failed to login!' });
        }
    }
}

module.exports = EncryptSymetricCtrl;