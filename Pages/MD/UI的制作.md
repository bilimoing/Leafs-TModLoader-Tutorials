原作者：幽白银 再版：冬天的叶  2026/11/3 \| 🔖 GUI, 进阶

[叶子的TModLoader教程](%E4%B8%BB%E9%A1%B5.md)

不知道第几个TModLoader教程说是....

---

你好，欢迎来到本章，我是幽白银，你可以叫我白银。由于内容太多，裙子一个人写不过来，我申请成为了教程编写人。

那，废话不多说 ~~就你废话最多~~，我们现在开始本章的教学。

# 什么是UI？

*用户界面(User Interface)是指对软件的人机交互、操作逻辑、界面美观的整体设计。好的UI设计不仅是让软件变得有个性有品味，还要让软件的操作变得舒适、简单、自由、充分体现软件的定位和特点。* 

——百度百科



UI能达到什么效果呢？这里放几张UI做的界面

![图片](images/tutorials/UI的制作-01.png)

![图片](images/tutorials/UI的制作-02.png)

![图片](images/tutorials/UI的制作-03.png)

当然，这么复杂的效果不可能在一章教程里面就全部教会。但是别灰心，我们从头开始。

---

# **编写UIState**

## 基础准备

![图片](images/tutorials/UI的制作-04.png)

首先，我们需要在 `Content` 文件夹下创建一个名为 `UIs` 的文件夹。

![图片](images/tutorials/UI的制作-05.png)

接着在里面新建一个类文件，命名为 `ExampleUI.cs`。因为我们要使用的是 Terraria 原生的 UI，所以需要让它继承 `UIState`：

```csharp
using Terraria.UI;

namespace DemoMod.Content.UIs
{
    public class ExampleUI : UIState
    {

    }
}
```

接着在类中，输入 `public override`，找到名为 `OnInitialize` 的方法。我们将在这个方法里为 UI 添加部件：

```csharp
 public override void OnInitialize()
 {
     base.OnInitialize();
 }
```

---

## 部件编写

以下代码的作用是**实例化一个面板，并且将其注册到UIState**

```csharp
//实例化一个面板
UIPanel panel = new UIPanel();
//设置面板的宽度
panel.Width.Set(488f, 0f);
//设置面板的高度
panel.Height.Set(568f, 0f);
//设置面板距离屏幕最左边的距离
panel.Left.Set(-244f, 0.5f);
//设置面板距离屏幕最上端的距离
panel.Top.Set(-284f, 0.5f);
//将这个面板注册到UIState
Append(panel);
```

那么，该怎么往面板上面添加一个按钮呢？请看如下代码

```csharp
//用tr原版图片实例化一个图片按钮
UIImageButton button = new UIImageButton(ModContent.Request<Texture2D>("Terraria/Images/UI/ButtonPlay"));
//设置按钮距宽度
button.Width.Set(22f, 0f);
//设置按钮高度
button.Height.Set(22f, 0f);
//设置按钮距离所属ui部件的最左端的距离
button.Left.Set(-11f, 0.5f);
//设置按钮距离所属ui部件的最顶端的距离
button.Top.Set(-11f, 0.5f);
//将按钮注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
panel.Append(button);
```

既然是按钮，那么按下应该要有效果吧？使用`button.OnClick`来让按钮按下时触发事件！你可以手动输入`button.OnClick+=`然后按下Tab键让vs帮你生成事件！

实例化按钮并注册事件的代码如下

```csharp
 //用tr原版图片实例化一个图片按钮
 UIImageButton button = new UIImageButton(ModContent.Request<Texture2D>("Terraria/Images/UI/ButtonPlay"));
 //设置按钮距宽度
 button.Width.Set(22f, 0f);
 //设置按钮高度
 button.Height.Set(22f, 0f);
 //设置按钮距离所属ui部件的最左端的距离
 button.Left.Set(-11f, 0.5f);
 //设置按钮距离所属ui部件的最顶端的距离
 button.Top.Set(-11f, 0.5f);
 //注册一个事件，这个事件将会在按钮按下时被激活
 button.OnLeftClick += Button_OnLeftClick;
 //将按钮注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
 panel.Append(button);
```

如果我们想在事件按下时输出一段文字，该怎么做呢？我们可以使用`Main.NewText("");`来在tr左下角输出文字！

以下是事件的代码

```csharp
private void Button_OnLeftClick(UIMouseEvent evt, UIElement listeningElement)
{
    Main.NewText("你按下了一个按钮！");
}
```

然后，我们需要一个`static`变量来控制UI的开关，你可以在代码中添加一个

```csharp
public static bool Visible = false;
```

接下来我们可以注册一个按钮，让这个按钮按下时关闭UI。以下是注册按钮的代码

```csharp
//用tr原版图片实例化一个图片按钮
UIImageButton closeButton = new UIImageButton(ModContent.Request<Texture2D>("Terraria/UI/ButtonDelete"));
//设置按钮距宽度
closeButton.Width.Set(22f, 0f);
//设置按钮高度
closeButton.Height.Set(22f, 0f);
//设置按钮距离所属ui部件的最左端的距离
closeButton.Left.Set(-22f, 1f);
//设置按钮距离所属ui部件的最顶端的距离
closeButton.Top.Set(0f, 0f);
//注册一个事件，这个事件将会在按钮按下时被激活
closeButton.OnLeftClick += CloseButton_OnLeftClick; ;
//将按钮注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
panel.Append(closeButton);
```

事件的代码如下

```csharp
private void CloseButton_OnLeftClick(UIMouseEvent evt, UIElement listeningElement)
{
    Visible = false;
}
```

## **绘制UI并使UI的事件生效**

我们编写了`UIState`，接下来是时候让它生效了。新建一个`ModSystem`类，创建两个变量

```csharp
public class ExampleUI_ModSystem : ModSystem
{
    //建立一个类型为ExampleUI的变量
    internal ExampleUI exampleUI;
    //建立一个类型为UserInterface的变量
    internal UserInterface exampleUserInterface;
}
```

`ExampleUI`就是我们刚刚编写的那个`UIState`的子类，而`UserInterface`则是用来托管UI事件的一个类。然后来到`ModSystem`里名为`Load`的方法，将它们实例化并且设置激活它们：

```csharp
public override void Load()
{
    //将exampleUI实例化
    exampleUI = new ExampleUI();
    //将exampleUI初始化
    exampleUI.Activate();
    //将exampleUserInterface实例化
    exampleUserInterface = new UserInterface();
    //让exampleUserInterface代理exampleUI的事件触发
    exampleUserInterface.SetState(exampleUI);
}
```

实例化了后，我们还需要让它运作起来，输入`public override`，找到名为`UpdateUI`的方法，这个方法在游戏运行时都在执行。我们可以在其中输入

`if (ExampleUI.Visible) exampleUserInterface?.Update(gameTime);`用以在游戏运行时让`exampleUserInterface`在游戏运行时托管`exampleUI`的事件

以下是代码

```csharp
public override void UpdateUI(GameTime gameTime)
{
    //当Visible为true时（当UI开启时）
    if (ExampleUI.Visible)
        //如果exampleUserInterface不是null（非空）就执行Update方法
        exampleUserInterface?.Update(gameTime);
    base.UpdateUI(gameTime);
}
```

最后，我们还要让UI被绘制出来，被我们看到。输入`public override`找到这个名为`ModifyInterfaceLayers`的方法，可以看到里面有个名为`layers`的参数，这个参数包含了tr所有的绘制图层~~你可以在这里动点骚操作，比如RemoveAt之类的~~，我们将在这个集合里插入一个成员来达到绘制的目的。以下是代码

```csharp
public override void ModifyInterfaceLayers(List<GameInterfaceLayer> layers)
{
    //寻找一个名字为Vanilla: Mouse Text的绘制层，也就是绘制鼠标字体的那一层，并且返回那一层的索引
    int MouseTextIndex = layers.FindIndex(layer => layer.Name.Equals("Vanilla: Mouse Text"));
    //寻找到索引时
    if (MouseTextIndex != -1)
    {
        //往绘制层集合插入一个成员，第一个参数是插入的地方的索引，第二个参数是绘制层
        layers.Insert(MouseTextIndex, new LegacyGameInterfaceLayer(
           //这里是绘制层的名字
           "Test : ExampleUI",
           //这里是匿名方法
           delegate
           {
               //当Visible开启时（当UI开启时）
               if (ExampleUI.Visible)
                   //绘制UI（运行exampleUI的Draw方法）
                   exampleUI.Draw(Main.spriteBatch);
               return true;
           },
           //这里是绘制层的类型
           InterfaceScaleType.UI)
       );
    }
    base.ModifyInterfaceLayers(layers);
}
```

---

# **开启UI**

总算是写好了，让我们开启 UI 来看看效果！

我们随便找一个物品，在它的任意使用方法（比如 `Shoot`）里输入`ExampleUI.Visible = true;`来开启UI！

```csharp
public override bool Shoot(Player player, EntitySource_ItemUse_WithAmmo source, Vector2 position, Vector2 velocity, int type, int damage, float knockback)
{
    ExampleUI.Visible = true;
    return true;
}
```

接下来编译模组，进入世界，使用物品，就可以看见UI成功加载出来了！

![图片](images/tutorials/UI的制作-06.png)

|![图片](images/tutorials/UI的制作-07.jpeg)<br>|<br>欸Σ(っ °Д °;)っ，怎么没有？？？这不科学！！！<br>|
|---|---|


![图片](images/tutorials/UI的制作-08.png)

|![图片](images/tutorials/UI的制作-09.png)<br>|<br><br>…..忘保存了<br>|
|---|---|


![图片](images/tutorials/UI的制作-10.png)

可以看到，UI加载出来了！

---

# 结尾

## **UI源码**

**ExampleUI：**

```csharp
 public class ExampleUI : UIState
 {
     public override void OnInitialize()
     {
         //实例化一个面板
         UIPanel panel = new UIPanel();
         //设置面板的宽度
         panel.Width.Set(488f, 0f);
         //设置面板的高度
         panel.Height.Set(568f, 0f);
         //设置面板距离屏幕最左边的距离
         panel.Left.Set(-244f, 0.5f);
         //设置面板距离屏幕最上端的距离
         panel.Top.Set(-284f, 0.5f);
         //将这个面板注册到UIState
         Append(panel);


         //用tr原版图片实例化一个图片按钮
         UIImageButton button = new UIImageButton(ModContent.Request<Texture2D>("Terraria/Images/UI/ButtonPlay"));
         //设置按钮距宽度
         button.Width.Set(22f, 0f);
         //设置按钮高度
         button.Height.Set(22f, 0f);
         //设置按钮距离所属ui部件的最左端的距离
         button.Left.Set(-11f, 0.5f);
         //设置按钮距离所属ui部件的最顶端的距离
         button.Top.Set(-11f, 0.5f);
         //注册一个事件，这个事件将会在按钮按下时被激活
         button.OnLeftClick += Button_OnLeftClick;
         //将按钮注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
         panel.Append(button);

         //用tr原版图片实例化一个图片按钮
         UIImageButton closeButton = new UIImageButton(ModContent.Request<Texture2D>("Terraria/Images/UI/ButtonDelete"));
         //设置按钮距宽度
         closeButton.Width.Set(22f, 0f);
         //设置按钮高度
         closeButton.Height.Set(22f, 0f);
         //设置按钮距离所属ui部件的最左端的距离
         closeButton.Left.Set(-22f, 1f);
         //设置按钮距离所属ui部件的最顶端的距离
         closeButton.Top.Set(0f, 0f);
         //注册一个事件，这个事件将会在按钮按下时被激活
         closeButton.OnLeftClick += CloseButton_OnLeftClick;
         //将按钮注册入面板中，这个按钮的坐标将以面板的坐标为基础计算
         panel.Append(closeButton);

         base.OnInitialize();
     }
     public static bool Visible = false;

     private void CloseButton_OnLeftClick(UIMouseEvent evt, UIElement listeningElement)
     {
         Visible = false;
     }

     private void Button_OnLeftClick(UIMouseEvent evt, UIElement listeningElement)
     {
         Main.NewText("你按下了一个按钮！");
     }
 }
```

**ExampleUI\_ModSystem：**

```csharp
public class ExampleUI_ModSystem : ModSystem
{
    //建立一个类型为ExampleUI的变量
    internal ExampleUI exampleUI;
    //建立一个类型为UserInterface的变量
    internal UserInterface exampleUserInterface;
    public override void Load()
    {
        //将exampleUI实例化
        exampleUI = new ExampleUI();
        //将exampleUI初始化
        exampleUI.Activate();
        //将exampleUserInterface实例化
        exampleUserInterface = new UserInterface();
        //让exampleUserInterface代理exampleUI的事件触发
        exampleUserInterface.SetState(exampleUI);
    }
    public override void UpdateUI(GameTime gameTime)
    {
        //当Visible为true时（当UI开启时）
        if (ExampleUI.Visible)
            //如果exampleUserInterface不是null（非空）就执行Update方法
            exampleUserInterface?.Update(gameTime);
        base.UpdateUI(gameTime);
    }
    public override void ModifyInterfaceLayers(List<GameInterfaceLayer> layers)
    {
        //寻找一个名字为Vanilla: Mouse Text的绘制层，也就是绘制鼠标字体的那一层，并且返回那一层的索引
        int MouseTextIndex = layers.FindIndex(layer => layer.Name.Equals("Vanilla: Mouse Text"));
        //寻找到索引时
        if (MouseTextIndex != -1)
        {
            //往绘制层集合插入一个成员，第一个参数是插入的地方的索引，第二个参数是绘制层
            layers.Insert(MouseTextIndex, new LegacyGameInterfaceLayer(
               //这里是绘制层的名字
               "Test : ExampleUI",
               //这里是匿名方法
               delegate
               {
                   //当Visible开启时（当UI开启时）
                   if (ExampleUI.Visible)
                       //绘制UI（运行exampleUI的Draw方法）
                       exampleUI.Draw(Main.spriteBatch);
                   return true;
               },
               //这里是绘制层的类型
               InterfaceScaleType.UI)
           );
        }
        base.ModifyInterfaceLayers(layers);
    }
}
```

## **以下是小作业**

等我学会怎么布置小作业再来吧(╯‵□′)╯︵┻━┻



*©2026 冬天的叶 &amp;* *幽白银* *\| 仅供个人学习，禁止商用二次分发*

