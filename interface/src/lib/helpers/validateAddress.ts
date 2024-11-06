export const isValidEvmAddress = (address: string): boolean => {
    // Check if the address has the correct length and starts with "0x"
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
        return false;
    }

    return true;
}

export default { isValidEvmAddress };