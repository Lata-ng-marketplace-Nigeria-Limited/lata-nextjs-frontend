export const organizationStructuredData = {
  "@context": "http://schema.org",
  "@type": "Organization",
  name: "LATA.ng",
  url: "https://lata.ng",
  logo: "https://res.cloudinary.com/dfbebf7x0/image/upload/v1699857673/Rectangle_uifq9b.png",
  sameAs: [
    "https://www.facebook.com/lata.ngonline",
    "https://twitter.com/lata_ng",
    "https://instagram.com/lata.ngonline?igshid=MzNlNGNkZWQ4Mg==",
    "https://www.linkedin.com/company/lata-ng",
    "https://m.youtube.com/channel/UCa78cGR5EOhv3Wv9oO6PfJA",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2349069394365",
      contactType: "customer service",
    },
    {
      "@type": "ContactPoint",
      email: "Lata.ng@gmail.com",
      contactType: "customer service",
    },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abuja",
    addressCountry: "Nigeria",
    streetAddress: "N0 14, Police Estate, Off Karu, Abacha Road, FCT Abuja.",
  },
};

export const websiteStructuredData = {
  "@context": "http://schema.org",
  "@type": "WebSite",
  name: "LATA.ng",
  alternateName: "LATA.ng",
  url: "https://lata.ng",
  logo: "https://res.cloudinary.com/dfbebf7x0/image/upload/v1699857673/Rectangle_uifq9b.png",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://lata.ng/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};
