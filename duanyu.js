// 断语模板库 - 28 条八字断语口诀

const duanyuLibrary = {
  // 1. 基础断语（5 条）
  basic: [
    {
      id: 1,
      text: "年时天克又地冲，必定改门又离宗",
      explanation: "年柱和时柱形成天克地冲的组合，可能意味着过继他人或入赘他家。",
      condition: (bazi) => hasTianKeDiChong(bazi.year, bazi.hour)
    },
    {
      id: 2,
      text: "年月干支五行同，生于贫困家庭中",
      explanation: "年干和月干或年支和月支五行相同，可能出生在贫困寒微的家庭。",
      condition: (bazi) => hasSameWuxing(bazi.year, bazi.month)
    },
    {
      id: 3,
      text: "亡神劫杀在柱中，祖业破败婚姻凶",
      explanation: "亡神、劫煞共同出现在命局里，可能祖业破败，婚姻不顺。",
      condition: (bazi) => hasWangShenJieSha(bazi)
    },
    {
      id: 4,
      text: "年时二支若相生，奶孙关系必融通",
      explanation: "年支和时支相生，祖孙关系可能较为融洽。",
      condition: (bazi) => isXiangSheng(bazi.year.branch, bazi.hour.branch)
    },
    {
      id: 5,
      text: "时上驿马被刑冲，死于异乡外地中",
      explanation: "时柱的驿马被其他地支刑冲，可能有在异乡创业或客死他乡的倾向。",
      condition: (bazi) => hasYiMaXingChong(bazi)
    }
  ],
  
  // 2. 婚姻断语（5 条）
  marriage: [
    {
      id: 6,
      text: "男女测婚一样论，首先必要看提纲",
      explanation: "预测婚姻先看月令提纲。",
      condition: (bazi) => true // 总是显示作为提示
    },
    {
      id: 7,
      text: "月柱本是婚姻宫，日支坐偶是吉兆",
      explanation: "月柱为婚姻宫，日支为夫妻宫，代表配偶，是一种吉兆。",
      condition: (bazi) => isJiXiang(bazi.day.branch)
    },
    {
      id: 8,
      text: "刑冲穿绝婚不稳，情感不真月空亡",
      explanation: "财官遇刑冲害或处在绝地，婚姻不稳定，月令空亡则夫妻感情不真。",
      condition: (bazi) => hasXingChong(bazi.month, bazi.day) || isEmptyWang(bazi.month)
    },
    {
      id: 9,
      text: "月建杀伤常争吵，月令比劫闹得凶",
      explanation: "月令是七杀或伤官，夫妻常争吵；月令是比肩劫财，争吵更凶。",
      condition: (bazi) => isQiSha(bazi.month) || isShangGuan(bazi.month) || isBiJie(bazi.month)
    },
    {
      id: 10,
      text: "日带偏财：财运不周，夫妻难以到白头",
      explanation: "日柱带偏财，夫妻关系易出问题。",
      condition: (bazi) => isPianCai(bazi.day)
    }
  ],
  
  // 3. 子女断语（5 条）
  children: [
    {
      id: 11,
      text: "子女星长生、沐浴、临官、帝王注定子女多",
      explanation: "子女星（如正官、七杀等）处于长生、沐浴、临官、帝旺等状态，可能子女较多。",
      condition: (bazi) => hasChildrenStarInWangDi(bazi)
    },
    {
      id: 12,
      text: "时上七杀有制，晚年生贵子",
      explanation: "时柱的七杀有制化，晚年可能生贵子。",
      condition: (bazi) => hasZhiHuaQiSha(bazi.hour)
    },
    {
      id: 13,
      text: "时柱官星坐旺地，子孙成群",
      explanation: "时柱的官星坐于旺地，可能子孙众多。",
      condition: (bazi) => isGuanXingInWangDi(bazi.hour)
    },
    {
      id: 14,
      text: "正官多见多生女，少生男",
      explanation: "正官多，可能多生女；七杀偏官多，可能多生男。",
      condition: (bazi) => countZhengGuan(bazi) >= 2
    },
    {
      id: 15,
      text: "满盘七杀无制无子",
      explanation: "命局中七杀多且无制化，可能难有子女。",
      condition: (bazi) => hasManyQiShaNoZhi(bazi)
    }
  ],
  
  // 4. 十神断语（8 条）
  shishen: [
    {
      id: 16,
      text: "年上正财：祖业强，家财大业借祖光",
      explanation: "年柱正财，祖业丰厚。",
      condition: (bazi) => isZhengCai(bazi.year)
    },
    {
      id: 17,
      text: "月上正财：不一般，日柱建旺有财源",
      explanation: "月柱正财，自身有财源。",
      condition: (bazi) => isZhengCai(bazi.month)
    },
    {
      id: 18,
      text: "日带正财：得妻财，美貌贤妻能带来",
      explanation: "日柱正财，得配偶助力。",
      condition: (bazi) => isZhengCai(bazi.day)
    },
    {
      id: 19,
      text: "时上正财：运气通，子女富贵财禄逢",
      explanation: "时柱正财，子女有财禄。",
      condition: (bazi) => isZhengCai(bazi.hour)
    },
    {
      id: 20,
      text: "天下没有穷戊子，世间没有苦庚申",
      explanation: "戊子日出生的人不会挨穷，庚申日出生的人不是苦命人。",
      condition: (bazi) => bazi.day.stem === '戊' && bazi.day.branch === '子' || 
                           bazi.day.stem === '庚' && bazi.day.branch === '申'
    },
    {
      id: 21,
      text: "巳卯叠叠似风雷，八字中巳卯叠见之人多性急",
      explanation: "巳卯多次出现，性格急躁。",
      condition: (bazi) => countBranch(bazi, '巳') + countBranch(bazi, '卯') >= 2
    },
    {
      id: 22,
      text: "造化因逢戌亥，平生敬信神祗",
      explanation: "日支为戌或亥，他支为亥或戌，主人好信神佛或神秘文化。",
      condition: (bazi) => (bazi.day.branch === '戌' || bazi.day.branch === '亥') && 
                           hasBranch(bazi, bazi.day.branch === '戌' ? '亥' : '戌')
    },
    {
      id: 23,
      text: "戊土有印，体格魁梧",
      explanation: "土格人主厚重肥大，若有印身旺，当然是体格魁梧。",
      condition: (bazi) => bazi.dayMaster === '戊' && hasYin(bazi)
    }
  ],
  
  // 5. 特殊断语（5 条）
  special: [
    {
      id: 24,
      text: "八字纯阳，母年早丧；八字纯阴，父寿不长",
      explanation: "天干地支全为阳性，母亲可能早年离世；全为阴性，父亲寿命不长。",
      condition: (bazi) => isChunYang(bazi) || isChunYin(bazi)
    },
    {
      id: 25,
      text: "柱有庚甲寅申四字，背井离乡",
      explanation: "庚、甲、寅、申为四象之冲，一生会背井离乡，奔波于道路之间。",
      condition: (bazi) => hasAllFour(bazi, ['庚', '甲', '寅', '申'])
    },
    {
      id: 26,
      text: "身旺无财，有出家之心",
      explanation: "身旺而无财星，可能有出家或修行之心。",
      condition: (bazi) => bazi.shenQiang === '身旺' && !hasCai(bazi)
    },
    {
      id: 27,
      text: "华盖逢死，僧道无疑",
      explanation: "华盖星逢死地，适合出家为僧为道。",
      condition: (bazi) => hasHuaGaiFengSi(bazi)
    },
    {
      id: 28,
      text: "财禄官星俱无，适合出家为僧为道",
      explanation: "命局中财、禄、官星都没有，适合修行。",
      condition: (bazi) => !hasCai(bazi) && !hasGuan(bazi)
    }
  ]
};

// 辅助函数 - 需要在 bazi.js 中实现
function hasTianKeDiChong(year, hour) { return false; }
function hasSameWuxing(pillar1, pillar2) { return false; }
function hasWangShenJieSha(bazi) { return false; }
function isXiangSheng(branch1, branch2) { return false; }
function hasYiMaXingChong(bazi) { return false; }
function isJiXiang(branch) { return true; }
function hasXingChong(pillar1, pillar2) { return false; }
function isEmptyWang(pillar) { return false; }
function isQiSha(pillar) { return false; }
function isShangGuan(pillar) { return false; }
function isBiJie(pillar) { return false; }
function isPianCai(pillar) { return false; }
function hasChildrenStarInWangDi(bazi) { return false; }
function hasZhiHuaQiSha(pillar) { return false; }
function isGuanXingInWangDi(pillar) { return false; }
function countZhengGuan(bazi) { return 0; }
function hasManyQiShaNoZhi(bazi) { return false; }
function isZhengCai(pillar) { return false; }
function countBranch(bazi, branch) { return 0; }
function hasBranch(bazi, branch) { return false; }
function hasYin(bazi) { return false; }
function isChunYang(bazi) { return false; }
function isChunYin(bazi) { return false; }
function hasAllFour(bazi, targets) { return false; }
function hasCai(bazi) { return false; }
function hasHuaGaiFengSi(bazi) { return false; }
function hasGuan(bazi) { return false; }

// 生成断语报告
function generateDuanyuReport(bazi) {
  const report = {
    basic: [],
    marriage: [],
    children: [],
    shishen: [],
    special: []
  };
  
  // 检查每类断语
  Object.keys(duanyuLibrary).forEach(category => {
    duanyuLibrary[category].forEach(duanyu => {
      if (duanyu.condition(bazi)) {
        report[category].push(duanyu);
      }
    });
  });
  
  return report;
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { duanyuLibrary, generateDuanyuReport };
}
