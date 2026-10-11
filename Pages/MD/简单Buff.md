作者：冬天的叶，dxtst  2026/10/10 \| 🔖 基础

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

同学们在制作武器的过程中有没有觉得，原版的 Buff 效果太固定了。大多只是单纯造成伤害，很少有别的效果。或者是觉得原版 Buff 太单调了根本不好用？



这一期，我们从零开始，创建一个自己的Buff。



在这个过程中，我希望同学们能学会：



**1了解ModBuff类**

**2了解TR里面buff的性质**

**3学会用buff修改玩家属性**

**4学会用buff修改NPC属性**

---

# **Buff 的定义**

不过说了这么多，那么在游戏里，到底什么是 Buff 呢？

从最宽泛的定义来看，Buff 是实体状态效果的统称，具体分为两类：增益 和 减益。

### **增益（Buff）**

它是特指 实体在 **消耗、装备，激活物品，或在特殊环境时**，给予的**正面状态效果**。玩家激活后以图标形式显示在热键栏下方，旁边还有剩余持续时间。增益基本上都是正面或至少良性的效果。宠物、照明宠物、仆从、坐骑在激活状态下，也各有对应的增益。

### **减益（Debuff）**

它是特指 实体 **在战斗期间被命中 或 通过各种 物品、环境**，给予的**负面状态效果**。玩家激活后同样以图标形式显示在热键栏下方，旁边是剩余持续时间。和玩家控制权更多的增益相反，减益几乎都是负面或至少有害的效果。

### 注意事项

所以在代码层面，增益和减益虽然都归在 Buff 这个体系下，但它们的**效果方向、作用对象、施加方式**，都差别巨大。

而且可能是出于演出效果的考虑，大部分 **增益和减益** 其实都 **只对玩家生效**。**玩家** 能对 **NPC** 造成的减益其实很有限。这两个体系看起来是一套内容，实际运行时分开处理的。

**如** **带电** **这个减益：**

它在玩家身上时，会让玩家移动时受到大量伤害，不移动时受到少量伤害；

但它对 NPC 不会产生任何效果。

**同理，** **灵液武器灌注** **这个增益：**

它在玩家身上时，会让玩家攻击时附带灵液效果。

给 NPC，NPC 也不能造成附带灵液的伤害。

---

# 创建buff 文件

在创建 **buff** 之前，我们需要在我们的**Content**文件夹下新建一个文件夹，并且起名为**buffs**，然后在这个文件夹内新建一个**cs文件**，随便起一个名字（我这里使用**Demobuff**你们随意）作为文件名。

|![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/3YBESZRKABAES?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjNZQkVTWlJLQUJBRVMiLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzIsImhlaWdodCI6MzJ9)|![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/AUBUSZRKABQHM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkFVQlVTWlJLQUJRSE0iLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzIsImhlaWdodCI6MzJ9)|![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/BNEFAZRKABABM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkJORUZBWlJLQUJBQk0iLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzIsImhlaWdodCI6MzJ9)|
|---|---|---|

当然，**buff**也需要一张贴图来显示游戏里的形象，如果你没有准备贴图也没关系，教程这边给大家提供了一些贴图，大家可以下载使用。

![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/HDXVEZRKABQHM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkhEWFZFWlJLQUJRSE0iLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6Mjk5LCJoZWlnaHQiOjE0NX0)

然后我们将 **buff** 贴图放入其中，并保证**图片名，类名，文件名**一致。

之后的步骤和创建 `Item` 类似，我们需要创建一个名为 **Demobuff** 的公开类（**public**），并且继承自 **ModBuff**

代码如下：

```csharp
namespace DemoMod.Content.Buffs
{
    public class Demobuff : ModBuff
    {
    }
}
```

我们可以通过 `ModContent.BuffType<xxxx>();`  方法获取 Mod 自定义的 Buff ID。 `xxxx` 内容为我们的**Buff 类名** 还可以通过`player/npc.AddBuff` 方法 给 **玩家** 和**NPC** 给予 **Buff，**药水相关内容可以在[自定义药水.otl](https://www.kdocs.cn/l/ceDJswbQRjDN?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1NzAyNDY0OTMzODciLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2VESnN3YlFSakROIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU3MDk3ODIwOTMxMiJ9)教程查询。

不过，和 **弹幕、物品** 的属性设置不同，因为 **Buff** 严格来说不是泰拉瑞亚里自定义的数据类型，所以没有像 `Item.xxx`、`Projectile.xxx` 那样的实例字段可以设置。而且**Buff** 没有 `SetDefaults()` 方法，只有 `SetStaticDefaults()`，以及 **Buff** 类型注册时的静态标记。

**静态标记** 和 **普通字段** 的区别在于：静态标记一旦被修改，会影响所有这个 **Buff** 的效果。所以 **静态标记** 在游戏里应该只被设置一次。

# **buff**的基础属性（可跳）

以下是所有**buff** 相关的的**静态标记**：

```csharp
public override void SetStaticDefaults()
{
    // 因为 Buff 严格来说不是泰拉瑞亚里自定义的数据类型，
    // 所以没有像 Item.xxx、Projectile.xxx 那样的实例字段可以设置，
    // 我们需要用另一种方式来设置属性。

    // 玩家相关设置

    // 标记这个 Buff 算不算一个 Debuff。设为 true 会得到泰拉瑞亚里对 Debuff 的限制，比如无法右键取消、护士可以清除、超出 Buff 上限时不会被优先清掉等
    Main.debuff[Type] = true;

    // 决定这个 Buff 能不能在 PvP 里被其他玩家施加。true 就是可以，false 就是不可以
    Main.pvpBuff[Type] = true;

    // 决定这个 Buff 在玩家死亡后会不会保留。true 就是死亡重生后仍保留，false 就是不保留（原版所有武器灌注都设为 true）
    Main.persistentBuff[Type] = true;

    // 决定这个 Buff 被重复施加时会不会叠加效果。官方没说明具体行为，建议先不要动它
    Main.buffDoubleApply[Type] = false;

    // Buff 类型设置

    // 决定这个 Buff 是不是外观宠物。true 就是会和其他外观宠物互斥，防止同时存在多个外观宠物
    Main.vanityPet[Type] = true;

    // 决定这个 Buff 是不是照明宠物。true 就是会和其他照明宠物互斥
    Main.lightPet[Type] = true;

    // 决定这个 Buff 是不是武器灌注类 Buff。true 就是会和其他武器灌注 Buff 互斥，防止同时吃多个武器灌注效果
    Main.meleeBuff[Type] = true;

    // Buff 显示设置

    // 决定这个 Buff 要不要显示剩余时间。true 就是图标下方不显示剩余时间（原版大部分坐骑、宠物、召唤物 Buff 都设为 true）
    Main.buffNoTimeDisplay[Type] = true;

    // Buff 保存设置

    // 决定这个 Buff 在退出世界再进来后会不会仍然持续。true 就是不保存（退出世界后消失），false 就是保存
    Main.buffNoSave[Type] = true;

    // BuffID.Sets 类型设置

    // 决定这个 Buff 是不是"吃饱了"之类的食物 Buff 变体。true 就是属于食物类（原版 WellFed、WellFed2、WellFed3 都设为 true）
    BuffID.Sets.IsWellFed[Type] = true;

    // 决定这个 Buff 是不是和饱食度状态有关（饥荒联动）。true 就是同一时间只能有一个饥饿类 Buff 生效
    BuffID.Sets.IsFedState[Type] = true;

    // 决定这个 Buff 是不是鞭子标记类 Buff。true 就是默认可施加到所有 NPC 上，除非 NPC 自己设了免疫
    BuffID.Sets.IsATagBuff[Type] = true;

    // 决定这个 Buff 是不是武器灌注类 Buff。true 就是归类为灌注（注意：它只用来分类，不处理任何武器灌注逻辑，相关设置还是要去 Main 数组）
    BuffID.Sets.IsAFlaskBuff[Type] = true;

    // BuffID.Sets 移除设置

    // 决定护士能不能清除这个 Buff。true 就是护士也清不掉，false 就是护士可以清掉（原版流血、破甲、魔力病等都设为 true）
    BuffID.Sets.NurseCannotRemoveDebuff[Type] = true;

    // 决定这个 Buff 会不会在持续时间归零后自然结束消失。true 就是永远不会自己消失，适合靠条件移除的 Buff，比如狼人、人鱼、篝火等
    BuffID.Sets.TimeLeftDoesNotDecrease[Type] = true;

    // 决定这个 Buff 能不能通过 NPC.RequestBuffRemoval(int) 从 NPC 身上移除。true 就是可以（适合"被打中就消失"的标记类 Buff，联机时也能正确同步）
    BuffID.Sets.CanBeRemovedByNetMessage[Type] = true;

    // BuffID.Sets 坐骑设置

    // 决定这个 Buff 绑定哪个坐骑。-1 表示不绑定，填 MountID 就是绑定对应坐骑，激活时会强制玩家骑上
    BuffID.Sets.MountType[Type] = -1;

    // BuffID.Sets 持续时间设置

    // 决定这个 Buff 被重复施加时，持续时间是累加还是重置。0 表示默认行为（重置时间），填正数表示累加，但不会超过这个上限（原版魔力病设 600，风筝 Buff 设 43200）
    BuffID.Sets.AddBuffTimeAdditivelyToCap[Type] = 600;

    // 决定这个 Buff 在高难度模式下持续时间会不会持续更久。true 就是会，倍率由 GameDifficultyData.DebuffTimeMultiplier 决定（仅专家模式以上生效）
    BuffID.Sets.BuffTimeIsExtendedWithGameDifficulty[Type] = true;

    // 决定这个 Buff 在药水站 Buff 激活时持续时间会不会多持续 20%。true 就是会受到影响（死亡细胞联动内容）
    BuffID.Sets.BuffTimeIsExtendedByDeadCellsPotionStationBuff[Type] = true;
}
```

~~*嗷，草，好多....*~~  

不急，我们一个一个来介绍

## Main 数组

### 实体交互设置

#### **1 Main.debuff（Debuff）**

这个标记决定 Buff 算不算一个 Debuff，类型为 `bool`，默认为 `false`。

设为 `true` 后，它会得到泰拉瑞亚里对 Debuff 的限制：无法右键取消、护士可以清除、超出 Buff 上限时不会被优先清掉等。

注：在原版游戏里，并不是所有的减益都把 `Main.debuff` 设为了 `true`。因为一些历史遗留原因，我们不能靠 `Main.debuff` 来判断一个 Buff 是不是负面效果。所以，如果你想做“让玩家免疫负面状态效果”这类功能，推荐改用 `BuffID.Sets.NurseCannotRemoveDebuff`（能否被护士清除）来进行判断。

#### **2 Main.pvpBuff（PvP 可施加）**

这个标记决定这个 Buff 能不能在 PvP 里被其他玩家施加，类型为 `bool`，默认为 `false`。

设为 `true` 后，玩家就能在 PvP 中把这个 Buff 加到其他玩家身上。

#### **3 Main.persistentBuff（死亡后是否保留）**

这个标记决定 Buff 在玩家死亡后会不会保留，类型为 `bool`，默认为 `false`。

设为 `true` 后，玩家死亡重生时这个 Buff 还会保留。原版所有武器灌注效果都将其设为了 `true`。

#### **4 Main.buffDoubleApply（重复叠加）**

这个标记决定 Buff 被重复施加时会不会叠加效果，类型为 `bool`，默认为 `false`。

目前官方没有说明它的具体行为，建议先不要动它。

### Buff 类型设置

#### **1 Main.vanityPet（外观宠物）**

这个标记决定这个 Buff 是不是一个外观宠物，类型为 `bool`，默认为 `false`。

设为 `true` 后，它会和其他外观宠物 Buff 互斥，防止同时存在多个外观宠物。

#### **2 Main.lightPet（照明宠物）**

这个标记决定这个 Buff 是不是一个照明宠物，类型为 `bool`，默认为 `false`。

和外观宠物一样，设为 `true` 后会和其他照明宠物 Buff 互斥。

#### **3 Main.meleeBuff（武器灌注）**

这个标记决定这个 Buff 是不是一个武器灌注类 Buff，类型为 `bool`，默认为 `false`。

设为 `true` 后会和其他武器灌注 Buff 互斥，防止同时吃多个武器灌注效果。

### Buff 显示设置

#### **1 Main.buffNoTimeDisplay（显示剩余时间）**

这个标记决定这个 Buff 要不要显示剩余时间，类型为 `bool`，默认为 `false`。

设为 `true` 后，Buff 图标下方不会显示剩余时间。原版大部分坐骑、宠物、召唤物 Buff 都设为了 `true`。

### Buff 保存设置

#### **1 Main.buffNoSave（退出世界是否保存）**

这个标记决定这个 Buff 在退出世界再进来后会不会仍然持续，类型为 `bool`，默认为 `false`。

设为 `true` 就是不保存，退出世界后消失；设为 `false` 就是保存。原版给持续伤害效果、短时物品 Buff、坐骑 Buff、条件性 Buff 都设为了 `true`。

## BuffID.Sets 数组

### Buff 类型设置

#### **1 BuffID.Sets.IsWellFed（食物类 Buff）**

这个标记决定这个 Buff 是不是“吃饱了”之类的食物 Buff 变体，类型为 `bool`，默认为 `false`。

原版里 `WellFed`、`WellFed2`、`WellFed3`（精美毛绒玩具）都设为了 `true`。

#### **2 BuffID.Sets.IsFedState（饱食度状态）**

这个标记决定这个 Buff 是不是和饱食度状态有关，属于饥荒联动内容，类型为 `bool`，默认为 `false`。

设为了 `true` 之后，同一时间只能有一个饥饿类 Buff 生效。

原版把 `WellFed` 系列和 `NeutralHunger`、`Hunger`、`Starving` 都设为了 `true`。

#### **3 BuffID.Sets.IsATagBuff（鞭子标记类 Buff）**

这个标记决定这个 Buff 是不是鞭子标记类 Buff，类型为 `bool`，默认为 `false`。

鞭子标记类 Buff 默认可以施加到所有 NPC 上，除非 NPC 自己设了免疫。原版只有暗黑收割的收割 Buff 和电鳗的电能 Buff 将它设为了 `true`。

#### **4 BuffID.Sets.IsAFlaskBuff（武器灌注类 Buff）**

这个标记决定这个 Buff 是不是武器灌注类 Buff，类型为 `bool`，默认为 `false`。

注意：它只用来分类，不处理任何武器灌注逻辑，相关设置还是要去 `Main` 数组。原版所有武器灌注 Buff 都设为了 `true`。

### Buff 移除设置

#### **1 BuffID.Sets.NurseCannotRemoveDebuff（减益能否被护士清除）**

这个标记决定护士能不能清除这个 Buff，类型为 `bool`，默认为 `false`。

设为 `true` 就是护士也清不掉，设为 `false` 就是护士可以清掉。原版很多减益都设为了 `true`，比如流血、破甲、魔力病等。

#### **2 BuffID.Sets.TimeLeftDoesNotDecrease（能否自然结束移除）**

这个标记决定这个 Buff 会不会在持续时间归零后自然结束消失，类型为 `bool`，默认为 `false`。

设为 `true` 就是永远不会自己消失，适合那种靠条件移除的 Buff，比如狼人、人鱼、篝火等。

#### **3 BuffID.Sets.CanBeRemovedByNetMessage（可被网络消息移除）**

这个标记决定这个 Buff 能不能通过网络消息移除，类型为 `bool`，默认为 `false`。

说实话，我没看懂这个是什么意思，它的介绍是这么写的：

```csharp
// If <see langword="true"/> for a given <see cref="BuffID"/>, then that buff can be removed from an NPC using <see cref="NPC.RequestBuffRemoval(int)"/>.
// <br/> Useful for "flag" buffs that should go away on hit.
// <br/> Defaults to <see langword="false"/>.
BuffID.Sets.CanBeRemovedByNetMessage[Type] = false;
```

大意是：设了它之后，这个 Buff 可以通过 `NPC.RequestBuffRemoval(int)` 从 NPC 身上移除，适合那种“被打中就消失”的 Buff。

### Buff 坐骑设置

#### **1 BuffID.Sets.MountType（绑定坐骑）**

这个标记决定这个 Buff 绑定哪个坐骑，类型为 `int`，默认为 `-1`。

`-1` 表示不绑定，填 `MountID.xxx` 就是绑定对应坐骑，激活时会强制玩家骑上。原版所有坐骑 Buff 都设了它，并且同时把 `Main.buffNoTimeDisplay` 和 `Main.buffNoSave` 设为 `true`。

### Buff 持续时间设置

#### **1 BuffID.Sets.AddBuffTimeAdditivelyToCap（时间累加上限）**

这个标记决定这个 Buff 被重复施加时，时间是累加还是重置，类型为 `int`，默认为 `0`。

`0` 表示默认行为（重置时间），填正数表示累加，但不会超过这个上限。

原版里魔力病设了 600（10 秒），风筝 Buff 设了 43200（12 分钟）。

#### **2 BuffID.Sets.BuffTimeIsExtendedWithGameDifficulty（高难度延长）**

这个标记决定这个 Buff 在高难度模式下会不会持续更久，类型为 `bool`，默认为 `false`。

设为 `true` 就是会，倍率由 `GameDifficultyData.DebuffTimeMultiplier` 决定。

注：虽然名字里带 Debuff，但它对所有 Buff 都生效，不只是减益，而且只在专家模式以上才起作用。

#### **3 BuffID.Sets.BuffTimeIsExtendedByDeadCellsPotionStationBuff（药水站延长）**

这个标记决定这个 Buff 在药水站 Buff 激活时会不会多持续 20%，类型为 `bool`，默认为 `false`。

死亡细胞联动新加的东西，设为 `true` 就是会受到影响。

---

# 基础模板

因为需要设置的属性实在是太多，所以教程这边给你们提供了三个，可以直接抄的基础模板

### 普通增益

```csharp
public override void SetStaticDefaults()
{
    // 显示剩余时间
    Main.buffNoTimeDisplay[Type] = false;
    // 退出世界再进来后会保存
    Main.buffNoSave[Type] = false;
    // 决定这个 Buff 在玩家死亡后不保留
    Main.persistentBuff[Type] = false;
}
```

适用于：回血、加移速、加伤害、加防御这类普通正面效果。

### 普通减益

```csharp
public override void SetStaticDefaults()
{
    // 标记为减益
    Main.debuff[Type] = true;

    // 护士能清除
    BuffID.Sets.NurseCannotRemoveDebuff[Type] = false;

    // 高难度下时间会延长
    BuffID.Sets.BuffTimeIsExtendedWithGameDifficulty[Type] = true;

    // 退出世界后不保存
    Main.buffNoSave[Type] = true;
}
```

适用于：中毒、燃烧、流血这类会随时间自然结束的负面效果。

### 计时器类 Buff

```csharp
public override void SetStaticDefaults()
{
    // 标记为减益、右键不能取消
    Main.debuff[Type] = true;

    // 护士不能清除
    BuffID.Sets.NurseCannotRemoveDebuff[Type] = true;

    // 不受难度影响，时间不会翻倍
    BuffID.Sets.BuffTimeIsExtendedWithGameDifficulty[Type] = false;

    // 退出世界后不保存
    Main.buffNoSave[Type] = true;
}
```

适用：效果冷却CD、药水病、魔力病这类“冷却计时器”性质的 Debuff。它们的作用是限制玩家行为，不是造成伤害，所以护士不能清、难度也不该延长。

---

# **buff**的实际效果

好的，学会了 **Buff** 的基础属性该如何填写，接下来我们就该学习怎么做出 Buff 的实际效果了。

`ModBuff` 提供了两个 `Update` 重载，分别对玩家和 NPC 生效：

```csharp
public override void Update(Player player, ref int buffIndex)
public override void Update(NPC npc, ref int buffIndex)
```

只要目标身上还有这个 Buff，游戏每帧都会调用一次对应的 `Update`。拿 **弹幕** 和 **NPC** 来类比的话，你可以简单把它理解成 Buff 的 AI。



两个重载的参数含义相同，只是目标对象不同：

- **Player** / **NPC** 这个参数指的是当前携带这个 Buff 的实体，类型为 `Player / NPC` 可以通过它 修改玩家的属性（移速、攻速、伤害等）以及 修改 NPC 的属性（防御、速度等）

- **buffIndexref** 这个参数指的是 Buff 在实体 Buff 数组中的索引位置 类型为 `int` **buffIndex** 是一个 **ref** 参数，它的作用我们后面会细讲。

  

  用好这两个方法，我们能做很多好玩的效果：

## 简单扣血debuff

```csharp
public override void Update(Player player, ref int buffIndex)
{
    // 玩家的生命再生效率如果是负的话可以扣血的，我们不能干扰其他buff
    if (player.lifeRegen > 0)
    {
        // 所以玩家的生命再生率，大于 0 时将它归 0 阻止玩家生命再生
        player.lifeRegen = 0;
    }

    // 生命再生计时器，这个也强制归零
    player.lifeRegenTime = 0;

    // 60游戏帧为1秒 每3帧扣1滴血
    if (player.buffTime[buffIndex]% 3 == 0) 
    { 
        player.statLife -= 1;

        // 跳字
        CombatText.NewText(player.Hitbox, Color.Green, 1, false, true);
    }
    // 自定义玩家死亡 
    if (player.statLife <= 0) 
    { 
        player.KillMe(PlayerDeathReason.ByCustomReason(NetworkText.Empty), 9999, 0);
        Main.NewText($"{player.name} 被毒死了", Color.Green);
    }
}
public override void Update(NPC npc, ref int buffIndex)
{
    //NPC就简单粗暴多了，直接扣就行

    // 60游戏帧为1秒 每2帧扣2滴血（那不还是每帧扣一滴血）
    if (npc.buffTime[buffIndex] % 2 == 0)
    {
        npc.life -= 2;
        // 跳字
        CombatText.NewText(npc.Hitbox, CombatText.DamagedHostile, 2, false, true);
    }

    // NPC死亡检测
    npc.checkDead();
}
```

我们先看玩家部分的代码：

### **1归零生命再生**

```csharp
if (player.lifeRegen > 0)
{
    player.lifeRegen = 0;
}
player.lifeRegenTime = 0;
```

玩家的 `lifeRegen` 如果为正，会持续回血。如果不把它归零，你扣的血可能被回血抵消掉。而 `lifeRegenTime` 是再生计时器，一并归零，确保再生完全停止。

### 2 **持续扣血**

```csharp
if (player.buffTime[buffIndex] % 3 == 0)
{
    player.statLife -= 1;
    CombatText.NewText(player.Hitbox, Color.Green, 1, false, true);
}
```

`player.buffTime[buffIndex]`是buff的剩余时间，`player.buffTime[buffIndex] % 3 == 0` 意思是，每 3 帧扣 1 点生命，也就是每秒扣 20 点。

`CombatText.NewText` 方法被原版用来显示NPC或者玩家失去的血量，这边我们用来在屏幕上显示血量流失的跳字。`CombatText.NewText` 的参数依次是：位置、颜色、数字、是否是暴击数字、是否从玩家身上弹出。我们的代码里表示，**绿色**、数字`1`、不暴击、从玩家身上弹出。

### 3 **自定义死亡**

```csharp
if (player.statLife <= 0)
{
    player.KillMe(PlayerDeathReason.ByCustomReason(NetworkText.Empty), 9999, 0);
    Main.NewText($"{player.name} 被毒死了", Color.Green);
}
```

当玩家血量归零时，使用 `KillMe` 方法杀死玩家，并自定义死亡提示。

`KillMe` 方法由四个参数组成：

- `damageSource` 类型为 `PlayerDeathReason`，代表着玩家的死亡原因。记录是谁/什么杀死了玩家（NPC、弹幕、PVP、环境等），用于生成死亡提示文字（"xxx被巨石砸死了"）和伤害追踪。

  

- `dmg` 类型为 `double`，代表着致死伤害值。虽然玩家已经死了，但这个数值仍会用于死亡提示、伤害统计、成就判定等。

- `hitDirection` 类型为 `int`，代表着击退方向。`1` 表示从右往左打（玩家被往左击飞），`-1` 表示从左往右打（往右击飞），只影响尸体碎块（头、身、腿）飞散的方向，不影响逻辑。

- `pvp` 类型为 `bool`，代表着是否 PVP 死亡，默认 `false`。影响死亡计数、复活时间 、是否掉钱等。

  

  你可能会好奇为什么我们要这么做呢？

  因为原版的玩家死亡检测，是**先检测死亡前置条件，再检测玩家血量**。只有血量小于等于 0，才让玩家死亡。比如混沌传送杖造成的死亡，会先检测玩家身上有没有**混沌**这个 **Debuff**，然后再让玩家死亡，并爆出死亡信息。受到 NPC 攻击、被弹幕射中后的死亡，也是类似的逻辑。

  但我们直接扣血、扣到负数的话，原版会先检查一遍这些死亡前置条件。发现没有一项符合，游戏就会认为玩家很健康（其实已经处于**濒死状态**了），让玩家继续存活。如果这时身上突然多了个混沌传送杖的 Buff，玩家就会立刻死亡。

  为了不让死亡逻辑混乱，也不让血量为负的玩家活蹦乱跳，我们要使用 `KillMe` 自定义玩家的死亡。

  死亡信息这一栏`NetworkText.Empty` 是显示为空的文本，这里我为了自定义死亡信息的颜色才这么写。正常情况下，我们应该使用 `NetworkText.FromKey("翻译键")`。

### 4 NPC 版 Update

```csharp
public override void Update(NPC npc, ref int buffIndex)
{
    //NPC就简单粗暴多了，直接扣就行

    // 60游戏帧为1秒 每2帧扣2滴血（那不还是每帧扣一滴血）
    if (npc.buffTime[buffIndex] % 2 == 0)
    {
        npc.life -= 2;
        // 跳字
        CombatText.NewText(npc.Hitbox, CombatText.DamagedHostile, 2, false, true);
    }

    // NPC死亡检测
    npc.checkDead();
}
```

NPC的代码，比起玩家相对来说简单的多。而且npc有自带的死亡检测 `npc.checkDead();` 不需要我们来操心。现在我们粘贴代码进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/MDIUG2RKACQFS?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik1ESVVHMlJLQUNRRlMiLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTE0LCJoZWlnaHQiOjM4MX0)

不赖嘛

## 粒子与发光

```csharp
public override void Update(Player player, ref int buffIndex)
{
    // 绿光粒子
    for (int i = 0; i < 3; i++)
    {
        Dust dust = Dust.NewDustDirect(player.position, player.width, 10,
            DustID.GreenFairy, 0, -2f, 100, Color.White, 1.15f);
        dust.noGravity = true;
    }
    // 冒绿光
    Lighting.AddLight(player.Center, 0f, 0.75f, 0f);
}
public override void Update(NPC npc, ref int buffIndex)
{
    // 绿光粒子
    for (int i = 0; i < 3; i++)
    {
        Dust dust = Dust.NewDustDirect(npc.position, npc.width, 10,
            DustID.GreenFairy, 0, -2f, 100, Color.White, 1.15f);
        dust.noGravity = true;
    }
    // 也可以通过 Vector3 这个三维向量来控制发光强度，
    // 不过这个三维向量在这里并不参与方向的计算，它的三个值被用来当做 RGB 染色发光
    Lighting.AddLight(npc.Center, new Vector3(0f, 0.75f, 0f)*2);
}
```

这两个 `Update` 分别在玩家和 NPC 身上生成粒子特效，并让它们发光。粒子生成没什么好讲的，重点讲讲`Lighting.AddLight` 方法，这个方法会在玩家中心位置添加一个绿色的光源。三个参数分别是 R、G、B 的强度，这里只有 G 是 `0.75f`，所以发绿光。

NPC粒子部分和玩家版完全一样，光照部分用了另一种写法：

```csharp
Lighting.AddLight(npc.Center, new Vector3(0f, 0.75f, 0f) * 2);
```

`Vector3` 的三个值分别对应 RGB。`(0f, 0.75f, 0f)` 再乘以 `2`，实际是 `(0, 1.5, 0)`。G 值超过 1 会让绿光更亮，但 RGB 本身不参与方向计算，它只是颜色强度。两种写法功能一样，看个人习惯。

现在我们粘贴代码进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/CGNFK2RKABQGG?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkNHTkZLMlJLQUJRR0ciLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDQzLCJoZWlnaHQiOjI5NH0)

~~*神秘绿头人*~~

## 发射弹幕

```csharp
public override void Update(Player player, ref int buffIndex)
{
    // 每 30 帧（0.5 秒）生成一次弹幕
    if (player.buffTime[buffIndex] % 30 == 0)
    {
        // 弹幕速度 = 玩家当前速度向量
        Vector2 velocity = player.velocity;

        // 如果玩家站着不动，给一个默认方向，避免弹幕原地不动
        if (velocity == Vector2.Zero)
        {
            velocity = new Vector2(player.direction * 4f, 0f);
        }

        // 从玩家中心位置发射恶魔镰刀
        Projectile projectile = Projectile.NewProjectileDirect(
            player.GetSource_Buff(buffIndex),  // 来源：这个 Buff
            player.Center,                     // 生成位置
            velocity,                          // 速度 = 玩家当前速度向量
            ProjectileID.DemonSickle,          // 弹幕类型：恶魔镰刀
            45,                                // 伤害 45
            3f,                                // 击退 3
            player.whoAmI                      // 弹幕归属
        );

        projectile.friendly = true;// 对敌人造成伤害
        projectile.hostile = false;// 对玩家造成伤害
    }
}
```

发射弹幕也没什么好讲的，但是 **恶魔镰刀书** 和 **NPC恶魔** 用的弹幕是同一个弹幕，

默认是打玩家，不打NPC 我们要把它改成 打NPC，不打玩家。

现在我们粘贴代码进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/S2hnUWNMVVVIcEQ0RHZpZ2w5R3hEQTk2SUxWckRDSFk1ZWR2OTlCMDQwQXZ5ckFnbDBsRlp1NlFyMEhHM3FHQ1Y5M1Q2SkJNSDV0amlRaDdieldiN2ZuRHJUTkZ5MWhrT2Y0VGowQkNXOGNoMGRkaDFMMi95djZNU1hJMFFXSVFDdVp2dFU5MnpDWEVYYkRWQk53aDhXL2lFbitZZHFldGxDdGtDTXFaaTMrR0FHOEs0ZUEzSUFncytZOTd3OTRjOTZtNXFmN1pHTzhrU2V2OGVmdnJMd000cm90MkVPdE1IS1V4RlVHMDRRQUJjaXZJZUcrMmMzSDhoV3B2bENuQzBleXhscnAra2VnPQ==/attach/object/XHZWI2RKACAFE?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlhIWldJMlJLQUNBRkUiLCJvd25lciI6IjU3MDk3ODIwOTMxMiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTc0LCJoZWlnaHQiOjI1NX0)

~~谁家法狗~~

---

# 结尾



那么自定义Buff的知识到此就介绍完了，但是实际上这些都是很基础的知识，完全没有发挥出他们强大的功能。不多等到我们学的知识越来越多的时候，我们就知道应该如何利用他们了。

### 作业

1 如何用buff让鼠标位置发光？

2 如何用buff让玩家减血速率一开始很快，buff结束的时候变慢？

3 如何做一个**永远**不会结束的buff？

4 实现一个“战争热诚“ 效果：当近战攻击敌人积累层数，每层增加近战攻速5%，一段时间不攻击敌人后层数掉光。



*©2026 冬天的叶 &amp; dxtst\| 仅供个人学习，禁止商用二次分发*

