import { useForm } from "@mantine/form";
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
  expense,
  actualizingExpenses,
}: {
  expense: ExpenseRecord;
  actualizingExpenses: boolean;
}) {
  const [saving, setSaving] = useState(false);
  const [readOnly, setReadOnly] = useState(Boolean(expense.id));

  const {
    Description,
    ["Unit Amount"]: UnitAmount,
    Unit,
    Quantity,
    ["Actual Total"]: ActualTotal,
  } = expense.fields;

  const form = useForm({
    initialValues: {
      Description,
      Actualized: ActualTotal !== undefined,
      UnitAmount,
      Unit,
      Quantity,
      ActualTotal,
    },
  });
  const formValues = form.getValues();

  const handleExpenseSave = async () => {
    setSaving(true);
    const { UnitAmount, ActualTotal, ...fields } = formValues;
    const updateExpense = httpsCallable(functions, "update_expense");

    try {
      await updateExpense({
        expenseId: expense.id,
        fields: {
          "Actual Total": ActualTotal,
          "Unit Amount": UnitAmount,
          ...fields,
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
  if (formValues.UnitAmount && formValues.Quantity) {
    total = formValues.UnitAmount * formValues.Quantity;
  }

  if (actualizingExpenses) {
    return (
      <Table.Tr>
        <Table.Td>{formValues.Description}</Table.Td>
        <Table.Td>${formValues.UnitAmount}</Table.Td>
        <Table.Td>{formValues.Unit}</Table.Td>
        <Table.Td>{formValues.Quantity}</Table.Td>
        <Table.Td>${total}</Table.Td>
        <Table.Td style={{ maxWidth: "100px" }}>
          <NumberInput
            hideControls
            prefix="$"
            {...form.getInputProps("ActualTotal")}
          />
        </Table.Td>
        <Table.Td>
          <Checkbox
            {...form.getInputProps("Actualized", { type: "checkbox" })}
          />
        </Table.Td>
        <Table.Td></Table.Td>
      </Table.Tr>
    );
  }

  if (readOnly) {
    return (
      <Table.Tr style={{ height: "51px" }}>
        <Table.Td>{formValues.Description}</Table.Td>
        <Table.Td>${formValues.UnitAmount}</Table.Td>
        <Table.Td>{formValues.Unit}</Table.Td>
        <Table.Td>{formValues.Quantity}</Table.Td>
        <Table.Td>${total}</Table.Td>
        <Table.Td>${formValues.ActualTotal || " -"}</Table.Td>
        <Table.Td>
          {formValues.Actualized ? (
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
        <NumberInput
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
        <NumberInput
          disabled={readOnly}
          {...form.getInputProps("Quantity")}
          // className={"w-24"}
          width={"60px"}
        />
      </Table.Td>
      <Table.Td>${total}</Table.Td>
      <Table.Td>${formValues.ActualTotal || " -"}</Table.Td>
      <Table.Td>
        <Checkbox {...form.getInputProps("Actualized", { type: "checkbox" })} />
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
  expenses: ExpenseRecord[];
  actualizingExpenses: boolean;
}

export function ExpenseRows({
  expenses,
  actualizingExpenses,
}: ExpenseRowsProps) {
  return (
    <Table.Tbody>
      {expenses.map((expense, i) => (
        <ExpenseRow
          expense={expense}
          key={i}
          actualizingExpenses={actualizingExpenses}
        />
      ))}
    </Table.Tbody>
  );
}
