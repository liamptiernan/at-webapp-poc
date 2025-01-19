"use client";

import { DEFAULT_THEME, MantineProvider } from "@mantine/core";
import { ProjectTable } from "./components/ProjectTable";
import { Notifications } from "@mantine/notifications";

export default function Home() {
  return (
    <MantineProvider theme={DEFAULT_THEME}>
      <Notifications />
      <ProjectTable />
    </MantineProvider>
  );
}
