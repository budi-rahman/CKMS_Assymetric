const pkcs11js = require('pkcs11js');

class PKCS11Helper {
    constructor() {
        this.pkcs11 = new pkcs11js.PKCS11();
        this.isInitialized = false;
    }

    initialize() {
        if (!this.isInitialized) {
            try {
                console.log('Initializing PKCS#11...');
                this.pkcs11.load("/opt/softhsm2/lib/softhsm/libsofthsm2.so");
                this.pkcs11.C_Initialize();
                this.isInitialized = true;
                console.log('PKCS#11 Initialized.');
            } catch (error) {
                if (error.message !== 'CKR_CRYPTOKI_ALREADY_INITIALIZED') {
                    throw error;
                }
                console.log('PKCS#11 already initialized.');
            }
        }
    }

    getInstance() {
        return this.pkcs11;
    }

    finalize() {
        if (this.isInitialized) {
            console.log('Finalizing PKCS#11...');
            this.pkcs11.C_Finalize();
            this.isInitialized = false;
            console.log('PKCS#11 Finalized.');
        }
    }
}

module.exports = new PKCS11Helper();
