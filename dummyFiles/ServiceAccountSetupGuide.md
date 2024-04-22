### Step-by-Step Guide to Set Up a Google Cloud Service Account

#### Step 1: Access Google Cloud Console
- **Navigate to the Google Cloud Console** at [Google Cloud Console](https://console.cloud.google.com/).
- Sign in with your Google account if you are not already logged in.

#### Step 2: Select Your Project
- Choose the project for which you want to create a service account from the project drop-down list at the top of the console.

#### Step 3: Create or Select a Service Account
- Go to the navigation menu (hamburger icon in the top left), select **IAM & Admin** > **Service Accounts**.
- If you already have a service account, select it from the list. Otherwise, click **Create Service Account**.

#### Step 4: Create a New Service Account
- Enter a name and description for your new service account.
- Click **Create**.
- Add necessary roles such as **Editor** or any specific roles that the service account needs for functioning (e.g., `Gmail API` permissions like `Gmail Send`).
- Click **Continue** and then **Done** to complete the creation process.

#### Step 5: Generate a New Private Key
- Click on the created or existing service account from the list.
- Go to the **Keys** tab.
- Click **Add Key**, select **Create new key**.
- Choose **JSON** as the key type, and then click **Create**.
- The JSON key file will be automatically downloaded to your computer.

#### Step 6: Secure and Configure the Key
- Move the downloaded JSON file to a secure location on your server or development environment.
- You might want to rename it to something meaningful, like `serviceAccount.json`.

#### Step 7: Set Environment Variables
You have two options for configuring the GmailMailer:

**Option 1: Use an Environment Variable for Direct JSON Content**
- Open the downloaded JSON file with a text editor, copy its content.
- Set an environment variable on your server or development machine:
  ```bash
  export GMAIL_MAILER_SERVICE_ACCOUNT='{"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"....iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
  ```
- Make sure to replace the entire JSON string with your actual JSON key content. Ensure to escape necessary characters.

**Option 2: Use an Environment Variable for the JSON Path**
- Store the JSON file at a secure location in your project, such as a directory called `private`.
- Set an environment variable to specify the path:
  ```bash
  export GMAIL_MAILER_SERVICE_ACCOUNT_PATH=./private/serviceAccount.json
  ```
- Ensure the path is relative to where your application runs, or use an absolute path.

#### Step 8: Usage in Your Application
- Use the environment variable in your application to configure `GmailMailer`. The `GmailMailer` class can automatically use these environment variables, or you can pass the path or JSON content directly when constructing the `GmailMailer` instance.

#### Step 9: Deploy and Test
- Deploy your application and test to ensure that emails are sent correctly using the service account.

By following these steps, users can correctly set up a service account for use with the `gmail-node-mailer` package, either by specifying the JSON directly in an environment variable or by referencing the path to the JSON file.