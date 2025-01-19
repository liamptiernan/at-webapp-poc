import { functions } from "@/app/firebase/main";
import { Badge, Button } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconChecks, IconCircleCheckFilled } from "@tabler/icons-react";
import { IconCircleDashedCheck } from "@tabler/icons-react";
import { useState } from "react";
import { ExpenseRecord, ProjectsRecord } from "../types";
import { httpsCallable } from "@/app/firebase/main";

export function ActualizeAction({
  actualized,
  actualizingExpenses,
  form,
  setActualizingExpenses,
  onRefresh,
  activeProject,
}: {
  actualized: boolean;
  actualizingExpenses: boolean;
  form: UseFormReturnType<{ expenses: ExpenseRecord[] }>;
  setActualizingExpenses: (value: boolean) => void;
  onRefresh: () => Promise<void>;
  activeProject: ProjectsRecord;
}) {
  const [savingActuals, setSavingActuals] = useState(false);
  const [actualsSubmitted, setActualsSubmitted] = useState(false);

  const confirmActuals = async () => {
    try {
      setSavingActuals(true);
      const expenses = form.getValues().expenses;
      const updates = expenses.map((expense) => ({
        id: expense.id,
        fields: {
          "Actual Total": expense.fields["Actual Total"],
          Actualized: true,
        },
      }));

      const updateExpenses = httpsCallable(functions, "actualize_expenses");
      await updateExpenses({
        updates,
        projectId: activeProject?.id,
      });
      for (let i = 0; i < form.getValues().expenses.length; i++) {
        form.setFieldValue(`expenses.${i}.fields.Actualized`, true);
      }
      setActualizingExpenses(false);
      setActualsSubmitted(true);
      await onRefresh();
    } catch (error) {
      console.error(error);
    }
    setSavingActuals(false);
  };

  if (actualized || actualsSubmitted) {
    return (
      <Badge
        style={{ alignSelf: "flex-end" }}
        leftSection={<IconChecks size={16} />}
        color="green"
      >
        Actualized
      </Badge>
    );
  }
  if (actualizingExpenses) {
    return (
      <Button
        style={{ alignSelf: "flex-end" }}
        loading={savingActuals}
        onClick={confirmActuals}
        rightSection={<IconCircleCheckFilled />}
        variant="primary"
      >
        Confirm
      </Button>
    );
  }

  return (
    <Button
      style={{ alignSelf: "flex-end" }}
      onClick={() => setActualizingExpenses(true)}
      rightSection={<IconCircleDashedCheck />}
      variant="outline"
    >
      Actualize
    </Button>
  );
}
