# CloudBase 统计后端部署

保留最近 90 秒在线会话、全站累计浏览和当前文章累计浏览。前端每 30 秒发心跳，同一事件重试不会重复计数。多个标签页按多个会话计算。

## 创建环境与数据库

登录腾讯云 CloudBase 控制台，创建上海地域环境。官方文档数据库事务目前标注支持上海地域，本实现使用事务保证并发计数一致性。先核对账户套餐、调用配额和费用，再开通；不承诺永久免费。

在该环境的文档型数据库中创建三个集合：

- stats_sessions
- stats_counters
- stats_pages

将集合的客户端安全规则设为禁止所有客户端读写，只允许云函数通过运行身份访问。不要将数据库开放为任何人可写。无需手动添加初始文档，代码自动创建。

给 stats_sessions 创建 lastSeen 字段的升序普通索引。建议为 expiresAt 创建 TTL 索引（如控制台支持），用于清除一天未活动的会话；该字段为日期类型。在线查询仅检查 lastSeen，不依赖 TTL 清理速度。没有 TTL 时需安排清理过期记录，否则存储会持续增长。

## 上传 HTTP 云函数

在同一环境创建名为 leaf-tutorial-stats 的 HTTP 云函数（不是普通事件函数），选择支持的 Node.js LTS 运行时，至少 Node.js 18。控制台选择本地 ZIP 上传，上传本目录的 leaf-cloudbase-stats.zip。包内包含依赖，文件直接位于 ZIP 根目录。启动文件为 [scf_bootstrap](scf_bootstrap)，程序监听 9000 端口。

设置环境变量：

| 名称 | 值 |
| --- | --- |
| CLOUDBASE_ENV_ID | 控制台中的实际环境 ID |
| ALLOWED_ORIGIN | https://bilimoing.github.io |

云函数必须拥有访问该环境文档数据库的运行权限，使用平台提供的服务身份。不要在网页、配置文件或上传包中加入腾讯云账号 SecretId、SecretKey。

## 配置公网入口

按照控制台 HTTP 网关／HTTP 访问服务入口，将公开路由连接到这一个 HTTP 云函数。使用支持访客无需登录调用的公开入口，并保证 OPTIONS 和 POST 都能到达函数。本函数负责网站来源检查及跨域响应。

不要直接使用需要 Bearer Token 的管理／认证 HTTP API 当作 endpoint。不要把管理员 Token 放进前端。若当前套餐只提供需鉴权的入口，应改用平台支持的公开 HTTP 访问服务或自定义域名入口。

如控制台提供默认 HTTPS 访问地址，可以先用于验证。默认域名使用期限、限制及自定义域名备案要求以控制台说明为准；有自有域名时，按平台指引配置生产使用的 HTTPS 域名。服务器和域名可用于入口，但不需要运行现有 Cloudflare 后端。

## 检查并切换网站

先在关闭代理的浏览器打开实际服务地址下的 /health。应返回 status 为 ok 的 JSON。这只验证进程与网络，不验证数据库。直接打开其他路径返回禁止来源是正常行为。

使用教程网站来源发送 POST 才会访问数据库；正常响应包含 online、visits、pageVisits 三个非负整数。确认测试成功后，把 [网站统计配置](../wwwroot/stats-config.json:2) 的 endpoint 换成公开统计入口地址。入口可为根路径或控制台分配的统计路由，必须与实际路由一致。

若 GitHub 设置了 STATS_ENDPOINT 仓库变量，也同步替换；仓库变量优先。推送修改或重新运行网站发布流程，再关闭代理刷新教程网站，检查页脚数字。不要填写 /health 作为统计地址。

新数据库从零累计；Cloudflare 的历史计数不会自动迁移。旧服务保留到新服务验证通过后再停用。当前项目的网站配置仍保留旧地址，直到取得真实 CloudBase 地址再切换。

## 排查与配额

- 403：检查请求 Origin 与 ALLOWED_ORIGIN 是否一致。
- 503：查看云函数日志，检查环境 ID、上海地域、集合、索引、执行权限与事务错误。
- 404 或要求登录：检查公网入口路由及鉴权设置。
- 超时：先检查 /health 的网络可达性，再查冷启动和日志。

每个持续在线的标签页每分钟约发两次请求，一天持续打开约 2880 次请求，每次还包含多次数据库操作。小站通常无需预置并发，费用按实际套餐与访问量核对。全站计数文档为共享写入点，高流量下事务竞争可能返回暂不可用，需根据实际规模进一步拆分计数。

来源限制不能完全阻止脚本伪造访问，不是防刷系统。服务只接收随机会话标识与页面名称，不保存 IP。

## 官方参考

- [HTTP 云函数控制台部署](https://docs.cloudbase.net/cloud-function/quickstart/httpfunc/nodejs)
- [数据库事务与地域限制](https://docs.cloudbase.net/database/transaction)
- [需要访问令牌的 HTTP API](https://docs.cloudbase.net/cloud-function/function-calls/http-api)

本地行为测试使用模拟数据库，云端事务、权限和路由必须在实际环境验证。
