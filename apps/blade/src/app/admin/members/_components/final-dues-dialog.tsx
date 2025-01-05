"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@forge/ui/dialog";
import { Button } from "@forge/ui/button";
import { Input } from "@forge/ui/input";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { CLEAR_DUES_MESSAGE } from "@forge/consts/knight-hacks";
import { USE_CAUTION } from "@forge/consts/knight-hacks";

import { api } from "~/trpc/react";

export default function FinalDuesDialogButton(
{ 
    disabled, 
    setFirstOpen,
    setSecondOpen
}: 
    { 
        disabled: boolean, 
        setFirstOpen: (value: boolean) => void;
        setSecondOpen: (value: boolean) => void;
    }
) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [confirmText, setConfirmText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const utils = api.useUtils();

    const clearDues = api.member.clearAllDues.useMutation({
        onSuccess() {
            toast.success("All dues cleared successfully!");
            setIsOpen(false);
            setConfirmText("");
        },
        onError(opts) {
            toast.error(opts.message);
            setIsLoading(false);
        },
        async onSettled() {
            setIsLoading(false);
            await utils.member.invalidate();
        }
    });

    const handleClearDues = () => {
        setIsLoading(true);
        clearDues.mutate();
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" disabled={disabled}>
                    Continue
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Please be sure.
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-md">
                    <div className="space-y-4 py-2">
                        <p>
                            <b className="text-red-500">
                                Please be absolutely sure.
                            </b> {" "} This action is {" "}
                            <b className="text-red-500">
                                DESTRUCTIVE AND IRREVERSIBLE.
                            </b>
                            {" "} Mistakenly clearing all dues {" "}
                            <b className="text-red-500">
                                WILL
                            </b> {" "}
                            result in {" "}
                            <b className="text-red-500">
                                TERMINATION
                            </b> {" "} of your position at Knight Hacks.
                        </p>
                        <p>If you would like to proceed, please type:</p>
                        <p>
                            <b>
                                "I am aware of the consequences regarding this action
                                if it were by mistake. I am absolutely sure that I want to 
                                clear all dues."
                            </b>
                        </p>
                        <Input
                            placeholder="Type the text shown above."
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                    </div>
                </DialogDescription>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setIsOpen(false);
                            setConfirmText("");
                            setFirstOpen(false);
                            setSecondOpen(false);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        disabled={
                            USE_CAUTION as boolean ? 
                            confirmText !== CLEAR_DUES_MESSAGE || isLoading 
                            : isLoading
                        }
                        onClick={handleClearDues}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : "CLEAR ALL DUES" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}