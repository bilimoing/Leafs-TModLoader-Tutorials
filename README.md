# 叶子的 tModLoader 教程

这是一个使用 Blazor WebAssembly 构建的中文教程网站。

网站提供章节导航、Markdown 阅读、全文搜索、文章目录、代码复制、相邻文章导航、移动端菜单和深浅色主题。原始文档保存在 Pages/MD，构建时自动嵌入网站。

## 本地运行

安装 .NET 10 SDK，在项目目录执行 dotnet run，然后打开终端显示的本地地址。首次加载需要下载 WebAssembly 运行时。

## 更新教程

直接编辑 Pages/MD 下的 Markdown 文件。新增文章后，在主页.md 的对应章节添加链接；显示名称应与文件名一致，也支持已有的作者前缀和原金山链接。已迁移的金山教程链接会自动映射为站内文章；没有对应本地文档的链接保留为外部链接。未列入主页目录的新增文章会出现在“补充教程”分类。

为了保持内容安全，文档中的原始 HTML 不执行；请使用 Markdown 图片、表格和代码围栏。
## 访问量与实时在线人数

网站页脚显示在线会话数、全站访问量和本页访问量。GitHub Pages 没有后端，因此真实统计由 stats-worker 中的 Cloudflare Worker 与 Durable Object 共享保存。统计以每个浏览器页面会话为单位，每 30 秒发送心跳，90 秒内有心跳的会话视为在线；同一页面的重复心跳不会增加访问量，切换文章才会增加。关闭页面后最迟约 90 秒从在线数中移除。多标签页各自算作一个在线会话。

启用步骤：

1. 注册并登录 Cloudflare，使用 Node.js 运行 npx wrangler login。
2. 在项目根目录执行 npx wrangler deploy --config stats-worker/wrangler.toml，取得部署后的 HTTPS 地址。
3. 编辑 wwwroot/stats-config.json，将 endpoint 设置为该地址，例如 https://leaf-tutorial-stats.你的子域.workers.dev/。
4. 推送修改，等待 GitHub Pages 重新部署。

ALLOWED_ORIGIN 已限制为 https://bilimoing.github.io，更换域名时需同步修改 stats-worker/wrangler.toml。没有配置 endpoint 时明确显示“未启用”，不会把本地次数或累计访客冒充真实在线。该统计适用于一般教程站，并非防刷分析系统。

主题切换在支持 View Transitions 的浏览器中以中心叶子扩张或收缩过渡；不支持或用户启用减少动态效果时直接切换。顶部搜索支持按 / 聚焦。
