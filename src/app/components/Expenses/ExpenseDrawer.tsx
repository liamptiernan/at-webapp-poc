import { Button, Drawer, Stack, Table } from "@mantine/core";
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
import { IconPlus } from "@tabler/icons-react";

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
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);

  const addExpense = async () => {
    if (!activeProject) {
      return;
    }
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
      <Stack gap={"md"}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Description</Table.Th>
              <Table.Th>Unit Amount</Table.Th>
              <Table.Th>Unit</Table.Th>
              <Table.Th>Quantity</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Actualized</Table.Th>
              <Table.Th>Edit</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <ExpenseRows expenses={expenses} />
        </Table>
        <Button
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
