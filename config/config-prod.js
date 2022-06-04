const config = {
  meta: {
    canonicalUrl: "https://theparkandthebike.vercel.app",
    title: "TheParkAndTheBike",
    description: "Bikes in Parks Photo Blog",
    social: {
      twitter:{
        site: "@TheParkAndTheB1",
        handle: "TheParkAndTheB1",
      },
      tagline: 'Nice Park, Nice Bike',
      hashtag: '#theParkandTheBike',
      graphic:
       `${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/social/default-social-graphic.jpg`,
    },
  },
};

export default config;
