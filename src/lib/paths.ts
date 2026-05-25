export const APP_BASE_PATH = "/connect";
export const DEFAULT_AUTH_CALLBACK_PATH = "/editor";

export function appPath(path: string): string {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${APP_BASE_PATH}${normalizedPath}`;
}

export function apiPath(path: string): string {
	return appPath(path);
}

export function stripAppBasePath(path: string): string {
	if (path === APP_BASE_PATH) return "/";
	if (path.startsWith(`${APP_BASE_PATH}/`)) {
		return path.slice(APP_BASE_PATH.length) || "/";
	}
	return path;
}

export function safeInternalPath(
	path: string | null | undefined,
	fallback = DEFAULT_AUTH_CALLBACK_PATH,
): string {
	if (!path) return fallback;

	const trimmedPath = path.trim();
	if (!trimmedPath || trimmedPath.includes("\\")) return fallback;
	if (/^[a-z][a-z0-9+.-]*:/i.test(trimmedPath)) return fallback;

	const normalizedPath = trimmedPath.startsWith("/") ? trimmedPath : `/${trimmedPath}`;
	if (normalizedPath.startsWith("//")) return fallback;

	const withoutBasePath = stripAppBasePath(normalizedPath);
	if (!withoutBasePath.startsWith("/") || withoutBasePath.startsWith("//")) return fallback;

	return withoutBasePath;
}
