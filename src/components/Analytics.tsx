import Script from "next/script";

const gaId = process.env.NEXT_PUBLIC_GA4_ID;

export default function Analytics() {
  if (!gaId) {
    return null;
  }

  const eventScript = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){window.dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');

    document.addEventListener('click', function(event) {
      var target = event.target && event.target.closest ? event.target.closest('[data-ga-event]') : null;
      if (!target || typeof gtag !== 'function') return;
      gtag('event', target.getAttribute('data-ga-event'), {
        event_category: target.getAttribute('data-ga-category') || 'engagement',
        event_label: target.getAttribute('data-ga-label') || target.textContent || target.href || '',
      });
    });

    document.addEventListener('submit', function(event) {
      var target = event.target;
      if (!target || !target.matches || !target.matches('[data-ga-event]') || typeof gtag !== 'function') return;
      gtag('event', target.getAttribute('data-ga-event'), {
        event_category: target.getAttribute('data-ga-category') || 'lead',
        event_label: target.getAttribute('data-ga-label') || target.getAttribute('name') || '',
      });
    });
  `;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {eventScript}
      </Script>
    </>
  );
}
