作者：冬天的叶 2026/9/7 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

前面几节教程我们学习了物品的基础属性和合成方法。但ModItem的内容远不止这些，这一节我们来讲解Item的更多字段与方法，让你能创建各式各样的更加灵活、更有特色的武器。



在这个过程中，我希望同学们能学会：



**1 了解常用的 ModItem 方法**

**2 了解更多Mod物品的属性**

**3 对方法执行顺序有一个基本的认知**

**4 对比有返回值和没返回值的方法的区别**

---

# **更多Item字段与方法**

## **常用的 Item 字段**

### **1 Item.scale（物品缩放）**

首先是**Item.scale**，这个字段能控制物品在使用时显示的大小。类型为**float**默认为1，在原版游戏中被用来调整武器在玩家手中的视觉比例。数值越大物品看起来越大，越小越就小巧。

我们在之前的模板剑里设置个**Item.scale = 2;** 看看：

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/E2TUD2JJADAHQ?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkUyVFVEMkpKQURBSFEiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDkyLCJoZWlnaHQiOjM2MH0)

~~*哇奥，变大了*~~。

这个缩放影响的不仅仅是**视觉效果**，还会改变物品的碰撞箱与攻击范围。

这个字段在早期泰拉瑞亚技术还不成熟的时候被大量使用过（妖刀村正，武士刀等）后面技术成熟了，这些物品就被换成了与其碰撞箱相符的新贴图。

### **2 Item.mana（魔力消耗）**

这个字段控制着物品使用时消耗的魔力，类型为**int**默认为0。通常被用于魔法类武器。不过你愿意的话，让你的剑，稿子，甚至是喝的药水也消耗魔力。

### **3 Item.UseSound（自定义音效）**

类型为**SoundStyle？**(这个问号没打错，感兴趣的同学可以查查这个问号代表着什么) 

默认为SoundID.Item 没声音。通过**TML**提供的**SoundID** 可以使用原版的所有音效，对应的**ID**可以在 [这个Wiki页面](https://terraria.wiki.gg/zh/wiki/%E5%A3%B0%E9%9F%B3_ID)[ ](https://terraria.wiki.gg/zh/wiki/%E5%A3%B0%E9%9F%B3_ID)查看。如果原版的音效不够你用，可以使用new SoundStyle 加载自定义音效文件。

```csharp
Item.UseSound = new SoundStyle("你的模组内部名/放音效的文件夹/音效文件")
{
    //这里方便你理解，给在内容里填的中文，你要是真照抄我打死你！
    Volume = 0.9f,//音量，0f ~ 1f
    PitchVariance = 0.2f,//音调随机变化范围，让每次射击声音略有不同，更真实
    MaxInstances = 3,//最多同时播放的实例数，防止音效叠加过多
};
```

音效文件的格式支持wav，ogg和mp3理论上也支持 .xnb不过这个就是纯整活了，初学者不用管它。

### **4 Item.autoReuse（自动连击）**

这个字段控制着物品能不能被重复使用，类型为**bool**默认为**true** ，设置为**true** 时按住鼠标可以持续使用物品，不需要反复点击。魔镜，药水等特殊物品为 **false**

### **5 Item.channel（持续施法/长按检测）**

类型为**bool**默认为**false**，设为 **true** 时，物品会在玩家按住使用键的时候将**Player**里**channel** 设为的**true**。原版用其检测玩家有没有长按使用键，用来给弹幕**“蓄力”（棱镜）**或是**“引导”（魔法飞弹）**



我们试着在之前的模板剑里设置个**Item.channel = true;** 看看：

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/F6TUD2JJACAEU?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkY2VFVEMkpKQUNBRVUiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjA4LCJoZWlnaHQiOjQzMX0)



可以看到之前自顾自乱飞的魔法飞弹弹幕现在牢牢的贴合在我们的鼠标位置。

### **6 Item.maxStack（最大堆叠数）**

它的类型为**int**默认为9999，旧版本为1，因为新版本武器可以堆叠了，所以变为9999。还有**Item.stack（具体堆叠数）**它显示的是当前武器的堆叠数量，这个字段不能被基础设置，它被用于在方法里动态修改。

### **7 工具类字段**

**Item.pick（镐力）Item.axe（斧力）**

**Item.hammer（锤力） Item.tileBoost（范围加成）**



这几个字段属于**“挖掘/建筑工具”**字段，它们的类型为**int**默认为0，**注意稿力和锤力有冲突**，不能同时存在。（稿子的挖掘进度会被斧头敲一下重置）不过斧力是万金油，能够和他们两个任意组合。**Item.tileBoost（范围加成）**可以为负。

### **8 药水与消耗品类字段**

**Item.consumable（是否会被消耗）**

**Item.potion（是否为回血药水）**

**Item.noUseGraphic（是否隐藏使用时的物品）**

**Item.healLife（回复的生命值）Item.healMana（回复的魔力值）**

**Item.buffType （给予的Buff）Item.buffTime （Buff持续时间）**



这几个字段属于**“药水/消耗品”**字段，**前3个字段**的类型为**bool**默认为**false**，**后4个字段**的类型为**int**默认为0。



**Item.consumable（是否会被消耗）**

字面意思，当它为**true**时，使用后将消耗1个此物品。如果这个物品数量为1那么它会消失。



**Item.potion（是否为回血药水）**

当它为**true**时，使用后会给你**药水病**。并且有药水病期间无法使用此物品（想不到吧）



**Item.noUseGraphic（是否隐藏使用时的物品）**

当它为**true**时，它会在你使用的时候隐藏掉**物品的贴图**。但这个字段仅仅是将贴图隐藏，如果这个物品有**伤害**，那么物品仍然会造成**伤害（**还记得怎么关掉吗？）被用于炸弹，雷管之类的爆破物。也被用于长矛，悠悠球类的手持弹幕。



**Item.healLife（回复的生命值）Item.healMana（回复的魔力值）**

字面意思。它们的数值是多少，在物品使用后就会给你**回复**多少的**生命值/魔力值**。



**Item.buffType （给予的Buff）Item.buffTime （Buff持续时间）**

这两个字段也是字面意思。物品使用后就会**给予**玩家**对应时间的对应buff**。



药水，召唤杖都会使用这个字段。这个**（buff的持续时间）**指的是游戏刻。我们在第1期教程里学习过，**泰拉瑞亚的1游戏刻是1/60秒**。所以我们想要给自己1**0秒**的**buff**应该填**Item.buffTime = 600**。你直接**Item.buffTime = 60\*10**也是可以的，不怕丢人就行（）所有的原版的**buff**可以通过**TML**提供的**BuffID**获取。对应的**ID**可以在[ ](https://terraria.wiki.gg/zh/wiki/%E5%A2%9E%E7%9B%8A_ID)[这个Wiki页面](https://terraria.wiki.gg/zh/wiki/%E5%A2%9E%E7%9B%8A_ID)[ ](https://terraria.wiki.gg/zh/wiki/%E5%A2%9E%E7%9B%8A_ID)查看。

### **9装备类字段**

**Item.accessory（是否饰品）**

**Item.defense（防御力）Item.lifeRegen（生命恢复）**



这几个字段属于**“装备类”**字段，**Item.accessory**的类型为**bool**默认**false**。后面两个的类型为**int**默认为0。



**Item.accessory（是否饰品）**

这个字段就是字面意思，设置了以后这个物品就是**饰品**了，**附魔会变成饰品的附魔**。并且能够被**右键装备**到**装备栏**里面。



**Item.defense（防御力）Item.lifeRegen（生命恢复）**

这两个字段也是字面意思，如果这个物品被**装备**到**装备栏**里面了就获得填写的**防御力和生命恢复**（对，**Item**里面也有一个**生命恢复**。装备以后会加到**Player.lifeRegen**上，想不到吧）



### **10 调色类字段**

**Item.alpha（透明度）Item.color（色调）**



这两个字段属于**“调色类”**字段，原版用它们来给不同**史莱姆死亡后掉落的凝胶**上色。不过原版都是**动态修改**这两个字段的，虽然这个值能够被**基础设置**，但是原版貌似没出现过**基础设置**这两个玩意的物品。



**Item.alpha（透明度）**

物品在游戏内的透明度，类型为**int**默认为0，

这个字段有点特殊，它数值**为0时不透明，为255时全透明,**它的**负值和超过255的数值**都没有意义。但是我见过有 **神人** 给这玩意填负拿来当计时器的。同学们都是好孩子不要学它。



**Item.color（色调）**

物品在游戏内的颜色，类型为**Color**默认为

**Color.Transparen。也就是new Color (R:0,G:0,B:0,A:0)**



听起来很反直觉对吧，因为**Color**的4个参数分别对应着**红绿蓝三原色及透明度**，这4个参数都为零，应该是隐身消失才对。



其实不然，这个字段的颜色。不是作为**上色参数**直接覆盖在**Item**上面的，而是**乘法混合（Multiply Blending）**染上去的。简单来说：就是给物品的贴图整体**“染色/调色”**，相当于加了一层**颜色滤镜**，而不是重新画图。



我们试着在之前的枪里设置个**Item.color = new Color(255,0,0,0);**看看：

|![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/FGTUD2JJADQAO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkZHVFVEMkpKQURRQU8iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjE2LCJoZWlnaHQiOjI0NH0)|![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/G6TUD2JJAAQDE?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ikc2VFVEMkpKQUFRREUiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDg2LCJoZWlnaHQiOjMxMH0)|
|---|---|

*不赖，看着像是猩红风格的武器。*

#### **Color**

这里我讲一讲什么是**Color**类型

**Color**是 **XNA/MonoGame (以及 tModLoader 底层)** 中 给游戏图形渲染颜色的**结构体。**

你可以把它理解为只有**“显卡才能看懂的颜料”。** 

在纯C\#代码里，一般用 **int 或 float** 来表达颜色，但在底层**（DirectX/OpenGL/Vulkan），**显卡需要知道每个像素具体的 **R (红)、G (绿)、B (蓝)、A (透明度)** 四个通道的数值**（通常是从 0 到 255 的字节）**。

而**Color结构体**就是专门用来**存储、运算和传递**这四个数值的工具。在游戏内 **给贴图/物品“上色”（最常用）控制透明度 (Alpha 通道) 绘制文字和 UI 界面 制作特效和光照 (Particles / Lighting)** 都需要用到它

在想要**new**它也非常简单，除去空**color**以外，它足足有6个**构造函数（我去怎么那么多）**我们来一个一个看。



**1 Color(Vector4 color)** 将4d向量转化为0\~1的浮点数然后分别乘以255存入**R,G,B,A**这个常见于3d2d的图形渲染，我们暂时用不到。

**2 Color(Vector3 color)** 和上面的函数类似不过转化的是3d向量，它的 **A (透明度)** 被强制设定为 255，这个函数我们暂时也用不到。



**3 Color(float r, float g, float b, float alpha)** 手动输入0\~1的浮点数 浮点数 然后分别乘以255存入**R,G,B,A**

**4 Color(float r, float g, float b) 3号**的**A (透明度)** 强制为 255版



**5 Color(int r, int g, int b, int alpha)** 手动输入 0\~255 的整数分别，将其限制在 0\~255 存入 R,G,B,A。

**6Color(int r, int g, int b) 5号**的**A (透明度)** 强制为 255版



作为初学者，我们只需要明白**构造函数3**和**构造函数5**以及他们的 **变体** 的参数该如何填写就行了。记得填写参数时 **不要混用浮点数和整数！**



**注意：**

如果你写 **new Color(255, 1, 1)**，因为所有数值都是整数，它变成亮红色（没问题）。

如果你写 **new Color(255, 1, 1f)**（最后一个是浮点数，其他两个是整数），C\# 编译器会优先把 255和1强行转成浮点 1f。

最终的结果就是 **Color.White（纯白色，完全不透明）**，所以**不要混用浮点数和整数！**这会导致你在写代码时获得的颜色与预期完全不符。



好的，常用的**Item**字段介绍完了，分享一下代码。

```csharp
Item.scale = 1f;  //视觉缩放 默认1，越大物品在使用时显示越大，影响碰撞箱和攻击范围
Item.mana = 0;  //魔力消耗 默认0，魔法武器消耗的魔力值

Item.UseSound = SoundID.Item1;  //使用音效

//Item.UseSound = new SoundStyle("你的模组内部名/放音效的文件夹/音效文件")
//{
//    //这里方便你理解，给在内容里填的中文，你要是真照抄我打死你！
//    Volume = 0.9f,//音量，0f ~ 1f
//    PitchVariance = 0.2f,//音调随机变化范围，让每次射击声音略有不同，更真实
//    MaxInstances = 3,//最多同时播放的实例数，防止音效叠加过多
//};

Item.autoReuse = false;  //自动连击 为true按住鼠标持续使用，为false每次点击使用一次
Item.channel = false;  //持续施法/长按检测 为true检测玩家是否长按使用键（用于引导/蓄力武器）
Item.maxStack = 9999;  //最大堆叠数 默认9999，旧版本为1

//工具类字段
Item.pick = 0;       // 镐力（与锤力冲突）
Item.axe = 0;        // 斧力（可与镐力/锤力组合）
Item.hammer = 0;     // 锤力（与镐力冲突）
Item.tileBoost = 0;  // 范围加成（可为负数）

//药水与消耗品类字段
Item.consumable = false;   // true=使用后消耗1个
Item.potion = false;       // true=触发药水病CD
Item.noUseGraphic = false; // true=隐藏使用时物品贴图（仍可造成伤害）
Item.healLife = 0;         // 回复生命值
Item.healMana = 0;         // 回复魔力值
Item.buffType = 0;         // 给予的Buff（BuffID.xxx）
Item.buffTime = 0;         // Buff持续时间（游戏刻，1秒=60刻）

//装备类字段
Item.accessory = false;   // true=饰品（可右键装备）
Item.defense = 0;         // 防御力（装备时生效）
Item.lifeRegen = 0;       // 生命恢复（装备时加到Player.lifeRegen）

//调色类字段
Item.alpha = 0;                          // 透明度（0不透明，255全透明）
Item.color = Color.Transparent;          // 色调（乘法混合，滤镜效果）
```

---

## **常用的 Item 方法**

在之前的教程中，我们已经使用过**Item的SetDefaults()，AddRecipes()和buyPrice()。**对**Item**的方法已经有了一些认知。....什么？你说你不记得用过**buyPrice()**？请看图

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/WSTUD2JJACQBI?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IldTVFVEMkpKQUNRQkkiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDE3LCJoZWlnaHQiOjIxNX0)

模板剑和模板枪里都出现过

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/7CTUD2JJACQBM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjdDVFVEMkpKQUNRQk0iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTYwLCJoZWlnaHQiOjE2MH0)

没错，我们介绍的第1个方法就是....

### **1 buyPrice（**货币换算，**静态方法，我们调用，不编辑它的逻辑）**

**这个方法是 Item 里的静态工具方法，专门用于把各种货币单位（铂金、金币、银币、铜币）换算成“铜币总数”。**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/7CTUD2JJADQAG?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjdDVFVEMkpKQURRQUciLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NzE1LCJoZWlnaHQiOjk0fQ)

它需要我们提供四个**int参数**对应着**（铂金、金币、银币、铜币）**



可能有同学会觉得：不对呀，方法不应该是和**SetDefaults()**一样个圆括号() 加一个方括号{}的吗？

其实不然。 **SetDefaults()** 是我们在类里定义的方法，**它有一个圆括号 () 和一个花括号 {}**，我们在**花括号**里面写的是方法的**具体内容（代码逻辑）**

而 **Item.value = Item.buyPrice(silver: 1);** 这里的 **buyPrice()** 是将**方法调用**，意思是按照**提供的参数**"去执行 **buyPrice** 方法里的代码，把计算出来的结果告诉我"。

就像我们在**SetDefaults()** 里面调用**buyPrice()**方法一样。游戏也会在创建物品的时候调用**SetDefaults()** 方法来设置物品属性。



**第1个**介绍**buyPrice()**主要是想要告诉同学们。游戏不是一个只按几个按钮的**黑箱子**，按对了出**结果**，按错了就**报错**，让人完全搞不懂。游戏更像一栋用**积木**搭起来的大楼里面的**每一块积木（每个方法）**都可以被**查看、被理解、被单独使用。**

### **2 ModifyWeaponDamage（伤害修改，实例方法，游戏调用，我们来写逻辑）**

**这个方法是 Item 里的无返回值方法，在计算武器（面板上的）最终伤害时被调用，可以允许根据玩家状态动态调整伤害。后面介绍的方法都是实例方法，不再重复叙述。**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/4WTUD2JJACQBC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjRXVFVEMkpKQUNRQkMiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjQwLCJoZWlnaHQiOjYxfQ)

**它为我们提供了两个参数Player（玩家角色）和StatModifier（伤害计算结构体）**



**Player（玩家角色）**就是**玩家角色（我在说什么）**

用于获取玩家信息。我们在后面的饰品与盔甲教程中会详细介绍。



**StatModifier（伤害计算结构体）**

你可以把它理解成一个 **数学公式** 你把它**\*2** 那么最后得出来的答案也会**\*2** 但是不能直接**加算**。这个**数学算式**里面有**一大堆的小计算题**，**直接加算**的话会出问题。



**Item.damage**作为基础值在游戏中被**动态修改**会出很多问题，而**StatModifier** 更像是一个**“过滤器”**，用它来做**乘算或加算**，不会**污染**物品的**基础值**。



这么讲你们可能不能理解，我们直接上实战，在模板枪的代码里写上

```csharp
public override void ModifyWeaponDamage(Player player, ref StatModifier damage)
{
    //player.statLife 代表玩家当前血量
    //player.statLifeMax2 代表玩家血量最大值

    //如果玩家血量低于50%，伤害提升30%
    if (player.statLife <= player.statLifeMax2 * 0.5f)
    {
        damage *= 1.3f;
    }
}
```

然后我们进入游戏扣个血。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/OSUED2JJACQHK?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik9TVUVEMkpKQUNRSEsiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6OTEzLCJoZWlnaHQiOjUzMX0)

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/ISUED2JJAAAAM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IklTVUVEMkpKQUFBQU0iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6OTE4LCJoZWlnaHQiOjQwNX0)



可以看到代码成功运行。我们之前提过**StatModifier 直接加算**的话会出问题。现在我们试试。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/SSUED2JJADAEC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlNTVUVEMkpKQURBRUMiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDM3LCJoZWlnaHQiOjEyNX0)

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/ZSUED2JJACQH6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlpTVUVEMkpKQUNRSDYiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6OTcxLCJoZWlnaHQiOjM4NX0)



看吧，数值完全错位。那么我们想要给武器增加固定数值，该怎么写呢？

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/VCUED2JJABQF6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlZDVUVEMkpKQUJRRjYiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjY2LCJoZWlnaHQiOjEyMX0)

其实我们只需要在这个结构体后面加个点，就能够看到它为我们提供的字段了。



**Base（基础值）**

这个字段是**伤害加成计算之前的基础值**，我们在这里给武器添加伤害。就能够吃到**盔甲和饰品**的加成。

**（1+9）\*10 = 100**



**Flat（平加）**

这个字段是**伤害加成计算之后加的额外数值**。我们在这里给武器添加伤害。就不会受到任何加成。

**（1）\*10 + 9 = 19**



### **3 ModifyWeaponCrit（暴击率**修改**）**

这个方法是 **Item** 里的**无返回值的方法**，在计算**武器（面板上的）最终暴击率**时被调用，可以允许根据玩家状态动态调整暴击率。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/7KUED2JJABQCS?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjdLVUVEMkpKQUJRQ1MiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTIzLCJoZWlnaHQiOjYxfQ)

**它为我们提供了两个参数Player（玩家角色）和float（暴击率）**



这个方法没有什么好说的，和**ModifyWeaponDamage**类似。这两个方法调整的数值会**同时作用于武器以及武器发射出去的弹幕**。



可如果我不想让弹幕的数值和武器的数值**一致**呢？我想要弹幕的伤害只有武器面板的**一半**或者弹幕造成

**双倍**武器面板伤害，该怎么办呢？

### **4 ModifyShootStats** **（**射击参数**）**

**这个方法是 Item 里的无返回值方法，在武器弹幕发射前被执行一次，用于调整射击参数。**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/GWUUD2JJAAAGA?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkdXVVVEMkpKQUFBR0EiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NzUzLCJoZWlnaHQiOjkyfQ)

**它为我们提供了6个参数**

**Player（玩家角色）position（弹幕位置）velocity（弹幕向量）**

**type（弹幕ID）damage（弹幕伤害）knockback（弹幕击退）**



**Player（玩家角色）**

用于获取玩家信息。



**position（弹幕位置）**

这个参数代表的是**弹幕发射时**的位置，默认处于玩家中心



**velocity（弹幕向量）**

这个参数代表的是弹幕的**向量（方向\*速度）**。用于加速、减速，或者弹幕旋转方向。



**type（弹幕ID）**

代表武器发射出去的弹幕的id



**amage（弹幕伤害）**

就是你发射的弹幕伤害，改动这个参数不会显示在面板上。



**knockback（弹幕击退）**

你发射的弹幕击退，改动这个参数不会显示在面板上。



我们直接进入实战。



![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/L6UUD2JJACQC6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ikw2VVVEMkpKQUNRQzYiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzM5LCJoZWlnaHQiOjE2M30)

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/M6UUD2JJABABK?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik02VVVEMkpKQUJBQksiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NzA1LCJoZWlnaHQiOjQzOX0)

*这里是弹幕慢了，不是我卡了*



不止简单的修改伤害和速度，我们还能在这里做到更多

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/KSUUD2JJACAGU?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IktTVVVEMkpKQUNBR1UiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTY2LCJoZWlnaHQiOjE4NH0)

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/NCUUD2JJAAADG?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik5DVVVEMkpKQUFBREciLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTQxLCJoZWlnaHQiOjM5N30)



好吧有点怪怪的，这里提供一下代码。~~（逃）~~

```csharp
public override void ModifyShootStats(Player player, ref Vector2 position, ref Vector2 velocity, ref int type, ref int damage, ref float knockback)
{
    // 让子弹飞得更慢
    velocity *= .1f;
    // 伤害增加50%
    damage = (int)(damage * 1.5f);

    //如果这把枪发射的是普通子弹，就有3分之1的概率把他变成手榴弹
    if (type == 14 && Main.rand.NextBool(3)) type = 30;

    //发射时位置提高（泰拉瑞亚左上是0，0 右下是 世界max 所以向上要减）
    position += new Vector2(0, -25);

    //并且伤害翻倍
    damage *= 2;
}
```

有的同学可能好奇。我们的武器是点1下就只发射1个弹幕，可是在泰拉瑞亚中也有像散弹枪那样，1次发射大量弹幕的武器，那么我们的武器想要像散弹枪那样1次发射大量弹幕该怎么做呢？

### **5 Shoot** **（**发射逻辑**）**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/VCUUD2JJACQC2?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlZDVVVEMkpKQUNRQzIiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6ODE1LCJoZWlnaHQiOjgyfQ)

**它为我们提供了7个参数Player（玩家角色）**

**EntitySource\_ItemUse\_WithAmmo（生成源）**

**position（弹幕位置）velocity（弹幕向量）type（弹幕ID）**

**damage（弹幕伤害）knockback（弹幕击退）**



这个方法是 **Item** 里的**有返回值方法**，返回值为**bool**，它的返回值被用来判断是否执行**默认发射逻辑（点1下就发射1个弹幕）**这个方法提供的另外6个参数和**ModifyShootStats**方法的参数一致，但是他多了一个

**EntitySource\_ItemUse\_WithAmmo（生成源）**给我们使用。这是为什么呢？因为在这个方法里我们不直接修改发射前的伤害了。 我们直接来定义发射时的逻辑。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/7GUUD2JJADQH2?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjdHVVVEMkpKQURRSDIiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjM5LCJoZWlnaHQiOjEzOH0)

先把**ModifyShootStats**注释了，防止它影响我们的弹幕发射

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/22UUD2JJACAHO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjIyVVVEMkpKQUNBSE8iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6Njk2LCJoZWlnaHQiOjQ4Mn0)

```csharp
public override bool Shoot(Player player, EntitySource_ItemUse_WithAmmo source, Vector2 position, Vector2 velocity, int type, int damage, float knockback)
{
    // 循环（一次发射3发子弹）
    for (int i = 0; i < 3; i++)
    {
        // 生成随机散射角度 (正负10度)
        Vector2 spreadVelocity = velocity.RotatedByRandom(MathHelper.ToRadians(10));

        // 生成弹幕
        Projectile.NewProjectile(
        source,          // 生成源，用来判断是 什么东西 发射的弹幕
        position,        // 子弹出生的地点
        spreadVelocity,  // 子弹的方向和速度
        type,            // 子弹的ID
        damage,          // 子弹的伤害
        knockback,       // 击退力度
        player.whoAmI    // 属于哪个玩家
        );
    }

    // 返回 false 阻止原版发射逻辑
    return false;
}
```

**NewProjectile**是**Projectile**提供的静态工具方法，用于生成弹幕。我们会在后面的**自制弹幕教程**中详细介绍，现在先按我给出的模板填写。



然后我们进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/ECVED2JJABQCC?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkVDVkVEMkpKQUJRQ0MiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTkxLCJoZWlnaHQiOjQyOX0)



可以看到代码成功的生效了，我们的武器变成了散弹枪一样**（1次发射3发弹幕）**

这个方法能做的还不止这些，我们还可以把武器变得和星怒一样，让发射的弹幕从天空中落下。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/TCVED2JJACAF6?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlRDVkVEMkpKQUNBRjYiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjI1LCJoZWlnaHQiOjM4MH0)

```csharp
// 获取鼠标在游戏世界里的坐标（这是我们弹幕的默认移动目标）
Vector2 mouseWorld = Main.MouseWorld;

// 把出生点抬到头顶上方很高处，并且左右随机偏移（模拟星怒的随机落点）
position.X += Main.rand.Next(-300, 301); // 左右随机偏移
position.Y -= 600f;                      // 往上抬高600像素

// 计算方向：目标位置 - 出生位置 = 从出生点指向鼠标的向量
Vector2 dirToMouse = mouseWorld - position;

// 设定星怒弹幕的飞行速度（将方向向量归一化并乘以一个速度常量）
// 速度大小你可以自己调，比如 12f 代表飞得比较快
velocity = dirToMouse.SafeNormalize(Vector2.Zero) * 12f;
```

把这段代码塞到我们之前弄的散弹发射弹幕之上，然后我们进入游戏。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/O2VED2JJADQBS?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik8yVkVEMkpKQURRQlMiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NzY5LCJoZWlnaHQiOjUzMn0)

~~谁家代达罗斯风暴枪~~

提供一下完整代码。

```csharp
public override bool Shoot(Player player, EntitySource_ItemUse_WithAmmo source, Vector2 position, Vector2 velocity, int type, int damage, float knockback)
{
    // 获取鼠标在游戏世界里的坐标（这是我们弹幕的默认移动目标）
    Vector2 mouseWorld = Main.MouseWorld;

    // 把出生点抬到头顶上方很高处，并且左右随机偏移（模拟星怒的随机落点）
    position.X += Main.rand.Next(-300, 301); // 左右随机偏移
    position.Y -= 600f;                      // 往上抬高600像素

    // 计算方向：目标位置 - 出生位置 = 从出生点指向鼠标的向量
    Vector2 dirToMouse = mouseWorld - position;

    // 设定星怒弹幕的飞行速度（将方向向量归一化并乘以一个速度常量）
    // 速度大小你可以自己调，比如 12f 代表飞得比较快
    velocity = dirToMouse.SafeNormalize(Vector2.Zero) * 12f;

    // 循环（一次发射3发子弹）
    for (int i = 0; i < 3; i++)
    {
        // 生成随机散射角度 (正负10度)
        Vector2 spreadVelocity = velocity.RotatedByRandom(MathHelper.ToRadians(10));

        // 生成弹幕
        Projectile.NewProjectile(
        source,          // 生成源，用来判断是 什么东西 发射的弹幕
        position,        // 子弹出生的地点
        spreadVelocity,  // 子弹的方向和速度
        type,            // 子弹的ID
        damage,          // 子弹的伤害
        knockback,       // 击退力度
        player.whoAmI    // 属于哪个玩家
        );
    }

    // 返回 false 阻止原版发射逻辑
    return false;
}
```

### **6 HoldoutOffset（物品偏移）**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/CCVUD2JJADABW?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkNDVlVEMkpKQURBQlciLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzIxLCJoZWlnaHQiOjYxfQ)

**它为我们提供了0个参数**



这个方法是 **Item** 里的**有返回值**方法，返回值为 **Vector2?** 主要用于给枪械、法杖或弓等使用**useStyle为 5（Holdout）**的物品提供偏移。

这个方法应该在模板枪的那期教程里面就讲的，但是我忘记了（）就把它放到这里了。



我们先看看原本的武器使用位置。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/AGVUD2JJADQFQ?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkFHVlVEMkpKQURRRlEiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTgxLCJoZWlnaHQiOjEzNX0)



然后我们在这个方法里返回 **return new Vector2(5f,-5f);** 

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/ACVUD2JJABQGQ?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkFDVlVEMkpKQUJRR1EiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MzQyLCJoZWlnaHQiOjEzM30)

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/KOVUD2JJACAHM?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IktPVlVEMkpKQUNBSE0iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTg0LCJoZWlnaHQiOjEzOH0)

~~好，可以看到，原本看起来正常的武器被我们弄得好奇怪（）~~



反正这个方法就是能移动枪械法杖类武器使用位置就对了。

### **7 OnHitNPC（**近战挥砍命中**）**

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/G2VUD2JJABQCY?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkcyVlVEMkpKQUJRQ1kiLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NjIwLCJoZWlnaHQiOjYxfQ)

**它提供4个参数Player（玩家角色）NPC（被打中的NPC）**

**NPC.HitInfo（攻击详细信息）knockback（造成的伤害）**



这个方法是 **Item** 里的**无返回值**方法，在我们的物品**“近战挥砍”**中 NPC 后会执行一次。这个方法适合用来做“打击感”、“特效”、“吸血”或“附加状态”等效果。



我们在模板剑的代码下方填入

```csharp
public override void OnHitNPC(Player player, NPC target, NPC.HitInfo hit, int damageDone)
{
    // 比如打中后给敌人施加 10%比例秒 的燃烧效果
    target.AddBuff(BuffID.OnFire,(int)(damageDone* 0.1f)* 60 );

    if (hit.Crit) // 暴击时回血
    {
        player.Heal(damageDone); 
    }
}
```

然后我们进入游戏：

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/RKVUD2JJAAQFO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IlJLVlVEMkpKQUFRRk8iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTI2LCJoZWlnaHQiOjQwNX0)

~~woc，我之前瞎填的Item.damage = 114514;忘改了（）~~



别慌，我们把伤害改回50。

![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/5CVUD2JJAAQEG?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IjVDVlVEMkpKQUFRRUciLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NTA5LCJoZWlnaHQiOjM1NH0)

~~暴击率感人（~~

---

# 结尾

好了，那么我们的** 更多Item字段与方法 **教程就到此结束了。

这期教程内容量有点大，希望同学们能好好消化，就不留作业了，希望同学们玩的开心。



![图片](http://www.kdocs.cn/api/v3/office/copy/M2VINUl4N29qRTMyMXpaUkl4djBTdkpNc2pLYTNOU3RmMlBkREVvSDRQWjhKUFpvc1pCRlhEMGh2enlUVzRkV0hZK2FUcTJ2TmpLdHVxNlp6czJtS24xZFZ6QmFjcWRIZk5GWk8yTTlNZFFwU01yTVhNQXFjdmZncEIvNEVVNnVWd1A0YUV6VTRxdkUyWG5wT0ZjbDRoUGMreHJIek9qWUFyMklla01kYUtaMWtDTTBVM0hPckp6Rk9HSW0zM2NVamJEV2thenJzUUFKYTQzdkE4MHlaUTZUU0Y0TGhoSE9mRDUrSHUrU0wyajJiOUdQWDJ1ZWt0TmN1N3RzSVUyRTBBeE9nSUpmYjJnPQ==/attach/object/D6WED2JJAAAHO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkQ2V0VEMkpKQUFBSE8iLCJvd25lciI6IjU2Mzc5NjgxNjA3NCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6NDAwLCJoZWlnaHQiOjQwMH0)

（本来想留个**无敌炫酷转转剑**的）



下期我们会来制作我们的第1个简单弹幕

---



©*2026 冬天的叶 \| 仅供个人学习，禁止商用及二次分发*

