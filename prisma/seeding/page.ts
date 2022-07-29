const pages = [
  {
    name: 'Home',
    route: '/',
    roles: ['ADMIN', 'PARTICIPANT', 'EXPERT'],
    isPublic: true,
  },
  {
    name: 'App',
    route: '/app',
    roles: ['ADMIN', 'EXPERT', 'PARTICIPANT'],
    isPublic: false,
  },
  {
    name: 'Script management',
    route: '/app/scripts',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Study Design',
    route: '/app/design',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'New study',
    route: '/app/design/new',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Update draft',
    route: '/app/design/[id]',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Sessions',
    route: '/app/sessions',
    roles: ['ADMIN', 'EXPERT', 'PARTICIPANT'],
    isPublic: false,
  },
  {
    name: 'Session',
    route: '/app/sessions/[id]',
    roles: ['ADMIN', 'EXPERT', 'PARTICIPANT'],
    isPublic: true,
  },
  {
    name: 'Session results',
    route: '/app/sessions/[id]/results',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Evaluation study result',
    route: '/app/results/[id]',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Evaluation study results',
    route: '/app/results',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
];

export { pages };
