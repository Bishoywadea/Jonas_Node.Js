const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) create transporter
    const transporter = nodemailer.createTransport({
        // @ts-ignore
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        },
        // activate in gmail "less secure app" option
        // note:gmail is not good for production apps because
        // it allows you to send only 500 message only a day
    });

    // 2) define email options
    const mailOptions = {
        from: 'beshoWadea <beshobosh416@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) actually send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;