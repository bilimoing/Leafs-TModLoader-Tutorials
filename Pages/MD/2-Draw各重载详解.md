作者：LogSpiral 2026/10/5 \| 🔖 进阶

[叶子的TModLoader教程](https://www.kdocs.cn/l/crP1DDFrTik8)

不知道第几个TModLoader教程说是....

---

Draw一共有七个重载，这里从简单到复杂逐个讲解

如果没有歧义，下面的函数签名将只包含参数列表的参数类型

大致分为两大类，Vector2-position类和Rectangle-destination类

先介绍position系，再介绍destination系

**Draw(Texture2D, Vector2, Color)**

将给定的纹理精灵画在给定位置，Vector2指定纹理的左上角的坐标，Color则为顶点数据统一使用的颜色信息，默认Effect中与纹理中像素的颜色对位相乘

**Draw(Texture2D, Vector2, Rectangle?, Color)**

和上一个重载的区别是，上一个重载会绘制完整的纹理精灵，而这个重载则是只绘制矩形参数内指定的内容，Vector2的position参数即为指定裁切块的左上角的目标坐标

如果传入null就表示采用完整纹理，和上一个重载等效

**Draw(Texture2D, Vector2 position, Rectangle?, Color, float rotation, Vector2 origin, float scale, SpriteEffects, float layerDepth)**

这个重载是我最常用的一个重载，参数量一下子增大了不少

首先看origin参数，现在允许你指定裁切矩形中的锚点坐标，锚点锚定的像素会映射到position所指定的位置，如果传入零向量也就是左上角，就和先前的重载一样了

再接着是rotation参数，表示逆时针旋转的弧度角，比如要旋转180°就是$\pi$, 可以用MathF.PI或者MathHelper.Pi, 前者是高版本.Net框架提供的，后者是XNA中提供的常量

那么旋转中心是那里呢？对于图像内容，旋转中心是origin指定的锚点，而对于顶点坐标，旋转中心是position

下一个，scale参数，这个表示相对于锚点的缩放大小，用1就和上面的重载等效了

再下一个，精灵效果，其实就是控制裁切矩形内部内容的水平和垂直翻转，None或者0表示不翻转，FlipHorizontally表示水平翻转，FlipVertically表示垂直翻转，FlipHorizontally \| FlipVertically表示同时使用水平和垂直翻转

最后是layerDepth，也就是图层深度，默认是0，这个在TML中一般用不到，用来在End结束绘制时根据SpriteSortMode对缓存的提交进行排序，还有就是如果有深度缓冲也会写入深度缓冲区

**Draw(Texture2D, Vector2 position, Rectangle?, Color, float rotation, Vector2 origin, Vector2 scale, SpriteEffects, float layerDepth)**

和上一个重载唯一的区别在于，scale的类型不是float而是Vector2

此前我们只能对裁切矩形内部的内容进行相似缩放，也就是x和y共享缩放大小

而现在我们可以进行正交拉伸，先在水平和竖直方向上分别拉伸好，再进行逆时针旋转

**Draw(Texture2D, Rectangle destinationRectangle, Color)**

和第一个重载比，这里用来指定锚点位置的Vector2参数没了，取而代之的是Rectangle参数，它在这里表示目标渲染矩形，涵盖了位置和拉伸大小的信息

**Draw(Texture2D, Rectangle destinationRectangle, Rectangle? sourceRectangle, Color)**

和上一个重载类似，但是不是完整的精灵图，而是裁切矩形中的部分映射到目标矩形中

**Draw(Texture2D, Rectangle destinationRectangle, Rectangle? sourceRectangle, Color, float rotation, Vector2 origin, SpriteEffects, float layerDepth)**

SpriteEffect和layerDepth前面都讲过了，而rotation参数也一样是逆时针旋转

那么，destinationRectangle的行为是什么样呢？

destination实质上是提供了坐标和实际大小信息，所以这里它的X,Y就相当于position，而Width和Height就提供了拉伸后的尺寸信息，先前Vector2 scale则是基于裁切矩形的大小进行缩放



©*2026 LogSpiral \| 仅供个人学习，禁止商用及二次分发*

|上一篇<br>|下一篇<br>|
|---|---|


|[1-基础绘制.otl](https://www.kdocs.cn/l/caP6Gawgz09f?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1Njk5NjE2NTI3OTUiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY2FQNkdhd2d6MDlmIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU2OTk2MzQwODY5NyJ9)<br>|[3-Begin参数详解.otl](https://www.kdocs.cn/l/cuQvLTR0RGaq?kso_type=file&kso_extra=eyJ0eXBlIjoiZmlsZSIsImZpbGVfaWQiOiI1Njk5NTgzODc5MDAiLCJmaWxlX3NpemUiOjAsImZpbGVfdHlwZSI6Im90bCIsImZpbGVfbGluayI6Imh0dHBzOi8vd3d3Lmtkb2NzLmNuL2wvY3VRdkxUUjBSR2FxIiwidmlld190eXBlIjoidGl0bGUiLCJvd25lciI6IjU2OTk2MzQwODY5NyJ9)<br>|
|---|---|




