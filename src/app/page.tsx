import FomodBuilderTabbedUI from "./tabbed-ui/Tabs";

export {metadata} from './layout';

import licenseChecker from 'license-checker-rseidelsohn';

const licenseData = process.env.NODE_ENV === 'development' ? {'TEST DATA: fomod@0.1.8': {
    licenses: 'MIT',
    repository: 'https://github.com/BellCubeDev/fomod-js',
    name: 'fomod',
}} : await new Promise<licenseChecker.ModuleInfos>((resolve, reject)=> licenseChecker.init({
    start: '.',
    production: true,
    json: true,
    customFormat: {name: true, licenses: true, repository: true, licenseText: true},
}, (err, json) => err ? reject (json): resolve(json)) );

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

export default function FomodBuilder() {
    return <>
        <FomodBuilderTabbedUI licenseInfo={licenseInfo} />
    </>;
}
