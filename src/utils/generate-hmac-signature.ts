const crypto = require('crypto');

export const signData = (data, secretKey) => {
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(data);
    // console.debug("Original data :::::::::::::: " + data);
    // console.debug("Secret key ::::::::: " + secretKey);
    return hmac.digest('base64');
};

export const verifyHmacSignature = (originalData, secretKey, receivedSignature) => {
    // Create an HMAC instance with SHA256 hash function and the secret key
    const hmac = crypto.createHmac('sha256', secretKey);

    // Update the HMAC with the original data
    hmac.update(originalData);

    // Calculate the HMAC digest (signature)
    const calculatedSignature = hmac.digest('base64');

    // console.debug("Verify data :::::::: " + originalData);
    // console.debug("Calculated signature ::::::::::::::::: " + calculatedSignature);
    // console.debug("ReceivedSignature :::::::::::::::: " + receivedSignature);

    // Compare the calculated signature with the received signature
    return calculatedSignature === receivedSignature;
};