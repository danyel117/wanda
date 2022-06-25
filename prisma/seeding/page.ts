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
    name: 'Studies',
    route: '/app/studies',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'New study',
    route: '/app/studies/new',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Evaluation',
    route: '/app/evaluations/[id]',
    roles: ['ADMIN', 'EXPERT', 'PARTICIPANT'],
    isPublic: true,
  },
];

export { pages };
