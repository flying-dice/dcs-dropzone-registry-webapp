import { Alert, AppShell, Container } from "@mantine/core";
import { ReactNode } from "react";

export type ErrorPageProps = {
  title: string;
  message?: ReactNode;
};
export function ErrorPage({ title, message }: ErrorPageProps) {
  return (
    <AppShell.Main m="md">
      <Container>
        <Alert color="red" variant="light" title={title}>
          {message}
        </Alert>
      </Container>
    </AppShell.Main>
  );
}
