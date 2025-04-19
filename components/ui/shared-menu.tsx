import {
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "./dropdown-menu";
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from "./context-menu";

export const SharedMenuItem = ({
  children,
  onClick,
  className = "",
  type = "context",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type: "dropdown" | "context";
}) => {
  return type === "context" ? (
    <ContextMenuItem onClick={onClick} className={className}>
      {children}
    </ContextMenuItem>
  ) : (
    <DropdownMenuItem onClick={onClick} className={className}>
      {children}
    </DropdownMenuItem>
  );
};

export const SharedMenuSeparator = ({
  type = "context",
}: {
  type: "context" | "dropdown";
}) =>
  type === "context" ? <ContextMenuSeparator /> : <DropdownMenuSeparator />;

export const SharedMenuSub = ({
  children,
  type = "context",
}: {
  children: React.ReactNode;
  type: "context" | "dropdown";
}) =>
  type === "context" ? (
    <ContextMenuSub>{children}</ContextMenuSub>
  ) : (
    <DropdownMenuSub>{children}</DropdownMenuSub>
  );

export const SharedMenuSubTrigger = ({
  children,
  className = "",
  onClick,
  type = "context",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type: "context" | "dropdown";
}) =>
  type === "context" ? (
    <ContextMenuSubTrigger onClick={onClick} className={className}>
      {children}
    </ContextMenuSubTrigger>
  ) : (
    <DropdownMenuSubTrigger onClick={onClick} className={className}>
      {children}
    </DropdownMenuSubTrigger>
  );

export const SharedMenuSubContent = ({
  children,
  className = "",
  type = "context",
}: {
  children: React.ReactNode;
  className?: string;
  type: "context" | "dropdown";
}) =>
  type === "context" ? (
    <ContextMenuSubContent className={className}>
      {children}
    </ContextMenuSubContent>
  ) : (
    <DropdownMenuSubContent className={className}>
      {children}
    </DropdownMenuSubContent>
  );

export const SharedMenuShortcut = ({
  children,
  className = "",
  type = "context",
}: {
  children: React.ReactNode;
  className?: string;
  type: "context" | "dropdown";
}) =>
  type === "context" ? (
    <ContextMenuShortcut className={className}>{children}</ContextMenuShortcut>
  ) : (
    <DropdownMenuShortcut className={className}>
      {children}
    </DropdownMenuShortcut>
  );
