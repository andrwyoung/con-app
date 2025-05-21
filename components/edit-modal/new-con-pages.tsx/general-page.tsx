import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import useShakeError from "@/hooks/use-shake-error";
import { FormState } from "@/lib/editing/reducer-helper";
import { NewConState } from "@/types/editor-types";
import React from "react";
import ResettableFieldWrapper from "../reset-buttons";
import { isValidUrl } from "@/utils/url";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function NewConGeneralPage({
  handleNextPage,
  state,
  setField,
}: {
  handleNextPage: () => void;
  state: FormState<NewConState>;
  setField: <K extends keyof NewConState>(
    field: K
  ) => (value: NewConState[K]) => void;
}) {
  const { error, shake, triggerError } = useShakeError();
  const nameRef = React.useRef<HTMLInputElement>(null);
  const websiteInputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  function handleValidate() {
    if (state.current.conName.trim() === "") {
      triggerError("Please Add a Convention Name");
      return;
    }

    if (
      state.current.website.trim() !== "" &&
      !isValidUrl(state.current.website)
    ) {
      triggerError("Please add a valid website or leave blank");
      return;
    }

    handleNextPage();
  }

  return (
    <>
      <div className="flex flex-col gap-6 py-4">
        <ResettableFieldWrapper label={`Convention Name:`} mandatory>
          <div className="max-w-1/2">
            <Input
              value={state.current.conName}
              ref={nameRef}
              onChange={(e) => setField("conName")(e.target.value)}
              placeholder="Convention Name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  websiteInputRef.current?.focus();
                } else if (e.key === "Escape") {
                  e.preventDefault();
                  nameRef.current?.blur();
                }
              }}
              className="bg-white"
            />
          </div>
        </ResettableFieldWrapper>

        <ResettableFieldWrapper
          label={`Website:`}
          rightElement={
            state.current.website.trim() !== "" &&
            (isValidUrl(state.current.website) ? (
              <span className="text-green-600 text-xs ml-1 text-right">
                ✓ Nice!
              </span>
            ) : (
              <span className="text-red-500  text-xs ml-1">
                ✗ Please enter a valid URL (starts with https://)
              </span>
            ))
          }
        >
          <Input
            value={state.current.website}
            ref={websiteInputRef}
            onChange={(e) => setField("website")(e.target.value)}
            placeholder="https://example.com"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                descriptionRef.current?.focus();
              } else if (e.key === "Escape") {
                e.preventDefault();
                websiteInputRef.current?.blur();
              }
            }}
            className="bg-white"
          />
        </ResettableFieldWrapper>

        <ResettableFieldWrapper label={`Description:`}>
          <Textarea
            value={state.current.description}
            ref={descriptionRef}
            onChange={(e) => setField("description")(e.target.value)}
            placeholder="Enter a short description"
            className="bg-white"
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                descriptionRef.current?.blur();
              }
            }}
          />
        </ResettableFieldWrapper>
      </div>

      <DialogFooter>
        <div className="flex flex-col gap-2 items-center">
          <Button
            onClick={handleValidate}
            disabled={state.current.conName.trim() === ""}
            variant="outline"
          >
            Continue
          </Button>
          {error && (
            <span
              id="aa-update-error"
              className={`text-sm ${shake && "animate-shake"} text-red-500`}
            >
              {error}
            </span>
          )}
        </div>
      </DialogFooter>
    </>
  );
}
