# AI 八字算命网页

一个基于 HTML/CSS/JavaScript 的八字排盘系统，用户输入出生信息后自动生成命理报告。

## 📁 项目结构

```
ai-fortune-telling/
├── index.html        # 主页面（输入表单 + 结果展示）
├── bazi.js          # 八字排盘核心逻辑
├── duanyu.js        # 28 条断语口诀模板库
├── style.css        # 页面样式
└── README.md        # 部署说明
```

## ✨ 功能特性

### 1. 输入表单
- ✅ 姓名（可选）
- ✅ 性别（必填）
- ✅ 出生日期（年月日）
- ✅ 出生时辰（12 时辰选择）
- ✅ 出生地点（可选）

### 2. 排盘输出
- ✅ 四柱八字（年柱/月柱/日柱/时柱）
- ✅ 十神标注
- ✅ 大运排盘（8 步大运）
- ✅ 五行统计（木火土金水）
- ✅ 身强身弱判断

### 3. 断语报告（核心）
基于 28 条传统断语口诀自动生成：
- 📌 基础断语（5 条）
- 💕 婚姻断语（5 条）
- 👶 子女断语（5 条）
- 💼 十神断语（8 条）
- 🌟 特殊断语（5 条）

### 4. 综合建议
- 五行缺失分析
- 身强身弱建议
- 日主性格分析
- 行业方向推荐

## 🚀 部署方法

### 方法一：Vercel 部署（推荐）

1. **准备代码**
   ```bash
   cd ai-fortune-telling
   ```

2. **安装 Vercel CLI**（如未安装）
   ```bash
   npm install -g vercel
   ```

3. **登录 Vercel**
   ```bash
   vercel login
   ```

4. **部署**
   ```bash
   vercel --prod
   ```

5. **获取链接**
   部署完成后会返回一个 URL，如：`https://ai-fortune-telling.vercel.app`

### 方法二：Netlify 部署

1. **拖拽部署**（最简单）
   - 访问 https://app.netlify.com/drop
   - 将整个 `ai-fortune-telling` 文件夹拖到页面
   - 部署完成后获取链接

2. **CLI 部署**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=.
   ```

### 方法三：GitHub Pages

1. **创建 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-fortune-telling.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings → Pages
   - Source 选择 `main` 分支
   - 保存后获取链接

### 方法四：本地测试

直接用浏览器打开 `index.html` 即可：
```bash
open index.html
```

## 📝 使用说明

1. 访问部署后的网页链接
2. 填写出生信息（性别、日期、时辰为必填）
3. 点击"🔮 开始排盘"按钮
4. 查看生成的八字排盘和命理报告

## 🎨 技术特点

- **纯前端实现**：无需后端服务器
- **响应式设计**：支持手机/平板/电脑
- **现代 UI**：渐变色、卡片式布局
- **快速加载**：文件小，加载快

## ⚠️ 免责声明

本系统仅供娱乐和文化学习使用，八字命理是传统文化的一部分，请理性看待，不要迷信。

## 📄 断语来源

28 条断语口诀整理自传统命理学经典，包括：
- 年时天克地冲断语
- 婚姻宫位断语
- 子女星断语
- 十神断语
- 特殊命格断语

详细断语内容请查看 `duanyu.js` 文件。

## 🔄 后续优化方向

- [ ] 精确节气计算（目前按月简化）
- [ ] 精确日柱计算（需万年历数据）
- [ ] 增加流年运势
- [ ] 增加姓名评分
- [ ] 导出 PDF 报告
- [ ] 分享功能

## 📞 技术支持

如有问题或建议，欢迎反馈。

---

**搞钱，我们是认真的。💰**
