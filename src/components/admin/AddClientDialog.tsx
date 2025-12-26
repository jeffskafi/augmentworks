"use client";

import { useActionState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { createClient, type CreateClientState } from "~/actions/admin";
import { useEffect, useState } from "react";

export function AddClientDialog() {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<CreateClientState, FormData>(
    createClient,
    {}
  );

  useEffect(() => {
    if (state.success) {
      setOpen(false);
    }
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-violet-600 text-white hover:bg-violet-700">
          <Plus className="size-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="border-violet-900/50 bg-slate-900 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-violet-100">Add New Client</DialogTitle>
          <DialogDescription className="text-violet-400/70">
            Create a new client account and project. They&apos;ll receive login
            credentials via email.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-violet-200">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="client@company.com"
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-violet-200">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Temporary password"
              required
              minLength={8}
              className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-violet-200">
              Company Name
            </Label>
            <Input
              id="companyName"
              name="companyName"
              placeholder="Acme Corp"
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="projectName" className="text-violet-200">
              Project Name
            </Label>
            <Input
              id="projectName"
              name="projectName"
              placeholder="AI Customer Service Bot"
              required
              className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contractValue" className="text-violet-200">
              Monthly Contract Value ($)
            </Label>
            <Input
              id="contractValue"
              name="contractValue"
              type="number"
              placeholder="2500"
              min="0"
              step="100"
              className="border-violet-900/50 bg-slate-800 text-violet-100 placeholder:text-violet-400/50"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}
          {state.success && (
            <p className="text-sm text-emerald-400">{state.success}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-violet-300 hover:bg-violet-600/10 hover:text-violet-100"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-violet-600 text-white hover:bg-violet-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

