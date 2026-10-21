# O‘qituvchi uchun qisqa qo‘llanma

1. Windows kompyuteriga bitta Setup.exe fayl orqali ilovani o‘rnating. O‘quvchi chizma yaratishi uchun Flowgorithm alohida o‘rnatilgan bo‘lishi kerak.
2. Ilovada ism kiriting va kod so‘rang. Kod bot orqali sozlangan Telegram chatiga keladi. Uni mos o‘quvchiga bering. 10 daqiqalik kod bir marta ishlatiladi; faollashtirishning amaldagi muddati bir yil.
3. Mavzuni oching. Darsni o‘qing, sinf ishi yoki uyga vazifani tanlang.
4. Flowgorithm’da yechim yarating. Har bir Input alohida qatordagi qiymatni o‘qiydi. Shart talab qilmagan savol yoki bezak matnini Output qilmang.
5. File → Save orqali .fprg saqlang va ilovaga tashlang. Yashirin testlar uchun kirish/chiqish qiymatlari berilmaydi.
6. Natijalarim orqali CSV saqlang. Sozlamalar orqali zaxira yarating. Zaxira tiklash mavjud yechimlarni o‘chirmaydi; faollashtirish boshqa kompyuterga ko‘chmaydi. Zaxira tiklash faqat yechilgan mashqlarni birlashtiradi, urinishlar tarixini emas.

## Natijalar

- Qabul qilindi: barcha testlar o‘tdi.
- Javob mos kelmadi: kamida bitta natija kutilgan natijadan farqli.
- Bajarilish xatosi: masalan, ortiqcha Input, noto‘g‘ri indeks yoki nolga bo‘lish.
- Fayl yoki blok xatosi: buzilgan XML, qo‘llanmaydigan blok yoki talab qilingan tuzilma yo‘q.
- Bajarish limiti: cheksiz sikl yoki juda ko‘p amal. Ilova ishlashda davom etadi.

Har bir mashq birinchi marta qabul qilinganda 10 XP hisoblanadi. Qayta yuborish XP’ni oshirmaydi. Mashqlar oilalarga asoslangan variantlardan iborat: ularni mustaqil imtihon savollari sifatida emas, ko‘nikma mashqi sifatida ishlating.

## Faollashtirish xatosi

Kod kelmasa botga avval Start yuborilganini va chat ID to‘g‘riligini tekshiring. Bir kompyuterdan 10 daqiqada uchta so‘rov mumkin. Secrets o‘zgarsa yangi build kerak; eski o‘rnatish fayli o‘z-o‘zidan yangilanmaydi.

Bot kaliti eski mexanizmda o‘rnatish fayliga joylanadi va ajratib olinishi mumkin. Keng tarqatishdan avval serverdagi faollashtirish xizmatiga o‘tish zarur.

## 0.3 versiyadagi yangi imkoniyatlar

- Mashqdagi **Saqlash** tugmasi orqali uni keyinga belgilang. Mashqlar sahifasida **Saqlanganlar** filtrini tanlang. Belgilar shu kompyuterda saqlanadi, JSON natija zaxirasiga kirmaydi.
- **Qayta ishlash** filtri hali yechilmagan va oxirgi urinishi xato bo‘lgan mashqlarni ko‘rsatadi.
- Fayl yuborgach **Chizma** bo‘limida yuklangan fayl bloklarini ko‘ring. Bu bajarilish animatsiyasi emas; murakkab chizmalar qisqartirib ko‘rsatilishi mumkin.
- **Diqqat rejimi** yon menyuni yashiradi. Escape orqali oddiy ko‘rinishga qayting.
- **Keyingi** tugmasi orqali mashqlarni ketma-ket bajaring. Mavzudagi so‘nggi mashqdan keyin navbatdagi mavzuga o‘tiladi.
