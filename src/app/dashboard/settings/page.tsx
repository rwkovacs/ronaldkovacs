import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/stripe";
import { formatDate } from "@/lib/utils";
import { BillingButton } from "@/components/settings/billing-button";
import { ProfileForm } from "@/components/settings/profile-form";

export default async function SettingsPage() {
  const session = await auth();
  const user = await db.user.findUnique({ where: { id: session!.user!.id! } });
  if (!user) return null;

  const isSubscribed =
    user.stripeSubscriptionId &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date();

  const currentPlan = isSubscribed
    ? Object.values(PLANS).find((p) => p.priceId === user.stripePriceId) ?? null
    : null;

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <ProfileForm user={user} />

      <Card>
        <CardHeader><p className="font-medium text-gray-900">Billing</p></CardHeader>
        <CardContent>
          {isSubscribed && currentPlan ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{currentPlan.name} plan</p>
                  <p className="text-sm text-gray-500">
                    ${currentPlan.price}/month · Renews {formatDate(user.stripeCurrentPeriodEnd!)}
                  </p>
                </div>
                <BillingButton label="Manage billing" />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">You are on the free plan.</p>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div key={key} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-semibold text-gray-900">{plan.name}</p>
                    <p className="text-2xl font-bold text-gray-900 my-1">
                      ${plan.price}<span className="text-sm font-normal text-gray-500">/mo</span>
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1 mb-4">
                      {plan.features.map((f) => <li key={f}>• {f}</li>)}
                    </ul>
                    <BillingButton label={`Upgrade to ${plan.name}`} priceId={plan.priceId} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
