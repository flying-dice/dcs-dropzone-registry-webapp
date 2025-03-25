import {
  Accordion,
  ActionIcon,
  Alert,
  Button,
  Center,
  Checkbox,
  Container,
  Divider,
  Grid,
  Group,
  LoadingOverlay,
  Menu,
  Modal,
  MultiSelect,
  MultiSelectProps,
  Select,
  Stack,
  Table,
  Tabs,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  TypographyStylesProvider,
} from "@mantine/core";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { marked } from "marked";
import { DiffEditor, Editor } from "@monaco-editor/react";
import { z } from "zod";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  BiCheckCircle,
  BiCopy,
  BiEdit,
  BiLinkExternal,
  BiTrash,
} from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useForm, zodResolver } from "@mantine/form";
import { DateTimePicker } from "@mantine/dates";
import { closeAllModals } from "@mantine/modals";
import { stringify } from "yaml";
import sortKeys from "sort-keys";
import { useAsync, useAsyncFn } from "react-use";
import { useDisclosure } from "@mantine/hooks";
import { keyBy, noop } from "lodash";
import {
  getUserModById,
  getUserMods,
  Mod,
  ModSummary,
  updateUserMod,
} from "../_autogen/api.ts";
import { useUserContext } from "../context/UserContext.ts";
import { useValidatedParams } from "../hooks/useValidatedParams.ts";
import { TableTitle } from "../components/TableTitle.tsx";
import { ModImage } from "../components/ModImage.tsx";
import { categories } from "../../common/categories.ts";
import { tags } from "../../common/tags.ts";
import { licenses } from "../../common/licenses.ts";
import { AppShell } from "@mantine/core";
import { getFileDisplayNameForUrl } from "../../common/getFileDisplayNameForUrl.ts";

const RELEASES_HELP = `\
Releases are the different versions of your mod that you have released. Each release should have a unique version number and name.\
`;
const NO_RELEASES_CAPTION = `\
No releases have been added to this mod.\
`;
const ASSETS_HELP = `\
Assets are the files that are included in the release. Each asset should have a download URL and a list of links that map the asset to the correct location in the DCS folders.

Assets can be either a single file or an archive, if the asset is an archive it will be extracted in place.
`;
const NO_ASSETS_CAPTION = `\
No assets have been added to this release.\
`;

const LINKS_HELP = `\
Links are used to map the mod files to the correct location in the DCS folders. Each Link results in a symlink being created between the source and target files.\


| Example | Source | Target |
|---------|--------|--------|
| \`https://example.com/mods/mod.zip\` | \`my-mod-folder\` | \`{{DCS_USER_DIR}}/Mods/my-mod-folder\` |
| \`https://example.com/mods/mod.lua\` | \`mod.lua\` | \`{{DCS_USER_DIR}}/Scripts/mod/mod.lua\` |

You can use the \`{{DCS_USER_DIR}}\` variable to refer to the DCS user directory, i.e. \`%USERPROFILE%\\Saved Games\\DCS.openbeta\`
`;
const NO_LINKS_CAPTION = `\
No links have been added to this asset.\
`;

const UserModPageContext = createContext<{
  mod: Mod;
  form: ReturnType<typeof useForm<ModForm>>;
  readmeEditorModal: {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
  };
  submission: ReturnType<typeof useAsyncFn>[0];
  submit: () => void;
  hasChanges: boolean;
  original: string;
  modified: string;
  // deno-lint-ignore no-explicit-any
}>({} as any);

const useUserModPageContext = () => useContext(UserModPageContext);

function UserModPageProvider({
  mod,
  children,
}: {
  mod: Mod;
  children: ReactNode;
}) {
  const nav = useNavigate();
  const { user } = useUserContext();
  const form = useForm<ModForm>({
    initialValues: modFormSchema.parse({
      id: mod.id,
      latest: mod.latest,
      category: mod.category,
      authors: mod.authors,
      name: mod.name,
      description: mod.description,
      imageUrl: mod.imageUrl,
      content: (mod.content && atob(mod.content)) || "",
      tags: mod.tags,
      license: mod.license,
      homepage: mod.homepage,
      dependencies: mod.dependencies || [],
      versions: mod.versions,
      maintainers: mod.maintainers,
      published: mod.published,
    }),
    validate: zodResolver(modFormSchema),
    validateInputOnBlur: true,
  });

  const [readmeEditor, readmeEditorCallbacks] = useDisclosure(false);

  const [submission, submit] = useAsyncFn(async () => {
    const mod = form.getValues();
    await updateUserMod(mod.id, { ...mod, content: btoa(mod.content) });
    closeAllModals();
    nav("/user-mods");
  }, [user]);

  const original = stringify(
    sortKeys(
      {
        ...mod,
        content: (mod.content && atob(mod.content)) || "",
        dependencies: mod.dependencies || [],
      },
      { deep: true },
    ),
    undefined,
    2,
  );

  const modified = stringify(
    sortKeys(form.getValues(), { deep: true }),
    undefined,
    2,
  );

  return (
    <UserModPageContext.Provider
      value={{
        mod,
        form,
        readmeEditorModal: { isOpen: readmeEditor, ...readmeEditorCallbacks },
        submission,
        submit,
        hasChanges: modified !== original,
        original,
        modified,
      }}
    >
      {children}
    </UserModPageContext.Provider>
  );
}

const modFormSchema = z.object({
  id: z.string().describe(
    "This is allocated by Dropzone maintainers. It cannot be changed.",
  ),
  latest: z.string().optional().describe("The mod's active release version."),
  category: z
    .string()
    .describe(
      "This is used to aid in searching for mods using filters. The mod must be in a single category.",
    ),
  name: z
    .string()
    .nonempty()
    .describe(
      "The name of the mod will be displayed in Dropzone anywhere the mod is shown.",
    ),
  authors: z.array(z.string()).describe(
    "This should be a list of the mod's authors.",
  ),
  description: z
    .string()
    .describe(
      "This should be a brief overview of the mod. It will be displayed in Dropzone anywhere the mod summary is shown.",
    ),
  imageUrl: z
    .string()
    .describe(
      "The mods preview image. This will be shown anywhere the mod card is displayed.",
    )
    .optional(),
  content: z.string(),
  tags: z
    .array(z.string())
    .describe(
      "Tags are used to aid in searching. The mod can have multiple tags.",
    ),
  license: z
    .string()
    .describe(
      "This is used to specify the mod's license so users know what they can do with the mod.",
    ),
  homepage: z.string().url().nonempty(),
  dependencies: z
    .array(z.string())
    .describe(
      "The mods dependencies. Add any mods this mod requires. All will be subscribed when this mod is subscribed.",
    ),
  published: z.boolean().default(false).describe(
    "Published mods are visible to all users and can be subscribed to by anyone. Disabling this prevents the mod from being present in the main list, but it can still be accessed it via the direct URL. It can be subscribed to by anyone who has the URL and uses 'Open in Dropzone'. From your User Mods list select 'View in Registry' to get the URL and share privately.",
  ),
  maintainers: z.array(z.string()).min(1),
  versions: z.array(
    z.object({
      name: z
        .string()
        .nonempty()
        .describe(
          "The name of the release. This should be a unique name for this release, this does not need to follow any specific format.",
        ),
      version: z
        .string()
        .nonempty()
        .describe(
          "The version of the mod. This should be a unique identifier for the mod's release and should be in the format of a semantic version.",
        ),
      exePath: z
        .string()
        .optional()
        .describe(
          "Specify the path to an executable file to enable the run option when the mod is active.",
        ),
      date: z.coerce
        .date()
        .describe(
          "Provide the date of the release. This should be the date the release was made in Dropzone.",
        ),
      releasepage: z
        .string()
        .nonempty()
        .describe(
          "Provide a link to the release's page so users can find more information.",
        ),
      assets: z.array(
        z.object({
          remoteSource: z
            .string()
            .nonempty()
            .describe(
              "The asset will be downloaded from this URL, if the asset is an archive it will be extracted in place.",
            ),
          links: z.array(
            z.object({
              source: z.string().nonempty(),
              target: z.string().nonempty(),
              runonstart: z.coerce.boolean().optional(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type ModForm = z.infer<typeof modFormSchema>;

function UserModVersionModal({
  version,
  versionIdx,
  versionAddr,
  isOpen,
  onClose,
}: {
  version: ModForm["versions"][number];
  versionIdx: number;
  versionAddr: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { form } = useUserModPageContext();
  return (
    <Modal
      size="90vw"
      opened={isOpen}
      onClose={onClose}
      title={`Edit Release ${version?.name} (${version?.version})`}
    >
      <Stack>
        <Grid>
          <Grid.Col span={6}>
            <Stack>
              <TextInput
                label="Name"
                description={modFormSchema.shape.versions.element.shape.name
                  .description}
                {...form.getInputProps(`${versionAddr}.name`)}
              />
              <TextInput
                label="Release Page"
                description={modFormSchema.shape.versions.element.shape
                  .releasepage.description}
                {...form.getInputProps(`${versionAddr}.releasepage`)}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={6}>
            <Stack>
              <TextInput
                label="Version"
                description={modFormSchema.shape.versions.element.shape.version
                  .description}
                {...form.getInputProps(`${versionAddr}.version`)}
              />
              <DateTimePicker
                label="Date"
                description={modFormSchema.shape.versions.element.shape.date
                  .description}
                {...form.getInputProps(`${versionAddr}.date`)}
                highlightToday
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span={12}>
            <TextInput
              label="Executable path"
              description={modFormSchema.shape.versions.element.shape.exePath
                .description}
              placeholder="Path to an executable file"
              {...form.getInputProps(`${versionAddr}.exePath`)}
            />
          </Grid.Col>
        </Grid>

        <TableTitle
          title="Assets"
          titleOrder={4}
          onAdd={() =>
            form.insertListItem(`${versionAddr}.assets`, {
              remoteSource: "",
              links: [],
            })}
          help={ASSETS_HELP}
        />

        <Accordion variant="separated">
          {form.values.versions[versionIdx].assets.map((asset, assetIdx) => {
            const assetAddr = ["versions", versionIdx, "assets", assetIdx].join(
              ".",
            );
            return (
              <Accordion.Item key={assetAddr} value={assetAddr}>
                <Accordion.Control>
                  <Group>
                    <Text fw="bold" size="sm">
                      {getFileDisplayNameForUrl(asset.remoteSource) ||
                        "New Asset"}
                    </Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>
                  <Stack>
                    <TextInput
                      label="Download URL"
                      description={modFormSchema.shape.versions.element.shape
                        .assets.element.shape.remoteSource
                        .description}
                      placeholder="https://example.com/mods/my-mod.zip"
                      {...form.getInputProps(`${assetAddr}.remoteSource`)}
                    />
                    <TableTitle
                      title="Asset's Links"
                      titleOrder={6}
                      onAdd={() =>
                        form.insertListItem(`${assetAddr}.links`, {
                          source: "",
                          target: "",
                          runonstart: false,
                        })}
                      help={LINKS_HELP}
                    />
                    <Table highlightOnHover>
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Source</Table.Th>
                          <Table.Th>Target</Table.Th>
                          <Table.Th>Autorun</Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {form
                          .getValues()
                          .versions[versionIdx].assets[assetIdx].links.map(
                            (link, linkIdx) => {
                              const linkAddr = [assetAddr, "links", linkIdx]
                                .join(".");
                              return (
                                <Table.Tr key={linkAddr}>
                                  <Table.Td>
                                    <TextInput
                                      variant="unstyled"
                                      description={modFormSchema.shape.versions
                                        .element.shape.assets.element
                                        .shape.links.element.shape.source
                                        .description}
                                      placeholder="my-mod"
                                      {...form.getInputProps(
                                        `${linkAddr}.source`,
                                      )}
                                    />
                                  </Table.Td>
                                  <Table.Td>
                                    <TextInput
                                      variant="unstyled"
                                      description={modFormSchema.shape.versions
                                        .element.shape.assets.element
                                        .shape.links.element.shape.target
                                        .description}
                                      placeholder="{{DCS_USER_DIR}}/Mods/my-mod"
                                      {...form.getInputProps(
                                        `${linkAddr}.target`,
                                      )}
                                    />
                                  </Table.Td>
                                  <Table.Td w={150}>
                                    {
                                      <Checkbox
                                        disabled={!link.target.endsWith(".lua")}
                                        description={modFormSchema.shape
                                          .versions.element.shape.assets.element
                                          .shape.links.element.shape.target
                                          .description}
                                        {...form.getInputProps(
                                          `${linkAddr}.runonstart`,
                                          {
                                            type: "checkbox",
                                          },
                                        )}
                                      />
                                    }
                                  </Table.Td>
                                  <Table.Td w={64}>
                                    <ActionIcon
                                      variant="subtle"
                                      onClick={() =>
                                        form.removeListItem(
                                          `${assetAddr}.links`,
                                          linkIdx,
                                        )}
                                    >
                                      <BiTrash />
                                    </ActionIcon>
                                  </Table.Td>
                                </Table.Tr>
                              );
                            },
                          )}
                      </Table.Tbody>
                      {form.values.versions[versionIdx].assets[assetIdx].links
                            .length === 0 && (
                        <Table.Caption>
                          <Text>{NO_LINKS_CAPTION}</Text>
                        </Table.Caption>
                      )}
                    </Table>
                    <Divider />
                    <Group justify="end">
                      <Button
                        variant="subtle"
                        color="red"
                        onClick={() =>
                          form.removeListItem(
                            `${versionAddr}.assets`,
                            assetIdx,
                          )}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
        {form.values.versions[versionIdx].assets.length === 0 && (
          <Text>{NO_ASSETS_CAPTION}</Text>
        )}
      </Stack>
    </Modal>
  );
}

function DetailsPanel() {
  const { user } = useUserContext();
  const { form } = useUserModPageContext();
  const mods = useMods();

  const modsById = useMemo(() => keyBy(mods.value || [], "id"), [mods.value]);

  const renderDependencyOption: MultiSelectProps["renderOption"] = (
    { option },
  ) => (
    <Group gap="sm" wrap="nowrap">
      {form.values.dependencies.includes(option.value) && <BiCheckCircle />}
      <ModImage src={modsById[option.value].imageUrl} w={80} radius="md" />
      <Stack gap={0}>
        <Text size="sm">{option.label}</Text>
        <Text size="xs" opacity={0.5} truncate w={500}>
          {modsById[option.value].description}
        </Text>
      </Stack>
    </Group>
  );

  return (
    <Container>
      <Stack>
        <TextInput
          label="ID"
          description={modFormSchema.shape.id.description}
          readOnly
          {...form.getInputProps("id")}
        />
        <TextInput
          label="Name"
          description={modFormSchema.shape.name.description}
          {...form.getInputProps("name")}
        />
        <Center>
          <ModImage src={form.values.imageUrl} w={300} />
        </Center>
        <TextInput
          label="Image URL"
          description={modFormSchema.shape.imageUrl.description}
          {...form.getInputProps("imageUrl")}
        />
        <Textarea
          minRows={3}
          autosize
          label="Description"
          description={modFormSchema.shape.description.description}
          {...form.getInputProps("description")}
        />
        <MultiSelect
          label="Dependencies"
          description={modFormSchema.shape.dependencies.description}
          renderOption={renderDependencyOption}
          data={mods.value
            ?.filter((it) => it.id !== form.values.id)
            .map((it) => ({
              value: it.id,
              label: it.name,
            }))}
          searchable
          {...form.getInputProps("dependencies")}
        />
        <Select
          label="Category"
          description={modFormSchema.shape.category.description}
          data={categories}
          {...form.getInputProps("category")}
        />

        <MultiSelect
          label="Tags"
          description={modFormSchema.shape.tags.description}
          data={tags}
          searchable
          {...form.getInputProps("tags")}
        />
        <Select
          label="License"
          description={modFormSchema.shape.license.description}
          data={licenses.map((it) => it.name)}
          searchable
          unselectable="off"
          {...form.getInputProps("license")}
        />
        <TagsInput
          label="Authors"
          description={modFormSchema.shape.authors.description}
          {...form.getInputProps("authors")}
        />
        <TagsInput
          label="Maintainers"
          description={`Your user id is ${user?.id}, you can add other user ids here to allow them to edit this mod.`}
          {...form.getInputProps("maintainers")}
        />
        <TextInput
          label="Homepage"
          description={modFormSchema.shape.homepage.description}
          rightSection={
            <ActionIcon
              variant="subtle"
              onClick={() => globalThis.open(form.values.homepage, "_blank")}
            >
              <BiLinkExternal />
            </ActionIcon>
          }
          {...form.getInputProps("homepage")}
        />
      </Stack>
    </Container>
  );
}

function ManagePanel() {
  const { form } = useUserModPageContext();

  return (
    <Container>
      <Stack>
        <Checkbox.Card
          p="md"
          radius="md"
          {...form.getInputProps("published", { type: "checkbox" })}
        >
          <Group wrap="nowrap" align="flex-start">
            <Checkbox.Indicator />
            <div>
              <Title order={6}>Published</Title>
              <Text size="sm">
                {modFormSchema.shape.published.description}
              </Text>
            </div>
          </Group>
        </Checkbox.Card>
      </Stack>
    </Container>
  );
}

function _UserModVersionRow({
  version,
  versionIdx,
}: {
  version: ModForm["versions"][number];
  versionIdx: number;
}) {
  const { form } = useUserModPageContext();
  const versionAddr = ["versions", versionIdx].join(".");
  const [isOpen, versionModal] = useDisclosure(false);

  function handleCopy() {
    form.insertListItem("versions", {
      ...version,
      date: new Date(),
      name: `${version.name} (Copy)`,
      version: `${version.version} (Copy)`,
    });
    form.validate();
  }

  return (
    <>
      <UserModVersionModal
        version={version}
        versionIdx={versionIdx}
        versionAddr={versionAddr}
        isOpen={isOpen}
        onClose={versionModal.close}
      />
      <Table.Tr key={versionAddr}>
        <Table.Td>
          <Checkbox
            checked={version.version === form.values.latest}
            onChange={noop}
          />
        </Table.Td>
        <Table.Td>{version.name}</Table.Td>
        <Table.Td>{version.version}</Table.Td>
        <Table.Td>{new Date(version.date).toLocaleString()}</Table.Td>
        <Table.Td>
          <Menu>
            <Menu.Target>
              <ActionIcon variant="subtle">
                <BsThreeDotsVertical />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                disabled={version.version === form.values.latest}
                onClick={() => form.setFieldValue("latest", version.version)}
              >
                Make Active Release
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item leftSection={<BiCopy />} onClick={handleCopy}>
                Copy
              </Menu.Item>
              <Menu.Item leftSection={<BiEdit />} onClick={versionModal.open}>
                Edit
              </Menu.Item>
              <Menu.Item
                leftSection={<BiTrash />}
                color="red"
                onClick={() => form.removeListItem("versions", versionIdx)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Table.Td>
      </Table.Tr>
    </>
  );
}

function ReviewPanel() {
  const {
    original,
    modified,
    submit,
    submission,
    form,
  } = useUserModPageContext();

  return (
    <Stack p="sm">
      <Title order={3}>Review</Title>
      {!form.isValid() && (
        <Alert color="red" title="Errors">
          {stringify(form.errors)}
        </Alert>
      )}
      <DiffEditor
        height="70vh"
        original={original}
        modified={modified}
        language="yaml"
        onMount={(_editor, monaco) => {
          monaco.editor.setTheme("vs-dark");
        }}
        options={{
          readOnly: true,
          folding: true,
          hideUnchangedRegions: { enabled: true },
        }}
      />
      {submission.error && <Alert color="red">{submission.error.message}
      </Alert>}
      <Group justify="end">
        <Button variant="default" onClick={form.reset}>
          Reset Changes
        </Button>
        <Button
          onClick={submit}
          loading={submission.loading}
          disabled={modified === original || !form.isValid()}
        >
          {modified === original ? "No Changes" : "Save Changes"}
        </Button>
      </Group>
    </Stack>
  );
}

function ReleasesPanel() {
  const { form } = useUserModPageContext();

  return (
    <Container>
      <Stack>
        <TableTitle
          title="Releases"
          titleOrder={4}
          help={RELEASES_HELP}
          onAdd={() => {
            form.insertListItem("versions", {
              name: "",
              version: "",
              date: new Date(),
              releasepage: "",
              assets: [],
            });
            form.validate();
          }}
        />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Active</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Version</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th />
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {form.values.versions.map((version, versionIdx) => (
              <_UserModVersionRow
                key={`versions.${versionIdx}`}
                version={version}
                versionIdx={versionIdx}
              />
            ))}
          </Table.Tbody>
          {!form.values.versions.length && (
            <Table.Caption>
              <Text>{NO_RELEASES_CAPTION}</Text>
            </Table.Caption>
          )}
        </Table>
      </Stack>
    </Container>
  );
}

function ReadmePanel() {
  const { form } = useUserModPageContext();
  const [tab, setTab] = React.useState<"preview" | "edit">("preview");

  return (
    <Container maw="1544px">
      <Tabs
        value={tab}
        variant="pills"
        orientation="vertical"
        placement="right"
      >
        <Tabs.List>
          <Tabs.Tab value="preview" onClick={() => setTab("preview")}>
            Preview
          </Tabs.Tab>
          <Tabs.Tab value="edit" onClick={() => setTab("edit")}>
            Edit
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel p="md" value="edit">
          <Editor
            height="100vh"
            onMount={(_, monaco) => monaco.editor.setTheme("vs-dark")}
            language="markdown"
            value={form.values.content}
            onChange={(content) =>
              content && form.setFieldValue("content", content)}
            options={{
              theme: "vs-dark",
              lineNumbers: "off",
              minimap: { enabled: false },
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel p="md" value="preview">
          <TypographyStylesProvider className="readme">
            <div
              onDoubleClick={() => setTab("edit")}
              dangerouslySetInnerHTML={{
                __html: marked.parse(form.values.content),
              }}
            />
          </TypographyStylesProvider>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

function useUserMod(id: string) {
  const { user } = useUserContext();
  return useAsync(
    (): Promise<Mod> => getUserModById(id).then((res) => res.data),
    [id, user],
  );
}

function useMods() {
  return useAsync(
    (): Promise<ModSummary[]> => getUserMods().then((res) => res.data),
    [],
  );
}

const paramsSchema = z.object({ id: z.string() });

export const UserModPage: React.FC = () => {
  const { id } = useValidatedParams(paramsSchema);

  const mod = useUserMod(id);

  if (mod.error) return <Alert color="red">{mod.error.message}</Alert>;

  return (
    <AppShell.Main>
      <Stack>
        <LoadingOverlay visible={mod.loading} />
        {mod.value && (
          <UserModPageProvider mod={mod.value}>
            <Tabs p="md" orientation="vertical" defaultValue="details">
              <Tabs.List>
                <Tabs.Tab value="details">Details</Tabs.Tab>
                <Tabs.Tab value="readme">Readme</Tabs.Tab>
                <Tabs.Tab value="releases">Releases</Tabs.Tab>
                <Tabs.Tab value="manage">Manage</Tabs.Tab>
                <Tabs.Tab value="review">Review</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="details">
                <DetailsPanel />
              </Tabs.Panel>
              <Tabs.Panel value="readme">
                <ReadmePanel />
              </Tabs.Panel>
              <Tabs.Panel value="releases">
                <ReleasesPanel />
              </Tabs.Panel>
              <Tabs.Panel value="manage">
                <ManagePanel />
              </Tabs.Panel>
              <Tabs.Panel value="review">
                <ReviewPanel />
              </Tabs.Panel>
            </Tabs>
          </UserModPageProvider>
        )}
      </Stack>
    </AppShell.Main>
  );
};
