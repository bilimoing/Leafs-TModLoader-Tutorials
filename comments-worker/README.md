# GitHub 登录与站内评论服务

网站仍部署在 GitHub Pages。本服务部署为独立的 Cloudflare Worker，使用 D1 保存一次性授权状态、短期会话和投稿去重记录。GitHub 用户访问令牌在数据库中使用 AES-GCM 加密，前端只获得短期会话凭证，不获得 GitHub 令牌。需要 Cloudflare 账号和 GitHub App，当前代码不会自动创建这些资源。

## 创建 GitHub App

在 GitHub Settings → Developer settings → GitHub Apps → New GitHub App 创建应用：

- Homepage URL：实际教程网站地址。
- Callback URL：`https://你的评论Worker域名/auth/callback`，必须与部署域名完全一致。
- 关闭 Webhook（本服务不使用）。
- Repository permissions：仅将 Issues 设置为 Read and write，Metadata 保持默认读取。无需仓库内容写入权限。
- 开启用户访问令牌过期；本服务最多保留一小时会话，过期后重新登录，不保存刷新令牌。
- 将 App 安装到 `bilimoing/Leafs-TModLoader-Tutorials` 仓库，仅选择此仓库。
- 记录 Client ID，并生成 Client secret。这里用的是 Client ID，不是 App ID。GitHub App 用户授权不需要 OAuth App 的 `public_repo` 范围。

App 应允许目标读者进行用户授权。首次登录弹窗由 GitHub 显示授权界面；后续授权行为由 GitHub 决定。App 安装和读者的有效权限共同决定能否创建 Issue，请使用普通读者账号验证。

## 部署 Worker

以下命令从项目根目录执行，需要 Node.js、Cloudflare 登录和 Wrangler。首次使用可以通过 `npx wrangler login` 登录。

1. `npx wrangler d1 create leaf-comment-auth` 创建数据库。
2. 将返回的 database_id 写入本目录的 wrangler.toml，同时填写 GITHUB_CLIENT_ID、实际 ALLOWED_ORIGIN 和目标 REPOSITORY。ALLOWED_ORIGIN 只含协议和域名，不带站点路径。
3. `npx wrangler d1 execute leaf-comment-auth --remote --file comments-worker/schema.sql --config comments-worker/wrangler.toml` 初始化表。
4. `npx wrangler secret put GITHUB_CLIENT_SECRET --config comments-worker/wrangler.toml` 交互输入 GitHub App 的 Client secret。
5. 本地执行 `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` 生成随机加密密钥，然后通过 `npx wrangler secret put TOKEN_KEY --config comments-worker/wrangler.toml` 交互输入该值。密钥和 Client secret 都不应提交到仓库。
6. `node comments-worker/generate-articles.mjs` 更新合法教程列表（新增教程后也需运行）。
7. `npx wrangler deploy --config comments-worker/wrangler.toml` 部署服务。
8. 在 GitHub App 设置中确认 Callback URL 使用此次部署的实际 HTTPS 地址。

通过仓库 Settings → Secrets and variables → Actions → Variables 添加 `COMMENTS_ENDPOINT`，值为 Worker HTTPS 根地址，例如 `https://leaf-tutorial-comments.你的子域.workers.dev`，重新部署网站。也可以手动填写 wwwroot/comments-config.json 的 endpoint。客户端会拒绝包含路径、凭据或查询参数的服务地址。未配置时登录按钮禁用，并显示服务未启用。

## 验证

点击网站的 GitHub 登录，允许弹窗并授权，回到网站应显示账号。提交评论后应显示 Issue 编号，当前页面不导航。检查仓库中的 Issue 作者是否为登录读者，内容是否为网站生成的投稿数据，再添加“评论审核通过”标签、合并 PR，验证网站发布评论。

服务限制每账号每分钟一条投稿，限制评论长度，校验来源、一次性授权状态和服务端会话。同一次提交编号只处理一次；如果 GitHub 网络超时导致结果不明，服务会保留待确认记录，避免立即重复创建。需要检查仓库并等待服务记录清理，而不是不断重试。会话凭证存在当前标签页的 sessionStorage，退出清除；本服务不依赖跨站 Cookie。

服务启动授权时会清理过期状态、会话与一天前的去重记录。高流量站点可补充定时清理、平台请求限流和更细的反滥用措施。更换 TOKEN_KEY 会让旧会话无法解密，应同时清空 sessions。配置服务域名变更时需要同步更新 GitHub 回调和站点变量。免费额度和中国大陆访问体验以平台实际情况为准。
