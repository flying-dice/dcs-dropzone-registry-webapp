import {
  ActionIcon,
  Alert,
  Menu,
  Skeleton,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import React from "react";
import { useNavigate } from "react-router-dom";
import { BsThreeDotsVertical, BsViewList } from "react-icons/bs";
import { BiEdit, BiTrash } from "react-icons/bi";
import { closeAllModals, modals, openConfirmModal } from "@mantine/modals";
import { useAsyncWithRefresh } from "../hooks/useAsyncWithRefresh.ts";
import { NewModForm } from "../forms/new-mod.form.tsx";
import { openGithubRequestModTemplate } from "../utils/openGithubRequestModTemplate.ts";
import { TableTitle } from "../components/TableTitle.tsx";
import { useUserContext } from "../context/UserContext.ts";
import { ModTags } from "../components/ModTags.tsx";
import { ModAuthors } from "../components/ModAuthors.tsx";
import {
  getUserModById,
  getUserMods,
  ModSummary,
  updateUserMod,
} from "../_autogen/api.ts";
import { AppShell } from "@mantine/core";
import { Container } from "@mantine/core";

function useUserMods() {
  const { user } = useUserContext();
  return useAsyncWithRefresh(
    (): Promise<ModSummary[]> => getUserMods().then((it) => it.data),
    [user],
  );
}

export const UserModsPage: React.FC = () => {
  const nav = useNavigate();
  const mods = useUserMods();
  const { user } = useUserContext();

  function openUserMod(id: string) {
    nav(`/user-mods/${id}`);
  }

  function handleDeleteUserMod(id: string, name: string) {
    openConfirmModal({
      title: `Delete '${name}' Mod?`,
      children: (
        <Stack>
          <Text>
            Are you sure you want to delete this mod? This action cannot be
            undone.
          </Text>
          <Text fw="bold">
            This will permanently remove the mod from the registry!
          </Text>
        </Stack>
      ),
      onConfirm: async () => {
        if (!user) return;
        const mod = (await getUserModById(id))?.data;
        mod.published = false;
        await updateUserMod(id, mod);
        await mods.refresh();
        closeAllModals();
      },
      confirmProps: {
        color: "red",
        children: "Yes, Remove this mod",
      },
      cancelProps: {
        children: "Cancel",
      },
    });
  }

  const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
      <Table.Td>
        <Skeleton height={16} />
      </Table.Td>
    </Table.Tr>
  ));

  const rows = mods.value?.map((it) => (
    <Table.Tr key={it.id}>
      <Table.Td>{it.id}</Table.Td>
      <Table.Td>{it.name}</Table.Td>
      <Table.Td>
        <Stack gap="xs">
          {it.description}
          <ModTags tags={it.tags || []} />
        </Stack>
      </Table.Td>
      <Table.Td>{it.latest}</Table.Td>
      <Table.Td>
        <ModAuthors
          authors={it.authors.map((it) => ({ name: it })) || []}
          chunkSize={9}
        />
      </Table.Td>
      <Table.Td>{`${it.published}`}</Table.Td>
      <Table.Td>
        <Menu>
          <Menu.Target>
            <ActionIcon size="lg" variant="subtle">
              <BsThreeDotsVertical />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              leftSection={<BsViewList />}
              onClick={() => nav(`/${it.id}`)}
            >
              View in Registry
            </Menu.Item>
            <Menu.Item
              leftSection={<BiEdit />}
              onClick={() => openUserMod(it.id)}
            >
              Edit
            </Menu.Item>
            <Menu.Item
              leftSection={<BiTrash />}
              color="red"
              onClick={() => handleDeleteUserMod(it.id, it.name)}
            >
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Table.Td>
    </Table.Tr>
  ));

  function handleAdd() {
    modals.open({
      title: "Request a new mod space",
      children: (
        <NewModForm
          onSubmit={(values) => {
            if (!user) return;
            openGithubRequestModTemplate(
              user.id,
              values.name,
              values.homepage,
            );
            modals.closeAll();
          }}
          onClose={() => modals.closeAll()}
        />
      ),
    });
  }

  return (
    <AppShell.Main>
      <Container>
        <Stack pt="md">
          <TableTitle title="User Mods" titleOrder={3} onAdd={handleAdd} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
                <Table.Th>Latest</Table.Th>
                <Table.Th>Authors</Table.Th>
                <Table.Th>Published</Table.Th>
                <Table.Th w={64}></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
            {mods.loading && skeletonRows}
            {mods.value?.length === 0 && (
              <Table.Caption>
                <Alert>
                  Your mod library is empty. Add your creations and share
                  them with others!
                </Alert>
              </Table.Caption>
            )}
            {mods.error && (
              <Table.Caption>
                <Alert color="red">{`${mods.error}`}</Alert>
              </Table.Caption>
            )}
          </Table>
        </Stack>
      </Container>
    </AppShell.Main>
  );
};
