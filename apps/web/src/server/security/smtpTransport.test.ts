/** @jest-environment node */
import nodemailer from 'nodemailer-smtp';

it('builds a Czech recovery message with the patched transport without network delivery', async () => {
  const transport = nodemailer.createTransport({ streamTransport: true, buffer: true });
  try {
    const result = await transport.sendMail({
      from: 'SYNTHOMA <sender@example.invalid>', to: 'reader@example.invalid',
      subject: 'Obnovení hesla', text: 'Nové heslo: https://www.synthoma.cz/reset-password#token=test-only',
    });
    const message = result.message.toString();
    expect(message).toContain('To: reader@example.invalid');
    expect(message).toContain('Subject: =?UTF-8?');
    expect(message).toContain('MIME-Version: 1.0');
    expect(message).toContain('reset-password#token=');
  } finally { transport.close(); }
});
