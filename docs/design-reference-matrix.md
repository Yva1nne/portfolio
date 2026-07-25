# Portfolio redesign reference matrix

调研日期：2026-07-26

本矩阵只提取可转化为页面约束的做法。截图为调研当天的首页或关键状态记录，不代表要复刻对应视觉。

| 案例 | 地区 / 类型 | 截图 | 可借鉴（最多 3 条） | 不照搬 | 对应本项目 |
|---|---|---|---|---|---|
| [Ant Design Motion](https://ant.design/docs/spec/motion-cn/) | 中国 / 动效规范 | [自然、高效、克制原则页](./baseline/reference-01-ant-motion.png) | 1. 动效承担反馈、焦点或层级说明。<br>2. 离场短于入场，不做冗长队列。<br>3. 把流畅度和性能一起视为设计约束。 | 不复制组件库里的涟漪、弹簧等通用装饰；作品集的物理隐喻需要自己的运动逻辑。 | 票根是唯一长编排；导航、窗口和播放器只做短反馈；reduced-motion 直接切换。 |
| [TDesign](https://static.tdesign.tencent.com/) | 中国 / 企业设计体系 | [首页与多端入口](./baseline/reference-02-tdesign.png) | 1. 多端共享同一信息层级和术语。<br>2. 用标题、分隔线、字号和 token 建秩序。<br>3. 不让一种卡片模式包办所有内容。 | 不套企业后台组件；它会让个人作品集模板化、密度过高。 | About、项目元信息和桌面/移动断点沿用同一规格，只借层级与 token 思路。 |
| [阿里云 DMS Data Copilot](https://www.alibabacloud.com/help/zh/dms/data-copilot-new-version) | 中国 / 企业 AI 产品文档 | [定位、限制与流程](./baseline/reference-03-dms-copilot.png) | 1. 先讲产品定位与用户，再讲限制、入口和能力。<br>2. 用用户动作命名能力。<br>3. 对 AI 不确定性保留人工选择、审核和反馈。 | 公开产品说明不能写成个人成果，也不能据此推断内部架构或指标。 | 阿里云项目按问题、角色、方案、边界、证据组织；公开概念与个人经历明确分开。 |
| [范天欣 UX/UI 作品集](https://lilithworks.com/) | 中国 / 个人作品集 | [身份与重点作品入口](./baseline/reference-04-lilithworks.png) | 1. 首屏直接给身份、方向和行动入口。<br>2. 核心能力、项目证据和设计思考形成证据链。<br>3. 每项能力说明解决什么问题，而非只列工具。 | 入口和工具过多会稀释重点；私人联系方式展示方式不照搬。 | About 四组能力各配一条证据；四个项目同级；详情强调判断与方法。 |
| [Linear](https://linear.app/homepage) | 海外 / 企业产品站、长滚动叙事 | [单一价值主张与产品实景](./baseline/reference-05-linear.png) | 1. 首屏只有一个价值主张和一个主视觉。<br>2. 用编号章节沿任务链推进长页。<br>3. 大标题、细线、编号和真实产品界面共同建立可信度。 | 不复制黑色渐变、发光和高密度演示动效，也不接管滚动。 | About → Timeline → Work 连续叙事；项目详情一屏一个主命题，使用原生滚动。 |
| [Rauno Freiberg](https://rauno.me/) | 海外 / 交互设计师作品集 | [极简身份场景](./baseline/reference-06-rauno.png) | 1. 少量入口即可建立明确身份。<br>2. 反馈紧贴动作，不另造提示层。<br>3. 高频鼠标和键盘操作应接近即时。 | 隐蔽点击区、过小文字和只靠微动画表达状态会损害可发现性。 | 自定义鼠标、红点关闭、工作流拖拽、导航和播放器都有明确文本或焦点状态。 |
| [AG-UI 官方文档](https://docs.ag-ui.com/introduction) | 海外 / 技术协议文档 | [协议总览](./baseline/reference-08-ag-ui.png) | 1. 架构图表现前端与 Agent 的双向连接。<br>2. 将运行、消息、工具、状态和结束事件分组。<br>3. 先给总览，再按需展开细节。 | 不把全部事件平铺在 MacBook 小屏，也不把公开协议冒充为内部线上架构。 | 阿里云主线 B 使用“运维平台 ⇄ AG-UI ⇄ Hermes”总图和脱敏事件时间线。 |
| [Bruno Simon](https://bruno-simon.com/) | 海外 / 交互式作品集 | [进入提示与显式音频控制](./baseline/reference-09-bruno-simon.png) | 1. 让空间或物理隐喻成为记忆点。<br>2. 进入前给清晰操作提示和退出路径。<br>3. 音频由用户显式控制。 | 不引入重型 3D 世界；它会增加加载、学习、晕动和无障碍成本。 | 只保留票根与 MacBook 两个识别点；补齐 Enter、关闭说明、音频控制和降级体验。 |

## 转化后的设计约束

1. 一个视口只安排一个主要视觉动作。
2. 四个项目入口同规格、同权重，差异只在详情内部展开。
3. 优先用排版、编号、缩进和细线分组，普通正文不默认装进圆角卡片。
4. Hover 只补充“可做什么”，同时必须提供 focus、点击或触控路径。
5. 长叙事靠章节顺序和锚点完成，保持原生滚动，不做 scroll-jacking。
6. 高频操作近即时；离场短于入场；票根是少数允许较长编排的例外。
7. 物理质感只集中在票根、纸张、文件夹和 MacBook，常规 UI 保持平面克制。
8. AI 内容同时呈现能力、边界与证据来源，明确区分公开概念、个人事实和待确认项。

## 基线记录

- [桌面 Cover（1440 × 900）](./baseline/baseline-desktop-cover.png)
- [桌面过渡后页面（1440 × 900）](./baseline/baseline-desktop-portfolio.png)
- [移动 Cover（390 × 844）](./baseline/baseline-mobile-cover.png)
- [移动 Enter 后状态（390 × 844）](./baseline/baseline-mobile-portfolio.png)

移动端基线在 Enter 后只显示落在左上的票面，About 内容不可读；该问题列入页面骨架 checkpoint 的回归验收。
