

async function encrypt(input) {
   const keyB = await secretKeyToByteArr(null, getSecretKey());
   const iv = keyB.slice(0, 16);
   const inputB = new TextEncoder().encode(input);
   const inputB32 = new Uint8Array(inputB.length + (32 - inputB.length % 32));
   inputB32.set(inputB);

   const paddingLength = inputB32.length - inputB.length;
   inputB32.fill(paddingLength, inputB.length);

   const xorB = await xorLoop(inputB32, keyB);
   const ivAndEncrypted = new Uint8Array(iv.length + xorB.length);
   ivAndEncrypted.set(iv);
   ivAndEncrypted.set(xorB, iv.length);

   return btoa(String.fromCharCode.apply(null, ivAndEncrypted));
}

async function decrypt(encrypted) {
   const ivAndEncrypted = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
   const iv = ivAndEncrypted.slice(0, 16);
   const xorB = ivAndEncrypted.slice(16);
   const keyB = await secretKeyToByteArr(iv,   getSecretKey());

   const inputB32 = await xorLoop(xorB, keyB);
   const paddingLength = inputB32[inputB32.length - 1];
   const inputB = inputB32.slice(0, inputB32.length - paddingLength);

   return new TextDecoder("utf-8").decode(inputB);
}

async function xorLoop(inputB32, keyB) {
   if (inputB32.length % 32 !== 0) {
       throw new Error("inputB32.length % 32 !== 0");
   }

   const outputB32 = new Uint8Array(inputB32.length);

   for (let h = 0; h < 2; h++) {
       for (let i = 0; i < inputB32.length; i += 32) {
           if (i >= inputB32.length) {
               break;
           }

           keyB = new Uint8Array(await crypto.subtle.digest('SHA-256', keyB));
           const nextBytes = inputB32.slice(i, i + 32);

           for (let j = 0; j < 32; j++) {
               nextBytes[j] ^= keyB[j % keyB.length];
           }

           outputB32.set(nextBytes, i);
       }
   }
   return outputB32;
}

async function secretKeyToByteArr(iv, secretKey) {
   const key = new TextEncoder().encode(secretKey);
   if (!iv) {
      iv = crypto.getRandomValues(new Uint8Array(16));
   }

   const keyB = new Uint8Array(iv.length + key.length);
   keyB.set(iv);
   keyB.set(key, iv.length);
   return keyB;
}
function getSecretKey(){
   return localStorage.getItem("SITE_KEY")
}
function setSecretKey(key){
   if(key.length <10){
      alert("Key must be at least 10 characters long")
   }
   localStorage.setItem("SITE_KEY", key);
}
async function toRequestBody(toml){
   const requestBody = JSON.parse("{}");
   const toEncrypt = JSON.parse("{}");
   toEncrypt.toml = toml; 
   const toEncryptS=JSON.stringify(toEncrypt) ;
   const encrypted =await window.encrypt( toEncryptS);
   requestBody.encrypted = encrypted;
   return requestBody; 
}
window.setSecretKey = setSecretKey;
window.encrypt = encrypt;
window.decrypt = decrypt;
