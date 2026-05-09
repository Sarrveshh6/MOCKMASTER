/**
 * Utility to "send" an email.
 * Since the user requested terminal logging, this will print the reset link
 * to the server console instead of sending a real email.
 */
const sendEmail = async (options) => {
  console.log('\n' + '='.repeat(50));
  console.log('📧 INCOMING EMAIL: Password Reset Request');
  console.log('-'.repeat(50));
  console.log(`TO: ${options.email}`);
  console.log(`SUBJECT: ${options.subject}`);
  console.log('\nMESSAGE:');
  console.log(options.message);
  console.log('='.repeat(50) + '\n');
};

module.exports = sendEmail;
