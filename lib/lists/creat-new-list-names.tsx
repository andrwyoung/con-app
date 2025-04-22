import { UserList } from "@/stores/list-store";

// determines naming conventions for new lists
export function generateNewListNames({
  lists,
  username,
}: {
  lists: Record<string, UserList>;
  username: string;
}) {
  const userCreatedLists = Object.entries(lists).filter(([id]) =>
    id.startsWith(`${username}-list-`)
  );

  const highestId = userCreatedLists.reduce((max, [id]) => {
    const num = parseInt(id.replace(`${username}-list-`, ""), 10);
    return isNaN(num) ? max : Math.max(max, num);
  }, -1);
  const newListId = `${username}-list-${highestId + 1}`;

  const unnamedLabelPrefix = "Unnamed List";
  const unnamedLabels = userCreatedLists
    .map(([, list]) => list.label)
    .filter((label) => label.startsWith(unnamedLabelPrefix));

  let label = unnamedLabelPrefix;
  if (unnamedLabels.length > 0) {
    const highestSuffix = unnamedLabels.reduce((max, curr) => {
      const match = curr.match(/Unnamed List (\d+)/);
      const num = match
        ? parseInt(match[1], 10)
        : curr === "Unnamed List"
        ? 1
        : 0;
      return Math.max(max, num);
    }, 0);

    label = `${unnamedLabelPrefix} ${highestSuffix + 1}`;
  }

  return { newListId, label };
}
