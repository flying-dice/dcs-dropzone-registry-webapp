import { Badge, Group } from "@mantine/core";

export type ModTagsProps = {
  tags: string[];
};
export function ModTags({ tags }: ModTagsProps) {
  return (
    <Group gap="xs">
      {tags.map((tag) => (
        <Badge radius="xs" key={tag} variant="light">
          {tag}
        </Badge>
      ))}
    </Group>
  );
}
