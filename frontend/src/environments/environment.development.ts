const isProduction = false;               // true BUILD (subdominio) / false DEV
const baseDomain = isProduction ? 'snappay-rest.dudu.com.ec' : 'http://localhost:3000';  // True Production

export const environment = {
  // Controles
  nameApp: '/',                           // nombre del subdominio para Build
  limit_file: 10,                         // Limite de subida de archivos
  
  status: false,                          // Se aplica cuando la aplicacion esta en un enlace diferente como componente ejemplo: localhost/admin/
  socketUrl: baseDomain,

  urlBase: `${baseDomain}/api/v1`,
  urlAuth: '/auth',
  urlMail: '/mail',
  urlControl: '/control',
  urlUser: '/user',
  urlClient: '/client',

  urlStatus: '/status',
  urlRole: '/role',

};
