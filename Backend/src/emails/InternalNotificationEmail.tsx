import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
  Preview,
  Row,
  Column,
} from "@react-email/components";

interface InternalNotificationEmailProps {
  name: string;
  email: string;
  company?: string;
  budget?: string;
  message: string;
  submittedAt: string;
}

const styles = {
  body: {
    backgroundColor: "#F4F4F4",
    margin: "0",
    padding: "0",
    fontFamily: "Helvetica, Arial, sans-serif",
  } as React.CSSProperties,

  outerContainer: {
    backgroundColor: "#F4F4F4",
    padding: "32px 0",
  } as React.CSSProperties,

  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#FFFFFF",
    borderRadius: "4px",
    overflow: "hidden",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  } as React.CSSProperties,

  // ── Header ──
  header: {
    backgroundColor: "#0A0A0A",
    padding: "24px 32px",
    borderBottom: "3px solid #C3ED00",
  } as React.CSSProperties,

  headerTitle: {
    color: "#FFFFFF",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "18px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    margin: "0 0 4px 0",
  } as React.CSSProperties,

  headerSubtitle: {
    color: "#C3ED00",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "12px",
    letterSpacing: "0.05em",
    margin: "0",
  } as React.CSSProperties,

  // ── Key-value table section ──
  kvSection: {
    padding: "28px 32px 8px",
  } as React.CSSProperties,

  sectionLabel: {
    color: "#898988",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    margin: "0 0 16px 0",
  } as React.CSSProperties,

  kvRow: {
    marginBottom: "12px",
  } as React.CSSProperties,

  kvLabel: {
    color: "#898988",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "600",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    width: "140px",
    verticalAlign: "top" as const,
    paddingRight: "12px",
    paddingTop: "2px",
  } as React.CSSProperties,

  kvValue: {
    color: "#111111",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "14px",
    verticalAlign: "top" as const,
  } as React.CSSProperties,

  kvValueBold: {
    color: "#111111",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "14px",
    verticalAlign: "top" as const,
  } as React.CSSProperties,

  emailLink: {
    color: "#0066CC",
    textDecoration: "underline",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontSize: "14px",
  } as React.CSSProperties,

  // ── Message block ──
  messageSection: {
    padding: "0 32px 28px",
  } as React.CSSProperties,

  messageDivider: {
    borderTop: "1px solid #E8E8E8",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0 0 20px 0",
  } as React.CSSProperties,

  messageLabel: {
    color: "#898988",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "10px",
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    margin: "0 0 12px 0",
  } as React.CSSProperties,

  messageBlock: {
    backgroundColor: "#F8F8F8",
    borderLeft: "3px solid #C3ED00",
    padding: "16px 20px",
    borderRadius: "0 2px 2px 0",
  } as React.CSSProperties,

  messageText: {
    color: "#333333",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
  } as React.CSSProperties,

  // ── Footer ──
  footer: {
    backgroundColor: "#F4F4F4",
    padding: "20px 32px",
    borderTop: "1px solid #E8E8E8",
  } as React.CSSProperties,

  footerText: {
    color: "#898988",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "0",
  } as React.CSSProperties,

  badgeNew: {
    display: "inline-block",
    backgroundColor: "#C3ED00",
    color: "#000000",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "900",
    fontSize: "10px",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    padding: "3px 10px",
    borderRadius: "2px",
    marginLeft: "8px",
    verticalAlign: "middle" as const,
  } as React.CSSProperties,
};

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }) + " IST";
  } catch {
    return iso;
  }
}

export function InternalNotificationEmail({
  name,
  email,
  company,
  budget,
  message,
  submittedAt,
}: InternalNotificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>
        New enquiry from {name}{company ? ` (${company})` : ""} via scara.gg
      </Preview>

      <Body style={styles.body}>
        <Section style={styles.outerContainer}>
          <Container style={styles.container}>

            {/* ── Header ── */}
            <Section style={styles.header}>
              <Heading as="h1" style={styles.headerTitle}>
                New Website Enquiry
                <span style={styles.badgeNew}>NEW</span>
              </Heading>
              <Text style={styles.headerSubtitle}>
                Submitted via scara.gg contact form
              </Text>
            </Section>

            {/* ── Key-value details ── */}
            <Section style={styles.kvSection}>
              <Text style={styles.sectionLabel}>// Enquiry Details</Text>

              {/* Name */}
              <Row style={styles.kvRow}>
                <Column style={styles.kvLabel}>Name</Column>
                <Column style={styles.kvValueBold}>{name}</Column>
              </Row>

              {/* Email */}
              <Row style={styles.kvRow}>
                <Column style={styles.kvLabel}>Email</Column>
                <Column style={styles.kvValue}>
                  <Link href={`mailto:${email}`} style={styles.emailLink}>
                    {email}
                  </Link>
                </Column>
              </Row>

              {/* Company */}
              <Row style={styles.kvRow}>
                <Column style={styles.kvLabel}>Company</Column>
                <Column style={styles.kvValue}>{company || "—"}</Column>
              </Row>

              {/* Budget */}
              <Row style={styles.kvRow}>
                <Column style={styles.kvLabel}>Budget Range</Column>
                <Column style={styles.kvValueBold}>{budget || "Not specified"}</Column>
              </Row>

              {/* Submitted at */}
              <Row style={styles.kvRow}>
                <Column style={styles.kvLabel}>Submitted At</Column>
                <Column style={styles.kvValue}>{formatDate(submittedAt)}</Column>
              </Row>
            </Section>

            {/* ── Message block ── */}
            <Section style={styles.messageSection}>
              <Hr style={styles.messageDivider} />
              <Text style={styles.messageLabel}>// Message</Text>
              <Section style={styles.messageBlock}>
                <Text style={styles.messageText}>{message}</Text>
              </Section>
            </Section>

            {/* ── Footer ── */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                Reply directly to this email to respond to {name}. Your reply will go
                straight to{" "}
                <Link href={`mailto:${email}`} style={{ color: "#0066CC" }}>
                  {email}
                </Link>
                .
              </Text>
            </Section>

          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export default InternalNotificationEmail;
