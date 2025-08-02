// app/terms/page.tsx

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service – VERIVOX",
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto py-12 px-4">
      <article className="prose mx-auto">
        <h1>Terms of Service</h1>
        <p><strong>Effective Date:</strong> August 2, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using VERIVOX (<a href="https://www.verivox.pro">https://www.verivox.pro</a>) (the “Site”), you agree to be bound by these Terms of Service and our <a href="/privacy-policy">Privacy Policy</a>. If you do not agree to these Terms, you may not access or use the Site.
        </p>

        <h2>2. Eligibility</h2>
        <p>
          Registration and use of the Site are limited to individuals who are currently enrolled in or have graduated from the Doctorate in Education Leadership (EdLD) program at Harvard University. All users must complete the Site’s verification process during registration to confirm their eligibility.
        </p>

        <h2>3. Account Registration</h2>
        <ul>
          <li><strong>Registration requirements.</strong> You must provide a valid email address, select a secure password, and complete any additional verification steps required by the Site.</li>
          <li><strong>Account security.</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account.</li>
          <li><strong>Account deletion.</strong> You may request deletion of your account and associated data at any time by contacting us (see Section 15).</li>
        </ul>

        <h2>4. User Content</h2>
        <p>
          “User Content” means all materials you submit, post, or display on the Site, including profiles, articles, and comments.
        </p>
        <ul>
          <li><strong>Ownership.</strong> You retain all right, title, and interest in and to your User Content, including any intellectual property rights.</li>
          <li><strong>Limited license to VERIVOX.</strong> By submitting User Content, you grant VERIVOX a non-exclusive, royalty-free, worldwide, sublicensable, and transferable license to display, reproduce, distribute, and promote that content on the Site and in related promotional materials.</li>
          <li><strong>Public nature.</strong> All User Content is publicly accessible. You are responsible for ensuring you have the right to share any content you post and for any information you choose to make public.</li>
        </ul>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to use the Site to:</p>
        <ul>
          <li>Upload or distribute unlawful, harassing, defamatory, obscene, or otherwise objectionable content.</li>
          <li>Impersonate any person or entity or misrepresent your identity or affiliation.</li>
          <li>Upload malicious code or attempt to compromise the security or functionality of the Site.</li>
        </ul>

        <h2>6. Reporting Violations</h2>
        <p>
          If you believe any User Content violates these Terms or applicable law, you may report it by emailing <strong>ruizclark@gse.harvard.edu</strong> with:
        </p>
        <ol>
          <li>A description of the content in question (including URL or screenshots).</li>
          <li>An explanation of which Term or law you believe is being violated.</li>
          <li>Your contact information so we can follow up as needed.</li>
        </ol>

        <h2>7. Moderation and Enforcement</h2>
        <p>
          VERIVOX reserves the right to remove any content that violates these Terms and to suspend or terminate access for users who breach these Terms.
        </p>

        <h2>8. Third-Party Links</h2>
        <p>
          The Site may include links to third-party websites or services. VERIVOX is not responsible for the content, privacy practices, or availability of those sites.
        </p>

        <h2>9. Intellectual Property</h2>
        <ul>
          <li><strong>Site content.</strong> All text, graphics, code, and other materials on the Site are owned by VERIVOX or its licensors and are protected by copyright and trademark laws.</li>
          <li><strong>Trademark.</strong> “VERIVOX” and its logo are trademarks owned exclusively by VERIVOX.</li>
        </ul>

        <h2>10. Disclaimers</h2>
        <p>
          The Site and all content are provided “as is,” without warranty of any kind. VERIVOX disclaims all implied warranties, including merchantability and fitness for a particular purpose. User Content is provided for informational purposes only and does not constitute professional advice.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, VERIVOX and its officers, directors, employees, and agents will not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the Site.
        </p>

        <h2>12. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless VERIVOX and its officers, directors, employees, and agents from any claims, damages, liabilities, and expenses (including reasonable attorneys’ fees) arising from your use of the Site, your User Content, or your violation of these Terms.
        </p>

        <h2>13. Termination</h2>
        <p>
          VERIVOX may suspend or terminate your access to the Site at any time, with or without notice, for any conduct that VERIVOX believes violates these Terms or is harmful to other users or the Site.
        </p>

        <h2>14. Governing Law and Venue</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the Commonwealth of Massachusetts, without regard to its conflict-of-law provisions. Any dispute arising under these Terms shall be subject to the exclusive jurisdiction of the state and federal courts located in Middlesex County, Massachusetts.
        </p>

        <h2>15. Contact Information</h2>
        <p>
          If you have questions or requests regarding these Terms, please contact: <strong>ruizclark@gse.harvard.edu</strong>
        </p>
      </article>
    </main>
  );
}
