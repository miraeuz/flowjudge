# Nested If — masalalar to'plami va dizayn taklifi
*Mirae Academy created this*

Daraja: o'quvchilar Input, Assign, Output va oddiy `if` ni bilishadi. Bugungi mavzu — **ichma-ich if** (if ichida if).
Barcha masalalar hayotiy, matematik formulasiz. Formula kerak bo'lgan joyda u masalaning o'zida yozilgan. Qoldiq uchun `son mod 2`, tenglik uchun `=`, shartlarni birlashtirish uchun `VA` / `YOKI` (Flowgorithm'da `and` / `or`).

---
# 1-qism. Dizayn taklifi (Liquid Glass)

**Rang palitrasi.** Asos — yumshoq ko'k va binafsha; kun rejimida iliq oq-krem fon, tun rejimida chuqur indigo.
| Vazifa | Kun | Tun |
|---|---|---|
| Fon | `#F3EFE4` | `#060B20` |
| Shisha panel (sirt) | `#FFFDF8` 80% shaffoflik | `#0F1A42` 80% shaffoflik |
| Asosiy aksent (ko'k) | `#2446C9` | `#4A74FF` |
| Ikkinchi aksent (binafsha) | `#7B5CF0` | `#A98BFF` |
| To'g'ri / muvaffaqiyat | `#0E9F8F` | `#39DCC8` |
| Xato | `#D33A50` | `#FF7A8A` |
| Yutuq (oltin) | `#C98A12` | `#F7BD46` |

**Shisha panellar.** `backdrop-filter: blur(14–24px) saturate(1.4–1.6)`, 1 px och chegara, katta radius (22 px), yumshoq ko'p qatlamli soya. Orqa fonda ikki katta yumshoq gradient dog' (ko'k va binafsha) — panellar shuning uchun "shisha" bo'lib ko'rinadi.

**Kun/tun almashtirgichi.** Tugma emas, *kalit*: 70×35 px kapsula. Kunda osmon gradienti (ko'k→binafsha) va chap tomonda ☀, tunda chuqur indigo va o'ng tomonda ☾. Oq "ko'tarilgan" doira 350 ms yumshoq "sakrash" egri chizig'i bilan suriladi. `role="switch"` va `aria-checked` bilan, klaviatura bilan ham ishlaydi. Boshlang'ich holat — kompyuter tizimi rejimi.

**Logotip.** Binafsha-ko'k yumaloq kvadrat ichida **blok-sxema**: tepada oval (Start), strelka, romb (shart), o'ngga tarmoq-strelka va pastda to'rtburchak (amal). Yonida "Flowgorithm Academy", uning ostida kichik yozuv: **“Mirae Academy created this”**.

**Boshqaruv paneli (Dashboard).** Yuqori qator — salom + kunlik seriya (🔥) va XP (⚡). Keyin katta "Davom eting" kartasi (keyingi yechilmagan masala). Uchta statistika kartasi: daraja halqasi, yechilganlar, kutilayotganlar. Pastda mavzular katakchalari: har birida progress halqasi va chiziq. Chapda mavzular daraxti, qidiruv (`Ctrl+K`).

**Mikro-harakatlar.** Kartalar hoverda 3 px ko'tariladi, qatorlar 3 px suriladi, tugmalar 1 px ko'tariladi, fayl tashlash maydoni ustiga olib kelinganda biroz kattalashadi. `prefers-reduced-motion` yoqilgan bo'lsa barcha animatsiyalar o'chadi.

**Tipografiya.** Sarlavhalar — Unbounded, matn — Onest, kod — JetBrains Mono. Sarlavha o'lchami ekran kengligiga qarab silliq o'zgaradi.

**Ekranlar (tuzilma o'zgarmaydi).** Kirish (faollashtirish) → Bosh sahifa → Mavzu → Masala (ish stoli: fayl, kirish, Ishga tushirish, Yuborish) → Natija (har bir test uchun belgi) → Dars.

---
# 2-qism. Masalalar
Har bir masala avtomatik tekshiriladi (ilovada yashirin testlar bilan). Namunalar tekshiruv natijasidan olingan.

## A. Dars mashg'uloti — 30 ta

**1. Bog'cha qabuli**  
Bog'chaga 3 yoshdan 6 yoshgacha bolalar qabul qilinadi, lekin tibbiy ma'lumotnoma bo'lishi shart. Bolaning yoshi va ma'lumotnomasi (1 — bor, 0 — yo'q) kiritiladi. Yoshi 3 dan kichik bo'lsa “Yosh kichik”, 6 dan katta bo'lsa “Maktabga boring” deb chiqaring. Qolgan holatda ma'lumotnoma bo'lsa “Qabul qilindi”, bo'lmasa “Ma'lumotnoma kerak”.  
*Namuna:* kirish `2 1` → chiqish `Yosh kichik`; kirish `4 1` → chiqish `Qabul qilindi`

**2. Kutubxona a'zoligi**  
Kutubxona a'zosi (1 — a'zo, 0 — a'zo emas) va qo'lidagi kitoblar soni kiritiladi. A'zo bo'lmasa “Avval a'zo bo'ling”. A'zo bo'lsa: kitoblari 3 tadan kam bo'lsa “Kitob olishingiz mumkin”, aks holda “Avval kitob qaytaring”.  
*Namuna:* kirish `0 0` → chiqish `Avval a'zo bo'ling`; kirish `1 2` → chiqish `Kitob olishingiz mumkin`

**3. Avtobus yo'l haqi**  
Yo'lovchi yoshi va talaba guvohnomasi (1 — bor, 0 — yo'q) kiritiladi. 7 yoshgacha bolalar bepul (0 so'm). Qolganlarda: guvohnomasi bo'lsa 1000, bo'lmasa 60 va undan katta yoshdagilar uchun 1000, boshqalar uchun 2000 so'm. Yo'l haqini chiqaring.  
*Namuna:* kirish `5 0` → chiqish `0`; kirish `10 1` → chiqish `1000`

**4. Do'kon cheklovi**  
Mahsulot turi (1 — sut, 2 — energetik ichimlik) va xaridor yoshi kiritiladi. Sut hammaga sotiladi. Energetik ichimlik faqat 18 yoshdan boshlab sotiladi. “Sotiladi” yoki “Sotilmaydi” deb chiqaring.  
*Namuna:* kirish `1 8` → chiqish `Sotiladi`; kirish `2 17` → chiqish `Sotilmaydi`

**5. Maktabga kelish vaqti**  
Dars soat 8:00 da boshlanadi. O'quvchi kelgan soat va daqiqa kiritiladi. 8 dan oldin kelgan bo'lsa “Vaqtida”. Roppa-rosa 8 da kelgan bo'lsa: daqiqa 0 bo'lsa “Vaqtida”, aks holda “Kechikdingiz”. 8 dan keyin kelgan bo'lsa “Kechikdingiz”.  
*Namuna:* kirish `7 45` → chiqish `Vaqtida`; kirish `8 0` → chiqish `Vaqtida`

**6. Ob-havoga qarab kiyim**  
Havo harorati (butun son, minus ham bo'lishi mumkin) va yomg'ir (1 — yog'yapti, 0 — yo'q) kiritiladi. Harorat 10 dan past bo'lsa: yomg'irda “Qalin kurtka va soyabon”, aks holda “Qalin kurtka”. Harorat 10 yoki undan yuqori bo'lsa: yomg'irda “Soyabon oling”, aks holda “Yengil kiyim”.  
*Namuna:* kirish `-3 0` → chiqish `Qalin kurtka`; kirish `9 1` → chiqish `Qalin kurtka va soyabon`

**7. Imtihondan o'tish**  
O'quvchining imtihon bali va davomati (foizda) kiritiladi. Ball 55 dan kam bo'lsa “Qayta topshiring”. Ball yetarli bo'lsa: davomat 80 yoki undan yuqori bo'lsa “O'tdi”, aks holda “Davomat yetarli emas”.  
*Namuna:* kirish `70 90` → chiqish `O'tdi`; kirish `55 80` → chiqish `O'tdi`

**8. Kinoga kirish**  
Film 16 yoshdan katta tomoshabinlar uchun. Tomoshabin yoshi kiritiladi. 16 va undan katta bo'lsa “Kirishingiz mumkin”. 12 dan 15 gacha bo'lsa “Kattalar bilan kiring”. 12 dan kichik bo'lsa “Kirish mumkin emas”.  
*Namuna:* kirish `20` → chiqish `Kirishingiz mumkin`; kirish `16` → chiqish `Kirishingiz mumkin`

**9. Bankomat**  
Bankomatda avval PIN to'g'riligi (1 — to'g'ri, 0 — xato), keyin hisobdagi pul va yechmoqchi bo'lgan summa kiritiladi. PIN xato bo'lsa “PIN xato”. To'g'ri bo'lsa: summa hisobdagi puldan oshmasa “Pul berildi”, aks holda “Mablag' yetarli emas”.  
*Namuna:* kirish `1 100000 50000` → chiqish `Pul berildi`; kirish `1 100000 100000` → chiqish `Pul berildi`

**10. Futbol natijasi**  
Futbol o'yinida birinchi va ikkinchi jamoa urgan gollar soni kiritiladi. Birinchisi ko'p urgan bo'lsa “Birinchi jamoa yutdi”, gollar teng bo'lsa “Durang”, aks holda “Ikkinchi jamoa yutdi” deb chiqaring.  
*Namuna:* kirish `3 1` → chiqish `Birinchi jamoa yutdi`; kirish `2 2` → chiqish `Durang`

**11. Mehmonxona xonasi**  
Hafta oxiri (1 — ha, 0 — yo'q) va mehmonlar soni kiritiladi. Hafta oxirida: 2 kishigacha 300000, undan ko'p bo'lsa 450000 so'm. Oddiy kunda: 2 kishigacha 200000, undan ko'p bo'lsa 320000 so'm. Narxni chiqaring.  
*Namuna:* kirish `1 2` → chiqish `300000`; kirish `1 4` → chiqish `450000`

**12. Taksi narxi**  
Masofa (km, butun) va tunmi (1 — tun, 0 — kunduz) kiritiladi. 3 km gacha (3 ham): kunduz 10000, tunda 15000 so'm. 3 km dan uzoq bo'lsa: kunduz 18000, tunda 25000 so'm. Narxni chiqaring.  
*Namuna:* kirish `2 0` → chiqish `10000`; kirish `3 1` → chiqish `15000`

**13. Samolyotda yuk**  
Yuk og'irligi (kg) va biznes-klass chiptasi (1 — bor, 0 — yo'q) kiritiladi. 20 kg gacha — “Bepul”. 21–30 kg orasida: biznes-klass bo'lsa “Bepul”, aks holda “To'lov kerak”. 30 kg dan og'ir bo'lsa “To'lov kerak”.  
*Namuna:* kirish `15 0` → chiqish `Bepul`; kirish `20 1` → chiqish `Bepul`

**14. Dorixonada**  
Dori turi (1 — oddiy, 2 — retsept bilan sotiladigan) va xaridorda retsept bor-yo'qligi (1 — bor, 0 — yo'q) kiritiladi. Oddiy dori hammaga sotiladi. Retseptli dori faqat retsept bo'lsa sotiladi. “Sotiladi” yoki “Retsept kerak” deb chiqaring.  
*Namuna:* kirish `1 0` → chiqish `Sotiladi`; kirish `2 1` → chiqish `Sotiladi`

**15. Sport seksiyasiga tanlov**  
Seksiyaga 10 yoshdan 14 yoshgacha (ikkalasi ham kiradi) bolalar olinadi. Yosh va bo'y (sm) kiritiladi. Yosh mos bo'lmasa “Yosh mos emas”. Yosh mos bo'lsa: bo'y 140 yoki undan baland bo'lsa “Qabul qilindi”, aks holda “Bo'y yetmaydi”.  
*Namuna:* kirish `12 150` → chiqish `Qabul qilindi`; kirish `10 140` → chiqish `Qabul qilindi`

**16. Avtoturargoh**  
Turargohda qolgan soat (butun) va imtiyoz kartasi (1 — bor, 0 — yo'q) kiritiladi. Karta bo'lsa to'lov 0. Karta yo'q bo'lsa: 1 soatgacha bepul (0), undan ko'p bo'lsa to'lov = (soat − 1) × 2000 so'm. To'lovni chiqaring.  
*Namuna:* kirish `1 0` → chiqish `0`; kirish `4 0` → chiqish `6000`

**17. Maktab bufeti**  
O'quvchining puli kiritiladi. Osh narxi 8000 so'm. Pul 8000 dan kam bo'lsa “Pulingiz yetmaydi”. Pul yetsa: 12000 yoki undan ko'p bo'lsa “Ichimlik ham oling”, aks holda “Faqat taom oling”.  
*Namuna:* kirish `7999` → chiqish `Pulingiz yetmaydi`; kirish `8000` → chiqish `Faqat taom oling`

**18. Test natijasi**  
Testda 20 ta savol bor. To'g'ri javoblar soni kiritiladi. 18 va undan ko'p — “A'lo”, 14–17 — “Yaxshi”, 10–13 — “Qoniqarli”, 10 dan kam — “Qoniqarsiz”.  
*Namuna:* kirish `20` → chiqish `A'lo`; kirish `18` → chiqish `A'lo`

**19. Eshik qulfi**  
Eshik ikki bosqichli: kod to'g'ri (1) yoki xato (0), keyin barmoq izi mos (1) yoki mos emas (0). Kod xato bo'lsa “Kod xato”. Kod to'g'ri bo'lsa: barmoq izi mos bo'lsa “Ochildi”, aks holda “Barmoq izi kerak”.  
*Namuna:* kirish `1 1` → chiqish `Ochildi`; kirish `1 0` → chiqish `Barmoq izi kerak`

**20. Maktab ochiqmi?**  
Hafta kuni (1 — dushanba ... 7 — yakshanba) va soat kiritiladi. 6 va 7-kunlar “Dam olish kuni”. Ish kunlarida soat 8 dan 14 gacha (14 kirmaydi) “Maktab ochiq”, boshqa vaqtda “Maktab yopiq”.  
*Namuna:* kirish `3 9` → chiqish `Maktab ochiq`; kirish `1 7` → chiqish `Maktab yopiq`

**21. Velosiped ijarasi**  
Ijarachi yoshi va shlem bor-yo'qligi (1 — bor, 0 — yo'q) kiritiladi. 12 yoshdan kichiklarga “Katta kishi kerak”. 12 va undan kattalarga: shlem bo'lsa “Ijara mumkin”, aks holda “Shlem taqing”.  
*Namuna:* kirish `15 1` → chiqish `Ijara mumkin`; kirish `12 0` → chiqish `Shlem taqing`

**22. Meva chegirmasi**  
Xarid qilingan meva kg (butun) va do'kon kartasi (1 — bor, 0 — yo'q) kiritiladi. 5 kg va undan ko'p olinsa: kartada 15%, kartasiz 10% chegirma. 5 kg dan kam bo'lsa: kartada 5%, kartasiz chegirma yo'q (0). Chegirma foizini chiqaring.  
*Namuna:* kirish `6 1` → chiqish `15`; kirish `5 0` → chiqish `10`

**23. Xona harorati**  
Xona harorati va deraza holati (1 — ochiq, 0 — yopiq) kiritiladi. Harorat 25 dan yuqori bo'lsa: deraza yopiq bo'lsa “Derazani oching”, ochiq bo'lsa “Ventilyatorni yoqing”. Harorat 18 dan past bo'lsa “Isitgichni yoqing”. Boshqa holatda “Hammasi joyida”.  
*Namuna:* kirish `30 0` → chiqish `Derazani oching`; kirish `26 1` → chiqish `Ventilyatorni yoqing`

**24. Kitob jarimasi**  
Kitobni necha kun kechikib qaytarilgani kiritiladi. Kechikish 0 bo'lsa jarima 0. 1–7 kun bo'lsa jarima = kun × 500 so'm. 7 kundan ko'p bo'lsa jarima = 3500 + (kun − 7) × 1000 so'm. Jarimani chiqaring.  
*Namuna:* kirish `0` → chiqish `0`; kirish `3` → chiqish `1500`

**25. Rasm to'garagi**  
Bolaning yoshi va rasm chizish tajribasi (1 — bor, 0 — yo'q) kiritiladi. 8 yoshgacha — “Kichiklar guruhi”. 8–12 yosh: tajribasi bor bo'lsa “O'rta guruh”, yo'q bo'lsa “Kichiklar guruhi”. 12 dan katta: tajribasi bor bo'lsa “Katta guruh”, yo'q bo'lsa “O'rta guruh”.  
*Namuna:* kirish `6 1` → chiqish `Kichiklar guruhi`; kirish `8 1` → chiqish `O'rta guruh`

**26. Konsert chiptasi**  
Qator raqami (1–20) va VIP karta (1 — bor, 0 — yo'q) kiritiladi. 1–5 qatorlar: VIP kartada 100000, kartasiz 150000. 6–15 qatorlar: VIP kartada 60000, kartasiz 80000. 16–20 qatorlar: hamma uchun 40000 so'm. Chipta narxini chiqaring.  
*Namuna:* kirish `3 1` → chiqish `100000`; kirish `5 0` → chiqish `150000`

**27. Lift**  
Liftdagi odamlar soni va yuk og'irligi (kg) kiritiladi. Liftga 6 kishigacha mumkin. Odam ko'p bo'lsa “Odam ko'p”. Odam soni mos bo'lsa: yuk 500 kg dan oshmasa “Chiqing”, oshsa “Yuk og'ir”.  
*Namuna:* kirish `4 300` → chiqish `Chiqing`; kirish `6 500` → chiqish `Chiqing`

**28. Telefon tarifi**  
Oylik gaplashish daqiqasi va internet GB kiritiladi. Daqiqa 100 gacha (100 ham): internet 5 GB gacha bo'lsa “Mini”, undan ko'p bo'lsa “Standart”. Daqiqa 100 dan ko'p: internet 5 GB gacha bo'lsa “Standart”, undan ko'p bo'lsa “Maksimal”.  
*Namuna:* kirish `50 3` → chiqish `Mini`; kirish `100 6` → chiqish `Standart`

**29. Suzish havzasi**  
Yosh, suzishni bilish (1 — biladi, 0 — bilmaydi) va tibbiy ma'lumotnoma (1 — bor, 0 — yo'q) kiritiladi. 7 yoshgacha “Kattalar bilan kiring”. Keyin ma'lumotnoma bo'lmasa “Ma'lumotnoma kerak”. Ma'lumotnoma bor bo'lsa: suzishni bilsa “Chuqur havza”, bilmasa “Sayoz havza”.  
*Namuna:* kirish `5 0 1` → chiqish `Kattalar bilan kiring`; kirish `10 1 0` → chiqish `Ma'lumotnoma kerak`

**30. Telefon zaryadi**  
Batareya foizi va zaryadlovchi ulanganligi (1 — ulangan, 0 — yo'q) kiritiladi. Zaryad 10% yoki kam bo'lsa: zaryadlovchi ulangan bo'lsa “Zaryadlanmoqda”, aks holda “Zaryadlang”. 11–50% bo'lsa “O'rtacha”. 50% dan ko'p bo'lsa “Yaxshi”.  
*Namuna:* kirish `5 1` → chiqish `Zaryadlanmoqda`; kirish `10 0` → chiqish `Zaryadlang`

## B. Uyga vazifa — 40 ta

**31. Kitob sahifasi**  
Sahifa raqami kiritiladi. Agar son mod 2 = 0 bo'lsa (juft): son mod 4 = 0 bo'lsa “Juft, 4 ga bo'linadi”, aks holda “Juft”. Agar son mod 2 = 0 bo'lmasa — “Toq”.  
*Namuna:* kirish `8` → chiqish `Juft, 4 ga bo'linadi`; kirish `10` → chiqish `Juft`

**32. Bank oynasi**  
Navbat raqami kiritiladi. Son mod 2 = 0 bo'lsa “Chap oyna”. Aks holda: son mod 3 = 0 bo'lsa “Markaziy oyna”, bo'lmasa “O'ng oyna”.  
*Namuna:* kirish `4` → chiqish `Chap oyna`; kirish `3` → chiqish `Markaziy oyna`

**33. Lotereya**  
Lotereya chiptasi raqami kiritiladi. Son mod 5 = 0 bo'lsa yutuq bor: son mod 2 = 0 bo'lsa “Katta sovg'a”, aks holda “Kichik sovg'a”. Son mod 5 = 0 bo'lmasa “Yutuq yo'q”.  
*Namuna:* kirish `10` → chiqish `Katta sovg'a`; kirish `15` → chiqish `Kichik sovg'a`

**34. Sinf navbatchiligi**  
Oyning kuni (1–31) kiritiladi. Son mod 7 = 0 bo'lsa “Dam olish kuni”. Aks holda: son mod 2 = 0 bo'lsa “A guruh”, bo'lmasa “B guruh” navbatchi.  
*Namuna:* kirish `14` → chiqish `Dam olish kuni`; kirish `7` → chiqish `Dam olish kuni`

**35. Muzey chiptasi**  
Yosh va guruh bilan kelish (1 — ha, 0 — yo'q) kiritiladi. 5 yoshgacha (5 ham) — 0. 6–17 yosh: guruh bilan bo'lsa 5000, yakka bo'lsa 10000. 18 va undan katta: 60 yoshdan katta (60 ham) bo'lsa 8000, aks holda 20000 so'm.  
*Namuna:* kirish `4 0` → chiqish `0`; kirish `10 1` → chiqish `5000`

**36. Maktab tanlovi**  
Ikki bosqichdagi ballar kiritiladi. Ikkalasi ham 50 yoki undan yuqori bo'lsa “Finalga chiqdi”. Aks holda bittasi 50 yoki yuqori bo'lsa “Zaxirada”. Ikkalasi ham past bo'lsa “Chiqib ketdi”.  
*Namuna:* kirish `60 70` → chiqish `Finalga chiqdi`; kirish `50 50` → chiqish `Finalga chiqdi`

**37. Hamyon va narx**  
Hamyondagi pul va mahsulot narxi kiritiladi. Pul yetmasa “Yetmaydi” deb chiqaring. Yetsa qaytimni chiqaring: qaytim = pul − narx.  
*Namuna:* kirish `10000 7500` → chiqish `2500`; kirish `5000 5000` → chiqish `0`

**38. Oylik mukofot**  
Ishlangan kunlar soni va reja bajarilganligi (1 — ha, 0 — yo'q) kiritiladi. Kamida 22 kun ishlanmagan bo'lsa mukofot 0. 22 va undan ko'p kun ishlangan bo'lsa: reja bajarilgan bo'lsa 300000, bajarilmagan bo'lsa 100000 so'm. Mukofotni chiqaring.  
*Namuna:* kirish `25 1` → chiqish `300000`; kirish `22 0` → chiqish `100000`

**39. Piyoda o'tish joyi**  
Svetofor (1 — yashil, 0 — qizil) va yaqinlashayotgan mashina bor-yo'qligi (1 — bor, 0 — yo'q) kiritiladi. Qizil bo'lsa “Kuting”. Yashil bo'lsa: mashina bor bo'lsa “Ehtiyot bo'ling”, yo'q bo'lsa “O'ting”.  
*Namuna:* kirish `1 0` → chiqish `O'ting`; kirish `1 1` → chiqish `Ehtiyot bo'ling`

**40. Uch savollik test**  
Uchta savolga javob kiritiladi: to'g'ri — 1, xato — 0. Uchalasi to'g'ri bo'lsa “A'lo”, ikkitasi “Yaxshi”, bittasi “Qoniqarli”, hech biri bo'lmasa “Qayta topshiring” deb chiqaring.  
*Namuna:* kirish `1 1 1` → chiqish `A'lo`; kirish `1 0 1` → chiqish `Yaxshi`

**41. Sinfdoshlar yig'ilishi**  
Yig'ilishga kelganlar soni kiritiladi. Zalga 30 kishi sig'adi. 30 dan ko'p bo'lsa “Zal kichik”. Aks holda: kamida 10 kishi bo'lsa “Yig'ilish bo'ladi”, kam bo'lsa “Odam kam”.  
*Namuna:* kirish `20` → chiqish `Yig'ilish bo'ladi`; kirish `10` → chiqish `Yig'ilish bo'ladi`

**42. Internet sifati**  
Tezlik (Mbit/s) va ping (millisekund) kiritiladi. Tezlik 50 yoki yuqori bo'lsa: ping 30 yoki kam bo'lsa “A'lo”, aks holda “Yaxshi”. Tezlik 10–49 bo'lsa “O'rtacha”. 10 dan past bo'lsa “Sekin”.  
*Namuna:* kirish `100 20` → chiqish `A'lo`; kirish `50 31` → chiqish `Yaxshi`

**43. Kassadagi chegirma**  
Do'kon kartasi (1 — bor, 0 — yo'q) va xarid summasi kiritiladi. Karta bor bo'lsa: summa 100000 yoki ko'p bo'lsa 10%, aks holda 5% chegirma. Karta yo'q bo'lsa: summa 200000 yoki ko'p bo'lsa 5%, aks holda chegirma yo'q (0). Foizni chiqaring.  
*Namuna:* kirish `1 150000` → chiqish `10`; kirish `1 50000` → chiqish `5`

**44. Yosh toifasi**  
Yosh kiritiladi. 0–2 — “Chaqaloq”, 3–6 — “Maktabgacha”, 7–17 — “O'quvchi”, 18–59 — “Katta”, 60 va undan katta — “Keksa” deb chiqaring.  
*Namuna:* kirish `1` → chiqish `Chaqaloq`; kirish `2` → chiqish `Chaqaloq`

**45. Sayrga chiqish**  
Havo harorati va yomg'ir (1 — yog'yapti, 0 — yo'q) kiritiladi. Harorat 15 dan 30 gacha (ikkalasi ham kiradi) VA yomg'ir yo'q bo'lsa “Sayrga boring”. Aks holda yomg'ir yog'sa “Uyda qoling”, yog'masa “Havo noqulay”.  
*Namuna:* kirish `20 0` → chiqish `Sayrga boring`; kirish `15 0` → chiqish `Sayrga boring`

**46. Benzin yetadimi?**  
Mashinada benzin (litr) va borish kerak bo'lgan masofa (km) kiritiladi. Mashina 1 litrga 10 km yuradi, yuradigan masofa = litr × 10. Yetmasa “Yetmaydi”. Yetsa: zaxira (yuradigan masofa − kerakli masofa) 50 km yoki ko'p bo'lsa “Yetadi, zaxira bor”, aks holda “Zo'rg'a yetadi”.  
*Namuna:* kirish `40 300` → chiqish `Yetadi, zaxira bor`; kirish `40 360` → chiqish `Zo'rg'a yetadi`

**47. Parol kuchi**  
Parol uzunligi, bosh harf bor-yo'qligi (1/0) va raqam bor-yo'qligi (1/0) kiritiladi. Uzunlik 6 dan kam bo'lsa “Juda qisqa”. Aks holda: ikkalasi ham bo'lsa “Kuchli”, bittasi bo'lsa “O'rtacha”, hech biri bo'lmasa “Zaif”.  
*Namuna:* kirish `4 1 1` → chiqish `Juda qisqa`; kirish `6 1 1` → chiqish `Kuchli`

**48. Bolalar konserti**  
Tomoshabin yoshi va kattalar hamrohligi (1 — bor, 0 — yo'q) kiritiladi. 12 yoshdan kichiklar faqat kattalar bilan kiradi: hamroh bor bo'lsa “Kirish mumkin”, yo'q bo'lsa “Kirish mumkin emas”. 12 va undan kattalar hamroh­siz ham “Kirish mumkin”.  
*Namuna:* kirish `8 1` → chiqish `Kirish mumkin`; kirish `8 0` → chiqish `Kirish mumkin emas`

**49. Hovuz ish vaqti**  
Soat va hafta kuni (1–7) kiritiladi. Hovuz 8:00 dan 20:00 gacha (20 kirmaydi) ishlaydi, lekin yakshanba (7) kuni faqat 14:00 gacha (14 kirmaydi). Ochiq bo'lsa “Ochiq”, aks holda “Yopiq”.  
*Namuna:* kirish `9 3` → chiqish `Ochiq`; kirish `19 1` → chiqish `Ochiq`

**50. Kurs to'lovi**  
To'lov qilinganligi (1 — ha, 0 — yo'q) va oyning bugungi kuni kiritiladi. To'lov qilingan bo'lsa “Darsga kiring”. Qilinmagan bo'lsa: oyning 5-kunigacha (5 ham) “Ogohlantirish”, undan keyin “Dars yopiq”.  
*Namuna:* kirish `1 10` → chiqish `Darsga kiring`; kirish `0 3` → chiqish `Ogohlantirish`

**51. Yozma va og'zaki**  
Fandan yozma va og'zaki ballar kiritiladi. Ikkalasi ham 50 yoki yuqori bo'lsa: ikkalasining yig'indisi 160 yoki ko'p bo'lsa “A'lo”, aks holda “Yaxshi”. Faqat bittasi 50 yoki yuqori bo'lsa “Qoniqarli”. Ikkalasi ham past bo'lsa “Qoniqarsiz”.  
*Namuna:* kirish `90 80` → chiqish `A'lo`; kirish `60 70` → chiqish `Yaxshi`

**52. Tezlik jarimasi**  
Haydovchilik guvohnomasi (1 — bor, 0 — yo'q) va tezlik (km/soat) kiritiladi. Guvohnoma yo'q bo'lsa jarima 1000000. Bor bo'lsa: tezlik 60 gacha 0, 61–80 oralig'ida 200000, 80 dan yuqori bo'lsa 500000 so'm. Jarimani chiqaring.  
*Namuna:* kirish `1 50` → chiqish `0`; kirish `1 60` → chiqish `0`

**53. Ovqat vaqti**  
Soat (0–23) kiritiladi. 7–9 (9 ham) “Nonushta”, 12–14 “Tushlik”, 18–20 “Kechki ovqat”. Boshqa vaqtda “Ovqat vaqti emas”.  
*Namuna:* kirish `8` → chiqish `Nonushta`; kirish `7` → chiqish `Nonushta`

**54. Dars qoldirish**  
Qoldirilgan darslar soni va sabab bor-yo'qligi (1 — bor, 0 — yo'q) kiritiladi. 0 bo'lsa “Barakalla”. 1–3 ta bo'lsa: sabab bo'lsa “Kechiriladi”, bo'lmasa “Ogohlantirish”. 3 tadan ko'p bo'lsa “Ota-onani chaqiring”.  
*Namuna:* kirish `0 0` → chiqish `Barakalla`; kirish `2 1` → chiqish `Kechiriladi`

**55. Fan olimpiadasi**  
Sinf va olimpiada bali kiritiladi. Mukofot uchun kerakli ball: 1–4 sinf uchun 40, 5–8 sinf uchun 60, 9–11 sinf uchun 75. Ball yetarli bo'lsa “Mukofot”, aks holda “Ishtirok”.  
*Namuna:* kirish `3 40` → chiqish `Mukofot`; kirish `4 39` → chiqish `Ishtirok`

**56. Gul do'koni**  
Gullar soni va bayram kuni bo'lish-bo'lmasligi (1/0) kiritiladi. 11 yoki undan ko'p gul olinsa: bayramda “Sovg'a qutisi”, oddiy kunda “Chegirma 10%”. 10 tagacha olinsa: bayramda “Chegirma 5%”, oddiy kunda “Chegirma yo'q”.  
*Namuna:* kirish `15 1` → chiqish `Sovg'a qutisi`; kirish `11 0` → chiqish `Chegirma 10%`

**57. Aeroportda ro'yxat**  
Chipta (1/0), pasport (1/0) va yuk og'irligi (kg) kiritiladi. Chipta VA pasport bo'lsa: yuk 20 kg gacha bo'lsa “Ro'yxatdan o'tdingiz”, og'ir bo'lsa “Yuk uchun to'lang”. Hujjatlardan biri yo'q bo'lsa “Hujjat yetishmaydi”.  
*Namuna:* kirish `1 1 15` → chiqish `Ro'yxatdan o'tdingiz`; kirish `1 1 20` → chiqish `Ro'yxatdan o'tdingiz`

**58. Kompyuter o'yini**  
O'yin balli va qolgan jon soni kiritiladi. Jon 0 bo'lsa “O'yin tugadi”. Aks holda: ball 1000 yoki ko'p bo'lsa “G'alaba”, 500–999 bo'lsa “Keyingi bosqich”, 500 dan kam bo'lsa “Davom eting”.  
*Namuna:* kirish `2000 0` → chiqish `O'yin tugadi`; kirish `1000 3` → chiqish `G'alaba`

**59. Maktab hamshirasi**  
Tana harorati (butun daraja) va yo'tal bor-yo'qligi (1/0) kiritiladi. Harorat 38 yoki yuqori VA yo'tal bo'lsa “Uyga ketsin”. Aks holda bittasi bo'lsa “Kuzatuv”. Ikkalasi ham bo'lmasa “Darsga kirsin”.  
*Namuna:* kirish `39 1` → chiqish `Uyga ketsin`; kirish `38 0` → chiqish `Kuzatuv`

**60. Uy raqami**  
Ko'cha bo'ylab uy raqami kiritiladi. Son mod 2 = 0 bo'lsa uy o'ng tomonda, aks holda chap tomonda. Raqam 50 yoki kam bo'lsa ko'chaning boshida, ko'p bo'lsa oxirida. “O'ng tomon, boshida” kabi chiqaring (“Chap tomon, oxirida” ham mumkin).  
*Namuna:* kirish `12` → chiqish `O'ng tomon, boshida`; kirish `60` → chiqish `O'ng tomon, oxirida`

**61. Tug'ilgan kun**  
Yosh kiritiladi. Yosh mod 10 = 0 bo'lsa yubiley: 50 yoki katta bo'lsa “Katta bayram”, aks holda “Yubiley”. Yosh mod 10 = 0 bo'lmasa “Oddiy tug'ilgan kun”.  
*Namuna:* kirish `20` → chiqish `Yubiley`; kirish `50` → chiqish `Katta bayram`

**62. Mehmonga choy**  
Uyda choy (1/0), shakar (1/0) va limon (1/0) bor-yo'qligi kiritiladi. Choy yo'q bo'lsa “Choy yo'q”. Choy bor bo'lsa: shakar va limon bo'lsa “Limonli shirin choy”, faqat shakar bo'lsa “Shirin choy”, faqat limon bo'lsa “Limonli choy”, ikkalasi ham yo'q bo'lsa “Oddiy choy”.  
*Namuna:* kirish `0 1 1` → chiqish `Choy yo'q`; kirish `1 1 1` → chiqish `Limonli shirin choy`

**63. Ombor zaxirasi**  
Ombordagi mahsulot soni kiritiladi. 50 yoki ko'p — “Zaxira yetarli”. 10–49 — “Buyurtma bering”. 1–9 — “Shoshilinch buyurtma”. 0 bo'lsa “Ombor bo'sh”.  
*Namuna:* kirish `100` → chiqish `Zaxira yetarli`; kirish `50` → chiqish `Zaxira yetarli`

**64. Sayohat avtobuslari**  
Ota-onalar ruxsati (1 — hammasidan olingan, 0 — yo'q) va o'quvchilar soni kiritiladi. Ruxsat yo'q bo'lsa “Sayohat bekor”. Ruxsat bo'lsa kerakli avtobus sonini chiqaring: 30 kishigacha 1 ta, 31–60 kishi 2 ta, undan ko'p bo'lsa 3 ta.  
*Namuna:* kirish `0 20` → chiqish `Sayohat bekor`; kirish `1 20` → chiqish `1`

**65. Ko'cha chirog'i**  
Soat (0–23) va osmon bulutli-bulutsizligi (1 — bulutli, 0 — ochiq) kiritiladi. Soat 20 yoki undan keyin, yoki 6 dan oldin chiroq doim yonadi. Kunduzi faqat bulutli bo'lsa yonadi. “Chiroq yoniq” yoki “Chiroq o'chiq” deb chiqaring.  
*Namuna:* kirish `21 0` → chiqish `Chiroq yoniq`; kirish `3 0` → chiqish `Chiroq yoniq`

**66. Qarz eslatmasi**  
Qarz summasi va muddat o'tganligi (1 — ha, 0 — yo'q) kiritiladi. Qarz 0 bo'lsa “Qarz yo'q”. Qarz bor bo'lsa: muddat o'tgan bo'lsa qarz 100000 dan ko'p bo'lganda “Sudga beriladi”, aks holda “Eslatma yuboriladi”. Muddat o'tmagan bo'lsa “Muddati bor”.  
*Namuna:* kirish `0 1` → chiqish `Qarz yo'q`; kirish `50000 1` → chiqish `Eslatma yuboriladi`

**67. Sinf reytingi**  
O'quvchining sinfdagi o'rni kiritiladi. 1-o'rin — “Birinchi o'rin”, 2–3 — “Sovrindor”, 4–10 — “Faol o'quvchi”, undan keyingilar — “Harakat qiling”.  
*Namuna:* kirish `1` → chiqish `Birinchi o'rin`; kirish `2` → chiqish `Sovrindor`

**68. Xavfsizlik kamerasi**  
Yorug'lik darajasi (0–100) va harakat bor-yo'qligi (1/0) kiritiladi. Yorug'lik 30 dan past bo'lsa: harakat bo'lsa “Chiroq yoqilsin va yozilsin”, bo'lmasa “Chiroq yoqilsin”. Yorug'lik yetarli bo'lsa: harakat bo'lsa “Yozilsin”, bo'lmasa “Kutish rejimi”.  
*Namuna:* kirish `10 1` → chiqish `Chiroq yoqilsin va yozilsin`; kirish `29 0` → chiqish `Chiroq yoqilsin`

**69. O'yinchoq tanlash**  
O'yinchoq turi (1 — konstruktor, 2 — qo'g'irchoq, 3 — mashinacha) va bola yoshi kiritiladi. Konstruktor 6 yoshdan, qo'g'irchoq 3 yoshdan, mashinacha 2 yoshdan mos. “Mos” yoki “Mos emas” deb chiqaring.  
*Namuna:* kirish `1 6` → chiqish `Mos`; kirish `1 5` → chiqish `Mos emas`

**70. Telefon hisobi**  
Telefon balansi (manfiy ham bo'lishi mumkin) kiritiladi. 0 yoki undan kam bo'lsa: roppa-rosa 0 bo'lsa “Hisob nol”, manfiy bo'lsa “Qarzdorlik”. Musbat bo'lsa: 10000 dan kam bo'lsa “Kam”, aks holda “Yetarli”.  
*Namuna:* kirish `0` → chiqish `Hisob nol`; kirish `-500` → chiqish `Qarzdorlik`

## C. Qo'shimcha — 30 ta

**71. Chempionat ochkosi**  
Birinchi jamoa va ikkinchi jamoa urgan gollar kiritiladi. Birinchi jamoa uchun ochko: g'alaba — 3, durang — 1, mag'lubiyat — 0. Ochkoni chiqaring.  
*Namuna:* kirish `2 1` → chiqish `3`; kirish `1 1` → chiqish `1`

**72. Yugurish medali**  
Yosh va yugurish vaqti (soniya) kiritiladi. Medal uchun kerakli vaqt: 12 yoshgacha 60 gacha, 13–17 yosh 55 gacha, 18 va undan katta 50 gacha (chegara ham kiradi). “Medal” yoki “Ishtirok” deb chiqaring.  
*Namuna:* kirish `10 60` → chiqish `Medal`; kirish `12 61` → chiqish `Ishtirok`

**73. Basketbol o'yinchisi**  
O'yinchi to'plagan ochko va qilgan xatolar soni kiritiladi. Xato 5 yoki ko'p bo'lsa “Maydondan chiqdi”. Aks holda ochko 20 yoki ko'p bo'lsa “Eng yaxshi o'yinchi”, kam bo'lsa “O'yin davom etadi”.  
*Namuna:* kirish `25 5` → chiqish `Maydondan chiqdi`; kirish `25 4` → chiqish `Eng yaxshi o'yinchi`

**74. Velosiped poygasi**  
Yosh, shlem (1/0) va tormoz sozligi (1/0) kiritiladi. 10 yoshdan kichik bo'lsa “Katta kishi kerak”. Aks holda: shlem VA tormoz bo'lsa “Startga”; shlem bor-u tormoz nosoz bo'lsa “Tormozni tuzating”; shlem yo'q bo'lsa “Shlem taqing”.  
*Namuna:* kirish `9 1 1` → chiqish `Katta kishi kerak`; kirish `12 1 1` → chiqish `Startga`

**75. Omonat turi**  
Omonat summasi va muddati (oy) kiritiladi. 10000000 va undan ko'p bo'lsa: muddat 12 oy yoki ko'p bo'lsa “Premium”, aks holda “Standart”. 1000000–9999999 oralig'ida “Standart”. Undan kam bo'lsa “Oddiy”.  
*Namuna:* kirish `20000000 12` → chiqish `Premium`; kirish `10000000 6` → chiqish `Standart`

**76. O'tkazma komissiyasi**  
O'tkazma summasi va o'z kartangizga o'tkazish (1 — ha, 0 — yo'q) kiritiladi. O'z kartasiga bo'lsa komissiya 0. Boshqa kartaga: 500000 gacha 1000, undan ko'p bo'lsa 3000 so'm. Komissiyani chiqaring.  
*Namuna:* kirish `100000 1` → chiqish `0`; kirish `100000 0` → chiqish `1000`

**77. Kechikish jarimasi**  
To'lovni necha kun kechiktirilgani kiritiladi. 0 kun — jarima 0. 1–10 kun — 10000. 11–30 kun — 50000. 30 kundan ko'p — 150000 so'm. Jarimani chiqaring.  
*Namuna:* kirish `0` → chiqish `0`; kirish `1` → chiqish `10000`

**78. Poyezd o'rindig'i**  
O'rindiq turi (1 — umumiy, 2 — kupe) va bola bilan sayohat (1/0) kiritiladi. Umumiy: bola bilan 25000, yakka 50000. Kupe: bola bilan 60000, yakka 120000 so'm. Narxni chiqaring.  
*Namuna:* kirish `1 1` → chiqish `25000`; kirish `1 0` → chiqish `50000`

**79. Metro oralig'i**  
Soat (0–23) kiritiladi. Metro 5:00 dan oldin yopiq: “Metro yopiq”. 7–9 va 17–19 soatlar tig'iz: “Interval 3 daqiqa”. Boshqa ochiq vaqtlarda “Interval 6 daqiqa”.  
*Namuna:* kirish `4` → chiqish `Metro yopiq`; kirish `5` → chiqish `Interval 6 daqiqa`

**80. Yo'l holati va tezlik**  
Yo'l holati (1 — quruq, 2 — nam, 3 — muzli) va tezlik kiritiladi. Xavfsiz tezlik: quruq yo'lda 90 gacha, nam yo'lda 70 gacha, muzli yo'lda 40 gacha (chegara ham kiradi). “Xavfsiz” yoki “Sekinlating” deb chiqaring.  
*Namuna:* kirish `1 90` → chiqish `Xavfsiz`; kirish `1 91` → chiqish `Sekinlating`

**81. Muzlatgich**  
Muzlatgich harorati va eshik ochiqligi (1 — ochiq, 0 — yopiq) kiritiladi. Eshik ochiq bo'lsa “Eshikni yoping”. Yopiq bo'lsa: harorat 8 dan yuqori bo'lsa “Haroratni pasaytiring”, 0 dan past bo'lsa “Haroratni oshiring”, boshqa holatda “Normal”.  
*Namuna:* kirish `5 1` → chiqish `Eshikni yoping`; kirish `9 0` → chiqish `Haroratni pasaytiring`

**82. Kir yuvish rejimi**  
Kiyim rangi (1 — oq, 2 — rangli) va kirlik darajasi (1 — oz, 2 — ko'p) kiritiladi. Oq kiyim: ko'p kirda “Rejim 4”, oz kirda “Rejim 3”. Rangli kiyim: ko'p kirda “Rejim 2”, oz kirda “Rejim 1”.  
*Namuna:* kirish `1 2` → chiqish `Rejim 4`; kirish `1 1` → chiqish `Rejim 3`

**83. Suv hisobi**  
Hisoblagich bor-yo'qligi (1/0) va sarflangan suv (kub) kiritiladi. Hisoblagich yo'q bo'lsa to'lov 30000. Bor bo'lsa: 5 kubgacha 10000, 6–15 kub 25000, 15 kubdan ko'p bo'lsa 25000 + (kub − 15) × 3000 so'm. To'lovni chiqaring.  
*Namuna:* kirish `0 10` → chiqish `30000`; kirish `1 5` → chiqish `10000`

**84. Lift qavati**  
Binoda 9 qavat bor. Bosilgan qavat va lift turgan qavat kiritiladi. Bosilgan qavat 1–9 oralig'ida bo'lmasa “Bunday qavat yo'q”. Bosilgan qavat yuqori bo'lsa “Yuqoriga”, past bo'lsa “Pastga”, teng bo'lsa “Eshik ochiladi”.  
*Namuna:* kirish `5 2` → chiqish `Yuqoriga`; kirish `1 4` → chiqish `Pastga`

**85. Xat jo'natish**  
Xat og'irligi (gramm) va tezkor yuborish (1/0) kiritiladi. 20 grammgacha: tezkor 6000, oddiy 3000. 21–100 gramm: tezkor 9000, oddiy 5000. 100 grammdan og'ir bo'lsa “Posilka sifatida yuboring”.  
*Namuna:* kirish `15 0` → chiqish `3000`; kirish `20 1` → chiqish `6000`

**86. Sovg'a tanlash**  
Sovg'aga ajratilgan pul va do'st yoshi kiritiladi. Pul 20000 dan kam bo'lsa “Ochiq xat”. 20000–99999 bo'lsa: yosh 10 dan kichik bo'lsa “O'yinchoq”, aks holda “Kitob”. 100000 va undan ko'p bo'lsa: yosh 10 dan kichik bo'lsa “Katta o'yinchoq”, aks holda “Soat”.  
*Namuna:* kirish `10000 5` → chiqish `Ochiq xat`; kirish `50000 8` → chiqish `O'yinchoq`

**87. Olma yig'ish**  
Yig'ilgan olma (kg) va yana yig'ishga vaqt bor-yo'qligi (1/0) kiritiladi. 20 kg va ko'p bo'lsa “Savat to'ldi”. 10–19 kg bo'lsa: vaqt bor bo'lsa “Yana yig'ing”, yo'q bo'lsa “Yetarli”. 10 kg dan kam bo'lsa “Kam”.  
*Namuna:* kirish `25 0` → chiqish `Savat to'ldi`; kirish `20 1` → chiqish `Savat to'ldi`

**88. Tadbirga kirish**  
Yosh va ota-ona ruxsati (1/0) kiritiladi. 16 va undan katta bo'lsa “Kiring”. 12–15 yosh bo'lsa: ruxsat bor bo'lsa “Kiring”, yo'q bo'lsa “Ruxsat kerak”. 12 dan kichik bo'lsa “Kirish mumkin emas”.  
*Namuna:* kirish `20 0` → chiqish `Kiring`; kirish `16 0` → chiqish `Kiring`

**89. Telefon ovozi**  
Telefon ovozi (0–100) va kutubxonadamisiz (1 — ha, 0 — yo'q) kiritiladi. Kutubxonada: ovoz 0 bo'lsa “Mos”, aks holda “Ovozni o'chiring”. Boshqa joyda: ovoz 80 dan baland bo'lsa “Juda baland”, aks holda “Mos”.  
*Namuna:* kirish `0 1` → chiqish `Mos`; kirish `20 1` → chiqish `Ovozni o'chiring`

**90. Nazorat ishi**  
Nazorat boshlanganiga o'tgan daqiqa va ishni topshirgan-topshirmagani (1/0) kiritiladi. Topshirgan bo'lsa “Topshirdi”. Aks holda: 45 va undan ko'p daqiqa “Vaqt tugadi”, 35–44 “Oxirgi daqiqalar”, kamroq bo'lsa “Davom eting”.  
*Namuna:* kirish `10 1` → chiqish `Topshirdi`; kirish `44 0` → chiqish `Oxirgi daqiqalar`

**91. Texnika kreditga**  
Yosh, oylik daromad va ish staji (yil) kiritiladi. Yosh kamida 21 VA daromad kamida 2000000 bo'lsa: staj 1 yil yoki ko'p bo'lsa “Kredit beriladi”, aks holda “Staj yetarli emas”. Shart bajarilmasa “Shart bajarilmadi”.  
*Namuna:* kirish `25 3000000 2` → chiqish `Kredit beriladi`; kirish `30 2000000 0` → chiqish `Staj yetarli emas`

**92. Salat tayyorlash**  
Uyda pomidor (1/0), bodring (1/0) va piyoz (1/0) bor-yo'qligi kiritiladi. Pomidor YOKI bodring yo'q bo'lsa “Masalliq yetmaydi”. Ikkalasi bor bo'lsa: piyoz ham bo'lsa “Piyozli salat”, bo'lmasa “Oddiy salat”.  
*Namuna:* kirish `1 1 1` → chiqish `Piyozli salat`; kirish `1 1 0` → chiqish `Oddiy salat`

**93. Karta urinishlari**  
PIN noto'g'ri kiritilgan urinishlar soni va karta oldindan bloklanganligi (1/0) kiritiladi. Karta bloklangan bo'lsa “Karta bloklangan”. Aks holda: 3 va ko'p urinish — “Karta bloklanadi”, 2 urinish — “Oxirgi urinish”, kamroq — “Urinib ko'ring”.  
*Namuna:* kirish `1 0` → chiqish `Urinib ko'ring`; kirish `2 0` → chiqish `Oxirgi urinish`

**94. Sport zali abonementi**  
Abonement oylari soni va talaba ekanligi (1/0) kiritiladi. Chegirma foizi: 12 va ko'p oy — 15, 6–11 oy — 10, 3–5 oy — 5, 3 dan kam — 0. Talaba bo'lsa yana 5 foiz qo'shiladi. Umumiy foizni chiqaring.  
*Namuna:* kirish `12 0` → chiqish `15`; kirish `6 1` → chiqish `15`

**95. Kutubxona zali**  
Soat va zaldagi odamlar soni kiritiladi. Kutubxona 9:00 dan 18:00 gacha (18 kirmaydi) ochiq, aks holda “Kutubxona yopiq”. Ochiq bo'lsa: odam 50 dan kam bo'lsa “Kiring”, aks holda “Zal to'la”.  
*Namuna:* kirish `10 30` → chiqish `Kiring`; kirish `9 50` → chiqish `Zal to'la`

**96. Dars almashinuvi**  
Hafta kuni (1–7) va o'qituvchi kasalligi (1/0) kiritiladi. 6 va 7-kunlar “Dars yo'q”. Ish kunida o'qituvchi kasal bo'lsa “Dars almashtirildi”, aks holda “Dars o'z vaqtida”.  
*Namuna:* kirish `2 0` → chiqish `Dars o'z vaqtida`; kirish `2 1` → chiqish `Dars almashtirildi`

**97. Tezlik kamerasi**  
Yo'l turi (1 — shahar, 2 — trassa) va tezlik kiritiladi. Shaharda: 60 gacha “Normal”, 61–70 “Ogohlantirish”, undan yuqori “Jarima”. Trassada: 100 gacha “Normal”, 101–110 “Ogohlantirish”, undan yuqori “Jarima”.  
*Namuna:* kirish `50 1` → chiqish `Normal`; kirish `65 1` → chiqish `Ogohlantirish`

**98. Mevalarni saralash**  
Meva pishgan (1/0), chirigan (1/0) va kattaligi (sm) kiritiladi. Chirigan bo'lsa “Tashlang”. Chirimagan-u pishmagan bo'lsa “Kuting”. Pishgan bo'lsa: kattaligi 7 yoki ko'p bo'lsa “Birinchi sort”, aks holda “Ikkinchi sort”.  
*Namuna:* kirish `1 1 8` → chiqish `Tashlang`; kirish `0 0 8` → chiqish `Kuting`

**99. Chegirmalar kuni**  
Oyning kuni va hafta kuni (1–7) kiritiladi. Kun mod 10 = 0 bo'lsa “Katta chegirma”. Aks holda kun mod 5 = 0 bo'lsa: hafta kuni 7 bo'lsa “Katta chegirma”, bo'lmasa “Kichik chegirma”. Boshqa kunlarda “Chegirma yo'q”.  
*Namuna:* kirish `10 1` → chiqish `Katta chegirma`; kirish `20 3` → chiqish `Katta chegirma`

**100. Yong'in signalizatsiyasi**  
Tutun bor-yo'qligi (1/0) va xona harorati kiritiladi. Tutun bo'lsa: harorat 50 yoki yuqori bo'lsa “Yong'in! Evakuatsiya”, aks holda “Tutun bor, tekshiring”. Tutun bo'lmasa: harorat 70 yoki yuqori bo'lsa “Juda issiq”, aks holda “Hammasi joyida”.  
*Namuna:* kirish `1 60` → chiqish `Yong'in! Evakuatsiya`; kirish `1 30` → chiqish `Tutun bor, tekshiring`

---
# 3-qism. Yechilgan namunalar (blok-sxema mantig'i)
Har bir blok-sxema: **Start → Input → shartlar → Output → End**. "Ha" — chapga/pastga, "Yo'q" — keyingi shartga.

**1-namuna. Bog'cha qabuli (1-masala).** *Mavzu: ichma-ich if, bitta zanjir.*
```
Start
Input yosh, malumotnoma
<yosh < 3 ?>   Ha  → Output "Yosh kichik"
               Yo'q ↓
<yosh > 6 ?>   Ha  → Output "Maktabga boring"
               Yo'q ↓
<malumotnoma = 1 ?>  Ha → Output "Qabul qilindi"
                     Yo'q → Output "Ma'lumotnoma kerak"
End
```
Tushuntirish: avval "chetki" holatlar (juda kichik, juda katta) ajratiladi. Faqat qolgani uchun ichki shart — ma'lumotnoma — tekshiriladi.

**2-namuna. Bankomat (9-masala).** *if ichida if: tashqi shart "PIN", ichki shart "pul yetadimi".*
```
Start
Input pin, balans, summa
<pin = 0 ?>    Ha  → Output "PIN xato"
               Yo'q ↓
   <summa <= balans ?>  Ha  → Output "Pul berildi"
                        Yo'q → Output "Mablag' yetarli emas"
End
```
Tushuntirish: ichki shart faqat PIN to'g'ri bo'lganda tekshiriladi, shuning uchun u tashqi if'ning "Yo'q" shoxi ichida turadi.

**3-namuna. Futbol natijasi (10-masala).** *Uch natija — ikkita shart.*
```
Start
Input a, b
<a > b ?>      Ha  → Output "Birinchi jamoa yutdi"
               Yo'q ↓
   <a = b ?>   Ha  → Output "Durang"
               Yo'q → Output "Ikkinchi jamoa yutdi"
End
```
Tushuntirish: uch natija uchun **ikkita** shart yetadi. Eng ko'p uchraydigan xato: durang holatini unutish.

**4-namuna. Konsert chiptasi (26-masala).** *Ichki shart har bir tashqi shoxda boshqacha.*
```
Start
Input qator, vip
<qator <= 5 ?>   Ha → <vip = 1 ?>  Ha → Output 100000
                                    Yo'q → Output 150000
                 Yo'q ↓
<qator <= 15 ?>  Ha → <vip = 1 ?>  Ha → Output 60000
                                    Yo'q → Output 80000
                 Yo'q → Output 40000
End
```
Tushuntirish: qatorlar guruhlarga bo'linadi (1–5, 6–15, 16–20). Faqat birinchi ikki guruhda VIP karta narxga ta'sir qiladi.

**5-namuna. Lotereya, `mod` bilan (33-masala).** *Qoldiq tekshiruvi ichma-ich.*
```
Start
Input n
<n mod 5 = 0 ?>   Ha → <n mod 2 = 0 ?>  Ha → Output "Katta sovg'a"
                                          Yo'q → Output "Kichik sovg'a"
                  Yo'q → Output "Yutuq yo'q"
End
```
Tushuntirish: `n mod 5 = 0` — "son 5 ga qoldiqsiz bo'linadi". Faqat shu holda juft-toqlik tekshiriladi.

**6-namuna. Parol kuchi, `VA` / `YOKI` (47-masala).** *Shartlarni birlashtirish.*
```
Start
Input uzunlik, bosh_harf, raqam
<uzunlik < 6 ?>                    Ha → Output "Juda qisqa"
                                   Yo'q ↓
<bosh_harf = 1  VA  raqam = 1 ?>   Ha → Output "Kuchli"
                                   Yo'q ↓
<bosh_harf = 1  YOKI  raqam = 1 ?> Ha → Output "O'rtacha"
                                   Yo'q → Output "Zaif"
End
```
Tushuntirish: shartlar **tartib bilan** tekshiriladi — eng qattiq shart (`VA`) birinchi turadi. Agar `YOKI` birinchi qo'yilsa, "Kuchli" hech qachon chiqmaydi.

**7-namuna. Kompyuter o'yini (58-masala).** *Eng muhim shart birinchi.*
```
Start
Input ball, jon
<jon = 0 ?>        Ha → Output "O'yin tugadi"
                   Yo'q ↓
<ball >= 1000 ?>   Ha → Output "G'alaba"
                   Yo'q ↓
<ball >= 500 ?>    Ha → Output "Keyingi bosqich"
                   Yo'q → Output "Davom eting"
End
```
Tushuntirish: jon tugagan bo'lsa ball ahamiyatsiz, shuning uchun bu shart birinchi. Pog'onali shartlarda **kattasidan kichigiga** qarab tekshiring.

**Yodda tuting.** (1) Chetki holatlarni avval ajrating. (2) Ichki if faqat tashqi shart bajarilgandagina kerak bo'lsa, uni shu shoxning ichiga qo'ying. (3) Har bir "Yo'q" shoxi Output bilan tugashi kerak. (4) Chegaralarni tekshiring: `<` va `<=` farqi.
