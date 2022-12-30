const RouterRegex = Object.freeze({
  naitei: {
    DETAIL: /^\/naitei\/\d+$/, // /naitei/:userId,
    POST_DETAIL: /^\/naitei\/\d+\/posts\/\d+$/, // /naitei/:userId/posts/:postId
    ACHIEVEMENT_DETAIL: /^\/naitei\/\d+\/basics\/achievements$/, // naitei/:id/basics/achivements
    TARGET_DETAIL: /^\/naitei\/\d+\/basics\/targets$/, // naitei/:id/basics/targets
    milestones: {
      DETAIL: /^\/naitei\/\d+\/milestones\/\d+$/, // /naitei/:userId/milestones/:milestoneId
      DETAIL_NO_PARAMS: /^\/naitei\/\d+\/milestones$/, // /naitei/:userId/milestones
      REGISTER: /^\/naitei\/\d+\/milestones\/register$/, // /naitei/:userId/milestones/register
      EDIT_TARGET: /^\/naitei\/\d+\/milestones\/\d+\/targets\/edit$/, // /naitei/:userId/milestones/:milestoneId/targets/edit
      EDIT_ACHIEVEMENT: /^\/naitei\/\d+\/milestones\/\d+\/achievements\/edit$/, // /naitei/:userId/milestones/:milestoneId/achievements/edit
      EDIT_PLAN: /^\/naitei\/\d+\/milestones\/\d+\/plans\/edit$/, // /naitei/:userId/milestones/:milestoneId/plans/edit
    },
  },
  documents: {
    CREATE: /^\/documents\/register$/, // /documents/create
    LIST: /^\/documents$/, // /documents
    DETAIL: /^\/documents\/\d+$/, // /documents/:docId
    EDIT: /^\/documents\/\d+\/edit$/, // /documents/:docId/edit
  },
  setting: {
    user: {
      CREATE: /^\/settings\/users\/register$/, // /setting/user/register
      naiteisha: {
        LIST: /^\/settings\/users\/naiteisha$/,
        DETAIL: /^\/settings\/users\/naiteisha\/\d+$/,
        EDIT: /^\/settings\/users\/naiteisha\/\d+\/edit$/,
      },
      client: {
        LIST: /^\/settings\/users\/clients$/, // /setting/user/client
        DETAIL: /^\/settings\/users\/clients\/\d+$/,
        EDIT: /^\/settings\/users\/clients\/\d+\/edit$/,
      },
      teacher: {
        LIST: /^\/settings\/users\/teachers$/, // /setting/user/teacher
        DETAIL: /^\/settings\/users\/teachers\/\d+$/,
        EDIT: /^\/settings\/users\/teachers\/\d+\/edit$/,
      },
      mentor: {
        LIST: /^\/settings\/users\/mentors$/, // /setting/user/mentor
        DETAIL: /^\/settings\/users\/mentors\/\d+$/,
        EDIT: /^\/settings\/users\/mentors\/\d+\/edit$/,
      },
    },
    enterprise: {
      LIST: /^\/settings\/enterprises$/,
    },
    university: {
      CREATE: /^\/settings\/universities\/create$/, // /settings/universities/create
      LIST: /^\/settings\/universities$/, // /settings/universities
      DETAIL: /^\/settings\/universities\/\d+$/, // /settings/universities/:university_id
      EDIT: /^\/settings\/universities\/\d\/edit+$/, // /settings/universities/:university_id/edit
    },
    contest: {
      CREATE: /^\/settings\/exams\/create$/, // /settings/exams/create
      LIST: /^\/settings\/exams$/, // /settings/exams
      DETAIL: /^\/settings\/exams\/\d+$/, // /settings/exams/:contestId
      EDIT: /^\/settings\/exams\/\d\/edit+$/, // /settings/exams/:contestId/edit
    },
  },
});

module.exports = RouterRegex;
