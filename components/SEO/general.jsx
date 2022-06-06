import Head from "next/head";
import config from "../../config";

export default function SEO() {
  const title = `${config.meta.title}`;
  const mainImage = `${config.meta.social.graphic}`;
  const description = title;
  let url = `${config.endpoints.canonical}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="og:title" content={title} />
      <meta name="og:type" content="article" />
      <meta name="og:image" content={mainImage} />
      <meta name="og:url" content={url} />
      <meta name="twitter:site" content={config.meta.social.twitter.site} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mainImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image:alt" content={title} />
      <meta name="description" content={description} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "http://schema.org",
            "@type": "Website",
            "name": title,
            "about": description,
            "url": url,
          }),
        }}
      />
    </Head>
  )
}
