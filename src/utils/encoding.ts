/**
 * Safe UTF-8 Base64 and Data URL encoding/decoding utilities.
 * Avoids DOMException: InvalidCharacterError when dealing with Cyrillic and Unicode strings.
 */

export function utf8ToBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  } catch {
    // Fallback using encodeURIComponent
    return window.btoa(unescape(encodeURIComponent(str)));
  }
}

export function base64ToUtf8(base64: string): string {
  try {
    const binary = window.atob(base64.trim());
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    // Fallback using decodeURIComponent
    try {
      return decodeURIComponent(escape(window.atob(base64.trim())));
    } catch {
      return window.atob(base64.trim());
    }
  }
}

export function textToDataUrl(text: string, mimeType = 'application/json'): string {
  return `data:${mimeType};charset=utf-8;base64,${utf8ToBase64(text)}`;
}

export function dataUrlToText(dataUrl: string): string {
  if (!dataUrl) return '';
  if (!dataUrl.startsWith('data:')) {
    return dataUrl;
  }
  const commaIndex = dataUrl.indexOf(',');
  if (commaIndex === -1) return '';
  const meta = dataUrl.slice(0, commaIndex);
  const data = dataUrl.slice(commaIndex + 1);

  if (meta.includes(';base64')) {
    return base64ToUtf8(data);
  } else {
    try {
      return decodeURIComponent(data);
    } catch {
      return data;
    }
  }
}
