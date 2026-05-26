import { appPath } from "@/lib/paths";

interface ShareLinks {
	publicPath: string;
	publicUrl: string;
	vcardPath: string;
	vcardUrl: string;
}

function normalizeOrigin(origin: string): string {
	return origin.replace(/\/+$/, "");
}

export function buildShareLinks(origin: string, username: string): ShareLinks {
	const encodedUsername = encodeURIComponent(username.trim());
	const publicPath = appPath(`/${encodedUsername}`);
	const vcardPath = appPath(`/api/vcard/${encodedUsername}`);
	const normalizedOrigin = normalizeOrigin(origin);

	return {
		publicPath,
		publicUrl: `${normalizedOrigin}${publicPath}`,
		vcardPath,
		vcardUrl: `${normalizedOrigin}${vcardPath}`,
	};
}
