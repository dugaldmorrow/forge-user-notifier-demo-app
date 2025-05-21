import api, { route } from '@forge/api';

export const isUserAdmin = async (): Promise<boolean> => {
  const response = await api.asUser().requestJira(route`/rest/api/3/mypermissions?permissions=ADMINISTER`, {
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    const msg = `Failed to check admin permissions: ${response.statusText}`;
    console.error(msg);
    throw new Error(msg);
  }

  const body = await response.json();
  return body.permissions.ADMINISTER.havePermission;
}
