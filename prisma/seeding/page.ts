const pages = [
  {
    name: 'Home',
    route: '/',
    roles: ['ADMIN', 'USER', 'EXPERT'],
    isPublic: true,
  },
  {
    name: 'App',
    route: '/app',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Script management',
    route: '/app/scripts',
    roles: ['ADMIN', 'EXPERT'],
    isPublic: false,
  },
  {
    name: 'Session',
    route: '/app/session/[id]',
    roles: ['ADMIN', 'EXPERT', 'USER'],
    isPublic: true,
  },
];

export { pages };
