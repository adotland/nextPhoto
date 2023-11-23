const configCommon = {
  endpoints: {
    api: process.env.API_URL,
  },
  meta: {
    title: "BikeToThePark",
    description: "Bikes in Parks Photo Blog",
    social: {
      twitter: {
        site: "@TheParkAndTheB1",
        handle: "TheParkAndTheB1",
      },
      tagline: '',
      hashtag: '#theParkandTheBike',
      graphic:
        `${process.env.NEXT_PUBLIC_IMG_HOST_DOMAIN}/social/default-social-graphic.jpg`,
    },
  },
};

export default configCommon;
