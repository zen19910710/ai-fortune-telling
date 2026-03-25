// wuxing.js - 五行分析增强模块

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

const GAN_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

const ZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 地支藏干（简化）
const ZHI_CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 五行属性对应
const WUXING_PROPERTIES = {
  '木': { color: '青色', direction: '东方', season: '春季', organ: '肝胆', emotion: '怒' },
  '火': { color: '红色', direction: '南方', season: '夏季', organ: '心小肠', emotion: '喜' },
  '土': { color: '黄色', direction: '中央', season: '长夏', organ: '脾胃', emotion: '思' },
  '金': { color: '白色', direction: '西方', season: '秋季', organ: '肺大肠', emotion: '悲' },
  '水': { color: '黑色', direction: '北方', season: '冬季', organ: '肾膀胱', emotion: '恐' }
};

// 日主性格特点
const DAY_MASTER_PERSONALITY = {
  '甲': {
    name: '甲木',
    trait: '参天大树',
    personality: '正直仁慈，有上进心，坚强不屈，有领导才能',
    strength: '有责任感，直率坦诚，富有同情心',
    weakness: '有时过于刚直，不懂变通，容易冲动'
  },
  '乙': {
    name: '乙木',
    trait: '花草藤蔓',
    personality: '温柔灵活，善于适应，有艺术气质',
    strength: '柔韧性强，善于交际，富有创意',
    weakness: '有时优柔寡断，依赖心重，缺乏主见'
  },
  '丙': {
    name: '丙火',
    trait: '太阳之火',
    personality: '热情开朗，光明磊落，富有感染力',
    strength: '积极乐观，乐于助人，有号召力',
    weakness: '有时急躁冲动，好面子，缺乏耐心'
  },
  '丁': {
    name: '丁火',
    trait: '灯烛之火',
    personality: '温和细腻，心思缜密，有礼貌',
    strength: '体贴入微，思维敏捷，外柔内刚',
    weakness: '有时多愁善感，疑心重，容易焦虑'
  },
  '戊': {
    name: '戊土',
    trait: '高山之土',
    personality: '稳重诚信，宽厚包容，有担当',
    strength: '可靠踏实，守信重诺，包容力强',
    weakness: '有时固执己见，反应慢，不懂变通'
  },
  '己': {
    name: '己土',
    trait: '田园之土',
    personality: '温和谦逊，善于协调，有耐心',
    strength: '包容宽厚，善于倾听，适应力强',
    weakness: '有时缺乏主见，过于迁就，优柔寡断'
  },
  '庚': {
    name: '庚金',
    trait: '刀剑之金',
    personality: '刚毅果断，讲义气，有决断力',
    strength: '勇敢坚强，是非分明，执行力强',
    weakness: '有时过于刚硬，不懂婉转，容易得罪人'
  },
  '辛': {
    name: '辛金',
    trait: '珠宝之金',
    personality: '精致优雅，重面子，有品味',
    strength: '心思细腻，追求完美，气质佳',
    weakness: '有时过于挑剔，虚荣心重，敏感多疑'
  },
  '壬': {
    name: '壬水',
    trait: '江河之水',
    personality: '聪明灵活，善于变通，有智慧',
    strength: '适应力强，足智多谋，胸怀宽广',
    weakness: '有时变化无常，缺乏定性，容易放纵'
  },
  '癸': {
    name: '癸水',
    trait: '雨露之水',
    personality: '温柔智慧，内敛含蓄，有灵性',
    strength: '心思细腻，善于思考，富有想象力',
    weakness: '有时过于内向，消极悲观，缺乏行动力'
  }
};

// 喜用神判断规则
function getXiyongshen(bazi) {
  const dayMaster = bazi.dayMaster;
  const dayWuxing = GAN_WUXING[dayMaster];
  const shenQiang = bazi.shenQiang;
  const wuxing = bazi.wuxing;
  
  let xiyong = []; // 喜用神
  let jishen = []; // 忌神
  
  // 身旺：克泄耗为喜用
  if (shenQiang === '身旺') {
    // 克我者为官杀
    const keWo = getKeWoWuxing(dayWuxing);
    xiyong.push(keWo);
    
    // 我生者为食伤
    const woSheng = getWoShengWuxing(dayWuxing);
    xiyong.push(woSheng);
    
    // 我克者为财
    const woKe = getWoKeWuxing(dayWuxing);
    xiyong.push(woKe);
    
    // 生我者和同我者为忌
    jishen.push(getShengWoWuxing(dayWuxing));
    jishen.push(dayWuxing);
  }
  // 身弱：生扶为喜用
  else if (shenQiang === '身弱') {
    // 生我者为印
    const shengWo = getShengWoWuxing(dayWuxing);
    xiyong.push(shengWo);
    
    // 同我者为比劫
    xiyong.push(dayWuxing);
    
    // 克我者、我生者、我克者为忌
    jishen.push(getKeWoWuxing(dayWuxing));
    jishen.push(getWoShengWuxing(dayWuxing));
    jishen.push(getWoKeWuxing(dayWuxing));
  }
  // 中和：视情况而定
  else {
    // 根据五行缺失来定
    const missing = getMissingWuxing(wuxing);
    if (missing.length > 0) {
      xiyong = missing;
      jishen = [getKeWoWuxing(dayWuxing)];
    } else {
      xiyong = ['土']; // 中和以土为用
      jishen = [];
    }
  }
  
  // 去重
  xiyong = [...new Set(xiyong)];
  jishen = [...new Set(jishen)];
  
  return { xiyong, jishen };
}

function getShengWoWuxing(wuxing) {
  const sheng = {'木': '水', '火': '木', '土': '火', '金': '土', '水': '金'};
  return sheng[wuxing];
}

function getWoShengWuxing(wuxing) {
  const sheng = {'木': '火', '火': '土', '土': '金', '金': '水', '水': '木'};
  return sheng[wuxing];
}

function getKeWoWuxing(wuxing) {
  const ke = {'木': '金', '火': '水', '土': '木', '金': '火', '水': '土'};
  return ke[wuxing];
}

function getWoKeWuxing(wuxing) {
  const ke = {'木': '土', '火': '金', '土': '水', '金': '木', '水': '火'};
  return ke[wuxing];
}

function getMissingWuxing(wuxing) {
  return Object.entries(wuxing)
    .filter(([_, count]) => count === 0)
    .map(([wuxing, _]) => wuxing);
}

/**
 * 五行统计分析
 */
function analyzeWuxing(bazi) {
  const wuxing = bazi.wuxing;
  const totalCount = 8; // 八字共 8 个字
  
  // 统计数量和百分比
  const stats = Object.entries(wuxing).map(([name, count]) => ({
    name,
    count,
    percentage: ((count / totalCount) * 100).toFixed(1),
    level: getWuxingLevel(count)
  }));
  
  // 缺失提示
  const missing = getMissingWuxing(wuxing);
  
  // 强弱分析
  const strongest = stats.reduce((max, s) => s.count > max.count ? s : max, stats[0]);
  const weakest = stats.reduce((min, s) => s.count < min.count ? s : min, stats[0]);
  
  // 喜用神
  const { xiyong, jishen } = getXiyongshen(bazi);
  
  return {
    stats,
    missing,
    strongest,
    weakest,
    xiyong,
    jishen,
    summary: generateWuxingSummary(stats, missing, strongest, xiyong)
  };
}

function getWuxingLevel(count) {
  if (count >= 3) return '旺';
  if (count === 2) return '相';
  if (count === 1) return '弱';
  return '缺';
}

function generateWuxingSummary(stats, missing, strongest, xiyong) {
  let summary = [];
  
  if (missing.length > 0) {
    summary.push(`五行缺${missing.join('、')}，需要在生活中适当补充。`);
  }
  
  if (strongest.count >= 3) {
    summary.push(`${strongest.name}最旺，${WUXING_PROPERTIES[strongest.name].emotion}气较重，需要注意调节。`);
  }
  
  if (xiyong.length > 0) {
    summary.push(`喜用神为${xiyong.join('、')}，多接触相关元素可增强运势。`);
  }
  
  return summary.join('');
}

/**
 * 性格分析
 */
function analyzePersonality(bazi) {
  const dayMaster = bazi.dayMaster;
  const dmInfo = DAY_MASTER_PERSONALITY[dayMaster];
  const wuxingAnalysis = analyzeWuxing(bazi);
  
  // 主导五行
  const dominantWuxing = wuxingAnalysis.strongest.name;
  const dominantTrait = WUXING_PROPERTIES[dominantWuxing];
  
  // 身强身弱性格表现
  let shenQiangTrait = '';
  if (bazi.shenQiang === '身旺') {
    shenQiangTrait = '身旺者自信果断，行动力强，但需注意不要过于强势。';
  } else if (bazi.shenQiang === '身弱') {
    shenQiangTrait = '身弱者心思细腻，善于思考，但需增强自信和决断力。';
  } else {
    shenQiangTrait = '五行中和，性格平衡，适应力强。';
  }
  
  return {
    dayMaster: {
      name: dmInfo.name,
      trait: dmInfo.trait,
      personality: dmInfo.personality,
      strength: dmInfo.strength,
      weakness: dmInfo.weakness
    },
    shenQiang: shenQiangTrait,
    dominant: {
      wuxing: dominantWuxing,
      trait: `受${dominantWuxing}影响较大，${dominantTrait.emotion}情绪较为明显，${dominantTrait.season}季运势较强。`
    }
  };
}

/**
 * 事业建议分析
 */
function analyzeCareer(bazi) {
  const dayMaster = bazi.dayMaster;
  const { xiyong } = getXiyongshen(bazi);
  const wuxing = bazi.wuxing;
  
  // 适合行业（基于喜用神）
  const suitableIndustries = xiyong.map(wx => {
    const industries = {
      '木': ['教育', '文化', '林业', '园艺', '出版', '医疗'],
      '火': ['演艺', '销售', '能源', '餐饮', '电子', '广告'],
      '土': ['房地产', '建筑', '农业', '咨询', '管理', '仓储'],
      '金': ['金融', '法律', '机械', '军警', '珠宝', '精密制造'],
      '水': ['贸易', '物流', '旅游', '研究', '咨询', '航运']
    };
    return { wuxing: wx, industries: industries[wx] };
  });
  
  // 创业还是打工
  const创业建议 = (wuxing['金'] + wuxing['火'] >= 3) 
    ? '适合创业，有开拓精神和执行力' 
    : '适合稳定工作，积累经验和资源后再考虑创业';
  
  // 贵人方位
  const direction = {
    '木': '东方',
    '火': '南方',
    '土': '本地或中央',
    '金': '西方',
    '水': '北方'
  };
  
  return {
    industries: suitableIndustries,
    development: 创业建议，
    direction: xiyong.map(wx => direction[wx]).join('、'),
    advice: generateCareerAdvice(bazi)
  };
}

function generateCareerAdvice(bazi) {
  const dayMaster = bazi.dayMaster;
  const advice = {
    '甲': '发挥领导才能，适合管理岗位或自主创业',
    '乙': '发挥创意和适应能力，适合艺术、设计或策划工作',
    '丙': '发挥热情和感染力，适合销售、演艺或公关工作',
    '丁': '发挥细致和思考能力，适合研究、分析或技术工作',
    '戊': '发挥稳重和诚信，适合管理、金融或房地产工作',
    '己': '发挥协调和包容能力，适合人力、服务或咨询工作',
    '庚': '发挥决断和执行力，适合法律、军警或管理工作',
    '辛': '发挥品味和细腻，适合金融、艺术或高端服务工作',
    '壬': '发挥智慧和变通能力，适合贸易、策划或咨询工作',
    '癸': '发挥想象力和思考能力，适合研究、写作或创意工作'
  };
  return advice[dayMaster] || '';
}

/**
 * 财运分析
 */
function analyzeWealth(bazi) {
  const dayMaster = bazi.dayMaster;
  const dayWuxing = GAN_WUXING[dayMaster];
  const woKe = getWoKeWuxing(dayWuxing); // 我克者为财
  const wuxing = bazi.wuxing;
  
  const caiCount = wuxing[woKe];
  
  // 财星旺衰
  let caiStatus = '';
  if (caiCount >= 3) caiStatus = '财星旺盛，财运较好';
  else if (caiCount === 2) caiStatus = '财星中和，财运平稳';
  else if (caiCount === 1) caiStatus = '财星偏弱，需努力求财';
  else caiStatus = '财星缺失，财运起伏较大';
  
  // 正财偏财
  const zhengCai = bazi.shiShen.year === '正财' || bazi.shiShen.month === '正财';
  const pianCai = bazi.shiShen.year === '偏财' || bazi.shiShen.month === '偏财';
  
  let caiType = '';
  if (zhengCai && pianCai) caiType = '正偏财俱现，收入来源多样';
  else if (zhengCai) caiType = '正财为主，适合稳定收入';
  else if (pianCai) caiType = '偏财为主，有意外之财机会';
  else caiType = '财星不显，需靠自身努力';
  
  // 破财年份提示（简化）
  const poCaiYears = [2026, 2029, 2032]; // 简化示例
  
  return {
    status: caiStatus,
    type: caiType,
    advice: generateWealthAdvice(bazi),
    poCaiYears: poCaiYears
  };
}

function generateWealthAdvice(bazi) {
  if (bazi.shenQiang === '身旺') {
    return '身旺能担财，可积极求财，适合投资或创业';
  } else if (bazi.shenQiang === '身弱') {
    return '身弱不胜财，宜稳守为主，避免高风险投资';
  } else {
    return '财运平稳，合理理财，量入为出';
  }
}

/**
 * 婚姻感情分析
 */
function analyzeMarriage(bazi) {
  const gender = bazi.gender;
  const dayMaster = bazi.dayMaster;
  const dayWuxing = GAN_WUXING[dayMaster];
  
  // 配偶星
  const spouseStar = gender === '男' ? getWoKeWuxing(dayWuxing) : getKeWoWuxing(dayWuxing);
  
  // 婚姻宫（日支）
  const marriagePalace = bazi.day.branch;
  
  // 配偶特征
  const spouseTraits = {
    '子': '聪明机智，善于交际',
    '丑': '踏实稳重，顾家爱家',
    '寅': '积极进取，有领导欲',
    '卯': '温柔体贴，善解人意',
    '辰': '包容大度，有责任感',
    '巳': '热情开朗，善于表达',
    '午': '直爽坦诚，活力充沛',
    '未': '温和善良，懂得照顾',
    '申': '聪明灵活，适应力强',
    '酉': '精致优雅，追求品质',
    '戌': '忠诚可靠，重视承诺',
    '亥': '温柔智慧，富有同情心'
  };
  
  // 感情波动年份（简化）
  const emotionYears = [2026, 2028, 2030];
  
  return {
    spouseStar: spouseStar,
    spouseTrait: spouseTraits[marriagePalace] || '性格温和',
    palace: marriagePalace,
    emotionYears: emotionYears,
    advice: generateMarriageAdvice(bazi)
  };
}

function generateMarriageAdvice(bazi) {
  if (bazi.shenQiang === '身旺') {
    return '身旺者个性较强，婚姻中需学会包容和妥协';
  } else if (bazi.shenQiang === '身弱') {
    return '身弱者较为敏感，需增强自信，多沟通理解';
  } else {
    return '性格中和，婚姻关系较为和谐，保持沟通即可';
  }
}

/**
 * 健康提示分析
 */
function analyzeHealth(bazi) {
  const wuxing = bazi.wuxing;
  
  // 五行对应脏腑
  const organs = {
    '木': '肝胆、筋骨、眼睛',
    '火': '心脏、血液、小肠',
    '土': '脾胃、消化系统',
    '金': '肺部、呼吸道、皮肤',
    '水': '肾脏、泌尿系统、耳朵'
  };
  
  // 易患疾病（基于缺失和过旺）
  const weakOrgans = [];
  Object.entries(wuxing).forEach(([wx, count]) => {
    if (count === 0) {
      weakOrgans.push(`${wx}对应的${organs[wx]}较弱，需注意保养`);
    } else if (count >= 3) {
      weakOrgans.push(`${wx}过旺，${organs[wx]}易出问题，需调节`);
    }
  });
  
  // 养生建议
  const healthAdvice = {
    '木': '保持心情舒畅，避免生气，多做伸展运动',
    '火': '注意心血管健康，避免过度兴奋，保持心态平和',
    '土': '注意饮食规律，避免暴饮暴食，适当运动',
    '金': '注意呼吸道保养，避免受凉，保持空气流通',
    '水': '注意肾脏保养，避免过度劳累，保证充足睡眠'
  };
  
  return {
    organs: organs,
    weakPoints: weakOrgans,
    advice: healthAdvice
  };
}

/**
 * 运势分析
 */
function analyzeFortune(bazi, currentYear = 2026) {
  const daYun = bazi.daYun[0]; // 当前大运（简化取第一个）
  
  // 流年分析
  const liuNian = {
    year: currentYear,
    ganZhi: getYearGanZhi(currentYear),
    summary: getLiuNianSummary(currentYear, bazi)
  };
  
  // 各月运势（简化）
  const monthFortune = [];
  for (let m = 1; m <= 12; m++) {
    monthFortune.push({
      month: m,
      fortune: getMonthFortune(m, bazi)
    });
  }
  
  return {
    daYun: daYun,
    liuNian: liuNian,
    monthFortune: monthFortune
  };
}

function getYearGanZhi(year) {
  const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  return TIAN_GAN[ganIndex < 0 ? ganIndex + 10 : ganIndex] + DI_ZHI[zhiIndex < 0 ? zhiIndex + 12 : zhiIndex];
}

function getLiuNianSummary(year, bazi) {
  const summaries = {
    2026: '丙午年，火旺之年，事业有机会突破，但需注意健康和情绪管理',
    2027: '丁未年，火土相生，运势平稳，适合巩固基础',
    2028: '戊申年，土金相生，财运较好，有意外收获'
  };
  return summaries[year] || '流年运势平稳，保持努力即可';
}

function getMonthFortune(month, bazi) {
  const fortunes = [
    '运势平稳，适合规划',
    '有贵人相助，把握机会',
    '注意健康，避免劳累',
    '财运较好，可考虑投资',
    '事业有进展，努力工作',
    '感情运佳，多社交',
    '注意口舌，谨言慎行',
    '运势上升，积极进取',
    '收获季节，努力有回报',
    '注意财务，理性消费',
    '反思总结，调整方向',
    '蓄势待发，准备新年'
  ];
  return fortunes[month - 1] || '运势平稳';
}

/**
 * 幸运元素
 */
function getLuckyElements(bazi) {
  const { xiyong } = getXiyongshen(bazi);
  
  const colors = {
    '木': '青色、绿色',
    '火': '红色、紫色',
    '土': '黄色、棕色',
    '金': '白色、金色',
    '水': '黑色、蓝色'
  };
  
  const numbers = {
    '木': '3、8',
    '火': '2、7',
    '土': '5、0',
    '金': '4、9',
    '水': '1、6'
  };
  
  const directions = {
    '木': '东方',
    '火': '南方',
    '土': '中央',
    '金': '西方',
    '水': '北方'
  };
  
  const times = {
    '木': '寅时、卯时 (3-7 点)',
    '火': '巳时、午时 (9-13 点)',
    '土': '辰时、未时、戌时、丑时',
    '金': '申时、酉时 (15-19 点)',
    '水': '亥时、子时 (21-1 点)'
  };
  
  return {
    colors: xiyong.map(wx => colors[wx]).join('、'),
    numbers: xiyong.map(wx => numbers[wx]).join('、'),
    directions: xiyong.map(wx => directions[wx]).join('、'),
    times: xiyong.map(wx => times[wx]).join('、')
  };
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    analyzeWuxing,
    analyzePersonality,
    analyzeCareer,
    analyzeWealth,
    analyzeMarriage,
    analyzeHealth,
    analyzeFortune,
    getLuckyElements,
    getXiyongshen
  };
}
