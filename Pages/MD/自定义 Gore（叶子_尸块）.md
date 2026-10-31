作者：冬天的叶  2026/10/25 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

在泰拉瑞亚中，**Gore** 是一种非常常用的视觉效果。举个例子：杀死一只僵尸后，地上散落的碎块；砍倒一棵树，空中飘落的树叶。这些东西既不是物品，也不是弹幕，更不是 **NPC**，它们叫做 **Gore**（尸块/碎屑）能帮助我们让游戏的画面更加的丰富多彩。



所以这一期，我们从零开始，创建一个自己的 **Gore**。



在这个过程中，希望大家能学会：



**1 了解** **`ModGore` 类的基本结构**

**2 学会创建普通尸块 Gore（NPC 与 物品碎块）**

**3 学会创建落叶类型的 Gore**

**4 了解 Gore 的常用属性与静态标记**

---

# **Gore 的定义**

不过说了这么多，在游戏里，到底什么是 Gore 呢？

从代码层面来看，Gore 是 `Main.gore` 数组里的一个条目，类型为 `Terraria.Gore`。它拥有位置、速度、贴图、旋转、透明度、存活时间等属性，但没有碰撞箱、不参与战斗，也不触发任何游戏逻辑。**它存在的唯一目的,就是提供演出效果。**

原版的 Gore 已经有 1400 多种，覆盖了从血肉碎块到树叶、从烟雾到火花的各种效果。但它们的局限性也很强，大多是为特定场景准备的，你总不能拿别的 NPC 的血肉碎块来给你的 NPC 使用吧？所以，我们想要做出专属效果就需要自己来创建 Gore。

# 创建Gore 文件

不过，在创建 **Gore** 之前，我们需要在我们的**Content**文件夹下新建一个文件夹，并且起名为**Gores**，然后在文件夹内新建**cs文件**，随便起个名字（我这里使用**DemoGore\_xxx**你们随意）作为文件名。

![图片](images/tutorials/Gore-01.png)

![图片](images/tutorials/Gore-02.png)

![图片](images/tutorials/Gore-03.png)

![图片](images/tutorials/Gore-04.png)

|![图片](images/tutorials/Gore-05.png)|![图片](images/tutorials/Gore-06.png)|
|---|---|

当然，**Gore**也需要一张贴图来显示游戏里的形象，如果你没有准备贴图也没关系，教程这边给大家提供了一些贴图，大家可以下载使用。

![图片](images/tutorials/Gore-07.png)

先创建 **NPC碎块** 吧，我们将对应的贴图放入其中，并保证**图片名，类名，文件名**一致。



之后的步骤和创建 `Item` 类似，我们需要创建一个名为 **DemoGore\_xxx** 的公开类（**public**），并且继承自 **ModGore**

代码如下：

```csharp
using DemoMod.Content.Projectiles;
using Microsoft.CodeAnalysis;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System;
using System.Collections.Generic;
using Terraria;
using Terraria.Audio;
using Terraria.ID;
using Terraria.ModLoader;

namespace DemoMod.Content.Gores
{
    public class DemoGore_DemoNPC1 : ModGore
    {
        public override string Texture => "DemoMod/Content/Gores/DemoGore_DemoNPC1";
    }
    public class DemoGore_DemoNPC2 : ModGore
    {
        public override string Texture => "DemoMod/Content/Gores/DemoGore_DemoNPC2";
    }
    public class DemoGore_DemoNPC3 : ModGore
    {
        public override string Texture => "DemoMod/Content/Gores/DemoGore_DemoNPC3";
    }
}
```

这里的`Texture`属性决定了这个实体类使用的贴图路径在哪，不止`Gores`大部分TML会帮你自动加载贴图的实体类（NPC，弹幕，物品等）都有`Texture`属性。

我们可以通过 `ModContent.GoreType<xxxx>();`  方法获取 Mod 自定义的 Gore ID。 `xxxx` 内容为我们的**Gore 类名。**不过，和 **弹幕、物品** 的属性设置不同，**Gore** 没有 `SetDefaults()` 方法，只有 `SetStaticDefaults()`，以及 `OnSpawn`。

# **Gore**的常用属性

**Gore** 里面我们能修改的属性有：

```csharp
public class Gore
{
    public static int goreTime = 600;      // 默认存活时间（帧），600 帧 = 10 秒
    public Vector2 position;               // 位置
    public Vector2 velocity;               // 速度
    public float rotation;                 // 旋转角度（弧度）
    public float scale;                    // 缩放
    public int alpha;                      // 透明度，0 不透明，255 完全透明
    public int type;                       // Gore 类型 ID
    public float light;                    // 自身发光强度，0 不发光
    public bool active;                    // 是否活跃，false 时会被回收
    public bool sticky = true;             // 是否粘在物块上（true 时碰撞后减速/停止）
    public int timeLeft = goreTime;        // 剩余存活时间
    public bool behindTiles;               // 是否绘制在物块后面
    public byte frameCounter;              // 动画帧计数器
    public SpriteFrame Frame;              // 精灵帧信息
}

public static class GoreID.Sets
{
    public static int[] SpecialAI = Factory.CreateIntSet(0);           // 特殊 AI 行为，0~7，默认 0（无特殊 AI）
    public static int[] DisappearSpeed = Factory.CreateIntSet(1);      // timeLeft 归零前每帧减去的值，默认 1
    public static int[] DisappearSpeedAlpha = Factory.CreateIntSet(1); // timeLeft 归零后每帧加到 alpha 的值，默认 1
    public static bool[] IsDrip = Factory.CreateBoolSet(false);        // 是否为滴落液体水滴，默认 false
}
```

其中大部分的属性看注释都可以理解，我们重点讲一下最常用的几个属性：

#### 1**`timeLeft`**（持续时间）

这个属性控制 **Gore** 存活多久。设为 `0` 或降到 `0` 后，**Gore** 开始淡出并消失。你可以在 `OnSpawn` 里改它。

#### 2 **`sticky`**（粘性）

这个属性被设为 `true` 时，**Gore** 碰到物块会减速、粘住，适合尸块、碎片。设为 `false` 时，它会穿墙飞行，适合火花、烟雾。

#### 3 **`alpha`**（透明度）

这个属性负责控制透明度。`OnSpawn` 时默认为 `0`，你可以设一个初始值让它半透明出场。

#### 4 **`light`**（发光强度）

这个属性能够 让 **Gore** 自身发光，照亮周围环境。原版的火花、岩浆滴都用了这个。



看完这些属性后，有些敏锐的同学可能发现了：既然 **Gore** 能和物块交互，那控制物块碰撞的字段在哪呢？而且**Gore**的碰撞箱宽高去哪了？



#### 5 物块交互（特殊）

首先，控制碰撞的字段当然是有的嘛，不过它并不在 `ModGore` 这个类里……

![图片](images/tutorials/Gore-08.png)

**它藏在游戏的【设置 &gt; 图像 &gt; 质量】选项里。（没想到吧？）**



在泰拉瑞亚中，像 **Gore、粒子、雨滴、音效** 这类“一旦数量过多就会自动替换”的 **危险资产** ，为了节省系统资源，游戏底层会在交互判断方面对它们进行限制。**Gore** 的物块碰撞就被限制于 **质量** 选项。



**质量设置为“高”**：Gore 能够正确地与物块碰撞：

![图片](images/tutorials/Gore-09.gif)



**质量设置为“低”**：Gore 无法与物块碰撞，并且会迅速淡出屏幕，以此来节省性能资源：

![图片](images/tutorials/Gore-10.gif)



#### 6 碰撞大小（特殊）

然后就是，**Gore** 的碰撞大小（`AABBRectangle`）是**只读的**。根据 tModLoader 的官方 API 文档，`Gore` 类中的 `AABBRectangle` 属性仅提供了 `get` 访问器，没有 `set` 访问器。这意味着你无法在代码中直接给`Gore.Width`和`Gore.Height`赋值来修改碰撞箱。



虽然不能直接修改，但 `AABBRectangle` 的值是由贴图尺寸和 `scale` 属性计算出来的（源码中逻辑为：贴图源矩形宽高 × `scale`）。因此，你可以通过修改 `scale` 或 `ModGore.Update` 中返回 `false` 来接管更新，然后自定义碰撞逻辑来修改**Gore** 的碰撞大小。

---

# 创建普通尸块

好了，常用属性就说到这里，接下来回到 `DemoGore_DemoNPC` 类，我们在每个Gore里写一个：

```csharp
public override void OnSpawn(Gore gore, IEntitySource source)
{
    // Gore 生成时调用一次
    // 可以在这里修改 timeLeft、sticky、alpha 等
    gore.timeLeft = 300;   // 存活 5 秒
    gore.sticky = true;    // 粘在物块上
}
```

然后在**NPC**的`OnKill`方法里填入：

```csharp
public override void OnKill()
{
    int[] goreType =
    {
        ModContent.GoreType<DemoGore_DemoNPC1>(),
        ModContent.GoreType<DemoGore_DemoNPC2>(),
        ModContent.GoreType<DemoGore_DemoNPC3>()
    };

    // 生成源
    var source = NPC.GetSource_Death();

    for (int i = 0; i < 3; i++)
    {
        Vector2 velocity = new Vector2(Main.rand.Next(-6, 7), Main.rand.Next(-6, 7));
        Gore.NewGore(source, NPC.Center, velocity, goreType[i]);
    }

    base.OnKill();
}
```

之后我们进入游戏，杀死我们的史莱姆僵尸：

![图片](images/tutorials/Gore-11.gif)

*（不赖嘛\~）*

---

# 创建特殊 Gore

普通尸块只会下落、碰地、消失。但有些 Gore 会有**特殊行为**，比如树叶要左右摇摆、缓缓飘落。雾气会缓慢的漂浮。闪光与火花要快速淡出。tModLoader 通过 `GoreID.Sets.SpecialAI` 来区分这些行为。

根据 tModLoader 文档，`SpecialAI` 目前支持以下值：

|**值**|**行为**|**原版例子**|
|---|---|---|
|`0`|普通 Gore|大部分尸块|
|`1`|船帆摆动|荷兰飞人号掉落的帆|
|`2`|烟囱烟雾|烟囱产生的烟|
|`3`|落叶飘落|所有原版树叶|
|`4`|地面漂浮|墓地地面雾气|
|`5`|空中漂浮|墓地空中雾气|
|`6`|缓慢扩散|烟雾机产生的雾|
|`7`|快速淡出|电兔火花|


不过大多 `SpecialAI` 里面模板都是什么云啊雾啊，十分无趣，这边只挑个有意思的 **叶子类Gore **创建玩玩：

### 落叶 ModGore 模板



![图片](images/tutorials/Gore-12.png)

和尸块一样，新建**cs文件**，随便起个名字（我这里使用**DemoGore\_Leaf**你们随意）作为文件名。将对应的贴图放入其中，并保证**图片名，类名，文件名**一致。



然后是代码部分：

```csharp
namespace DemoMod.Content.Gores
{
    public class DemoGore_Leaf : ModGore
    {

        public override void SetStaticDefaults()
        {
            // 叶子不属于血腥内容，即使玩家关闭了“血液和血腥效果”也应该显示
            ChildSafety.SafeGore[Type] = true;

            // 使用落叶 AI
            GoreID.Sets.SpecialAI[Type] = 3;

            // 这个标记用于原版所有树叶，与油漆列相关
            GoreID.Sets.PaintedFallingLeaf[Type] = false;
        }
    }
}
```

逐行解释：

#### 1**`ChildSafety.SafeGore[Type] = true`**（安全内容）

泰拉瑞亚有一个“血液和血腥效果”的开关。默认情况下，Gore 会受到这个开关影响，如果玩家关闭了血腥效果，你的 Gore 就不会显示。对于叶子、火花、烟雾这类**非血腥** Gore，必须把它设为 `true`，否则玩家关掉血腥选项后你的 **叶子** 就消失了。

#### 2**`GoreID.Sets.SpecialAI[Type] = 3`** （AI逻辑-落叶）

告诉游戏这个 **Gore** 使用落叶 AI。游戏会在 `Gore.Update`  **Gore行为** 里走 `Gore_UpdateLeaf()` **叶子分支**，让 **Gore** 左右摇摆、碰到物块反弹、将贴图分为`8`份序列帧、碰到水减速、碰到岩浆消失。

#### 3**`GoreID.Sets.PaintedFallingLeaf[Type] = false`** （油漆）

这是原版树叶专用标记。如果你的叶子贴图是**一张多列序列图**（每一列对应一种油漆颜色）应该将其设为 `true` 后游戏会根据来源树被涂的油漆自动选择正确的列。如果你只画了一列普通叶子，这一行可以省略。



如果你用了 `PaintedFallingLeaf`，贴图的列数必须是**多列序列图**（原版是 32 列）。**TML**官方给的例子图长这样：

![图片](images/tutorials/Gore-13.png)

在`Gore.NewGore` 里，游戏会对设为 `true` 的 Gore 设置 `Frame = new SpriteFrame(32, 8)`，8 行对应 8 种叶子的形状变体。我们只做一片普通叶子，不设这个标记，贴图单列多行即可。



然后我们在 `ModTree` 的 `TreeLeaf` 方法里填入：

```csharp
public override int TreeLeaf()
{
    return ModContent.GoreType<DemoGore_Leaf>();
}
```

好的我们进入游戏......啊哈哈，我物块教程好像还没写哈（目移）



**写在item里你们凑合看吧：**

```csharp
public override bool Shoot(Player player, EntitySource_ItemUse_WithAmmo source, Vector2 position, Vector2 velocity, int type, int damage, float knockback)
{
    for (int i = 0; i < 3; i++)
    {
        // 叶子ID
        int leafGoreType = ModContent.GoreType<DemoGore_Leaf>();

        // 生成一片叶子，位置在玩家中心，速度给一点随机
        Vector2 leafVelocity = new Vector2(
           Main.rand.NextFloat(-2f, 2f),
           Main.rand.NextFloat(-1f, 1f)
        );

        int gore = Gore.NewGore(
            player.GetSource_ItemUse(Item),  // 来源
            player.Center,                   // 位置
            leafVelocity,                    // 速度
            leafGoreType,                    // Gore 类型
            Main.rand.Next(10, 16) / 10f     // 大小
        );
    }
    return false;
}
```

然后我们进入游戏：

![图片](images/tutorials/Gore-14.gif)

*非常美丽啊～*

---

### 爆破ModGore 模板

在创建爆破效果之前，我们先来看看原版的`SpecialAI`为 `7` 的**Gore** :

![图片](images/tutorials/Gore-15.png)

~~*（这不是之前拿来做粒子的贴图嘛）*~~

![图片](images/tutorials/Gore-16.gif)

通过观察我们发现，这个**Gore**的贴图会随机在三帧里面选取一帧显示，然后迅速消失淡出，查看源代码我们发现，在 `UpdateLightningBunnySparks` 中，帧数随机选取发生在**生成的第一帧**：

```csharp
if (frameCounter == 0) {
    frameCounter = 1;
    Frame.CurrentRow = (byte)Main.rand.Next(3); // 随机选 0、1 或 2 行
}
```

我们知道了帧数是由 `Frame.CurrentRow` 控制的，就可以围绕这个方向下手。

#### 手动编写序列帧逻辑：

```csharp
// 计算已经存活的时间比例 (0f 到 1f)
float lifeProgress = 1 - (float)gore.timeLeft / MaxTimeLeft;

// 虽然我们的帧数只有三帧，但是为了动画效果，我们将它分成 4 份
// 123 正常播放，第 4 段的时候，留出时间淡出
int row = (int)(lifeProgress * 4f);

// 防止越界
if (row > 2) row = 2;

// 修改序列帧
gore.Frame.CurrentRow = (byte)row;
```

上面写的一堆代码，可以简单概况为，在**Gore**的剩余时间内，最先显示第1帧，然后显示第2帧，最后显示第3帧，留出时间淡出。

有些同学可能会疑惑，为什么这个防止越界的代码看着怪怪的。

```csharp
if (row > 2) row = 2;
```

这里我就不解释了，把这个当做小作业，感兴趣的同学可以查看[帧图绘制与用绘制整出的花活.otl](https://www.kdocs.cn/l/ceMvSPcHO4hD?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1NjM4NzA2MDEyNDAiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2VNdlNQY0hPNGhEIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU3NzY4NDQ3MTUyNCJ9)来获取答案。

好的，有了这段代码以后，我们就可以播放我们自己的序列图了。

#### 创建Gore 文件

![图片](images/tutorials/Gore-17.png)

和尸块一样，新建**cs文件**，随便起个名字（我这里使用**DemoGore\_Explosion**你们随意）作为文件名。将对应的贴图放入其中，并保证**图片名，类名，文件名**一致。



然后是代码部分：

```csharp
public class DemoGore_Explosion : ModGore
{
    public override void SetStaticDefaults()
    {
        // 不属于血腥内容，即使玩家关闭了“血液和血腥效果”也应该显示
        ChildSafety.SafeGore[Type] = true;
    }
    /// <summary>
    /// 最大存活时间
    /// </summary>
    public static int MaxTimeLeft => 20;

    public override void OnSpawn(Gore gore, IEntitySource source)
    {
        gore.Frame = new SpriteFrame(1, 3);  // 设置 1 列 3 行的精灵帧
        gore.timeLeft = MaxTimeLeft;         // 设置存活时间
        gore.sticky = false;                 // 关闭粘性

        gore.velocity *= 0;

        // 居中
        if (TextureAssets.Gore[Type].IsLoaded)
        {
            gore.position.X -= TextureAssets.Gore[Type].Width() / 2;
            gore.position.Y -= TextureAssets.Gore[Type].Height() / 6;
        }

        base.OnSpawn(gore, source);
    }
    public override bool Update(Gore gore)
    {
        // 这里是播放序列帧

        // 计算已经存活的时间比例 (0f 到 1f)
        float lifeProgress = 1 - (float)gore.timeLeft / MaxTimeLeft;

        // 虽然我们的帧数只有三帧，但是为了动画效果，我们将它分成 4 份
        // 123 正常播放，第 4 段的时候，留出时间淡出
        int row = (int)(lifeProgress * 4f);

        // 防止越界
        if (row > 2) row = 2;

        // 修改序列帧
        gore.Frame.CurrentRow = (byte)row;


        // 下面手动更新

        // 时间逻辑
        gore.timeLeft -= GoreID.Sets.DisappearSpeed[gore.type];

        // 手动死亡
        if (gore.timeLeft <= 0)
        {
            gore.active = false;
        }

        return false;
    }
    public override Color? GetAlpha(Gore gore, Color lightColor)
    {
        // 淡出
        float lifeProgress = gore.timeLeft / 15f;

        Color myColor = new Color(1, 1, 1f);

        return myColor * lifeProgress;
    }
}
```

注意：`Update` 返回 `false` 后，因为原版的 `position += velocity` 和 `timeLeft` 递减都被跳过了。你必须接管更新，在 `Update` 里手动处理位置、时间、`active` 状态，**否则 Gore 会永远停在原地且不会消失。**

现在，我们找个弹幕，在他的`OnKill`之类的方法里填入：

```csharp
// 在周围随机偏移，范围约 ±20 像素
Vector2 offset = new Vector2(Main.rand.Next(-20, 21), Main.rand.Next(-20, 21));

int GoreType = ModContent.GoreType<DemoGore_Explosion>();

Gore.NewGore(
    Projectile.GetSource_Death(),   // 来源
    Projectile.Center+ offset,              // 位置
    new Vector2(0),                 // 速度
    GoreType,                       // Gore 类型
    1                               // 大小
);
```

可以随便加上范围伤害：

```csharp
// 爆炸范围 160×160，约 10×10 格
Projectile.Resize(160, 160);

// 伤害：原伤害 × 0.35
float factor = 0.35f;
Projectile.damage = (int)(Projectile.damage * factor);

// 击退 × 0.35
Projectile.knockBack *= 0.35f;

// 只打一次，不穿透
Projectile.maxPenetrate = -1;
Projectile.penetrate = -1;

// 重置免疫，保证能打到所有敌人
int cooldown = Projectile.localNPCHitCooldown;
for (int i = 0; i < Projectile.localNPCImmunity.Length; i++)
{
    if (Projectile.localNPCImmunity[i] != cooldown)
        Projectile.localNPCImmunity[i] = 0;
}

// 造成范围伤害
Projectile.Damage();

// 恢复大小，这个别照抄，改回你的弹幕碰撞去
Projectile.Resize(16, 16);
```

然后进入游戏：

![图片](images/tutorials/Gore-18.gif)

非常不错\~

这个粒子扩散在之前的[更多Item字段与方法.otl](https://www.kdocs.cn/l/cs5AGuL3Wqdw?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1NjM3OTY4MTYwNzQiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY3M1QUd1TDNXcWR3Iiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU3NzY4NDQ3MTUyNCJ9)教程里面写过，这里就不重复介绍了，觉得颜色单调的同学可以通过 `GetAlpha` 方法修改颜色。

---

### 刀痕 ModGore 模板

![图片](images/tutorials/Gore-19.png)

和尸块一样，新建**cs文件**，随便起个名字（我这里使用**DemoGore\_KnifeMark**你们随意）作为文件名。将对应的贴图放入其中，并保证**图片名，类名，文件名**一致。



然后是代码部分：

```csharp
  public class DemoGore_KnifeMark : ModGore
  {
      public override void SetStaticDefaults()
      {
          // 不属于血腥内容，即使玩家关闭了“血液和血腥效果”也应该显示
          ChildSafety.SafeGore[Type] = true;
      }
      /// <summary>
      /// 最大存活时间
      /// </summary>
      public static int MaxTimeLeft = 25;

      public override void OnSpawn(Gore gore, IEntitySource source)
      {
          gore.Frame = new SpriteFrame(1, 4);  // 设置 1 列 4 行的精灵帧
          gore.timeLeft = MaxTimeLeft;                  // 设置存活时间 10~15 tick
          gore.sticky = false;                 // 关闭粘性

          gore.velocity *= 0;

          // 居中
          if (TextureAssets.Gore[Type].IsLoaded)
          {
              gore.position.X -= TextureAssets.Gore[Type].Width() / 2;
              gore.position.Y -= TextureAssets.Gore[Type].Height() / 8;
          }

          base.OnSpawn(gore, source);
      }
      public override bool Update(Gore gore)
      {
          // 这里是播放序列帧

          // 计算已经存活的时间比例 (0f 到 1f)
          float lifeProgress = 1 - (float)gore.timeLeft / MaxTimeLeft;

          // 虽然我们的帧数只有4帧，但是为了动画效果，我们将它分成 5 份
          int row = (int)(lifeProgress * 5f);

          // 防止越界
          if (row > 3) row = 3;

          // 修改序列帧
          gore.Frame.CurrentRow = (byte)row;


          // 下面手动更新

          // 时间逻辑
          gore.timeLeft -= GoreID.Sets.DisappearSpeed[gore.type];

          // 手动死亡
          if (gore.timeLeft <= 0)
          {
              gore.active = false;
          }

          return false;
      }
      public static Color?[] GoreColor = new Color?[Main.maxGore];
      public override Color? GetAlpha(Gore gore, Color lightColor)
      {
          // byd Gore 竟然没有 whoAmI
          // 不过没关系 Update返回 false 发光逻辑停止了，light 正好用来做索引
          int whoAmI = (int)gore.light;

          if (GoreColor[whoAmI] == null)
              return GoreColor[whoAmI];

          // 淡出
          float lifeProgress = gore.timeLeft / 20f;

          Color myColor = GoreColor[whoAmI].Value;

          return myColor * lifeProgress;
      }
  }
```

这里我们重点看一下 `Color?[] GoreColor` 和 `GetAlpha` 这两部分代码。

首先，因为 Gore 本身没有颜色属性，所以我们定义了一个 `Color?[] GoreColor` 数组，专门用来存我们自定义的颜色。它的用法是：在调用 `NewGore` 之后，传入对应的索引和颜色，然后再把这些颜色应用到我们的 Gore 上。

但是，用着用着你就会发现...... Gore 不仅没有 Color，竟然连 `whoAmI` 都没有！

 ~~**什么玩意，好tm简陋啊，老娘不写啦！！！（不是）**~~

不要紧，还有办法救场：因为在 `Update` 方法中返回了 `false`。这使得原本负责发光逻辑的代码停止了更新。那个空出来的 `light` 字段正好可以拿来充当我们数组的索引。



在**Item**的`OnHitNPC`里面写上：

```csharp
public override void OnHitNPC(Player player, NPC target, NPC.HitInfo hit, int damageDone)
{
    Vector2 offset = new Vector2(Main.rand.Next(-20, 21), Main.rand.Next(-20, 21));
    Vector2 spawnPos = target.Center + offset; // 记录实际生成位置

    int GoreType = ModContent.GoreType<DemoGore_KnifeMark>();

    int gores = Gore.NewGore(
        player.GetSource_ItemUse(Item),  // 来源 
        spawnPos,                        // 位置
        new Vector2(0),                  // 速度
        GoreType,                        // Gore 类型
        1.25f                            // 大小
    );

    // 传入索引
    Main.gore[gores].light = gores;
    // 设置颜色
    DemoGore_KnifeMark.GoreColor[gores] = new Color(130, 150, 175, 255);

    // 计算从生成位置指向玩家中心的方向
    Vector2 dirToPlayer = player.Center - spawnPos;
    // 设置朝向
    Main.gore[gores].rotation = dirToPlayer.ToRotation() + MathHelper.PiOver2;

    if (hit.Crit) // 暴击时
    {
        Main.gore[gores].scale = 1.7f;
    }

    // 普通命中：一点火花
    int dustCount = hit.Crit ? 12 : 8;
    for (int i = 0; i < dustCount; i++)
    {
        // 在生成位置周围随机散开
        Vector2 dustVel = new Vector2(Main.rand.NextFloat(-3f, 3f), Main.rand.NextFloat(-3f, 3f));

        // 暴击用偏红的火焰粒子，普通命中用灰白火花
        int dustType = hit.Crit ? DustID.Torch : DustID.Silver;

        Dust dust = Dust.NewDustDirect(spawnPos, 4, 4, dustType, dustVel.X, dustVel.Y, 100, default, hit.Crit ? 1.75f : 1.4f);
        dust.noGravity = true; // 让火花飘起来，不受重力
        dust.velocity *= 2f;
    }
}
```

然后进入游戏就能看到：

![图片](images/tutorials/Gore-20.gif)

不错嘛，不过粒子好像写多了，限制也没写，这些内容你们自己补上吧。

---

# 结尾



好了，自定义 **Gore** 的教程到此就结束了，其实粒子在更新了绘制方法后使用体验并不比**Gore**差，不过这两难兄难弟在 **简陋** 这一块都半斤八两，想用哪个你们自己决定吧\~



来点小练习：



**基础：**

- 做一个“彩虹碎片”Gore：每次生成时随机选择一种颜色，用 `GetAlpha` 染成该颜色，落地后 3 秒消失。

- 做一个“烟雾”Gore：使用 `SpecialAI = 2`，不粘地，`light = 0`，`alpha` 初始为 `150`，让它像烟囱烟一样缓缓上升并变透明。

  **进阶：**

- 做一个“弹跳球”Gore：在 `Update` 里返回 `false`，自己实现重力 + 碰地反弹（速度 Y 取反并乘 0.8），`timeLeft` 手动递减，存活 10 秒。

  ---

  

  *©2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*

  

