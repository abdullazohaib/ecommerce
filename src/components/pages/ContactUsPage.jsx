import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Mail, MapPin, MessageCircle, Send, ArrowLeft, Clock, ShieldCheck } from 'lucide-react';

export const ContactUsPage = () => {
  const { storeInfo, setViewWithUrl, addToast } = useStore();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
      addToast('Thank you! Your inquiry has been sent to our customer care team.', 'success');
      setForm({ name: '', email: '', phone: '', message: '' });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back Link */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setViewWithUrl('home');
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Info Column */}
          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Customer Support
              </span>
              <h1 className="text-2xl sm:text-3xl font-serif font-black">
                We're Here to Help
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed">
                Have questions regarding your order status, payment methods, or need guidance choosing the right cream for your skin type? Contact us below.
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-800 text-xs">
                <a
                  href={`tel:${storeInfo.supportPhone.replace(/\s+/g, '')}`}
                  className="flex items-start gap-3 hover:text-rose-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">CALL HELPLINE</span>
                    <strong className="text-sm">{storeInfo.supportPhone}</strong>
                  </div>
                </a>

                <a
                  href={`https://wa.me/${storeInfo.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-start gap-3 text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">WHATSAPP CHAT</span>
                    <strong className="text-sm">Instant Live Assistance</strong>
                  </div>
                </a>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">EMAIL INQUIRIES</span>
                    <span className="text-xs">{storeInfo.supportEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">HEADQUARTERS</span>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{storeInfo.businessAddress}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">SUPPORT TIMINGS</span>
                    <span className="text-[11px] text-slate-300">{storeInfo.supportTiming}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-[11px] text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Replies guaranteed within 4 hours during business days.</span>
            </div>
          </div>

          {/* Right Contact Form Column */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-serif font-black text-slate-900">
                Send Us a Message
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the form and an executive will get in touch with you promptly.
              </p>
            </div>

            {sent ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto font-bold text-lg">
                  ✓
                </div>
                <h3 className="text-sm font-bold">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-700">
                  Thank you for reaching out. A representative will contact you via WhatsApp or Email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@gmail.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Your Message or Inquiry *</label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about the product you're inquiring about, order questions, etc..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-800 focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

