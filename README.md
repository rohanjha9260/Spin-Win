# 🎡 Vijay Offset Press — छठ पूजा स्पेशल ऑफर 2026 (Spin & Win)

**ESTD. 1973 | Main Road, Jaynagar, Madhubani**  
**Official Website:** [https://vijay-offset-press.netlify.app/](https://vijay-offset-press.netlify.app/)  
**Contact / WhatsApp:** +91 9931043211

---

## 🌟 प्रोजेक्ट फ़ीचर्स (Features)

1. **HTML5 Canvas Realistic Spin Wheel:**
   - 8 सटीक विकल्प (5% OFF, 10% OFF, ₹50 Cashback, छठ पूजा शुभकामनाएँ, ₹100 Cashback, Next Visit 10% OFF, Try Again, Surprise Gift)।
   - स्मूथ 60fps डिसेलेरेशन एनिमेशन (Cubic easing) और मैकेनिकल टिक-साउंड (Web Audio API - बिना किसी MP3 फ़ाइल के)।
   - जीतने पर रंग-बिरंगी कंफ़ेटी (Confetti Celebration)।

2. **मुनाफ़ा सुरक्षा प्रणाली (Profit Protection / Weighted Probability):**
   - **62% ग्राहक ₹0 आज के खर्च वाले ऑफर्स पाते हैं** (शुभकामनाएँ: 25%, नेक्स्ट विज़िट: 22%, ट्राई अगेन: 15%)।
   - **₹100 कैशबैक केवल 2% (दुर्लभ जैकपॉट)** है, जिससे दुकान का मार्जिन 100% सुरक्षित रहता है।
   - पहिया देखने में 100% निष्पक्ष (Fair) लगता है।

3. **कूपन कोड और सीधा WhatsApp Claim:**
   - प्रत्येक विजेता को ऑटोमैटिक कूपन कोड (जैसे `VOP-CHHATH-XXXX`) मिलता है।
   - 1 क्लिक में ग्राहक का नाम, बिल राशि और कूपन विजय ऑफसेट प्रेस के WhatsApp (+91 9931043211) पर पहुँच जाता है।

4. **नियम एवं शर्तें (₹500+ ऑर्डर और 1 स्पिन प्रति ग्राहक):**
   - LocalStorage के जरिए हर डिवाइस पर 1 बार स्पिन का नियम लागू है।

5. **स्टाफ सुरक्षा पिन (Staff PIN: `1973`):**
   - काउंटर स्टाफ किसी भी समय नए ग्राहक के लिए स्पिन रीसेट कर सकता है।

6. **शॉप काउंटर पोस्टर (Printable Poster):**
   - `poster.html` खोलकर सीधे A4 / 12x18 साइज़ में दुकान के काउंटर के लिए सुंदर QR पोस्टर प्रिंट किया जा सकता है।

---

## 🚀 लोकल कंप्यूटर पर कैसे चलाएँ (Run Locally)

टर्मिनल में रन करें:
```bash
python -m http.server 3000
```
ब्राउज़र में खोलें:
- **मेन स्पिन व्हील:** `http://localhost:3000/index.html`
- **काउंटर पोस्टर:** `http://localhost:3000/poster.html`

---

## ☁️ Netlify पर Live कैसे करें (Deployment)

1. [app.netlify.com/drop](https://app.netlify.com/drop) पर जाएँ।
2. पूरा **`Spin & Win`** फ़ोल्डर ड्रैग और ड्रॉप कर दें।
3. 10 सेकंड में साइट लाइव हो जाएगी।

---

## ⚙️ ऑप्शन्स और विनिंग चांस कैसे बदलें?

`script.js` फ़ाइल में लाइन 7 से 70 तक प्रत्येक विकल्प का `weight` लिखा है:
- यदि किसी ऑफर का चांस बढ़ाना हो, तो उसका `weight` बढ़ा दें।
- यदि किसी ऑफर को बंद करना हो, तो उसका `weight: 0` कर दें।

