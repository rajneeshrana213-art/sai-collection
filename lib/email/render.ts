import ejs from "ejs";
import path from "path";

/**
 * Renders an EJS transactional email template into HTML string.
 * @param templateName Name of the template (e.g. 'account-welcome', 'order-placed', 'password-reset-otp')
 * @param data Data context object passed into the template
 * @returns Promise<string> Rendered HTML
 */
export async function renderEmailTemplate(
  templateName: string,
  data: Record<string, unknown>
): Promise<string> {
  const templatePath = path.join(
    process.cwd(),
    "emails",
    "templates",
    `${templateName}.ejs`
  );

  const defaultData = {
    storefrontUrl: process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://saicollection.in",
    ...data,
  };

  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, defaultData, {}, (err, html) => {
      if (err) {
        console.error(`[EJS Render Error] Failed rendering template ${templateName}:`, err);
        return reject(err);
      }
      resolve(html);
    });
  });
}
