// app/privacy-policy/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – VERIVOX",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <article className="prose mx-auto">
        <h1>Privacy Policy</h1>
        <p><strong>Effective Date:</strong> August 2, 2025</p>

        <h2>1. Introduction</h2>
        <p>
          VERIVOX (“we,” “us,” or “our”) operates{" "}
          <a href="https://www.verivox.pro">https://www.verivox.pro</a> (the
          “Site”). VERIVOX is a student-led initiative and is not affiliated
          with Harvard University. This Privacy Policy describes how we collect,
          use, disclose, and safeguard your information when you visit our Site
          or create a profile and publish articles. By using the Site, you agree
          to the collection and use of information as described here.
        </p>

        <h2>2. Information We Collect</h2>
        <ul>
          <li>
            <strong>Profile Information.</strong> When you register for an account
            or update your profile, we collect your name, email address, profile
            picture (if provided), biography, and any other information you
            choose to include.
          </li>
          <li>
            <strong>User-Generated Content.</strong> Any articles, comments, or
            other content you create on the Site.
          </li>
          <li>
            <strong>Technical &amp; Usage Data.</strong> Automatically collected
            data such as your IP address, browser type, device identifiers,
            pages viewed, and referral data via cookies and similar technologies.
          </li>
          <li>
            <strong>Communications.</strong> Records of any correspondence
            between you and VERIVOX, including support requests.
          </li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>
            <strong>To Provide &amp; Improve the Site.</strong> To create and
            maintain your account, publish your content, and enhance Site
            functionality.
          </li>
          <li>
            <strong>Communication.</strong> To send you service-related
            announcements, security alerts, and support responses.
          </li>
          <li>
            <strong>Analytics.</strong> To understand Site usage and trends,
            diagnose technical issues, and optimize performance.
          </li>
          <li>
            <strong>Site Safety &amp; Security.</strong> To detect, prevent, and
            address fraud, unauthorized access, and other harmful activity.
          </li>
        </ul>

        <h2>4. Information You Make Public</h2>
        <p>
          All profile details and articles you publish are publicly accessible.
          Anyone visiting the Site can view this information. You control what
          you choose to share in your profile and posts; please avoid including
          sensitive personal data.
        </p>

        <h2>5. Cookies &amp; Tracking Technologies</h2>
        <p>We use cookies, web beacons, and similar technologies to:</p>
        <ul>
          <li>Remember your preferences and login status.</li>
          <li>
            Measure Site usage and performance (e.g., via Google Analytics).
          </li>
          <li>Serve contextually relevant content.</li>
        </ul>
        <p>
          You can disable cookies through your browser settings, but doing so
          may affect Site functionality.
        </p>

        <h2>6. Disclosure of Your Information</h2>
        <ul>
          <li>
            <strong>No Sale of Personal Data.</strong> We do not sell, rent, or
            trade your personal information.
          </li>
          <li>
            <strong>Service Providers.</strong> We may share data with trusted
            third-party vendors who perform services on our behalf (e.g., hosting,
            analytics).
          </li>
          <li>
            <strong>Legal Requirements.</strong> We may disclose information if
            required by law or to protect our rights and users’ safety.
          </li>
        </ul>

        <h2>7. Third-Party Links</h2>
        <p>
          Our Site may contain links to third-party websites or services. We are
          not responsible for their privacy practices. We encourage you to read
          their privacy policies before providing any personal information.
        </p>

        <h2>8. Security</h2>
        <p>
          We employ reasonable organizational, technical, and administrative
          safeguards to protect your data. However, no method of transmission or
          storage is completely secure. We cannot guarantee absolute security.
        </p>

        <h2>9. Children’s Privacy</h2>
        <p>
          VERIVOX is not intended for children under 13. We do not knowingly
          collect personal data from anyone under 13. If we learn that we have
          inadvertently collected such data, we will delete it.
        </p>

        <h2>10. Your Rights &amp; Choices</h2>
        <ul>
          <li>
            <strong>Access &amp; Correction.</strong> You may review and update
            your profile information at any time by signing into your account.
          </li>
          <li>
            <strong>Deletion.</strong> You can request deletion of your account
            and personal data by contacting us (see Section 12). Please note
            that content you have published may remain publicly accessible unless
            you remove it.
          </li>
        </ul>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy to reflect changes in our practices
          or for legal, operational, or regulatory reasons. We will post the
          revised policy with a new “Effective Date.” Continued use of the Site
          after such updates constitutes acceptance.
        </p>
      </article>
    </main>
  );
}
