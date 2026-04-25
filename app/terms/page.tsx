import Navbar from '@/components/shop/Navbar'
import Footer from '@/components/shop/Footer'

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto px-8 py-16">
        <div className="section-eyebrow mb-3">
          <span className="w-8 h-px bg-gold opacity-50"/>Legal
        </div>
        <h1 className="section-title mb-2">Terms & Conditions</h1>
        <p className="font-cormorant text-gray-500 mb-10">Last updated: April 2026</p>

        <div className="prose max-w-none font-cormorant text-lg text-gray-700 space-y-8 leading-relaxed">

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">1. About Us</h2>
            <p>Hoorab's Collection is a Pakistani bridal and casual clothing retailer based in London, United Kingdom. We sell authentic Pakistani fashion including bridal wear, casual suits, formal wear and accessories.</p>
            <p className="mt-3">Contact us: <a href="mailto:info@hoorabscollection.com" className="text-crimson hover:underline">info@hoorabscollection.com</a> | WhatsApp: +44 787 662 1936</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">2. Orders</h2>
            <p>By placing an order with Hoorab's Collection, you confirm that you are at least 18 years old and that all information provided is accurate and complete.</p>
            <p className="mt-3">We reserve the right to refuse or cancel any order at our discretion. If your order is cancelled, you will receive a full refund.</p>
            <p className="mt-3">Once your order is confirmed, you will receive an email confirmation with your order details.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">3. Pricing</h2>
            <p>All prices are displayed in British Pounds (£) and include VAT where applicable. We reserve the right to change prices at any time without prior notice.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">4. Payments</h2>
            <p>Payments are processed securely through Stripe. We accept all major credit and debit cards including Visa, Mastercard and American Express. Your payment details are never stored on our servers.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">5. Delivery</h2>
            <p>We deliver across the United Kingdom. Delivery times are typically 3-7 business days after dispatch. We are not responsible for delays caused by courier services or circumstances beyond our control.</p>
            <p className="mt-3">Free delivery is offered on all orders within the UK.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">6. Returns & Refunds</h2>
            <p>You have 14 days from the date of delivery to return an item. To be eligible for a return:</p>
            <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
              <li>Items must be unused and in original condition</li>
              <li>Items must be in original packaging</li>
              <li>Items must not have been altered or customised</li>
            </ul>
            <p className="mt-3">To initiate a return, please contact us via WhatsApp or email. Refunds will be processed within 5-10 business days of receiving the returned item.</p>
            <p className="mt-3">Custom or personalised orders cannot be returned unless they are faulty.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">7. Product Descriptions</h2>
            <p>We make every effort to display product colours and details accurately. However, colours may vary slightly due to screen settings. If you have any questions about a product before purchasing, please contact us via WhatsApp.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">8. Intellectual Property</h2>
            <p>All content on this website including images, text and logos are the property of Hoorab's Collection and may not be reproduced without written permission.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">9. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </section>

          <section>
            <h2 className="font-playfair text-2xl font-bold text-gray-900 mb-3">10. Contact Us</h2>
            <p>For any questions about these terms, please contact us:</p>
            <div className="mt-3 bg-gold-pale border border-gold/20 rounded p-4">
              <p><strong>Hoorab's Collection</strong></p>
              <p>London, United Kingdom</p>
              <p>Email: <a href="mailto:info@hoorabscollection.com" className="text-crimson hover:underline">info@hoorabscollection.com</a></p>
              <p>WhatsApp: +44 787 662 1936</p>
              <p>Website: <a href="https://hoorabscollection.com" className="text-crimson hover:underline">hoorabscollection.com</a></p>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
