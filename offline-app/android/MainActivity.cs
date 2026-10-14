using Android.App;
using Android.OS;
using Android.Content;
using Android.Graphics;
using Android.Views;
using Android.Widget;
using Android.Text.Method;
using Markdig;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using Markdig.Extensions.Tables;
using 叶子的TModLoader教程.Services;

namespace LeafTutorials;

[Activity(Label = "叶子的教程", MainLauncher = true, Exported = true, Theme = "@android:style/Theme.Material.Light.NoActionBar", Icon = "@drawable/leaf")]
public sealed class MainActivity : Activity
{
    readonly TutorialLibrary library = new();
    readonly Stack<string?> history = new();
    readonly MarkdownPipeline pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().DisableHtml().Build();
    LinearLayout root = null!, content = null!;
    ScrollView scroll = null!;
    string? current;
    Android.Window.IOnBackInvokedCallback? backCallback;
    readonly List<Bitmap> bitmaps = new();
    readonly List<Android.Graphics.Drawables.AnimatedImageDrawable> animations = new();
    readonly List<(View View, Action Load)> pendingImages = new();
    int generation;
    int Dp(int value) => (int)(value * Resources!.DisplayMetrics!.Density);
    protected override void OnCreate(Bundle? state)
    {
        base.OnCreate(state);
        root = new LinearLayout(this) { Orientation = Orientation.Vertical };
        root.SetBackgroundColor(Color.Rgb(248, 250, 246));
        root.SetOnApplyWindowInsetsListener(new InsetsListener());
        SetContentView(root);
        if (OperatingSystem.IsAndroidVersionAtLeast(33))
        {
            backCallback = new BackCallback(this);
            OnBackInvokedDispatcher.RegisterOnBackInvokedCallback(0, backCallback);
        }
        current = state?.GetString("article");
        var stack = state?.GetStringArray("history");
        if (stack is not null) foreach (var item in stack) history.Push(item == "" ? null : item);
        Show(current);
    }
    protected override void OnSaveInstanceState(Bundle state)
    {
        state.PutString("article", current);
        state.PutStringArray("history", history.Reverse().Select(x => x ?? "").ToArray());
        base.OnSaveInstanceState(state);
    }
    sealed class InsetsListener : Java.Lang.Object, View.IOnApplyWindowInsetsListener
    {
        public WindowInsets OnApplyWindowInsets(View? view, WindowInsets? insets)
        {
            if (view is not null && insets is not null)
            {
                if (OperatingSystem.IsAndroidVersionAtLeast(30))
                {
                    var edges = insets.GetInsets(WindowInsets.Type.SystemBars() | WindowInsets.Type.DisplayCutout() | WindowInsets.Type.Ime());
                    view.SetPadding(edges.Left, edges.Top, edges.Right, edges.Bottom);
                }
                else view.SetPadding(insets.SystemWindowInsetLeft, insets.SystemWindowInsetTop, insets.SystemWindowInsetRight, insets.SystemWindowInsetBottom);
            }
            return insets!;
        }
    }
    sealed class BackCallback(MainActivity owner) : Java.Lang.Object, Android.Window.IOnBackInvokedCallback
    { public void OnBackInvoked() => owner.GoBack(); }
#pragma warning disable CA1422
    public override void OnBackPressed() => GoBack();
#pragma warning restore CA1422
    void GoBack()
    {
        if (history.Count > 0) Show(history.Pop());
        else if (current is not null) Show(null);
        else Finish();
    }
    void Navigate(string? title) { history.Push(current); Show(title); }
    void Show(string? title)
    {
        generation++;
        root.RemoveAllViews();
        pendingImages.Clear();
        foreach (var animation in animations) { animation.Stop(); animation.Dispose(); }
        animations.Clear();
        foreach (var bitmap in bitmaps) bitmap.Dispose();
        bitmaps.Clear();
        current = title;
        var bar = new LinearLayout(this) { Orientation = Orientation.Horizontal };
        var back = new Button(this) { Text = title is null ? "叶子" : "‹ 返回" };
        back.Click += (_, _) => { if (title is not null) GoBack(); };
        bar.AddView(back);
        var heading = Text(title ?? "tModLoader 教程", 19, true);
        bar.AddView(heading, new LinearLayout.LayoutParams(0, -2, 1));
        var directory = new Button(this) { Text = "目录" };
        directory.Click += (_, _) => Navigate(null);
        bar.AddView(directory);
        root.AddView(bar);
        scroll = new ScrollView(this) { FillViewport = true };
        content = new LinearLayout(this) { Orientation = Orientation.Vertical };
        content.SetPadding(Dp(16), Dp(8), Dp(16), Dp(24));
        scroll.AddView(content);
        scroll.ScrollChange += (_, _) => LoadVisibleImages();
        root.AddView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        if (title is null) ShowDirectory();
        else
        {
            var article = library.Find(title);
            if (article is null) { content.AddView(Text("未找到教程", 18)); return; }
            var toc = new Button(this) { Text = "本篇标题 / 快速跳转" };
            content.AddView(toc);
            var headings = new List<(string Text, View View)>();
            foreach (var block in Markdown.Parse(article.Source, pipeline)) RenderBlock(block, content, headings);
            toc.Click += (_, _) => new AlertDialog.Builder(this)!.SetTitle("本篇目录")!.SetItems(headings.Select(x => x.Text).ToArray(), (_, e) => scroll.SmoothScrollTo(0, headings[e.Which].View.Top))!.SetNegativeButton("关闭", (_, _) => { })!.Show();
            var next = library.Articles.Where(a => a.Title != "主页").ToList();
            int index = next.FindIndex(a => a.Title == title);
            if (index > 0) AddButton(content, "上一篇：" + next[index - 1].Title, () => Navigate(next[index - 1].Title));
            if (index >= 0 && index + 1 < next.Count) AddButton(content, "下一篇：" + next[index + 1].Title, () => Navigate(next[index + 1].Title));
        }
        scroll.Post(LoadVisibleImages);
    }
    void LoadVisibleImages()
    {
        foreach (var item in pendingImages.ToArray())
        {
            using var visible = new Rect();
            if (!item.View.GetGlobalVisibleRect(visible)) continue;
            pendingImages.Remove(item);
            item.Load();
        }
    }
    TextView Text(string value, float size = 16, bool bold = false)
    {
        var view = new TextView(this) { Text = value, TextSize = size };
        view.SetTextColor(Color.Rgb(36, 55, 42));
        view.SetPadding(0, Dp(7), 0, Dp(7));
        view.SetTextIsSelectable(true);
        if (bold) view.SetTypeface(Typeface.Default, TypefaceStyle.Bold);
        return view;
    }
    void AddButton(LinearLayout parent, string label, Action action)
    { var button = new Button(this) { Text = label }; button.Click += (_, _) => action(); parent.AddView(button); }
    void ShowDirectory()
    {
        content.AddView(Text("离线原生阅读 · 全文搜索 · 点击教程开始阅读", 15));
        var search = new EditText(this) { Hint = "搜索教程标题或正文" };
        content.AddView(search);
        var list = new LinearLayout(this) { Orientation = Orientation.Vertical };
        content.AddView(list);
        void Update(string query)
        {
            list.RemoveAllViews();
            var terms = query.Split(' ', StringSplitOptions.RemoveEmptyEntries);
            var articles = library.Articles.Where(a => a.Title != "主页" && terms.All(t => a.Title.Contains(t, StringComparison.OrdinalIgnoreCase) || a.Source.Contains(t, StringComparison.OrdinalIgnoreCase))).ToList();
            foreach (var group in articles.GroupBy(a => a.Group))
            {
                list.AddView(Text(group.Key, 20, true));
                foreach (var article in group) AddButton(list, article.Title, () => Navigate(article.Title));
            }
            if (articles.Count == 0) list.AddView(Text("没有找到匹配的教程"));
        }
        search.TextChanged += (_, _) => Update(search.Text ?? "");
        Update("");
    }
    string Plain(ContainerInline? inline)
    {
        if (inline is null) return "";
        return string.Concat(inline.Select(node => node switch
        {
            LiteralInline literal => literal.Content.ToString(),
            CodeInline code => code.Content,
            LineBreakInline => "\n",
            ContainerInline container => Plain(container),
            _ => node.ToString()
        }));
    }
    void RenderInline(ContainerInline? inline, LinearLayout parent)
    {
        if (inline is null) return;
        // 原生 TextView 使用 Markdig 生成的片段保留加粗、斜体与可点击链接；不创建浏览器控件。
        var paragraph = new ParagraphBlock { Inline = inline };
        var document = new MarkdownDocument { paragraph };
        var html = document.ToHtml(pipeline);
        var text = Text("");
        text.TextFormatted = Android.Text.Html.FromHtml(html, Android.Text.FromHtmlOptions.ModeLegacy);
        var spannable = new Android.Text.SpannableString(text.TextFormatted);
        foreach (var span in spannable.GetSpans(0, spannable.Length(), Java.Lang.Class.FromType(typeof(Android.Text.Style.URLSpan)))!)
        {
            if (span is not Android.Text.Style.URLSpan url) continue;
            int start = spannable.GetSpanStart(span), end = spannable.GetSpanEnd(span);
            spannable.RemoveSpan(span);
            spannable.SetSpan(new LinkSpan(this, url.URL ?? ""), start, end, Android.Text.SpanTypes.ExclusiveExclusive);
        }
        text.TextFormatted = spannable;
        text.MovementMethod = LinkMovementMethod.Instance;
        if (!string.IsNullOrWhiteSpace(Plain(inline))) parent.AddView(text);
        foreach (var image in inline.Descendants<LinkInline>().Where(x => x.IsImage)) AddImage(parent, image.Url ?? "", Plain(image));
    }
    sealed class LinkSpan(MainActivity owner, string url) : Android.Text.Style.ClickableSpan
    { public override void OnClick(View widget) => owner.OpenLink(url); }
    void OpenLink(string url)
    {
        string? title = null;
        if (url.Contains("article=")) title = Uri.UnescapeDataString(url.Split("article=")[1].Split('&')[0]);
        else if (url.EndsWith(".md", StringComparison.OrdinalIgnoreCase)) title = Uri.UnescapeDataString(url.Split('/').Last()[..^3]);
        else
        {
            var home = library.Find("主页");
            if (home is not null)
                foreach (System.Text.RegularExpressions.Match match in System.Text.RegularExpressions.Regex.Matches(home.Source, @"\[([^\]]+)\]\(([^)]+)\)"))
                    if (match.Groups[2].Value.TrimEnd('/') == url.TrimEnd('/'))
                        title = library.Articles.FirstOrDefault(a => match.Groups[1].Value.Replace("**", "").EndsWith(a.Title, StringComparison.OrdinalIgnoreCase))?.Title;
        }
        if (title is not null && library.Find(title) is not null) { Navigate(title); return; }
        if (Uri.TryCreate(url, UriKind.Absolute, out var uri) && uri.Scheme is "https" or "http")
            try { StartActivity(new Intent(Intent.ActionView, global::Android.Net.Uri.Parse(url))); }
            catch (ActivityNotFoundException) { Toast.MakeText(this, "没有可打开此链接的浏览器", ToastLength.Short)!.Show(); }
    }
    void RenderBlock(Block block, LinearLayout parent, List<(string Text, View View)> headings)
    {
        switch (block)
        {
            case HeadingBlock heading:
                var view = Text(Plain(heading.Inline), Math.Max(18, 29 - heading.Level * 2), true);
                parent.AddView(view); headings.Add((view.Text ?? "", view)); break;
            case CodeBlock code:
                var source = code.Lines.ToString();
                AddButton(parent, "复制代码", () => { var clipboard = (Android.Content.ClipboardManager)GetSystemService(ClipboardService)!; clipboard.PrimaryClip = ClipData.NewPlainText("教程代码", source); Toast.MakeText(this, "代码已复制", ToastLength.Short)!.Show(); });
                var horizontal = new HorizontalScrollView(this);
                var codeView = Text(source, 14); codeView.Typeface = Typeface.Monospace;
                codeView.SetPadding(Dp(12), Dp(12), Dp(12), Dp(12)); codeView.SetBackgroundColor(Color.Rgb(230, 237, 229));
                horizontal.AddView(codeView); parent.AddView(horizontal); break;
            case Table table:
                var tableScroll = new HorizontalScrollView(this);
                var rows = new LinearLayout(this) { Orientation = Orientation.Vertical };
                foreach (var row in table.OfType<Markdig.Extensions.Tables.TableRow>())
                {
                    var line = new LinearLayout(this) { Orientation = Orientation.Horizontal };
                    foreach (var cell in row.OfType<TableCell>())
                    {
                        var column = new LinearLayout(this) { Orientation = Orientation.Vertical };
                        column.SetPadding(Dp(8), 0, Dp(8), 0);
                        foreach (var child in cell) RenderBlock(child, column, headings);
                        line.AddView(column, new LinearLayout.LayoutParams(Dp(220), -2));
                    }
                    rows.AddView(line);
                }
                tableScroll.AddView(rows); parent.AddView(tableScroll); break;
            case ListBlock list:
                int number = 1;
                foreach (var item in list.OfType<ListItemBlock>())
                {
                    var itemLayout = new LinearLayout(this) { Orientation = Orientation.Vertical };
                    itemLayout.SetPadding(Dp(16), 0, 0, 0);
                    itemLayout.AddView(Text(list.IsOrdered ? $"{number++}." : "•", 15, true));
                    foreach (var child in item) RenderBlock(child, itemLayout, headings);
                    parent.AddView(itemLayout);
                }
                break;
            case ThematicBreakBlock: parent.AddView(Text("────────────")); break;
            case LeafBlock leaf: RenderInline(leaf.Inline, parent); break;
            case ContainerBlock container:
                foreach (var child in container) RenderBlock(child, parent, headings); break;
        }
    }
    void AddImage(LinearLayout parent, string url, string description)
    {
        string path = Uri.UnescapeDataString(url.Split('?')[0]).TrimStart('/');
        if (path.StartsWith("../")) path = path[3..];
        if (!path.StartsWith("images/tutorials/", StringComparison.Ordinal) || path.Contains("..")) { parent.AddView(Text(description)); return; }
        var image = new ImageView(this);
        image.SetAdjustViewBounds(true); image.SetScaleType(ImageView.ScaleType.FitCenter);
        image.ContentDescription = description;
        parent.AddView(image, new LinearLayout.LayoutParams(-1, Dp(240)));
        int version = generation;
        pendingImages.Add((image, () => { _ = Task.Run(() =>
        {
            try
            {
                if (OperatingSystem.IsAndroidVersionAtLeast(28) && path.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                {
                    using var source = ImageDecoder.CreateSource(Assets!, path);
                    var drawable = ImageDecoder.DecodeDrawable(source);
                    RunOnUiThread(() =>
                    {
                        if (version != generation || IsDestroyed) { drawable?.Dispose(); return; }
                        image.SetImageDrawable(drawable);
                        image.LayoutParameters = new LinearLayout.LayoutParams(-1, -2);
                        if (drawable is Android.Graphics.Drawables.AnimatedImageDrawable animation) { animations.Add(animation); animation.Start(); }
                    });
                    return;
                }
                using var boundsStream = Assets!.Open(path);
                var options = new BitmapFactory.Options { InJustDecodeBounds = true };
                BitmapFactory.DecodeStream(boundsStream, null, options);
                int sample = 1; while (options.OutWidth / sample > 1400 || options.OutHeight / sample > 2400) sample *= 2;
                using var stream = Assets.Open(path);
                var bitmap = BitmapFactory.DecodeStream(stream, null, new BitmapFactory.Options { InSampleSize = sample });
                if (bitmap is null) return;
                RunOnUiThread(() =>
                {
                    if (version != generation || IsDestroyed) { bitmap.Dispose(); return; }
                    bitmaps.Add(bitmap); image.SetImageBitmap(bitmap);
                    image.LayoutParameters = new LinearLayout.LayoutParams(-1, -2);
                    image.Click += (_, _) =>
                    {
                        var full = new ImageView(this); full.SetImageBitmap(bitmap); full.SetAdjustViewBounds(true);
                        new AlertDialog.Builder(this)!.SetView(full)!.SetPositiveButton("关闭", (_, _) => { })!.Show();
                    };
                });
            }
            catch (Exception) { RunOnUiThread(() => { if (version == generation) image.ContentDescription = "图片无法读取：" + path; }); }
        }); }));
    }
    protected override void OnDestroy()
    {
        generation++;
        if (OperatingSystem.IsAndroidVersionAtLeast(33) && backCallback is not null) OnBackInvokedDispatcher.UnregisterOnBackInvokedCallback(backCallback);
        foreach (var bitmap in bitmaps) bitmap.Dispose();
        base.OnDestroy();
    }
}
