"""Additive, deterministic number algorithms curriculum. Preserves existing topic IDs.
50 practice variants across 10 algorithm families; not 50 distinct algorithms.
Expected results are calculated independently in Python.
"""
import json, html, math, random
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
B = lambda uz, en: dict(uz=uz, en=en)
def tag(element, **attrs):
    return '<'+element+' '+ ' '.join(f'{k}="{html.escape(str(v), quote=True)}"' for k,v in attrs.items())+'/>'
def assign(v,e): return tag('assign',variable=v,expression=e)
def output(e): return tag('output',expression=e,newline='True')
def condition(e,yes,no=''): return '<if expression="'+html.escape(e,quote=True)+'"><then>'+yes+'</then><else>'+no+'</else></if>'
def loop(e,body): return '<while expression="'+html.escape(e,quote=True)+'">'+body+'</while>'
def program(body, pair=False):
    return '<?xml version="1.0"?><flowgorithm fileversion="2.11"><attributes/><function name="Main" type="None" variable=""><parameters/><body>'+tag('declare',name='n,m,x,y,r,s,i,t',type='Integer',array='False',size='')+tag('input',variable='n')+(tag('input',variable='m') if pair else '')+body+'</body></function></flowgorithm>'
def fib(n):
    a,b=0,1
    for _ in range(n): a,b=b,a+b
    return a
families=[
('digit-sum','Raqamlar yig‘indisi','Digit sum', 'n sonining o‘nlik yozuvidagi raqamlar yig‘indisini chiqaring.','Print the sum of the decimal digits of n.',0,999999,
 lambda n:sum(map(int,str(n))),
 assign('x','n')+assign('s',0)+loop('x>0',assign('s','s+x mod 10')+assign('x','x div 10'))+output('s'),
 'Har safar oxirgi raqamni mod 10 bilan oling, keyin div 10 bilan olib tashlang.','Extract the last digit with mod 10, then remove it with div 10.'),
('digit-count','Raqamlar soni','Digit count','n nechta o‘nlik raqamdan iboratligini chiqaring. 0 bitta raqamdan iborat.','Print the number of decimal digits in n. Zero has one digit.',0,999999,
 lambda n:len(str(n)),
 assign('x','n')+assign('s',0)+condition('n=0',assign('s',1))+loop('x>0',assign('s','s+1')+assign('x','x div 10'))+output('s'),
 '0 holatini alohida ko‘ring; qolgan sonlarda div 10 amallari sonini sanang.','Handle zero separately; otherwise count divisions by 10.'),
('reverse','Raqamlarni teskarilash','Reverse digits','n raqamlarini teskari tartibda yozganda hosil bo‘ladigan butun sonni chiqaring. Boshidagi nollar tushib qoladi: 120 → 21.','Print the integer formed by reversing the digits of n. Leading zeros disappear: 120 → 21.',0,999999,
 lambda n:int(str(n)[::-1]),
 assign('x','n')+assign('s',0)+loop('x>0',assign('s','s*10+x mod 10')+assign('x','x div 10'))+output('s'),
 'Natijani 10 ga ko‘paytirib, keyingi raqamni qo‘shing.','Multiply the result by 10 before appending the next digit.'),
('palindrome','Palindrom son','Palindrome number','n chapdan va o‘ngdan bir xil o‘qilsa 1, aks holda 0 chiqaring. 0 va bir xonali sonlar ham palindrom.','Print 1 if n reads the same forwards and backwards, otherwise 0. Zero and one-digit numbers are palindromes.',0,999999,
 lambda n:int(str(n)==str(n)[::-1]),
 assign('x','n')+assign('s',0)+loop('x>0',assign('s','s*10+x mod 10')+assign('x','x div 10'))+condition('s=n',output(1),output(0)),
 'Asl sonni saqlang va teskari son bilan solishtiring.','Keep the original number and compare it with the reversed number.'),
('gcd','Eng katta umumiy bo‘luvchi','Greatest common divisor','n va m ning eng katta umumiy bo‘luvchisini chiqaring.','Print the greatest common divisor of n and m.',1,10000,
 lambda n,m:math.gcd(n,m),
 assign('x','n')+assign('y','m')+loop('y<>0',assign('r','x mod y')+assign('x','y')+assign('y','r'))+output('x'),
 'Evklid algoritmi: (x,y) juftligini (y,x mod y) bilan almashtiring.','Euclid: replace (x,y) with (y,x mod y).'),
('lcm','Eng kichik umumiy karrali','Least common multiple','n va m ning eng kichik musbat umumiy karralisini chiqaring.','Print the least positive common multiple of n and m.',1,10000,
 lambda n,m:math.lcm(n,m),
 assign('x','n')+assign('y','m')+loop('y<>0',assign('r','x mod y')+assign('x','y')+assign('y','r'))+output('(n div x)*m'),
 'Avval EKUBni toping. EKUK = (n div EKUB) * m.','Find the GCD first. LCM = (n div GCD) * m.'),
('prime','Tub sonni tekshirish','Primality check','n tub bo‘lsa 1, aks holda 0 chiqaring. Tub son 1 dan katta va aynan ikkita musbat bo‘luvchiga ega.','Print 1 if n is prime, otherwise 0. A prime is greater than 1 and has exactly two positive divisors.',0,10000,
 lambda n:int(n>1 and all(n%d for d in range(2,math.isqrt(n)+1))),
 assign('s',1)+condition('n<2',assign('s',0))+assign('i',2)+loop('i*i<=n',condition('n mod i=0',assign('s',0))+assign('i','i+1'))+output('s'),
 '1 tub emas. Bo‘luvchilarni i*i <= n bo‘lguncha tekshirish yetarli.','One is not prime. Testing divisors while i*i <= n is enough.'),
('divisors','Bo‘luvchilar soni','Divisor count','n ning musbat bo‘luvchilari sonini chiqaring. Masalan, 6 ning bo‘luvchilari 1, 2, 3, 6 — jami 4 ta.','Print the number of positive divisors of n. For example, 6 has divisors 1, 2, 3, 6: four in total.',1,1000,
 lambda n:sum(n%d==0 for d in range(1,n+1)),
 assign('i',1)+assign('s',0)+loop('i<=n',condition('n mod i=0',assign('s','s+1'))+assign('i','i+1'))+output('s'),
 '1 dan n gacha tekshiring; qoldiq 0 bo‘lsa hisoblagichni oshiring.','Test 1 through n and increment the count when the remainder is zero.'),
('factorial','Faktorial','Factorial','n! ni chiqaring: 1 dan n gacha sonlar ko‘paytmasi. 0! = 1.','Print n!, the product of integers from 1 through n. By definition, 0! = 1.',0,12,
 lambda n:math.factorial(n),
 assign('i',1)+assign('s',1)+loop('i<=n',assign('s','s*i')+assign('i','i+1'))+output('s'),
 'Ko‘paytmani 0 emas, 1 dan boshlang.','Initialize a product to 1, not 0.'),
('fibonacci','Fibonacci soni','Fibonacci number','F(0)=0, F(1)=1 va F(n)=F(n−1)+F(n−2). F(n) ni chiqaring.','Given F(0)=0, F(1)=1 and F(n)=F(n−1)+F(n−2), print F(n).',0,30,
 fib,
 assign('x',0)+assign('y',1)+assign('i',0)+loop('i<n',assign('t','x+y')+assign('x','y')+assign('y','t')+assign('i','i+1'))+output('x'),
 'Oldingi ikkita qiymatni saqlang; yangilashdan oldin yig‘indini vaqtinchalik o‘zgaruvchiga yozing.','Keep the previous two values; save their sum before replacing either value.'),
]
topic=dict(id='number-lab',order=16,title=B('Sonlar laboratoriyasi','Number algorithms lab'),
 lesson=B(
 'Bu bo‘limda raqamlar, bo‘luvchilar va ketma-ketliklar bilan ishlaysiz. Avval While, If, div va mod mavzularini takrorlang. Har bir Input alohida qatorni o‘qiydi; faqat talab qilingan sonni chiqaring.\nRaqamlar: 407 mod 10 = 7, 407 div 10 = 40. Har aylanish sonni kichraytiradi. n=0 holatini alohida tekshiring.\nEvklid algoritmi: (48,18) → (18,12) → (12,6) → (6,0). Oxirgi noldan farqli qiymat EKUB = 6. EKUK = (48 div 6)*18 = 144.\nTub sonlarda 0 va 1 tub emas. Kvadrat ildizgacha tekshiring: i*i <= n. Faktorial uchun ko‘paytma 1 dan boshlanadi. Fibonacci uchun eski qiymatlarni yo‘qotmasdan yangilang.',
 'Practice digits, divisors and sequences. Review While, If, div and mod first. Each Input reads a separate line; print only the requested number.\nDigits: 407 mod 10 = 7 and 407 div 10 = 40. Each iteration makes the number smaller. Check n=0 separately.\nEuclid: (48,18) → (18,12) → (12,6) → (6,0). The last nonzero value is GCD = 6. LCM = (48 div 6)*18 = 144.\nZero and one are not prime. Test up to the square root with i*i <= n. Start factorial products at 1. Update Fibonacci values without losing the previous pair.'),
 concepts=[dict(title=B('Qo‘lda kuzating','Trace by hand'),text=B('120 uchun x va natija qiymatlarini har qadamda yozing. Natija 21 bo‘lishi kerak.','For 120, record x and the result after each iteration. Reversal must produce 21.')),dict(title=B('Chegara holatlari','Boundary cases'),text=B('0, 1, takror raqamlar, oxiri 0 bo‘lgan sonlar, teng sonlar va tub son kvadratlarini tekshiring.','Check zero, one, repeated digits, trailing zeros, equal inputs and squares of primes.'))],
 classwork=[],homework=[])
for fi,(slug,uz,en,suz,sen,lo,hi,oracle,body,huz,hen) in enumerate(families):
    for variant in range(5):
        pair=slug in ('gcd','lcm')
        # Variants have explicit distinct domains, plus separately seeded interior cases.
        cap=max(lo+1,hi//(5-variant))
        rng=random.Random(16000+fi*10+variant)
        values=[lo,min(cap,lo+1),cap,max(lo,cap-1)]
        values += [v for v in (9,10,11,100,101,120,121,1001,9999) if lo<=v<=cap]
        values += [rng.randint(lo,cap) for _ in range(8)]
        rows=[[v] for v in dict.fromkeys(values)]
        if pair:
            rows=[[lo,cap],[cap,lo],[cap,cap],[lo,lo],[48,18],[17,19]]+[[rng.randint(lo,cap),rng.randint(lo,cap)] for _ in range(10)]
        assert all(lo <= v <= cap for q in rows for v in q)
        tests=[{'in':'\n'.join(map(str,q))+'\n','out':str(oracle(*q))+'\n','hidden':i>=2} for i,q in enumerate(rows)]
        pid=f'{slug}-{variant+1:02d}'
        p=dict(id=pid,title=B(f'{uz} · {variant+1}',f'{en} · {variant+1}'),
         statement=B(suz+' While blokidan foydalaning.',sen+' Use a While block.'),
         inputFormat=B(f'{"n va m" if pair else "n"} — {lo}..{cap} oralig‘idagi butun son{"lar, har biri alohida qatorda" if pair else ", bitta qatorda"}.',f'{"n and m, each on a separate line" if pair else "n on one line"}: integers in {lo}..{cap}.'),
         outputFormat=B('Bitta butun sonni chiqaring. Qo‘shimcha matn chiqarmang.','Print one integer, with no extra text.'),
         difficulty='medium' if variant<2 else 'hard',tests=tests,judge=dict(mode='tokens',requiredBlocks=['while']),
         hints=[B(huz,hen),B('Namuna uchun o‘zgaruvchilar jadvalini tuzing.','Build a variable trace table for the example.')],
         variant=dict(family=slug,number=variant+1))
        topic['classwork' if variant<2 else 'homework'].append(p)
        (ROOT/'tests/reference'/f'number-lab__{pid}.fprg').write_text(program(body,pair))
(ROOT/'content/topics/16-number-lab.json').write_text(json.dumps(topic,ensure_ascii=False,indent=2)+'\n')
print('Added 50 variants across 10 number algorithm families: 20 classwork, 30 homework.')
