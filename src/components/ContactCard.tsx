import { siteProfile } from "@/data/site";

export default function ContactCard() {
  const { contact } = siteProfile;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">聯絡資訊</h3>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <p>
          <span className="font-medium text-slate-900">電話：</span>
          {contact.phone}
        </p>
        <p>
          <span className="font-medium text-slate-900">Email：</span>
          {contact.email}
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
