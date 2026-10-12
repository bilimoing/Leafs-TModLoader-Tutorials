# 在线人数与访问统计部署说明

当前未启用的原因是 [统计配置](../wwwroot/stats-config.json:2) 的 endpoint 为空。前端和统计后端已经实现，需要部署 Cloudflare Worker 并填入服务地址。

## 1. 部署统计服务

注册并登录 https://dash.cloudflare.com/，在 Workers 与 Pages 中开通 Workers，并按提示设置 workers.dev 子域名。在项目根目录打开终端，依次执行：

    npx wrangler@4 login
    npx wrangler@4 deploy --config stats-worker/wrangler.toml

第一条命令打开浏览器授权，第二条发布服务。首次询问是否安装 Wrangler 时输入 y。保存部署输出的完整 HTTPS 地址，形如 https://leaf-tutorial-stats.你的子域名.workers.dev。

[后端配置](wrangler.toml:6) 已包含 Durable Object 绑定与 SQLite 迁移，不需要手动创建数据库。套餐和配额以 Cloudflare 控制台为准。直接用浏览器打开服务地址可能显示“禁止来源”，因为服务只接受教程网站的统计请求。

## 2. 配置网站统计地址

打开 https://github.com/bilimoing/Leafs-TModLoader-Tutorials/settings/variables/actions，进入 Settings → Secrets and variables → Actions → Variables，点击 New repository variable。

- 名称填写 STATS_ENDPOINT。
- 值填写部署得到的完整 HTTPS 地址。
- 不要填写 Cloudflare API Token 或账号密码；这里需要的只是公开服务地址。

将项目修改推送到仓库，再到 Actions 中运行“部署教程网站”重新发布。仅设置变量不会触发自动发布。[发布流程](../.github/workflows/deploy.yml:29) 会读取变量，[发布脚本](../scripts/prepare-pages.mjs:7) 会生成统计配置。

也可以直接修改 [统计配置](../wwwroot/stats-config.json:2) 中的 endpoint，然后重新发布。两种方式同时配置时，仓库变量优先。

## 3. 检查网站来源

[后端配置](wrangler.toml:5) 默认允许 https://bilimoing.github.io，适用于当前网站。若改用自定义域名，修改 ALLOWED_ORIGIN 后重新部署后端。来源只包含协议、域名及非默认端口，不带仓库路径和结尾斜杠。例如网站为 https://example.com/tutorial/，来源应填写 https://example.com。

本地网站与线上来源不同，默认不会被线上统计服务接受。

## 4. 验证与统计口径

发布后打开网站，页脚应显示数字。切换文章查看本页访问，使用另一个浏览器打开网站，约 30 秒内在线数量应更新。

- 在线：最近 90 秒有心跳的页面会话。可见页面约每 30 秒发一次心跳，隐藏页面暂停。多个标签页可能算多个会话，因此是在线会话数的近似值。
- 总访问：累计页面浏览次数，打开首页、文章或刷新会增加，周期心跳不会重复增加。
- 本页访问：当前首页或文章的累计浏览次数。
- 数据从启用后开始积累，不能恢复之前的历史访问。

总访问不是去重访客人数；同一个人阅读多篇教程会累计多次。

## 5. 排查问题

| 状态 | 排查方法 |
| --- | --- |
| 未启用 | 检查统计地址是否填写，以及网站是否重新发布。 |
| 暂不可用 | 检查 Worker 部署、统计地址和 Cloudflare 网络连接。 |
| 请求返回 403 | 检查 ALLOWED_ORIGIN 是否匹配当前网站来源，修改后重新部署后端。 |
| 关闭网页后在线没有立刻下降 | 会话 90 秒无心跳后过期，下次统计请求会清理。 |

浏览器开发者工具的网络面板可检查统计请求，成功响应包含在线、全站浏览和本页浏览三个非负整数。
