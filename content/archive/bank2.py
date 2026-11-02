"""Problem banks for For / While / Array (Uzbek). Row: (id, title, statement, fn, cases). First 2 cases = examples, rest hidden."""
def _atm(b, r):
    o = []
    for x in r:
        if x <= b: b -= x; o.append('Berildi')
        else: o.append('Yetmaydi'); break
    return o
def _lift(v):
    t = c = 0
    for w in v:
        if t + w > 300: break
        t += w; c += 1
    return c
def _rec(a):
    m, c = -1, 0
    for x in a:
        if x > m: c += 1; m = x
    return c
def _tick(v):
    r = s = 0; r = 20
    for k in v:
        if k <= r: r -= k; s += 1
        else: break
    return [s, r]
def _mar(v):
    t = 0
    for i, x in enumerate(v):
        t += x
        if t >= 100: return [i + 1, t - 100]
def _inc(v):
    c = 1
    for i in range(1, len(v)):
        if v[i] > v[i - 1]: c += 1
        else: break
    return c
def _hot(v):
    c = 0
    for i, x in enumerate(v):
        c = c + 1 if x >= 30 else 0
        if c == 3: return i + 1
def _lim(v):
    t = 0
    for x in v:
        if t + x > 1000000: break
        t += x
    return t
def _low(v):
    c = 0
    for i, x in enumerate(v):
        c = c + 1 if x < 10 else 0
        if c == 3: return i + 1
def _cold(a):
    b = c = 0
    for x in a: c = c + 1 if x < 0 else 0; b = max(b, c)
    return b
def _run(v):
    b = c = 1
    for i in range(1, len(v)):
        c = c + 1 if v[i] > v[i - 1] else 1; b = max(b, c)
    return b
FOR = ([
("c01", "Do'stlarga salom", "N ta do'stingiz bor (N kiritiladi). Har biriga alohida qatorda “Salom” deb yozing.", lambda n: ['Salom'] * n, [(1,), (3,), (5,), (2,)]),
("c02", "Navbat raqamlari", "Poliklinikada N ta bemor bor (N kiritiladi). Navbat raqamlarini 1 dan N gacha alohida qatorlarda chiqaring.", lambda n: list(range(1, n + 1)), [(1,), (4,), (7,), (3,)]),
("c03", "Haftalik xarajat", "7 kun davomida har kunlik xarajat kiritiladi (har biri alohida qatorda). Haftalik jami xarajatni chiqaring.", lambda *v: sum(v), [(5000, 3000, 0, 12000, 7000, 0, 4500), (1000, 1000, 1000, 1000, 1000, 1000, 1000), (0, 0, 0, 0, 0, 0, 0), (20000, 0, 15000, 0, 5000, 8000, 2000)]),
("c04", "Sovuq kunlar", "Birinchi qatorda kunlar soni N, keyin N ta harorat kiritiladi. Harorati 0 dan past bo'lgan kunlar nechta?", lambda n, *v: sum(1 for x in v if x < 0), [(5, -3, 4, -1, 0, 7), (3, 1, 2, 3), (4, -1, -2, -3, -4), (1, -5)]),
("c05", "Raketa uchirish", "Sanoq soni N kiritiladi. N dan 1 gacha teskari sanab, har sonni alohida qatorda chiqaring, oxirida “Start!” deb yozing.", lambda n: list(range(n, 0, -1)) + ['Start!'], [(3,), (5,), (1,), (10,)]),
("c06", "O'rtacha baho", "Birinchi qatorda baholar soni N, keyin N ta baho kiritiladi. O'rtacha bahoni (kasr bilan) chiqaring.", lambda n, *v: sum(v) / n, [(3, 5, 4, 3), (4, 5, 5, 4, 4), (1, 3), (2, 4, 5)]),
("c07", "Juft sahifalar", "Kitobda N ta sahifa bor (N kiritiladi). Juft raqamli sahifalarni (son mod 2 = 0) 1 dan N gacha alohida qatorlarda chiqaring.", lambda n: [i for i in range(1, n + 1) if i % 2 == 0], [(10,), (7,), (2,), (5,)]),
("c08", "Yetarli suv ichgan kunlar", "7 kun davomida har kuni ichilgan stakan soni kiritiladi. Nechta kunda 8 yoki undan ko'p stakan ichilgan?", lambda *v: sum(1 for x in v if x >= 8), [(8, 3, 9, 8, 7, 10, 2), (1, 1, 1, 1, 1, 1, 1), (8, 8, 8, 8, 8, 8, 8), (0, 9, 0, 9, 0, 9, 0)]),
], [
("h01", "Eng ko'p sotuv", "Birinchi qatorda kunlar soni N, keyin har kunlik sotuv (so'm) kiritiladi. Eng ko'p sotuvni chiqaring.", lambda n, *v: max(v), [(4, 120000, 90000, 150000, 110000), (1, 5000), (3, 7, 7, 7), (5, 1, 9, 3, 9, 2)]),
("h02", "Eng sovuq kun", "N kunlik harorat kiritiladi (birinchi qatorda N). Eng past haroratni chiqaring.", lambda n, *v: min(v), [(4, 5, -2, 3, 0), (1, 10), (3, -1, -5, -3), (5, 20, 18, 25, 18, 30)]),
("h03", "Har beshinchi mijoz", "Do'konda N ta mijoz xizmat ko'rsatildi (N kiritiladi). Mijoz raqami mod 5 = 0 bo'lsa (5-, 10-, 15- ...) sovg'a beriladi. Nechta sovg'a berildi?", lambda n: sum(1 for i in range(1, n + 1) if i % 5 == 0), [(12,), (4,), (5,), (50,)]),
("h04", "Oyma-oy jamg'arma", "Har oy S so'm jamg'arasiz. Avval S, keyin oylar soni N kiritiladi. Har oy oxiridagi jami summani alohida qatorlarda chiqaring.", lambda s, n: [s * i for i in range(1, n + 1)], [(50000, 3), (10000, 1), (200000, 4), (0, 2)]),
("h05", "Narx oshgan kunlar", "Birinchi qatorda kunlar soni N, keyin har kunlik narx kiritiladi. Narx oldingi kundagidan qimmat bo'lgan kunlar nechta?", lambda n, *v: sum(1 for i in range(1, n) if v[i] > v[i - 1]), [(5, 10, 12, 11, 15, 20), (3, 5, 5, 5), (4, 9, 8, 7, 6), (2, 1, 2)]),
("h06", "Konfet qutilari", "Bitta qutida K ta konfet bor (K kiritiladi). 1 dan 10 gacha qutilar uchun jami konfet sonini alohida qatorlarda chiqaring.", lambda k: [k * i for i in range(1, 11)], [(6,), (12,), (1,), (25,)]),
("h07", "Birinchi sovuq kun", "Birinchi qatorda kunlar soni N, keyin harorat kiritiladi. Harorati 0 dan past bo'lgan birinchi kun raqamini (1 dan) chiqaring; bunday kun bo'lmasa 0.", lambda n, *v: next((i + 1 for i, x in enumerate(v) if x < 0), 0), [(5, 3, 4, -1, 2, -5), (3, 1, 2, 3), (2, -4, -6), (4, 0, 0, 0, -1)]),
("h08", "Kunlik foyda", "Birinchi qatorda kunlar soni N, keyin har kun uchun ikkita son: daromad va xarajat kiritiladi. Umumiy foydani chiqaring (daromad − xarajat yig'indisi; manfiy bo'lishi mumkin).", lambda n, *v: sum(v[0::2]) - sum(v[1::2]), [(2, 100, 40, 50, 70), (1, 10, 20), (3, 500, 100, 300, 300, 200, 50), (2, 0, 0, 5, 5)]),
("h09", "Narxlar va chegirma", "Birinchi qatorda mahsulotlar soni N, keyin narxlar kiritiladi. Narxi 100000 dan yuqori mahsulotga 10% chegirma beriladi. To'lanadigan jami summani chiqaring.", lambda n, *v: sum(x * 0.9 if x > 100000 else x for x in v), [(3, 50000, 200000, 100000), (2, 100001, 10), (1, 300000), (4, 10, 20, 30, 40)]),
("h10", "A'lo va ikki baholar", "Birinchi qatorda baholar soni N, keyin baholar (2–5) kiritiladi. Avval nechta 5 baho, keyin nechta 2 baho borligini alohida qatorlarda chiqaring.", lambda n, *v: [v.count(5), v.count(2)], [(5, 5, 2, 5, 3, 2), (3, 4, 4, 4), (4, 5, 5, 5, 5), (2, 2, 2)]),
], [
("x01", "Yaroqsiz mahsulotlar", "Birinchi qatorda mahsulotlar soni N, keyin har biri uchun 1 (muddati o'tgan) yoki 0 (yaroqli) kiritiladi. Avval muddati o'tganlar, keyin yaroqlilar sonini alohida qatorlarda chiqaring.", lambda n, *v: [v.count(1), v.count(0)], [(5, 1, 0, 0, 1, 0), (3, 0, 0, 0), (2, 1, 1), (4, 1, 0, 1, 0)]),
("x02", "Eng katta farq", "Birinchi qatorda kunlar soni N, keyin harorat kiritiladi. Eng yuqori va eng past harorat farqini chiqaring (kattasidan kichigini ayiring).", lambda n, *v: max(v) - min(v), [(4, 5, 12, -3, 8), (1, 7), (3, 10, 10, 10), (5, 20, 25, 18, 30, 22)]),
("x03", "Kunlik reja", "Kuniga 20 sahifa o'qish rejasi bor. Birinchi qatorda kunlar soni N, keyin har kuni o'qilgan sahifa kiritiladi. Har kun uchun alohida qatorda reja bajarilgan bo'lsa “Ha”, bo'lmasa “Yo'q” deb chiqaring.", lambda n, *v: ['Ha' if x >= 20 else "Yo'q" for x in v], [(3, 25, 10, 20), (2, 0, 19), (4, 20, 20, 20, 20), (1, 5)]),
("x04", "Yugurish natijalari", "Birinchi qatorda kunlar soni N, keyin har kuni yugurilgan km kiritiladi. Jami masofani va eng uzun kunlik masofani alohida qatorlarda chiqaring.", lambda n, *v: [sum(v), max(v)], [(3, 5, 8, 3), (1, 10), (4, 2, 2, 2, 2), (5, 1, 9, 4, 9, 2)]),
("x05", "Qarzni to'lash", "Qarz Q, har oylik to'lov P so'm, oylar soni N (shu tartibda kiritiladi). Har oydan keyingi qarz qoldig'ini alohida qatorlarda chiqaring; qoldiq 0 dan kam bo'lmaydi.", lambda q, p, n: [max(0, q - p * i) for i in range(1, n + 1)], [(100000, 30000, 5), (50000, 50000, 2), (10000, 3000, 3), (0, 100, 2)]),
("x06", "Xush kelibsiz", "Birinchi qatorda mehmonlar soni N, keyin N ta ism kiritiladi (String). Har bir ism uchun alohida qatorda “Xush kelibsiz, ISM!” deb yozing.", lambda n, *v: [f"Xush kelibsiz, {x}!" for x in v], [(2, 'Ali', 'Vali'), (1, 'Madina'), (3, 'Anvar', 'Zilola', 'Sardor'), (2, 'Dilnoza', 'Jasur')]),
])
WHILE = ([
("c01", "PIN urinishlari", "To'g'ri PIN — 1234. Urinishlar birma-bir kiritiladi, 1234 kiritilganda to'xtaydi. Jami nechta urinish bo'lganini chiqaring (to'g'ri urinish ham hisobda).", lambda *v: v.index(1234) + 1, [(5, 1234), (1234,), (7, 8, 9, 1234), (0, 1234)]),
("c02", "Kassa cheki", "Mahsulot narxlari birma-bir kiritiladi, 0 kiritilsa chek yopiladi. Jami summani chiqaring.", lambda *v: sum(v[:v.index(0)]), [(5000, 3000, 0), (0,), (100, 200, 300, 0), (1, 0)]),
("c03", "Eng baland o'quvchi", "Bo'ylar (sm) birma-bir kiritiladi, 0 kiritilsa tugaydi (kamida bitta bo'y bor). Eng baland bo'yni chiqaring.", lambda *v: max(v[:v.index(0)]), [(150, 162, 158, 0), (140, 0), (170, 169, 171, 0), (155, 155, 0)]),
("c04", "Kunlik suv", "Har safar ichilgan stakan soni kiritiladi. Jami 8 stakanga yetguncha (yoki oshguncha) kiritiladi. Necha marta suv ichilganini chiqaring.", lambda *v: next(i + 1 for i in range(len(v)) if sum(v[:i + 1]) >= 8), [(3, 2, 4), (8,), (1, 1, 1, 1, 1, 1, 1, 1), (5, 5)]),
("c05", "Qadam maqsadi", "Maqsad — 10000 qadam. Har safar yurilgan qadamlar kiritiladi va yig'iladi; maqsadga yetganda to'xtaydi. Necha marta kiritilganini chiqaring.", lambda *v: next(i + 1 for i in range(len(v)) if sum(v[:i + 1]) >= 10000), [(4000, 3000, 3000), (10000,), (2000, 2000, 2000, 2000, 2000), (9999, 1)]),
("c06", "Sovuqqacha", "Harorat birma-bir kiritiladi, 0 dan past harorat kiritilganda to'xtaydi. Nechta kunda harorat 0 yoki yuqori bo'lganini chiqaring.", lambda *v: next(i for i in range(len(v)) if v[i] < 0), [(5, 3, 0, -2), (-1,), (10, -5), (0, 0, -1)]),
("c07", "Bankomat so'rovlari", "Avval hisobdagi pul B kiritiladi. Keyin yechish summalari birma-bir kiritiladi: summa qolgan pulga yetsa “Berildi” (pul kamayadi), yetmasa “Yetmaydi” va dastur to'xtaydi. Har so'rov natijasini alohida qatorda chiqaring.", lambda b, *r: _atm(b, r), [(100, 30, 50, 40), (100, 200), (50, 10, 20, 20, 5), (10, 10, 1)]),
("c08", "Tanlov ballari", "Ballar birma-bir kiritiladi, -1 kiritilsa tugaydi. Ballar o'rtachasini (kasr bilan) chiqaring (kamida bitta ball bor).", lambda *v: (lambda a: sum(a) / len(a))(v[:v.index(-1)]), [(80, 90, 100, -1), (50, -1), (70, 71, -1), (0, 100, -1)]),
], [
("h01", "Birinchi juft son", "Sonlar birma-bir kiritiladi, birinchi juft son (son mod 2 = 0) kiritilganda to'xtaydi. Juft son nechanchi bo'lib kiritilganini chiqaring.", lambda *v: next(i + 1 for i, x in enumerate(v) if x % 2 == 0), [(3, 5, 8), (2,), (7, 9, 11, 4), (1, 3, 5, 7, 10)]),
("h02", "Takroriy son", "Sonlar birma-bir kiritiladi. Ketma-ket ikki marta bir xil son kiritilganda to'xtaydi. Jami nechta son kiritilganini chiqaring.", lambda *v: next(i + 1 for i in range(1, len(v)) if v[i] == v[i - 1]), [(1, 2, 2), (5, 5), (1, 2, 3, 3), (4, 3, 4, 4)]),
("h03", "Lift yuki", "Liftga odamlar birin-ketin kiradi, har birining og'irligi (kg) kiritiladi. Lift 300 kg ko'tara oladi. Yangi odam kirsa jami og'irlik 300 dan oshsa, u kirmaydi va dastur to'xtaydi. Nechta odam kirganini chiqaring.", lambda *v: _lift(v), [(70, 80, 90, 100), (310,), (100, 100, 100, 1), (50, 60, 200)]),
("h04", "Yangi rekord", "Natijalar birma-bir kiritiladi, 0 kiritilsa tugaydi. Oldingi barcha natijalardan yuqori bo'lgan (yangi rekord) natijalar nechta? Birinchi natija ham rekord hisoblanadi.", lambda *v: _rec(v[:v.index(0)]), [(5, 3, 7, 7, 9, 0), (4, 0), (1, 2, 3, 0), (9, 8, 7, 0)]),
("h05", "Chipta sotuvi", "Zalda 20 ta o'rin bor. Xaridorlar birin-ketin necha chipta olmoqchi ekanini kiritadi. O'rin yetsa sotiladi, yetmasa dastur to'xtaydi. Avval nechta xaridorga sotilganini, keyin nechta o'rin qolganini alohida qatorlarda chiqaring.", lambda *v: _tick(v), [(5, 10, 6), (21,), (4, 4, 4, 4, 4, 1), (20, 1)]),
("h06", "Marafon", "Maqsad — 100 km. Har kuni yugurilgan km kiritiladi va yig'iladi; 100 ga yetganda to'xtaydi. Avval necha kunda yetilganini, keyin ortiqcha km ni (100 dan oshgani; aniq 100 bo'lsa 0) alohida qatorlarda chiqaring.", lambda *v: _mar(v), [(30, 40, 50), (100,), (60, 40), (20, 20, 20, 20, 30)]),
("h07", "Ro'yxatdan chiqish", "Ismlar birma-bir kiritiladi (String), “STOP” kiritilsa tugaydi. STOP gacha nechta ism kiritilganini chiqaring.", lambda *v: v.index('STOP'), [('Ali', 'Vali', 'STOP'), ('STOP',), ('Madina', 'STOP'), ('a', 'b', 'c', 'STOP')]),
("h08", "O'sib boruvchi ketma-ketlik", "Sonlar birma-bir kiritiladi. Har yangi son oldingisidan qat'iy katta bo'lishi kerak; shart buzilganda to'xtaydi. Buzilguncha nechta son to'g'ri tartibda kelganini chiqaring (buzgan son hisobga kirmaydi).", lambda *v: _inc(v), [(1, 2, 3, 3), (5, 4), (1, 5, 9, 2), (7, 7)]),
("h09", "Ob-havo kuzatuvi", "Harorat birma-bir kiritiladi. Ketma-ket 3 kun harorat 30 yoki undan yuqori bo'lganda to'xtaydi. Shu uchinchi kun jami nechanchi kiritilganini chiqaring.", lambda *v: _hot(v), [(31, 32, 33), (31, 25, 31, 32, 33), (30, 30, 30), (40, 10, 40, 40, 40)]),
("h10", "Bank limiti", "Bank kuniga 1000000 so'mgacha yechishga ruxsat beradi. Yechish summalari birma-bir kiritiladi; yangi summa qo'shilganda jami limitdan oshsa, u rad etiladi va dastur to'xtaydi. Muvaffaqiyatli yechilgan jami summani chiqaring.", lambda *v: _lim(v), [(400000, 500000, 200000), (1000000, 1), (2000000,), (300000, 300000, 300000, 300000)]),
], [
("x01", "Stakanlar soni", "Idishda V millilitr suv bor. Bitta stakanga 250 ml quyiladi. Nechta to'liq stakan to'ladi?", lambda v: v // 250, [(1000,), (249,), (1250,), (250,)]),
("x02", "O'yin raundlari", "O'yinda ballar har raundda kiritiladi. Ketma-ket 3 ta raundda ball 10 dan past bo'lsa o'yin tugaydi. Jami nechta raund o'ynalganini chiqaring (oxirgisi ham hisobda).", lambda *v: _low(v), [(50, 5, 5, 5), (1, 1, 1), (20, 5, 5, 30, 5, 5, 5), (9, 9, 10, 9, 9, 9)]),
("x03", "Parolni tasdiqlash", "Parol juft-juft kiritiladi (parol va uning takrori). Ikkalasi bir xil bo'lguncha takrorlanadi. Nechanchi juftlikda mos kelganini chiqaring.", lambda *v: next(i // 2 + 1 for i in range(0, len(v), 2) if v[i] == v[i + 1]), [(1, 2, 3, 3), (5, 5), (1, 2, 2, 1, 4, 4), (7, 8, 9, 9)]),
("x04", "Birinchi katta xarid", "Xarid summalari birma-bir kiritiladi. Umumiy summa 500000 dan oshganda to'xtaydi. Necha xariddan keyin oshganini chiqaring.", lambda *v: next(i + 1 for i in range(len(v)) if sum(v[:i + 1]) > 500000), [(200000, 200000, 200000), (600000,), (100000, 100000, 100000, 100000, 100001), (250000, 250000, 1)]),
("x05", "Eng uzun sovuq davr", "Harorat birma-bir kiritiladi, 99 kiritilsa tugaydi. Ketma-ket eng ko'p necha kun harorat 0 dan past bo'lganini chiqaring.", lambda *v: _cold(v[:v.index(99)]), [(-1, -2, 3, -1, -2, -3, 99), (5, 99), (-5, 99), (-1, 1, -1, 1, 99)]),
("x06", "Chipta raqami xonalari", "Chipta raqami (musbat butun) kiritiladi. U necha xonali ekanini chiqaring: raqamni 10 ga bo'lib (div) borib, qancha marta bo'lganingizni sanang.", lambda n: len(str(n)), [(7,), (305,), (10,), (99999,)]),
])
ARRAY = ([
("c01", "Eng baland o'quvchi", "Birinchi qatorda o'quvchilar soni N, keyin N ta bo'y (sm) kiritiladi. Eng baland bo'yni chiqaring.", lambda n, *v: max(v), [(4, 150, 162, 158, 160), (1, 140), (3, 170, 169, 171), (5, 155, 155, 155, 155, 155)]),
("c02", "Jami va o'rtacha", "Birinchi qatorda kunlar soni N, keyin kunlik sotuv kiritiladi. Avval jami sotuvni, keyin o'rtachasini (kasr bilan) alohida qatorlarda chiqaring.", lambda n, *v: [sum(v), sum(v) / n], [(4, 100, 200, 300, 400), (1, 50), (2, 10, 15), (3, 7, 7, 7)]),
("c03", "Ro'yxatda bormi?", "Birinchi qatorda N, keyin N ta son, oxirida qidiriladigan son K kiritiladi. K ro'yxatda bo'lsa “Bor”, bo'lmasa “Yo'q” deb chiqaring.", lambda n, *r: 'Bor' if r[-1] in r[:-1] else "Yo'q", [(3, 5, 8, 2, 8), (3, 5, 8, 2, 9), (1, 4, 4), (4, 1, 2, 3, 4, 0)]),
("c04", "Necha marta uchraydi", "Birinchi qatorda N, keyin N ta son, oxirida K kiritiladi. K soni ro'yxatda necha marta uchraganini chiqaring.", lambda n, *r: r[:-1].count(r[-1]), [(5, 1, 2, 1, 3, 1, 1), (3, 4, 5, 6, 7), (4, 2, 2, 2, 2, 2), (1, 9, 9)]),
("c05", "Foydali kunlar", "Birinchi qatorda N, keyin N ta kunlik foyda/zarar (manfiy — zarar) kiritiladi. Nechta kunda foyda (0 dan katta) bo'lganini chiqaring.", lambda n, *v: sum(1 for x in v if x > 0), [(5, 100, -50, 0, 30, -10), (3, -1, -2, -3), (2, 5, 5), (1, 0)]),
("c06", "Birinchi va oxirgi", "Birinchi qatorda N, keyin N ta son kiritiladi. Birinchi va oxirgi elementni alohida qatorlarda chiqaring.", lambda n, *v: [v[0], v[-1]], [(4, 1, 2, 3, 4), (1, 7), (3, 9, 5, 2), (2, 0, 8)]),
("c07", "Juft elementlar", "Birinchi qatorda N, keyin N ta son kiritiladi. Juft sonlarni (son mod 2 = 0) kiritilish tartibida alohida qatorlarda chiqaring (kamida bitta juft son bor).", lambda n, *v: [x for x in v if x % 2 == 0], [(5, 1, 2, 3, 4, 5), (3, 7, 9, 10), (4, 6, 8, 10, 12), (2, 2, 3)]),
("c08", "Narxlarni oshirish", "Birinchi qatorda N, keyin N ta narx (10 ga karrali) kiritiladi. Har bir narx 10% oshiriladi: yangi narx = narx + narx / 10. Yangi narxlarni alohida qatorlarda chiqaring.", lambda n, *v: [x + x // 10 for x in v], [(3, 100, 250, 40), (1, 1000), (2, 10, 20), (4, 50, 60, 70, 80)]),
], [
("h01", "Eng uzun ism", "Birinchi qatorda N, keyin N ta ism kiritiladi (String). Eng uzun ismni chiqaring; teng bo'lsa birinchisini.", lambda n, *v: max(v, key=len), [(3, 'Ali', 'Madina', 'Zilola'), (1, 'Jasur'), (2, 'Ali', 'Vali'), (4, 'Sardor', 'Anvar', 'Dilnoza', 'Nodir')]),
("h02", "Har xil sonlar", "Birinchi qatorda N, keyin N ta son kiritiladi. Nechta har xil son borligini chiqaring.", lambda n, *v: len(set(v)), [(5, 1, 2, 2, 3, 3), (3, 4, 4, 4), (4, 1, 2, 3, 4), (1, 9)]),
("h03", "Kirim va chiqim", "Birinchi qatorda kunlar soni N, keyin N ta kirim, keyin N ta chiqim kiritiladi. Har kun uchun kirim − chiqimni alohida qatorlarda chiqaring.", lambda n, *v: [v[i] - v[n + i] for i in range(n)], [(3, 100, 200, 50, 30, 250, 50), (1, 10, 4), (2, 0, 5, 5, 0), (2, 7, 7, 7, 7)]),
("h04", "Eng yaxshi ikki kun", "Birinchi qatorda N (N ≥ 2), keyin N ta kunlik sotuv kiritiladi. Ketma-ket ikki kunning eng katta yig'indisini chiqaring.", lambda n, *v: max(v[i] + v[i + 1] for i in range(n - 1)), [(5, 1, 5, 2, 8, 1), (2, 3, 4), (4, 9, 1, 1, 9), (3, 5, 5, 5)]),
("h05", "O'ngga siljitish", "Birinchi qatorda N, keyin N ta son kiritiladi. Ro'yxatni bir qadam o'ngga siljiting: oxirgi element boshiga o'tadi. Natijani alohida qatorlarda chiqaring.", lambda n, *v: [v[-1]] + list(v[:-1]), [(4, 1, 2, 3, 4), (1, 5), (3, 9, 8, 7), (2, 4, 6)]),
("h06", "Chekkalarni almashtirish", "Birinchi qatorda N, keyin N ta son kiritiladi. Birinchi va oxirgi elementlarni almashtirib, ro'yxatni alohida qatorlarda chiqaring.", lambda n, *v: ([v[-1]] + list(v[1:-1]) + [v[0]]) if n > 1 else list(v), [(4, 1, 2, 3, 4), (2, 5, 6), (3, 7, 8, 9), (1, 5)]),
("h07", "Narx chegarasi", "Birinchi qatorda N, keyin N ta narx, oxirida chegara L kiritiladi. L dan qimmat narxlar L ga tenglashtiriladi. Natijani alohida qatorlarda chiqaring.", lambda n, *r: [min(x, r[-1]) for x in r[:-1]], [(4, 50, 200, 80, 120, 100), (2, 10, 20, 50), (3, 300, 300, 300, 100), (1, 5, 9)]),
("h08", "Teskari ham o'xshash", "Birinchi qatorda N, keyin N ta son kiritiladi. Ro'yxat oldidan ham, orqasidan ham bir xil o'qilsa “Ha”, aks holda “Yo'q” deb chiqaring.", lambda n, *v: 'Ha' if list(v) == list(v)[::-1] else "Yo'q", [(5, 1, 2, 3, 2, 1), (4, 1, 2, 2, 1), (3, 1, 2, 3), (1, 7)]),
("h09", "Eng ko'p uchragan baho", "Birinchi qatorda N, keyin N ta baho kiritiladi. Eng ko'p uchragan bahoni chiqaring; teng bo'lsa kichigini.", lambda n, *v: max(sorted(set(v)), key=v.count), [(6, 5, 4, 5, 3, 4, 5), (4, 2, 2, 3, 3), (1, 4), (5, 1, 2, 3, 4, 5)]),
("h10", "Yig'indi 100 dan oshdi", "Birinchi qatorda N, keyin N ta son kiritiladi. Boshidan qo'shib borganda yig'indi birinchi marta 100 dan oshgan elementning o'rnini (1 dan) chiqaring; oshmasa 0.", lambda n, *v: next((i + 1 for i in range(n) if sum(v[:i + 1]) > 100), 0), [(5, 30, 40, 20, 50, 10), (3, 10, 10, 10), (2, 100, 1), (4, 50, 50, 1, 1)]),
], [
("x01", "Eng arzon ikki mahsulot", "Birinchi qatorda N (N ≥ 2), keyin N ta narx kiritiladi. Eng arzon ikki narxning yig'indisini chiqaring.", lambda n, *v: sum(sorted(v)[:2]), [(4, 5, 1, 9, 2), (2, 4, 4), (3, 10, 3, 7), (5, 8, 8, 1, 1, 5)]),
("x02", "O'rtadagi element", "Birinchi qatorda toq N, keyin N ta son kiritiladi. O'rtadagi elementni chiqaring.", lambda n, *v: v[n // 2], [(5, 1, 2, 3, 4, 5), (1, 9), (3, 7, 8, 9), (7, 1, 2, 3, 4, 5, 6, 7)]),
("x03", "Eng uzun o'sish", "Birinchi qatorda N, keyin N ta son kiritiladi. Ketma-ket qat'iy o'suvchi eng uzun bo'lakning uzunligini chiqaring.", lambda n, *v: _run(v), [(6, 1, 2, 3, 1, 2, 3), (3, 5, 5, 5), (5, 1, 2, 3, 4, 5), (4, 4, 3, 2, 1)]),
("x04", "Juft va toq yig'indi", "Birinchi qatorda N, keyin N ta son kiritiladi. Juft sonlar yig'indisini va toq sonlar yig'indisini (son mod 2 bo'yicha) alohida qatorlarda chiqaring.", lambda n, *v: [sum(x for x in v if x % 2 == 0), sum(x for x in v if x % 2 == 1)], [(5, 1, 2, 3, 4, 5), (2, 10, 20), (3, 1, 3, 5), (4, 2, 4, 7, 9)]),
("x05", "Chegirmali narxlar", "Birinchi qatorda N, keyin N ta narx, oxirida chegirma foizi P (butun) kiritiladi. Har bir chegirmali narxni alohida qatorda chiqaring: narx − narx × P / 100.", lambda n, *r: [x - x * r[-1] / 100 for x in r[:-1]], [(3, 1000, 2000, 500, 10), (1, 200, 50), (2, 100, 100, 0), (2, 80, 40, 25)]),
("x06", "Eng yomg'irli oy", "12 oy uchun yog'ingarchilik (mm) kiritiladi. Eng ko'p yomg'ir yoqqan oy raqamini (1–12) chiqaring; teng bo'lsa birinchisini.", lambda *v: v.index(max(v)) + 1, [(10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120), (5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5), (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9), (9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9)]),
])
BANKS = {'for': FOR, 'while': WHILE, 'array': ARRAY}
