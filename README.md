# xorCrypto
With this library, you can encrypt text in UTF8 format using a password. 

Note that:
- Max input size:32MB.
- The password must consist of characters that are one byte each. 

```
String encrypted = encrypt("text in utf8 format","password");
String text = decrypt(encrypted,"password");
```
It has currently two language versions, java and javascript. Both output exactly same results for a same input.


For ChatGPT, it may be extremely easy to implement the exact same algorithm in other languages.Actually, roughly 90% of the current code is by ChatGPT.

Note that it is relatively very slow and not secure compared to AES as it entirely depends on xor operation using SHA256. Though well known security problems of xor only encryption are cared in the algorithm. For example, given some input text is known to the attacker hence the corresponding random bits used are known, the following random bits used are not trivially known.
