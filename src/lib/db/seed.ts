import connectDB from "./connection"
import Role from "../models/Role"
import Permission from "../models/Permission"
import User from "../models/User"
import EmailTemplate from "../models/EmailTemplate"

export async function seedDatabase() {
  try {
    await connectDB()

    // Create permissions
    const permissions = [
      // User permissions
      { name: "USER_CREATE", description: "Create users", resource: "USER", action: "CREATE" },
      { name: "USER_READ", description: "Read users", resource: "USER", action: "READ" },
      { name: "USER_UPDATE", description: "Update users", resource: "USER", action: "UPDATE" },
      { name: "USER_DELETE", description: "Delete users", resource: "USER", action: "DELETE" },
      { name: "USER_MANAGE", description: "Manage users", resource: "USER", action: "MANAGE" },

      // Product permissions
      { name: "PRODUCT_CREATE", description: "Create products", resource: "PRODUCT", action: "CREATE" },
      { name: "PRODUCT_READ", description: "Read products", resource: "PRODUCT", action: "READ" },
      { name: "PRODUCT_UPDATE", description: "Update products", resource: "PRODUCT", action: "UPDATE" },
      { name: "PRODUCT_DELETE", description: "Delete products", resource: "PRODUCT", action: "DELETE" },
      { name: "PRODUCT_MANAGE", description: "Manage products", resource: "PRODUCT", action: "MANAGE" },

      // Role permissions
      { name: "ROLE_CREATE", description: "Create roles", resource: "ROLE", action: "CREATE" },
      { name: "ROLE_READ", description: "Read roles", resource: "ROLE", action: "READ" },
      { name: "ROLE_UPDATE", description: "Update roles", resource: "ROLE", action: "UPDATE" },
      { name: "ROLE_DELETE", description: "Delete roles", resource: "ROLE", action: "DELETE" },
      { name: "ROLE_MANAGE", description: "Manage roles", resource: "ROLE", action: "MANAGE" },

      // Cart permissions
      { name: "CART_CREATE", description: "Create cart", resource: "CART", action: "CREATE" },
      { name: "CART_READ", description: "Read cart", resource: "CART", action: "READ" },
      { name: "CART_UPDATE", description: "Update cart", resource: "CART", action: "UPDATE" },
      { name: "CART_DELETE", description: "Delete cart", resource: "CART", action: "DELETE" },
    ]

    const createdPermissions = await Permission.insertMany(permissions, { ordered: false }).catch(() => {
      console.log("Permissions already exist")
    })

    // Get all permissions
    const allPermissions = await Permission.find()
    const customerPermissions = allPermissions.filter(
      (p) => (p.resource === "PRODUCT" && p.action === "READ") || p.resource === "CART",
    )
    const adminPermissions = allPermissions

    // Create roles
    const customerRole = await Role.findOneAndUpdate(
      { name: "CUSTOMER" },
      {
        name: "CUSTOMER",
        description: "Customer role with limited permissions",
        permissions: customerPermissions.map((p) => p._id),
        isDefault: true,
      },
      { upsert: true, new: true },
    )

    const adminRole = await Role.findOneAndUpdate(
      { name: "ADMIN" },
      {
        name: "ADMIN",
        description: "Administrator role with full permissions",
        permissions: adminPermissions.map((p) => p._id),
        isDefault: false,
      },
      { upsert: true, new: true },
    )

    // Create default admin user
    const adminExists = await User.findOne({ email: "admin@example.com" })
    if (!adminExists) {
      await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@example.com",
        password: "admin123",
        phoneNumber: "1234567890",
        countryCode: "+1",
        role: adminRole._id,
        isEmailVerified: true,
      })
    }

    // Create email templates
    const emailTemplates = [
      {
        name: "EMAIL_VERIFICATION",
        subject: "Verify Your Email - {{siteName}}",
        htmlContent: `
          <h1>Welcome {{firstName}}!</h1>
          <p>Please verify your email address by entering this OTP:</p>
          <h2 style="color: #007bff;">{{otp}}</h2>
          <p>This OTP will expire in 10 minutes.</p>
        `,
        textContent: "Welcome {{firstName}}! Please verify your email with OTP: {{otp}}",
        variables: ["firstName", "otp", "siteName"],
      },
      {
        name: "PASSWORD_RESET",
        subject: "Reset Your Password - {{siteName}}",
        htmlContent: `
          <h1>Password Reset Request</h1>
          <p>Hi {{firstName}},</p>
          <p>You requested to reset your password. Use this OTP:</p>
          <h2 style="color: #007bff;">{{otp}}</h2>
          <p>This OTP will expire in 10 minutes.</p>
        `,
        textContent: "Hi {{firstName}}, reset your password with OTP: {{otp}}",
        variables: ["firstName", "otp", "siteName"],
      },
    ]

    await EmailTemplate.insertMany(emailTemplates, { ordered: false }).catch(() => {
      console.log("Email templates already exist")
    })

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
