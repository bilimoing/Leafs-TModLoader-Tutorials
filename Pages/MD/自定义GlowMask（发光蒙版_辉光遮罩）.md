作者：冬天的叶  2026/10/27 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

发光蒙版（GlowMask）是一个负责让贴图的部分内容不受光照影响、始终发光的绘制效果。

在原版，它被用于绘制 **武器上的发光纹路、怪物的红色眼睛、盔甲的复杂花纹**....  可就是这么泛用的内容，在模组制作中的存在感却一直不强：Wiki 上的介绍少得可怜，官方文档里也只提到过寥寥几点，往往只有在查询原版贴图文件时，才会偶尔看到相关贴图。



不过，存在感低不代表它难以使用。一旦我们掌握了如何使用它，就能轻松让模组物品拥有帅气的发光特效，提升视觉表现。



所以这一期，我们就从零开始，创建一个属于自己的 GlowMask。



在这个过程中，希望大家能学会：

1 理解 **GlowMask** 的效果 与“附加蒙版图”的思路

2 分清物品 **GlowMask**与 NPC / 弹幕 **GlowMask** 的加载方法区别

---

# 比对实验

那么讲了这么多，发光蒙版在游戏里的实际表现到底是什么样的呢？别急，我们先新建一个物品，借用旧日军团掉落的“飞龙”作为贴图。

在代码里写入：

```csharp
namespace DemoMod.Content.Items
{
    public class DemoFlyingDragon : ModItem
    {
        // 借用“飞龙”贴图
        public override string Texture => "Terraria/Images/Item_3827";

        public override void SetDefaults()
        {
            Item.damage = 50;                       // 攻击力：50点
            Item.DamageType = DamageClass.Melee;    // 伤害类型：近战（受近战加成影响）
            Item.width = 76;                        // 物品的宽度（像素，影响拾取范围和碰撞判定）
            Item.height = 74;                       // 物品的高度（像素）
            Item.useTime = 17;                      // 每次攻击耗时（帧数，数值越小攻速越快）
            Item.useAnimation = 17;                 // 每次攻击的动画时长（帧数，通常与useTime保持一致）
            Item.useStyle = ItemUseStyleID.Swing;   // 使用方式：挥动（剑类标准动作）
            Item.knockBack = 6;                     // 击退力（数值越大击退越远）

            Item.value = Item.buyPrice(silver: 1);  // 物品价值（1银币，也可以直接用int值）

            Item.rare = ItemRarityID.Blue;          // 稀有度：蓝色（对应游戏里的颜色等级）
            Item.UseSound = SoundID.Item1;          // 使用音效：Item1（剑挥动的声音）
            Item.autoReuse = true;                  // 是否自动连击（true=按住鼠标持续攻击）

            Item.shoot = 684;
            Item.shootSpeed = 17f;                  // 弹幕速度：10（单位是像素/帧）
            Item.scale = 1;                         // 物品缩放

            Item.lifeRegen = 0;
            Item.channel = true;
        }
        public override void UseStyle(Player player, Rectangle heldItemFrame)
        {
            // xOffset：负值让武器靠近玩家身体，正值远离
            // yOffset：正值让武器下移，负值上移
            float xOffset = -8f;
            float yOffset = 18f;

            Vector2 itemOffset = new Vector2(xOffset * player.direction, yOffset).RotatedBy(player.itemRotation);
            player.itemLocation += itemOffset;
        }

        public override bool Shoot(Player player, EntitySource_ItemUse_WithAmmo source, Vector2 position, Vector2 velocity, int type, int damage, float knockback)
        {
            return true;
        }
        public override void AddRecipes()
        {
            Recipe recipe = CreateRecipe();
            recipe.AddIngredient(ItemID.DirtBlock, 10);
            recipe.AddTile(TileID.WorkBenches);
            recipe.Register();
        }
    }
}
```

然后查阅游戏源码，我们可以得知在 TModLoader 中，物品的发光蒙版主要作用于三个场景：**物品栏**、**掉落物** 以及 **手持使用** 时。

接下来，我们将这个“仿制品”与原版飞龙放在一起，进行对比观察：



#### 1 对比物品栏：

![图片](images/tutorials/GlowMask-01.png)

*好吧，好像看不出来*

在背包栏中，两者的视觉差异并不明显。

#### 2 对比掉落物：

![图片](images/tutorials/GlowMask-02.png)

在白天情况下差异同样很小，不过嘛，一到了夜晚....

![图片](images/tutorials/GlowMask-03.png)

你看，瞬间就露馅了：仿制品的黄色纹路黯淡，而原版飞龙身上的火焰依然清晰可见。

#### 3 对比手持物：

|![图片](images/tutorials/GlowMask-04.png)|![图片](images/tutorials/GlowMask-05.png)|
|---|---|

当玩家挥舞武器时，两把武器的 **差** **距** 更加明显了。

原版飞龙在挥舞时，黄色火焰纹路极为耀眼，视觉反馈十分强烈。仿制品的黄色纹路黯淡，平平无奇。

#### 4 结论

经过对比观察，我们可以发现：原版飞龙身上的黄色火焰，在黑暗中依然能够发光，并且在武器被使用时，发光强度会变得更加耀眼。**这片会发光的火焰，就是我们所说的“发光蒙版”。**反观我们制作的仿制品，即便使用了完全相同的物品贴图，仅仅是因为缺少了发光蒙版，视觉效果就大打折扣。

---

# 创建物品蒙版

在创建 **GlowMask** 之前，我们需要先给它安排一个存放的位置。你可以将它放在需要添加发光蒙版的贴图旁边；也可以单独在 `Content` 文件夹下新建一个名为 `GlowMasks` 的文件夹，专门用来放置蒙版贴图。

|![图片](images/tutorials/GlowMask-06.png)|![图片](images/tutorials/GlowMask-07.png)|
|---|---|

当然，发光蒙版也需要一张贴图来显示游戏里的形象。如果你还没有准备贴图也没关系，教程这边给大家提供了一些贴图素材，大家可以下载使用。

> [⚠️]  
> **注：** 如果你使用自制贴图，请务必保证蒙版贴图与原贴图的**尺寸完全一致**。如果大小不同，发光部分会出现**严重错位**。  



接下来是代码部分。

我们在物品的 `SetDefaults()` 方法内输入 `Item.glowMask`，然后点开提示就会发现....

```csharp
/// <summary>
/// 该物品的发光蒙版在 TextureAssets.GlowMask 数组中的索引；如果该物品没有发光蒙版，则为 -1。
/// 目前尚不支持模组内容。
/// 默认值为 -1。
/// </summary>
public short glowMask;
```

*不是？怎么不让用啊？*



好吧，看上去`Item.glowMask`目前不支持模组内容。很遗憾，**TML也并没有ModGlowMasks 之类的东西。**



那……？我们的**GlowMask**教程就到此结束啦！接下来布置一些小作业\~



![图片](images/tutorials/GlowMask-08.jpeg)

*嗨嗨，开玩笑的（qwq）*

---

### **自定义蒙版**配置类

既然官方没写自定义物品蒙版，我们就自己写一套**发光蒙版加载逻辑**：

```csharp
using Microsoft.CodeAnalysis;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using ReLogic.Content;
using System;
using System.Collections.Generic;
using Terraria;
using Terraria.Audio;
using Terraria.DataStructures;
using Terraria.GameContent;
using Terraria.ID;
using Terraria.ModLoader;

namespace DemoMod.Content.GlowMask
{
    /// <summary>
    /// 叶子的物品发光遮罩配置类。
    /// 默认：纯白发光、UI / 世界 / 手持三个场景全部绘制。
    /// </summary>
    public class GlowMaskData
    {
        /// <summary>
        /// 发光遮罩全局表
        /// </summary>
        public static readonly Dictionary<int, GlowMaskData> Table = new();

        /// <summary>
        /// 发光遮罩贴图
        /// </summary>
        public Asset<Texture2D> Mask;

        /// <summary>
        /// 绘制颜色
        /// </summary>
        public Color GlowColor = Color.White;

        /// <summary>
        /// 是否在 UI（背包、物品栏）绘制。默认 true。
        /// </summary>
        public bool DrawInUI = true;

        /// <summary>
        /// 是否在世界（掉在地上的物品）绘制。默认 true。
        /// </summary>
        public bool DrawInWorld = true;

        /// <summary>
        /// 是否在 手持/挥舞 时绘制。默认 true。
        /// </summary>
        public bool DrawWhenHeld = true;

        /// <summary>
        /// 手持/挥舞时的透明度比例。1为不透明，0为全透明，默认 0.5f。
        /// </summary>
        public float HeldAlpha = 0.5f;

        /// <summary>
        /// 构造函数：传入遮罩贴图，还可以传入颜色、透明度与三个场景开关。
        /// </summary>
        /// <param name="mask">遮罩贴图，一般与物品贴图相同同尺寸。</param>
        /// <param name="glowColor">发光颜色，传 null 时使用默认的 <see cref="Color.White"/>。</param>
        /// <param name="drawInUI">是否为 UI（物品栏图标）绘制遮罩，默认 true。</param>
        /// <param name="drawInWorld">是否为 世界掉落物 绘制遮罩，默认 true。</param>
        /// <param name="drawWhenHeld">是否在玩家 手持/挥舞 时绘制遮罩，默认 true。</param>
        /// <param name="heldAlpha">手持/挥舞时的透明度比例，默认 0.5f。</param>
        public GlowMaskData(Asset<Texture2D> mask, Color? glowColor = null, bool drawInUI = true, bool drawInWorld = true, bool drawWhenHeld = true, float heldAlpha = 0.5f)
        {
            Mask = mask;

            // 如果传了颜色就用传的，没传就保持字段默认的 Color.White
            if (glowColor.HasValue)
                GlowColor = glowColor.Value;

            DrawInUI = drawInUI;
            DrawInWorld = drawInWorld;
            DrawWhenHeld = drawWhenHeld;
            HeldAlpha = heldAlpha;
        }

        /// <summary>
        /// 查表并构造 DrawData。变换参数由调用方按场景算好传入。
        /// 返回 false 表示未注册、该场景关闭、或贴图未加载，调用方应跳过绘制。
        /// </summary>
        /// <param name="item">当前要绘制的物品，用 <see cref="Item.type"/> 查表。</param>
        /// <param name="position">绘制位置（屏幕坐标）</param>
        /// <param name="frame">源矩形（帧），应与物品贴图一致。</param>
        /// <param name="rotation">旋转角度 </param>
        /// <param name="origin">绘制锚点 </param>
        /// <param name="scale">缩放倍数 </param>
        /// <param name="effects">翻转效果 </param>
        /// <param name="drawData">成功时输出的绘制数据；失败时为 default。</param>
        /// <returns>是否成功构造 DrawData。</returns>
        public static bool TryBuildDrawData(Item item, Vector2 position, Rectangle frame, float rotation, Vector2 origin, float scale, SpriteEffects effects, out DrawData drawData, out float heldAlpha)
        {
            heldAlpha = 0;
            drawData = default;

            // 1. 查表：该物品未注册发光遮罩，直接拒绝绘制
            if (!Table.TryGetValue(item.type, out GlowMaskData data))
                return false;

            // 2. 校验贴图：未赋值或尚未加载完成（加载初期/热重载首帧），拒绝绘制
            if (data.Mask == null || !data.Mask.IsLoaded)
                return false;

            // 3. 构造 DrawData：遮罩贴图 + 发光颜色 + 调用方算好的变换参数
            drawData = new DrawData(
                data.Mask.Value,   // 遮罩贴图
                position,          // 绘制位置
                frame,             // 源矩形（帧）
                data.GlowColor,    // 发光颜色（自发光，不受环境光影响）
                rotation,          // 旋转
                origin,            // 锚点
                scale,             // 缩放
                effects);          // 翻转效果

            heldAlpha = data.HeldAlpha;
            return true;
        }
    }

    // 世界与 UI 的发光遮罩绘制
    public class GlowMaskGlobalItem : GlobalItem
    {
        // 在世界中绘制物品之后，叠加一层发光遮罩。
        public override void PostDrawInWorld(WorldItem item, SpriteBatch spriteBatch, Color lightColor,
            Color alphaColor, float rotation, float scale, int whoAmI)
        {
            // 查查看，物品有没有注册发光遮罩，如果没有 或 物品的发光遮罩关闭了世界绘制选项，直接跳过
            if (!GlowMaskData.Table.TryGetValue(item.type, out GlowMaskData data) || !data.DrawInWorld)
                return;

            // 获取物品贴图的帧（尺寸）
            Rectangle frame = TextureAssets.Item[item.type].Frame();
            // 物品中心转屏幕坐标

            //Vector2 position = item.Center - Main.screenPosition;

            Vector2 position = new Vector2(
                item.position.X - Main.screenPosition.X + item.width * 0.5f,
                item.position.Y - Main.screenPosition.Y + item.height - frame.Height * 0.5f
            );
            // 锚点 = 帧中心
            Vector2 origin = frame.Size() / 2f;

            // 构造 DrawData 并绘制
            if (GlowMaskData.TryBuildDrawData(item.inner, position, frame, rotation, origin, scale, SpriteEffects.None, out DrawData dd, out _ ))
            {
                dd.Draw(spriteBatch);
            }
        }

        // 在背包里绘制物品之后，叠加一层发光遮罩。
        public override void PostDrawInInventory(Item item, SpriteBatch spriteBatch, Vector2 position,
            Rectangle frame, Color drawColor, Color itemColor, Vector2 origin, float scale)
        {
            // 查查看，物品有没有注册发光遮罩，如果没有 或 物品的发光遮罩关闭了UI绘制选项，直接跳过
            if (GlowMaskData.Table.TryGetValue(item.type, out GlowMaskData data) && data.DrawInUI
                // 构造 DrawData（UI 里没有旋转，rotation 传 0）
                && GlowMaskData.TryBuildDrawData(item, position, frame, 0f, origin, scale,
                    SpriteEffects.None, out DrawData dd, out _))
            {
                dd.Draw(spriteBatch);
            }
        }
    }

    // 手持绘制层
    public class GlowMaskHeldItemLayer : PlayerDrawLayer
    {
        // 指定绘制层的位置：在 HeldItem（手持物品）之后绘制。
        public override Position GetDefaultPosition() => new AfterParent(PlayerDrawLayers.HeldItem);

        // 每一帧绘制玩家时调用，用来画手持物品的发光遮罩。
        protected override void Draw(ref PlayerDrawSet drawInfo)
        {
            Player player = drawInfo.drawPlayer;

            // 只在物品动画进行中（正在挥舞）时才绘制遮罩
            if (player.itemAnimation <= 0 || player.itemTime <= 0)
                return;

            // 查看当前玩家手持的物品
            Item item = drawInfo.heldItem;
            // 查看，物品有没有注册发光遮罩，如果没有 或 物品的发光遮罩关闭了手持绘制选项，直接跳过
            if (!GlowMaskData.Table.TryGetValue(item.type, out GlowMaskData data) || !data.DrawWhenHeld)
                return;

            // 物品在屏幕上的位置（世界坐标转屏幕坐标，取整避免抖动）
            Vector2 position = new Vector2(
                (int)(drawInfo.ItemLocation.X - Main.screenPosition.X),
                (int)(drawInfo.ItemLocation.Y - Main.screenPosition.Y));

            // 获取手持物品的帧
            Rectangle frame = player.GetItemDrawFrame(item.type);

            // 锚点：水平方向根据玩家朝向翻转，垂直方向在底部
            Vector2 origin = new Vector2(
                frame.Width * 0.5f - frame.Width * 0.5f * player.direction, // 水平居中，朝向翻转
                frame.Height);                                              // 垂直在底部

            // 重力翻转时（倒挂），Y 锚点也要翻转
            if (player.gravDir == -1f)
                origin.Y = frame.Height - origin.Y;

            float rotation = player.itemRotation;           // 物品旋转角度
            float scale = player.GetAdjustedItemScale(item); // 物品缩放

            float heldalpha = 0; // 

            // 构造 DrawData 并加入绘制缓存（PlayerDrawLayer 必须用 DrawDataCache 绘制）
            if (GlowMaskData.TryBuildDrawData(item, position, frame, rotation, origin, scale,
                    drawInfo.itemEffect, out DrawData dd, out heldalpha))
            {
                dd.color.A = (byte)(dd.color.A * heldalpha);
                drawInfo.DrawDataCache.Add(dd);
            }
        }
    }
}
```

这是我写的物品发光蒙版加载类。使用方式很简单：新建一个 `.cs` 文件，把这段代码放进去，然后把里面的：`namespace xxx` 改成你自己的文件位置即可。

粘贴好之后，我们在物品的 `SetStaticDefaults()` 方法里写：

```csharp
public override void SetStaticDefaults()
{
    var texture2D = ModContent.Request<Texture2D>("DemoMod/Content/GlowMasks/DemoGlowMasks");

    GlowMaskData.Table[Type] = new GlowMaskData(texture2D);
}
```

然后我们进入游戏，就能看到加载好的发光蒙版了：



![图片](images/tutorials/GlowMask-09.png)

物品栏

![图片](images/tutorials/GlowMask-10.gif)

掉落物

![图片](images/tutorials/GlowMask-11.gif)

手持使用

~~*（这下谁分得清你们俩啊）*~~



顺便提下：`GlowMaskData.Table[Type]` 是一个**静态字典**，一旦修改它，会影响所有同类型的物品。原则上来说，这种修改应该放在 `SetStaticDefaults()` 这类游戏运行中只会加载单次的方法里。

不过，同学们要只是单纯想动态调一下颜色，或是在多个不同的发光蒙版中挑选合适的贴图，也可以把它放在 `Shoot` 或类似会重复执行的方法内进行修改。**这样子写相当于进行一次全局修改，**所有这个类型的物品都会跟着变色**。** 模组还没发布，或是开发中途做点小测试，这样写没什么问题；但如果准备正式发布的模组，就不要在代码内这样写了。

---

# 创建弹幕蒙版

和 **物品** 不同，给 **弹幕** 添加发光蒙版非常的简单，**TML** 已经在底层帮我们写好了一套自动加载逻辑。在 `ModProjectile`（弹幕类）中，你可以看到这样一个属性：

> [⚠️]  
> *注：源码里的待办吐槽我们先不管，未来 TML 可能会更换方案，但目前它是这么工作的。*  

```csharp
/// <summary> 此弹幕的发光贴图文件名，位于模组加载器的文件空间中。如果该文件不存在，则会被忽略。 </summary>
public virtual string GlowTexture => Texture + "_Glow"; //TODO: 这样做很浪费。我们应该考虑 AutoStaticDefaults 之类的方案…… 频繁请求资源会带来性能问题
```

这意味着，我们不需要像物品那样写个复杂的加载，只需要将准备好的 **发光蒙版** 贴图，放到你的弹幕源码旁：

![图片](images/tutorials/GlowMask-12.png)

将这张贴图重命名为：**`你的弹幕类名 + _Glow`**，并保证 **图片名、类名、文件名 一致**。完成以后进入游戏，我们就能看到：

|![图片](images/tutorials/GlowMask-13.png)|![图片](images/tutorials/GlowMask-14.png)|
|---|---|

左：原版，右：发光蒙版

|![图片](images/tutorials/GlowMask-15.png)|![图片](images/tutorials/GlowMask-16.png)|
|---|---|

左：原版，右：发光蒙版

---

# 盔甲 与 NPC物块

### 盔甲发光蒙版：

针对玩家盔甲的“发光蒙版”绘制，**TModLoader** 官方并没有提供一个像 `ModProjectile` 那样“放个贴图就能自动画好”的好东西。不过，官方还是提供了一个明确的、算得上“半包装”的钩子，让我们不用从头写一遍玩家的绘制逻辑。

不需要新建 `PlayerDrawLayer`，只需要在 `ModItem` 里重写 `ModifyEquipTextureDraw` 方法，把盔甲的发光蒙版塞进去即可：

```csharp
public override bool ModifyEquipTextureDraw(ref PlayerDrawSet drawInfo, ref DrawData drawData, EquipTexture equipTexture, string methodName)
{
    // 1. 确保我们在客户端
    if (Main.dedServ) return true;

    // 2. 获取你的发光贴图（建议在 Load 或 SetStaticDefaults 里缓存，这里为了演示直接 Request）
    Texture2D glowTex = ModContent.Request<Texture2D>(Texture + "_Glow").Value;

    // 3. 构造发光蒙版的绘制数据
    // 直接复用原版的 drawData 的位置、旋转、缩放、帧矩形
    DrawData glowData = new DrawData(
        glowTex,
        drawData.position,
        drawData.sourceRect,
        Color.White, // 纯白，不受光照影响，实现发光
        drawData.rotation,
        drawData.origin,
        drawData.scale,
        drawData.effect,
        0
    );

    // 4. 把发光层加到绘制缓存里（这样它就会跟着玩家一起画）
    drawInfo.DrawDataCache.Add(glowData);

    // 5. 返回 true，保留原版盔甲本身的绘制
    return true;
}
```

把这段代码加进去，你就可以在盔甲上面画出发光蒙版了。不过要注意一个小坑

官方文档里专门警告了：

> *"This means that the Item instance is not the actual equipped item instance."*

它的意思是：你在这个方法里拿到的 `this`（也就是这个 `ModItem` 实例），**只是物品关联装备贴图的实例，并不是玩家身上真正穿着的物品实例。**

如果你需要基于物品数据做判断（比如：“这个 **ModItem** 里有个 `bool` 为真就冒红光”），**你不能直接对其进行修改**。正确的做法是，通过 `ModPlayer` 把玩家实际穿着的装备数据存下来，然后再基于玩家数据进行判断。



### NPC与 物块：

目前，`ModNPC` 和 `ModTile` 都没有像 `ModProjectile` 那样内置一个现成的 `GlowTexture` 属性。

这其实是 **tModLoader** 的一个历史遗留问题：`ModProjectile.GlowTexture` 是**TML**官方后来加上的便捷功能，而 NPC 和物块的发光贴图支持一直比较薄弱。

官方甚至有一个公开的 [Issue（\#1027）](https://github.com/tModLoader/tModLoader/issues/1027#1)专门讨论过这个问题，希望给 NPC、挥舞物品、物块也加上类似的自动加载功能，但至今仍未实装，所以NPC 的发光蒙版我们就只能自己手动画了。

#### 物块的“特例”钩子：

物块这边稍微好一点，官方提供了一个叫 `AdjustMultiTileVineParameters` 的方法。不过要注意，**它只对使用了** **`MultiTileVine`（多格藤蔓）特殊绘制点的物块生效。**

也就是说，只有当你的物块在 `SetStaticDefaults` 里调用了类似这样的代码，这个钩子才会被触发：

```csharp
// 在 SetStaticDefaults 里
TileObjectData.newTile.CopyFrom(TileObjectData.SpecialTileMakeFromShortestGrass); 
TileObjectData.newTile.StyleHorizontal = true;
TileObjectData.addTile(Type);
AddMapEntry(new Color(200, 200, 200));
DustType = DustID.Grass;
// 关键：告诉游戏这是一个多格藤蔓
TileDrawing.AddSpecialPoint(Type, TileDrawing.TileCounterType.MultiTileVine, ...);
```

满足条件后，就可以在 `AdjustMultiTileVineParameters` 里面这样写：

```csharp
public override void AdjustMultiTileVineParameters(int i, int j, 
    ref float? overrideWindCycle, 
    ref float windPushPowerX, 
    ref float windPushPowerY, 
    ref bool dontRotateTopTiles, 
    ref float totalWindMultiplier, 
    ref Texture2D glowTexture, 
    ref Color glowColor)
{
    // 建议在 Load 或 SetStaticDefaults 里缓存，这里为了演示直接 Request
    glowTexture = ModContent.Request<Texture2D>(Texture + "_Glow").Value;
    glowColor = Color.Cyan; // 青色发光
}
```

如果你做的物块不是多格藤蔓，那就享受不到上面这个便捷钩子了，只能和 NPC 一样，老老实实自己写绘制逻辑。

---

# 自制发光蒙版贴图



|![图片](images/tutorials/GlowMask-17.png)|![图片](images/tutorials/GlowMask-18.png)|
|---|---|

发光蒙版的贴图制作起来其实非常简单。我们只需要把原贴图中需要发光的部位单独抠出来。丢进绘图软件或在线网站里：

![图片](images/tutorials/GlowMask-19.png)

然后调整一下它的透明度，就可以直接在游戏内使用了。这里处理网站使用的是：

[tModWebTools &gt;&gt; ](https://trtool.yingtaoshu.org/) 这是一个面向泰拉瑞亚 模组/资源包 开发的在线工具站，除了贴图处理它还涵盖特效编辑、装备帧生成、解包、xnb 编辑等常用功能。

![图片](images/tutorials/GlowMask-20.png)

注意：贴图**越不透明**（不透明度越高），绘制出来的效果就越接近原版颜色；贴图**越透明**（不透明度越低），绘制出来的颜色就越发白；不过也别调得太透明，否则贴图可能就直接“消失”看不见了。



具体数值大家可以根据自己的需求自行调整。一般把透明度调到 **50%** 或 **75%** 就差不多了。我们把处理好的贴图放入文件：

![图片](images/tutorials/GlowMask-21.png)

然后我们进入游戏：

![图片](images/tutorials/GlowMask-22.png)

~~*（好像过于亮了，颜色以及挥动透明度什么的，你们就自己调调吧）*~~



如果你没有修改贴图索引，用的是TML自带的贴图加载功能的话，可以直接这么写：

```csharp
public override void SetStaticDefaults()
{
    var texture2D = ModContent.Request<Texture2D>(Texture + "_Glow");

    GlowMaskData.Table[Type] = new GlowMaskData(texture2D);
}
```

这里的 `Texture`，其实就是当前物品（比如 `DemoItem`）贴图路径的字符串索引。

它默认应该长这样：`DemoMod/Content/Items/DemoItem`

我们在它后面拼上一个 `"_Glow"`，路径就变成了：`DemoMod/Content/Items/DemoItem_Glow`

这样一来，`ModContent.Request` 就能准确获取到我们的发光蒙版贴图了。

---

# 结尾



![图片](images/tutorials/GlowMask-23.gif)

那......自定义**GlowMask** 教程到这里就结束啦！写到这里，说实话，连我自己都没想到这篇文章会变得这么长。一开始我以为发光蒙版只是个很简单的内容，随便讲讲就能收尾，结果真开始写才发现问题是一环扣着一环。

这次就不给大家布置什么作业了，大家随便找个物品写写看吧，玩得开心就好！



*©2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*

