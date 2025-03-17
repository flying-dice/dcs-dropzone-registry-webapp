import {
  ActionIcon,
  Collapse,
  Group,
  Stack,
  Title,
  TitleOrder,
  TypographyStylesProvider,
} from "@mantine/core";
import { BiHelpCircle, BiPlus } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { marked } from "marked";

export function TableTitle(props: {
  title: string;
  titleOrder?: TitleOrder;
  onAdd?: () => void;
  help?: string;
}) {
  const [isOpen, { toggle }] = useDisclosure(false);
  return (
    <Stack>
      <Group justify="space-between">
        <Title order={props.titleOrder}>{props.title}</Title>
        <Group gap="sm">
          {props.help && (
            <ActionIcon variant="transparent" onClick={toggle}>
              <BiHelpCircle />
            </ActionIcon>
          )}
          <ActionIcon variant="default" onClick={props.onAdd}>
            <BiPlus />
          </ActionIcon>
        </Group>
      </Group>
      {props.help && (
        <Collapse in={isOpen}>
          <Stack>
            <TypographyStylesProvider>
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(props.help),
                }}
              />
            </TypographyStylesProvider>
          </Stack>
        </Collapse>
      )}
    </Stack>
  );
}
