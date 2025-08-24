import * as fs from "fs";
import path from 'node:path';
import { CreateCommandInput } from '../types/types.js';

async function copyFolder(src: string, dest: string) {
  fs.cpSync(src, dest, { recursive: true });
}

async function create(data: CreateCommandInput) {
  const {
    ticket,
    name,
    isNewControl,
    variations,
    global,
  } = data;

  try {
    // Create project directory
    const date = new Date();
    const monthDay = `${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    const folderName = `${monthDay}-UX-${ticket}-${name.split(' ').join('_')}`;
    const projectPath = path.join(process.cwd(), folderName);

    fs.mkdirSync(projectPath);

    const templateDir = path.resolve(process.cwd(), 'template', 'douglas-ab-testing-boilerplate');
    const destinationDir = projectPath;

    await copyFolder(templateDir, projectPath);

    const srcDir = path.join(projectPath, 'src');
    fs.mkdirSync(srcDir);
    const constructVariationContent = (i: number) => `
import { asyncSave, elem, elemSync, qs, qsa, getPage, addTask, ${global ? 'exec' : ''} } from '@douglas.onsite.experimentation/douglas-ab-testing-toolkit';

/**
 * Ticket
 * https://douglas-group.atlassian.net/browse/UX-${ticket}
*/

(async () => {

  const PREFIX = 'ux${ticket}__';

  asyncSave(async () => {

    ${global ? `exec('ux${ticket}');` : ''}
  
    console.log(">>> UX-${ticket} is running, Variant ${i}");
  
  }, PREFIX)();

})();
`;

    const contentGlobal = global
      ? `
import { asyncSave, elem, elemSync, qs, qsa, getPage, addTask, share } from '@douglas.onsite.experimentation/douglas-ab-testing-toolkit';

/**
 * Ticket
 * https://douglas-group.atlassian.net/browse/UX-${ticket}
 */

(async () => {
  const PREFIX = 'ux${ticket}__';

  asyncSave(async () => {

    share('ux${ticket}', () => {});
  
    addTask(
      PREFIX,
      () => { console.log(">>> UX-${ticket} observer init function executed"); },
      () => {
        console.log(">>> UX-${ticket} targeting condition executed");
        return getPage() === 'pdp';
      },
      () => { console.log(">>> UX-${ticket} remove function executed"); },
    );
  
  }, PREFIX)();

})();
`
      : '';

    const contentCSS = `$prefix: '.ux${ticket}__';

// #{$prefix} {
// }

// @media screen and (max-width: 400px) {
// }

// @media screen and (min-width: 768px) {
// }

// @media screen and (max-width: 1024px) {
// }
`;

    if (isNewControl) {
      fs.writeFileSync(path.join(srcDir, 'control.js'), constructVariationContent(0), 'utf8');
    }

    for (let i = 1; i <= variations; i++) {
      fs.writeFileSync(path.join(srcDir, `variation-0${i}.js`), constructVariationContent(i), 'utf8');
      fs.writeFileSync(path.join(srcDir, `variation-0${i}.scss`), contentCSS, 'utf8');
    }

    if (global) {
      fs.writeFileSync(path.join(srcDir, 'global.js'), contentGlobal, 'utf8');
      fs.writeFileSync(path.join(srcDir, 'global.scss'), contentCSS, 'utf8');
    }


    return {
      ...data,
      destinationDir
    } as CreateCommandInput & { destinationDir: string };
  } catch (err: any) {
    // Propagate error for handling in CreateStatus
    throw new Error(`Failed to create project directory: ${err.message}`);
  }
}

export default create;