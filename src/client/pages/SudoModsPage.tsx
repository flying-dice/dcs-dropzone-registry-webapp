import { ActionIcon, AppShell, Container, Menu, Table } from "@mantine/core";
import { modals, openConfirmModal, openModal } from "@mantine/modals";
import React from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { Editor } from "@monaco-editor/react";
import {
  deleteSudoModById,
  getSudoModSchema,
  Mod,
  setSudoModbyId,
  useGetSudoMods,
} from "../_autogen/api.ts";
import { SudoModForm } from "../forms/sudo-mod.form.tsx";
import {
  showErrorNotification,
  showSuccessNotification,
} from "../utils/notifications.ts";
import { TableTitle } from "../components/TableTitle.tsx";
import { AxiosError } from "axios";
import { stringify } from "yaml";

export const SudoModsPage: React.FC = () => {
  const mods = useGetSudoMods();

  const handleView = (mod: Mod) => {
    openModal({
      title: `${mod.name} (${mod.id})`,
      size: "70vw",
      children: (
        <Editor
          height="70vh"
          language="json"
          options={{ theme: "vs-dark", readOnly: true }}
          value={JSON.stringify(mod, undefined, 2)}
          onMount={(_, m) => m.editor.setTheme("vs-dark")}
        />
      ),
    });
  };

  const handleEdit = async (mod: Mod) => {
    const schema = await getSudoModSchema();

    openModal({
      title: `${mod.name} (${mod.id})`,
      size: "70vw",
      children: (
        <SudoModForm
          schema={schema.data}
          defaultValue={{ mod: JSON.stringify(mod, undefined, 2) }}
          onSubmit={async (v) => {
            const mod = JSON.parse(v.mod);
            await setSudoModbyId(mod.id, mod).catch((e: AxiosError) => {
              throw new Error(stringify(e.response?.data, undefined, 2));
            });
            await mods.refetch();
            showSuccessNotification("Mod updated successfully");
            modals.closeAll();
          }}
          onClose={modals.closeAll}
        />
      ),
    });
  };

  const handleDelete = (mod: Mod) => {
    openConfirmModal({
      title: `Delete ${mod.name} (${mod.id})`,
      children: `Are you sure you want to delete ${mod.name}?`,
      onConfirm: async () => {
        try {
          await deleteSudoModById(mod.id);
          await mods.refetch();
          showSuccessNotification("Mod deleted successfully");
          modals.closeAll();
        } catch (error) {
          showErrorNotification(error);
        }
      },
      onCancel() {
        modals.closeAll();
      },
      confirmProps: {
        color: "red",
        children: "Yes, delete",
      },
      cancelProps: {
        children: "No, keep",
      },
    });
  };

  const handleAdd = () => {
    const newMod: Mod = {
      id: "",
      name: "",
      homepage: "",
      authors: [],
      category: "",
      description: "",
      license: "",
      content: "",
      dependencies: [],
      maintainers: [],
      imageUrl: "",
      tags: [],
      versions: [],
      published: false,
    };

    handleEdit(newMod);
  };

  const rows = mods.data?.data.map((it) => (
    <Table.Tr key={it.id}>
      <Table.Td>{it.id}</Table.Td>
      <Table.Td>{it.name}</Table.Td>
      <Table.Td>{`${it.published}`}</Table.Td>
      <Table.Td>
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <BsThreeDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={() => handleView(it)}>View</Menu.Item>
            <Menu.Item onClick={() => handleEdit(it)}>Edit</Menu.Item>
            <Menu.Item onClick={() => handleDelete(it)}>Delete</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <AppShell.Main>
      <Container pt="md">
        <TableTitle
          title="Sudo Mods"
          help="> Sudo mode allows you to manage all mods as a superuser. Use with caution. This is a restricted feature for administrators only. This is available as a replacement for direct database access."
          titleOrder={3}
          onAdd={() => handleAdd()}
        />
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Published</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Container>
    </AppShell.Main>
  );
};
