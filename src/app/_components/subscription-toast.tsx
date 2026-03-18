"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { CircleCheckBig, CircleX } from "lucide-react";

export function SubscriptionToast() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isSuccess = searchParams.get("success");
    const isError = searchParams.get("error");

    if (isSuccess === "true") {
      toast.success("Inscrição concluída!", {
        position: "top-center",
        description:
          "Os próximos jogos do Mengão já estão no seu Google Calendar.",
        duration: 5000,
        icon: <CircleCheckBig />,
        className:
          "!bg-zinc-900 !border !border-flamengo-red !shadow-lg !shadow-red-900/20",
        classNames: {
          title: "!text-flamengo-red !font-bold !text-lg",
          description: "!text-gray-300 !font-medium",
          icon: "!mr-3",
        },
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("success");

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    }
    if (isError) {
      toast.error("Erro na inscrição!", {
        description: `Houve um erro na inscrição. Tente novamente em alguns minutos.`,
        duration: 5000,
        position: "top-center",
        icon: <CircleX />,
        className:
          "!bg-zinc-900 !border !border-flamengo-red !shadow-lg !shadow-red-900/20",
        classNames: {
          title: "!text-flamengo-red !font-bold !text-lg",
          description: "!text-gray-300 !font-medium",
          icon: "!mr-3",
        },
      });

      const newSearchParams = new URLSearchParams(searchParams.toString());
      newSearchParams.delete("error");

      const newUrl = newSearchParams.toString()
        ? `${pathname}?${newSearchParams.toString()}`
        : pathname;

      router.replace(newUrl, { scroll: false });
    }
  }, [searchParams, pathname, router]);

  return null;
}
