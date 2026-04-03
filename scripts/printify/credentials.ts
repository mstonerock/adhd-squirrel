import { execFileSync } from 'node:child_process';
import path from 'node:path';

const WINDOWS_CREDENTIAL_TARGET = 'ADHD-Squirrel/Printify/API';

export function getPrintifyApiToken(): string {
  const allowEnvFallback = process.env.PRINTIFY_ALLOW_ENV_FALLBACK === '1';
  const directToken = process.env.PRINTIFY_API_TOKEN?.trim();

  if (directToken && allowEnvFallback) {
    return directToken;
  }

  if (process.platform !== 'win32') {
    throw new Error(
      'Printify token lookup is configured for the Windows DPAPI store. On non-Windows systems, set PRINTIFY_ALLOW_ENV_FALLBACK=1 and PRINTIFY_API_TOKEN only for the current shell.',
    );
  }

  const scriptPath = path.join(process.cwd(), 'scripts', 'printify', 'windows-credential.ps1');

  try {
    const output = execFileSync(
      'powershell',
      [
        '-NoProfile',
        '-ExecutionPolicy',
        'Bypass',
        '-File',
        scriptPath,
        '-Action',
        'get',
        '-Target',
        WINDOWS_CREDENTIAL_TARGET,
      ],
      {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );

    const token = output.trim();
    if (!token) {
      throw new Error('Credential lookup returned an empty token.');
    }

    return token;
  } catch (error) {
    throw new Error(
      'Printify token not found. Store it in the local Windows DPAPI secret store under ADHD-Squirrel/Printify/API. Repo-local .env usage is intentionally ignored unless PRINTIFY_ALLOW_ENV_FALLBACK=1 is set for a one-off shell.',
      { cause: error },
    );
  }
}
