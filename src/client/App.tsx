import { AppShell } from "@mantine/core";
import { AppHeader } from "./components/AppHeader.tsx";
import { HashRouter, Route, Routes } from "react-router-dom";
import { IndexPage } from "./pages/IndexPage.tsx";
import { ModPage } from "./pages/ModPage.tsx";
import { SudoModsPage } from "./pages/SudoModsPage.tsx";
import { useUserContext } from "./context/UserContext.ts";
import { UserModsPage } from "./pages/UserModsPage.tsx";
import { UserModPage } from "./pages/UserModPage.tsx";

export function App() {
  const { user } = useUserContext();
  return (
    <AppShell header={{ height: 66 }}>
      <HashRouter>
        <AppHeader />
        <Routes>
          <Route path="/" element={<IndexPage />} />
          {user?.sudo && <Route path="/sudo-mods" element={<SudoModsPage />} />}
          {user && <Route path="/user-mods" element={<UserModsPage />} />}
          {user && <Route path="/user-mods/:id" element={<UserModPage />} />}
          <Route path="/:id" element={<ModPage />} />
        </Routes>
      </HashRouter>
    </AppShell>
  );
}
