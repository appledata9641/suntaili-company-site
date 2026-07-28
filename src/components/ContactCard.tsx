import { siteProfile } from "@/data/site";

export default function ContactCard() {
  const { contact } = siteProfile;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">聯絡資訊</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-900">電話：</span>
          <a
            href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`}
            data-ga-event="phone_click"
            data-ga-category="contact"
            data-ga-label="contact_card_phone"
            className="hover:text-slate-950"
          >
            {contact.phone}
          </a>
        </p>
        <p>
          <span className="font-medium text-slate-900">Email：</span>
          <a
            href={`mailto:${contact.email}`}
            data-ga-event="email_click"
            data-ga-category="contact"
            data-ga-label="contact_card_email"
            className="hover:text-slate-950"
          >
            {contact.email}
          </a>
        </p>
        <p>
          <span className="font-medium text-slate-900">地址：</span>
          {contact.address}
        </p>
        <p>
          <span className="font-medium text-slate-900">統編：</span>
          {contact.taxId}
        </p>
        <p>
          <span className="font-medium text-slate-900">服務時間：</span>
          {contact.serviceHours}
        </p>
      </div>
    </div>
  );
}
