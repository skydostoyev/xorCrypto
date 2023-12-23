# xorCrypto
You can encrypt a short text with a password using this library. 
(Max input size:32,000,000 bytes)
Note that it is relatively very slow than AES as it depends on SHA256.
```
String encrypted = encrypt("text","key");
String text = decrypt(encrypted,"key");
```
It recursively generates random bytes from the key and using SHA256.
Through the loop, it takes xor with the bytes of the input.
As it generates the encryption key from the user password(secret key) with a iv, a random 16 bytes, the results will be different for a same input text. 

It has currntly two language versions, java and javascript.
And it is extremely easy to implement the exact same algorithm in other languages.
