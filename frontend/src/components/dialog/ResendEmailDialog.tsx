import * as Dialog from "@radix-ui/react-dialog"

type ResendEmailDialogProps = {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    onSubmit: (e: React.FormEvent) => void,
    setEmail: (email: string) => void
}

export default function ResendEmailDialog({ open, onOpenChange, onSubmit, setEmail }: ResendEmailDialogProps) {
    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>
                <span
                    className="cursor-pointer text-blue-600 hover:text-blue-800 underline"
                    onClick={() => onOpenChange(true)}>
                    Need another verification email ? Click here
                </span>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide" />
                <Dialog.Content className="fixed left-1/2 top-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow-lg focus:outline-none data-[state=open]:animate-contentShow data-[state=closed]:animate-contentHide">
                    <Dialog.Title className="text-lg font-bold">Resend verification email</Dialog.Title>
                    <Dialog.Description className="mt-2 text-sm">
                        Please enter your email address and we’ll send you a new verification link.
                    </Dialog.Description>

                    <form onSubmit={onSubmit} method="POST">
                        <input
                            className="w-full mt-4 border p-2 rounded"
                            type="email"
                            required
                            autoComplete="email"
                            minLength={6}
                            maxLength={254}
                            placeholder="Email address"
                            onInput={(e) => setEmail((e.target as HTMLInputElement).value)}
                        />

                        <div className="mt-4 flex justify-end gap-2">
                            <Dialog.Close asChild>
                                <button className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                            </Dialog.Close>
                            <Dialog.Close asChild>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded" type="submit">
                                    Resend email
                                </button>
                            </Dialog.Close>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    )
}
