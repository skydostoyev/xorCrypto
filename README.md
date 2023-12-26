# xorCrypto
You can encrypt a text with a password using this library. 
(Max input size:32,000,000 bytes)
```
String encrypted = encrypt("text","key");
String text = decrypt(encrypted,"key");
```
It has currently two language versions, java and javascript. Both output exactly same results for a same input.
Actually, roughly 90% of the code is by ChatGPT.
For ChatGPT, it may be extremely easy to implement the exact same algorithm in other languages.

Note that it is relatively very slow and not secure compared to AES as it entirely depends on xor operation only.
