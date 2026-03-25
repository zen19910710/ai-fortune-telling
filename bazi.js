// 八字排盘核心逻辑

// 天干
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行
const GAN_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 地支五行
const ZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 天干阴阳
const GAN_YINYANG = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴'
};

// 地支阴阳
const ZHI_YINYANG = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳', '巳': '阴',
  '午': '阳', '未': '阴', '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 十神关系（以日干为中心）
function getShiShen(dayGan, otherGan) {
  const dayWuxing = GAN_WUXING[dayGan];
  const otherWuxing = GAN_WUXING[otherGan];
  const dayYinyang = GAN_YINYANG[dayGan];
  const otherYinyang = GAN_YINYANG[otherGan];
  
  const sameYinyang = dayYinyang === otherYinyang;
  
  // 生我者为印
  if (shengs(otherWuxing, dayWuxing)) {
    return sameYinyang ? '偏印' : '正印';
  }
  // 我生者为食伤
  if (shengs(dayWuxing, otherWuxing)) {
    return sameYinyang ? '食神' : '伤官';
  }
  // 克我者为官杀
  if (kes(otherWuxing, dayWuxing)) {
    return sameYinyang ? '七杀' : '正官';
  }
  // 我克者为财
  if (kes(dayWuxing, otherWuxing)) {
    return sameYinyang ? '偏财' : '正财';
  }
  // 同我者为比劫
  if (dayWuxing === otherWuxing) {
    return sameYinyang ? '比肩' : '劫财';
  }
  
  return '未知';
}

// 五行相生
function shengs(from, to) {
  const sheng = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'};
  return sheng[from] === to;
}

// 五行相克
function kes(from, to) {
  const ke = {'木': '土', '土': '水', '水': '火', '火': '金', '金': '木'};
  return ke[from] === to;
}

// 计算年柱
function getYearPillar(year) {
  // 1984 年是甲子年
  const baseYear = 1984;
  const ganIndex = (year - baseYear) % 10;
  const zhiIndex = (year - baseYear) % 12;
  
  return {
    stem: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    branch: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex],
    year: year
  };
}

// 计算月柱（简化版，按节气划分）
function getMonthPillar(year, month, day) {
  const yearPillar = getYearPillar(year);
  const yearGanIndex = TIAN_GAN.indexOf(yearPillar.stem);
  
  // 年上起月法：甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚上，丁壬壬寅顺水流，戊癸之年甲寅起
  const monthGanStart = [2, 4, 6, 8, 0]; // 丙戊庚壬甲的索引
  const startGanIndex = monthGanStart[yearGanIndex % 5];
  
  // 月支固定：寅月（立春后）为正月
  // 简化处理：按农历月份，实际应按节气
  const adjustedMonth = month - 1; // 转为 0-11
  const zhiIndex = (adjustedMonth + 2) % 12; // 寅月为 2
  
  const ganIndex = (startGanIndex + adjustedMonth) % 10;
  
  return {
    stem: TIAN_GAN[ganIndex],
    branch: DI_ZHI[zhiIndex]
  };
}

// 计算日柱（简化版，使用公式计算）
function getDayPillar(year, month, day) {
  // 简化日柱计算（实际应查万年历）
  // 这里使用一个近似算法
  const baseDate = new Date(1900, 0, 31); // 1900 年 1 月 31 日是甲子日
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  
  const ganIndex = diffDays % 10;
  const zhiIndex = diffDays % 12;
  
  return {
    stem: TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex],
    branch: DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex]
  };
}

// 计算时柱
function getHourPillar(dayPillar, hour) {
  const dayGanIndex = TIAN_GAN.indexOf(dayPillar.stem);
  
  // 日上起时法：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸何方发，壬子是真途
  const hourGanStart = [0, 2, 4, 6, 8]; // 甲丙戊庚壬的索引
  const startGanIndex = hourGanStart[dayGanIndex % 5];
  
  // 时辰计算：23-1 点为子时，1-3 点为丑时，以此类推
  const hourIndex = Math.floor((hour + 1) / 2) % 12;
  const ganIndex = (startGanIndex + hourIndex) % 10;
  
  return {
    stem: TIAN_GAN[ganIndex],
    branch: DI_ZHI[hourIndex]
  };
}

// 计算大运（简化版）
function getDaYun(yearPillar, gender) {
  const daYunList = [];
  const yearGanIndex = TIAN_GAN.indexOf(yearPillar.stem);
  const yearZhiIndex = DI_ZHI.indexOf(yearPillar.branch);
  
  // 阳男阴女顺排，阴男阳女逆排
  const yearGanYinyang = GAN_YINYANG[yearPillar.stem];
  const yearZhiYinyang = ZHI_YINYANG[yearPillar.branch];
  const isYangYear = yearGanYinyang === '阳';
  const isMale = gender === '男';
  
  const shunPai = (isMale && isYangYear) || (!isMale && !isYangYear);
  
  let startGan = yearGanIndex;
  let startZhi = yearZhiIndex;
  
  for (let i = 0; i < 8; i++) {
    if (shunPai) {
      startGan = (startGan + 1) % 10;
      startZhi = (startZhi + 1) % 12;
    } else {
      startGan = (startGan - 1 + 10) % 10;
      startZhi = (startZhi - 1 + 12) % 12;
    }
    
    daYunList.push({
      stem: TIAN_GAN[startGan],
      branch: DI_ZHI[startZhi],
      age: (i + 1) * 10
    });
  }
  
  return daYunList;
}

// 五行统计
function countWuxing(bazi) {
  const count = {'木': 0, '火': 0, '土': 0, '金': 0, '水': 0};
  
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  pillars.forEach(pillar => {
    count[GAN_WUXING[pillar.stem]]++;
    count[ZHI_WUXING[pillar.branch]]++;
  });
  
  return count;
}

// 身强身弱判断（简化版）
function judgeShenQiang(bazi) {
  const wuxingCount = countWuxing(bazi);
  const dayMaster = GAN_WUXING[bazi.day.stem];
  
  // 生助日主的五行
  const shengZhu = {'木': ['水', '木'], '火': ['木', '火'], '土': ['火', '土'], 
                    '金': ['土', '金'], '水': ['金', '水']};
  
  let supportCount = 0;
  shengZhu[dayMaster].forEach(w => {
    supportCount += wuxingCount[w];
  });
  
  // 总共 8 个字，超过 4 个为身旺
  if (supportCount >= 4) {
    return '身旺';
  } else if (supportCount <= 2) {
    return '身弱';
  } else {
    return '中和';
  }
}

// 完整的八字排盘
function calculateBazi(birthInfo) {
  const { year, month, day, hour, gender } = birthInfo;
  
  const yearPillar = getYearPillar(year);
  const monthPillar = getMonthPillar(year, month, day);
  const dayPillar = getDayPillar(year, month, day);
  const hourPillar = getHourPillar(dayPillar, hour);
  
  const bazi = {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    dayMaster: dayPillar.stem,
    gender: gender,
    shenQiang: judgeShenQiang({year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar}),
    wuxing: countWuxing({year: yearPillar, month: monthPillar, day: dayPillar, hour: hourPillar}),
    daYun: getDaYun(yearPillar, gender)
  };
  
  // 计算十神
  bazi.shiShen = {
    year: getShiShen(dayPillar.stem, yearPillar.stem),
    month: getShiShen(dayPillar.stem, monthPillar.stem),
    day: '日主',
    hour: getShiShen(dayPillar.stem, hourPillar.stem)
  };
  
  return bazi;
}

// 更新 duanyu.js 中的辅助函数
function hasTianKeDiChong(year, hour) {
  const ganKe = {
    '甲': '庚', '乙': '辛', '丙': '壬', '丁': '癸', '戊': '甲',
    '己': '乙', '庚': '丙', '辛': '丁', '壬': '戊', '癸': '己'
  };
  const zhiChong = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥'
  };
  
  const ganChong = ganKe[year.stem] === hour.stem || ganKe[hour.stem] === year.stem;
  const zhiChongMatch = zhiChong[year.branch] === hour.branch;
  
  return ganChong && zhiChongMatch;
}

function hasSameWuxing(pillar1, pillar2) {
  return GAN_WUXING[pillar1.stem] === GAN_WUXING[pillar2.stem] ||
         ZHI_WUXING[pillar1.branch] === ZHI_WUXING[pillar2.branch];
}

function hasWangShenJieSha(bazi) {
  // 简化：检查是否有特定组合
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  return pillars.some(p => p.branch === '子' || p.branch === '午');
}

function isXiangSheng(branch1, branch2) {
  const sheng = {'亥': '寅', '寅': '巳', '巳': '午', '午': '未', '未': '酉', 
                 '酉': '亥', '子': '卯', '卯': '午', '申': '亥', '辰': '酉'};
  return sheng[branch1] === branch2 || sheng[branch2] === branch1;
}

function hasYiMaXingChong(bazi) {
  const yiMa = {'寅': '申', '申': '寅', '巳': '亥', '亥': '巳'};
  const hourYiMa = yiMa[bazi.hour.branch];
  if (!hourYiMa) return false;
  
  const pillars = [bazi.year, bazi.month, bazi.day];
  return pillars.some(p => p.branch === hourYiMa);
}

function isJiXiang(branch) {
  const jiXiang = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  return jiXiang.includes(branch);
}

function hasXingChong(pillar1, pillar2) {
  const chong = {'子': '午', '丑': '未', '寅': '申', '卯': '酉', '辰': '戌', '巳': '亥'};
  return chong[pillar1.branch] === pillar2.branch;
}

function isEmptyWang(pillar) {
  // 简化：空亡判断
  return false;
}

function isQiSha(pillar) {
  return false; // 需要日干信息
}

function isShangGuan(pillar) {
  return false;
}

function isBiJie(pillar) {
  return false;
}

function isPianCai(pillar) {
  return false;
}

function hasChildrenStarInWangDi(bazi) {
  return bazi.wuxing['木'] >= 2 || bazi.wuxing['火'] >= 2;
}

function hasZhiHuaQiSha(pillar) {
  return false;
}

function isGuanXingInWangDi(pillar) {
  return false;
}

function countZhengGuan(bazi) {
  let count = 0;
  const pillars = [bazi.year, bazi.month, bazi.hour];
  pillars.forEach(p => {
    if (p.stem === '庚' || p.stem === '辛') count++;
  });
  return count;
}

function hasManyQiShaNoZhi(bazi) {
  return false;
}

function isZhengCai(pillar) {
  return false;
}

function countBranch(bazi, targetBranch) {
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  return pillars.filter(p => p.branch === targetBranch).length;
}

function hasBranch(bazi, targetBranch) {
  return countBranch(bazi, targetBranch) > 0;
}

function hasYin(bazi) {
  const pillars = [bazi.year, bazi.month, bazi.hour];
  return pillars.some(p => p.stem === '甲' || p.stem === '乙');
}

function isChunYang(bazi) {
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  return pillars.every(p => GAN_YINYANG[p.stem] === '阳' && ZHI_YINYANG[p.branch] === '阳');
}

function isChunYin(bazi) {
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  return pillars.every(p => GAN_YINYANG[p.stem] === '阴' && ZHI_YINYANG[p.branch] === '阴');
}

function hasAllFour(bazi, targets) {
  const all = [];
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];
  pillars.forEach(p => {
    all.push(p.stem, p.branch);
  });
  return targets.every(t => all.includes(t));
}

function hasCai(bazi) {
  return bazi.wuxing['木'] > 0 || bazi.wuxing['火'] > 0;
}

function hasHuaGaiFengSi(bazi) {
  return false;
}

function hasGuan(bazi) {
  return bazi.wuxing['金'] > 0;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calculateBazi, TIAN_GAN, DI_ZHI, GAN_WUXING, ZHI_WUXING };
}
