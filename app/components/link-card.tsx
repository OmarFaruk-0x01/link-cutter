import { CornerDownRight, Trash } from "lucide-react";
import { useFetcher } from "react-router";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { cn } from "~/lib/utils";
import { LinkModel } from "~/routes/api/links.server";
import QrCodeModal from "./qrcode-modal";
import { Button } from "./ui/button";

type LinkCardProps = {
  className?: string;
  link: LinkModel;
  shortHost: string;
};

export default function LinkCard({
  className,
  link,
  shortHost,
}: LinkCardProps) {
  const fetcher = useFetcher({ key: "link-remover" });
  return (
    <div
      className={cn(
        "group/linkCard flex gap-3 items-center p-4 bg-white rounded-md shadow-xl border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        className,
      )}
    >
      <div className="shrink-0">
        <img
          src={
            "https://www.google.com/s2/favicons?sz=64&domain_url=" + link.link
          }
          width={32}
          height={32}
        />
      </div>
      <div className="grid  flex-1">
        <p className="font-semibold text-sm">
          {shortHost}/{link.shortCode}
        </p>
        <div className="flex items-center gap-1">
          <CornerDownRight size="14" />
          <p className="font-normal text-xs text-gray-500 mt-1">{link.link}</p>
        </div>
      </div>
      <div className="shrink-0">
        <QrCodeModal value={`${shortHost}/${link.shortCode}`} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="submit"
              size="icon"
              variant="link"
              className="text-red-400 "
            >
              <Trash />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                link and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  fetcher.submit(
                    {},
                    {
                      method: "POST",
                      action: `/api/links/${link.shortCode}/delete`,
                    },
                  );
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

LinkCard.Shimmer = ({ className }: Pick<LinkCardProps, "className">) => {
  return (
    <div
      className={cn(
        "flex gap-3 items-center p-4 bg-white rounded-md shadow-lg",
        className,
      )}
    >
      <div className="shrink-0">
        <div className="bg-gray-200 w-[32px] h-[32px] rounded-full"></div>
      </div>
      <div className="grid gap-2 flex-1">
        <p className="font-semibold text-sm bg-gray-200 h-4 w-[30%] rounded-full"></p>
        <p className="font-semibold text-sm bg-gray-200 h-4 w-[70%] rounded-full"></p>
      </div>
      <div className="shrink-0">
        <div className="bg-gray-200 w-[32px] h-[32px] rounded-lg"></div>
      </div>
    </div>
  );
};
