// Use 'https://cdn.skypack.dev/' + 'npm package name' + '@version its optional'
import { CalendarChinese } from 'https://cdn.skypack.dev/date-chinese'

// Constants and configuration
const RADIAN_CONVERSION = Math.PI / 180.0;
// epoch seconds of J2000.0
// date --date="2000-01-01T12:00:00Z" +%s
const J2000_EPOCH = 94672800; // epoch seconds of J2000.0
// epoch seconds of the new moon on 2021 Oct 06 11:05 UTC
// date --date="2021-10-06T11:05Z" +%s
const NEW_MOON_EPOCH = 1633518300; // epoch seconds of new moon 2021 Oct 06 11:05 UTC
const LUNAR_CYCLE = 29.53059; // days in lunar cycle
const SECONDS_PER_DAY = 86400;

// Utility functions
const rad = deg => deg * RADIAN_CONVERSION;
const sin = x => Math.sin(rad(x));
const floor = Math.floor;

// Data arrays (constants)
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const CMONTH = [
  '端月', '杏月', '桃月', '梅月', '榴月', '荔月',
  '蘭月', '桂月', '菊月', '陽月', '葭月', '臘月'
];

const PENTAD_DATA = [
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

const LUNAR_PHASES = ["a", "c", "h", "f", "b", "e", "g", "d"]; // assume northern hemisphere view
const MONTH_NAMES = [
  "睦月", "如月", "弥生", "卯月", "皐月", "水無月",
  "文月", "葉月", "長月", "神無月", "霜月", "師走"
];

const WEEKDAYS = [
  ["日曜日", "Q"],
  ["月曜日", "R"],
  ["火曜日", "U"],
  ["水曜日", "S"],
  ["木曜日", "V"],
  ["金曜日", "T"],
  ["土曜日", "W"],
];

const DOM_ELEMENTS = {
  rendering     : $('.rendering'),
  datetimeNow   : $('.datetime-now'),

  year          : $('.datetime-now .year'),
  month         : $('.datetime-now .month'),
  day           : $('.datetime-now .day'),

  cyear         : $('.datetime-now .cyear'),
  cmonth        : $('.datetime-now .cmonth'),
  cday          : $('.datetime-now .cday'),

  youbiLogo     : $('.datetime-now .youbi_logo'),
  youbi         : $('.datetime-now .youbi'),

  zodiacLogo    : $('.datetime-now .zodiac_logo'),
  zodiac        : $('.datetime-now .zodiac'),

  lunarPhase    : $('.datetime-now .lunar_phase'),

  pentad        : $('.datetime-now .pentad'),

  time          : $('.datetime-now .time'),
};

// Calculate solar position and related astronomical data
function calculateSolarPosition(time) {
  // compute the apparent ecliptic longitude of the Sun at now
  // https://en.wikipedia.org/wiki/Position_of_the_Sun#Ecliptic_coordinates

  const epoch = floor(time.getTime() / 1000);
  const n = (epoch - J2000_EPOCH) / SECONDS_PER_DAY;
  
  // Solar longitude calculations
  const L = 280.260 + 0.9856474 * n;
  const g = 357.528 + 0.9856003 * n;
  const lon = floor((L + 1.915 * sin(g) + 0.020 * sin(2 * g)) % 360);
  
  const pentadIndex = floor(lon * 72 / 360); // 0 - 71
  const termIndex = floor(pentadIndex / 3);  // 0 - 23
  const pentadSubIndex = pentadIndex % 3;    // 0 - 2
  
  return { termIndex, pentadSubIndex, epoch };
}

// Calculate lunar phase
function calculateLunarPhase(epoch) {
  const n = (epoch - NEW_MOON_EPOCH) / SECONDS_PER_DAY;
  const age = floor((n % LUNAR_CYCLE) / LUNAR_CYCLE * 7 + 0.5);
  return LUNAR_PHASES[age % LUNAR_PHASES.length];
}

// Format time in 12-hour format with Japanese period
function formatTime12h(time) {
  const hours = time.getHours();
  const period = hours >= 12 ? "午後" : "午前";
  const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
  
  return `${period} ${String(displayHours).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}:${String(time.getSeconds()).padStart(2, '0')}`;
}

// Main update function
function Update(time) {
  try {
    const { termIndex, pentadSubIndex, epoch } = calculateSolarPosition(time);
    const solarTerm = PENTAD_DATA[termIndex];
    const weekday = WEEKDAYS[time.getDay()];
    
    // Update basic date information
    DOM_ELEMENTS.year.text(`全新世紀元 ${10000 + time.getFullYear()} 年`);
    DOM_ELEMENTS.month.text(MONTH_NAMES[time.getMonth()]);
    DOM_ELEMENTS.day.text(`${String(time.getDate()).padStart(2, '0')} 日`);
    
    // Update Chinese calendar
    let cal = new CalendarChinese().fromDate(time);
    DOM_ELEMENTS.cyear.text(`${STEMS[(cal.year - 1) % 10]}${BRANCHES[(cal.year - 1) % 12]}年`);
    DOM_ELEMENTS.cmonth.text(cal.leap ? "閏" : "" + CMONTH[cal.month - 1]);
    DOM_ELEMENTS.cday.text(`${cal.day} 日`);
    
    // Update weekday
    DOM_ELEMENTS.youbiLogo.text(` ${weekday[1]} `);
    DOM_ELEMENTS.youbi.text(weekday[0]);
    
    // Update zodiac
    const zodiac = solarTerm[2];
    DOM_ELEMENTS.zodiacLogo.text(` ${zodiac[1]} `);
    DOM_ELEMENTS.zodiac.text(zodiac[0]);
    
    // Update lunar phase
    const lunarPhase = calculateLunarPhase(epoch);
    DOM_ELEMENTS.lunarPhase.text(`  ${lunarPhase}  `);
    
    // Update pentad
    DOM_ELEMENTS.pentad.text(`${solarTerm[0]} ${solarTerm[1][pentadSubIndex]}`);
    
    // Update time
    DOM_ELEMENTS.time.text(formatTime12h(time));
    
    // Toggle visibility
    DOM_ELEMENTS.rendering.hide();
    DOM_ELEMENTS.datetimeNow.show();
    
  } catch (error) {
    console.error('Error updating datetime display:', error);
  }
}

// Initialize display
DOM_ELEMENTS.rendering.text("Rendering...");

// Update immediately, then set up interval
Update(new Date());

// Set up interval with optimized timing
setInterval(() => {
  Update(new Date());
}, 1000);