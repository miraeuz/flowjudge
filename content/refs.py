"""Reference solutions. id -> (python function, test cases). Expected outputs are COMPUTED from the function, like Mirae Academy's build.py.
First 2 cases are shown as examples, the rest are hidden. Add one line per problem, then run tools/build_content.sh"""
one = lambda *xs: [(x,) for x in xs]
C2 = [(7, 3), (10, -4), (0, 5), (120, 45)]; C2d = [(20, 4), (7, 2), (-9, 3), (0, 5)]; C3 = [(1, 2, 3), (10, 20, 30), (0, 0, 5), (-4, 9, 2)]
AVG3 = [(5, 4, 3), (5, 5, 5), (2, 3, 4), (3, 3, 4)]
def yn(cond, a, b): return lambda n: a if cond(n) else b
R = {
 # basics (inputs)
 'basics-109': (lambda a, b: a + b, C2), 'basics-110': (lambda a, b: a - b, C2), 'basics-111': (lambda a, b: a * b, C2), 'basics-112': (lambda a, b: a / b, C2d),
 'basics-113': (lambda a, b: a + b - 5, C2), 'basics-114': (lambda a, b: a - b + 3, C2), 'basics-115': (lambda a, b: a * b + 4, C2), 'basics-116': (lambda a, b: (a + b) * 2, C2),
 'basics-117': (lambda a, b: (a - b) * 3, C2), 'basics-118': (lambda a, b, c: a + b + c, C3), 'basics-119': (lambda a, b, c: a + b - c, C3), 'basics-120': (lambda n: n * n, one(5, 12, 0, -7)),
 # input
 'input-106': (lambda n: n, one(7, 0, -3, 100)), 'input-107': (lambda n: n + 5, one(7, 0, -3, 100)), 'input-108': (lambda n: n - 3, one(7, 0, -3, 100)), 'input-109': (lambda n: n * 2, one(7, 0, -3, 100)),
 'input-110': (lambda n: n / 4, one(10, 7, 0, -8)), 'input-111': (lambda a, b: a + b + 2, C2), 'input-112': (lambda a, b: a - b - 1, C2), 'input-113': (lambda n: n * 5 - 2, one(3, 0, -2, 10)),
 'input-114': (lambda n: n * 2 + 7, one(3, 0, -2, 10)), 'input-115': (lambda a, b, c: a + b - c, C3), 'input-116': (lambda n: n + 5, one(12, 17, 30, 0)), 'input-117': (lambda n: n * 3, one(2500, 10000, 0, 999)),
 'input-118': (lambda n: n * 2, one(4, 0, -6, 50)), 'input-119': (lambda n: n / 30, one(900000, 1500000, 30000, 0)), 'input-120': (lambda n: n / 100, one(250, 100, 50, 1234)),
 # types
 'types-101': (lambda a, b: a + b, C2), 'types-102': (lambda a, b: a - b, C2), 'types-103': (lambda a, b: a * b, C2), 'types-104': (lambda n: n * n, one(5, 12, 0, -7)),
 'types-105': (lambda a, b, c: a + b + c, C3), 'types-106': (lambda a, b: a + b, [(12, 14), (0, 20), (15, 15), (3, 0)]), 'types-107': (lambda n: 6 * n, one(3, 10, 0, 25)),
 'types-108': (lambda n: n + 5, one(12, 17, 30, 0)), 'types-109': (lambda n: 100 - n, one(12, 0, 100, 45)), 'types-110': (lambda n: 3 * n + 2, one(4, 0, -2, 10)),
 'types-111': (lambda a, b: (a + b) / 2, [(4, 6), (5, 8), (0, 0), (-3, 4)]), 'types-112': (lambda a, b, c: (a + b + c) / 3, AVG3),
 'types-113': (lambda x: x, one(36.6, 45.5, 70, 12.25)), 'types-114': (lambda x: x, one(1.75, 1.5, 1.82, 2)), 'types-115': (lambda x: x, one(24.5, -3.5, 0, 36.6)),
 'types-116': (lambda a, b: a / b, C2d), 'types-117': (lambda p, w: p * w, [(12000, 2.5), (8000, 1), (15000, 0.5), (0, 3)]), 'types-118': (lambda n: n / 30, one(900000, 1000000, 0, 3000000)),
 'types-119': (lambda a, b, c: (a + b + c) / 3, [(60.5, 70, 80), (50, 50, 50), (33.3, 40.2, 45.9), (100, 90, 80)]), 'types-120': (lambda n: n / 7, one(700000, 1000000, 0, 350)),
 # if
 'if-101': (yn(lambda n: n > 10, 'Katta', 'Kichik'), one(15, 10, 3, -5, 11)), 'if-102': (yn(lambda n: n > 100, 'Ha', "Yo'q"), one(150, 100, 99, 101)),
 'if-103': (yn(lambda n: n >= 55, "O'tdi", 'Yiqildi'), one(55, 54, 100, 0)), 'if-104': (yn(lambda n: n >= 18, 'Katta', 'Bola'), one(18, 17, 40, 5)),
 'if-105': (lambda a, b: 'Teng' if a == b else 'Teng emas', [(3, 3), (3, 4), (0, 0), (-1, 1)]), 'if-106': (lambda a, b: 'Birinchisi katta' if a > b else 'Ikkinchisi katta', [(5, 3), (3, 5), (4, 4), (-1, -2)]),
 'if-107': (yn(lambda n: n > 50000, 'Qimmat', 'Arzon'), one(50001, 50000, 1000, 120000)), 'if-108': (yn(lambda n: n < 0, 'Sovuq', 'Sovuq emas'), one(-5, 0, 10, -1)),
 'if-109': (yn(lambda n: n == 0, 'Tugagan', 'Bor'), one(0, 5, 1, 100)), 'if-110': (yn(lambda n: n % 2 == 0, 'Juft', 'Toq'), one(4, 7, 0, -3, 10)),
 'if-111': (yn(lambda n: n == 0, 'Nol', 'Nol emas'), one(0, 5, -2, 100)), 'if-112': (yn(lambda n: n >= 90, "A'lo", "A'lo emas"), one(90, 89, 100, 40)),
 'if-113': (yn(lambda n: n > 150, 'Baland', 'Past'), one(151, 150, 170, 100)), 'if-114': (yn(lambda n: n > 12, "Ko'p", 'Kam'), one(13, 12, 5, 40)),
 'if-115': (yn(lambda n: n > 65, "Nafaqaxo'r", 'Ishlaydi'), one(66, 65, 30, 80)), 'if-116': (yn(lambda n: n % 10 == 0, "10 ga bo'linadi", "bo'linmaydi"), one(20, 25, 0, 100, 7)),
 'if-117': (yn(lambda n: n > 100, "Og'ir", "Og'ir emas"), one(101, 100, 60, 150)), 'if-118': (lambda n: n * 2 if n > 5 else n, one(6, 5, 2, -3, 10)),
 'if-119': (lambda a, b: 'Birinchisi yuqori' if a > b else 'Ikkinchisi yuqori', [(5, 4), (3, 5), (4, 4), (2, 1)]), 'if-120': (yn(lambda n: n == 7, 'Yetti', 'Boshqa son'), one(7, 8, 0, -7)),
}
