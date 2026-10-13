# 叶子的 tModLoader 教程

本项目由金山文档迁移而来。

原文链接：https://www.kdocs.cn/l/crP1DDFrTik8

教程文字、代码、图片及其他内容的版权归各自原作者所有，使用与转载要求以原作者及原文中的版权声明为准。本项目仅作迁移与展示，不改变原内容的版权归属。

## GitHub 留言

教程底部使用 utterances，无需部署评论 Worker、数据库或自己的授权服务。组件由 utteranc.es 提供，留言保存在 GitHub Issues 中。

上线配置：

1. 仓库 bilimoing/Leafs-TModLoader-Tutorials 必须公开并启用 Issues。
2. 将 https://github.com/apps/utterances 安装到该仓库。
3. 推送本次网站改动到 main/master，等待 GitHub Pages 部署完成。
4. 打开教程检查评论组件，点击 Sign in with GitHub 完成授权并返回网站，在组件中输入留言并点击 Comment。

首次授权默认会离开教程页面并返回。有效登录会话内，后续留言在站内提交。每篇教程使用“教程留言：教程标题”作为独立讨论标识，适配同一路径通过查询参数切换教程的结构；修改教程标题会改变讨论标识。

首次留言时 utterances-bot 创建对应教程的讨论 Issue，留言以读者本人身份作为 Issue 回复保存。后续回复继续使用同一个 Issue。组件显示账号、头像和时间，使用自身界面，不支持原来的站内自定义昵称。主题随网站明暗模式更新。

留言提交后直接展示，不需要审核 PR 或重新部署。管理员在对应 GitHub Issue 中管理回复。不要给 utterances 讨论添加“评论审核通过”标签；旧审核工作流仍保留，只用于原有带网站投稿数据块的历史 Issue，不能读取 utterances 回复。Comments 目录历史数据保留，但新的组件不再渲染这些静态评论。

utterances.json 允许 https://bilimoing.github.io 来源；自定义域名时需更新该来源列表。原 COMMENTS_ENDPOINT 变量已不再使用，可从仓库变量中删除。评论区无法加载时检查到 utteranc.es 与 GitHub 的网络、App 安装仓库范围和来源配置。浏览器可能需要允许授权相关存储。

所有 Issue 和留言均公开，请勿提交隐私信息。网站的访问统计是独立功能，其配置不受本次评论替换影响。
