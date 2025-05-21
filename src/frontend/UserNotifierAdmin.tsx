import React, { useEffect, useState } from 'react';
import ForgeReconciler, {
  RequiredAsterisk,
  ErrorMessage,
  UserPicker,
  Textfield,
  Select,
  Form,
  FormHeader,
  FormSection,
  FormFooter,
  LoadingButton,
  Label,
  useForm 
} from '@forge/react';
import { invoke, showFlag } from '@forge/bridge';
import { UserMessageInstruction } from 'src/types/UserMessageInstruction';

const UserNotifierAdmin = () => {

  // const [pendingUserMessages, setPendingUserMessages] = useState<UserMessage[]>([]);
  const [sending, setSending] = useState(false);

  // const fetchPendingUserMessages = async () => {
  //   const userMessages = (await invoke('fetchAllPendingUserMessages')) as UserMessage[];
  //   console.log(`Pending userMessages`, userMessages);
  //   setPendingUserMessages(userMessages);
  // }

  // useEffect(() => {
  //   fetchPendingUserMessages();
  // }, []);

  const onSubmit = async ({ account, type, title, description, issueIdsOrKeysCsv }) => {
    setSending(true);
    console.log(`Sending userMessage to ${account.id} of type ${type.value} with title ${title} and description ${description}`); 
    const issueIdsOrKeys = issueIdsOrKeysCsv ? issueIdsOrKeysCsv.split(',').map((key: string) => key.trim()) : []; 
    const message: UserMessageInstruction = {
      accountId: account.id,
      type: type.value,
      title: title,
      description: description,
      issueIdsOrKeys: issueIdsOrKeys
    }  
    await invoke('sendUserMessage', message);
    // await fetchPendingUserMessages();

    if (issueIdsOrKeys.length) {
      // for (const issueIdOrKey of issueIdsOrKeys) {
      //   await invoke('sendUserMessageToIssues', { 
      //     accountId: account.id, 
      //     type: type.value, 
      //     title,
      //     description,
      //     issueKeys
      //   });
  
      // }
      console.log(`Sending userMessage to issues ${issueIdsOrKeysCsv}`);
      const promises = issueIdsOrKeys.map((issueIdOrKey: string) => {
        return invoke('updateIssue', {
          issueIdOrKey: issueIdOrKey
        });
      });
      await Promise.all(promises);
    }

    showFlag({ 
      id: "success", 
      type: "success", 
      title: `📬 Message sent`, 
      description: `The message will be displayed to ${account.name} when they next browse an issue or dashboard.`, 
      isAutoDismiss: true 
    });
    setSending(false);
  }

  const { handleSubmit, register, getFieldId, formState } = useForm();
  const { errors } = formState;

  const types = ['info', 'success', 'warning', 'error'];

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormHeader>
        Use this form to display a message to a user in a popup notification when they next browse an issue or dashboard.
        The message will be displayed until the user acknowledges it.
      </FormHeader>
      <FormSection>
        <Label labelFor={getFieldId('account')}>User <RequiredAsterisk /></Label>
        <UserPicker label={''} placeholder='User' {...register('account', { required: true })} />
        {errors["account"] && (<ErrorMessage>Please select a user to notify</ErrorMessage>)}
      </FormSection>
      <FormSection>
        <Label labelFor={getFieldId('type')}>Style <RequiredAsterisk /></Label>
        <Select
          {...register('type', { required: true })}
          appearance="default"          
          options={types.map((type) => { return { label: type, value: type }; })}
          isRequired={true}
        />
        {errors["type"] && (<ErrorMessage>Please select a message style</ErrorMessage>)}
      </FormSection>
      <FormSection>
        <Label labelFor={getFieldId('title')}>Title <RequiredAsterisk /></Label>
        <Textfield {...register("title", { required: true })} placeholder='🎂 Happy Birthday!' />
        {errors["title"] && (<ErrorMessage>Please enter a message title</ErrorMessage>)}
      </FormSection>
      <FormSection>
        <Label labelFor={getFieldId('description')}>Description <RequiredAsterisk /></Label>
        <Textfield {...register("description", { required: true })} placeholder='There is a 0.27% chance that this message is accurate.' />
        {errors["description"] && (<ErrorMessage>Please enter a message description</ErrorMessage>)}
      </FormSection>
      <FormSection>
        <Label labelFor={getFieldId('issueIdsOrKeysCsv')}>Issue keys or IDs</Label>
        <Textfield {...register("issueIdsOrKeysCsv", { required: false })} placeholder='ABC-123, DEV-456' />
      </FormSection>
      <FormFooter>
        <LoadingButton isLoading={sending} appearance="primary" type="submit">
          Send  
        </LoadingButton>
      </FormFooter>
    </Form>
  )
};

ForgeReconciler.render(
  <React.StrictMode>
    <UserNotifierAdmin />
  </React.StrictMode>
);
