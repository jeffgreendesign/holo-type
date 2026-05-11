/**
 * Encodes a string to Base64 with UTF-8 support.
 */
export function toBase64(str: string) {
  const bytes = new TextEncoder().encode(str);
  const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binString);
}

/**
 * Decodes a Base64 string to a UTF-8 string.
 */
export function fromBase64(base64: string) {
  try {
    const binString = atob(base64);
    const bytes = Uint8Array.from(binString, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    try {
      return atob(base64);
    } catch (err) {
      console.error("Base64 decoding failed:", err);
      return "";
    }
  }
}
