export const compactNumber = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
})

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
]


export function timeAgo(iso: string) {
    const diffSec = (new Date(iso).getTime() - Date.now()) / 1000
    const rtf = new Intl.RelativeTimeFormat("id", { numeric: "auto" })
    for (const [unit, sec] of RELATIVE_UNITS) {
        if (Math.abs(diffSec) >= sec) {
            return rtf.format(Math.round(diffSec / sec), unit)
        }
    }
    return "baru saja"
}
