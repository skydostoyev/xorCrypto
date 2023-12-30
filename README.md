# xorCrypto
With this library, you can encrypt text in UTF8 format using a password. However, please note that the password must consist of characters that are one byte each. 
(Max input size:32MB)
```
String encrypted = encrypt("text in utf8 format","password");
String text = decrypt(encrypted,"password");
```
It has currently two language versions, java and javascript. Both output exactly same results for a same input.


For ChatGPT, it may be extremely easy to implement the exact same algorithm in other languages.Actually, roughly 90% of the current code is by ChatGPT.

Note that it is relatively very slow and not secure compared to AES as it entirely depends on xor operation only.
