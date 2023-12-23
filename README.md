# xorCrypto
You can encrypto a text with a password with this library. 
```
String encrypted = encrypt("text","key");
String text = decrypt(encrypted,"key");

```
As it uses iv, random bytes, the results will be different for a same input. 
It has currntly two language versions, java and javascript.
And it is easy extremely easy to implement the algorithm in other languages.
