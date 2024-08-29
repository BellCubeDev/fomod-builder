async function getLicenseData_(): ReturnType<typeof import('./generateLicenseData').generateLicenseData> {
    if (typeof window === 'undefined') {
        const {generateLicenseData} = await import('./generateLicenseData');
        return await generateLicenseData();
    } else {
        return await fetch('/license-data.json').then(res => res.json());
    }
}

let licenseData: ReturnType<typeof getLicenseData_> | null = null;

export async function getLicenseData() {
    licenseData ??= getLicenseData_();
    return await licenseData;
}
