# xorCrypto
You can encrypt a text with a password using this library. 
(Max input size:32,000,000 bytes)
Note that it is relatively very slow and not secure compared to AES as it entirely depends on xor operation only.
```
String encrypted = encrypt("text","key");
String text = decrypt(encrypted,"key");
```
It recursively generates random bytes from the key and using SHA256.
Through the loop, it takes xor with the bytes of the input.
As it generates the encryption key from the user password(secret key) together with a iv, a random 16 bytes, the results will be different for a same input text. 

It has currently two language versions, java and javascript. Both output exactly same results for a same input.
And for ChatGPT, it is extremely easy to implement the exact same algorithm in other languages.
