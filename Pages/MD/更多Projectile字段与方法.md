作者：冬天的叶 2026/9/27 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

前面几节教程我们学习了弹幕的基础属性和向量运动。但**ModProjectile**的内容远不止这些，这一节我们来讲解**ModProjectile**的更多字段与方法，让你能创建各式各样的更加灵活、更有特色的弹幕。

（重复用开头的屑）



在这个过程中，我希望同学们能学会：



**1了解常用的 ModProjectile 字段**

**2掌握弹幕的生命周期和常用方法**

**3对方法执行顺序有一个基本的认知**

---

# 更多Proj字段与方法

## 常用 Projectile 字段

### 视觉效果相关设置

#### **1** Projectile.scale（弹幕缩放）

首先是**Projectile.scale，**这个字段能控制弹幕贴图的缩放与碰撞大小。类型为`float`默认为`1`。

我们在之前的测试弹幕里设置个`Projectile.scale = 2;` 然后进游戏看看：

![图片](images/tutorials/7a6f68acaa8c870c0596833f.gif)

~~*哇奥，变大了*~~

这个字段影响的不仅仅是**视觉效果**，还会改变弹幕的碰撞箱。不过它只影响默认行为下弹幕碰撞，部分弹幕（泰拉刀，鞭子等）的碰撞逻辑不通过默认的方形碰撞箱实现，无法影响。

#### 2 Projectile.hide（隐藏弹幕）

这个字段是用来控制弹幕是否被隐藏绘制。类型为 `bool`，默认 `false`。

设为 `true` 后，弹幕仍然存在、仍然参与逻辑与碰撞，但是贴图会被隐藏。常被用于纯逻辑载体类弹幕。

#### **3 Projectile.stopsDealingDamageAfterPenetrateHits（穿透后停止伤害）**

这个字段是用来控制弹幕在穿透次数用尽后是否停止造成伤害。类型为 `bool`，默认 `false`。

如果被设为 `true`，当弹幕的 `penetrate` 穿透值降到 0 时，它会将 `penetrate` 设为 `-1`、伤害设为 `0`，并继续按照 `timeLeft` 存活直到自然消失。原版中部分弹幕（泰拉刃，真永夜等）都使用了这个机制做消失效果。（这玩意名字好长啊）

#### **4 Projectile.alpha（透明度）**

这个字段是用来控制弹幕的绘制透明度。类型为 `int`，默认 `0`。

范围 `0`（完全不透明）到 `255`（完全透明）。这个字段可以被默认设置，也可以在其他函数内动态控制，动态控制时可以做出类似淡出的效果，我们在弹幕内填入：

```csharp
public override void AI()
{
    if(Projectile.alpha<255) Projectile.alpha+=5;
}
```

然后进入游戏：

![图片](images/tutorials/3c5f06e5b57f0ae61c84d5f4.gif)

看着还行，或许可以和**`Projectile.stopsDealingDamageAfterPenetrateHits`** 配合。

---

### 弹幕类型相关设置

#### 1 Projectile.ownerHitCheck（阻挡穿透）

这个字段被用来控制，弹幕在穿墙时能否造成伤害，类型为 `bool`，默认值为 `false`。

在原版游戏中，它被用于控制长矛、鞭子等具备穿墙能力的弹幕。它的判定逻辑并非直接检测弹幕本身是否在物块里面，而是“**检测弹幕和玩家之间有没有物块阻挡”**如果二者被物块隔开，弹幕即使在悬空地带也不会造成伤害。

#### **2 Projectile.ownerHitCheckDistance（阻挡检测距离）**

这个字段是用来控制上一条 `Projectile.ownerHitCheck` 的检测距离上限。它的类型为 `float`，默认值为 `2000f`。

当弹幕和玩家之间的距离超过这个值时，即使中间没有物块阻挡，`ownerHitCheck` 也不会再判定为有效伤害。

#### 3 Projectile.coldDamage（寒冷伤害）

这个字段是用来判断弹幕是否算作"寒冷伤害"。它的类型为 `bool`，默认值为 `false`。

被标记为寒冷伤害的弹幕，在攻击有抗寒效果（**resistCold**）的玩家时，伤害减少70%

#### **4 Projectile.trap（陷阱弹幕）**

这个字段是用来判断弹幕是否是陷阱弹幕。它的类型为 `bool`，默认值为 `false`。

陷阱弹幕会影响大部分的伤害计算。比如在陷阱世界里提高伤害，对旧日军团造成的伤害减半等。

#### **5 Projectile.npcProj（NPC 弹幕）**

这个字段是用来判断弹幕是否由 NPC 发射（而非玩家）。它的类型为 `bool`，默认值为 `false`。

注意不要和下面两个字段混淆。

```csharp
Projectile.friendly = true;// 对敌人造成伤害
Projectile.hostile = false;// 对玩家造成伤害
```

设置这个以后会影响弹幕的归属者，无法记录伤害计数器，战士的地狱石，射手的毒刺给予的加成也无法享受，该字段还影响仇恨判定， NPC 发射的弹幕在多人联机的仇恨计算中也被区别对待。

#### 6 Projectile.counterweight（平衡锤类弹幕）

这个字段是用来判断弹幕是否是"平衡锤"弹幕（溜溜球的平衡锤）。它的类型为 `bool`，默认值为 `false`。设置了这个属性以后，能够吃到悠悠球相关饰品的一些加成。

#### **7 Projectile.arrow（箭矢类弹幕）**

这个字段是用来判断弹幕是否是箭矢类弹幕。它的类型为 `bool`，默认值为 `false`。

能够吃到箭矢药水，射手毒刺，以及蘑菇套的加成，某些特殊效果（宝箱怪的策反，入水灭火等）也会对箭矢类弹幕生效。

#### **8 Projectile.bobber（钓鱼浮标）**

这个字段是用来判断弹幕是否是钓鱼浮标。它的类型为 `bool`，默认值为 `false`。

鱼竿我们会在后面的教程会单独讲，了解一下这个字段就行，先跳过。

#### 9 Projectile.counterweight（钓鱼配重）

这个字段是用来判断弹幕是否是钓鱼配重。它的类型为 `bool`，默认值为 `false`。

鱼竿我们会在后面的教程会单独讲，了解一下这个字段就行，先跳过。

#### 10 Projectile.sentry（哨兵弹幕）

这个字段是用来标记弹幕是否是哨兵（固定不动的召唤物）。它的类型为 `bool`，默认值为 `false`。

哨兵默认存在`36000`游戏刻，也就是`600` 秒。哨兵没有栏位占用，默认占用1格哨兵栏。并且它在Player内相关字段用的是**Turrets**而不是**Sentry**，不知道为什么red没给他们文本同步

#### 11 Projectile.minion（召唤物弹幕）

这个字段是用来标记弹幕是否是召唤物的弹幕。它的类型为 `bool`，默认值为 `false`。

不要和**召唤伤害（DamageClass.Summon）**混淆。打个比方，火焰小鬼发出来的火球是召唤伤害，但不是召唤物。迷你激光眼发出来的激光也是召唤伤害，不是召唤物。

#### 12 Projectile.minionSlots（召唤栏位占用）

这个字段是用来控制该召唤物占用多少召唤栏位。它的类型为 `float`，默认值为 `0f`。1f 表示占 1 个栏位。虽然它能够填小数，但我推荐你填大于或等于1的数值。因为....

##### 召唤栏的计算（太长可跳）

这个东西挺复杂的，算是泰拉瑞亚的“屎山代码”之一。

首先，**召唤物的召唤栏位占用**数值不一定是整数，它可以是小数，比如 `0.1f`。这意味着 1 个召唤栏能够召唤 10 个召唤物。听起来完全符合逻辑，对吧？

但这里有个问题，玩家自带的那个召唤栏，是个**“残疾召唤栏”**被强制锁定**只能召唤一个召唤物**。



举个例子：

- 如果我们只有 1 个召唤栏，某个召唤物只占 `0.1` 栏，理论上我们可以召唤`10`个召唤物，但是因为玩家自带的那个召唤栏，是**“残疾召唤栏”**我们被强制锁定了，只能召唤 1 个召唤物

- 如果我们有 2 个召唤栏，理论上你就可以召唤 `20` 个占 `0.1` 栏的召唤物，但是因为**“残疾召唤栏”**的影响，我们原本理论上能招 `20` 个的召唤物，只能招 `11` 个。（10+1）

  

  这时候有同学就会说：不对啊，原版不是有两个占用小数召唤栏的召唤物吗？

  因为这两个召唤物被**特判**了：

- **双子魔眼的魔焰眼**：它依赖于激光眼存在。虽然本身占用0.5召唤栏，却不会受到“残疾召唤栏”的影响

- **蜘蛛召唤杖的蜘蛛**：它可以超上限，向上取整。本身占用0.6的召唤栏，假设你有 2 个召唤栏，第 1 个直接被一整只蜘蛛占掉了，第 2 个召唤栏占了 1.2 个召唤位。正常情况下是无法召唤的。但蜘蛛是向上取整，1.2 ≈ 1，游戏认为这是正常的，所以你才有了 3 个蜘蛛召唤物

  ![图片](images/tutorials/d7cc1294fb2c2922af0f5dd7.png)

  ~~*这两个弹幕的代码给我看吐了。*~~

  所以在写模组的时，如果需要做多数量的召唤物，可以参考双子魔眼：**一个主召唤物占用一格栏位，剩下的附属召唤物依靠主召唤物存在**。这样既避开了原版召唤栏的复杂计算，效果也更好控制。

  ---

### 伤害属性相关设置

#### 1 **Projectile.noEnchantments（禁用武器附魔）**

这个字段是用来标记弹幕是否不受武器附魔效果影响（例如药剂、霜冻盔甲、岩浆石等）。它的类型为 `bool`，默认值为 `false`。

如果设为 `true`，该弹幕不会施加相关增益，也不会生成相关的视觉效果。

#### **2 Projectile.noEnchantmentVisuals（禁用附魔视觉）**

这个字段是用来标记弹幕是否不自动调用 `EmitEnchantmentVisualsAt(Vector2, int, int)`。它的类型为 `bool`，默认值为 `false`。

如果设为 `true`，弹幕将不会自动生成附魔视觉特效，便于我们自己手动判断生成。

如果弹幕不需要武器附魔效果、连相关增益也不想施加的话，请改用 `noEnchantments`来禁用武器附魔。

#### **3 Projectile.usesLocalNPCImmunity（局部无敌帧）**

这个字段用来控制弹幕是否**自行管理对每个 NPC 的无敌帧**。类型为 `bool`，默认 `false`。

如果设为 `true`，那么玩家发射 8 个该弹幕同时击中敌人时，8 个都能造成伤害，不会骗伤。原版夜明弹的反骗伤就使用了这个字段。

#### **4 Projectile.localNPCHitCooldown（局部无敌帧冷却时间）**

这个字段需要配合 `usesLocalNPCImmunity` 使用，它决定了该弹幕再次对同一个 NPC 造成伤害前，需要等待多少帧。类型为 `int`，默认 `-2`。

- `-1`：表示只能命中某个 NPC 一次

- `-2`（默认值）：不产生效果

  所以，**启用局部无敌帧（`usesLocalNPCImmunity = true`）时，必须给它填一个合适的值**，否则不会生效。

  

  我们在弹幕的`SetDefaults()` 里面填入：

  ```csharp
  Projectile.usesLocalNPCImmunity = true;//局部无敌帧,玩家发射8个该弹幕同时击中敌人，则八个都能击中，不骗伤
  Projectile.localNPCHitCooldown = 30;//单个子弹击中敌人后过多少时间才可以再造成一次伤害
  ```

  然后进入游戏：

  ![图片](images/tutorials/e0abed9bfc93d26b0f965fb8.gif)

  你会发现随着弹幕数量越增越多，造成的伤害频率也越来越快，没有骗伤

#### **5 Projectile.usesIDStaticNPCImmunity（静态无敌帧）**

这个字段用来控制**同一类型的所有弹幕，是否共享对每个 NPC 的无敌帧**。类型为 `bool`，默认`false`。如果设为 `true`，那么玩家发射 8 个该弹幕同时击中敌人时，只有一个能造成伤害，其余 7 个都会被无敌帧挡住。 

#### **6 Projectile.idStaticNPCHitCooldown（静态无敌帧冷却时间）**

这个字段需要配合 `usesIDStaticNPCImmunity` 使用，它决定了**同一类型的所有弹幕**再次对同一个 NPC 造成伤害前，需要等待多少帧。类型为 `int`，默认 `-1`。

启用静态无敌帧时，必须给它填一个合适的值。

原版胡蜂枪的胡蜂就用了这两字段，一只胡蜂命中后，其他胡蜂在无敌帧期间全部失效。



听上去好像没什么用哈（）。但其实不然：

- **不设置这个字段**（默认 `false`）：弹幕造成的无敌帧会**和其他所有弹幕一起共享**。也就是说，你的弹幕命中后，别的弹幕在无敌帧期间也打不出伤害

- **设置了这个字段**（`true`）：无敌帧只在**同一类型的弹幕之间共享**，不会影响其他类型的弹幕

  

  所以这个字段的实际作用是：**把无敌帧的影响范围，从“所有弹幕”缩小到“同一类型弹幕”**。

  

  我们在弹幕的`SetDefaults()` 里面填入：

  ```csharp
  Projectile.usesIDStaticNPCImmunity = true;//静态无敌帧,玩家发射8个该弹幕同时击中敌人，只有一个能造成伤害，不和其他弹幕骗伤
  Projectile.idStaticNPCHitCooldown = 30;//单个子弹击中敌人后，所有该弹幕过多少时间才可以再造成一次伤害
  ```

  然后进入游戏：

  ![图片](images/tutorials/b91b3cd2927916be01f44231.gif)

  你会发现随着弹幕数量越增越多，但造成的伤害频率却没有越来越快，共享无敌帧

#### **7 Projectile.ArmorPenetration（护甲穿透）**

这个字段用来控制该弹幕自身能无视的防御点数。类型为 `int`，默认 `0`，不能设为负值。

护甲穿透是一个隐藏属性，用来降低目标的防御力。比如弹幕有 5 点护甲穿透，怪物有20 防御，弹幕打到怪物后原本怪物的 20 防御会被护甲穿透扣除5点，计算伤害时视为 15 进行伤害计算。

如果该弹幕是由武器发射的，在生成时会把武器的总护甲穿透也加到自身数值上。

### 弹幕克隆相关设置

#### **1 Projectile.aiStyle（AI 样式）**

这个字段是用来选择原版代码中哪一种 AI 逻辑给该弹幕使用。类型为 `int`，默认 `0`。

原版弹幕的 AI 样式都列在 `ProjAIStyleID` 类里。模组开发者可以用原版 `aiStyle`，再配合 `ModProjectile.AIType` 来模仿游戏里已有的 AI 代码。不过这种做法通常只适合做弹幕原型，因为原版 `aiStyle` 的代码很难定制。这期教程只关注于自己写的AI类型，将值填为-1即可。

#### 2 ModProjectile.AIType（行为逻辑）

这个是 ModProjectile 上的属性，不是 Projectile 上的。用来指定这个弹幕"借用"哪个原版弹幕的 AI 行为。比如

```csharp
public override void SetStaticDefaults()
{
    AIType = ProjectileID.Bullet; // 借用普通子弹的 AI
}
```

这期教程不会去研究每种`aiStyle`都对应着什么样的行为，而是教大家怎样写出符合自己想法的弹幕，所以**不会去关注**这一部分。相关内容会在后续弹幕克隆实战教程中提及。



好的，常用的**Projectile**字段介绍完了，分享一下代码。

```csharp
public override void SetDefaults()
{
    //简单弹幕教程中提及过的内容
    Projectile.width = 16;                       // 碰撞箱宽度
    Projectile.height = 16;                      // 碰撞箱高度
    Projectile.friendly = true;                  // 对敌人造成伤害
    Projectile.hostile = false;                  // 对玩家造成伤害
    Projectile.DamageType = DamageClass.Magic;   // 伤害类型：魔法
    Projectile.penetrate = 3;                    // 穿透次数，-1为无限穿透
    Projectile.timeLeft = 300;                   // 存活时间，60帧=1秒
    Projectile.light = 0.5f;                     // 发光强度
    Projectile.ignoreWater = true;               // 不受水影响
    Projectile.tileCollide = true;               // 撞墙消失
    Projectile.extraUpdates = 1;                 // 额外更新次数，让弹幕更流畅

    // 视觉效果相关设置
    Projectile.scale = 1f;                       // 缩放，默认1，影响贴图与默认碰撞箱
    Projectile.hide = false;                     // 隐藏弹幕，默认false，隐藏贴图但保留逻辑与碰撞
    Projectile.stopsDealingDamageAfterPenetrateHits = false; // 穿透后停止伤害，默认false，穿透用尽后伤害归零并继续存活(这b玩意好长)
    Projectile.alpha = 0;                        // 透明度，默认0，0不透明，255全透明

    //弹幕类型相关设置
    Projectile.ownerHitCheck = false;            // 阻挡穿透，默认false，检测玩家与弹幕之间是否有物块阻挡
    Projectile.ownerHitCheckDistance = 2000f;    // 阻挡检测距离上限，默认2000f
    Projectile.coldDamage = false;               // 寒冷伤害，默认false，对抗寒目标伤害减少70%
    Projectile.trap = false;                     // 陷阱弹幕，默认false，影响部分伤害计算
    Projectile.npcProj = false;                  // NPC弹幕，默认false，影响归属者、伤害计数器、加成与仇恨判定
    Projectile.counterweight = false;            // 平衡锤类弹幕，默认false，可吃悠悠球相关饰品加成
    Projectile.arrow = false;                    // 箭矢类弹幕，默认false，可吃箭矢药水、射手毒刺、蘑菇套等加成
    Projectile.bobber = false;                   // 钓鱼浮标，默认false，鱼竿单独讲
    Projectile.sentry = false;                   // 哨兵弹幕，默认false，默认存在36000刻，占用1格哨兵栏
    Projectile.minion = false;                   // 召唤物弹幕，默认false，注意与召唤伤害区分
    Projectile.minionSlots = 0f;                 // 召唤栏位占用，默认0f，1f表示占1个栏位

    //伤害属性相关设置
    Projectile.noEnchantments = false;           // 禁用武器附魔，默认false，不受药剂、霜冻盔甲、岩浆石等影响
    Projectile.noEnchantmentVisuals = false;     // 禁用附魔视觉，默认false，不自动调用附魔视觉
    Projectile.usesLocalNPCImmunity = false;     // 局部无敌帧，默认false，每个弹幕自行管理对每个NPC的无敌帧
    Projectile.localNPCHitCooldown = 30;         // 局部无敌帧冷却，默认-2，配合上一项使用
    Projectile.usesIDStaticNPCImmunity = false;  // 静态无敌帧，默认false，同类型弹幕共享对每个NPC的无敌帧
    Projectile.idStaticNPCHitCooldown = 30;      // 静态无敌帧冷却，默认-1，配合上一项使用
    Projectile.ArmorPenetration = 0;             // 护甲穿透，默认0，不能为负，武器发射时会叠加武器总护甲穿透

    //弹幕克隆相关设置
    Projectile.aiStyle = -1;  // AI样式，默认0，-1为不使用原版AI，后续弹幕克隆教程再讲
}
// AIType 是 ModProjectile 上的属性，应该写在 SetStaticDefaults 里
public override void SetStaticDefaults()
{
    //AIType = ProjectileID.Bullet; // 借用普通子弹的 AI，后续弹幕克隆教程详讲
}
```

---

## 常用 Projectile 方法

在之前的教程中，我们已经使用过 `Projectile` 的 `AI` 方法，也对 `Projectile` 的更新有了一些了解。所以这期教程就从它的姊妹方法 `PreAI / PostAI` 开始介绍。



### **1 PreAI / AI / PostAI （逻辑更新）**

这是**弹幕更新**的三段式结构，执行顺序为：

![图片](images/tutorials/0abac612a747fb6475547567.png)

- **PreAI**：是`Projectile`内的**有返回值**方法，返回值为 `bool`。返回 `false` 会跳过 AI 和原版 AI。通常用来做前置检查、状态切换。

- **AI**：是`Projectile`内的**无返回值**方法。一般弹幕的核心逻辑都写这里。

- **PostAI**：是`Projectile`内的**无返回值**方法。无论 PreAI 返回什么都会被执行。用来做“收尾”处理，比如更新旋转、生成拖尾。

- **注意**：如果你设置了 `aiStyle` 字段，那么对应的原版 AI 逻辑会在 `AI()` 之后、`PostAI()` 之前执行一次。如果你不需要使用原版 AI 逻辑，就把 `aiStyle` 设为 `-1` ， `-1`没有对应的原版 AI 逻辑，这样我们的弹幕就能不受影响。

### **2 OnSpawn （弹幕生成）**

这个方法是`Projectile`内的**无返回值**方法。

这个方法会在弹幕生成时调用一次，参数是 `IEntitySource source`（生成源）。



它和 `SetDefaults` 的区别是：

`SetDefaults` 是游戏在“创建弹幕类型”时调用的，而`OnSpawn` 是“弹幕生成”时调用的。原版弹幕在生成时做动态处理会用到 `OnSpawn`，比如夜光的随机颜色、星怒失去穿透的位置等。



听上去有点绕，举个例子：

`SetDefaults` 就像考试时写班级和名字，和题目无关。这些信息被用来告诉游戏“我是谁”。同样，我们不能在这里写答案、打草稿。因为此时考试可能还没开始（弹幕可能并没有被生成到世界上）。

而 `OnSpawn` 就像考试时做第一道题，我们在这里写答案、打草稿是完全合规的，因为 `OnSpawn` 涉及了这次生成的具体内容，考试已经开始了（弹幕出现在了世界上）。

### 3 ShouldUpdatePosition （位置更新）

这个方法是`Projectile`内的**有返回值**方法。返回值为 `bool`，默认为 `true`。它被用来判断弹幕否进行位置更新（是否进行向量移动）。返回 `false` 时弹幕不受 `velocity` 向量影响。原版的电钻，骑枪都使用了这个方法。因为`velocity`没有归0 使用这个方法的弹幕能够在没有向量移动的情况下正确造成击退。

### 4 TileCollideStyle（碰撞检测）

这个方法是`Projectile`内的**有返回值**方法。返回值为 `bool` 。这个方法被用于弹幕与物块碰撞的检测，如果在这个方法内返回 `false` 就代表不检测，并完全阻止原版碰撞（也就是穿墙）。

参数有：

- `width` / `height`：碰撞检测用的尺寸

- `fallThrough`：是否穿过平台

- `hitboxCenterFrac`：碰撞箱中心相对弹幕中心的偏移

  我们在弹幕中填入：

  ```csharp
  public override bool TileCollideStyle(ref int width, ref int height, ref bool fallThrough, ref Vector2 hitboxCenterFrac)
  {
      return false;
  }
  ```

  然后进入游戏：

  ![图片](images/tutorials/30b50e94550e108b430eebdd.gif)

### 5 OnTileCollide（物块交互）

这个方法是`Projectile`内的**有返回值**方法。返回值为 `bool` 。

参数是 `Vector2 oldVelocity`（历史向量）。

它被用来判断弹幕与物块碰撞时会发生什么。`OldVelocity`是碰撞发生前的向量。返回`true`。会执行原版碰撞逻辑（接触并消失）返回`false`,弹幕会像npc一样，贴着物块移动。

默认情况下返回`true`。

我们在弹幕中填入：

```csharp
public override bool OnTileCollide(Vector2 oldVelocity)
{
    return false;
}
```

然后进入游戏：

![图片](images/tutorials/1aa639dd9d4538fd4bf5b623.gif)

~~*有点诡异（）*~~

通过这个方法我们能自定义弹幕的碰撞逻辑。

这边提供一个简单的碰撞反弹：

```csharp
 public override bool OnTileCollide(Vector2 oldVelocity)
 {
     // 让弹幕在碰撞后产生弹性反弹
     // 检查水平方向：如果当前速度与碰撞前的值不同（说明水平方向发生了碰撞），
     // 且碰撞前水平速度的绝对值大于 1，就把水平速度反向并乘以 0.9
     if (Projectile.velocity.X != oldVelocity.X && Math.Abs(oldVelocity.X) > 1f)
     {
         Projectile.velocity.X = oldVelocity.X * -0.9f;
     }
     // 检查垂直方向：如果当前速度与碰撞前的值不同（说明垂直方向发生了碰撞），
     // 且碰撞前垂直速度的绝对值大于 1，就把垂直速度反向并乘以 0.9
     if (Projectile.velocity.Y != oldVelocity.Y && Math.Abs(oldVelocity.Y) > 1f)
     {
         Projectile.velocity.Y = oldVelocity.Y * -0.9f;
     }
     return false;
 }
```

然后我们进入游戏：

![图片](images/tutorials/426ea3267de6ef312f3d89f8.gif)

不赖

### 6 PreKill / Kill / OnKill（死亡结算）

这是**弹幕死亡**的三段式结构，执行顺序为：

![图片](images/tutorials/4b94427db7673eb571ebb3e8.png)

- **PreKill**：`Projectile` 的**有返回值**方法，返回值为 `bool`。

  返回 `false` 会跳过原版的 **Kill** 和 **OnKill**。注意：弹幕**还是会死**，只是你的 **OnKill** 不会执行。

- **Kill**：`Projectile` 内的**无返回值**方法，**已被弃用**。

  这个方法处于一个非常尴尬的地位，**Kill** 不像 **AI** 那样需要频繁调用，给死亡流程加多层嵌套没有任何意义。所以它就卡在这里，上不去下不来。

- **OnKill**：`Projectile` 内的**无返回值**方法。弹幕死亡时执行一次，被用来生成特效、掉落物、爆炸等效果。

- **注意**：和 `Ai` 方法类似，如果你不需要使用**原版弹幕死亡逻辑**，就把 `aiStyle` 设为 `-1` ， `-1`没有对应的**原版弹幕死亡逻辑**，这样我们的弹幕就能不受影响。

  

  这边提供一个简单的死亡特效：

  ```csharp
  public override void OnKill(int timeLeft)
  {
      // 爆炸粒子
      for (int i = 0; i < 20; i++)
      {
          Dust.NewDust(Projectile.position, Projectile.width, Projectile.height, DustID.Smoke,Scale:1.5f);
      }
      // 播放音效
      SoundEngine.PlaySound(SoundID.Item14, Projectile.position);
  }
  ```

  然后我们进入游戏：

  ![图片](images/tutorials/5f0c11def5967377b43f7d98.gif)

  非常好玩

### 7 CanHitNPC / ModifyHitNPC / OnHitNPC（命中敌怪）

这是**命中 NPC** 的三段式结构，执行顺序为：

![图片](images/tutorials/72c1721fcf5c5c01a506f759.png)

- **CanHitNPC**：`Projectile` 内的**有返回值**方法 ，返回值为 `bool?` 。参数为 `NPC target`。这个方法返回 `false` 阻止命中，返回 `true` 强制允许，`null` 则正常使用原版判定。

- **ModifyHitNPC**：`Projectile` 内的**无返回值**方法 。

  参数为 `NPC target, ref NPC.HitModifiers modifiers`。除了执行命中逻辑以外，还可以在这里修改弹幕的暴击率、伤害倍率等。

- **OnHitNPC**：`Projectile` 内的**无返回值**方法 。

  参数为 `NPC target, NPC.HitInfo hit, int damageDone`。命中后执行一次，可被用于施加 Buff、吸血等效果。

- **注意**：和 `Ai` 方法类似，如果你不需要使用**原版命中 NPC逻辑**，就把 `aiStyle` 设为 `-1` ， `-1`没有对应的**原版命中 NPC逻辑**，这样我们的弹幕就能不受影响。

  

  这边提供一个简单的命中效果：

  ```csharp
  public override void OnHitNPC(NPC target, NPC.HitInfo hit, int damageDone)
  {
      // 给命中的 NPC 施加 300 帧（5 秒）的着火减益
      target.AddBuff(BuffID.OnFire, 300);
  
      // 如果这次攻击是暴击
      if (hit.Crit)
      {
          // 获取弹幕所属的玩家
          Player player = Main.player[Projectile.owner];
          // 玩家回复伤害值 1/10 + 1 的生命
          //在int计算的除法计算里面，如果造成的伤害小于 10 的话会输出 0 的，这个 +1 算是保底伤害了
          player.Heal((damageDone / 10)+1);
      }
  }
  ```

  然后我们进入游戏：

  ![图片](images/tutorials/c3cde3363fda786c1f2db762.gif)

  我说小吸血书&gt;大吸血书，有没有懂的（）

### 8 CanHitPlayer / ModifyHitPlayer / OnHitPlayer（命中玩家）

这是**命中玩家**的三段式结构，和 NPC 那套一样，只不过目标是玩家，用于非友方弹幕，以及pvp。有些弹幕会在命中玩家的方法里**减弱其造成的负面效果**，防止在pvp中过于超模。（虽然pvp的平衡性本身就是一坨）

它们 和 **命中 NPC** 的三段式结构类似我就不讲了，摸了摸了（）

---

# 结尾

好了，那么我们的 **弹幕字段与方法** 教程也就到此结束了。

其实还有个绘制三段式和 `drawLayer` 没有讲。不过，我觉得 绘制部分还是放到 绘制教程里面介绍比较好。

这一节内容量也不小，但都是以后写自定义弹幕的基础，希望同学们好好消化，就不留作业了。

（话说真的有人做吗，1个月了，一篇作业都没看到）

后续教程安排可能会写一些更细致的原版弹幕 AI 分析，比如悠悠球、鞭子、长矛的实战例子，克隆，以及内部实现。至于现在嘛……

![图片](images/tutorials/5c7d7aec1b944e86d01314f5.png)

~~*摸了，摸了。*~~

---



*©2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*

