/**
 * Utilities for normalizing Supra Move addresses and fuzzy-matching event types.
 */

/**
 * Normalizes an address to its canonical 64-char lowercase hex format (0x + 64 hex digits).
 * Handles module types (e.g. 0x1::coin::Coin) by canonicalizing the address prefix.
 */
export function normalizeAddress(addr: string): string {
    if (!addr) return '';

    const strAddr = String(addr).replace(/\s+/g, '');
    if (!strAddr) return '';

    // Handle Move types: 0x1::coin::Coin
    if (strAddr.includes('::')) {
        const parts = strAddr.split('::');
        let hexPart = parts[0];
        if (hexPart.startsWith('0x')) {
            hexPart = hexPart.slice(2);
        }
        const stripped = hexPart.replace(/^0+/, '');
        const normalizedHex = '0x' + stripped.toLowerCase().padStart(64, '0');
        const remaining = parts.slice(1).join('::');
        return `${normalizedHex}::${remaining}`;
    }

    let hexPart = strAddr;
    if (hexPart.startsWith('0x')) {
        hexPart = hexPart.slice(2);
    }
    const stripped = hexPart.replace(/^0+/, '');
    return '0x' + stripped.toLowerCase().padStart(64, '0');
}

/**
 * Robust fuzzy matching for Move event types.
 * Normalizes whitespace and address zero-padding to prevent false negatives.
 */
export function fuzzyMatch(actual: string, target: string): boolean {
    if (!actual || !target) return false;

    // Normalize BOTH by removing spaces
    const cleanActual = actual.replace(/\s/g, '');
    const cleanTarget = target.replace(/\s/g, '');

    // Normalize address prefix to minimal 0x + stripped hex
    const normalize = (s: string) => {
        const parts = s.split('::');
        if (parts.length > 0 && parts[0].startsWith('0x')) {
            const hex = parts[0].substring(2).replace(/^0+/, '');
            parts[0] = '0x' + (hex === '' ? '0' : hex).toLowerCase();
        }
        return parts.join('::');
    };

    return normalize(cleanActual) === normalize(cleanTarget);
}
