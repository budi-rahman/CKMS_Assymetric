const pkcs11js = require("pkcs11js");
//const fs = require("fs");

const PKCS11_LIB = "/opt/softhsm2/lib/softhsm/libsofthsm2.so";

const pkcs11 = new pkcs11js.PKCS11();
pkcs11.load(PKCS11_LIB);
pkcs11.C_Initialize();

try {
    //const module_info = pkcs11.C_GetInfo();
    const slots = pkcs11.C_GetSlotList(true)

    // console.log(module_info)
    const slot = slots[0]
    // console.log(slot)

    const slot_info = pkcs11.C_GetSlotInfo(slot)
    const token_info = pkcs11.C_GetTokenInfo(slot)
    const mechs = pkcs11.C_GetMechanismList(slot)
    const mechs_info = pkcs11.C_GetMechanismInfo(slot, mechs[0])
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION)
    const info = pkcs11.C_GetSessionInfo(session)

    pkcs11.C_Login(
        session, 
        pkcs11js.CKU_USER, 
        "11223344"
    )

    console.log(slot_info)
    console.log(token_info)
    //console.log(mechs)
    //console.log(mechs_info)
    //console.log(info)
    console.log("This is session ", session)

    const publicKeyTemplate = [
        { 
            type: pkcs11js.CKA_CLASS, 
            value: pkcs11js.CKO_PUBLIC_KEY
        },
        { 
            type: pkcs11js.CKA_TOKEN, 
            value: false
        },
        { 
            type: pkcs11js.CKA_LABEL, 
            value: `RSAKeyKevin`
        },
        { 
            type: pkcs11js.CKA_PUBLIC_EXPONENT, 
            value: Buffer.from([1, 0, 1])
        },
        { 
            type: pkcs11js.CKA_MODULUS_BITS, 
            value: 2048
        },
        { 
            type: pkcs11js.CKA_VERIFY, 
            value: true
        }
    ];

    const privateKeyTemplate = [
        { 
            type: pkcs11js.CKA_CLASS, 
            value: pkcs11js.CKO_PRIVATE_KEY
        },
        { 
            type: pkcs11js.CKA_TOKEN, 
            value: false
        },
        { 
            type: pkcs11js.CKA_LABEL, 
            value: `RSAKeyKevin`
        },
        { 
            type: pkcs11js.CKA_SIGN, 
            value: true
        },
        { 
            type: pkcs11js.CKA_EXTRACTABLE, 
            value: false
        }
    ];

    const keys = pkcs11.C_GenerateKeyPair(
        session, {
            mechanism: 
            pkcs11js.CKM_RSA_PKCS_KEY_PAIR_GEN
        }, 
        publicKeyTemplate,
        privateKeyTemplate
    );
    
    console.log("Public Key Handle: ", keys.publicKey);
    console.log("Private Key Handle: ", keys.privateKey );

    const attributes = [
        { 
            type: pkcs11js.CKA_MODULUS 
        },
        { 
            type: pkcs11js.CKA_PUBLIC_EXPONENT 
        },
        { 
            type: pkcs11js.CKA_LABEL 
        }
    ];

    const publicKeyAttributes = pkcs11.C_GetAttributeValue(
        session,
        keys.publicKey,
        attributes
    );


    const modulus = publicKeyAttributes[0].value;
    const publicExponent = publicKeyAttributes[1].value;
    const publicKeyLabel = publicKeyAttributes[2].value.toString();

    console.log("Modulus (Hex): ", modulus.toString('hex'));
    console.log("Public Exponent (Hex): ", publicExponent.toString('hex'));
    console.log(" Public Key Label ", publicKeyLabel)

    const dataObject = {
        nomor_handphone: "087711447077",
        nik: "3205040300000000",
        email: "kevin.parwatra@gmail.com",
        dateOfBirth: "03041999",
        alamat: "Bendungan Hilir, Tanah Abang, Jakarta",
    }

    const plainText = Buffer.from(JSON.stringify(dataObject));

    //proses enkripsi
    pkcs11.C_EncryptInit(
        session, { 
            mechanism: pkcs11js.CKM_RSA_PKCS 
        }, 
            keys.publicKey
    );

    const encryptData = pkcs11.C_Encrypt(
        session, 
        plainText, 
        Buffer.alloc(256)
    )
    console.log("Encrypted Data: ", encryptData);

    // proses dekripsi
    pkcs11.C_DecryptInit(
        session, { 
            mechanism: pkcs11js.CKM_RSA_PKCS
        },
        keys.privateKey
    );

    const decryptData = pkcs11.C_Decrypt(
        session, 
        encryptData, 
        Buffer.alloc(256)
    );
    console.log("Decrypted Data: ", decryptData.toString('utf8'));

} catch(e){
    console.log(e); 
}

finally {
    pkcs11.C_Finalize();
}
