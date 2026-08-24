import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not configured");
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM ?? "no-reply@velvetsolecouture.com";

export interface ReceiptEmailPayload {
  to: string;
  customerName: string | null;
  productTitle: string;
  amountCents: number;
  transactionId: string;
}

export async function sendPurchaseReceipt(payload: ReceiptEmailPayload): Promise<void> {
  const amount = (payload.amountCents / 100).toFixed(2);

  await getResend().emails.send({
    from: FROM,
    to: payload.to,
    subject: `Your VelvetSole Couture receipt — ${payload.productTitle}`,
    text: [
      `Hi ${payload.customerName ?? "there"},`,
      "",
      `Thank you for your purchase.`,
      "",
      `  Item:          ${payload.productTitle}`,
      `  Amount:        $${amount} USD`,
      `  Transaction:   ${payload.transactionId}`,
      "",
      "You can access your content at any time by signing in to your account.",
      "",
      "VelvetSole Couture",
    ].join("\n"),
  });
}

export async function sendVerificationEmail(to: string, url: string): Promise<void> {
  await getResend().emails.send({
    from: FROM,
    to,
    subject: "Sign in to VelvetSole Couture",
    text: `Click the link below to sign in:\n\n${url}\n\nThis link expires in 24 hours.`,
  });
}
