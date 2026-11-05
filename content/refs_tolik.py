"""Reference solutions for statements of MIRAE_Flowgorithm_Tolik_Toplam that have no earlier checker. NEW[(section, number)] = (fn, cases, mode, alt_fn)."""
import math
X = lambda *xs: [(x,) for x in xs]; N0 = [()]; yn = lambda c, a, b: (lambda *x: a if c(*x) else b); YN = lambda c: (lambda *x: 'yes' if c(*x) else 'no')
rg = lambda a, b, s=1: list(range(a, b + 1, s)) if s > 0 else list(range(a, b - 1, s)); S_ = lambda a, b, s=1: sum(rg(a, b, s)); rep = lambda w, k: [w] * k
NEW = {}
def add(sec, n, fn, cases, mode='tokens', alt=None): NEW[(sec, n)] = (fn, cases, mode, alt)
P2 = [(17, 5), (20, 4), (7, 3), (100, 7)]; J = "o'g'il"
for n, fn, cs in [(1, lambda a, b: a // b, P2), (2, lambda a, b: a % b, P2), (3, lambda n: n // 10, X(125, 9, 100, 47, 1000)), (4, lambda n: n % 10, X(125, 9, 100, 47, 1000)),
  (6, lambda n: n // 10, X(25, 99, 10, 47)), (7, lambda n: n % 10, X(25, 99, 10, 47)), (8, lambda n: n // 10 + n % 10, X(25, 99, 10, 47)), (9, lambda n: n % 10 * 10 + n // 10, X(25, 47, 99, 31)),
  (10, lambda n: n // 100, X(123, 999, 100, 457)), (11, lambda n: n // 10 % 10, X(123, 999, 100, 457)), (12, lambda n: n % 10, X(123, 999, 100, 457)), (13, lambda n: n // 100 + n // 10 % 10 + n % 10, X(123, 999, 100, 457)),
  (14, lambda n: n % 10 * 100 + n // 10 % 10 * 10 + n // 100, X(123, 456, 999, 321)), (15, lambda s: [s // 60, s % 60], X(130, 60, 59, 605)), (16, lambda s: [s // 3600, s % 3600 // 60, s % 60], X(3725, 3600, 59, 7322)),
  (17, lambda d: [d // 7, d % 7], X(20, 7, 3, 100)), (21, lambda s: [s // 1000, s % 1000], X(12345, 1000, 999, 50500)), (22, lambda s: [s // 500, s % 500 // 100, s % 100], X(1250, 500, 99, 2700)),
  (23, lambda n: n // 1000, X(1234, 9999, 1000, 5678)), (24, lambda n: sum(map(int, str(n))), X(1234, 9999, 1000, 5678)), (25, lambda h: [h // 24, h % 24], X(50, 24, 23, 100)), (26, lambda n: n % 100, X(12345, 100, 99, 2026)),
  (27, lambda n: n // 100, X(12345, 100, 99, 2026)), (28, lambda m: (m - 1) // 3 + 1, X(1, 3, 4, 12, 7, 9, 10)), (29, lambda n: n // 10 * (n % 10), X(25, 99, 10, 47, 31)), (30, lambda n: n // 100 + n % 10, X(123, 999, 100, 457)),
  (31, lambda n: [n // 30, n % 30], X(95, 30, 29, 100)), (32, lambda n: n % 9, X(10, 18, 100, 7)), (33, lambda y: y % 100, X(2026, 2000, 1999, 2100)), (34, lambda n: [n // 4, n % 4], X(17, 4, 3, 100)),
  (35, lambda a, b: [a // b, a % b], P2), (36, lambda n: n // 10 % 10, X(123, 999, 100, 457)), (37, lambda s: [s // 60, s % 60], X(130, 60, 59, 605)), (40, lambda n: n // 100, X(1234, 9999, 1000, 5678))]:
    add('3', n, fn, cs, 'numbers')
add('3', 5, YN(lambda n: n % 2 == 0), X(4, 7, 0, 10, 13), 'yesno'); add('3', 18, YN(lambda n: n % 5 == 0), X(20, 25, 7, 0, 11), 'yesno'); add('3', 19, YN(lambda n: n % 3 == 0), X(9, 10, 0, 12, 7), 'yesno')
add('3', 20, YN(lambda a, b: a % b == 0), [(10, 5), (10, 3), (9, 3), (7, 7), (8, 3)], 'yesno'); add('3', 38, YN(lambda n: n % 10 == 0), X(20, 25, 0, 100, 7), 'yesno')
for n, fn, cs in [(41, yn(lambda n: n > 50, 'Yuqori', 'Past'), X(60, 50, 10, 51, 100)), (42, yn(lambda s: s == 'Madina', 'Salom opajon!', 'Salom'), X('Madina', 'Ali', 'Vali', 'Zilola')),
  (43, yn(lambda n: n == 0, 'Nol kiritildi', 'Boshqa son kiritildi'), X(0, 5, -2, 100)), (44, yn(lambda a: a < 7, 'Maktabga hali erta', 'Maktabga borishingiz mumkin'), X(5, 7, 6, 10, 15)),
  (45, yn(lambda b: b == 2, 'Qayta topshirish kerak', 'Qabul qilindi'), X(2, 3, 4, 5)), (46, yn(lambda n: n > 20, "Zo'r!", "Yana o'qing"), X(25, 20, 5, 21)), (47, yn(lambda n: n >= 15, 'Katta yoki teng', 'Kichik'), X(15, 14, 20, 0)),
  (48, yn(lambda m: m > 10000, 'Xarid qilishingiz mumkin', 'Pulingiz yetmaydi'), X(15000, 10000, 5000, 10001)), (49, yn(lambda a, b: a > 10 and b > 5, 'Ikkalasi ham katta', 'Shart bajarilmadi'), [(11, 6), (10, 6), (11, 5), (20, 20), (1, 1)]),
  (50, yn(lambda g: g >= 3, 'Tasanno!', "Yana urinib ko'ring"), X(3, 2, 5, 0)), (51, lambda n: n / 2 if n % 2 == 0 else n, X(10, 7, 0, 9, 100)), (52, yn(lambda t: t > 30, 'Juda issiq', 'Normal'), X(35, 30, 10, 31)),
  (53, yn(lambda n: n == 100, 'Yuz', 'Yuz emas'), X(100, 99, 101, 0)), (54, yn(lambda i, f: i == 'Ali' and f == 'Valiyev', 'Xush kelibsiz, Ali Valiyev!', 'Salom'), [('Ali', 'Valiyev'), ('Ali', 'Karimov'), ('Vali', 'Valiyev'), ('Madina', 'Aliyeva')]),
  (55, yn(lambda a, b, c: a > b and a > c, 'Birinchi eng katta', 'Birinchi eng katta emas'), [(9, 3, 4), (3, 9, 4), (1, 2, 3), (10, 2, 5)]), (56, lambda x: "A'lo" if x == 0 else 'Yaxshi' if x <= 2 else 'Yomon', X(0, 1, 2, 3, 10)),
  (57, yn(lambda n: n % 2 == 0 and n % 3 == 0, "6 ga bo'linadi", "6 ga bo'linmaydi"), X(12, 4, 9, 6, 0, 18)), (58, yn(lambda y: 14 < y < 18, "O'smirlik chog'i", 'Boshqa yosh'), X(15, 14, 17, 18, 10, 30)),
  (59, yn(lambda a, b: a == 5 and b == 5, "Ikkalasi ham a'lo", "Hammasi a'lo emas"), [(5, 5), (5, 4), (4, 5), (3, 3)]), (60, yn(lambda h: h >= 8, 'Yaxshi dam oldingiz', 'Kam uxlabsiz'), X(8, 7, 10, 5)),
  (61, lambda n: -n if n < 0 else n, X(-5, 5, 0, -100, 7)), (62, yn(lambda m: m == 12, 'Yangi yil oyi!', 'Oddiy oy'), X(12, 1, 6, 11)), (63, yn(lambda a, b, c: a + b + c > 100, "Yig'indi katta", "Yig'indi kichik"), [(40, 40, 30), (30, 30, 40), (50, 50, 1), (1, 2, 3)]),
  (64, yn(lambda n: 1 <= n <= 100, '100 ichida', '100 dan tashqari'), X(50, 1, 100, 0, 101, -5)), (65, yn(lambda k: k > 10, 'Kitobxon ekansiz!', "Ko'proq o'qing"), X(11, 10, 25, 0)),
  (66, yn(lambda a, b: a % 2 == 0 and b % 2 == 1, 'Turli xil', 'Bir xil tur'), [(2, 3), (2, 4), (3, 3), (3, 2), (4, 7)]), (67, lambda b: "A'lo" if b >= 90 else 'Yaxshi' if b >= 70 else 'Qoniqarli' if b >= 60 else 'Yomon', X(95, 90, 89, 70, 69, 60, 59, 10)),
  (68, lambda n: 'Musbat' if n > 0 else 'Manfiy' if n < 0 else 'Nol', X(5, -3, 0, 100, -1)), (69, lambda n, y, b: f"Barakalla, {n}!" if y > 16 and b == 5 else f"Davom eting, {n}", [('Ali', 17, 5), ('Ali', 16, 5), ('Madina', 20, 4), ('Jasur', 10, 3)])]:
    add('4', n, fn, cs)
for n, fn, cs in [
 (1, lambda y, j: (('Katta yigit' if y > 30 else 'Yosh yigit') if j == J else ('Katta ayol' if y > 30 else 'Yosh qiz')) if y > 18 else 'Voyaga yetmagan', [(35, J), (20, J), (35, 'qiz'), (20, 'qiz'), (18, J), (10, 'qiz'), (30, J)]),
 (2, lambda b: (("A'lo" if b > 90 else 'Yaxshi') if b > 75 else 'Qoniqarli') if b > 60 else 'Yomon', X(95, 90, 80, 75, 65, 60, 30)),
 (3, lambda m: (('Juda yaxshi holat' if m > 150000 else 'Yaxshi holat') if m > 70000 else "O'rtacha") if m > 30000 else 'Qiyin holat', X(200000, 150000, 100000, 70000, 50000, 30000, 10000)),
 (4, lambda y, b: (("A'lo va katta yosh" if b == 5 else 'Yaxshi va katta yosh') if b in (4, 5) else 'Baho past') if y > 15 else 'Yoshi kichik', [(16, 5), (16, 4), (16, 3), (15, 5), (10, 2)]),
 (5, lambda t: (('Juda issiq' if t > 30 else 'Issiq') if t > 20 else 'Iliq') if t > 0 else 'Sovuq', X(35, 30, 25, 20, 10, 0, -5)),
 (6, lambda n, y, b: ((f"Barakalla, {n}! A'lo natija" if y > 16 else f"Barakalla, {n}! Yosh va a'lo") if b == 5 else f"{n}, yaxshiroq o'qing"), [('Ali', 17, 5), ('Ali', 16, 5), ('Madina', 20, 4), ('Jasur', 10, 3)]),
 (7, lambda x: 'Ideal natija' if x == 0 else 'Yaxshi natija' if x < 3 else "O'rtacha" if x < 7 else 'Yomon natija', X(0, 1, 2, 3, 6, 7, 20)),
 (8, lambda k: 'Dam olish' if k in (6, 7) else ('Hafta boshi' if k in (1, 2) else "Hafta o'rtasi"), X(6, 7, 1, 2, 3, 5)),
 (9, lambda y: (("O'rta maktab" if y > 12 else "Boshlang'ich maktab") if y < 18 else 'Maktabni tugatgan') if y > 7 else 'Maktab yoshiga yetmagan', X(15, 12, 13, 18, 25, 7, 5, 8)),
 (10, lambda p, n: ('Oson olasiz' if p >= 2 * n else "Olasiz, lekin qat'iy") if p >= n else ('Yaqin qolgansiz' if p * 2 > n else 'Pulingiz ancha kam'), [(100, 40), (100, 50), (60, 50), (50, 50), (30, 50), (25, 50), (10, 50)]),
 (11, lambda b: (("A'lo" if b > 90 else 'Yaxshi') if b > 70 else "O'rtacha") if b > 50 else 'Yomon', X(95, 90, 80, 70, 60, 50, 10)),
 (12, lambda y, j: (('Katta qiz' if j == 'qiz' else 'Katta yigit') if y > 18 else ('Yosh qiz' if j == 'qiz' else 'Yosh bola')), [(20, 'qiz'), (20, J), (18, 'qiz'), (10, J)]),
 (13, lambda k: ((("Juda ko'p" if k > 20 else 'Yaxshi') if k > 10 else "O'rtacha") if k > 3 else "Kam o'qibsiz"), X(25, 20, 15, 10, 5, 3, 0)),
 (14, lambda b, y: (("Katta va a'lo" if y > 17 else "Yosh va a'lo") if b == 5 else ('Yaxshi' if b == 4 else 'Past baho')), [(5, 18), (5, 17), (4, 10), (3, 10), (2, 20)]),
 (15, lambda h, f: ('Issiq yoz' if h > 30 else 'Oddiy yoz') if f == 3 else ('Sovuq' if h < 10 else 'Iliq'), [(35, 3), (30, 3), (20, 3), (5, 1), (10, 2), (25, 4), (9, 4)])]:
    add('5.2', n, fn, cs)
w = lambda sec, n, fn, cs, alt=None: add(sec, n, fn, cs, 'tokens', alt); Q4 = X(1, 3, 5, 2); NM = [('Ali', 3), ('Madina', 1), ('Jasur', 5), ('Zilola', 2)]; NS = X('Ali', 'Madina', 'Jasur', 'Zilola')
w('6.1', 5, lambda: rg(2, 40, 2), N0); w('6.1', 6, lambda: rg(40, 1, -2), N0); w('6.1', 8, lambda: rg(1, 50, 3), N0)
w('6.1', 11, lambda: [str(i) if i <= 45 else f'{i} Salom' for i in range(1, 61)], N0); w('6.1', 12, lambda: [str(i) if i <= 25 else f'{i} Katta' for i in range(1, 41)], N0)
w('6.1', 13, lambda: [f'{i} Juft' if i % 2 == 0 else str(i) for i in range(1, 51)], N0)
w('6.1', 14, lambda: [f'{i} Salom' if i > 10 else str(i) for i in range(1, 31)], N0, lambda: ['Salom' if i > 10 else str(i) for i in range(1, 31)])
w('6.1', 15, lambda: [f'{i} - chiqarildi' for i in range(1, 26)], N0); w('6.1', 17, lambda: rep('Dunyo', 12), N0); w('6.1', 18, lambda s: [s] * 6, NS)
w('6.1', 21, lambda: [f'{i} {i}-son' for i in range(1, 16)], N0, lambda: [f'{i}-son' for i in range(1, 16)]); w('6.1', 22, lambda: [f'{i} ketdi' for i in range(10, 0, -1)], N0)
w('6.1', 23, lambda: [f'{i} Yuqori' if i > 20 else str(i) for i in range(1, 41, 2)], N0); w('6.1', 26, lambda n: rep('Vazifa bajarildi', n), Q4); w('6.1', 27, lambda n: rep('Xush kelibsiz!', n), Q4)
w('6.1', 28, lambda n: [f'{i}-dars' for i in range(1, n + 1)], Q4); w('6.1', 29, lambda: [f'{i} Salom' if i > 15 else f'{i} Hayr' if i < 15 else str(i) for i in range(1, 31)], N0); w('6.1', 30, lambda s, n: [s] * n, NM)
for n, fn, cs in [(1, lambda: S_(1, 20), N0), (2, lambda: S_(1, 30), N0), (3, lambda: S_(2, 15, 2), N0), (4, lambda: S_(1, 25, 2), N0), (6, lambda n: S_(2, n, 2), X(2, 7, 10, 100)), (7, lambda: 25, N0), (8, lambda: 25, N0),
  (10, lambda: S_(5, 40, 5), N0), (11, lambda: 3628800, N0), (12, lambda n: math.factorial(n), X(1, 5, 10, 3)), (15, lambda n: (n + 1) / 2, X(1, 4, 10, 100)), (16, lambda: S_(10, 50), N0), (17, lambda: S_(1, 20), N0),
  (18, lambda a, b: S_(a, b), [(1, 5), (3, 3), (10, 14), (-2, 2)]), (19, lambda a, b: len([i for i in range(a, b + 1) if i % 2 == 0]), [(1, 10), (2, 2), (3, 3), (1, 5)]), (30, lambda n: S_(1, n, 2), X(1, 10, 7, 100)),
  (31, lambda: 25, N0), (32, lambda n: n // 3, X(2, 3, 10, 100)), (33, lambda: S_(5, 35, 5), N0)]:
    add('6.2', n, fn, cs, 'numbers')
w('6.2', 14, lambda: [i for i in range(1, 101) if i % 3 == 0 or i % 5 == 0], N0); w('6.2', 20, lambda: [f'{i} Salom' if i > 30 else str(i) for i in range(1, 61)], N0)
w('6.2', 21, lambda: [f"{i} {'Juft' if i % 2 == 0 else 'Toq'}" for i in range(1, 41)], N0); w('6.2', 22, lambda s: [s] * 10, NS); w('6.2', 24, lambda n: rep('Xush kelibsiz!', n), Q4)
w('6.2', 25, lambda n: rep('Vazifa bajarildi', n), Q4); w('6.2', 26, lambda n: [f'{i}-dars' for i in range(1, n + 1)], Q4); w('6.2', 27, lambda: [i * i for i in range(1, 26)], N0)
w('6.2', 29, lambda: rg(7, 49, 7), N0); w('6.2', 34, lambda s, n: [s] * n, NM); w('6.2', 35, lambda: [f'{i} Maxsus' if i > 20 and i % 2 == 0 else str(i) for i in range(1, 41)], N0)
for n, fn, cs in [(4, lambda n: S_(1, n, 2), X(1, 10, 7, 100)), (9, lambda a, b: S_(a, b), [(1, 5), (3, 3), (10, 14), (-2, 2)]), (10, lambda a, b: len([i for i in range(a, b + 1) if i % 2 == 0]), [(1, 10), (2, 2), (3, 3), (1, 5)]),
  (12, lambda n: S_(5, n, 5), X(4, 5, 20, 100)), (20, lambda n: n // 7, X(6, 7, 20, 100)), (22, lambda a, b: sum(i for i in range(a, b + 1) if i % 2), [(1, 10), (3, 3), (2, 7), (10, 21)]), (24, lambda n: [S_(1, n), n // 2], X(1, 4, 5, 10)),
  (29, lambda n: len([i for i in range(1, n + 1) if i % 3 == 0 or i % 5 == 0]), X(2, 10, 15, 100)), (32, lambda n: sum(i * i for i in range(1, n + 1)), X(1, 4, 7, 10)), (33, lambda n: n if n % 2 == 0 else n - 1, X(2, 7, 10, 15))]:
    add('6.3', n, fn, cs, 'numbers')
for n, fn, cs in [(3, lambda n: rg(2, n, 2), X(2, 7, 10, 5)), (6, lambda n: [f'{i} Katta' if i > 10 else str(i) for i in range(1, n + 1)], X(5, 10, 12, 20)), (7, lambda n: [f"{i} {'Juft' if i % 2 == 0 else 'Toq'}" for i in range(1, n + 1)], X(1, 4, 5, 2)),
  (8, lambda a, b: rg(a, b), [(1, 5), (3, 3), (10, 14), (-2, 2)]), (11, lambda n: rg(3, n, 3), X(3, 10, 12, 20)), (13, lambda n: [f'{i} Salom' if i > 15 else str(i) for i in range(1, n + 1)], X(5, 15, 18, 25)),
  (15, lambda n: rg(n, 1, -1), X(1, 5, 3, 10)), (18, lambda n: [f'{i}-chi' for i in range(1, n + 1)], X(1, 3, 5, 2)), (19, lambda n: [f'{i} Maxsus' if i % 2 == 0 and i % 3 == 0 else str(i) for i in range(1, n + 1)], X(5, 6, 13, 20)),
  (21, lambda a, b: [i for i in range(a, b + 1) if i % 2 == 0], [(1, 10), (2, 2), (3, 8), (11, 20)]), (23, lambda n: [f'{i} Yuqori' if i > 20 else f'{i} Past' for i in range(1, n + 1)], X(5, 20, 22, 25)),
  (25, lambda n: [f'{i}. Salom' for i in range(1, n + 1)], Q4), (26, lambda n: [i for i in range(4, n + 1, 4)] + [S_(4, n, 4)], X(4, 10, 20, 7)),
  (27, lambda n: [f'{i} Juft' if i % 2 == 0 else str(i) for i in range(n, 0, -1)], X(1, 5, 6, 10)), (28, lambda a, b, k: rg(a, b, k), [(1, 10, 3), (2, 20, 5), (5, 5, 1), (1, 7, 2)]),
  (30, lambda n: [f"{i} {'Kichik' if i < 10 else 'Katta' if i > 20 else 'Orta'}" for i in range(1, n + 1)], X(5, 10, 20, 25)), (31, lambda n: [f"O'quvchi {i} - salom" for i in range(1, n + 1)], Q4),
  (34, lambda n: [f"{i} *****" if i % 5 == 0 else str(i) for i in range(1, n + 1)], X(4, 5, 10, 12)), (35, lambda n: ['Juft son' if i % 2 == 0 else 'Toq son' for i in range(1, n + 1)], X(1, 4, 5, 2))]:
    add('6.3', n, fn, cs)
add('6.4', 35, lambda n: [' '.join(str(j) for j in range((i - 1) * n + 1, i * n + 1)) for i in range(1, n + 1)], X(1, 2, 3, 4), 'lines')
