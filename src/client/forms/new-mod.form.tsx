import { Anchor, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().nonempty(),
  homepage: z.string().url(),
});

export type NewModFormValues = z.infer<typeof formSchema>;

export function NewModForm(props: {
  onClose: () => void;
  onSubmit: (values: NewModFormValues) => void;
}) {
  const form = useForm({
    initialValues: {
      name: "",
      homepage: "",
    },
    validate: zodResolver(formSchema),
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        console.log(values);
        props.onSubmit(values);
      })}
    >
      <Stack>
        <TextInput
          label="Name"
          placeholder="Your Mods Name"
          data-autofocus
          key={form.key("name")}
          description="Give your mod a name, this will be displayed in the Dropzone Mods list"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Homepage"
          placeholder="Your Mods Homepage"
          key={form.key("homepage")}
          {...form.getInputProps("homepage")}
          description="Only mods with a valid homepage will be accepted, this is to ensure the mod is maintained and supported, a github repository url is the preferred homepage"
        />
        <Text size="sm">
          By submitting this form, you will be redirected to create a new issue
          in the Dropzone repository. Once processed, the mod will be available
          in the Dropzone User Mods list. Alternatively, you can manually create
          a new issue in the Dropzone repository{" "}
          <Anchor
            size="sm"
            href="https://github.com/flying-dice/dcs-dropzone-mod-manager/issues/new?template=request-mod-listing.md"
            target="_blank"
          >
            here
          </Anchor>
        </Text>

        <Group justify="end">
          <Button variant="default" onClick={props.onClose}>
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </Group>
      </Stack>
    </form>
  );
}
