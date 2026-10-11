作者：冬天的叶 2026/8/27 \| 🔖 入门 、工具

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

想要制作一个自己的泰拉瑞亚**Mod**，你总共需要准备**4样物品：** 

**1 泰拉瑞亚游戏本体 (Terraria):** 一切的基础，通过 **Steam**购入

**2 tModLoader (TML)**：模组加载与开发的核心工具。拥有**steam**正版**Terraria**后便可在**Steam**商店免费下载

**3 代码编辑器 (IDE)**：用于编写 C\# 代码。

**4 DOTNET（ .NET）** ：编译代码的运行环境（）



泰拉瑞亚本体与**tModLoader**的安装方式，网络上已有大量教程，本篇不再赘述。下面我们直接进入正题，重点讲解代码编辑器的选择与配置。

---

# Visual Studio安装与配置

在早期的**tModLoader**开发中，**Visual Studio 2022**曾是官方推荐的IDE，社区内绝大多数教程也都是基于VS 2022编写的。然而，随着TML 1.4.5的更新，**tModLoader**将目标框架升级到了.NET 10，而**Visual Studio 2022**的最高支持版本为.NET 9，无法直接兼容.NET 10项目。因此，我们在此推荐安装**Visual Studio 2026**，它对.NET 10提供了完整支持，同时向下兼容所有旧版本项目，是目前开发TML 1.4.5模组的最佳选择。



可以通过访问**Visual Studio**官网：[https://visualstudio.microsoft.com/](https://visualstudio.microsoft.com/) 来获取**Visual Studio 2026** 



![图片](images/tutorials/253facce8c45ec891837c295.png)

打开官网以后，我们会看到这个页面，不要点击那个免费下载，点击免费下载下面那个浏览所有版本的按钮。

![图片](images/tutorials/2bb564fda0d3343eee9e5334.png)

点完以后我们会来到第2个页面，此时，会弹出三个版本让我们选择，我们选择第一个 **Community** 版本进行下载。



Visual Studio主要有三个版本：**Community（社区版）、Professional（专业版）和Enterprise（企业版）**。它们共享同一个核心开发环境，区别主要在于授权方式和面向的用户群体。



说人话就是**Professional（专业版）与Enterprise（企业版）**这两个是付费版（Professional约45美元/月，Enterprise约250美元/月）



![图片](images/tutorials/8f161b254dfa34abb56b0f15.png)



我们点击按钮，等待** Visual Studio** **Setup**下载完成，然后我们双击程序，允许修改，同意协议。在安装时勾选.net桌面开发，勾选后点右下角的确认按钮，之后什么都不用管了**Visual Studio2026**会自动在你的电脑上安装完成。



©*2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*
