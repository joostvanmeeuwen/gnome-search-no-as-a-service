import St from 'gi://St';
import Soup from 'gi://Soup';
import GLib from 'gi://GLib';

export class NaasSearchProvider {
    constructor(extension) {
        this._extension = extension;
    }

    /**
     * The application of the provider.
     * Extensions usually return null.
     */
    get appInfo() {
        return null;
    }

    /**
     * Whether the provider offers detailed results.
     * Extensions usually return false.
     */
    get canLaunchSearch() {
        return false;
    }

    /**
     * The unique ID of the provider.
     * Extensions return their UUID.
     */
    get id() {
        return this._extension.uuid;
    }

    /**
     * Launch the search result.
     * Called when a search provider result is activated.
     */
    activateResult(result, terms) {
        console.log(`NaaS Search Provider: activateResult(${result}, [${terms}])`);
    }

    /**
     * Launch the search provider.
     * Called when a search provider is activated.
     */
    launchSearch(terms) {
        console.log(`NaaS Search Provider: launchSearch([${terms}])`);
    }

    /**
     * Create a result object.
     * Return null for default implementation.
     */
    createResultObject(meta) {
        console.log(`NaaS Search Provider: createResultObject(${meta.id})`);
        return null;
    }

    /**
     * Get result metadata.
     * Returns a ResultMeta object for each identifier.
     */
    async getResultMetas(results, cancellable) {
        console.log(`NaaS Search Provider: getResultMetas([${results}])`);

        const {scaleFactor} = St.ThemeContext.get_for_stage(global.stage);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(
                () => reject(Error('Operation Cancelled')));

            const session = new Soup.Session();
            const message = Soup.Message.new('GET', 'https://naas.isalman.dev/no');

            session.send_and_read_async(message, GLib.PRIORITY_DEFAULT, cancellable, (_session, result) => {
                try {
                    const bytes = session.send_and_read_finish(result);
                    const decoder = new TextDecoder('utf-8');
                    const text = decoder.decode(bytes.get_data());
                    const data = JSON.parse(text);

                    console.log('NaaS API response:', data.reason);

                    const resultMetas = [];

                    for (const identifier of results) {
                        const meta = {
                            id: identifier,
                            name: data.reason,
                            description: 'No-as-a-Service',
                            clipboardText: data.reason,
                            createIcon: size => {
                                return new St.Icon({
                                    icon_name: 'dialog-information',
                                    width: size * scaleFactor,
                                    height: size * scaleFactor,
                                });
                            },
                        };

                        resultMetas.push(meta);
                    }

                    cancellable.disconnect(cancelledId);
                    if (!cancellable.is_cancelled()) {
                        resolve(resultMetas);
                    }
                } catch (error) {
                    console.error('NaaS API error:', error);
                    cancellable.disconnect(cancelledId);
                    reject(error);
                }
            });
        });
    }

    /**
     * Initiate a new search.
     * Returns a list of unique identifiers for the results.
     */
    async getInitialResultSet(terms, cancellable) {
        console.log(`NaaS Search Provider: getInitialResultSet([${terms}])`);

        return new Promise((resolve, reject) => {
            const cancelledId = cancellable.connect(
                () => reject(Error('Search Cancelled')));

            const query = terms.join(' ').toLowerCase();
            const keywords = ['nee', 'no'];
            const hasMatch = keywords.some(keyword => query.includes(keyword));

            const identifiers = hasMatch ? ['excuse-1'] : [];

            cancellable.disconnect(cancelledId);
            if (!cancellable.is_cancelled()) {
                resolve(identifiers);
            }
        });
    }

    /**
     * Refine the current search.
     * Returns a subset of the original result set.
     */
    async getSubsearchResultSet(results, terms, cancellable) {
        console.log(`NaaS Search Provider: getSubsearchResultSet([${results}], [${terms}])`);

        if (cancellable.is_cancelled()) {
            throw Error('Search Cancelled');
        }

        return this.getInitialResultSet(terms, cancellable);
    }

    /**
     * Filter the current search.
     * Truncate the number of search results.
     */
    filterResults(results, maxResults) {
        console.log(`NaaS Search Provider: filterResults([${results}], ${maxResults})`);

        if (results.length <= maxResults) {
            return results;
        }

        return results.slice(0, maxResults);
    }
}
