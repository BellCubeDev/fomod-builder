import { getLicenseData } from "@/app/license-data.json/getLicenseData";

const licenseData = await getLicenseData();

const licenseInfo = Object.entries(licenseData).map(([name, info]) => !info.private && <div key={name}>
    <h3>{info.repository ? <a href={info.repository} target='_blank'>{name}</a> : name}</h3>
    {info.licenses && info.licenses !== 'UNLICENSED' && <p>Licensed under {
        typeof info.licenses === 'string' ? 'the ' + info.licenses + ' license.'
        : info.licenses.length === 1 ? 'the ' + info.licenses[0] + ' licenses.'
        : 'multiple licenses: ' + info.licenses.join(', ') + '.'
    }</p>}
    {info.name && <p><a href={`https://npmjs.com/package/${info.name}`} target='_blank'><i>View on NPM registry</i></a></p>}
    <br />
</div>);

export default () => licenseInfo
