import { Form, useForm } from "@mantine/form";
import { ExpenseRecord, unitOptions } from "../types";
import {
  ActionIcon,
  Button,
  Checkbox,
  Select,
  Table,
  TextInput,
} from "@mantine/core";
import { useState } from "react";
import {
  IconCheck,
  IconCircleDashed,
  IconDeviceFloppy,
  IconEdit,
  IconSquare,
} from "@tabler/icons-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/firebase/main";

function convertFieldName(field: string) {
  const split = field.split(/(?=[A-Z])/);
  return split.join(" ");
}

function ExpenseRow({ expense }: { expense: ExpenseRecord }) {
  const [readOnly, setReadOnly] = useState(Boolean(expense.id));

  const {
    Description,
    Actualized,
    ["Unit Amount"]: UnitAmount,
    Unit,
    Quantity,
  } = expense.fields;

  const form = useForm({
    initialValues: {
      Description,
      Actualized: Actualized || false,
      UnitAmount,
      Unit,
      Quantity,
    },
  });
  const formValues = form.getValues();

  const handleExpenseSave = async () => {
    const { UnitAmount, ...fields } = formValues;
    const updateExpense = httpsCallable(functions, "update_expense");

    await updateExpense({
      expenseId: expense.id,
      fields: { "Unit Amount": UnitAmount, ...fields },
    });
    setReadOnly(true);
  };

  let total = 0;
  if (UnitAmount && Quantity) {
    total = UnitAmount * Quantity;
  }

  if (readOnly) {
    return (
      <Table.Tr>
        <Table.Td>{Description}</Table.Td>
        <Table.Td>${UnitAmount}</Table.Td>
        <Table.Td>{Unit}</Table.Td>
        <Table.Td>{Quantity}</Table.Td>
        <Table.Td>${total}</Table.Td>
        <Table.Td>
          {Actualized ? (
            <IconCheck color="#309e04" />
          ) : (
            <IconCircleDashed color="#dda603" />
          )}
        </Table.Td>
        <Table.Td>
          <ActionIcon onClick={() => setReadOnly(false)} variant="subtle">
            <IconEdit />
          </ActionIcon>
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <Table.Tr>
      <Table.Td>
        <TextInput disabled={readOnly} {...form.getInputProps("Description")} />
      </Table.Td>
      <Table.Td>
        <TextInput
          disabled={readOnly}
          variant={readOnly ? "unstyled" : "default"}
          leftSection="$"
          {...form.getInputProps("UnitAmount")}
        />
      </Table.Td>
      <Table.Td>
        <Select
          disabled={readOnly}
          data={unitOptions}
          {...form.getInputProps("Unit")}
        />
      </Table.Td>
      <Table.Td>
        <TextInput
          disabled={readOnly}
          {...form.getInputProps("Quantity")}
          // className={"w-24"}
          width={"60px"}
        />
      </Table.Td>
      <Table.Td>${total}</Table.Td>
      <Table.Td>
        <Checkbox {...form.getInputProps("Actualized", { type: "checkbox" })} />
      </Table.Td>
      <Table.Td>
        <ActionIcon onClick={handleExpenseSave} variant="subtle">
          <IconDeviceFloppy />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}

interface ExpenseRowsProps {
  expenses: ExpenseRecord[];
}

export function ExpenseRows({ expenses }: ExpenseRowsProps) {
  return (
    <Table.Tbody>
      {expenses.map((expense, i) => (
        <ExpenseRow expense={expense} key={i} />
      ))}
    </Table.Tbody>
  );
}
