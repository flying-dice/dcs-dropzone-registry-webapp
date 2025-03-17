import { EntryIndexAuthorsItem } from "../_autogen/client.ts";
import { Avatar, AvatarGroup, Tooltip } from "@mantine/core";
import { chunks } from "../utils/arrays.ts";

export type ModAuthorsProps = {
  authors: EntryIndexAuthorsItem[];
  max?: number;
  chunkSize?: number;
};
export function ModAuthors({ authors, chunkSize, max }: ModAuthorsProps) {
  if (chunkSize) {
    return (
      <>
        {Array.from(chunks(authors, chunkSize)).map((chunk, i) => (
          <AvatarGroup key={i}>
            {chunk.map((author) => (
              <Tooltip label={author.name} key={author.name}>
                <Avatar
                  key={author.name}
                  src={author.avatar}
                  name={author.name}
                  color="initials"
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        ))}
      </>
    );
  }

  return (
    <AvatarGroup>
      {authors.map((author, i) => {
        if (max && i > max) return null;
        if (max && i === max) {
          return (
            <Tooltip label={author.name} key={author.name}>
              <Avatar key={author.name} color="initials">
                +{authors.length - max}
              </Avatar>
            </Tooltip>
          );
        }
        return (
          <Tooltip label={author.name} key={author.name}>
            <Avatar
              key={author.name}
              src={author.avatar}
              name={author.name}
              color="initials"
            />
          </Tooltip>
        );
      })}
    </AvatarGroup>
  );
}
