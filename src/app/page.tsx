"use client";

import { MantineProvider } from "@mantine/core";
import { ProjectTable } from "./components/ProjectTable";
import { Notifications } from "@mantine/notifications";

export default function Home() {
  return (
    <MantineProvider>
      <Notifications />
      <ProjectTable />
    </MantineProvider>
  );
}
