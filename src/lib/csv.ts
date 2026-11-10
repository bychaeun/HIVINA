import { parse } from 'csv-parse/sync';

/**
 * 엑셀에서 저장한 CSV를 읽어 행 배열로 만듭니다.
 * - UTF-8 BOM 자동 처리
 * - 빈 행, 첫 칸이 '#' 으로 시작하는 행(메모용)은 무시
 * - 엑셀 기본 "CSV(쉼표로 분리)" 로 저장해 한글이 깨진 경우 알기 쉬운 오류를 냄
 */
export function parseCsv(text: string, fileLabel: string): Record<string, string>[] {
  if (text.includes('�')) {
    throw new Error(
      `[${fileLabel}] 글자가 깨져 있습니다. 엑셀에서 "다른 이름으로 저장 → CSV UTF-8(쉼표로 분리)" 형식으로 다시 저장해 주세요.`,
    );
  }
  const rows = parse(text, {
    bom: true,
    columns: (header: string[]) => header.map((h) => h.trim().toLowerCase()),
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  return rows.filter((row) => {
    const first = Object.values(row)[0] ?? '';
    if (first.startsWith('#')) return false;
    return Object.values(row).some((v) => v !== '');
  });
}

/** "a | b | c" → ['a','b','c'] */
export function splitList(value: string | undefined): string[] {
  return (value ?? '')
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Y/YES/TRUE/1/O/예 → true */
export function toBool(value: string | undefined, fallback: boolean): boolean {
  const v = (value ?? '').trim().toLowerCase();
  if (v === '') return fallback;
  return ['y', 'yes', 'true', '1', 'o', '예', 'có'].includes(v);
}
