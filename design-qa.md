# Design QA

## 本轮范围

- 视口：重点复验 `1062 × 752` CSS px，并在 `1280 × 720` 宽屏状态检查完整项目页。
- 目标：收口 Cover、About、Timeline、MacBook 舞台及四个项目页的浏览器批注；保留既有纸张、票根、macOS 桌面和编辑感设计语言。
- 参考研究：[`docs/project-showcase-research.md`](docs/project-showcase-research.md)。版式判断同时参考 Codrops 案例研究、精选作品集案例和时间轴可视化研究，不复制具体页面。

## 同屏对照

- Cover 合并对照：[`docs/validation/annotation-cover-comparison.png`](docs/validation/annotation-cover-comparison.png)
- About 合并对照：[`docs/validation/annotation-about-comparison.png`](docs/validation/annotation-about-comparison.png)
- Timeline 当前实现：[`docs/validation/annotation-timeline-after.png`](docs/validation/annotation-timeline-after.png)
- 项目开窗转场：[`docs/validation/annotation-transition-after.png`](docs/validation/annotation-transition-after.png)
- Ganttodo 静态回退：[`docs/validation/annotation-ganttodo-fallback-after.png`](docs/validation/annotation-ganttodo-fallback-after.png)
- 缺陷项目能力地图：[`docs/validation/annotation-defect-map-after.png`](docs/validation/annotation-defect-map-after.png)
- 智谱右侧节点居中：[`docs/validation/annotation-zhipu-centered-after.png`](docs/validation/annotation-zhipu-centered-after.png)
- 智谱脱敏提示词结构：[`docs/validation/annotation-zhipu-prompt-after.png`](docs/validation/annotation-zhipu-prompt-after.png)

Cover 与 About 的左右两侧使用相同 `648 × 752` 视口和对应状态；已在同一张合并图中检查对齐、文本密度、焦点线框和断行。

## 验收结果

### Cover 与 About

- 票根虚线框与可拖动存根同宽同角度；箭头和手写说明分离，不再与票根或文字重叠。
- Enter 可以从 Cover 进入作品集。
- About 标题不再出现偶发焦点线框；正文缩成两段，新增 `DEFINE / DIVIDE / PROTOTYPE` 编辑式方法条，能力栈以细色线建立层级。
- 联系方式、教育背景和已确认能力保持可读，未用空洞 slogan 替代事实。

### Timeline

- 时间轴改为偏左的纵向手绘路径，教育经历位于左侧，项目、比赛与实习位于右侧。
- `2020 / 2024 / 2025 / 2026` 年份节点共享同一条路径；彩色圆点与曲线代替刚性表格线。
- 时间与内容按同一年度行对齐，右栏获得更多宽度；移动端在 `760px` 以下切为单栏且保留年份节点。

### MacBook 舞台与导航

- 下滑进入 Work 时开盖；从 Work 上滑离开后 `.is-open` 被移除，再返回 Work 时恢复，合盖与开盖状态均已实测。
- 文件夹打开从点击原点揭示，随后项目内容扩展到阅读舞台；打开、关闭和项目切换均保留过渡。
- 项目页层级高于设备外框，转场中不再出现内容穿过边框的穿模。
- 屏幕内滚轮滚动项目内容；屏幕外滚轮滚动整页。Ganttodo iframe 默认不截获滚轮，点击“进入交互”后才接收指针。
- 红黄绿按钮使用 `18px` 中心间距和 `10px` 圆点；标题位于左侧安全区，不与刘海重叠。
- 桌面右下角说明已删除；概览卡片项目标题大于描述文字。

### 四个项目

- 阿里云：两条工作主线、确认状态和公开边界保持不变；页面可在屏幕区域内完整滚动。
- 智谱：仅保留事实带、核心工作流和职责边界。点击任一节点会将其移动到说明面板之外的可视中心；实测 `N5-3` 节点中心与可视区域中心差值为 `0px`。`N1 / N5 / N5-1 / N5-3` 展示来自本地资料的脱敏 Prompt Blueprint，不包含客户材料或完整内部提示词。
- 智能缺陷：视频仍为核心证据；分类、分割、语义和检索改为并行能力矩阵，不再模拟时间顺序或视频跳转；结论文案改为“四个模型，并行产出辅助证据。”；证书保留在页尾。
- Smart Ganttodo：默认尝试加载在线体验，失败退化到静态预览；iframe 使用 `1280 × 720` 逻辑画布并按 16:9 容器等比缩放。静态图来自真实页面并包含三条日程；重复链路说明已替换为四步进度组件。

### 构建、响应式与可访问性

- `npm run build` 通过，Vite 完成 51 个模块构建。
- `git diff --check` 通过。
- `1062 × 752` 与 `1280 × 720` 实测未发现横向溢出、遮挡节点、标题与设备框重叠或屏内滚动失效。
- Cover Enter、项目按钮、窗口关闭、工作流节点、体验切换与外链均保留原生键盘语义和可见焦点。
- `prefers-reduced-motion` 下保留已有降级规则。

## 视觉判断

- Cover 对照中，虚线轮廓从“包住票根并压到说明”修正为贴合存根的独立交互边界。
- About 对照中，正文缩短、信息被方法条和能力色线分层，仍保留可验证内容。
- Timeline 不再像表格；年份、左右经历和手绘路径形成一条连续叙事。
- 四个项目分别以工作流、视频与能力矩阵、真实网页、数据库产品地图作为首要证据，没有复用同一套 case-study 版式。
- 未发现新的 P0、P1 或 P2 视觉与交互问题。

final result: passed
