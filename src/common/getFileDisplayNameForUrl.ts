/**
 * Extracts and decodes the last part of a URL to use as a display name.
 *
 * @param {string} url - The URL from which to extract the display name.
 * @returns {string} - The decoded last part of the URL, or the original URL if the last part is empty.
 */
export function getFileDisplayNameForUrl(url: string) {
  const remoteSourceLastParts = url.split("/");

  const lastPart = remoteSourceLastParts[remoteSourceLastParts.length - 1];

  if (!lastPart) {
    return url;
  }

  return decodeURIComponent(lastPart);
}
