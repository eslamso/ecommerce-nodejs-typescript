export interface mailOptions {
  email: string;
  subject: string;
  message: string;
}

export interface nodemailerMailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}
