原作者：Cyril 再版：冬天的叶 2026/9/17 \| 🔖 高级

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

本篇教程将教授你编写摸彩袋（如宝匣、宝藏袋）开袋掉落物品与NPC掉落基本代码

基础部分基本上是 [tML官方教程](https://github.com/tModLoader/tModLoader/wiki/Basic-NPC-Drops-and-Loot-1.4) 的翻译与完善，以及一点点基本的 `IItemDropRule` 编写技巧.

## **简要说明**

在 1.4，原版维护着一个掉落数据库，包含了每个 NPC 应掉落的物品。对于模组来说，这个数据库在模组加载期间填充。 而玩家可以通过图鉴查看这些数据。模组可以在 `ModNPC` 类或 `GlobalNPC` 类中使用 `ModifyNPCLoot` 方法来注册 NPC 的物品掉落规则。此外，所有可以开出物品的摸彩袋类物品也可以通过 `ModifyItemLoot` 以类似的方式注册。

### **这种方式有什么好处？**

1.3 的物品掉落系统完全依赖直接的物品生成代码，因此无法可靠地确定特定 NPC 掉落的物品。 而 1.4 则维护了一个专门的数据库，该数据库有助于实现图鉴查询功能，并允许模组更加便捷地调整原有的物品掉落。 例如，在 1.3 中，不可能在不冒破坏其他模组的风险的情况下将一个物品添加到一组物品掉落中，而新系统允许更可靠地调整物品掉落。

### **IItemDropRule**

每个物品掉落规则都是 `IItemDropRule` 接口的一个实例。原版包括很多种编写好的 `IItemDropRule`，后面会解释。 每条规则都有规定物品类别、堆叠多少和物品掉落几率的逻辑。

### **添加物品掉落的方法**

#### **NPC 掉落**

如果我们的模组添加了一个 NPC，并且我们想要为该 NPC 提供特定的掉落物，请将相关代码放在 **`ModNPC`** 类的 `ModifyNPCLoot` 钩子中。 如果我们想给特定的原版 NPC 添加或修改掉落物，请将代码放在 **`GlobalNPC`** 类的 `ModifyNPCLoot` 钩子中。 如果我们想为所有 NPC 添加特定掉落，就像地牢金钥匙和黑暗/光明魂的掉落，请将代码放在 `GlobalNPC.ModifyGlobalLoot` 中。 添加到所有 NPC 的掉落称为全局规则，不会显示在图鉴中。 为了 Mod 之间的兼容性，请对于特定情况使用特定方法。

#### **摸彩袋物品**

如果我们的模组添加了一个摸彩袋物品，你可以将物品掉落相关代码放在 **`ModItem`** 类的 `ModifyItemLoot` 钩子中。 如果我们想给特定的原版摸彩袋添加或修改掉落物，请将代码放在 **`GlobalItem`** 类的 `ModifyItemLoot` 钩子中。

### **如何指定我的物品？**

在下面的示例中，我们对于原版物品，我们使用**英文ID**，如：`ItemID.Shackle`。 如果你要指定模组物品，可以通过用 `ModContent.ItemType<ItemName>()` 获取其ID

## **基本示例**

下面是一个十分基础的为 NPC 添加物品掉落的示例

首先，要使用原版写好的规则，你需要下面这行引用

```csharp
using Terraria.GameContent.ItemDropRules;
```

### **为 ModNPC 添加掉落**

```csharp
namespace MyMod
{
    public class MyNPC : ModNPC
    {
        // 其他无关掉落的代码
        public override void ModifyNPCLoot(NPCLoot npcLoot) {
            // 这是我们添加物品掉落规则的地方，这里是一个简单的例子:
            npcLoot.Add(ItemDropRule.Common(ItemID.Shackle, 50));
        }
    }
}
```

### **为原版 NPC 添加掉落**

```csharp
namespace MyMod
{
    public class MyGlobalNPC : GlobalNPC
    {
        public override void ModifyNPCLoot(NPC npc, NPCLoot npcLoot) {
            // 首先，我们需要检查 npc.type 以查看代码是否正在为我们要进行更改的原版 NPC 运行
            if (npc.type == NPCID.VampireBat) {
                // 这是我们为吸血蝙蝠添加物品掉落规则的地方，这是一个简单的例子:
                npcLoot.Add(ItemDropRule.Common(ItemID.Shackle, 50));
            }
            // 我们可以在这里使用其他 if 语句来调整其他原版NPC的掉落规则
        }
    }
}
```

### 特殊情况

一些原版Boss需要特殊条件和规则来检测他们被击杀并准备掉落战利品。

世界吞噬者：

```csharp
if (npc.type is NPCID.EaterofWorldsBody or NPCID.EaterofWorldsHead or NPCID.EaterofWorldsTail)
{
    LeadingConditionRule leadingConditionRule = new(new Conditions.LegacyHack_IsABoss());
    leadingConditionRule.OnSuccess(/*在这里编写你自己的规则*/);
    // leadingConditionRule.OnSuccess(/*添加新的一行编写附加规则*/);
    npcLoot.Add(leadingConditionRule);
}
```

双子魔眼：

```csharp
if (npc.type is NPCID.Retinazer or NPCID.Spazmatism)
{
    LeadingConditionRule leadingConditionRule = new LeadingConditionRule(new Conditions.MissingTwin());
    leadingConditionRule.OnSuccess(/*在这里编写你自己的规则*/);
    // leadingConditionRule.OnSuccess(/*添加新的一行编写附加规则*/);
    npcLoot.Add(leadingConditionRule);
}
```

## **必备知识**

下面是一些关于物品掉落规则的基本知识，以便你编写自定义掉落方式

### **掉落几率：分子(Numerator)与分母(Denominator)**

在图鉴中，掉落概率一般以百分数的形式显示，如 25%。但在代码中，它表示为一个分数。 分数由分子（Numerator）和分母（Denominator）组成：



NumeratorDenominator



例如，分数 14 对应于 25%。 许多掉落规则仅包含分母参数并假设分子为 1，但应该有其他选项可用于构建分子不为 1 的掉落规则。

### **运气**

关于运气与其影响与原理，可见 [官方Wiki](https://terraria.wiki.gg/zh/wiki/%E8%BF%90%E6%B0%94#%E5%BD%B1%E5%93%8D)

下面是与运气相关的 `Player.RollLuck` 代码，这个方法在那些考虑玩家运气的掉落规则中用于实现概率

```csharp
public int RollLuck(int range) {
    if (luck > 0f && Main.rand.NextFloat() < luck)
        return Main.rand.Next(Main.rand.Next(range / 2, range));
    if (luck < 0f && Main.rand.NextFloat() < 0f - luck)
        return Main.rand.Next(Main.rand.Next(range, range * 2));
    return Main.rand.Next(range);
```

通俗地说，运气值越高，随机到小数的概率越大，运气值越低，随机到小数的概率越小

## **常用掉落规则**

现在您知道了放置物品掉落规则的位置，现在我们将学习如何制定实际规则。 许多规则有多种创建方式。 最常见的方法是使用 `ItemDropRule` 类中的静态方法，但您也可以直接使用类的构造函数 `new AaBb(...)` 来创建规则。

下面描述的每个规则都必须注册到掉落数据库。 例如，如果您希望使用的规则是 `ItemDropRule.Common(ItemID.BeeGun)`，那么您最终编写的代码将是 `npcLoot.Add(ItemDropRule.Common(ItemID.BeeGun));`，对于摸彩袋物品则是 `itemLoot.Add(ItemDropRule.Common(ItemID.BeeGun));`

### **单个物品掉落**

1. `ItemDropRule.Common(int itemId, int chanceDenominator = 1, int minimumDropped = 1, int maximumDropped = 1)`

2. `new CommonDrop(int itemId, int chanceDenominator, int amountDroppedMinimum = 1, int amountDroppedMaximum = 1, int chanceNumerator = 1)`

   该规则将根据提供的参数给出的概率掉落物品，也可以控制物品堆叠，下面是几个例子：

   ```csharp
   ItemDropRule.Common(ItemID.BeeGun) // 总是掉落一个蜜蜂枪
   ItemDropRule.Common(ItemID.BeeGun, 8) // 以 1/8 (12.5%) 的概率掉落一个蜜蜂枪
   ItemDropRule.Common(ItemID.Torch, 4, 10, 15) // 以 1/4 (25%) 的概率掉落 10 到 15 个火把
   new CommonDrop(ItemID.Torch, 5, 10, 15, 2) // 以 2/5 (40%) 的概率掉落 10 到 15 个火把
   ```

### **从多个物品中选择一个掉落**

1. `ItemDropRule.OneFromOptions(int chanceDenominator, params int[] options)`

2. `ItemDropRule.OneFromOptionsWithNumerator(int chanceDenominator, int chanceNumerator, params int[] options)`

3. `new OneFromOptionsDropRule(int chanceDenominator, int chanceNumerator, params int[] options)`

   此规则将从一个特定物品列表中随机选取一个掉落。

   ```csharp
   // 以 100% 的概率从以下三个物品中掉落其一
   ItemDropRule.OneFromOptions(1, ItemID.MagicDagger, ItemID.PhilosophersStone, ItemID.StarCloak)
   // 以 1/100 即 1% 的概率从以下三个物品中掉落其一，每个约 0.33% 掉落率
   ItemDropRule.OneFromOptions(100, ItemID.AncientCobaltHelmet , ItemID.AncientCobaltBreastplate , ItemID.AncientCobaltLeggings) 
   // 以 7/10 即 70% 的概率从以下三个物品中掉落其一，每个约 23.33% 掉落率
   ItemDropRule.OneFromOptionsWithNumerator(10, 7, ItemID.Ruby, ItemID.Amber, ItemID.Diamond)
   ```

### **从多个物品中选择多个掉落**

1. `ItemDropRule.FewFromOptions(int amount, int chanceDenominator, params int[] options)`

2. `ItemDropRule.FewFromOptionsWithNumerator(int amount, int chanceDenominator, int chanceNumerator, params int[] options)`

3. `new FewFromOptionsDropRule(int amount, int chanceDenominator, int chanceNumerator, params int[] options)`

   是上一个规则的“升级版”，此规则将从一个特定物品列表中随机选取一个或多个掉落，`amount` 参数即为掉落数量，应保证其小于或等于总数量，掉落的物品不会重复。

   ```csharp
   // 以 100% 的概率从以下三个物品中掉落其二
   ItemDropRule.FewFromOptions(2, 1, ItemID.MagicDagger, ItemID.PhilosophersStone, ItemID.StarCloak)
   // 以 1/100 即 1% 的概率从以下三个物品中掉落其一
   ItemDropRule.FewFromOptions(1, 100, ItemID.AncientCobaltHelmet, ItemID.AncientCobaltBreastplate,
       ItemID.AncientCobaltLeggings)
   // 以 7/10 即 70% 的概率从以下七种宝石中掉落其中五个
   ItemDropRule.FewFromOptionsWithNumerator(5, 10, 7, ItemID.Sapphire, ItemID.Topaz, ItemID.Emerald,
       ItemID.Amethyst, ItemID.Ruby, ItemID.Amber, ItemID.Diamond)
   ```

### **为特定模式配置不同物品掉落**

1. `ItemDropRule.NormalvsExpert(int itemId, int chanceDenominatorInNormal, int chanceDenominatorInExpert)`

2. `new DropBasedOnExpertMode(IItemDropRule ruleForNormalMode, IItemDropRule ruleForExpertMode)`

3. `new DropBasedOnMasterMode(IItemDropRule ruleForDefault, IItemDropRule ruleForMasterMode)`

   第一个用于对单个物品的不同掉率，而第二第三个用于在不同模式配置不同的规则

   ```csharp
   // 经典模式 1/40 (2.5%) 概率，专家模式 1/30 (3.33%) 概率
   ItemDropRule.NormalvsExpert(ItemID.BlessedApple, 40, 30)
   // 经典模式掉落苹果(食物)，专家模式掉落恩赐苹果
   new DropBasedOnExpertMode(ItemDropRule.Common(ItemID.Apple), ItemDropRule.Common(ItemID.BlessedApple))
   // 经典和专家模式掉落苹果，大师模式从苹果和恩赐苹果中选其一 (用到了先前提到的 OneFromOptions)
   new DropBasedOnMasterMode(ItemDropRule.Common(ItemID.Apple), ItemDropRule.OneFromOptions(1, ItemID.Apple, ItemID.BlessedApple))
   ```

### **有条件地掉落**

1. `ItemDropRule.ByCondition(IItemDropRuleCondition condition, int itemId, int chanceDenominator = 1, int minimumDropped = 1, int maximumDropped = 1, int chanceNumerator = 1)`

2. `new ItemDropWithConditionRule(int itemId, int chanceDenominator, int amountDroppedMinimum, int amountDroppedMaximum, IItemDropRuleCondition condition, int chanceNumerator = 1)`

   通过传入 `IItemDropRuleCondition`，可以构造一个仅在满足特定条件时才掉落物品的掉落规则。

   ```csharp
   // 如果满足 SoulOfLight(光魂) 掉落条件，则有 20% 的几率掉落一个光明之魂
   new ItemDropWithConditionRule(ItemID.SoulofLight, 5, 1, 1, new Conditions.SoulOfLight()) 
   // 如果是猩红世界且不是专家模式，则掉落 30 到 90 个猩红矿
   ItemDropRule.ByCondition(new Conditions.IsCrimsonAndNotExpert(), ItemID.CrimtaneOre, 1, 30, 90) 
   ```

### **在某个规则(未)被选择时掉落物品**

查看下面的**规则链**篇目以了解相关信息

### **双子魔眼式掉落**

这需要用到一个**自定义掉落条件**，你也可以查看源码中的 `Conditions.MissingTwin` 作为一个示例

### **四柱碎片式一个个掉落**

`new DropOneByOne(int itemId, DropOneByOne.Parameters parameters)`

可参考 Example Mod 中 [MinionBossBody](https://github.com/tModLoader/tModLoader/blob/stable/ExampleMod/Content/NPCs/MinionBoss/MinionBossBody.cs#L202) 的相关使用代码 `DropOneByOne`

### **宝藏袋**

`ItemDropRule.BossBag(int itemId)`

基本上是Boss掉落必备的部分

```csharp
// 在专家及大师模式下，为所有玩家掉落教徒宝藏袋
ItemDropRule.BossBag(ItemID.CultistBossBag)
```

### **为所有玩家掉落**

1. `public DropPerPlayerOnThePlayer(int itemId, int chanceDenominator, int amountDroppedMinimum, int amountDroppedMaximum, IItemDropRuleCondition optionalCondition)`

2. `ItemDropRule.MasterModeDropOnAllPlayers(int itemId, int chanceDenominator = 1)`

   就像宝藏袋一样，每个玩家独享一个，只不过没有专家模式的要求。第二个相当于一个带大师模式条件的预设，在原版用于Boss宠物。

   ```csharp
   // 每人掉落 114-514 个不等的大师诱饵
   new DropPerPlayerOnThePlayer(ItemID.MasterBait, 1, 114, 514, null)
   // 在饥荒特殊种子世界中，每人有 50% 的几率掉落 1 个蛙腿三明治
   new DropPerPlayerOnThePlayer(ItemID.FroggleBunwich, 2, 1, 1, new Conditions.DontStarveIsUp())
   // 在大师模式下，每人有 25% 的几率掉落香蕉回旋镖
   ItemDropRule.MasterModeDropOnAllPlayers(ItemID.Bananarang, 4)
   ```

## **掉落条件 (IItemDropRuleCondition)**

许多掉落规则允许提供 `IItemDropRuleCondition`。 该对象指示发生掉落所需的条件。 常见条件包括事件、已被击败的 Boss、世界模式、当前生物群系等。

所有的原版掉落条件可以通过查询源码获得，位于 `Terraria.GameContent.ItemDropRules.Conditions`，这里列出一些可能常用的供速查使用，参考英文名即可了解具体条件

- 双月事件: `IsPumpkinMoon`, `FromCertainWaveAndAbove(特定波数及以上)`

- 击杀相关: `DownedAllMechBoss`, `DownedPlantera`, `FirstTimeKillingPlantera`, `BeatAnyMechBoss`

- 模式相关: `NotExpert`, `NotMasterMode`, `IsExpert`, `IsMasterMode`

- 世界邪恶: `IsCrimson`, `IsCorruption`

- 秘密种子: `TenthAnniversaryIs(Not)Up`, `DontStarveIs(Not)Up`

- 预设条件组合: `IsCrimsonAndNotExpert`, `IsCorruptionAndNotExpert`, `SoulOfNight`, `SoulOfLight`, `XXXKeyCondition(环境钥匙)`, `PirateMap`

### **自定义掉落条件**

如果需要，您可以创建自己的条件。

有关自定义条件的示例，请参见 ExampleMod 中的[一些示例](https://web.archive.org/web/20250402194229/https://github.com/Cyrillya/Example-Mod-Zh-Project/tree/master/Common/ItemDropRules/DropConditions)及其用法。

#### **首次击杀Boss条件**

世纪之花在首次击杀时一定会掉落榴弹发射器和 50-149 一号火箭，相关代码如下：

```csharp
// 首先，定义一个非专家模式规则
LeadingConditionRule notExpertRule = new LeadingConditionRule(new Conditions.NotExpert());
npcLoot.Add(type, notExpertRule);
// 当非专家模式规则为真时，将尝试执行此 firstTimeKillingPlanteraRule 规则 (第一次击杀世纪之花)
LeadingConditionRule firstTimeKillingPlanteraRule =
    new LeadingConditionRule(new Conditions.FirstTimeKillingPlantera());
notExpertRule.OnSuccess(firstTimeKillingPlanteraRule);
// 此 grenadeLauncherRule 规则会掉落一个榴弹发射器和 50-149 个一号火箭
IItemDropRule grenadeLauncherRule = ItemDropRule.Common(ItemID.GrenadeLauncher);
grenadeLauncherRule.OnSuccess(ItemDropRule.Common(ItemID.RocketI, 1, 50, 150), hideLootReport: true);
// 当 firstTimeKillingPlanteraRule 成功时，将执行 greanadeLauncherRule，掉落物品
firstTimeKillingPlanteraRule.OnSuccess(grenadeLauncherRule, hideLootReport: true);
// 否则，将执行这 7 条规则中的随机一条
firstTimeKillingPlanteraRule.OnFailedConditions(new OneFromRulesRule(1, grenadeLauncherRule,
    ItemDropRule.Common(ItemID.VenusMagnum), ItemDropRule.Common(ItemID.NettleBurst),
    ItemDropRule.Common(ItemID.LeafBlower), ItemDropRule.Common(ItemID.FlowerPow),
    ItemDropRule.Common(ItemID.WaspGun), ItemDropRule.Common(ItemID.Seedler)));
```

根据以上代码，我们可以知道如果不是专家模式且第一次杀死世纪之花，那么榴弹发射器肯定会掉落。 不是第一次击杀的话，7条规则中的一条会掉落。 重要的部分是 Conditions.FirstTimeKillingPlantera 条件。 此代码如下所示：

```csharp
public class FirstTimeKillingPlantera : IItemDropRuleCondition, IProvideItemConditionDescription
{
    public bool CanDrop(DropAttemptInfo info) => !NPC.downedPlantBoss;
    public bool CanShowItemDropInUI() => true;
    public string GetConditionDescription() => null;
}
```

重要的部分是 `CanDrop` 方法，这里他检查 `!NPC.downedPlantBoss`（意味着当 Boss 没有被击败时它会掉落），通过这个可以在掉落执行前判断世纪之花是否已被击败。 至关重要的是，NPC 掉落是在像 `NPC.downedPlantBoss` 这样的 “是否被击杀”标志设置为 `true` 之前执行的，所以在掉落时为 `false` 就必定是首杀。

同样的方法可以用于其他原版和模组 Boss。 代码中仅存在 `FirstTimeKillingPlantera` 这一个条件，但模组制作者可以通过使用适当的 [NPC.downedX](https://github.com/tModLoader/tModLoader/wiki/NPC-Class-Documentation#downedboss1) 变量为任何其他 Boss 创建 `IItemDropRuleCondition`。 而通过在 [ModSystem 类](https://web.archive.org/web/20250402194229/https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Common/Systems/DownedBossSystem.cs#L17) 中跟踪相关变量，也可以将此方法应用到模组 Boss

## **规则链**

规则可以链接在一起以形成更复杂的物品掉落逻辑。

### **链接方法**

例如，蜂后掉落物之一是从五个可能中随机选择。 蜂巢魔杖有 33% 几率，蜜蜂帽、蜜蜂衬衫和蜜蜂裤各有 11% 几率，还有 33% 几率啥都不掉。 为了形成这个逻辑，使用了以下代码：

```csharp
ItemDropRule.ByCondition(new Conditions.NotExpert(), ItemID.HiveWand, 3).OnFailedRoll(ItemDropRule.OneFromOptionsNotScalingWithLuck(2, ItemID.BeeHat, ItemID.BeeShirt, ItemID.BeePants)
```

首先，蜂巢法杖有 33% 的几率掉落，但前提是世界不是专家。 通过 `OnFailedRoll` 方法链接到该物品掉落规则的，是一条以 50% 的几率掉落 3 个蜜蜂时装套装物品之一的规则。 通过 `OnFailedRoll` 链接的规则仅在满足原始规则条件，但在随机几率判定失败时才使用。 于是，有 66% 的几率会执行以 50% 的可能掉落蜜蜂时装物品，因此最后的几率是 33% 的几率获得其中一件蜜蜂时装物品，也就是每件 11% 的几率。

链接的其他选项包括 `OnSuccess` 和 `OnFailedConditions`。如果原始规则成功则运行 `OnSuccess`，如果原始规则条件判定失败则运行 `OnFailedConditions`。

```csharp
var chocolateChipRule = ItemDropRule.ByCondition(new Conditions.IsHardmode(), ItemID.ChocolateChipCookie, 4);
chocolateChipRule.OnFailedRoll(ItemDropRule.Common(ItemID.Apple));
chocolateChipRule.OnFailedConditions(ItemDropRule.Common(ItemID.Coconut));
itemLoot.Add(chocolateChipRule);
```

在以上代码中，先行规则 `chocolateChipRule` 通过 `Conditions.IsHardmode` 条件判断是否是困难模式，若是，则有 25% 的几率掉落巧克力曲奇饼干，通过 `OnFailedConditions` 链接椰子掉落规则，通过 `OnFailedRoll` 链接苹果掉落规则，则最终呈现效果为：

- 若**是**困难模式，则有 25% 的概率掉落巧克力曲奇饼干

- 若**是**困难模式，且巧克力曲奇饼干不掉落，则固定掉落苹果

- 若**不是**困难模式，则固定掉落椰子

### **先行规则**

使用称为 `LeadingConditionRule` 的规则，可以使一组规则嵌套在单个条件规则下，而不是为每个规则重复相同的条件。

```csharp
// 此代码使用 LeadingConditionRule 嵌套多个规则。
LeadingConditionRule leadingConditionRule = new LeadingConditionRule(new Conditions.NotExpert());
leadingConditionRule.OnSuccess(ItemDropRule.Common(ItemID.HiveWand, 4));
leadingConditionRule.OnSuccess(ItemDropRule.Common(ItemID.HiveWand, 7));
npcLoot.Add(leadingConditionRule);
vs
// 这种方法重复条件指定代码。
npcLoot.Add(ItemDropRule.ByCondition(new Conditions.NotExpert(), ItemID.HiveWand, 4));
npcLoot.Add(ItemDropRule.ByCondition(new Conditions.NotExpert(), ItemID.HiveWand, 7));
```

在链接 `LeadingConditionRule` 时，**请勿使用**`OnFailedRoll`，因为对这个规则来说不存在因随机概率而掉落失败的情况，如果要判断条件不满足，请使用 `OnFailedConditions`。

## **完整Boss掉落示例**

在泰拉瑞亚中，Boss 会根据游戏模式掉落不同的物品。 在专家模式中，每个玩家都会获得一个宝藏袋。 在经典模式下，除专家专用物品外，宝藏袋中的物品正常都会掉落，下面这个例子展示了这种模式。 您可以在 ExampleMod 的 [MinionBossBody](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Content/NPCs/MinionBoss/MinionBossBody.cs#L171) 和 [MinionBossBag](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Content/Items/Consumables/MinionBossBag.cs#L40) 中找到相应的 `ModifyItemLoot` 代码，下面是一个简单的示例：

```csharp
// 处理适当难度掉落和宝藏袋的重要部分如下：
// 1. Boss 部分:
// 1.1. 在 ModifyNPCLoot 方法中
npcLoot.Add(ItemDropRule.BossBag(ModContent.ItemType<MinionBossBag>())); // BossBag 条件将包含“仅专家掉落”条件
// 1.2. 根据“非专家”条件将属于袋子的任何物品掉落添加到 Boss 掉落中
LeadingConditionRule notExpertRule = new LeadingConditionRule(new Conditions.NotExpert());
notExpertRule.OnSuccess(ItemDropRule.Common(ModContent.ItemType<MinionBossMask>(), 7));
// 2. 宝藏袋部分：
// 2. 在 ModItem 类
// 2.1. 在 SetStaticDefaults 中, 将 ItemID.Sets.BossBag 设置为 true
ItemID.Sets.BossBag[Type] = true;
// 2.2. 在 CanRightClick 方法中返回 true
public override bool CanRightClick() {
    return true;
}
// 2.3. 在 ModifyItemLoot 方法中, 复制 ModNPC.ModifyNPCLoot 的掉落物并添加专家特定的掉落物和金钱
public override void ModifyItemLoot(ItemLoot itemLoot) {
    itemLoot.Add(ItemDropRule.Common(ModContent.ItemType<MinionBossMask>(), 7)); // 从 ModNPC.ModifyNPCLoot 中复制非专家掉落
    itemLoot.Add(ItemDropRule.Common(ItemID.JungleYoyo)); // 专家模式特定掉落
    itemLoot.Add(ItemDropRule.CoinsBasedOnNPCValue(ModContent.NPCType<MinionBossBody>())); // 掉落钱币
}
```

## **查询原版掉落代码**

如果你想知道源码里的某个掉落是怎么写的，阅读反编译代码会有所帮助。 所有原版掉落代码都可以在 `Terraria.GameContent.ItemDropRules.ItemDropDatabase` 类中找到。 使用文件内搜索功能根据你想知道的 NPC 的 ID 编号来查找相关的代码片段。

如果你用的是从零群文件里下载的源码，那么所有摸彩袋（即宝藏袋、宝匣、礼物等）掉落的源码都可在 `Terraria/GameContent/ItemDropRules/ItemDropDatabase.TML.cs` 文件中找到，这是 tModLoader 添加的一个 `ItemDropDatabase` 的 `partial` 类。注意，原版代码中摸彩袋的掉落与 NPC 的掉落写法是完全不同的，因此你只能在 tModLoader 源码中找到相关内容。

### **NPC 掉落查询示例**

首先，原版对不同的掉落分了几个大类，这可以在 `ItemDropDatabase.Populate` 中直观地看到：

```csharp
RegisterGlobalRules();                // 注册全局规则（如世界生成、通用掉落规则等）
RegisterFoodDrops();                  // 注册食物类掉落物
RegisterWeirdRules();                 // 注册特殊/奇怪的规则
RegisterTownNPCDrops();               // 注册城镇 NPC 的掉落物
RegisterDD2EventDrops();              // 注册撒旦军队事件（DD2）的掉落物
RegisterMiscDrops();                  // 注册杂项掉落物
RegisterHardmodeFeathers();           // 注册困难模式下的羽毛类掉落物
RegisterYoyos();                      // 注册悠悠球类物品
RegisterStatusImmunityItems();        // 注册状态免疫类物品
RegisterPirateDrops();                // 注册海盗入侵的掉落物
RegisterBloodMoonFishingEnemies();    // 注册血月期间的钓鱼敌人
RegisterMartianDrops();               // 注册火星暴乱事件的掉落物
RegisterBossTrophies();               // 注册 Boss 的纪念章（Trophy）
RegisterBosses();                     // 注册 Boss 相关的规则或掉落
RegisterHardmodeDungeonDrops();       // 注册困难模式地牢的掉落物
RegisterMimic();                      // 注册宝箱怪相关的规则或掉落
RegisterEclipse();                    // 注册日食事件的掉落物或规则
RegisterBloodMoonFishing();           // 注册血月钓鱼相关的规则或掉落
```

其中：

- `RegisterGlobalRules` 是一些在特定条件满足时应用于全局的掉落，如环境钥匙、机械Boss召唤物与光暗魂

- `RegisterYoyos` 也是应用于全局的掉落，不过只包含悠悠球的

- `RegisterMiscDrops` 是没被分到其他大类的所有掉落

- `RegisterBloodMoonFishingEnemies` 实际上啥都没有，`RegisterBloodMoonFishing` 才是真的

- `RegisterWeirdRules` 只包含一行独角兽掉落恩赐苹果的规则

  一般来说，到指定的方法中寻找要比全局寻找更简单些。

  ---

  比如，我现在要找混沌精掉落混沌传送杖的规则：

  首先，查到混沌精的 NPCID 为 120，混沌传送杖的物品 ID 为 1326，根据方法名，猜测应该分到了 `RegisterMiscDrops` 方法中，到那个方法查找。使用 VS 的“在方法中查找”功能，搜索“120”，找到两条匹配结果：

  ```csharp
  RegisterToNPC(120, new LeadingConditionRule(new Conditions.TenthAnniversaryIsUp())).OnSuccess(ItemDropRule.Common(1326, 100));
  RegisterToNPC(120, new LeadingConditionRule(new Conditions.TenthAnniversaryIsNotUp())).OnSuccess(ItemDropRule.NormalvsExpert(1326, 500, 400));
  ```

  查看规则参数，物品 ID 都是 1326 即混沌传送杖，说明找到了对应规则

  将规则提取出来，即：

  ```csharp
  new LeadingConditionRule(new Conditions.TenthAnniversaryIsUp()).OnSuccess(ItemDropRule.Common(1326, 100))
  new LeadingConditionRule(new Conditions.TenthAnniversaryIsNotUp()).OnSuccess(ItemDropRule.NormalvsExpert(1326, 500, 400))
  ```

  这就是最终确定的规则了，可以拿它来做想做的事

  ---

  有时候会遇到一个方法 `RegisterToMultipleNPCs`，如：

  ```csharp
  int[] npcNetIds3 = new int[4] {
      78,
      79,
      80,
      630
  };
  RegisterToMultipleNPCs(ItemDropRule.Common(870, 75), npcNetIds3);
  ```

  实际上就是给多个 NPC 同时注册一个规则，比如上面这个就是给四种木乃伊注册木乃伊面具的掉落规则

### **摸彩袋掉落查询示例**

tModLoader 对不同的摸彩袋掉落也分了几个大类，也是在 `ItemDropDatabase.Populate`：

```csharp
    RegisterBossBags();                   // 注册 Boss 宝藏袋的掉落物
    RegisterCrateDrops();                 // 注册板条箱的掉落物
    RegisterObsidianLockbox();            // 注册黑曜石锁盒的掉落物
    RegisterLockbox();                    // 注册锁盒的掉落物
    RegisterHerbBag();                    // 注册草药袋的掉落物
    RegisterGoodieBag();                  // 注册礼袋的掉落物
    RegisterPresent();                    // 注册礼物的掉落物
    RegisterLegacyPresent();              // 注册旧版礼物的掉落物
    RegisterCanOfWorms();                 // 注册蠕虫罐的掉落物
    RegisterOyster();                     // 注册牡蛎的掉落物
    RegisterCapricorns();                 // 注册摩羯座（Capricorn）相关的掉落物
    RegisterHugeDragonEgg();              // 注册巨型龙蛋的掉落物
```

由于是 tModLoader 写的，这部分若你用的是群里的源码，或是[直接从Github上找的](https://web.archive.org/web/20250402194229/https://github.com/tModLoader/tModLoader/blob/1.4/patches/tModLoader/Terraria/GameContent/ItemDropRules/ItemDropDatabase.TML.cs)，你会发现用的多是英文 ID，对于熟悉英文的 Modder 来说就省去了查询 ID 这一步骤了，而且比反编译出来的原版源码更有条理。

查找步骤与上文的 NPC 掉落查询差不多，只不过使用的是英文，不多赘述了

## **修改原有掉落**

你也可以修改原有的掉落，甚至是其他模组的掉落。关于对原版掉落的修改建议查看 Example Mod 中的 [ExampleNPCLoot](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Common/GlobalNPCs/ExampleNPCLoot.cs) 相关代码

### **获取所有掉落**

在 `ModNPC`, `GlobalNPC`, `ModItem`, `GlobalItem` 的物品掉落重写函数中，都提供了一个 `npcLoot` 或 `itemLoot` 参数，你可以调用它的 `Get(bool includeGlobalDrops = true)` 方法来获取一个包含所有注册到该 NPC 或物品的掉落规则的列表。

同时，它也包含下面几个方法

- `Add(IItemDropRule entry)` 添加一个掉落规则

- `Remove(IItemDropRule entry)` 移除一个掉落规则

- `RemoveWhere(Predicate predicate, bool includeGlobalDrops = true)` 根据表达式尝试移除一个规则

  你可以注意到 `Get` 和 `RemoveWhere` 方法中都包含一个 `includeGlobalDrops` 的传参，根据命名，可知这是判断是否包含全局掉落的传参，也就是环境钥匙，光暗魂那些之前提到的

### **NPC 掉落修改示例**

这里我们拿上面查到的混沌精掉落混沌传送杖开刀，将其在非十周年种子地图中专家模式的掉率改为 66%，经典模式的掉率改为33%

这里再次分析一下上面提取出来的规则链：

```csharp
new LeadingConditionRule(new Conditions.TenthAnniversaryIsNotUp()).OnSuccess(ItemDropRule.NormalvsExpert(1326, 500, 400))
```

这里可以画出一个简单的流程图：

![图片](images/tutorials/358df6cab9fe78fea4120276.png)

可见，这里首先构造了一个 `LeadingConditionRule`，其条件为 `Conditions.TenthAnniversaryIsNotUp`，因此我们可以通过以下代码匹配到这条规则：

```csharp
rule is LeadingConditionRule {condition: Conditions.TenthAnniversaryIsNotUp}
```

分析后半段，原版通过 `OnSuccess` 将另一条规则链接到了这一条 `LeadingConditionRule`。下面是 `OnSuccess` 方法的源码：

```csharp
public static IItemDropRule OnSuccess(this IItemDropRule rule, IItemDropRule ruleToChain, bool hideLootReport = false) {
    rule.ChainedRules.Add(new TryIfSucceeded(ruleToChain, hideLootReport));
    return ruleToChain;
}
```

可见，本质上就是构造一个 `TryIfSucceeded` 实例，并添加到规则的 `ChainedRules` 中，于是，我们可以通过以下代码匹配到对应的子规则：

```csharp
foreach (var attempt in leadingRule.ChainedRules) {
    // 如果该元素是 Chains.TryIfSucceeded，且其实际规则 RuleToChain 为 DropBasedOnExpertMode
    if (attempt is Chains.TryIfSucceeded {RuleToChain: DropBasedOnExpertMode} actualRule) {
        // 匹配到了，修改 actualRule 即可
    }
}
```

`DropBasedOnExpertMode` 这个类型是哪来的？其实是 `ItemDropRule.NormalvsExpert` 的源码，它实际上就是构造了一个 `DropBasedOnExpertMode` 实例，并以两个 `CommonDrop` 规则分别作为普通模式和专家模式的规则：

```csharp
public static IItemDropRule NormalvsExpert(int itemId, int chanceDenominatorInNormal, int chanceDenominatorInExpert) => new DropBasedOnExpertMode(Common(itemId, chanceDenominatorInNormal), Common(itemId, chanceDenominatorInExpert));
```

于是，要分别匹配到普通和专家模式规则也很简单了：

```csharp
// 根据物品 ID 匹配普通模式规则并进行修改
if (chainedRule.ruleForNormalMode is CommonDrop {itemId: ItemID.RodofDiscord} normalModeRule) {
    normalModeRule.chanceDenominator = 3;
}
// 根据物品 ID 匹配专家模式规则并进行修改
if (chainedRule.ruleForExpertMode is CommonDrop {itemId: ItemID.RodofDiscord} expertModeRule) {
    expertModeRule.chanceNumerator = 2;
    expertModeRule.chanceDenominator = 3;
}
```

我们将上面的所有代码整合起来，就是这样：

```csharp
foreach (var rule in npcLoot.Get(includeGlobalDrops: false)) {
    if (rule is LeadingConditionRule {condition: Conditions.TenthAnniversaryIsNotUp} leadingRule) {
        foreach (var attempt in leadingRule.ChainedRules) {
            // 这里我们匹配 RuleToChain 为 DropBasedOnExpertMode 的 Chains.TryIfSucceeded，并将规则用变量 chainedRule 表示
            if (attempt is Chains.TryIfSucceeded {RuleToChain: DropBasedOnExpertMode chainedRule}) {
                // 根据物品 ID 匹配普通模式规则并进行修改
                if (chainedRule.ruleForNormalMode is CommonDrop {itemId: ItemID.RodofDiscord} normalModeRule) {
                    normalModeRule.chanceDenominator = 3;
                } 
                // 根据物品 ID 匹配专家模式规则并进行修改
                if (chainedRule.ruleForExpertMode is CommonDrop {itemId: ItemID.RodofDiscord} expertModeRule) {
                    expertModeRule.chanceNumerator = 2;
                    expertModeRule.chanceDenominator = 3;
                }
            }
        }
    }
}
```

这个缩进也太多层了，不妨用另一种只有两层缩进的同等代码表示（当然，这不是必需的）：

```csharp
// 找到所有可能的规则
var possibleRules = npcLoot.Get(includeGlobalDrops: false) // 获取所有的规则，不包含全局规则
    // 找到所有可能的条件为 TenthAnniversaryIsNotUp 的 LeadingConditionRule
    // 尽管原版只有一个，但是为了防止其它模组的修改扰乱结果，这里使用了 FindAll
    .FindAll(rule => rule is LeadingConditionRule {condition: Conditions.TenthAnniversaryIsNotUp})
    // 选取所有的子规则链接 IItemDropRuleChainAttempt
    .SelectMany(itemDropRule => itemDropRule.ChainedRules)
    // 在子规则链接中找到所有可能的 TryIfSucceeded，即父规则成功就执行的规则链接，且对应规则为 DropBasedOnExpertMode
    .Where(chainAttempt => chainAttempt is Chains.TryIfSucceeded {RuleToChain: DropBasedOnExpertMode})
    // 选取所有的 DropBasedOnExpertMode 规则
    .Select(chainAttempt => chainAttempt.RuleToChain as DropBasedOnExpertMode);
// 遍历所有的 DropBasedOnExpertMode 规则
foreach (var chainedRule in possibleRules) {
    // 根据物品 ID 匹配普通模式规则并进行修改
    if (chainedRule.ruleForNormalMode is CommonDrop {itemId: ItemID.RodofDiscord} normalModeRule) {
        normalModeRule.chanceDenominator = 3;
    }
    // 根据物品 ID 匹配专家模式规则并进行修改
    if (chainedRule.ruleForExpertMode is CommonDrop {itemId: ItemID.RodofDiscord} expertModeRule) {
        expertModeRule.chanceNumerator = 2;
        expertModeRule.chanceDenominator = 3;
    }
}
```

最后，这是完整代码

```csharp
public override void ModifyNPCLoot(NPC npc, NPCLoot npcLoot) {
    // 首先确定是混沌精
    if (npc.type is not NPCID.ChaosElemental) {
        return;
    }
    // 找到所有可能的规则
    var possibleRules = npcLoot.Get(includeGlobalDrops: false)
        .FindAll(rule => rule is LeadingConditionRule {condition: Conditions.TenthAnniversaryIsNotUp})
        .SelectMany(itemDropRule => itemDropRule.ChainedRules)
        .Where(chainAttempt => chainAttempt is Chains.TryIfSucceeded {RuleToChain: DropBasedOnExpertMode})
        .Select(chainAttempt => chainAttempt.RuleToChain as DropBasedOnExpertMode);
    // 遍历所有的 DropBasedOnExpertMode 规则
    foreach (var chainedRule in possibleRules) {
        if (chainedRule.ruleForNormalMode is CommonDrop {itemId: ItemID.RodofDiscord} normalModeRule) {
            normalModeRule.chanceDenominator = 3;
        }
        if (chainedRule.ruleForExpertMode is CommonDrop {itemId: ItemID.RodofDiscord} expertModeRule) {
            expertModeRule.chanceNumerator = 2;
            expertModeRule.chanceDenominator = 3;
        }
    }
}
```

~~我们可以发现在网站里基本还是一行塞不下，大多数都得换行~~

实际上，源码里并不是所有规则都有一个 `LeadingConditionRule`，所以代码可能会更简单。当然，根据源码写法，也有可能更难

### **修改 Boss 掉落**

Boss 要注意一点，就是一般来说，如果是全模式掉落的物品，那么宝藏袋的掉落也得一起改

在 [Example Mod](https://github.com/Cyrillya/Example-Mod-Zh-Project/blob/master/Common/GlobalNPCs/ExampleNPCLoot.cs#L87) 中是有的，这里就不多赘述了

### **修改摸彩袋掉落**

只要找到掉落规则，修改上其实都是一样的，根据源码分析即可

## **自定义掉落规则**

*请不要与自定义条件混淆*

有时候原版的掉落规则并不能满足你的需求，这时候需要你自己去自定义掉落规则

### **基本介绍**

要自定义一个掉落规则，你首先要继承 `IItemDropRule` 接口，下面是这个类的内容：

```csharp
public interface IItemDropRule
{
    // 所有链接到此规则的子规则链接
    List<IItemDropRuleChainAttempt> ChainedRules { get; }
    // 判断此规则是否可以进行掉落的方法
    bool CanDrop(DropAttemptInfo info);
    // 用于报告掉落率的方法
    void ReportDroprates(List<DropRateInfo> drops, DropRateInfoChainFeed ratesInfo);
    // 进行物品掉落尝试时执行的方法
    ItemDropAttemptResult TryDroppingItem(DropAttemptInfo info);
}
```

同时有一个 `DropAttemptInfo` 类，作为参数在 `CanDrop` 与 `TryDroppingItem` 方法传递：

```csharp
// 正在进行掉落尝试的NPC实例，没有则为null
public NPC npc;
// 正在进行掉落尝试的摸彩袋物品ID，没有则为0
public int item;
// 用于各种判定的玩家实例
public Player player;
// 用于随机判定的参数
public UnifiedRandom rng;
// 属于Re忘记删的调试代码，在原版永远为false
public bool IsInSimulation;
// 是否是专家模式
public bool IsExpertMode;
// 是否是大师模式
public bool IsMasterMode;
```

继承 `IItemDropRule` 接口时，要把所有的方法和变量都列出来，你可以直接复制下面这个模板：

```csharp
public class ExampleItemDropRule : IItemDropRule
{
    public List<IItemDropRuleChainAttempt> ChainedRules { get; }
    public ExampleItemDropRule() {
        // 在构造函数加上这一行
        ChainedRules = new List<IItemDropRuleChainAttempt>();
    }
    public bool CanDrop(DropAttemptInfo info) => true;
    public ItemDropAttemptResult TryDroppingItem(DropAttemptInfo info) {
        return new ItemDropAttemptResult {State = ItemDropAttemptResultState.Success};
    }
    public void ReportDroprates(List<DropRateInfo> drops, DropRateInfoChainFeed ratesInfo) {
        // 对子规则进行掉率报告
        Chains.ReportDroprates(ChainedRules, 1f, drops, ratesInfo);
    }
}
```

里面的一些内容下面会讲到

### **条件判断**

你可以直接在 `CanDrop` 进行前提条件的判断，这时候就不需要用什么 `LeadingConditionRule` 了，下面是一个仅在血月墓地掉落的例子：

```csharp
public bool CanDrop(DropAttemptInfo info) => Main.bloodMoon && info.player.ZoneGraveyard;
```

注意**不要**在这里判断随机几率，那玩意应该放到物品掉落里去判断，参见下面的代码

### **物品掉落**

物品掉落当然是写在 `TryDroppingItem` 方法里了，下面是一个简单的以 30% 的几率掉落苹果的例子

```csharp
public ItemDropAttemptResult TryDroppingItem(DropAttemptInfo info) {
    // 如果你打算考虑玩家幸运，可以使用 info.player.RollLuck，就像这样：
    // if (info.player.RollLuck(10) < 3) { ... }
    // 注意不能写成 info.player.RollLuck(10) > 6，这样的话就变成幸运值越高，掉落几率越低了
    // 这里是 3/10 的概率，不考虑幸运
    if (info.rng.Next(10) < 3) {
        // 运行掉落代码
        CommonCode.DropItem(info, ItemID.Apple, 1);
        // 返回结果，表示成功
        return new ItemDropAttemptResult {State = ItemDropAttemptResultState.Success};
    }
    // 返回结果，表示在随机掉率判断时失败
    return new ItemDropAttemptResult {State = ItemDropAttemptResultState.FailedRandomRoll};
}
```

这里切记在概率判断失败时返回 `FailedRandomRoll`，而在前提条件判断失败时返回 `DoesntFillConditions`，不过条件判断最好还是放在 `CanDrop`，这里就不用写了

掉落物品直接调用 `Terraria.GameContent.ItemDropRules.CommonDrop` 里的方法就行了

### **掉率报告**

首先它有两个参数

- `List<DropRateInfo> drops` 所有掉率报告的列表，要添加一个掉率报告，直接调用 `Add` 方法

- `DropRateInfoChainFeed ratesInfo` 与掉率相关的信息，包含父规则掉率 `parentDroprateChance` 和前提条件列表 `conditions`

  - 它还包含一个 `With(float multiplier)` 方法，返回值是一个新的 `DropRateInfoChainFeed` 实例。原实例为 A，返回值为 B，则 :

    `dropRate = personalDropRate * ratesInfo.parentDroprateChance`

    `B 的父规则掉率 = A 的父规则掉率 × 倍率`

    ---

    通过构造函数 `new DropRateInfo(int itemId, int stackMin, int stackMax, float dropRate, List conditions = null)` 可以构造一个新的掉率实例，其中：

- `itemId`, `stackMin`, `stackMax` 分别是物品的ID，最小堆叠和最大堆叠

- `dropRate` 是掉率，你可以这样算：

  `dropRate = personalDropRate * ratesInfo.parentDroprateChance`

  `掉率 = 规则本身的掉落率 × 掉率信息的父规则掉率`

  其中 `personalDropRate` 是这个规则本身的掉落率，比如这个规则有 623 的几率掉落物品，那么 `personalDropRate = 6f / 23f` ，传参就填 `6f / 23f * ratesInfo.parentDroprateChance`

- `conditions` 是掉率条件，一般来说传入 `ratesInfo.conditions` 即可，要添加一个条件可以调用 `DropRateInfoChainFeed.AddCondition`

  最后，记得调用 `Chains.ReportDroprates(ChainedRules, personalDropRate, drops, ratesInfo)` 对子规则进行掉率报告，其中 `personalDropRate` 传参是这个规则本身的掉落率，也就是前面提到的那个

  下面是原版 `DropBasedOnExpertMode` 规则的掉率报告源码，可供参考

  ```csharp
  public void ReportDroprates(List<DropRateInfo> drops, DropRateInfoChainFeed ratesInfo) {
      // 通过调用 With(1f) 复制一个新的 Info
      DropRateInfoChainFeed expertInfo = ratesInfo.With(1f);
      // 添加专家模式前提条件
      expertInfo.AddCondition(new Conditions.IsExpert());
      // 调用专家模式规则的掉率报告方法
      ruleForExpertMode.ReportDroprates(drops, expertInfo);
      // 同上
      DropRateInfoChainFeed nonExpertInfo = ratesInfo.With(1f);
      nonExpertInfo.AddCondition(new Conditions.NotExpert());
      ruleForNormalMode.ReportDroprates(drops, nonExpertInfo);
      // 对链接到该规则的子规则进行掉率报告
      Chains.ReportDroprates(ChainedRules, 1f, drops, ratesInfo);
  }
  ```

### **INestedItemDropRule**

在 `IItemDropRule` 的基础上，在继承上加一个 `INestedItemDropRule` 即可使用

在基础的 `IItemDropRule` 上作了一个“升级”，主要不同点在尝试掉落方法上，`IItemDropRule` 的那个方法不能用了，要用 `INestedItemDropRule` 的，下面是原版 `DropBasedOnExpertMode` 规则的物品掉落源码：

```csharp
// 这个是 IItemDropRule 接口的方法，应该弃用
public ItemDropAttemptResult TryDroppingItem(DropAttemptInfo info) {
    ItemDropAttemptResult result = default(ItemDropAttemptResult);
    // 这是一个特殊的 State，表示没有运行任何实际掉落代码
    result.State = ItemDropAttemptResultState.DidNotRunCode;
    return result;
}
// 这个是 INestedItemDropRule 接口的方法，应该使用这个
public ItemDropAttemptResult TryDroppingItem(DropAttemptInfo info, ItemDropRuleResolveAction resolveAction) {
    // 如果是专家模式，则对专家模式规则调用 resolveAction，相当于一次掉落尝试
    if (info.IsExpertMode)
        return resolveAction(ruleForExpertMode, info);
    // 否则对普通模式规则调用 resolveAction
    return resolveAction(ruleForNormalMode, info);
}
```

简而言之，这个接口提供了一个 `resolveAction(IItemDropRule rule, DropAttemptInfo info)` 方法，可以用于直接调用其他规则的掉落尝试，比如说你要写一个在三种模式下使用不同规则的规则，你就可以直接根据模式调用特定规则的掉落了，而不需要写 `LeadingConditionRule` 嵌套

---

自定义规则的话其实原版有很多了，都可以作为一个示例来使用

我之前也给群友写过一个**带权重的多选一**规则，[源码放到了Github](https://web.archive.org/web/20250402194229/https://github.com/Cyrillya/Cyrillya/blob/main/OneFromOptionsByWeightRuleExample.cs)，可供参考

## **拓展内容**

此外还有一些**不属于原版范畴**的内容，这些是其他模组作者制作的工具，可以让调试和编写掉落代码更简便

### **查看摸彩袋物品明细 &amp; 图鉴快捷解锁**

**更好的体验**模组的功能 ~~绝对不是打广告~~

在键位中绑定一个快捷键

![图片](images/tutorials/ab7df47f8e0713d15dfb0b7e.png)

随后，在游戏中将鼠标指针移动到摸彩袋物品上，点击快捷键即可查看掉落明细，展示方式和图鉴一致

![图片](images/tutorials/aa2bbc1b3784fd4472c3cb4e.png)

在模组配置中还可以将“**一次击杀即可完全解锁图鉴**”功能打开，这样只要击杀一次怪物，就可以完全解锁掉落明细了。

**再版者留**：截至 2026 年 9 月 17 日，更好体验模组的“查看摸彩袋明细”功能仍未适配自动暂停设置。开启自动暂停并打开背包时，该功能的明细窗口依然无法正常弹出。

### **掉落库 – LootLib**

这是创意工坊上的一个前置库类型的模组，提供了很多简便的**修改&amp;移除掉落**方法，功能可以说十分强大，这里是[它的Wiki](https://github.com/Garnet-Yeates/LootLib/wiki)

![图片](images/tutorials/cd1fecb0886a78943fe46923.png)

它的功能有多强大呢？这么说吧，上面我们为了匹配到混沌精掉落混沌传送杖，写了这么多的匹配代码，到它这只需要这么几行：

```csharp
// 三个类型分别为: 父规则，规则链接，子规则。返回值是子规则的实例
var rule = npcLoot.FindRuleWhere<LeadingConditionRule, Chains.TryIfSucceeded, DropBasedOnExpertMode>();
if (rule is not null) {
    // 找到了！直接把上面的修改代码复制过来就完成修改了
}
```

尽管它说要模组引用，实际上根本不需要，你只需要：

1. 使用 tModLoader 的“提取”功能提取 LootLib Mod，获得 dll 文件

2. 在你的模组**根目录**下创建一个名为 `lib` 的文件夹，将 dll 文件放进去

3. 在 `build.txt` 加上一行: `dllReferences = LootLib`

4. 将 `dll` 文件引用添加到你的 IDE，以便后续代码编写

   这样你就可以直接使用它的功能，不需要模组引用了！当然，**最好还是在模组简介之类的地方说明一下你引用了 LootLib 库**

   **请勿直接在 Github 上把他的源码抄过来自己用**

   它的功能还远不止上面展示的，要了解更多请参阅[Wiki](https://github.com/Garnet-Yeates/LootLib/wiki)

   ---

   

   *©2026 冬天的叶 &amp; Cyril \| 仅供个人学习，禁止商用二次分发*

