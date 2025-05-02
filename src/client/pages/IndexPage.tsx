import {
  AppShell,
  Container,
  Pagination,
  Stack,
  TextInput,
} from "@mantine/core";
import { ModCard } from "../components/ModCard.tsx";
import { usePagination } from "@mantine/hooks";
import { useFuse } from "../hooks/useFuse.ts";
import { BsSearch } from "react-icons/bs";
import { useGetRegistryIndex } from "../_autogen/api.ts";

export function IndexPage() {
  const data = useGetRegistryIndex();
  const { results, search, setSearch } = useFuse(data.data?.data || [], "", [
    "name",
    "description",
  ]);

  const itemsPerPage = 20;
  const totalPages = Math.ceil((results.length || 0) / itemsPerPage);
  const pagination = usePagination({
    total: totalPages,
    initialPage: 1,
  });

  const paginatedData = results.slice(
    (pagination.active - 1) * itemsPerPage,
    pagination.active * itemsPerPage,
  );

  return (
    <AppShell.Main m="md">
      <Container>
        <Stack>
          <TextInput
            value={search}
            onChange={(it) => it && setSearch(it.target.value)}
            placeholder="Search..."
            leftSection={<BsSearch />}
          />

          {paginatedData?.map((mod) => <ModCard key={mod.id} mod={mod} />)}

          <Pagination
            total={totalPages}
            value={pagination.active}
            onChange={pagination.setPage}
          />
        </Stack>
      </Container>
    </AppShell.Main>
  );
}
