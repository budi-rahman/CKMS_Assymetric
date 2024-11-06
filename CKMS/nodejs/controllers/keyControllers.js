/**
const pkcs11js = require('pkcs11js');
const PKCS11_LIB = "/opt/softhsm2/lib/softhsm/libsofthsm2.so";
const { Keypair, KeyStorage } = require('../models')
const pkcs11 = new pkcs11js.PKCS11();
pkcs11.load(PKCS11_LIB);
pkcs11.C_Initialize();

class keyGenerateController{
    static keyGenerate(req, res){
        const { label } = req.body;

        if(!label){
            return res.status(400).json({
                error: 'Label is requiered!'
            });
        }

        try{
            const slots = pkcs11.C_GetSlotList(true);
            const slot = slots[0];
            const session = pkcs11.C_OpenSession(
                slot, 
                pkcs11js.CKF_RW_SESSION | 
                pkcs11js.CKF_SERIAL_SESSION
            );
            //pkcs11.C_Login(session, pkcs11js.CKU_USER, '11223344');

            try {
                pkcs11.C_Logout(session);
            } catch (logoutError) {
                console.log("Tidak ada user yang login atau sudah logout.");
            }

            pkcs11.C_Login(
                session, 
                pkcs11js.CKU_USER, 
                '11223344'
            );

            //template public key
            const publicKeyTemplate = [
                { 
                    type : pkcs11js.CKA_CLASS, 
                    value: pkcs11js.CKO_PUBLIC_KEY 
                },
                {
                    type : pkcs11js.CKA_TOKEN,
                    value: true
                },
                {
                    type : pkcs11js.CKA_LABEL,
                    value: label
                },
                {
                    type : pkcs11js.CKA_PUBLIC_EXPONENT,
                    value: Buffer.from([1,0,1])
                },
                {
                    type : pkcs11js.CKA_MODULUS_BITS,
                    value: 2048
                },
                {
                    type : pkcs11js.CKA_VERIFY,
                    value: true
                }
            ];

            const privateKeyTemplate = [
                {
                    type : pkcs11js.CKA_CLASS,
                    value: pkcs11js.CKO_PRIVATE_KEY
                },
                {
                    type : pkcs11js.CKA_TOKEN,
                    value: false
                },
                {
                    type : pkcs11js.CKA_LABEL,
                    value: label
                },
                {
                    type : pkcs11js.CKA_SIGN,
                    value: true
                },
                {
                    type : pkcs11js.CKA_EXTRACTABLE,
                    value: false
                }
            ];

            const keys = pkcs11.C_GenerateKeyPair(
                session,
                {
                    mechanism: 
                    pkcs11js.CKM_RSA_PKCS_KEY_PAIR_GEN,
                },
                publicKeyTemplate,
                privateKeyTemplate
            )

            const publicKeyAttributes = pkcs11.C_GetAttributeValue(
                session, 
                keys.publicKey, [
                {
                    type : pkcs11js.CKA_MODULUS,
                },
                {
                    type : pkcs11js.CKA_PUBLIC_EXPONENT,
                },
                {
                    type : pkcs11js.CKA_LABEL,
                }
            ]);

            const modulus = publicKeyAttributes[0].value.toString('hex');
            const publicExponent = publicKeyAttributes[1].value.toString('hex');
            const publicKeyLabel = publicKeyAttributes[2].value.toString();
            const privateKeyHex = keys.privateKey.toString('hex');

            Keypair.create({
                label: publicKeyLabel,
                modlus: modulus,
                public: publicExponent,
            })

            KeyStorage.create({
                publickey: publicExponent,
                privatekey: privateKeyHex,
                label: publicKeyLabel
            })

            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.json({
                publicKey: {
                    label: publicKeyLabel,
                    modlus: modulus,
                    publicExponent: publicExponent
                },
                privateKey: "Private key handle is stored in HSM and not extractable"
            })

        } catch(error){
            res.status(500).json({
                error: error.message
            });
        }; 
    };
};

module.exports = keyGenerateController;
*/