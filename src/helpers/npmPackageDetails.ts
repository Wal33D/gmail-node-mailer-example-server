// Define interfaces for the structure of the metadata and download data from npm
interface Metadata {
    'dist-tags': { latest: string };
    versions: { [key: string]: any };
    time: { created: string; [key: string]: string };
    readme?: string;
}

interface DownloadData {
    downloads: { day: string; downloads: number }[];
}

// Function to fetch data from a URL
const fetchData = async (url: string): Promise<any> => {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch(url);
    const data: any = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
};

// Function to fetch package details from npm
export const fetchPackageDetails = async (packageName: string): Promise<any> => {
    const metadataUrl = `https://registry.npmjs.org/${packageName}`;
    const metadata: Metadata = await fetchData(metadataUrl);

    const startDate = new Date(metadata.time.created).toISOString().slice(0, 10);
    const endDate = new Date().toISOString().slice(0, 10);
    const downloadsUrl = `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${packageName}`;
    const downloadData: DownloadData = await fetchData(downloadsUrl);

    return formatResponse(packageName, metadata, downloadData);
};

// Function to format the response with package details
const formatResponse = (packageName: string, metadata: Metadata, downloadData: DownloadData) => {
    const latestVersion = metadata['dist-tags'].latest;
    const versionData = metadata.versions[latestVersion];
    const totalDownloads = downloadData.downloads.reduce((sum, day) => sum + day.downloads, 0);

    return {
        packageName,
        totalDownloads,
        firstPublishDate: new Date(metadata.time.created).toISOString().slice(0, 10),
        latestVersion,
        lastUpdated: new Date(metadata.time[latestVersion]).toISOString().slice(0, 10),
        license: versionData.license || 'No license specified',
        repositoryUrl: versionData.repository?.url || 'No repository URL',
        authorName: versionData.author?.name || 'No author specified',
        description: versionData.description || 'No description available',
        keywords: versionData.keywords || [],
        npmUrl: `https://www.npmjs.com/package/${packageName}`,
        readme: metadata.readme || 'No README available'
    };
};

