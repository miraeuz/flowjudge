"""Reference solutions for the book problems. REFS[topic][number] = (fn, cases[, mode]). The problem text itself is imported from content/source/book.txt.
Problems without an entry (when the expected output is ambiguous) stay in practice mode (Run + self-check)."""
one = lambda *xs: [(x,) for x in xs]
C2 = [(7, 3), (10, -4), (0, 5), (120, 45)]; C3 = [(1, 2, 3), (10, 20, 30), (0, 0, 5), (-4, 9, 2)]
yn = lambda c, a, b: (lambda *x: a if c(*x) else b)
S = lambda x, k: ' '.join([str(x)] * k)
N0 = [()]
E1 = {1: 'Salom', 2: 'Salom Ali', 4: '5', 5: '10 20', 6: '10', 7: '11', 8: '48', 9: '4', 10: '81', 11: '16 49', 12: '13', 13: '34', 14: '22', 15: '6', 16: '18', 17: '-3', 18: '12', 19: '2', 20: '15',
 21: '12000', 22: '10000', 23: '32000', 24: '33', 25: '32', 26: '25 25', 27: '100 100 100', 28: 'Ism: Ali\nYosh: 15', 29: 'Maktab: 45-maktab\nSinf: 8-A', 30: '8 5 13', 31: '17', 32: '15', 33: '64', 34: '36000', 35: '17000',
 36: '24', 37: '10', 38: '7', 39: 'Salom\n' * 4 + 'Salom', 40: '1. Kitob\n2. Daftar\n3. Ruchka', 41: 'a ning qiymati = 5', 42: 'Salom Ali', 43: '11 5', 44: '4 5 6', 45: '11', 46: '15', 47: '12', 48: '38000', 49: '7.5',
 50: '58', 51: '35', 52: '60 17', 53: 'Mening yoshim 14 da', 54: "Men 8-sinfda o'qiyman", 55: '10 25', 56: '10\n10\n10', 57: '12000', 58: '26', 59: '343', 60: '1-qadam\n2-qadam\n3-qadam', 61: '4 12', 62: '5', 63: '14', 64: '10', 65: '85'}
R1 = {i: ((lambda e=e: e), N0, 'lines' if i in (28, 29, 39, 40, 56, 60) else 'tokens') for i, e in E1.items()}
R2 = {
 1: (lambda s: f"Salom, {s}!", one('Ali', 'Madina', 'Jasur', 'Zilola')), 2: (lambda n: n, one(5, 0, -3, 100)), 3: (lambda a, b: a + b, C2), 4: (lambda a, b: a - b, C2), 5: (lambda a, b: a * b, C2),
 6: (lambda n: n * n, one(5, 12, 0, -7)), 7: (lambda y: f"Sizning yoshingiz: {y}", one(15, 8, 30, 12)), 8: (lambda p: 4 * p, one(3000, 2500, 0, 4500)), 9: (lambda p: 6 * p, one(2000, 1500, 0, 3000)),
 10: (lambda m: m - 18000, one(50000, 18000, 100000, 25000)), 11: (lambda a, b: a + b, [(18, 14), (10, 12), (0, 5), (15, 15)]), 12: (lambda a, b: a - b, [(45, 12), (30, 30), (50, 8), (20, 5)]),
 13: (lambda p: 3 * p, one(12000, 10000, 0, 15000)), 14: (lambda d, r: 2 * d + 3 * r, [(4000, 3000), (5000, 2000), (0, 1000), (3500, 2500)]),
 15: (lambda n, y: f"Ism: {n}\nYosh: {y}", [('Ali', 15), ('Madina', 12), ('Jasur', 17), ('Zilola', 14)], 'lines'), 16: (lambda y, a: y - a, [(2025, 15), (2025, 30), (2024, 10), (2025, 0)]),
 17: (lambda p, c: p * c, [(3000, 4), (12000, 2), (500, 0), (2500, 10)]), 18: (lambda a, b, c: a + b + c, [(5, 4, 5), (3, 3, 3), (5, 5, 4), (2, 3, 4)]), 19: (lambda f: 2 * f, one(4, 5, 1, 8)),
 20: (lambda w: 6 * w, one(100000, 80000, 0, 150000)), 21: (lambda s: 4 * s, one(5, 10, 1, 25)), 22: (lambda s: s * s, one(5, 10, 1, 12)), 23: (lambda l, w: l * w, [(5, 3), (10, 10), (7, 1), (12, 4)]),
 24: (lambda l, w: 2 * (l + w), [(5, 3), (10, 10), (7, 1), (12, 4)]), 25: (lambda s: s ** 3, one(2, 3, 5, 10)), 26: (lambda a, b: (a + b) / 2, [(4, 6), (5, 8), (0, 0), (3, 10)]),
 27: (lambda h: f"Bugun {h} soat dars o'qidingiz", one(3, 5, 1, 6)), 28: (lambda g: 200 * g, one(5, 8, 0, 12)), 29: (lambda k: 8 * k, one(10, 25, 0, 50)), 30: (lambda h: 3000 * h, one(2, 5, 1, 10)),
 31: (lambda a, b, c: [a + b + c, a * b * c], C3), 32: (lambda a, b: [a + b, a - b, a * b], C2), 34: (lambda p: [2 * p, 5 * p], one(12000, 15000, 10000, 20000)), 35: (lambda p: 7 * p, one(10, 25, 1, 40)),
 36: (lambda n: (n + 10) * 2, one(5, 0, -4, 20)), 37: (lambda a, b: a * b + 10, C2), 38: (lambda a, b, c: (a + b) * c, C3), 39: (lambda h: f"Hozir soat: {h}", one(9, 0, 23, 14)), 40: (lambda k: 10 * k, one(3, 10, 0, 25)),
 41: (lambda d: f"Bugun siz {d} ta dars o'tdingiz", one(4, 6, 1, 5)), 42: (lambda f: 5 * f, one(3000, 5000, 2000, 4500)), 43: (lambda f: 2 * f, one(5, 10, 1, 20)), 44: (lambda p: p / 3, one(900000, 3000000, 600000, 1200000)),
 45: (lambda m: f"Hozir {m}-oy", one(1, 5, 12, 9)), 46: (lambda n: n - 2, one(11, 15, 12, 18)), 47: (lambda p: 4 * p, one(20, 30, 10, 45)), 48: (lambda b: 25 * b, one(2, 10, 1, 40)), 49: (lambda w: 10 * w, one(5, 20, 1, 15)),
 50: (lambda m: 3 * m, one(2000000, 3000000, 1500000, 5000000)), 51: (lambda p: 6 * p, one(50000, 80000, 120000, 35000)), 52: (lambda k: f"Siz {k} ta kitob o'qibsiz. Barakalla!", one(3, 10, 1, 20)),
 53: (lambda l: 7 * l, one(100, 150, 80, 200)), 54: (lambda m: f"Siz {m} ta xato qildingiz", one(3, 0, 5, 10)), 55: (lambda p, e: 4 * p + 2 * e, [(2000, 500), (1500, 300), (3000, 1000), (1000, 0)]),
 56: (lambda d: f"Sizning tug'ilgan kuningiz: {d}", one(5, 15, 28, 1)), 57: (lambda p: 2 * p, one(150000, 200000, 300000, 120000)), 58: (lambda m: 5 * m, one(30, 45, 60, 20)),
 59: (lambda y, a: a + 10, [(2025, 15), (2025, 30), (2024, 10), (2025, 5)]), 60: (lambda n: n, one(3, 10, 1, 8)), 61: (lambda g: f"Siz {g} ta gol urdingiz!", one(3, 0, 5, 10)), 62: (lambda k: 8 * k, one(2, 5, 1, 10)),
 63: (lambda d: 6 * d, one(5, 6, 4, 7)), 64: (lambda p: 3 * p, one(10, 20, 15, 8)), 65: (lambda g: 3 * g, one(4, 10, 1, 15)), 66: (lambda t: f"Bugun {t} ta vazifa bajardingiz", one(3, 5, 0, 8)),
 67: (lambda p: 5 * p, one(20000, 35000, 15000, 40000)), 68: (lambda x: f"Siz {x} ta xat yozdingiz", one(2, 5, 10, 1)), 69: (lambda n: n / 2, one(4, 10, 3, 12)),
 70: (lambda n, y: f"Salom, {n}!\nSiz {y} yoshdasiz.", [('Ali', 15), ('Madina', 12), ('Jasur', 17), ('Zilola', 14)], 'lines'),
}
R4 = {
 1: (yn(lambda n: n > 10, 'Katta', 'Katta emas'), one(15, 10, 3, -5, 11)), 2: (yn(lambda n: n == 5, "To'g'ri", "Noto'g'ri"), one(5, 4, 6, 0, -5)), 3: (yn(lambda n: n == 0, 'Nol', 'Nol emas'), one(0, 5, -2, 100)),
 4: (yn(lambda n: n < 100, 'Kichik', 'Kichik emas'), one(50, 100, 99, 150, -3)), 5: (yn(lambda n: n >= 18, 'Voyaga yetgan', 'Voyaga yetmagan'), one(18, 17, 40, 5)), 6: (yn(lambda n: n == 5, "A'lo", ''), one(5, 4, 3, 1, 2)),
 7: (yn(lambda n: n in (4, 5), 'Yaxshi', 'Yaxshi emas'), one(5, 4, 3, 2, 1)), 8: (yn(lambda s: s == '1234', 'Xush kelibsiz!', "Parol noto'g'ri"), one('1234', '4321', '12345', '0000')),
 9: (yn(lambda s: s == 'Ali', "Salom do'stim!", 'Salom'), one('Ali', 'Vali', 'Madina', 'Jasur')), 10: (yn(lambda n: 1 <= n <= 10, "To'g'ri oraliq", "Noto'g'ri oraliq"), one(5, 1, 10, 0, 11, -3)),
 11: (yn(lambda t: t < 0, 'Sovuq', 'Iliq'), one(-5, 0, 10, -1)), 12: (yn(lambda b: b >= 60, "O'tdi", "O'tmadi"), one(60, 59, 100, 0)), 13: (yn(lambda d: d in (6, 7), 'Dam olish kuni', 'Ish kuni'), one(6, 7, 1, 3, 5)),
 14: (lambda n: n * 2 if n > 10 else n, one(15, 10, 3, -5, 11)), 15: (lambda n: n + 5 if n < 20 else n, one(10, 20, 25, 0, 19)), 16: (lambda a, b: max(a, b), [(3, 9), (9, 3), (5, 5), (-1, -5)]),
 17: (lambda a, b: min(a, b), [(3, 9), (9, 3), (5, 5), (-1, -5)]), 18: (lambda a, b: 'Teng' if a == b else 'Teng emas', [(3, 3), (3, 4), (0, 0), (-1, 1)]),
 19: (lambda y: 'Bola' if y < 12 else "O'smir" if y < 18 else 'Katta', one(5, 12, 17, 18, 40)), 20: (yn(lambda n: n > 0, 'Musbat', 'Musbat emas'), one(5, 0, -3, 100)), 21: (yn(lambda n: n < 0, 'Manfiy', 'Manfiy emas'), one(-5, 0, 3, -100)),
 22: (lambda n: 'Musbat' if n > 0 else 'Manfiy' if n < 0 else 'Nol', one(5, -3, 0, 100, -1)), 23: (yn(lambda n: n % 2 == 0, 'Juft', 'Toq'), one(4, 7, 0, -3, 10)),
 24: (lambda n: 'Juft musbat' if n % 2 == 0 and n > 0 else 'Boshqa holat', one(4, 7, 0, -4, 10)), 25: (lambda a, b: 'Ikkalasi ham musbat' if a > 0 and b > 0 else '', [(3, 4), (1, 1), (-1, 5), (0, 3), (5, -2)]),
 26: (lambda a, b: 'Musbat son bor' if a > 0 or b > 0 else '', [(3, -4), (-1, -1), (0, 0), (-5, 2), (4, 4)]), 27: (lambda a, b, c: max(a, b, c), [(3, 9, 4), (5, 5, 5), (-1, -5, -3), (10, 2, 10)]),
 28: (lambda a, b, c: min(a, b, c), [(3, 9, 4), (5, 5, 5), (-1, -5, -3), (10, 2, 10)]), 29: (lambda a, b, c: "A'lo o'quvchi" if a == b == c == 5 else '', [(5, 5, 5), (5, 5, 4), (4, 4, 4), (5, 3, 5)]),
 30: (lambda n, y: f"Salom, {n}! Siz kattasiz" if y > 18 else f"Salom, {n}! Siz hali yoshsiz", [('Ali', 20), ('Madina', 18), ('Jasur', 30), ('Zilola', 12)]), 31: (yn(lambda n: n % 3 == 0, "Bo'linadi", "Bo'linmaydi"), one(9, 10, 0, 12, 7)),
 32: (yn(lambda n: n > 50000, 'Yetarli pul bor', 'Pul yetarli emas'), one(60000, 50000, 10000, 120000)), 33: (yn(lambda n: n == 0, 'Ajoyib!', "Yana urinib ko'ring"), one(0, 1, 5, 10)),
 34: (yn(lambda n: 0 < n < 100, 'Oraliqda', 'Tashqarida'), one(50, 0, 100, 1, 99, -5, 150)), 35: (lambda a, b: a - b if a > b else a + b, [(9, 4), (3, 8), (5, 5), (-2, -7)]),
 36: (yn(lambda n: n >= 5, 'Barakalla!', 'Yana biroz harakat qiling'), one(5, 4, 10, 0)), 37: (lambda t: 'Juda sovuq' if t < 0 else 'Sovuq' if t <= 15 else 'Iliq' if t <= 25 else 'Issiq', one(-5, 0, 15, 16, 25, 26, 40)),
 38: (lambda b: "A'lo" if b == 5 else 'Yaxshi' if b == 4 else 'Qoniqarli' if b == 3 else 'Yomon', one(5, 4, 3, 2, 1)), 39: (lambda y, h: 'Kirish mumkin' if y > 12 and h > 140 else 'Kirish mumkin emas', [(13, 150), (12, 160), (15, 140), (10, 120), (14, 141)]),
 40: (lambda a, b, c: 'Uchala son teng' if a == b == c else 'Teng emas', [(3, 3, 3), (3, 3, 4), (0, 0, 0), (1, 2, 3)]),
}
R5 = {
 1: (lambda a: ('Pensiyaga chiqqan' if a > 60 else 'Ishlash yoshida') if a >= 18 else 'Voyaga yetmagan', one(17, 18, 60, 61, 30)),
 2: (lambda b: ("A'lo" if b == 5 else 'Yaxshi') if b >= 4 else "Yaxshiroq o'qish kerak", one(5, 4, 3, 1)),
 3: (lambda m: ('Yetarli pul bor' if m > 100000 else "O'rtacha pul") if m > 50000 else 'Pul yetarli emas', one(120000, 100000, 60000, 50000, 20000)),
 4: (lambda t: ('Issiq' if t > 25 else 'Iliq') if t > 0 else 'Sovuq', one(30, 25, 10, 0, -5)),
 5: (lambda a, b: ('Barakalla!' if b == 5 else 'Yaxshi, davom eting') if a > 16 else 'Hali yoshsiz', [(17, 5), (17, 4), (16, 5), (10, 3)]),
 6: (lambda n, a: ('Salom katta Ali' if a > 18 else 'Salom yosh Ali') if n == 'Ali' else 'Salom', [('Ali', 20), ('Ali', 18), ('Vali', 30), ('Ali', 10)]),
 7: (lambda b: ("A'lo" if b > 85 else 'Yaxshi') if b >= 60 else "O'tmadi", one(90, 85, 60, 59, 30)),
 8: (lambda x: 'Ajoyib!' if x == 0 else ('Yaxshi' if x < 3 else "Ko'p xato qilibsiz"), one(0, 1, 2, 3, 10)),
 9: (lambda k: 'Dam olish kuni' if k in (6, 7) else ("Dushanba – og'ir kun" if k == 1 else 'Oddiy ish kuni'), one(6, 7, 1, 3, 5)),
 10: (lambda a: ("Maktab o'quvchisi" if a < 17 else 'Maktabni tugatgan') if a > 7 else 'Maktab yoshiga yetmagan', one(10, 17, 16, 7, 5, 8)),
 11: (lambda p, n: ('Oson xarid qilasiz' if p >= 2 * n else 'Xarid qilishingiz mumkin') if p >= n else 'Pulingiz yetmaydi', [(100000, 40000), (100000, 50000), (60000, 50000), (30000, 50000), (50000, 50000)]),
 12: (lambda b: "A'lo" if b == 5 else ('Yaxshi' if b == 4 else 'Qoniqarli yoki yomon'), one(5, 4, 3, 2)),
 13: (lambda k: ("Juda ko'p o'qibsiz" if k > 15 else "Yaxshi o'qiyapsiz") if k > 5 else "Ko'proq o'qing", one(20, 16, 15, 6, 5, 2)),
 14: (lambda a, j: ('Katta yigit' if j == "o'g'il" else 'Katta qiz') if a > 18 else 'Hali yosh', [(20, "o'g'il"), (20, 'qiz'), (18, "o'g'il"), (10, 'qiz')]),
 15: (lambda t: 'Juda issiq' if t > 30 else ('Iliq' if t > 15 else 'Sovuq'), one(35, 30, 20, 15, 5)),
 16: (lambda b, a: ('Yaxshi natija + katta yosh' if a > 16 else 'Yaxshi natija') if b > 70 else 'Natija past', [(80, 17), (80, 16), (70, 20), (50, 10)]),
 17: (lambda k: 'Dars qoldirmabsiz' if k == 0 else ('Ozgina qoldiribsiz' if k < 3 else "Ko'p dars qoldiribsiz"), one(0, 1, 2, 3, 7)),
 18: (lambda a: ("O'smir" if a < 18 else 'Katta') if a > 12 else 'Bola', one(10, 12, 13, 17, 18, 40)),
 19: (lambda m: 'Boyroq' if m > 100000 else ("O'rtacha" if m > 30000 else 'Kam pul'), one(150000, 100000, 50000, 30000, 10000)),
 20: (lambda n, b: ("A'lo, Ali!" if n == 'Ali' else "A'lo") if b == 5 else "Yaxshiroq o'qing", [('Ali', 5), ('Vali', 5), ('Ali', 4), ('Vali', 3)]),
}
rg = lambda a, b, s=1: list(range(a, b + 1, s)) if s > 0 else list(range(a, b - 1, s))
star = lambda n: [S('*', n)] * n
R6 = {
 1: (lambda: rg(1, 20), N0), 2: (lambda: rg(1, 30), N0), 3: (lambda: rg(10, 1, -1), N0), 4: (lambda: rg(1, 30, 2), N0), 5: (lambda: rg(2, 40, 2), N0), 6: (lambda: rg(40, 1, -2), N0), 7: (lambda: rg(50, 10, -5), N0),
 8: (lambda: rg(1, 50, 3), N0), 9: (lambda: rg(5, 45, 5), N0), 10: (lambda: rg(100, 50, -10), N0), 11: (lambda: [str(i) if i <= 45 else f'{i} Salom' for i in range(1, 61)], N0),
 12: (lambda: [str(i) if i <= 25 else f'{i} Katta' for i in range(1, 41)], N0), 13: (lambda: [f'{i} Juft' if i % 2 == 0 else str(i) for i in range(1, 51)], N0), 14: (lambda: ['Salom'] * 8, N0),
 15: (lambda s: [s] * 6, one('Ali', 'Madina', 'Jasur', 'Zilola')), 16: (lambda n: ['Salom'] * n, one(1, 3, 5, 2)), 17: (lambda n: rg(1, n), one(1, 5, 8, 3)), 18: (lambda n: rg(2, n, 2), one(2, 7, 10, 5)),
 19: (lambda n: sum(rg(1, n)), one(1, 5, 10, 100)), 20: (lambda n: sum(rg(2, n, 2)), one(2, 7, 10, 100)), 21: (lambda n: n // 2, one(1, 10, 7, 100)), 22: (lambda a, b: rg(a, b), [(1, 5), (3, 3), (10, 14), (-2, 2)]),
 23: (lambda a, b: sum(rg(a, b)), [(1, 5), (3, 3), (10, 14), (-2, 2)]), 24: (lambda: rg(15, 100, 15), N0), 25: (lambda n: [i * i for i in range(1, n + 1)], one(1, 4, 7, 10)), 26: (lambda n: sum(rg(1, n, 2)), one(1, 10, 7, 100)),
 27: (lambda n: rg(n, 1, -1), one(1, 5, 3, 10)), 28: (lambda n: rg(1, n, 2), one(1, 10, 7, 2)), 29: (lambda n: [f"{i} {'Juft' if i % 2 == 0 else 'Toq'}" for i in range(1, n + 1)], one(1, 4, 5, 2)),
 30: (lambda n: sum(rg(5, n, 5)), one(4, 5, 20, 100)),
 31: (lambda: [S('*', 5)] * 3, N0, 'lines'), 32: (star, one(1, 3, 4, 6), 'lines'), 33: (lambda n: [S('*', i) for i in range(1, n + 1)], one(1, 3, 5, 7), 'lines'),
 34: (lambda n: [' '.join(str(i * j) for j in range(1, n + 1)) for i in range(1, n + 1)], one(1, 3, 4, 6), 'lines'), 35: (lambda n: [' '.join(map(str, range(1, i + 1))) for i in range(1, n + 1)], one(1, 3, 5, 6), 'lines'),
}
R7 = {
 1: R6[1], 2: (lambda: rg(1, 20), N0), 3: (lambda: rg(10, 1, -1), N0), 4: (lambda: sum(rg(1, 15)), N0), 5: R6[17], 6: R6[19], 7: (lambda: rg(2, 30, 2), N0), 8: (lambda: rg(1, 40, 2), N0), 9: R6[18], 10: R6[14],
 11: (lambda s: [s] * 5, one('Ali', 'Madina', 'Jasur', 'Zilola')), 12: R6[16], 13: (lambda: rg(5, 50, 5), N0), 14: R6[21], 15: (lambda: [i * i for i in range(1, 21)], N0), 16: R6[25], 17: (lambda: rg(20, 2, -2), N0),
 18: R6[22], 19: R6[23], 20: (lambda: rg(15, 100, 15), N0), 21: R6[26], 22: (lambda s, n: [s] * n, [('Ali', 3), ('Madina', 1), ('Jasur', 5), ('Zilola', 2)]), 23: (lambda: [str(i) if i <= 15 else f'{i} Salom' for i in range(1, 31)], N0),
 24: R6[27], 25: (lambda: rg(7, 40, 7), N0), 26: R6[28], 27: R6[7], 28: (lambda n: n // 4, one(3, 4, 20, 100)), 29: R6[29], 30: (lambda n: [sum(rg(1, n)), n // 2], one(1, 4, 5, 10)),
}
REFS = {'output': R1, 'input': R2, 'if': R4, 'nested-if': R5, 'for': R6, 'while': R7}
