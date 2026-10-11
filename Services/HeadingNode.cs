namespace 叶子的TModLoader教程.Services;
public sealed class HeadingNode(TocEntry entry) { public TocEntry Entry { get; } = entry; public List<HeadingNode> Children { get; } = []; }
