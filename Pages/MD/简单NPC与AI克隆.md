作者 冬天的叶 2026/9/11 \| 🔖 入门 

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

这一节我们来学习如何创建一个自己的 NPC。相比弹幕，NPC 需要更高的“智能度”它需要同时满足，会动、会攻击、会掉落东西，所以逻辑相比弹幕要复杂一些。但别担心，我们从最基础的属性开始，一步步来。



在这一节中，我希望同学们能学会：



**1了解 NPC 的基础属性**

**2学会套用原版 AI 模型**

**3了解 NPC 的常用重写函数**

**4能够创建一个会自然生成、会掉落物品的 NPC**

---

# 什么是NPC

说了这么多，那么在游戏里，到底什么是**NPC**呢？



从最宽泛的定义来看，**NPC** 是“**非玩家角色（Non-Player Character）**”的缩写，泛指游戏中所有不由玩家操控的角色。在《泰拉瑞亚》里，这包括：

- **友好的城镇 NPC**：为你提供服务的居民。

- **敌怪**：会主动攻击你的怪物。

- **Boss**：强大的首领敌人。

- **小动物**：如兔兔、松鼠等。

- **城镇宠物**：如城镇兔兔、城镇猫咪等。

  

  但在日常交流和攻略中，当玩家提到“NPC”时，绝大多数情况指的都是**城镇 NPC**，也被称为**“居民”**。他们是游戏的核心内容之一。

  

  这个区分在**模组开发或讨论游戏机制时**尤其重要。因为在代码层面，它们虽然都属于 `NPC` 类，但**行为逻辑和设计定位**已经可以当作完全不同的实体来看待。

  ---

# NPC 的创建与基础属性

## 1创建 NPC 类

![图片](http://www.kdocs.cn/api/v3/office/copy/Uk5QbFFQeVNtdkdOK0RlZ3hZbThBdzJnaVBtR0hlbWc2dEhGNWtyd0krRS9SY0I2MEJTaGErNFBKMWNYS0pOa3BPYkJPU01YT3d5OXRQWUZPWFo1Y3VvbFppSFJoNmY0OFVKaWxtRjFvNzRLZzIwSkxLTUg2UnRqNkM4enpVelNucTIzS1Foc3ptbVhIdnpVU2M4Q0c2bU9VUkwzVVlEMVppYk9BOUt3dmw5bkh5aWV4a3JJOEY4YUNWeGpnc1dkOUdseGJLRXFlNDV1ZEo3Zm5lZkJtWHJDM0NGSGRmaWRoMVkzMHZNWDM5SFpzQmNienhEa1BOZklqLzkwd25jM05WK1Z4Y2FhclNzPQ==/attach/object/R3YZKUJKAAQBW?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlIzWVpLVUpLQUFRQlciLCJvd25lciI6IjU2OTk1NTk4NTQ2NyIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTYxLCJoZWlnaHQiOjEwMn0)

在创建**NPC**之前，我们需要在我们的**Content**文件夹下新建一个文件夹，并且起名为**NPCs**，然后在这个文件夹内新建一个**cs文件**，随便起一个名字（我这里使用**DemoNPC**你们随意）作为文件名。

![图片](http://www.kdocs.cn/api/v3/office/copy/Uk5QbFFQeVNtdkdOK0RlZ3hZbThBdzJnaVBtR0hlbWc2dEhGNWtyd0krRS9SY0I2MEJTaGErNFBKMWNYS0pOa3BPYkJPU01YT3d5OXRQWUZPWFo1Y3VvbFppSFJoNmY0OFVKaWxtRjFvNzRLZzIwSkxLTUg2UnRqNkM4enpVelNucTIzS1Foc3ptbVhIdnpVU2M4Q0c2bU9VUkwzVVlEMVppYk9BOUt3dmw5bkh5aWV4a3JJOEY4YUNWeGpnc1dkOUdseGJLRXFlNDV1ZEo3Zm5lZkJtWHJDM0NGSGRmaWRoMVkzMHZNWDM5SFpzQmNienhEa1BOZklqLzkwd25jM05WK1Z4Y2FhclNzPQ==/attach/object/6BJJQVBKACAH4?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjZCSkpRVkJLQUNBSDQiLCJvd25lciI6IjU2OTk1NTk4NTQ2NyIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzksImhlaWdodCI6MTQ0fQ)

当然，**NPC**也需要一张贴图来显示游戏里的形象，如果你没有准备贴图也没关系，教程这边给大家提供了一张僵尸（也许是）的贴图，大家可以下载使用。

![图片](http://www.kdocs.cn/api/v3/office/copy/Uk5QbFFQeVNtdkdOK0RlZ3hZbThBdzJnaVBtR0hlbWc2dEhGNWtyd0krRS9SY0I2MEJTaGErNFBKMWNYS0pOa3BPYkJPU01YT3d5OXRQWUZPWFo1Y3VvbFppSFJoNmY0OFVKaWxtRjFvNzRLZzIwSkxLTUg2UnRqNkM4enpVelNucTIzS1Foc3ptbVhIdnpVU2M4Q0c2bU9VUkwzVVlEMVppYk9BOUt3dmw5bkh5aWV4a3JJOEY4YUNWeGpnc1dkOUdseGJLRXFlNDV1ZEo3Zm5lZkJtWHJDM0NGSGRmaWRoMVkzMHZNWDM5SFpzQmNienhEa1BOZklqLzkwd25jM05WK1Z4Y2FhclNzPQ==/attach/object/N7IJUVBKAAQCO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik43SUpVVkJLQUFRQ08iLCJvd25lciI6IjU2OTk1NTk4NTQ2NyIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6Mjk0LCJoZWlnaHQiOjE2Mn0)

我们将教**NPC**贴图放入其中，并保证**图片名，类名，文件名**一致。而后我们创建一个 **NPC**，

继承 `ModNPC` ：

```csharp
using Terraria;
using Terraria.ID;
using Terraria.ModLoader;

namespace DemoMod.Content.NPCs
{
    public class ZombieTest : ModNPC
    {
        public override void SetStaticDefaults()
        {
            Main.npcFrameCount[Type] = 3;  // 设置这个 NPC 的动画帧数
        }

        public override void SetDefaults()
        {
            // 属性写在这里
        }
    }
}
```

## 2 NPC的基础属性

和物品、弹幕一样，NPC 也有 `SetStaticDefaults()` 和 `SetDefaults()`。前者用于设置特殊效果、帧数等静态数据，后者用于设置具体属性。

下面是一个典型的 NPC 的 `SetDefaults()`：

```csharp
public override void SetDefaults()
{
    // 通用属性
    NPC.width = 34;                     // 碰撞箱宽度
    NPC.height = 54;                    // 碰撞箱高度
    NPC.damage = 200;                   // 接触伤害
    NPC.lifeMax = 1100;                 // 生命上限
    NPC.defense = 100;                  // 防御力
    NPC.knockBackResist = 0f;           // 击退抗性（0 = 免疫击退）
    NPC.HitSound = SoundID.NPCHit1;     // 受伤音效
    NPC.DeathSound = SoundID.NPCDeath6; // 死亡音效
    NPC.value = Item.buyPrice(0, 0, 15, 0); // 掉落金钱
    NPC.buffImmune[BuffID.Poisoned] = true; // 是否免疫某个Buff 这里免疫中毒
    NPC.buffImmune[BuffID.Venom] = true;    // 免疫剧毒
    Banner = NPC.type;                  // 旗帜类型
    BannerItem = ItemID.Gel;            // 旗帜掉落物

    // 行为模式
    NPC.noGravity = false;              // 是否不受重力
    NPC.noTileCollide = false;          // 是否穿墙
    NPC.boss = false;                   // 是否标记为 Boss

    // 克隆相关
    NPC.aiStyle = 3;                    // AI 样式，-1 表示自己写
    AIType = NPCID.SlimedZombie;        // 决定 你的NPC 将克隆哪种NPC的行为，默认为0，不克隆
    AnimationType = NPCID.SlimedZombie;                  // 克隆NPC的帧图动画，默认为0，不克隆
}
```

看着蛮多挺唬人的，但这些属性中，大部分我们看名字就能理解：

### 通用属性：

#### **1 NPC.width 和 NPC.height（碰撞大小）**

这两个字段决定 NPC 的碰撞大小，类型为 `int`。

因为 NPC 是帧图，所以这两个字段最好填写**每一帧**的长度与宽度。

#### **2 NPC.damage（基础伤害）**

这个字段决定 NPC 的基础伤害，类型为 `int`。

注意：NPC 基础伤害会随世界难度变化，专家模式 ×2，大师模式 ×3。

#### **3 NPC.lifeMax（基础生命上限）**

这个字段决定 NPC 的基础生命上限，类型为 `int`。

注意：NPC 基础生命上限也会随世界难度变化，专家模式 ×2，大师模式 ×3。

#### **4 NPC.knockBackResist（基础击退抗性）**

这个字段决定 NPC 的基础击退抗性，类型为 `float`。

需要注意：虽然这个值字面意思是“击退抗性”，但实际效果是反过来的，**数值越大，受到的击退越高**。

设为 `0f` 表示免疫击退。

注意：NPC 基础击退抗性也会随世界难度变化，专家模式 ×0.9，大师模式 ×0.8。

#### **5 NPC.defense（防御力）**

这个字段决定 NPC 的防御力，类型为 `int`。

NPC 和玩家一样有防御属性，但它们在专家或大师模式中不会得到防御加成。而且 NPC 的防御力不管在什么模式下都只有 **50%** 的伤害减免。

#### **6 NPC.HitSound / NPC.DeathSound（受伤与死亡音效）**

这两个字段决定 NPC 受伤和死亡时播放的音效，类型为 `SoundStyle?`。

`HitSound` 是受伤音效，`DeathSound` 是死亡音效。默认为SoundID.Item 没声音。

我们可以通过**TML**提供的**SoundID** 可以使用原版的所有音效，对应的**ID**可以在 [这个Wiki页面](https://terraria.wiki.gg/zh/wiki/%E5%A3%B0%E9%9F%B3_ID)[ ](https://terraria.wiki.gg/zh/wiki/%E5%A3%B0%E9%9F%B3_ID)查看。如果原版的音效不够你用，可以使用new SoundStyle 加载自定义音效文件。

```csharp
NPC.HitSound = new SoundStyle("你的模组内部名/放音效的文件夹/音效文件")
{
    //这里方便你理解，给在内容里填的中文，你要是真照抄我打死你！
    Volume = 0.9f,//音量，0f ~ 1f
    PitchVariance = 0.2f,//音调随机变化范围，让每次射击声音略有不同，更真实
    MaxInstances = 3,//最多同时播放的实例数，防止音效叠加过多
};
```

音效文件的格式支持wav，ogg和mp3理论上也支持 .xnb不过这个就是纯整活了，初学者不用管它。

#### **7 NPC.buffImmune（Buff 免疫）**

这个字段是一个用 `BuffID` 索引的数组，设为 `true` 表示免疫该 Buff，类型为 `bool`。

#### **8 NPC.value（基础**钱币**掉落）**

这个字段决定 NPC 死亡后掉落的金钱数量，类型为 `int`。

一般配合我们的老朋友 `Item.buyPrice()` 使用，把铂金、金币、银币、铜币换算成铜币总数。

注意：NPC 基础钱币掉落也会随世界难度变化，专家模式 和 大师模式 都会 ×2.5。

#### **9 Banner / BannerItem（旗帜）**

这两个字段是 `ModNPC` 上的属性，不是 `NPC` 上的，所以前面没有 `NPC.`，类型为 `int`。

- `Banner`：旗帜类型，填 `NPC.type`，表示这个 NPC 自己的旗帜。

- `BannerItem`：旗帜掉落物，填这个 NPC 对应的旗帜物品 ID。

  ---

### 行为模式：

#### **1 NPC.noGravity（不受重力影响）**

这个字段决定 NPC 是否不受重力影响，类型为 `bool`，默认 `false`。

设为 `true` 时，NPC 会不受重力飘在空中，一般和 `noTileCollide（是否穿墙）` 配合使用。

注意：如果本字段为 `false`时，如果 `noTileCollide` 也是 `false`，NPC 会一直往下掉出世界。

#### **2 NPC.noTileCollide（是否穿墙）**

这个字段决定 NPC 是否能穿墙，类型为 `bool`，默认 `false`。

注意：如果 `noGravity（不受重力影响）` 为 `true`，本字段最好设为 `false`，否则 NPC 会一直往下掉出世界。

#### **3 NPC.boss（Boss）**

这个字段决定是否把 NPC 标记为 Boss，类型为 `bool`，默认 `false`。

设为 `true` 后，游戏会把它当成 Boss 处理：死亡时掉落生命恢复药水、大量心，并且会显示“XXX已被打败”之类的提示。

---

### 克隆相关：

#### **1** **NPC.aiStyle（AI 类型）**

这个字段决定 NPC 使用哪套原版 AI，类型为 `int`。`-1` 表示不使用原版 AI，完全自己写。我们这里填入 `3` 代表套用 战士ai 

```csharp
NPC.aiStyle = 3;                   // AI 样式，-1 表示自己写
```

注意：不要将**AI 类型**和 **NPC ID** 搞混淆。

**NPC ID**是**NPC的唯一编号**，如：

- `NPCID.BlueSlime` = 1

- `NPCID.DemonEye` = 2

- `NPCID.Zombie` = 3

  它被用来**区分每个NPC具体是哪只怪**，决定它的贴图、血量、掉落、名字,一个 ID 只对应一个 NPC。

  

  **AI 类型**是**NPC的行为模式**，决定这种 NPC 每帧怎么移动、怎么攻击。

  **多个 NPC ID 可以共用同一个 AI 类型，比如：**

- 蓝史莱姆、绿史莱姆、红史莱姆、冰史莱姆……**不同 ID，但都是史莱姆 AI**；

- 恶魔眼、游荡眼球怪……**不同 ID，但都是飞行 AI**；

- 各种僵尸……**不同 ID，但都是战士 AI**。

  

  原版代码里**AI 类型** 没有名字，只有编号：

  ```csharp
  npc.aiStyle = 1;   // 史莱姆 AI
  npc.aiStyle = 14;  // 飞行 AI
  npc.aiStyle = 3;   // 战士 AI
  ```

  Wiki 为了方便区分它们，给它们起了名字，相关内容可在这个[Wiki页面](https://terraria.wiki.gg/zh/wiki/AI)查询。

  

  但是，通过 `aiStyle` 克隆的行为逻辑，只能克隆一整个**大类**。没办法单独克隆某一个独立的NPC

  如果你想让 NPC 像史莱姆一样，填史莱姆的 `aiStyle`就够了。但是你只想要单独克隆挑猩红史莱姆的行为逻辑，哪 `aiStyle` 就无法做到。想精确的单独克隆 NPC，就得使用 `AIType`。

#### **2 AIType（精确克隆）**

这个字段是 `ModNPC` 上的属性，不是 `NPC` 上的，所以前面没有 `NPC.`。

它可以填入单独的原版 NPC ID，用来精确克隆这个 NPC 的 AI。类型为 `int`。默认值为0，不克隆。

举个例子：

```csharp
AIType = NPCID.SlimedZombie; // 史莱姆僵尸
```

这样就能精确克隆史莱姆僵尸的 AI

#### **3 AnimationType（帧图**克隆**）**

这个字段是 `ModNPC` 上的属性，不是 `NPC` 上的，所以前面没有 `NPC.`。

我们填写了 `aiStyle` 和 `AIType`，虽然可以精确克隆某个 NPC 的 AI，但是NPC 的动画却不会被完全复制过来。`AnimationType` 就是给我们用来克隆另一个 NPC 的帧图动画的。类型为 `int`。默认值为0，不克隆。举个例子：

```csharp
AnimationType = NPCID.SlimedZombie; // 史莱姆僵尸
```

这样就能套用史莱姆僵尸的帧图动画。

---

将`SetDefaults()`的内容粘贴进代码里，然后我们进入游戏，

用hero之类的模组生成我们的npc：

![图片](http://www.kdocs.cn/api/v3/office/copy/Uk5QbFFQeVNtdkdOK0RlZ3hZbThBdzJnaVBtR0hlbWc2dEhGNWtyd0krRS9SY0I2MEJTaGErNFBKMWNYS0pOa3BPYkJPU01YT3d5OXRQWUZPWFo1Y3VvbFppSFJoNmY0OFVKaWxtRjFvNzRLZzIwSkxLTUg2UnRqNkM4enpVelNucTIzS1Foc3ptbVhIdnpVU2M4Q0c2bU9VUkwzVVlEMVppYk9BOUt3dmw5bkh5aWV4a3JJOEY4YUNWeGpnc1dkOUdseGJLRXFlNDV1ZEo3Zm5lZkJtWHJDM0NGSGRmaWRoMVkzMHZNWDM5SFpzQmNienhEa1BOZklqLzkwd25jM05WK1Z4Y2FhclNzPQ==/attach/object/5N5LIVJKACAEQ?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjVONUxJVkpLQUNBRVEiLCJvd25lciI6IjU2OTk1NTk4NTQ2NyIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDU0LCJoZWlnaHQiOjMwOX0)

~~*怪怪的*~~

完美（），我们的npc和原版的僵尸逻辑捅出一辙，遇到障碍物会跳开，玩家跳跃时会跳起拦截，到白天会失去目标，不再主动攻击玩家。

# NPC 生成

NPC 属性设置好了，但有一个小问题摆在我们的面前，我们的NPC它不会自己在世界里面刷新。我们需要在`SpawnChance` 方法内手动定义它的生成几率：

```csharp
public override float SpawnChance(NPCSpawnInfo spawnInfo)
{
    //任何情况下都尝试生成
    return 1f;
}
```

`SpawnChance` 方法是用来判定一个NPC的生成几率的，他的返回值类型为 `float`。返回 `0` 表示不尝试生成，返回 `1` 表示必定生成。默认为 `0` 不尝试生成.

这个生成几率不是你理解的那种，一出屏幕范围就刷一大坨怪。举个例子，哥布林入侵的时候，哥布林战士，哥布林盗贼，哥布林弓箭手，他们的尝试生成几率就是`1` 必定生成。自然生成的史莱姆王则为 `0.015` 更多NPC生成相关内容可在这个[Wiki页面](https://terraria.wiki.gg/zh/wiki/NPC_%E7%94%9F%E6%88%90#%E7%94%9F%E6%88%90%E9%99%90%E5%88%B6)查询。

---

### 原版生成条件

当然，无条件乱生成NPC显然不是我们想要的，

`SpawnCondition` 里面预制了很多原版生物生成条件：

```csharp
// 塔与事件
SpawnCondition.NebulaTower              // 星云塔区域
SpawnCondition.VortexTower              // 星旋塔区域
SpawnCondition.StardustTower            // 星尘塔区域
SpawnCondition.SolarTower               // 日耀塔区域
SpawnCondition.Sky                      // 天空刷怪
SpawnCondition.Invasion                 // 入侵事件
SpawnCondition.GoblinArmy               // 哥布林军队
SpawnCondition.FrostLegion              // 霜月军团
SpawnCondition.Pirates                  // 海盗入侵
SpawnCondition.MartianMadness           // 火星暴乱
SpawnCondition.Bartender                // 酒馆老板
SpawnCondition.SpiderCave               // 蜘蛛洞穴
SpawnCondition.DesertCave               // 沙漠洞穴
SpawnCondition.HardmodeJungleWater      // 困难模式丛林水域
SpawnCondition.HardmodeCrimsonWater     // 困难模式猩红水域

// 海洋与水域
SpawnCondition.Ocean                    // 海洋
SpawnCondition.OceanAngler              // 海洋渔夫
SpawnCondition.OceanMonster             // 海洋怪物
SpawnCondition.BeachAngler              // 沙滩渔夫
SpawnCondition.JungleWater              // 丛林水域
SpawnCondition.CavePiranha              // 洞穴食人鱼
SpawnCondition.CaveJellyfish            // 洞穴水母
SpawnCondition.WaterCritter             // 水中生物
SpawnCondition.CorruptWaterCritter      // 腐化水中生物
SpawnCondition.OverworldWaterCritter    // 地表水中生物
SpawnCondition.OverworldWaterSurfaceCritter  // 地表水面生物
SpawnCondition.OverworldUnderwaterCritter    // 地表水下生物
SpawnCondition.DefaultWaterCritter      // 默认水中生物

// 城镇与 NPC
SpawnCondition.BoundCaveNPC             // 洞穴被绑 NPC
SpawnCondition.TownCritter              // 城镇生物
SpawnCondition.TownWaterCritter         // 城镇水中生物
SpawnCondition.TownOverworldWaterCritter        // 城镇地表水中生物
SpawnCondition.TownOverworldWaterSurfaceCritter // 城镇地表水面生物
SpawnCondition.TownOverworldUnderwaterCritter   // 城镇地表水下生物
SpawnCondition.TownDefaultWaterCritter  // 城镇默认水中生物
SpawnCondition.TownSnowCritter          // 城镇雪地生物
SpawnCondition.TownJungleCritter        // 城镇丛林生物
SpawnCondition.TownGeneralCritter       // 城镇通用生物

// 地牢与蘑菇
SpawnCondition.Dungeon                  // 地牢
SpawnCondition.DungeonGuardian          // 地牢守卫
SpawnCondition.DungeonNormal            // 地牢普通
SpawnCondition.Meteor                   // 陨石
SpawnCondition.OldOnesArmy              // 撒旦军队
SpawnCondition.FrostMoon                // 霜月
SpawnCondition.PumpkinMoon              // 南瓜月
SpawnCondition.SolarEclipse             // 日食
SpawnCondition.HardmodeMushroomWater    // 困难模式蘑菇水域
SpawnCondition.OverworldMushroom        // 地表蘑菇
SpawnCondition.UndergroundMushroom      // 地下蘑菇

// 困难模式特殊怪物
SpawnCondition.CorruptWorm              // 腐化蠕虫
SpawnCondition.UndergroundMimic         // 地下宝箱怪
SpawnCondition.OverworldMimic           // 地表宝箱怪
SpawnCondition.Wraith                   // 怨灵
SpawnCondition.HoppinJack               // 跳跳杰克
SpawnCondition.DoctorBones              // 骷髅博士
SpawnCondition.LacBeetle                // 紫胶虫
SpawnCondition.WormCritter              // 蠕虫生物
SpawnCondition.MouseCritter             // 老鼠生物
SpawnCondition.SnailCritter             // 蜗牛生物
SpawnCondition.FrogCritter              // 青蛙生物
SpawnCondition.HardmodeJungle           // 困难模式丛林
SpawnCondition.JungleTemple             // 丛林神庙
SpawnCondition.UndergroundJungle        // 地下丛林
SpawnCondition.SurfaceJungle            // 地表丛林
SpawnCondition.SandstormEvent           // 沙尘暴
SpawnCondition.Mummy                    // 木乃伊
SpawnCondition.DarkMummy                // 黑暗木乃伊
SpawnCondition.LightMummy               // 光明木乃伊
SpawnCondition.OverworldHallow          // 地表神圣
SpawnCondition.EnchantedSword           // 附魔剑
SpawnCondition.Crimson                  // 猩红
SpawnCondition.Corruption               // 腐化

// 地表与地下通用
SpawnCondition.Overworld                // 地表
SpawnCondition.IceGolem                 // 冰霜巨人
SpawnCondition.RainbowSlime             // 彩虹史莱姆
SpawnCondition.AngryNimbus              // 愤怒雨云
SpawnCondition.MartianProbe             // 火星探测器
SpawnCondition.OverworldDay             // 地表白天
SpawnCondition.OverworldDaySnowCritter  // 地表白天雪地生物
SpawnCondition.OverworldDayGrassCritter // 地表白天草地生物
SpawnCondition.OverworldDaySandCritter  // 地表白天沙地生物
SpawnCondition.OverworldMorningBirdCritter // 地表清晨鸟类生物
SpawnCondition.OverworldDayBirdCritter  // 地表白天鸟类生物
SpawnCondition.KingSlime                // 史莱姆王
SpawnCondition.OverworldDayDesert       // 地表白天沙漠
SpawnCondition.GoblinScout              // 哥布林侦察兵
SpawnCondition.OverworldDayRain         // 地表白天下雨
SpawnCondition.OverworldDaySlime        // 地表白天生成史莱姆
SpawnCondition.OverworldNight           // 地表夜晚
SpawnCondition.OverworldFirefly         // 地表萤火虫
SpawnCondition.OverworldNightMonster    // 地表夜晚怪物
SpawnCondition.Underground              // 地下
SpawnCondition.Underworld               // 地狱
SpawnCondition.Cavern                   // 洞穴（兜底）
```

你可以使用 `Active`和`Chance` 来获取条件是否满足以及条件满足后的生成机率。

```csharp
SpawnCondition.OverworldDaySlime.Active   // 当前条件是否成立，bool
SpawnCondition.OverworldDaySlime.Chance   // 条件成立刷怪的概率，float
```

举个例子：

```csharp
public override float SpawnChance(NPCSpawnInfo spawnInfo)
{
    // 在地表能生成史莱姆的情况下，以它的十分之一的几率生成
    return SpawnCondition.OverworldDaySlime.Chance * 0.1f;
}
```

---

### 世界相关条件

除了`SpawnCondition` 我们也可以加入一些其他的判断条件，如：

```csharp
  public override float SpawnChance(NPC.Spawner spawner)
  {
      // 在血月以50%的概率生成
      if (Main.bloodMoon)
          return 0.5f;

      // 如果下雨以20%的概率生成
      else if (Main.raining)
          return 0.2f;

      return 0f;
  }
```

Main里还有一大堆的世界判定

`Main.dayTime`白天返回 true

`Main.bloodMoon`血月返回 true

`Main.raining`下雨返回 true

`Main.hardMode`困难模式返回 true

`Main.expertMode`专家模式返回 true

`NPC`自己也有一些判断方法

`NPC.AnyNPCs(NPCID.IceGolem)`世界上有冰雪巨人时返回 true

`NPC.CountNPCS(NPCID.IceGolem) < 2`世界上冰雪巨人少于 2 个时返回 true

---

### 生成玩家获取

当然这些还不够，在Wiki里有一张图：

![图片](http://www.kdocs.cn/api/v3/office/copy/Uk5QbFFQeVNtdkdOK0RlZ3hZbThBdzJnaVBtR0hlbWc2dEhGNWtyd0krRS9SY0I2MEJTaGErNFBKMWNYS0pOa3BPYkJPU01YT3d5OXRQWUZPWFo1Y3VvbFppSFJoNmY0OFVKaWxtRjFvNzRLZzIwSkxLTUg2UnRqNkM4enpVelNucTIzS1Foc3ptbVhIdnpVU2M4Q0c2bU9VUkwzVVlEMVppYk9BOUt3dmw5bkh5aWV4a3JJOEY4YUNWeGpnc1dkOUdseGJLRXFlNDV1ZEo3Zm5lZkJtWHJDM0NGSGRmaWRoMVkzMHZNWDM5SFpzQmNienhEa1BOZklqLzkwd25jM05WK1Z4Y2FhclNzPQ==/attach/object/XUGO6VJKABQDS?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlhVR082VkpLQUJRRFMiLCJvd25lciI6IjU2OTk1NTk4NTQ2NyIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6ODMyLCJoZWlnaHQiOjI4MzR9)

如果我们要让怪物在太空生成，该怎么办呢？

其实玩家所在的位置，玩家所处的环境，这些信息全都在`Player` 里，我们打出sky 自动补全就会给我们补出`Player.ZoneSkyHeight` 这就很好了，但是`ZoneSkyHeight`参数是 `Player` 里的属性，

而通过 `Main.player[NPC.target];` 获取的 `Player` 是NPC当前攻击目标的玩家。

有一些NPC没有攻击目标。有一些NPC攻击目标是按照仇恨值来的，而不是距离。这就导致我们直接使用这样获取到的 `Player` 是肯定会出问题的。

那么该怎么办呢。其实 我们在`SpawnChance` 方法给的 `NPC.Spawner spawner` 里，可以拿到NPC的具体生成信息。

我们只需要使用 `spawner.Player` 就能获取尝试生成这个NPC 的玩家了

```csharp
 public override float SpawnChance(NPC.Spawner spawner)
 {
     if (spawner.Player.ZoneSkyHeight) return 1.0f;
     return 0f;
 }
```

这就可以正确的在玩家所在的相关位置生成我们的NPC了。

### 更多判断条件

除了`Player` `NPC.Spawner spawner` 里还有更多生成信息供我们使用，

比如 `spawner.SpawnTileType` 尝试生成这个NPC 的物块等

```csharp
public override float SpawnChance(NPC.Spawner spawner)
{
    // 在草地上以50%的概率生成
    if (spawner.SpawnTileType == TileID.Grass)
        return 0.5f;
    return 0f;
}
```

以下是spawner 的完整变量速查表

```csharp
// 生成点坐标
SpawnTileX              // 生成点X坐标(瓦片)
SpawnTileY              // 生成点Y坐标(瓦片)
GroundTileY             // 实际站立地面Y坐标
SpawnTileType           // 生成点下方物块ID
SpawnWallType           // 生成点背景墙ID
SafeRangeX              // 生成点是否在安全区X范围内

// 生成速率
spawnRate               // 生成速率(越小越快, 每tick 1/spawnRate概率生成)
maxSpawns               // 附近NPC数量上限
defaultSpawnRate        // 默认生成速率
defaultMaxSpawns        // 默认NPC上限
numberOfActivePlayers   // 活跃玩家数量
reachedInvasionBossCap  // 是否达到入侵Boss上限

// 生成区域
spawnArea               // 可生成矩形区域
safeArea                // 屏幕内安全区(禁止生成)
sWidth ，sHeight        // 屏幕宽/高(像素)
safeRangeX ，safeRangeY // 安全区扩展范围
spawnSpaceX ，spawnSpaceY // 生成空间尺寸(默认2x3)

// 玩家上下文
Player                  // 当前玩家
pX / pY                 // 玩家X/Y坐标(瓦片) [注意: 不是生成点坐标]
luck                    // 玩家运气
defaultTarget           // 默认目标玩家索引(255=无)
townNPCs                // 附近城镇NPC数量

// 时间/天气
dayTime                 // 是否白天
raining                 // 是否下雨
skyBehindPlayer         // 玩家背后是天空墙
isSpawningInWindDirection // 是否顺风向生成

// 深度/区域
surfaceSpawn            // true=在生成点地表层
underGround             // true=在生成点地下层
deeperThanRockLayer     // true=生成点在岩石层以下
isOcean                 // true=生成点属于海洋区域
isBeach                 // true=生成点属于沙滩区域
inRemixStartingArea     // true=玩家在Remix世界起始区域
livingTree              // true=生成点在生活树墙内
skyMob                  // true=生成天空怪物(鸟妖/飞龙), false=普通地表怪

// 生成规则标志(关键语义!) 
spawnFriendly           // true=生成友好生物(小动物), false=生成怪物
ignoreSafeWalls         // true=允许刷在安全墙后, false=不刷在安全墙后(默认)
waterTile               // true=生成点上方2格有水
noWorms                 // true=禁止蠕虫生成(房屋墙前), false=允许
noGroundWorms           // true=禁止地面蠕虫(玩家挂机), false=允许
invaders                // true=入侵进行中且玩家在附近, false=无
hardDungeon             // true=花后且困难模式(困难地牢), false=普通地牢
playerHasStartingHealth // true=玩家未使用过生命水晶
offensiveToTim          // true=蒂姆生成加成(宝石袍+非巫师帽), false=无加成

// 特殊地形(附近检测) 
nearGranite             // true=生成点/玩家附近有花岗岩
nearMarble              // true=生成点/玩家附近有大理石
spawnSpider             // true=生成点/玩家在蜘蛛洞
spawnUndergroundDesert  // true=生成点/玩家附近是地下沙漠

// 生物群系
ZoneCorrupt             // true=腐化
ZoneCrimson             // true=猩红
ZoneHallow              // true=神圣
ZoneJungle              // true=丛林
ZoneSnow                // true=雪地
ZoneGlowshroom          // true=发光蘑菇
ZoneMeteor              // true=陨石
ZoneGraveyard           // true=墓地
ZoneDungeon             // true=地牢
ZoneLihzhardTemple      // true=神庙
ZoneGranite             // true=花岗岩群系
ZoneMarble              // true=大理石群系
ZoneSandstorm           // true=沙尘暴

// 事件与四柱
ZoneTowerSolar          // true=日耀柱区域
ZoneTowerVortex         // true=星旋柱区域
ZoneTowerNebula         // true=星云柱区域
ZoneTowerStardust       // true=星尘柱区域
ZoneOldOneArmy          // true=撒旦军队区域

// 蜡烛
ZoneWaterCandle         // true=水蜡烛范围内(增加生成)
ZonePeaceCandle         // true=和平蜡烛范围内(减少生成)
ZoneShadowCandle        // true=暗影蜡烛范围内(取消城镇保护)

// 秘密种子
dualDungeonsSpawnRules  // true=双地牢种子生效
inDualDungeon           // true=玩家在双地牢内
tresspassingDualDungeon // true=玩家非法闯入双地牢(诅咒进度不足)
```

那么在了解以上内容后，我们可以尝试编写我们的NPC生成条件了

我们写的是一个僵尸NPC ，那么它应该刷新在 地表 ，夜晚，非城镇的环境下，

并且不该刷在安全墙后面：

```csharp
public override float SpawnChance(NPC.Spawner spawner)
{
    // 地表 + 夜晚 + 非城镇 + 不刷在安全墙后
    // 想一想这种写法和spawner.Player.ZoneOverworldHeight的区别
    if (spawner.SpawnTileY <= Main.worldSurface 
        && !Main.dayTime
        && !SpawnCondition.TownCritter.Active
        && !spawner.ignoreSafeWalls)
    {
        return 0.1f; // 权重 0.1
    }
    return 0f;
}
```

---

# NPC 掉落

好了，NPC的生成部分就告一段落了，我们来编写一下我们的NPC的掉落物（如果你没打算让NPC掉东西，可以跳过这段了）

掉落物品的代码需要写在 `ModifyNPCLoot` 方法里：

```csharp
public override void ModifyNPCLoot(NPCLoot npcLoot)
{
    npcLoot.Add(ItemDropRule.Common(ItemID.DirtBlock)); // 总是 1/1 (100%) 掉落一个泥土

    npcLoot.Add(ItemDropRule.Common(ItemID.ZombieArm,4)); // 以 1/4 (25%) 的概率掉落一个僵尸臂

    npcLoot.Add(ItemDropRule.Common(ItemID.ZombieArm, 10)); // 以 1/10 (10%) 的概率掉落一个史莱姆法杖

    npcLoot.Add(ItemDropRule.Common(ItemID.Gel, 2, 5, 15));// 以 1/2 (50%) 的概率掉落 5 到 10 个凝胶
}
```

注意，这个方法是用于 **储存掉落规则 记录掉落物** 的。只会在加载模组时被执行一次。

不要和NPC的`Kill`类方法混淆。

更多NPC生成相关内容可在这个[摸彩袋与NPC掉落.otl](https://www.kdocs.cn/l/ctL47Uq5l7ec?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1NjQzMDc0MDg5MDEiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY3RMNDdVcTVsN2VjIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU2OTk1NTk4NTQ2NyJ9)教程内查询。

# NPC 动画

NPC 的帧图动画一般需要自己写，除非你设置了 `animationType`。

和弹幕不同，NPC 的帧图动画有一个专门的重写函数：

```csharp
public override void FindFrame(int frameHeight)
{
}
```

参数 `frameHeight` 是每一帧的高度。NPC 的帧切换是通过设置 `NPC.frame.Y` 来实现的，而且**精确到像素**，举个例子：

```csharp
public override void FindFrame(int frameHeight)
{
    NPC.frameCounter++;
    if (NPC.frameCounter >= 6)  // 每 6 帧切换一次
    {
        NPC.frameCounter = 0;
        NPC.frame.Y += frameHeight;  // 切换到下一帧

        // 如果超出总帧数，回到第一帧
        if (NPC.frame.Y >= frameHeight * Main.npcFrameCount[NPC.type])
        {
            NPC.frame.Y = 0;
        }
    }
}
```

下标从 0 开始，所以第一帧的 `NPC.frame.Y` 是 `0`，第二帧是 `frameHeight`，以此类推。

---

# 结尾



这一期的内容差不多到这里就结束了。其实我本来打算讲讲 NPC 的 AI逻辑，但不知不觉又讲了一大堆内容。而且 NPC 的大部分 AI 逻辑都和索敌有关。它和弹幕不一样：弹幕的 AI 方法是每帧都执行的，NPC 的 AI 则依赖索敌，可能会中途中断。



所以这部分打算放到下期来讲。下期教程，我们来教怎么让这个僵尸 NPC 在白天也能对玩家索敌，并且在白天时把攻击逻辑换成史莱姆的逻辑。



最后留个小作业：克隆一个恶魔之眼 NPC，并让它每过 5 秒对玩家发射一次弹幕。

---

# 彩蛋

**STEVE\_666**2022年3月19日 下午1:24

对于在特定生物群系生成的问题，可以用if(spawnInfo.player.ZoneXXX)，以下是ZoneXXX列表

```csharp
ZoneDungeon           // 地牢
ZoneCorrupt           // 腐化
ZoneHallow            // 神圣
ZoneMeteor            // 陨石
ZoneJungle            // 丛林
ZoneSnow              // 雪原
ZoneCrimson           // 猩红

ZoneWaterCandle       // 水蜡烛（刷怪加成）
ZonePeaceCandle       // 和平蜡烛（降低刷怪）
ZoneShadowCandle      // 暗影蜡烛（刷怪加成）

ZoneTowerSolar        // 日耀柱
ZoneTowerVortex       // 星旋柱
ZoneTowerNebula       // 星云柱
ZoneTowerStardust     // 星尘柱

ZoneDesert            // 沙漠
ZoneGlowshroom        // 发光蘑菇
ZoneUndergroundDesert // 地下沙漠

ZoneSkyHeight         // 太空（世界顶部 35%）
ZoneOverworldHeight   // 地表（地面以上，不到太空）
ZoneDirtLayerHeight   // 地下（地表以下，不到洞穴层）
ZoneRockLayerHeight   // 洞穴层（岩石层，不到地狱）

ZoneUnderworldHeight  // 地狱
ZoneBeach             // 海滩
ZoneRain              // 下雨
ZoneSandstorm         // 沙尘暴

ZoneOldOneArmy        // 撒旦军队事件

ZoneGranite           // 花岗岩
ZoneMarble            // 大理石

ZoneHive              // 蜂巢
ZoneGemCave           // 宝石洞
ZoneLihzhardTemple    // 蜥蜴神庙
ZoneGraveyard         // 墓地
ZoneShimmer           // 微光
```



*©2026 冬天的叶 仅供个人学习，禁止商用二次分发*

