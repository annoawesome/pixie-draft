import crypto from "crypto";

const secrets = {
  primarySecret: "",
};

/**
 * Throws an error if secret was not initialized
 * @returns Primary secret
 */
export function getSecret() {
  if (!secrets.primarySecret) {
    throw new Error("App secret not initialized");
  } else {
    return secrets.primarySecret;
  }
}

export function initializeSecret(secret: string | undefined) {
  secrets.primarySecret = secret || crypto.randomBytes(64).toString("base64");
}
