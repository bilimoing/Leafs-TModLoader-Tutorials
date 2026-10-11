作者：冬天的叶 2026/8/27 \| 🔖 入门 、工具

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

打开这篇文章的你可能会有些疑惑，为什么我要把.NET安装部分单独拆开来做成教程，而不是和 VS 安装配置丢在一起。

原因很简单，因为在我写这篇教程时，tModLoader 正处于**1.4.4.9 到 1.4.5 的过渡期**。旧版本（1.4.4.x）需要 .NET 8，新版本（1.4.5）需要 .NET 10。因此，这节会同时覆盖两个版本的安装方法。

**如果你不确定自己该装哪个**，请先确认你使用的 tModLoader 版本：

仍在使用**tModLoader 1.4.4.x**→ 安装**.NET 8**

已更新至**tModLoader 1.4.5**→ 安装**.NET 10**



**特别提醒**：本教程基于**Windows 10 / Windows 11 64位系统**编写和验证。如果你使用的是 Mac 或 Linux，安装步骤会有所不同，请自行参考对应平台的官方文档。

---

**.NET 8的安装（适用于 TML 1.4.4.x 用户）**

首先，我们打开 .NET 8 官方下载页面：

[https://dotnet.microsoft.com/zh-cn/download/dotnet/8.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/8.0)

在页面中，我们找到**.NET 8 SDK**部分，选择Windows的**x64**版本进行下载



![图片](images/tutorials/edf14ac5c4524253e5563c56.png)

你可能会好奇，为什么 **.NET SDK** 有一堆不同后缀的安装包。很多新手看到这些就懵了，不知道自己的电脑该下哪个。这里简单解释一下：



**x64**全称 **64-bit（64位）**是目前绝大多数 **Windows** 电脑使用的架构 适用于 绝大部分的台式机、笔记本电脑（Intel/AMD 处理器）

**x86**  全称**32-bit（32位）**老式电脑的架构，现在已经很少见了 适用于 10年前的旧电脑，至于**x86**为什么不叫**x32** 感兴趣的同学可以自行查阅

**ARM64**全称**64-bit ARM 架构**是移动端和低功耗设备常用的架构 适用于 部分 Surface、Mac（M系列芯片）、手机等设备

大部分 **Windows 10 / Windows 11** 无脑选择**x64**即可

![图片](images/tutorials/1d6844d9c77e74f6f7fcf270.png)

下载完成以后，我们点击安装，还是一样的，允许修改，同意协议。

安装完成以后，可以尝试打开命令提示符（CMD），输入以下命令验证是否安装成功

```plaintext
dotnet --list-sdks
```

如果输出结果中包含8.0.x开头的版本号，说明安装成功。

---

**.NET 10的安装（适用于TML 1.4.5 用户，本教程所采用的版本）**

和.NET10的教程一样，我们打开 .NET 10 官方下载页面：

[https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0)

![图片](images/tutorials/df72b6dfae05ac97703ee34a.png)





在页面中，我们找到**.NET 10 SDK**部分，选择Windows的**x64**版本进行下载

下载完成以后，我们依旧点击安装，允许修改，同意协议。

安装完成以后，我们依然可尝试打开命令提示符（CMD），输入以下命令验证是否安装成功

```plaintext
dotnet --list-sdks
```

![图片](images/tutorials/af563135f3a01e2a3f89af74.png)



---

**常见问题**

Q：我可能需要在两个TML版本之间来回切换，两个版本可以共存吗？

A：可以，NET 8 和 .NET 10 可以同时安装在同一台电脑上，互不冲突。如果你的电脑上同时有旧版本和新版本的 tModLoader 项目需要维护，可以两个都装。dotnet --list-sdks命令会列出所有已安装的 SDK 版本。



Q：我装了 .NET 10，但 tModLoader 还是报错说找不到 .NET？

A：尝试重启电脑，环境变量刷新需要重启才能生效。重启后，确认你安装的是 SDK 而不是 Runtime（Runtime 只能运行程序，不能用来开发）



Q：我两个版本都装了，怎么让 tModLoader 使用指定版本？

A：tModLoader 会在 global.json 文件中指定所需的 SDK 版本，通常不需要手动干预。如果确实需要切换，可以在项目根目录创建 global.json 文件来锁定版本。



Q：教程里的代码在 .NET 8 上跑不通怎么办？

A：本教程基于 TML 1.4.5 + .NET 10 编写，部分新语法和 API 在旧版本上不可用。建议：

优先升级到 TML 1.4.5 + .NET 10 以跟随教程

如果暂时无法升级，遇到报错时欢迎加群 921853970 提问，记得注明你使用的版本



©*2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*
