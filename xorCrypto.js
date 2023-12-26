

async function encrypt(input, secretKey) {
   
   const keyB = await secretKeyToByteArr(null, secretKey);
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

async function decrypt(encrypted,secretKey) {
  
   const ivAndEncrypted = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
   const iv = ivAndEncrypted.slice(0, 16);
   const xorB = ivAndEncrypted.slice(16);
   const keyB = await secretKeyToByteArr(iv,   secretKey);

   const inputB32 = await xorLoop(xorB, keyB);
   const paddingLength = inputB32[inputB32.length - 1];
   const inputB = inputB32.slice(0, inputB32.length - paddingLength);

   return new TextDecoder("utf-8").decode(inputB);
}

async function xorLoop(inputB32, keyB) {
   if (inputB32.length % 32 !== 0 || keyB.length <= 1000000*32) {
      throw new Error("inputB32.length % 32 !== 0" +" || inputB32.length>1000000*32");
  }
  
   const outputB32 = new Uint8Array(inputB32.length);
   keyB = new Uint8Array(await crypto.subtle.digest('SHA-256', keyB))
   let digestOut= keyB.slice(0, 32);
   
   for (let i = 0; i < inputB32.length; i += 32) {
      if (i >= inputB32.length) {
         break;
      }
      
      let digestIn=concatenateByteArrays(digestOut,keyB);
      digestOut = new Uint8Array(await crypto.subtle.digest('SHA-256', digestIn));
      const nextBytes = inputB32.slice(i, i + 32);

      for (let j = 0; j < 32; j++) {
         nextBytes[j] ^= digestOut[j % digestOut.length];
      }

      outputB32.set(nextBytes, i);
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
function concatenateByteArrays(array1, array2) {
   // Create a new array large enough to hold both arrays
   var result = new Uint8Array(array1.length + array2.length);

   // Copy the first array into the start of the result array
   result.set(array1);

   // Copy the second array into the result array, starting right after the first array ends
   
   result.set(array2, array1.length);
   
   return result;
}

window.encrypt2 = encrypt;
window.decrypt2 = decrypt;
