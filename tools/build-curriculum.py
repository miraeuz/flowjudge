"""Deterministic bilingual practice variants, with independent Python oracles.
The 19 teacher worksheets were not supplied; this is original practice content.
"""
import json, math, html
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
OUT=ROOT/'content/topics'; REF=ROOT/'tests/reference'; REF.mkdir(exist_ok=True)
B=lambda uz,en:{'uz':uz,'en':en}
def x(s): return html.escape(str(s),quote=True)
def d(names,typ='Integer'): return f'<declare name="{names}" type="{typ}" array="False" size=""/>'
def a(n,e):return f'<assign variable="{n}" expression="{x(e)}"/>'
def o(e):return f'<output expression="{x(e)}" newline="True"/>'
def inp(n):return f'<input variable="{n}"/>'
def iff(e,yes,no=''):return f'<if expression="{x(e)}"><then>{yes}</then><else>{no}</else></if>'
def loop(body,end='n',start='1',var='i'):return f'<for variable="{var}" start="{start}" end="{end}" direction="inc" step="1">{body}</for>'
def wh(e,body,tag='while'):return f'<{tag} expression="{x(e)}">{body}</{tag}>'
def program(body,functions=''):return f'<?xml version="1.0"?><flowgorithm fileversion="2.11"><attributes/><function name="Main" type="None" variable=""><parameters/><body>{body}</body></function>{functions}</flowgorithm>'
def fmt(v):return str(int(v)) if isinstance(v,(int,float)) and v==int(v) else str(v)
TOPICS=[
('output','Output — ekranga chiqarish','Output — display',
'Flowgorithm’da Start va End orasiga Output blokini qo‘ying. Matn qo‘shtirnoq ichida yoziladi: "Salom". Son yoki ifoda esa qo‘shtirnoqsiz yoziladi: 12 + 3. New Line yoqilsa, keyingi natija yangi qatordan chiqadi.\nFile → Save orqali .fprg fayl saqlang. Bu mavzuda Input kerak emas: topshiriqdagi aniq matn yoki hisob natijasini chiqaring. Bo‘sh joylar va qatorlar tartibini tekshiring.',
'Place Output between Start and End. Put text in double quotes: "Hello". Write numbers and expressions without quotes: 12 + 3. Enable New Line to move the next output to another line.\nSave a .fprg file using File → Save. This topic needs no Input: print the specified text or calculated result. Check spaces and line order.'),
('variables','O‘zgaruvchilar va Assign','Variables and Assign',
'Declare bloki nom va turni belgilaydi. Integer — butun son, Real — kasr son, String — matn, Boolean — True yoki False. Assign qiymatni saqlaydi: total = price * count.\nAvval e’lon qiling, so‘ng qiymat bering, oxirida Output qiling. O‘zgaruvchi nomida bo‘sh joy ishlatmang. Bu mavzudagi sonlar shartda beriladi; Input qo‘shmang. Qiymat o‘zgarganda eski qiymatning o‘rniga yangisi yoziladi.',
'Declare gives a variable its name and type. Integer stores whole numbers, Real decimals, String text, and Boolean True or False. Assign stores a value: total = price * count.\nDeclare first, assign second, output last. Variable names cannot contain spaces. These tasks supply constants in the statement: do not add Input. An assignment replaces the old value.'),
('input','Input — ma’lumot kiritish','Input — reading data',
'Input qiymatni oldindan e’lon qilingan o‘zgaruvchiga oladi. Declare → Input → hisoblash → Output tartibida ishlang. Har bir Input alohida qatordagi qiymatni o‘qiydi.\nMasalan, narx va son berilsa, ikki Input ishlating. total = price * count. Test uchun qo‘shimcha savol matni chiqarmang; shart talab qilgan natijanigina chiqaring. String kiritish butun qatorni oladi.',
'Input reads a value into a declared variable. Use Declare → Input → calculation → Output. Each Input reads one separate line.\nFor a price and quantity, use two Input blocks and total = price * count. Do not print extra prompts: output only what the task asks for. String input consumes the whole line.'),
('numbers','Integer, Real, div va mod','Integer, Real, div and mod',
'Butun buyumlar soni uchun Integer, o‘rtacha va o‘lchovlar uchun Real ishlating. / kasrli bo‘lish, div butun bo‘linma, mod qoldiqni beradi. 17 div 5 = 3; 17 mod 5 = 2.\nTo‘liq qutilar va ortgan buyumlarni ajratishda div va mod juft ishlatiladi. Nolga bo‘lmang. Kasr natijani Integer o‘zgaruvchiga saqlamang. Hisob natijasini 6 ta kasr raqamidan ortiq aniqlikda qoldirish mumkin.',
'Use Integer for whole items and Real for averages and measurements. / produces real division, div the integer quotient, and mod the remainder. 17 div 5 = 3; 17 mod 5 = 2.\nUse div and mod together for full boxes and leftovers. Never divide by zero. Do not store a fractional result in an Integer. You may retain more than six decimal digits.'),
('if','If — shartni tekshirish','If — decisions',
'If blokining sharti True bo‘lsa, Then shoxi bajariladi. False bo‘lsa Else shoxi bajariladi. >, <, >=, <= va = bilan solishtiring.\nBitta If bilan boshlang: natijaga dastlabki qiymat bering, shart bajarilganda uni yangilang. Chegarani tekshiring: 100 dan katta (>100) va kamida 100 (>=100) bir xil emas.',
'An If condition selects Then when True and Else when False. Compare using >, <, >=, <= and =.\nStart with one If: assign a default result, then change it when the condition holds. Check boundaries: greater than 100 (>100) differs from at least 100 (>=100).'),
('branches','If-Else va ichma-ich shartlar','If-Else and nested decisions',
'Bir necha holatni ajratish uchun Else ichiga yana If joylashtiring. Chegaralarni o‘sish yoki kamayish tartibida tekshiring; barcha holatlarda natija tayinlansin.\nMasalan, 90 va yuqori — A; aks holda 70 va yuqori — B; qolganlari — C. 70, 89, 90 kabi chegara qiymatlari bilan qo‘lda sinang. Bitta aniq natija chiqaring.',
'Place another If inside Else to distinguish several cases. Test boundaries in order and assign a result in every case.\nFor example, 90 or above gives A; otherwise 70 or above gives B; the rest gives C. Try boundary values such as 70, 89 and 90. Print one unambiguous result.'),
('logic','Mantiqiy amallar','Logical operators',
'and ikkala shart bajarilishini talab qiladi; or kamida bittasini; not esa natijani teskarilaydi. (age >= 12) and (age <= 17) — yopiq oraliq.\nQavslar ma’noni aniqlashtiradi. Ruxsat uchun ikki talab bo‘lsa and, ikki muqobil yo‘l bo‘lsa or ishlating. True va False o‘rniga shartda ko‘rsatilgan YES/NO yoki sonni chiqaring.',
'and requires both conditions, or at least one, and not reverses a condition. (age >= 12) and (age <= 17) describes an inclusive interval.\nUse parentheses for clarity. Use and for two requirements and or for alternatives. Print the requested YES/NO or number rather than an unspecified Boolean.'),
('for','For — sanalgan takrorlash','For — counted repetition',
'For takrorlash soni oldindan ma’lum bo‘lganda qulay. i ni Integer sifatida e’lon qiling. Start=1, End=n, Step=1 bo‘lsa, i 1 dan n gacha, n ham kirgan holda yuradi.\nYig‘indi uchun s=0 dan boshlang va har aylanishda s=s+value qiling. Hisoblagich uchun c=0, shart bajarilganda c=c+1. Keraksiz Output’ni sikl ichiga joylamang.',
'Use For when the number of repetitions is known. Declare i as Integer. Start=1, End=n, Step=1 visits 1 through n, including n.\nInitialize a total with s=0 and add each value inside the loop. Initialize a counter with c=0 and increment when a condition matches. Avoid accidental extra output inside the loop.'),
('nested-for','Ichma-ich For','Nested For loops',
'Tashqi For qatorlar, ichki For shu qatordagi elementlar uchun ishlaydi. Har ikki siklning hisoblagichi alohida: i va j. r qator va c ustun uchun ichki amal r*c marta bajariladi.\nJadval ma’lumotlarini qatorma-qator kiriting. Har qator yig‘indisi kerak bo‘lsa s=0 ni tashqi sikl ichida, ichki sikldan oldin yozing. Umumiy yig‘indi uchun esa ikkala sikldan oldin.',
'The outer For visits rows and the inner For visits items within each row. Use separate counters i and j. With r rows and c columns, the inner action runs r*c times.\nRead data row by row. Reset a row total inside the outer loop before entering the inner loop. Initialize a grand total before both loops.'),
('while','While — shartli takrorlash','While — conditional loops',
'While shartni avval tekshiradi: shart False bo‘lsa, tana bir marta ham bajarilmaydi. Takrorlash soni oldindan noma’lum bo‘lganda ishlating.\nTo‘xtash belgisi 0 bo‘lsa, birinchi qiymatni sikldan oldin o‘qing. Siklda uni qayta ishlang, keyin keyingi Input’ni bajaring. 0 ni hisobga qo‘shmang. Shartga ta’sir qiluvchi qiymat yangilanmasa, cheksiz sikl paydo bo‘ladi.',
'While checks its condition first, so its body may run zero times. Use it when the number of repetitions is unknown.\nFor a sentinel of 0, read once before the loop, process the value, then read again inside the loop. Do not count the sentinel. If the condition never changes, the loop will not finish.'),
('do-while','Do-While — kamida bir marta','Do-While — at least once',
'Do bloki tanani avval bajaradi, shartni keyin tekshiradi. Shart True bo‘lsa takrorlanadi. Shu sababli tana kamida bir marta bajariladi.\nKiritishni tekshirishda Input’ni Do ichiga qo‘ying; qiymat yaroqsiz ekan, takrorlang. Urinishlar hisoblagichiga qabul qilingan oxirgi kiritish ham kiradimi, shartdan tekshiring. Ushbu mashqlarda kiritish oqimi tugashidan oldin to‘xtash sharti bajariladi.',
'Do executes its body first and checks the condition afterward. It repeats while the condition is True, so it always runs at least once.\nFor input validation, place Input inside Do and repeat while the value is invalid. Check whether the successful final entry counts as an attempt. These inputs always reach the stopping condition.'),
('arrays','Massivlar','Arrays',
'Massiv bir xil turdagi qiymatlarni saqlaydi. n ta element indekslari 0 dan n-1 gacha. Declare’da Array ni belgilang va Size=n yozing; n avval kiritilgan bo‘lsin.\nInput a[i] orqali qiymatlarni saqlang. Keyin alohida siklda hisoblang yoki teskari tartibda chiqaring. a[n] mavjud emas. Eng katta qiymat uchun boshlang‘ich qiymatni a[0] dan oling, agar n kamida 1 bo‘lsa.',
'An array stores values of one type. An array of size n has indexes 0 to n-1. Enable Array in Declare and set Size=n after reading n.\nRead values using Input a[i]. Use a separate loop to calculate or output in reverse order. a[n] is outside the array. Initialize a maximum with a[0] when n is at least 1.'),
('search-sort','Qidirish va saralash','Searching and sorting',
'Chiziqli qidiruv elementlarni ketma-ket tekshiradi. Topilmasa -1, topilsa shartda so‘ralgan indeks yoki sonni qaytaring. Takrorlangan qiymatlar bo‘lishi mumkin.\nOddiy saralashda ichma-ich sikl bilan qiymatlarni solishtirib, vaqtinchalik o‘zgaruvchi yordamida almashtiring. O‘sish tartibi kichikdan kattaga. Indeks 0 dan boshlanadi. Saralash asl tartibni o‘zgartiradi.',
'Linear search checks elements one by one. Return -1 when absent or the requested index/count when found. Values may repeat.\nFor simple sorting, compare values with nested loops and swap using a temporary variable. Ascending order means smallest first. Indexes start at 0. Sorting changes the original order.'),
('functions','Funksiyalar','Functions',
'Funksiya takror ishlatiladigan vazifani nom bilan ajratadi. Parametrlar kirish qiymatlari, return variable esa natija. Main ichida natijani F(a,b) kabi ifoda orqali oling.\nFunksiyaga faqat kerakli parametrlarni bering. Mahalliy o‘zgaruvchilar boshqa funksiyaga avtomatik ko‘rinmaydi. Bu mavzuda hisobni alohida funksiyada bajaring; Main kiritish va chiqarish bilan shug‘ullansin.',
'A function names a reusable operation. Parameters supply input and the return variable holds its result. In Main, call it in an expression such as F(a,b).\nPass only the needed parameters. Local variables are not automatically visible in other functions. Put the calculation in a separate function; let Main handle input and output.'),
('projects','Amaliy mini-loyihalar','Practical mini-projects',
'Loyihani kichik bosqichlarga bo‘ling: ma’lumot olish, tekshirish, hisoblash va chiqarish. Avval oddiy misolni qog‘ozda yeching, so‘ng bloklarga aylantiring.\nKassa uchun yig‘indi, baholar uchun hisoblagich va o‘rtacha, ombor uchun shartli yangilash kerak bo‘ladi. Natijalar tartibi shart bilan aynan mos bo‘lsin. Loyihada menyu, qo‘shimcha matn yoki tasodifiy son kerak emas, agar shart so‘ramasa.',
'Break a project into input, validation, calculation and output. Work through a small example on paper before drawing blocks.\nA checkout needs totals, a grade book needs counters and averages, and stock tracking needs conditional updates. Match the specified output order. Do not add a menu, prompts or randomness unless requested.')]
CONTEXTS=[('Maktab do‘koni','School shop'),('Kutubxona','Library'),('Sport markazi','Sports centre'),('O‘quv markazi','Learning centre'),('Mahalla klubi','Community club'),('Yozgi oromgoh','Summer camp'),('Kitob yarmarkasi','Book fair'),('Sayohat guruhi','Travel group'),('Ustaxona','Workshop'),('Ko‘ngillilar jamoasi','Volunteer team')]

FAMILY_TITLES = {
'output':[('Xush kelibsiz xabari','Welcome message'),('Ochilish vaqti','Opening time'),('Qadamlar ro‘yxati','Step list'),('Xona belgisi','Room sign'),('Qisqa hisobot','Short report')],
'variables':[('Ikki yetkazish','Two deliveries'),('Buyurtma narxi','Order price'),('Qolgan zaxira','Remaining stock'),('Yetkazish bilan narx','Cost with delivery'),('Uch bo‘lim rejasi','Three-department plan')],
'input':[('Yetkazilgan buyumlar','Delivered items'),('Xarid narxi','Purchase cost'),('Zaxira qoldig‘i','Stock balance'),('To‘plam va alohida buyum','Packs and loose items'),('Ko‘p kunlik ta’minot','Multi-day supplies')],
'numbers':[('Qutilar va qoldiq','Boxes and leftovers'),('Ichimlik taqsimoti','Sharing drinks'),('Tadbir davomiyligi','Event duration'),('Tasma bo‘laklari','Ribbon pieces'),('Chegirma miqdori','Discount amount')],
'if':[('Yetarli zaxira','Enough stock'),('Bo‘limlarni solishtirish','Compare departments'),('Zaxira ogohlantirishi','Stock warning'),('Teng miqdorlar','Equal amounts'),('Qoldiqsiz qadoqlash','Exact packing')],
'branches':[('Uch darajali zaxira','Three stock levels'),('Ta’minot toifasi','Supply category'),('Buyurtma toifasi','Order category'),('Zaxira holati kodi','Stock status code'),('Ombor nazorat kodi','Warehouse control code')],
'logic':[('Ikkala bo‘lim tayyor','Both departments ready'),('Muqobil bo‘lim','Alternative department'),('Ruxsat etilgan oraliq','Allowed range'),('Farqli miqdorlar','Different amounts'),('Birgalikdagi ta’minot','Combined supplies')],
'for':[('Kunlik yetkazishlar','Daily deliveries'),('Rejaga yetgan kunlar','Days meeting the target'),('Qo‘shimcha buyumlar','Bonus items'),('Toq kundagi yetkazish','Odd-day deliveries'),('Har kunlik qutilar','Daily full boxes')],
'nested-for':[('Javondagi jami buyum','Total shelf stock'),('Qatorlar hisoboti','Row report'),('Kam zaxirali katak','Low-stock cells'),('Birinchi ustun','First column'),('Barcha katakni to‘ldirish','Restock all cells')],
'while':[('Partiyalar yig‘indisi','Batch total'),('Qabul qilingan partiya','Received batches'),('Katta partiyalar','Large batches'),('Eng katta partiya','Largest batch'),('Partiyalarni qadoqlash','Batch packing')],
'do-while':[('Terminalga kirish','Terminal entry'),('Xato urinishlar','Failed entries'),('Nazorat soni','Control number'),('Kodni tekshirish','Code validation'),('Jami kiritishlar','Total entries')],
'arrays':[('Teskari zaxira ro‘yxati','Reverse stock list'),('Eng katta zaxira','Maximum stock'),('Zaxirani ko‘paytirish','Increase stock'),('Birinchi va oxirgi','First and last'),('Kam zaxiralar ro‘yxati','Low-stock list')],
'search-sort':[('Birinchi mos qiymat','First matching value'),('Mos qiymatlar soni','Matching count'),('O‘sish tartibi','Ascending order'),('Kamayish tartibi','Descending order'),('Ikkinchi eng kichik','Second smallest')],
'functions':[('Narx funksiyasi','Price function'),('Yetkazish funksiyasi','Delivery function'),('Qutilar funksiyasi','Box function'),('Qoldiq funksiyasi','Remainder function'),('Ta’minot funksiyasi','Supply function')],
'projects':[('Bonusli kassa','Checkout with rewards'),('O‘quvchilar hisoboti','Student report'),('Qadoqlash hisoboti','Packing report'),('Tushum hisoboti','Revenue report'),('Avtobus qatnovlari','Bus trips')]
}

def make(topic,kind,v):
 c=v+2; ctx=CONTEXTS[v]; tests=[]; fn=''; req=[]
 def pair(uz,en):return B(f'{ctx[0]}: {uz}',f'{ctx[1]}: {en}')
 title=pair(*FAMILY_TITLES[topic][kind])
 inf=B('Har bir qiymat alohida qatorda beriladi.','Each value is on a separate line.')
 out=B('So‘ralgan natijalarni berilgan tartibda, har birini alohida qatorda chiqaring. Qo‘shimcha matn chiqarmang.','Print the requested results in order, one per line, with no extra text.')
 def cases(rows,oracle):
  for i,row in enumerate(rows):
   ans=oracle(row);ans=ans if isinstance(ans,list) else [ans]
   tests.append({'in':'\n'.join(map(fmt,row)),'out':'\n'.join(map(fmt,ans)),**({'hidden':True} if i>=2 else {})})
 base=d('a,b,n,i,j,s,r,k,z,cnt,tmp')
 if topic=='output':
  texts=[['MIRAE',ctx[1]], [f'{ctx[1]}',f'OPEN {c}:00'], ['READY','LEARN','CREATE'], [f'ROOM {c}',f'SEATS {c*4}'], [f'{ctx[1]}',str(c*5), 'DONE']][kind]
  if kind==2:texts=[f'STEP {c}','LEARN',f'STEP {c+1}','CREATE']
  st=B('Ekranga quyidagi qatorlarni aynan chiqaring:\n'+'\n'.join(texts),'Print exactly these lines:\n'+'\n'.join(texts))
  body=''.join(o('"'+s+'"') for s in texts);inf=B('Kirish ma’lumoti yo‘q.','No input.');req=['output'];cases([[],[],[]],lambda _:texts)
 elif topic=='variables':
  expr=['a+b','a*b','a-b','a*b+b','a+b+a'][kind];av=20+c*3;bv=c
  st=pair(f'a={av}, b={bv} qiymatlarni Declare va Assign bilan saqlang. {expr} ifoda natijasini r o‘zgaruvchiga yozib, chiqaring. Input ishlatmang.',f'Declare and assign a={av}, b={bv}. Store the result of {expr} in r and print r. Do not use Input.')
  body=base+a('a',av)+a('b',bv)+a('r',expr)+o('r');inf=B('Kirish ma’lumoti yo‘q.','No input.');req=['declare','assign'];cases([[],[],[]],lambda _:eval(expr,{},dict(a=av,b=bv)))
 elif topic=='input':
  expr=['a+b','a*b','a-b',f'a*{c}+b',f'(a+b)*{c}'][kind]
  desc=[('Birinchi va ikkinchi yetkazib berishdagi buyumlar soni a va b. Jami sonni toping.','Deliveries contain a and b items. Find the total.'),('Buyum narxi a va buyumlar soni b. Umumiy narxni toping.','An item costs a and quantity is b. Find the total cost.'),('Boshlang‘ich zaxira a va ishlatilgan miqdor b. Qolganini toping.','Initial stock is a and used stock is b. Find the remainder.'),(f'Har bir to‘plamda {c} buyum bor. a to‘plam va b alohida buyumning jami sonini toping.',f'Each pack has {c} items. Find the total in a packs plus b loose items.'),(f'Har kuni a va b ta buyum ikki bo‘limga beriladi. {c} kunda jami qancha beriladi?',f'Two departments receive a and b items each day. Find the total over {c} days.')][kind]
  st=pair(*desc);inf=B('a va b — butun sonlar; 0 ≤ b ≤ a ≤ 10000. Ikki qator.','Two lines: integers a and b, 0 ≤ b ≤ a ≤ 10000.');body=base+inp('a')+inp('b')+o(expr);req=['input'];cases([[20,4],[7,0],[0,0],[10000,10000],[31,9],[c*10,c]],lambda q:eval(expr,{},dict(a=q[0],b=q[1])))
 elif topic=='numbers':
  expressions=[['a div b','a mod b'],['a/b'],['a div 60','a mod 60'],[f'a/{c}'],['a*b/100']][kind]
  desc=[('a buyumni b sig‘imli qutilarga joylang. To‘liq qutilar va ortgan buyumlar sonini chiqaring.','Pack a items into boxes of capacity b. Print full boxes and leftover items.'),('a litr ichimlikni b kishiga teng taqsimlang. Bir kishiga qancha litr tegadi?','Share a litres equally among b people. Print litres per person.'),('a daqiqa davom etgan tadbirni to‘liq soat va qolgan daqiqalarda chiqaring. Ikkinchi kirish qiymati b ishlatilmaydi.','Convert an event duration of a minutes into whole hours and remaining minutes. Ignore the second input b.'),(f'a metr tasmani {c} teng bo‘lakka bo‘ling. Bir bo‘lak uzunligini chiqaring. Ikkinchi qiymat b ishlatilmaydi.',f'Divide a metres of ribbon into {c} equal pieces. Print one length. Ignore the second input b.'),('Narx a va chegirma foizi b. Chegirma miqdorini hisoblang (yakuniy narx emas).','Given price a and discount percent b, calculate the discount amount, not the final price.')][kind]
  st=pair(*desc);inf=B('Ikki qator: 0 ≤ a ≤ 10000 va 1 ≤ b ≤ 100, butun sonlar.','Two integer lines: 0 ≤ a ≤ 10000 and 1 ≤ b ≤ 100.');body=d('a,b','Real')+inp('a')+inp('b')+''.join(o(e) for e in expressions);cases([[25,4],[60,3],[0,1],[1,100],[10000,99],[127,10]],lambda q: [q[0]//q[1],q[0]%q[1]] if kind==0 else q[0]/q[1] if kind==1 else [q[0]//60,q[0]%60] if kind==2 else q[0]/c if kind==3 else q[0]*q[1]/100)
 elif topic in ['if','branches','logic']:
  req=['if'];body=base+inp('a')+inp('b');rows=[[c,0],[c+1,c],[0,0],[c-1,c+1],[100,100],[c,c],[1,100],[100,1]]
  if topic=='if':
   expr=[f'a>={c}','a>b',f'a<{c}','a=b',f'a mod {c}=0'][kind]
   words=[(f'a buyum kamida {c} ta bo‘lsa',f'there are at least {c} items a'),('a buyum b buyumdan ko‘p bo‘lsa','a exceeds b'),(f'a zaxira {c} tadan kam bo‘lsa',f'stock a is below {c}'),('a va b zaxiralar teng bo‘lsa','stocks a and b are equal'),(f'a buyum {c} tadan qutilarga qoldiqsiz joylashsa',f'a items fit boxes of {c} without leftovers')][kind]
   st=pair(words[0]+' 1, aks holda 0 chiqaring.',f'Print 1 if {words[1]}, otherwise 0.');body+=a('r',0)+iff(expr,a('r',1))+o('r')
   oracle=lambda q:int([q[0]>=c,q[0]>q[1],q[0]<c,q[0]==q[1],q[0]%c==0][kind])
  elif topic=='branches':
   st=pair(f'a zaxira {c} dan kam bo‘lsa 0, {c} dan {c*3-1} gacha bo‘lsa 1, aks holda {kind+2} chiqaring. b zaxira nazorat qiymati, hisobda ishlatilmaydi.',f'For stock a, print 0 below {c}, 1 from {c} to {c*3-1}, otherwise {kind+2}. b is a control value and is not used.')
   body+=iff(f'a<{c}',a('r',0),iff(f'a<{c*3}',a('r',1),a('r',kind+2)))+o('r');rows+=[[c*3-1,0],[c*3,0]];oracle=lambda q:0 if q[0]<c else 1 if q[0]<c*3 else kind+2
  else:
   expr=[f'(a>={c}) and (b>={c})',f'(a>={c}) or (b>={c})',f'(a>={c}) and (a<={c*3})',f'not (a=b)',f'(a+b>={c*4}) and (a>0) and (b>0)'][kind]
   desc=[(f'Ikkala bo‘limda ham kamida {c} buyum bo‘lsa',f'both departments have at least {c} items'),(f'Kamida bitta bo‘limda {c} yoki undan ko‘p buyum bo‘lsa',f'at least one department has {c} or more items'),(f'Birinchi bo‘limdagi a soni {c}..{c*3} yopiq oraliqda bo‘lsa (b ishlatilmaydi)',f'a is in the inclusive range {c}..{c*3} (ignore b)'),('Bo‘limlardagi a va b miqdorlar teng bo‘lmasa','amounts a and b differ'),(f'Ikkala miqdor musbat va jami kamida {c*4} bo‘lsa',f'both amounts are positive and their total is at least {c*4}')][kind]
   st=pair(desc[0]+' 1, aks holda 0 chiqaring.',f'Print 1 if {desc[1]}, otherwise 0.');body+=iff(expr,a('r',1),a('r',0))+o('r');oracle=lambda q:int([(q[0]>=c and q[1]>=c),(q[0]>=c or q[1]>=c),(c<=q[0]<=c*3),q[0]!=q[1],q[0]+q[1]>=c*4 and q[0]>0 and q[1]>0][kind]);rows+=[[c*3,0],[c*3+1,0],[c*4,0],[c*2,c*2]]
  inf=B('Ikki qator: a, b — 0..100 oralig‘idagi butun sonlar.','Two lines: integers a and b in 0..100.');cases(rows,oracle)
 elif topic=='for':
  req=['for'];body=base+inp('n');rows=[[n]+[(i*c+3)%30 for i in range(n)] for n in [3,1,0,7,10,5]]
  desc=[('kunlik yetkazilgan buyumlar yig‘indisi','total daily deliveries'),(f'kamida {c} buyum yetkazilgan kunlar soni',f'number of days delivering at least {c} items'),(f'har kuni {c} tadan qo‘shimcha berilgandan keyingi jami miqdor',f'total after adding {c} bonus items each day'),('toq tartib raqamli kunlardagi jami miqdor (kunlar 1 dan boshlanadi)','total on odd-numbered days (days start at 1)'),(f'har bir kun uchun {c} sig‘imli to‘liq qutilar soni',f'number of full boxes of capacity {c} for each day')][kind]
  st=pair('n kun uchun miqdorlar berilgan. '+desc[0]+'ni toping. For ishlating.','Given quantities for n days, find the '+desc[1]+'. Use For.')
  calc=[a('s','s+a'),iff(f'a>={c}',a('s','s+1')),a('s',f's+a+{c}'),iff('i mod 2=1',a('s','s+a')),o(f'a div {c}')][kind]
  body+=a('s',0)+loop(inp('a')+calc)+(o('s') if kind!=4 else '')
  inf=B('n (0..100), so‘ng n ta miqdor (0..10000). Har biri yangi qatorda.','n (0..100), then n quantities (0..10000), one per line.');cases(rows,lambda q:sum(q[1:]) if kind==0 else sum(z>=c for z in q[1:]) if kind==1 else sum(q[1:])+c*q[0] if kind==2 else sum(q[1::2]) if kind==3 else [z//c for z in q[1:]])
 elif topic=='nested-for':
  req=['for'];body=base+inp('n')+inp('k');rows=[[r,cols]+[(i*c+2)%20 for i in range(r*cols)] for r,cols in [(2,3),(1,1),(1,5),(4,1),(3,4),(2,2)]]
  desc=[('barcha javonlardagi jami buyumlar','total items on all shelves'),('har bir qatorning yig‘indisi, qator tartibida','sum of each row in row order'),(f'{c} dan kam buyumli kataklar soni',f'number of cells holding fewer than {c} items'),('birinchi ustundagi buyumlar yig‘indisi','sum of items in the first column'),(f'har bir katakka yana {c} ta qo‘shilgandagi umumiy miqdor',f'grand total after adding {c} to each cell')][kind]
  st=pair('n qator va k ustunli javon jadvali beriladi. '+desc[0]+'ni chiqaring. Ichma-ich For ishlating.','For a shelf grid of n rows and k columns, output the '+desc[1]+'. Use nested For loops.')
  calc=[a('s','s+a'),a('s','s+a'),iff(f'a<{c}',a('s','s+1')),iff('j=1',a('s','s+a')),a('s',f's+a+{c}')][kind]
  body+=a('s',0)+loop((a('s',0) if kind==1 else '')+loop(inp('a')+calc,end='k',var='j')+(o('s') if kind==1 else ''))+(o('s') if kind!=1 else '')
  inf=B('n, k (1..10), keyin n*k son (0..100). Sonlar qatorma-qator, har biri alohida satrda.','n, k (1..10), then n*k integers (0..100), row by row, one per line.');cases(rows,lambda q:sum(q[2:]) if kind==0 else [sum(q[2+i*q[1]:2+(i+1)*q[1]]) for i in range(q[0])] if kind==1 else sum(z<c for z in q[2:]) if kind==2 else sum(q[2::q[1]]) if kind==3 else sum(q[2:])+c*q[0]*q[1])
 elif topic=='while':
  req=['while'];rows=[[4,7,2,0],[c,0],[0],[1,1,1,0],[c-1,c,c+1,0],[100,3,50,0]]
  desc=[('jami buyumlar soni','total item count'),('qabul qilingan partiyalar soni','number of received batches'),(f'kamida {c} buyumli partiyalar soni',f'number of batches with at least {c} items'),('eng katta partiya (partiya bo‘lmasa 0)','largest batch (0 if no batches)'),(f'har partiyadan {c} sig‘imli to‘liq qutilarning umumiy soni',f'total full boxes of capacity {c}, packing each batch separately')][kind]
  st=pair('Musbat partiya miqdorlari 0 kelguncha kiritiladi. 0 ni hisoblamang. '+desc[0]+'ni toping. While ishlating.','Read positive batch quantities until 0. Exclude the sentinel. Find the '+desc[1]+'. Use While.')
  calc=[a('s','s+a'),a('s','s+1'),iff(f'a>={c}',a('s','s+1')),iff('a>s',a('s','a')),a('s',f's+a div {c}')][kind]
  body=base+a('s',0)+inp('a')+wh('a<>0',calc+inp('a'))+o('s');inf=B('0..100 ta musbat miqdor (1..10000), oxirida 0. Har biri alohida qatorda.','0..100 positive quantities (1..10000), then 0, one per line.');cases(rows,lambda q:sum(q[:-1]) if kind==0 else len(q)-1 if kind==1 else sum(z>=c for z in q[:-1]) if kind==2 else max(q[:-1],default=0) if kind==3 else sum(z//c for z in q[:-1]))
 elif topic=='do-while':
  req=['do'];limit=c+kind+1;rows=[[-1,0,limit],[limit],[limit+1,limit-1,limit],[0,0,0,limit],[100,limit],[limit-2,limit]]
  st=pair(f'Ombor terminali faqat {limit} nazorat sonini qabul qiladi. Shu son kelguncha o‘qing. '+('Jami urinishlar sonini, muvaffaqiyatli urinishni ham qo‘shib chiqaring.' if kind%2==0 else 'Noto‘g‘ri urinishlar sonini chiqaring; muvaffaqiyatli oxirgi urinishni hisoblamang.')+' Do-While ishlating.',f'The stock terminal accepts only control number {limit}. Read until it appears. '+('Print total attempts including the successful entry.' if kind%2==0 else 'Print failed attempts, excluding the successful final entry.')+' Use Do-While.')
  body=base+a('s',0)+wh(f'a<>{limit}',inp('a')+a('s','s+1'),'do')+o('s' if kind%2==0 else 's-1');inf=B(f'1..100 ta butun son (-100..100); oxirgi son {limit}, oldingilari undan farqli.',f'1..100 integers (-100..100); the last equals {limit} and earlier values differ.');cases(rows,lambda q:len(q)-(kind%2))
 elif topic in ['arrays','search-sort']:
  req=['declare','for'];body=d('n,i,j,s,a,k,tmp,r')+inp('n')+f'<declare name="items" type="Integer" array="True" size="n"/>'+loop(inp('items[i]'),start='0',end='n-1');rows=[[3,4,7,2],[1,c],[5,0,0,0,0,0],[4,c+1,c,c-1,c],[5,20,3,9,1,15],[3,100,100,100]]
  if topic=='arrays':
   desc=[('zaxiralarni teskari tartibda','stock values in reverse order'),('eng katta zaxirani','the maximum stock'),(f'har bir zaxiraga {c} qo‘shilgan qiymatlarni asl tartibda',f'each stock plus {c}, in original order'),('birinchi va oxirgi zaxiraning yig‘indisini','the sum of first and last stock'),(f'{c} dan kichik zaxiralarni asl tartibda',f'values below {c} in original order')][kind]
   code=[loop(o('items[n-1-i]'),start='0',end='n-1'),a('s','items[0]')+loop(iff('items[i]>s',a('s','items[i]')),start='1',end='n-1')+o('s'),loop(o(f'items[i]+{c}'),start='0',end='n-1'),o('items[0]+items[n-1]'),loop(iff(f'items[i]<{c}',o('items[i]')),start='0',end='n-1')][kind]
   oracle=lambda q:q[:0:-1] if kind==0 else max(q[1:]) if kind==1 else [z+c for z in q[1:]] if kind==2 else q[1]+q[-1] if kind==3 else [z for z in q[1:] if z<c]
  else:
   desc=[(f'{c} ga teng birinchi zaxira indeksini (topilmasa -1)',f'the first index holding {c} (-1 if absent)'),(f'{c} qiymat necha marta uchrashini',f'the occurrence count of {c}'),('zaxiralarni o‘sish tartibida','stock values in ascending order'),('zaxiralarni kamayish tartibida','stock values in descending order'),('ikkinchi eng kichik qiymatni (takrorlar ham o‘rin egallaydi, n=1 bo‘lsa yagona qiymat)','the second-smallest value (duplicates count; for n=1 print the only value)')][kind]
   sort=loop(loop(iff('items[i]'+('>' if kind!=3 else '<')+'items[j]',a('tmp','items[i]')+a('items[i]','items[j]')+a('items[j]','tmp')),start='i+1',end='n-1',var='j'),start='0',end='n-1')
   code=[a('r',-1)+loop(iff(f'(items[i]={c}) and (r=-1)',a('r','i')),start='0',end='n-1')+o('r'),a('s',0)+loop(iff(f'items[i]={c}',a('s','s+1')),start='0',end='n-1')+o('s'),sort+loop(o('items[i]'),start='0',end='n-1'),sort+loop(o('items[i]'),start='0',end='n-1'),sort+iff('n=1',o('items[0]'),o('items[1]'))][kind]
   oracle=lambda q:(q[1:].index(c) if c in q[1:] else -1) if kind==0 else q[1:].count(c) if kind==1 else sorted(q[1:]) if kind==2 else sorted(q[1:],reverse=True) if kind==3 else sorted(q[1:])[min(1,q[0]-1)]
  st=pair('n ta zaxirani massivga saqlang. So‘ng '+desc[0]+' chiqaring. Indekslar 0 dan boshlanadi.','Store n stock values in an array, then print '+desc[1]+'. Indexes start at 0.');body+=code;inf=B('n (1..100), keyin n ta butun son (0..10000), har biri alohida qatorda.','n (1..100), then n integers (0..10000), one per line.');cases(rows,oracle)
 elif topic=='functions':
  expressions=['a*b',f'a*b+{c}','a div b','a mod b',f'(a+b)*{c}'];expr=expressions[kind]
  descriptions=[('buyum narxi a va soni b uchun jami narx','total cost for price a and quantity b'),(f'narx a, son b va {c} yetkazish to‘lovi uchun jami summa',f'total for price a, quantity b and delivery charge {c}'),('a buyum va quti sig‘imi b uchun to‘liq qutilar soni','full boxes for a items and capacity b'),('a buyum va quti sig‘imi b uchun ortgan buyumlar soni','leftovers for a items and capacity b'),(f'ikki bo‘lim kunlik miqdorlari a va b uchun {c} kunlik jami',f'total over {c} days for daily amounts a and b')]
  st=pair('Calculate(a,b) nomli Integer qaytaruvchi funksiya yarating: '+descriptions[kind][0]+'. Main ikki qiymatni o‘qib, funksiyani chaqirsin va natijani chiqarsin.','Create an Integer-returning function Calculate(a,b) for the '+descriptions[kind][1]+'. Main reads both values, calls the function and prints its result.')
  fn=f'<function name="Calculate" type="Integer" variable="r"><parameters><parameter name="a" type="Integer" array="False"/><parameter name="b" type="Integer" array="False"/></parameters><body>{a("r",expr)}</body></function>'
  body=base+inp('a')+inp('b')+a('r','Calculate(a,b)')+o('r');inf=B('Ikki qator: a (0..10000), b (1..100).','Two lines: a (0..10000), b (1..100).');cases([[20,3],[0,1],[1,100],[10000,99],[c,c],[17,4]],lambda q:q[0]*q[1] if kind==0 else q[0]*q[1]+c if kind==1 else q[0]//q[1] if kind==2 else q[0]%q[1] if kind==3 else (q[0]+q[1])*c)
 else:
  req=['for'];body=base+inp('n');rows=[[3,4,7,2],[1,c],[0],[5,0,0,0,0,0],[4,c-1,c,c+1,100],[6,2,4,6,8,10,12]]
  desc=[(f'Har xarid qiymati berilgan. Jami summa va har {c} so‘m uchun 1 ball hisobida jami bonusni chiqaring.',f'Given purchase amounts, print total spending and bonus points (1 per {c} units of total spending).'),(f'Har o‘quvchi bali berilgan. Jami ball va kamida {c} ball olganlar sonini chiqaring.',f'Given student scores, print the total and number scoring at least {c}.'),(f'Har partiya miqdori berilgan. Har partiyani alohida {c} sig‘imli qutilarga joylang. Jami to‘liq qutilar va jami ortgan buyumlarni chiqaring.',f'Pack each batch separately into boxes of {c}. Print the total full boxes and total leftover items.'),('Har kun tushumi berilgan. Umumiy tushum va eng katta kunlik tushumni chiqaring. n=0 bo‘lsa ikkala natija 0.','Given daily revenue, print the total and maximum daily revenue. If n=0 both are 0.'),(f'Har qatnov uchun yo‘lovchilar soni berilgan. Avtobus {c} kishini oladi. Har qatnovda sig‘gan yo‘lovchilar va sig‘maganlarning umumiy sonlarini chiqaring.',f'Each trip has a passenger count. A bus holds {c}. Print total carried and total left behind across all trips.')][kind]
  st=pair(*desc);body+=a('s',0)+a('r',0)
  calc=[a('s','s+a'),a('s','s+a')+iff(f'a>={c}',a('r','r+1')),a('s',f's+a div {c}')+a('r',f'r+a mod {c}'),a('s','s+a')+iff('a>r',a('r','a')),iff(f'a<={c}',a('s','s+a'),a('s',f's+{c}')+a('r',f'r+a-{c}'))][kind]
  body+=loop(inp('a')+calc)+o('s')+o(f's div {c}' if kind==0 else 'r');inf=B('n (0..100), keyin n ta butun miqdor (0..10000), har biri alohida qatorda.','n (0..100), then n integer quantities (0..10000), one per line.');cases(rows,lambda q:[sum(q[1:]),sum(q[1:])//c] if kind==0 else [sum(q[1:]),sum(z>=c for z in q[1:])] if kind==1 else [sum(z//c for z in q[1:]),sum(z%c for z in q[1:])] if kind==2 else [sum(q[1:]),max(q[1:],default=0)] if kind==3 else [sum(min(z,c) for z in q[1:]),sum(max(0,z-c) for z in q[1:])])
 hints=[B('Kirishdagi qiymatlarni yozib oling va bitta namunani qo‘lda hisoblang.','Name the input values and work through one example by hand.'),B('Darsdagi blok tartibidan foydalaning. Natija qayerda yangilanishini aniqlang.','Use the block order from the lesson. Identify where the result changes.'),B('Eng kichik kirish qiymati va shart chegarasini alohida tekshiring. Keraksiz matn chiqarmang.','Check the smallest valid input and condition boundaries. Avoid extra output text.')]
 return dict(title=title,statement=st,inputFormat=inf,outputFormat=out,tests=tests,hints=hints,judge={'mode':'tokens','requiredBlocks':req},variant={'family':f'{topic}-{kind+1}','number':v+1}),program(body,fn)

original=json.loads((OUT/'03-input.json').read_text())
# Keep original exercise IDs and their original semantics for existing students.
old=original['classwork'][:5]
legacy_expr=['a-12','a*6','a-2000','a*b','a div b']
legacy=[]
for i,p in enumerate(old):
 body=d('a,b')+inp('a')+(inp('b') if i>=3 else '')+o(legacy_expr[i])+(o('a mod b') if i==4 else '')
 p['outputFormat']=B('So‘ralgan sonni chiqaring.' if i<4 else 'Bo‘linma va qoldiqni shu tartibda chiqaring.','Print the requested number.' if i<4 else 'Print quotient then remainder.')
 p['difficulty']='easy';legacy.append((p,program(body)))
for order,(tid,uz,en,luz,len_) in enumerate(TOPICS,1):
 t=dict(id=tid,order=order,title=B(uz,en),lesson=B(luz,len_),concepts=[dict(title=B('Bloklar','Blocks'),text=B('Shartdagi talab etilgan bloklarga e’tibor bering.','Check the required blocks in each task.')),dict(title=B('Tekshirish','Testing'),text=B('Har bir Input alohida qatorni o‘qiydi. Natijani namuna bilan taqqoslang.','Each Input reads one line. Compare your output with the examples.'))],classwork=[],homework=[])
 for idx in range(50):
  kind=idx//10;v=idx%10;p,ref=make(tid,kind,v)
  if tid=='input' and idx<5:p,ref=legacy[idx]
  else:p['id']=f'{tid}-{idx+1:02d}'
  if tid in ['output','variables']:p['judge']['forbiddenBlocks']=['input']
  if tid in ['arrays','search-sort']:p['judge']['requireArray']=True
  if tid=='nested-for':p['judge']['requireNestedFor']=True
  if tid=='functions':p['judge']['requiredFunction']='Calculate'
  p['difficulty']='easy' if idx<10 else 'medium' if idx<40 else 'hard'
  t['classwork' if idx<20 else 'homework'].append(p)
  (REF/(tid+'__'+p['id']+'.fprg')).write_text(ref)
 (OUT/f'{order:02d}-{tid}.json').write_text(json.dumps(t,ensure_ascii=False,indent=2)+'\n')
print('Generated 15 topics, 750 exercises: 300 classwork + 450 homework, plus 750 reference solutions.')
