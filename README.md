# Forge User Notifier Demo App

This is an example Jira app demonstrating how to push notifications to Jira users. The app utlises
the "flag" component to provide on screen notifications, although this could be enhanced to use 
other mechanisms such as a dialog.

The implementation will show messages to users when they are viewing issue or dashboard views.

## Getting Started

- Clone this repository.

- Register a copy of the app to your Atlassian account:
```
forge register
```

- Install top-level dependencies:
```
npm install
```

- Deploy your app:
```
forge deploy
```

- Install your app into an Atlassian site:
```
forge install
```

## Sending messages

### Sending messages using the Jira admin panel

- In Jira Cloud, browse to **Settings** > **Apps** > **Send User Message**.
- Pick an account to notify, select a message style, and input a message title, and description.
- When the user next visits an issue or dashboard, a [`flag`](https://developer.atlassian.com/platform/forge/custom-ui-bridge/showFlag/#showflag) will be displayed to them with the message.
- If the user clicks the **Acknowledge** action, then the message will not be displayed to them again, otherwise, the message will be re-displayed the next time the user navugates to an issue view or dashboard.
- If the message relates to a specific issue, then the issue key or ID can be specified in order for the user to receive an instant notification if they are currently viewing the relevant issue.
- You can test the app by sending yourself a message and browsing to an issue or dashboard.

### Sending messages using the app's API

The app also provides a simple API allowing messages to be created programmatically. The API is secured via a secret key that must be stored in an environment variable as shown below. Make sure you substitue 'foo' for an API key that you create and keep secret.

```
forge variables set --encrypt MY_WEBTRIGGER_KEY foo
export FORGE_USER_VAR_MY_WEBTRIGGER_KEY=foo
```

Now you need to get the address of the API by using the `forge webtrigger` command as shown below. Make sure you substitue 'your-tenant' for your Jira domain name.

```
> forge-user-notifier-demo-app % forge webtrigger

Getting the web trigger URL by an app installation.

Press Ctrl+C to cancel.

? Select an installation: your-tenant.atlassian.net
? Select a web trigger: new-user-message

Copy your web trigger URL below to start using it:

https://0ed810w2-0aet-4qq9-9hja-cddjdlggab53.hello.atlassian-dev.net/x1/0EvTwjhspougjkgJsBOu8wIsiBlmvg
```

You can now use the API as per the following curl example:

```
curl --header "X-mywebtriggerkey: foo" --header "X-accountId: 557057:7065aba1-f766-4f8f-a164-3c84c2396f99" --header "X-issueidsorkeys: FEAT-13" --header "X-messagetype: warning" --header "X-messagetitle: Illegal link change" --header "X-messagedescription: Please do not make this type of link change again. See http://foo.com" https://0ed810w2-0aet-4qq9-9hja-cddjdlggab53.hello.atlassian-dev.net/x1/0EvTwjhspougjkgJsBOu8wIsiBlmvg
```

## Architecture

Forge Toaster uses three modules: 

- an [`adminPage`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-admin-page/) used to create new messages; and
- an [`issueViewBackgroundScript`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-issue-view-background-script/) and a [`dasboardBackgroundScript`](https://developer.atlassian.com/platform/forge/manifest-reference/modules/jira-dashboard-background-script/) that checks for pending messages and displays them to the user

The user messages are stored as [custom entities](https://developer.atlassian.com/platform/forge/storage-reference/storage-api-custom-entities/).

## Tailoring the app

The app updates the desciption field of the issue. 

## Potential enhancements

* Support alternate forms of notifications such as dialoigs.
* Support the ability to set message expiry times.
8 Support the ability to broadcast to all users or all users within a specific group.

## Requirements

- Requires Node v20+ (tested on v20.18.1)

## License

Copyright (c) 2025 Atlassian and others.
Apache 2.0 licensed, see [LICENSE](LICENSE) file.
[![From Atlassian](https://raw.githubusercontent.com/atlassian-internal/oss-assets/master/banner-cheers.png)](https://www.atlassian.com)
