using Android.App;
using Android.OS;
using Android.Webkit;
using Android.Content;
using Android.Content.PM;

namespace LeafTutorials;

[Activity(Label = "叶子的教程", MainLauncher = true, Exported = true, ConfigurationChanges = ConfigChanges.Orientation | ConfigChanges.ScreenSize)]
public sealed class MainActivity : Activity
{
    private WebView? browser;
    protected override void OnCreate(Bundle? savedInstanceState)
    {
        base.OnCreate(savedInstanceState);
        browser = new WebView(this);
        browser.Settings.JavaScriptEnabled = true;
        browser.Settings.DomStorageEnabled = true;
        browser.Settings.AllowFileAccess = false;
        browser.Settings.AllowContentAccess = false;
        browser.Settings.MixedContentMode = MixedContentHandling.NeverAllow;
        browser.SetWebViewClient(new LocalClient(this));
        browser.SetWebChromeClient(new WebChromeClient());
        SetContentView(browser);
        browser.LoadUrl("https://offline.leaf.local/");
    }
#pragma warning disable CA1422
    public override void OnBackPressed()
    {
        if (browser?.CanGoBack() == true) browser.GoBack(); else base.OnBackPressed();
    }
#pragma warning restore CA1422
    protected override void OnDestroy()
    {
        browser?.Destroy();
        base.OnDestroy();
    }
    private sealed class LocalClient(MainActivity activity) : WebViewClient
    {
        public override bool ShouldOverrideUrlLoading(WebView? view, IWebResourceRequest? request)
        {
            var url = request?.Url?.ToString() ?? "";
            if (url.StartsWith("https://offline.leaf.local/", StringComparison.Ordinal)) return false;
            if (url.StartsWith("https://") || url.StartsWith("http://"))
            {
                try { activity.StartActivity(new Intent(Intent.ActionView, global::Android.Net.Uri.Parse(url))); }
                catch (ActivityNotFoundException) { }
            }
            return true;
        }
        public override WebResourceResponse? ShouldInterceptRequest(WebView? view, IWebResourceRequest? request)
        {
            var url = request?.Url?.ToString() ?? "";
            if (!url.StartsWith("https://offline.leaf.local/", StringComparison.Ordinal)) return new WebResourceResponse("text/plain", "utf-8", new MemoryStream());
            try
            {
                var uri = new System.Uri(url);
                var name = System.Uri.UnescapeDataString(uri.AbsolutePath).TrimStart('/');
                if (name.Length == 0) name = "index.html";
                if (name.Split('/').Any(p => p == "..") || name.Contains('\\')) throw new IOException();
                var type = Path.GetExtension(name).ToLowerInvariant() switch
                {
                    ".wasm" => "application/wasm", ".js" or ".mjs" => "text/javascript", ".json" => "application/json",
                    ".html" => "text/html", ".css" => "text/css", ".svg" => "image/svg+xml", ".png" => "image/png",
                    ".gif" => "image/gif", ".webp" => "image/webp", ".jpg" or ".jpeg" => "image/jpeg", _ => "application/octet-stream"
                };
                return new WebResourceResponse(type, "utf-8", activity.Assets!.Open("site/" + name));
            }
            catch (IOException) { return new WebResourceResponse("text/plain", "utf-8", 404, "Not Found", new Dictionary<string, string>(), new MemoryStream()); }
        }
    }
}
