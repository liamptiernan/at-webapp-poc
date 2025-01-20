import {
  Button,
  Drawer,
  Flex,
  LoadingOverlay,
  Stack,
  Table,
  Text,
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
import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { ActualizeAction } from "./ActualizeAction";

interface ExpenseDrawerProps {
  activeProject?: ProjectsRecord;
  opened: boolean;
  onClose: () => void;
  onRefresh: () => Promise<void>;
  isActualized: boolean;
}

export function ExpenseDrawer({
  activeProject,
  opened,
  onClose,
  onRefresh,
  isActualized,
}: ExpenseDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [addingExpense, setAddingExpense] = useState(false);
  const [actualizingExpenses, setActualizingExpenses] = useState(false);
  const form = useForm<{ expenses: ExpenseRecord[] }>({
    initialValues: {
      expenses: [],
    },
  });

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

    const expenses = form.getValues().expenses;
    form.setFieldValue("expenses", [...expenses, newExpense]);
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
      const defaults = result.data.records.map((expense) => ({
        ...expense,
        fields: {
          ...expense.fields,
          Actualized: expense.fields["Actualized"] || false,
        },
      }));
      form.setFieldValue("expenses", defaults);
      setLoading(false);
    };

    fetchExpenseData();
  }, [activeProject]);

  if (!activeProject) {
    return null;
  }

  const values = form.getValues();
  const grandTotal = values.expenses.reduce((acc, expense) => {
    if (expense.fields["Quantity"] && expense.fields["Unit Amount"]) {
      return acc + expense.fields["Quantity"] * expense.fields["Unit Amount"];
    }
    return acc;
  }, 0);
  const grandActualized = values.expenses.reduce((acc, expense) => {
    if (expense.fields["Actual Total"]) {
      return acc + expense.fields["Actual Total"];
    }
    return acc;
  }, 0);

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
        <ActualizeAction
          actualized={isActualized}
          actualizingExpenses={actualizingExpenses}
          form={form}
          setActualizingExpenses={setActualizingExpenses}
          onRefresh={onRefresh}
          activeProject={activeProject}
        />
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
            form={form}
            actualizingExpenses={actualizingExpenses}
            isActualized={isActualized}
          />
        </Table>
        <Flex direction="column" px={50} gap={"md"} align="flex-end">
          <Text fw={"bold"}>Total: ${grandTotal}</Text>
          <Text fw={"bold"}>Actualized: ${grandActualized}</Text>
        </Flex>
        <Button
          disabled={isActualized}
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
