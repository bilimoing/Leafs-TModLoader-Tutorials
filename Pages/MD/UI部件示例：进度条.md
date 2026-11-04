原作者：幽白银 再版：冬天的叶  2026/11/3 \| 🔖 GUI, 进阶

[叶子的TModLoader教程](%E4%B8%BB%E9%A1%B5.md)

不知道第几个TModLoader教程说是....

---

# 基础准备

上一章我们使用了 Tr 原生的 UI 部件（`UIPanel` 和 `UIImageButton`），想必大家也想知道如何制作属于自己的 UI 部件。这章我们就来讲一个示例：**进度条**。~~（我绝对不是为了省事才选择讲进度条的。）~~

它的作用可不止显示进度，

用来显示血量、能量等数值都非常方便。这章我们就拿它来显示当前玩家的血量。



![图片](images/tutorials/UI进度条例子-01.png)

首先，我们在 `UIs` 文件夹里新建一个名为 `Images` 的文件夹，专门用来存放贴图。

![图片](images/tutorials/UI进度条例子-02.png)

![图片](images/tutorials/UI进度条例子-03.png)

当然，进度条也需要贴图才能在游戏里显示。如果你没有准备贴图也没关系，教程这边给大家提供了一些素材，大家可以直接下载使用。

![图片](images/tutorials/UI进度条例子-04.png)

然后，再添加一个名为 `ProgressBar` 的文件，我们的代码就从这里开始！

---

# **编写UI部件**

首先给我们的类继承 `UIState`，然后创建两个**私有变量**作为进度条的依靠的值

```csharp
public class ProgressBar : UIElement
{
    // 最大值和当前值
    private int _maxValue;
    private int _value;
}
```

`_maxValue`为最大值，`_value`为当前值。然后我们在**构造函数**里给它们赋值。

以下是代码：

```csharp
public ProgressBar(int maxValue, int value)
{
    _maxValue = maxValue;
    _value = value;
}
```

由于我们需要更新进度条的数据，所以我们还需要一个**公共方法**来给`_maxValue`和`_value`赋值。以下是代码：

```csharp
public void SetValue(int maxValue, int value)
{
    _maxValue = maxValue;
    _value = value;
}
```

然后，我们要把进度条**绘制**出来，让玩家能看见。输入`public override`，找到这个名为`Draw`的方法，重写它用以绘制进度条

**注：关于 UI 绘制的基础内容，不熟悉的话，可以回顾之前绘制的教程：**[**简单绘制.otl**](%E7%AE%80%E5%8D%95%E7%BB%98%E5%88%B6.md)

以下是代码：

```csharp
// 提前请求贴图并缓存，避免在 Draw 里反复请求造成性能浪费或崩溃
private Asset<Texture2D> _boxTexture;
private Asset<Texture2D> _barTexture;

public ProgressBar(int maxValue, int value)
{
    _maxValue = maxValue;
    _value = value;

    // 请求贴图（注意路径要和你放图片的路径完全一致，不需要加 .png 后缀）
    _boxTexture = ModContent.Request<Texture2D>("DemoMod/Content/UIs/Images/box");
    _barTexture = ModContent.Request<Texture2D>("DemoMod/Content/UIs/Images/bar");
}

// 绘制方法
public override void Draw(SpriteBatch spriteBatch)
{
    // 获取 UI 左上角坐标
    Vector2 position = new Vector2(GetInnerDimensions().X, GetInnerDimensions().Y);

    // 计算百分比 (注意要转 float，否则 C# 整数除法会直接变成 0)
    float progress = (float)_value / _maxValue;

    // 绘制外边框 (100x30)
    spriteBatch.Draw(_boxTexture.Value, new Rectangle((int)position.X, (int)position.Y, 100, 30), Color.White);

    // 绘制表示内容的条，96 * progress 是为了计算百分比宽度
    // 注意：如果血量为 0，宽度不能为负数，用 MathHelper.Max 保底为 0
    int barWidth = (int)(96 * progress);
    if (barWidth < 0) barWidth = 0;

    spriteBatch.Draw(_barTexture.Value, new Rectangle((int)(position.X + 2), (int)(position.Y + 2), barWidth, 26), Color.White);

    base.Draw(spriteBatch);
}
```

---

# **应用UI部件**

UI部件编写好了，那么怎么应用它呢？我们打开`ExampleUI.cs`，使用`private ProgressBar bar;`创建一个私有变量。然后在`public override void OnInitialize()`里为这个私有变量实例化并赋值。以下是代码

```csharp
private ProgressBar bar;

public override void OnInitialize()
{
    //之前的代码......

    //用玩家的最大血量和玩家的现有血量实例化进度条
    bar = new ProgressBar(Main.LocalPlayer.statLifeMax2, Main.LocalPlayer.statLife);
    //设置进度条宽度
    bar.Width.Set(100f, 0f);
    //设置进度条高度
    bar.Height.Set(30f, 0f);
    //设置进度条距离所属ui部件的最左端的距离
    bar.Left.Set(20f, 0f);
    //设置进度条距离所属ui部件的最顶端的距离
    bar.Top.Set(20f, 0f);
    //将进度条注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
    panel.Append(bar);

    base.OnInitialize();
}
```

然后 输入`public override`，找到这个名为`Draw`的方法，重写它用以在绘制时更新进度条。以下是代码：

```csharp
// 每次 UI 绘制时更新进度条的数据
public override void Draw(SpriteBatch spriteBatch)
{
    // 如果面板显示，就传入玩家的最新血量
    if (bar != null && Main.LocalPlayer != null && Main.LocalPlayer.active)
    {
        bar.SetValue(Main.LocalPlayer.statLifeMax2, Main.LocalPlayer.statLife);
    }

    base.Draw(spriteBatch);
}
```

---

# **大功告成**

编译并重新加载模组，然后进游戏！

![图片](images/tutorials/UI进度条例子-05.png)

![图片](images/tutorials/UI进度条例子-06.png)

![图片](images/tutorials/UI进度条例子-07.png)

|<br>ohhhhhhhhhhhhhhhhh！！！不愧是我！！<br>|![图片](images/tutorials/UI进度条例子-08.gif)<br>|
|---|---|


---

# **UI源码**

**ProgressBar：**

```csharp
public class ProgressBar : UIElement
{
    // 最大值和当前值
    private int _maxValue;
    private int _value;

    // 提前请求贴图并缓存，避免在 Draw 里反复请求造成性能浪费或崩溃
    private Asset<Texture2D> _boxTexture;
    private Asset<Texture2D> _barTexture;

    public ProgressBar(int maxValue, int value)
    {
        _maxValue = maxValue;
        _value = value;

        // 请求贴图（注意路径要和你放图片的路径完全一致，不需要加 .png 后缀）
        _boxTexture = ModContent.Request<Texture2D>("DemoMod/Content/UIs/Images/box");
        _barTexture = ModContent.Request<Texture2D>("DemoMod/Content/UIs/Images/bar");
    }

    public void SetValue(int maxValue, int value)
    {
        _maxValue = maxValue;
        _value = value;
    }

    // 绘制方法
    public override void Draw(SpriteBatch spriteBatch)
    {
        // 获取 UI 左上角坐标
        Vector2 position = new Vector2(GetInnerDimensions().X, GetInnerDimensions().Y);

        // 计算百分比 (注意要转 float，否则 C# 整数除法会直接变成 0)
        float progress = (float)_value / _maxValue;

        // 绘制外边框 (100x30)
        spriteBatch.Draw(_boxTexture.Value, new Rectangle((int)position.X, (int)position.Y, 100, 30), Color.White);

        // 绘制表示内容的条，96 * progress 是为了计算百分比宽度
        // 注意：如果血量为 0，宽度不能为负数，用 MathHelper.Max 保底为 0
        int barWidth = (int)(96 * progress);
        if (barWidth < 0) barWidth = 0;

        spriteBatch.Draw(_barTexture.Value, new Rectangle((int)(position.X + 2), (int)(position.Y + 2), barWidth, 26), Color.White);

        base.Draw(spriteBatch);
    }
}
```

---

# **小 作 业**



1 编写一个供玩家输入字符串的`TextBox`

2 编写一个从多个选项里选择一个选项的`RadioButton`

3 编写一个能放入物品的`ItemSlot`

4 编写一个能根据ui碰撞箱大小拉伸图像的`UIImage`



我相信这些一定难不倒你们的！

![图片](images/tutorials/UI进度条例子-09.png)



*©2026 冬天的叶 &amp;* *幽白银* *\| 仅供个人学习，禁止商用二次分发*

