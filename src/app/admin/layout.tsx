"use client";
import ".././globals.css";
import AdminLayout from "@/components/layouts/admin-layout";
import { AdminAuthProvider, useAdminAuth } from "@/providers/admin-auth-context";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="font-poppins">
        <AdminAuthProvider>
          <InnerLayout>{children}</InnerLayout>
          <Toaster position="top-center" reverseOrder={false} />
        </AdminAuthProvider>
      </body>
    </html>
  );
}

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth();

  return isAuthenticated ? (
    <AdminLayout>{children}</AdminLayout>
  ) : (
    <>{children}</>
  );
}