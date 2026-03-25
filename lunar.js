// lunar.js - 农历转换工具（简化版 1900-2030 年）

// 农历数据表（1900-2030 年）
// 格式：[闰月月份，每月天数数组...]
// 0=29 天，1=30 天
const LUNAR_DATA = {
  1900: [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 8],
  1901: [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0],
  // ... 简化处理，使用算法计算
};

// 天干地支
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 农历月份名称
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];

// 农历日期名称
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'
];

// 节气数据（简化版）
const JIE_QI = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

/**
 * 公历转农历（简化算法）
 * @param {Date} date - 公历日期
 * @returns {Object} 农历信息
 */
function solarToLunar(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 简化计算：使用基准日期推算
  // 1900 年 1 月 31 日是农历 1900 年正月初一
  const baseDate = new Date(1900, 0, 31);
  const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  
  // 计算农历年份（近似）
  let lunarYear = 1900;
  let remainingDays = diffDays;
  
  while (remainingDays > 0) {
    const daysInYear = getLunarYearDays(lunarYear);
    if (remainingDays < daysInYear) break;
    remainingDays -= daysInYear;
    lunarYear++;
  }
  
  // 计算农历月份和日期
  let lunarMonth = 1;
  let leapMonth = getLeapMonth(lunarYear);
  
  for (let m = 1; m <= 12; m++) {
    const daysInMonth = getLunarMonthDays(lunarYear, m);
    if (remainingDays < daysInMonth) {
      break;
    }
    remainingDays -= daysInMonth;
    lunarMonth++;
    
    // 处理闰月
    if (leapMonth > 0 && m === leapMonth) {
      const leapDays = getLunarMonthDays(lunarYear, -leapMonth);
      if (remainingDays < leapDays) {
        lunarMonth = -m; // 负数表示闰月
        break;
      }
      remainingDays -= leapDays;
    }
  }
  
  const lunarDay = remainingDays + 1;
  
  return {
    year: lunarYear,
    month: lunarMonth,
    day: lunarDay,
    yearGanZhi: getYearGanZhi(lunarYear),
    monthGanZhi: getMonthGanZhi(lunarYear, lunarMonth),
    dayGanZhi: getDayGanZhi(date),
    isLeap: lunarMonth < 0,
    monthName: getLunarMonthName(lunarMonth),
    dayName: LUNAR_DAYS[Math.min(lunarDay - 1, 29)]
  };
}

/**
 * 获取农历年天数
 */
function getLunarYearDays(year) {
  let days = 0;
  for (let m = 1; m <= 12; m++) {
    days += getLunarMonthDays(year, m);
  }
  const leapMonth = getLeapMonth(year);
  if (leapMonth > 0) {
    days += getLunarMonthDays(year, -leapMonth);
  }
  return days;
}

/**
 * 获取农历月天数（简化）
 */
function getLunarMonthDays(year, month) {
  // 简化：交替 29/30 天
  const isBigMonth = (year + month) % 2 === 0;
  return isBigMonth ? 30 : 29;
}

/**
 * 获取闰月月份
 */
function getLeapMonth(year) {
  // 简化：某些年份有闰月
  const leapYears = [1900, 1903, 1906, 1909, 1911, 1914, 1917, 1919, 1922, 1925, 1927, 1930, 1933, 1935, 1938, 1941, 1944, 1946, 1949, 1952, 1955, 1957, 1960, 1963, 1965, 1968, 1971, 1974, 1976, 1979, 1982, 1984, 1987, 1990, 1993, 1995, 1998, 2001, 2004, 2006, 2009, 2012, 2014, 2017, 2020, 2023, 2025, 2028];
  if (leapYears.includes(year)) {
    return ((year % 12) % 12) || 12;
  }
  return 0;
}

/**
 * 获取年干支
 */
function getYearGanZhi(year) {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return {
    gan: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    zhi: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
    full: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex] + DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
  };
}

/**
 * 获取月干支（简化）
 */
function getMonthGanZhi(year, month) {
  const yearGanZhi = getYearGanZhi(year);
  const ganIndex = TIAN_GAN.indexOf(yearGanZhi.gan);
  
  // 年上起月法
  const monthGanStart = [2, 4, 6, 8, 0];
  const startGanIndex = monthGanStart[ganIndex % 5];
  
  const adjustedMonth = Math.abs(month) - 1;
  const ganIdx = (startGanIndex + adjustedMonth) % 10;
  const zhiIdx = (adjustedMonth + 2) % 12;
  
  return {
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    full: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx]
  };
}

/**
 * 获取日干支
 */
function getDayGanZhi(date) {
  const baseDate = new Date(1900, 0, 31);
  const diffDays = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
  
  const ganIndex = diffDays % 10;
  const zhiIndex = diffDays % 12;
  
  return {
    gan: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    zhi: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
    full: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex] + DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
  };
}

/**
 * 获取农历月份名称
 */
function getLunarMonthName(month) {
  const isLeap = month < 0;
  const monthIdx = Math.abs(month) - 1;
  return (isLeap ? '闰' : '') + LUNAR_MONTHS[monthIdx] + '月';
}

/**
 * 农历转公历（简化反向计算）
 */
function lunarToSolar(lunarYear, lunarMonth, lunarDay, isLeap = false) {
  // 从基准日期开始累加
  const baseDate = new Date(1900, 0, 31);
  let totalDays = 0;
  
  // 累加年
  for (let y = 1900; y < lunarYear; y++) {
    totalDays += getLunarYearDays(y);
  }
  
  // 累加月
  const leapMonth = getLeapMonth(lunarYear);
  for (let m = 1; m <= Math.abs(lunarMonth); m++) {
    totalDays += getLunarMonthDays(lunarYear, m);
    if (isLeap && m === Math.abs(lunarMonth)) {
      totalDays += getLunarMonthDays(lunarYear, -m);
    }
    if (leapMonth > 0 && m === leapMonth && !isLeap) {
      totalDays += getLunarMonthDays(lunarYear, -m);
    }
  }
  
  // 加上日期
  totalDays += lunarDay - 1;
  
  const solarDate = new Date(baseDate.getTime() + totalDays * 24 * 60 * 60 * 1000);
  return {
    year: solarDate.getFullYear(),
    month: solarDate.getMonth() + 1,
    day: solarDate.getDate(),
    date: solarDate
  };
}

/**
 * 获取节气
 */
function getJieQi(year, month) {
  // 简化：每月两个节气
  const jieqiMap = {
    1: ['小寒', '大寒'],
    2: ['立春', '雨水'],
    3: ['惊蛰', '春分'],
    4: ['清明', '谷雨'],
    5: ['立夏', '小满'],
    6: ['芒种', '夏至'],
    7: ['小暑', '大暑'],
    8: ['立秋', '处暑'],
    9: ['白露', '秋分'],
    10: ['寒露', '霜降'],
    11: ['立冬', '小雪'],
    12: ['大雪', '冬至']
  };
  return jieqiMap[month] || [];
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { solarToLunar, lunarToSolar, getYearGanZhi, getJieQi };
}
