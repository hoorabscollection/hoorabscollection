import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="section-eyebrow mb-3">
          <span className="w-8 h-px bg-gold opacity-50"/>Legal
        </div>
        <h1 className="section-title mb-2">Privacy Policy</h1>
        <p className="font-cormorant text-gray-500 mb-10">Last updated: April 2026</p>

        <div className="prose max-w-none font-cormorant text-lg text-gray-700 space-y-8 leading-relaxed">

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">1. Who We Are</h2>
            <p>Hoorab's Collection ("we", "us", "our") is a Pakistani fashion retailer based in London, UK. This privacy policy explains how we collect, use and protect your personal data when you use our website at hoorabscollection.com.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">2. What Data We Collect</h2>
            <p>We collect the following personal data:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Full name</li>
              <li>Email address</li>
              <li>Phone number (if provided)</li>
              <li>Delivery address and postcode</li>
              <li>Order history and purchase details</li>
              <li>Account login details (encrypted)</li>
            </ul>
            <p className="mt-3">We do NOT store your payment card details. All payments are processed securely by Stripe.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">3. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Process and fulfil your orders</li>
              <li>Send order confirmation and shipping updates</li>
              <li>Respond to your enquiries</li>
              <li>Send marketing emails (only if you opted in)</li>
              <li>Improve our website and services</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">4. Legal Basis for Processing</h2>
            <p>We process your data under the following legal bases:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Contract:</strong> To fulfil your orders</li>
              <li><strong>Legitimate interests:</strong> To improve our services</li>
              <li><strong>Consent:</strong> For marketing emails (you can unsubscribe anytime)</li>
              <li><strong>Legal obligation:</strong> To comply with UK law</li>
            </ul>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">5. Who We Share Data With</h2>
            <p>We share your data with trusted third parties only as necessary:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Stripe</strong> — payment processing</li>
              <li><strong>Supabase</strong> — secure database storage</li>
              <li><strong>Resend</strong> — email delivery</li>
              <li><strong>Delivery couriers</strong> — to fulfil your order</li>
            </ul>
            <p className="mt-3">We never sell your data to third parties.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">6. How Long We Keep Your Data</h2>
            <p>We keep your personal data for as long as necessary to provide our services and comply with legal obligations. Order data is typically kept for 7 years for tax and legal purposes. You can request deletion of your account data at any time.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">7. Your Rights (UK GDPR)</h2>
            <p>Under UK GDPR, you have the right to:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li><strong>Access</strong> — request a copy of your personal data</li>
              <li><strong>Rectification</strong> — correct inaccurate data</li>
              <li><strong>Erasure</strong> — request deletion of your data</li>
              <li><strong>Portability</strong> — receive your data in a portable format</li>
              <li><strong>Objection</strong> — object to marketing emails</li>
              <li><strong>Restriction</strong> — restrict how we process your data</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:info@hoorabscollection.com" className="text-crimson hover:underline">info@hoorabscollection.com</a></p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">8. Cookies</h2>
            <p>Our website uses essential cookies only to keep you logged in and maintain your shopping cart. We do not use tracking or advertising cookies.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">9. Data Security</h2>
            <p>We take data security seriously. Your data is stored securely using Supabase with row-level security. All connections are encrypted via HTTPS. We regularly review our security practices.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">10. Complaints</h2>
            <p>If you have concerns about how we handle your data, you can contact the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" className="text-crimson hover:underline">ico.org.uk</a> or call 0303 123 1113.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">11. Contact Us</h2>
            <div className="bg-gold-pale border border-gold/20 rounded p-4">
              <p><strong>Hoorab's Collection</strong></p>
              <p>London, United Kingdom</p>
              <p>Email: <a href="mailto:info@hoorabscollection.com" className="text-crimson hover:underline">info@hoorabscollection.com</a></p>
              <p>WhatsApp: +44 787 662 1936</p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
