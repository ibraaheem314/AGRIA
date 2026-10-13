import { expect, type Page } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

export const PASSWORD = 'Mot-de-passe-e2e-2026'

const BACKEND = path.resolve(import.meta.dirname, '../../backend')
const PYTHON = [path.join(BACKEND, '.venv/Scripts/python.exe'), path.join(BACKEND, '.venv/bin/python')].find((p) =>
  existsSync(p),
)

/** Commande d'exploitation Django sur la base des parcours (agria_e2e). */
export function manage(...args: string[]): string {
  if (!PYTHON) throw new Error('backend/.venv introuvable')
  return execFileSync(PYTHON, ['manage.py', ...args], {
    cwd: BACKEND,
    env: { ...process.env, DB_NAME: 'agria_e2e', PYTHONIOENCODING: 'utf-8' },
    encoding: 'utf-8',
  })
}

/** Crée un compte conseiller ; retourne son mot de passe aléatoire (affiché une seule fois). */
export function createAdvisor(email: string, name: string): string {
  const out = manage('create_account', '--email', email, '--name', name, '--advisor', '--random-password')
  const password = out.match(/Mot de passe .*: (\S+)/)?.[1]
  if (!password) throw new Error(`Mot de passe introuvable dans : ${out}`)
  return password
}

export async function loginWith(page: Page, email: string, password: string) {
  await page.goto('/connexion')
  await page.getByLabel('Adresse email').fill(email)
  await page.getByLabel('Mot de passe').fill(password)
  await page.getByRole('button', { name: 'Se connecter' }).click()
  await page.waitForURL((url) => !url.pathname.startsWith('/connexion'))
}

let counter = 0
export function uniqueEmail(prefix: string) {
  counter += 1
  return `${prefix}-${Date.now()}-${counter}@example.sn`
}

export async function register(page: Page, name: string, email = uniqueEmail(name.toLowerCase())) {
  await page.goto('/inscription')
  await page.getByLabel('Votre nom').fill(name)
  await page.getByLabel('Adresse email').fill(email)
  await page.getByLabel('Mot de passe').fill(PASSWORD)
  await page.getByRole('button', { name: 'Créer mon compte' }).click()
  await expect(page.getByRole('heading', { name: 'Bienvenue' })).toBeVisible()
  return email
}

export async function login(page: Page, email: string) {
  await page.goto('/connexion')
  await page.getByLabel('Adresse email').fill(email)
  await page.getByLabel('Mot de passe').fill(PASSWORD)
  await page.getByRole('button', { name: 'Se connecter' }).click()
}

export async function createProject(
  page: Page,
  { name = 'Parcelle de test', situation = 'Je prépare ma première campagne', campaign = 'Contre-saison 2027' } = {},
) {
  await page.goto('/projets/nouveau')
  await page.getByLabel(situation).check()
  await page.getByLabel('Nom du projet').fill(name)
  await page.getByLabel('Campagne préparée').fill(campaign)
  await page.getByRole('button', { name: 'Créer le projet' }).click()
  await expect(page.getByText('Projet créé.')).toBeVisible()
  const id = Number(page.url().match(/\/d\/(\d+)/)?.[1])
  expect(id).toBeGreaterThan(0)
  return id
}

/** Ouvre une information depuis « Toutes les informations ». */
export async function openFact(page: Page, dossierId: number, label: string) {
  await page.goto(`/d/${dossierId}/projet`)
  await page.getByRole('link', { name: new RegExp(`(Compléter|Mettre à jour) : ${label}`) }).click()
  await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible()
}
