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
];

export { pages };
