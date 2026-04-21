"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { initiateOnlinePaymentAction, type GatewayChoice } from "@/server/actions/payment-init";

type Props = {
  schoolSlug: string;
  invoiceId: string;
  gateways: { sslcommerz: boolean; bkash: boolean; nagad: boolean };
};

export function PayButtons({ schoolSlug, invoiceId, gateways }: Props) {
  const t = useTranslations("portal");
  const [pending, startTransition] = useTransition();

  function pay(gateway: GatewayChoice) {
    startTransition(async () => {
      const res = await initiateOnlinePaymentAction({ schoolSlug, invoiceId, gateway });
      if (res.ok && res.data) {
        toast.loading(t("pay_going_to_gateway"));
        window.location.href = res.data.redirectUrl;
      } else if (!res.ok) {
        toast.error(res.error);
      }
    });
  }

  const anyConfigured = gateways.sslcommerz || gateways.bkash || gateways.nagad;

  if (!anyConfigured) {
    return (
      <div className="rounded-md border border-warning/30 bg-warning/5 p-3 text-sm">
        <p className="font-semibold">{t("pay_online_disabled")}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("pay_online_disabled_body")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {gateways.sslcommerz ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() => pay("sslcommerz")}
          className="bg-gradient-primary text-white"
        >
          {t("pay_gateway_sslcommerz")}
        </Button>
      ) : null}

      {gateways.bkash ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() => pay("bkash")}
          variant="outline"
          className="border-pink-500/40 text-pink-500"
        >
          {t("pay_gateway_bkash")}
        </Button>
      ) : null}

      {gateways.nagad ? (
        <Button
          type="button"
          disabled={pending}
          onClick={() => pay("nagad")}
          variant="outline"
          className="border-orange-500/40 text-orange-500"
        >
          {t("pay_gateway_nagad")}
        </Button>
      ) : null}

      <p className="mt-2 text-xs text-muted-foreground">
        {t("pay_tip")}
      </p>
    </div>
  );
}
