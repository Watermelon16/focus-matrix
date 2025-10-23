// Google Drive helpers (client-side) with minimal scopes
// Note: Requires Google OAuth access token from @react-oauth/google

export type DriveScope = 'appdata' | 'file';

function driveBaseHeaders(accessToken: string) {
  return { Authorization: `Bearer ${accessToken}` };
}

export async function createFolder(accessToken: string, name: string, parentId?: string) {
  const body: any = { name, mimeType: 'application/vnd.google-apps.folder' };
  if (parentId) body.parents = [parentId];
  const res = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: { ...driveBaseHeaders(accessToken), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('Create folder failed');
  return res.json();
}

export async function listSharedTeamFolders(accessToken: string, query?: string) {
  // Folders shared with the user, type folder
  const q = encodeURIComponent(["mimeType = 'application/vnd.google-apps.folder'", 'sharedWithMe = true', query].filter(Boolean).join(' and '));
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,owners,permissions)`, {
    headers: driveBaseHeaders(accessToken),
  });
  if (!res.ok) throw new Error('List shared folders failed');
  const json = await res.json();
  return json.files as Array<{ id: string; name: string }>;
}

export async function createOrUpdateJsonFile(accessToken: string, fileId: string | null, name: string, jsonB64: string, parentId?: string) {
  if (fileId) {
    const res = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: { ...driveBaseHeaders(accessToken), 'Content-Type': 'application/json' },
      body: atob(jsonB64),
    });
    if (!res.ok) throw new Error('Update file failed');
    return { id: fileId };
  }

  // Create metadata first
  const metadata = { name, mimeType: 'application/json', parents: parentId ? [parentId] : undefined } as any;
  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelim = `\r\n--${boundary}--`;
  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    'Content-Type: application/json\r\n\r\n' +
    atob(jsonB64) +
    closeDelim;

  const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    method: 'POST',
    headers: { ...driveBaseHeaders(accessToken), 'Content-Type': `multipart/related; boundary=${boundary}` },
    body: multipartRequestBody,
  });
  if (!res.ok) throw new Error('Create file failed');
  const out = await res.json();
  return { id: out.id as string };
}

export async function readJsonFile(accessToken: string, fileId: string) {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, { headers: driveBaseHeaders(accessToken) });
  if (!res.ok) throw new Error('Read file failed');
  const text = await res.text();
  return btoa(text);
}

export async function setPermission(accessToken: string, fileOrFolderId: string, email: string, role: 'reader' | 'writer') {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileOrFolderId}/permissions`, {
    method: 'POST',
    headers: { ...driveBaseHeaders(accessToken), 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'user', role, emailAddress: email, sendNotificationEmail: true }),
  });
  if (!res.ok) throw new Error('Set permission failed');
  return res.json();
}


