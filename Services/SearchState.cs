namespace 叶子的TModLoader教程.Services;
public sealed class SearchState {
    public event Action? Changed;

    public string Query
    {
        get;
        set
        { if(field == value) return; field = value; Changed?.Invoke(); }
    } = string.Empty;
}