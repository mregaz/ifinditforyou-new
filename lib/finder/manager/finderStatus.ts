export type FinderExecutionStatus =
  | "success"
  | "partial"
  | "unavailable"
  | "no_providers";

type ProviderExecutionStatus = {
  status: "success" | "error";
};

export function resolveFinderStatus(
  executions: ProviderExecutionStatus[]
): FinderExecutionStatus {
  if (executions.length === 0) {
    return "no_providers";
  }

  const successCount = executions.filter(
    (execution) => execution.status === "success"
  ).length;

  if (successCount === executions.length) {
    return "success";
  }

  if (successCount === 0) {
    return "unavailable";
  }

  return "partial";
}
