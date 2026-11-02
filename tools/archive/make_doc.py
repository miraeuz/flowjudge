#!/usr/bin/env python3
"""Builds the teaching document (design proposal + 100 nested-if problems + solved examples) from content/nested.py."""
import sys, os
sys.path.insert(0, 'content'); from nested import LESSON, HOMEWORK, EXTRA
OUT = sys.argv[1] if len(sys.argv) > 1 else 'Nested-If-Masalalar-va-Dizayn.md'
def fmt(v): return ' / '.join(map(fmt, v)) if isinstance(v, (list, tuple)) else str(v)
def block(title, rows, start=1):
    s = [f'## {title}\n']
    for i, (pid, t, st, fn, cases) in enumerate(rows, start):
        a, b = cases[0], cases[1]
        s.append(f'**{i}. {t}**  \n{st}  \n*Namuna:* kirish `{" ".join(map(str, a))}` → chiqish `{fmt(fn(*a))}`; kirish `{" ".join(map(str, b))}` → chiqish `{fmt(fn(*b))}`\n')
    return '\n'.join(s)
DESIGN = '''# Nested If — masalalar to'plami va dizayn taklifi
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

'''
EX = '''
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
'''
doc = DESIGN + block('A. Dars mashg\'uloti — 30 ta', LESSON) + '\n' + block('B. Uyga vazifa — 40 ta', HOMEWORK, 31) + '\n' + block('C. Qo\'shimcha — 30 ta', EXTRA, 71) + EX
open(OUT, 'w').write(doc); print(OUT, len(doc.split()), 'words')
