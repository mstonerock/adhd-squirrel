param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('get', 'exists', 'set', 'delete')]
  [string]$Action,

  [string]$Target = 'ADHD-Squirrel/Printify/API',

  [string]$Secret
)

Add-Type -AssemblyName System.Security

function Get-SecretPath {
  param([string]$SecretTarget)

  $safeName = ($SecretTarget -replace '[^a-zA-Z0-9._-]', '_') + '.bin'
  $dir = Join-Path $env:LOCALAPPDATA 'ADHD-Squirrel\secrets'
  return Join-Path $dir $safeName
}

function Protect-Secret {
  param([string]$Plaintext)

  $plainBytes = [Text.Encoding]::UTF8.GetBytes($Plaintext)
  return [Security.Cryptography.ProtectedData]::Protect(
    $plainBytes,
    $null,
    [Security.Cryptography.DataProtectionScope]::CurrentUser
  )
}

function Unprotect-Secret {
  param([byte[]]$CipherBytes)

  $plainBytes = [Security.Cryptography.ProtectedData]::Unprotect(
    $CipherBytes,
    $null,
    [Security.Cryptography.DataProtectionScope]::CurrentUser
  )

  return [Text.Encoding]::UTF8.GetString($plainBytes)
}

$secretPath = Get-SecretPath -SecretTarget $Target

switch ($Action) {
  'get' {
    if (-not (Test-Path -LiteralPath $secretPath)) {
      Write-Error "Secret not found: $Target"
      exit 1
    }

    $cipherBytes = [IO.File]::ReadAllBytes($secretPath)
    [Console]::Out.Write((Unprotect-Secret -CipherBytes $cipherBytes))
  }

  'exists' {
    if (Test-Path -LiteralPath $secretPath) {
      Write-Output 'true'
      exit 0
    }

    Write-Output 'false'
    exit 1
  }

  'set' {
    if ([string]::IsNullOrWhiteSpace($Secret)) {
      Write-Error 'Secret is required for set.'
      exit 1
    }

    $dir = Split-Path -Parent $secretPath
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    $cipherBytes = Protect-Secret -Plaintext $Secret
    [IO.File]::WriteAllBytes($secretPath, $cipherBytes)
    Write-Output 'stored'
  }

  'delete' {
    if (Test-Path -LiteralPath $secretPath) {
      Remove-Item -LiteralPath $secretPath -Force
    }

    Write-Output 'deleted'
  }
}
