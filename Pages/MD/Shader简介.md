原作者：dxtst 再版：冬天的叶 2026/9/14 \| 🔖 高级 、绘制 、工具

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

前置知识：向量，三角函数，线性代数

题目名叫Shader简介，其实这也只是个简介而已，对于Shader在TR以外的用途我仍然知之甚少。所以本次教程我会教一下着色器在TR的基本使用方法，遗憾的是，由于XNA这方面的资料不全，所以可能会出现一些疏漏，请大家帮助指出。

---

## **Shader是什么**

**Shader（着色器）**顾名思义，它的作用就是给某些东西上色，具体来说，是给屏幕上的图形上色。计算机图形学领域中，**着色器**就是一小段程序，可以完成对图像的后期处理。由于着色器功能非常自由，所以调整图像的色相、饱和度、亮度、对比度，生成模糊滤镜等等都是它的基本功能。在游戏制作，尤其是3D游戏制作中，着色器是必不可少的组件，包括泰拉瑞亚本体就用了很多，只不过我们可能并不知道那是着色器的功效。

我们来看看要把一张图片绘制到屏幕上会进行哪些操作，这里我引用了一下OpenGL的渲染管线，XNA的渲染管线不会有太大区别

![图片](images/tutorials/3e268491b5737d735a2d46a4.png)

在真正把一个图像渲染到你的屏幕上之前，显卡都会经过这几个步骤



1. 把几何体数据送进**Vertex Shader（顶点着色器）**，由此计算出实际应该在屏幕上渲染的位置。（2D游戏较少用）

2. 根据计算出的顶点顺序生成图元像素，包含了后两个阶段。

3. **Rasterization（光栅化）**把几何形体转化为平面上的一个个像素。

4. 然后使用**Fragment Shader/Pixel Shader（片段着色器，也叫像素着色器）**对每个像素点进行计算和染色。

5. 最后根据其他信息（比如透明度）对最终会在屏幕上显示的像素进行渲染。

   

   在深入了解着色器之前我们先想一个问题，假设我们电脑分辨率是1920乘以1080的，那就意味着每一帧我们都要渲染 *1920 × 1080 = 2073600* 个像素在屏幕上，此外，你每次绘制一张图片在游戏里，都是需要把这个图片的像素矩阵填充到屏幕像素矩阵里面，对于每个像素我们还要用着色器进行大量计算。再加上TR本身还有大量的逻辑（可以看做超过百万次循环），这样的计算量电脑的CPU应该是吃不消的。但是实际上我们运行泰拉瑞亚却非常流畅，这是为什么呢？

   

   实际上，渲染像素到屏幕上并不是CPU去做的，而是**GPU（Graphics Processing Unit）**，也就是我们的显卡。那么，为什么计算还要区分CPU与GPU呢？这是因为他们在设计目标上完全不同，CPU需要很强的通用性来处理各种不同的数据类型，同时又要逻辑判断又会引入大量的分支跳转和中断的处理。但是GPU需要的却是少量独立的计算以及极大的吞吐量，这正好与屏幕像素的渲染的需求相同。GPU内部还有很多线程，可以同时完成很多像素点的计算工作，这也是为什么看似计算量很大的游戏你的电脑仍然能流畅运行（前提是显卡够好）。

   ---

   *GPU的工作大部分就是这样，计算量大，但没什么技术含量，而且要重复很多很多次。就像你有个工作需要算几亿次一百以内加减乘除一样，最好的办法就是雇上几十个小学生一起算，一人算一部分，反正这些计算也没什么技术含量，纯粹体力活而已。而CPU就像老教授，积分微分都会算，就是工资高，一个老教授资顶二十个小学生，你要是富士康你雇哪个？*

   ---

   利用显卡挖矿也是这个原理。同时，因为它需要并行而且效率不高，所以着色器程序不能有太多指令，如果指令太多编译器不会让你通过的。

   虽然之前的图中我们看到了好几种着色器，但是在泰拉瑞亚世界里，我们最常用的就是Pixel Shader，也就是像素着色器，主要就是对于倒数第二个阶段的操作，或者也可以看做对一张图片进行操作。

   通俗的来讲，像素着色器就是接受一个图像信息，一个位置信息，返回一个颜色信息的函数而已。我们对于图像上的每个像素，都会运行这样一个着色器函数，告诉这个函数图像整体是啥样的，以及这个像素的位置坐标，最后我们得到这个像素应该被赋予的颜色。

   注意，即使像素当前已经被修改了，但是在之后的着色器运行的过程中，看到的仍然是原来的图像，所以二次更改是不会发生的。

   那么它可以用来做什么呢？比如黑白电视，

   ![图片](images/tutorials/0e1e076a5a7b1ae333faf40a.jpeg)

   比如局部放大（可以用来做空气扭曲效果）

   ![图片](images/tutorials/37f8dd239fe7961787beaf44.png)

   或者高斯模糊效果：

   ![图片](images/tutorials/509b63bbf2b3c899847395ff.jpeg)

   接下来我就会详细介绍一下XNA里面的Shader实现，以及我们怎么通过TML以及原版的功能实现一个着色器。

## **XNA着色器编译**

我们首先要经历的第一道难关就是编译我们的着色器脚本文件（\*.fx)。 由于XNA GameStudio早已被微软放弃，所以我们没办法使用正统的XNA GameStudio去编译这个脚本。怎么办呢？我这里给大家提供了一个XNA编译器，可以用来编译所有XNA所支持的资源，包括但不限于着色器脚本，音乐，图片。可以在群里或者这里下载

[**点击下载**](https://www.kdocs.cn/l/crW4yAlNVSry)

使用方法也很简单，首先我们把这个压缩包解压到某个文件夹，然后把需要编译的原始文件放进文件夹内，最后运行EasyXnb.exe，即可完成编译。



![图片](images/tutorials/a9ed5c6548b63184a26040fb.png)

![图片](images/tutorials/1d7aa3d73c0f4d1240843977.png)

运行成功

![图片](images/tutorials/eb43bb21a70f51ba96e26330.png)

如果在编译中途报错，可以查看文件夹内的EasyXnb\_Log来查找错误信息。

![图片](images/tutorials/3c86fc76302aa47559cf105c.png)

运行一切正常的话，就能看到xnb文件出现在我们文件的下方。编译出来的xnb文件直接放在模组文件夹里面即可，最好单开一个文件夹，不要直接丢在主文件夹里。

比如着色器脚本文件我们就可以在源码文件夹开一个Effects文件夹，然后把xnb文件放进去。对于着色器来说，只有xnb能够被泰拉瑞亚所加载，所以我们必须提前编译着色器脚本，而图片音乐什么的却不需要用xnb文件进行加载。

---

## **着色器实现**

加下来，我会以一个NPC的着色器为例子，演示一下整个着色器的使用过程。

### **编写着色器**

![图片](images/tutorials/79164b1a37731a9284b5b2d9.gif)

上图就是我们想要的效果，让所有NPC的贴图都变成灰白的，如果配上眩晕就可以造成类似石化NPC的效果。

XNA的着色器使用的是HLSL脚本，大家可以在DirectX的文档中查到关于它的信息。HLSL是一个语法类似C语言的脚本语言，但是它却是与C一样，直接编译成机器指令的，只不过这个机器指令不是CPU执行而是GPU。

```csharp
sampler uImage0 : register(s0);
float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0 {
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;
        // 灰度 = r*0.3 + g*0.59 + b*0.11
    float gs = dot(float3(0.3, 0.59, 0.11), color.rgb);
    return float4(gs, gs, gs, color.a);
}
technique Technique1 {
    pass Test {
        PixelShader = compile ps_2_0 PixelShaderFunction();
    }
}
```

我们一行行来解读这个着色器脚本，首先第一行的`sampler uImage0 : register(s0);`其实是要被绘制的这个图像的采样数据，由于采样器数据必须保存在s开头的寄存器中，于是我们就要把寄存器中的值拿出来，把它命名为`uImage0`，这就是这段代码的作用。通俗来讲，就是把要绘制的图像起个名，叫做`uImage0`。

接下来这一段其实很像是C\#里面函数的定义（C系语言不都这样），参数是一个类型为`float2`的coords，返回值是一个`float4`类型。那么这个`float??`的类型到底是什么呢？其实它们就是向量，`float2`就是个二维向量，里面存有2个**浮点（float）**类型的数据，`float4`就是个四维向量，里面存储4个浮点类型的数据。颜色之所以是四维向量，因为颜色有 ***R / G / B / A*** 四个属性。



HLSL里面的颜色信息都是 ***1\~0**  *范围内的浮点数，对应就是这个数乘以255的值，这个地方一定要注意，不要以为它是0\~255范围的整数，否则就会出现奇怪的颜色。



值得一提的就是，这些向量做**切片操作（Slicing）**都相当轻松，假设我们有个四维向量`x`，我们可以通过`x.rgb`来得到一个三维向量，存储它的前三个浮点数信息。也可以用`x.rga`来得到一个三位向量，只不过这次是第一二四个浮点数的信息。此外，我们还可以用`x.xyz`来达到和`x.rgb`相同的效果。你甚至还可以做到更多，比如下标访问，甚至`x.aaaa`获取一个四维向量，四个值全都是第一个位置的值。我经常滥用这个特性，爱死它了。

![图片](images/tutorials/6d46f8388f17e7fda6a43867.png)

![图片](images/tutorials/25df80a8da8c07d36673ff0a.png)

`float2 coords : TEXCOORD0`里面的`TEXCOORD0`代表的意思就是这个参数是图像的坐标，`TEXCOORD0`是着色器的**语义（Semantics）**当它与参数绑定在一起的时候，就给这个输入参数赋予了语义所代表的信息，传参的时候就会把坐标传给这个值。比如`COLOR0, COLOR1`就是绑定了颜色信息， `DEPTH0`就是深度信息，具体可以去[官方文档](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-semantics)查看。当输出绑定了颜色信息，那么XNA就会把这个信息解释为像素点的颜色。



`tex2D(uImage0, coords)`这个是HLSL内置的一个函数，第一个参数是图像采样器，第二个参数是像素坐标，他会返回指定坐标的像素颜色，所以`color`就是当前位置的像素颜色。`any`也是一个内置函数，如果这个参数有任何一个位置不为0（比如颜色不为`0，0，0，0` )就返回true，否则就是false。

接下来就是计算灰度的算法了，其实真的很简单，就是把颜色的红色分量乘以0.3，绿色分量乘以0.59，蓝色分量乘以0.1最后加起来成为一个浮点数 *`c`*，然后把最终颜色的三维全部设为 *`c`*就是我们想要的灰度了。这里我用了向量叉积来模拟这个过程，使得代码更简洁。



至于为什么是这3个魔术数字呢？咳，我也不知道，但是从它的发明者的论文来看，这串数字貌似对于灰度的理解是最好的，有兴趣的同学可以去[https://en.wikipedia.org/wiki/Grayscale](https://en.wikipedia.org/wiki/Grayscale)了解一下。

关于这些内置函数的更多信息，可以去[官方文档](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/dx-graphics-hlsl-intrinsic-functions)看。因为HLSL并非XNA独有，所以这方面资料还是比较多的。

最后我们看看最下面那一部分的代码，这其实是让同一个Effect文件拥有多种着色器的方法。一个Technique可以拥有多个Pass，而每个Pass只能定义一个着色器程序，但是一个着色器程序可以拥有多种着色器代码，比如VertexShader和PixelShader。我们可以通过Technique和Pass去索引我们想要的着色器程序。

那么最后那一部分代码的作用就是定义了一个叫`Technique1`的`Technique`，里面包含了一个叫`Test`的`Pass`，Test这个Pass编译的是2.0版本的Shader Model，因为XNA只支持这个版本，不太清楚对于更高版本的会发生什么。最后我们把目标函数传给Pass，这样这个Pass的功能就是绑定的目标函数了。



到这里，我们就写出了一个基本的着色器脚本，把它编译一下就能得到xnb文件。接下来我们要在TML里面加载以及使用这个着色器。

![图片](images/tutorials/220b0c90a5815911dccd36bd.png)

先右键新建一个文本文档，然后把后缀改成 `.fx`。`.fx` 是 HLSL 脚本使用的文件后缀。

接着把代码粘贴进去，然后你就会发现....

![图片](images/tutorials/13d57857e2c93c08e7f7ad17.png)

*哇～好丑*

这些代码在窗口内显示的全都是白色。对于习惯了编译器 ***花花绿绿 ***的我们来说，这样子看着实在难受。这是因为 Visual Studio 只能识别 `.cs` 文件以及一些常见格式，没有识别 `.fx` 文件的能力。那么，我们该怎么办呢？

![图片](images/tutorials/9f88ee45e1faf1d8006f2e89.png)

其实很简单，只需要在 VS 里装一个小小的扩展。，点击 **扩展 → 管理扩展**，打开扩展管理器。

![图片](images/tutorials/4032c2561f058642751cabfc.png)

然后在扩展管理器的搜索框里搜索 **HLSL**，弹出来的第一个扩展就是我们要的。点击安装。重新进入后，我们就会看到....

![图片](images/tutorials/da4a30111f61141dcc4136c0.png)

*（还是好丑）。*

---

### **使用着色器**

得到xnb后缀文件后，我们要在`Load()`函数重写函数里面加载这个Effect文件。我们可以先在Mod的主类中定义一个静态Effect字段：

```csharp
public static Effect npcEffect;
```

然后在`Load()`里写：

```csharp
public override void Load()
{
    var mode = AssetRequestMode.ImmediateLoad; //设置加载模式
    npcEffect = ModContent.Request<Effect>("DemoMod/Effects/DemoNPCShader", mode).Value;
}
```

就和加载图片一样，这个路径不带后缀名。

接下来，我们就要在NPC的绘制上动手脚了。先创建一个GlobalNPC的全局NPC修改类，我这里叫TemplateGlobalNPC，然后我们使用`PostDraw`和`PreDraw`两个重写函数，写下这样的代码：

```csharp
public class TemplateGlobalNPC : GlobalNPC
{
    public override void PostDraw(NPC npc, SpriteBatch spriteBatch, Vector2 screenPos, Color drawColor)
    {
        spriteBatch.End();
        spriteBatch.Begin(SpriteSortMode.Deferred, BlendState.NonPremultiplied, SamplerState.AnisotropicClamp, DepthStencilState.None, RasterizerState.CullNone, null, Main.GameViewMatrix.TransformationMatrix);
    }

    public override bool PreDraw(NPC npc, SpriteBatch spriteBatch, Vector2 screenPos, Color drawColor)
    {
        spriteBatch.End();
        spriteBatch.Begin(SpriteSortMode.Immediate, BlendState.NonPremultiplied, SamplerState.AnisotropicClamp, DepthStencilState.None, RasterizerState.CullNone, null, Main.GameViewMatrix.TransformationMatrix);
        //注意要对应fx里Technique1方法pass的名字
        DemoMod.npcEffect.CurrentTechnique.Passes["Test"].Apply();
        return true;
    }
}
```

然后保存编译运行你就能看到效果了。但是在这之前，我们还有一些东西要解释。



首先，为什么要关掉之前的绘制，这是因为，按照默认的`SpriteSortMode.Deferred`模式（ **绘制顺序** ），我们无法应用着色器。XNA的`SpriteSortMode`是一个很毒瘤的东西，它定义了你在调用`spriteBatch.Draw`的时候，绘制这些图像的顺序。你调用Draw的时候其实XNA并不会马上开始绘制，而是把这些信息缓存起来，等到刷新缓存的时候一次性的绘制到屏幕上。但是不知道为什么，XNA在这种模式下没办法应用着色器程序，我人都傻了。。



好在`SpriteSortMode.Immediate`配置是只要你调用了Draw，就立即把它画到屏幕上，这会使得你一下子经历之前所有的那些绘制步骤，包括顶点着色器，像素着色器，光栅化什么的。这样做的后果就是频繁Draw的时候性能低下，不过使用Shader本来就需要比较高配，所以忍忍吧，尽量不要频繁使用`Immediate`模式。



至于后面的 **`BlendState`（混合模式）** 属性，也是很有意思的。它决定了这个图像绘制在已有的图像部分的时候，选择的颜色混合方式，也就是最后一个步骤要做的事情。在泰拉瑞亚，NPC 的绘制大部分时候都是在绘制地形后面的（不要搞混了，哪个在后面哪个就在上面），所以说绘制 NPC 的背景（已有图像）就是地形，而 NPC 的图像就是要绘制的图像。



对于**`AlphaBlend`（默认）**这种模式，假设 NPC 图像的颜色是 `Ca`，背景是 `Cb`，那么绘制结果是：

`Ca + (1 - α)Cb`

此时的 α 其实就是透明度。然而按照它文档所说，公式应该是：

`αCa + (1 - α)Cb`

而这其实是 **`NonPremultiplied`** 模式的公式，也就是说，XNA 官方文档写错了，它把这两个模式的公式搞混了。（所以我写 XNA 的 API 的时候几乎是崩溃的）

如果是 **`Additive`** 模式，那么绘制结果的颜色是 `Ca + Cb`，是一种非常暴力的混合方式，白色封顶，这样的效果会比较亮，而且感觉上会很透明，尤其适合技能特效方面的绘制。

![图片](images/tutorials/0c20352209edf9371eb5bd2a.png)

多个npc重合在一起就会发亮

![图片](images/tutorials/2d68cf139b2a48634deae8c5.png)

这是彩虹史莱姆还是史莱姆之母?

唔，介绍完了这些，我相信你对于着色器以及绘制原理已经有了一个基础的认识，接下来我们通过几个实战案例，了解一下着色器的特性以及制作过程吧。

后面的世界矩阵可以使用`Main.Transform`，但是已经被原版弃用，可以使用`Main.GameViewMatrix.ZoomMatrix`，或者`Main.GameViewMatrix.TransformationMatrix`。

---

## **更多着色器案例**

### **动态颜色（Rainbow）**

记得新建fx文件，后面同理，不再反复提及。然后我们想要让颜色随着时间的变化而变化，需要一个计时器。为了简单起见，我们传入`Main.time`作为天然计时器。

接下来我们还要向着色器传参，这里你们会发现一些跟C\#不一样的地方，shader的传参只需要在脚本中定义这个变量，给它一个名字，然后外部通过这个名字赋值。比如说我们可以直接定义名字叫`uTime`的变量，它是一个float类型

```csharp
float uTime; 
```

我们不需要给它赋值，而是通过Mod里面的代码进行赋值。回到GlobalNPC类，

在`PreDraw`的Effect apply之前加上这样一段话

```csharp
DemoMod.Rainbow.Parameters["uTime"].SetValue((float)Main.time);
//注意要对应fx里Technique1方法pass的名字
DemoMod.Rainbow.CurrentTechnique.Passes["Rainbow"].Apply();
```

这样`uTime`的值就被设置成了`Main.time`的值。注意，参数类型必须匹配，而且你**不能向shader里没有被声明的参数赋值**，否则就会出现`NullReference`等异常。

为了实现彩虹色的效果，我们需要用一种新的颜色生成方法。众所周知，颜色可以表示为RGB色，分别代表红绿蓝三色的强度。但是这种表示方法显然很难完成我们想要的彩虹色功能，否则我们需要好几次线性插值来生成颜色

这样`uTime`的值就被设置成了`Main.time`的值。注意，参数类型必须匹配，而且你**不能向shader里没有被声明的参数赋值**，否则就会出现`NullReference`等异常。

为了实现彩虹色的效果，我们需要用一种新的颜色生成方法。众所周知，颜色可以表示为RGB色，分别代表红绿蓝三色的强度。但是这种表示方法显然很难完成我们想要的彩虹色功能，否则我们需要好几次线性插值来生成颜色

![图片](images/tutorials/22701ac932c6a53cec17394b.png)

不过好在我们颜色的表示方法不止RGB，还有一种常用的方法叫做HSV/HSL表示法。 **HSV即色相、饱和度、明度（Hue, Saturation, Value）** 表示法，和我们熟悉的RGB色不同，仅用H就能表示主体颜色，其他两个值只是在主体颜色下变化。而H主要是以角度（弧度？）表示的，如下图所示，代表了一个圆外圈的颜色。

![图片](images/tutorials/edb2b36b5c16e375b2922115.png)

这样外圈的一层就是天然的彩虹色，我们只需要用一个线性插值绕着外面走一圈就是彩虹色贴图了。HSV转RGB也很简单：

```csharp
float ffabs(float val){
    return sqrt(val *val);
}
float ffmod(float v, float m){
    int f = floor(v / m);
    return v - f * m;
}
float3 HUEtoRGB(float H)
{
    float R = ffabs(H * 6 - 3) - 1;
    float G = 2 - ffabs(H * 6 - 2);
    float B = 2 - ffabs(H * 6 - 4);
    return saturate(float3(R,G,B));
}
```

我之所以写了一堆标准库有的函数是因为，XNA的shader编译器不知道为什么，有些标准库函数用了没法通过编译，尤其是应用在传入参数的时候，甚至abs（取绝对值）函数连if都不能用（等我解决了这个问题再删掉这些丑陋的代码）。所以其实给XNA写着色器真的是一个相当痛苦的过程。

主体代码还是比较好写的，直接取颜色，然后对原版时间做取模和线性插值即可

```csharp
float4 rainbow(float2 coords : TEXCOORD0) : COLOR0 {
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;
    return float4(HUEtoRGB(ffmod(uTime * 0.01 + coords.x, 1)), color.a);
}
```

最后要做的就是就是**定义一个叫 Rainbow 的渲染通道，**

**用对应版本（这里是2.0）的像素着色器去跑** **`rainbow()` 这个函数**，

简单来讲就是让**`rainbow()`** 函数成为一个真的PixelShader

```csharp
pass Rainbow {
    PixelShader = compile ps_2_0 rainbow();
}
```

将fx编译成xnb获取进入游戏....

于是我们就有两个横向动态彩虹色的NPC了。

![图片](images/tutorials/35274a2f6173beae390b2f0a.gif)

如果是竖向应该怎么搞呢？斜的又怎么搞呢？提示：`coords.y` 和 `+`

```csharp
sampler uImage0 : register(s0);

float uTime;   // 外部通过名字赋值，不需要在这里初始化

// 因为 XNA 的 ps_2_0 编译器对标准库函数支持很烂，
// 所以自己手写 abs 和 mod
float ffabs(float val) {
    return sqrt(val * val);
}

float ffmod(float v, float m) {
    int f = floor(v / m);
    return v - f * m;
}

// HSV 里的 H（色相）转 RGB
float3 HUEtoRGB(float H) {
    float R = ffabs(H * 6 - 3) - 1;
    float G = 2 - ffabs(H * 6 - 2);
    float B = 2 - ffabs(H * 6 - 4);
    return saturate(float3(R, G, B));
}

// 横向彩虹：色相随 x 变化，同时随时间流动
float4 rainbow(float2 coords : TEXCOORD0) : COLOR0 {
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;
    return float4(HUEtoRGB(ffmod(uTime * 0.01 + coords.x, 1)), color.a);
}

technique Technique1 {
    pass Rainbow {
        PixelShader = compile ps_2_0 rainbow();
    }
}
```

---

### **人体描边（Stroke）**

描边效果的原理很简单，就是对于每个透明像素，我们都看看周围8格内是否有不是透明的像素，如果有，那么这个点的颜色就要是白色。（想一想，会什么不会把所有背景都染白？）

不过实际实现的时候我们要注意几个问题，第一就是**贴图坐标**。着色器里的贴图坐标和颜色一样，也是由 `[0~1]` 的向量组成（为什么非要弄到 0 到 1 之间？我也不知道）。而且与 tr 世界坐标一样，左上角都是 `(0,0)`，右下角是 `(1,1)`。如果我们想要获取相邻的像素，我们就必须知道原贴图的大小，不过虽然我们之前有采样器（Sampler），但是它没法获取贴图大小，我们必须手动给着色器传参。

先定义好图像大小，因为有宽度和高度，我们需要用二维向量来表示

```csharp
float2 uImageSize;
```

接下来就是暴力的传参时间

```csharp
DemoMod.Stroke.Parameters["uImageSize"].SetValue(TextureAssets.Npc[npc.type].Value.Size());
```

我们直接传入了原贴图的大小，你可能会有疑惑，万一这个NPC有帧图怎么办，不会出现坐标对不上的情况吗？这里我们就需要注意一下，XNA的绘制都是先绘制再剪裁的，所以在绘制的时候就是把整个贴图绘制出来，最后剪裁出来想看见的部分。所以在这种情况下，贴图的坐标其实是相对于原贴图，而不是剪裁的部分的。

那么得到图像尺寸以后，每一个像素的坐标值就很明确了，横向就是 `1/Width` 纵向就是 `1/Height`。然后我们就可以利用这一点找到周围像素的颜色，然后进行判定了：

![图片](images/tutorials/9f57dd2a3fe805727db0fc0a.gif)



```csharp
sampler uImage0 : register(s0);
float uTime;
float2 uImageSize;
float4 edge(float2 coords : TEXCOORD0) : COLOR0
{ 
    float4 color = tex2D(uImage0, coords);
    if (any(color))
        return color;
    // 获取每个像素的正确大小
    float dx = 1 / uImageSize.x;
    float dy = 1 / uImageSize.y;

    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            float4 c = tex2D(uImage0, coords + float2(dx * i, dy * j));
            // 如果任何一个像素有颜色
            if (any(c))
            {
                return float4(1, 1, 1, 1);
            }
        }
    }
    return color;
}
technique Technique1
{
    pass Edge
    {
        PixelShader = compile ps_2_0 edge();
    }
}
```

---

### 踩雷避坑（debug）

但是先别高兴太早，我们的描边代码看起来很合理对吧？逻辑简单，直觉上完全没问题。

但是我们把它丢到编译器里……

![图片](images/tutorials/bf33e71d3970342c9cf0c941.png)

哎，怎么报错了？看看EasyXnb\_Log里怎么说

```csharp
EasyXnb编译失败

时间：2026-09-18 22:52:30

问题出自：

Microsoft.Xna.Framework.Content.Pipeline.InvalidContentException: Errors compiling D:\ZMWJJ\EasyXnb\Stroke.fx:
(14,10): error X5608: Compiled shader code uses too many arithmetic instruction slots (73). Max. allowed by the target (ps_2_0) is 64.
(32,23): ID3DXEffectCompiler::CompileEffect: There was an error compiling expression
ID3DXEffectCompiler: Compilation failed
   在 Microsoft.Xna.Framework.Content.Pipeline.Processors.EffectProcessor.DoSomethingAwesomeWithErrorsAndWarnings(Boolean success, String errorsAndWarnings, EffectContent input, ContentProcessorContext context)
   在 Microsoft.Xna.Framework.Content.Pipeline.Processors.EffectProcessor.Process(EffectContent input, ContentProcessorContext context)
   在 DynamicFontGenerator.GeneratorGame.CompileEffects()
   在 DynamicFontGenerator.GeneratorGame.Initialize()
```

**EasyXnb\_Log** 告诉我们 你的着色器用了 **73 条算术指令（ALU）**，但 `ps_2_0` 这个编译目标最多**只允许 64 条指令** 所以无法编译。



可如果把我们的代码丢到**算术指令（ALU）分析网站**里，会发现我们的代码消耗**算术指令只有 20 条左右**，具体分解：

- 2 条 `rcp`（计算 dx, dy）

- 9 条 `mad`（计算 9 个采样坐标）

- 9 条 `slt`/`cmp`（`any(c)` 判断是否有颜色）

- 少量用于返回值构造的 `mov`

  **纹理指令：9 条** **`tex`**

  那么为什么**EasyXnb\_Log** 说我们的着色器用了 **73 条算术指令**呢？

  这里其实有两个互相叠加的问题。

  

  **1 循环边界不是编译期常量**

  **Shader Model**对 `for` 循环的要求极其苛刻。循环的迭代次数**必须在编译时就能确定**，不能依赖运行时变量 。你写 `i = -1; i <= 1` 看起来是常量，但 `i++` 这种自增在 ps\_2\_0 的语义里不是“编译期常量”，编译器无法在编译阶段把它展开成固定指令。

  **2 动态分支限制（最致命的问题）**

  ps\_2\_0 **完全不支持流控制（flow control）**。这意味着：

- 我们写的 `if` 语句在 ps\_2\_0 里不能产生真正的“分支跳转”

- 编译器只能尝试把它**展开成两条路径都执行**，然后用条件选择。

  但 `if` 里包含了 `return`  提前返回意味着后续代码是否执行取决于运行时结果，只能一起强制展开，`if` `any(c)` `return` `float4(1, 1, 1, 1)` 一起大概5\~7**条算术指令**，7\*9=63 还要和其他代码占用的**算术指令**叠加，轻轻松松超过最大支持 **64** 条。

  

  **手动延展**

  既然已经知道问题出在哪了，那接下来该怎么改呢？其实这个问题不只困扰着我们，有不少老外也踩过过同样的坑，下面就是其中一位给出的解法：

  ```csharp
  float4 edge(float2 coords : TEXCOORD0) : COLOR0
  {
      float4 color = tex2D(uImage0, coords);
      if (!any(color))
          return color;
  
      float dx = 1.0 / 512.0;
      float dy = 1.0 / 512.0;
  
      if (any(tex2D(uImage0, coords + float2(-dx, -dy))))
          return float4(1, 1, 1, 1);
      if (any(tex2D(uImage0, coords + float2(0, -dy))))
          return float4(1, 1, 1, 1);
      if (any(tex2D(uImage0, coords + float2(dx, -dy))))
          return float4(1, 1, 1, 1);
  
      if (any(tex2D(uImage0, coords + float2(-dx, 0))))
          return float4(1, 1, 1, 1);
      if (any(tex2D(uImage0, coords + float2(dx, 0))))
          return float4(1, 1, 1, 1);
  
      if (any(tex2D(uImage0, coords + float2(-dx, dy))))
          return float4(1, 1, 1, 1);
      if (any(tex2D(uImage0, coords + float2(0, dy))))
          return float4(1, 1, 1, 1);
      if (any(tex2D(uImage0, coords + float2(dx, dy))))
          return float4(1, 1, 1, 1);
  
      return color;
  }
  ```

  既然编译器用循环会出问题，那就不用了。9 个相邻像素，直接一个一个写出来（这很老外）。

  

  **统一判断**

  裙子给出过一个蛮取巧的解决方法，既然问题出在“循环里带提前返回”，那就**别提前返回**。用一个 `bool found` 在循环里累积结果，循环结束后再统一判断。

  在ps\_2\_0 的有限流控制能力下，`if` 的条件在编译时可以被**展平为条件指令**（而不是真正的跳转），编译器就能处理。`found = true` 这种赋值可以被展平成“条件满足时把 true 写进 found”，没有控制流跳转。不会被一起强制展开。

  ```csharp
  sampler uImage0 : register(s0);
  float uTime;
  float2 uImageSize;
  float4 edge(float2 coords : TEXCOORD0) : COLOR0
  {
      float4 color = tex2D(uImage0, coords);
      if (any(color))
          return color;
      // 获取每个像素的正确大小
      float dx = 1 / uImageSize.x;
      float dy = 1 / uImageSize.y;
      bool flag = false;
      // 对周围8格进行判定
      for (int i = -1; i <= 1; i++)
      {
          for (int j = -1; j <= 1; j++)
          {
              float4 c = tex2D(uImage0, coords + float2(dx * i, dy * j));
              // 如果任何一个像素有颜色
              if (any(c))
              {
                  // 打标记
                  flag = true;
              }
          }
      }
      
      // 统一判断
      if (flag)
          return float4(1, 1, 1, 1);
      
      return color;
  }
  technique Technique1
  {
      pass Edge
      {
          PixelShader = compile ps_2_0 edge();
      }
  }
  ```

  但是以上这两种解决方法我都不推荐，因为我能只修改一个字解决这个问题：

  ```csharp
  technique Technique1
  {
      pass Edge
      {
          PixelShader = compile ps_3_0 edge();
      }
  }
  ```

  解决方法很简单，就是将**Shader Model 2.0 (ps\_2\_0)** 换成 **Shader Model 3.0 (ps\_3\_0)**。

  先放个表：

  |**对比项**|**ps\_2\_0**|**ps\_3\_0**|
  |---|---|---|
  |最大算术指令|64|512+|
  |流控制支持|**无**|**完整支持**（if/break/loop，嵌套深度 24）|
  |循环支持|极有限，边界必须常量|**完整** **`for` /** **`while` /** **`rep`**|
  |动态分支|不支持|支持|
  |常量寄存器|32|224|

  
  我们把ps\_2\_0 换成了ps\_3\_0，就意味着2\_0的 64 条算术指令限制变成了512+直接扩充了**八倍**空间。

  更重要的是，ps\_3\_0 **原生支持动态流控制**。你写的循环和 `if` 不再需要手动展开或绕弯，编译器直接生成分支指令。代码量减少，可读性提高，改一个参数就能从 3×3 变成 5×5。

  而且对于描边这种“大部分像素只需一次纹理读取、只有边缘少数像素需要多采样”的场景，ps\_3\_0 的动态分支优势非常明显，内部像素能直接跳过所有邻域采样，不用像ps\_2\_0 一样被迫绕弯。

  ![图片](images/tutorials/0e16ed25b94fd8e9f15176c0.jpeg)

  嗨嗨，虽然ps\_3\_0 十分强大，但ps\_2\_0也不是一无是处，ps\_2\_0 因为不支持真正的动态分支，编译器把分支展平成条件指令，避免了分支开销，处理时反而比 ps\_3\_0 的“真分支”更快。（这个更快指的是代码层面上的时间对比，现实层面没有任何区别）

  简单说就是想搞极致优化的用2.0，正常编写默认推荐使用3.0，虽然理论上3.0会有一些兼容性问题，但是2.0是 2002 年的老规范，3.0 是 2004 年的规范，比大部分群里的群友都大。

  除非你的电脑是00年前的老古董，不然不会出现任何问题。

  

  那么这个时候就有人问了，既然**Shader Model 3.0**是 2004 年的规范，那么有没有**Shader Model 4.0**呢？ 有的兄弟，有的~~（现在的 Shader Model 已经到~~ ~~**6.10** 了）~~

  

  Shader Model 4 是微软在 DirectX 10 时代引入的规范，算是对 3.0 的一次大规模重写。它最核心的变化，是彻底取消了之前那种按“顶点/像素”分别限制指令数的做法，把整套着色器统一到一个通用的核心上，所有可编程阶段都共用同一套能力。

  它带来的几个关键提升：

- **指令数不再受限**：SM 3.0 里 512 条算术指令的上限，在 SM 4.0 里直接取消了，顶点和像素着色器都没有最大值限制。

- **几何着色器（Geometry Shader）**：这是 4.0 新增的管线阶段，能直接在 GPU 上创建或修改几何体，比如把点扩展成面，或者做更复杂的粒子效果。

- **纹理采样更灵活**：引入了“模板化纹理对象”，采样操作不再和固定的采样器寄存器绑死，代码可以写得更通用。

- **寄存器访问方式改变**：不再直接操作寄存器，而是通过常量缓冲区和纹理缓冲区来访问，配合 HLSL 语义，数据打包更自由。

  

  看起来很强是吧？但是！**它不支持泰拉瑞亚！！！**泰拉瑞亚使用的框架和SM 2.0,SM 3.0一样也是个老古董，名字叫XNA Game Studio 4.0 ，支持的Shader Model 只有 Profile：Reach（SM 2.0）和 HiDef（SM 3.0）。~~但凡你red叔叔晚写几天，说不定泰拉就用SM 4.0的新框架了。~~

  **ps\_3\_0：完整代码：**

  ```csharp
  sampler uImage0 : register(s0);
  float uTime;
  float2 uImageSize;
  float4 edge(float2 coords : TEXCOORD0) : COLOR0
  {
      float4 color = tex2D(uImage0, coords);
      if (any(color))
          return color;
      // 获取每个像素的正确大小
      float dx = 1 / uImageSize.x;
      float dy = 1 / uImageSize.y;
      for (int i = -1; i <= 1; i++)
      {
          for (int j = -1; j <= 1; j++)
          {
              float4 c = tex2D(uImage0, coords + float2(dx * i, dy * j));
              // 如果任何一个像素有颜色
              if (any(c))
              {
                  return float4(1, 1, 1, 1);
              }
          }
      }
      return color;
  }
  technique Technique1
  {
      pass Edge
      {
          PixelShader = compile ps_3_0 edge();
      }
  }
  ```

  ---

### **屏幕着色器——高斯模糊**

**高斯模糊（ Gaussian Blur ）**算是一个经典的滤镜、屏幕着色器的应用了。它的算法也十分简单，就是把周围8格（包括自己9格）内的像素通过二维正态分布加权填充到当前像素。

我们知道，普通的正态分布公式是

![图片](images/tutorials/f1ab98ef0292107ce44e286a.png)

其中 **`μ`** 是均值，**`σ2`** 是方差，它的图像大家想必在 *随机数生成入门*~~*（还没搬运）*~~ 已经看过了，但是这里主要还是要它的二维表示形式，设原点为0有二维方程：

![图片](images/tutorials/63bd5d1f8ddc85cf144922ba.png)

为什么这样的函数能造成模糊的效果呢？因为你的像素都加上了周围像素的值，所以他就会更像它的周围环境，人眼看上去，很多细节就被这种混合操作抹去了，自然就模糊了。但是为什么非要是正态分布比例？可能因为这样效果比较好，你当然可以试试均摊，这里给几张实例图，你们也可以在游戏里面自己体会一下。

![图片](images/tutorials/800b773cab7271758d3e4230.jpeg)

原图

![图片](images/tutorials/fd3edf994b9a202c5645b7fc.png)

均摊模糊效果

![图片](images/tutorials/a957ad4d75ba9e9c158f0819.png)

高斯模糊效果



貌似看不出来什么差别。。。但是增大半径我怕这个编译器直接炸掉，所以就算了。

注意，我们实际使用的时候，不需要实时计算正态分布函数的值（就算算出来了还要归一化），而是预先计算好做好归一化以后直接存到一个数组里面，着色器做加权平均的时候直接使用数组里的值。

这里我提供一个比较标准的1像素半径的加权矩阵：

```csharp
float gauss[3][3] = {
    0.075, 0.124, 0.075,
    0.124, 0.204, 0.124,
    0.075, 0.124, 0.075
};
```

如有需要调整参数，可以自己根据那个公式自己计算出来，但是要记得归一化（就是加起来是1），否则就会出现像素过亮或者过暗的情况。

代码很简单：

```csharp
float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0 {
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;
    float dx = 2 / uScreenResolution0.x;
    float dy = 2 / uScreenResolution0.y;
    color = float4(0, 0, 0, 0);
    for(int i = -1; i <= 1; i++) {
        for(int j = -1; j <= 1; j++) {
            color += gauss[i + 1][j + 1] * tex2D(uImage0, float2(coords.x + dx * i, coords.y + dy * j));
        }
    }
    return color;
    
}
```

完整代码：

```csharp
sampler uImage0 : register(s0);
float2 uImageSize0;

// 预计算并归一化好的 3x3 高斯矩阵（加起来 = 1.0）
// 0.075 + 0.124 + 0.075
// 0.124 + 0.204 + 0.124
// 0.075 + 0.124 + 0.075  =  1.000
static const float gauss[3][3] =
{
    0.075, 0.124, 0.075,
    0.124, 0.204, 0.124,
    0.075, 0.124, 0.075
};

float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0
{
    float4 color = tex2D(uImage0, coords);

    // 全透明像素直接跳过，省点开销（透明背景不动）
    if (!any(color))
        return color;

    // 每个像素在 UV 空间的大小（半径 1 像素）
    float dx = 1 / uImageSize0.x;
    float dy = 1 / uImageSize0.y;

    color = float4(0, 0, 0, 0);

    for (int i = -1; i <= 1; i++)
    {
        for (int j = -1; j <= 1; j++)
        {
            color += gauss[i + 1][j + 1] *
                     tex2D(uImage0, float2(coords.x + dx * i, coords.y + dy * j));
        }
    }

    return color;
}

technique Technique1
{
    pass Test
    {
        PixelShader = compile ps_2_0 PixelShaderFunction();
    }
}
```

但是现在问题来了，怎么把这个函数应用到整个屏幕上呢？我们是不是得在屏幕绘制之前apply这个特效呢？确实是的，但是不用我们来做，泰拉瑞亚已经内置了很多着色器的工具。`Filters.Scene`就是一个很好用的屏幕特效管理器，是泰拉瑞亚原版自带的。不过在此之前我们先要写一个`ScreenShaderData`来配置屏幕着色器的参数，并且只有通过`ScreenShaderData`，我们才能使用`Filters`的功能。

随便找个文件夹，新建一个类，继承`ScreenShaderData`：

```csharp

public class TestScreenShaderData : ScreenShaderData
{
    public TestScreenShaderData(string passName) : base(passName)
    {
    }
    public TestScreenShaderData(Asset<Effect> shader, string passName) : base(shader, passName)
    {
    }
    public override void Apply()
    {
        base.Apply();
    }
}
```

接下来转到Mod主类，在Load里面除了加载特效文件，我们还要给`Filters.Scene`注册上新建的`ScreenShaderData`：

```csharp
// 注意设置正确的Pass名字，Scene的里面名字可以随便填，不和别的Mod以及原版冲突即可
Filters.Scene["DemoMod:GBlur"] = new Filter(
    new TestScreenShaderData(ModContent.Request<Effect>("DemoMod/Effects/GBlur", mode), "Test"), EffectPriority.Medium);
Filters.Scene["DemoMod:GBlur"].Load();
```

关于 `Filters.Scene` 的命名，**没有强制性的标准格式**，但有一个核心原则：**必须保证唯一性，不能和原版或其他 Mod 冲突。**我们这种“模组名:效果名”的写法，就是一种很常见的做法。也可以用 `Mod.Name` 获取模组名字符串自动填写模组名。

接下来我们随便找个Update类函数来开启这个滤镜：

```csharp
public class DemoModSystem : ModSystem
{
    public override void PreUpdateEntities()
    {
        if (!Filters.Scene["DemoMod:GBlur"].IsActive())
        {
            // 开启滤镜
            Filters.Scene.Activate("DemoMod:GBlur");
        }
    }
}
```

然后编译加载进入游戏即可看到效果？并不可以，你一定会得到NullReference异常，因为泰拉瑞亚自带的`ScreenShaderData`给脚本传递了很多参数，如果你没有把这些参数填在脚本里面就会出错。我们可以通过源码看一下都有哪些参数要填：

![图片](images/tutorials/56b2f16af9f1f124d7a26056.png)

哦，那真的……

不过不要怕，我这里给你们准备了一个屏幕着色器脚本的模板，只要把这些代码填到开头就可以使用TR的屏幕着色器了：

```csharp
sampler uImage0 : register(s0);
sampler uImage1 : register(s1);
sampler uImage2 : register(s2);
sampler uImage3 : register(s3);

float3 uColor;
float3 uSecondaryColor;

float4 uSourceRect;

float2 uScreenResolution;
float2 uScreenPosition;
float2 uTargetPosition;
float2 uImageOffset;
float2 uDirection;
float2 uZoom;
float2 uImageSize0;
float2 uImageSize1;
float2 uImageSize2;
float2 uImageSize3;
float2 uSceneSize;
float2 uSceneOffset;

float uOpacity;
float uTime;
float uIntensity;
float uProgress;
float uSaturation;

bool uMultiChunkScene;
```

增量式排列表 用于调整各个泰拉版本：

```csharp
//1.3 参数
sampler uImage0 : register(s0);
sampler uImage1 : register(s1);
float3 uColor;
float uOpacity;
float3 uSecondaryColor;
float uTime;
float2 uScreenResolution;
float2 uScreenPosition;
float2 uTargetPosition;
float2 uImageOffset;
float uIntensity;
float uProgress;
float2 uDirection;
float2 uZoom;
float2 uImageSize0;
float2 uImageSize1;

// 1.4.0 新增
sampler uImage2 : register(s2);
sampler uImage3 : register(s3);
float2 uImageSize2;
float2 uImageSize3;
float uSaturation;
float4 uSourceRect;


// 1.4.5.8 新增
float2 uSceneSize;
float2 uSceneOffset;
bool uMultiChunkScene;
```

正常效果：

![图片](images/tutorials/a463a39c1fb4e144cd6dbecb.gif)

开启shader效果：

![图片](images/tutorials/436547f36c5d82f1ef5f8336.gif)

---

### **屏幕着色器——放大镜**

进行图片放大的原理也很简单，如果本来这个像素距离中心的距离是 *`d`*，你却要它显示距离中心小于 *`d`* 的像素，画面就会被放大。

听起来有点绕，我们上个图：

![图片](images/tutorials/f0f9471f16c682e15e9e7ebe.png)

原本只显示蓝色区域的那部分画面，现在被拉伸投射到了红色区域的范围里。



知道原理后就可以写代码了：

```csharp
float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0
{
    float4 color = tex2D(uImage0, coords);

    // 全透明像素直接跳过（屏幕滤镜里一般不会触发，可留可删）
    if (!any(color))
        return color;

    // 屏幕中心
    float2 pos = float2(0.5, 0.5);

    // 中心到当前点的向量（UV 空间）
    float2 offset = coords - pos;

    // 用屏幕长宽比修正，保证放大是圆的而不是椭圆的
    float2 rpos = offset * float2(uScreenResolution.x / uScreenResolution.y, 1);
    float dis = length(rpos);

    // 向量缩短 0.8 倍 → 放大 1/0.8 = 1.25 倍
    return tex2D(uImage0, pos + offset * 0.8);
}

technique Technique1
{
    pass Test
    {
        PixelShader = compile ps_2_0 PixelShaderFunction();
    }
}
```

正常无shader

![图片](images/tutorials/f7dd86cd073ba9c568713992.png)

开启shader

![图片](images/tutorials/07f363a5f3457c5e360354cb.png)



这个放大镜shader还可以弄一些扩展玩法：

比如我们让这个向量里中心越近变化越大，做一个线性插值，会有一个很诡异的效果：

![图片](images/tutorials/fa9a723e4c388d77abf6eaa3.png)

我的肚子真是肥嘟嘟的\~

```csharp
return tex2D(uImage0, pos + offset * dis * 0.8);
```



或者限制放大的上限，让滤镜变得柔和一点

![图片](images/tutorials/11bab50d8a8af62b6c3d7f2b.png)

减肥成功了

```csharp
return tex2D(uImage0, pos + offset * max(0.3, dis));
```



缩小也是同理，只不过这个向量的长度要增大。

[视频链接](https://b23.tv/xenlufD)

```csharp
return tex2D(uImage0, pos + offset * sin(5 * dis));
```

你们可以想一想，在这种情况下缩放倍率该如何计算？

---

### **屏幕着色器——扭曲**

如果你完全理解了之前的缩放算法，那么扭曲就变得极为简单了，只要你把之前的缩放向量变成旋转向量即可。要旋转一个二维向量有一个很好用的方法就是利用二维旋转矩阵：

![图片](images/tutorials/090245921458136302d8874e.png)

不过使用旋转矩阵的时候要注意，确保这个向量是从原点出发的，因为旋转是按照原点旋转的。我们的offset向量是从中心发射到各个向量的，所以是严格遵循这个条件的。

让我们来测试一下，先将屏幕旋转90度

![图片](images/tutorials/a170a8c632540f8beb7df74a.png)

我再也不会肥嘟嘟了（）

```csharp

float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0
{
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;
    // pos 就是中心了
    float2 pos = float2(0.5, 0.5);
    // offset 是中心到当前点的向量
    float2 offset = (coords - pos);
    // 因为长宽比不同进行修正
    float2 rpos = offset * float2(uScreenResolution.x / uScreenResolution.y, 1);
    float dis = length(rpos);
    float r = 1.57;
    // 将向量旋转90度
    float2 target = mul(offset, float2x2(cos(r), -sin(r), sin(r), cos(r)));
    return tex2D(uImage0, pos + target);
}

technique Technique1
{
    pass Test
    {
        PixelShader = compile ps_2_0 PixelShaderFunction();
    }
}
```

然后我们把旋转的角度改一改，就有扭曲效果了：

![图片](images/tutorials/983e7a30c15ee22f747e88e6.png)

```csharp

float4 PixelShaderFunction(float2 coords : TEXCOORD0) : COLOR0
{
    float4 color = tex2D(uImage0, coords);
    if (!any(color))
        return color;

    float2 pos = float2(0.5, 0.5);
    float2 offset = coords - pos;

    // 长宽比修正
    float2 rpos = offset * float2(uScreenResolution.x / uScreenResolution.y, 1);
    float dis = length(rpos);

    // 距离越近，旋转角度越大（漩涡）
    float r = 3.0 * (1.0 - saturate(dis / 0.5));

    // 旋转
    float c = cos(r);
    float s = sin(r);
    float2 target = mul(offset, float2x2(c, -s, s, c));

    return tex2D(uImage0, pos + target);
}

technique Technique1
{
    pass Test
    {
        PixelShader = compile ps_2_0 PixelShaderFunction();
    }
}
```

我们的扭曲效果看上去有些简陋，但如果我们加上插值，甚至三角函数呢......

---

## 结尾

好了，shader就介绍到这里，想必大家也看到着色器强大的威力了，本章算是给着色器进行了一个简要的介绍。着色器威力虽然强大，但是能用的地方并不是很多，同时着色器写的比较复杂会给显卡带来较大的压力，再加上XNA一言难尽的支持。。。

不过如果脱离泰拉瑞亚着色器倒是有很大的用处，不过那是后话了，有机会再介绍吧。



![图片](images/tutorials/6155a56fff58c420bf10c220.png)

摸了。                

---



*©2026 冬天的叶 &amp; dxtst\| 仅供个人学习，禁止商用二次分发*

