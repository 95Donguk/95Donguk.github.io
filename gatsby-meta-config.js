module.exports = {
  title: `95Donguk`,
  description: `김동욱의 개발수양록`,
  language: `ko`, // `ko`, `en` => currently support versions for Korean and English
  siteUrl: `https://95donguk.github.io/`,
  ogImage: `/og-image.png`, // Path to your in the 'static' folder
  comments: {
    utterances: {
      repo: `95Donguk/95Donguk.github.io`, // `zoomkoding/zoomkoding-gatsby-blog`,
    },
  },
  ga: 'G-G87NXDJEWM', // Google Analytics Tracking ID
  author: {
    name: `김동욱`,
    bio: {
      role: `개발자`,
      description: ['협력을 중시하는', '끊임없이 공부하는', '상상을 현실로 만들고픈'],
      thumbnail: 'me.png', // Path to the image in the 'asset' folder
    },
    social: {
      github: `https://github.com/95Donguk`, // `https://github.com/zoomKoding`,
      //linkedIn: `https://www.linkedin.com/`, // `https://www.linkedin.com/in/jinhyeok-jeong-800871192`,
      email: `kdy9720@naver.com`, // `zoomkoding@gmail.com`,
    },
  },

  // metadata for About Page
  about: {
    timestamps: [
      // =====       [Timestamp Sample and Structure]      =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!) =====
      {
        date: '',
        activity: '',
        links: {
          github: '',
          post: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
      {
        date: '2021.12 ~',
        activity: '개발 시작 & 블로그 운영',
        links: {
          //post: '',
          github: 'https://github.com/95Donguk/95Donguk.github.io',
          demo: 'https://95donguk.github.io/',
        },
      },
    ],

    projects: [
      // =====        [Project Sample and Structure]        =====
      // ===== 🚫 Don't erase this sample (여기 지우지 마세요!)  =====
      {
        title: '',
        description: '',
        techStack: ['', ''],
        thumbnailUrl: '',
        links: {
          post: '',
          github: '',
          googlePlay: '',
          appStore: '',
          demo: '',
        },
      },
      // ========================================================
      // ========================================================
    ],
  },
};
