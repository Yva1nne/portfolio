# Portfolio redesign handoff

更新时间：2026-07-28

仓库：`/Users/yvaine/Documents/current/resume/web-vue`

远端：`git@github.com:Yva1nne/portfolio.git`

分支：`main`

批注修订末次提交：`e7670de`。本文件作为后续文档 checkpoint 提交；交付前再次确认 `HEAD == origin/main`。

## 结论

`PORTFOLIO_REDESIGN_SPEC.md` 的一期范围已经完成：

- 页面顺序为 Cover / About / Timeline / Work，没有新增 Contact、Footer 或 Hobby 页面。
- Cover 保留票根拖动和 Enter 入口，并继续履行 `transition-complete` 事件契约。
- About 已填入完整定位、简介、四组能力证据、教育、所在地、邮箱和 GitHub。
- Timeline 按教育经历、项目/比赛/实习双栏呈现七段经历；跨工艺建模只在时间轴出现。
- MacBook 默认停留在桌面，四个项目入口同尺寸、同层级、无默认主项目，顺序为阿里云、智谱、智能缺陷、Smart Ganttodo。
- 固定导航、本地音乐、自定义鼠标、键盘焦点、触屏横滑和 reduced-motion 均有降级。
- Hobby 与二期小黑猫助手明确延期，未创建、挂载或验收。

2026-07-28 的批注明确要求在智能缺陷项目末尾嵌入获奖证书，因此当前页面、生产产物和公开仓库均包含该图片；公开范围详见“隐私与公开素材”。

## 恢复与验证

```bash
cd /Users/yvaine/Documents/current/resume/web-vue
npm install
npm run dev
```

生产构建与本地预览：

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

最终构建结果：

- Vite `8.0.16`，50 个模块。
- `npm run build` 退出码为 `0`，无构建 warning。
- `dist/` 为约 `16 MB`、35 个文件。
- 生产预览中票根、笔记本、MacBook、双格式音频、演示视频和 Ganttodo 静态图均返回 HTTP `200`。

## 已推送 checkpoints

| Commit | Checkpoint |
|---|---|
| `04fc9dc` | Spec 增加逐功能 Git 门禁与二期小黑猫规划 |
| `902de25` | 基线、参考案例矩阵与页面蓝图 |
| `c4676b8` | 集中式 portfolio 内容模型 |
| `a31500f` | Cover / Ticket 与 About |
| `b11f474` | 移动票根边界 |
| `b3f714d` | 七段长时间轴 |
| `bf5e4c1` | 四项目 MacBook 工作区 |
| `9cc8b8f` | 响应式章节导航 |
| `8477140` | 有来源记录的本地音乐 |
| `88f6c66` | 语义自定义鼠标 |
| `e0f0834` | reduced-motion 票根路径 |
| `2c306d2` | Hobby JPEG metadata 清理 |
| `58346be` | 当前 public tree 移除证书原件 |
| `c53d557` | 阿里云公开口径与实际进度对齐 |
| `b11d26b` | MP3 fallback 与移动播放器 |
| `464a2fe` | 键盘焦点和媒体生命周期 |
| `caae43e` | 移动项目可读性与 fallback |
| `c07b0d3` | 焦点对比度和正文可读性 |
| `81de128` | 延迟非关键资源、缩小生产包 |
| `5db81a2` | 遮挡、触屏画布、iframe 状态与最终交互缺口 |
| `7427623` | 关闭非确定性的 Rolldown 插件耗时提示，稳定生产诊断 |
| `0fd5548` | 移动播放器安全区、大屏触屏画布与在线体验预检 |
| `a583483` | 展开播放器控制时同步扩大内容安全区 |
| `76e16c3` | 在线体验预检可随时取消并恢复静态模式 |
| `417ed3b` | 记录一期最终验证与交付文档 |
| `e7670de` | 落实 2026-07-28 浏览器批注：文案、双栏时间轴、MacBook 动画与项目排版 |

四个项目最初在同一个页面 checkpoint 中提交，而不是拆成四个 commit；这是已经推送的历史粒度偏差，不为追求形式而改写历史。

## 最终浏览器验收

验收使用本地生产构建 `http://127.0.0.1:4173/` 和内置 Chromium。所有尺寸均检查 `documentElement.scrollWidth - innerWidth == 0`。

| 视口 | 结果 |
|---|---|
| `390 × 844` | Cover、About、移动菜单、Timeline、Work 与项目详情无横向溢出；紧凑播放器收为 `58 × 58` 的 `MUSIC` 边缘入口，正文滚动区与播放器为零重叠，展开完整控制后安全区同步增高；菜单按钮高 44px，自定义鼠标不挂载。 |
| `768 × 1024` | Timeline 保持七段内容，Work 为单列；正文滚动区为播放器保留独立底栏；智谱画布 `overflow-x:auto`、`touch-action:pan-x pan-y`，`1120px` 画布可原生横滑。 |
| `1024 × 768` | Work 单列，MacBook 和 inspector 均为 `992px` 可用宽度；播放器紧凑态和展开态都不覆盖正文，无横向溢出。 |
| `1280 × 800` | Work 双栏、四文件夹、四项目窗口、导航、inspector 与播放器共存；播放器会在顶部/底部之间自动选择不遮挡 MacBook 的停靠位。 |
| `1440 × 900` | Work 双栏无裁切；intro 宽度封顶 `1180px`，项目布局 `1392px`。 |
| `2200 × 1100` | 无横向溢出；Work intro 与 Timeline 封顶 `1180px`，Work 布局封顶 `1640px`，不会无限拉宽。 |

内置浏览器宿主最多只输出约 869px 高的截图，因此 `768 × 1024` 和 `1440 × 900` 的 DOM 视口验证是准确的，但对应 JPEG 的可见栅格分别为 `768 × 869` 和 `1440 × 869`；文件名明确标注了这一限制。

### 键盘与焦点

- Cover 的 Enter 可进入；完成后焦点迁移到 About `h2`，而不是留在隐藏票根。
- 移动菜单打开后焦点进入 CLOSE，Escape 或关闭后返回 MENU。
- MacBook 文件夹打开后焦点进入红色关闭按钮，关闭后回到原文件夹。
- 智谱节点聚焦会同步选中、展开说明并把远端节点带回可视区；画布也支持方向键和缩放键。
- Work 目录和智谱节点的 focus ring 使用内缩 outline，避免被滚动容器裁切。
- 智谱工作流 viewport 本身也使用 `outline-offset:-3px` 的内缩焦点环；键盘聚焦实测为可见的 `2px` 实线。
- 音量 range 可用方向键修改；播放器详细控制可展开/收起。

### 项目与媒体

- 阿里云：双主线公开解释完整，未写客户名、内部平台真名、未确认指标或已完成但尚未实施的结果。
- 智谱：11 个节点可拖动、平移、缩放、键盘聚焦；`≤1080px` 或任意 `any-pointer:coarse` 设备使用原生横滑，覆盖大屏平板和混合输入设备。
- 智能缺陷：视频 `preload="metadata"`，打开时不自动播放；关闭项目会 pause、移除 src 并 `load()` 清理。
- Ganttodo：默认静态预览且不创建 iframe；用户点击后先执行可中止的 `no-cors` 网络预检，检查期间仍保留静态图，预检失败或 12 秒超时会自动保持 fallback，成功后才挂载 iframe。跨域 iframe 没有可靠的失败事件（参见 [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe#error_and_load_event_behavior)），因此在线模式仍保留随时手动返回静态预览的入口。
- 音乐首次为 paused、`autoplay=false`；生产浏览器实际播放 OGG 后 `currentTime` 增长，再次点击可暂停。音量和静音可持久化，但播放状态不会跨刷新恢复。
- 音乐在 `≤1080px` 或粗指针设备使用预留底栏；`390px` 紧凑态与展开态实测正文重叠均为 `0px`，`1024px` 展开态同样为 `0px`。
- reduced-motion 下票根跳过长飞行，章节/窗口转为短淡入，事件流和电平停止，自定义鼠标不挂载。

### Console / Network

- 主应用生产构建无 warning，交互验收中未出现应用未处理错误。
- 浏览器连接器自身曾输出一次 Statsig 遥测超时；它来自 Codex Browser 插件，不属于本页面。
- Ganttodo 可达地址实测进入 online 且 iframe 数量为 `1`；另临时替换为不可达本地地址做负向验收，`900ms` 内状态自动变为“在线体验不可用”，iframe 数量保持 `0`、静态 fallback 保留。再用延迟 `10s` 的本地响应实测 loading 阶段取消，`250ms` 后恢复静态模式、iframe 仍为 `0`。所有测试地址随后恢复并重新构建。
- 用户主动加载 Smart Ganttodo 后，上游 iframe 仍可能输出 Tailwind CDN production warning；默认静态模式不会创建 iframe。该 warning 需在 Smart Ganttodo 仓库修复，不能由宿主页消除。

## 一期基线截图

以下截图记录批注修订前的一期验收基线；2026-07-28 的批注修订以仓库根目录 [design-qa.md](../design-qa.md) 和当前生产预览为准。

页面与断点：

- [移动 Cover](./validation/final-cover-390x844.jpg)
- [移动 About](./validation/final-about-390x844.jpg)
- [中间断点 Timeline](./validation/final-timeline-768x1024-host-768x869.jpg)
- [桌面 Work 总览](./validation/final-work-1280x800.jpg)
- [宽屏 Work](./validation/final-work-1440x900-host-1440x869.jpg)
- [移动 Work / 项目](./validation/final-work-project-mobile-390x844.jpg)

四个项目：

- [阿里云](./validation/final-project-aliyun-1280x800.jpg)
- [智谱](./validation/final-project-zhipu-1280x800.jpg)
- [智谱工作流画布](./validation/final-project-zhipu-canvas-1280x800.jpg)
- [智能缺陷](./validation/final-project-defect-1280x800.jpg)
- [Smart Ganttodo 静态 fallback](./validation/final-project-ganttodo-1280x800.jpg)

`docs/validation/` 中无 `final-` 前缀的图片是逐 checkpoint 证据，可用于查看在线 iframe、导航、播放器、时间轴中段和早期项目状态；最终判断以上述 `final-*` 文件为准。

## 性能与生产资产

- 两张票根 SVG 原先合计约 `4.5 MB`，包含重复的内嵌位图；现在使用 SVG 纸张噪声，合计 `348,758 bytes`，不再含 `data:image` 或第三方水印标识。
- 首屏不挂载 notebook、Timeline、Work、MacBook、视频或 iframe；进入后才挂载 notebook/Timeline，接近或点击 Work 后才加载项目 chunk。
- `dist/` 从约 `225 MB` 降至约 `16 MB`。
- Vite 构建不再原样复制全部 `public/`：一期产物排除 `.DS_Store`、Hobby 两个目录和两个 GLB；源素材仍保留在仓库。
- 仅关闭 Rolldown 的 `checks.pluginTimings` 耗时启发式提示；真实构建错误和其他 warning 仍开启。该提示取决于内部构建是否跨过时间阈值，连续两次最终构建均无 warning。
- MacBook、项目预览和非首屏图片使用 lazy/async；视频只预载 metadata；Ganttodo iframe 默认不存在。

## 音频来源与许可

完整记录见 [audio-license.md](./audio-license.md)。

- 曲名：`Ambient Music Test · Yamaha CK61`
- 作者：Wilfredor
- 来源：[Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Ambient_music_test,_Yamaha_CK61.flac)
- 许可：[CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
- OGG：Vorbis、44.1 kHz、stereo、`197.754s`
- OGG SHA-256：`5d626982c965647c91436584361fd8211cd83026fab08bec1a61d33bcf53df9e`
- MP3 fallback：MPEG Layer III、44.1 kHz、stereo、`197.754s`
- MP3 SHA-256：`5687e8a3013d44c59662fca3e7d3c14a91a13097bdfba9f96c7b3ffba0dc694c`
- 两种格式都在仓库内运行，不热链第三方音频。

## 隐私与公开素材

### 已按批注公开：获奖证书

2026-07-26 再次通过 GitHub API 确认仓库 `Yva1nne/portfolio` 为 public。2026-07-28 用户明确要求将奖状图片嵌入项目末尾，当前 `public/`、生产产物和 `origin/main` 均包含 PNG；旧提交 `34fe022` 同时保留 PDF/PNG blob：

```text
d7f9ed4bbbb5bf79c4f78dfc38abf6daeddb3b1a public/project/获奖证书.pdf
d2056b31c710745bfa4703f2ee196d949bf09545 public/project/获奖证书.png
```

文件含证书编号、验证二维码、本人及其他成员/导师姓名。当前公开状态来自用户的显式批注；若后续决定撤回，需要替换当前素材，并执行 `git filter-repo` 或 BFG、force-push，必要时联系证书方处理二维码/编号。本 Session 没有改写公共历史。

当前原件按原字节保存在：

`/Users/yvaine/Documents/current/resume/private-assets/portfolio-certificates/`

详细 checksum 见 [privacy-notes.md](./privacy-notes.md)。

### Hobby 照片

- 148 张 JPEG 的 EXIF/GPS/XMP/IPTC/comment metadata 已清零，检查结果为 `0` metadata segments。
- Hobby 不挂载，且不进入当前生产 `dist/`。
- 源照片仍在 public Git 仓库中，知道仓库或路径的人仍能看到图片内容。这是“素材保留原样”与隐私之间的知情选择，不等于私有存储。

## 外层事实文档

网站公开文案源是 `src/data/portfolio.js`。更完整的事实与面试口径已同步到仓库外一层：

- `../PROJECTS.md`
- `../INTERVIEW_QA.md`

两份文件最后整理时间为 `2026-07-26`，包含智谱 `2025.12 — 2026.05`、阿里云 `2026.06 — 至今` 和四项目边界。它们不属于 `web-vue` Git 仓库，当前作品集 push 不会备份它们。

## 明确延期

- HobbyPage：不创建、不挂载、不验收；GLB 和照片源资产保留。
- 二期小黑猫项目问答助手：只保留在 Spec 第 16 节规划，没有实现。
- Google Fonts 仍是首屏第三方请求；如下一期要求严格离线或更强隐私，可改为自托管字体。
- 当前生产包仍保留少量一期未引用的旧图片；`16 MB` 已满足本轮无明显卡顿目标，后续可把排除列表进一步收敛为资源白名单。

## 最终验收清单

| 项目 | 结果 |
|---|---|
| 内容 | 四项目、时间、跨工艺仅 Timeline、完整 About、无 Hobby/Contact/Footer、无虚构指标均通过。 |
| 视觉 | 独立长 Timeline、票根、MacBook、同级项目入口、正文 15–18px 主层级通过。 |
| 交互 | Hover、导航、音乐、cursor、键盘、触屏、Ganttodo fallback 和 reduced-motion 通过。 |
| 响应式 | `390 / 768 / 1024 / 1280 / 1440 / 2200` 均无横向溢出。 |
| 性能 | 首屏分阶段挂载，视频/iframe/大图按需；生产构建无 warning，`dist/` 约 16 MB。 |
| 隐私 | 奖状已按用户显式批注公开；Hobby metadata 清零且不进入生产产物。 |
| Git | 所有实现 commits 已推送；最终文档/截图 checkpoint 推送后再次核对 `HEAD == origin/main`。 |
