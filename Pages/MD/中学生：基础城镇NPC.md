作者：冬天的叶，中学生 2026/8/26 \| 🔖 高级

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

# 如何制作一个基础城镇 NPC（1.4.5.8 重制版）

各位读者早午晚上好鸭\_(з」∠)\_，这里是重构教程的叶子。这里是原作者中学生，一个正在学习中的萌新。好不容易拿到了编写文章的机会，今天由我来介绍——**如何制作一个基础城镇 NPC**。

（中学生：来来来！各位 NPC 们，干活啦！）

---

# 关于分类的那些事

首先我们来康康，友方 NPC 都分为哪些。

根据官方提供的类别划分，主要分为三大类：

## 1. 城镇 NPC

这是本文的主体。他们会搬进玩家建造的房屋，死亡后只要有空房屋就会重生。目前游戏中共有 26 个城镇 NPC，其中 8 个通常出现在困难模式。

- **困难模式之前**：向导、商人、护士、爆破专家、染料商、渔夫、动物学家、树妖、油漆工、高尔夫球手、军火商、酒馆老板、发型师、哥布林工匠、巫医、服装商、机械师、派对女孩。

- **困难模式**：巫师、税收官、松露人、海盗、蒸汽朋克人、机器侠、圣诞老人、公主。

  以及3个特殊城镇 NPC，一些观点认为以下 NPC 不该视为城镇 NPC，因为它们并不搬进房屋中。

- **旅商**：白天有几率生成，黄昏离开，随机售卖独特物品。

- **老人**：固定在地牢入口，击败骷髅王后以"服装商"身份成为城镇 NPC。

- **骷髅商人**：在地下层随机出现，基于月相售卖物品。

  每个非特殊城镇 NPC 都需要有自己的房屋。他们可以降低区域内的敌怪生成速度，会攻击附近的敌怪自卫，并且会根据世界进度获得防御和伤害加成。

## 2. 城镇宠物

较新版本加入的特殊类别。它们算作城镇 NPC（影响晶塔和刷怪率），但可以和另一名非城镇宠物 NPC 共用房屋，且没有任何自卫手段。

城镇宠物又分为两种：

- **动物学家城镇宠物**：猫咪、狗狗、兔兔，通过使用动物学家出售的宠物许可证获得。

- **城镇史莱姆**：侍卫、笨拙、书呆子、暴躁、神秘、长者、酷酷、天后史莱姆，各有不同的生成条件。

## 3. 可救援 NPC

部分 NPC 和城镇宠物在可入住房屋前需要被救援，其中有些由于外观被称为受缚 NPC。如同敌怪和小动物生成的方式一样，他们会在其对应的生物群系中随机生成，且在消失或被杀死后重生。

- **受缚 NPC：**沉睡渔夫，高尔夫球手，被网住的发型师，受缚哥布林，昏迷男子，受缚机械师，受缚巫师，对他们按下聊天键会救援并解锁他们。

- **其他：**老旧摇摇箱，笨拙气球史莱姆，神秘青蛙，痛苦亡魂，各有不同的生成条件。

  ---

  > **本文只讲第 1 类——城镇 NPC。城镇宠物和"可救援 NPC"留到以后再说。**

  现在我们来康康城镇 NPC 都分为哪些：

## 按入住方式，分为三类

### **常驻类**：

你家向导和其他那些需要一座房子才可以入住、并且死后会复生的 NPC，即为常驻类。这也是本文的主要内容。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/LJHV26BKADQHC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkxKSFYyNkJLQURRSEMiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzI0LCJoZWlnaHQiOjI5M30)

*一个典型的常驻 NPC，其入住房屋会标有旗帜（这不废话嘛 ×）。*

### **游商**：

像旅行商人那样，白天有几率刷新、黄昏时消失的 NPC。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/QVOHY6BKABQE6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlFWT0hZNkJLQUJRRTYiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjM0LCJoZWlnaHQiOjU2M30)

*一个典型游商（NPC），注意入住列表里没有他的头像。*

在`ExampleMod` 的 `Example Traveling Merchant` 有提供例子，这里不再多说。

### **第三类**：

也就是像骷髅商人和地牢老人那样的，允许对话或交易、却无法入住的 NPC。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/GDOH46BKACQAG?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkdET0g0NkJLQUNRQUciLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDA0LCJoZWlnaHQiOjIxNX0)

*一个第三类 NPC。*

注意：地牢老人的"家"就是地牢门口。之所以叫第三类，是因为实在想不出个好名词（起名废 ×）。

## 按攻击方式，分为四类

射手类、投掷类、法师类、战士类。（可以按照玩家职业理解，只不过投手取代了召唤师）

### **射手类**：

还是像你家向导那样，单次攻击只显示一帧动画，发射弹幕。一般这种 NPC 会持有武器，后面会讲如何给 NPC 设置武器。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/CCZYG6BKAAQE2?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkNDWllHNkJLQUFRRTIiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzM2LCJoZWlnaHQiOjIwOX0)

*射手类 NPC 正在攻击。*

### **投掷类**：

像商人一样，单次攻击有四帧动画，发射弹幕，不持有武器。这种 NPC 最为常见，也是最好做的 NPC。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/MW5IK6BKADQHC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik1XNUlLNkJLQURRSEMiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTE2LCJoZWlnaHQiOjIxNH0)

*投掷类 NPC 正在攻击，图中所示为商人攻击帧数的第三帧。*

### **法师类**：

和魔法师一样，单次攻击有两帧，发射弹幕，

一般会自带一个（发光发热的）魔法光环。同样的，不持有武器。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/NB5IQ6BKAAQCQ?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik5CNUlRNkJLQUFRQ1EiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzEyLCJoZWlnaHQiOjE4Nn0)

*法师类 NPC 正在攻击。*

注意魔法师是原版中唯三具有多抛射物能力的城镇 NPC，另外两个是蒸汽朋克人和蘑菇人。

### **战士类**：

和染料商一样，单次攻击有四帧动画，不发射弹幕，持有武器。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/NMAYU6BKABQE6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik5NQVlVNkJLQUJRRTYiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6Mjk2LCJoZWlnaHQiOjE3NX0)

*战士类 NPC 正在攻击。*



好了，讲了一堆关于分类的内容，我们终于能进入正题了

先别疑惑，前面这些分类准则后面会用上的

---

# 创建项目与类

想要制做 **城镇NPC**，第一步自然是搞到一张 **城镇NPC** 贴图。如果你没有准备贴图也没关系，教程这边给大家提供了一张 **可爱苦力怕** 贴图，大家可以下载使用。

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/3TBBLERKAAAEM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjNUQkJMRVJLQUFBRU0iLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTAsImhlaWdodCI6MTI4OH0)

然后，用你的 VS 新建一个项目，这里就叫 `TestNPC`：

```csharp
namespace DemoMod.Content.NPCs.TownNPCs
{
    // [AutoloadHead] 会自动加载小地图图标
    // 图标名字为：类名 + "_Head"（比如 TestNPC_Head）
    [AutoloadHead]
    public class TestNPC : ModNPC
    {
    }
}
```

城镇 NPC 也属于NPC，所以要继承 `ModNPC` 类

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/UQG4TBBKAAQH6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlVRRzRUQkJLQUFRSDYiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjgsImhlaWdodCI6MjR9)

你可能注意到了上面的**[AutoloadHead]**，这段代码就是自动加载一个NPC的 **小地图图标** 用的，

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/ZV2M3BBKAAQEY?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlpWMk0zQkJLQUFRRVkiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDc4LCJoZWlnaHQiOjE5M30)

小地图图标的名字为：**该NPC类名**加**\_Head**（比如**TestNPC\_Head**）。

**Boss**的小地图图标也是如此，只不过换成了[**AutoloadBossHead**]，后缀名也改成了**\_Head\_Boss**

---

# 派对贴图与替换材质（可跳过）

好，下一步就是SetDefaults…先等一下，这里还有 **亿** 点东西：

```csharp
#region 配置NPC贴图

// 微光形态的 Head 槽位。在 Load() 里注册后保存下来，之后构建 NPCProfile 时要用到。
private static int ShimmerHeadIndex;

// NPC 的贴图配置，用来存放普通形态、微光形态等不同变体的贴图。
private static Profiles.StackedNPCProfile NPCProfile;
public override void Load()
{
    // 必须在 Load() 里注册，不能在 SetStaticDefaults 里。
    // 贴图路径为 Texture + "_Shimmer_Head"。
    ShimmerHeadIndex = Mod.AddNPCHeadTexture(Type, Texture + "_Shimmer_Head");
}

/// <summary>
/// 设置 NPC 的贴图配置，包含普通形态和微光形态。
/// </summary>
private void SetupNPCProfile()
{
    // 开启微光形态。没有这一行，NPC 碰到微光只会像普通敌怪一样变透明，不会切换成 _Shimmer 贴图。
    NPCID.Sets.ShimmerTownTransform[Type] = true;

    // 注册该 NPC 的“详细头像”（Detailed Portrait）。
    // 图片大小最大是200×200，但是原版的贴图都是只画120左右然后居中的，具体图例可以看原版的文件参考
    NPCID.Sets.NPCPortraits.Add
    (

        // 创建一个“优先级头像提供器”
        Type, NPCID.Sets.PrioritizedPortrait() 

        // 添加一个 With “有条件”的头像。
        // 条件：ShimmeredPortraitCondition 当 NPC 处于微光状态时为真。
        // 头像：BasicPortrait(贴图路径)  指定满足条件时使用的聊天大头像贴图。
        .With(
        NPCID.Sets.ShimmeredPortraitCondition,
        NPCID.Sets.BasicPortrait($"{Texture}_Shimmer_Portrait"))

        // 设置“默认头像”。
        // 当上面所有 .With() 的条件都不满足时（也就是 NPC 不在微光状态），就使用这个头像。路径对应普通形态的大头像贴图。
        .Default( NPCID.Sets.BasicPortrait($"{Texture}_Portrait"))
     );


    // 构建 NPC 的贴图配置。
    // 创建堆叠的贴图配置文件
    NPCProfile = new Profiles.StackedNPCProfile(

        // 普通形态：本体 + 普通 Head + 派对贴图
        new Profiles.DefaultNPCProfile(
            Texture,                                // 本体贴图，例如 TestNPC.png
            NPCHeadLoader.GetHeadSlot(HeadTexture), // 普通 Head 槽位，由 [AutoloadHead] 自动加载
            Texture + "_Party"                      // 派对贴图，例如 TestNPC_Party.png
        ),

        // 微光形态：微光本体 + 微光 Head + 微光派对贴图
        new Profiles.DefaultNPCProfile(
            Texture + "_Shimmer",                   // 微光本体，例如 TestNPC_Shimmer.png
            ShimmerHeadIndex,                       // 微光 Head 槽位，在 Load() 里注册
            Texture + "_Shimmer_Party"              // 微光派对贴图，例如 TestNPC_Shimmer_Party.png
        )
    );
}
#endregion

// 传入配置贴图的方法
public override ITownNPCProfile TownNPCProfile()
{
    // 把上面配置好的 NPC 贴图给游戏，告诉游戏，我们的贴图在哪里可以找到
    return NPCProfile;
}

public override void SetStaticDefaults()
{
    // 配置的 NPC 贴图
    SetupNPCProfile();
}
```

 ~~*草，好多*~~ 

这段代码负责**给 NPC 配置不同形态下的贴图（替换材质）。**泰拉瑞亚里一个城镇 NPC 可能有多种外观状态：

- **普通状态**：平时看到的样子

- **派对状态**：派对事件激活时，NPC 会戴上派对帽，换上派对贴图

- **微光状态**：NPC 浸入微光液体后，会切换成微光形态的贴图

- **微光派对状态**：NPC 浸入微光液体后，派对事件激活，会切换成微光形态戴上派对帽的贴图

- **对话大头像：**NPC打开对话框以后显示的对应贴图，他的注册方法是判断式的，你可以给其他一些情况也注册一个头图，我们这边就只注册个微光。

  这段代码就是告诉游戏：**“我的 NPC 在这些状态下，分别该用哪张贴图。”**

  注：派对的**NPC**替换材质一般来说只是单纯脱帽子而已，贴图里不包含那个三角形的派对帽。那个是游戏到时候绘制上去的，我们不需要管。

## 需要哪些贴图

这段代码会引用以下贴图文件，全部放在 `.cs` 同级目录：

|**贴图文件名**|**用途**|
|---|---|
|`TestNPC.png`|普通形态本体（必须要有 自动加载）|
|`TestNPC_Head.png`|普通形态小地图头像（`[AutoloadHead]` 自动加载）|
|`TestNPC_Party.png`|派对形态本体（扩展的）|
|`TestNPC_Shimmer.png`|微光形态本体（扩展的）|
|`TestNPC_Shimmer_Head.png`|微光形态小地图头像（`微光形态本体存在` 自动加载）|
|`TestNPC_Shimmer_Party.png`|微光派对形态（扩展的）|
|`TestNPC_Portrait`|对话大头像（扩展的）|
|`TestNPC_Shimmer_Portrait`|微光形态对话大头像（扩展的）|


这些贴图文件是可调整的，比如我只想管微光形态，不想管派对形态，

就只需要在`SetupNPCProfile` 方法里改：

```csharp
private void SetupNPCProfile()
{
    // 开启微光形态。没有这一行，NPC 碰到微光只会像普通敌怪一样变透明，不会切换成 _Shimmer 贴图。
    NPCID.Sets.ShimmerTownTransform[Type] = true;

    // 注册该 NPC 的“详细头像”（Detailed Portrait）。
    // 图片大小最大是200×200，但是原版的贴图都是只画120左右然后居中的，具体图例可以看原版的文件参考
    NPCID.Sets.NPCPortraits.Add
    (

        // 创建一个“优先级头像提供器”
        Type, NPCID.Sets.PrioritizedPortrait() 

        // 添加一个 With “有条件”的头像。
        // 条件：ShimmeredPortraitCondition 当 NPC 处于微光状态时为真。
        // 头像：BasicPortrait(贴图路径)  指定满足条件时使用的聊天大头像贴图。
        .With(
        NPCID.Sets.ShimmeredPortraitCondition,
        NPCID.Sets.BasicPortrait($"{Texture}_Shimmer_Portrait"))

        // 设置“默认头像”。
        // 当上面所有 .With() 的条件都不满足时（也就是 NPC 不在微光状态），就使用这个头像。路径对应普通形态的大头像贴图。
        .Default( NPCID.Sets.BasicPortrait($"{Texture}_Portrait"))
     );


    // 构建 NPC 的贴图配置。
    // 创建堆叠的贴图配置文件
    NPCProfile = new Profiles.StackedNPCProfile(

        // 普通形态：本体 + 普通 Head + 派对贴图
        new Profiles.DefaultNPCProfile(
            Texture,                                // 本体贴图，例如 TestNPC.png
            NPCHeadLoader.GetHeadSlot(HeadTexture), // 普通 Head 槽位，由 [AutoloadHead] 自动加载
            null //Texture + "_Party"                      // 派对贴图，例如 TestNPC_Party.png
        ),

        // 微光形态：微光本体 + 微光 Head + 微光派对贴图
        new Profiles.DefaultNPCProfile(
            Texture + "_Shimmer",                   // 微光本体，例如 TestNPC_Shimmer.png
            ShimmerHeadIndex,                       // 微光 Head 槽位，在 Load() 里注册
            null //Texture + "_Shimmer_Party"              // 微光派对贴图，例如 TestNPC_Shimmer_Party.png
        )
    );
}
```

这样子就可以不管派对形态了。

|![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/U2QU7DZKACQHM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlUyUVU3RFpLQUNRSE0iLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjAwLCJoZWlnaHQiOjIwMH0)|![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/XOQU7DZKADQF4?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlhPUVU3RFpLQURRRjQiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjAwLCJoZWlnaHQiOjIwMH0)|
|---|---|

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/ORXBXDJKADQBC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik9SWEJYREpLQURRQkMiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTAsImhlaWdodCI6MTI4OH0)

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/FNXBXDJKAAQGC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkZOWEJYREpLQUFRR0MiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjgsImhlaWdodCI6MjR9)

这边再给出我们其他形态的 **NPC** 图

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/3LOB7DJKACQDK?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjNMT0I3REpLQUNRREsiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjMzLCJoZWlnaHQiOjM3NX0)

像这个样子摆放整齐，就可以了（）

---

# 相关属性设置

接下来，终于来到**SetDefaults**与**SetStaticDefaults**环节，大部分NPC行为相关的属性都在这里:

## SetStaticDefaults

大部分 NPC 行为相关的静态属性都在这里设置。攻击类型，快乐系统、图鉴、表情等。

```csharp
public override void SetStaticDefaults()
{
    // 配置的 NPC 贴图
    SetupNPCProfile();

    // NPC 总共帧图数，一般为 16 + 额外帧 + 攻击帧 
    // 战士、投掷 = 25，射手 = 26，法师 = 23
    Main.npcFrameCount[Type] = 23;

    // 额外活动帧，一般为 9
    // 包括坐下、谈话等动作
    NPCID.Sets.ExtraFramesCount[Type] = 9;

    // 攻击帧，取决于攻击类型
    // 战士、投掷 = 4，射手 = 5，法师 = 2
    NPCID.Sets.AttackFrameCount[Type] = 2;

    // 巡敌范围，以像素为单位
    NPCID.Sets.DangerDetectRange[Type] = 700;

    // 攻击类型：0 = 投掷，1 = 射击，2 = 法师，3 = 战士
    NPCID.Sets.AttackType[Type] = 2;

    // 单次攻击持续时间，越短攻击越快
    NPCID.Sets.AttackTime[Type] = 90;

    // 遇敌攻击优先度，数值越大越会优先逃跑
    NPCID.Sets.AttackAverageChance[Type] = 30;

    // 派对帽的 Y 偏移
    NPCID.Sets.HatOffsetY[Type] = 4;

    //如果该NPC属于法师类，你可以加上这个来改变NPC的魔法光环颜色，这里用蓝色
    NPCID.Sets.MagicAuraColor[Type] = new Color(90, 90, 255);

    // 是否拥有微光形态没有这一行，NPC 碰到微光只会像普通敌怪一样变透明，不会切换成 _Shimmer 贴图。
    // 我们在SetupNPCProfile设置过了
    //NPCID.Sets.ShimmerTownTransform[Type] = true;
    // Bestiary 图鉴绘制参数 控制 NPC 在图鉴（Bestiary）里怎么显示
    NPCID.Sets.NPCBestiaryDrawModifiers drawModifiers = new NPCID.Sets.NPCBestiaryDrawModifiers()
    {
        Velocity = 1f,       // 让图鉴里的 NPC 假装在向右走
        Direction = 1,       // 让图鉴里的 NPC 面朝右
        Scale = 1.2f,        // 图鉴里放大 1.2 倍
        Rotation = 0.1f,     // 稍微转一点
        Position = new Vector2(0, -4)  // 往上偏 4 像素
    };

    NPCID.Sets.NPCBestiaryDrawOffset.Add(Type, drawModifiers);

    // 快乐系统：生物群系偏好 + 邻居偏好
    NPC.Happiness
    .SetBiomeAffection<ForestBiome>(AffectionLevel.Like)      // 喜欢森林：在森林里商店价格会便宜一点
    .SetBiomeAffection<SnowBiome>(AffectionLevel.Dislike)     // 不喜欢雪地：在雪地里商店价格会贵一点
    .SetBiomeAffection<DesertBiome>(AffectionLevel.Hate)      // 讨厌沙漠：在沙漠里商店价格会贵很多
    .SetBiomeAffection<JungleBiome>(AffectionLevel.Love)      // 最爱丛林：在丛林里商店价格会便宜很多

    .SetNPCAffection(NPCID.Dryad, AffectionLevel.Love)        // 最爱树妖：树妖住在附近时，商店价格便宜很多
    .SetNPCAffection(NPCID.Guide, AffectionLevel.Like)        // 喜欢向导：向导住在附近时，商店价格便宜一点
    .SetNPCAffection(NPCID.Merchant, AffectionLevel.Dislike)  // 不喜欢商人：商人住在附近时，商店价格贵一点
    .SetNPCAffection(NPCID.Demolitionist, AffectionLevel.Hate);// 讨厌爆破专家：爆破专家住在附近时，商店价格贵很多
}
```

### Bestiary 图鉴绘制参数

其他代码看注释都可以理解，除了 `NPCBestiaryDrawModifiers` 这个 **结构体（struct）**，它是专门用来控制**NPC 在图鉴（Bestiary）里怎么显示的**。

我挑几个常用的字段来解释：

|**字段**|**作用**|**默认值**|
|---|---|---|
|`Position`|图像偏移|`Vector2.Zero`|
|`Rotation`|顺时针旋转（弧度）|`0f`|
|`Scale`|缩放|`1f`|
|`Hide`|是否隐藏（多段 NPC 用）|`false`|
|`Frame`|固定用哪一帧|`null`（播放默认走路动画）|
|`Direction`|朝向，`-1` 左、`1` 右|`null`（默认 `-1`）|
|`Velocity`|假装在移动的速度|`0f`|
|`CustomTexturePath`|自定义图鉴贴图|`null`（用本体贴图）|


创建了 `NPCBestiaryDrawModifiers` 后，别忘了把它注册进 `NPCID.Sets.NPCBestiaryDrawOffset`

```csharp
NPCID.Sets.NPCBestiaryDrawModifiers drawModifiers = new NPCID.Sets.NPCBestiaryDrawModifiers()
{
    // 你写的东西
};
// 注册
NPCID.Sets.NPCBestiaryDrawOffset.Add(Type, drawModifiers);
```

**如果你不打算做图鉴相关的东西，这段代码可以删掉。** 删掉之后，NPC 在图鉴里会用默认参数显示（面朝左、静止、原始大小），不会影响游戏运行，只不过图鉴里的样子可能不怎么好看。

---

### Happiness 快乐系统

然后着重讲一下 `NPC.Happiness` **快乐系统** 这个东西 **如果你的 NPC 不卖东西，这段代码可以删掉。** 快乐系统主要影响商贩 NPC 的价格，对不卖东西的 NPC 没有实际作用。

```csharp
// 快乐系统：生物群系偏好 + 邻居偏好
NPC.Happiness
// SetBiomeAffection<T>(AffectionLevel)
// 设置对某个生物群系的偏好
// T 必须是 IShoppingBiome 的实现类

// 喜欢森林：在森林里商店价格会便宜一点
.SetBiomeAffection<ForestBiome>(AffectionLevel.Like)
// 不喜欢雪地：在雪地里商店价格会贵一点
.SetBiomeAffection<SnowBiome>(AffectionLevel.Dislike)

// 讨厌沙漠：在沙漠里商店价格会贵很多
.SetBiomeAffection<DesertBiome>(AffectionLevel.Hate)
// 最爱丛林：在丛林里商店价格会便宜很多
.SetBiomeAffection<JungleBiome>(AffectionLevel.Love)

// SetNPCAffection(int npcId, AffectionLevel)
// 设置对某个邻居 NPC 的偏好，用 NPC 的 ID

// 最爱树妖：树妖住在附近时，商店价格便宜很多
.SetNPCAffection(NPCID.Dryad, AffectionLevel.Love)
// 喜欢向导：向导住在附近时，商店价格便宜一点
.SetNPCAffection(NPCID.Guide, AffectionLevel.Like)
// 不喜欢商人：商人住在附近时，商店价格贵一点
.SetNPCAffection(NPCID.Merchant, AffectionLevel.Dislike)
// 讨厌爆破专家：爆破专家住在附近时，商店价格贵很多
.SetNPCAffection(NPCID.Demolitionist, AffectionLevel.Hate);

// SetNPCAffection<T>(AffectionLevel)
// 设置对某个邻居 ModNPC 的偏好，用 ModNPC 类型
// T 必须是 ModNPC 的子类

// 最爱 ExamplePerson：ExamplePerson 住在附近时，价格便宜很多

//.SetNPCAffection<ExamplePerson>(AffectionLevel.Love)

// 这是泛型版本，等价于 SetNPCAffection(ModContent.NPCType<ExamplePerson>(), ...)
// 但更安全，因为不需要手动写 NPCType

// SetBiomeAffection(IShoppingBiome, AffectionLevel)
// 设置对某个生物群系的偏好，用实例而不是泛型
// 一般用不到，除非你有动态生成的群系实例

// 喜欢森林：在森林里商店价格会便宜一点
// .SetBiomeAffection(ModContent.GetInstance<ForestBiome>(), AffectionLevel.Like);

// 和 SetBiomeAffection<ForestBiome>(...) 效果一样
// 只是换了一种写法，直接用实例而不是泛型
```

#### 生物群系类型偏好：

我们先来看 `SetBiomeAffection<T>(AffectionLevel level)` 方法，它被用来设置 **NPC** 对某个生物群系的偏好。

这个 `T` 是生物群系类型，比如 `ForestBiome`（森林）、`SnowBiome`（雪地）

常用的生物群系类还有：

|**类名**|**对应群系**|
|---|---|
|`ForestBiome`|森林|
|`SnowBiome`|雪地|
|`DesertBiome`|沙漠|
|`JungleBiome`|丛林|
|`OceanBiome`|海洋|
|`HallowBiome`|神圣|
|`CorruptionBiome`|腐化|
|`CrimsonBiome`|猩红|
|`MushroomBiome`|蘑菇|
|`UndergroundBiome`|地下|
|`CavernBiome`|洞穴|
|`SpaceBiome`|太空|


后面的 `AffectionLevel` 是偏好等级，有四个值：

```csharp
public enum AffectionLevel
{
    Love = 100,
    Like = 50,
    Dislike = -50,
    Hate = -100
}
```

四个等级对应的原版系数（`ShopHelper.hateValue` 等）大致是：

|**等级**|**购买价格**|**出售价格**|
|---|---|---|
|`Love`|88%|114%|
|`Like`|94%|106%|
|`Dislike`|106%|94%|
|`Hate`|112%|89%|


多个偏好会**乘算**叠加，所以设置得越极端，价格波动越大。

#### NPC 偏好：

然后是 `SetNPCAffection(int npcType, AffectionLevel level)` 用来设置对某个 NPC 的偏好。

- 第一个参数是 NPC 的 ID，比如 `NPCID.Dryad`（树妖）、`NPCID.Guide`（向导）

- 第二个参数同样是 `AffectionLevel`

  

  这两个方法和合成表一样，使用的是链式调用，都可以 `xxx(). xxx(). xxx(). xxx()` 无限重复。

  因为 `SetBiomeAffection` 和 `SetNPCAffection` 会**返回同一个** **`NPCHappiness` 实例**，

  所以可以一直 `.` 下去。

  ---

## SetDefaults

NPC 的基础属性都在这里设置

```csharp
public override void SetDefaults()
{
    // 必带，标记为城镇 NPC
    NPC.townNPC = true;

    // 设置这个后NPC就不会在退出地图后消失了，你可以灵活运用一下
    NPC.friendly = true;

    // 是否为友方NPC（能伤害敌怪）如果你想写敌对NPC也行
    NPC.friendly = true;

    //碰撞箱
    NPC.width = 50;
    NPC.height = 56;

    // 城镇 NPC 的 AI
    // 必带项，如果你能自己写出城镇NPC的AI可以不带
    // PS:这个决定了NPC是否能入住房屋
    NPC.aiStyle = NPCAIStyleID.Passive;

    // 伤害，防御力，生命值（城镇NPC没有碰撞伤害）
    NPC.damage = 10;
    NPC.defense = 15;
    NPC.lifeMax = 250;

    // 受伤、死亡音效
    NPC.HitSound = SoundID.NPCHit1;
    NPC.DeathSound = SoundID.NPCDeath1;

    //抗击退性，数字越小抗性越高，0就是完全抗击退
    NPC.knockBackResist = 0.5f;

    // 套用原版 NPC 的动画
    // 投掷类用 NPCID.Merchant（25 帧）
    // 其他类型建议套用对应 成年男性NPC，防止“变形金刚”
    AnimationType = NPCID.Clothier;
}
```

### 关于**AttackType**：

默认的NPC攻击类型都是投掷类NPC，如果我们想要模仿其他类型的NPC该怎么办呢？最简单的方法就是**套用这些NPC的属性**，如果你在**`AttackType`**里填了法师的ID，那么你的NPC将会拥有魔法师那样的攻击方式，并且自带一个白色魔法光环，**注意！**，如果你填了其他NPC的ID，我的建议是连**`animationType`NPC的动画** 也一起套用，防止出现一些意外情况

### 关于**animationType**：

如果使用了这个，建议看看你套用的NPC的实际帧数，比如渔夫NPC虽然算是投掷类，但他只有23帧，不同于商人的25帧；如果**帧数写错了**或者 **animationType 套错了**，你的NPC可能就会变成“变形金刚”（） 然后我们粘贴代码，进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/YUTOBDRKAAAF4?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IllVVE9CRFJLQUFBRjQiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzcyLCJoZWlnaHQiOjMyOX0)

非常好玩！

让我们继续完善它，接下来..AI和FindFrame就跳过了，因为我们**套用了原版城镇NPC的行为**

---

# 入住条件

作为一个城镇NPC，必然要有**入住条件**，否则你就没法见到他了（在不使用其他手段的情况下），所以，我们将要添加一个能让NPC入住的条件判定，这里有两个重写方法：

## CanTownNPCSpawn前置要求

判断 NPC 是否可以入住。

```csharp
public override bool CanTownNPCSpawn(int numTownNPCs)
{
    // 条件：已拥有 3 个或以上城镇 NPC，且击败克苏鲁之眼
    if (numTownNPCs >= 3 && NPC.downedBoss1)
    {
        return true;
    }
    return false;
}
```

除了以上这些提供的参数以外，这个方法支持额外的的 bool 判断。比如我写个：

```csharp
/// <summary>
/// 统计所有活跃玩家主背包（58格）里的钱币总额，单位：铜币。
/// 上限为 9999 铂金币（9,999,000,000 铜币），超过则截断返回该值。
/// 不包含猪猪存钱罐、保险箱、护卫熔炉、虚空保险库。
/// </summary>
public static long GetAllPlayersTotalCopper()
{
    // 9999 铂金币 = 9999 * 1,000,000 铜币
    const long maxCopper = 9999L * 1000000L;

    long totalCopper = 0;

    for (int i = 0; i < 255; i++)
    {
        Player player = Main.player[i];
        if (!player.active)
            continue;

        for (int j = 0; j < 58; j++)
        {
            Item item = player.inventory[j];
            if (item == null || item.stack <= 0)
                continue;

            switch (item.type)
            {
                case 71: // 铜币
                    totalCopper += item.stack;
                    break;
                case 72: // 银币 = 100 铜币
                    totalCopper += (long)item.stack * 100L;
                    break;
                case 73: // 金币 = 10000 铜币
                    totalCopper += (long)item.stack * 10000L;
                    break;
                case 74: // 铂金币 = 1000000 铜币
                    totalCopper += (long)item.stack * 1000000L;
                    break;
            }

            // 一旦达到上限就立刻返回，避免继续累加溢出
            if (totalCopper >= maxCopper)
                return maxCopper;
        }
    }

    return totalCopper;
}
```

然后在CanTownNPCSpawn里：

```csharp
public override bool CanTownNPCSpawn(int numTownNPCs)
{
    // 条件：已拥有 3 个或以上城镇 NPC，所有玩家拥有钱数大于等于一银，且击败克苏鲁之眼
    if (numTownNPCs >= 3 && GetAllPlayersTotalCopper() >= 100 && NPC.downedBoss1)
    {
        return true;
    }
    return false;
}
```

就能判断所有玩家拥有的钱币数量了，不过，像这种需要钱币达到一定数量才能生成的npc一般都要加个静态bool值判断有没有解锁过，防止重复调用方法，造成不必要的性能浪费。

---

## CheckConditions房屋条件

判断房屋是否符合特殊要求（比如松露人需要地上蘑菇群系）。普通 NPC 可以不写。

```csharp
public override bool CheckConditions(int left, int right, int top, int bottom)
{
    // 默认返回 true，表示接受普通房屋
    return true;
}
```

这个方法提供的四个参数它们的定义是 **系统检测房间的矩形范围**，也就是游戏判定“这是一个有效房屋”后给出的房间边界。你在这个范围内做自己的额外检查。

```csharp
参数      含义
left     //房间左边界的图格 X 坐标（含）
right    //房间右边界的图格 X 坐标（含）
top      //房间上边界的图格 Y 坐标（含）
bottom   //房间下边界的图格 Y 坐标（含）
```

### 判断房间中心点

比如你想检查“房屋中心点是否在太空层”，可以这样写：

```csharp
public override bool CheckConditions(int left, int right, int top, int bottom)
{
    // 算出房间中心点（图格坐标）
    int centerX = (left + right) / 2;
    int centerY = (top + bottom) / 2;

    // 把图格坐标转成世界坐标
    Vector2 worldPos = new Vector2(centerX * 16, centerY * 16);

    // 判断中心点是否在太空层
    return worldPos.Y / 16f < Main.worldSurface * 0.35f;
}
```

### 在房间范围内统计特定物块

泰拉瑞亚提供了 `WorldGen.CountTileTypesInArea`，专门用来统计某个矩形内指定物块的数量：

```csharp
public override bool CheckConditions(int left, int right, int top, int bottom)
{
    // 1. 创建计数数组，长度要覆盖所有物块类型（含 Mod）
    int[] tileTypeCounts = new int[TileLoader.TileCount];

    // 2. 扫描房间范围（注意参数顺序：startX, endX, startY, endY）
    WorldGen.CountTileTypesInArea(tileTypeCounts, left, right, top, bottom);

    // 3. 统计房间内蘑菇类物块的数量
    int count =
        tileTypeCounts[TileID.MushroomGrass] +
        tileTypeCounts[TileID.MushroomPlants] +
        tileTypeCounts[TileID.MushroomTrees];

    // 4. 达到阈值就算满足
    return count >= 10;
}
```

这就是**松露人**的经典写法——判断房间是不是在蘑菇生态里。

### 生态判断（不推荐写，可跳过）

我们不能和生成NPC时一样，使用 `Main.LocalPlayer.ZoneJungle` 来判断房间是不是某个生态，因为 `CheckConditions` 是**服务器和客户端都会调用**的，判断的是**玩家**，我们只能判断**房间物块**

#### 危险的 CheckConditions

正确思路是把 **"房间中心"当成玩家位置** 来算生态，游戏为我们提供了`SceneMetrics`来达成这种效果

`SceneMetrics` 的本质是"**以某个世界坐标为中心，扫描周围物块**"。所以你可以把**房间中心**作为扫描中心，借用同样的机制来判断生态。

```csharp
public override bool CheckConditions(int left, int right, int top, int bottom)
{
    // 算出房间中心的世界坐标
    int centerX = (left + right) / 2;
    int centerY = (top + bottom) / 2;
    Vector2 worldPos = new Vector2(centerX * 16 + 8, centerY * 16 + 8);

    // 用 SceneMetrics 扫描房间中心的生态
    var metrics = new SceneMetrics();
    metrics.Scan(new SceneMetricsScanSettings
    {
        BiomeScanCenterPositionInWorld = worldPos,   // 房间中心的世界坐标
        ScanNPCPositions = false                     // 不需要扫 NPC，省开销
    });

    // 现在可以像玩家一样判断生态了
    return metrics.ZoneJungle;
}
```

不过先别高兴的太早 `SceneMetrics.Scan` 是一个**比较重的操作**，它会：

- 扫描周围一大片区域（通常是屏幕大小）

- 统计物块、背景墙、液体、NPC 等

  而 `CheckConditions` 会在房屋查询时被**频繁调用**。如果你每次都 `new SceneMetrics()` 并 `Scan` 一次，性能会明显下降，尤其是在多人服务器上。

  

#### 笨重的扩容CountTileTypesInArea

`WorldGen.CountTileTypesInArea` 的签名是：

```csharp
public static int CountTileTypesInArea(int[] tileTypes, int startX, int startY, int endX, int endY)
```

它的后四个参数是 **`startX, startY, endX, endY`**，也就是**左上角和右下角**，不是 `left/right/top/bottom`。所以我们可以按顺序扩容`CountTileTypesInArea`。

```csharp
public override bool CheckConditions(int left, int right, int top, int bottom)
{
    // 房间中心
    int centerX = (left + right) / 2;
    int centerY = (top + bottom) / 2;

    // 左 84，右 84，上 61，下 60
    int startX = centerX - 84;
    int endX   = centerX + 84;
    int startY = centerY - 61;
    int endY   = centerY + 60;

    // 越界保护
    startX = Utils.Clamp(startX, 0, Main.maxTilesX - 1);
    endX   = Utils.Clamp(endX,   0, Main.maxTilesX - 1);
    startY = Utils.Clamp(startY, 0, Main.maxTilesY - 1);
    endY   = Utils.Clamp(endY,   0, Main.maxTilesY - 1);

    // 创建一个计数数组，长度要覆盖所有物块类型（含 Mod 物块）
    int[] tileTypeCounts = new int[TileLoader.TileCount];

    // 关键：参数顺序是 (startX, endX, startY, endY)
    WorldGen.CountTileTypesInArea(tileTypeCounts, startX, endX, startY, endY);

    // 现在可以自由读取各类型的数量
    int jungleGrassCount = tileTypeCounts[TileID.JungleGrass];
    int mudCount         = tileTypeCounts[TileID.Mud];

    return jungleGrassCount + mudCount >= 50;
}
```

这样子就达到了像玩家一样判断生态的目的了。除此以外，我们还可以使用`WorldGen.GetTileTypeCountByCategory` 来判断 **这片区域有多邪恶/多神圣** 

```csharp
public static int GetTileTypeCountByCategory(int[] tileTypeCounts, TileScanGroup group)
```

后面的`TileScanGroup` 枚举是 `GetTileTypeCountByCategory` 用来分类的**扫描组**。每个值代表一类"环境倾向"。

```csharp
None          // 不分类             直接返回 0
Corruption    // 腐化类             腐化物块的加权计数（正数）
Crimson       // 猩红类             猩红物块的加权计数（正数）
Hallow        // 神圣类             神圣物块的加权计数（正数）
TotalGoodEvil // 神圣与邪恶的净值    神圣 - (腐化 + 猩红 + 向日葵抵消)
```

我们可以这样 **判断房间是不是腐化/猩红/神圣** 

```csharp
int[] counts = new int[TileLoader.TileCount];
WorldGen.CountTileTypesInArea(counts, left, right, top, bottom);

int corrupt = WorldGen.GetTileTypeCountByCategory(counts, TileScanGroup.Corruption);
int crimson = WorldGen.GetTileTypeCountByCategory(counts, TileScanGroup.Crimson);
int hallow  = WorldGen.GetTileTypeCountByCategory(counts, TileScanGroup.Hallow);

if (corrupt >= 50)  // 腐化房屋
if (crimson >= 50)  // 猩红房屋
if (hallow  >= 50)  // 神圣房屋
```

还可以 **判断"偏神圣还是偏邪恶"**

```csharp
int net = WorldGen.GetTileTypeCountByCategory(counts, TileScanGroup.TotalGoodEvil);
if (net > 0)  // 偏神圣
if (net < 0)  // 偏邪恶
```

不过像这种需要大成本判断才能生成的npc 一般都要加个静态bool值判断有没有解锁过，防止重复调用方法，造成不必要的性能浪费。



#### 原版参考

这边提供一下原版的环境物块种类判断：

```csharp
// 腐化 阈值300
// 来源：Corrupt ∪ CorruptCountCollection ∪ CorruptBiomeSight ∪ SpreadsCorruption
// 额外：腐化草(23)
int corruptCount =
    tileTypeCounts[23]  +  // 腐化草
    tileTypeCounts[24]  +
    tileTypeCounts[25]  +
    tileTypeCounts[32]  +
    tileTypeCounts[112] +
    tileTypeCounts[163] +
    tileTypeCounts[398] +
    tileTypeCounts[400] +
    tileTypeCounts[636] +
    tileTypeCounts[661];

// 猩红 阈值300
// 来源：Crimson ∪ CrimsonCountCollection ∪ CrimsonBiomeSight ∪ SpreadsCrimson
// 额外：猩红草(199)
int crimsonCount =
    tileTypeCounts[199] +  // 猩红草
    tileTypeCounts[200] +
    tileTypeCounts[201] +
    tileTypeCounts[203] +
    tileTypeCounts[205] +
    tileTypeCounts[234] +
    tileTypeCounts[352] +
    tileTypeCounts[399] +
    tileTypeCounts[401] +
    tileTypeCounts[662];

// 神圣 阈值125
// 来源：Hallow ∪ HallowCountCollection ∪ HallowBiomeSight ∪ SpreadsHallow ∪ CanGrowCrystalShards
// 额外：神圣草(109)
int hallowCount =
    tileTypeCounts[109] +  // 神圣草
    tileTypeCounts[110] +
    tileTypeCounts[113] +
    tileTypeCounts[115] +
    tileTypeCounts[116] +
    tileTypeCounts[117] +
    tileTypeCounts[164] +
    tileTypeCounts[402] +
    tileTypeCounts[403] +
    tileTypeCounts[492];

// 沙漠 阈值1500
// 来源：isDesertBiomeSand ∪ Conversion.Sand ∪ Conversion.HardenedSand ∪ Conversion.Sandstone
int desertCount =
    tileTypeCounts[53]  +
    tileTypeCounts[112] +
    tileTypeCounts[116] +
    tileTypeCounts[234] +
    tileTypeCounts[396] +
    tileTypeCounts[397] +
    tileTypeCounts[398] +
    tileTypeCounts[399] +
    tileTypeCounts[400] +
    tileTypeCounts[401] +
    tileTypeCounts[402] +
    tileTypeCounts[403];

// 雪原 / 冰 阈值1500
// 来源：Conversion.Snow ∪ Conversion.Ice ∪ Snow ∪ Ices ∪ IcesSlush ∪ IcesSnow ∪ DontMergeWithSnow
int snowCount =
    tileTypeCounts[147] +
    tileTypeCounts[161] +
    tileTypeCounts[163] +
    tileTypeCounts[164] +
    tileTypeCounts[170] +
    tileTypeCounts[200] +
    tileTypeCounts[224] +
    tileTypeCounts[738];

// 丛林（地表） 阈值80
// 来源：Conversion.JungleGrass ∪ JungleSpecial ∪ Conversion.Thorn
// 丛林草(60, 661, 662) 来自 JungleGrass
int jungleCount =
    tileTypeCounts[32]  +  // 荆棘
    tileTypeCounts[60]  +  // 丛林草
    tileTypeCounts[69]  +  // 荆棘
    tileTypeCounts[211] +  // 叶绿
    tileTypeCounts[225] +  // 蜂巢
    tileTypeCounts[226] +  // 神庙砖
    tileTypeCounts[352] +  // 荆棘
    tileTypeCounts[655] +  // 荆棘
    tileTypeCounts[661] +  // 丛林草
    tileTypeCounts[662];   // 丛林草

// 蘑菇 阈值100
// 来源：Conversion.MushroomGrass
int mushroomCount =
    tileTypeCounts[70];  // 蘑菇草

// 地狱 阈值100（给特殊种子使用，一般判断高度就够了）
// 来源：HellSpecial ∪ TouchDamageHot ∪ Ash
int hellCount =
    tileTypeCounts[57]  +  // 灰烬
    tileTypeCounts[58]  +  // 地狱石
    tileTypeCounts[75]  +  // 地狱砖（HellSpecial）
    tileTypeCounts[76]  +  // 地狱砖（HellSpecial）
    tileTypeCounts[230] +  // 烫伤
    tileTypeCounts[684];   // 烫伤

// 草地（纯净） 理论阈值125（无独立阈值，作为基础地形）
// 来源：Conversion.Grass ∪ Conversion.GolfGrass ∪ MergesWithDirtInASpecialWay
// 去掉腐化草(23)、猩红草(199)、丛林草(60, 661, 662)、蘑菇草(70)
int grassCount =
    tileTypeCounts[2]   +  // 草
    tileTypeCounts[109] +  // 神圣草
    tileTypeCounts[477] +  // 高尔夫草
    tileTypeCounts[492];   // 高尔夫草（神圣）

// 陨石 阈值75（Skyblock 为 23）
int meteoriteCount =
    tileTypeCounts[37];

// 地牢 阈值250
int dungeonBrickCount =
    tileTypeCounts[41]  +
    tileTypeCounts[43]  +
    tileTypeCounts[44]  +
    tileTypeCounts[481] +
    tileTypeCounts[482] +
    tileTypeCounts[483];

// 丛林神庙 理论阈值80（判定靠墙，不是物块数量）
int templeBrickCount =
    tileTypeCounts[226];

// 蜂巢 理论阈值80（判定靠墙，不是物块数量）
int hiveCount =
    tileTypeCounts[225];

// 叶绿 理论阈值80（无独立阈值，属于丛林判定的一部分）
int chlorophyteCount =
    tileTypeCounts[211];

// 灰烬草 理论阈值100（无独立阈值，属于地狱判定的一部分）
int ashGrassCount =
    tileTypeCounts[633];
```

---

# 名字与对话

### SetNPCNameList（名字列表）

这个方法返回的是这个 NPC 可能会拥有的名字列表。

```csharp
public override List<string> SetNPCNameList()
{
    // 暂时先硬编码
    return new List<string>()
    {
        "苦力怕",
        "爬行者",
        "jj怪"
    };
}
```

~~（不要在意为啥是这些名字啦！）~~

NPC 生成时，游戏会从这个列表里随机挑一个名字给它。不过NPC 名字不一定是固定的。

我们也可以在 `PreAI` 里动态修改：

```csharp
// 当前名字
private string originalName = null;
public override bool PreAI()
{
    // 保存原始名字
    if (originalName == null)
        originalName = NPC.GivenName;

    // 判断这个 NPC 是不是微光变体
    if (NPC.IsShimmerVariant)
        NPC.GivenName = "Dinnerbone";
    else
        NPC.GivenName = originalName;

    return base.PreAI();
}
```

这段代码的意思是：如果这个 NPC 是微光变体，就把名字改成 `Dinnerbone`；否则恢复成原来的名字。其中：

**`NPC.IsShimmerVariant`** 属性被用于 判断这个 NPC 是不是微光变体，类型为 `bool`。

**`NPC.GivenName`** 属性为当前显示的名字，类型为 `string`。直接给它赋值，就能改掉 NPC 的名字。

### GetChat（对话逻辑）

对话逻辑与名字列表类似，不过要使用用 `WeightedRandom<string>`。

```csharp
public override string GetChat()
{
    WeightedRandom<string> chat = new WeightedRandom<string>();

    // 暂时硬编码

    // 无家可归时
    if (NPC.homeless)
    {
        chat.Add("SSSS（我想我们已经认识对方了，所以....能给个住的地方吗？）");
    }
    else
    {
        chat.Add("SS（你好！）");
    }

    // 日食时
    if (Main.eclipse)
    {
        chat.Add("SSS（我相信你可以挺过去！)");
    }

    // 血月时
    if (Main.bloodMoon)
    {
        chat.Add("SSSS！SSSSSSSS！！");
    }

    return chat;
}
```

---

# 按钮与商店

这部分是 1.4.5.8 改动最大的地方。旧版的 `SetChatButtons` / `OnChatButtonClicked` / `SetupShop` 全部被替换。

## RegisterChatButtons（注册对话按钮）

不过在创建商店之前，我们首先需要给他设置一下**对话按钮**，不然和他对话时就只有快乐和关闭按钮了

```csharp
// 商店名，AddShops 和 RegisterChatButtons 会用到
public const string ShopName = "Shop";
public override void RegisterChatButtons(NPCInteractionList interactions)
{
    // 添加商店按钮，参数是商店名
    interactions.Append(NPCInteractions.Shop(ShopName));
}
```

你可以给他加入第二个按钮，再写一个`Append` 就行，一个NPC的按钮最多只能存在 32 个，多出来的按钮不会显示。

```csharp
public override void RegisterChatButtons(NPCInteractionList interactions)
{
    // 添加商店按钮，参数是商店名
    interactions.Append(NPCInteractions.Shop(ShopName));
    interactions.Append(xxxx);
}
```

我们可以通过`NPCInteractions`的`Shop`方法快速创建商店按钮，除了商店，我们还可以创建其他类型的按钮。但`Append` 要求提供的 `NPCInteraction` 是抽象类，我们必须写一个子类继承它。

（我没有打错字，它们真叫`NPCInteractions`和`NPCInteraction`）

## 继承 NPCInteraction（自定义按钮逻辑）

简单的自定义按钮：

```csharp
public class AwesomeifyButton : NPCInteraction
{
    // 判断按钮什么时候显示，这里让他常驻显示
    public override bool Condition() => true; 

    // 感叹号，返回 true 时按钮旁边显示一个感叹号
    public override bool ShowExclamation => true; 
     
    // 按钮文本，暂时硬编码
    public override string GetText() => "你别点我"; 

    // 点击逻辑
    public override void Interact()
    {
        // 聊天面板中显示的文本。
        Main.npcChatText = "你点了我！";  // 点击后显示的对话
    }

    // 按钮扩展，如果设置为true，则在按钮右侧添加硬币计数器显示。
    public override bool TryAddCoins(ref Color chatColor, out int coinValue)
    {
        // coinValue 显示的硬币值。该值可以自定义修改，并且为负也可以正确显示
        // chatColor 按钮的颜色
        return base.TryAddCoins(ref chatColor, out coinValue);
    }
}
```

`NPCInteraction` 里还有几个方便的属性，在任何方法里可以直接用：

- `LocalPlayer`：当前和 NPC 对话的玩家

- `TalkNPC`：当前对话的 NPC 实例

- `TalkNPCType`：当前对话的 NPC 类型 ID

## AddShops（添加商品）

好了，现在我们有一个自定义按钮和一个开启商店的按钮了，不过我们光有按钮可不行，我们得给商店加商品

```csharp
public override void AddShops()
{
    // 获取这个城镇 NPC 的 名字叫 Shop 的商店
    var npcShop = new NPCShop(Type, ShopName)

        // 常驻商品
        .Add(ItemID.StarCloak)
        // 只在夜晚贩卖
        .Add(ItemID.AcornAxe, Condition.TimeNight)

        .Add(new Item(ItemID.MagicDagger)
        {
            // 自定义货币 ID 没有默认铜币
            // shopSpecialCurrency

            // 单价
            shopCustomPrice = Item.buyPrice(0, 5, 0, 0),  // 5 金币
            // 自定义物品颜色
            color = new Color(255, 0, 0)
        })

        // 还可以直接打类名
        .Add<DemoGun>();

    // 保存并加载
    npcShop.Register();
}
```

### 上架物品与价格

代码里面的 `NPCShop` 和合成表一样，使用的是链式调用，`Add().` 后面接 `Add()` 可以一直 `.` 下去。`Add()` 方法可以直接加原版物品 ID，也可以添加 ModItem 类型，加个`<>`还可以直接打模组物品的类名，非常好使。我们往`Add()`里面放入的商品价值一般都是默认价格，想要修改价格的话，可以创建一个物品实例

```csharp
.Add(new Item(ItemID.MagicDagger)
        {
            // 自定义货币 ID 没有默认铜币
            // shopSpecialCurrency

            // 单价
            shopCustomPrice = Item.buyPrice(0, 5, 0, 0),  // 5 金币
            // 自定义物品颜色
            color = new Color(255, 0, 0)
        })
```

`shopCustomPrice` 是从商店里买这个物品的钱，不会影响物品本身的价值，比如你可以花一个金币买一个泥土，但是你关闭商店以后，泥土又会变成不值钱。

### 贩卖条件（可跳过）

`Add()` 的第二个参数是 `params Condition[]`，可以传任意多个条件，**全部满足**才会上架商品，教程里给出几类条件

#### 常用条件

```csharp
时间
Condition.TimeNight   // 夜晚（!Main.dayTime）
Condition.TimeDay     // 白天（Main.dayTime）
Condition.NightOrEclipse  // 夜晚或日食

生物群系
Condition.InCorrupt      // 腐化
Condition.InCrimson      // 猩红
Condition.InHallow       // 神圣
Condition.InJungle       // 丛林
Condition.InSnow         // 雪原
Condition.InDesert       // 沙漠
Condition.InDungeon      // 地牢
Condition.InGraveyard    // 墓地
Condition.InUnderworld   // 地狱（等价 InUnderworldHeight）

难度 / 世界
Condition.InExpertMode   // 专家
Condition.InMasterMode   // 大师
Condition.Hardmode       // 困难模式
Condition.PreHardmode    // 肉前
Condition.CrimsonWorld   // 猩红世界
Condition.CorruptWorld   // 腐化世界
```

#### boss相关

```csharp
// Boss 击杀：已击杀 
Condition.DownedKingSlime          // 史莱姆王已击杀（NPC.downedSlimeKing）
Condition.DownedEyeOfCthulhu       // 克苏鲁之眼已击杀（NPC.downedBoss1）
Condition.DownedEowOrBoc           // 世界吞噬者或克苏鲁之脑已击杀（NPC.downedBoss2，不区分世界类型）
Condition.DownedEaterOfWorlds      // 世界吞噬者已击杀（downedBoss2 且非猩红世界）
Condition.DownedBrainOfCthulhu     // 克苏鲁之脑已击杀（downedBoss2 且猩红世界）
Condition.DownedQueenBee           // 蜂后已击杀（NPC.downedQueenBee）
Condition.DownedSkeletron          // 骷髅王已击杀（NPC.downedBoss3）
Condition.DownedDeerclops          // 独眼巨鹿已击杀（NPC.downedDeerclops）
Condition.DownedQueenSlime         // 史莱姆皇后已击杀（NPC.downedQueenSlime）
Condition.DownedEarlygameBoss      // 任一早期 Boss 已击杀（史王/眼/世吞或脑/骷髅王/蜂后/巨鹿任一，或已进入困难模式）
Condition.DownedMechBossAny        // 任一机械 Boss 已击杀（NPC.downedMechBossAny）
Condition.DownedTwins              // 双子魔眼已击杀（NPC.downedMechBoss2）
Condition.DownedDestroyer          // 毁灭者已击杀（NPC.downedMechBoss1）
Condition.DownedSkeletronPrime     // 机械骷髅王已击杀（NPC.downedMechBoss3）
Condition.DownedMechBossAll        // 三个机械 Boss 全部已击杀（1、2、3 三个标志都 true）
Condition.DownedPlantera           // 世纪之花已击杀（NPC.downedPlantBoss）
Condition.DownedEmpressOfLight     // 光之女皇已击杀（NPC.downedEmpressOfLight）
Condition.DownedDukeFishron        // 猪龙鱼公爵已击杀（NPC.downedFishron）
Condition.DownedGolem              // 石巨人已击杀（NPC.downedGolemBoss）
Condition.DownedMourningWood       // 哀木已击杀（NPC.downedHalloweenTree）
Condition.DownedPumpking           // 南瓜王已击杀（NPC.downedHalloweenKing）
Condition.DownedEverscream         // 常青尖叫树已击杀（NPC.downedChristmasTree）
Condition.DownedSantaNK1           // 圣诞坦克已击杀（NPC.downedChristmasSantank）
Condition.DownedIceQueen           // 冰雪女王已击杀（NPC.downedChristmasIceQueen）
Condition.DownedCultist            // 拜月教邪教徒已击杀（NPC.downedAncientCultist）
Condition.DownedMoonLord           // 月亮领主已击杀（NPC.downedMoonlord）
Condition.DownedClown              // 小丑已击杀（NPC.downedClown）
Condition.DownedGoblinArmy         // 哥布林入侵已击败（NPC.downedGoblins）
Condition.DownedPirates            // 海盗入侵已击败（NPC.downedPirates）
Condition.DownedMartians           // 火星人入侵已击败（NPC.downedMartians）
Condition.DownedFrostLegion        // 霜月事件已击败（NPC.downedFrost）
Condition.DownedSolarPillar        // 日耀柱已击败（NPC.downedTowerSolar）
Condition.DownedVortexPillar       // 星旋柱已击败（NPC.downedTowerVortex）
Condition.DownedNebulaPillar       // 星云柱已击败（NPC.downedTowerNebula）
Condition.DownedStardustPillar     // 星尘柱已击败（NPC.downedTowerStardust）
Condition.DownedOldOnesArmyAny     // 撒旦军队任意难度已击败（DD2Event.DownedInvasionAnyDifficulty）
Condition.DownedOldOnesArmyT1      // 撒旦军队 T1 已击败（DD2Event.DownedInvasionT1）
Condition.DownedOldOnesArmyT2      // 撒旦军队 T2 已击败（DD2Event.DownedInvasionT2）
Condition.DownedOldOnesArmyT3      // 撒旦军队 T3 已击败（DD2Event.DownedInvasionT3）

// Boss 击杀：未击杀（每个 Downed 都有对应的 Not 版本）
Condition.NotDownedKingSlime         // 史莱姆王未击杀（!NPC.downedSlimeKing）
Condition.NotDownedEyeOfCthulhu      // 克苏鲁之眼未击杀（!NPC.downedBoss1）
....
```

#### 事件相关

```csharp
// 节日 / 季节事件 
Condition.Christmas          // 圣诞节期间（Main.xMas）
Condition.Halloween          // 万圣节期间（Main.halloween）
Condition.BirthdayParty      // 生日派对进行中（BirthdayParty.PartyIsUp）
Condition.LanternNight       // 灯笼夜进行中（LanternNight.LanternsUp）

// 战斗 / 天象事件 
Condition.BloodMoon          // 血月进行中（Main.bloodMoon）
Condition.NotBloodMoon       // 血月未进行（!Main.bloodMoon）
Condition.Eclipse            // 日食进行中（Main.eclipse）
Condition.NotEclipse         // 日食未进行（!Main.eclipse）
Condition.EclipseOrBloodMoon // 血月或日食任一进行（Main.bloodMoon || Main.eclipse）
Condition.NotEclipseAndNotBloodMoon // 血月和日食都没进行（!bloodMoon && !eclipse）

// 天气事件 
Condition.Thunderstorm       // 雷暴进行中（Main.IsItStorming）
Condition.HappyWindyDay      // 快乐大风天（Main.IsItAHappyWindyDay）
Condition.InRain             // 玩家身处下雨区域（Main.LocalPlayer.ZoneRain）
Condition.InSandstorm        // 玩家身处沙尘暴区域（Main.LocalPlayer.ZoneSandstorm）

// 其他事件 
Condition.InOldOneArmy       // 玩家身处撒旦军队事件中（Main.LocalPlayer.ZoneOldOneArmy）
Condition.BloodMoonOrHardmode // 血月或困难模式（Main.bloodMoon || Main.hardMode）
Condition.NightOrEclipse     // 夜晚或日食（!Main.dayTime || Main.eclipse）
```

#### 月相条件

```csharp
// 单个月相（精确匹配）
Condition.MoonPhaseFull             // 满月（MoonPhase.Full）
Condition.MoonPhaseWaningGibbous    // 亏凸月（ThreeQuartersAtLeft）
Condition.MoonPhaseThirdQuarter     // 下弦月（HalfAtLeft）
Condition.MoonPhaseWaningCrescent   // 残月（QuarterAtLeft）
Condition.MoonPhaseNew              // 新月（MoonPhase.Empty）
Condition.MoonPhaseWaxingCrescent   // 娥眉月（QuarterAtRight）
Condition.MoonPhaseFirstQuarter     // 上弦月（HalfAtRight）
Condition.MoonPhaseWaxingGibbous    // 盈凸月（ThreeQuartersAtRight）

// 按月相 / 2 分组（每 2 个一组，共 4 组）
Condition.MoonPhasesQuarter0        // moonPhase / 2 == 0（满月、亏凸月）
Condition.MoonPhasesQuarter1        // moonPhase / 2 == 1（下弦月、残月）
Condition.MoonPhasesQuarter2        // moonPhase / 2 == 2（新月、娥眉月）
Condition.MoonPhasesQuarter3        // moonPhase / 2 == 3（上弦月、盈凸月）

// 按月相 / 4 分组（每 4 个一组，共 2 组）
Condition.MoonPhasesHalf0           // moonPhase / 4 == 0（满月到残月）
Condition.MoonPhasesHalf1           // moonPhase / 4 == 1（新月到盈凸月）

// 奇偶分组 
Condition.MoonPhasesEven            // 偶数月相（moonPhase % 2 == 0）
Condition.MoonPhasesOdd             // 奇数月相（moonPhase % 2 == 1）
Condition.MoonPhasesEvenQuarters    // 偶数季度（moonPhase / 2 % 2 == 0）
Condition.MoonPhasesOddQuarters     // 奇数季度（moonPhase / 2 % 2 == 1）

// 接近满月 / 新月 
Condition.MoonPhasesNearFull        // 接近满月（moonPhase == 7 或 <= 1）
Condition.MoonPhasesNearNew         // 接近新月（moonPhase 3~5）

// 按月相 % 4 分组 
Condition.MoonPhases04              // moonPhase % 4 == 0
Condition.MoonPhases15              // moonPhase % 4 == 1
Condition.MoonPhases26              // moonPhase % 4 == 2
Condition.MoonPhases37              // moonPhase % 4 == 3

// 指定两个相邻月相 
Condition.MoonPhases12              // moonPhase == 1 或 2
Condition.MoonPhases35              // moonPhase == 3 或 5
Condition.MoonPhases67              // moonPhase == 6 或 7
```

 ~~*好多WC 整理累死我了*~~ 

#### 带参数的条件（工厂方法）

不是所有条件都是静态字段，有些是**方法**，调用时会传参生成新 `Condition`

```csharp
Condition.PlayerCarriesItem(ItemID.StarCloak)   // 玩家携带某物品
Condition.NpcIsPresent(NPCID.Guide)             // 某 NPC 在场
Condition.GolfScoreOver(1000)                   // 高尔夫分数超过
Condition.AnglerQuestsFinishedOver(10)          // 渔夫任务完成数
Condition.BestiaryFilledPercent(50)             // 图鉴完成度
Condition.CurrentPriceAdjustmentOver(0.9f)      // 当前价格调整系数
```

前面几个都简单易懂，`CurrentPriceAdjustmentOver`重点讲一下。这个方法判断的是当前玩家的价格系数是否大于等于传入的数值。举个例子：

```csharp
// 规矩不能坏，贵是贵了点用着不烧心，先把规矩立住，路才能越走越宽
shop.Add(new Item(ItemID.SomeItem) {
    shopCustomPrice = ...,
    // 只有当价格系数 >= 1.0（也就是原价或更贵）时才卖这个物品
    Condition = Condition.CurrentPriceAdjustmentOver(1.0f) 
});
```

- 如果玩家幸福度很高，价格系数是 `0.8`（打折），`0.8 >= 1.0` 为 **false**，这个物品**不卖**。

- 如果玩家被讨厌，价格系数是 `1.2`（涨价），`1.2 >= 1.0` 为 **true**，这个物品**就卖**。

  

  这些方法内部用 `Language.GetText(...).WithFormatArgs(...)` 生成带参数的描述文字，所以显示给玩家的条件说明会带上具体数值，不需要我们汉化。

#### 自定义条件

其实`Condition` 的构造函数接收一个本地化 key 和一个 `Func<bool>`：

```csharp
public static Condition MyCondition = new Condition(
    "Mods.CosmicWeaver.Conditions.MyCondition",
    () => Main.dayTime && Main.LocalPlayer.statLifeMax > 200
);
```

在 `AddShops` 里直接用：

```csharp
npcShop.Add(ItemID.StarCloak, MyCondition);
```

本地化文件里加：

```csharp
{
    "Conditions": {
        "MyCondition": "白天且最大生命值超过 200"
    }
}
```

就可以制作我们的自定义条件了

#### 组合条件

不仅如此 `params Condition[]` 可以传任意多个条件，**全部满足**才上架

```csharp
// 夜晚 + 困难模式 + 专家模式
npcShop.Add(ItemID.StarCloak, Condition.TimeNight, Condition.Hardmode, Condition.InExpertMode);
```

不过`params Condition[]` 没有内置的“或”逻辑。如果你需要“A 或 B”这种同时满足一种的条件，只能自定义条件了：

```csharp
public static Condition NightOrBloodMoon = new Condition(
    "Mods.CosmicWeaver.Conditions.NightOrBloodMoon",
    () => !Main.dayTime || Main.bloodMoon
);
```

---

# NPC 攻击

终于！一个能和你聊天以及做~~PY~~交易的NPC做好了！

时间转到晚上，从你的小镇的某间房子里传来一声惨叫......

哦不！！我们的苦力怕被怪物杀死了！这种情况经常出现（经常出现吗？），我们的对策是什么？加厚防御和血量？不！我们要赋予这个NPC**还击**的能力：

```csharp
// 攻击力和击退
public override void TownNPCAttackStrength(ref int damage, ref float knockback)
{
    //设置该NPC的近战/抛射物伤害和击退（取决于NPC攻击类型）
    damage = 36;
    knockback = 3f;
}

// 攻击冷却
// 实际冷却 >= cooldown 且 < cooldown + randExtraCooldown
public override void TownNPCAttackCooldown(ref int cooldown, ref int randExtraCooldown)
{
    //间隔的算法：实际间隔会大于或等于cooldown的值且总是小于cooldown+randExtraCooldown的总和（TR总整这些莫名其妙的玩意）
    cooldown = 30;
    randExtraCooldown = 30;
}
```

城镇 NPC 的还击，攻击方式取决于 `NPCID.Sets.AttackType`。四种攻击类型对应不同的攻击钩子。

## 发射弹幕设置（投掷者，射手，法师)

这三种类型都使用 `TownNPCAttackProj` 和 `TownNPCAttackProjSpeed` 方法进行攻击。如果你的NPC是近战型，就算加了这些，他也打不出弹幕来。

```csharp
// 弹幕类型和发射延迟
public override void TownNPCAttackProj(ref int projType, ref int attackDelay)
{
    projType = ProjectileID.TopazBolt;
    attackDelay = 1;
}

// 弹幕速度相关
public override void TownNPCAttackProjSpeed(ref float multiplier, ref float gravityCorrection, ref float randomOffset)
{
    multiplier = 15f;          // 弹幕射速
    gravityCorrection = 0f;    // 重力修正
    randomOffset = 5f;         // 攻击精准度，越低越准
}
```

## 手持武器（射手专属）

```csharp
// 手持武器 默认为空气
public override void DrawTownAttackGun(ref Texture2D item, ref Rectangle itemFrame, ref float scale, ref int horizontalHoldoutOffset)
{
    // 手持武器类型，这个是物品id，必须有相关物品才能应用
    // Item是Texture2D形式 但我不清楚为什么又要传id，又要传图
    Main.GetItemDrawFrame(ItemID.StarCannon, out item, out itemFrame);
    // 大小
    scale = 1f;
    // 武器更接近NPC(以像素为单位, 数字越大离NPC越近, 当武器位置不对时调整)
    horizontalHoldoutOffset = 18;
}
```

## 挥动武器（战士专属）

```csharp
// 挥动武器的实际大小
public override void TownNPCAttackSwing(ref int itemWidth, ref int itemHeight)
{
    itemWidth = 50;
    itemHeight = 50;
}

// 绘制挥动的武器 默认为铁剑
public override void DrawTownAttackSwing(ref Texture2D item, ref Rectangle itemFrame, ref int itemSize, ref float scale, ref Vector2 offset)
{
    // 破坏者大剑
    Main.GetItemDrawFrame(ItemID.BreakerBlade, out item, out itemFrame);
    itemSize = 50;
    scale = 1f;
}
```

注意，`DrawTownAttackSwing` **绘制挥动的武器** 里面的

-  **`itemSize`** 代表着武器判定框的尺寸，但实际上它主要影响挥砍动画的“范围”或“进度”计算，而非屏幕上的实际显示大小。

- **`scale` **影响着挥砍**弧线**与 NPC 的距离，而不是武器本身的缩放大小。设为 `0` 会让挥砍紧贴 NPC 身体，设为 `0.15f` 则会让弧线稍微靠前一些。

- **`offset` **可以用来调整武器绘制位置的偏移量。常用于让武器看起来像是握在 NPC 的“手”上（注意 Y 轴正方向向下）。

## 魔法光环（法师类专属）

```csharp
public override void TownNPCAttackMagic(ref float auraLightMultiplier)
{
    // 魔法光环的照明范围，最多起装饰作用（选带项）
    auraLightMultiplier = 2f;
}
```

*只有发光吗？哈基法，你好废*

好的！这样一来，这个NPC就拥有了作战能力，他可以自己保护自己了！我们粘贴代码，进入世界，然后放一点怪物：

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/E4N6VDZKABADY?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkU0TjZWRFpLQUJBRFkiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDQ5LCJoZWlnaHQiOjMyM30)

后续苦力怕被木乃伊杀死了，死因是攻击速度过慢，弹道乱飞，反射弧过长

………..

(╯‵□′)╯︵┻━┻

---

# **展示我们的城镇 NPC**

我们先看看这个NPC做成啥样了吧：

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/XK67HDZKADADE?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlhLNjdIRFpLQURBREUiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjYyLCJoZWlnaHQiOjE4NH0)

*一只叫\*\*怪 的苦力怕*

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/HLDPJDZKADADE?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkhMRFBKRFpLQURBREUiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NzI5LCJoZWlnaHQiOjE5OX0)

*聊天，以及我们添加的商店按钮*

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/UOEPLDZKABQFA?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlVPRVBMRFpLQUJRRkEiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTgyLCJoZWlnaHQiOjM4MH0)

***神秘红色刀***

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/TCSPNDZKADAGM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlRDU1BORFpLQURBR00iLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjA4LCJoZWlnaHQiOjIzMH0)

*进攻！！（*~~*打的真“准”*~~*）*

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/YP5PPDZKADQHC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IllQNVBQRFpLQURRSEMiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDY2LCJoZWlnaHQiOjI2Nn0)

*派对*

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/NAL7TDZKABQDK?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik5BTDdURFpLQUJRREsiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzcwLCJoZWlnaHQiOjI1OX0)

*（*~~*帽子怎么戴的啊喂！*~~*）*

这就是我们的苦力怕，一个城镇NPC做好了！

---

## **一些有用的小提示**

上面那些关于NPC攻击设置函数并非只能填写固有内容，**TownNPCAttackProj**表示的是当**这个NPC发射弹幕时的状态**，既然都发射弹幕了嘛，你可以在里面写一些奇奇怪怪的东西

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/GTB75DZKADADE?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkdUQjc1RFpLQURBREUiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTgxLCJoZWlnaHQiOjMwMX0)

*复刻棱镜*

在 `TownNPCAttackProj` 里设置NPC发射弹幕的方式，这样还可以忽略`TownNPCAttackProjSpeed`即使近战NPC无法使用`TownNPCAttackProj`，我们还是可以在`TownNPCAttackSwing`里动手脚

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/QFPATEBKADQDO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlFGUEFURUJLQURRRE8iLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTAzNiwiaGVpZ2h0IjozNTJ9)

~~食我泰拉刃杂修！~~

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/ARAQ5EBKAAQE2?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkFSQVE1RUJLQUFRRTIiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6OTIxLCJoZWlnaHQiOjM3M30)

好吧，电流涌动不行，这个是绑定玩家的

更多拓展：你可以在PreAI或者PreDraw这块对NPC动手脚以进行更自由的编辑，这些都在前面的教程中提到过，当然，别忘了维持原有的行为。

---

# 本地化

终于把这一大坨给写完了，不过我们还有本地化文本要做

### 自带文本

我们打开本地化文件，翻到我们的城镇NPC会看见......

```csharp
TestNPC: {
        DisplayName: Test N P C

        TownNPCMood: {
            Content: I am content.
            NoHome: I hate not having a home.
            FarFromHome: I am too far from home.
            LoveSpace: I love having so much space.
            DislikeCrowded: I dislike how crowded I am.
            HateCrowded: I hate how crowded I am.
            LoveBiome: I love {BiomeName}.
            LikeBiome: I like {BiomeName}.
            DislikeBiome: I dislike {BiomeName}.
            HateBiome: I hate {BiomeName}.
            LoveNPC: I love {NPCName}.
            LikeNPC: I like {NPCName}.
            DislikeNPC: I dislike {NPCName}.
            HateNPC: I hate {NPCName}.
            LikeNPC_Princess: I like {NPCName}.
            Princess_LovesNPC: I love {NPCName}.
        }
    }
```

我去，好长一坨

没事，我们一个个分析，

这里的`DisplayName` 填的是职业名。比如 **向导** 的职业是 **向导**  ~~（那我问你，那我问你）~~,他的名字可能叫 **科林** 。关于NPC的名字如何注册，我们上面已经介绍过了，这里不再重复。

而 `TownNPCMood`是城镇 NPC 的 **快乐报告本地化文本** 。当玩家点击 NPC 对话窗口里的“快乐”按钮时，游戏会根据 NPC 当前的快乐状态，从这一组文本里挑对应的句子显示。



以下是完整的 `TownNPCMood` 名称与台词：

```csharp
TestNPC: {
        DisplayName: 苦力怕

        TownNPCMood: {
            Content: SSS(还行吧，至少没被炸。)
            NoHome: SSS(没有家……我随时可能爆炸。)
            FarFromHome: SSS(离家太远了，我有点不安。)
            LoveSpace: SSS(好宽敞！我可以随便走来走去。)
            DislikeCrowded: SSS(有点挤……别靠我太近。)
            HateCrowded: SSS(太挤了！我要炸了！)
            LoveBiome: SSS(我太爱{BiomeName}了！)
            LikeBiome: SSS({BiomeName}还不错。)
            DislikeBiome: SSS(我不太喜欢{BiomeName}。)
            HateBiome: SSS(我恨{BiomeName}，这里让我烦躁。)
            LoveNPC: SSS(我最喜欢{NPCName}了！)
            LikeNPC: SSS({NPCName}人还不错。)
            DislikeNPC: SSS(我不太喜欢{NPCName}。)
            HateNPC: SSS(我讨厌{NPCName}，别让他靠近我。)
            LikeNPC_Princess: SSS(公主殿下人真好。)
            Princess_LovesNPC: SSS(我喜欢{NPCName}。)
        }
    }
```

### 修改硬编码（可跳过）

本地化教程里教过怎么用 `Language.GetTextValue` 获取键值、转成字符串，更多本地化方法的具体用法可以参考[模组本地化指南 基础篇.otl](https://www.kdocs.cn/l/cgxBqiHxMrpn?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1NjYyNDU1NTM2NDEiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2d4QnFpSHhNcnBuIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU3MjY1MDAyOTUyNiJ9)教程。

我们的本地化内容可以直接嵌套进 NPC 的本地化分类里，比如：

```csharp
// Mods 必带
Language.GetTextValue("Mods.你的模组名字.NPCs.TestNPC.你的键名"),
```

我们需要修改

```csharp
  public override List<string> SetNPCNameList()
  {
      return new List<string>()
      {
          // 原文："苦力怕"
          Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name1"),
          // 原文："爬行者"
          Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name2"),
          // 原文："jj怪"
          Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name3")
      };
  }
```

```csharp
public override string GetChat()
{
    WeightedRandom<string> chat = new WeightedRandom<string>();

    // 无家可归时
    if (NPC.homeless)
    {
        // chat.Add("SSSS（我想我们已经认识对方了，所以....能给个住的地方吗？）");
        chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Homeless"));
    }
    else
    {
        // chat.Add("SS（你好！）");
        chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Greeting"));
    }

    // 日食时
    if (Main.eclipse)
    {
        // chat.Add("SSS（我相信你可以挺过去！)");
        chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Eclipse"));
    }

    // 血月时
    if (Main.bloodMoon)
    {
        // chat.Add("SSSS！SSSSSSSS！！)");
        chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.BloodMoon"));
    }

    return chat;
}
```

```csharp
// 按钮类
public class AwesomeifyButton : NPCInteraction
{
    public override bool Condition() => true;

    // 原文："SS（你别点我）"
    public override string GetText() => Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Button.Awesomeify");
    public override bool ShowExclamation => true;

    public override bool TryAddCoins(ref Color chatColor, out int coinValue)
    {
        return base.TryAddCoins(ref chatColor, out coinValue);
    }

    public override void Interact()
    {
        // 原文："SS（你点了我！）"
        Main.npcChatText =  Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Button.Awesomeify_Interact");
    }
}
```

本地化里写：

```csharp
TestNPC: {
        DisplayName: 苦力怕

        TownNPCMood: {
            Content: SSS(还行吧，至少没被炸。)
            NoHome: SSS(没有家……我随时可能爆炸。)
            FarFromHome: SSS(离家太远了，我有点不安。)
            LoveSpace: SSS(好宽敞！我可以随便走来走去。)
            DislikeCrowded: SSS(有点挤……别靠我太近。)
            HateCrowded: SSS(太挤了！我要炸了！)
            LoveBiome: SSS(我太爱{BiomeName}了！)
            LikeBiome: SSS({BiomeName}还不错。)
            DislikeBiome: SSS(我不太喜欢{BiomeName}。)
            HateBiome: SSS(我恨{BiomeName}，这里让我烦躁。)
            LoveNPC: SSS(我最喜欢{NPCName}了！)
            LikeNPC: SSS({NPCName}人还不错。)
            DislikeNPC: SSS(我不太喜欢{NPCName}。)
            HateNPC: SSS(我讨厌{NPCName}，别让他靠近我。)
            LikeNPC_Princess: SSS(公主殿下人真好。)
            Princess_LovesNPC: SSS(我喜欢{NPCName}。)
        }

        SetNPCNameList: {
            Name1: 苦力怕
            Name2: 爬行者
            Name3: jj怪
        }

        Chat: {
            Homeless: '''SSSS（我想我们已经认识对方了，所以....能给个住的地方吗？）'''
            Greeting: SS（你好！）
            Eclipse: SSS（我相信你可以挺过去！)
            BloodMoon: SSSS！SSSSSSSS！！
        }

        Button: {
            Awesomeify: SS（你别点我）
            Awesomeify_Interact: SS（你点了我！）
        }
    }
```

英文版：

```csharp
TestNPC: {
    DisplayName: Creeper

    TownNPCMood: {
        Content: SSS (Not bad, at least I haven't been blown up.)
        NoHome: SSS (No home... I could explode at any moment.)
        FarFromHome: SSS (Too far from home, I feel a bit uneasy.)
        LoveSpace: SSS (So spacious! I can walk around freely.)
        DislikeCrowded: SSS (A bit cramped... don't get too close to me.)
        HateCrowded: SSS (Too crowded! I'm going to blow!)
        LoveBiome: SSS (I love {BiomeName} so much!)
        LikeBiome: SSS ({BiomeName} is not bad.)
        DislikeBiome: SSS (I don't really like {BiomeName}.)
        HateBiome: SSS (I hate {BiomeName}, this place makes me restless.)
        LoveNPC: SSS (I like {NPCName} the most!)
        LikeNPC: SSS ({NPCName} is a decent one.)
        DislikeNPC: SSS (I don't really like {NPCName}.)
        HateNPC: SSS (I hate {NPCName}, don't let them get near me.)
        LikeNPC_Princess: SSS (Her Highness the Princess is so kind.)
        Princess_LovesNPC: SSS (I like {NPCName}.)
    }

    SetNPCNameList: {
        Name1: Creeper
        Name2: Crawler
        Name3: JJ Monster
    }

    Chat: {
        Homeless: '''SSSS (I think we already know each other, so... could you give me a place to stay?)'''
        Greeting: SS (Hello!)
        Eclipse: SSS (I believe you can get through this!)
        BloodMoon: SSSS! SSSSSSSS!!
    }

    Button: {
        Awesomeify: SS (Don't click me)
        Awesomeify_Interact: SS (You clicked me!)
    }
}
```

---

### 完整代码

我们把上面所有介绍过的片段拼起来，就是一份可直接编译的城镇 NPC：

```csharp
using DemoMod.Content.Items;
using Microsoft.Xna.Framework;
using Microsoft.Xna.Framework.Graphics;
using System.Collections.Generic;
using Terraria;
using Terraria.Enums;
using Terraria.GameContent;
using Terraria.GameContent.Bestiary;
using Terraria.GameContent.Personalities;
using Terraria.ID;
using Terraria.Localization;
using Terraria.ModLoader;
using Terraria.Utilities;

namespace DemoMod.Content.NPCs.TownNPCs
{
    // [AutoloadHead] 会自动加载小地图图标
    // 图标名字为：类名 + "_Head"（比如 TestNPC_Head）
    [AutoloadHead]
    public class TestNPC : ModNPC
    {
        #region 配置NPC贴图

        // 微光形态的 Head 槽位。在 Load() 里注册后保存下来，之后构建 NPCProfile 时要用到。
        private static int ShimmerHeadIndex;

        // NPC 的贴图配置，用来存放普通形态、微光形态等不同变体的贴图。
        private static Profiles.StackedNPCProfile NPCProfile;
        public override void Load()
        {
            // 必须在 Load() 里注册，不能在 SetStaticDefaults 里。
            // 贴图路径为 Texture + "_Shimmer_Head"。
            ShimmerHeadIndex = Mod.AddNPCHeadTexture(Type, Texture + "_Shimmer_Head");
        }

        /// <summary>
        /// 设置 NPC 的贴图配置，包含普通形态和微光形态。
        /// </summary>
        private void SetupNPCProfile()
        {
            // 开启微光形态。没有这一行，NPC 碰到微光只会像普通敌怪一样变透明，不会切换成 _Shimmer 贴图。
            NPCID.Sets.ShimmerTownTransform[Type] = true;

            // 注册该 NPC 的“详细头像”（Detailed Portrait）。
            // 图片大小最大是200×200，但是原版的贴图都是只画120左右然后居中的，具体图例可以看原版的文件参考
            NPCID.Sets.NPCPortraits.Add
            (

                // 创建一个“优先级头像提供器”
                Type, NPCID.Sets.PrioritizedPortrait()

                // 添加一个 With “有条件”的头像。
                // 条件：ShimmeredPortraitCondition 当 NPC 处于微光状态时为真。
                // 头像：BasicPortrait(贴图路径)  指定满足条件时使用的聊天大头像贴图。
                .With(
                NPCID.Sets.ShimmeredPortraitCondition,
                NPCID.Sets.BasicPortrait($"{Texture}_Shimmer_Portrait"))

                // 设置“默认头像”。
                // 当上面所有 .With() 的条件都不满足时（也就是 NPC 不在微光状态），就使用这个头像。路径对应普通形态的大头像贴图。
                .Default(NPCID.Sets.BasicPortrait($"{Texture}_Portrait"))
             );


            // 构建 NPC 的贴图配置。
            // 创建堆叠的贴图配置文件
            NPCProfile = new Profiles.StackedNPCProfile(

                // 普通形态：本体 + 普通 Head + 派对贴图
                new Profiles.DefaultNPCProfile(
                    Texture,                                // 本体贴图，例如 TestNPC.png
                    NPCHeadLoader.GetHeadSlot(HeadTexture), // 普通 Head 槽位，由 [AutoloadHead] 自动加载
                    null //Texture + "_Party"                      // 派对贴图，例如 TestNPC_Party.png
                ),

                // 微光形态：微光本体 + 微光 Head + 微光派对贴图
                new Profiles.DefaultNPCProfile(
                    Texture + "_Shimmer",                   // 微光本体，例如 TestNPC_Shimmer.png
                    ShimmerHeadIndex,                       // 微光 Head 槽位，在 Load() 里注册
                    null //Texture + "_Shimmer_Party"              // 微光派对贴图，例如 TestNPC_Shimmer_Party.png
                )
            );
        }
        #endregion

        // 传入配置贴图的方法
        public override ITownNPCProfile TownNPCProfile()
        {
            // 把上面配置好的 NPC 贴图给游戏，告诉游戏，我们的贴图在哪里可以找到
            return NPCProfile;
        }

        public override void SetStaticDefaults()
        {
            // 配置的 NPC 贴图
            SetupNPCProfile();

            // NPC 总共帧图数，一般为 16 + 额外帧 + 攻击帧 
            // 战士、投掷 = 25，射手 = 26，法师 = 23
            Main.npcFrameCount[Type] = 23;

            // 额外活动帧，一般为 9
            // 包括坐下、谈话等动作
            NPCID.Sets.ExtraFramesCount[Type] = 9;

            // 攻击帧，取决于攻击类型
            // 战士、投掷 = 4，射手 = 5，法师 = 2
            NPCID.Sets.AttackFrameCount[Type] = 2;

            // 巡敌范围，以像素为单位
            NPCID.Sets.DangerDetectRange[Type] = 700;

            // 攻击类型：0 = 投掷，1 = 射击，2 = 法师，3 = 战士
            NPCID.Sets.AttackType[Type] = 2;

            // 单次攻击持续时间，越短攻击越快
            NPCID.Sets.AttackTime[Type] = 90;

            // 遇敌攻击优先度，数值越大越会优先逃跑
            NPCID.Sets.AttackAverageChance[Type] = 30;

            // 派对帽的 Y 偏移
            NPCID.Sets.HatOffsetY[Type] = 4;

            //如果该NPC属于法师类，你可以加上这个来改变NPC的魔法光环颜色，这里用蓝色
            NPCID.Sets.MagicAuraColor[Type] = new Color(90, 90, 255);

            // 是否拥有微光形态没有这一行，NPC 碰到微光只会像普通敌怪一样变透明，不会切换成 _Shimmer 贴图。
            // 我们在SetupNPCProfile设置过了
            //NPCID.Sets.ShimmerTownTransform[Type] = true;
            // Bestiary 图鉴绘制参数 控制 NPC 在图鉴（Bestiary）里怎么显示
            NPCID.Sets.NPCBestiaryDrawModifiers drawModifiers = new NPCID.Sets.NPCBestiaryDrawModifiers()
            {
                Velocity = 1f,       // 让图鉴里的 NPC 假装在向右走
                Direction = 1,       // 让图鉴里的 NPC 面朝右
                Scale = 1.2f,        // 图鉴里放大 1.2 倍
                Rotation = 0.1f,     // 稍微转一点
                Position = new Vector2(0, -4)  // 往上偏 4 像素
            };

            NPCID.Sets.NPCBestiaryDrawOffset.Add(Type, drawModifiers);

            // 快乐系统：生物群系偏好 + 邻居偏好
            NPC.Happiness
            .SetBiomeAffection<ForestBiome>(AffectionLevel.Like)      // 喜欢森林：在森林里商店价格会便宜一点
            .SetBiomeAffection<SnowBiome>(AffectionLevel.Dislike)     // 不喜欢雪地：在雪地里商店价格会贵一点
            .SetBiomeAffection<DesertBiome>(AffectionLevel.Hate)      // 讨厌沙漠：在沙漠里商店价格会贵很多
            .SetBiomeAffection<JungleBiome>(AffectionLevel.Love)      // 最爱丛林：在丛林里商店价格会便宜很多

            .SetNPCAffection(NPCID.Dryad, AffectionLevel.Love)        // 最爱树妖：树妖住在附近时，商店价格便宜很多
            .SetNPCAffection(NPCID.Guide, AffectionLevel.Like)        // 喜欢向导：向导住在附近时，商店价格便宜一点
            .SetNPCAffection(NPCID.Merchant, AffectionLevel.Dislike)  // 不喜欢商人：商人住在附近时，商店价格贵一点
            .SetNPCAffection(NPCID.Demolitionist, AffectionLevel.Hate);// 讨厌爆破专家：爆破专家住在附近时，商店价格贵很多
        }
        public override void SetDefaults()
        {
            // 必带，标记为城镇 NPC
            NPC.townNPC = true;

            // 设置这个后NPC就不会在退出地图后消失了，你可以灵活运用一下
            NPC.friendly = true;

            // 是否为友方NPC（能伤害敌怪）如果你想写敌对NPC也行
            NPC.friendly = true;

            //碰撞箱
            NPC.width = 26;
            NPC.height = 48;

            // 城镇 NPC 的 AI
            // 必带项，如果你能自己写出城镇NPC的AI可以不带
            // PS:这个决定了NPC是否能入住房屋
            NPC.aiStyle = NPCAIStyleID.Passive;

            // 伤害，防御力，生命值（城镇NPC没有碰撞伤害）
            NPC.damage = 10;
            NPC.defense = 15;
            NPC.lifeMax = 250;

            // 受伤、死亡音效
            NPC.HitSound = SoundID.NPCHit1;
            NPC.DeathSound = SoundID.NPCDeath1;

            //抗击退性，数字越小抗性越高，0就是完全抗击退
            NPC.knockBackResist = 0.5f;

            // 套用原版 NPC 的动画
            // 投掷类用 NPCID.Merchant（25 帧）
            // 其他类型建议套用对应 成年男性NPC，防止“变形金刚”
            AnimationType = NPCID.Clothier;
        }
        public override bool CanTownNPCSpawn(int numTownNPCs)
        {
            // 条件：已拥有 3 个或以上城镇 NPC，且击败克苏鲁之眼
            if (numTownNPCs >= 3 && NPC.downedBoss1)
            {
                return true;
            }
            return false;
        }
        public override bool CheckConditions(int left, int right, int top, int bottom)
        {
            // 默认返回 true，表示接受普通房屋
            return true;
        }
        public override List<string> SetNPCNameList()
        {
            return new List<string>()
            {
                // 原文："苦力怕"
                Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name1"),
                // 原文："爬行者"
                Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name2"),
                // 原文："jj怪"
                Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.SetNPCNameList.Name3")
            };
        }
        // 当前名字
        private string originalName = null;
        public override bool PreAI()
        {
            // 保存原始名字
            if (originalName == null)
                originalName = NPC.GivenName;

            // 判断这个 NPC 是不是微光变体
            if (NPC.IsShimmerVariant)
                NPC.GivenName = "Dinnerbone";
            else
                NPC.GivenName = originalName;

            return base.PreAI();
        }

        public override string GetChat()
        {
            WeightedRandom<string> chat = new WeightedRandom<string>();

            // 无家可归时
            if (NPC.homeless)
            {
                // chat.Add("SSSS（我想我们已经认识对方了，所以....能给个住的地方吗？）");
                chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Homeless"));
            }
            else
            {
                // chat.Add("SS（你好！）");
                chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Greeting"));
            }

            // 日食时
            if (Main.eclipse)
            {
                // chat.Add("SSS（我相信你可以挺过去！)");
                chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.Eclipse"));
            }

            // 血月时
            if (Main.bloodMoon)
            {
                // chat.Add("SSSS！SSSSSSSS！！)");
                chat.Add(Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Chat.BloodMoon"));
            }

            return chat;
        }

        // 商店名，AddShops 和 RegisterChatButtons 会用到
        public const string ShopName = "Shop";
        public override void RegisterChatButtons(NPCInteractionList interactions)
        {
            // 添加商店按钮，参数是商店名
            interactions.Append(NPCInteractions.Shop(ShopName));
            interactions.Append(new AwesomeifyButton());
        }
        public override void AddShops()
        {
            // 获取这个城镇 NPC 的 名字叫 Shop 的商店
            var npcShop = new NPCShop(Type, ShopName)

                // 常驻商品
                .Add(ItemID.StarCloak)
                // 只在夜晚贩卖
                .Add(ItemID.AcornAxe, Condition.TimeNight)

                .Add(new Item(ItemID.MagicDagger)
                {
                    // 自定义货币 ID 没有默认铜币
                    // shopSpecialCurrency

                    // 单价
                    shopCustomPrice = Item.buyPrice(0, 5, 0, 0),  // 5 金币
                    // 自定义物品颜色
                    color = new Color(255, 0, 0)
                })

                // 还可以直接打类名
                .Add<DemoGun>();

            // 保存并加载
            npcShop.Register(); 
        }

        // 攻击力和击退
        public override void TownNPCAttackStrength(ref int damage, ref float knockback)
        {
            //设置该NPC的近战/抛射物伤害和击退（取决于NPC攻击类型）
            damage = 36;
            knockback = 3f;
        }

        // 攻击冷却
        // 实际冷却 >= cooldown 且 < cooldown + randExtraCooldown
        public override void TownNPCAttackCooldown(ref int cooldown, ref int randExtraCooldown)
        {
            //间隔的算法：实际间隔会大于或等于cooldown的值且总是小于cooldown+randExtraCooldown的总和（TR总整这些莫名其妙的玩意）
            cooldown = 30;
            randExtraCooldown = 30;
        }

        // 弹幕类型和发射延迟
        public override void TownNPCAttackProj(ref int projType, ref int attackDelay)
        {
            //使用黄玉法杖的弹幕
            projType = ProjectileID.TopazBolt;
            //NPC在出招后多长时间才会发射弹幕
            attackDelay = 1;
        }
        // 弹幕速度相关
        public override void TownNPCAttackProjSpeed(ref float multiplier, ref float gravityCorrection, ref float randomOffset)
        {
            multiplier = 15f;          // 弹幕射速
            gravityCorrection = 0f;    // 重力修正
            randomOffset = 5f;         // 攻击精准度，越低越准
        }
        public override void TownNPCAttackMagic(ref float auraLightMultiplier)
        {
            // 魔法光环的照明范围，最多起装饰作用（选带项）
            auraLightMultiplier = 2f;

        }
    }
    // 按钮类
    public class AwesomeifyButton : NPCInteraction
    {
        public override bool Condition() => true;

        // 原文："SS（你别点我）"
        public override string GetText() => Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Button.Awesomeify");
        public override bool ShowExclamation => true;

        public override bool TryAddCoins(ref Color chatColor, out int coinValue)
        {
            return base.TryAddCoins(ref chatColor, out coinValue);
        }

        public override void Interact()
        {
            // 原文："SS（你点了我！）"
            Main.npcChatText =  Language.GetTextValue("Mods.DemoMod.NPCs.TestNPC.Button.Awesomeify_Interact");
        }
    }
}
```

---

# 工具推荐

NPC 的贴图制作复杂且繁琐。好在社区里有一些工具，能帮我们解决其中很大一部分的问题。

### 角色外观导出Mod

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/UB6HJEBKAAQEY?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlVCNkhKRUJLQUFRRVkiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6ODAsImhlaWdodCI6ODB9)

[创意工坊链接&gt;&gt;](https://steamcommunity.com/sharedfiles/filedetails/?id=3819727454)

**角色外观导出Mod** 是一个泰拉瑞亚（tModLoader）模组，它的核心功能是：**把玩家当前的外观，导出成一张可以直接给 NPC 使用的竖排精灵图**。简单说，就是把你自己（包括装备、染色、外观）拍下来，做成一张 NPC 贴图素材。

### 角色创建预设Mod

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/7F7XTEBKADABW?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjdGN1hURUJLQURBQlciLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6ODAsImhlaWdodCI6ODB9)

[创意工坊链接&gt;&gt;](https://steamcommunity.com/sharedfiles/filedetails/?id=3493069544)

**角色创建预设 Mod** 是一个泰拉瑞亚（tModLoader）模组，它的核心功能是：**创建角色的时候，允许你直接为角色搭配时装，并且能保留自己的时装搭配。**简单说，就是把一套外观存成预设，下次建角色时直接套用。也可以把你的时装搭配分享给你的朋友们。



### Mornia-Cherry的工具集

![图片](http://www.kdocs.cn/api/v3/office/copy/WEJnYnI1M00xYlpTYUxTbWV4WkVQTVRLU2RlSnZvR25KelRDZFJXdXhWMWdDVnhyM0NIeFN6M0pBSnFQa2VCbmp0eEFFMkphRHNhSUVTL25aVk1ic3NHaGIxSlQyTzFXTFl5RXlKY01tZXdJR2o1TUJZTllrVXYwVDlCckNneFV5TWJNaHMyYzFOMEEybnNMYVltRUZneVBNUUhIVTNCeUFJV0FYSmFYWUZ3Mk9zNTBEaXlOeGZCMFBlcW56OWZleVdMVjYwMEdCWFpDRkcranMzTkNLNmt4S0hSUkRqdVBPSU9SVTBKRDBYRzFMVFBtUXlwcHlNVkJYY0ljTEUvbWF6SjRXSjAyNVpVPQ==/attach/object/XUBHFEBKACQGU?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlhVQkhGRUJLQUNRR1UiLCJvd25lciI6IjU3MjY1MDAyOTUyNiIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjYwLCJoZWlnaHQiOjE5NX0)

[跳转网页链接 &gt;&gt; ](https://trtool.yingtaoshu.org/)

**Mornia-Cherry的工具集** 是一个面向 泰拉瑞亚资源与模组工作流程的 工具集，它的核心功能涵盖：**贴图处理、特效编辑、装备帧生成、解包、xnb 编辑等**

---

# 结尾



好了，如何创建一个基础城镇NPC，就是这样了！你们都学废了么？（

不如我们来布置一点作业测试一下......（~~你连怎么布置都不会好吗~~）



### 作业

1做一个**法师类**城镇 NPC，入住条件是**击败骷髅王**。

2它卖**三个原版物品**，其中一个只在**困难模式**出售。

3它用**火球弹幕**攻击，攻击力 40。

4它**喜欢森林**，**讨厌商人**。

5它**没有微光形态**（把相关代码删掉）。



做完这个，你就算正式入门 1.4 城镇 NPC 了。\_(:з」∠)\_

---



*©2026 冬天的叶 &amp; 中学生 \| 仅供个人学习，禁止商用二次分发*

