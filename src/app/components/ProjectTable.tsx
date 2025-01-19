import {
  ActionIcon,
  Badge,
  Button,
  Chip,
  Indicator,
  LoadingOverlay,
  Paper,
  Space,
  Table,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../firebase/main";
import { ProjectsRecord, ProjectsResponse } from "./types";
import {
  IconArrowNarrowRight,
  IconCameraCheck,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { ExpenseDrawer } from "./Expenses/ExpenseDrawer";

const statusColors: Record<string, string> = {
  "In progress": "blue",
  Done: "green",
  Cancelled: "theme.colors.red[2]",
  Todo: "gray",
};

export function ProjectTable() {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<ProjectsRecord[]>([]);
  const [currentExpenseProject, setCurrentExpenseProject] =
    useState<ProjectsRecord>();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const fetchProjectData = async () => {
    setLoading(true);
    const test = httpsCallable(functions, "fetch_projects");
    const result = (await test()) as ProjectsResponse;
    setProjects(result.data.records);
    setLoading(false);
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  const handleExpenseClick = (project: ProjectsRecord) => {
    setCurrentExpenseProject(project);
    openDrawer();
  };

  const rows = projects.map((project, i) => {
    const actualsOverdue =
      !project.fields["Actualized"] &&
      project.fields["Publish Date"] &&
      project.fields["Publish Date"] < new Date().toISOString();
    return (
      <Table.Tr key={i}>
        <Table.Td
          p={0}
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          {actualsOverdue && (
            <Tooltip label="Actuals are overdue">
              <ActionIcon variant="white" color="red">
                <IconExclamationCircle />
              </ActionIcon>
            </Tooltip>
          )}
        </Table.Td>
        <Table.Td>{project.fields.Name}</Table.Td>
        <Table.Td>
          <Badge
            color={project.fields.Status && statusColors[project.fields.Status]}
          >
            {project.fields.Status}
          </Badge>
        </Table.Td>
        <Table.Td>{project.fields["Youtube Link"]}</Table.Td>
        <Table.Td>{project.fields["Publish Date"] || "-"}</Table.Td>
        <Table.Td>
          <Button
            onClick={() => handleExpenseClick(project)}
            variant="outline"
            rightSection={<IconArrowNarrowRight />}
            size="xs"
            color={actualsOverdue ? "red" : "blue"}
          >
            Expenses
          </Button>
        </Table.Td>
      </Table.Tr>
    );
  });

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
        <Space w={10} />
        <ThemeIcon variant="white" size={"xl"}>
          <IconCameraCheck size={70} />
        </ThemeIcon>
      </Paper>
      <LoadingOverlay visible={loading} />
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Youtube Link</Table.Th>
            <Table.Th>Publish Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      <ExpenseDrawer
        activeProject={currentExpenseProject}
        opened={drawerOpened}
        onClose={closeDrawer}
        onRefresh={fetchProjectData}
        isActualized={currentExpenseProject?.fields["Actualized"] || false}
      />
    </>
  );
}
