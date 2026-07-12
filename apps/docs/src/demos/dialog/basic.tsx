import { Button, Dialog } from "@blankjs/react";

export const DialogBasic = () => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button color="danger">Delete account</Button>
    </Dialog.Trigger>

    <Dialog.Content>
      <Dialog.Title>Delete account?</Dialog.Title>

      <Dialog.Description>
        This action is permanent. Your data will be gone for good.
      </Dialog.Description>

      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog.Root>
);
