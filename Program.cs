using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using 叶子的TModLoader教程;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });

builder.Services.AddSingleton<叶子的TModLoader教程.Services.TutorialLibrary>();
builder.Services.AddScoped<叶子的TModLoader教程.Services.SearchState>();
await builder.Build().RunAsync();