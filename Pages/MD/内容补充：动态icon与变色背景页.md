作者：冬天的叶  2026/11/2 \| 🔖 专业

[叶子的TModLoader教程](%E4%B8%BB%E9%A1%B5.md)

不知道第几个TModLoader教程说是....

---

在[通过 MonoModHooks 动态挂钩子.otl](%E9%80%9A%E8%BF%87%20MonoModHooks%20%E5%8A%A8%E6%80%81%E6%8C%82%E9%92%A9%E5%AD%90.md)教程中，**Cyril老师** 留了一道制作 动态icon的作业。

根据教程里学到的知识完成这篇作业也是非常简单。但是，作为一名有追求的 Mod 开发者，仅仅完成基础作业显然是不够的。因此，本期教程我们不仅要实现动态图标，还要在此基础上，对 `UIModItem` 的底层绘制逻辑进行一点“小小的”扩展……比如，加一个动态变色的背景底板。虽然这会让列表看起来稍显复杂，但：



**模组好不好玩是一回事，帅不帅是一辈子的事。**



这期教程不是什么常规教程，就不要求大家学会什么了，大家玩的开心就好。

---

# 制作动态icon

## 寻找切入点

和上期教程一样，我们先来到 `UIModItem` 这个类里，查看Mod列表绘制图片是怎么实现的。找了一圈，发现绘制的源头还是上一期教程讲过的 `Draw` 方法：

```csharp
public override void Draw(SpriteBatch spriteBatch)
{
    _tooltip = null;
    base.Draw(spriteBatch);   // ← 原版绘制全在这里
    if (!string.IsNullOrEmpty(_tooltip)) {
        UICommon.TooltipMouseText(_tooltip);
    }
}
```

像vs之类的编译器，一般都有通过方法查看继承自哪个类的功能。

我们把鼠标放上去就能够得知：

![图片](images/tutorials/动态icon与变色背景-01.png)

原来这个方法是继承自`UIElement`，进去看看。

```csharp
/// <summary>
/// 负责绘制此元素及其所有子元素（叠在此元素之上）。
/// 会先调用 <see cref="DrawSelf(SpriteBatch)"/>，然后再调用 <see cref="DrawChildren(SpriteBatch)"/>。
/// UIElement 的自定义渲染通常都在 <see cref="DrawSelf(SpriteBatch)"/> 中完成。
/// 重写此方法在需要于子元素绘制后执行逻辑时很有用，但请记住不要删掉 <c>base.Draw(spriteBatch);</c>。
/// </summary>
public virtual void Draw(SpriteBatch spriteBatch)
{
    // 如果存在自定义绘制委托，先调用它
    if (this.OnDraw != null)
        this.OnDraw(this, spriteBatch);

    // 保存当前的裁剪/采样/光栅化状态，以便绘制结束后恢复
    bool overflowHidden = OverflowHidden;
    bool useImmediateMode = UseImmediateMode;
    RasterizerState rasterizerState = spriteBatch.GraphicsDevice.RasterizerState;
    Rectangle scissorRectangle = spriteBatch.GraphicsDevice.ScissorRectangle;
    SamplerState anisotropicClamp = SamplerState.AnisotropicClamp;

    // 如果强制使用即时模式，或者指定了覆盖的采样器状态
    if (useImmediateMode || OverrideSamplerState != null)
    {
        spriteBatch.End();
        // 用即时模式（或默认模式）+ 指定的采样器状态重新 Begin
        spriteBatch.Begin(useImmediateMode ? SpriteSortMode.Immediate : SpriteSortMode.Deferred,
            BlendState.AlphaBlend,
            (OverrideSamplerState != null) ? OverrideSamplerState : anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
        DrawSelf(spriteBatch);
        spriteBatch.End();
        // 恢复为默认的延迟模式
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
    }
    else
    {
        // 普通模式，直接绘制自身
        DrawSelf(spriteBatch);
    }

    // 如果启用了溢出隐藏，需要设置裁剪矩形
    if (overflowHidden)
    {
        spriteBatch.End();
        Rectangle clippingRectangle = GetClippingRectangle(spriteBatch);

        /*
        spriteBatch.GraphicsDevice.ScissorRectangle = clippingRectangle;
        */
        // 与当前裁剪区域取交集，避免超出屏幕/父容器
        Rectangle adjustedClippingRectangle = Rectangle.Intersect(clippingRectangle, spriteBatch.GraphicsDevice.ScissorRectangle);
        spriteBatch.GraphicsDevice.ScissorRectangle = adjustedClippingRectangle;

        // 启用裁剪光栅化状态，重新 Begin
        spriteBatch.GraphicsDevice.RasterizerState = OverflowHiddenRasterizerState;
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
    }

    // 绘制所有子元素
    DrawChildren(spriteBatch);

    // 恢复裁剪和光栅化状态
    if (overflowHidden)
    {
        // TML: 保存新的光栅化状态快照以便恢复
        rasterizerState = spriteBatch.GraphicsDevice.RasterizerState;

        spriteBatch.End();
        spriteBatch.GraphicsDevice.ScissorRectangle = scissorRectangle;
        spriteBatch.GraphicsDevice.RasterizerState = rasterizerState;
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, rasterizerState, null, Main.UIScaleMatrix);
    }
}
```

通过查看 `UIElement.Draw` 的源码，我们知道了：

`UIModItem` 的绘制链路（`DrawSelf` + `DrawChildren`）全程在同一个 `SpriteBatch.Begin` 状态内完成，且用的是 `Main.UIScaleMatrix`。

所以我们可以通过反射拿到 `_modIcon` 的 `UIImage` 引用，并用 `GetDimensions()` 取得它在 UI 逻辑坐标下的位置与尺寸。有了位置与尺寸以后，再按 `ScaleToFit` 规则，计算出等比缩放后的目标矩形 `dest`，在`orig.Invoke` 返回时直接使用 `sb.Draw` 方法传入`texture, dest, Color.White`。

这样由我们绘制模组图标，它的坐标系、混合状态、采样器、矩阵之类的参数就与原版图标完全一致，天然对齐、无需更多操作。

---

## 代码部分

讲了那么多，终于来到了代码部分了

首先，按照 1.4 惯例，先继承一个 `ModSystem` 类，写上 `Load`：

```csharp
public class DynamicModIconSystem : ModSystem
{
    // 帧切换间隔（帧数）
    private int FrameInterval => 20;

    // 动态图标贴图路径（不含编号）
    private string IconPathPrefix => "DemoMod/Content/ModSystems/icon";

    // 动态图片总数量
    private int IconCount => 3;

    // 上面参数其实用常量更好，但我想动态调。

    private static Type _uiModItemType;
    private static MethodInfo _drawMethod;
    private static Asset<Texture2D>[] _iconAssets;

    public override void Load()
    {
        // 服务端没有 UI，直接跳
        if (Main.dedServ)
            return;

        // 按 IconCount 预加载动态图标
        // 用 ImmediateLoad 是为了保证 Load 结束时贴图已就绪，避免第一次绘制取到空资源
        _iconAssets = new Asset<Texture2D>[IconCount];
        for (int i = 0; i < IconCount; i++)
            _iconAssets[i] = ModContent.Request<Texture2D>($"{IconPathPrefix}{i}", AssetRequestMode.ImmediateLoad);



        // UIModItem 是 internal 类，拿不到 typeof(UIModItem)，只能按名字找
        _uiModItemType = typeof(Main).Assembly.GetTypes().First(t => t.Name == "UIModItem");

        // 反射拿到要 hook 的 Draw 方法
        _drawMethod = _uiModItemType.GetMethod("Draw", BindingFlags.Instance | BindingFlags.Public);


        // 拿到 hook 的 Draw 方法 才挂钩子 一般情况下应该是拿得到的
        if (_drawMethod is not null)
            MonoModHooks.Add(_drawMethod, DrawHook);
    }
}
```

由于反复反射开销较大且可读性低，而实际使用中又需要多多用到反射，所以这里提前存储几个变量，然后我们写绘制方法：

```csharp
// 计时器
private static int _frameCounter;
// 当前播放的图片帧
private static int _currentFrame;

// 对应 UIModItem.Draw 的委托：第一个参数是实例（internal 类用 object 顶替）
// 之后照抄原方法参数 SpriteBatch sb 
public delegate void DrawDelegate(object uiModItem, SpriteBatch sb);

private void DrawHook(DrawDelegate orig, object uiModItem, SpriteBatch sb)
{
    // 先让原版把整行 UI 画完（含原图标）
    orig.Invoke(uiModItem, sb);

    // 反射拿 _modName，用来判断是不是自己的 Mod
    if (_uiModItemType.GetField("_modName", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(uiModItem) is not UIText modName)
        return;

    if (!modName.Text.Contains(Mod.DisplayName))
        return;

    // 反射拿 _modIcon
    if (_uiModItemType.GetField("_modIcon", BindingFlags.NonPublic | BindingFlags.Instance)?.GetValue(uiModItem) is not UIImage modIcon)
        return;

    // 如果拿到的资源有问题，就先跳了
    if (_iconAssets is null || _iconAssets.Length == 0)
        return;


    // 计时器 +1（注意 ++ 写在前面，这样 >= 比较时用的就是加 1 后的新值）
    // 如果计时器达到了切换间隔，就切下一图片帧
    if (++_frameCounter >= FrameInterval)
    {
        _frameCounter = 0; // 重置计时器

        // 将当前图片帧数 +1；
        // 利用取模（%）运算，当帧数达到最大数量（IconCount）时，会自动变回 0，实现循环播放
        _currentFrame = (_currentFrame + 1) % IconCount;
    }

    var texture = _iconAssets[_currentFrame].Value;

    // 计算绘制区域：和 UIImage 的 ScaleToFit 对齐
    var dims = modIcon.GetDimensions();
    var dest = GetScaledDestination(texture, dims);

    // 在 shader 无关的默认 batch 下直接覆盖绘制
    // 此时 sb 处于 Begin 状态（orig 结束后由 UI 系统维持）
    // sb.Draw(texture, dest, Color.White);
    sb.Draw(texture, dest, Color.White);  // 强制染红，排除贴图全白看不见
}

/// <summary>
/// 按 UIImage.ScaleToFit = true 的规则，把 texture 等比缩放进 dims 矩形并居中。
/// </summary>
private static Rectangle GetScaledDestination(Texture2D texture, CalculatedStyle dims)
{
    float scale = Math.Min(dims.Width / texture.Width, dims.Height / texture.Height);
    int w = (int)(texture.Width * scale);
    int h = (int)(texture.Height * scale);
    int x = (int)(dims.X + (dims.Width - w) / 2f);
    int y = (int)(dims.Y + (dims.Height - h) / 2f);
    return new Rectangle(x, y, w, h);
}
```

完成之后，让我们进入游戏……

|等等，我们是不是忘了什么？<br>|![图片](images/tutorials/动态icon与变色背景-02.gif)<br>|**我去，我忘放图片了！**<br>|
|---|---|---|


---

## 贴图部分

![图片](images/tutorials/动态icon与变色背景-03.png)

[Icons.zip](https://www.kdocs.cn/l/cgjWaBF3rgEk?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1ODEzMzEyOTQ3NDciLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6InppcCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2dqV2FCRjNyZ0VrIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU4MTIyOTI2OTUxOSJ9)

**动态模组图标 肯定**需要一些贴图来显示游戏里的形象，如果你没有准备贴图也没关系，教程这边给大家提供了一些贴图，大家可以下载使用。

动图的制作没有什么硬性要求，大家可以自由发挥。不过，虽然我在代码中并没有强制限制图片尺寸，但还是建议 **每张序列图都使用 80×80 的 PNG 文件**，和 TML 模组图标的尺寸要求保持一致。



现在我们终于能够进入游戏，查看我们画的内容了：

![图片](images/tutorials/动态icon与变色背景-04.gif)

也是十分的炫酷啊

---

# 制作变色背景页

## 寻找切入点

OK，模组图片和名字全都改过一遍了，接下来改改这个紫蓝色的背景了。shader使用上期教程给字体上色的那个特效。不过在此之前，我们先来查看背景页绘制的源码：

```csharp
private void DrawPanel(SpriteBatch spriteBatch, Texture2D texture, Color color)
{
    CalculatedStyle dimensions = GetDimensions();
    Point point = new Point((int)dimensions.X, (int)dimensions.Y);
    Point point2 = new Point(point.X + (int)dimensions.Width - _cornerSize, point.Y + (int)dimensions.Height - _cornerSize);
    int width = point2.X - point.X - _cornerSize;
    int height = point2.Y - point.Y - _cornerSize;
    spriteBatch.Draw(texture, new Rectangle(point.X, point.Y, _cornerSize, _cornerSize), new Rectangle(0, 0, _cornerSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point2.X, point.Y, _cornerSize, _cornerSize), new Rectangle(_cornerSize + _barSize, 0, _cornerSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point.X, point2.Y, _cornerSize, _cornerSize), new Rectangle(0, _cornerSize + _barSize, _cornerSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point2.X, point2.Y, _cornerSize, _cornerSize), new Rectangle(_cornerSize + _barSize, _cornerSize + _barSize, _cornerSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point.X + _cornerSize, point.Y, width, _cornerSize), new Rectangle(_cornerSize, 0, _barSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point.X + _cornerSize, point2.Y, width, _cornerSize), new Rectangle(_cornerSize, _cornerSize + _barSize, _barSize, _cornerSize), color);
    spriteBatch.Draw(texture, new Rectangle(point.X, point.Y + _cornerSize, _cornerSize, height), new Rectangle(0, _cornerSize, _cornerSize, _barSize), color);
    spriteBatch.Draw(texture, new Rectangle(point2.X, point.Y + _cornerSize, _cornerSize, height), new Rectangle(_cornerSize + _barSize, _cornerSize, _cornerSize, _barSize), color);
    spriteBatch.Draw(texture, new Rectangle(point.X + _cornerSize, point.Y + _cornerSize, width, height), new Rectangle(_cornerSize, _cornerSize, _barSize, _barSize), color);
}
```

哎呀坏了，我们在实操中发现：`UIModItem` 的背景根本不是什么贴图，而是 `UIPanel` 用 `BackgroundColor` 画出来的一个纯色矩形！

给纯色矩形套 Shader 是毫无意义的——因为 Shader 拿到的每个像素颜色都一模一样，根本做不出流动的视觉效果。难道真的没办法了吗？

其实还是有的。要想上 Shader，背景就必须是一张“贴图”才行。那么，有没有什么东西可以把整个画面变成类似贴图的存在呢？没错，就是上期用过的 **`RenderTarget2D`**。

先把背景渲染到 **RT** 上，再对整张 **RT** 套用 **Shader**，这样流动效果就能连贯。不过，这里还有一个关于“图层顺序”的问题必须解决：

背景是垫在图标和文字下面的。但在 `UIModItem.Draw` 的绘制顺序里，是先执行 `DrawSelf`（画底子），再执行 `DrawChildren`（画图标文字）。如果你在 `orig`（原方法）**之后**画背景，就会把图标盖住；但在 `orig` **之前**画，又会被原版的纯色背景给盖住。

不过再次查看源码：

```csharp
/// <summary>
/// 负责绘制此元素及其所有子元素（叠在此元素之上）。
/// 会先调用 <see cref="DrawSelf(SpriteBatch)"/>，然后再调用 <see cref="DrawChildren(SpriteBatch)"/>。
/// UIElement 的自定义渲染通常都在 <see cref="DrawSelf(SpriteBatch)"/> 中完成。
/// 重写此方法在需要于子元素绘制后执行逻辑时很有用，但请记住不要删掉 <c>base.Draw(spriteBatch);</c>。
/// </summary>
public virtual void Draw(SpriteBatch spriteBatch)
{
    // 如果存在自定义绘制委托，先调用它
    if (this.OnDraw != null)
        this.OnDraw(this, spriteBatch);

    // 保存当前的裁剪/采样/光栅化状态，以便绘制结束后恢复
    bool overflowHidden = OverflowHidden;
    bool useImmediateMode = UseImmediateMode;
    RasterizerState rasterizerState = spriteBatch.GraphicsDevice.RasterizerState;
    Rectangle scissorRectangle = spriteBatch.GraphicsDevice.ScissorRectangle;
    SamplerState anisotropicClamp = SamplerState.AnisotropicClamp;

    // 如果强制使用即时模式，或者指定了覆盖的采样器状态
    if (useImmediateMode || OverrideSamplerState != null)
    {
        spriteBatch.End();
        // 用即时模式（或默认模式）+ 指定的采样器状态重新 Begin
        spriteBatch.Begin(useImmediateMode ? SpriteSortMode.Immediate : SpriteSortMode.Deferred,
            BlendState.AlphaBlend,
            (OverrideSamplerState != null) ? OverrideSamplerState : anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
        DrawSelf(spriteBatch);
        spriteBatch.End();
        // 恢复为默认的延迟模式
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
    }
    else
    {
        // 普通模式，直接绘制自身
        DrawSelf(spriteBatch);
    }

    // 如果启用了溢出隐藏，需要设置裁剪矩形
    if (overflowHidden)
    {
        spriteBatch.End();
        Rectangle clippingRectangle = GetClippingRectangle(spriteBatch);

        /*
        spriteBatch.GraphicsDevice.ScissorRectangle = clippingRectangle;
        */
        // 与当前裁剪区域取交集，避免超出屏幕/父容器
        Rectangle adjustedClippingRectangle = Rectangle.Intersect(clippingRectangle, spriteBatch.GraphicsDevice.ScissorRectangle);
        spriteBatch.GraphicsDevice.ScissorRectangle = adjustedClippingRectangle;

        // 启用裁剪光栅化状态，重新 Begin
        spriteBatch.GraphicsDevice.RasterizerState = OverflowHiddenRasterizerState;
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, OverflowHiddenRasterizerState, null, Main.UIScaleMatrix);
    }

    // 绘制所有子元素
    DrawChildren(spriteBatch);

    // 恢复裁剪和光栅化状态
    if (overflowHidden)
    {
        // TML: 保存新的光栅化状态快照以便恢复
        rasterizerState = spriteBatch.GraphicsDevice.RasterizerState;

        spriteBatch.End();
        spriteBatch.GraphicsDevice.ScissorRectangle = scissorRectangle;
        spriteBatch.GraphicsDevice.RasterizerState = rasterizerState;
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.AlphaBlend, anisotropicClamp,
            DepthStencilState.None, rasterizerState, null, Main.UIScaleMatrix);
    }
}
```

我们发现 `UIElement.Draw` 的顺序是 `DrawSelf` → `DrawChildren`。所以我们要 hook `DrawSelf` 并在 `base.DrawSelf` 之后、画图标之前 插入背景绘制，这样背景就会出现在图标下面。

---

## 代码部分

讲了那么多，终于又来到了代码部分了（我为什么要说又？）

首先，按照 1.4 惯例，先继承一个 `ModSystem` 类，写上 `Load`：

```csharp
public class ModBackgroundShaderSystem : ModSystem
{
    // 反射缓存
    private static Type _uiModItemType;
    private static MethodInfo _drawSelfMethod;

    // 背景 RT
    private static RenderTarget2D _bgRt;
    private static Point _bgRtSize;

    // 资源缓存
    private static Asset<Texture2D> _panelBackground; // 原版九宫格背景贴图
    private static Asset<Texture2D> _palette;         // shader 的 s1 调色板
    private static Effect _shader;                    // 背景流动/渐变 Effect

    public override void Load()
    {
        // 服务端无 UI，直接跳过
        if (Main.dedServ)
            return;

        // 反射拿 UIModItem 类型（internal，只能按名字找）和要 hook 的 DrawSelf 方法
        _uiModItemType = typeof(Main).Assembly.GetTypes().First(t => t.Name == "UIModItem");
        _drawSelfMethod = _uiModItemType.GetMethod("DrawSelf",
            BindingFlags.Instance | BindingFlags.NonPublic);

        // 挂 detour（tML 卸载时自动清理）
        if (_drawSelfMethod is not null)
            MonoModHooks.Add(_drawSelfMethod, DrawSelfHook);

        // 预加载资源：九宫格背景贴图、调色板、shader，避免每帧 Request
        _panelBackground = Main.Assets.Request<Texture2D>("Images/UI/PanelBackground",
            AssetRequestMode.ImmediateLoad);
        _palette = ModContent.Request<Texture2D>("DemoMod/Content/ModSystems/GoldenPalette",
            AssetRequestMode.ImmediateLoad);
        _shader = ModContent.Request<Effect>("DemoMod/Content/ModSystems/Golden",
            AssetRequestMode.ImmediateLoad).Value;
    }
}
```

为了防止玩家调整 UI 缩放后，我们的模组位置发生偏移，我们需要将 RT 改为动态获取。

```csharp
/// <summary>
/// 确保背景 RT 存在且尺寸为 w×h；尺寸不变就复用，变了才重建。
/// RT 里用九宫格画 PanelBackground，保留原版圆角。
/// </summary>
private static void EnsureBgRt(int w, int h)
{
    if (_bgRt is not null && _bgRtSize.X == w && _bgRtSize.Y == h)
        return;

    _bgRt?.Dispose();
    _bgRt = null;

    // RT 创建 / SetRenderTarget 必须在主线程；异步执行，首次调用时本帧 _bgRt 仍为 null
    Main.QueueMainThreadAction(() =>
    {
        _bgRt = new RenderTarget2D(Main.graphics.GraphicsDevice, w, h);
        _bgRtSize = new Point(w, h);

        Main.graphics.GraphicsDevice.SetRenderTarget(_bgRt);
        Main.graphics.GraphicsDevice.Clear(Color.Transparent);

        // 九宫格画背景（保留圆角）
        // 原版颜色可以使用 new Color(73, 94, 171)
        Main.spriteBatch.Begin();
        DrawPanelToRt(Main.spriteBatch, _panelBackground.Value,
         Color.White , 0, 0, w, h);
        Main.spriteBatch.End();

        Main.graphics.GraphicsDevice.SetRenderTarget(null);
    });
}
```

这里的 UI 背景九宫格我复刻了原版的样式，方便你们套用各式各样的 Shader 不出问题。

```csharp
/// <summary>
/// 复刻 UIPanel.DrawPanel：把九宫格贴图切成 9 块拼成矩形。
/// cornerSize / barSize 和 UIPanel 默认一致（12 / 4）。
/// 末尾额外复刻了 UIModItem.DrawSelf 里的分隔线。
/// </summary>
private static void DrawPanelToRt(SpriteBatch sb, Texture2D texture, Color color,
    int x, int y, int w, int h, int cornerSize = 12, int barSize = 4)
{
    Point p = new Point(x, y);
    Point p2 = new Point(x + w - cornerSize, y + h - cornerSize);
    int width = p2.X - p.X - cornerSize;
    int height = p2.Y - p.Y - cornerSize;

    // 四角
    sb.Draw(texture, new Rectangle(p.X, p.Y, cornerSize, cornerSize),
        new Rectangle(0, 0, cornerSize, cornerSize), color);
    sb.Draw(texture, new Rectangle(p2.X, p.Y, cornerSize, cornerSize),
        new Rectangle(cornerSize + barSize, 0, cornerSize, cornerSize), color);
    sb.Draw(texture, new Rectangle(p.X, p2.Y, cornerSize, cornerSize),
        new Rectangle(0, cornerSize + barSize, cornerSize, cornerSize), color);
    sb.Draw(texture, new Rectangle(p2.X, p2.Y, cornerSize, cornerSize),
        new Rectangle(cornerSize + barSize, cornerSize + barSize, cornerSize, cornerSize), color);

    // 四边
    sb.Draw(texture, new Rectangle(p.X + cornerSize, p.Y, width, cornerSize),
        new Rectangle(cornerSize, 0, barSize, cornerSize), color);
    sb.Draw(texture, new Rectangle(p.X + cornerSize, p2.Y, width, cornerSize),
        new Rectangle(cornerSize, cornerSize + barSize, barSize, cornerSize), color);
    sb.Draw(texture, new Rectangle(p.X, p.Y + cornerSize, cornerSize, height),
        new Rectangle(0, cornerSize, cornerSize, barSize), color);
    sb.Draw(texture, new Rectangle(p2.X, p.Y + cornerSize, cornerSize, height),
        new Rectangle(cornerSize + barSize, cornerSize, cornerSize, barSize), color);

    // 中间填充部分
    sb.Draw(texture, new Rectangle(p.X + cornerSize, p.Y + cornerSize, width, height),
        new Rectangle(cornerSize, cornerSize, barSize, barSize), color);

    // 分隔线


    // 分隔线起点（相对 RT 左上角，单位像素）

    var dividerStart = new Vector2(-6, 6);

    const int iconAdjust = 85 + 12;

    var drawPos = new Vector2(x + 5 + iconAdjust + dividerStart.X, y + 30f + dividerStart.Y);
    var scale = new Vector2((w - 10f - iconAdjust) / 8f, 1f);
    sb.Draw(UICommon.DividerTexture.Value, drawPos, null, Color.White, 0f, Vector2.Zero,
        scale, SpriteEffects.None, 0f);
}
```

写都写了，把模组判断也塞到方法里，统一管理

```csharp
/// <summary>
/// 判断当前 UIModItem 是不是自己的 Mod（反射 _modName，用显示名匹配）。
/// 字段不存在或类型不对返回 false，不崩。
/// </summary>
private static bool IsMyMod(object uiModItem, string displayName)
{
    if (_uiModItemType.GetField("_modName", BindingFlags.NonPublic | BindingFlags.Instance)
            ?.GetValue(uiModItem) is not UIText modName)
        return false;

    return modName.Text.Contains(displayName);
}
```

注意 我们需要 **包括边框在内** 的整行区域，所以取尺寸要使用 `GetDimensions()` 

```csharp
// 对应 UIModItem.DrawSelf 的委托：实例方法，第一个参数是实例（internal 类用 object 顶替），
// 之后照抄原方法参数 SpriteBatch sb
public delegate void DrawSelfDelegate(object uiModItem, SpriteBatch sb);

private void DrawSelfHook(DrawSelfDelegate orig, object uiModItem, SpriteBatch sb)
{
    // 不是自己的 Mod：原版怎么画就怎么画
    if (!IsMyMod(uiModItem, Mod.DisplayName))
    {
        orig.Invoke(uiModItem, sb);
        return;
    }

    var uiElement = (UIElement)uiModItem;

    // 取整行的尺寸（含边框）
    var dims = uiElement.GetDimensions();
    int w = (int)dims.Width;
    int h = (int)dims.Height;

    // 尺寸异常或资源未就绪：退回原版
    if (w <= 0 || h <= 0 || _shader is null || _palette is null || _panelBackground is null)
    {
        orig.Invoke(uiModItem, sb);
        return;
    }

    // 确保背景 RT 就绪
    EnsureBgRt(w, h);
    if (_bgRt is null)
    {
        orig.Invoke(uiModItem, sb);
        return;
    }

    // 原版背景透明化，避免盖住 shader 背景
    var panel = (UIPanel)uiModItem;
    Color bgColor = panel.BackgroundColor;
    panel.BackgroundColor = Color.Transparent;

    // 原版画边框、分隔线、重载提示等
    orig.Invoke(uiModItem, sb);

    // 恢复背景色
    panel.BackgroundColor = bgColor;

    // 对 RT 套 shader 画回整行
    _shader.Parameters["uTime"].SetValue(Main.GlobalTimeWrappedHourly * 0.25f);
    Main.instance.GraphicsDevice.Textures[1] = _palette.Value;

    var dest = new Rectangle((int)dims.X, (int)dims.Y, w, h);

    sb.End();
    sb.Begin(SpriteSortMode.Immediate, sb.GraphicsDevice.BlendState,
        sb.GraphicsDevice.SamplerStates[0],
        sb.GraphicsDevice.DepthStencilState, sb.GraphicsDevice.RasterizerState,
        _shader, Main.UIScaleMatrix);

    sb.Draw(_bgRt, dest, Color.White);

    sb.End();
    sb.Begin(SpriteSortMode.Deferred, sb.GraphicsDevice.BlendState,
        sb.GraphicsDevice.SamplerStates[0],
        sb.GraphicsDevice.DepthStencilState, sb.GraphicsDevice.RasterizerState, null,
        Main.UIScaleMatrix);
}
```

同样地，要在 Unload 中将其设为 `null`，释放垃圾：

```csharp
 public override void Unload()
 {
     _bgRt?.Dispose();
     _bgRt = null;
     _panelBackground = null;
     _palette = null;
     _shader = null;
     _uiModItemType = null;
     _drawSelfMethod = null;
 }
```

最终呈现效果：

> [👓]  
> ![图片](images/tutorials/动态icon与变色背景-05.gif)  

好吧，感觉有点过于闪瞎眼了。

---

# 结尾

那么，我们的教程到这里就圆满结束啦！其实，**TModLoader** 对动态模组图标的态度有些模糊不清。他们承认这是个需求，但并没有采纳，在官方文档中也明确写了：**仅支持静态图标**。

因此，我们应该在 **模组设置** 内加入 允许玩家关闭彩色字、关闭背景上色 以及 关闭动态图标 的选项，以满足不同玩家需求。



## 作业

给大家留点大作业：

**进阶：**在动态模组图标的绘制中，把“读取单张图片绘制”改成“读取序列图绘制”。

**困难：**看到模组右下角那个问号了吗？把那个问号，以及问号后面的按钮也给摸透，把它们也改一改！



*©2026 冬天的叶 \| 仅供个人学习，禁止商用二次分发*

