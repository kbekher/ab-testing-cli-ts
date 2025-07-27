// deploy.ts
import fs from 'fs';
import path from 'path';
import os from 'os';
import { CreateCommandInput } from '../types/types.js';
import { getFormattedDate, getProjectDomain } from '../utils/utils.js';

type Site = { id: number; name: string; url: string };
type Experiment = { id: number; name: string; variations: number[]; };

const BASE_URL_API = 'https://api.kameleoon.com';

const urls = {
  authToken: `${BASE_URL_API}/oauth/token`,
  siteList: `${BASE_URL_API}/sites`,
  experimentList: `${BASE_URL_API}/experiments`,
  variationsList: `${BASE_URL_API}/variations`,
  goalsList: `${BASE_URL_API}/goals`,
};

// Load credentials from file
const getKameleoonData = async () => {
  const kameleoonFile = fs.readFileSync(path.join(os.homedir(), '.kameleoon.json'), 'utf8');
  return JSON.parse(kameleoonFile);
};

// Basic fetch wrapper
const sendRequest = async <T = any>(method: string, url: string, token: string, data?: any): Promise<T> => {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': '*/*',
      'Authorization': token,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  return await response.json() as T;
};

// Authentication
const authenticate = async (client_id: string, client_secret: string) => {
  const response = await fetch(urls.authToken, {
    method: 'POST',
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id,
      client_secret,
    }),
  });
  const { access_token } = await response.json() as { access_token: string };
  return `Bearer ${access_token}`;
};

// Create variations
const createVariations = async (experiment: any, variations: number, siteId: number, isNewControl: boolean, token: string) => {
  const variationIds = [];

  if (isNewControl) {
    await sendRequest('PATCH', `${urls.variationsList}/${experiment.variations[0]}`, token, { name: 'New Control', siteId });
    const createdVariations = await Promise.all(
      Array.from({ length: variations }, (_, i) =>
        sendRequest('POST', urls.variationsList, token, { name: `Variation ${i + 1}`, siteId })
      )
    );
    variationIds.push(...createdVariations.map(v => v.id));
  } else {
    if (variations > 1) {
      const createdVariations = await Promise.all(
        Array.from({ length: variations - 1 }, (_, i) =>
          sendRequest('POST', urls.variationsList, token, { name: `Variation ${i + 2}`, siteId })
        )
      );
      variationIds.push(...createdVariations.map(v => v.id));
    }
  }

  return [experiment.variations[0], ...variationIds];
};

// Create goals
const createGoals = async (goals: string[] | false, siteId: number, token: string, ticket: string): Promise<number[]> => {
  if (!Array.isArray(goals) || goals.length === 0) {
    console.warn("No goals provided, skipping goal creation.");
    return [];
  }

  const createdGoals = await Promise.all(
    goals.map(goal =>
      sendRequest('POST', urls.goalsList, token, {
        name: `UX-${ticket}: ${goal}`,
        siteId,
        type: 'CUSTOM',
        hasMultipleConversions: true
      })
    )
  );

  return createdGoals.map(goal => goal.id);
};

// Main deploy function with status updates
export const deploy = async (
  config: CreateCommandInput & { destinationDir: string },
  onUpdate: (status: { message: string; done?: boolean }) => void
) => {
  const {
    destinationDir,
    ticket,
    name,
    country,
    isNewControl,
    variations,
    goals
  } = config;

  const projectName = `[${country.toUpperCase()} - DEV] ${getFormattedDate()} | UX-${ticket} - ${name}`;

  try {
    onUpdate({ message: 'Reading credentials...' });
    const kameleoonJSON = await getKameleoonData();

    onUpdate({ message: 'Authenticating with Kameleoon API...' });
    const token = await authenticate(kameleoonJSON.client_id, kameleoonJSON.client_secret);

    onUpdate({ message: 'Fetching project details...' });
    const sites = await sendRequest<Site[]>('GET', urls.siteList, token);
    const domain = getProjectDomain(country);
    const project = sites.find(site => site.name === domain);
    // const project = sites.find((site: any) => site.name === `www.${country === 'fr' ? 'nocibe' : 'douglas'}.${country}`);

    if (!project) throw new Error(`Project with domain not found`);
    const { id: siteId, url: baseURL } = project;

    onUpdate({ message: 'Creating experiment...' });
    const experiment = await sendRequest<Experiment>('POST', urls.experimentList, token, {
      baseURL,
      name: projectName,
      siteId,
      type: 'DEVELOPER',
    });

    onUpdate({ message: 'Creating variations...' });
    const variationIds = await createVariations(experiment, variations, siteId, isNewControl, token);

    onUpdate({ message: 'Creating goals...' });
    const goalsIds = await createGoals(goals ?? false, siteId, token, ticket);

    const deviations = Object.fromEntries(variationIds.map(id => [id, 0]));

    onUpdate({ message: 'Finalizing experiment...' });
    await sendRequest('PATCH', `${urls.experimentList}/${experiment.id}`, token, {
      deviations,
      goals: goalsIds,
    });

    const sortedVariationIds = variationIds.reduce((acc, id, index) => {
      acc[isNewControl && index === 0 ? "control" : `variation-${String(index + (isNewControl ? 0 : 1)).padStart(2, '0')}`] = id;
      return acc;
    }, {} as Record<string, number>);

    fs.writeFileSync(
      path.join(destinationDir, 'experimentData.json'),
      JSON.stringify({ experimentId: experiment.id, variationIds: sortedVariationIds }, null, 2)
    );

    onUpdate({ message: `Navigate to ${projectName} directory and start development`, done: true });

  } catch (error: any) {
    throw new Error(`Error creating experiment: ${error.message}`);
  }

  return { destinationDir };
};