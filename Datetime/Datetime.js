// Use 'https://cdn.skypack.dev/' + 'npm package name' + '@version its optional'
import { CalendarChinese } from 'https://cdn.skypack.dev/date-chinese'

let rad = deg => (deg * Math.PI) / 180.0;
let sin = function (x) {return Math.sin(rad(x))}
let floor = Math.floor

let stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"]
let branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"]
let cmonth = [
  '端月',
  '杏月',
  '桃月',
  '梅月',
  '榴月',
  '荔月',
  '蘭月',
  '桂月',
  '菊月',
  '陽月',
  '葭月',
  '臘月',
]
let pentad_tbl = [
  ["春分",["玄鳥至",  "雷乃發聲",        "始電"],        ["白羊宮", "A"]],  
  ["清明",["桐始華",  "田鼠化鴽",        "虹始見"],      ["白羊宮", "A"]],
  ["穀雨",["萍始生",  "鳴鳩拂羽",        "戴勝降於桑"],  ["金牛宮", "B"]],
  ["立夏",["螻蟈鳴",  "蚯蚓出",          "王瓜生"],      ["金牛宮", "B"]],
  ["小滿",["苦菜秀",  "扉草死",          "小暑至"],      ["雙子宮", "C"]],
  ["芒種",["螗螂生",  "鵙始鳴",          "反舌無聲"],    ["雙子宮", "C"]],
  ["夏至",["鹿角解",  "蜩始鳴",          "半夏生"],      ["巨蟹宮", "D"]],
  ["小暑",["溫風至",  "蟋蟀居壁",        "鷹乃學習"],    ["巨蟹宮", "D"]],
  ["大暑",["腐草為螢","土潤溽暑",        "大雨時行"],    ["獅子宮", "E"]],
  ["立秋",["涼風至",  "白露降",          "寒蟬鳴"],      ["獅子宮", "E"]],
  ["處暑",["鷹乃祭鳥","天地始肅",        "禾乃登"],      ["処女宮", "F"]],
  ["白露",["鴻鴈來",  "元鳥歸",          "群鳥養羞"],    ["処女宮", "F"]],
  ["秋分",["雷乃收聲","蟄蟲坯戶",        "水始涸"],      ["天秤宮", "G"]],
  ["寒露",["鴻鴈來賓","雀入水為蛤",      "菊有黃華"],    ["天秤宮", "G"]],
  ["霜降",["豺乃祭獸","草木黃落",        "蟄蟲咸俯"],    ["天蝎宮", "H"]],
  ["立冬",["水始冰",  "地始凍",          "雉入大水為蜃"],["天蝎宮", "H"]],
  ["小雪",["虹藏不見","天氣上騰地氣下降","閉塞而成冬"],  ["人馬宮", "I"]],
  ["大雪",["鶡鳥不鳴","虎始交",          "荔挺出"],      ["人馬宮", "I"]],
  ["冬至",["蚯蚓結",  "麋角解",          "水泉動"],      ["磨羯宮", "J"]],
  ["小寒",["鴈北鄉",  "鵲姑巢",          "雉始雊"],      ["磨羯宮", "J"]],
  ["大寒",["雞始乳",  "鷙鳥厲疾",        "水澤腹堅"],    ["宝瓶宮", "K"]],
  ["立春",["東風解凍","蟄蟲始振",        "魚上冰"],      ["宝瓶宮", "K"]],
  ["雨水",["獺祭魚",  "鴻鴈來",          "草木萌動"],    ["双魚宮", "L"]],
  ["驚蟄",["桃始華",  "倉庚鳴",          "鷹化為鳩"],    ["双魚宮", "L"]]
]
let lunar_phase_tbl = [ "a", "c", "h", "f", "b", "e", "g", "d" ] // assume northern hemisphere view
let month_tbl = [
  "睦月",
  "如月",
  "弥生",
  "卯月",
  "皐月",
  "水無月",
  "文月",
  "葉月",
  "長月",
  "神無月",
  "霜月",
  "師走",
]
let youbi_tbl = [
  ["日曜日", "Q"],
  ["月曜日", "R"],
  ["火曜日", "U"],
  ["水曜日", "S"],
  ["木曜日", "V"],
  ["金曜日", "T"],
  ["土曜日", "W"],
]

let rendering     = $('.rendering')
let datetime_now  = $('.datetime-now')
let s_year        = $('.datetime-now .year')
let s_month       = $('.datetime-now .month')
let s_day         = $('.datetime-now .day')

let s_cyear       = $('.datetime-now .cyear')
let s_cmonth      = $('.datetime-now .cmonth')
let s_cday        = $('.datetime-now .cday')

let s_youbi_logo  = $('.datetime-now .youbi_logo')
let s_youbi       = $('.datetime-now .youbi')

let s_zodiac_logo = $('.datetime-now .zodiac_logo')
let s_zodiac      = $('.datetime-now .zodiac')

let s_lunar_phase = $('.datetime-now .lunar_phase')

let s_pentad      = $('.datetime-now .pentad')

let s_time        = $('.datetime-now .time')

function Update(time) {
  // compute the apparent ecliptic longitude of the Sun at now
  // https://en.wikipedia.org/wiki/Position_of_the_Sun#Ecliptic_coordinates

  // The getTime method returns the time in milliseconds.
  let epoch = Math.floor(time.getTime()/1000.0)
  // epoch seconds of J2000.0
  // obtained by
  // date --date="2000-01-01T12:00:00Z" +%s
  let n = (epoch - 94672800) / 86400
  let L = 280.260 + 0.9856474*n
  let g = 357.528 + 0.9856003*n
  var lon = L + 1.915*sin(g) + 0.020*sin(2*g)
  lon = floor(lon % 360)
  var pentad = floor(lon * 72 / 360) // 0 - 71
  var term = floor(pentad / 3)       // 0 - 23
  pentad = pentad % 3            // 0 - 2

  term = pentad_tbl[term]
  let zodiac = term[2]
  let youbi = youbi_tbl[time.getDay()]

  s_year .text("全新世紀元 " + (10000 + time.getFullYear()) + " 年 ") // YYYY
  s_month.text(month_tbl[time.getMonth()])  // name of the Month
  s_day  .text(                             // DD
    String(time.getDate()).padStart(2,"0")
    + " 日"
  )

  let cal = new CalendarChinese()
  cal.fromGregorian(time.getFullYear(), time.getMonth(), time.getDate());
  s_cyear.text(
      stems[(cal.year - 1) % 10]
    + branches[(cal.year - 1) % 12]
    + "年"
  );
  s_cmonth.text(cmonth[cal.month - 1]);
  s_cday.text(cal.day + " 日");

  s_youbi_logo.text(' ' + youbi[1] + ' ')
  s_youbi.text(youbi[0])

  s_zodiac_logo.text(' ' + zodiac[1] + ' ')
  s_zodiac.text(zodiac[0])

  // epoch seconds of the new moon on 2021 Oct 06 11:05 UTC
  // obtained by
  // date --date="2021-10-06T11:05Z" +%s
  n = (epoch - 1633518300) / 86400
  let age = floor(n % 29.53059 / 29.53059 * 7 + 0.5)
  let phase = lunar_phase_tbl[age]
  s_lunar_phase.text('  ' + phase + '  ')

  pentad = (
      term[0]                // solar term
    + " "
    + term[1][pentad]        // pentad
  )
  s_pentad.text(pentad)

  s_time.text(
      (time.getHours() >= 12 ? " 午後 " : " 午前 ")
    + " "
    + String(time.getHours() - (time.getHours() > 12 ? 12 : 0)).padStart(2, "0")
    + ":"
    + String(time.getMinutes()).padStart(2, "0")
    + ":"
    + String(time.getSeconds()).padStart(2, "0")
  )

  rendering.each((_, e) => e.style.setProperty( 'display', 'none' ))
  datetime_now.each((_, e) => e.style.setProperty( 'display', 'block', 'important' ))
}

rendering.text("Rendering...")

setInterval(() => {
  // TODO instead of use now, use 23:59:59 of the day
  let now = new Date();
  Update(now);
},1000);