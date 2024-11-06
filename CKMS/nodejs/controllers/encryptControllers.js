/**
const pkcs11Helper = require('../helpers/pkcs11');
const { Keypair, UserData } = require('../models');
const pkcs11js = require('pkcs11js');

class EncryptionController {
    static async encryptData(req, res) {
        try {
            const { 
                keypairLabel, 
                name, 
                phone, 
                nik, 
                email, 
                dateofbirth, 
                address 
            } = req.body

            if(
                !keypairLabel || 
                !name || 
                !phone || 
                !nik || 
                !email || 
                !dateofbirth || 
                !address
            ) {
                return res.status(400). json({
                    error: 'Keypair label and all data fields are required! '
                });
            }

            const keypair = await Keypair.findOne({
                where: {
                    label: keypairLabel
                }
            });

            if(!keypair){
                return res.status(404).json({
                    error: 'Keypair not found!'
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
            pkcs11.C_Login(
                session, 
                pkcs11js.CKU_USER, 
                '11223344'
            );

            const publicKeyTemplate = [
                { 
                    type: pkcs11js.CKA_CLASS, 
                    value: pkcs11js.CKO_PUBLIC_KEY 
                },
                { 
                    type: pkcs11js.CKA_LABEL, 
                    value: keypair.label
                }
            ];
            pkcs11.C_FindObjectsInit(
                session, 
                publicKeyTemplate
            );

            const publicKeyHandle = pkcs11. C_FindObjects(session, 1)[0];
            pkcs11.C_FindObjectsFinal(session);

            if (!publicKeyHandle){
                pkcs11.C_Logout(session);
                pkcs11.C_CloseSession(session);
                return res.status(400).json({
                    error: 'Public key not found'
                });
            }

            const encryptField = (fieldValue) => {
                const plainText = Buffer.from(fieldValue);
                pkcs11.C_EncryptInit(
                    session, 
                    {
                        mechanism: pkcs11js.CKM_RSA_PKCS
                    }, 
                    publicKeyHandle
                );
                const encryptedData = pkcs11.C_Encrypt(
                    session, 
                    plainText, 
                    Buffer.alloc(256)
                );
                return encryptedData.toString('hex');
            };

            const encryptedPhone = encryptField(phone);
            const encryptedNik = encryptField(nik);
            const encryptedEmail = encryptField(email);
            const encryptedDateOfBirth = encryptField(dateofbirth);
            const encryptedAddress = encryptField(address);

            UserData.create({
                name: name,
                phone: encryptedPhone,
                nik: encryptedNik,
                email: encryptedEmail,
                dateofbirth: encryptedDateOfBirth,
                address: encryptedAddress
            })

            pkcs11.C_Logout(session);
            pkcs11.C_CloseSession(session);

            return res.status(200).json({
                message: "Data Encrypted Successfully",
                encryptedData: {
                    phone: encryptedPhone,
                    nik: encryptedNik,
                    email: encryptedEmail,
                    dateOfBirth: encryptedDateOfBirth,
                    address: encryptedAddress
                }
            })
        } catch(err){
            console.error("Error during encryption: ", err);
            return response.status(500).json({
                error: err.message
            })

        }
    }
}

module.exports = EncryptionController;
*/
