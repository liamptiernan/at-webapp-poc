import { Button, LoadingOverlay, Paper, Table, Title } from "@mantine/core";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/main";
import { ProjectsRecord, ProjectsResponse } from "./types";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ExpenseDrawer } from "./Expenses/ExpenseDrawer";

export function ProjectTable() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectsRecord[]>([]);
  const [currentExpenseProject, setCurrentExpenseProject] =
    useState<ProjectsRecord>();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      const test = httpsCallable(functions, "fetch_projects");
      const result = (await test()) as ProjectsResponse;
      setProjects(result.data.records);
      setLoading(false);
    };
    fetchProjectData();
  }, []);

  const handleExpenseClick = (project: ProjectsRecord) => {
    setCurrentExpenseProject(project);
    openDrawer();
  };

  // Call the function and pass data

  const rows = projects.map((project, i) => (
    <Table.Tr key={i}>
      <Table.Td>{project.fields.Name}</Table.Td>
      <Table.Td>{project.fields.Status}</Table.Td>
      <Table.Td>{project.fields["Youtube Link"]}</Table.Td>
      <Table.Td>
        <Button
          onClick={() => handleExpenseClick(project)}
          variant="outline"
          rightSection={<IconArrowNarrowRight />}
          size="xs"
        >
          Expenses
        </Button>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Paper
        p="lg"
        withBorder
        h={"60px"}
        display={"flex"}
        mb={20}
        style={{ alignItems: "center" }}
      >
        <Title order={1}>Projects</Title>
      </Paper>
      <LoadingOverlay visible={loading} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Youtube Link</Table.Th>
            <Table.Th>Expenses</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <ExpenseDrawer
        activeProject={currentExpenseProject}
        opened={drawerOpened}
        onClose={closeDrawer}
      />
    </>
  );
}
