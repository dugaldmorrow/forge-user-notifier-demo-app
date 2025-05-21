import api, { route } from "@forge/api";

export const updateIssue = async (issueIdOrKey: string): Promise<number> => {
  
  // You will probably want to update another issue field instead of the description. 
  const fieldIdToUpdate = "description";
  const newFieldValue = {
    type: "doc",
    version: 1,
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: `My issue updated at ${new Date().toISOString()}`,
          }
        ]
      }
    ]
  }
  const response = await api.asApp().requestJira(route`/rest/api/3/issue/${issueIdOrKey}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fields: {
        [fieldIdToUpdate]: newFieldValue,
      },
    }),
  });
  console.log(`Issue update successfiul? ${response.ok}`);
  if (!response.ok) {
    throw new Error(`Failed to update "${fieldIdToUpdate}" field on issue "${issueIdOrKey}": ${response.statusText}`);
  }
  return response.status;
}
