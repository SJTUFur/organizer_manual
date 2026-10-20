---
title: 编写与发布
section: 维护手册
---

# 编写与发布

## 修改现有章节

直接编辑 README.md、intro/、determination/ 或 activities/ 中的 Markdown 文件。保留文件开头两组 `---` 之间的页面信息，在其下方修改正文。

推送到 main 分支后，GitHub Pages 会自动构建并发布。进度可在仓库 Actions 中查看。

## 添加章节

创建 Markdown 文件，在开头添加页面信息：

```yaml
---
title: 新章节标题
in_nav: true
nav_order: 250
section: 活动篇
---
```

`nav_order` 决定侧边栏和上一篇／下一篇的顺序，请使用不重复的数字。`section` 决定侧边栏的分组。新增章节也要加入 SUMMARY.md，保持 GitHub 和 GitBook 目录一致。

当前序号按篇章分段，章节之间预留间隔：

| 分组 | 序号安排 |
| --- | --- |
| 首页与序言 | 0、10 |
| 立志篇 | 100、110、120、130，后续可用 140 等 |
| 活动篇 | 200、210、220、230、240，后续可用 250 等 |
| 工具篇（待建立） | 预留 300 起 |

例如在 110 和 120 之间插入一章，可以使用 115，无需修改其他章节。同一分组的序号保持在同一段，避免侧边栏分组被拆开。

## 页面链接

正文使用普通 Markdown 相对链接，例如 `[序言](intro/introduction.md)`。构建时会自动转换为网页链接。不要将本机路径或仓库编辑链接当作章节链接。

## 网站配置

`_config.yml` 配置标题、介绍和站点路径。`_layouts/default.html` 控制页面结构，`assets/` 中存放样式、搜索和手机导航脚本。

本网站使用 GitHub Pages 自带的 Jekyll 构建，无需单独连接 GitBook。原有 `.gitbook.yaml` 和 SUMMARY.md 仍可用于 GitBook 导入。
