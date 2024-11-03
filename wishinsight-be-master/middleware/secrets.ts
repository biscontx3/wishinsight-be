import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
const secretClient: SecretManagerServiceClient = new SecretManagerServiceClient();

const GCLOUD_PROJECT: string | undefined =
  process.env.GCLOUD_PROJECT || "wishinsight-prod";

export const getSecret = async (): Promise<any> => {
  const STRATEGIES_SECRETS = `projects/${GCLOUD_PROJECT}/secrets/salt/versions/latest`;
  const [version]: any = await secretClient.accessSecretVersion({
    name: STRATEGIES_SECRETS,
  });

  if (!version.payload?.data) throw new Error("couldn't fetch secret");
  return JSON.parse(version.payload.data.toString());
};
