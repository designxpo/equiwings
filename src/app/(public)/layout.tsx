import type { Metadata } from "next";
import ".././globals.css";
import Layout from "@/components/layouts/layout";
import { CustomerAuthProvider } from "@/providers/customer-auth-context";
import { Toaster } from "react-hot-toast";


export const metadata: Metadata = {
  title: "Discover India's Premier Equestrian Experience",
  description: "Ride with confidence, learn from experts, and elevate your passion—Equiwings is your one-stop equestrian partner.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="font-pt-serif">
        <CustomerAuthProvider>
          <Layout>
            {children}
          </Layout>
          <Toaster position="top-center" reverseOrder={false} />
        </CustomerAuthProvider>
      </body>
    </html>
  );
}
