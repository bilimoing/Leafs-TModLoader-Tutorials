作者：LogSpiral 2026/10/5 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

Begin同样也有很多个重载，参数较少的重载只是相较于完整版，参数有默认填写内容，因此这里将会讲解完整重载中各个参数的含义与用法

# SpriteSortMode

精灵图排序模式，是枚举类型，一共五个模式

## Deferred

延迟模式，所有的实际绘制延迟到End中进行，是SpriteBatch默认的排序模式

按Draw的调用顺序提交绘制内容进行绘制，忽略深度信息

## Immediate

立即模式，调用Draw的时候立即将内容绘制到屏幕上，而不是延迟到End的时候

因此同样会忽略深度信息，并且因为每次Draw都会立刻创建并提交顶点信息，性能相对较差

## Texture

纹理模式，和Deferred一样会延迟到End中提交顶点信息，但是会以传入的精灵图哈希值作为顺序进行排序，同样精灵图的会排在一起，减少了纹理切换，因此性能会比Deferred模式更好一些

## BackToFront

由后到前，同样延迟，但是会根据深度信息进行排序，depth更小的先绘制

**注意，这个深度仅影响当前批次的绘制顺序，不会跨批次生效**

**需要深度缓冲请看后续的DepthStencilState**

## FrontToBack

由前到后，同样延迟，但是会根据深度信息进行排序，depth更大的先绘制

**注意，这个深度仅影响当前批次的绘制顺序，不会跨批次生效**

**需要深度缓冲请看后续的DepthStencilState**

# BlendState

混合状态，控制**新画上的像素**和**原先的像素**之间**各个通道独自**的混合方式

新画上的像素称为**Source**，原先有的像素称为**Destination**

归一化的RGB通道用 $C$ 指代，归一化的Alpha通道用 $A$ 指代

最终混合的结果采用以下公式：

$C=({{B}_{Cs}}\cdot {{C}_{s}}){{\odot }_{C}}({{B}_{Cd}}\cdot {{C}_{d}})$

$A=({{B}_{{{A}_{s}}}}\cdot {{A}_{s}}){{\odot }_{A}}({{B}_{Ad}}\cdot {{A}_{d}})$

## 混合系数 Blend

大写字母 $B$ 相应的符号表示混合系数，比如 ${{B}_{{{C}_{s}}}}$ 就表示新像素的颜色混合系数，与ColorSourceBlend属性相对应

它们是一系列 Blend 类型的枚举

可选的值如下(金山文档这边公式不是很好用所以主播直接截图了)

![图片](http://www.kdocs.cn/api/v3/office/copy/TnRnYTdPazZ2V3dXYjF0ZjJEN05sQXczanNaKzRPaWlabitRb1R0QjhJS3czRVcwcmswcnlaUkFJL2xRSXhGS29MZkNMYmRWQ3hmVDJqQUtlM3dPektyQk1YUmJEdGtMQnc3QzlVZ3RoSFM3Szk2THhOb3pHeGh5K25IZk1EOGxycHBMRmRKUFBUemd1Tm0xZ2NUL0VGdnQybXBldXkzN0FpS1ZVbU1keG1QWnRmQTB6bDh1WUNlSVFzbDZSb1VSeURhalI4Nzc0N0JoMU5CTkhWenA5MFRPQzZpM2N5dmVpRlAwQVZ5K3ZOQlpCS1FMcm0wVHp1M2RMRU9KOGZKRWxZMjF5aGxMVjRrPQ==/attach/object/CTXG4TZKABABO?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6IkNUWEc0VFpLQUJBQk8iLCJvd25lciI6IjU2OTk1ODM4NzkwMCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MTE1NCwiaGVpZ2h0Ijo3MDV9)

## 混合函数 BlendFunction

**默认采用加法**

上面夹在两对括号中间的那个符号$\odot$表示指定的混合函数，比如$\odot_{C}$表示颜色部分的混合系数，与ColorBlendFunction属性相对应

它们是 BlendFunction 类型的枚举

可选的值如下

|**值**|**释意**|
|---|---|
|Add|加法|
|Subtract|Source项 - Destination项|
|ReverseSubtract|Destination项 - Source项|
|Max|Source项和Destination项的逐位最大值|
|Min|Source项和Destination项的逐位最小值|


## 混合因子 BlendFactor

**如果混合系数不使用BlendFactor可以忽略这个属性**

上面介绍混合系数的时候出现了角标 $b$

这部分值由混合因子属性提供，也就是Color类型的BlendFactor属性

## 写入通道 ColorWriteChannels

**默认情况下为写入所有通道，不需要单独配置**

有时候我们并不希望所有通道都参与混合，这时我们可以设置ColorWriteChannels等属性

它们是 ColorWriteChannels 类型的枚举，用四位二进制数控制

按从高位到低位的写法，0001表示写入红色通道，0010表示写入绿色通道，0100表示写入蓝色通道，1000表示写入Alpha通道，1111表示全部通道，0000表示没有通道被写入，这样

不同枚举值之间可以使用位运算进行组合，比如Red \| Green表示红色和绿色通道，即0011

BlendState中与之相关的有四个属性：

ColorWriteChannels

ColorWriteChannels1

ColorWriteChannels2

ColorWriteChannels3

分别给渲染目标0(主渲染目标) 1 2 3使用，即后三者是用于多渲染目标任务

## 多重采样位掩码 MultiSampleMask

**默认情况下写入所有采样点，不需单独配置**

是一个int值，对于一个N位采样的渲染目标，该值最低N位控制相应N个采样点能否被写入

默认为-1，也即32位全为1，也即所有采样点都可被写入

在泰拉我们一般不采用多重采样渲染目标，可以忽略这个值(x)

## 预设

BlendState类提供了四个预设

**Additive**

加法混合，公式如下

$C=({{A}_{s}}\cdot {{C}_{s}})+(1\cdot {{C}_{d}})={{A}_{s}}\cdot {{C}_{s}}+{{C}_{d}}$

$A=({{A}_{s}}\cdot {{A}_{s}})+(1\cdot {{A}_{d}})={{A}_{s}^{2}}+{{A}_{d}}$

新颜色的Alpha值可以看作新颜色的\*影响因子\*，为0时对原颜色不会有任何影响，随着增大线性地将自身的颜色叠加在原先像素的颜色上(如果原先Alpha值已经是1的的话)

适用于那种技能光效互相叠加的场景

光污染万恶之源

**AlphaBlend**

Alpha通道混合，公式如下

$C=1\cdot {{C}_{s}}+[(1-{{A}_{s}})\cdot {{C}_{d}}]={{C}_{s}}+(1-{{A}_{s}})\cdot {{C}_{d}}$

$A=1\cdot {{A}_{s}}+[(1-{{A}_{s}})\cdot {{A}_{d}}]={{A}_{s}}+(1-{{A}_{s}})\cdot {{A}_{d}}$

是默认的混合模式

这里需要补充一个概念：预乘像素和非预乘像素

我们平时一般用非预乘像素来描述颜色，因为这样子比较方便调整透明度、拥有更完整的颜色空间

比如一个75%不透明度的纯红色我们可以这样表示(1.0, 0, 0, 0.75)

而对于图形渲染来说，预乘像素的计算更简单，等效的混合效果更容易计算，在XNA中默认采用的就是给预乘像素的透明度模式的混合

非预乘像素转预乘像素很简单，给前面rgb部分都乘上alpha通道就可以了

上面举例的那个颜色在预乘模式下表示就是(0.75,0, 0, 0.75)

现在再回头看那个混合公式，如果转写为非预乘像素等效的混合公式，应该是这样的：

${{C}_{s}}={{A}_{s}}\cdot {{C}_{s}}'$

$C={{A}_{s}}\cdot {{C}_{s}}'+(1-{{A}_{s}})\cdot {{C}_{d}}=lerp({{C}_{d}},{{C}_{s}}',{{A}_{s}})$

$A=lerp({{A}_{d}},1,{{A}_{s}})$

也就是根据Alpha值从原颜色线性插值到新的颜色，因此称为Alpha混合

基于这个特性我们还能做点设计之外的事情，如果我们硬要把非预乘的颜色塞给适用于预乘线性混合的模式呢？

更极端一点的例子，直接让 $A_{s}$ 始终为0，这时我们再看上面的混合公式，就变成了

$C={{C}_{s}}+{{C}_{d}}$

$A={{A}_{s}}+{{A}_{d}}$

这样我们就能得到**类似于**Additive混合的东西，我们根据需要在外部再人为修改 $C_{s}$ 项的值(比如实际传入之前再乘个系数)，就可以把AlphaBlend当成Additive来用了！

这个技巧好处是你不需要繁琐地调用End Begin来切换绘制状态参数，不需要人工恢复前后状态，不会中断SpriteBatch的合批，从而有更好一些的性能

**NonPremultiplied**

哦好吧主播我知道你的AlphaBlend模式很好用了，但是如果我就是想要画非预乘像素，和原先的颜色进行线性插值，怎么办呢？

介绍...非预乘！没错，就叫这个，NonPremultiplied

公式如下

$C={{A}_{s}}\cdot {{C}_{s}}+[(1-{{A}_{s}})\cdot {{C}_{d}}]={{A}_{s}}\cdot {{C}_{s}}+(1-{{A}_{s}})\cdot {{C}_{d}}$

$A={{A}_{s}}\cdot {{A}_{s}}+[(1-{{A}_{s}})\cdot {{A}_{d}}]={{A}_{s}^{2}}+(1-{{A}_{s}})\cdot {{A}_{d}}$

这下就是实打实的非预乘线性插值了，0的时候完全不影响原先的颜色，1的时候完全不保留原先的颜色

**Opaque**

这个预设我基本没用过，不透明模式

完全抛弃先前的像素内容，覆盖上新的，适用于你的绘制块完全不透明而覆盖先前内容的情况

公式如下

$C=1\cdot {{C}_{s}}+0\cdot {{C}_{d}}={{C}_{s}}$

$A=1\cdot {{A}_{s}}+0\cdot {{A}_{d}}={{A}_{s}}$

## 自定义与其它常用混合推荐

上面是四个**预设**样式，我们完全可以自己构造自己的BlendState拿来用！

需要注意的是BlendState实现了**IDisposable**接口，按规范来讲需要手动管理生命周期，比如在Load的时候构造，在Unload的时候Dispose进行释放

公开的构造函数是无参构造，实现如下

```csharp
public BlendState()
{
    AlphaBlendFunction = BlendFunction.Add;
    AlphaDestinationBlend = Blend.Zero;
    AlphaSourceBlend = Blend.One;
    ColorBlendFunction = BlendFunction.Add;
    ColorDestinationBlend = Blend.Zero;
    ColorSourceBlend = Blend.One;
    ColorWriteChannels = ColorWriteChannels.All;
    ColorWriteChannels1 = ColorWriteChannels.All;
    ColorWriteChannels2 = ColorWriteChannels.All;
    ColorWriteChannels3 = ColorWriteChannels.All;
    BlendFactor = Color.White;
    MultiSampleMask = -1; // AKA 0xFFFFFFFF
}
```

也就是说默认得到的是和**Opaque**相同混合参数的混合状态

这里面的属性都是可以读写的，因此构造得到对象之后再给属性赋值或者聚合初始化就行了

下面来点个人的常用混合

**反色**

我希望有一个参数能控制反色的程度，1的时候完全反色，0的时候完全不反色，假设这样的参数是t

相应公式如下

$C=t\cdot (1-{{C}_{d}})+(1-t)\cdot {{C}_{d}}$

那么我们应当怎么设计我们的混合系数才能达到这样的效果呢？

$C_{s}$和$C_{d}$项是混合模式公式里固有自带的，左半还没有$C_{s}$，那刚好让$C_{s}$来担任t不就好了吗，而$(1-C_{d})$可以设置混合系数为InverseDestinationColor，后面的$1-t$用InverseSourceColor

于是混合公式可以这么设计

$C={{C}_{s}}\cdot (1-{{C}_{d}})+(1-{{C}_{s}})\cdot {{C}_{d}}$

相应代码如下

```csharp
InverseBlend = new BlendState
{
    ColorDestinationBlend = Blend.InverseSourceColor,
    ColorSourceBlend = Blend.InverseDestinationColor,
    AlphaDestinationBlend = Blend.One,
    AlphaSourceBlend = Blend.Zero
};
```

这里我完全保留原颜色的Alpha通道，让新的颜色只负责反色

本来想做个只看Alpha通道的值实现反色的(毕竟这是唯一一个可以跨通道影响计算的)

但是似乎实现不了，遂放弃了

开启这个模式的时候，原先纯白块下面的像素就会被完全反色，而纯黑则是完全不反色

从公式可以看出这个所谓反色是逐通道的，一般我们选用从纯黑到纯白的灰度颜色就行了，但是采用别的颜色也能玩出一些不一样的效果，比如纯红就是仅翻转红色通道这样

观察公式我们不难发现这个公式是对称的(不考虑Alpha通道的话)，这意味着我们不仅可以在原先的图像上画上纯白色块以反色，还可以做成在纯白色块上画别的颜色得到反色

**全一**

就是字面意思非常简单粗暴的，所有都取1

混合公式如下

$C={{C}_{s}}+{{C}_{d}}$

$A={{A}_{s}}+{{A}_{d}}$

代码如下

```csharp
AllOne = new BlendState
{
    ColorSourceBlend = Blend.One,
    AlphaSourceBlend = Blend.One,
    ColorDestinationBlend = Blend.One,
    AlphaDestinationBlend = Blend.One,
};
```

~~当然你要乐意也可以叫它"纯粹加PureAdditive"或者"超级加SuperAdditive"~~

公式非常简单，但是可以有怎样的适用场景呢？

前面说过，一般的加法适用于绘制技能光效的场景，叠出很绚烂很光污染的效果

但是前提是直接画到最终画面上

如果我们需要将内容先集体画到一张画布上，再最终将画布画到屏幕上，这里用加法模式画到画布上的过程就会导致颜色和Alpha通道都被预先乘过一次Alpha通道，如果在几个画布间反复绘制(比如反复上模糊泛光效果)情况就会更糟糕！Alpha通道会反复发力，开始是A，然后是$A^{2}$、$A^{4}$、$A^{8}$...最后画到屏幕上的时候已经啥都不剩了

所以我一般是在把内容画到自己的RenderTarget以及RenderTarget上互相来回处理叠加效果的时候采用AllOne模式，最后画屏幕上再根据需求选用AlphaBlend或者NonPremultiplied或者Additive

# SamplerState

采样器状态，也就是采样器怎么根据给定的纹理坐标从精灵图上取色

这里先强推一个视频：[浅入深出，带你了解纹理过滤](https://www.bilibili.com/video/BV1N94y1b7DQ)

## 纹理坐标模式 TextureAddressMode

有三个相关属性：AddressU、AddressV、AddressW

分别控制x y z三个方向上的分量的坐标处理

枚举值及相应含义如下

|**值**|**释意**|
|---|---|
|Wrap|传入的坐标会以取模回绕的方式映射到[0, 1)，比如-0.4即为0.6，3.2即为0.2|
|Clamp|传入的坐标会被钳制在[0, 1], 即小于0则为0，大于1则为1|
|Mirror|传入的坐标会映射到[0, 1), 但是在整数部分为奇数的时候换为镜像值，比如1.4即为0.6， 2.8即为0.8，图像上是锯齿状折线|


## 纹理过滤 TextureFilter

纹理过滤就是上面视频主要讨论的内容，但是FNA这里给你的选择会更加丰富一些

枚举值及相应含义如下

|**值**|**释意**|
|---|---|
|Linear|即上面视频中提到的三线性插值|
|Point|即上面视频中提到的邻近采样，但是带MipMap处理|
|Anisotropic|即上面视频中提到的各向异性采样，如果是相似缩放没有使用必要|
|LinearMipPoint|缩放时用双线性采样，MipMap间采用临近|
|PointMipLinear|缩放时采用邻近采样，MipMap间采用线性插值|
|MinLinearMagPointMipLinear|缩小用线性，放大用邻近，MipMap间采用线性插值|
|MinLinearMagPointMipPoint|缩小用线性，放大用邻近，MipMap间采用邻近|
|MinPointMagLinearMipLinear|缩小用邻近，放大用线性，MipMap间采用线性插值|
|MinPointMagLinearMipPoint|缩小用邻近，放大用线性，MipMap间采用邻近|


## 各向异性最大采样数 MaxAnisotropy

3D平面中采样轨迹会发生变形，从正视图中的正圆变为椭圆，这里就会根据椭圆的半长轴和半短轴的比值确定长轴方向的额外采样数，但是有时候我们不希望开销过大，因此会有一个最大采样数作为限制，默认采用4

## 最大Mip层级 MaxMipLevel

上面视频中提到了MipMap采样策略，这里可以设置最大Mip层数，默认采用0，也就是采用全部MipMap

~~顺带一提，TML加载纹理是不开MipMap生成的，毕竟这玩意主要是给3D场景用的，所以这一项还有上面一堆MipMap相关的东西其实对于TML模组开发都不用看，当然你自己写纹理加载另说~~

## MipMap层级偏置 MipMapLevelOfDetailBias

MipMap需要对缩放系数(在3D场景下是椭圆短半轴)取2的对数来确定缩放层级，进而采用相应的缩小后的纹理

而这个值是可以加个偏置处理的，正值会使得偏向更小的层级，MipMap层级越高缩小越多，因此这个值越正就意味着采用越清晰的版本进行插值，最终就越清晰，而越负就越模糊，默认为0

## 预设

**PointClamp** 邻近采样，各方向坐标采用钳制

**PointWrap** 邻近采样，各方向坐标采用取模回绕

**LineClamp** 三线性采样，各方向坐标采用钳制

**LineWrap** 三线性采样，各方向坐标采用取模回绕

**AnisotropicClamp** 各向异性采样，各方向坐标采用钳制

**AnisotropicWrap** 各向异性采样，各方向坐标采用取模回绕

## 自定义

和BlendState一样，公开的构造函数是无参构造，但是上面提到的那些属性都是公开可读写的

因此直接聚合初始化里写就行啦，虽然大多数时候PoinwClamp就够用了

如果你需要一个方向采用Clamp，另一个采用Wrap，就可以考虑用自定义SamplerState的手段，

比如我之前会整个色条，根据灰度值作为横坐标取色，但是因为一些原因需要Wrap，而灰度值为1的时候又会因为Wrap的问题而跌回0，这个时候就可以横向用Clamp，纵向用Wrap，嗯()

# DepthStencilState

它控制着深度测试和模板测试，是处理3D遮挡关系和实现高级遮罩效果的核心，公开属性相应对应深度缓冲和模板缓冲两部分

## 启用深度缓冲 DepthBufferEnable

bool类型，控制是否启用深度测试，如果关闭则固定会盖在先前已画上的物品上

如果开启则会根据后续介绍的深度比较函数对比二者的深度信息并判定是否通过

## 启用深度缓冲写入 DepthBufferWriteEnable

bool类型，控制当前新绘入像素是否覆写深度缓冲

## 深度比较函数 DepthBufferFunction

深度测试的比较函数

CompareFunction枚举类型

枚举值如下

|**值**|**释意**|
|---|---|
|Always|总是通过深度测试|
|Never|总是不通过|
|Less|新像素的深度比原像素小时通过|
|LessEqual|新像素的深度比原像素小或相等时通过|
|Equal|新像素的深度和原像素相等时通过|
|GreaterEqual|新像素的深度比原像素大或相等时通过|
|Greater|新像素的深度比原像素大时通过|
|NotEqual|新像素和原像素深度不相等时通过|


## 启用模板缓冲 StencilEnable

bool类型，控制是否启用模板测试

## 启用双面模板 TwoSidedStencilMode

bool类型，控制是否启用两面不同的模板设置，否则统一使用正面的模板设置

哦等等，什么叫背面呢？在2D画面渲染的时候我们通常不需要关注这些，但是3D渲染中我们经常会遇到这样的问题：比如一个立方体有六个面，你一次只能看到三个，可以六个面都画出来然后再利用深度测试来得到实际看到的三个，但是为什么不预先剔除掉看不到的面呢？

于是就有这样的约定，顺时针绕向的顶点为正面，逆时针的为背面，这样只绘制正面就可以了

当然有时候也会有保留背面绘制的需求，所以就多了给背面专用的一些设置项

如果不启用双面模板，那下面讲的属性对正面背面均生效

## 模板比较函数 StencilFunction

模板测试的比较函数，CompareFunction枚举类型，枚举值及含义见上文

如果启用了双面模板，还有给背面专用的属性CounterClockwiseStencilFunction

## 模板测试参考值 ReferenceStencil

外部传入的一个参考值，和模板缓冲内现有的值进行比较

## 模板缓冲读取掩码 StencilMask

控制当前模板比较取哪些二进制位出来参与比较

一般用于多遮罩渲染的情况，比如把8位拆为高4位和低4位，从而可以独立使用两个遮罩层

## 模板缓冲写入掩码 StencilWriteMask

控制当前模板通过之后会写入模板缓冲的哪些二进制位

一般和读取掩码同步

## 模板行为 StencilOperation

模板缓冲写入的行为，StencilOperation枚举类型

含义如下：

|**值**|**释意**|
|---|---|
|Keep|保持模板缓冲值|
|Zero|将模板缓冲置0|
|Replace|将模板缓冲值替换为参考值ReferenceStencil|
|Increment|将模板缓冲值+1，溢出时回绕到0|
|IncrementSaturation|将模板缓冲值+1，溢出时钳制在最大值|
|Decrement|将模板缓冲值-1，溢出时回绕到最大值|
|DecrementSaturation|将模板缓冲值-1，溢出时钳制在0|
|Invert|将模板缓冲值按位取反|
|有三个相关属性||
|StencilPass：模板测试通过时的操作||
|StencilFail：模板测试未通过时的操作||
|StencilDepthBufferFail: 模板测试通过但是深度测试没通过时的操作||


如果开启了双面模板，也有给背面专用的相应三个属性

CounterClockwiseStencilPass

CounterClockwiseStencilFail

CounterClockwiseStencilDepthBufferFail

## 预设

**Default** 采用默认的深度测试行为，也即会读取和写入深度缓冲，采用小于等于的比较模式，关闭模板缓冲

**DepthRead** 仅读取深度缓冲而不会写入，适用于半透明的像素

**None** 不读取深度缓冲而直接通过

## 自定义

还是和之前一样，公开无参构造函数

需要什么属性自己聚合初始化就可以啦

# RasterizerState

其控制着 GPU 如何将矢量数据（三角形）转换为屏幕上的像素

## 剔除模式 CullMode

CullMode类型的枚举值，决定了哪种顶点绕向得到的三角形面元会被剔除

枚举值如下

|**值**|**释意**|
|---|---|
|None|不剔除任何面|
|CullClockwiseFace|剔除顺时针面|
|CullCounterClockwiseFace|剔除逆时针面|


## 填充模式 FillMode

FillMode类型枚举值，决定了三角形面元中取哪些部分进行光栅化

枚举值如下

|**值**|**释意**|
|---|---|
|Solid|完整的三角形面元|
|WireFrame|仅三角形的三条边被光栅化|


## 深度偏移 DepthBias

## 坡度深度偏移 SlopeScaleDepthBias

float类型，这两个主要都应用在3D绘制的场景中，前者用于给深度加上一个最小分度乘DepthBias的偏移，从而规避闪烁伪影问题，后者则用于处理倾斜的多面体表面，将这个偏移系数乘在深度对两个坐标分量的偏导数绝对值的最大值上，用来规避自伪影问题

## 启用裁切矩形测试 ScissorTestEnable

bool类型，在UI渲染的场景中经常会用到，即如果子元素的内容超出父元素提供的边界范围，是否要进行裁切的问题

需要配合GraphicsDevice.ScissorRectangle使用，在矩形内的部分才会予以保留

## 启用多重采样抗锯齿 MultiSampleAntiAlias

bool类型，控制是否对多重采样渲染目标启用多重采样抗锯齿。当渲染目标不支持多重采样时，此属性无效

# Effect

自定义效果，如果传null就会使用spb自己的默认实现

会遍历当前Technique的所有Pass进行绘制

唯一要注意的是传入自定义Effect会使得后续传入的Matrix无效，需要自己另外传参

# Matrix

**注意，变换矩阵参数只有在Effect为null也即使用默认effect的时候有效！因为FNA无法假定你自己的Effect使用什么矩阵参数(也可能完全不用)**

SpriteBatch中产生的顶点的坐标为屏幕像素坐标，我们有时需要预先对这样的坐标进行一些处理，统一进行缩放、平移等等

而后续正交投影的部分是由Spb自行完成，这个不在我们的Matrix参数的负责范围内

换言之，如果你要给自定义Effect传入变换矩阵，除了视角变换矩阵，还记得要追加变换矩阵

FNA中是行向量约定，因此是transform \* ortho

这里顺带吐槽一个点——

密码的Re对于屏幕坐标的部分是每次Draw的时候手动 - Main.screenPosition的

很烦啊，为什么byd不能把这个平移处理放到Matrix参数里

咳咳，拿泰拉绘制需要的变换矩阵举例计算一下吧，并且这次我们希望绘制调用方完全不需要关心相机位置这种神必问题，也就是直接传世界坐标就该显示在那里，不要手动减一个屏幕位置来平移过去了

来想想我们都需要哪些变换吧

- 首先，画面缩放系数

- 其次，接近地图边界的时候我们不希望超出那个边界，所以要多整个边界平移

- 最后，沟槽的屏幕坐标平移

- ~~然后本来我都算完了想起来还有个重力翻转，这个我不想写呃啊~~

  以上顺序不代表矩阵计算顺序，只是笔者的猪猪脑袋在深度思考中的思考顺序

  世界坐标的坐标范围在[0, $W_{w}$]和[0, ${H_{w}}$]

  屏幕像素宽高为$W_{s}$和$H_{s}$

  画面缩放系数为$k$

  那么屏幕显示范围在世界坐标中占据的宽高即为$(\frac{{{W}_{s}}}{k},\frac{{{H}_{s}}}{k})=(W{{'}_{s}},H{{'}_{s}})=\overrightarrow{S}'$

  目标屏幕中心对应的世界坐标为$\vec{c}$

  此时因为边界问题导致实际采用的屏幕中心坐标应该为

  $\overrightarrow{c}'=clamp(\overrightarrow{c},\frac{\overrightarrow{S}'}{2},({{W}_{w}},{{H}_{w}})-\frac{\overrightarrow{S}'}{2})$

  有屏幕中心的世界坐标之后就很好确定显示范围在世界坐标中的范围了

  接下来怎么用一个矩阵描述这个范围呢？

  也就是说我们需要将范围内的世界坐标映射为屏幕像素坐标

  这里得到屏幕中心世界坐标之后很容易就能得到屏幕左上角的世界坐标

  $\overrightarrow{p}=clamp(\overrightarrow{c}-\frac{\overrightarrow{S}'}{2},\overrightarrow{0},({{W}_{w}},{{H}_{w}})-\overrightarrow{S}')$

  而只要先将顶点的世界坐标减去屏幕左上角的世界坐标，再乘上缩放系数，得到的不就是顶点的屏幕像素坐标了吗

  于是矩阵如下

  ![图片](http://www.kdocs.cn/api/v3/office/copy/TnRnYTdPazZ2V3dXYjF0ZjJEN05sQXczanNaKzRPaWlabitRb1R0QjhJS3czRVcwcmswcnlaUkFJL2xRSXhGS29MZkNMYmRWQ3hmVDJqQUtlM3dPektyQk1YUmJEdGtMQnc3QzlVZ3RoSFM3Szk2THhOb3pHeGh5K25IZk1EOGxycHBMRmRKUFBUemd1Tm0xZ2NUL0VGdnQybXBldXkzN0FpS1ZVbU1keG1QWnRmQTB6bDh1WUNlSVFzbDZSb1VSeURhalI4Nzc0N0JoMU5CTkhWenA5MFRPQzZpM2N5dmVpRlAwQVZ5K3ZOQlpCS1FMcm0wVHp1M2RMRU9KOGZKRWxZMjF5aGxMVjRrPQ==/attach/object/OIYHOTZKABQGI?&kso_type=image&kso_extra=eyJ0eXBlIjoiaW1hZ2UiLCJpZCI6Ik9JWUhPVFpLQUJRR0kiLCJvd25lciI6IjU2OTk1ODM4NzkwMCIsInJvdGF0ZSI6MCwic3RvcmFnZSI6ImJhc2UiLCJ3aWR0aCI6MjkwLCJoZWlnaHQiOjE3Mn0)

  这里利用齐次坐标实现了平移和缩放

  相应代码如下

  ```csharp
  Matrix transform =
      new Matrix(1, 0, 0, 0,
                 0, 1, 0, 0,
                 0, 0, 1, 0,
                 -topLeft.X, -topLeft.Y, 0, 1 / zoom);
  ```

  或者用现成的函数创建

  ```csharp
  Matrix transform = 
  	Matrix.CreateTranslation(-topLeft.X, -topLeft.Y, 0) 
  	* Matrix.CreateScale(zoom)
  ```

  这两个矩阵并不完全相等，但是因为齐次坐标的归一化要求使得最终是等效的

  上面手把手过了一遍视角变换矩阵的基本计算

  在泰拉里其实可以直接用现成的Main.GameViewMatrix.TransformationMatrix

  但是当然记得先左乘一个平移把沟槽的Main.screenPosition处理了

# Begin重载及默认值

Begin有五个重载

无参

仅SpriteSortMode和BlendState

在以上基础上追加SamplerState DepthStencilState RegisterState

在以上基础上再追加Effect

在以上基础上再追加Matrix, 达到完整参数列表

以下是它们的默认值：

SpriteSortMode: Deferred

BlendState: AlphaBlend

SamplerState: LinearClamp

DepthStencilState: None

RegisterState: CullCounterClockwise

Effect: null(默认Effect)

Matrix: Matrix.Identity(单位矩阵)



©*2026 LogSpiral \| 仅供个人学习，禁止商用及二次分发*

|上一篇<br>|<br>|
|---|---|


|[2-Draw各重载详解.otl](https://www.kdocs.cn/l/cfuzRYLjcrGJ?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1Njk5NjM0MDg2OTciLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2Z1elJZTGpjckdKIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU2OTk1ODM4NzkwMCJ9)<br>|<br>|
|---|---|


