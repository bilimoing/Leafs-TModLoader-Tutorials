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

主题切换直接切换深浅色并保存偏好。搜索固定在顶部导航中，支持按 / 聚焦。首页保留开始学习和资源入口；叶子图标使用透明背景。首页右侧显示不规则树冠大树，落叶从树冠间歇向左下漂移；文章页不显示这组装饰，减少动态效果偏好会停用动画。

文章 Markdown 按需渲染并缓存，首页启动不再解析全部文章。代码块采用本地轻量词法高亮和 Visual Studio 风格深浅色配色，保持原始文本与复制内容一致；不提供 IDE 级语义分析。首次访问仍需要下载 Blazor WebAssembly 运行时，当前改动主要减少首屏解析及装饰渲染开销。

## 图片本地化工具

图片接口需要金山登录。先在 Chrome 或 Edge 登录 https://www.kdocs.cn 并打开自己的文档，在开发者工具 Console 中运行 scripts/image-migration/download-in-browser.js 的全部内容，选择本机一个空文件夹保存图片。此脚本仅访问清单中的图片，不读取或输出登录 Cookie。浏览器权限或金山服务仍可能阻止下载；失败原因在 results.json 中。请只在自己的已登录文档页面运行。

将下载的文件放到项目 import/images 文件夹，然后从项目根目录运行 node scripts/image-migration/import.mjs。导入器检查图片类型，复制到 wwwroot/images/tutorials 并把 Markdown 地址改为站内图片，保留未成功下载的外链。提交文档与图片一起发布。

全站背景树由公共布局加载，落叶随机从树冠内生成并持续沿弯曲轨迹飘落。浏览器后台或开启减少动态效果时停止生成。自动发布会为脚本与样式附加提交版本参数，减少旧缓存影响，version.json 可查看实际部署版本。

### 旧图片接口全部下载失败时

如果下载记录显示图片无数据或无权限，不要继续重复抓取。登录并不保证旧的 office/copy 图片接口可用。请在金山中打开原文，使用带图片的 Markdown 导出方式；若没有这种导出选项，可导出 HTML 或 Word 文件取得图片，不能仅下载只有外链的 Markdown。

将带图片的 Markdown 包解压到 import/export，保持导出文件名与 Pages/MD 教程文件名一致。执行 node scripts/image-migration/import-export.mjs。工具只处理同名、图片引用数量一致、所有图片在导出包内且类型有效的文档，保留当前正文，只按图片出现顺序替换地址。因此应导出与当前文档相同版本，避免顺序变化；请先提交当前工作并在导入后检查图片是否对应。失败或数量不一致的文章会跳过并给出提示。

左侧目录已恢复，支持整体展开收起、章节展开收起及目录/要点切换。

### 本次 Word 图片迁移结果

已从用户提供的 34 份 Word 导出文件提取图片，将现有 Markdown 中全部 352 个图片引用改为 images/tutorials 下的本地文件，去重后 335 张图片，保留 GIF 和 WebP 原格式。匹配使用正文图片顺序和图片尺寸，跳过导出中的文档图标；迁移记录保存在 scripts/image-migration/docx-import-report.json。源 Word 和解压中间文件未加入仓库。提交 wwwroot/images/tutorials 与修改后的 Pages/MD 后，访客无需金山登录即可加载图片。
