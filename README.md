# 叶子的 tModLoader 教程

本项目由金山文档迁移而来。

原文链接：https://www.kdocs.cn/l/crP1DDFrTik8

教程文字、代码、图片及其他内容的版权归各自原作者所有，使用与转载要求以原作者及原文中的版权声明为准。本项目仅作迁移与展示，不改变原内容的版权归属。

## 评论登录、投稿与审核

教程底部支持 GitHub 登录和站内提交评论。首次登录通过弹窗完成 GitHub 授权，提交评论由服务端使用读者自己的身份自动创建 Issue，不跳转页面。昵称可自定义，头像取自真实投稿者的 GitHub 账号。待审核 Issue、发布的评论及仓库历史均公开，请勿投稿隐私信息。

GitHub Pages 不运行登录后端，因此需要部署 comments-worker 中的服务并配置 GitHub App。具体步骤见 [登录服务部署说明](comments-worker/README.md)。服务未配置时，页面提示未启用并禁用登录按钮。GitHub 应用密钥和加密密钥仅配置在 Worker Secrets，不能放入网页或仓库。

仓库设置：

1. Settings → General → Features 启用 Issues。
2. Settings → Actions → General → Workflow permissions 启用 **Allow GitHub Actions to create and approve pull requests**。组织限制需由组织管理员调整。
3. 创建名称完全相同的 **评论审核通过** 标签。
4. 部署登录服务，在 Actions Variables 设置 **COMMENTS_ENDPOINT**，推送并部署网站。

审核流程：

1. 读者登录后在网站提交，页面显示待审核的 Issue 编号。
2. 维护者检查 Issue 数据块中的内容，添加 **评论审核通过** 标签。
3. 工作流校验维护者权限、教程名称、长度和真实作者，创建保存 `Comments/编号.json` 的 PR。
4. 维护者检查新增文件并手动合并，现有 main/master 部署流程校验数据后发布，合并关闭原 Issue。
5. 不通过的投稿直接关闭，不添加审核标签。

评论以纯文本展示，每条 Issue 最多导入一次。审核保存添加标签时的内容快照，后续编辑 Issue 不会自动替换评论。审核期间内容变化会被拒绝，应重新检查并移除、重新添加标签。重新生成未合并投稿前，先关闭对应 PR、删除 `comments/issue-编号` 分支；已发布评论的修改和删除使用普通 PR。

Actions 使用默认分支上的可信脚本，不执行投稿内容，不自动合并。自动令牌创建的 PR 通常不会触发其他 PR 工作流；手动合并后的部署仍会运行评论校验和测试。仓库如强制要求 PR 检查，可由维护者在可信分支重新提交变更以触发检查，或为审核工作流另行配置 GitHub App。

撤下网站评论不会清除公开 Issue 和 Git 历史。教程新增后还需更新登录服务中的合法教程清单并部署。

本地验证：`node --test scripts/comments.test.cjs scripts/comment-workflow.test.cjs comments-worker/worker.test.mjs`、`node scripts/comments.cjs`、`dotnet build`。
