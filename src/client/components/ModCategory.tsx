import { MdOutlineCategory } from "react-icons/md";
import { Group, Text } from "@mantine/core";

export type ModCategoryProps = {
  category: string;
};
export function ModCategory({ category }: ModCategoryProps) {
  return (
    <Group gap="xs">
      <MdOutlineCategory />
      <Text>{category}</Text>
    </Group>
  );
}
