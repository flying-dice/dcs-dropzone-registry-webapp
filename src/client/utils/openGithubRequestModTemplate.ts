export function openGithubRequestModTemplate(
  userId: string,
  name: string,
  homepage: string,
) {
  const issueTitle = `[${userId}] Listing Request: ${name} - ${homepage}`;
  globalThis.open(
    `https://github.com/flying-dice/dcs-dropzone-mod-manager/issues/new?template=request-mod-listing.md&title=${
      encodeURIComponent(issueTitle)
    }`,
    "_blank",
  );
}
