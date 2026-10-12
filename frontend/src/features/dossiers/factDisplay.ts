import { formatDecimal, formatFcfa, formatMonth } from '../../shared/format'
import type { FactItem, FactStatus, FactValue } from './api'

export const STATUS_LABEL: Record<FactStatus, string> = {
  non_renseigne: 'Non renseigné',
  inconnu: 'Je ne sais pas',
  declare: 'Déclaré',
  estime: 'Estimé',
  verifie: 'Vérifié (source indiquée)',
}

// Le statut dit d'où vient l'information, pas si la situation est réglée : jamais de vert ici.
// Une information vérifiée peut confirmer qu'un accord reste à obtenir (point toujours ouvert).
export const STATUS_TONE: Record<FactStatus, 'neutral' | 'ok' | 'warn' | 'danger' | 'info'> = {
  non_renseigne: 'neutral',
  inconnu: 'warn',
  declare: 'neutral',
  estime: 'neutral',
  verifie: 'info',
}

/** Résumé lisible d'une valeur, champ par champ, à partir des définitions du serveur. */
export function describeValue(fact: Pick<FactItem, 'fields'>, value: FactValue | null): string[] {
  if (!value) return []
  const lines: string[] = []
  for (const field of fact.fields) {
    const raw = value[field.name]
    if (raw === undefined || raw === null || raw === '') continue
    if (field.name === 'surface_unite') continue // affichée avec la surface
    let text: string
    switch (field.kind) {
      case 'choice':
        text = field.choices.find((c) => c.value === raw)?.label ?? String(raw)
        break
      case 'month':
        text = formatMonth(String(raw))
        break
      case 'integer':
        text = field.unit === 'FCFA' ? formatFcfa(raw) : formatDecimal(raw)
        break
      case 'decimal': {
        const unit = field.name === 'surface' ? (value.surface_unite === 'ha' ? 'ha' : 'm²') : field.unit
        text = `${formatDecimal(raw)}${unit ? ` ${unit}` : ''}`
        break
      }
      default:
        text = String(raw)
    }
    lines.push(fact.fields.length > 1 ? `${field.label} : ${text}` : text)
  }
  return lines
}
