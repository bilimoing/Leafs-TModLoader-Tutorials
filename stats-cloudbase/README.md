# 腾讯云 CloudBase SQL 型数据库统计部署

本版本适用于控制台显示 PostgreSQL 管理、SQL 型数据库的环境。无需文档数据库，不需要 CLOUDBASE_ENV_ID。最近 90 秒有心跳的标签页算在线；前端每 30 秒发送心跳。累计访问量是浏览次数，不是去重访客数。

## 1. 执行数据库脚本

在你截图的「SQL 型数据库 → SQL 编辑器」中新建查询。使用数据库管理员，先复制 schema.sql 的全部内容执行，再复制 rpc.sql 的全部内容执行。重复执行不会清空已有计数，不会修改你原来的其他表。

将生成四张 leaf_stats_ 开头的统计表和 leaf_stats_heartbeat 函数。数据库表启用 RLS，没有开放客户端策略；不要给匿名角色或浏览器用户读写权限。

## 2. 获取数据库连接信息

进入「SQL 型数据库 → 配置」，寻找连接信息或连接串。需要真正的 PostgreSQL 主机、端口、数据库名称、用户名和密码，而不是 REST API 地址、环境 ID 或浏览器令牌。控制台具体名称可能不同。

建议创建专用服务端数据库登录角色，密码由你在控制台安全设置。使用管理员给该角色授权（把 leaf_stats_server 替换为你的实际角色）：

    GRANT USAGE ON SCHEMA public TO leaf_stats_server;
    GRANT SELECT, INSERT, UPDATE ON public.leaf_stats_totals, public.leaf_stats_pages, public.leaf_stats_sessions, public.leaf_stats_events TO leaf_stats_server;
    GRANT EXECUTE ON FUNCTION public.leaf_stats_heartbeat(uuid,uuid,text) TO leaf_stats_server;
    CREATE POLICY leaf_stats_server_access ON public.leaf_stats_totals FOR ALL TO leaf_stats_server USING (true) WITH CHECK (true);
    CREATE POLICY leaf_stats_server_access ON public.leaf_stats_pages FOR ALL TO leaf_stats_server USING (true) WITH CHECK (true);
    CREATE POLICY leaf_stats_server_access ON public.leaf_stats_sessions FOR ALL TO leaf_stats_server USING (true) WITH CHECK (true);
    CREATE POLICY leaf_stats_server_access ON public.leaf_stats_events FOR ALL TO leaf_stats_server USING (true) WITH CHECK (true);

上述策略只授权专用角色；策略创建只执行一次。不要把此角色给前端登录用户使用。也可先用你自己的管理员连接验证，再改为专用角色。

连接串形如 postgresql://用户名:密码@主机:端口/数据库名?sslmode=verify-full，按控制台提供的实际连接串和 TLS 要求填写。用户名和密码中的特殊字符需 URL 编码。保留证书校验，不使用 rejectUnauthorized=false；平台要求私有 CA 时需在服务端配置其证书。

云函数必须能访问数据库主机。如果仅提供内网地址，需要配置相同地域和可达的私有网络、安全组等。若体验版没有开放直接 PostgreSQL 连接，本部署方式暂不能运行，需要再按平台实际提供的服务端数据库 API 适配；不要把 REST 地址填成数据库连接串。

## 3. 上传 HTTP 云函数

进入左侧「云函数 / 托管」，创建 HTTP 类型云函数，例如 leaf-tutorial-stats。选择平台支持的 Node.js LTS 运行时，至少版本 18。上传本目录生成的 leaf-cloudbase-stats.zip，依赖已包含，文件位于 ZIP 根目录。启动文件为 scf_bootstrap，服务监听 9000 端口。若该入口只有事件函数或要求容器托管，需要按该产品的启动方式配置，不能把 HTTP 服务当事件处理函数上传。

在云函数的服务端环境变量中填写：

| 名称 | 内容 |
| --- | --- |
| DATABASE_URL | 上一步实际 PostgreSQL 连接串（含密码，保密） |
| ALLOWED_ORIGIN | https://bilimoing.github.io，或实际网站的协议和域名，不带路径 |

不要把连接串提交到仓库、写入 wwwroot 或放进部署包。本服务每个实例最多三条数据库连接；根据体验版连接数限制控制实例上限。

## 4. 配置 HTTP 网关

进入左侧「HTTP 网关」，将公开统计路由关联至该函数，保证 OPTIONS 和 POST 可以无需登录调用。使用平台支持的 HTTPS 地址，核对默认域名的期限及体验版限制。不要用需要管理员 Token 的管理 API 代替公开路由。

若控制台没有当前套餐可用的公开入口，应先确认套餐功能或自定义域名配置。本文不承诺体验版的所有入口均可用或永久免费。

## 5. 验证并切换网站

访问实际映射到服务的 /health 路径应得到 status 为 ok；如果网关有前缀，需要带上该前缀。健康检查只验证进程，不验证数据库。

从教程网站来源发送统计 POST，正常结果为 online、visits、pageVisits 三个非负整数。来源不匹配返回 403；数据库不可用返回 503，检查云函数日志中的错误码、网络、连接串、SQL 脚本、授权和 RLS 策略。

验证成功后，把 wwwroot/stats-config.json 的 endpoint 替换为公开统计路由，不要填健康检查路径。如果 GitHub 仓库设置了 STATS_ENDPOINT 变量，也要更新，因为该变量优先。重新发布网站，再刷新页脚确认数字。当前文件仍保留旧服务地址，等待你的真实腾讯云入口。

新数据库从零累计，旧 Cloudflare 计数不会自动迁移。来源检查不能阻止脚本伪造请求，这不是防刷服务。服务不保存 IP。

## 6. 清理和额度

会话和去重事件会持续占用存储。rpc.sql 末尾提供七天未活动会话及关联事件的清理语句，建议每天通过管理员定时任务执行，不要授予浏览器删除权限。专用服务角色默认没有删除权限。清理后超过七天的旧请求若再次上报可能重新计数；累计计数不会随清理减少。

每个持续打开的标签页每小时约 120 次请求，另有数据库操作。检查体验版的调用、连接、存储和流量额度。全站计数为共享写入点，访问量大时会产生锁等待。

## 本地验证和重新打包

依赖声明在 package.json；测试使用 PGlite 执行实际 PostgreSQL SQL，并测试 HTTP 接口。它不验证腾讯云网络、权限和独立数据库连接之间的并发行为，仍需云端验证。

部署包只包含运行依赖，不包含测试用数据库引擎或任何连接凭据。
