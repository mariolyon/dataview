import { PostgreSqlContainer } from "@testcontainers/postgresql";
import { execSync } from "node:child_process";

export async function setup() {
	console.log("启动测试容器...");
	const container = await new PostgreSqlContainer("postgres:16-alpine")
		.withDatabase("dataview_test")
		.withUsername("test")
		.withPassword("test")
		.start();

	const databaseUrl = `postgresql://${container.getUsername()}:${container.getPassword()}@${container.getHost()}:${container.getMappedPort(
		5432,
	)}/${container.getDatabase()}`;

	process.env.DATABASE_URL = databaseUrl;

	// Run migrations
	execSync("npx prisma db push", {
		env: { ...process.env, DATABASE_URL: databaseUrl },
	});

	console.log(`🚀 Test database ready at: ${databaseUrl}`);

	// Return teardown function or use globalThis to store container
	(globalThis as any).__TEST_CONTAINER__ = container;
}

export async function teardown() {
	const container = (globalThis as any).__TEST_CONTAINER__;
	if (container) {
		await container.stop();
		console.log("测试容器已停止");
	}
}
