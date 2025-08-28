export default {
  routes: [
    {
      method: 'POST',
      path: '/contact/submit',
      handler: 'contact.submit',
      config: {
        auth: false,    // veřejné (řešíš reCAPTCHA)
        policies: [],
        middlewares: [],
      },
    },
  ],
};