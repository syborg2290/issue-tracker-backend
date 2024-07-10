
const crypto = require('crypto');

export const decryptUsingPrivateKey = (privateKey, encryptedData) => {
    try {
        const privateKeyAsFullForm = '-----BEGIN PRIVATE KEY-----\n' +
            privateKey + '\n' +
            // Add your private key here
            '-----END PRIVATE KEY-----';

        const decryptedData = crypto.privateDecrypt(privateKeyAsFullForm, encryptedData);
        return decryptedData;
    } catch (error) {
        console.debug(error);
    }
}