import licenseChecker from 'license-checker-rseidelsohn';

let licenseData: licenseChecker.ModuleInfos | null = null;

export async function generateLicenseData() {
    licenseData ??= process.env.NODE_ENV === 'development' ? {'TEST DATA: fomod@0.1.8': {
        licenses: 'MIT',
        repository: 'https://github.com/BellCubeDev/fomod-js',
        name: 'fomod',
    }} : await new Promise<licenseChecker.ModuleInfos>((resolve, reject)=> licenseChecker.init({
        start: '.',
        production: true,
        json: true,
        customFormat: {name: true, licenses: true, repository: true, licenseText: true},
    }, (err, json) => err ? reject (json): resolve(json)) );

    return licenseData;
}
