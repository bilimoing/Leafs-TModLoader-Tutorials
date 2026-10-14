param([string]$Configuration = 'Release')
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path "$PSScriptRoot/..").Path
$directory = Join-Path $root 'offline-app/signing'
New-Item -ItemType Directory -Force $directory | Out-Null
$settingsFile = Join-Path $directory 'local-signing.json'
if (!(Test-Path $settingsFile)) {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $password = [Convert]::ToBase64String($bytes)
    @{ alias = 'leaf-tutorials'; password = $password } | ConvertTo-Json | Set-Content $settingsFile -Encoding UTF8
}
$settings = Get-Content $settingsFile -Raw | ConvertFrom-Json
$env:LEAF_STORE_PASSWORD = $settings.password
$env:LEAF_KEY_PASSWORD = $settings.password
$keytool = 'C:/Program Files/Java/jdk-21.0.12.1/bin/keytool.exe'
$keystore = Join-Path $directory 'leaf-release.keystore'
try {
    if (!(Test-Path $keystore)) {
        & $keytool -genkeypair -keystore $keystore -storetype PKCS12 -alias $settings.alias -storepass:env LEAF_STORE_PASSWORD -keypass:env LEAF_KEY_PASSWORD -keyalg RSA -keysize 3072 -validity 10000 -dname 'CN=Leaf Tutorials, OU=Offline Reader, O=Leaf Tutorials, C=CN'
        if ($LASTEXITCODE) { throw '生成签名密钥失败' }
    }
    & dotnet publish "$root/offline-app/android/LeafTutorials.Android.csproj" -c $Configuration '-p:AndroidSdkDirectory=C:/Users/32387/AppData/Local/Android/Sdk' '-p:AndroidKeyStore=true' "-p:AndroidSigningKeyStore=$keystore" "-p:AndroidSigningKeyAlias=$($settings.alias)" '-p:AndroidSigningStorePass=env:LEAF_STORE_PASSWORD' '-p:AndroidSigningKeyPass=env:LEAF_KEY_PASSWORD'
    if ($LASTEXITCODE) { throw 'APK 构建失败' }
    $apk = Get-ChildItem "$root/offline-app/android/bin/$Configuration" -Recurse -Filter '*-Signed.apk' | Select-Object -First 1
    New-Item -ItemType Directory -Force "$root/artifacts" | Out-Null
    Copy-Item $apk.FullName "$root/artifacts/LeafTutorials-Android.apk" -Force
    & 'C:/Users/32387/AppData/Local/Android/Sdk/build-tools/36.1.0/apksigner.bat' verify --verbose --print-certs "$root/artifacts/LeafTutorials-Android.apk"
    if ($LASTEXITCODE) { throw 'APK 签名验证失败' }
} finally {
    Remove-Item Env:LEAF_STORE_PASSWORD,Env:LEAF_KEY_PASSWORD -ErrorAction SilentlyContinue
}
