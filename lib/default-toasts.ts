import { toast } from "sonner";

export function toastAddedToList(conName: string, listName: string) {
    toast.success(`Successfully Added "${conName}" to list "${listName}"`);
}

export function toastAlreadyInList(conName: string, listName: string) {
    toast.error(`"${conName}" is already in "${listName}"`);
}

export function toastRemovedFromList(conName: string, listName: string) {
    toast.error(`Removed "${conName}" from "${listName}"`);
}