import { UseFormReturnType } from "@mantine/form";
import { ExpenseRecord, unitOptions } from "../types";
import {
  ActionIcon,
  Checkbox,
  NumberInput,
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
} from "@tabler/icons-react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/app/firebase/main";

function ExpenseRow({
  form,
  expense,
  idx,
  actualizingExpenses,
  isActualized,
}: {
  form: UseFormReturnType<{ expenses: ExpenseRecord[] }>;
  expense: ExpenseRecord;
  idx: number;
  actualizingExpenses: boolean;
  isActualized: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [readOnly, setReadOnly] = useState(Boolean(expense.id));

  const handleExpenseSave = async () => {
    setSaving(true);
    const updateExpense = httpsCallable(functions, "update_expense");
    const formExpense = form.getValues().expenses[idx];

    const { Description, Unit, Quantity } = formExpense.fields;

    try {
      await updateExpense({
        expenseId: expense.id,
        fields: {
          Description,
          Unit,
          Quantity,
          ["Unit Amount"]: formExpense.fields["Unit Amount"],
          ["Actual Total"]: formExpense.fields["Actual Total"],
        },
      });

      setSaving(false);
      setReadOnly(true);
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  };

  let total = 0;
  if (expense.fields["Unit Amount"] && expense.fields.Quantity) {
    total = expense.fields["Unit Amount"] * expense.fields.Quantity;
  }

  if (actualizingExpenses) {
    return (
      <Table.Tr>
        <Table.Td>{expense.fields.Description}</Table.Td>
        <Table.Td>${expense.fields["Unit Amount"]}</Table.Td>
        <Table.Td>{expense.fields.Unit}</Table.Td>
        <Table.Td>{expense.fields.Quantity}</Table.Td>
        <Table.Td>${total}</Table.Td>
        <Table.Td style={{ maxWidth: "100px" }}>
          <NumberInput
            hideControls
            prefix="$"
            {...form.getInputProps(`expenses.${idx}.fields.Actual Total`)}
          />
        </Table.Td>
        <Table.Td>
          <Checkbox
            {...form.getInputProps(`expenses.${idx}.fields.Actualized`, {
              type: "checkbox",
            })}
          />
        </Table.Td>
        <Table.Td></Table.Td>
      </Table.Tr>
    );
  }

  if (readOnly) {
    return (
      <Table.Tr style={{ height: "51px" }}>
        <Table.Td>{expense.fields.Description}</Table.Td>
        <Table.Td>${expense.fields["Unit Amount"]}</Table.Td>
        <Table.Td>{expense.fields.Unit}</Table.Td>
        <Table.Td>{expense.fields.Quantity}</Table.Td>
        <Table.Td>${total}</Table.Td>
        <Table.Td>${expense.fields["Actual Total"] || " -"}</Table.Td>
        <Table.Td>
          {expense.fields.Actualized ? (
            <IconCheck color="#309e04" />
          ) : (
            <IconCircleDashed color="#dda603" />
          )}
        </Table.Td>
        <Table.Td>
          {!isActualized && (
            <ActionIcon onClick={() => setReadOnly(false)} variant="subtle">
              <IconEdit />
            </ActionIcon>
          )}
        </Table.Td>
      </Table.Tr>
    );
  }

  return (
    <Table.Tr>
      <Table.Td>
        <TextInput
          {...form.getInputProps(`expenses.${idx}.fields.Description`)}
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          variant={readOnly ? "unstyled" : "default"}
          leftSection="$"
          {...form.getInputProps(`expenses.${idx}.fields.Unit Amount`)}
        />
      </Table.Td>
      <Table.Td>
        <Select
          data={unitOptions}
          {...form.getInputProps(`expenses.${idx}.fields.Unit`)}
        />
      </Table.Td>
      <Table.Td>
        <NumberInput
          {...form.getInputProps(`expenses.${idx}.fields.Quantity`)}
          // className={"w-24"}
          width={"60px"}
        />
      </Table.Td>
      <Table.Td>${total}</Table.Td>
      <Table.Td>${expense.fields["Actual Total"] || " -"}</Table.Td>
      <Table.Td>
        <Checkbox
          {...form.getInputProps(`expenses.${idx}.fields.Actualized`, {
            type: "checkbox",
          })}
        />
      </Table.Td>
      <Table.Td>
        <ActionIcon
          loading={saving}
          onClick={handleExpenseSave}
          variant="subtle"
        >
          <IconDeviceFloppy />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  );
}

interface ExpenseRowsProps {
  form: UseFormReturnType<{ expenses: ExpenseRecord[] }>;
  actualizingExpenses: boolean;
  isActualized: boolean;
}

export function ExpenseRows({
  form,
  actualizingExpenses,
  isActualized,
}: ExpenseRowsProps) {
  return (
    <Table.Tbody>
      {form.getValues().expenses.map((expense, i) => (
        <ExpenseRow
          form={form}
          expense={expense}
          idx={i}
          key={i}
          actualizingExpenses={actualizingExpenses}
          isActualized={isActualized}
        />
      ))}
    </Table.Tbody>
  );
}
