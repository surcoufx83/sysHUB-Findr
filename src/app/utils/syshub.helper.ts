export function explodeParameters(paramsin?: string): { [key: string]: string } {
    let out: { [key: string]: string } = {};
    paramsin?.trim().split(';').forEach((item) => {
        if (item.trim() != '') {
            let equalindex = item.indexOf('=');
            if (equalindex > -1)
                out[item.substring(0, equalindex)] = item.substring(equalindex + 1);
        }
    });
    return out;
}