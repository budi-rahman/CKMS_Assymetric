const pkcs11js = require("pkcs11js");
const pkcs11Helper = require('../helpers/pkcs11');

class DecryptControllerAlt {
    static decryptDataAlt(req, res) {
        const { encryptedData, label } = req.body;

        if (!encryptedData || !label) {
            return res.status(400).json({ 
                error: 'Encrypted data and label are required!' 
            });
        }

        pkcs11Helper.initialize();
        const pkcs11 = pkcs11Helper.getInstance();
        const slots = pkcs11.C_GetSlotList(true);
        const slot = slots[0];
        const session = pkcs11.C_OpenSession(
            slot, 
            pkcs11js.CKF_RW_SESSION | 
            pkcs11js.CKF_SERIAL_SESSION
        );

        try {
            console.log("Logging in...")
            pkcs11.C_Login(
                session, 
                pkcs11js.CKU_USER, 
                '11223344'
            );

            console.log("Finding private key...")
            pkcs11.C_FindObjectsInit(session, [
                { 
                    type: pkcs11js.CKA_LABEL, 
                    value: label 
                },
                { 
                    type: pkcs11js.CKA_CLASS, 
                    value: pkcs11js.CKO_PRIVATE_KEY 
                }
            ]);

            const privateKeyHandle = pkcs11.C_FindObjects(session, 1)[0];
            pkcs11.C_FindObjectsFinal(session);

            if (!privateKeyHandle) {
                throw new Error('Private key not found');
            }

            console.log("Decrypting data...")
            const encryptedBuffer = Buffer.from(encryptedData, 'hex');
            pkcs11.C_DecryptInit(session, { mechanism: pkcs11js.CKM_RSA_PKCS }, privateKeyHandle);
            const decryptedBuffer = pkcs11.C_Decrypt(session, encryptedBuffer, Buffer.alloc(256));
            const decryptedString = decryptedBuffer.toString('utf8');

            const decrypted = JSON.parse(decryptedString);

            console.log("Logging out...")
            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.json({ decryptedData: decrypted });
        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DecryptControllerAlt;