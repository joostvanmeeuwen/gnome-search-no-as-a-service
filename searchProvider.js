import St from 'gi://St';
import Soup from 'gi://Soup';
import GLib from 'gi://GLib';

export class NaasSearchProvider {
    constructor(extension) {
        this._extension = extension;
        this._cache = [];
        this._maxCacheSize = 20;
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
    activateResult(_result, _terms) {
        // Result activated, excuse copied to clipboard
    }

    /**
     * Launch the search provider.
     * Called when a search provider is activated.
     */
    launchSearch(_terms) {
        // Not implemented - no separate app to launch
    }

    /**
     * Get result metadata.
     * Returns a ResultMeta object for each identifier.
     */
    async getResultMetas(results, cancellable) {
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

                    const excuse = data.reason;
                    this._addToCache(excuse);

                    const resultMetas = this._createResultMeta(results, excuse, scaleFactor);

                    cancellable.disconnect(cancelledId);
                    if (!cancellable.is_cancelled()) {
                        resolve(resultMetas);
                    }
                } catch (error) {
                    console.error('NaaS API error:', error);
                    cancellable.disconnect(cancelledId);

                    if (this._cache.length > 0) {
                        const randomExcuse = this._cache[Math.floor(Math.random() * this._cache.length)];
                        const resultMetas = this._createResultMeta(results, randomExcuse, scaleFactor);
                        resolve(resultMetas);
                    } else {
                        reject(error);
                    }
                }
            });
        });
    }

    _createResultMeta(results, excuse, scaleFactor) {
        const resultMetas = [];

        for (const identifier of results) {
            const meta = {
                id: identifier,
                name: excuse,
                description: 'Click or press Enter to copy full excuse',
                clipboardText: excuse,
                createIcon: size => {
                    return new St.Icon({
                        icon_name: 'action-unavailable-symbolic',
                        width: size * scaleFactor,
                        height: size * scaleFactor,
                    });
                },
            };

            resultMetas.push(meta);
        }

        return resultMetas;
    }

    _addToCache(excuse) {
        if (!this._cache.includes(excuse)) {
            this._cache.push(excuse);

            if (this._cache.length > this._maxCacheSize) {
                this._cache.shift();
            }
        }
    }

    /**
     * Initiate a new search.
     * Returns a list of unique identifiers for the results.
     */
    async getInitialResultSet(terms, cancellable) {
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
        if (results.length <= maxResults) {
            return results;
        }

        return results.slice(0, maxResults);
    }
}
