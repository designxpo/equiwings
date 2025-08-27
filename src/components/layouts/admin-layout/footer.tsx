import pkgs from "../../../../package.json";
export function Footer() {

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto px-4 py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-900">Welcome Equiwings Admin!</span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-sm text-gray-500">
                            <span>Version .{pkgs.version}</span>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">© 2025 Equiwings Admin Panel. All rights reserved.</div>
                </div>
            </div>
        </footer>
    )
}
