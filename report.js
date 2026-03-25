// report.js - 详细报告生成模块

/**
 * 生成完整命理报告
 */
function generateFullReport(bazi, userInfo) {
  const report = {
    basicInfo: generateBasicInfo(bazi, userInfo),
    wuxingAnalysis: generateWuxingReport(bazi),
    personality: generatePersonalityReport(bazi),
    career: generateCareerReport(bazi),
    wealth: generateWealthReport(bazi),
    marriage: generateMarriageReport(bazi),
    health: generateHealthReport(bazi),
    fortune: generateFortuneReport(bazi),
    luckyElements: generateLuckyReport(bazi)
  };
  
  return report;
}

/**
 * 基本信息报告
 */
function generateBasicInfo(bazi, userInfo) {
  return {
    name: userInfo.name || '未提供',
    gender: userInfo.gender,
    solarBirth: `${userInfo.year}年${userInfo.month}月${userInfo.day}日`,
    birthHour: getHourName(userInfo.hour),
    birthPlace: userInfo.place || '未提供',
    bazi: `${bazi.year.stem}${bazi.year.branch} ${bazi.month.stem}${bazi.month.branch} ${bazi.day.stem}${bazi.day.branch} ${bazi.hour.stem}${bazi.hour.branch}`,
    dayMaster: bazi.dayMaster,
    shenQiang: bazi.shenQiang
  };
}

function getHourName(hour) {
  const hours = {
    23: '子时', 1: '丑时', 3: '寅时', 5: '卯时',
    7: '辰时', 9: '巳时', 11: '午时', 13: '未时',
    15: '申时', 17: '酉时', 19: '戌时', 21: '亥时'
  };
  return hours[hour] || '未知';
}

/**
 * 五行分析报告
 */
function generateWuxingReport(bazi) {
  // 这里会调用 wuxing.js 的 analyzeWuxing
  // 由于在浏览器环境，需要确保 wuxing.js 已加载
  if (typeof analyzeWuxing !== 'undefined') {
    return analyzeWuxing(bazi);
  }
  
  // 备用简单实现
  const wuxing = bazi.wuxing;
  const totalCount = 8;
  
  const stats = Object.entries(wuxing).map(([name, count]) => ({
    name,
    count,
    percentage: ((count / totalCount) * 100).toFixed(1)
  }));
  
  const missing = Object.entries(wuxing)
    .filter(([_, count]) => count === 0)
    .map(([name, _]) => name);
  
  return {
    stats,
    missing,
    summary: missing.length > 0 
      ? `五行缺${missing.join('、')}，建议在生活中适当补充。`
      : '五行齐全，较为平衡。'
  };
}

/**
 * 性格分析报告
 */
function generatePersonalityReport(bazi) {
  if (typeof analyzePersonality !== 'undefined') {
    return analyzePersonality(bazi);
  }
  
  const dayMasterPersonalities = {
    '甲': { name: '甲木', trait: '参天大树', desc: '正直仁慈，有上进心，坚强不屈' },
    '乙': { name: '乙木', trait: '花草藤蔓', desc: '温柔灵活，善于适应，有艺术气质' },
    '丙': { name: '丙火', trait: '太阳之火', desc: '热情开朗，光明磊落，富有感染力' },
    '丁': { name: '丁火', trait: '灯烛之火', desc: '温和细腻，心思缜密，有礼貌' },
    '戊': { name: '戊土', trait: '高山之土', desc: '稳重诚信，宽厚包容，有担当' },
    '己': { name: '己土', trait: '田园之土', desc: '温和谦逊，善于协调，有耐心' },
    '庚': { name: '庚金', trait: '刀剑之金', desc: '刚毅果断，讲义气，有决断力' },
    '辛': { name: '辛金', trait: '珠宝之金', desc: '精致优雅，重面子，有品味' },
    '壬': { name: '壬水', trait: '江河之水', desc: '聪明灵活，善于变通，有智慧' },
    '癸': { name: '癸水', trait: '雨露之水', desc: '温柔智慧，内敛含蓄，有灵性' }
  };
  
  const dmInfo = dayMasterPersonalities[bazi.dayMaster];
  
  return {
    dayMaster: dmInfo,
    shenQiang: bazi.shenQiang === '身旺' 
      ? '自信果断，行动力强' 
      : bazi.shenQiang === '身弱'
      ? '心思细腻，善于思考'
      : '性格平衡，适应力强'
  };
}

/**
 * 事业建议报告
 */
function generateCareerReport(bazi) {
  if (typeof analyzeCareer !== 'undefined') {
    return analyzeCareer(bazi);
  }
  
  const careerAdvice = {
    '甲': '适合教育、文化、管理等领导型工作',
    '乙': '适合艺术、设计、策划等创意型工作',
    '丙': '适合销售、演艺、公关等外向型工作',
    '丁': '适合研究、技术、分析等专业型工作',
    '戊': '适合房地产、金融、管理等稳定型工作',
    '己': '适合人力、服务、咨询等协调型工作',
    '庚': '适合法律、军警、执行等刚毅型工作',
    '辛': '适合金融、艺术、高端服务等精致型工作',
    '壬': '适合贸易、物流、策划等灵活型工作',
    '癸': '适合研究、写作、创意等思考型工作'
  };
  
  return {
    advice: careerAdvice[bazi.dayMaster] || '根据自身特长选择行业',
    direction: '根据喜用神选择发展方向',
    suggestion: bazi.shenQiang === '身旺' 
      ? '适合创业或担任管理职务' 
      : '适合稳定发展，积累经验和资源'
  };
}

/**
 * 财运分析报告
 */
function generateWealthReport(bazi) {
  if (typeof analyzeWealth !== 'undefined') {
    return analyzeWealth(bazi);
  }
  
  return {
    status: '财运分析需要完整五行数据',
    type: '正偏财情况',
    advice: bazi.shenQiang === '身旺'
      ? '身旺能担财，可积极求财'
      : '身弱不胜财，宜稳守为主',
    poCaiYears: [2026, 2029, 2032]
  };
}

/**
 * 婚姻感情报告
 */
function generateMarriageReport(bazi) {
  if (typeof analyzeMarriage !== 'undefined') {
    return analyzeMarriage(bazi);
  }
  
  const spouseTraits = {
    '子': '聪明机智', '丑': '踏实稳重', '寅': '积极进取',
    '卯': '温柔体贴', '辰': '包容大度', '巳': '热情开朗',
    '午': '直爽坦诚', '未': '温和善良', '申': '聪明灵活',
    '酉': '精致优雅', '戌': '忠诚可靠', '亥': '温柔智慧'
  };
  
  return {
    spouseTrait: spouseTraits[bazi.day.branch] || '性格温和',
    palace: bazi.day.branch,
    advice: '婚姻需要双方共同经营，多沟通理解'
  };
}

/**
 * 健康提示报告
 */
function generateHealthReport(bazi) {
  if (typeof analyzeHealth !== 'undefined') {
    return analyzeHealth(bazi);
  }
  
  const organs = {
    '木': '肝胆', '火': '心脏', '土': '脾胃',
    '金': '肺部', '水': '肾脏'
  };
  
  return {
    organs: organs,
    advice: '保持规律作息，适当运动，注意饮食均衡'
  };
}

/**
 * 运势分析报告
 */
function generateFortuneReport(bazi) {
  if (typeof analyzeFortune !== 'undefined') {
    return analyzeFortune(bazi, 2026);
  }
  
  return {
    daYun: bazi.daYun[0] || { stem: '甲', branch: '子', age: 10 },
    liuNian: {
      year: 2026,
      summary: '2026 丙午年，火旺之年，事业有机会突破'
    },
    monthFortune: Array(12).fill(null).map((_, i) => ({
      month: i + 1,
      fortune: '运势平稳'
    }))
  };
}

/**
 * 幸运元素报告
 */
function generateLuckyReport(bazi) {
  if (typeof getLuckyElements !== 'undefined') {
    return getLuckyElements(bazi);
  }
  
  return {
    colors: '根据喜用神确定',
    numbers: '根据喜用神确定',
    directions: '根据喜用神确定',
    times: '根据喜用神确定'
  };
}

/**
 * 生成 HTML 格式报告
 */
function generateReportHTML(report) {
  let html = `
    <div class="report-container">
      <h2>📜 详细命理报告</h2>
      
      <!-- 基本信息 -->
      <section class="report-section">
        <h3>👤 基本信息</h3>
        <div class="report-content">
          <p><strong>姓名：</strong>${report.basicInfo.name}</p>
          <p><strong>性别：</strong>${report.basicInfo.gender}</p>
          <p><strong>八字：</strong>${report.basicInfo.bazi}</p>
          <p><strong>日主：</strong>${report.basicInfo.dayMaster}</p>
          <p><strong>身强身弱：</strong>${report.basicInfo.shenQiang}</p>
        </div>
      </section>
      
      <!-- 五行分析 -->
      <section class="report-section">
        <h3>☯️ 五行分析</h3>
        <div class="report-content">
          <div class="wuxing-bars">
            ${report.wuxingAnalysis.stats.map(s => `
              <div class="wuxing-bar ${s.name}">
                <span class="wuxing-name">${s.name}</span>
                <div class="wuxing-progress">
                  <div class="wuxing-fill" style="width: ${s.percentage}%"></div>
                </div>
                <span class="wuxing-value">${s.count} (${s.percentage}%)</span>
              </div>
            `).join('')}
          </div>
          <p class="wuxing-summary">${report.wuxingAnalysis.summary}</p>
        </div>
      </section>
      
      <!-- 性格分析 -->
      <section class="report-section">
        <h3>🎭 性格分析</h3>
        <div class="report-content">
          <p><strong>日主特点：</strong>${report.personality.dayMaster.name} - ${report.personality.dayMaster.trait}</p>
          <p>${report.personality.dayMaster.desc}</p>
          <p><strong>身强身弱表现：</strong>${report.personality.shenQiang}</p>
        </div>
      </section>
      
      <!-- 事业建议 -->
      <section class="report-section">
        <h3>💼 事业建议</h3>
        <div class="report-content">
          <p>${report.career.advice}</p>
          <p><strong>发展方向：</strong>${report.career.direction}</p>
          <p><strong>建议：</strong>${report.career.suggestion}</p>
        </div>
      </section>
      
      <!-- 财运分析 -->
      <section class="report-section">
        <h3>💰 财运分析</h3>
        <div class="report-content">
          <p><strong>财运状况：</strong>${report.wealth.status}</p>
          <p><strong>财运类型：</strong>${report.wealth.type}</p>
          <p><strong>理财建议：</strong>${report.wealth.advice}</p>
          <p><strong>注意年份：</strong>${report.wealth.poCaiYears.join('、')}</p>
        </div>
      </section>
      
      <!-- 婚姻感情 -->
      <section class="report-section">
        <h3>💕 婚姻感情</h3>
        <div class="report-content">
          <p><strong>配偶特征：</strong>${report.marriage.spouseTrait}</p>
          <p><strong>婚姻宫：</strong>${report.marriage.palace}</p>
          <p><strong>建议：</strong>${report.marriage.advice}</p>
        </div>
      </section>
      
      <!-- 健康提示 -->
      <section class="report-section">
        <h3>🏥 健康提示</h3>
        <div class="report-content">
          <p><strong>注意部位：</strong>${Object.entries(report.health.organs).map(([k, v]) => `${k}:${v}`).join('、')}</p>
          <p><strong>养生建议：</strong>${report.health.advice}</p>
        </div>
      </section>
      
      <!-- 运势分析 -->
      <section class="report-section">
        <h3>📈 运势分析</h3>
        <div class="report-content">
          <p><strong>当前大运：</strong>${report.fortune.daYun.stem}${report.fortune.daYun.branch} (${report.fortune.daYun.age}岁起)</p>
          <p><strong>2026 流年：</strong>${report.fortune.liuNian.summary}</p>
        </div>
      </section>
      
      <!-- 幸运元素 -->
      <section class="report-section">
        <h3>🍀 幸运元素</h3>
        <div class="report-content">
          <p><strong>幸运颜色：</strong>${report.luckyElements.colors}</p>
          <p><strong>幸运数字：</strong>${report.luckyElements.numbers}</p>
          <p><strong>幸运方位：</strong>${report.luckyElements.directions}</p>
          <p><strong>幸运时间：</strong>${report.luckyElements.times}</p>
        </div>
      </section>
    </div>
  `;
  
  return html;
}

/**
 * 导出为文本
 */
function generateReportText(report) {
  let text = `
【AI 八字算命 - 详细命理报告】
生成时间：${new Date().toLocaleString('zh-CN')}

━━━━━━━━━━━━━━━━━━━━━━

【基本信息】
姓名：${report.basicInfo.name}
性别：${report.basicInfo.gender}
八字：${report.basicInfo.bazi}
日主：${report.basicInfo.dayMaster}
身强身弱：${report.basicInfo.shenQiang}

━━━━━━━━━━━━━━━━━━━━━━

【五行分析】
${report.wuxingAnalysis.stats.map(s => `${s.name}: ${s.count}个 (${s.percentage}%)`).join('\n')}

${report.wuxingAnalysis.summary}

━━━━━━━━━━━━━━━━━━━━━━

【性格分析】
日主：${report.personality.dayMaster.name} (${report.personality.dayMaster.trait})
${report.personality.dayMaster.desc}

身强身弱表现：${report.personality.shenQiang}

━━━━━━━━━━━━━━━━━━━━━━

【事业建议】
${report.career.advice}
发展方向：${report.career.direction}
建议：${report.career.suggestion}

━━━━━━━━━━━━━━━━━━━━━━

【财运分析】
财运状况：${report.wealth.status}
财运类型：${report.wealth.type}
理财建议：${report.wealth.advice}
注意年份：${report.wealth.poCaiYears.join('、')}

━━━━━━━━━━━━━━━━━━━━━━

【婚姻感情】
配偶特征：${report.marriage.spouseTrait}
婚姻宫：${report.marriage.palace}
建议：${report.marriage.advice}

━━━━━━━━━━━━━━━━━━━━━━

【健康提示】
${Object.entries(report.health.organs).map(([k, v]) => `${k}: ${v}`).join('\n')}
养生建议：${report.health.advice}

━━━━━━━━━━━━━━━━━━━━━━

【运势分析】
当前大运：${report.fortune.daYun.stem}${report.fortune.daYun.branch} (${report.fortune.daYun.age}岁起)
2026 流年：${report.fortune.liuNian.summary}

━━━━━━━━━━━━━━━━━━━━━━

【幸运元素】
幸运颜色：${report.luckyElements.colors}
幸运数字：${report.luckyElements.numbers}
幸运方位：${report.luckyElements.directions}
幸运时间：${report.luckyElements.times}

━━━━━━━━━━━━━━━━━━━━━━

* 本报告由 AI 生成，仅供参考娱乐 *
`;
  
  return text.trim();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    generateFullReport,
    generateReportHTML,
    generateReportText
  };
}
