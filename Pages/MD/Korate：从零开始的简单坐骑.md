原作者：Korate 再版：冬天的叶 2026/8/26 \| 🔖 入门

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

大家好，我叫Korate，也有人叫我阿K，最近在写的人物里有坐骑，但发现好像教程里没有相关的

资料，于是自己摸了源码后，来教大火简单写个坐骑。

![图片](images/tutorials/734660ec3c4f99c0a51c03dd.jpeg)

---

# 开场白

众所周知，一个坐骑的实现往往需要三个代码，（好吧并不是众所周知）分别为：

**1 坐骑的召唤物，用来按r召唤或者直接使用召唤**

**2 坐骑本身**

**3 坐骑的buff，buff持续时坐骑就会一直存在，按r或者手动取消掉都会取消坐骑**

首先最重要的自然是坐骑本身了，这里面有非常多乱七八糟的属性，第一次看可能会让你眼花。首

先来看看example里写的坐骑是什么样的



### 贴图：

|![图片](images/tutorials/1b002483433c6ed2dba4f7e6.png)|![图片](images/tutorials/30346226142cbb6749894bf0.png)|
|---|---|

|![图片](images/tutorials/f64cfb458bdca9023ea42aa1.png)|![图片](images/tutorials/f64cfb458bdca9023ea42aa1.png)|![图片](images/tutorials/d8269d79012f6afd08f2b371.png)|
|---|---|---|

### 代码：

```csharp
namespace ExampleMod.Content.Mounts
{
    // 这个坐骑是一辆带轮子的车，行为类似于独角兽坐骑。车后面绑着3个气球。
    public class ExampleMount : ModMount
    {
        private Asset<Texture2D> balloonTexture;

        // 由于 ModMountData 永远只会存在一个实例，我们可以用 player.mount._mountSpecificData 来存储与特定坐骑相关的额外数据。
        // 如果要在游戏效果中使用类似这样的东西，就需要 ModPlayer 同步，但这个例子纯粹是视觉上的。
        protected class CarSpecificData
        {
            internal static float[] offsets = new float[] { 0, 14, -14 };

            internal int count; // 追踪还剩下多少个气球。
            internal float[] rotations;

            public CarSpecificData() {
                count = 3;
                rotations = new float[count];
            }
        }

        public override void SetStaticDefaults() {
            // 移动
            MountData.jumpHeight = 5; // 坐骑能跳多高。
            MountData.acceleration = 0.19f; // 坐骑加速的速率。
            MountData.jumpSpeed = 4f; // 按下跳跃键时，玩家和坐骑向跳跃高度（负 y 速度）上升的速率。
            MountData.blockExtraJumps = false; // 决定你在坐骑上时是否可以使用二段跳（比如云朵瓶）。
            MountData.constantJump = true; // 允许你按住跳跃键不放。
            MountData.heightBoost = 20; // 坐骑与地面之间的高度
            MountData.fallDamage = 0.5f; // 坠落伤害倍率。
            MountData.runSpeed = 11f; // 坐骑的速度
            MountData.dashSpeed = 8f; // 坐骑在冲刺状态下的移动速度。
            MountData.flightTimeMax = 0; // 坐骑处于飞行状态的最大帧数。

            // 杂项
            MountData.fatigueMax = 0;
            MountData.buff = ModContent.BuffType<Buffs.ExampleMountBuff>(); // 分配给该坐骑的增益的 ID 编号。

            // 效果
            MountData.spawnDust = ModContent.DustType<Dusts.Sparkle>(); // 骑上或卸下坐骑时生成的尘埃的 ID。

            // 帧数据和玩家偏移
            MountData.totalFrames = 4; // 坐骑的动画帧数
            MountData.playerYOffsets = Enumerable.Repeat(20, MountData.totalFrames).ToArray(); // 用一个值填充数组，以减少重复代码
            MountData.xOffset = 13;
            MountData.yOffset = -12;
            MountData.playerHeadOffset = 22;
            MountData.bodyFrame = 3;
            // 站立
            MountData.standingFrameCount = 4;
            MountData.standingFrameDelay = 12;
            MountData.standingFrameStart = 0;
            // 奔跑
            MountData.runningFrameCount = 4;
            MountData.runningFrameDelay = 12;
            MountData.runningFrameStart = 0;
            // 飞行
            MountData.flyingFrameCount = 0;
            MountData.flyingFrameDelay = 0;
            MountData.flyingFrameStart = 0;
            // 空中
            MountData.inAirFrameCount = 1;
            MountData.inAirFrameDelay = 12;
            MountData.inAirFrameStart = 0;
            // 空闲
            MountData.idleFrameCount = 4;
            MountData.idleFrameDelay = 12;
            MountData.idleFrameStart = 0;
            MountData.idleFrameLoop = true;
            // 游泳
            MountData.swimFrameCount = MountData.inAirFrameCount;
            MountData.swimFrameDelay = MountData.inAirFrameDelay;
            MountData.swimFrameStart = MountData.inAirFrameStart;

            if (!Main.dedServ) {
                MountData.textureWidth = MountData.backTexture.Width() + 20;
                MountData.textureHeight = MountData.backTexture.Height();
            }

            balloonTexture = Mod.Assets.Request<Texture2D>("Content/Items/Armor/SimpleAccessory_Balloon");
        }

        public override void UpdateEffects(Player player) {
            // 这段代码为气球模拟了一些风阻。
            var balloons = (CarSpecificData)player.mount._mountSpecificData;
            float balloonMovementScale = 0.05f;

            for (int i = 0; i < balloons.count; i++) {
                ref float rotation = ref balloons.rotations[i]; // 这是一个引用变量。它被设置为直接指向 rotations 数组中的第 'i' 个索引，所以在这里它就像一个别名一样工作。

                if (Math.Abs(rotation) > MathHelper.PiOver2)
                    balloonMovementScale *= -1;

                rotation += -player.velocity.X * balloonMovementScale * Main.rand.NextFloat();
                rotation = rotation.AngleLerp(0, 0.05f);
            }

            // 如果我们移动得足够快，这段代码会生成一些尘埃。
            if (Math.Abs(player.velocity.X) > 4f) {
                Rectangle rect = player.getRect();

                Dust.NewDust(new Vector2(rect.X, rect.Y), rect.Width, rect.Height, ModContent.DustType<Dusts.Sparkle>());
            }
        }

        public override void SetMount(Player player, ref bool skipDust) {
            // 当骑上这个坐骑时，我们用一个新的 CarSpecificData 对象来初始化 _mountSpecificData，它将追踪这个坐骑的一些额外视觉效果。
            player.mount._mountSpecificData = new CarSpecificData();

            // 这段代码绕过了正常的坐骑生成尘埃，并用我们自己的视觉效果替换它。
            if (!Main.dedServ) {
                for (int i = 0; i < 16; i++) {
                    Dust.NewDustPerfect(player.Center + new Vector2(80, 0).RotatedBy(i * Math.PI * 2 / 16f), MountData.spawnDust);
                }

                skipDust = true;
            }
        }

        public override bool Draw(List<DrawData> playerDrawData, int drawType, Player drawPlayer, ref Texture2D texture, ref Texture2D glowTexture, ref Vector2 drawPosition, ref Rectangle frame, ref Color drawColor, ref Color glowColor, ref float rotation, ref SpriteEffects spriteEffects, ref Vector2 drawOrigin, ref float drawScale, float shadow) {
            // 每个我们提供的坐骑贴图都会调用一次 Draw，所以我们检查 drawType 以避免重复绘制。
            if (drawType == 0) {
                // 我们在 _Back 贴图之前绘制一些额外的气球
                var balloons = (CarSpecificData)drawPlayer.mount._mountSpecificData;
                int timer = DateTime.Now.Millisecond % 800 / 200;
                Texture2D balloon = balloonTexture.Value;

                for (int i = 0; i < balloons.count; i++) {
                    var position = drawPosition + new Vector2((-36 + CarSpecificData.offsets[i]) * drawPlayer.direction, 14);
                    var srcRect = new Rectangle(28, balloon.Height / 4 * ((timer + i) % 4), 28, 42);
                    float drawRotation = rotation + balloons.rotations[i];
                    var origin = new Vector2(14 + drawPlayer.direction * 7, 42);

                    playerDrawData.Add(new DrawData(balloon, position, srcRect, drawColor, drawRotation, origin, drawScale, spriteEffects ^ SpriteEffects.FlipHorizontally, 0));
                }
            }

            // 返回 true，常规绘制仍会继续执行。
            return true;
        }
    }
}
```

虽然他写了一长串，但实际上有用的东西并不算多。因为下面一大列全都是有关运动时的帧图控制的。

不过因为我的坐骑只有一帧，所以我决定不jiasdjflasdjflkj

好吧，简单说一下。

首先，`MountData.yOffset` 影响的是玩家位置和坐骑位置之间的偏差。当你发现玩家贴图和坐骑贴图没有对准的时候，调试它来获得更好的效果。`y` 是调试上下偏差，`xOffset` 自然就是左右了。

还有一个类似的属性：`MountData.playerYOffsets`。这个值决定玩家贴图的位置在哪里。如果你的坐骑在运动的时候并不是平稳的，而是类似马或者什么奇怪的东西的话，每一帧玩家所在的位置并不一样，可以尝试通过调整这个值来调整更准确的玩家贴图的 Y 轴位置。

注意：这是一个数组，`array[0]` 代表第一帧图的玩家位置，以此类推修改其他帧的玩家位置。

```csharp
// 跑步
MountData.runningFrameCount = 4;  // 跑步动画一共有 4 帧
MountData.runningFrameDelay = 12; // 每帧间隔 12 帧
MountData.runningFrameStart = 0;  // 从第 0 帧开始
```

控制跑步帧图的代码

后面一连串 `Frame` 相关的也都是调整帧图的，分别决定了在什么运动状态下使用什么帧图，具体作用看英文应该就能知道。比如跑步时，从第 0 帧开始，每个运动帧间隔 12 帧，一共有四帧。后面的也都是类似的意思。

---

# 坐骑常用的属性详解

好了，接下来是用来控制坐骑行为的关键属性了。

**`MountData.spawnDust`** 是召唤坐骑时的粒子特效，没什么追求的可以随便写个数字。

**`MountData.buff`** 是坐骑的 Buff，这个一会要写，用来获得一个“你正在骑着坐骑”的状态。

**`MountData.heightBoost = 20;`** 这个用来控制坐骑给玩家带来的额外高度，因此有些坐骑无法骑着进门。如果把这个设为 0，就是正常的玩家身高了。

**`MountData.fallDamage = 0.5f;`** 骑着坐骑的时候的掉落伤害，0.5 则为之前的一半。

**`MountData.runSpeed = 11f;`** 坐骑的跑步时的最高速度，一般很快就会达到这个值。关于速度的部分还有一个点：代码里的速度和游戏里的速度大概是 1:5 的关系。也就是说 10 速度，在游戏里大致会显示 50（其实是 51）。

**`MountData.dashSpeed = 18f;`** 如果写了这个值，则坐骑还会在达到跑步最大速度后开始冲刺，此为冲刺最大速度。注意要在地上跑才算正在冲刺且加速，在天上飞是不会加速度的。

**`MountData.flightTimeMax = 0;`** 如果你的坐骑可以飞行，则设置你的飞行时间，否则为 0。飞行时间会随着飞行而一直减少（好像是废话）。

**`MountData.fatigueMax = 0;`** 可以飞行的坐骑还会有疲劳值，疲劳值越高，则坐骑受到重力影响就越大，此值设置坐骑疲劳值的最大值。这个值会随着飞行时间逐渐增加，直到最大值。就算还有飞行时间，疲劳的坐骑也几乎飞不动，因为受重力影响太大了，具体表现为感觉像脚底裹了两斤水泥。

**`MountData.jumpHeight = 5;`** 坐骑的跳跃高度，越大则跳的越高。

**`MountData.acceleration = 0.19f;`** 坐骑的加速度，越大则越容易达到最大速度。正常来说都是小数，大于 1 的加速度非常快。

**`MountData.jumpSpeed = 4f;`** 跳跃速度。

**`MountData.blockExtraJumps = false;`** 这个值对于飞行或悬浮坐骑来说比较关键，禁用额外跳跃。设置 `true` 则为禁用，意思是这个坐骑无法额外跳跃，而悬浮坐骑则一次都不能跳，因为你只是在单纯的飞（比如 UFO），具体看你想实现什么效果。

**`MountData.totalFrames = 4;`** 坐骑的总帧数。

**`MountData.constantJump = true;`** 连跳，如果为 `true` 的话按住空格就可以每次落地时自动跳跃。

接下来是一个比较复杂的值。

**`MountData.usesHover = true;`** 此值为 `true` 时则表明该坐骑为一个悬浮坐骑。悬浮坐骑拥有的属性就很多了。首先它真的是悬浮的（蛤蛤），其次它的疲劳值不会随飞行时间增加，但是它仍然受到飞行时间的影响。飞行时间到了之后表现和其他坐骑不一样，它只会单纯地往你最后速度的方向飘，比如你在上升，它就会一直上升。当然你可以按“下”方向键来下降，也可以左右移动，但是不能再上升了。相当于飞行时间到了后，此坐骑的上升加速度始终为 0。

最后是获取你坐骑的贴图。请你的贴图遵循以下命名格式：

- `坐骑名_Front.png`

- `坐骑名_Back.png`

  这两种名字的区别在于你的坐骑的贴图是出现在玩家的身前还是身后。举个好理解的例子，就是 UFO 是出现在身前的，所以你看不见玩家的 jio，因为被遮住了。贴图名字的不同将导致下列代码获取的贴图不同，并且注意获取贴图时不能是服务器，因为服务器没有贴图数据会导致你的 mod 崩掉。下面为示例写法：

  ```csharp
  if (Main.netMode != NetmodeID.Server) {
      MountData.textureWidth = MountData.backTexture.Width();
      MountData.textureHeight = MountData.backTexture.Height();
      //MountData.textureWidth = MountData.frontTexture.Width();
      //MountData.textureHeight = MountData.frontTexture.Height();
  }
  ```

  在了解完这些后，其实使用 `usesHover` 来完成一个悬浮坐骑是不理想的，甚至是僵硬的。因为这是一个设置好的属性，你能修改的基本只有坐骑左右的移动速度。上下最高速度只有 41，并且刹车的性能也不太灵敏。所以说这个值相当于一个悬浮坐骑的模板。

  那么如何写一个自♂由的坐骑呢？

  ![图片](images/tutorials/d9e4ef3fc93f34a78273a8bc.jpeg)

  ---

# 猴子看了都直呼懂了的简易自由悬浮坐骑

首先是理论部分，要做一个悬浮坐骑：

1. 要让它悬浮，很自然地就是取消掉重力对坐骑的影响。

2. 玩家自由控制上下移动的加速度，可以通过检测玩家按键来修改玩家的 Y 轴速度实现。

   - **2.EX**：你会发现向上的速度可以是无限大，向下的速度却无论如何只能到 50。这是因为泰拉限制了玩家自由落体的最高速度，因此我们需要修改这个值。

3. 坐骑需要学会自己刹车。你一定不希望即便不控制方向，坐骑依然在持续漂移。

   那么知道了理论，应该如何实现上述效果呢？在 `UpdateEffects` 里面就可以自由地控制玩家属性。

   因为是保姆级教程，所以这里贴心地设置好了所有简易悬浮坐骑需要的变量。一问三不知的小白光设置这些速度，也能达到一个较好的效果。

   ```csharp
   public override void UpdateEffects(Player Korate)
   {
       float 下落最高速度 = 15f;
       float 向下加速度 = 0.5f;
       float 上升最高速度 = 15f;
       float 向上加速度 = 0.5f;
   
       Korate.gravity = 0; // 玩家没有重力
       Korate.maxFallSpeed = 下落最高速度; // 控制下落最大速度
   
       // 当按下“下”方向键时，如果 Y 轴速度没有达到最大则持续增加 Y 轴速度
       if (Korate.controlDown && Korate.velocity.Y <= 下落最高速度)
           // 这个值一般是零点几，大于一的加速度就已经很夸张了
           Korate.velocity.Y += 向下加速度;
       // 当按下“上”方向键或者“跳跃”时，如果 Y 轴速度没有达到最高速度则持续增加
       else if ((Korate.controlUp || Korate.controlJump) && Korate.velocity.Y >= -上升最高速度)
           Korate.velocity.Y -= 向上加速度; // 同理
       // 不控制方向时自动开始刹车
       else if (Korate.velocity.Y > 1.5)
           Korate.velocity.Y--;
       else if (Korate.velocity.Y < -1.5)
           Korate.velocity.Y++;
       else
           Korate.velocity.Y = 0; // 速度低于一定程度时则停止运动
   
       // player.fullRotation
       Korate.fallStart = (int)(Korate.position.Y / 16f); // 让你的坐骑拥有一个合理的坠落判定
   }
   ```

   ---

# 召唤坐骑的物品以及buff

## 坐骑物品

坐骑的物品没有任何特别的地方，宛如一个你已经写烂了的任何 Item。唯一不同的是：

```csharp
Item.mountType = ModContent.MountType<你坐骑的类名>();
```

好的，这就完成了，是不是非常简单呢？

## 坐骑 Buff

Buff 就更简单了，宛如一个你已经写烂了的任何 Buff。一般来说只需要加上：

```csharp
Main.buffNoTimeDisplay[Type] = true; // 不显示 Buff 时间
//再版补充
Main.buffNoSave[Type] = true；//当你退出这个世界时，这个增益不会保存
BuffID.Sets.MountType = ModContent.MountType<你坐骑的类名>();
```

并且在 `Update` 里设置坐骑：

```csharp
public override void Update(Player player, ref int buffIndex)
{
    player.mount.SetMount(ModContent.MountType<坐骑.扫帚>(), player);
    player.buffTime[buffIndex] = 10;
    //player.mount._fatigue = 0;  // 坐骑的疲劳值始终为 0
    //player.mount._flyTime = 320; // 坐骑的飞行时间
}
```

如果你不是自己写的坐骑运动逻辑，而是依靠了原版的方法，也可以在这里重置它们的飞行时间和疲劳，来达到无限飞行的效果。

---

# 结束语



![图片](images/tutorials/c8ceeb17583c9803c72f26d1.gif)

好的，寄，下次见



*©2026 冬天的叶 &amp;* *Korate* *\| 仅供个人学习，禁止商用二次分发*

