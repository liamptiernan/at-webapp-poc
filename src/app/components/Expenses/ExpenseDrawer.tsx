import {
  Button,
  Drawer,
  LoadingOverlay,
  Stack,
  Table,
  Title,
} from "@mantine/core";
import { httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import { functions } from "../../firebase/main";
import {
  ExpenseRecord,
  ExpenseResponse,
  ExpensesResponse,
  ProjectsRecord,
} from "../types";
import { ExpenseRows } from "./ExpenseRows";
import {
  IconCircleCheckFilled,
  IconCircleDashedCheck,
  IconPlus,
} from "@tabler/icons-react";

interface ExpenseDrawerProps {
  activeProject: ProjectsRecord | undefined;
  opened: boolean;
  onClose: () => void;
}

export function ExpenseDrawer({
  activeProject,
  opened,
  onClose,
}: ExpenseDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [actualizingExpenses, setActualizingExpenses] = useState(false);

  const confirmActuals = async () => {
    setActualizingExpenses(false);
  };

  const addExpense = async () => {
    if (!activeProject) {
      return;
    }
    setAddingExpense(true);
    const newExpense = {
      id: "",
      fields: {
        Description: "New Expense",
        Actualized: false,
        Unit: "Hour",
        Project: [activeProject?.id],
      },
    };
    const updateExpense = httpsCallable(functions, "create_expense");

    const res = (await updateExpense({
      fields: { ...newExpense.fields },
    })) as ExpenseResponse;

    newExpense.id = res?.data?.id;

    setExpenses([...expenses, newExpense]);
    setAddingExpense(false);
  };

  useEffect(() => {
    if (!activeProject) {
      return;
    }

    const fetchExpenseData = async () => {
      setLoading(true);
      const fetchExpenses = httpsCallable(
        functions,
        "fetch_expenses_for_project"
      );
      const result = (await fetchExpenses({
        projectId: activeProject?.id,
      })) as ExpensesResponse;
      setExpenses(result.data.records);
      setLoading(false);
    };

    fetchExpenseData();
  }, [activeProject]);

  if (!activeProject) {
    return null;
  }

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={`${activeProject.fields.Name} Expenses`}
      position="right"
      size={"xl"}
    >
      <LoadingOverlay visible={loading} />
      <Stack gap={"md"}>
        {actualizingExpenses ? (
          <Button
            style={{ alignSelf: "flex-end" }}
            loading={addingExpense}
            onClick={confirmActuals}
            rightSection={<IconCircleCheckFilled />}
            variant="primary"
          >
            Confirm
          </Button>
        ) : (
          <Button
            style={{ alignSelf: "flex-end" }}
            loading={addingExpense}
            onClick={() => setActualizingExpenses(true)}
            rightSection={<IconCircleDashedCheck />}
            variant="outline"
          >
            Actualize
          </Button>
        )}
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Unit Amount</Table.Th>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Actual Total</Table.Th>
              <Table.Th>Actualized</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <ExpenseRows
            expenses={expenses}
            actualizingExpenses={actualizingExpenses}
          />
        </Table>
        <Button
          loading={addingExpense}
          onClick={addExpense}
          leftSection={<IconPlus />}
          variant="outline"
        >
          Add Expense
        </Button>
      </Stack>
    </Drawer>
  );
}
