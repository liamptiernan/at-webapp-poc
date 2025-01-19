"use client";

import { MantineProvider } from "@mantine/core";
import { ProjectTable } from "./components/ProjectTable";

export default function Home() {
  return (
    <MantineProvider>
      <ProjectTable />
    </MantineProvider>
  );
}
