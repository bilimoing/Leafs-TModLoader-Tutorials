原作者：幽白银 再版：冬天的叶  2026/10/31 \| 🔖 专业

[叶子的TModLoader教程](%E4%B8%BB%E9%A1%B5.md)

不知道第几个TModLoader教程说是....

---

|<br><br><br>大家好，我是幽白银。<br>|![图片](images/tutorials/On功能与应用-01.jpeg)<br>|<br><br><br>时隔1年07个月，我们又见面了~~其实我一点都不想更新~~<br>|
|---|---|---|


今天我们来康康新玩具——`On`。~~其实不新了只是我懒得更新~~

---

# **关于On**

***On是基于Mono的一种技术，可以理解为Hook——钩子，用于修改和控制原函数的流程，甚至阻断。***

而tml选择给我们 （modder） 提供 `On`，则是考虑到mod开发的自由性的问题。有了`On`，我们可以修改原版的公有域的函数。~~看来私有域还得看我反射~~

它的具体的用处是啥呢？

![图片](images/tutorials/On功能与应用-02.png)

比如我想要在添加Buff的时候在左下角提醒一下我挂上了啥Buff

![图片](images/tutorials/On功能与应用-03.png)

又或者我想在创建角色的页面绘制UI

![图片](images/tutorials/On功能与应用-04.gif)

~~（或者用On干掉原版机制自己重写）~~

---

# **本章教学-使用On重写原版的伤害计算**

|<br>你是不是很久以前就想修改Tr的武器伤害计算方式了？其实我也是！<br>|![图片](images/tutorials/On功能与应用-05.gif)<br>|<br>|
|---|---|---|


在本章，我们将使用 *`realDamage = origDamage * const / (defense + const)`* 公式重写原版对 NPC 的伤害计算。（注：这个钩子只影响NPC，想改玩家受伤得去挂 `On_Player.Hurt` 之类的）



我们首先在 **Mod** 主类的 `Load()` 函数用 On 给原版的受击计算函数挂上一个钩子：

```csharp
public override void Load()
{
    On_NPC.StrikeNPC_HitInfo_bool_bool_int += On_NPC_StrikeNPC_HitInfo_bool_bool_int;
}
```

这里需要注意的是，`On_NPC.StrikeNPC_HitInfo_bool_bool_int` 语句代表着用 On 在 `Terraria.NPC` 类的 `StrikeNPC` 函数挂上名为 `On_NPC_StrikeNPC_HitInfo_bool_bool_int` 的钩子。一般来说，钩子只需要挂一次，所以我选择在 `Load` 函数挂钩子，也就是在加载 Mod 的那一刻给原版的受击函数挂上钩子。

而这个方法名很长的 `On_NPC_StrikeNPC_HitInfo_bool_bool_int` 实际上是一个委托，我先解释一下这些参数是个啥：



- 第一个参数（`orig`）你可以把它当成原版扣血的函数，直接 `orig(self, hit, fromNet, noPlayerInteraction);` 就能调用原来的扣血逻辑。

- 第二个参数（`self`）是**挨打的 NPC**。

- 第三个参数（`hit`）包含了这次攻击的所有信息（伤害、暴击、击退等）。**我们要改的就是它里面的数据**。

- 后面两个参数（`fromNet` / `noPlayerInteraction`）是联机相关的，原样传进去就行。

- 第六个参数（`owner`）：伤害来源的归属者（通常是玩家的索引或特定标记）。这个是新版**TML**加进来的，用来处理复杂的伤害归属，不用管它，原样传回给 `orig` 就行。

  

  首先观察我们的公式。`origDamage` 是初始伤害值；`const` 是一个常数，根据这个常数来调整防御机制；`defense` 则是目标的防御力。

  这里有个新手常犯的错误：**千万不要去拿** **`hit.Damage` 反推防御**。因为 `hit.Damage` 已经是经过各种减伤、防御计算后的最终伤害了，反推不仅麻烦还容易算错。我们要直接用 `hit.SourceDamage`，这个才是**没有经过防御减免的“原始伤害”**。

  假设我们输入的 `const` 是 400，那么根据公式转化为代码，是这样的：

  ```csharp
  double realDamage = origDamage * 400 / (Defense + 400);
  ```

  而如果在委托里返回的话，我们只需要这样写：

  ```csharp
  private int On_NPC_StrikeNPC_HitInfo_bool_bool_int(On_NPC.orig_StrikeNPC_HitInfo_bool_bool_int orig, NPC self, NPC.HitInfo hit, bool fromNet, bool noPlayerInteraction, int owner)
  {
      // 拿到目标的防御力
      int Defense = self.defense;
  
      // 防止防御力为负数导致公式计算异常或给怪物回血
      if (Defense < 0) Defense = 0;
  
      // 直接获取没减防之前的“原始伤害”
      int origDamage = hit.SourceDamage;
  
      // 使用新公式计算最终伤害
      double realDamage = (double)origDamage * 400 / (Defense + 400);
  
      // 把新算出来的最终伤害塞回 hit.Damage 里
      hit.Damage = (int)realDamage;
  
      // 调用回原版逻辑，把 owner 原样传进去
      return orig(self, hit, fromNet, noPlayerInteraction, owner);
  }
  ```

  游戏里的伤害计算机制就被修改了！是不是很简单？

  我们进游戏里逝逝：

  ![图片](images/tutorials/On功能与应用-06.png)

  低伤害面对高防御，进行百分比减伤而不是直接为`1`

  ![图片](images/tutorials/On功能与应用-07.png)

  `!? 67 ?!`

  没有随机浮动，全部显示统一伤害

  |![图片](images/tutorials/On功能与应用-08.png)|![图片](images/tutorials/On功能与应用-09.png)|
  |---|---|
  
  武器面板与怪物面板

  （武器的忽略防御，因为我们重写了伤害计算，失效了）

  ![图片](images/tutorials/On功能与应用-10.png)

  实战效果

  

  代入公式计算，我们造成的伤害是`(57-1)*400/(400+50)`，这里 `-1` 是因为射手武器的最终伤害是，武器面板伤害+弹药伤害，而凝胶伤害为`-1`，最后得出：

  ` 22400 ÷ 450 ≈ `**`49.777...`**

  数值是符合的，说明我们的代码完全正确。

  最后，别忘了在 **Mod** 主类的`Unload`函数里卸载钩子！卸载**Mod**后恢复游戏原版的样子，是**Mod**的原则之一。

  ```csharp
  public override void Unload()
  {
      On_NPC.StrikeNPC_HitInfo_bool_bool_int -= On_NPC_StrikeNPC_HitInfo_bool_bool_int;
      base.Unload();
  }
  ```

  |<br>至此，原版伤害机制修改完成。<br>|![图片](images/tutorials/On功能与应用-11.gif)<br>|<br>|
  |---|---|---|

  
  其实还有个东西叫IL，其能精确修改某个函数的IL代码，其自由度比On更高，在某些地方比On要好用。但是本章我们不讨论这个，感兴趣的pong友可以去 [官方文档](https://github.com/tModLoader/tModLoader/wiki/Expert-IL-Editing) 查看。

  ---

# **课后作业**

|<br>今天就不布置作业了，大家玩得开心。<br>|![图片](images/tutorials/On功能与应用-12.gif)<br>|
|---|---|




*©2026 冬天的叶 &amp;* *幽白银* *\| 仅供个人学习，禁止商用二次分发*

