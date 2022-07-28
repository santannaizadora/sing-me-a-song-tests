import { e2eRepository } from "../repositories/e2eRepository.js";

async function truncate() {
  await e2eRepository.truncate();
}

async function seed() {
  await e2eRepository.seed();
}

export const e2eService = {
  truncate,
  seed,
};