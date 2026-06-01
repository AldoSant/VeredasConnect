import { describe, expect, it } from "vitest";
import {
	apiPath,
	appPath,
	DEFAULT_AUTH_CALLBACK_PATH,
	safeInternalPath,
	stripAppBasePath,
} from "@/lib/paths";

describe("Path Helpers (src/lib/paths.ts)", () => {
	// Testes para appPath
	describe("appPath", () => {
		it("deve concatenar caminho sem barra inicial corretamente com basePath padrão (/connect)", () => {
			expect(appPath("profile")).toBe("/connect/profile");
		});

		it("deve lidar com path já iniciado por barra", () => {
			// Se o path começa com /, a concatenação deve evitar duplicatas (depende da implementação, aqui assumimos que appPath trata isso)
			expect(appPath("/about")).toBe("/connect/about");
		});

		it("deve usar um basePath customizado", () => {
			expect(appPath("dashboard", "/admin")).toBe("/admin/dashboard");
		});
	});

	// Testes para apiPath
	describe("apiPath", () => {
		it("deve construir corretamente caminhos de API baseados em /connect", () => {
			const path = "vcard/user123";
			expect(apiPath(path)).toBe("/connect/vcard/user123");
		});

		it("deve usar um basePath customizado para API se fornecido", () => {
			// Teste de caso de uso onde o caminho da API pode ser diferente do app base
			const path = "metrics";
			expect(apiPath(path, "/v2/data")).toBe("/v2/data/metrics");
		});
	});

	// Testes para stripAppBasePath (remoção do prefixo /connect)
	describe("stripAppBasePath", () => {
		it("deve remover o APP_BASE_PATH de um caminho completo", () => {
			expect(stripAppBasePath("/connect/profile")).toBe("/profile");
		});

		it("deve retornar a barra '/' se for exatamente o APP_BASE_PATH", () => {
			expect(stripAppBasePath("/connect")).toBe("/");
		});

		it("não deve modificar caminhos que não começam com o basePath", () => {
			expect(stripAppBasePath("/about/contact")).toBe("/about/contact");
		});

		it("deve retornar a barra '/' para paths vazios ou inválidos (caso de borda)", () => {
			expect(stripAppBasePath("/")).toBe("/");
		});
	});

	// Testes para safeInternalPath (validação de segurança)
	describe("safeInternalPath", () => {
		const fallback = DEFAULT_AUTH_CALLBACK_PATH;

		it("deve retornar o fallback se o path for nulo ou indefinido", () => {
			expect(safeInternalPath(null)).toBe(fallback);
			expect(safeInternalPath(undefined)).toBe(fallback);
		});

		it("deve retornar o fallback se o path estiver vazio ou conter apenas espaços", () => {
			expect(safeInternalPath("")).toBe(fallback);
			expect(safeInternalPath("   ")).toBe(fallback);
		});

		it("deve rejeitar caminhos que parecem ser URLs completas (e.g., protocol)", () => {
			expect(safeInternalPath("http://example.com")).toBe(fallback);
			expect(safeInternalPath("ftp://test")).toBe(fallback);
		});

		it("deve retornar o caminho sem o prefixo de aplicação", () => {
			// Caminho válido: /connect/profile/user1
			const path = "/connect/profile/user1";
			expect(safeInternalPath(path)).toBe("/profile/user1");
		});

		it("deve rejeitar caminhos com barras duplas", () => {
			// Isto deve ser tratado internamente pelo stripAppBasePath, mas garantimos a robustez.
			const path = "/connect//dashboard";
			expect(safeInternalPath(path)).toBe(fallback);
		});

		it("deve permitir a raiz como caminho interno válido", () => {
			expect(safeInternalPath("/")).toBe("/");
		});
	});
});
