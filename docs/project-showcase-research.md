# Project showcase research — 2026-07-28

目标：重做 Work 区域的四个项目展示。MacBook 继续承担“进入项目”的交互隐喻；项目打开后，展示空间需要优先服务真实网页、工作流和视频，文案退到辅助层。

## 查看的案例

### 国内

1. [杜翼 / AI 产品设计师](https://ianydu.com/)
   - Feature Story 先给大幅产品画面，再用一行标签说明能力类型。
   - 首页不把完整过程塞进项目卡；同屏只保留项目名、产品类型与入口。

2. [喻励强 / UI × AI Coding](https://qlqdesign.cn/)
   - 项目目录极简，编号、名称、类型形成稳定横向坐标。
   - 适合借鉴项目切换层级，不适合照搬其偏黑、偏视觉设计师的整体风格。

3. [YUCONG UI 展示](https://4zyc.cn/)
   - 真实 UI 预览使用接近桌面屏幕的横向画幅，说明卡位于侧边。
   - “先看界面，再读解释”的顺序适合 Smart Ganttodo。

4. [危箫 / 用户体验设计师](https://www.portfolio.skin/)
   - 项目卡只回答类型、场景、时间与一句话目标，避免同层级重复解释过程。

5. [范天欣 / UX/UI 设计作品集](https://lilithworks.com/)
   - 把产品界面作为核心视觉，文字只提供业务目标和设计判断。

6. [Asorn / 产品设计师](https://asorn.cn/)
   - 以真实可用工具和项目入口证明能力，项目缩略信息短且可扫读。

### 国外与产品官网

7. [Figma：Portfolio website examples](https://www.figma.com/resource-library/portfolio-website-examples/)
   - 推荐每个 case study 使用独立页面和明确故事线；复杂功能可用 split-screen 把界面与解释并排。

8. [Awwwards：Maël Ruffini page transition](https://www.awwwards.com/inspiration/page-transition-mael-ruffini-portfolio-2025)
   - 项目从原容器连续放大到新舞台，视觉对象在转场前后保持空间关系。
   - 采用“容器连续变形”，不采用 Three.js 或高成本镜头运动。

9. [Apple MacBook Air](https://www.apple.com/uk/macbook-air/)
   - 设备负责建立情境；进入具体能力后，内容转为大幅、低干扰的展示。
   - 不采用 Apple 式超长空白和营销口号密度。

10. [Vercel × Stripe customer story](https://vercel.com/customers/architecting-reliability-stripes-black-friday-site)
    - 首屏只保留一个结论、一句上下文和少量关键事实，证据形成独立信息带。

11. [n8n](https://n8n.io/)
    - 工作流画布本身就是主要产品证据，节点关系优先于长段系统解释。

12. [Linear × Tella](https://linear.app/integrations/tella)
    - 演示视频直接内嵌在工作上下文中，减少“先读说明再找视频”的切换成本。

13. [Product Design Portfolios — case studies](https://www.productdesignportfolios.com/portfolios/content/case-studies)
    - 优秀案例共同点是故事可扫读、主证据靠前、项目之间表达方式可以不同。

14. [GreatFrontEnd：Frontend portfolio](https://www.greatfrontend.com/blog/frontend-developer-portfolio)
    - 真实可操作界面、可访问性、错误与边界比大量截图和工具清单更能证明完成度。

## 采用的方案

### 1. 两阶段项目容器

- 阶段 A：MacBook 桌面保留原有开盖与文件夹动画。
- 阶段 B：选择文件夹后，先在屏幕内完成圆形揭示，再让屏幕连续扩展为 Work 区域的全宽项目舞台；机身边框同步淡出。
- 关闭项目时反向收回到对应文件夹。切换项目时保留左右滑动与淡入组合，不瞬切 DOM。
- `prefers-reduced-motion` 下只做短淡入和尺寸切换。

### 2. 信息层级

- 项目舞台第一屏只保留：时间/类型、一个结论、一个核心证据。
- 右侧长 inspector 改成舞台下方的紧凑项目条：四项目切换、角色、边界或关键事实。
- 重复出现的“问题 / 我的职责 / 方案 / 结果 / 边界”不再全部堆在每个首屏；需要保留的事实进入各项目自己的证据模块。

### 3. 四个项目分别表达

- **阿里云**：双主线产品地图。先看到数据库 AI 助手与内部运维助手的关系，再进入步骤和脱敏边界。
- **智谱**：工作流画布全宽优先。`4 家单位 / 5 个大屏 / 14 个页面`作为紧凑事实带，问题和职责移到画布之后。
- **智能缺陷**：16:9 演示视频成为首屏主体，分类/分割/语义/检索作为视频章节；职责、验证与奖状后置。
- **Smart Ganttodo**：体验区固定为标准 16:9 桌面画幅。真实网页在一个 1280×720 逻辑画布中渲染，再按容器宽度等比缩放；自然语言到 actions 的链路作为下方短注释，不再与网页争夺首屏。

## 不采用

- 不做四个项目完全相同的 case-study 模板。
- 不让 MacBook 机身在项目阅读阶段长期占据约 25% 的宽高。
- 不使用高成本 3D 镜头、滚动劫持或无法降级的 WebGL 转场。
- 不用长段口号替代项目事实，也不把全部事实压进首屏。
- 不将外部网页直接拉伸到任意高宽比；嵌入失败仍保留 16:9 静态预览和新窗口入口。
