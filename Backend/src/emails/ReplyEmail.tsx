import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Img,
  Link,
  Preview,
} from "@react-email/components";

interface ReplyEmailProps {
  name: string;
  message: string;
}

const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://scara.gg";

const styles = {
  body: {
    backgroundColor: "#000000",
    margin: "0",
    padding: "0",
    fontFamily: "Helvetica, Arial, sans-serif",
  } as React.CSSProperties,

  outerContainer: {
    backgroundColor: "#000000",
    padding: "40px 0",
  } as React.CSSProperties,

  container: {
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#0A0A0A",
    borderRadius: "4px",
    overflow: "hidden",
  } as React.CSSProperties,

  header: {
    backgroundColor: "#000000",
    padding: "32px 40px 24px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  logoImage: {
    height: "34px",
    width: "auto",
    display: "inline-block",
    border: "0",
    outline: "none",
    textDecoration: "none",
  } as React.CSSProperties,

  accentLine: {
    borderTop: "2px solid #C3ED00",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0",
    width: "100%",
  } as React.CSSProperties,

  bodySection: {
    padding: "40px 40px 32px",
  } as React.CSSProperties,

  greeting: {
    color: "#FFFFFF",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "18px",
    margin: "0 0 20px 0",
  } as React.CSSProperties,

  bodyText: {
    color: "#D8D8D8",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 0 16px 0",
    whiteSpace: "pre-wrap" as const,
  } as React.CSSProperties,

  divider: {
    borderTop: "1px solid #1a1a1a",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0",
  } as React.CSSProperties,

  footer: {
    padding: "24px 40px 32px",
    backgroundColor: "#000000",
  } as React.CSSProperties,

  signature: {
    color: "#C8C8C8",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "14px",
    lineHeight: "1.7",
    margin: "0 0 16px 0",
  } as React.CSSProperties,

  legalText: {
    color: "#3a3a3a",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "10px",
    lineHeight: "1.5",
    margin: "0",
  } as React.CSSProperties,
};

export function ReplyEmail({ name, message }: ReplyEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>A message from the SCARA team.</Preview>

      <Body style={styles.body}>
        <Section style={styles.outerContainer}>
          <Container style={styles.container}>

            {/* ── Header: SCARA logo ── */}
            <Section style={styles.header}>
              <Link href={FRONTEND_URL} style={{ textDecoration: "none" }}>
                <Img
                  src={`${FRONTEND_URL}/logo-scara.png`}
                  alt="SCARA"
                  height={34}
                  style={styles.logoImage}
                />
              </Link>
            </Section>

            <Hr style={styles.accentLine} />

            {/* ── Body ── */}
            <Section style={styles.bodySection}>
              <Text style={styles.greeting}>Hi {name},</Text>
              <Text style={styles.bodyText}>{message}</Text>
            </Section>

            <Hr style={styles.divider} />

            {/* ── Footer ── */}
            <Section style={styles.footer}>
              <Text style={styles.signature}>
                — The SCARA Team
              </Text>
              <Text style={styles.legalText}>
                You&apos;re receiving this because you submitted an enquiry on scara.gg.
                Simply reply to this email to continue the conversation.
              </Text>
            </Section>

          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export default ReplyEmail;
