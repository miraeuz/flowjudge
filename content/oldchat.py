"""'Old chat' problems: Nested For (35) as given by the teacher. Row: (id, title, statement, fn, cases). Pattern problems are judged line by line."""
S = lambda x, k: ' '.join([str(x)] * k)
R = lambda a, b: ' '.join(map(str, range(a, b + 1)))
tab = lambda n: [' '.join(str(i * j) for j in range(1, n + 1)) for i in range(1, n + 1)]
def seq(n):
    c = 0; o = []
    for i in range(1, n + 1): o.append(R(c + 1, c + i)); c += i
    return o
star = lambda n: [S('*', n)] * n
NF = [
("n01", "3 qator, har birida 5 ta yulduzcha", "Quyidagi ko'rinishda chiqaring (3 qator, har birida 5 ta yulduzcha):\n* * * * *\n* * * * *\n* * * * *", lambda: [S('*', 5)] * 3, [()]),
("n02", "n qator, har birida n ta *", "Foydalanuvchi n sonini kiritsin. n qator, har birida n ta * chiqaring.", star, [(1,), (3,), (4,), (6,)]),
("n03", "Qator raqami 4 marta", "Quyidagi ko'rinishda chiqaring:\n1 1 1 1\n2 2 2 2\n3 3 3 3\n4 4 4 4", lambda: [S(i, 4) for i in range(1, 5)], [()]),
("n04", "Qator raqami n marta", "Foydalanuvchi n sonini kiritsin. n qator chiqaring. Har bir qatorda qator raqami n marta yozilsin.", lambda n: [S(i, n) for i in range(1, n + 1)], [(1,), (3,), (4,), (5,)]),
("n05", "Uch qator 1 2 3 4 5", "Quyidagi ko'rinishda chiqaring:\n1 2 3 4 5\n1 2 3 4 5\n1 2 3 4 5", lambda: [R(1, 5)] * 3, [()]),
("n06", "n qator, 1 dan n gacha", "Foydalanuvchi n sonini kiritsin. n qator, har birida 1 dan n gacha sonlar chiqsin.", lambda n: [R(1, n)] * n, [(1,), (3,), (4,), (6,)]),
("n07", "Karra jadvali 1–5", "Quyidagi ko'rinishda chiqaring (karra jadvali 1–5):\n1 2 3 4 5\n2 4 6 8 10\n3 6 9 12 15\n4 8 12 16 20\n5 10 15 20 25", lambda: tab(5), [()]),
("n08", "1 dan n gacha karra jadvali", "Foydalanuvchi n sonini kiritsin. 1 dan n gacha karra jadvalini chiqaring.", tab, [(1,), (3,), (4,), (6,)]),
("n09", "Yulduzcha uchburchagi (4 qator)", "Quyidagi uchburchak shaklida chiqaring:\n*\n* *\n* * *\n* * * *", lambda: [S('*', i) for i in range(1, 5)], [()]),
("n10", "n qatorli yulduzcha uchburchagi", "Foydalanuvchi n sonini kiritsin. n qatorli yulduzcha uchburchagini chiqaring.", lambda n: [S('*', i) for i in range(1, n + 1)], [(1,), (3,), (5,), (7,)]),
("n11", "Sonli uchburchak (4 qator)", "Quyidagi shaklda chiqaring:\n1\n1 2\n1 2 3\n1 2 3 4", lambda: [R(1, i) for i in range(1, 5)], [()]),
("n12", "n qatorli sonli uchburchak", "Foydalanuvchi n sonini kiritsin. Yuqoridagi kabi sonli uchburchak chiqaring.", lambda n: [R(1, i) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n13", "Teskari uchburchak (4 qator)", "Quyidagi teskari uchburchakni chiqaring:\n* * * *\n* * *\n* *\n*", lambda: [S('*', 4 - i) for i in range(4)], [()]),
("n14", "Teskari yulduzcha uchburchagi", "Foydalanuvchi n sonini kiritsin. Teskari yulduzcha uchburchagini chiqaring.", lambda n: [S('*', n - i) for i in range(n)], [(1,), (3,), (5,), (7,)]),
("n15", "Har bir son o'zicha marta", "1 dan 5 gacha bo'lgan sonlar uchun har bir sonni o'zicha marta chiqaring:\n1\n2 2\n3 3 3\n4 4 4 4\n5 5 5 5 5", lambda: [S(i, i) for i in range(1, 6)], [()]),
("n16", "n qator: son o'zicha marta", "Foydalanuvchi n sonini kiritsin. Har bir sonni o'zicha marta chiqaradigan shakl yasang.", lambda n: [S(i, i) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n17", "Kamayuvchi sonli qatorlar", "Quyidagi ko'rinishda chiqaring:\n1 2 3 4\n1 2 3\n1 2\n1", lambda: [R(1, 4 - i) for i in range(4)], [()]),
("n18", "Teskari sonli uchburchak", "Foydalanuvchi n sonini kiritsin. Yuqoridagi kabi teskari sonli uchburchak chiqaring.", lambda n: [R(1, n - i) for i in range(n)], [(1,), (3,), (5,), (6,)]),
("n19", "Uch qator, 1 dan 4 gacha", "3 ta qator, har birida 1 dan 4 gacha sonlar chiqaring (nested For bilan).", lambda: [R(1, 4)] * 3, [()]),
("n20", "Qator va ustun", "Foydalanuvchi qator va ustun sonlarini kiritsin. qator ta qator, har birida ustun ta * chiqaring.", lambda r, c: [S('*', c)] * r, [(3, 5), (1, 4), (4, 1), (2, 6)]),
("n21", "Karra jadvali 1–4", "1 dan 4 gacha bo'lgan sonlarning karra jadvalini chiroyli chiqaring (4 qator, 4 ustun).", lambda: tab(4), [()]),
("n22", "n × n yulduzcha to'rtburchagi", "Foydalanuvchi n sonini kiritsin. n × n o'lchamli yulduzcha to'rtburchagini chiqaring.", star, [(1,), (3,), (4,), (6,)]),
("n23", "Ketma-ket sonlar uchburchagi", "Quyidagi shaklni chiqaring:\n1\n2 3\n4 5 6\n7 8 9 10", lambda: seq(4), [()]),
("n24", "n qatorli ketma-ket sonlar", "Foydalanuvchi n sonini kiritsin. 1 dan boshlab ketma-ket sonlar bilan n qatorli uchburchak yasang.", seq, [(1,), (3,), (4,), (5,)]),
("n25", "Juft sonlar uchburchagi", "Har bir qatorda qator raqamiga teng miqdorda juft sonlarni chiqaring: 1-qatorda 2; 2-qatorda 2 4; 3-qatorda 2 4 6 va hokazo (n kiritiladi).", lambda n: [' '.join(str(2 * j) for j in range(1, i + 1)) for i in range(1, n + 1)], [(1,), (3,), (4,), (6,)]),
("n26", "1 dan qator raqamigacha", "Foydalanuvchi n sonini kiritsin. n qatorli, har qatorda 1 dan qator raqamigacha bo'lgan sonlar chiqsin.", lambda n: [R(1, i) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n27", "Teskari yulduzcha (5 qator)", "Quyidagi ko'rinishda chiqaring:\n* * * * *\n* * * *\n* * *\n* *\n*", lambda: [S('*', 5 - i) for i in range(5)], [()]),
("n28", "Teskari yulduzcha shakli", "Foydalanuvchi n sonini kiritsin. Teskari yulduzcha shaklini chiqaring.", lambda n: [S('*', n - i) for i in range(n)], [(1,), (3,), (5,), (7,)]),
("n29", "Karra jadvali 5×5", "1 dan 5 gacha karra jadvalini to'liq chiqaring (5×5).", lambda: tab(5), [()]),
("n30", "To'liq karra jadvali", "Foydalanuvchi n sonini kiritsin. 1 dan n gacha to'liq karra jadvalini chiqaring.", tab, [(1,), (3,), (4,), (6,)]),
("n31", "Kamayib boruvchi sonlar", "Quyidagi shaklni chiqaring:\n1 1 1 1 1\n2 2 2 2\n3 3 3\n4 4\n5", lambda: [S(i, 6 - i) for i in range(1, 6)], [()]),
("n32", "Kamayib boruvchi shakl", "Foydalanuvchi n sonini kiritsin. Yuqoridagi kabi kamayib boruvchi shakl chiqaring (i-qatorda i soni n − i + 1 marta).", lambda n: [S(i, n - i + 1) for i in range(1, n + 1)], [(1,), (3,), (5,), (6,)]),
("n33", "4 qator, 6 ta #", "4 qator, har birida 6 ta # belgisini chiqaring.", lambda: [S('#', 6)] * 4, [()]),
("n34", "n qator, m ta #", "Foydalanuvchi n va m sonlarini kiritsin. n qator, har birida m ta # chiqaring.", lambda n, m: [S('#', m)] * n, [(3, 5), (1, 4), (4, 1), (2, 6)]),
("n35", "3×3 sonlar jadvali", "Oddiy 3×3 kvadrat sonlar jadvalini nested For bilan chiqaring:\n1 2 3\n4 5 6\n7 8 9", lambda: ['1 2 3', '4 5 6', '7 8 9'], [()]),
]
W26 = ("c26", "Yig'indi va ko'paytma", "Foydalanuvchi n sonini kiritsin. 1 dan n gacha bo'lgan sonlarning yig'indisi va ko'paytmasini toping (ko'paytma uchun n kichik bo'lsin).", lambda n: [sum(range(1, n + 1)), __import__('math').factorial(n)], [(1,), (3,), (5,), (6,)])
