using System.Net;
using System.Text.RegularExpressions;
using Markdig;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;

namespace 叶子的TModLoader教程.Services;

public sealed record TocEntry(string Id, string Title, int Level);
public sealed class Tutorial
{
    public required string Title { get; init; }
    public required string Source { get; init; }
    public string Group { get; set; } = "补充教程";
    public int Order { get; set; } = 999;
    private string? html;
    public Action? Render { get; set; }
    public string Html { get { if(html is null) Render?.Invoke(); return html ?? string.Empty; } set { html = value; } }
    public string SearchText { get; set; } = "";
    public List<TocEntry> Toc { get; set; } = [];
    public string Url => "?article=" + Uri.EscapeDataString(Title);
    public int Minutes => Math.Max(1, SearchText.Length / 450);
}

public sealed class TutorialLibrary
{
    private readonly MarkdownPipeline pipeline = new MarkdownPipelineBuilder().UseAdvancedExtensions().DisableHtml().Build();
    public List<Tutorial> Articles { get; } = [];
    public IEnumerable<IGrouping<string, Tutorial>> Groups => Articles.Where(a => a.Title != "主页").GroupBy(a => a.Group);

    public TutorialLibrary()
    {
        var assembly = typeof(TutorialLibrary).Assembly;
        var prefix = assembly.GetName().Name + ".Pages.MD.";
        foreach (var name in assembly.GetManifestResourceNames().Where(n => n.StartsWith(prefix) && n.EndsWith(".md")))
        {
            using var reader = new StreamReader(assembly.GetManifestResourceStream(name)!);
            Articles.Add(new Tutorial { Title = name[prefix.Length..^3], Source = reader.ReadToEnd() });
        }
        var home = Find("主页");
        var links = new Dictionary<string, Tutorial>(StringComparer.OrdinalIgnoreCase);
        if (home is not null)
        {
            links["https://www.kdocs.cn/l/crP1DDFrTik8"] = home;
            var group = "开始阅读";
            var order = 0;
            foreach (var line in home.Source.Split('\n'))
            {
                if (line.StartsWith("## ")) group = line[3..].Replace("**", "").Trim();
                foreach (Match match in Regex.Matches(line, @"\[([^\]]+)\]\((https?://(?:www\.)?kdocs\.cn/l/[^)]+)\)"))
                {
                    var label = Normalize(match.Groups[1].Value);
                    var article = Articles.FirstOrDefault(a => a.Title != "主页" && (Normalize(a.Title) == label || label.EndsWith(Normalize(a.Title), StringComparison.OrdinalIgnoreCase)));
                    if (article is null) continue;
                    article.Group = group;
                    article.Order = order++;
                    links[Canonical(match.Groups[2].Value)] = article;
                }
            }
        }
        Articles.Sort((a, b) => a.Order != b.Order ? a.Order.CompareTo(b.Order) : StringComparer.Ordinal.Compare(a.Title, b.Title));
        foreach (var article in Articles)
        {
            article.SearchText = article.Source;
            article.Render = () =>
            {
            var document = Markdown.Parse(CleanLegacyNavigation(article.Source), pipeline);
            foreach (var link in document.Descendants<LinkInline>())
            {
                if (link.Url is null) continue;
                if (link.IsImage && link.Url.StartsWith("http://")) link.Url = "https://" + link.Url[7..];
                if (!link.IsImage && links.TryGetValue(Canonical(link.Url), out var target)) link.Url = target.Url;
                else if (!link.IsImage && link.Url.EndsWith(".md", StringComparison.OrdinalIgnoreCase))
                {
                    var local = Find(Uri.UnescapeDataString(link.Url.Split('/').Last()[..^3]));
                    if (local is not null) link.Url = local.Url;
                }
            }
            article.Html = document.ToHtml(pipeline);
            foreach (Match heading in Regex.Matches(article.Html, "<h([1-6]) id=\"([^\"]+)\"[^>]*>(.*?)</h[1-6]>", RegexOptions.Singleline))
                article.Toc.Add(new TocEntry(WebUtility.HtmlDecode(heading.Groups[2].Value), Plain(heading.Groups[3].Value), int.Parse(heading.Groups[1].Value)));
            article.Render = null;
            };
        }
    }

    private static string CleanLegacyNavigation(string source)
    {
        var lines = source.Split((char)10);
        var result = new List<string>();
        for (var i = 0; i < lines.Length; i++)
        {
            var line = lines[i].Trim();
            if (line.StartsWith("|") && (line.Contains("上一篇") || line.Contains("下一篇")) && i + 1 < lines.Length && lines[i + 1].Contains("---"))
            {
                while (i + 1 < lines.Length && lines[i + 1].TrimStart().StartsWith("|")) i++;
                continue;
            }
            result.Add(lines[i]);
        }
        return string.Join((char)10, result);
    }
    public Tutorial? Find(string? title) => Articles.FirstOrDefault(a => a.Title == title);
    public IEnumerable<Tutorial> Search(string query) => Articles.Where(a => a.Title != "主页" && query.Split(' ', StringSplitOptions.RemoveEmptyEntries).All(word => (a.Title + " " + a.SearchText).Contains(word, StringComparison.OrdinalIgnoreCase)));
    public static string Plain(string html) => WebUtility.HtmlDecode(Regex.Replace(html, "<[^>]+>", " ")).Trim();
    private static string Canonical(string url) => url.Replace("http://", "https://").Replace("https://kdocs.cn/", "https://www.kdocs.cn/").Split('?')[0].TrimEnd('/');
    private static string Normalize(string value) => WebUtility.HtmlDecode(value).Replace("\\", "").Replace("更多Projectile", "更多Proj").Replace(">", "").Replace(" ", "").Replace("-", "").Trim().ToLowerInvariant();
}
