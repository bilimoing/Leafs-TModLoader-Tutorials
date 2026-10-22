原作者：Coralite 再版：冬天的叶  2026/10/19 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

在泰拉瑞亚中，Dust 是一种很常用的视觉效果，很多时候使用原版的粒子就能够有非常不错的效果了，但是或许你会想要有自己独特的效果，于是就可以使用 `ModDust` 来制作。

需要注意的是，本文中大部分时候提到的“粒子”都是指 Dust。在泰拉中有另外一种粒子叫做 Particle，关于它的内容会在结尾处稍微提一下。

本次教程中所使用到的粒子贴图是长这个样子的↓↓↓↓↓

![图片](images/tutorials/a7decd37b9a128978e6fe761.png)

# 创建一个 ModDust

就和创建物品、弹幕或者其他东西那样，在`Content`里新建一个文件夹并且起名为`Dusts`，然后在这个文件夹内新建一个`cs文件`，随便起一个名字（我这里使用`DemoDust`你们随意）作为文件名。然后将贴图放入其中，并保证 **图片名，类名，文件名** 一致。

![图片](images/tutorials/e8388b7ab8c4205e8ae70fc8.png)

之后创建一个公开类写下你的类名，再继承一下 `ModDust`：

```csharp
namespace DemoMod.Content.Dusts
{
    public class DemoDust : ModDust
    {

    }
}
```

到这里，我们的粒子就创建完成啦！你可以使用 `ModContent.DustType<DemoDust>()` 方法来获取 Mod 自定义的粒子 ID。但要注意，粒子与 **物品、弹幕** 不同，它没有 `SetDefaults()` 方法。

模组粒子的初始状态一般在 `OnSpawn` 和 `Update`这两个方法中设定。

`OnSpawn` 会在粒子生成时被调用，我们可以在这个方法里，给 `Dust` 的一些字段设置初始值。

具体如下：

```csharp
public override void OnSpawn(Dust dust)
{
    // 类似于弹幕的 aiStyle 和 AIType，把这个东西赋值为粒子类型就能使用对应的原版粒子的 AI
    // 在本期教程内不会用到这个东西，都是直接重写粒子 AI 的，所以让它是默认值 -1 就行。
    // UpdateType = -1;

    // 粒子是否受到重力效果，只有启用了原版的粒子 AI，并且这个原版的粒子 AI 使用了这个东西的情况下才有用
    // 如果 Update 返回 false 了，那么需要自己手动判断然后更改速度。
    dust.noGravity = true;

    // 粒子的颜色
    dust.color = Color.White;

    // 粒子的旋转角度
    dust.rotation = 0;

    // 粒子的帧图，用在绘制里
    // 同时这里的 Texture2D 属性就是粒子的贴图，它会自动加载，不需要自己给它赋值
    dust.frame = Texture2D.Value.Frame(1, 6, 0, 0);

    // 粒子使用的盔甲 shader，这里就不多展开细讲了，想了解如何使用的可以看它的注释或查看源码
    // 一些粒子能够使用玩家装备的染料的 shader，就是设置了这个东西
    // dust.shader
}
```

在生成了之后就是要更新这个粒子了，来到 `Update` 方法中。其实在这里面就和写弹幕 AI 比较类似，只不过可用的东西少一些。现在让这个粒子原地自转一下并不断修改它的帧图吧。

```csharp
public override bool Update(Dust dust)
{
    // 旋转每帧增加 0.05f
    dust.rotation += 0.05f;

    // fadeIn 这个东西可以把它当成计时器来用，当然也不只是能当成计时器，有需要的可以自行修改。
    dust.fadeIn++;

    // 每 5 帧变更一下帧图
    if (dust.fadeIn % 5 == 0)
    {
        dust.frame.Y += Texture2D.Value.Height / 6;
        if (dust.frame.Y >= Texture2D.Value.Height)
            dust.frame.Y = 0;
    }

    if (dust.fadeIn > 60 * 3) // 设置 3 秒钟后消失。原版的粒子基本上都是 scale 小于一定值就自动消失的
        dust.active = false;  // 直接让粒子消失

    return false;
}
```

这样一个基础的粒子就做好了。我们来尝试生成一下这个粒子。我在一个测试物品的 Shoot 这个方法中生成粒子，你可以在你喜欢的地方来生成它。要想获取模组粒子的 type，和其他的弹幕、物品什么的类似，使用 `ModContent.DustType`。

```csharp
// 在鼠标位置生成一个粒子，缩放调到了 2 来方便看得更清楚
Dust.NewDustPerfect(Main.MouseWorld, ModContent.DustType<DemoDust>(), Scale: 2);
```

接下来进入游戏来看看效果吧！

![图片](images/tutorials/7420ed5dee48e4b54f710eca.gif)

看上去，似乎旋转中心不太对劲？这是因为原版默认粒子是 8×8 大小的，旋转中心写死在了 (4, 4)。对于这个问题，我们可以重写 `PreDraw` 自己绘制来解决。

```csharp
public override bool PreDraw(Dust dust)
{
    Texture2D dustTex = Texture2D.Value;

    // 这里偷个懒，直接拿粒子的位置当作中心来用
    var position = dust.position - Main.screenPosition;

    // 使用粒子中心的位置获取亮度
    Color lightColor = Lighting.GetColor((int)dust.position.X / 16, (int)dust.position.Y / 16);

    // 粒子里也有 GetAlpha 这个重写方法，有需要的可以自行修改并且在此调用，而不是用这个东西
    // 我这里是偷懒了（
    Main.EntitySpriteDraw(dustTex, position, dust.frame, dust.color.MultiplyRGBA(lightColor),
        dust.rotation, dust.frame.Size() / 2, dust.scale, SpriteEffects.None);

    return false;
}
```

如果你不知道上面这一堆是在写些什么东西的话，我建议先看一看 [绘制教程](https://www.kdocs.cn/l/cnh64UsdwTPb) 和 [绘制教程 2 号](https://www.kdocs.cn/l/ceMvSPcHO4hD)。

再进入到游戏内就可以发现粒子现在能够正常地自转了。

![图片](images/tutorials/97e5ef2c98397871486ef3a5.gif)

---

# 来点特殊的行为

一个粒子就这样原地旋转似乎是有些太单调了，于是在这里来做一下特殊的效果吧！

![图片](images/tutorials/b507177cab4c2fa29e26bd05.gif)

原版的部分粒子是能够和物块产生一些互动的效果的，比如雪粒子让我们来看看源码是怎么写的.....

![图片](images/tutorials/7e9d17406fe6b369fc77d3d0.png)

~~（嗯，肥肠不错，抄过来）~~

于是经过一些小调整，我们的代码里面就变成了这样：

```csharp
public override void OnSpawn(Dust dust)
{
    // 类似于弹幕的 aiStyle 和 AIType，把这个东西赋值为粒子类型就能使用对应的原版粒子的 AI
    // 在本期教程内不会用到这个东西，都是直接重写粒子 AI 的，所以让它是默认值 -1 就行。
    // UpdateType = -1;

    // 粒子是否受到重力效果，只有启用了原版的粒子 AI，并且这个原版的粒子 AI 使用了这个东西的情况下才有用
    // 如果 Update 返回 false 了，那么需要自己手动判断然后更改速度。
    // dust.noGravity = true;

    // 粒子的颜色
    dust.color = Color.White;

    // 粒子的旋转角度
    dust.rotation = Main.rand.NextFloat(-3.14f,3.14f);

    // 粒子的帧图，用在绘制里
    // 同时这里的 Texture2D 属性就是粒子的贴图，它会自动加载，不需要自己给它赋值
    dust.frame = Texture2D.Value.Frame(1, 6, 0, 0);

    // 粒子使用的盔甲 shader，这里就不多展开细讲了，想了解如何使用的可以看它的注释或查看源码
    // 一些粒子能够使用玩家装备的染料的 shader，就是设置了这个东西
    // dust.shader
}
public override bool Update(Dust dust)
{
    // 旋转每帧增加 0.2f
    // dust.rotation += 0.05f;

    // fadeIn 这个东西可以把它当成计时器来用，当然也不只是能当成计时器，有需要的可以自行修改。
    dust.fadeIn++;

    // 每 5 帧变更一下帧图
    if (dust.fadeIn % 5 == 0)
    {
        dust.frame.Y += Texture2D.Value.Height / 6;
        if (dust.frame.Y >= Texture2D.Value.Height)
            dust.frame.Y = 0;
    }

    if (dust.fadeIn > 60 * 3) // 设置 3 秒钟后消失。原版的粒子基本上都是 scale 小于一定值就自动消失的
        dust.active = false;  // 直接让粒子消失

    // 如果粒子不是无视重力的，就给它加一点 Y 方向速度
    if (!dust.noGravity)
        dust.velocity.Y += 0.05f;

    // 检测碰撞
    if (Collision.SolidCollision(dust.position - Vector2.One * 5f, 10, 10))
    {
        dust.scale *= 0.9f;
        dust.velocity *= 0.25f;
    }

    // 由于我们直接把原版的粒子 AI 给阻挡掉了，所以需要自己更新粒子位置，千万别忘了这一点！！！！
    dust.position += dust.velocity;

    return false;
}
```

需要注意的是我这里取消了粒子更新里的自转并且在`OnSpawn` 里将粒子旋转随机赋值了。

并且**删掉了**`OnSpawn` 里的对`dust.noGravity` 的赋值，**别忘了这个！！**

好的，现在我们进入游戏看一下效果叭\~

![图片](images/tutorials/912b69424592a3a9d1c97e1e.gif)

虽然看着略显奇怪，但大体上没问题。

（一个小小的冷知识就是，原版在生成粒子时会随机给速度赋值，就像图里一样，明明没有在生成时改粒子的速度，但它却有一个随机的速度。）

接下来制作一个能够跟随玩家的粒子吧，就像原版的魔力值恢复满的时候生成的那个粒子一样。需要使用粒子中一个特殊的东西叫做 `customData`，它是一个 `object` 类型的变量，可以直接使用它来传入玩家。理论上来说，甚至能用它来记录粒子位置，做出有真正的拖尾的粒子。

爆改一下 `Update`，效果如下。

```csharp
public override bool Update(Dust dust)
{
    dust.fadeIn++;

    // 每 5 帧变更一下帧图
    if (dust.fadeIn % 5 == 0)
    {
        dust.frame.Y += Texture2D.Value.Height / 6;
        if (dust.frame.Y >= Texture2D.Value.Height)
            dust.frame.Y = 0;
    }

    if (dust.fadeIn > 60 * 3) // 设置 3 秒钟后消失。原版的粒子基本上都是 scale 小于一定值就自动消失的
        dust.active = false;  // 直接让粒子消失

    // 如果粒子不是无视重力的，就给它加一点 Y 方向速度
    if (!dust.noGravity)
        dust.velocity.Y += 0.05f;

    // 这里使用玩家位置减去玩家的旧位置来更新粒子的位置
    if (dust.customData != null && dust.customData is Player player)
        dust.position += player.position - player.oldPosition;

    return false;
}
```

接下来就是生成粒子时候的调整了，`Dust.NewDustPerfect` 直接返回Dust实例，可以直接使用，如果使用的是`Dust.NewDust` 的话返回的就是这个粒子在`Main.dust` 数组里的索引，这一点和弹幕基本一致。然后在生成粒子的时候需要手动传入一个`Player`提供玩家信息，并且让粒子在玩家中心附近随机生成。：

```csharp
Dust dust = Dust.NewDustPerfect(player.Center + Main.rand.NextVector2Circular(40, 40),
ModContent.DustType<DemoDust>(), Scale: 2);
dust.customData = player; // 这个 player 是 Shoot 提供的
```

进入游戏查看效果，如下。

![图片](images/tutorials/08944cbcd31318db787e60a5.gif)

~~*（非常好效果，使我的子弹左转）*~~

# 其他杂项

除了 `OnSpawn` 和 `Update`这两个常用方法以外。粒子还有 `MidUpdate` 这个重写方法，只有在 `Update` 返回 `true` 的时候才有可能调用到这个东西。如果返回 `false`，那么这个粒子的速度每帧就会乘以 `0.99f`，就……没啥大用。

`ModDust` 里的 `Texture` 属性直接给它重写赋值成 `null` 的话，就会让这个粒子使用原版的粒子贴图。

![图片](images/tutorials/1e828987379d5fae7b6ded83.png)

*来自 TML 的 Wiki 教程里的图*

使用 `ChildSafety.SafeDust` 可以判断这个粒子是否是个血腥的粒子，为 `false` 的话就会在更新中将它变为云的粒子，或者直接让它 `active` 变为 `false`，源码里是这样写的。

![图片](images/tutorials/462e12d38379f613cacf68ba.png)

![图片](images/tutorials/e3ff7bb2ca75a306ed869e53.png)

![图片](images/tutorials/4974c22b7f94edcb3a304c46.gif)

\~乖宝宝模式\~

---

# 真正的“粒子”？

其实 `Dust`，一般来说叫做灰尘；对于粒子，一般叫做 `Particle`。

原版的 Particle 需要使用和粒子完全不一样的东西生成，是使用 `ParticleOrchestrator.RequestParticleSpawn` 来生成。但是很不幸的是，目前并没有 `ModParticle` 这样的东西，所以只能用原版的。

对于使用原版的 Particle 以及所有 Particle 的样子，可以看 [*这个链接\~*](https://gist.github.com/Rijam/971b5252707860b65b582093580aa49c)

---

# 尾声

为什么一直没有 `ModDust` 的教程呢？因为它确实是非常简单（

简单到自己看一看 ExampleMod 就能解决的程度。

所以，下期见\~

### 额外挑战

试试来写一个带拖尾的粒子！

![图片](images/tutorials/6cfe98a78757e217146b3914.gif)

看着还挺酷炫。如果有兴趣可以试着自己钻研一下，主要内容其实都是绘制，和粒子什么的已经关系不大了。这里的拖尾使用的是一张黑底的灰度图。

参考代码：

```csharp
public override void OnSpawn(Dust dust)
{
    dust.color = Color.White;
    dust.frame = Texture2D.Value.Frame(1, 6, 0, 0);

    Vector2[] oldPos = new Vector2[20];
    for (int i = 0; i < oldPos.Length; i++)
        oldPos[i] = dust.position;

    dust.customData = oldPos;
}

public override bool Update(Dust dust)
{
    dust.fadeIn++;

    // 每 5 帧变更一下帧图
    if (dust.fadeIn % 5 == 0)
    {
        dust.frame.Y += Texture2D.Value.Height / 6;
        if (dust.frame.Y >= Texture2D.Value.Height)
            dust.frame.Y = 0;
    }

    if (dust.fadeIn > 60 * 5)
        dust.active = false;

    dust.velocity = Vector2.SmoothStep(dust.velocity,
        (Main.MouseWorld - dust.position).SafeNormalize(Vector2.Zero) * 8, 0.4f);
    dust.rotation = dust.velocity.ToRotation() + MathHelper.PiOver2;
    dust.position += dust.velocity;

    // 更新拖尾数组
    if (dust.customData is Vector2[] oldPos)
    {
        for (int i = 0; i < oldPos.Length - 1; i++)
            oldPos[i] = oldPos[i + 1];
        oldPos[^1] = dust.position;
        dust.customData = oldPos;
    }
    else
        dust.active = false;

    return false;
}

public override bool PreDraw(Dust dust)
{
    Texture2D Texture = ModContent.Request<Texture2D>("DemoMod/Content/Dusts/Extra_194").Value;

    // 这个 CustomVertexInfo，在很多拖尾绘制教程里都有，就不再写一遍了
    List<CustomVertexInfo> bars = new List<CustomVertexInfo>();

    // 随便填的颜色
    Color c = new Color(255, 174, 33) * 0.9f;
    c.A = 0;

    if (dust.customData is Vector2[] oldPos)
    {
        int trailCachesLength = oldPos.Length;
        for (int i = 0; i < trailCachesLength - 1; i++)
        {
            float factor = (float)i / trailCachesLength;
            Vector2 Center = oldPos[i] - Main.screenPosition;
            Vector2 normal = (oldPos[i + 1] - oldPos[i]).SafeNormalize(Vector2.Zero).RotatedBy(MathHelper.PiOver2);
            Vector2 Top = Center + normal * 14;
            Vector2 Bottom = Center - normal * 14; // <--- 这样的魔法数字写法只是偷懒，不建议学习
            var Color = c * factor;
            bars.Add(new(Top, Color, new Vector3(factor, 0, 0)));
            bars.Add(new(Bottom, Color, new Vector3(factor, 1, 0)));
        }

        Vector2 normal2 = (dust.rotation + 1.57f).ToRotationVector2();
        bars.Add(new(dust.position - Main.screenPosition + normal2 * 14, c, new Vector3(1, 0, 0)));
        bars.Add(new(dust.position - Main.screenPosition - normal2 * 14, c, new Vector3(1, 1, 0)));

        Main.graphics.GraphicsDevice.Textures[0] = Texture;
        Main.graphics.GraphicsDevice.DrawUserPrimitives(PrimitiveType.TriangleStrip, bars.ToArray(), 0, bars.Count - 2);
        Main.graphics.GraphicsDevice.DrawUserPrimitives(PrimitiveType.TriangleStrip, bars.ToArray(), 0, bars.Count - 2);
    }

    Texture2D dustTex = Texture2D.Value;
    var position = dust.position - Main.screenPosition;
    Color lightColor = Lighting.GetColor((int)dust.position.X / 16, (int)dust.position.Y / 16);
    Main.EntitySpriteDraw(dustTex, position, dust.frame, dust.color.MultiplyRGBA(lightColor),
        dust.rotation, dust.frame.Size() / 2, dust.scale, SpriteEffects.None);

    return false;
}
```



*©2026 冬天的叶 &amp;* *Coralite* *\| 仅供个人学习，禁止商用二次分发*

