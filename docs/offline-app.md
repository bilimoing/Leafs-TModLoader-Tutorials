# Windows 与 Android 离线版

网站与离线程序共用教程、目录、搜索、图片查看和主题。完整发布文件复制到 offline-app/site，再分别打包。图片不从网络下载，评论与在线统计通过 LEAF_OFFLINE 标记停用。外部链接交给系统浏览器，需要网络。

## 下载与安装

网站顶部“离线下载”入口提供两个 GitHub Release 文件链接：LeafTutorials-Windows-x64.zip 和 LeafTutorials-Android.apk。首次需构建并公开 Release 后才可下载。latest 指向最新非预发布版本，发布其他类型的 Release 时也要保留这两个文件，或调整下载链接。

Windows 10/11 x64：解压完整 ZIP，运行 LeafTutorials.exe，不能只复制 EXE。包内自带 Chromium，不要求安装 .NET。当前未配置商业代码签名，Windows 可能提示未知发布者。

Android 8.0+：下载 APK，允许该下载来源安装应用。依赖支持 WebAssembly 的新版系统 WebView；Android 版本满足要求并不保证旧 WebView 可运行，应先更新 WebView。正式 APK 使用固定签名密钥，后续更新应使用同一密钥和更高版本编号。Debug 包仅供测试，不能与正式签名包互相覆盖。

## 构建

先执行：

```
dotnet publish 叶子的TModLoader教程.csproj -c Release -o release
node scripts/prepare-offline.mjs release/wwwroot
node --test scripts/offline.test.cjs
```

建议清空 release 后发布，避免残留旧版资源。prepare-offline 拷贝文件时跳过压缩副本与调试符号，检查教程 Markdown 是否含远程图片；所有图片按字节校验。不要提交生成的 offline-app/site、依赖目录、安装包或签名文件。

Windows：Node.js 22.12+，在 offline-app/windows 执行 npm ci、npm run package。输出在 dist。开发预览使用 npm start。不要通过关闭 TLS 校验绕过依赖下载证书错误。

Android：.NET 10 Android workload、JDK 21、API 36 SDK。先安装 Android 平台依赖，再按 AndroidSigning 系列属性构建。Windows Android 打包工具可能不支持中文工作目录，应使用英文路径构建；自动工作流的 Linux 环境避免该限制。

## GitHub 自动构建与发布

1. 推送代码后，在 Actions 手动运行“构建离线应用”。两个任务分别上传 Windows ZIP 与 Android APK，手动测试构建未配置正式签名时使用 Debug 签名。
2. 正式发布前，在仓库 Actions Secrets 设置 ANDROID_KEYSTORE_BASE64、ANDROID_KEY_ALIAS、ANDROID_STORE_PASSWORD、ANDROID_KEY_PASSWORD。前者为你持有的 keystore 文件的 Base64，必须安全备份原始密钥和密码，不在仓库提交。
3. 发布 offline-v 开头的版本标签，例如 offline-v1.0.0。工作流要求正式签名完整配置，生成两个包并创建 Release 草稿，不自动公开。
4. 下载草稿附件，在 Windows 与 Android 完成断网验收，再公开草稿。网站现有下载链接随后可用。

可通过 JDK keytool 本地创建密钥：

```
keytool -genkeypair -keystore leaf-release.jks -alias leaf -keyalg RSA -keysize 3072 -validity 10000
```

按交互提示输入密码并保存。将密钥配置到 Secrets 时不要打印到共享日志。正式签名密码通过环境变量传给构建，工作流结束删除临时签名文件。

## 验收与当前限制

验证断网冷启动、搜索、每篇教程图片、GIF、主题、复制代码、返回键、横竖屏、外部链接以及覆盖更新。移动 WebView 的剪贴板接口可能受系统限制，需要真机验证。

本次本地验证：网站 Debug 构建和 Release 发布通过；离线入口、本地资源、全部教程图片一致性、第三方延迟加载测试通过。Android C# 编译通过，但 APK 打包被 Windows 中文路径限制阻断；Windows 构建被运行时下载证书错误阻断。因此尚无本地完成验收的成品，也未运行 GitHub 自动构建、未真机测试或公开 Release。下载页面不会让未发布的文件凭空可用。
