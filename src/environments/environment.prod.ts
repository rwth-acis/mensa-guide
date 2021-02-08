declare global {
  interface Window {
    env: {
      apiUrl: string;
    };
  }
}

export const environment = {
  production: true,
  openIdAuthorityUrl: 'https://api.learning-layers.eu/o/oauth2',
  openIdClientId: 'f8622260-875b-499a-82db-db55f89f9deb',
  las2peerWebConnectorUrl:
    window.env.apiUrl || 'las2peer-bootstrap.sbf-dev:32011',
};
