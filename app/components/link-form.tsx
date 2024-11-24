import { CornerDownLeft, Loader } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";
import Validator from "~/lib/validator";

export default function LinkForm() {
  const fetcher = useFetcher();
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

  const validator = useMemo(
    () => Validator.hydrateError(fetcher?.data?.errors || {}),
    [fetcher.state],
  );

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data?.ok) {
      formRef.current?.reset();
      toast({
        title: fetcher.data?.message,
      });
    }
  }, [fetcher.state]);

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-xl shadow-lg p-4 mb-8 border border-gray-100">
      <fetcher.Form method="POST" action="/api/links" ref={formRef}>
        <div className="flex w-full items-center space-x-3">
          <Input
            placeholder={`Short your link`}
            name="url"
            className="flex-1 w-full bg-white/80 backdrop-blur-sm !py-6 text-lg placeholder:text-gray-400 rounded-lg border-gray-200/80 hover:border-gray-300/80 transition-colors"
          />

          <Button
            type="submit"
            size="icon"
            className="h-10 w-10 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {fetcher.state === "submitting" ? (
              <Loader />
            ) : (
              <CornerDownLeft className="text-white" size={20} />
            )}
          </Button>
        </div>
        {validator.hasError("url") ? (
          <p className="text-sm text-red-500 mt-1">{validator.error("url")}</p>
        ) : null}
      </fetcher.Form>
    </div>
  );
}
