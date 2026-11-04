原作者：Cyril 再版：冬天的叶  2026/10/31 \| 🔖 专业

[叶子的TModLoader教程](%E4%B8%BB%E9%A1%B5.md)

不知道第几个TModLoader教程说是....

---

# 通过 MonoModHooks 动态挂钩子

## 前置知识与提醒

这不是一个基础教程，你最好先确保掌握了这些前置知识：

- [基础 On 修改](On%E7%9A%84%E5%8A%9F%E8%83%BD%E4%B8%8E%E5%BA%94%E7%94%A8.md)

- [C\# 反射](https://www.runoob.com/csharp/csharp-reflection.html)

  此外，**Bilibili**也有相似的通过反射实现的 [教程内容](https://www.bilibili.com/read/cv12449476/?opus_fallback=1) ，可作一定参考。

  本文提供一种利用 **MonoMod** 特性实现动态外显名的方法，当然，也可用于修改模组图标。

  本文文字金色闪烁的效果实际上使用了 [Shader](Shader%E7%AE%80%E4%BB%8B.md)与 [绘制](%E7%AE%80%E5%8D%95%E7%BB%98%E5%88%B6.md)，但那不是重点。当然，如果你想要完全看懂最好还是了解一下（所以写完之后才发现，涉及的方面还挺杂的，这就是 `IL` 和 `On` 了，是搭配其他内容使用的）。

  本文所涉及的代码以及资源已在 [Example Mod注释汉化项目](https://github.com/Cyrillya/Example-Mod-Zh-Project) 中开源，主要是 [这个文件](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Common/Systems/GoldenDisplayNameSystem.cs)~~（别问，问就是私货）。~~

  **更新记录**

  2023.2.25 更新：最近 tML 官方也出了一个 [HookEndpointManager](https://github.com/tModLoader/tModLoader/wiki/Detouring-and-IL-Editing-using-HookEndpointManager)的教程，可供参考，有一些地方还是 tML 的教程详细些。

  ---

## 瞎写的背景

某日，一个 Mod 作者看着模组列表上满屏的 Mod，陷入了沉思。

![图片](images/tutorials/MonoModHooks挂钩子-01.png)

*不是，这也太单调了吧*

于是，他打算让自己的 Mod 在列表中看上去更炫酷一点，以一下子闪瞎玩家的眼。

![图片](images/tutorials/MonoModHooks挂钩子-02.png)

*等会？这闪的也太瞎了......*

对不起，搞错了，这才是效果图（

![图片](images/tutorials/MonoModHooks挂钩子-03.gif)

（有木有很线裤捏）

## 第一步 – 寻找切入点

要实现这个效果，首先，当然是得找到模组列表是在哪里实现的。

仔细想想，有什么元素是**只会在这个地方出现**的？没错，就是模组图标 `icon.png`。

通过搜索 `icon.png`，我们找到了获取模组图标的方法，它在 `ModLoader` 类里的：

```csharp
internal static Asset<Texture2D> GetModIcon(TmodFile modFile, string fileName = "icon.png", int iconSize = 80)
internal static Asset<Texture2D> GetModIcon(TmodFile modFile, out string error, string fileName = "icon.png", int iconSize = 80)
```

我们不用管这个方法内部写了啥，因为重点不在获取图片。我们直接再次反查：**谁使用了** **`GetModIcon`？**

![图片](images/tutorials/MonoModHooks挂钩子-04.png)

在 tML 源码中全局搜索 `GetModIcon`，一共发现了 4 个文件：



1. `UIServerModsDifferMessage.cs`：听名字就知道是服务器模块，直接 pass。

2. `UIModItem.cs`：先保留。

3. `ModLoader.cs`：就是刚才查询类本身，pass 跳过。

4. `Mod.Internals.cs`：它是 Mod 主类的内部代码，记录了图片信息，但是我们找的是“**谁调用**”了获取图片的方法，所以这个也 pass。

   

   这样一来，就只剩下 2 号文件了。我们将其打开，再次的搜索一下....

   ![图片](images/tutorials/MonoModHooks挂钩子-05.png)

   果不其然，我们要修改的目标就是`UIModItem`。

## 第二步 – 寻找解决方案

考虑到 `UIModItem` 是个 `internal` 内部类，不好直接修改它的内容，于是最直接想到的方法无疑是两种——**完全反射** 与 **On/IL 修改**。

反射？那可比较繁琐，而且简直是查源码的地狱（而且已经有教程了，我不可能再写一遍这个）。

那么接下来考虑 On/IL，我们发现这类里面有一个 `Draw` 方法：

```csharp
public override void Draw(SpriteBatch spriteBatch)
{
    _tooltip = null;
    base.Draw(spriteBatch);
    if (!string.IsNullOrEmpty(_tooltip)) {
        //var bounds = GetOuterDimensions().ToRectangle();
        //bounds.Height += 16;
        UICommon.TooltipMouseText(_tooltip);
    }
}
```

那不就来了吗！直接用 On 给这个方法上一个钩子，在原来的绘制之上覆盖一层加了特效的文字绘制就行了！

然而，当你满怀信心准备写代码时，却发现….

![图片](images/tutorials/MonoModHooks挂钩子-06.png)

用普通的 On 是修改不了 tML 的东西的。

难道只能用反射了？哦，不不不，这时候就要有请今天的主角登场了：

**MonoModHooks** – 这玩意可以让你动态挂 `On` 与 IL。

## 第三步 – 挂钩子

### MonoModHooks 简要介绍

多说无益，让我们看看 MonoModHooks 里都有什么好东西。

![图片](images/tutorials/MonoModHooks挂钩子-07.png)

哇，你是真的简洁



那么这里我就来粗略地介绍一下我们一般修改所需要用到的：

- **Modify** ：相当于对指定方法挂 IL 修改

- **Add** ：相当于对指定方法挂 On 修改，术语叫 Detour

- **DumpIL** –：一些 IL 修改会随着 tML 版本更新而失效并报错，把它和 `try-catch` 一起用，可以让失效的 IL 在日志（log）里留下报错信息，而不是直接在游戏内弹红字崩溃。如果你的 IL 修改不太重要，就应该用这个把报错写进日志，避免直接导致 Mod 无法加载。

  联系前文所说的思路，我们只需要对 `Draw` 方法调用 `MonoModHooks.Add`，并写上我们的修改即可。

  > [💡]  
  > **补充一点：**使用 `MonoModHooks` 挂的钩子（无论是 `On` 还是 `IL` 修改），tML 都会在模组卸载时**自动卸载**，不需要像以前那样手动去 `Unload` 里写卸载逻辑了，非常省心。  
  
### 进行修改

终于开始写代码了，前摇过长（

首先，按照 1.4 惯例，先继承一个 `ModSystem` 类，写上 `Load`：

```csharp
public class GoldenDisplayNameSystem : ModSystem
{
    public override void Load() {
        // 服务器上是没UI的，自然没必要挂（其他方法就不一定了）
        if (Main.dedServ) {
            return;
        }

        // 加载代码
    }
}
```

先看一下 `MonoModHooks.Add` 这个方法，是长这样的：

```csharp
public static void Add(MethodBase method, Delegate hookDelegate)
```

`MethodBase` 你想到了什么？没错，就是反射（可见，我们到最后还是无法摆脱反射）。

直接干！`typeof(UIModItem)...` 哦草，这个类是 `internal` 的。

没关系，我们可以从程序集中把它揪出来：

```csharp
// 由于原版中 UIModItem 类是内部(internal)的，无法直接使用 typeof(UIModItem) 获取其 Type 实例，所以我们要通过从程序集中寻找的方法来获取
// typeof(Main).Assembly 是原版的程序集，调用其 GetTypes() 方法并找到第一个名为 UIModItem 的 Type，即可获取到我们想要修改的类的 Type 实例
_uiModItemType = typeof(Main).Assembly.GetTypes().First(t => t.Name == "UIModItem");
```

对了，`_uiModItemType` 是我存起来的反射 `UIModItem` 的返回值，可以节约一定的性能：

```csharp
// 由于反复反射开销较大且可读性低，而实际使用中又需要多多用到反射，所以这里存储两个变量
private static Type _uiModItemType;
private static MethodInfo _drawMethod;
```

注释已经解释得明明白白了，直接下一步——挂钩子：

```csharp
// 接下来反射获取我们要修改的方法
_drawMethod = _uiModItemType.GetMethod("Draw", BindingFlags.Instance | BindingFlags.Public);

// 若方法获取成功(一般来说，只要写得没问题都是成功的)，则调用 MonoModHooks.Add 添加 RuntimeDetour
if (_drawMethod is not null) {
    // Add 相当于添加 On 命名空间的委托
    MonoModHooks.Add(_drawMethod, DrawHook);
}
```

这个 `DrawHook` 倒是挺有意思的，先看一下实现：

```csharp
// 这个委托表示原方法，包含一个类实例，以及相应方法的传入参数
// UIModItem 是内部的，无法直接获取，这里可直接用 object 替代
public delegate void DrawDelegate(object uiModItem, SpriteBatch sb);

// 等同于一个 On 命名空间委托，在里面按照 On 的逻辑写就行了
private void DrawHook(DrawDelegate orig, object uiModItem, SpriteBatch sb) {
    // 一定要记得调用原方法，不然你UI就没了
    orig.Invoke(uiModItem, sb);

    // 修改代码
}
```

为什么 `DrawDelegate` 的参数是 `object uiModItem, SpriteBatch sb`，而 `DrawHook` 是 `DrawDelegate orig, object uiModItem, SpriteBatch sb` 呢？其实，这和我们平时写 On 修改是一样的，只不过用那个有 VS 的自动补全。

参数，一般遵循以下原则：

- 首先是一个 delegate。

- 若修改的方法是实例（instance）方法，则 delegate 的第一位参数是相应的类，如 `Main main`。如果这个类是内部的，无法直接调用，使用 `object` 即可，如 `object uiModItem`。注意：若方法是静态方法则不需要这个传参。

- 接下来的参数对应原方法的参数，这里原方法是 `Draw(SpriteBatch spriteBatch)` 则为 `SpriteBatch sb`。

- 后面的传参与 delegate 相同即可。

  这里提一嘴，参考 On 命名空间下的方法，要是有返回值的方法直接把 `void` 关键字改成对应值就行了，比如：

  ```csharp
  public delegate bool PassFiltersDelegate(object uiModItem, UIModsFilterResults filterResults);
  
  private bool PassFiltersHook(PassFiltersDelegate orig, object uiModItem, UIModsFilterResults filterResults) {
      return orig.Invoke(uiModItem, filterResults);
  }
  ```

  IL 修改放到了本文的末尾。

## 第四步 – 写特效

接下来按照普通 On 写就行了，是不是很方便捏？

注：用到的 [调色板贴图](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Assets/Textures/Shader/Golden.png) 以及 [Shader文件](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Assets/Effects/Golden.xnb) 我还放在 Github 上了，直接点蓝字即可查看。

```csharp
// 等同于一个 On 命名空间委托，在里面按照 On 的逻辑写就行了
private void DrawHook(DrawDelegate orig, object uiModItem, SpriteBatch sb) {
    // 一定要记得调用原方法，不然你UI就没了
    orig.Invoke(uiModItem, sb);

    // 反射获取 _modName，后面修改以及绘制需要用到
    // 找不到 _modName 就报错
    if (_uiModItemType.GetField("_modName", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(uiModItem) is not UIText modName) {
        throw new Exception("出错啦!");
    }

    // 确保是修改自己Mod的名字 (不过你想改别的我也不拦你)
    if (!modName.Text.Contains(Mod.DisplayName)) {
        return;
    }

    // 加载所需的资源
    var texture = ModContent.Request<Texture2D>("DemoMod/Content/ModSystems/GoldenPalette");
    var shader = ModContent.Request<Effect>("DemoMod/Content/ModSystems/Golden", AssetRequestMode.ImmediateLoad).Value;

    // 传入 Shader 所需的参数
    shader.Parameters["uTime"].SetValue(Main.GlobalTimeWrappedHourly * 0.25f);
    Main.instance.GraphicsDevice.Textures[1] = texture.Value; // 传入调色板

    // 为什么y要-2呢？因为原版就这么写的。金色字实现的原理实际上是覆盖原版，所以要保证重合
    var position = modName.GetDimensions().Position() - new Vector2(0f, 2f);

    // 重新开启 SpriteBatch 以应用 Shader
    sb.End();
    // 这个Begin传参可以确保无关参数不被修改，以避免奇怪的错误
    // (而且很方便，不用去找原版都用了哪些参数)
    sb.Begin(SpriteSortMode.Immediate, sb.GraphicsDevice.BlendState,
        sb.GraphicsDevice.SamplerStates[0],
        sb.GraphicsDevice.DepthStencilState, sb.GraphicsDevice.RasterizerState,
        shader, Main.UIScaleMatrix);

    // 在开启 Shader 的情况下绘制字，注意别写成带描边的了，不然整个字就糊了
    ChatManager.DrawColorCodedString(sb, FontAssets.MouseText.Value, modName.Text,
        position, Color.White, 0f, Vector2.Zero, Vector2.One);

    // 重新开启 SpriteBatch 以去除 Shader
    sb.End();
    sb.Begin(SpriteSortMode.Deferred, sb.GraphicsDevice.BlendState,
        sb.GraphicsDevice.SamplerStates[0],
        sb.GraphicsDevice.DepthStencilState, sb.GraphicsDevice.RasterizerState, null,
        Main.UIScaleMatrix);
}
```

### Shader 简单介绍

还是简要说一下。

实际上就只是一个简单的映射 – 将绘制贴图的坐标映射到调色板上：

```plaintext
sampler uTextImage : register(s0); // SpriteBatch.Draw 的内容会自动绑定到 s0
sampler uGoldenBar : register(s1); // 用于获取颜色的调色板
float uTime; // 实现调色板的滚动效果

float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0
{
    float4 color = tex2D(uTextImage, coords);

    // any 为 false 即透明色，不能改
    if (!any(color))
        return color;

    // 根据 uTextImage 坐标以及 uTime 的值获取在调色板上的坐标，注意要 %1.0 以确保他在 [0, 1) 区间内
    float2 barCoord = float2((coords.x + uTime) % 1.0, 0);

    // 在调色板上选择颜色
    return tex2D(uGoldenBar, barCoord) * color;
}
```

而"闪动"特效由 `uTime` 控制，实现一个类似于滚动调色板的效果，使得每一个像素的颜色都动态改变，并且较为柔和。

调色板贴图——以防 Github 上不去，这里也贴个预览，就是一个金色的条条，而且左右是可以无缝衔接的。

![图片](images/tutorials/MonoModHooks挂钩子-08.png)

*要是把这个贴图改成* ***彩虹条（原版贴图里面有）**就实现了彩虹字。*

自此，闪动的金色字特效就完成了：

![图片](images/tutorials/MonoModHooks挂钩子-09.gif)

***有一种童话的感觉***

特效啥的我都没着重介绍（然而这是我花得时间最长的），毕竟重点在 **MonoModHooks**，不是特效。

---

# 使用 MonoModHooks 添加 IL 修改

你还可以使用 **MonoModHooks** 添加 IL 修改注册，使用 `MonoModHooks.Modify` 即可。

```csharp
private static Type _uiModItemType;
private static MethodInfo _drawMethod;

public override void Load() {
    if (Main.dedServ) {
        return;
    }

    _uiModItemType = typeof(Main).Assembly.GetTypes().First(t => t.Name == "UIModItem");
    _drawMethod = _uiModItemType.GetMethod("Draw", BindingFlags.Instance | BindingFlags.Public);

    if (_drawMethod is not null) {
        MonoModHooks.Modify(_drawMethod, Manipulate);
    }
}

private void Manipulate(ILContext il) {
    // 编写你的IL代码
}
```

---

# 使用RenderTarget2D 实现滚动颜色

其实经过仔细观察，你会发现这个文本实际上并不是如预期的那样——颜色从右往左滚动，而是每个字一个颜色，还都互不关联。

这是为什么呢？实际上字体在游戏里是以图片的形式存储的，而 `ChatManager.DrawColorCodedString`（内部实现是 `SpriteBatch.DrawString`）则是对指定的字符串中的每一个字符，绘制其在字体文件（本质上就是一堆图片）中对应的图片。而 Shader 是对每一次绘制作用，并非对整个整体。因此整体就看起来没有关联且混乱了。

使用 **RenderTarget2D** 可以解决这个问题（似乎离本文主题更远了呢），即通过提前将整体绘制到 **RenderTarget2D** 中去，最后给 **RenderTarget2D** 上 **Shader** 绘制外显。

首先是定义 **RenderTarget2D**：

```csharp
// 用于滚动颜色效果
private static RenderTarget2D _renderTarget;
```

随后，在绘制前某个地方实例化 RenderTarget 并将内容绘制到 RenderTarget 上（一定得是主线程），我这里在 **Load** 方法中通过 `Main.QueueMainThreadAction` 在主线程运行代码。

这里这段代码在加载时是仅运行一次的，因为 `_renderTarget` 所包含的内容不需要变动（实际上永远是位于 (0,0) 的白色的 Example Mod v1.0 字样）。这么做可以节省一定资源：

```csharp
public override void Load()
{
    // 之前的代码......

    // 在主线程上运行，否则会报错
    Main.QueueMainThreadAction(() => {
        // 文字内容与长宽
        string text = Mod.DisplayName + " v" + Mod.Version;
        var size = ChatManager.GetStringSize(FontAssets.MouseText.Value, text, Vector2.One).ToPoint();

        // 实例化 RenderTarget，这里 width 和 height 使用 size 的值就行了
        _renderTarget = new RenderTarget2D(Main.graphics.GraphicsDevice, size.X, size.Y);

        Main.spriteBatch.Begin();

        // 设置 RenderTarget 为我们的
        Main.graphics.GraphicsDevice.SetRenderTarget(_renderTarget);
        Main.graphics.GraphicsDevice.Clear(Color.Transparent);

        // 绘制字，注意别写成带描边的了，不然整个字就糊了
        ChatManager.DrawColorCodedString(Main.spriteBatch, FontAssets.MouseText.Value,
            text, Vector2.Zero, Color.White, 0f, Vector2.Zero, Vector2.One);

        // 还原
        Main.spriteBatch.End();
        Main.graphics.GraphicsDevice.SetRenderTarget(null);
    });
}
```

最后，将我们造的 `DrawHook` 钩子中，原来的文字绘制替换成下面的代码即可：

```csharp
sb.Draw(_renderTarget, position, Color.White);
```

同样地，要在 Unload 中将其设为 `null`，释放垃圾：

```csharp
public override void Unload()
{
    if (_renderTarget is not null)
    {
        _renderTarget.Dispose(); 
        _renderTarget = null;
    }
    base.Unload();
}
```

最终呈现效果：

![图片](images/tutorials/MonoModHooks挂钩子-10.gif)

格调，太有格调了

![图片](images/tutorials/MonoModHooks挂钩子-11.gif)

有种纯真，啊不，是童真的美\~

## 来点作业

现在你已经基本掌握了 **MonoModHooks** 动态挂钩子并给 **Mod** 名字上特效了，那么就顺带着把动态 **Mod** 图标做了吧！我相信这对你们来说只是小菜一碟（

---

# 彩蛋



**银月** 2023年7月25日 上午8:40

无论 tml 是否提供了 On 和 IL 的自动卸载，modder 都牢记进行卸载。代码卸载后清理所有痕迹并还原应是每个程序员的责任。你也不想变得和 360 以及金山毒霸一样臭名昭著吧。



**CYRIL** 2023年7月30日 下午11:31

层主说得很对，"代码卸载后清理所有痕迹并还原应是每个程序员的责任"是正确的。但要注意的是，自己在 Unload 卸载这玩意没有任何意义，因为在 Unload（这里指该 Mod 一切继承 ModType 类的 Unload 方法）执行时你的 mod 的一切 detour 与 il editing 已被 tml 卸载。可以这么说：你应该将一切东西卸载，但 detour 与 il editing 是例外。将不手动卸载 detour 与 il editing 比喻作"变得和 360 以及金山毒霸一样"则是不明智的，因为我们在 tml 的框架下编写代码。



此外，从零开始的 mod 制作教程 qq 群内确实有 modder 出现了自行卸载反而导致无法正常卸载以致报错的情况（删掉自行卸载代码后可以正常运行），不过那是很久以前的事情了，且似乎只对某些 hook 出问题。



在 tml 官方教程 [https://github.com/tModLoader/tModLoader/wiki/Detouring-and-IL-Editing-using-HookEndpointManager](https://github.com/tModLoader/tModLoader/wiki/Detouring-and-IL-Editing-using-HookEndpointManager) 中标粗提到：

*tModLoader will make sure all detours and IL edits are unloaded during mod unloading, there is no need to manually unregister them.*



我并非不提倡自行卸载，只是将一些事实摆在这里，如果你的 detour 或 il editing 通过 tml 卸载无法完全清理痕迹，那么自行卸载是好事，且应当被大力提倡。



*©2026 冬天的叶 &amp;* *Cyril* *\| 仅供个人学习，禁止商用二次分发*

