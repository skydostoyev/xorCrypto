package org.acme.webapp.lib;

import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import java.security.NoSuchAlgorithmException;
public class XorCrypto{
  

   public static String encrypt(String input,String secretKey) {
      try{
      //Step:generate keyB from iv and secretKey
      byte[] keyB = secretKeyToByteArr(null,secretKey);

      //Step:Take the first 16 bytes of keyB into a new variable, iv
      byte[] iv = Arrays.copyOfRange(keyB, 0, 16);
      
      //Step:Encode input to bytes array, inputB
      byte[] inputB = input.getBytes("UTF-8");
      
      //Step:Copy inputB to a new array, inputB32 for padding up to the multiple of 32 bytes 
      byte[] inputB32 = new byte[inputB.length + (32 - inputB.length % 32)];
      System.arraycopy(inputB, 0, inputB32, 0, inputB.length);

      //Step: Fill the extra space with the padding length value
      int paddingLength = inputB32.length - inputB.length;
      Arrays.fill(inputB32, inputB.length, inputB32.length, (byte) paddingLength);
      
      //Step:Take xor of inputB32 and keyB in an algorithm common to both encrypt and decrypt functions
      byte[] xorB = xorLoop(inputB32,keyB);
      
      //Step:Concaternate 2 bytes arrays, iv and xorB
      byte[] ivAndEncrypted = new byte[iv.length + xorB.length];
      
      System.arraycopy(iv, 0, ivAndEncrypted, 0, iv.length);
      System.arraycopy(xorB, 0, ivAndEncrypted, iv.length, xorB.length);

      //Step:Encode ivAndEncrypted to Base64
       return Base64.getEncoder().encodeToString(ivAndEncrypted);
      }catch(Exception e){
         throw new RuntimeException(e);
      }
   }
   public static String decrypt(String encrypted,String secretKey){
      try{
      //Step:Decode encrypted to bytes array, ivAndEncrypted
      byte[] ivAndEncrypted = Base64.getDecoder().decode(encrypted);
      
      //Step:Split ivAndEncrypted into 2 bytes arrays, iv and xorB
      byte[] iv = Arrays.copyOfRange(ivAndEncrypted, 0, 16);
      byte[] xorB = Arrays.copyOfRange(ivAndEncrypted, 16, ivAndEncrypted.length);
      
      //Step:generate keyB from iv and secretKey
      byte[] keyB = secretKeyToByteArr(iv,secretKey);

      //Step:Take xor of xorB and keyB in an algorithm common to both encrypt and decrypt functions
      byte[] inputB32 = xorLoop(xorB,keyB);
      int paddingLength = inputB32[inputB32.length - 1];

      //Step:Take the first inputB32.length - paddingLength bytes of inputB32 into a new variable, inputB
      byte[] inputB = Arrays.copyOfRange(inputB32, 0, inputB32.length - paddingLength);
      
      //Step:Decode inputB to String
      return new String(inputB, "UTF-8");
      }catch(Exception e){
         throw new RuntimeException(e);
      }
   }
   public static byte[] xorLoop(byte[] inputB32,byte[] keyB) throws Exception{
      //Step:Check if inputB32.length is multiple of 32
      if(inputB32.length%32 != 0)
      {
        throw new Exception("inputB32.length%32 != 0");
      }
      //Step: Prepare a new array, outputB32, for the result
      byte[] outputB32 = new byte[inputB32.length];
      
      //Step:Prepare a new instance of MessageDigest, sha
      MessageDigest sha = MessageDigest.getInstance("SHA-256");
      keyB = sha.digest(keyB);
      byte[] digestOut = Arrays.copyOfRange(keyB,0,32);
      //Step:Loop through the inputB32 array, 32 bytes at a time
      for(int i=0;i<1000000;i++)
      { 
         if(i * 32 >= inputB32.length)
         {
            break;//Prevent out of bound error
         }
         
         //Step:Concaternate 2 bytes arrays, digestOut and keyB
         byte[] digestIn = concatenateByteArrays(digestOut, keyB);
         
         //Step:Update digestOut with sha
         digestOut = sha.digest(digestIn); 
         
         //Step: We assume sha.digest always returns 32 bytes
         if(digestOut.length != 32)
         {
           throw new Exception("digestOut.length != 32");
         }
         //Step:
         //We take next 32 bytes from the variable inputB32
         byte[] nextBytes = Arrays.copyOfRange(inputB32, i * 32, (i + 1) * 32);

         //Step: Take xor of 2 byte arrays (digestOut xor inputB)
         for (int j = 0; j < digestOut.length; j++) {
            nextBytes[j] ^= digestOut[j];
         }
         
         //Step:Append the result into D
         System.arraycopy(nextBytes, 0, outputB32, i * 32, nextBytes.length);
      }
      return outputB32;
   }
   public static byte[] secretKeyToByteArr(byte[]iv,String secretKey) throws Exception{
      //Step:Encode secretKey to bytes array, key
      byte[] key = secretKey.getBytes("UTF-8");
      if(iv==null){
         //Step:Create a new random IV for each encryption,but not for decryption
         iv = new byte[16];
         new SecureRandom().nextBytes(iv);
      }
      //Step:Concaternate 2 bytes arrays, iv and key
      byte[] keyB = new byte[iv.length + key.length];
      System.arraycopy(iv, 0, keyB, 0, iv.length);
      System.arraycopy(key, 0, keyB, iv.length, key.length);
      return keyB;
   }
   
    public static byte[] concatenateByteArrays(byte[] array1, byte[] array2) {
        // Create a new array large enough to hold both arrays
        byte[] result = new byte[array1.length + array2.length];

        // Copy the first array into the start of the result array
        System.arraycopy(array1, 0, result, 0, array1.length);

        // Copy the second array into the result array, starting right after the first array ends
        System.arraycopy(array2, 0, result, array1.length, array2.length);

        return result;
    }
}