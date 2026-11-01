"""Problems from the teacher's book 'Mirae Flow Masalalar Kitobi' (Topic 6 Nested For, Topic 7 While). Row: (id, title, statement, fn, cases).
Pattern problems are judged line by line (spaces inside a line do not matter, line breaks do)."""
S = lambda x, k: ' '.join([str(x)] * k)
R = lambda a, b: ' '.join(map(str, range(a, b + 1)))
tab = lambda n: [' '.join(str(i * j) for j in range(1, n + 1)) for i in range(1, n + 1)]
def seq(n): c = 0; o = []; [o.append(R(c + 1, c + i)) or (c := c + i) for i in range(1, n + 1)]; return o
NF = [
("n01", "Yulduzchalar to'rtburchagi", "3 qator chiqaring, har birida 5 ta yulduzcha (*). Belgilar orasida bitta bo'sh joy bo'lsin.", lambda: [S('*', 5)] * 3, [()]),
("n02", "n qator, n ta yulduzcha", "n kiritiladi. n qator chiqaring, har birida n ta yulduzcha (*).", lambda n: [S('*', n)] * n, [(1,), (3,), (4,), (6,)]),
("n03", "Qator raqami (4 qator)", "4 qator chiqaring: birinchi qatorda 1 raqami 4 marta, ikkinchisida 2 raqami 4 marta, uchinchisida 3, to'rtinchisida 4.", lambda: [S(i, 4) for i in range(1, 5)], [()]),
("n04", "Qator raqami n marta", "n kiritiladi. n qator chiqaring. Har bir qatorda qator raqami n marta yozilsin.", lambda n: [S(i, n) for i in range(1, n + 1)], [(1,), (3,), (4,), (5,)]),
("n05", "Uch qator 1 dan 5 gacha", "3 qator chiqaring, har birida 1 dan 5 gacha sonlar (1 2 3 4 5).", lambda: [R(1, 5)] * 3, [()]),
("n06", "n qator 1 dan n gacha", "n kiritiladi. n qator chiqaring, har birida 1 dan n gacha sonlar.", lambda n: [R(1, n)] * n, [(1,), (3,), (4,), (6,)]),
("n07", "Karra jadvali 1–5", "1 dan 5 gacha karra jadvalini chiqaring: 1-qatorda 1 2 3 4 5, 2-qatorda 2 4 6 8 10 va hokazo.", lambda: tab(5), [()]),
("n08", "Karra jadvali 1 dan n gacha", "n kiritiladi. 1 dan n gacha karra jadvalini chiqaring (n qator, n ustun).", lambda n: tab(n), [(1,), (3,), (4,), (6,)]),
("n09", "Yulduzchali uchburchak (4 qator)", "Uchburchak chiqaring: 1-qatorda 1 ta *, 2-qatorda 2 ta * ... 4-qatorda 4 ta *.", lambda: [S('*', i) for i in range(1, 5)], [()]),
("n10", "n qatorli yulduz uchburchagi", "n kiritiladi. n qatorli yulduzcha uchburchagini chiqaring (i-qatorda i ta *).", lambda n: [S('*', i) for i in range(1, n + 1)], [(1,), (3,), (5,), (7,)]),
("n11", "Sonli uchburchak (4 qator)", "Chiqaring: 1-qatorda 1, 2-qatorda 1 2, 3-qatorda 1 2 3, 4-qatorda 1 2 3 4.", lambda: [R(1, i) for i in range(1, 5)], [()]),
("n12", "n qatorli sonli uchburchak", "n kiritiladi. i-qatorda 1 dan i gacha sonlar chiqsin (n qator).", lambda n: [R(1, i) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n13", "Teskari uchburchak (4 qator)", "Chiqaring: 1-qatorda 4 ta *, keyin 3 ta, 2 ta va oxirgi qatorda 1 ta *.", lambda: [S('*', 4 - i) for i in range(4)], [()]),
("n14", "Teskari yulduz uchburchagi", "n kiritiladi. n qatorli teskari uchburchak: birinchi qatorda n ta *, keyingisida n−1 ta ... oxirgisida 1 ta *.", lambda n: [S('*', n - i) for i in range(n)], [(1,), (3,), (5,), (7,)]),
("n15", "Har bir son o'zicha marta (5 qator)", "Chiqaring: 1-qatorda 1, 2-qatorda 2 2, 3-qatorda 3 3 3, 4-qatorda 4 4 4 4, 5-qatorda 5 5 5 5 5.", lambda: [S(i, i) for i in range(1, 6)], [()]),
("n16", "n qator: son o'zicha marta", "n kiritiladi. i-qatorda i soni i marta yozilsin (n qator).", lambda n: [S(i, i) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n17", "Kamayuvchi sonli qatorlar (4 qator)", "Chiqaring: 1 2 3 4, keyin 1 2 3, keyin 1 2, oxirida 1 (har biri alohida qatorda).", lambda: [R(1, 4 - i) for i in range(4)], [()]),
("n18", "Teskari sonli uchburchak", "n kiritiladi. 1-qatorda 1 dan n gacha, 2-qatorda 1 dan n−1 gacha ... oxirgi qatorda faqat 1 chiqsin.", lambda n: [R(1, n - i) for i in range(n)], [(1,), (3,), (5,), (6,)]),
("n19", "Uch qator 1 dan 4 gacha", "3 qator chiqaring, har birida 1 dan 4 gacha sonlar (ichma-ich For bilan).", lambda: [R(1, 4)] * 3, [()]),
("n20", "Qator va ustun", "Avval qatorlar soni, keyin ustunlar soni kiritiladi. Shuncha qator chiqaring, har birida ustunlar soniga teng yulduzcha (*).", lambda r, c: [S('*', c)] * r, [(3, 5), (1, 4), (4, 1), (2, 6)]),
("n21", "Karra jadvali 1–4", "1 dan 4 gacha karra jadvalini chiqaring (4 qator, 4 ustun).", lambda: tab(4), [()]),
("n23", "Ketma-ket sonlar uchburchagi (4 qator)", "Chiqaring: 1, keyin 2 3, keyin 4 5 6, keyin 7 8 9 10 (har biri alohida qatorda).", lambda: seq(4), [()]),
("n24", "n qatorli ketma-ket sonlar", "n kiritiladi. 1 dan boshlab ketma-ket sonlar bilan n qatorli uchburchak yasang: 1-qatorda 1 ta son, 2-qatorda 2 ta son va hokazo.", lambda n: seq(n), [(1,), (3,), (4,), (5,)]),
("n25", "Juft sonlar uchburchagi", "n kiritiladi. i-qatorda dastlabki i ta juft son chiqsin: 1-qatorda 2, 2-qatorda 2 4, 3-qatorda 2 4 6 va hokazo (n qator).", lambda n: [' '.join(str(2 * j) for j in range(1, i + 1)) for i in range(1, n + 1)], [(1,), (3,), (4,), (6,)]),
("n27", "Teskari yulduz shakli (5 qator)", "Chiqaring: 1-qatorda 5 ta *, keyin 4 ta, 3 ta, 2 ta va oxirgi qatorda 1 ta *.", lambda: [S('*', 5 - i) for i in range(5)], [()]),
("n31", "Kamayib boruvchi sonlar (5 qator)", "Chiqaring: 1 1 1 1 1, keyin 2 2 2 2, keyin 3 3 3, keyin 4 4, oxirida 5.", lambda: [S(i, 6 - i) for i in range(1, 6)], [()]),
("n32", "Kamayib boruvchi shakl", "n kiritiladi. i-qatorda i soni (n − i + 1) marta yozilsin (n qator): 1-qatorda 1 soni n marta, oxirgi qatorda n soni 1 marta.", lambda n: [S(i, n - i + 1) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n33", "Panjara belgisi", "4 qator chiqaring, har birida 6 ta # belgisi (bo'sh joy bilan ajratilgan).", lambda: [S('#', 6)] * 4, [()]),
("n34", "n qator, m ta #", "Avval n, keyin m kiritiladi. n qator chiqaring, har birida m ta # belgisi.", lambda n, m: [S('#', m)] * n, [(3, 5), (1, 4), (4, 1), (2, 6)]),
("n35", "3×3 sonlar jadvali", "Nested For bilan 3×3 jadval chiqaring: 1 2 3 / 4 5 6 / 7 8 9 (har bir qator alohida).", lambda: ['1 2 3', '4 5 6', '7 8 9'], [()]),
]
def fac(n):
    f = 1
    for i in range(2, n + 1): f *= i
    return f
W = [
("w01", "1 dan 10 gacha", "1 dan 10 gacha bo'lgan sonlarni While yordamida chiqaring.", lambda: list(range(1, 11)), [()]),
("w02", "1 dan 20 gacha", "1 dan 20 gacha bo'lgan sonlarni While yordamida chiqaring.", lambda: list(range(1, 21)), [()]),
("w03", "10 dan 1 gacha", "10 dan 1 gacha teskari tartibda sonlarni chiqaring.", lambda: list(range(10, 0, -1)), [()]),
("w04", "1 dan 15 gacha yig'indi", "1 dan 15 gacha bo'lgan sonlarning yig'indisini While bilan toping va chiqaring.", lambda: sum(range(1, 16)), [()]),
("w05", "1 dan n gacha", "n kiritiladi. 1 dan n gacha bo'lgan sonlarni chiqaring.", lambda n: list(range(1, n + 1)), [(1,), (5,), (8,), (3,)]),
("w06", "1 dan n gacha yig'indi", "n kiritiladi. 1 dan n gacha bo'lgan sonlarning yig'indisini toping.", lambda n: sum(range(1, n + 1)), [(1,), (5,), (10,), (100,)]),
("w07", "30 gacha juft sonlar", "1 dan 30 gacha bo'lgan juft sonlarni chiqaring.", lambda: list(range(2, 31, 2)), [()]),
("w08", "40 gacha toq sonlar", "1 dan 40 gacha bo'lgan toq sonlarni chiqaring.", lambda: list(range(1, 41, 2)), [()]),
("w09", "n gacha juft sonlar", "n kiritiladi (n ≥ 2). 1 dan n gacha juft sonlarni chiqaring.", lambda n: list(range(2, n + 1, 2)), [(2,), (7,), (10,), (5,)]),
("w10", "Salom 8 marta", "Ekranga While yordamida 8 marta “Salom” so'zini chiqaring (har biri alohida qatorda).", lambda: ['Salom'] * 8, [()]),
("w11", "Ismni 5 marta", "Foydalanuvchi ismini kiritadi (String). Ismni 5 marta chiqaring (har biri alohida qatorda).", lambda s: [s] * 5, [('Ali',), ('Madina',), ('Jasur',), ('Zilola',)]),
("w12", "Salom n marta", "n kiritiladi. “Salom” so'zini n marta chiqaring (har biri alohida qatorda).", lambda n: ['Salom'] * n, [(1,), (3,), (5,), (2,)]),
("w13", "50 gacha 5 ga bo'linadiganlar", "1 dan 50 gacha bo'lgan sonlar orasida 5 ga bo'linadiganlarini (son mod 5 = 0) chiqaring.", lambda: list(range(5, 51, 5)), [()]),
("w14", "Juft sonlar soni", "n kiritiladi. 1 dan n gacha sonlar orasida nechta juft son borligini toping.", lambda n: n // 2, [(1,), (10,), (7,), (100,)]),
("w15", "20 gacha kvadratlar", "1 dan 20 gacha bo'lgan har bir sonning kvadratini (son × son) chiqaring.", lambda: [i * i for i in range(1, 21)], [()]),
("w16", "n gacha kvadratlar", "n kiritiladi. 1 dan n gacha bo'lgan har bir sonning kvadratini (son × son) chiqaring.", lambda n: [i * i for i in range(1, n + 1)], [(1,), (4,), (7,), (10,)]),
("w17", "20 dan teskari juft sonlar", "20 dan 1 gacha teskari tartibda juft sonlarni chiqaring.", lambda: list(range(20, 0, -2)), [()]),
("w18", "a dan b gacha", "a va b kiritiladi (a ≤ b). a dan b gacha sonlarni chiqaring.", lambda a, b: list(range(a, b + 1)), [(1, 5), (3, 3), (10, 14), (-2, 2)]),
("w19", "a dan b gacha yig'indi", "a va b kiritiladi (a ≤ b). a dan b gacha bo'lgan sonlar yig'indisini toping.", lambda a, b: sum(range(a, b + 1)), [(1, 5), (3, 3), (10, 14), (-2, 2)]),
("w20", "3 ga ham 5 ga ham bo'linadiganlar", "1 dan 100 gacha sonlar orasida 3 ga ham, 5 ga ham bo'linadiganlarini chiqaring.", lambda: list(range(15, 101, 15)), [()]),
("w21", "Toq sonlar yig'indisi", "n kiritiladi. 1 dan n gacha toq sonlarning yig'indisini toping.", lambda n: sum(range(1, n + 1, 2)), [(1,), (10,), (7,), (100,)]),
("w22", "Ism va n", "Avval ism (String), keyin n kiritiladi. Ismni n marta chiqaring (har biri alohida qatorda).", lambda s, n: [s] * n, [('Ali', 3), ('Madina', 1), ('Jasur', 5), ('Zilola', 2)]),
("w23", "15 dan katta bo'lsa Salom", "1 dan 30 gacha sonlarni chiqaring. Son 15 dan katta bo'lsa, uning yoniga “Salom” deb yozing (masalan: 16 Salom).", lambda: [str(i) if i <= 15 else f'{i} Salom' for i in range(1, 31)], [()]),
("w24", "n dan 1 gacha", "n kiritiladi. n dan 1 gacha teskari tartibda sonlarni chiqaring.", lambda n: list(range(n, 0, -1)), [(1,), (5,), (3,), (10,)]),
("w25", "40 gacha 7 ga bo'linadiganlar", "1 dan 40 gacha bo'lgan sonlar orasida 7 ga bo'linadiganlarini chiqaring.", lambda: list(range(7, 41, 7)), [()]),
("w26", "Yig'indi va ko'paytma", "n kiritiladi (n kichik, 1–10). 1 dan n gacha sonlarning avval yig'indisini, keyin ko'paytmasini alohida qatorlarda chiqaring.", lambda n: [sum(range(1, n + 1)), fac(n)], [(1,), (3,), (5,), (6,)]),
("w27", "2 qadam bilan", "n kiritiladi. 1 dan n gacha 2 qadam bilan sonlarni chiqaring (1, 3, 5, ...).", lambda n: list(range(1, n + 1, 2)), [(1,), (10,), (7,), (2,)]),
("w28", "50 dan 10 gacha, −5 qadam", "50 dan 10 gacha −5 qadam bilan sonlarni chiqaring (50, 45, 40, ...).", lambda: list(range(50, 9, -5)), [()]),
("w29", "4 ga bo'linadiganlar soni", "n kiritiladi. 1 dan n gacha sonlar orasida nechta son 4 ga bo'linishini (son mod 4 = 0) toping.", lambda n: n // 4, [(3,), (4,), (20,), (100,)]),
("w30", "Juft yoki toq", "n kiritiladi. 1 dan n gacha sonlarni chiqaring: juft bo'lsa yoniga “Juft”, toq bo'lsa “Toq” deb yozing (masalan: 1 Toq).", lambda n: [f"{i} {'Juft' if i % 2 == 0 else 'Toq'}" for i in range(1, n + 1)], [(1,), (4,), (5,), (2,)]),
]
BOOK = {'nested-for': (NF, 'lines'), 'while': (W, 'tokens')}
