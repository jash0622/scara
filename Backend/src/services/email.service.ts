import { render } from "@react-email/render";
import { resendClient } from "../config/resend";
import { env } from "../config/env";
import { logger } from "../utils/logger";
import { ConfirmationEmail } from "../emails/ConfirmationEmail";
import { InternalNotificationEmail } from "../emails/InternalNotificationEmail";

export interface ConfirmationEmailParams {
  name: string;
  email: string;
}

export interface InternalNotificationParams {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  submittedAt: string;
}

/**
 * Send a branded "Thank You" confirmation email to the enquirer.
 * Should be called after a successful DB insert — wrap in try/catch at call site.
 */
export async function sendConfirmationEmail(params: ConfirmationEmailParams): Promise<void> {
  const html = await render(ConfirmationEmail({ name: params.name }));

  const result = await resendClient.emails.send({
    from: env.EMAIL_FROM,
    to: params.email,
    subject: "We've received your message — SCARA",
    html,
  });

  logger.info({ id: result.data?.id, to: params.email }, "Confirmation email sent");
}

/**
 * Send an internal notification email to the SCARA team inbox.
 * Includes full enquiry details and sets replyTo to the enquirer's address.
 */
export async function sendInternalNotification(
  params: InternalNotificationParams
): Promise<void> {
  const html = await render(InternalNotificationEmail(params));

  const companyPart = params.company ? ` (${params.company})` : "";
  const subject = `New Enquiry: ${params.name}${companyPart}`;

  const result = await resendClient.emails.send({
    from: env.EMAIL_FROM,
    to: env.EMAIL_INTERNAL_TO,
    subject,
    html,
    reply_to: params.email, // team hits "Reply" → goes directly to the enquirer
  });

  logger.info(
    { id: result.data?.id, to: env.EMAIL_INTERNAL_TO },
    "Internal notification email sent"
  );
}

/**
 * Fire both emails after a successful enquiry submission.
 * Uses Promise.allSettled so an email failure never blocks the API response.
 * All failures are logged but not re-thrown.
 */
export async function sendEnquiryEmails(
  confirmationParams: ConfirmationEmailParams,
  notificationParams: InternalNotificationParams
): Promise<void> {
  const results = await Promise.allSettled([
    sendConfirmationEmail(confirmationParams),
    sendInternalNotification(notificationParams),
  ]);

  results.forEach((result, i) => {
    if (result.status === "rejected") {
      const emailType = i === 0 ? "confirmation" : "internal-notification";
      logger.error(
        { err: result.reason, emailType },
        `Email send failed (best-effort — enquiry was saved successfully)`
      );
    }
  });
}
