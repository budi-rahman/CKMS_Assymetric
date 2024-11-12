const pkcs11js = require("pkcs11js");

const PKCS11_LIB = "/opt/softhsm2/lib/softhsm/libsofthsm2.so";

const pkcs11 = new pkcs11js.PKCS11();
pkcs11.load(PKCS11_LIB);
pkcs11.C_Initialize();

try {
    const slots = pkcs11.C_GetSlotList(true);

    if (slots.length === 0) {
        throw new Error('No slots found!');
    }

    const slot = slots[0];
    const session = pkcs11.C_OpenSession(slot, pkcs11js.CKF_RW_SESSION | pkcs11js.CKF_SERIAL_SESSION);

    pkcs11.C_Login(session, pkcs11js.CKU_USER, "11223344");

    // Define the key template for AES
    const keyTemplate = [
        { type: pkcs11js.CKA_CLASS, value: pkcs11js.CKO_SECRET_KEY },
        { type: pkcs11js.CKA_KEY_TYPE, value: pkcs11js.CKK_AES },
        { type: pkcs11js.CKA_LABEL, value: "AESKeyKevin" },
        { type: pkcs11js.CKA_TOKEN, value: false },
        { type: pkcs11js.CKA_ENCRYPT, value: true },
        { type: pkcs11js.CKA_DECRYPT, value: true },
        { type: pkcs11js.CKA_VALUE_LEN, value: 32 }, // 256-bit key
        { type: pkcs11js.CKA_EXTRACTABLE, value: true }
    ];

    // Generate the AES key
    const aesKey = pkcs11.C_GenerateKey(session, { mechanism: pkcs11js.CKM_AES_KEY_GEN }, keyTemplate);

    const dataObject = {
        nomor_handphone: "087711447077",
        nik: "3205040300000000",
        email: "kevin.parwatra@gmail.com",
        dateOfBirth: "03041999",
        alamat: "Bendungan Hilir, Tanah Abang, Jakarta",
    };

    const plainText = Buffer.from(JSON.stringify(dataObject));

    // Encrypt the data
    const iv = Buffer.alloc(16); // Initialization Vector (IV), should be random in practice
    pkcs11.C_EncryptInit(session, { mechanism: pkcs11js.CKM_AES_CBC_PAD, parameter: iv }, aesKey);

    const encryptedData = pkcs11.C_Encrypt(session, plainText, Buffer.alloc(plainText.length + 16));
    console.log("Encrypted Data (Hex):", encryptedData.toString('hex'));

    // Decrypt the data
    pkcs11.C_DecryptInit(session, { mechanism: pkcs11js.CKM_AES_CBC_PAD, parameter: iv }, aesKey);

    const decryptedData = pkcs11.C_Decrypt(session, encryptedData, Buffer.alloc(encryptedData.length));
    console.log("Decrypted Data:", decryptedData.toString('utf8'));

    pkcs11.C_Logout(session);
    pkcs11.C_CloseSession(session);

} catch (e) {
    console.log(e);
} finally {
    pkcs11.C_Finalize();
}