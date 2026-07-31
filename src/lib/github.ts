// Minimal wrapper around GitHub's Contents API — no octokit dependency,
// just fetch. Used by /api/publish to commit writeups straight to the repo
// that Vercel (or any git-based host) auto-deploys from.

const API_BASE = "https://api.github.com";

interface GithubEnv {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGithubEnv(): GithubEnv {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !owner || !repo) {
    throw new Error(
      "Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO environment variables — see README for setup."
    );
  }
  return { token, owner, repo, branch };
}

/** GitHub's contents path segment: encode each segment, keep slashes literal. */
function encodePath(path: string): string {
  return path.split("/").map(encodeURIComponent).join("/");
}

async function getFileSha(path: string, env: GithubEnv): Promise<string | undefined> {
  const res = await fetch(
    `${API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodePath(path)}?ref=${env.branch}`,
    {
      headers: {
        Authorization: `Bearer ${env.token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    throw new Error(`GitHub API error checking ${path}: ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as { sha?: string };
  return data.sha;
}

/**
 * Creates or updates a file in the repo. `base64Content` should already be
 * base64-encoded (raw bytes for images, or Buffer.from(text).toString("base64")
 * for text files).
 */
export async function putFile(path: string, base64Content: string, message: string): Promise<void> {
  const env = getGithubEnv();
  const sha = await getFileSha(path, env);

  const res = await fetch(`${API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodePath(path)}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${env.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch: env.branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub API error committing ${path}: ${res.status} ${await res.text()}`);
  }
}

interface DirEntry {
  name: string;
  path: string;
  sha: string;
  type: string;
}

/** Lists a directory's contents. Returns [] if the directory doesn't exist. */
export async function listDirectory(path: string): Promise<DirEntry[]> {
  const env = getGithubEnv();
  const res = await fetch(
    `${API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodePath(path)}?ref=${env.branch}`,
    {
      headers: {
        Authorization: `Bearer ${env.token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );
  if (res.status === 404) return [];
  if (!res.ok) {
    throw new Error(`GitHub API error listing ${path}: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function deleteFileWithSha(path: string, sha: string, message: string, env: GithubEnv): Promise<void> {
  const res = await fetch(`${API_BASE}/repos/${env.owner}/${env.repo}/contents/${encodePath(path)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${env.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, sha, branch: env.branch }),
  });
  if (!res.ok) {
    throw new Error(`GitHub API error deleting ${path}: ${res.status} ${await res.text()}`);
  }
}

/** Deletes a single file. A no-op (not an error) if the file doesn't exist. */
export async function deleteFile(path: string, message: string): Promise<void> {
  const env = getGithubEnv();
  const sha = await getFileSha(path, env);
  if (!sha) return;
  await deleteFileWithSha(path, sha, message, env);
}

/**
 * Deletes every file inside a directory (used to remove a writeup's image
 * folder). The GitHub Contents API has no "delete folder" call, so this
 * deletes each file individually. A no-op if the directory doesn't exist.
 */
export async function deleteDirectory(path: string, message: string): Promise<void> {
  const env = getGithubEnv();
  const entries = await listDirectory(path);
  for (const entry of entries) {
    if (entry.type === "file") {
      await deleteFileWithSha(entry.path, entry.sha, message, env);
    }
  }
}
