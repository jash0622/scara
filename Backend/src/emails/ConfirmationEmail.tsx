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
  Img,
  Row,
  Column,
} from "@react-email/components";

interface ConfirmationEmailProps {
  name: string;
}

const FRONTEND_URL = process.env.FRONTEND_URL ?? "https://scara.gg";

// Brand tokens — no custom font loading (email clients strip <link>).
// All font stacks fall back to system sans-serif.
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

  // ── Header ──
  header: {
    backgroundColor: "#000000",
    padding: "32px 40px 24px",
    textAlign: "center" as const,
  } as React.CSSProperties,

  logoText: {
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "900",
    fontSize: "28px",
    letterSpacing: "0.15em",
    color: "#C3ED00",
    textDecoration: "none",
    textTransform: "uppercase" as const,
  } as React.CSSProperties,

  accentLine: {
    borderTop: "2px solid #C3ED00",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0",
    width: "100%",
  } as React.CSSProperties,

  // ── Body ──
  bodySection: {
    padding: "40px 40px 32px",
  } as React.CSSProperties,

  headline: {
    color: "#FFFFFF",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "700",
    fontSize: "24px",
    lineHeight: "1.3",
    margin: "0 0 20px 0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.02em",
  } as React.CSSProperties,

  bodyText: {
    color: "#C8C8C8",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "15px",
    lineHeight: "1.7",
    margin: "0 0 28px 0",
  } as React.CSSProperties,

  // ── CTA Button ──
  ctaWrapper: {
    textAlign: "center" as const,
    padding: "8px 0 36px",
  } as React.CSSProperties,

  ctaButton: {
    display: "inline-block",
    backgroundColor: "#C3ED00",
    color: "#000000",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "900",
    fontSize: "13px",
    letterSpacing: "0.12em",
    textDecoration: "none",
    textTransform: "uppercase" as const,
    padding: "14px 36px",
    borderRadius: "2px", // sharp — matches SCARA brand
  } as React.CSSProperties,

  // ── Divider ──
  divider: {
    borderTop: "1px solid #1a1a1a",
    borderBottom: "none",
    borderLeft: "none",
    borderRight: "none",
    margin: "0",
  } as React.CSSProperties,

  // ── Footer ──
  footer: {
    padding: "28px 40px 32px",
    backgroundColor: "#000000",
  } as React.CSSProperties,

  footerAddress: {
    color: "#555555",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "11px",
    lineHeight: "1.7",
    margin: "0 0 12px 0",
  } as React.CSSProperties,

  footerSocial: {
    color: "#555555",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "400",
    fontSize: "11px",
    margin: "0 0 16px 0",
  } as React.CSSProperties,

  footerLink: {
    color: "#898988",
    textDecoration: "underline",
    fontFamily: "Helvetica, Arial, sans-serif",
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

export function ConfirmationEmail({ name }: ConfirmationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>We&apos;ve got your message — here&apos;s what happens next.</Preview>

      <Body style={styles.body}>
        <Section style={styles.outerContainer}>
          <Container style={styles.container}>

            {/* ── Header: SCARA wordmark ── */}
            <Section style={styles.header}>
              <Link href={FRONTEND_URL} style={{ textDecoration: "none" }}>
                <Text style={styles.logoText}>SCARA</Text>
              </Link>
            </Section>

            {/* ── Neon-green accent line ── */}
            <Hr style={styles.accentLine} />

            {/* ── Main body ── */}
            <Section style={styles.bodySection}>
              <Heading as="h1" style={styles.headline}>
                Thanks for reaching out, {name}.
              </Heading>

              <Text style={styles.bodyText}>
                We&apos;ve received your message and someone from the SCARA team will be in touch
                shortly.
              </Text>

              <Text style={styles.bodyText}>
                In the meantime, take a look at the culture we&apos;ve been building — campaigns,
                IPs, and the brands we&apos;ve played this game with.
              </Text>

              {/* ── CTA ── */}
              <Section style={styles.ctaWrapper}>
                <Link href={`${FRONTEND_URL}/#work`} style={styles.ctaButton}>
                  Explore Our Work →
                </Link>
              </Section>
            </Section>

            {/* ── Divider ── */}
            <Hr style={styles.divider} />

            {/* ── Footer ── */}
            <Section style={styles.footer}>
              <Text style={styles.footerAddress}>
                SCARA GAMING PRIVATE LIMITED
                {"\n"}
                WeWork Enam Sambhav, G-Block Road
                {"\n"}
                Bandra East, Mumbai 400051, India
              </Text>

              <Text style={styles.footerSocial}>
                <Link
                  href="https://in.linkedin.com/company/druidscara"
                  style={styles.footerLink}
                >
                  LinkedIn
                </Link>
                {"  ·  "}
                <Link
                  href="https://www.instagram.com/scara_social"
                  style={styles.footerLink}
                >
                  Instagram
                </Link>
              </Text>

              <Text style={styles.legalText}>
                You&apos;re receiving this because you submitted an enquiry on scara.gg.
              </Text>
            </Section>

          </Container>
        </Section>
      </Body>
    </Html>
  );
}

export default ConfirmationEmail;
