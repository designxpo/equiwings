import nodemailer from "nodemailer"
import EmailTemplate from "../models/EmailTemplate"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export interface EmailOptions {
  to: string
  templateName: string
  variables: Record<string, string>
}

export async function sendEmail({ to, templateName, variables }: EmailOptions): Promise<boolean> {
  try {
    const template = await EmailTemplate.findOne({ name: templateName, isActive: true })

    if (!template) {
      throw new Error(`Email template ${templateName} not found`)
    }

    let subject = template.subject
    let htmlContent = template.htmlContent
    let textContent = template.textContent

    // Replace variables in template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, "g")
      subject = subject.replace(regex, value)
      htmlContent = htmlContent.replace(regex, value)
      textContent = textContent.replace(regex, value)
    })

    const mailOptions = {
      from: process.env.FROM_EMAIL,
      to,
      subject,
      html: htmlContent,
      text: textContent,
    }
    const result = mailOptions
    console.log(result)
    // const result = await transporter.sendMail(mailOptions)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}
