import Head from "next/head";
import config from "../../config";

export default function SEO({ data }) {
  const title = `${data.name} - ${config.meta.title}`;
  const mainImage = `https://${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/${data.imageName}`;
  // const description = title + (data.description ? ` - ${data.description}` : '');
  const description = `${data.name}, photographs of bicycles in parks located in the Greater Seattle area`;
  let url = `${config.endpoints.canonical}` + (data?.slug ? `/${data.slug}` : '');
  return (
    <Head>
      <title>{title}</title>
      <link rel="canonical" href={url} />
      <meta name="og:title" content={title} />
      <meta name="og:type" content="article" />
      <meta name="og:image" content={mainImage} />
      <meta name="og:url" content={url} />
      <meta name="twitter:site" content={config.meta.social.twitter.site} />
      <meta name="twitter:title" content={config.meta.title} />
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
            "@type": "BlogPosting",
            "image": mainImage,
            "headline": description,
            "url": url,
          }),
        }}
      />
    </Head>
  )
}
