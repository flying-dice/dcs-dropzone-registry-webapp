import { Alert, Button, Group, Stack } from "@mantine/core";
import { z } from "zod";
import { Editor } from "@monaco-editor/react";
import { useForm, zodResolver } from "@mantine/form";
import { useAsyncFn } from "react-use";
import { useState } from "react";
import { JsonSchema7Type } from "zod-to-json-schema";

const formSchema = z.object({
  mod: z.string(),
});

export type SudoModFormValues = z.infer<typeof formSchema>;

export function SudoModForm(props: {
  onClose: () => void;
  onSubmit: (values: SudoModFormValues) => Promise<void>;
  defaultValue: SudoModFormValues;
  schema: JsonSchema7Type;
}) {
  const form = useForm({
    initialValues: props.defaultValue,
    validate: zodResolver(formSchema),
  });

  const [submission, submit] = useAsyncFn(
    (values: SudoModFormValues) => props.onSubmit(values),
    [props.onSubmit],
  );

  const [markers, setMarkers] = useState<IMarker>([]);

  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        await submit(values);
      })}
    >
      <Stack>
        <Editor
          height="70vh"
          language="json"
          options={{ theme: "vs-dark" }}
          value={form.values.mod}
          onMount={(_, m) => {
            m.editor.setTheme("vs-dark");
            m.languages.json.jsonDefaults.setDiagnosticsOptions({
              validate: true,
              schemas: [
                {
                  uri: "/api/sudo-mods/schema",
                  fileMatch: ["*"],
                  schema: props.schema,
                },
              ],
            });
          }}
          onChange={(v) => v && form.setFieldValue("mod", v)}
          onValidate={(markers) => {
            setMarkers(markers);
          }}
        />
        {submission.error && (
          <Alert color="red" title={submission.error.name}>
            <pre>
            {submission.error.message}
            </pre>
          </Alert>
        )}
        <Group justify="flex-end">
          <Button
            disabled={submission.loading}
            variant="default"
            onClick={props.onClose}
          >
            Cancel
          </Button>
          <Button
            disabled={markers.length}
            loading={submission.loading}
            type="submit"
          >
            Save
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
